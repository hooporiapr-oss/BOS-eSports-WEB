/*═══════════════════════════════════════════════════════════════
  BOS COACH WIDGET v5.0 — BILINGUAL SIDELINE SYSTEM (EN / ES-PR)
  Phase 1: Pre-Workout Coaching ✅
  Phase 2: Real-Time Mid-Session Coaching ✅
  Phase 3: Post-Workout Analysis ✅
  Language: English + Puerto Rican Spanish (auto-detect + toggle)
  
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

/* ═══ LANGUAGE SYSTEM ═══ */
var LANG = (navigator.language || 'en').toLowerCase().indexOf('es') === 0 ? 'es' : 'en';
try { var saved = localStorage.getItem('bos-lang'); if (saved === 'en' || saved === 'es') LANG = saved; } catch(e){}

function setLang(l) {
  LANG = l;
  try { localStorage.setItem('bos-lang', l); } catch(e){}
  // Re-inject Phase 1 panel if visible
  var panel = document.getElementById('bosCoachPanel');
  if (panel && panel.parentNode) {
    panel.remove();
    injectCoaching();
  }
}

function t(en, es) { return LANG === 'es' ? es : en; }


/*╔═══════════════════════════════════════════════════════════╗
  ║  PHASE 1 — PRE-WORKOUT COACHING (BILINGUAL)             ║
  ╚═══════════════════════════════════════════════════════════╝*/

var COACHING = {
  strobe: {
    name: 'Strobe Drill', domain: {en:'Visual Processing',es:'Procesamiento Visual'}, icon: '🎯', color: '#00D9A5',
    pregame: {
      1:{
        en:{headline:"LET'S BUILD YOUR FOUNDATION",tips:["No strobe yet — pure target acquisition. Get your rhythm.","Don't chase the cursor. Let your eyes FIND the target, then click.","Accuracy over speed at this level. Build clean habits first."],mental:"Breathe. Relax your shoulders. Your eyes are your weapon — keep them soft and scanning."},
        es:{headline:"VAMOS A CONSTRUIR LA BASE",tips:["Sin strobe todavía — pura adquisición de blancos. Agarra tu ritmo.","No persigas el cursor. Deja que tus ojos ENCUENTREN el blanco, y clickea.","Precisión sobre velocidad en este nivel. Primero, hábitos limpios."],mental:"Respira. Relaja los hombros. Tus ojos son tu arma — mantenlos suaves y escaneando."}
      },
      2:{
        en:{headline:"STROBE KICKS IN — STAY DISCIPLINED",tips:["Strobe will black out your vision briefly. Don't panic.","Track target positions BEFORE the blackout hits.","Two targets now. Prioritize the closest one first."],mental:"The strobe is training your visual memory. Trust your brain — it remembers where targets were."},
        es:{headline:"EL STROBE SE ACTIVA — DISCIPLINA",tips:["El strobe va a oscurecer tu visión brevemente. No entres en pánico.","Rastrea las posiciones ANTES de que llegue el blackout.","Dos blancos ahora. Prioriza el más cercano primero."],mental:"El strobe entrena tu memoria visual. Confía en tu cerebro — recuerda dónde estaban los blancos."}
      },
      3:{
        en:{headline:"DECOYS ARE LIVE — READ THE FIELD",tips:["Red dashed targets are DECOYS. Hit one and you lose 50 points.","Take a split second to confirm before firing. That pause saves you.","Strobe is faster now. Use peripheral vision to pre-track targets."],mental:"Gold is where champions separate from grinders. Patience under pressure."},
        es:{headline:"SEÑUELOS ACTIVOS — LEE EL CAMPO",tips:["Los blancos rojos con línea cortada son SEÑUELOS. -50 puntos si los tocas.","Toma una fracción de segundo para confirmar antes de disparar.","El strobe es más rápido. Usa la visión periférica para rastrear."],mental:"Gold es donde los campeones se separan. Paciencia bajo presión."}
      },
      4:{
        en:{headline:"ELITE COGNITIVE LOAD — LOCK IN",tips:["Strobe at 120Hz with 450ms blackouts. Your brain must predict.","Three targets max on screen. Scan in patterns, not randomly.","Bonus targets appear briefly — high risk, high reward."],mental:"This is neurocognitive training at its peak. Every rep is building new neural pathways."},
        es:{headline:"CARGA COGNITIVA ELITE — ENFÓCATE",tips:["Strobe a 120Hz con 450ms de blackout. Tu cerebro debe predecir.","Tres blancos máximo en pantalla. Escanea en patrones, no al azar.","Blancos bonus aparecen brevemente — alto riesgo, alta recompensa."],mental:"Esto es entrenamiento neurocognitivo al máximo. Cada rep construye nuevas rutas neuronales."}
      },
      5:{
        en:{headline:"RADIANT TIER — PROVE IT",tips:["150Hz strobe. 550ms darkness. This is the ultimate visual challenge.","Trust your instincts. At this speed, hesitation is the enemy.","Your accuracy needs to stay above 85% for S-rank. Every click counts."],mental:"You've trained for this. The strobe can't break what you've built. Show it who's boss."},
        es:{headline:"TIER RADIANT — DEMUÉSTRALO",tips:["150Hz strobe. 550ms de oscuridad. El reto visual definitivo.","Confía en tus instintos. A esta velocidad, la duda es el enemigo.","Tu precisión debe mantenerse sobre 85% para S-rank. Cada click cuenta."],mental:"Entrenaste para esto. El strobe no puede romper lo que construiste. Enséñale quién manda."}
      }
    }
  },
  flickshot: {
    name: 'FlickShot', domain: {en:'Precision Aiming',es:'Puntería de Precisión'}, icon: '🎯', color: '#00CED1',
    pregame: {
      1:{
        en:{headline:"LEARN YOUR FLICK",tips:["One target at a time. Flick to it, fire, repeat.","The golden line shows your flick path. Longer flicks = bonus points.","2.5 seconds per target. Don't rush — find your natural aim speed."],mental:"This isn't about being the fastest yet. It's about building muscle memory for clean flicks."},
        es:{headline:"APRENDE TU FLICK",tips:["Un blanco a la vez. Flick, dispara, repite.","La línea dorada muestra tu trayectoria. Flicks más largos = puntos bonus.","2.5 segundos por blanco. No corras — encuentra tu velocidad natural."],mental:"Esto no se trata de ser el más rápido todavía. Se trata de crear memoria muscular para flicks limpios."}
      },
      2:{
        en:{headline:"TARGETS ARE SHRINKING — ADJUST",tips:["Targets shrink over time. Hit them early for full size.","The flick distance bonus rewards aggressive cursor positioning.","Watch for the origin marker — it shows where your last click was."],mental:"Shrinking targets test your confidence. Commit to your flick — don't second-guess."},
        es:{headline:"LOS BLANCOS SE ENCOGEN — AJUSTA",tips:["Los blancos se encogen con el tiempo. Pégales temprano a tamaño completo.","El bonus de distancia recompensa posicionamiento agresivo del cursor.","Fíjate en el marcador de origen — muestra dónde fue tu último click."],mental:"Los blancos que se encogen prueban tu confianza. Comprométete con tu flick — no dudes."}
      },
      3:{
        en:{headline:"MOVING TARGETS — READ THE MOVEMENT",tips:["Purple targets MOVE. Lead your aim slightly ahead of their path.","Gold precision targets are small but worth 250 base points.","Mix of static and moving — adapt your strategy per target."],mental:"Moving targets train prediction. Your brain is learning to aim where the target WILL be."},
        es:{headline:"BLANCOS EN MOVIMIENTO — LEE EL PATRÓN",tips:["Los blancos morados SE MUEVEN. Apunta ligeramente adelante de su ruta.","Los blancos dorados de precisión son pequeños pero valen 250 puntos base.","Mezcla de estáticos y en movimiento — adapta tu estrategia."],mental:"Los blancos en movimiento entrenan la predicción. Tu cerebro aprende a apuntar donde ESTARÁ el blanco."}
      },
      4:{
        en:{headline:"DIAMOND MIX — EVERYTHING AT ONCE",tips:["Shrinking + Moving + Precision all in the same round.","1.7 seconds per target. Your reaction time needs to be under 600ms.","Streak bonus kicks in at 3x. Maintain consistency for score multipliers."],mental:"This is where your hours of training compound. Trust the process."},
        es:{headline:"MIX DIAMOND — TODO A LA VEZ",tips:["Encogimiento + Movimiento + Precisión en la misma ronda.","1.7 segundos por blanco. Tu tiempo de reacción debe ser menor a 600ms.","El bonus de racha se activa a 3x. Mantén consistencia para multiplicadores."],mental:"Aquí es donde tus horas de entrenamiento se acumulan. Confía en el proceso."}
      },
      5:{
        en:{headline:"RADIANT FLICKSHOT — CHAOS PRECISION",tips:["900ms spawn rate. Targets appear nearly on top of each other.","44px targets — smallest in the game. Every pixel matters.","S-rank needs 3500+ score with 85% accuracy. That's elite."],mental:"Radiant FlickShot is for the top 1%. If you're here, you've already proven something. Now dominate."},
        es:{headline:"FLICKSHOT RADIANT — PRECISIÓN EN EL CAOS",tips:["900ms de aparición. Los blancos aparecen casi encima uno del otro.","Blancos de 44px — los más pequeños del juego. Cada pixel cuenta.","S-rank necesita 3500+ con 85% de precisión. Eso es elite."],mental:"FlickShot Radiant es para el top 1%. Si estás aquí, ya probaste algo. Ahora domina."}
      }
    }
  },
  splitfocus: {
    name: 'Split Focus', domain: {en:'Cognitive Control',es:'Control Cognitivo'}, icon: '👁', color: '#00D9A5',
    pregame: {
      1:{
        en:{headline:"TRACK THE RIGHT COLOR",tips:["Teal orbs are targets. Red dashed orbs are decoys. Simple.","Two targets, one decoy. Don't click the red — it costs 75 points.","Orbs move slowly. Track them with your eyes before clicking."],mental:"Split Focus is about IGNORING what doesn't matter. Train your filter."},
        es:{headline:"RASTREA EL COLOR CORRECTO",tips:["Las esferas teal son blancos. Las rojas con línea cortada son señuelos.","Dos blancos, un señuelo. No toques el rojo — cuesta 75 puntos.","Las esferas se mueven lento. Rastréalas con los ojos antes de clickear."],mental:"Split Focus se trata de IGNORAR lo que no importa. Entrena tu filtro."}
      },
      2:{
        en:{headline:"MORE DECOYS — STRENGTHEN YOUR FILTER",tips:["Two decoys now. The field is getting crowded.","Decoys look tempting. Train yourself to see the dashed border first.","Speed bonus: hit targets under 500ms for +60 points."],mental:"Your brain wants to click everything. The discipline to NOT click is the real skill."},
        es:{headline:"MÁS SEÑUELOS — FORTALECE TU FILTRO",tips:["Dos señuelos ahora. El campo se llena.","Los señuelos se ven tentadores. Entrénate a ver el borde cortado primero.","Bonus de velocidad: blancos en menos de 500ms = +60 puntos."],mental:"Tu cerebro quiere clickear todo. La disciplina de NO clickear es la verdadera destreza."}
      },
      3:{
        en:{headline:"RULE SWITCHES ARE LIVE",tips:["Mid-round, the target color SWITCHES. Watch the banner!","Teal becomes Cyan or vice versa. Your brain must adapt instantly.","After a switch, pause for half a second to recalibrate. It's worth it."],mental:"Rule switches train cognitive flexibility — the ability to adapt on the fly. This is CLUTCH in competition."},
        es:{headline:"CAMBIOS DE REGLA ACTIVOS",tips:["A mitad de ronda, el color objetivo CAMBIA. ¡Mira el banner!","Teal se convierte en Cyan o viceversa. Tu cerebro debe adaptarse al instante.","Después de un cambio, pausa medio segundo para recalibrar. Vale la pena."],mental:"Los cambios de regla entrenan flexibilidad cognitiva — adaptarte sobre la marcha. Eso es CLUTCH en competencia."}
      },
      4:{
        en:{headline:"DIAMOND — MAXIMUM DIVIDED ATTENTION",tips:["3 targets, 3 decoys. Six orbs moving simultaneously.","Switches every 10 seconds. Your brain gets no rest.","Wrong-color targets STAY on the field. Don't hit them twice."],mental:"This is the cognitive equivalent of guarding two players at once. Eyes everywhere."},
        es:{headline:"DIAMOND — MÁXIMA ATENCIÓN DIVIDIDA",tips:["3 blancos, 3 señuelos. Seis esferas moviéndose simultáneamente.","Cambia cada 10 segundos. Tu cerebro no descansa.","Los blancos del color equivocado SIGUEN en el campo. No los toques dos veces."],mental:"Esto es el equivalente cognitivo de defender a dos jugadores a la vez. Ojos en todo."}
      },
      5:{
        en:{headline:"RADIANT — THREE TARGET COLORS",tips:["Teal, Cyan, AND Gold are all possible target colors.","Switches every 7 seconds. Three colors means more confusion.","4 targets + 4 decoys = 8 orbs. Pure cognitive chaos."],mental:"Radiant Split Focus separates gamers from competitors. Your brain is the controller."},
        es:{headline:"RADIANT — TRES COLORES OBJETIVO",tips:["Teal, Cyan Y Gold son posibles colores objetivo.","Cambia cada 7 segundos. Tres colores = más confusión.","4 blancos + 4 señuelos = 8 esferas. Caos cognitivo puro."],mental:"Radiant Split Focus separa jugadores de competidores. Tu cerebro es el controlador."}
      }
    }
  },
  clutchtimer: {
    name: 'Clutch Timer', domain: {en:'Decision Making',es:'Toma de Decisiones'}, icon: '⏱', color: '#FFD700',
    pregame: {
      bronze:{
        en:{headline:"LEARN THE DECISION SYSTEM",tips:["Two zones. One rule. Match the color to the zone.","3-second decision window. Plenty of time to think.","25 prompts per round. Build accuracy before chasing speed."],mental:"Clutch Timer tests your decision-making under time pressure. Start calm, finish fast."},
        es:{headline:"APRENDE EL SISTEMA DE DECISIONES",tips:["Dos zonas. Una regla. Empareja el color con la zona.","3 segundos para decidir. Tiempo suficiente para pensar.","25 prompts por ronda. Construye precisión antes de buscar velocidad."],mental:"Clutch Timer prueba tus decisiones bajo presión. Empieza calmado, termina rápido."}
      },
      silver:{
        en:{headline:"THIRD ZONE — WIDER DECISION FIELD",tips:["Three zones now. Symbols OR colors — read the rule badge.","2.5-second window. Your processing speed needs to level up.","Wrong answers cost -150. Timeouts only -50. When in doubt, let it expire."],mental:"In competition, a bad decision is worse than no decision. Be smart."},
        es:{headline:"TERCERA ZONA — CAMPO MÁS AMPLIO",tips:["Tres zonas. Símbolos O colores — lee el badge de regla.","2.5 segundos. Tu velocidad de procesamiento necesita subir.","Respuestas incorrectas cuestan -150. Timeouts solo -50. Si dudas, déjalo expirar."],mental:"En competencia, una mala decisión es peor que ninguna decisión. Sé inteligente."}
      },
      gold:{
        en:{headline:"FULL ARENA + RULE SWITCHES",tips:["All four zones active. TWO rules stacking simultaneously.","Rules change every 8 prompts. Watch the rules bar!","Follow Arrow vs Opposite Arrow — know which is active."],mental:"Gold Clutch is where game IQ shows. Reading and adapting in real-time is everything."},
        es:{headline:"ARENA COMPLETA + CAMBIOS DE REGLA",tips:["Las cuatro zonas activas. DOS reglas apiladas simultáneamente.","Las reglas cambian cada 8 prompts. ¡Mira la barra de reglas!","Seguir Flecha vs Flecha Opuesta — sabe cuál está activa."],mental:"Gold Clutch es donde se ve el IQ del juego. Leer y adaptar en tiempo real lo es todo."}
      },
      diamond:{
        en:{headline:"PRIORITY CHAINS — FIND THE BEST ANSWER",tips:["Multiple zones might be 'valid' — but only one is OPTIMAL.","Star ratings on zones show priority. Highest or Lowest depends on the rule.","1.5-second window. No time for deliberation — train until it's automatic."],mental:"Diamond forces you to find the BEST play, not just a good one. That's championship mentality."},
        es:{headline:"CADENAS DE PRIORIDAD — ENCUENTRA LA MEJOR",tips:["Varias zonas pueden ser 'válidas' — pero solo una es ÓPTIMA.","Las estrellas en las zonas muestran prioridad. Mayor o Menor depende de la regla.","1.5 segundos. Sin tiempo para deliberar — entrena hasta que sea automático."],mental:"Diamond te obliga a encontrar la MEJOR jugada, no solo una buena. Eso es mentalidad de campeón."}
      },
      radiant:{
        en:{headline:"CONFLICTING RULES — COGNITIVE OVERLOAD",tips:["THREE rules active. Some may CONFLICT with each other.","⚠ CONFLICT badge means rules are contradictory. Last rule takes priority.","1.2-second window that SHRINKS to 0.54s by prompt 25."],mental:"This is the hardest decision-making challenge in BOS. If you can perform here, you can perform anywhere."},
        es:{headline:"REGLAS EN CONFLICTO — SOBRECARGA COGNITIVA",tips:["TRES reglas activas. Algunas pueden CONFLICTAR entre sí.","⚠ El badge CONFLICT significa reglas contradictorias. La última regla tiene prioridad.","1.2 segundos que SE REDUCE a 0.54s en el prompt 25."],mental:"Este es el reto de decisiones más difícil de BOS. Si puedes aquí, puedes en cualquier lado."}
      }
    }
  }
};

/* ═══ ALL STYLES ═══ */
var allStyles = document.createElement('style');
allStyles.textContent = `
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
  .bos-coach-dismiss{position:absolute;top:10px;right:12px;background:none;border:none;color:#8892a0;font-size:0.9rem;cursor:pointer;padding:4px;line-height:1;transition:color 0.2s}
  .bos-coach-dismiss:hover{color:#FFD700}
  .bos-lang-toggle{position:absolute;top:10px;right:34px;background:none;border:1px solid rgba(255,215,0,0.2);color:#8892a0;font-size:0.5rem;font-weight:700;letter-spacing:1px;cursor:pointer;padding:2px 6px;border-radius:6px;transition:all 0.2s;font-family:'Outfit',sans-serif}
  .bos-lang-toggle:hover{color:#FFD700;border-color:rgba(255,215,0,0.4)}
  .bos-coach-panel.collapsed{padding:10px 18px;cursor:pointer;transition:all 0.3s}
  .bos-coach-panel.collapsed:hover{border-color:rgba(255,215,0,0.3)}
  .bos-coach-panel.collapsed .bos-coach-body{display:none}
  .bos-coach-panel.collapsed .bos-lang-toggle{display:none}
  .bos-coach-expand-hint{display:none;font-size:0.55rem;color:#8892a0;letter-spacing:0.5px}
  .bos-coach-panel.collapsed .bos-coach-expand-hint{display:inline}
  .bos-coach-panel.collapsed .bos-coach-dismiss{display:none}
  .clutch-coach-panel{margin-bottom:12px}
  @media(max-width:600px){.bos-coach-panel{margin:0 auto 0.8rem;padding:12px 14px;border-radius:12px;max-width:100%}.bos-coach-headline{font-size:0.95rem}.bos-coach-tips li{font-size:0.65rem}.bos-coach-mental{font-size:0.65rem;padding:6px 10px}}
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


/* ═══ BUILD & INJECT PHASE 1 ═══ */
function buildCoachPanel(gameData, tierKey) {
  var pregame = gameData.pregame[tierKey];
  if (!pregame) return null;
  var localized = pregame[LANG] || pregame.en || pregame;
  if (!localized.headline) return null;
  var domain = typeof gameData.domain === 'object' ? (gameData.domain[LANG]||gameData.domain.en) : gameData.domain;
  var panel = document.createElement('div');
  panel.className = 'bos-coach-panel';
  panel.id = 'bosCoachPanel';
  var otherLang = LANG === 'en' ? 'ES' : 'EN';
  panel.innerHTML = '<button class="bos-lang-toggle" title="Switch language">' + otherLang + '</button>'
    + '<button class="bos-coach-dismiss" title="Minimize">\u2715</button>'
    + '<div class="bos-coach-header"><div class="bos-coach-avatar">' + COACH_AVATAR + '</div>'
    + '<div class="bos-coach-meta"><div class="bos-coach-name">COACH BOS</div>'
    + '<div class="bos-coach-role">' + t('Pre-Workout Coaching','Coaching Pre-Entrenamiento') + '</div>'
    + '<span class="bos-coach-expand-hint">' + t('tap to expand','toca para expandir') + '</span></div>'
    + '<div class="bos-coach-domain-tag" style="background:' + gameData.color + '15;border:1px solid ' + gameData.color + '40;color:' + gameData.color + '">'
    + gameData.icon + ' ' + domain + '</div></div>'
    + '<div class="bos-coach-body"><div class="bos-coach-headline">' + localized.headline + '</div>'
    + '<ul class="bos-coach-tips">' + localized.tips.map(function(tip){return '<li>'+tip+'</li>';}).join('') + '</ul>'
    + '<div class="bos-coach-mental">' + localized.mental + '</div></div>';

  panel.querySelector('.bos-coach-dismiss').addEventListener('click', function(e) {
    e.stopPropagation();
    panel.classList.add('collapsed');
  });
  panel.querySelector('.bos-lang-toggle').addEventListener('click', function(e) {
    e.stopPropagation();
    setLang(LANG === 'en' ? 'es' : 'en');
  });
  panel.addEventListener('click', function(e) {
    if (panel.classList.contains('collapsed')) panel.classList.remove('collapsed');
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
  ║  PHASE 2 — MID-SESSION COACHING (BILINGUAL)             ║
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

function showToast(icon, msg, variant, duration) {
  var now = Date.now();
  if (now - lastToastTime < COOLDOWN_MS) {
    if (toastQueue.length < 3) toastQueue.push({icon:icon,message:msg,variant:variant,duration:duration});
    return;
  }
  lastToastTime = now;
  var c = getSideline();
  while (c.children.length >= MAX_TOASTS) {
    var o = c.children[0]; o.classList.add('exiting');
    (function(el){setTimeout(function(){if(el.parentNode)el.remove();},300);})(o);
  }
  var el = document.createElement('div');
  el.className = 'bos-toast ' + (variant||'');
  el.innerHTML = '<span class="bos-toast-coach">BOS</span><span class="bos-toast-icon">'+icon+'</span><span class="bos-toast-msg">'+msg+'</span>';
  c.appendChild(el);
  var d = duration || TOAST_DURATION;
  (function(e,dur){setTimeout(function(){e.classList.add('exiting');setTimeout(function(){if(e.parentNode)e.remove();},300);},dur);})(el,d);
  setTimeout(processQueue, COOLDOWN_MS + 200);
}

function processQueue() {
  if (!toastQueue.length) return;
  var n = toastQueue.shift();
  showToast(n.icon, n.message, n.variant, n.duration);
}

/* ── Bilingual Callout Databases ── */
var STREAK_CALLS = {
  3:{icon:'🔥',en:['Three in a row. Keep it rolling.','Nice rhythm. Stay locked.'],es:['Tres seguidos. Sigue así.','Buen ritmo. Mantente enfocado.'],variant:'fire'},
  5:{icon:'🔥',en:['Five streak! Heating up.','ON FIRE. Five straight.'],es:['¡Racha de cinco! Calentando.','EN FUEGO. Cinco seguidos.'],variant:'fire'},
  7:{icon:'💫',en:['SEVEN. Elite territory.','Seven and climbing.'],es:['SIETE. Territorio elite.','Siete y subiendo.'],variant:'gold'},
  10:{icon:'⚡',en:['TEN STREAK. Absolute machine.','Double digits! Championship form.'],es:['RACHA DE DIEZ. Máquina total.','¡Doble dígito! Forma de campeón.'],variant:'gold'},
  15:{icon:'👑',en:['FIFTEEN. S-Rank performance.','This is what Radiant looks like.'],es:['QUINCE. Rendimiento S-Rank.','Así se ve Radiant.'],variant:'gold'}
};

var STREAK_BREAK = [
  {min:5,icon:'💪',en:['Streak broke but strong run. Reset.','Shake it off. Next target.'],es:['Se rompió la racha pero buen tramo. Reset.','Sacúdelo. Próximo blanco.'],variant:''},
  {min:8,icon:'🧊',en:['Big streak broken. Deep breath.','Eight+ then a miss. Refocus.'],es:['Racha grande rota. Respira profundo.','Ocho+ y un fallo. Reenfócate.'],variant:'ice'},
  {min:12,icon:'🫡',en:['Incredible run. That miss doesn\'t erase it.','Twelve+ streak is rare. Go again.'],es:['Corrida increíble. Ese fallo no borra nada.','Racha de doce+ es rara. Dale otra vez.'],variant:'ice'}
];

var ACC_WARN = [
  {threshold:50,icon:'⚠️',en:['Accuracy dropping. Pick your shots.','Below 50%. Quality over quantity.'],es:['La precisión baja. Escoge tus tiros.','Debajo de 50%. Calidad sobre cantidad.'],variant:'warn'},
  {threshold:40,icon:'🛑',en:['Accuracy critical. Be selective.','40% — breathe before each click.'],es:['Precisión crítica. Sé selectivo.','40% — respira antes de cada click.'],variant:'warn'}
];

var TIME_CALL = {
  30:{icon:'⏱',en:['Halfway. Check your pace.','30 seconds. Stay sharp.'],es:['Mitad del camino. Revisa tu ritmo.','30 segundos. Mantente afilado.'],variant:''},
  10:{icon:'🏁',en:['TEN SECONDS. Leave everything on the field.','Final push!'],es:['DIEZ SEGUNDOS. Déjalo todo en el campo.','¡Empuje final!'],variant:'clutch'},
  5:{icon:'⚡',en:['FIVE. Go go go!','Finish strong!'],es:['CINCO. ¡Dale dale dale!','¡Termina fuerte!'],variant:'clutch'}
};

var COLD_START = {icon:'🧊',en:['Relax into it. First reps are warmup.','Slow start is fine. Calibrating.'],es:['Relájate. Los primeros reps son calentamiento.','Arranque lento está bien. Calibrando.'],variant:'ice'};

var GAME_CALLS = {
  strobe:{
    decoyHit:{icon:'🚫',en:['Decoy! Check the dashed border.','Trap. Scan before you fire.'],es:['¡Señuelo! Fíjate en el borde cortado.','Trampa. Escanea antes de disparar.'],variant:'warn'},
    strobeAdapt:{icon:'👁',en:['Surviving the strobe. Adapting.','Eyes adjusting.'],es:['Sobreviviendo el strobe. Adaptándote.','Los ojos se ajustan.'],variant:'ice'}
  },
  flickshot:{
    precisionHit:{icon:'💎',en:['Precision target down! +250.','Gold target eliminated.'],es:['¡Blanco de precisión eliminado! +250.','Blanco dorado eliminado.'],variant:'gold'},
    longFlick:{icon:'🎯',en:['Long flick! Distance bonus.','Cross-screen flick — beautiful.'],es:['¡Flick largo! Bonus de distancia.','Flick cruzando pantalla — hermoso.'],variant:'gold'}
  },
  splitfocus:{
    ruleSwitch:{icon:'🔄',en:['RULE SWITCH. New color. Adjust NOW.','Switch! Check the badge.'],es:['¡CAMBIO DE REGLA! Nuevo color. ¡Ajusta YA!','¡Cambio! Revisa el badge.'],variant:'clutch'},
    wrongColor:{icon:'⚠️',en:['Wrong color. Check which is active.','Inhibition miss — read the rule.'],es:['Color equivocado. Verifica cuál está activo.','Fallo de inhibición — lee la regla.'],variant:'warn'},
    decoyPenalty:{icon:'🚫',en:['Decoy penalty. Red = danger.','Red orb cost 75 pts.'],es:['Penalidad por señuelo. Rojo = peligro.','Esfera roja costó 75 pts.'],variant:'warn'}
  },
  clutchtimer:{
    speedBonus:{icon:'⚡',en:['Speed bonus! Getting automatic.','Fast and correct. The combo.'],es:['¡Bonus de velocidad! Haciéndose automático.','Rápido y correcto. El combo.'],variant:'gold'},
    wrongDecision:{icon:'💢',en:['-150 hurts. Slow down next one.','Wrong call. Look more carefully.'],es:['-150 duele. Más lento el próximo.','Decisión incorrecta. Mira con más cuidado.'],variant:'warn'},
    timeoutSafe:{icon:'🧠',en:['Timeout > wrong answer. Smart.','Better to wait than guess wrong.'],es:['Timeout > respuesta mala. Inteligente.','Mejor esperar que adivinar mal.'],variant:'ice'}
  }
};

function pickL(obj) {
  var arr = obj[LANG] || obj.en || obj;
  if (Array.isArray(arr)) return arr[Math.floor(Math.random() * arr.length)];
  return arr;
}

/* ── Session tracker ── */
var session = {
  active:false,prevStreak:0,prevScore:0,prevMisses:0,prevHits:0,prevTimeLeft:999,
  firstCallout:false,accuracyWarned50:false,accuracyWarned40:false,
  timeCalled30:false,timeCalled10:false,timeCalled5:false,
  strobeHitCount:0,clutchWrong:0,clutchTimeout:0,splitLastRule:'',
  peakStreak:0
};

function resetSession() {
  session.active=true;session.prevStreak=0;session.prevScore=0;session.prevMisses=0;session.prevHits=0;session.prevTimeLeft=999;
  session.firstCallout=false;session.accuracyWarned50=false;session.accuracyWarned40=false;
  session.timeCalled30=false;session.timeCalled10=false;session.timeCalled5=false;
  session.strobeHitCount=0;session.clutchWrong=0;session.clutchTimeout=0;session.splitLastRule='';
  session.peakStreak=0;lastToastTime=0;toastQueue=[];
}

/* ── State analyzer ── */
function analyzeState(s) {
  if (!session.active) return;
  var streak=s.streak||0,hits=s.hits||0,misses=s.misses||0,score=s.score||0,tl=s.timeLeft!==undefined?s.timeLeft:999;

  if (streak>session.prevStreak && STREAK_CALLS[streak]) {
    var sc=STREAK_CALLS[streak]; showToast(sc.icon,pickL(sc),sc.variant);
  }
  if (streak===0 && session.prevStreak>0) {
    for (var i=STREAK_BREAK.length-1;i>=0;i--) {
      if (session.prevStreak>=STREAK_BREAK[i].min){var sb=STREAK_BREAK[i];showToast(sb.icon,pickL(sb),sb.variant);break;}
    }
  }
  var tot=hits+misses;
  if (tot>=6) {
    var acc=Math.round((hits/tot)*100);
    if(acc<=40&&!session.accuracyWarned40){session.accuracyWarned40=true;showToast(ACC_WARN[1].icon,pickL(ACC_WARN[1]),ACC_WARN[1].variant);}
    else if(acc<=50&&!session.accuracyWarned50){session.accuracyWarned50=true;showToast(ACC_WARN[0].icon,pickL(ACC_WARN[0]),ACC_WARN[0].variant);}
  }
  if(tl<=30&&tl>25&&session.prevTimeLeft>30&&!session.timeCalled30){session.timeCalled30=true;var c30=TIME_CALL[30];showToast(c30.icon,pickL(c30),c30.variant);}
  if(tl<=10&&tl>8&&session.prevTimeLeft>10&&!session.timeCalled10){session.timeCalled10=true;var c10=TIME_CALL[10];showToast(c10.icon,pickL(c10),c10.variant);}
  if(tl<=5&&tl>3&&session.prevTimeLeft>5&&!session.timeCalled5){session.timeCalled5=true;var c5=TIME_CALL[5];showToast(c5.icon,pickL(c5),c5.variant);}
  if(hits===0&&misses>=3&&!session.firstCallout){session.firstCallout=true;showToast(COLD_START.icon,pickL(COLD_START),COLD_START.variant);}

  var gc=GAME_CALLS[GAME];
  if(gc){
    if(GAME==='strobe'){
      if(score<session.prevScore&&misses>session.prevMisses){var dr=session.prevScore-score;if(dr>=45&&Math.random()<0.5)showToast(gc.decoyHit.icon,pickL(gc.decoyHit),gc.decoyHit.variant);}
      if(hits>session.prevHits){session.strobeHitCount++;if(session.strobeHitCount===8||session.strobeHitCount===18)showToast(gc.strobeAdapt.icon,pickL(gc.strobeAdapt),gc.strobeAdapt.variant);}
    }
    if(GAME==='flickshot'){
      if(score>session.prevScore&&hits>session.prevHits){var pts=score-session.prevScore;if(pts>=250&&Math.random()<0.5)showToast(gc.precisionHit.icon,pickL(gc.precisionHit),gc.precisionHit.variant);else if(pts>=180&&Math.random()<0.35)showToast(gc.longFlick.icon,pickL(gc.longFlick),gc.longFlick.variant);}
    }
    if(GAME==='splitfocus'){
      if(s.activeRule&&s.activeRule!==session.splitLastRule&&session.splitLastRule!=='')showToast(gc.ruleSwitch.icon,pickL(gc.ruleSwitch),gc.ruleSwitch.variant);
      if(s.activeRule)session.splitLastRule=s.activeRule;
      if(score<session.prevScore){var dr2=session.prevScore-score;if(dr2>=70&&dr2<=80&&Math.random()<0.5)showToast(gc.decoyPenalty.icon,pickL(gc.decoyPenalty),gc.decoyPenalty.variant);else if(dr2>=45&&dr2<=55&&Math.random()<0.4)showToast(gc.wrongColor.icon,pickL(gc.wrongColor),gc.wrongColor.variant);}
    }
    if(GAME==='clutchtimer'){
      if(score>session.prevScore){var g2=score-session.prevScore;if(g2>=180&&Math.random()<0.4)showToast(gc.speedBonus.icon,pickL(gc.speedBonus),gc.speedBonus.variant);}
      if(score<session.prevScore){var d2=session.prevScore-score;if(d2>=140&&d2<=160){session.clutchWrong++;if(session.clutchWrong<=3)showToast(gc.wrongDecision.icon,pickL(gc.wrongDecision),gc.wrongDecision.variant);}if(d2>=40&&d2<=60){session.clutchTimeout++;if(session.clutchTimeout===2||session.clutchTimeout===5)showToast(gc.timeoutSafe.icon,pickL(gc.timeoutSafe),gc.timeoutSafe.variant);}}
    }
  }

  if(streak>session.peakStreak) session.peakStreak=streak;
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
    if(!gameStarted&&tl>0&&tl<60&&(tl<58||score>0||misses>0)){gameStarted=true;resetSession();showToast('🧠',t('Coach BOS on the sideline. Let\'s work.','Coach BOS en la línea. A trabajar.'),'',2200);}
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
  var obs=new MutationObserver(function(){
    var rs=document.getElementById('resultsScreen');
    if(rs&&!rs.classList.contains('hidden')){if(gameStarted){gameStarted=false;session.active=false;setTimeout(function(){injectAnalysis(rs);},600);}}
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
    if(!started&&active&&cp>0){started=true;resetSession();showToast('🧠',t('Coach BOS watching. Every decision counts.','Coach BOS observando. Cada decisión cuenta.'),'',2200);}
    var sr=document.getElementById('screenResults');
    if(sr&&sr.classList.contains('active')){if(started){started=false;session.active=false;setTimeout(function(){injectClutchAnalysis(sr);},600);}return;}
    var sel=document.getElementById('screenSelect');
    if(sel&&sel.classList.contains('active')){started=false;session.active=false;return;}
    if(!session.active)return;
    var at2=hA?hA.textContent:'—',am2=at2.match(/(\d+)/),acc=am2?parseInt(am2[1]):100;
    var eH=Math.round(cp*(acc/100)),eM=cp-eH,pp=cp/tp,te=Math.round((1-pp)*60);
    analyzeState({score:score,streak:streak,hits:eH,misses:eM,timeLeft:te});
    if(cp===13&&!session.timeCalled30){session.timeCalled30=true;showToast('⏱',t('Halfway. Windows getting tighter.','Mitad. Las ventanas se achican.'),'');}
    if(cp===22&&!session.timeCalled10){session.timeCalled10=true;showToast('🏁',t('Three more. Leave nothing on the table.','Tres más. No dejes nada en la mesa.'),'clutch');}
  },400);
}


/*╔═══════════════════════════════════════════════════════════╗
  ║  PHASE 3 — POST-WORKOUT ANALYSIS (BILINGUAL)            ║
  ╚═══════════════════════════════════════════════════════════╝*/

function injectAnalysis(rs) {
  var old = rs.querySelector('.bos-analysis');
  if (old) old.remove();
  var score = parseInt((document.getElementById('resultScore')||{}).textContent)||0;
  var accText = (document.getElementById('resultAccuracy')||{}).textContent||'0%';
  var accuracy = parseInt(accText)||0;
  var bestStreak = parseInt((document.getElementById('resultStreak')||{}).textContent)||0;
  var hits = parseInt((document.getElementById('resultHits')||{}).textContent)||0;
  var reactionText = (document.getElementById('resultReaction')||{}).textContent||'0ms';
  var avgReaction = parseInt(reactionText)||0;
  var grade = (document.getElementById('resultGrade')||{}).textContent||'C';
  var insights = genInsights(score,accuracy,bestStreak,hits,avgReaction,grade);
  var next = genNext(accuracy,bestStreak,avgReaction,grade);
  var panel = buildAnalysisPanel(insights, next);
  var bg = rs.querySelector('.btn-group');
  if(bg)bg.parentNode.insertBefore(panel,bg);else rs.appendChild(panel);
}

function injectClutchAnalysis(rs) {
  var old = rs.querySelector('.bos-analysis');
  if (old) old.remove();
  var score=parseInt((document.getElementById('resultsScore')||{}).textContent)||0;
  var correct=parseInt((document.getElementById('resCorrect')||{}).textContent)||0;
  var wrong=parseInt((document.getElementById('resWrong')||{}).textContent)||0;
  var timeouts=parseInt((document.getElementById('resTimeout')||{}).textContent)||0;
  var accText=(document.getElementById('resAccuracy')||{}).textContent||'0%';
  var accuracy=parseInt(accText)||0;
  var bestStreak=parseInt((document.getElementById('resBestStreak')||{}).textContent)||0;
  var avgTime=parseInt((document.getElementById('resAvgTime')||{}).textContent)||0;
  var ins=[];

  if(score>=2500) ins.push({icon:'🏆',text:t('<strong>Elite score.</strong> Processing decisions at competition level.','<strong>Puntuación elite.</strong> Procesando decisiones a nivel de competencia.'),type:'highlight'});
  else if(score>=1500) ins.push({icon:'📈',text:t('<strong>Solid performance.</strong> Decision engine building speed.','<strong>Rendimiento sólido.</strong> Tu motor de decisiones gana velocidad.'),type:'positive'});
  else if(score>=800) ins.push({icon:'🔧',text:t('Score has room to grow. Wrong answers cost 3x more than timeouts.','La puntuación puede crecer. Respuestas incorrectas cuestan 3x más que timeouts.'),type:'neutral'});
  else ins.push({icon:'🌱',text:t('Building your decision foundation. Every round strengthens the pathways.','Construyendo tu base de decisiones. Cada ronda fortalece las rutas.'),type:'neutral'});

  if(accuracy>=90) ins.push({icon:'🎯',text:'<strong>'+accuracy+'%</strong> — '+t('decision filter is razor sharp.','filtro de decisiones afilado como navaja.'),type:'positive'});
  else if(accuracy>=75) ins.push({icon:'✅',text:accuracy+'% '+t('accuracy. Push for 85%+ next round.','de precisión. Busca 85%+ la próxima ronda.'),type:'neutral'});
  else if(accuracy>=50) ins.push({icon:'⚠️',text:accuracy+'% — '+t('wrong = -150. Timeout = -50. When uncertain, let it expire.','incorrecto = -150. Timeout = -50. Si dudas, déjalo expirar.'),type:'negative'});
  else ins.push({icon:'🛑',text:accuracy+'% '+t('needs work. Read the rules before each response.','necesita trabajo. Lee las reglas antes de cada respuesta.'),type:'negative'});

  if(wrong>0&&timeouts>0){
    var ratio=wrong/(wrong+timeouts);
    if(ratio>0.7) ins.push({icon:'🧠',text:'<strong>'+wrong+' '+t('wrong','incorrectos')+' vs '+timeouts+' timeouts.</strong> '+t('Guessing too much. Let uncertain ones expire.','Adivinando demasiado. Deja expirar los inciertos.'),type:'negative'});
    else if(ratio<0.3) ins.push({icon:'💡',text:'<strong>'+timeouts+' timeouts, '+wrong+' '+t('wrong','incorrectos')+'.</strong> '+t('Caution protects your score. Now speed up confident reads.','La cautela protege tu puntuación. Ahora acelera las lecturas seguras.'),type:'neutral'});
  } else if(wrong===0&&timeouts>3){
    ins.push({icon:'⏱',text:t('Zero wrong but '+timeouts+' timeouts. You have accuracy — trust instincts faster.','Cero incorrectos pero '+timeouts+' timeouts. Tienes precisión — confía más rápido.'),type:'neutral'});
  } else if(wrong===0&&timeouts<=1){
    ins.push({icon:'💎',text:t('Near-perfect decision quality. Championship-level processing.','Calidad de decisión casi perfecta. Procesamiento de campeonato.'),type:'highlight'});
  }

  if(bestStreak>=10) ins.push({icon:'🔥',text:'<strong>'+t(''+bestStreak+'-streak','racha de '+bestStreak)+'</strong> — '+t('sustained focus under pressure. The clutch gene.','enfoque sostenido bajo presión. El gen clutch.'),type:'highlight'});
  else if(bestStreak>=5) ins.push({icon:'🔥',text:t(bestStreak+'-streak. Aim for 10+ by trusting pattern recognition.','Racha de '+bestStreak+'. Apunta a 10+ confiando en el reconocimiento de patrones.'),type:'positive'});

  if(avgTime>0&&avgTime<500) ins.push({icon:'⚡',text:'<strong>'+avgTime+'ms</strong> — '+t('decisions are becoming reflexive.','las decisiones se vuelven reflexivas.'),type:'positive'});
  else if(avgTime>=800) ins.push({icon:'🐢',text:avgTime+'ms '+t('avg. Work on recognizing patterns faster.','promedio. Trabaja en reconocer patrones más rápido.'),type:'neutral'});

  var next;
  if(accuracy<60) next=t('Stay at this tier. Focus on reading the rule badge BEFORE looking at zones.','Quédate en este tier. Enfócate en leer el badge de regla ANTES de mirar las zonas.');
  else if(wrong>timeouts*2) next=t('Same tier. Let uncertain prompts expire. Train "I know" vs "I\'m guessing."','Mismo tier. Deja expirar los prompts inciertos. Entrena "sé" vs "estoy adivinando."');
  else if(accuracy>=85&&avgTime<600) next=t('Ready to move up a tier. The next level pushes your cognitive load higher.','Listo para subir de tier. El próximo nivel aumenta tu carga cognitiva.');
  else next=t('Run this tier again. Accuracy is building — now shave 100ms off your average.','Corre este tier otra vez. La precisión se construye — ahora quita 100ms de tu promedio.');

  var panel=buildAnalysisPanel(ins,next);
  var btns=rs.querySelector('.results-btns');
  if(btns)btns.parentNode.insertBefore(panel,btns);else rs.appendChild(panel);
}

function genInsights(score,accuracy,bestStreak,hits,avgReaction,grade) {
  var ins=[];
  var domain = typeof COACHING[GAME].domain==='object' ? (COACHING[GAME].domain[LANG]||COACHING[GAME].domain.en) : COACHING[GAME].domain;

  if(grade==='S') ins.push({icon:'👑',text:'<strong>S-Rank.</strong> '+t('Radiant-level '+domain.toLowerCase()+'. Performing at the top.',domain.toLowerCase()+' nivel Radiant. Rindiendo al máximo.'),type:'highlight'});
  else if(grade==='A') ins.push({icon:'💎',text:'<strong>A-Rank.</strong> '+t('Diamond-tier performance. Top percentile.','Rendimiento tier Diamond. Percentil más alto.'),type:'positive'});
  else if(grade==='B') ins.push({icon:'📈',text:'<strong>B-Rank.</strong> '+t('Strong session. Neural pathways forming.','Sesión fuerte. Las rutas neuronales se forman.'),type:'neutral'});
  else ins.push({icon:'🌱',text:'<strong>C-Rank.</strong> '+t('Every session builds the foundation. Consistency beats intensity.','Cada sesión construye la base. Consistencia le gana a intensidad.'),type:'neutral'});

  if(accuracy>=90) ins.push({icon:'🎯',text:'<strong>'+accuracy+'%</strong> — '+t('surgical precision. Target discrimination is elite.','precisión quirúrgica. Discriminación de blancos elite.'),type:'positive'});
  else if(accuracy>=75) ins.push({icon:'✅',text:accuracy+'% — '+t('solid. Push past 85% for S-rank potential.','sólido. Pasa de 85% para potencial S-rank.'),type:'neutral'});
  else if(accuracy>=60) ins.push({icon:'⚠️',text:accuracy+'% — '+t('clicking too fast. Slow down 200ms and watch accuracy jump.','clickeando muy rápido. Baja 200ms y la precisión sube.'),type:'negative'});
  else ins.push({icon:'🛑',text:accuracy+'% — '+t('prioritize precision over speed. One clean hit beats three misses.','prioriza precisión sobre velocidad. Un golpe limpio vale más que tres fallos.'),type:'negative'});

  if(avgReaction>0){
    if(avgReaction<400) ins.push({icon:'⚡',text:'<strong>'+avgReaction+'ms</strong> — '+t('faster than most competitive gamers.','más rápido que la mayoría de gamers competitivos.'),type:'positive'});
    else if(avgReaction<600) ins.push({icon:'⏱',text:avgReaction+'ms — '+t('competitive range. Sub-400ms is the target.','rango competitivo. Sub-400ms es la meta.'),type:'neutral'});
    else if(avgReaction<900) ins.push({icon:'🔧',text:avgReaction+'ms — '+t('room to improve. Pre-track targets before they appear.','espacio para mejorar. Rastrea blancos antes de que aparezcan.'),type:'neutral'});
    else ins.push({icon:'🐢',text:avgReaction+'ms — '+t('work on anticipation. Scan and predict spawns.','trabaja en anticipación. Escanea y predice apariciones.'),type:'negative'});
  }

  if(bestStreak>=10) ins.push({icon:'🔥',text:'<strong>'+t(bestStreak+' best streak','mejor racha '+bestStreak)+'</strong> — '+t('sustained flow state. Focus held under pressure.','estado de flujo sostenido. Enfoque bajo presión.'),type:'highlight'});
  else if(bestStreak>=5) ins.push({icon:'🔥',text:t(bestStreak+'-streak peak. To push past 10, resist rushing after hits.','Pico de racha '+bestStreak+'. Para pasar de 10, no corras después de cada acierto.'),type:'positive'});
  else if(bestStreak<=2&&hits>5) ins.push({icon:'📊',text:t('Max streak only '+bestStreak+'. Hitting targets but losing rhythm. Find a tempo.','Racha máxima solo '+bestStreak+'. Aciertas pero pierdes ritmo. Encuentra un tempo.'),type:'negative'});

  if(GAME==='strobe'&&accuracy<70) ins.push({icon:'👁',text:t('Strobe disrupting rhythm. Track target position during blackouts.','El strobe rompe el ritmo. Rastrea la posición durante los blackouts.'),type:'neutral'});
  if(GAME==='flickshot'&&avgReaction>700) ins.push({icon:'🎯',text:t('Flick speed above 700ms. Eyes first, then one smooth sweep.','Velocidad de flick sobre 700ms. Ojos primero, luego un barrido suave.'),type:'neutral'});
  if(GAME==='splitfocus'&&accuracy<65) ins.push({icon:'👁',text:t('Low accuracy may be rule-switch confusion. Pause after each switch.','Baja precisión puede ser confusión de cambio de regla. Pausa después de cada cambio.'),type:'neutral'});

  return ins;
}

function genNext(accuracy,bestStreak,avgReaction,grade) {
  if(grade==='S') return t('S-Rank achieved. Move up a tier. Comfort is the enemy of growth.','S-Rank logrado. Sube de tier. La comodidad es enemiga del crecimiento.');
  if(grade==='A'&&accuracy>=80) return t('Close to S-Rank. Run this tier again — one more clean session.','Cerca de S-Rank. Corre este tier otra vez — una sesión limpia más.');
  if(accuracy<55) return t('Stay at this tier. Visualize clean, accurate clicks before starting. Accuracy is #1.','Quédate en este tier. Visualiza clicks limpios y precisos antes de empezar. Precisión es #1.');
  if(bestStreak<=3&&accuracy>=65) return t('Accuracy is fine but streaks are short. Focus on rhythm — don\'t speed up after hits.','La precisión está bien pero las rachas son cortas. Enfócate en el ritmo — no aceleres después de aciertos.');
  if(avgReaction>800&&accuracy>=70) return t('Accuracy is there. Work on speed — shave 100ms while maintaining accuracy.','La precisión está. Trabaja en velocidad — quita 100ms manteniendo la precisión.');
  return t('Run this tier again. Your brain is building the pathways — consistency makes them permanent.','Corre este tier otra vez. Tu cerebro construye las rutas — la consistencia las hace permanentes.');
}

function buildAnalysisPanel(insights, nextSession) {
  var p = document.createElement('div');
  p.className = 'bos-analysis';
  var ih = '';
  for (var i=0;i<insights.length;i++){
    var ins=insights[i];
    ih+='<div class="bos-insight '+(ins.type||'neutral')+'"><span class="bos-insight-icon">'+ins.icon+'</span><span class="bos-insight-text">'+ins.text+'</span></div>';
  }
  p.innerHTML = '<div class="bos-analysis-header"><div class="bos-analysis-av">'+COACH_AVATAR+'</div>'
    +'<div><div class="bos-analysis-label">COACH BOS</div>'
    +'<div class="bos-analysis-sub">'+t('Post-Workout Analysis','Análisis Post-Entrenamiento')+'</div></div></div>'
    +'<div class="bos-analysis-insights">'+ih+'</div>'
    +'<div class="bos-next-session"><div class="bos-next-label">'+t('NEXT SESSION','PRÓXIMA SESIÓN')+'</div>'
    +'<div class="bos-next-text">'+nextSession+'</div></div>';
  return p;
}


/* ═══ INITIALIZE ═══ */
function init(){injectCoaching();hookGameState();}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',function(){setTimeout(init,100);});}
else{setTimeout(init,100);}

/* ═══ PUBLIC API ═══ */
window.BOSCoach = {
  game:GAME,version:'5.0.0',phase:'complete',lang:LANG,
  setLanguage:setLang,toast:showToast,startSession:resetSession,
  endSession:function(){session.active=false;},
  getCoaching:function(g,tier){var d=COACHING[g];return d?d.pregame[tier]||null:null;}
};

console.log('[Coach BOS] v5.0 loaded for '+GAME+' — Full bilingual sideline ('+LANG.toUpperCase()+')');

})();
