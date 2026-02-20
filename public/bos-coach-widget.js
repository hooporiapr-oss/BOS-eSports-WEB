/*═══════════════════════════════════════════════════════════════
  BOS COACH WIDGET v4.0 — COMPLETE SIDELINE SYSTEM
  Phase 1: Pre-Workout Coaching ✅
  Phase 2: Real-Time Mid-Session Coaching ✅
  Phase 3: Post-Workout Analysis ✅
  
  Loaded by: strobe.html, flickshot.html, splitfocus.html, clutchtimer.html
  Via: <script src="/bos-coach-widget.js"></script>
═══════════════════════════════════════════════════════════════*/

(function() {
'use strict';

var title = document.title.toLowerCase();
var GAME = 'unknown';
if (title.indexOf('strobe') > -1)      GAME = 'strobe';
else if (title.indexOf('flick') > -1)  GAME = 'flickshot';
else if (title.indexOf('split') > -1)  GAME = 'splitfocus';
else if (title.indexOf('clutch') > -1) GAME = 'clutchtimer';
if (GAME === 'unknown') return;

var COACH_AVATAR = '🧠';


/*╔═══════════════════════════════════════════════════════════╗
  ║  PHASE 1 — PRE-WORKOUT COACHING                         ║
  ╚═══════════════════════════════════════════════════════════╝*/

var COACHING = {
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

/* ═══ ALL STYLES (Phase 1 + 2 + 3) ═══ */
var allStyles = document.createElement('style');
allStyles.textContent = `
  /* ═══ PHASE 1: PRE-WORKOUT PANEL ═══ */
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
  .bos-coach-tips li::before{content:'\\25B8';position:absolute;left:0;color:#FFD700;font-size:0.65rem}
  .bos-coach-mental{font-size:0.7rem;color:#8892a0;font-style:italic;line-height:1.5;padding:8px 12px;border-left:2px solid rgba(255,215,0,0.3);margin-top:6px;background:rgba(255,215,0,0.03);border-radius:0 8px 8px 0}
  .bos-coach-mental::before{content:'\\1F4AD '}
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

  /* ═══ PHASE 2: SIDELINE TOASTS ═══ */
  .bos-sideline{position:fixed;top:60px;left:50%;transform:translateX(-50%);z-index:50;display:flex;flex-direction:column;align-items:center;gap:6px;pointer-events:none;width:100%;max-width:400px;padding:0 12px}
  .bos-toast{display:flex;align-items:center;gap:8px;padding:8px 14px;border-radius:12px;background:rgba(10,10,15,0.92);backdrop-filter:blur(12px);border:1px solid rgba(255,215,0,0.2);box-shadow:0 4px 20px rgba(0,0,0,0.5),0 0 15px rgba(255,215,0,0.08);animation:toastIn 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards;opacity:0;transform:translateY(-15px) scale(0.95);max-width:100%}
  .bos-toast.exiting{animation:toastOut 0.3s ease-in forwards}
  .bos-toast-icon{font-size:1rem;flex-shrink:0;line-height:1}
  .bos-toast-msg{font-family:'Outfit',sans-serif;font-size:0.7rem;font-weight:600;color:#e0e0e0;line-height:1.3;letter-spacing:0.2px}
  .bos-toast-coach{font-family:'Bebas Neue',sans-serif;font-size:0.55rem;letter-spacing:1.5px;color:rgba(255,215,0,0.5);margin-right:4px;flex-shrink:0}
  .bos-toast.fire{border-color:rgba(255,107,53,0.35)}.bos-toast.fire .bos-toast-msg{color:#FF6B35}
  .bos-toast.ice{border-color:rgba(0,217,165,0.3)}.bos-toast.ice .bos-toast-msg{color:#00D9A5}
  .bos-toast.gold{border-color:rgba(255,215,0,0.35)}.bos-toast.gold .bos-toast-msg{color:#FFD700}
  .bos-toast.warn{border-color:rgba(255,23,68,0.3)}.bos-toast.warn .bos-toast-msg{color:#FF5252}
  .bos-toast.clutch{border-color:rgba(0,206,209,0.35)}.bos-toast.clutch .bos-toast-msg{color:#00CED1}
  @keyframes toastIn{0%{opacity:0;transform:translateY(-15px) scale(0.95)}100%{opacity:1;transform:translateY(0) scale(1)}}
  @keyframes toastOut{0%{opacity:1;transform:translateY(0) scale(1)}100%{opacity:0;transform:translateY(-10px) scale(0.95)}}
  @media(max-width:600px){.bos-sideline{top:50px;max-width:320px}.bos-toast{padding:6px 10px}.bos-toast-msg{font-size:0.65rem}}

  /* ═══ PHASE 3: POST-WORKOUT ANALYSIS ═══ */
  .bos-analysis{max-width:480px;width:100%;margin:0 auto;background:rgba(17,17,24,0.95);border:1px solid rgba(255,215,0,0.15);border-radius:16px;padding:16px 18px;text-align:left;position:relative;overflow:hidden;animation:analysisIn 0.6s ease-out}
  .bos-analysis::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#00D9A5,#FFD700,#FF6B35);opacity:0.7}
  @keyframes analysisIn{0%{opacity:0;transform:translateY(16px)}100%{opacity:1;transform:translateY(0)}}
  .bos-analysis-header{display:flex;align-items:center;gap:10px;margin-bottom:12px}
  .bos-analysis-av{width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,#00D9A5,#FFD700);display:flex;align-items:center;justify-content:center;font-size:1rem;flex-shrink:0}
  .bos-analysis-label{font-family:'Bebas Neue',sans-serif;font-size:0.75rem;letter-spacing:2px;color:#FFD700;line-height:1}
  .bos-analysis-sub{font-size:0.5rem;color:#8892a0;font-weight:600;letter-spacing:0.5px;text-transform:uppercase;margin-top:1px}
  .bos-analysis-insights{display:flex;flex-direction:column;gap:8px;margin-bottom:12px}
  .bos-insight{display:flex;align-items:flex-start;gap:8px;font-size:0.7rem;line-height:1.45;color:#c0c8d4}
  .bos-insight-icon{font-size:0.85rem;flex-shrink:0;margin-top:1px}
  .bos-insight-text strong{font-weight:700}
  .bos-insight.positive .bos-insight-text{color:#00D9A5}
  .bos-insight.negative .bos-insight-text{color:#FF5252}
  .bos-insight.neutral .bos-insight-text{color:#c0c8d4}
  .bos-insight.highlight .bos-insight-text{color:#FFD700}
  .bos-next-session{padding:10px 14px;background:rgba(255,215,0,0.04);border:1px solid rgba(255,215,0,0.12);border-radius:10px}
  .bos-next-label{font-family:'Bebas Neue',sans-serif;font-size:0.65rem;letter-spacing:1.5px;color:#FFD700;margin-bottom:4px}
  .bos-next-text{font-size:0.7rem;color:#c0c8d4;line-height:1.5}
  @media(max-width:600px){.bos-analysis{padding:12px 14px;border-radius:12px}.bos-insight{font-size:0.65rem}}
`;
document.head.appendChild(allStyles);


/* ═══ PHASE 1: BUILD & INJECT ═══ */

function buildCoachPanel(gameData, tierKey) {
  var pregame = gameData.pregame[tierKey];
  if (!pregame) return null;
  var panel = document.createElement('div');
  panel.className = 'bos-coach-panel';
  panel.id = 'bosCoachPanel';
  panel.innerHTML = '<button class="bos-coach-dismiss" onclick="this.parentElement.classList.add(\'collapsed\')" title="Minimize">\u2715</button>'
    + '<div class="bos-coach-header"><div class="bos-coach-avatar">' + COACH_AVATAR + '</div>'
    + '<div class="bos-coach-meta"><div class="bos-coach-name">COACH BOS</div>'
    + '<div class="bos-coach-role">Pre-Workout Coaching</div>'
    + '<span class="bos-coach-expand-hint">tap to expand</span></div>'
    + '<div class="bos-coach-domain-tag" style="background:' + gameData.color + '15;border:1px solid ' + gameData.color + '40;color:' + gameData.color + '">'
    + gameData.icon + ' ' + gameData.domain + '</div></div>'
    + '<div class="bos-coach-body"><div class="bos-coach-headline">' + pregame.headline + '</div>'
    + '<ul class="bos-coach-tips">' + pregame.tips.map(function(t){return '<li>'+t+'</li>';}).join('') + '</ul>'
    + '<div class="bos-coach-mental">' + pregame.mental + '</div></div>';
  panel.addEventListener('click', function(e) {
    if (panel.classList.contains('collapsed') && !e.target.classList.contains('bos-coach-dismiss')) panel.classList.remove('collapsed');
  });
  return panel;
}

function injectCoaching() {
  var gd = COACHING[GAME]; if (!gd) return;
  if (GAME === 'clutchtimer') injectClutchCoaching(gd); else injectStdCoaching(gd);
}

function injectStdCoaching(gd) {
  var ss = document.getElementById('startScreen'), sb = document.getElementById('startBtn');
  if (!ss || !sb) return;
  var cp = null;
  function upd() {
    var at = document.querySelector('.tier-btn.active');
    if (!at) return;
    var tk = parseInt(at.dataset.tier) || 1;
    if (cp && cp.parentNode) cp.remove();
    cp = buildCoachPanel(gd, tk);
    if (cp) sb.parentNode.insertBefore(cp, sb);
  }
  upd();
  var ts = document.getElementById('tierSelect');
  if (ts) ts.addEventListener('click', function(e) { if (e.target.closest('.tier-btn')) setTimeout(upd, 50); });
}

function injectClutchCoaching(gd) {
  var ab = document.getElementById('actionBtn'), ft = document.getElementById('feedbackText');
  if (!ab) return;
  var cp = null, orig = window.selectTier;
  if (orig) {
    window.selectTier = function(tier) {
      orig(tier);
      if (cp && cp.parentNode) cp.remove();
      cp = buildCoachPanel(gd, tier);
      if (cp) {
        cp.classList.add('clutch-coach-panel');
        var fb = ft ? ft.parentElement : null;
        if (fb) fb.parentNode.insertBefore(cp, fb); else ab.parentNode.insertBefore(cp, ab);
      }
    };
  }
}


/*╔═══════════════════════════════════════════════════════════╗
  ║  PHASE 2 — REAL-TIME MID-SESSION COACHING                ║
  ╚═══════════════════════════════════════════════════════════╝*/

var sidelineContainer = null, MAX_TOASTS = 2, TOAST_DURATION = 2800, COOLDOWN_MS = 3500;
var lastToastTime = 0, toastQueue = [];

function getSideline() {
  if (!sidelineContainer) {
    sidelineContainer = document.createElement('div');
    sidelineContainer.className = 'bos-sideline';
    document.body.appendChild(sidelineContainer);
  }
  return sidelineContainer;
}

function showToast(icon, message, variant, duration) {
  var now = Date.now();
  if (now - lastToastTime < COOLDOWN_MS) {
    if (toastQueue.length < 3) toastQueue.push({icon:icon,message:message,variant:variant,duration:duration});
    return;
  }
  lastToastTime = now;
  var c = getSideline();
  while (c.children.length >= MAX_TOASTS) {
    var o = c.children[0]; o.classList.add('exiting');
    (function(el){setTimeout(function(){if(el.parentNode)el.remove();},300);})(o);
  }
  var t = document.createElement('div');
  t.className = 'bos-toast ' + (variant||'');
  t.innerHTML = '<span class="bos-toast-coach">BOS</span><span class="bos-toast-icon">'+icon+'</span><span class="bos-toast-msg">'+message+'</span>';
  c.appendChild(t);
  var d = duration || TOAST_DURATION;
  (function(el,dur){setTimeout(function(){el.classList.add('exiting');setTimeout(function(){if(el.parentNode)el.remove();},300);},dur);})(t,d);
  setTimeout(processQueue, COOLDOWN_MS + 200);
}

function processQueue() {
  if (toastQueue.length === 0) return;
  var n = toastQueue.shift();
  showToast(n.icon, n.message, n.variant, n.duration);
}

/* ── Callout databases ── */
var STREAK_CALLOUTS = {
  3:{icon:'🔥',msgs:['Three in a row. Keep it rolling.','Nice rhythm. Stay locked.',"That's 3. Don't stop now."],variant:'fire'},
  5:{icon:'🔥',msgs:['Five streak! Heating up.','ON FIRE. Five straight.','Momentum is real — ride this wave.'],variant:'fire'},
  7:{icon:'💫',msgs:['SEVEN. Elite territory.','Seven and climbing. Unstoppable.'],variant:'gold'},
  10:{icon:'⚡',msgs:['TEN STREAK. Absolute machine.','Double digits! Championship form.'],variant:'gold'},
  15:{icon:'👑',msgs:['FIFTEEN. S-Rank performance.','This is what Radiant looks like.'],variant:'gold'}
};
var STREAK_BREAK = [
  {min:5,icon:'💪',msgs:['Streak broke but strong run. Reset and go.','Shake it off. Next target.'],variant:''},
  {min:8,icon:'🧊',msgs:['Big streak broken. Deep breath — still dangerous.','Eight+ then a miss. Refocus.'],variant:'ice'},
  {min:12,icon:'🫡',msgs:['Incredible run. That miss doesn\'t erase it.','Twelve+ streak is rare. Go again.'],variant:'ice'}
];
var ACC_WARN = [
  {threshold:50,icon:'⚠️',msgs:['Accuracy dropping. Pick your shots.','Below 50%. Quality over quantity.'],variant:'warn'},
  {threshold:40,icon:'🛑',msgs:['Accuracy critical. Be selective.','40% — breathe before each click.'],variant:'warn'}
];
var TIME_CALL = {
  30:{icon:'⏱',msgs:['Halfway. Check your pace.','30 seconds left. Stay sharp.'],variant:''},
  10:{icon:'🏁',msgs:['TEN SECONDS. Leave everything on the field.','Final push!'],variant:'clutch'},
  5:{icon:'⚡',msgs:['FIVE. Go go go!','Finish strong!'],variant:'clutch'}
};
var COLD_START = {icon:'🧊',msgs:['Relax into it. First reps are warmup.','Slow start is fine. Calibrating.'],variant:'ice'};
var GAME_CALLS = {
  strobe:{
    decoyHit:{icon:'🚫',msgs:['Decoy! Check the dashed border.','Trap. Scan before you fire.'],variant:'warn'},
    strobeAdapt:{icon:'👁',msgs:['Surviving the strobe. Adapting.','Eyes adjusting. Blackout can\'t stop you.'],variant:'ice'}
  },
  flickshot:{
    precisionHit:{icon:'💎',msgs:['Precision target down! +250 base.','Gold target eliminated.'],variant:'gold'},
    longFlick:{icon:'🎯',msgs:['Long flick! Distance bonus.','Cross-screen flick — beautiful.'],variant:'gold'}
  },
  splitfocus:{
    ruleSwitch:{icon:'🔄',msgs:['RULE SWITCH. New color. Adjust NOW.','Switch! Check the badge.'],variant:'clutch'},
    wrongColor:{icon:'⚠️',msgs:['Wrong color. Check which is active.','Inhibition miss — read the rule.'],variant:'warn'},
    decoyPenalty:{icon:'🚫',msgs:['Decoy penalty. Red = danger.','Red orb cost 75 pts. Ignore decoys.'],variant:'warn'}
  },
  clutchtimer:{
    speedBonus:{icon:'⚡',msgs:['Speed bonus! Getting automatic.','Fast and correct. The combo.'],variant:'gold'},
    wrongDecision:{icon:'💢',msgs:['-150 hurts. Slow down next one.','Wrong call. Look more carefully.'],variant:'warn'},
    timeoutSafe:{icon:'🧠',msgs:['Timeout > wrong answer. Smart.','Better to wait than guess wrong.'],variant:'ice'}
  }
};

/* ── Session tracker ── */
var session = {
  active:false,prevStreak:0,prevScore:0,prevMisses:0,prevHits:0,prevTimeLeft:999,
  firstCallout:false,accuracyWarned50:false,accuracyWarned40:false,
  timeCalled30:false,timeCalled10:false,timeCalled5:false,
  strobeHitCount:0,clutchWrong:0,clutchTimeout:0,splitLastRule:'',
  // Phase 3: track session data for analysis
  peakStreak:0,totalHits:0,totalMisses:0,finalScore:0,sessionTier:''
};

function resetSession() {
  session.active=true;session.prevStreak=0;session.prevScore=0;session.prevMisses=0;session.prevHits=0;session.prevTimeLeft=999;
  session.firstCallout=false;session.accuracyWarned50=false;session.accuracyWarned40=false;
  session.timeCalled30=false;session.timeCalled10=false;session.timeCalled5=false;
  session.strobeHitCount=0;session.clutchWrong=0;session.clutchTimeout=0;session.splitLastRule='';
  session.peakStreak=0;session.totalHits=0;session.totalMisses=0;session.finalScore=0;
  lastToastTime=0;toastQueue=[];
}

function pick(a){return a[Math.floor(Math.random()*a.length)];}

/* ── State analyzer ── */
function analyzeState(s) {
  if (!session.active) return;
  var streak=s.streak||0, hits=s.hits||0, misses=s.misses||0, score=s.score||0, tl=s.timeLeft!==undefined?s.timeLeft:999;

  if (streak>session.prevStreak && STREAK_CALLOUTS[streak]) {
    var sc=STREAK_CALLOUTS[streak]; showToast(sc.icon,pick(sc.msgs),sc.variant);
  }
  if (streak===0 && session.prevStreak>0) {
    for (var i=STREAK_BREAK.length-1;i>=0;i--) {
      if (session.prevStreak>=STREAK_BREAK[i].min){var sb=STREAK_BREAK[i];showToast(sb.icon,pick(sb.msgs),sb.variant);break;}
    }
  }
  var tot=hits+misses;
  if (tot>=6) {
    var acc=Math.round((hits/tot)*100);
    if (acc<=40&&!session.accuracyWarned40){session.accuracyWarned40=true;showToast(ACC_WARN[1].icon,pick(ACC_WARN[1].msgs),ACC_WARN[1].variant);}
    else if(acc<=50&&!session.accuracyWarned50){session.accuracyWarned50=true;showToast(ACC_WARN[0].icon,pick(ACC_WARN[0].msgs),ACC_WARN[0].variant);}
  }
  if(tl<=30&&tl>25&&session.prevTimeLeft>30&&!session.timeCalled30){session.timeCalled30=true;var t30=TIME_CALL[30];showToast(t30.icon,pick(t30.msgs),t30.variant);}
  if(tl<=10&&tl>8&&session.prevTimeLeft>10&&!session.timeCalled10){session.timeCalled10=true;var t10=TIME_CALL[10];showToast(t10.icon,pick(t10.msgs),t10.variant);}
  if(tl<=5&&tl>3&&session.prevTimeLeft>5&&!session.timeCalled5){session.timeCalled5=true;var t5=TIME_CALL[5];showToast(t5.icon,pick(t5.msgs),t5.variant);}
  if(hits===0&&misses>=3&&!session.firstCallout){session.firstCallout=true;showToast(COLD_START.icon,pick(COLD_START.msgs),COLD_START.variant);}

  // Game-specific
  var gc=GAME_CALLS[GAME];
  if(gc){
    if(GAME==='strobe'){
      if(score<session.prevScore&&misses>session.prevMisses){var dr=session.prevScore-score;if(dr>=45&&Math.random()<0.5)showToast(gc.decoyHit.icon,pick(gc.decoyHit.msgs),gc.decoyHit.variant);}
      if(hits>session.prevHits){session.strobeHitCount++;if(session.strobeHitCount===8||session.strobeHitCount===18)showToast(gc.strobeAdapt.icon,pick(gc.strobeAdapt.msgs),gc.strobeAdapt.variant);}
    }
    if(GAME==='flickshot'){
      if(score>session.prevScore&&hits>session.prevHits){var pts=score-session.prevScore;if(pts>=250&&Math.random()<0.5)showToast(gc.precisionHit.icon,pick(gc.precisionHit.msgs),gc.precisionHit.variant);else if(pts>=180&&Math.random()<0.35)showToast(gc.longFlick.icon,pick(gc.longFlick.msgs),gc.longFlick.variant);}
    }
    if(GAME==='splitfocus'){
      if(s.activeRule&&s.activeRule!==session.splitLastRule&&session.splitLastRule!=='')showToast(gc.ruleSwitch.icon,pick(gc.ruleSwitch.msgs),gc.ruleSwitch.variant);
      if(s.activeRule)session.splitLastRule=s.activeRule;
      if(score<session.prevScore){var dr2=session.prevScore-score;if(dr2>=70&&dr2<=80&&Math.random()<0.5)showToast(gc.decoyPenalty.icon,pick(gc.decoyPenalty.msgs),gc.decoyPenalty.variant);else if(dr2>=45&&dr2<=55&&Math.random()<0.4)showToast(gc.wrongColor.icon,pick(gc.wrongColor.msgs),gc.wrongColor.variant);}
    }
    if(GAME==='clutchtimer'){
      if(score>session.prevScore){var g2=score-session.prevScore;if(g2>=180&&Math.random()<0.4)showToast(gc.speedBonus.icon,pick(gc.speedBonus.msgs),gc.speedBonus.variant);}
      if(score<session.prevScore){var d2=session.prevScore-score;if(d2>=140&&d2<=160){session.clutchWrong++;if(session.clutchWrong<=3)showToast(gc.wrongDecision.icon,pick(gc.wrongDecision.msgs),gc.wrongDecision.variant);}if(d2>=40&&d2<=60){session.clutchTimeout++;if(session.clutchTimeout===2||session.clutchTimeout===5)showToast(gc.timeoutSafe.icon,pick(gc.timeoutSafe.msgs),gc.timeoutSafe.variant);}}
    }
  }

  // Track for Phase 3
  if(streak>session.peakStreak) session.peakStreak=streak;
  session.totalHits=hits; session.totalMisses=misses; session.finalScore=score;

  session.prevStreak=streak;session.prevScore=score;session.prevMisses=misses;session.prevHits=hits;session.prevTimeLeft=tl;
}

/* ── DOM Pollers ── */
var gameStarted=false;

function hookGameState(){
  if(GAME==='clutchtimer'){hookClutch();return;}
  setTimeout(startPoller,500);
}

function startPoller(){
  var sE=document.getElementById('scoreDisplay'),stE=document.getElementById('streakDisplay'),mE=document.getElementById('missDisplay'),tE=document.getElementById('timeDisplay');
  if(!sE)return;
  setInterval(function(){
    var score=parseInt(sE.textContent)||0,streak=parseInt(stE.textContent)||0,misses=parseInt(mE.textContent)||0,tl=parseInt(tE.textContent)||0;
    if(!gameStarted&&tl>0&&tl<60&&(tl<58||score>0||misses>0)){gameStarted=true;resetSession();showToast('🧠','Coach BOS on the sideline. Let\'s work.','',2200);}
    if(gameStarted&&tl<=0){gameStarted=false;session.active=false;return;}
    if(!session.active)return;
    var aE=document.getElementById('accuracyDisplay'),accPct=100;
    if(aE){var am=aE.textContent.match(/(\d+)/);if(am)accPct=parseInt(am[1]);}
    var tot=misses>0||score>0?(accPct<100?Math.round(misses/Math.max(0.01,(100-accPct)/100)):misses):0;
    var hits=Math.max(0,tot-misses);
    var ds={score:score,streak:streak,misses:misses,hits:hits,timeLeft:tl};
    if(GAME==='splitfocus'){var rb=document.getElementById('ruleBadge');if(rb){var rt=rb.textContent.toLowerCase();if(rt.indexOf('teal')>-1)ds.activeRule='teal';else if(rt.indexOf('cyan')>-1)ds.activeRule='cyan';else if(rt.indexOf('gold')>-1)ds.activeRule='gold';}}
    analyzeState(ds);
  },500);

  // Watch screen transitions for Phase 3
  var obs=new MutationObserver(function(){
    var rs=document.getElementById('resultsScreen');
    if(rs&&!rs.classList.contains('hidden')){
      if(gameStarted){gameStarted=false;session.active=false;setTimeout(function(){injectAnalysis(rs);},600);}
    }
    var ss=document.getElementById('startScreen');
    if(ss&&!ss.classList.contains('hidden')){gameStarted=false;session.active=false;}
  });
  obs.observe(document.body,{subtree:true,attributes:true,attributeFilter:['class']});
}

function hookClutch(){
  var hS=document.getElementById('hudScore'),hSt=document.getElementById('hudStreak'),hP=document.getElementById('hudPrompt'),hA=document.getElementById('hudAccuracy');
  if(!hS)return;
  var started=false;
  setInterval(function(){
    var score=parseInt(hS.textContent)||0,streak=parseInt(hSt.textContent)||0;
    var pt=hP?hP.textContent:'0/25',pm=pt.match(/(\d+)\/(\d+)/),cp=pm?parseInt(pm[1]):0,tp=pm?parseInt(pm[2]):25;
    var sg=document.getElementById('screenGame'),active=sg&&sg.classList.contains('active');
    if(!started&&active&&cp>0){started=true;resetSession();showToast('🧠','Coach BOS watching. Every decision counts.','',2200);}
    var sr=document.getElementById('screenResults');
    if(sr&&sr.classList.contains('active')){
      if(started){started=false;session.active=false;setTimeout(function(){injectClutchAnalysis(sr);},600);}
      return;
    }
    var sel=document.getElementById('screenSelect');
    if(sel&&sel.classList.contains('active')){started=false;session.active=false;return;}
    if(!session.active)return;
    var at=hA?hA.textContent:'—',am=at.match(/(\d+)/),acc=am?parseInt(am[1]):100;
    var eH=Math.round(cp*(acc/100)),eM=cp-eH;
    var pp=cp/tp,te=Math.round((1-pp)*60);
    analyzeState({score:score,streak:streak,hits:eH,misses:eM,timeLeft:te});
    if(cp===13&&!session.timeCalled30){session.timeCalled30=true;showToast('⏱','Halfway. Windows getting tighter.','');}
    if(cp===22&&!session.timeCalled10){session.timeCalled10=true;showToast('🏁','Three more. Leave nothing on the table.','clutch');}
  },400);
}


/*╔═══════════════════════════════════════════════════════════╗
  ║  PHASE 3 — POST-WORKOUT ANALYSIS                        ║
  ║  Coach BOS breaks down the results screen with           ║
  ║  personalized insights and next-session recommendations. ║
  ╚═══════════════════════════════════════════════════════════╝*/

/* ═══ ANALYSIS ENGINE — Standard Games ═══ */
function injectAnalysis(resultsScreen) {
  // Remove any existing analysis
  var old = resultsScreen.querySelector('.bos-analysis');
  if (old) old.remove();

  // Read results from DOM
  var score = parseInt((document.getElementById('resultScore')||{}).textContent) || 0;
  var accText = (document.getElementById('resultAccuracy')||{}).textContent || '0%';
  var accuracy = parseInt(accText) || 0;
  var bestStreak = parseInt((document.getElementById('resultStreak')||{}).textContent) || 0;
  var hits = parseInt((document.getElementById('resultHits')||{}).textContent) || 0;
  var reactionText = (document.getElementById('resultReaction')||{}).textContent || '0ms';
  var avgReaction = parseInt(reactionText) || 0;
  var grade = (document.getElementById('resultGrade')||{}).textContent || 'C';
  var tier = (document.getElementById('resultTier')||{}).textContent || '';

  var insights = generateInsights(score, accuracy, bestStreak, hits, avgReaction, grade);
  var nextSession = generateNextSession(accuracy, bestStreak, avgReaction, grade);

  var panel = buildAnalysisPanel(insights, nextSession);

  // Insert before button group
  var btnGroup = resultsScreen.querySelector('.btn-group');
  if (btnGroup) btnGroup.parentNode.insertBefore(panel, btnGroup);
  else resultsScreen.appendChild(panel);
}

/* ═══ ANALYSIS ENGINE — Clutch Timer ═══ */
function injectClutchAnalysis(resultsScreen) {
  var old = resultsScreen.querySelector('.bos-analysis');
  if (old) old.remove();

  var score = parseInt((document.getElementById('resultsScore')||{}).textContent) || 0;
  var correct = parseInt((document.getElementById('resCorrect')||{}).textContent) || 0;
  var wrong = parseInt((document.getElementById('resWrong')||{}).textContent) || 0;
  var timeouts = parseInt((document.getElementById('resTimeout')||{}).textContent) || 0;
  var accText = (document.getElementById('resAccuracy')||{}).textContent || '0%';
  var accuracy = parseInt(accText) || 0;
  var bestStreak = parseInt((document.getElementById('resBestStreak')||{}).textContent) || 0;
  var avgTime = parseInt((document.getElementById('resAvgTime')||{}).textContent) || 0;

  var insights = [];

  // Score assessment
  if (score >= 2500) insights.push({icon:'🏆',text:'<strong>Elite score.</strong> You\'re processing decisions at competition level.',type:'highlight'});
  else if (score >= 1500) insights.push({icon:'📈',text:'<strong>Solid performance.</strong> Your decision engine is building speed.',type:'positive'});
  else if (score >= 800) insights.push({icon:'🔧',text:'Score has room to grow. Focus on reducing wrong answers — they cost 3x more than timeouts.',type:'neutral'});
  else insights.push({icon:'🌱',text:'Building your decision foundation. Every round strengthens the pathways.',type:'neutral'});

  // Accuracy
  if (accuracy >= 90) insights.push({icon:'🎯',text:'<strong>'+accuracy+'% accuracy</strong> — your decision filter is razor sharp.',type:'positive'});
  else if (accuracy >= 75) insights.push({icon:'✅',text:accuracy+'% accuracy. Good discipline. Push for 85%+ next round.',type:'neutral'});
  else if (accuracy >= 50) insights.push({icon:'⚠️',text:accuracy+'% accuracy. Wrong answers cost -150. When uncertain, letting the timer expire (-50) is the smarter play.',type:'negative'});
  else insights.push({icon:'🛑',text:accuracy+'% accuracy needs work. Slow your decision process — read the rules before each response.',type:'negative'});

  // Wrong vs Timeout balance
  if (wrong > 0 && timeouts > 0) {
    var ratio = wrong / (wrong + timeouts);
    if (ratio > 0.7) insights.push({icon:'🧠',text:'<strong>'+wrong+' wrong vs '+timeouts+' timeouts.</strong> You\'re guessing too much. Let uncertain ones expire.',type:'negative'});
    else if (ratio < 0.3) insights.push({icon:'💡',text:'<strong>'+timeouts+' timeouts, '+wrong+' wrong.</strong> Your caution is protecting your score. Now work on speeding up confident reads.',type:'neutral'});
  } else if (wrong === 0 && timeouts > 3) {
    insights.push({icon:'⏱',text:'Zero wrong answers but '+timeouts+' timeouts. You have the accuracy — now trust your instincts faster.',type:'neutral'});
  } else if (wrong === 0 && timeouts <= 1) {
    insights.push({icon:'💎',text:'Near-perfect decision quality. That\'s championship-level processing.',type:'highlight'});
  }

  // Streak
  if (bestStreak >= 10) insights.push({icon:'🔥',text:'<strong>'+bestStreak+'-streak</strong> — sustained focus under pressure. That\'s the clutch gene.',type:'highlight'});
  else if (bestStreak >= 5) insights.push({icon:'🔥',text:bestStreak+'-streak is solid. Aim for 10+ by trusting pattern recognition.',type:'positive'});

  // Avg time
  if (avgTime > 0 && avgTime < 500) insights.push({icon:'⚡',text:'<strong>'+avgTime+'ms avg</strong> — your decisions are becoming reflexive.',type:'positive'});
  else if (avgTime >= 800) insights.push({icon:'🐢',text:avgTime+'ms avg response. Work on recognizing patterns faster — the answer should feel automatic.',type:'neutral'});

  // Next session
  var next;
  if (accuracy < 60) next = 'Stay at this tier. Focus on reading the rule badge BEFORE looking at zones. Accuracy is the foundation.';
  else if (wrong > timeouts * 2) next = 'Same tier, but let uncertain prompts expire. Train your brain to distinguish "I know" from "I\'m guessing."';
  else if (accuracy >= 85 && avgTime < 600) next = 'You\'re ready to move up a tier. The next level will push your cognitive load higher.';
  else next = 'Run this tier again. Your accuracy is building — now work on shaving 100ms off your average response time.';

  var panel = buildAnalysisPanel(insights, next);
  var btns = resultsScreen.querySelector('.results-btns');
  if (btns) btns.parentNode.insertBefore(panel, btns);
  else resultsScreen.appendChild(panel);
}

/* ═══ INSIGHT GENERATORS — Standard Games ═══ */
function generateInsights(score, accuracy, bestStreak, hits, avgReaction, grade) {
  var insights = [];
  var gameData = COACHING[GAME] || {};
  var domain = gameData.domain || 'Performance';

  // Grade-based opener
  if (grade === 'S') insights.push({icon:'👑',text:'<strong>S-Rank.</strong> Radiant-level ' + domain.toLowerCase() + '. You\'re performing at the top.',type:'highlight'});
  else if (grade === 'A') insights.push({icon:'💎',text:'<strong>A-Rank.</strong> Diamond-tier performance. You\'re in the top percentile.',type:'positive'});
  else if (grade === 'B') insights.push({icon:'📈',text:'<strong>B-Rank.</strong> Strong session. The neural pathways are forming.',type:'neutral'});
  else insights.push({icon:'🌱',text:'<strong>C-Rank.</strong> Every session builds the foundation. Consistency beats intensity.',type:'neutral'});

  // Accuracy insight
  if (accuracy >= 90) insights.push({icon:'🎯',text:'<strong>' + accuracy + '% accuracy</strong> — surgical precision. Your target discrimination is elite.',type:'positive'});
  else if (accuracy >= 75) insights.push({icon:'✅',text:accuracy + '% accuracy. Solid. Push past 85% to unlock S-rank potential.',type:'neutral'});
  else if (accuracy >= 60) insights.push({icon:'⚠️',text:accuracy + '% accuracy. You\'re clicking too fast. Slow down 200ms and watch accuracy jump.',type:'negative'});
  else insights.push({icon:'🛑',text:accuracy + '% accuracy. Prioritize precision over speed. One clean hit beats three misses.',type:'negative'});

  // Reaction time (for games that track it)
  if (avgReaction > 0) {
    if (avgReaction < 400) insights.push({icon:'⚡',text:'<strong>' + avgReaction + 'ms avg reaction</strong> — faster than most competitive gamers.',type:'positive'});
    else if (avgReaction < 600) insights.push({icon:'⏱',text:avgReaction + 'ms avg reaction. Competitive range. Sub-400ms is the next target.',type:'neutral'});
    else if (avgReaction < 900) insights.push({icon:'🔧',text:avgReaction + 'ms avg reaction. Room to improve. Focus on pre-tracking targets before they fully appear.',type:'neutral'});
    else insights.push({icon:'🐢',text:avgReaction + 'ms avg. Work on anticipation — scan the field and predict where targets will spawn.',type:'negative'});
  }

  // Streak insight
  if (bestStreak >= 10) insights.push({icon:'🔥',text:'<strong>' + bestStreak + ' best streak</strong> — sustained flow state. Your focus held under pressure.',type:'highlight'});
  else if (bestStreak >= 5) insights.push({icon:'🔥',text:bestStreak + '-streak peak. To push past 10, resist the urge to rush after each hit.',type:'positive'});
  else if (bestStreak <= 2 && hits > 5) insights.push({icon:'📊',text:'Max streak was only ' + bestStreak + '. You\'re hitting targets but losing rhythm. Find a consistent tempo.',type:'negative'});

  // Game-specific insights
  if (GAME === 'strobe' && accuracy < 70) {
    insights.push({icon:'👁',text:'Strobe disruptions are breaking your rhythm. Try tracking the target\'s last position during blackouts.',type:'neutral'});
  }
  if (GAME === 'flickshot' && avgReaction > 700) {
    insights.push({icon:'🎯',text:'Your flick speed is above 700ms. Practice the motion: eyes first, then one smooth cursor sweep.',type:'neutral'});
  }
  if (GAME === 'splitfocus' && accuracy < 65) {
    insights.push({icon:'👁',text:'Low accuracy may mean rule-switch confusion. After each switch, pause briefly to re-read the active color.',type:'neutral'});
  }

  return insights;
}

function generateNextSession(accuracy, bestStreak, avgReaction, grade) {
  if (grade === 'S') return 'S-Rank achieved. Move up a tier to keep challenging your ' + (COACHING[GAME]||{}).domain + '. Comfort is the enemy of growth.';
  if (grade === 'A' && accuracy >= 80) return 'You\'re close to S-Rank. Run this tier again — focus on consistency. One more clean session and you\'re there.';
  if (accuracy < 55) return 'Stay at this tier. Before your next session, take 10 seconds to visualize clean, accurate clicks. Accuracy is the #1 priority.';
  if (bestStreak <= 3 && accuracy >= 65) return 'Your accuracy is fine but streaks are short. Next session, focus on rhythm — don\'t speed up after hits. Stay steady.';
  if (avgReaction > 800 && accuracy >= 70) return 'Accuracy is there. Now work on speed. Try to shave 100ms off your reaction time while maintaining accuracy.';
  return 'Run this tier again. Your brain is building the pathways — consistency is what makes them permanent. Trust the process.';
}

/* ═══ BUILD ANALYSIS PANEL ═══ */
function buildAnalysisPanel(insights, nextSession) {
  var panel = document.createElement('div');
  panel.className = 'bos-analysis';

  var insightsHTML = '';
  for (var i = 0; i < insights.length; i++) {
    var ins = insights[i];
    insightsHTML += '<div class="bos-insight ' + (ins.type||'neutral') + '">'
      + '<span class="bos-insight-icon">' + ins.icon + '</span>'
      + '<span class="bos-insight-text">' + ins.text + '</span></div>';
  }

  panel.innerHTML = '<div class="bos-analysis-header">'
    + '<div class="bos-analysis-av">' + COACH_AVATAR + '</div>'
    + '<div><div class="bos-analysis-label">COACH BOS</div>'
    + '<div class="bos-analysis-sub">Post-Workout Analysis</div></div></div>'
    + '<div class="bos-analysis-insights">' + insightsHTML + '</div>'
    + '<div class="bos-next-session">'
    + '<div class="bos-next-label">NEXT SESSION</div>'
    + '<div class="bos-next-text">' + nextSession + '</div></div>';

  return panel;
}


/* ═══ INITIALIZE ═══ */
function init() {
  injectCoaching();
  hookGameState();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function(){setTimeout(init,100);});
} else {
  setTimeout(init, 100);
}

/* ═══ PUBLIC API ═══ */
window.BOSCoach = {
  game: GAME, version: '4.0.0', phase: 'complete',
  toast: showToast,
  startSession: resetSession,
  endSession: function(){session.active=false;},
  getCoaching: function(g,t){var d=COACHING[g];return d?d.pregame[t]||null:null;}
};

console.log('[Coach BOS] v4.0 loaded for ' + GAME + ' — Full sideline system active');

})();
