/*═══════════════════════════════════════════════════════════════
  BOS COACH WIDGET v3.0
  Phase 1: Pre-Workout Coaching ✅
  Phase 2: Real-Time Mid-Session Coaching ✅
  Phase 3: Post-Workout Analysis (next)
  
  Loaded by: strobe.html, flickshot.html, splitfocus.html, clutchtimer.html
  Via: <script src="/bos-coach-widget.js"></script>
  
  Architecture:
  - Detects game from <title>
  - Phase 1: Injects coaching panel on start screen
  - Phase 2: DOM-polls HUD elements to track state changes
            → fires non-intrusive toast callouts from the sideline
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

if (GAME === 'unknown') return;

const COACH_NAME = 'COACH BOS';
const COACH_AVATAR = '🧠';


/*╔═══════════════════════════════════════════════════════════╗
  ║  PHASE 1 — PRE-WORKOUT COACHING                         ║
  ╚═══════════════════════════════════════════════════════════╝*/

const COACHING = {
  strobe: {
    name: 'Strobe Drill', domain: 'Visual Processing', icon: '🎯', color: '#00D9A5',
    pregame: {
      1:{headline:"LET'S BUILD YOUR FOUNDATION",tips:["No strobe yet — pure target acquisition. Get your rhythm.","Don't chase the cursor. Let your eyes FIND the target, then click.","Accuracy over speed at this level. Build clean habits first."],mental:"Breathe. Relax your shoulders. Your eyes are your weapon — keep them soft and scanning."},
      2:{headline:"STROBE KICKS IN — STAY DISCIPLINED",tips:["Strobe will black out your vision briefly. Don't panic.","Track target positions BEFORE the blackout hits.","Two targets now. Prioritize the closest one first."],mental:"The strobe is training your visual memory. Trust your brain — it remembers where targets were."},
      3:{headline:"DECOYS ARE LIVE — READ THE FIELD",tips:["Red dashed targets are DECOYS. Hit one and you lose 50 points.","Take a split second to confirm before firing. That pause saves you.","Strobe is faster now. Use peripheral vision to pre-track targets."],mental:"Gold is where champions separate from grinders. Patience under pressure."},
      4:{headline:"ELITE COGNITIVE LOAD — LOCK IN",tips:["Strobe at 120Hz with 450ms blackouts. Your brain must predict.","Three targets max on screen. Scan in patterns, not randomly.","Bonus targets appear briefly — high risk, high reward."],mental:"This is neurocognitive training at its peak. Every rep is building new neural pathways."},
      5:{headline:"RADIANT TIER — PROVE IT",tips:["150Hz strobe. 550ms darkness. This is the ultimate visual challenge.","Trust your instincts. At this speed, hesitation is the enemy.","Your accuracy needs to stay above 85% for S-rank. Every click counts."],mental:"You've trained for this. The strobe can't break what you've built. Show it who's boss."}
    }
  },
  flickshot: {
    name: 'FlickShot', domain: 'Precision Aiming', icon: '🎯', color: '#00CED1',
    pregame: {
      1:{headline:"LEARN YOUR FLICK",tips:["One target at a time. Flick to it, fire, repeat.","The golden line shows your flick path. Longer flicks = bonus points.","2.5 seconds per target. Don't rush — find your natural aim speed."],mental:"This isn't about being the fastest yet. It's about building muscle memory for clean flicks."},
      2:{headline:"TARGETS ARE SHRINKING — ADJUST",tips:["Targets shrink over time. Hit them early for full size.","The flick distance bonus rewards aggressive cursor positioning.","Watch for the origin marker — it shows where your last click was."],mental:"Shrinking targets test your confidence. Commit to your flick — don't second-guess."},
      3:{headline:"MOVING TARGETS — READ THE MOVEMENT",tips:["Purple targets MOVE. Lead your aim slightly ahead of their path.","Gold precision targets are small but worth 250 base points.","Mix of static and moving — adapt your strategy per target."],mental:"Moving targets train prediction. Your brain is learning to aim where the target WILL be."},
      4:{headline:"DIAMOND MIX — EVERYTHING AT ONCE",tips:["Shrinking + Moving + Precision all in the same round.","1.7 seconds per target. Your reaction time needs to be under 600ms.","Streak bonus kicks in at 3x. Maintain consistency for score multipliers."],mental:"This is where your hours of training compound. Trust the process."},
      5:{headline:"RADIANT FLICKSHOT — CHAOS PRECISION",tips:["900ms spawn rate. Targets appear nearly on top of each other.","44px targets — smallest in the game. Every pixel matters.","S-rank needs 3500+ score with 85% accuracy. That's elite."],mental:"Radiant FlickShot is for the top 1%. If you're here, you've already proven something. Now dominate."}
    }
  },
  splitfocus: {
    name: 'Split Focus', domain: 'Cognitive Control', icon: '👁', color: '#00D9A5',
    pregame: {
      1:{headline:"TRACK THE RIGHT COLOR",tips:["Teal orbs are targets. Red dashed orbs are decoys. Simple.","Two targets, one decoy. Don't click the red — it costs 75 points.","Orbs move slowly. Track them with your eyes before clicking."],mental:"Split Focus is about IGNORING what doesn't matter. Train your filter."},
      2:{headline:"MORE DECOYS — STRENGTHEN YOUR FILTER",tips:["Two decoys now. The field is getting crowded.","Decoys look tempting. Train yourself to see the dashed border first.","Speed bonus: hit targets under 500ms for +60 points."],mental:"Your brain wants to click everything. The discipline to NOT click is the real skill."},
      3:{headline:"RULE SWITCHES ARE LIVE",tips:["Mid-round, the target color SWITCHES. Watch the banner!","Teal becomes Cyan or vice versa. Your brain must adapt instantly.","After a switch, pause for half a second to recalibrate. It's worth it."],mental:"Rule switches train cognitive flexibility — the ability to adapt on the fly. This is CLUTCH in competition."},
      4:{headline:"DIAMOND — MAXIMUM DIVIDED ATTENTION",tips:["3 targets, 3 decoys. Six orbs moving simultaneously.","Switches every 10 seconds. Your brain gets no rest.","Wrong-color targets STAY on the field. Don't hit them twice."],mental:"This is the cognitive equivalent of guarding two players at once. Eyes everywhere."},
      5:{headline:"RADIANT — THREE TARGET COLORS",tips:["Teal, Cyan, AND Gold are all possible target colors.","Switches every 7 seconds. Three colors means more confusion.","4 targets + 4 decoys = 8 orbs. Pure cognitive chaos."],mental:"Radiant Split Focus separates gamers from competitors. Your brain is the controller."}
    }
  },
  clutchtimer: {
    name: 'Clutch Timer', domain: 'Decision Making', icon: '⏱', color: '#FFD700',
    pregame: {
      bronze:{headline:"LEARN THE DECISION SYSTEM",tips:["Two zones. One rule. Match the color to the zone.","3-second decision window. Plenty of time to think.","25 prompts per round. Build accuracy before chasing speed."],mental:"Clutch Timer tests your decision-making under time pressure. Start calm, finish fast."},
      silver:{headline:"THIRD ZONE — WIDER DECISION FIELD",tips:["Three zones now. Symbols OR colors — read the rule badge.","2.5-second window. Your processing speed needs to level up.","Wrong answers cost -150. Timeouts only -50. When in doubt, let it expire."],mental:"In competition, a bad decision is worse than no decision. Be smart."},
      gold:{headline:"FULL ARENA + RULE SWITCHES",tips:["All four zones active. TWO rules stacking simultaneously.","Rules change every 8 prompts. Watch the rules bar!","Follow Arrow vs Opposite Arrow — know which is active."],mental:"Gold Clutch is where game IQ shows. Reading and adapting in real-time is everything."},
      diamond:{headline:"PRIORITY CHAINS — FIND THE BEST ANSWER",tips:["Multiple zones might be 'valid' — but only one is OPTIMAL.","Star ratings on zones show priority. Highest or Lowest depends on the rule.","1.5-second window. No time for deliberation — train until it's automatic."],mental:"Diamond forces you to find the BEST play, not just a good one. That's championship mentality."},
      radiant:{headline:"CONFLICTING RULES — COGNITIVE OVERLOAD",tips:["THREE rules active. Some may CONFLICT with each other.","⚠ CONFLICT badge means rules are contradictory. Last rule takes priority.","1.2-second window that SHRINKS to 0.54s by prompt 25."],mental:"This is the hardest decision-making challenge in BOS. If you can perform here, you can perform anywhere."}
    }
  }
};

/* ═══ PHASE 1 STYLES ═══ */
const phase1Style = document.createElement('style');
phase1Style.textContent = `
  .bos-coach-panel{max-width:480px;width:100%;margin:0 auto 1.2rem;background:rgba(17,17,24,0.95);border:1px solid rgba(255,215,0,0.15);border-radius:16px;padding:16px 18px;text-align:left;position:relative;overflow:hidden;animation:coachSlideIn 0.5s ease-out}
  .bos-coach-panel::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#FFD700,#FF6B35,#FFD700);opacity:0.6}
  @keyframes coachSlideIn{0%{opacity:0;transform:translateY(12px)}100%{opacity:1;transform:translateY(0)}}
  .bos-coach-header{display:flex;align-items:center;gap:10px;margin-bottom:10px}
  .bos-coach-avatar{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#FFD700,#FF6B35);display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0;box-shadow:0 2px 10px rgba(255,215,0,0.2)}
  .bos-coach-meta{flex:1}
  .bos-coach-name{font-family:'Bebas Neue',sans-serif;font-size:0.8rem;letter-spacing:2px;color:#FFD700;line-height:1}
  .bos-coach-role{font-size:0.55rem;color:#8892a0;font-weight:600;letter-spacing:0.5px;text-transform:uppercase;margin-top:2px}
  .bos-coach-domain-tag{font-size:0.5rem;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:3px 8px;border-radius:20px;flex-shrink:0}
  .bos-coach-headline{font-family:'Bebas Neue',sans-serif;font-size:1.1rem;letter-spacing:1.5px;color:#FFF;margin-bottom:8px;line-height:1.1}
  .bos-coach-tips{list-style:none;padding:0;margin:0 0 10px}
  .bos-coach-tips li{font-size:0.7rem;color:#c0c8d4;line-height:1.5;padding:4px 0 4px 18px;position:relative}
  .bos-coach-tips li::before{content:'▸';position:absolute;left:0;color:#FFD700;font-size:0.65rem}
  .bos-coach-mental{font-size:0.7rem;color:#8892a0;font-style:italic;line-height:1.5;padding:8px 12px;border-left:2px solid rgba(255,215,0,0.3);margin-top:6px;background:rgba(255,215,0,0.03);border-radius:0 8px 8px 0}
  .bos-coach-mental::before{content:'💭 '}
  .bos-coach-dismiss{position:absolute;top:10px;right:12px;background:none;border:none;color:#8892a0;font-size:0.9rem;cursor:pointer;padding:4px;line-height:1;transition:color 0.2s}
  .bos-coach-dismiss:hover{color:#FFD700}
  .bos-coach-panel.collapsed{padding:10px 18px;cursor:pointer;transition:all 0.3s}
  .bos-coach-panel.collapsed:hover{border-color:rgba(255,215,0,0.3)}
  .bos-coach-panel.collapsed .bos-coach-body{display:none}
  .bos-coach-expand-hint{display:none;font-size:0.55rem;color:#8892a0;letter-spacing:0.5px}
  .bos-coach-panel.collapsed .bos-coach-expand-hint{display:inline}
  .bos-coach-panel.collapsed .bos-coach-dismiss{display:none}
  .clutch-coach-panel{margin-bottom:12px}
  @media(max-width:600px){.bos-coach-panel{margin:0 auto 0.8rem;padding:12px 14px;border-radius:12px;max-width:100%}.bos-coach-headline{font-size:0.95rem}.bos-coach-tips li{font-size:0.65rem}.bos-coach-mental{font-size:0.65rem;padding:6px 10px}}
`;
document.head.appendChild(phase1Style);

/* ═══ BUILD COACH PANEL (Phase 1) ═══ */
function buildCoachPanel(gameData, tierKey) {
  const pregame = gameData.pregame[tierKey];
  if (!pregame) return null;
  const panel = document.createElement('div');
  panel.className = 'bos-coach-panel';
  panel.id = 'bosCoachPanel';
  panel.innerHTML = `
    <button class="bos-coach-dismiss" onclick="this.parentElement.classList.add('collapsed')" title="Minimize">\u2715</button>
    <div class="bos-coach-header">
      <div class="bos-coach-avatar">${COACH_AVATAR}</div>
      <div class="bos-coach-meta">
        <div class="bos-coach-name">${COACH_NAME}</div>
        <div class="bos-coach-role">Pre-Workout Coaching</div>
        <span class="bos-coach-expand-hint">tap to expand</span>
      </div>
      <div class="bos-coach-domain-tag" style="background:${gameData.color}15;border:1px solid ${gameData.color}40;color:${gameData.color}">
        ${gameData.icon} ${gameData.domain}
      </div>
    </div>
    <div class="bos-coach-body">
      <div class="bos-coach-headline">${pregame.headline}</div>
      <ul class="bos-coach-tips">${pregame.tips.map(function(t){return '<li>'+t+'</li>';}).join('')}</ul>
      <div class="bos-coach-mental">${pregame.mental}</div>
    </div>
  `;
  panel.addEventListener('click', function(e) {
    if (panel.classList.contains('collapsed') && !e.target.classList.contains('bos-coach-dismiss')) panel.classList.remove('collapsed');
  });
  return panel;
}

/* ═══ INJECT PHASE 1 ═══ */
function injectCoaching() {
  var gameData = COACHING[GAME];
  if (!gameData) return;
  if (GAME === 'clutchtimer') injectClutchTimerCoaching(gameData);
  else injectStandardCoaching(gameData);
}

function injectStandardCoaching(gameData) {
  var startScreen = document.getElementById('startScreen');
  var startBtn = document.getElementById('startBtn');
  if (!startScreen || !startBtn) return;
  var currentPanel = null;
  function updatePanel() {
    var activeTier = document.querySelector('.tier-btn.active');
    if (!activeTier) return;
    var tierKey = parseInt(activeTier.dataset.tier) || 1;
    if (currentPanel && currentPanel.parentNode) currentPanel.remove();
    currentPanel = buildCoachPanel(gameData, tierKey);
    if (currentPanel) startBtn.parentNode.insertBefore(currentPanel, startBtn);
  }
  updatePanel();
  var tierSelect = document.getElementById('tierSelect');
  if (tierSelect) tierSelect.addEventListener('click', function(e) { if (e.target.closest('.tier-btn')) setTimeout(updatePanel, 50); });
}

function injectClutchTimerCoaching(gameData) {
  var actionBtn = document.getElementById('actionBtn');
  var feedbackText = document.getElementById('feedbackText');
  if (!actionBtn) return;
  var currentPanel = null;
  var originalSelectTier = window.selectTier;
  if (originalSelectTier) {
    window.selectTier = function(tier) {
      originalSelectTier(tier);
      if (currentPanel && currentPanel.parentNode) currentPanel.remove();
      currentPanel = buildCoachPanel(gameData, tier);
      if (currentPanel) {
        currentPanel.classList.add('clutch-coach-panel');
        var feedbackBar = feedbackText ? feedbackText.parentElement : null;
        if (feedbackBar) feedbackBar.parentNode.insertBefore(currentPanel, feedbackBar);
        else actionBtn.parentNode.insertBefore(currentPanel, actionBtn);
      }
    };
  }
}


/*╔═══════════════════════════════════════════════════════════╗
  ║  PHASE 2 — REAL-TIME MID-SESSION COACHING                ║
  ║  Coach BOS yells from the sideline during gameplay.       ║
  ║  Non-intrusive toast system. No gameplay interruption.    ║
  ╚═══════════════════════════════════════════════════════════╝*/

/* ═══ PHASE 2 STYLES ═══ */
var phase2Style = document.createElement('style');
phase2Style.textContent = `
  .bos-sideline{position:fixed;top:60px;left:50%;transform:translateX(-50%);z-index:50;display:flex;flex-direction:column;align-items:center;gap:6px;pointer-events:none;width:100%;max-width:400px;padding:0 12px}
  .bos-toast{display:flex;align-items:center;gap:8px;padding:8px 14px;border-radius:12px;background:rgba(10,10,15,0.92);backdrop-filter:blur(12px);border:1px solid rgba(255,215,0,0.2);box-shadow:0 4px 20px rgba(0,0,0,0.5),0 0 15px rgba(255,215,0,0.08);animation:toastIn 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards;opacity:0;transform:translateY(-15px) scale(0.95);max-width:100%}
  .bos-toast.exiting{animation:toastOut 0.3s ease-in forwards}
  .bos-toast-icon{font-size:1rem;flex-shrink:0;line-height:1}
  .bos-toast-msg{font-family:'Outfit',sans-serif;font-size:0.7rem;font-weight:600;color:#e0e0e0;line-height:1.3;letter-spacing:0.2px}
  .bos-toast-coach{font-family:'Bebas Neue',sans-serif;font-size:0.55rem;letter-spacing:1.5px;color:rgba(255,215,0,0.5);margin-right:4px;flex-shrink:0}
  .bos-toast.fire{border-color:rgba(255,107,53,0.35);box-shadow:0 4px 20px rgba(0,0,0,0.5),0 0 20px rgba(255,107,53,0.12)}
  .bos-toast.fire .bos-toast-msg{color:#FF6B35}
  .bos-toast.ice{border-color:rgba(0,217,165,0.3);box-shadow:0 4px 20px rgba(0,0,0,0.5),0 0 15px rgba(0,217,165,0.1)}
  .bos-toast.ice .bos-toast-msg{color:#00D9A5}
  .bos-toast.gold{border-color:rgba(255,215,0,0.35);box-shadow:0 4px 20px rgba(0,0,0,0.5),0 0 20px rgba(255,215,0,0.15)}
  .bos-toast.gold .bos-toast-msg{color:#FFD700}
  .bos-toast.warn{border-color:rgba(255,23,68,0.3);box-shadow:0 4px 20px rgba(0,0,0,0.5),0 0 15px rgba(255,23,68,0.1)}
  .bos-toast.warn .bos-toast-msg{color:#FF5252}
  .bos-toast.clutch{border-color:rgba(0,206,209,0.35);box-shadow:0 4px 20px rgba(0,0,0,0.5),0 0 20px rgba(0,206,209,0.12)}
  .bos-toast.clutch .bos-toast-msg{color:#00CED1}
  @keyframes toastIn{0%{opacity:0;transform:translateY(-15px) scale(0.95)}100%{opacity:1;transform:translateY(0) scale(1)}}
  @keyframes toastOut{0%{opacity:1;transform:translateY(0) scale(1)}100%{opacity:0;transform:translateY(-10px) scale(0.95)}}
  @media(max-width:600px){.bos-sideline{top:50px;max-width:320px}.bos-toast{padding:6px 10px}.bos-toast-msg{font-size:0.65rem}}
`;
document.head.appendChild(phase2Style);


/* ═══ TOAST SYSTEM ═══ */
var sidelineContainer = null;
var MAX_TOASTS = 2;
var TOAST_DURATION = 2800;
var COOLDOWN_MS = 3500;
var lastToastTime = 0;
var toastQueue = [];

function getSideline() {
  if (!sidelineContainer) {
    sidelineContainer = document.createElement('div');
    sidelineContainer.className = 'bos-sideline';
    sidelineContainer.id = 'bosSideline';
    document.body.appendChild(sidelineContainer);
  }
  return sidelineContainer;
}

function showToast(icon, message, variant, duration) {
  var now = Date.now();
  if (now - lastToastTime < COOLDOWN_MS) {
    if (toastQueue.length < 3) toastQueue.push({ icon: icon, message: message, variant: variant, duration: duration });
    return;
  }
  lastToastTime = now;
  var container = getSideline();
  while (container.children.length >= MAX_TOASTS) {
    var oldest = container.children[0];
    oldest.classList.add('exiting');
    (function(el){ setTimeout(function(){ if(el.parentNode) el.remove(); }, 300); })(oldest);
  }
  var toast = document.createElement('div');
  toast.className = 'bos-toast ' + (variant || '');
  toast.innerHTML = '<span class="bos-toast-coach">BOS</span><span class="bos-toast-icon">' + icon + '</span><span class="bos-toast-msg">' + message + '</span>';
  container.appendChild(toast);
  var dur = duration || TOAST_DURATION;
  (function(el, d){ setTimeout(function(){ el.classList.add('exiting'); setTimeout(function(){ if(el.parentNode) el.remove(); }, 300); }, d); })(toast, dur);
  setTimeout(processQueue, COOLDOWN_MS + 200);
}

function processQueue() {
  if (toastQueue.length === 0) return;
  var next = toastQueue.shift();
  showToast(next.icon, next.message, next.variant, next.duration);
}


/* ═══ COACHING CALLOUT DATABASE ═══ */

var STREAK_CALLOUTS = {
  3:  { icon: '🔥', msgs: ['Three in a row. Keep it rolling.', 'Nice rhythm. Stay locked.', "That's 3. Don't stop now."], variant: 'fire' },
  5:  { icon: '🔥', msgs: ['Five streak! You\'re heating up.', 'ON FIRE. Five straight.', 'Momentum is real — ride this wave.'], variant: 'fire' },
  7:  { icon: '💫', msgs: ['SEVEN. This is elite territory.', 'Seven and climbing. Unstoppable.', 'Your neural pathways are LOCKED IN.'], variant: 'gold' },
  10: { icon: '⚡', msgs: ['TEN STREAK. Absolute machine.', 'Double digits! Championship form.', 'Ten. Playing on another level.'], variant: 'gold' },
  15: { icon: '👑', msgs: ['FIFTEEN. S-Rank performance.', 'Coach is speechless. Fifteen consecutive.', 'This is what Radiant looks like.'], variant: 'gold' }
};

var STREAK_BREAK_CALLOUTS = [
  { min: 5, icon: '💪', msgs: ['Streak broke but that was a strong run. Reset and go.', 'Good run. Shake it off. Next target.'], variant: '' },
  { min: 8, icon: '🧊', msgs: ['Big streak broken. Deep breath — still dangerous.', 'Eight+ then a miss. That happens. Refocus.'], variant: 'ice' },
  { min: 12, icon: '🫡', msgs: ['Incredible run. That miss doesn\'t erase what you just did.', 'Twelve+ streak is rare. You proved something.'], variant: 'ice' }
];

var ACCURACY_WARNINGS = [
  { threshold: 50, icon: '⚠️', msgs: ['Accuracy dropping. Slow down and pick your shots.', 'Below 50%. Quality over quantity.'], variant: 'warn' },
  { threshold: 40, icon: '🛑', msgs: ['Accuracy critical. Every miss costs you. Be selective.', '40% — take a breath before each click.'], variant: 'warn' }
];

var TIME_CALLOUTS = {
  30: { icon: '⏱', msgs: ['Halfway. Check your pace.', '30 seconds left. Stay sharp.'], variant: '' },
  10: { icon: '🏁', msgs: ['TEN SECONDS. Leave everything on the field.', 'Final push! Make every click count.'], variant: 'clutch' },
  5:  { icon: '⚡', msgs: ['FIVE. Go go go!', 'Finish strong!'], variant: 'clutch' }
};

var COLD_START = { icon: '🧊', msgs: ['Relax into it. First few reps are just warmup.', 'Slow start is fine. You\'re calibrating.'], variant: 'ice' };
var FAST_REACTION = { icon: '⚡', msgs: ['Lightning reaction!', 'Sub-300ms. That\'s reflexes.', 'FAST. Your brain is dialed.'], variant: 'gold' };

var GAME_CALLOUTS = {
  strobe: {
    decoyHit:    { icon: '🚫', msgs: ['Decoy! Check for the dashed border.', 'That was a trap. Scan before you fire.'], variant: 'warn' },
    strobeAdapt: { icon: '👁', msgs: ['Surviving the strobe. Visual memory adapting.', 'Eyes adjusting. Blackout can\'t stop you.'], variant: 'ice' }
  },
  flickshot: {
    precisionHit:  { icon: '💎', msgs: ['Precision target down! +250 base.', 'Gold target eliminated. Accuracy.'], variant: 'gold' },
    longFlick:     { icon: '🎯', msgs: ['Long flick! Distance bonus earned.', 'Cross-screen flick — beautiful.'], variant: 'gold' }
  },
  splitfocus: {
    ruleSwitch:    { icon: '🔄', msgs: ['RULE SWITCH. New color. Adjust NOW.', 'Switch! Check the badge — new target.'], variant: 'clutch' },
    wrongColor:    { icon: '⚠️', msgs: ['Wrong color. Check which is active.', 'Inhibition miss — pause and read the rule.'], variant: 'warn' },
    decoyPenalty:  { icon: '🚫', msgs: ['Decoy penalty. Red = danger.', 'Red orb cost 75 points. Ignore decoys.'], variant: 'warn' },
    cleanSwitch:   { icon: '✅', msgs: ['Clean switch! Adapted instantly.', 'Rule change handled like a pro.'], variant: 'ice' }
  },
  clutchtimer: {
    speedBonus:   { icon: '⚡', msgs: ['Speed bonus! Decisions getting automatic.', 'Fast and correct. That\'s the combo.'], variant: 'gold' },
    ruleChange:   { icon: '🔄', msgs: ['Rules changed! Read badge before clicking.', 'New rules. Adapt or lose points.'], variant: 'clutch' },
    timeoutSafe:  { icon: '🧠', msgs: ['Timeout > wrong answer. Smart play.', 'Better to wait than guess wrong.'], variant: 'ice' },
    wrongDecision:{ icon: '💢', msgs: ['-150 hurts. Slow down for the next one.', 'Wrong call. Look at zones more carefully.'], variant: 'warn' }
  }
};


/* ═══ SESSION TRACKER ═══ */
var session = {
  active: false, prevStreak: 0, prevScore: 0, prevMisses: 0, prevHits: 0, prevTimeLeft: 999,
  hitsSinceStart: 0, firstCallout: false,
  accuracyWarned50: false, accuracyWarned40: false,
  timeCalled30: false, timeCalled10: false, timeCalled5: false,
  prevStreakBeforeBreak: 0, strobeHitCount: 0,
  clutchWrong: 0, clutchTimeout: 0, splitLastRule: ''
};

function resetSession() {
  session.active = true; session.prevStreak = 0; session.prevScore = 0;
  session.prevMisses = 0; session.prevHits = 0; session.prevTimeLeft = 999;
  session.hitsSinceStart = 0; session.firstCallout = false;
  session.accuracyWarned50 = false; session.accuracyWarned40 = false;
  session.timeCalled30 = false; session.timeCalled10 = false; session.timeCalled5 = false;
  session.prevStreakBeforeBreak = 0; session.strobeHitCount = 0;
  session.clutchWrong = 0; session.clutchTimeout = 0; session.splitLastRule = '';
  lastToastTime = 0; toastQueue = [];
}

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }


/* ═══ STATE CHANGE ANALYZER ═══ */
function analyzeState(s) {
  if (!session.active) return;

  var streak = s.streak || 0;
  var hits = s.hits || 0;
  var misses = s.misses || 0;
  var score = s.score || 0;
  var timeLeft = s.timeLeft !== undefined ? s.timeLeft : 999;

  // STREAK MILESTONES
  if (streak > session.prevStreak && STREAK_CALLOUTS[streak]) {
    var sc = STREAK_CALLOUTS[streak];
    showToast(sc.icon, pick(sc.msgs), sc.variant);
  }

  // STREAK BROKEN
  if (streak === 0 && session.prevStreak > 0) {
    session.prevStreakBeforeBreak = session.prevStreak;
    for (var i = STREAK_BREAK_CALLOUTS.length - 1; i >= 0; i--) {
      if (session.prevStreak >= STREAK_BREAK_CALLOUTS[i].min) {
        var sbc = STREAK_BREAK_CALLOUTS[i];
        showToast(sbc.icon, pick(sbc.msgs), sbc.variant);
        break;
      }
    }
  }

  // ACCURACY
  var totalAttempts = hits + misses;
  if (totalAttempts >= 6) {
    var acc = Math.round((hits / totalAttempts) * 100);
    if (acc <= 40 && !session.accuracyWarned40) {
      session.accuracyWarned40 = true;
      var aw40 = ACCURACY_WARNINGS[1];
      showToast(aw40.icon, pick(aw40.msgs), aw40.variant);
    } else if (acc <= 50 && !session.accuracyWarned50) {
      session.accuracyWarned50 = true;
      var aw50 = ACCURACY_WARNINGS[0];
      showToast(aw50.icon, pick(aw50.msgs), aw50.variant);
    }
  }

  // TIME MILESTONES
  if (timeLeft <= 30 && timeLeft > 25 && session.prevTimeLeft > 30 && !session.timeCalled30) {
    session.timeCalled30 = true;
    var tc30 = TIME_CALLOUTS[30];
    showToast(tc30.icon, pick(tc30.msgs), tc30.variant);
  }
  if (timeLeft <= 10 && timeLeft > 8 && session.prevTimeLeft > 10 && !session.timeCalled10) {
    session.timeCalled10 = true;
    var tc10 = TIME_CALLOUTS[10];
    showToast(tc10.icon, pick(tc10.msgs), tc10.variant);
  }
  if (timeLeft <= 5 && timeLeft > 3 && session.prevTimeLeft > 5 && !session.timeCalled5) {
    session.timeCalled5 = true;
    var tc5 = TIME_CALLOUTS[5];
    showToast(tc5.icon, pick(tc5.msgs), tc5.variant);
  }

  // COLD START
  if (hits === 0 && misses >= 3 && !session.firstCallout) {
    session.firstCallout = true;
    showToast(COLD_START.icon, pick(COLD_START.msgs), COLD_START.variant);
  }

  // GAME-SPECIFIC
  analyzeGameSpecific(s);

  // Update prev
  session.prevStreak = streak; session.prevScore = score;
  session.prevMisses = misses; session.prevHits = hits;
  session.prevTimeLeft = timeLeft;
}


/* ═══ GAME-SPECIFIC ANALYZERS ═══ */
function analyzeGameSpecific(s) {
  if (GAME === 'strobe') analyzeStrobe(s);
  else if (GAME === 'flickshot') analyzeFlickShot(s);
  else if (GAME === 'splitfocus') analyzeSplitFocus(s);
  else if (GAME === 'clutchtimer') analyzeClutchTimer(s);
}

function analyzeStrobe(s) {
  var gc = GAME_CALLOUTS.strobe;
  if (s.score < session.prevScore && s.misses > session.prevMisses) {
    var drop = session.prevScore - s.score;
    if (drop >= 45 && Math.random() < 0.5) showToast(gc.decoyHit.icon, pick(gc.decoyHit.msgs), gc.decoyHit.variant);
  }
  if (s.hits > session.prevHits) {
    session.strobeHitCount++;
    if (session.strobeHitCount === 8 || session.strobeHitCount === 18) {
      showToast(gc.strobeAdapt.icon, pick(gc.strobeAdapt.msgs), gc.strobeAdapt.variant);
    }
  }
}

function analyzeFlickShot(s) {
  var gc = GAME_CALLOUTS.flickshot;
  if (s.score > session.prevScore && s.hits > session.prevHits) {
    var pts = s.score - session.prevScore;
    if (pts >= 250 && Math.random() < 0.5) showToast(gc.precisionHit.icon, pick(gc.precisionHit.msgs), gc.precisionHit.variant);
    else if (pts >= 180 && Math.random() < 0.35) showToast(gc.longFlick.icon, pick(gc.longFlick.msgs), gc.longFlick.variant);
  }
}

function analyzeSplitFocus(s) {
  var gc = GAME_CALLOUTS.splitfocus;
  if (s.activeRule && s.activeRule !== session.splitLastRule && session.splitLastRule !== '') {
    showToast(gc.ruleSwitch.icon, pick(gc.ruleSwitch.msgs), gc.ruleSwitch.variant);
  }
  if (s.activeRule) session.splitLastRule = s.activeRule;
  if (s.score < session.prevScore) {
    var drop = session.prevScore - s.score;
    if (drop >= 70 && drop <= 80 && Math.random() < 0.5) showToast(gc.decoyPenalty.icon, pick(gc.decoyPenalty.msgs), gc.decoyPenalty.variant);
    else if (drop >= 45 && drop <= 55 && Math.random() < 0.4) showToast(gc.wrongColor.icon, pick(gc.wrongColor.msgs), gc.wrongColor.variant);
  }
}

function analyzeClutchTimer(s) {
  var gc = GAME_CALLOUTS.clutchtimer;
  if (s.score > session.prevScore) {
    var gained = s.score - session.prevScore;
    if (gained >= 180 && Math.random() < 0.4) showToast(gc.speedBonus.icon, pick(gc.speedBonus.msgs), gc.speedBonus.variant);
  }
  if (s.score < session.prevScore) {
    var drop = session.prevScore - s.score;
    if (drop >= 140 && drop <= 160) {
      session.clutchWrong++;
      if (session.clutchWrong <= 3) showToast(gc.wrongDecision.icon, pick(gc.wrongDecision.msgs), gc.wrongDecision.variant);
    }
    if (drop >= 40 && drop <= 60) {
      session.clutchTimeout++;
      if (session.clutchTimeout === 2 || session.clutchTimeout === 5) showToast(gc.timeoutSafe.icon, pick(gc.timeoutSafe.msgs), gc.timeoutSafe.variant);
    }
  }
}


/* ═══ GAME STATE HOOKS — DOM POLLING ═══ */
var pollerInterval = null;
var gameStarted = false;

function hookGameState() {
  if (GAME === 'clutchtimer') { hookClutchTimer(); return; }
  setTimeout(startDOMPoller, 500);
}

function startDOMPoller() {
  var scoreEl = document.getElementById('scoreDisplay');
  var streakEl = document.getElementById('streakDisplay');
  var missEl = document.getElementById('missDisplay');
  var timeEl = document.getElementById('timeDisplay');
  if (!scoreEl) return;

  pollerInterval = setInterval(function() {
    var score = parseInt(scoreEl.textContent) || 0;
    var streak = parseInt(streakEl.textContent) || 0;
    var misses = parseInt(missEl.textContent) || 0;
    var timeLeft = parseInt(timeEl.textContent) || 0;

    // Detect game start
    if (!gameStarted && timeLeft > 0 && timeLeft < 60 && (timeLeft < 58 || score > 0 || misses > 0)) {
      gameStarted = true;
      resetSession();
      showToast('🧠', 'Coach BOS on the sideline. Let\'s work.', '', 2200);
    }

    // Detect game end
    if (gameStarted && timeLeft <= 0) {
      gameStarted = false;
      session.active = false;
      return;
    }

    if (!session.active) return;

    // Build state from DOM
    var accEl = document.getElementById('accuracyDisplay');
    var accPct = 100;
    if (accEl) {
      var accMatch = accEl.textContent.match(/(\d+)/);
      if (accMatch) accPct = parseInt(accMatch[1]);
    }
    var totalAttempts = misses > 0 || score > 0 ?
      (accPct < 100 ? Math.round(misses / Math.max(0.01, (100 - accPct) / 100)) : misses) : 0;
    var hits = Math.max(0, totalAttempts - misses);

    var domState = {
      score: score, streak: streak, misses: misses, hits: hits, timeLeft: timeLeft
    };

    // Split Focus rule detection
    if (GAME === 'splitfocus') {
      var ruleBadge = document.getElementById('ruleBadge');
      if (ruleBadge) {
        var ruleText = ruleBadge.textContent.toLowerCase();
        if (ruleText.indexOf('teal') > -1) domState.activeRule = 'teal';
        else if (ruleText.indexOf('cyan') > -1) domState.activeRule = 'cyan';
        else if (ruleText.indexOf('gold') > -1) domState.activeRule = 'gold';
      }
    }

    analyzeState(domState);
  }, 500);

  // Watch for screen changes (results/start screen appearing = game end)
  var observer = new MutationObserver(function() {
    var resultsScreen = document.getElementById('resultsScreen');
    if (resultsScreen && !resultsScreen.classList.contains('hidden')) {
      gameStarted = false; session.active = false;
    }
    var startScreen = document.getElementById('startScreen');
    if (startScreen && !startScreen.classList.contains('hidden')) {
      gameStarted = false; session.active = false;
    }
  });
  observer.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['class'] });
}


/* ═══ CLUTCH TIMER HOOK ═══ */
function hookClutchTimer() {
  var hudScore = document.getElementById('hudScore');
  var hudStreak = document.getElementById('hudStreak');
  var hudPrompt = document.getElementById('hudPrompt');
  var hudAccuracy = document.getElementById('hudAccuracy');
  if (!hudScore) return;

  var clutchStarted = false;

  setInterval(function() {
    var score = parseInt(hudScore.textContent) || 0;
    var streak = parseInt(hudStreak.textContent) || 0;
    var promptText = hudPrompt ? hudPrompt.textContent : '0/25';
    var promptMatch = promptText.match(/(\d+)\/(\d+)/);
    var currentPrompt = promptMatch ? parseInt(promptMatch[1]) : 0;
    var totalPrompts = promptMatch ? parseInt(promptMatch[2]) : 25;

    var screenGame = document.getElementById('screenGame');
    var isGameActive = screenGame && screenGame.classList.contains('active');

    if (!clutchStarted && isGameActive && currentPrompt > 0) {
      clutchStarted = true;
      resetSession();
      showToast('🧠', 'Coach BOS watching. Make every decision count.', '', 2200);
    }

    var screenResults = document.getElementById('screenResults');
    if (screenResults && screenResults.classList.contains('active')) {
      clutchStarted = false; session.active = false; return;
    }
    var screenSelect = document.getElementById('screenSelect');
    if (screenSelect && screenSelect.classList.contains('active')) {
      clutchStarted = false; session.active = false; return;
    }

    if (!session.active) return;

    var accText = hudAccuracy ? hudAccuracy.textContent : '—';
    var accMatch = accText.match(/(\d+)/);
    var accuracy = accMatch ? parseInt(accMatch[1]) : 100;
    var estimatedHits = Math.round(currentPrompt * (accuracy / 100));
    var estimatedMisses = currentPrompt - estimatedHits;

    // Map prompts to timeLeft equivalent
    var progressPct = currentPrompt / totalPrompts;
    var timeEquiv = Math.round((1 - progressPct) * 60);

    var domState = {
      score: score, streak: streak, hits: estimatedHits,
      misses: estimatedMisses, timeLeft: timeEquiv
    };

    analyzeState(domState);

    // Clutch-specific halfway
    if (currentPrompt === 13 && !session.timeCalled30) {
      session.timeCalled30 = true;
      showToast('⏱', 'Halfway. Windows are getting tighter.', '');
    }
    if (currentPrompt === 22 && !session.timeCalled10) {
      session.timeCalled10 = true;
      showToast('🏁', 'Three more. Leave nothing on the table.', 'clutch');
    }
  }, 400);
}


/* ═══ INITIALIZE ═══ */
function init() {
  injectCoaching();  // Phase 1
  hookGameState();   // Phase 2
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() { setTimeout(init, 100); });
} else {
  setTimeout(init, 100);
}


/* ═══ PUBLIC API ═══ */
window.BOSCoach = {
  game: GAME,
  version: '3.0.0',
  phase: 'mid-session',
  toast: showToast,
  startSession: resetSession,
  endSession: function() { session.active = false; },
  onSessionEnd: function(results) {
    console.log('[Coach BOS] Session ended:', GAME, results);
  },
  getCoaching: function(game, tier) {
    var g = COACHING[game];
    if (!g) return null;
    return g.pregame[tier] || null;
  }
};

console.log('[Coach BOS] v3.0 loaded for ' + GAME + ' — Pre-workout + Mid-session coaching active');

})();
