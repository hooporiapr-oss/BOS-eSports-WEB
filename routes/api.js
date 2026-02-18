const express = require('express');
const { addScore, getLeaderboard, getGlobalLeaderboard, getUserRank, getUserScores, getUserStats } = require('../models/store');
const router = express.Router();

// Auth check middleware
function auth(req, res, next) {
  if (!req.session.user) return res.status(401).json({ error: 'Not logged in' });
  next();
}

// ─── Submit Score ───
router.post('/scores', auth, (req, res) => {
  try {
    const { game, tier, score, accuracy, bestStreak, avgReaction, hits, misses, inputMode, grade } = req.body;

    if (!game || score === undefined) {
      return res.status(400).json({ error: 'Game and score required' });
    }

    const entry = addScore({
      userId: req.session.user.id,
      username: req.session.user.username,
      game,
      tier: tier || 1,
      score: parseInt(score) || 0,
      accuracy: parseInt(accuracy) || 0,
      bestStreak: parseInt(bestStreak) || 0,
      avgReaction: parseInt(avgReaction) || 0,
      hits: parseInt(hits) || 0,
      misses: parseInt(misses) || 0,
      inputMode: inputMode || 'mouse',
      grade: grade || 'C',
    });

    res.json({ success: true, entry });
  } catch (err) {
    console.error('Score submit error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── Leaderboard ───
router.get('/leaderboard', auth, (req, res) => {
  const { game, tier, limit, time } = req.query;
  const gameFilter = game || 'all';
  const timeFilter = time || 'all';

  let data;
  if (gameFilter === 'all') {
    data = getGlobalLeaderboard(parseInt(limit) || 50, timeFilter);
  } else {
    data = getLeaderboard(gameFilter, tier ? parseInt(tier) : null, parseInt(limit) || 50, timeFilter);
  }

  const rank = getUserRank(req.session.user.id, gameFilter, timeFilter);

  res.json({ leaderboard: data, yourRank: rank, userId: req.session.user.id });
});

// ─── My Scores ───
router.get('/my-scores', auth, (req, res) => {
  const { game, limit } = req.query;
  const scores = getUserScores(req.session.user.id, game || null, parseInt(limit) || 50);
  res.json({ scores });
});

// ─── My Stats ───
router.get('/my-stats', auth, (req, res) => {
  const stats = getUserStats(req.session.user.id);
  res.json({ stats });
});

// ─── Dashboard Data (combined) ───
router.get('/dashboard', auth, (req, res) => {
  const stats = getUserStats(req.session.user.id);
  const topScores = getGlobalLeaderboard(10, 'all');
  res.json({
    user: req.session.user,
    stats,
    topScores,
  });
});

module.exports = router;