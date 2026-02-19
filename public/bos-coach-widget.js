/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║  BOS COACH — Embeddable Chat Widget (Single Script)     ║
 * ║  Usage: <script src="bos-coach-widget.js"></script>     ║
 * ║  Place before </body> on any bosesports.com page        ║
 * ║  Connects to: bos-agent-server on Render                ║
 * ╚══════════════════════════════════════════════════════════╝
 */
(function() {
  'use strict';

  // ═══ CONFIG — Update agent server URL here ═══
  const AGENT_URL = 'https://bos-agent-server.onrender.com';
  const ENDPOINT = `${AGENT_URL}/api/coach/chat`;

  // ═══ INJECT FONTS ═══
  if (!document.querySelector('link[href*="Bebas+Neue"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@400;500;600;700;800&display=swap';
    document.head.appendChild(link);
  }

  // ═══ INJECT STYLES ═══
  const styles = document.createElement('style');
  styles.id = 'bos-coach-styles';
  styles.textContent = `
    #bos-coach-bubble{position:fixed;bottom:24px;right:24px;width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,#FFD700,#FF6B35);cursor:pointer;z-index:99998;display:flex;align-items:center;justify-content:center;box-shadow:0 0 20px rgba(255,215,0,0.3),0 4px 16px rgba(0,0,0,0.4);transition:transform 0.3s cubic-bezier(0.34,1.56,0.64,1),box-shadow 0.3s;border:2px solid rgba(255,215,0,0.6)}
    #bos-coach-bubble:hover{transform:scale(1.12);box-shadow:0 0 30px rgba(255,215,0,0.5),0 6px 24px rgba(0,0,0,0.5)}
    #bos-coach-bubble.active{transform:scale(0.9) rotate(90deg)}
    #bos-coach-bubble svg{width:30px;height:30px;fill:#0a0a0f;transition:transform 0.3s}
    #bos-coach-bubble.active svg{transform:rotate(-90deg)}
    #bos-coach-bubble::after{content:'';position:absolute;top:4px;right:4px;width:14px;height:14px;background:#00D9A5;border-radius:50%;border:2px solid #0a0a0f;animation:bos-pulse 2s infinite;opacity:1;transition:opacity 0.3s}
    #bos-coach-bubble.active::after,#bos-coach-bubble.seen::after{opacity:0}
    @keyframes bos-pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.3);opacity:0.7}}

    #bos-coach-drawer{position:fixed;bottom:100px;right:24px;width:380px;max-width:calc(100vw - 48px);height:540px;max-height:calc(100vh - 140px);background:#12121a;border:1.5px solid rgba(255,215,0,0.15);border-radius:20px;z-index:99999;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.6),0 0 20px rgba(255,215,0,0.3);opacity:0;transform:translateY(20px) scale(0.95);pointer-events:none;transition:opacity 0.35s cubic-bezier(0.4,0,0.2,1),transform 0.35s cubic-bezier(0.34,1.56,0.64,1)}
    #bos-coach-drawer.open{opacity:1;transform:translateY(0) scale(1);pointer-events:all}

    .bos-ch-header{display:flex;align-items:center;gap:12px;padding:16px 18px;background:linear-gradient(135deg,rgba(255,215,0,0.08),rgba(255,107,53,0.05));border-bottom:1px solid rgba(255,215,0,0.15);flex-shrink:0}
    .bos-ch-avatar{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#FFD700,#FF6B35);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;box-shadow:0 0 20px rgba(255,215,0,0.3)}
    .bos-ch-info{flex:1;min-width:0}
    .bos-ch-name{font-family:'Bebas Neue',sans-serif;font-size:1.2rem;letter-spacing:1.5px;background:linear-gradient(135deg,#FFD700,#FF6B35);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1.1}
    .bos-ch-status{font-family:'Outfit',sans-serif;font-size:0.72rem;color:#00D9A5;font-weight:600;display:flex;align-items:center;gap:5px}
    .bos-ch-status::before{content:'';width:6px;height:6px;background:#00D9A5;border-radius:50%;box-shadow:0 0 20px rgba(0,217,165,0.3)}
    .bos-ch-close{width:32px;height:32px;border:none;background:rgba(255,255,255,0.06);border-radius:10px;color:#a0a0b8;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s;flex-shrink:0}
    .bos-ch-close:hover{background:rgba(255,255,255,0.12);color:#fff}

    .bos-ch-msgs{flex:1;overflow-y:auto;padding:16px 14px;display:flex;flex-direction:column;gap:12px;scroll-behavior:smooth}
    .bos-ch-msgs::-webkit-scrollbar{width:5px}
    .bos-ch-msgs::-webkit-scrollbar-track{background:transparent}
    .bos-ch-msgs::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:3px}

    .bos-msg{max-width:85%;padding:12px 16px;border-radius:18px;font-family:'Outfit',sans-serif;font-size:0.88rem;line-height:1.55;font-weight:500;animation:bos-msg-in 0.35s cubic-bezier(0.34,1.56,0.64,1);word-wrap:break-word}
    @keyframes bos-msg-in{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
    .bos-msg.assistant{align-self:flex-start;background:linear-gradient(135deg,rgba(255,215,0,0.1),rgba(255,107,53,0.08));border:1px solid rgba(255,215,0,0.18);color:#fff;border-bottom-left-radius:4px}
    .bos-msg.user{align-self:flex-end;background:rgba(0,217,165,0.14);border:1px solid rgba(0,217,165,0.25);color:#fff;border-bottom-right-radius:4px}
    .bos-msg.system{align-self:center;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06);color:#a0a0b8;font-size:0.78rem;text-align:center;border-radius:12px;max-width:90%}

    .bos-typing-dots{display:flex;gap:5px;padding:4px 0}
    .bos-typing-dots span{width:8px;height:8px;background:#FFD700;border-radius:50%;animation:bos-typing 1.4s infinite}
    .bos-typing-dots span:nth-child(2){animation-delay:0.2s}
    .bos-typing-dots span:nth-child(3){animation-delay:0.4s}
    @keyframes bos-typing{0%,60%,100%{transform:translateY(0);opacity:0.35}30%{transform:translateY(-8px);opacity:1}}

    .bos-quick-actions{display:flex;flex-wrap:wrap;gap:8px;padding:10px 14px;border-top:1px solid rgba(255,255,255,0.04);flex-shrink:0}
    .bos-quick-btn{padding:8px 14px;border:1.5px solid rgba(255,215,0,0.2);border-radius:100px;background:rgba(255,215,0,0.06);font-family:'Outfit',sans-serif;font-size:0.76rem;font-weight:700;color:#FFD700;cursor:pointer;transition:all 0.2s;white-space:nowrap}
    .bos-quick-btn:hover{background:rgba(255,215,0,0.14);border-color:rgba(255,215,0,0.35);transform:translateY(-1px)}
    .bos-quick-btn:active{transform:scale(0.96);background:#FFD700;color:#0a0a0f}

    .bos-ch-input-wrap{display:flex;align-items:center;gap:8px;padding:12px 14px;padding-bottom:calc(12px + env(safe-area-inset-bottom,0px));border-top:1px solid rgba(255,215,0,0.15);flex-shrink:0;background:#12121a}
    .bos-ch-input{flex:1;min-width:0;padding:11px 16px;border:1.5px solid rgba(255,255,255,0.1);border-radius:14px;font-family:'Outfit',sans-serif;font-size:0.88rem;font-weight:500;color:#fff;background:#1a1a25;outline:none;transition:border-color 0.2s;box-sizing:border-box}
    .bos-ch-input::placeholder{color:rgba(255,255,255,0.3)}
    .bos-ch-input:focus{border-color:rgba(255,215,0,0.4)}
    .bos-ch-send{width:42px;height:42px;border:none;border-radius:14px;background:linear-gradient(135deg,#FFD700,#FF6B35);color:#0a0a0f;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;transition:all 0.2s;box-shadow:0 2px 10px rgba(255,215,0,0.2)}
    .bos-ch-send:hover{transform:scale(1.06);box-shadow:0 4px 16px rgba(255,215,0,0.35)}
    .bos-ch-send:disabled{opacity:0.35;transform:none;cursor:default;box-shadow:none}

    @media(max-width:480px){
      #bos-coach-drawer{bottom:0;right:0;width:100vw;max-width:100vw;height:calc(100vh - 60px);max-height:calc(100vh - 60px);border-radius:20px 20px 0 0;border-bottom:none}
      #bos-coach-bubble{bottom:16px;right:16px;width:58px;height:58px}
    }
  `;
  document.head.appendChild(styles);

  // ═══ INJECT HTML ═══
  const widget = document.createElement('div');
  widget.id = 'bos-coach-root';
  widget.innerHTML = `
    <div id="bos-coach-bubble" title="BOS Coach AI">
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.04 2 11c0 2.83 1.55 5.36 3.98 6.96L5 22l4.24-2.12C10.14 19.96 11.06 20 12 20c5.52 0 10-4.04 10-9S17.52 2 12 2zm-1 13H9v-2h2v2zm3 0h-2v-2h2v2zm3 0h-2v-2h2v2z"/>
      </svg>
    </div>
    <div id="bos-coach-drawer">
      <div class="bos-ch-header">
        <div class="bos-ch-avatar">🎯</div>
        <div class="bos-ch-info">
          <div class="bos-ch-name">BOS COACH</div>
          <div class="bos-ch-status">Dr. Delgado — Online</div>
        </div>
        <button class="bos-ch-close" title="Close">✕</button>
      </div>
      <div class="bos-ch-msgs" id="bos-coach-messages"></div>
      <div class="bos-quick-actions" id="bos-quick-actions">
        <button class="bos-quick-btn" data-msg="Show my stats">📊 My Stats</button>
        <button class="bos-quick-btn" data-msg="Create a training plan">🎯 Training Plan</button>
        <button class="bos-quick-btn" data-msg="Show the leaderboard">🏆 Leaderboard</button>
        <button class="bos-quick-btn" data-msg="What's my rank?">🥇 My Rank</button>
      </div>
      <div class="bos-ch-input-wrap">
        <input type="text" class="bos-ch-input" id="bos-coach-input" placeholder="Ask Coach anything..." autocomplete="off"/>
        <button class="bos-ch-send" id="bos-coach-send" title="Send">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(widget);

  // ═══ STATE ═══
  let isOpen = false;
  let isLoading = false;
  let conversationHistory = [];

  // DOM refs
  const bubble = document.getElementById('bos-coach-bubble');
  const drawer = document.getElementById('bos-coach-drawer');
  const messagesEl = document.getElementById('bos-coach-messages');
  const inputEl = document.getElementById('bos-coach-input');
  const sendBtn = document.getElementById('bos-coach-send');
  const closeBtn = widget.querySelector('.bos-ch-close');

  // ═══ GET PLAYER ID ═══
  function getPlayerId() {
    try {
      const keys = ['bos_user', 'bos_player', 'currentUser', 'bosUser'];
      for (const key of keys) {
        const stored = localStorage.getItem(key);
        if (stored) {
          const parsed = JSON.parse(stored);
          return parsed.id || parsed.playerId || parsed.uid || null;
        }
      }
    } catch (e) {}
    const params = new URLSearchParams(window.location.search);
    return params.get('playerId') || null;
  }

  // ═══ TOGGLE ═══
  function toggle() {
    isOpen = !isOpen;
    if (isOpen) {
      drawer.classList.add('open');
      bubble.classList.add('active', 'seen');
      setTimeout(() => inputEl?.focus(), 350);
    } else {
      drawer.classList.remove('open');
      bubble.classList.remove('active');
    }
  }

  // ═══ ADD MESSAGE ═══
  function addMessage(role, content) {
    const msg = document.createElement('div');
    msg.className = `bos-msg ${role}`;
    msg.innerHTML = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
    messagesEl.appendChild(msg);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    if (role !== 'system') {
      conversationHistory.push({ role, content });
    }
  }

  // ═══ TYPING ═══
  function showTyping() {
    const t = document.createElement('div');
    t.className = 'bos-msg assistant';
    t.id = 'bos-typing';
    t.innerHTML = '<div class="bos-typing-dots"><span></span><span></span><span></span></div>';
    messagesEl.appendChild(t);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }
  function hideTyping() {
    const t = document.getElementById('bos-typing');
    if (t) t.remove();
  }

  // ═══ SEND ═══
  async function send() {
    const text = inputEl?.value?.trim();
    if (!text || isLoading) return;

    inputEl.value = '';
    isLoading = true;
    sendBtn.disabled = true;

    addMessage('user', text);
    showTyping();

    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          playerId: getPlayerId(),
          conversationHistory: conversationHistory.slice(-20)
        })
      });

      hideTyping();

      if (!res.ok) throw new Error(`Server: ${res.status}`);

      const data = await res.json();
      const reply = data.response || data.message || data.content || 'Try again?';
      addMessage('assistant', reply);

    } catch (err) {
      hideTyping();
      console.error('BOS Coach:', err);
      const msg = err.message.includes('fetch') || err.message.includes('Network')
        ? "⚠️ Can't reach Coach server. Check your connection."
        : '⚠️ Something went wrong. Please try again.';
      addMessage('system', msg);
    } finally {
      isLoading = false;
      sendBtn.disabled = false;
      inputEl?.focus();
    }
  }

  // ═══ EVENT LISTENERS ═══
  bubble.addEventListener('click', toggle);
  closeBtn.addEventListener('click', toggle);
  sendBtn.addEventListener('click', send);
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  });

  // Quick action buttons
  widget.querySelectorAll('.bos-quick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      inputEl.value = btn.dataset.msg;
      send();
    });
  });

  // ═══ PUBLIC API ═══
  window.BosCoach = { toggle, send };

})();
