/*═══════════════════════════════════════════════════════════════
  BOS COACH WIDGET — Pre-Workout Sideline Integration
  Coach BOS speaks to players BEFORE they train.
  
  Loaded by: strobe.html, flickshot.html, splitfocus.html, clutchtimer.html
  Via: <script src="/bos-coach-widget.js"></script>
  
  Phase: Pre-Workout Coaching (Phase 2, Step 1)
  Next: Real-time mid-session coaching, Post-workout analysis
  
  Architecture:
  - Detects which game is loaded from <title> or body content
  - Injects Coach BOS panel into the start/select screen
  - Delivers game-specific coaching based on selected tier
  - Talks like a real coach, not clinical AI
  - BOS Design System: Bebas Neue, Outfit, dark/gold/orange/teal
═══════════════════════════════════════════════════════════════*/

(function() {
'use strict';

/* ═══ GAME DETECTION ═══ */
const title = document.title.toLowerCase();
let GAME = 'unknown';
if (title.includes('strobe'))      GAME = 'strobe';
else if (title.includes('flick'))  GAME = 'flickshot';
else if (title.includes('split'))  GAME = 'splitfocus';
else if (title.includes('clutch')) GAME = 'clutchtimer';

if (GAME === 'unknown') return; // Not a game page, bail

/* ═══ COACH BOS PERSONALITY ═══ */
const COACH_NAME = 'COACH BOS';
const COACH_AVATAR = '🧠'; // Could be replaced with image URL later

/* ═══ GAME-SPECIFIC COACHING DATABASE ═══ */
const COACHING = {
  strobe: {
    name: 'Strobe Drill',
    domain: 'Visual Processing',
    icon: '🎯',
    color: '#00D9A5', // teal
    pregame: {
      1: { // Bronze
        headline: "LET'S BUILD YOUR FOUNDATION",
        tips: [
          "No strobe yet — pure target acquisition. Get your rhythm.",
          "Don't chase the cursor. Let your eyes FIND the target, then click.",
          "Accuracy over speed at this level. Build clean habits first."
        ],
        mental: "Breathe. Relax your shoulders. Your eyes are your weapon — keep them soft and scanning."
      },
      2: { // Silver
        headline: "STROBE KICKS IN — STAY DISCIPLINED",
        tips: [
          "Strobe will black out your vision briefly. Don't panic.",
          "Track target positions BEFORE the blackout hits.",
          "Two targets now. Prioritize the closest one first."
        ],
        mental: "The strobe is training your visual memory. Trust your brain — it remembers where targets were."
      },
      3: { // Gold
        headline: "DECOYS ARE LIVE — READ THE FIELD",
        tips: [
          "Red dashed targets are DECOYS. Hit one and you lose 50 points.",
          "Take a split second to confirm before firing. That pause saves you.",
          "Strobe is faster now. Use peripheral vision to pre-track targets."
        ],
        mental: "Gold is where champions separate from grinders. Patience under pressure."
      },
      4: { // Diamond
        headline: "ELITE COGNITIVE LOAD — LOCK IN",
        tips: [
          "Strobe at 120Hz with 450ms blackouts. Your brain must predict.",
          "Three targets max on screen. Scan in patterns, not randomly.",
          "Bonus targets appear briefly — high risk, high reward."
        ],
        mental: "This is neurocognitive training at its peak. Every rep is building new neural pathways."
      },
      5: { // Radiant
        headline: "RADIANT TIER — PROVE IT",
        tips: [
          "150Hz strobe. 550ms darkness. This is the ultimate visual challenge.",
          "Trust your instincts. At this speed, hesitation is the enemy.",
          "Your accuracy needs to stay above 85% for S-rank. Every click counts."
        ],
        mental: "You've trained for this. The strobe can't break what you've built. Show it who's boss."
      }
    }
  },

  flickshot: {
    name: 'FlickShot',
    domain: 'Precision Aiming',
    icon: '🎯',
    color: '#00CED1', // cyan
    pregame: {
      1: {
        headline: "LEARN YOUR FLICK",
        tips: [
          "One target at a time. Flick to it, fire, repeat.",
          "The golden line shows your flick path. Longer flicks = bonus points.",
          "2.5 seconds per target. Don't rush — find your natural aim speed."
        ],
        mental: "This isn't about being the fastest yet. It's about building muscle memory for clean flicks."
      },
      2: {
        headline: "TARGETS ARE SHRINKING — ADJUST",
        tips: [
          "Targets shrink over time. Hit them early for full size.",
          "The flick distance bonus rewards aggressive cursor positioning.",
          "Watch for the origin marker — it shows where your last click was."
        ],
        mental: "Shrinking targets test your confidence. Commit to your flick — don't second-guess."
      },
      3: {
        headline: "MOVING TARGETS — READ THE MOVEMENT",
        tips: [
          "Purple targets MOVE. Lead your aim slightly ahead of their path.",
          "Gold precision targets are small but worth 250 base points.",
          "Mix of static and moving — adapt your strategy per target."
        ],
        mental: "Moving targets train prediction. Your brain is learning to aim where the target WILL be."
      },
      4: {
        headline: "DIAMOND MIX — EVERYTHING AT ONCE",
        tips: [
          "Shrinking + Moving + Precision all in the same round.",
          "1.7 seconds per target. Your reaction time needs to be under 600ms.",
          "Streak bonus kicks in at 3x. Maintain consistency for score multipliers."
        ],
        mental: "This is where your hours of training compound. Trust the process."
      },
      5: {
        headline: "RADIANT FLICKSHOT — CHAOS PRECISION",
        tips: [
          "900ms spawn rate. Targets appear nearly on top of each other.",
          "44px targets — smallest in the game. Every pixel matters.",
          "S-rank needs 3500+ score with 85% accuracy. That's elite."
        ],
        mental: "Radiant FlickShot is for the top 1%. If you're here, you've already proven something. Now dominate."
      }
    }
  },

  splitfocus: {
    name: 'Split Focus',
    domain: 'Cognitive Control',
    icon: '👁',
    color: '#00D9A5', // teal
    pregame: {
      1: {
        headline: "TRACK THE RIGHT COLOR",
        tips: [
          "Teal orbs are targets. Red dashed orbs are decoys. Simple.",
          "Two targets, one decoy. Don't click the red — it costs 75 points.",
          "Orbs move slowly. Track them with your eyes before clicking."
        ],
        mental: "Split Focus is about IGNORING what doesn't matter. Train your filter."
      },
      2: {
        headline: "MORE DECOYS — STRENGTHEN YOUR FILTER",
        tips: [
          "Two decoys now. The field is getting crowded.",
          "Decoys look tempting. Train yourself to see the dashed border first.",
          "Speed bonus: hit targets under 500ms for +60 points."
        ],
        mental: "Your brain wants to click everything. The discipline to NOT click is the real skill."
      },
      3: {
        headline: "RULE SWITCHES ARE LIVE",
        tips: [
          "Mid-round, the target color SWITCHES. Watch the banner!",
          "Teal becomes Cyan or vice versa. Your brain must adapt instantly.",
          "After a switch, pause for half a second to recalibrate. It's worth it."
        ],
        mental: "Rule switches train cognitive flexibility — the ability to adapt on the fly. This is CLUTCH in competition."
      },
      4: {
        headline: "DIAMOND — MAXIMUM DIVIDED ATTENTION",
        tips: [
          "3 targets, 3 decoys. Six orbs moving simultaneously.",
          "Switches every 10 seconds. Your brain gets no rest.",
          "Wrong-color targets STAY on the field. Don't hit them twice."
        ],
        mental: "This is the cognitive equivalent of guarding two players at once. Eyes everywhere."
      },
      5: {
        headline: "RADIANT — THREE TARGET COLORS",
        tips: [
          "Teal, Cyan, AND Gold are all possible target colors.",
          "Switches every 7 seconds. Three colors means more confusion.",
          "4 targets + 4 decoys = 8 orbs. Pure cognitive chaos."
        ],
        mental: "Radiant Split Focus separates gamers from competitors. Your brain is the controller."
      }
    }
  },

  clutchtimer: {
    name: 'Clutch Timer',
    domain: 'Decision Making',
    icon: '⏱',
    color: '#FFD700', // gold
    pregame: {
      bronze: {
        headline: "LEARN THE DECISION SYSTEM",
        tips: [
          "Two zones. One rule. Match the color to the zone.",
          "3-second decision window. Plenty of time to think.",
          "25 prompts per round. Build accuracy before chasing speed."
        ],
        mental: "Clutch Timer tests your decision-making under time pressure. Start calm, finish fast."
      },
      silver: {
        headline: "THIRD ZONE — WIDER DECISION FIELD",
        tips: [
          "Three zones now. Symbols OR colors — read the rule badge.",
          "2.5-second window. Your processing speed needs to level up.",
          "Wrong answers cost -150. Timeouts only -50. When in doubt, let it expire."
        ],
        mental: "In competition, a bad decision is worse than no decision. Be smart."
      },
      gold: {
        headline: "FULL ARENA + RULE SWITCHES",
        tips: [
          "All four zones active. TWO rules stacking simultaneously.",
          "Rules change every 8 prompts. Watch the rules bar!",
          "Follow Arrow vs Opposite Arrow — know which is active."
        ],
        mental: "Gold Clutch is where game IQ shows. Reading and adapting in real-time is everything."
      },
      diamond: {
        headline: "PRIORITY CHAINS — FIND THE BEST ANSWER",
        tips: [
          "Multiple zones might be 'valid' — but only one is OPTIMAL.",
          "Star ratings on zones show priority. Highest or Lowest depends on the rule.",
          "1.5-second window. No time for deliberation — train until it's automatic."
        ],
        mental: "Diamond forces you to find the BEST play, not just a good one. That's championship mentality."
      },
      radiant: {
        headline: "CONFLICTING RULES — COGNITIVE OVERLOAD",
        tips: [
          "THREE rules active. Some may CONFLICT with each other.",
          "⚠ CONFLICT badge means rules are contradictory. Last rule takes priority.",
          "1.2-second window that SHRINKS to 0.54s by prompt 25."
        ],
        mental: "This is the hardest decision-making challenge in BOS. If you can perform here, you can perform anywhere."
      }
    }
  }
};

/* ═══ INJECT STYLES ═══ */
const style = document.createElement('style');
style.textContent = `
  /* ═══ COACH BOS PRE-WORKOUT PANEL ═══ */
  .bos-coach-panel {
    max-width: 480px;
    width: 100%;
    margin: 0 auto 1.2rem;
    background: rgba(17, 17, 24, 0.95);
    border: 1px solid rgba(255, 215, 0, 0.15);
    border-radius: 16px;
    padding: 16px 18px;
    text-align: left;
    position: relative;
    overflow: hidden;
    animation: coachSlideIn 0.5s ease-out;
  }

  .bos-coach-panel::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, #FFD700, #FF6B35, #FFD700);
    opacity: 0.6;
  }

  @keyframes coachSlideIn {
    0% { opacity: 0; transform: translateY(12px); }
    100% { opacity: 1; transform: translateY(0); }
  }

  .bos-coach-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
  }

  .bos-coach-avatar {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: linear-gradient(135deg, #FFD700, #FF6B35);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
    flex-shrink: 0;
    box-shadow: 0 2px 10px rgba(255, 215, 0, 0.2);
  }

  .bos-coach-meta {
    flex: 1;
  }

  .bos-coach-name {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 0.8rem;
    letter-spacing: 2px;
    color: #FFD700;
    line-height: 1;
  }

  .bos-coach-role {
    font-size: 0.55rem;
    color: #8892a0;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    margin-top: 2px;
  }

  .bos-coach-domain-tag {
    font-size: 0.5rem;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    padding: 3px 8px;
    border-radius: 20px;
    flex-shrink: 0;
  }

  .bos-coach-headline {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.1rem;
    letter-spacing: 1.5px;
    color: #FFFFFF;
    margin-bottom: 8px;
    line-height: 1.1;
  }

  .bos-coach-tips {
    list-style: none;
    padding: 0;
    margin: 0 0 10px;
  }

  .bos-coach-tips li {
    font-size: 0.7rem;
    color: #c0c8d4;
    line-height: 1.5;
    padding: 4px 0 4px 18px;
    position: relative;
  }

  .bos-coach-tips li::before {
    content: '▸';
    position: absolute;
    left: 0;
    color: #FFD700;
    font-size: 0.65rem;
  }

  .bos-coach-mental {
    font-size: 0.7rem;
    color: #8892a0;
    font-style: italic;
    line-height: 1.5;
    padding: 8px 12px;
    border-left: 2px solid rgba(255, 215, 0, 0.3);
    margin-top: 6px;
    background: rgba(255, 215, 0, 0.03);
    border-radius: 0 8px 8px 0;
  }

  .bos-coach-mental::before {
    content: '💭 ';
  }

  .bos-coach-dismiss {
    position: absolute;
    top: 10px;
    right: 12px;
    background: none;
    border: none;
    color: #8892a0;
    font-size: 0.9rem;
    cursor: pointer;
    padding: 4px;
    line-height: 1;
    transition: color 0.2s;
  }

  .bos-coach-dismiss:hover {
    color: #FFD700;
  }

  .bos-coach-panel.collapsed {
    padding: 10px 18px;
    cursor: pointer;
    transition: all 0.3s;
  }

  .bos-coach-panel.collapsed:hover {
    border-color: rgba(255, 215, 0, 0.3);
  }

  .bos-coach-panel.collapsed .bos-coach-body {
    display: none;
  }

  .bos-coach-expand-hint {
    display: none;
    font-size: 0.55rem;
    color: #8892a0;
    letter-spacing: 0.5px;
  }

  .bos-coach-panel.collapsed .bos-coach-expand-hint {
    display: inline;
  }

  .bos-coach-panel.collapsed .bos-coach-dismiss {
    display: none;
  }

  /* ═══ MOBILE TWEAKS ═══ */
  @media (max-width: 600px) {
    .bos-coach-panel {
      margin: 0 auto 0.8rem;
      padding: 12px 14px;
      border-radius: 12px;
      max-width: 100%;
    }
    .bos-coach-headline { font-size: 0.95rem; }
    .bos-coach-tips li { font-size: 0.65rem; }
    .bos-coach-mental { font-size: 0.65rem; padding: 6px 10px; }
  }

  /* ═══ CLUTCH TIMER SPECIFIC ═══ */
  .clutch-coach-panel {
    margin-bottom: 12px;
  }
`;
document.head.appendChild(style);


/* ═══ BUILD COACH PANEL HTML ═══ */
function buildCoachPanel(gameData, tierKey) {
  const pregame = gameData.pregame[tierKey];
  if (!pregame) return null;

  const domainColor = gameData.color;

  const panel = document.createElement('div');
  panel.className = 'bos-coach-panel';
  panel.id = 'bosCoachPanel';

  const tipsHTML = pregame.tips.map(t => `<li>${t}</li>`).join('');

  panel.innerHTML = `
    <button class="bos-coach-dismiss" onclick="this.parentElement.classList.add('collapsed')" title="Minimize">✕</button>
    <div class="bos-coach-header">
      <div class="bos-coach-avatar">${COACH_AVATAR}</div>
      <div class="bos-coach-meta">
        <div class="bos-coach-name">${COACH_NAME}</div>
        <div class="bos-coach-role">Pre-Workout Coaching</div>
        <span class="bos-coach-expand-hint">tap to expand</span>
      </div>
      <div class="bos-coach-domain-tag" style="background: ${domainColor}15; border: 1px solid ${domainColor}40; color: ${domainColor}">
        ${gameData.icon} ${gameData.domain}
      </div>
    </div>
    <div class="bos-coach-body">
      <div class="bos-coach-headline">${pregame.headline}</div>
      <ul class="bos-coach-tips">${tipsHTML}</ul>
      <div class="bos-coach-mental">${pregame.mental}</div>
    </div>
  `;

  // Re-expand on click when collapsed
  panel.addEventListener('click', function(e) {
    if (panel.classList.contains('collapsed') && !e.target.classList.contains('bos-coach-dismiss')) {
      panel.classList.remove('collapsed');
    }
  });

  return panel;
}


/* ═══ INJECT INTO GAME START SCREENS ═══ */
function injectCoaching() {
  const gameData = COACHING[GAME];
  if (!gameData) return;

  if (GAME === 'clutchtimer') {
    injectClutchTimerCoaching(gameData);
  } else {
    injectStandardCoaching(gameData);
  }
}

/* ═══ STANDARD GAMES: Strobe, FlickShot, Split Focus ═══ */
function injectStandardCoaching(gameData) {
  const startScreen = document.getElementById('startScreen');
  if (!startScreen) return;

  // Find the start button to insert before it
  const startBtn = document.getElementById('startBtn');
  if (!startBtn) return;

  let currentPanel = null;

  function updatePanel() {
    // Get selected tier from active tier button
    const activeTier = document.querySelector('.tier-btn.active');
    if (!activeTier) return;
    const tierKey = parseInt(activeTier.dataset.tier) || 1;

    // Remove old panel
    if (currentPanel && currentPanel.parentNode) {
      currentPanel.remove();
    }

    // Build new panel
    currentPanel = buildCoachPanel(gameData, tierKey);
    if (currentPanel) {
      startBtn.parentNode.insertBefore(currentPanel, startBtn);
    }
  }

  // Initial render
  updatePanel();

  // Update when tier changes
  const tierSelect = document.getElementById('tierSelect');
  if (tierSelect) {
    tierSelect.addEventListener('click', function(e) {
      if (e.target.closest('.tier-btn')) {
        // Small delay to let the active class update
        setTimeout(updatePanel, 50);
      }
    });
  }
}

/* ═══ CLUTCH TIMER: Different structure (tier cards, not buttons) ═══ */
function injectClutchTimerCoaching(gameData) {
  // Clutch Timer uses a tier card selection → game screen flow
  // We inject the panel into the game screen, above the GO button
  
  const actionBtn = document.getElementById('actionBtn');
  const feedbackText = document.getElementById('feedbackText');
  if (!actionBtn) return;

  let currentPanel = null;

  // Override selectTier to inject coaching
  const originalSelectTier = window.selectTier;
  if (originalSelectTier) {
    window.selectTier = function(tier) {
      originalSelectTier(tier);

      // Remove old panel
      if (currentPanel && currentPanel.parentNode) {
        currentPanel.remove();
      }

      // Build coaching panel for this tier
      currentPanel = buildCoachPanel(gameData, tier);
      if (currentPanel) {
        currentPanel.classList.add('clutch-coach-panel');
        // Insert before the action button
        const feedbackBar = feedbackText ? feedbackText.parentElement : null;
        if (feedbackBar) {
          feedbackBar.parentNode.insertBefore(currentPanel, feedbackBar);
        } else {
          actionBtn.parentNode.insertBefore(currentPanel, actionBtn);
        }
      }
    };
  }
}


/* ═══ INITIALIZE ═══ */
// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectCoaching);
} else {
  // Small delay to ensure game scripts have initialized
  setTimeout(injectCoaching, 100);
}

/* ═══ EXPOSE API FOR FUTURE PHASES ═══ */
window.BOSCoach = {
  game: GAME,
  version: '2.0.0',
  phase: 'pre-workout',
  
  // Phase 2: Real-time mid-session (future)
  onSessionStart: function(tierData) {
    console.log('[Coach BOS] Session started:', GAME, tierData);
  },
  
  // Phase 3: Post-workout analysis (future)
  onSessionEnd: function(results) {
    console.log('[Coach BOS] Session ended:', GAME, results);
  },
  
  // Get coaching for a specific game + tier
  getCoaching: function(game, tier) {
    const g = COACHING[game];
    if (!g) return null;
    return g.pregame[tier] || null;
  }
};

console.log(`[Coach BOS] Pre-workout coaching loaded for ${GAME}`);

})();
