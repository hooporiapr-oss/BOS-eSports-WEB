const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { getUserById, getUserByEmail, updateUser, getUsers } = require('../models/store');

// ─── Price IDs from Render env vars ───
const PRICE_IDS = {
  player: process.env.STRIPE_PLAYER_PRICE_ID,
  pro: process.env.STRIPE_PRO_PRICE_ID,
  team: process.env.STRIPE_TEAM_PRICE_ID,
};

// ─── Helper: Get user's subscription status ───
function getSubscriptionStatus(user) {
  if (!user) return { status: 'none', tier: 'free' };

  // Check if trial is active
  if (user.trialEndsAt && new Date(user.trialEndsAt) > new Date()) {
    return { status: 'trialing', tier: user.plan || 'free' };
  }

  // Check if subscription is active
  if (user.subscriptionStatus === 'active') {
    return { status: 'active', tier: user.plan || 'free' };
  }

  // Check if subscription is past_due (give grace)
  if (user.subscriptionStatus === 'past_due') {
    return { status: 'past_due', tier: user.plan || 'free' };
  }

  return { status: 'none', tier: 'free' };
}

// ─── GET /api/stripe/status ───
// Returns current user's subscription info
router.get('/status', (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: 'Not logged in' });

  const user = getUserById(req.session.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const sub = getSubscriptionStatus(user);
  res.json({
    plan: user.plan || 'free',
    status: sub.status,
    tier: sub.tier,
    trialEndsAt: user.trialEndsAt || null,
    subscriptionStatus: user.subscriptionStatus || null,
    currentPeriodEnd: user.currentPeriodEnd || null,
  });
});

// ─── POST /api/stripe/checkout ───
// Creates a Stripe Checkout Session with 7-day trial
router.post('/checkout', async (req, res) => {
  try {
    if (!req.session.user) return res.status(401).json({ error: 'Not logged in' });

    const { tier } = req.body;
    if (!tier || !PRICE_IDS[tier]) {
      return res.status(400).json({ error: 'Invalid tier. Must be: player, pro, or team' });
    }

    const user = getUserById(req.session.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Check if user already has an active subscription
    if (user.subscriptionStatus === 'active') {
      return res.status(400).json({ error: 'Already subscribed. Use the portal to manage your plan.' });
    }

    // Create or reuse Stripe customer
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId: user.id, username: user.username },
      });
      customerId = customer.id;
      updateUser(user.id, { stripeCustomerId: customerId });
    }

    // Create Checkout Session
    const sessionConfig = {
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: PRICE_IDS[tier], quantity: 1 }],
      subscription_data: {
        trial_period_days: 7,
        metadata: { userId: user.id, tier: tier },
      },
      success_url: `${process.env.APP_URL || 'https://bosesports.com'}/dashboard?subscribed=true`,
      cancel_url: `${process.env.APP_URL || 'https://bosesports.com'}/pricing.html`,
      metadata: { userId: user.id, tier: tier },
    };

    const checkoutSession = await stripe.checkout.sessions.create(sessionConfig);
    res.json({ url: checkoutSession.url });

  } catch (err) {
    console.error('Stripe checkout error:', err.message);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// ─── POST /api/stripe/portal ───
// Creates a Stripe Customer Portal session for managing subscription
router.post('/portal', async (req, res) => {
  try {
    if (!req.session.user) return res.status(401).json({ error: 'Not logged in' });

    const user = getUserById(req.session.user.id);
    if (!user || !user.stripeCustomerId) {
      return res.status(400).json({ error: 'No subscription found' });
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.APP_URL || 'https://bosesports.com'}/dashboard`,
    });

    res.json({ url: portalSession.url });

  } catch (err) {
    console.error('Stripe portal error:', err.message);
    res.status(500).json({ error: 'Failed to open billing portal' });
  }
});

// ─── POST /api/stripe/webhook ───
// Handles Stripe webhook events (called from server.js with raw body)
async function handleWebhook(req, res) {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body, // raw body buffer
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log(`📩 Stripe webhook: ${event.type}`);

  try {
    switch (event.type) {

      // ── New subscription created (trial started) ──
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata?.userId;
        const tier = session.metadata?.tier;

        if (userId && tier) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription);
          updateUser(userId, {
            plan: tier,
            stripeCustomerId: session.customer,
            stripeSubscriptionId: session.subscription,
            subscriptionStatus: subscription.status,
            trialEndsAt: subscription.trial_end
              ? new Date(subscription.trial_end * 1000).toISOString()
              : null,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
          });
          console.log(`✅ User ${userId} subscribed to ${tier} (${subscription.status})`);
        }
        break;
      }

      // ── Subscription updated (plan change, trial ending, etc.) ──
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const userId = subscription.metadata?.userId;

        if (userId) {
          const updates = {
            subscriptionStatus: subscription.status,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
          };

          // Update trial end if present
          if (subscription.trial_end) {
            updates.trialEndsAt = new Date(subscription.trial_end * 1000).toISOString();
          }

          // Check if plan changed via price lookup
          const priceId = subscription.items?.data?.[0]?.price?.id;
          if (priceId) {
            if (priceId === PRICE_IDS.player) updates.plan = 'player';
            else if (priceId === PRICE_IDS.pro) updates.plan = 'pro';
            else if (priceId === PRICE_IDS.team) updates.plan = 'team';
          }

          updateUser(userId, updates);
          console.log(`🔄 Subscription updated for ${userId}: ${subscription.status}`);
        }
        break;
      }

      // ── Subscription cancelled/expired ──
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const userId = subscription.metadata?.userId;

        if (userId) {
          updateUser(userId, {
            plan: 'free',
            subscriptionStatus: 'canceled',
            stripeSubscriptionId: null,
            trialEndsAt: null,
            currentPeriodEnd: null,
          });
          console.log(`❌ Subscription canceled for ${userId}`);
        }
        break;
      }

      // ── Successful payment ──
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        const subscriptionId = invoice.subscription;

        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const userId = subscription.metadata?.userId;

          if (userId) {
            updateUser(userId, {
              subscriptionStatus: 'active',
              currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
            });
            console.log(`💰 Payment succeeded for ${userId}`);
          }
        }
        break;
      }

      // ── Failed payment ──
      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const subscriptionId = invoice.subscription;

        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const userId = subscription.metadata?.userId;

          if (userId) {
            updateUser(userId, { subscriptionStatus: 'past_due' });
            console.log(`⚠️ Payment failed for ${userId}`);
          }
        }
        break;
      }

      // ── Trial ending soon (3 days before) ──
      case 'customer.subscription.trial_will_end': {
        const subscription = event.data.object;
        const userId = subscription.metadata?.userId;
        if (userId) {
          console.log(`⏰ Trial ending soon for ${userId}`);
          // Future: send email notification
        }
        break;
      }

      default:
        console.log(`Unhandled event: ${event.type}`);
    }
  } catch (err) {
    console.error(`Webhook handler error for ${event.type}:`, err.message);
  }

  res.json({ received: true });
}

module.exports = { router, handleWebhook };
