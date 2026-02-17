const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const SCORES_FILE = path.join(DATA_DIR, 'scores.json');

function ensureDataFiles() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, '[]');
  if (!fs.existsSync(SCORES_FILE)) fs.writeFileSync(SCORES_FILE, '[]');
}

function readJSON(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return [];
  }
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// ─── Users ───
function getUsers() { return readJSON(USERS_FILE); }

function getUserByEmail(email) {
  return getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
}

function getUserById(id) {
  return getUsers().find(u => u.id === id);
}

function createUser({ email, username, passwordHash }) {
  const users = getUsers();
  const user = {
    id: 'u_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
    email: email.toLowerCase(),
    username,
    passwordHash,
    createdAt: new Date().toISOString(),
    plan: 'free', // free | pro | team
    totalSessions: 0,
    bestScore: 0,
  };
  users.push(user);
  writeJSON(USERS_FILE, users);
  return user;
}

function updateUser(id, updates) {
  const users = getUsers();
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) return null;
  users[idx] = { ...users[idx], ...updates };
  writeJSON(USERS_FILE, users);
  return users[idx];
}

// ─── Scores ───
function getScores() { return readJSON(SCORES_FILE); }

function addScore({ userId, username, game, tier, score, accuracy, bestStreak, avgReaction, hits, misses, inputMode, grade }) {
  const scores = getScores();
  const entry = {
    id: 's_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
    userId,
    username,
    game,
    tier,
    score,
    accuracy,
    bestStreak,
    avgReaction,
    hits,
    misses,
    inputMode, // mouse | controller
    grade,
    createdAt: new Date().toISOString(),
  };
  scores.push(entry);
  writeJSON(SCORES_FILE, scores);

  // Update user stats
  const user = getUserById(userId);
  if (user) {
    updateUser(userId, {
      totalSessions: (user.totalSessions || 0) + 1,
      bestScore: Math.max(user.bestScore || 0, score),
    });
  }

  return entry;
}

function getLeaderboard(game, tier, limit = 20) {
  const scores = getScores()
    .filter(s => s.game === game && (tier ? s.tier === tier : true))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
  return scores;
}

function getUserScores(userId, game, limit = 50) {
  return getScores()
    .filter(s => s.userId === userId && (game ? s.game === game : true))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit);
}

function getUserStats(userId) {
  const scores = getScores().filter(s => s.userId === userId);
  if (scores.length === 0) return { sessions: 0, bestScore: 0, avgAccuracy: 0, avgReaction: 0, bestStreak: 0 };

  return {
    sessions: scores.length,
    bestScore: Math.max(...scores.map(s => s.score)),
    avgAccuracy: Math.round(scores.reduce((a, s) => a + s.accuracy, 0) / scores.length),
    avgReaction: Math.round(scores.reduce((a, s) => a + s.avgReaction, 0) / scores.length),
    bestStreak: Math.max(...scores.map(s => s.bestStreak)),
    recentScores: scores.slice(0, 10),
  };
}

module.exports = {
  ensureDataFiles,
  getUserByEmail, getUserById, createUser, updateUser,
  addScore, getLeaderboard, getUserScores, getUserStats,
};
