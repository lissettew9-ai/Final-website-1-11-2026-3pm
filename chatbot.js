// Accessible question-and-answer assistant widget for lisslovesyou.org.
// Talks to /api/chat (see api/chat.js). Everything is built with textContent, so replies can't inject HTML.
(function () {
    'use strict';

    const ENDPOINT = '/api/chat';
    const history = [];
    let busy = false;

    const el = (tag, attrs, text) => {
        const node = document.createElement(tag);
        Object.entries(attrs || {}).forEach(([k, v]) => node.setAttribute(k, v));
        if (text) node.textContent = text;
        return node;
    };

    // Turn URLs and email addresses in a reply into real links (safely, without innerHTML).
    function appendLinked(parent, text) {
        const re = /(https?:\/\/[^\s<>"]+[^\s<>".,;:!?)]|[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g;
        let last = 0, m;
        while ((m = re.exec(text)) !== null) {
            if (m.index > last) parent.appendChild(document.createTextNode(text.slice(last, m.index)));
            const isMail = m[0].indexOf('@') > -1 && !/^https?:/i.test(m[0]);
            const a = el('a', { href: isMail ? 'mailto:' + m[0] : m[0] }, m[0]);
            if (!isMail) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
            parent.appendChild(a);
            if (!isMail) a.appendChild(el('span', { class: 'visually-hidden' }, ' (opens in a new tab)'));
            last = m.index + m[0].length;
        }
        if (last < text.length) parent.appendChild(document.createTextNode(text.slice(last)));
    }

    // ---- Build the widget ----
    const root = el('div', { class: 'chat-widget' });

    const launcher = el('button', {
        type: 'button', class: 'chat-launcher', 'aria-expanded': 'false', 'aria-controls': 'chat-panel'
    });
    launcher.appendChild(el('span', { class: 'chat-launcher-icon', 'aria-hidden': 'true' }, '\u{1F4AC}'));
    launcher.appendChild(el('span', { class: 'chat-launcher-label' }, 'Ask a question'));

    const panel = el('section', {
        id: 'chat-panel', class: 'chat-panel', role: 'dialog', 'aria-labelledby': 'chat-title', hidden: ''
    });

    const header = el('div', { class: 'chat-header' });
    header.appendChild(el('h2', { id: 'chat-title', class: 'chat-title' }, 'Ask LissLovesYou'));
    const closeBtn = el('button', { type: 'button', class: 'chat-close', 'aria-label': 'Close chat' });
    closeBtn.appendChild(el('span', { 'aria-hidden': 'true' }, '×'));
    header.appendChild(closeBtn);

    const notice = el('p', { class: 'chat-notice' },
        'This is an AI assistant. It can make mistakes, so please check important details with us. ' +
        'Do not share personal, payment, or immigration information here.');

    const log = el('div', { class: 'chat-log', role: 'log', 'aria-live': 'polite', 'aria-relevant': 'additions' });
    const status = el('p', { class: 'chat-status', role: 'status' });

    const suggestions = el('div', { class: 'chat-suggestions', role: 'group', 'aria-label': 'Suggested questions' });
    ['What does LissLovesYou do?', 'How can I donate?', 'How can I volunteer?', 'How do I contact you?'].forEach(q => {
        const b = el('button', { type: 'button', class: 'chat-suggestion' }, q);
        b.addEventListener('click', () => ask(q));
        suggestions.appendChild(b);
    });

    const form = el('form', { class: 'chat-form', autocomplete: 'off' });
    const label = el('label', { for: 'chat-input', class: 'visually-hidden' }, 'Type your question');
    const input = el('input', {
        id: 'chat-input', class: 'chat-input', type: 'text', maxlength: '500',
        placeholder: 'Type your question here', enterkeyhint: 'send'
    });
    const send = el('button', { type: 'submit', class: 'chat-send' }, 'Send');
    form.append(label, input, send);

    panel.append(header, notice, log, status, suggestions, form);
    root.append(launcher, panel);
    document.body.appendChild(root);

    // ---- Behavior ----
    function addMessage(role, text) {
        const wrap = el('div', { class: 'chat-msg chat-msg--' + role });
        wrap.appendChild(el('span', { class: 'visually-hidden' }, role === 'user' ? 'You: ' : 'Assistant: '));
        const body = el('span', { class: 'chat-bubble' });
        if (role === 'assistant') appendLinked(body, text); else body.textContent = text;
        wrap.appendChild(body);
        log.appendChild(wrap);
        log.scrollTop = log.scrollHeight;
        return wrap;
    }

    function setOpen(open, returnFocus) {
        panel.hidden = !open;
        launcher.setAttribute('aria-expanded', String(open));
        root.classList.toggle('is-open', open);
        if (open) {
            if (!log.children.length) {
                addMessage('assistant', 'Hi! I can answer questions about LissLovesYou, how to donate, how to volunteer, and how to reach us. What would you like to know?');
                log.scrollTop = 0;
            }
            input.focus();
        } else if (returnFocus) {
            launcher.focus();
        }
    }

    async function ask(question) {
        question = (question || '').trim();
        if (!question || busy) return;
        busy = true;
        send.disabled = true;
        suggestions.hidden = true;
        addMessage('user', question);
        history.push({ role: 'user', content: question });
        input.value = '';
        status.textContent = 'The assistant is typing…';
        try {
            const r = await fetch(ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: history.slice(-12) })
            });
            let data = {};
            try { data = await r.json(); } catch (e) { /* non-JSON error */ }
            if (!r.ok || !data.reply) {
                throw new Error(data.error || 'Sorry, I could not answer that right now. Please email President@LissLovesYou.org.');
            }
            history.push({ role: 'assistant', content: data.reply });
            status.textContent = '';
            addMessage('assistant', data.reply);
        } catch (err) {
            history.pop();
            status.textContent = '';
            addMessage('assistant', err && err.message && !/Failed to fetch|NetworkError|Load failed/i.test(err.message)
                ? err.message
                : 'Sorry, I could not connect. Please try again or email President@LissLovesYou.org.');
        } finally {
            busy = false;
            send.disabled = false;
            input.focus();
        }
    }

    launcher.addEventListener('click', () => setOpen(panel.hidden, false));
    closeBtn.addEventListener('click', () => setOpen(false, true));
    form.addEventListener('submit', (e) => { e.preventDefault(); ask(input.value); });
    panel.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') { e.stopPropagation(); setOpen(false, true); }
    });
})();
