require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');
const { router: stripeRoutes, handleWebhook } = require('./routes/stripe');
const { ensureDataFiles } = require('./models/store');
const app = express();
const PORT = process.env.PORT || 3000;

// Trust Render's proxy so secure cookies work
app.set('trust proxy', 1);

// ─── Stripe Webhook (MUST be before express.json) ───
// Stripe needs the raw body to verify webhook signatures
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// ─── Middleware ───
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET || 'bos-esports-dev-secret-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  }
}));

// Make user available to all views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// ─── Routes ───
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);
app.use('/api/stripe', stripeRoutes);

// Page routes
app.get('/', (req, res) => {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/dashboard', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/play/:game', requireAuth, (req, res) => {
  const game = req.params.game;
  const allowed = ['strobe', 'flickshot', 'split-focus', 'clutch-timer'];
  if (!allowed.includes(game)) return res.redirect('/dashboard');
  res.sendFile(path.join(__dirname, 'public', `${game}.html`));
});

app.get('/leaderboard', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'leaderboard.html'));
});

// ─── Auth Middleware ───
function requireAuth(req, res, next) {
  if (!req.session.user) return res.redirect('/');
  next();
}

// ─── Init & Start ───
ensureDataFiles();
app.listen(PORT, () => {
  console.log(`🎮 BOS Esports running on port ${PORT}`);
});
