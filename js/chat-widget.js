(function () {
    const API_BASE = 'https://portfolio-messagerie-production.up.railway.app/api';

    let visitorId = localStorage.getItem('portfolio_visitor_id');
    if (!visitorId) {
        visitorId = 'v_' + Math.random().toString(36).slice(2) + Date.now();
        localStorage.setItem('portfolio_visitor_id', visitorId);
    }

    let lastSeenId = parseInt(localStorage.getItem('pf_last_seen_' + visitorId) || '0', 10);

    const bubble = document.createElement('button');
    bubble.id = 'pf-chat-bubble';
    bubble.style.position = 'fixed';
    bubble.setAttribute('aria-label', 'Ouvrir le chat');
    bubble.innerHTML = '💬<span id="pf-chat-badge"></span>';
    document.body.appendChild(bubble);

    const badge = bubble.querySelector('#pf-chat-badge');

    const panel = document.createElement('div');
    panel.id = 'pf-chat-panel';
    panel.innerHTML = `
    <div id="pf-chat-header">
        <div id="pf-chat-avatar">JH</div>
        <div id="pf-chat-header-text">
            <div id="pf-chat-title">John Hounmenou</div>
            <div id="pf-chat-status">Répond généralement vite</div>
        </div>
        <span id="pf-chat-close" role="button" aria-label="Fermer">&times;</span>
    </div>
    <div id="pf-chat-thread"></div>
    <form id="pf-chat-form">
        <input id="pf-chat-name" type="text" placeholder="Votre nom (optionnel)" maxlength="100">
        <div>
            <textarea id="pf-chat-input" placeholder="Écrivez un message…" required maxlength="2000" rows="1"></textarea>
            <button type="submit" aria-label="Envoyer">➤</button>
        </div>
    </form>
    `;
    document.body.appendChild(panel);
    panel.style.display = 'none';

    bubble.addEventListener('click', () => {
        const isOpen = panel.style.display === 'flex';
        panel.style.display = isOpen ? 'none' : 'flex';
        if (!isOpen) {
            loadMessages(true);
        }
    });
    panel.querySelector('#pf-chat-close').addEventListener('click', () => {
        panel.style.display = 'none';
    });

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function renderMessages(messages) {
        const thread = panel.querySelector('#pf-chat-thread');
        if (!messages.length) {
            thread.innerHTML = '<p class="pf-empty">👋 Une question ? Écrivez-moi, je réponds généralement sous 24 à 48h.</p>';
            return;
        }
        thread.innerHTML = messages
            .map((m) => `<div class="pf-msg pf-${m.sender}">${escapeHtml(m.body)}</div>`)
            .join('');
        thread.scrollTop = thread.scrollHeight;
    }

    function updateBadge(messages) {
        const isOpen = panel.style.display === 'flex';
        if (isOpen) {
            badge.style.display = 'none';
            if (messages.length) {
                const lastId = messages[messages.length - 1].id;
                lastSeenId = lastId;
                localStorage.setItem('pf_last_seen_' + visitorId, lastId);
            }
            return;
        }
        const unseen = messages.filter(m => m.sender === 'admin' && m.id > lastSeenId);
        if (unseen.length > 0) {
            badge.textContent = unseen.length;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }

    async function loadMessages(markSeen) {
        try {
            const res = await fetch(`${API_BASE}/messages/${visitorId}`);
            const messages = await res.json();
            renderMessages(messages);
            updateBadge(messages);
            if (markSeen && messages.length) {
                const lastId = messages[messages.length - 1].id;
                lastSeenId = lastId;
                localStorage.setItem('pf_last_seen_' + visitorId, lastId);
            }
        } catch (e) {
            console.error('Chat load error', e);
        }
    }

    panel.querySelector('#pf-chat-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const input = panel.querySelector('#pf-chat-input');
        const nameInput = panel.querySelector('#pf-chat-name');
        const body = input.value.trim();
        if (!body) return;

        input.value = '';
        try {
            await fetch(`${API_BASE}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify({
                    visitor_id: visitorId,
                    visitor_name: nameInput.value || null,
                    body,
                }),
            });
            loadMessages(true);
        } catch (err) {
            console.error('Send error', err);
        }
    });

    // Vérifie les nouveaux messages toutes les 4 secondes, même quand le chat est fermé
    setInterval(() => {
        loadMessages(false);
    }, 4000);

    // Premier chargement au démarrage de la page (pour afficher le badge si des messages attendent déjà)
    loadMessages(false);
})();