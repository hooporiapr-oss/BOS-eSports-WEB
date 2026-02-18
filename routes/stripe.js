const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { getUserById, getUserByEmail, createUser, updateUser } = require('../models/store');

// ─── Price IDs from Render env vars ───
const PRICE_IDS = {
  player: process.env.STRIPE_PLAYER_PRICE_ID,
  pro: process.env.STRIPE_PRO_PRICE_ID,
  team: process.env.STRIPE_TEAM_PRICE_ID,
};

// ─── POST /api/stripe/checkout ───
// NO AUTH REQUIRED — Stripe-first flow
// Creates a Stripe Checkout Session with 7-day trial
// Stripe collects email + payment method
router.post('/checkout', async (req, res) => {
  try {
    const { tier } = req.body;
    if (!tier || !PRICE_IDS[tier]) {
      return res.status(400).json({ error: 'Invalid tier. Must be: player, pro, or team' });
    }

    // If user is already logged in and already subscribed, block
    if (req.session && req.session.user) {
      const user = getUserById(req.session.user.id);
      if (user && user.subscriptionStatus === 'active') {
        return res.status(400).json({ error: 'Already subscribed. Use your dashboard to manage your plan.' });
      }
    }

    const sessionConfig = {
      mode: 'subscription',
      line_items: [{ price: PRICE_IDS[tier], quantity: 1 }],
      subscription_data: {
        trial_period_days: 7,
        metadata: { tier: tier },
      },
      success_url: `${process.env.APP_URL || 'https://bosesports.com'}/welcome?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_URL || 'https://bosesports.com'}/pricing.html`,
      metadata: { tier: tier },
    };

    // If user is logged in, attach their Stripe customer ID or pre-fill email
    if (req.session && req.session.user) {
      const user = getUserById(req.session.user.id);
      if (user) {
        if (user.stripeCustomerId) {
          sessionConfig.customer = user.stripeCustomerId;
        } else {
          sessionConfig.customer_email = user.email;
        }
        sessionConfig.metadata.userId = user.id;
        sessionConfig.subscription_data.metadata.userId = user.id;
      }
    }

    const checkoutSession = await stripe.checkout.sessions.create(sessionConfig);
    res.json({ url: checkoutSession.url });

  } catch (err) {
    console.error('Stripe checkout error:', err.message);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// ─── GET /api/stripe/welcome-data ───
// Called by welcome page to get user info from Stripe checkout session
router.get('/welcome-data', async (req, res) => {
  try {
    const { session_id } = req.query;
    if (!session_id) return res.status(400).json({ error: 'Missing session_id' });

    const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);
    if (!checkoutSession) return res.status(404).json({ error: 'Session not found' });

    const email = checkoutSession.customer_details?.email || '';
    const tier = checkoutSession.metadata?.tier || 'player';
    const userId = checkoutSession.metadata?.userId || null;

    // Check if this email already has an account
    const existingUser = getUserByEmail(email);

    res.json({
      email,
      tier,
      existingUser: existingUser ? true : false,
      userId: userId || (existingUser ? existingUser.id : null),
    });

  } catch (err) {
    console.error('Welcome data error:', err.message);
    res.status(500).json({ error: 'Failed to retrieve session' });
  }
});

// ─── POST /api/stripe/setup-account ───
// Called by welcome page to create or update the user account
router.post('/setup-account', async (req, res) => {
  try {
    const { session_id, username, password } = req.body;
    if (!session_id) return res.status(400).json({ error: 'Missing session_id' });
    if (!username || username.length < 3 || username.length > 20) {
      return res.status(400).json({ error: 'Username must be 3-20 characters' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Retrieve the Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);
    if (!checkoutSession) return res.status(404).json({ error: 'Session not found' });

    const email = checkoutSession.customer_details?.email;
    const tier = checkoutSession.metadata?.tier || 'player';
    const customerId = checkoutSession.customer;
    const subscriptionId = checkoutSession.subscription;

    if (!email) return res.status(400).json({ error: 'No email found in checkout session' });

    const passwordHash = await bcrypt.hash(password, 10);
    let user = getUserByEmail(email);

    if (user) {
      // Existing user — update with Stripe data + new credentials
      updateUser(user.id, {
        username,
        passwordHash,
        plan: tier,
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        subscriptionStatus: 'trialing',
      });
      user = getUserById(user.id);
    } else {
      // New user — create account
      user = createUser({ email, username, passwordHash });
      updateUser(user.id, {
        plan: tier,
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        subscriptionStatus: 'trialing',
      });
      user = getUserById(user.id);
    }

    // Update Stripe customer + subscription metadata with our userId
    try {
      await stripe.customers.update(customerId, {
        metadata: { userId: user.id, username: username },
      });
      if (subscriptionId) {
        await stripe.subscriptions.update(subscriptionId, {
          metadata: { userId: user.id, tier: tier },
        });
      }
    } catch (e) {
      console.error('Failed to update Stripe metadata:', e.message);
    }

    // Auto-login
    req.session.user = {
      id: user.id,
      email: user.email,
      username: user.username,
      plan: user.plan,
    };

    res.json({ success: true, user: req.session.user });

  } catch (err) {
    console.error('Setup account error:', err.message);
    res.status(500).json({ error: 'Failed to set up account' });
  }
});

// ─── POST /api/stripe/portal ───
// Stripe Customer Portal for managing subscription
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

// ─── GET /api/stripe/status ───
// Returns current user's subscription info
router.get('/status', (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: 'Not logged in' });

  const user = getUserById(req.session.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  res.json({
    plan: user.plan || 'free',
    subscriptionStatus: user.subscriptionStatus || null,
    trialEndsAt: user.trialEndsAt || null,
    currentPeriodEnd: user.currentPeriodEnd || null,
  });
});

// ─── POST /api/stripe/webhook ───
// Handles Stripe webhook events
async function handleWebhook(req, res) {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
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

      case 'checkout.session.completed': {
        const session = event.data.object;
        const tier = session.metadata?.tier;
        const userId = session.metadata?.userId;
        const email = session.customer_details?.email;
        const customerId = session.customer;
        const subscriptionId = session.subscription;

        // Retrieve subscription details
        let trialEndsAt = null;
        let currentPeriodEnd = null;
        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          if (subscription.trial_end) {
            trialEndsAt = new Date(subscription.trial_end * 1000).toISOString();
          }
          currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString();
        }

        // If we already have a userId (logged-in user), update them
        if (userId) {
          updateUser(userId, {
            plan: tier,
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
            subscriptionStatus: 'trialing',
            trialEndsAt,
            currentPeriodEnd,
          });
          console.log(`✅ Existing user ${userId} subscribed to ${tier}`);
        }
        // If no userId but email matches existing user, link them
        else if (email) {
          const existingUser = getUserByEmail(email);
          if (existingUser) {
            updateUser(existingUser.id, {
              plan: tier,
              stripeCustomerId: customerId,
              stripeSubscriptionId: subscriptionId,
              subscriptionStatus: 'trialing',
              trialEndsAt,
              currentPeriodEnd,
            });
            // Update Stripe metadata with userId
            try {
              await stripe.customers.update(customerId, { metadata: { userId: existingUser.id } });
              if (subscriptionId) {
                await stripe.subscriptions.update(subscriptionId, { metadata: { userId: existingUser.id, tier } });
              }
            } catch (e) { console.error('Metadata update error:', e.message); }
            console.log(`✅ Linked existing user ${existingUser.id} to ${tier} subscription`);
          } else {
            // New user — will be created when they complete the welcome page
            console.log(`📝 New subscriber ${email} for ${tier} — awaiting account setup`);
          }
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const userId = subscription.metadata?.userId;

        if (userId) {
          const updates = {
            subscriptionStatus: subscription.status,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
          };
          if (subscription.trial_end) {
            updates.trialEndsAt = new Date(subscription.trial_end * 1000).toISOString();
          }
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

      case 'customer.subscription.trial_will_end': {
        const subscription = event.data.object;
        const userId = subscription.metadata?.userId;
        if (userId) console.log(`⏰ Trial ending soon for ${userId}`);
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
