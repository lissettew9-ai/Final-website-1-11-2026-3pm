// "Ask Amour": a small, static question-and-answer helper for lisslovesyou.org.
// It runs entirely in the visitor's browser: no server, no account, no cost, and nothing typed is sent or stored.
// Amour matches a question to answers written from this website's own content (English and Spanish).
// To change what Amour says, edit the ANSWERS list below.
(function () {
    'use strict';

    const EMAIL = 'President@LissLovesYou.org';
    const ZEFFY = 'https://www.zeffy.com/en-US/donation-form/donate-to-change-lives-5524';

    // -------------------------------------------------------------------------
    // Answers. `words` are word stems (matched after simple stemming), `phrases` are
    // multi-word matches. Weight is 1 per word, 3 per phrase. Use [label](link) for links.
    // -------------------------------------------------------------------------
    const ANSWERS = [
        {
            id: 'about',
            chip: { en: 'What does LissLovesYou do?', es: '¿Qué hace LissLovesYou?' },
            words: ['mission', 'about', 'who', 'organization', 'organisation', 'nonprofit', 'charity', 'purpose', 'mision', 'organizacion', 'quienes', 'acerca'],
            phrases: ['what do you do', 'what does lisslovesyou do', 'tell me about', 'what is lisslovesyou', 'que hacen', 'que hace', 'sobre ustedes', 'quienes son'],
            en: 'LissLovesYou is a Florida-based 501(c)(3) nonprofit that supports children migrating from disadvantaged countries into the United States. Our mission is to provide safe housing, access to education, essential healthcare, cultural integration support, and vital resources so that each child can thrive in their new environment. Learn more on the [home page](index.html#our-mission).',
            es: 'LissLovesYou es una organización sin fines de lucro 501(c)(3) con sede en Florida que apoya a niños que migran desde países en desventaja hacia los Estados Unidos. Nuestra misión es ofrecer vivienda segura, acceso a educación, atención médica esencial, apoyo de integración cultural y recursos vitales para que cada niño pueda prosperar en su nuevo entorno. Más información en la [página principal](index.html#our-mission).'
        },
        {
            id: 'programs',
            chip: { en: 'What programs do you offer?', es: '¿Qué programas ofrecen?' },
            words: ['program', 'service', 'housing', 'education', 'healthcare', 'health', 'school', 'integration', 'programa', 'servicio', 'vivienda', 'educacion', 'salud', 'escuela', 'integracion'],
            phrases: ['what programs', 'how do you help', 'who do you help', 'who do you serve', 'children you help', 'que programas', 'como ayudan', 'a quien ayudan'],
            en: 'We focus on four areas: safe housing for children in transition, access to education, essential healthcare and wellness support, and cultural integration into new communities. I don\'t have details about specific schedules, locations served, or eligibility. For that, please email ' + EMAIL + '.',
            es: 'Nos enfocamos en cuatro áreas: vivienda segura para niños en transición, acceso a educación, atención médica y bienestar esenciales, e integración cultural en nuevas comunidades. No tengo detalles sobre horarios, lugares atendidos ni requisitos. Para eso, escríbenos a ' + EMAIL + '.'
        },
        {
            id: 'donate',
            chip: { en: 'How can I donate?', es: '¿Cómo puedo donar?' },
            words: ['donate', 'donation', 'give', 'giving', 'contribute', 'contribution', 'gift', 'support', 'fund', 'pay', 'money', 'sponsor', 'donar', 'donacion', 'donativo', 'contribuir', 'apoyar', 'dinero', 'aportar', 'patrocinar'],
            phrases: ['how can i help', 'make a donation', 'how do i donate', 'como puedo donar', 'quiero donar', 'como donar'],
            en: 'Thank you for wanting to help! You can give securely online through our [donation form](' + ZEFFY + '), or see the [Donate page](donate.html). You can also give cryptocurrency (ask me about crypto). If you would like to give another way, email ' + EMAIL + '.',
            es: '¡Gracias por querer ayudar! Puedes donar de forma segura en línea con nuestro [formulario de donación](' + ZEFFY + '), o visitar la [página de donaciones](donate.html). También aceptamos criptomonedas (pregúntame por cripto). Si prefieres donar de otra manera, escribe a ' + EMAIL + '.'
        },
        {
            id: 'crypto',
            weight: 2,
            chip: { en: 'Can I donate crypto?', es: '¿Puedo donar criptomonedas?' },
            words: ['crypto', 'cryptocurrency', 'bitcoin', 'btc', 'ethereum', 'eth', 'wallet', 'blockchain', 'cripto', 'criptomoneda', 'criptomonedas', 'billetera'],
            phrases: ['digital asset', 'activos digitales'],
            en: 'Yes, we accept Bitcoin, Ethereum, and other cryptocurrencies. Everything you need, including wallet addresses and QR codes with copy buttons, is on the [Crypto Donations page](crypto-donations.html). Please double-check the address before sending, and for questions about tax treatment of crypto gifts, ask a tax advisor or email ' + EMAIL + '.',
            es: 'Sí, aceptamos Bitcoin, Ethereum y otras criptomonedas. Encontrarás las direcciones de billetera y los códigos QR con botones para copiar en la [página de donaciones en cripto](crypto-donations.html). Verifica bien la dirección antes de enviar. Para dudas sobre impuestos de donaciones en cripto, consulta a un asesor fiscal o escribe a ' + EMAIL + '.'
        },
        {
            id: 'tax',
            weight: 2,
            chip: { en: 'Is my donation tax-deductible?', es: '¿Mi donación es deducible de impuestos?' },
            words: ['tax', 'deduct', 'deductible', 'deduction', 'receipt', 'irs', 'write', 'impuesto', 'impuestos', 'deducible', 'deduccion', 'recibo', 'comprobante'],
            phrases: ['tax deductible', 'tax deduction', 'tax receipt', 'write off', 'deducible de impuestos'],
            en: 'LissLovesYou Inc. is a registered 501(c)(3) nonprofit, and our site says donations are tax-deductible. Whether you can deduct a gift depends on your own situation, so please check with a tax advisor. For a receipt or a question about your gift, email ' + EMAIL + '. I can\'t give tax advice.',
            es: 'LissLovesYou Inc. es una organización 501(c)(3) registrada y nuestro sitio indica que las donaciones son deducibles de impuestos. Si puedes deducir tu donación depende de tu situación personal, así que consulta a un asesor fiscal. Para un recibo o una pregunta sobre tu donación, escribe a ' + EMAIL + '. No puedo dar asesoría fiscal.'
        },
        {
            id: 'volunteer',
            chip: { en: 'How can I volunteer?', es: '¿Cómo puedo ser voluntario?' },
            words: ['volunteer', 'volunteering', 'mentor', 'mentorship', 'join', 'involved', 'help', 'skills', 'professional', 'internship', 'voluntario', 'voluntaria', 'voluntariado', 'mentoria', 'unirme', 'ayudar', 'participar', 'colaborar'],
            phrases: ['get involved', 'how can i help', 'cultural adjustment', 'ser voluntario', 'quiero ayudar', 'como puedo ayudar'],
            en: 'We would love your help! You can volunteer with cultural adjustment (helping newcomers navigate their new environment), mentorship (one-on-one guidance for young people), or by offering your professional skills. Fill out the inquiry form on the [Volunteer page](volunteer.html) and our team will be in touch. Sponsors and other kinds of support are welcome too.',
            es: '¡Nos encantaría tu ayuda! Puedes ser voluntario en adaptación cultural (ayudar a los recién llegados a orientarse en su nuevo entorno), mentoría (acompañamiento individual a jóvenes) o ofreciendo tus habilidades profesionales. Llena el formulario en la [página de voluntarios](volunteer.html) y nuestro equipo se comunicará contigo. También agradecemos patrocinadores y otras formas de apoyo.'
        },
        {
            id: 'contact',
            chip: { en: 'How do I contact you?', es: '¿Cómo los contacto?' },
            words: ['contact', 'email', 'reach', 'message', 'talk', 'speak', 'person', 'human', 'staff', 'team', 'call', 'contacto', 'contactar', 'correo', 'escribir', 'hablar', 'persona', 'llamar', 'comunicar'],
            phrases: ['get in touch', 'talk to someone', 'speak to someone', 'hablar con alguien', 'ponerme en contacto'],
            en: 'The fastest way to reach our team is email: ' + EMAIL + '. You can also use the form on the [Contact page](contact.html). Our mailing address is 2923 Hope Valley St, West Palm Beach, Florida 33411.',
            es: 'La forma más rápida de comunicarte con nuestro equipo es por correo: ' + EMAIL + '. También puedes usar el formulario en la [página de contacto](contact.html). Nuestra dirección postal es 2923 Hope Valley St, West Palm Beach, Florida 33411.'
        },
        {
            id: 'location',
            weight: 2,
            chip: { en: 'Where are you located?', es: '¿Dónde están ubicados?' },
            words: ['where', 'located', 'location', 'address', 'office', 'florida', 'mail', 'visit', 'donde', 'ubicacion', 'ubicados', 'direccion', 'oficina', 'visitar'],
            phrases: ['where are you', 'donde estan', 'donde queda'],
            en: 'We are a Florida-based nonprofit. Our mailing address is 2923 Hope Valley St, West Palm Beach, Florida 33411. If you plan to visit or need to meet someone, please email ' + EMAIL + ' first.',
            es: 'Somos una organización con sede en Florida. Nuestra dirección postal es 2923 Hope Valley St, West Palm Beach, Florida 33411. Si piensas visitarnos o necesitas reunirte con alguien, escribe primero a ' + EMAIL + '.'
        },
        {
            id: 'legit',
            weight: 2,
            chip: { en: 'Are you a registered nonprofit?', es: '¿Son una organización registrada?' },
            words: ['legit', 'legitimate', 'registered', 'registration', '501', 'verify', 'trust', 'scam', 'official', 'financial', 'fdacs', 'registrada', 'registro', 'confiable', 'estafa', 'oficial', 'verificar'],
            phrases: ['501c3', '501 c 3', 'is this real', 'es real', 'son confiables'],
            en: 'Yes. LissLovesYou Inc. is a registered 501(c)(3) nonprofit in Florida (registration CH80883). A copy of the official registration and financial information may be obtained from the Florida Division of Consumer Services by calling toll-free within Florida 1-800-435-7352 or at FDACS.gov. Registration does not imply endorsement, approval, or recommendation by the state.',
            es: 'Sí. LissLovesYou Inc. es una organización 501(c)(3) registrada en Florida (registro CH80883). Puedes obtener una copia del registro oficial e información financiera en la División de Servicios al Consumidor de Florida, llamando gratis dentro del estado al 1-800-435-7352 o en FDACS.gov. El registro no implica respaldo, aprobación ni recomendación del estado.'
        },
        {
            id: 'founder',
            weight: 2,
            chip: { en: 'Who runs LissLovesYou?', es: '¿Quién dirige LissLovesYou?' },
            words: ['founder', 'founded', 'president', 'lissette', 'liss', 'owner', 'director', 'leader', 'fundadora', 'presidenta', 'dueña', 'dirige', 'lider'],
            phrases: ['who runs', 'who started', 'who owns', 'quien dirige', 'quien fundo'],
            en: 'LissLovesYou was founded by Lissette, who serves as Founder and President. To reach her or the team, email ' + EMAIL + '.',
            es: 'LissLovesYou fue fundada por Lissette, quien es la Fundadora y Presidenta. Para comunicarte con ella o con el equipo, escribe a ' + EMAIL + '.'
        },
        {
            id: 'help-needed',
            chip: { en: 'My family needs help', es: 'Mi familia necesita ayuda' },
            words: ['need', 'needs', 'assistance', 'refugee', 'immigrant', 'migrant', 'child', 'kid', 'family', 'apply', 'necesito', 'necesita', 'asistencia', 'refugiado', 'inmigrante', 'migrante', 'familia', 'solicitar', 'hijo', 'hija'],
            phrases: ['i need help', 'we need help', 'my child', 'my family', 'necesito ayuda', 'mi familia', 'mi hijo', 'mi hija'],
            en: 'I\'m sorry you are going through a hard time. I\'m an automated helper and don\'t have information about eligibility or how to apply for services, so please email our team at ' + EMAIL + ' and tell them what you need. If anyone is in immediate danger, call 911.',
            es: 'Lamento que estés pasando por un momento difícil. Soy un asistente automático y no tengo información sobre requisitos o cómo solicitar servicios, así que escribe a nuestro equipo a ' + EMAIL + ' y cuéntales lo que necesitas. Si alguien está en peligro inmediato, llama al 911.'
        },
        {
            id: 'accessibility',
            weight: 2,
            chip: { en: 'Accessibility on this site', es: 'Accesibilidad del sitio' },
            words: ['accessibility', 'accessible', 'disability', 'disabled', 'blind', 'deaf', 'screen', 'reader', 'contrast', 'keyboard', 'zoom', 'accesibilidad', 'accesible', 'discapacidad', 'ciego', 'sordo', 'contraste', 'teclado'],
            phrases: ['screen reader', 'high contrast', 'alto contraste'],
            en: 'We want everyone to be able to use this site. It works with keyboards and screen readers, and there is a "High contrast" switch at the bottom of every page. Read our [Accessibility Statement](accessibility.html). If you find a barrier, please tell us at ' + EMAIL + ' and we will help you another way.',
            es: 'Queremos que todas las personas puedan usar este sitio. Funciona con teclado y lectores de pantalla, y hay un interruptor de "Alto contraste" al final de cada página. Lee nuestra [Declaración de Accesibilidad](accessibility.html). Si encuentras una barrera, avísanos en ' + EMAIL + ' y te ayudaremos de otra manera.'
        },
        {
            id: 'policies',
            weight: 2,
            chip: { en: 'Privacy, terms and refunds', es: 'Privacidad, términos y reembolsos' },
            words: ['privacy', 'terms', 'policy', 'policies', 'refund', 'refunds', 'legal', 'safe', 'browsing', 'data', 'privacidad', 'terminos', 'politica', 'reembolso', 'reembolsos', 'datos'],
            phrases: ['refund policy', 'privacy policy', 'terms of use', 'politica de privacidad', 'politica de reembolso'],
            en: 'You can read our [Privacy Policy](privacy-policy.html), [Terms of Use](terms-of-use.html), [Refund Policy](refund-policy.html), and [Safe Browsing notice](safe-browsing.html). For a question about a specific donation or refund, email ' + EMAIL + '.',
            es: 'Puedes leer nuestra [Política de Privacidad](privacy-policy.html), los [Términos de Uso](terms-of-use.html), la [Política de Reembolsos](refund-policy.html) y el [Aviso de Navegación Segura](safe-browsing.html). Para una pregunta sobre una donación o reembolso específico, escribe a ' + EMAIL + '.'
        },
        {
            id: 'partner',
            chip: { en: 'Partnerships and events', es: 'Alianzas y eventos' },
            words: ['partner', 'partnership', 'collaborate', 'collaboration', 'event', 'events', 'press', 'media', 'news', 'speaker', 'school', 'company', 'business', 'alianza', 'alianzas', 'colaborar', 'evento', 'eventos', 'prensa', 'noticias', 'empresa'],
            phrases: ['work together', 'trabajar juntos'],
            en: 'Thank you for your interest! I don\'t have information about upcoming events, news, or partnerships. Please email ' + EMAIL + ' with your idea and our team will reply. You can also find us through the social media icons at the bottom of any page.',
            es: '¡Gracias por tu interés! No tengo información sobre próximos eventos, noticias ni alianzas. Escribe a ' + EMAIL + ' con tu idea y nuestro equipo te responderá. También puedes encontrarnos en las redes sociales, con los íconos al final de cualquier página.'
        }
    ];

    const SMALLTALK = [
        {
            id: 'hello',
            words: ['hello', 'hi', 'hey', 'hola', 'buenas', 'saludos'],
            exact: true,
            en: 'Hello! I\'m Amour. Ask me about our mission, donating, volunteering, or contacting us.',
            es: '¡Hola! Soy Amour. Pregúntame sobre nuestra misión, cómo donar, ser voluntario o contactarnos.'
        },
        {
            id: 'thanks',
            words: ['thanks', 'thank', 'thx', 'gracias'],
            exact: true,
            en: 'You\'re welcome! Is there anything else I can help you with?',
            es: '¡De nada! ¿Hay algo más en lo que pueda ayudarte?'
        },
        {
            id: 'who-are-you',
            phrases: ['who are you', 'what are you', 'are you a robot', 'are you real', 'are you human', 'are you a bot', 'are you ai', 'what is amour', 'quien eres', 'eres un robot', 'eres una persona', 'que eres', 'eres real'],
            en: 'I\'m Amour, an automated helper for this website. I\'m not a person, and I don\'t use artificial intelligence to write replies: I match your question to answers prepared from the LissLovesYou website. I can make mistakes, and for anything important please email ' + EMAIL + '.',
            es: 'Soy Amour, un asistente automático de este sitio web. No soy una persona y no uso inteligencia artificial para escribir respuestas: relaciono tu pregunta con respuestas preparadas a partir del sitio de LissLovesYou. Puedo equivocarme; para algo importante, escribe a ' + EMAIL + '.'
        }
    ];

    const EMERGENCY = {
        words: ['emergency', 'danger', 'abuse', 'abused', 'hurt', 'unsafe', 'trafficking', 'suicide', 'kill', 'emergencia', 'peligro', 'abuso', 'maltrato', 'suicidio', 'trata'],
        phrases: ['in danger', 'hurting me', 'want to die', 'en peligro', 'quiero morir'],
        en: 'If anyone is in immediate danger, please call 911 right now. If you or someone you know is in crisis, you can call or text 988 (Suicide & Crisis Lifeline, United States). I\'m an automated helper and can\'t respond to emergencies. To reach our team, email ' + EMAIL + '.',
        es: 'Si alguien está en peligro inmediato, llama al 911 ahora mismo. Si tú o alguien que conoces está en crisis, puedes llamar o enviar un mensaje de texto al 988 (Línea de Prevención del Suicidio y Crisis, Estados Unidos). Soy un asistente automático y no puedo atender emergencias. Para comunicarte con nuestro equipo, escribe a ' + EMAIL + '.'
    };

    const FALLBACK = {
        en: 'I\'m not sure about that one. I can help with our mission and programs, donating, volunteering, and how to contact us. For anything else, please email ' + EMAIL + ' and our team will reply.',
        es: 'No estoy seguro de eso. Puedo ayudarte con nuestra misión y programas, cómo donar, ser voluntario y cómo contactarnos. Para otras preguntas, escribe a ' + EMAIL + ' y nuestro equipo te responderá.'
    };

    const SPANISH_MARKERS = ['hola', 'como', 'puedo', 'quiero', 'donde', 'que', 'cual', 'cuando', 'para', 'ustedes', 'gracias', 'ayuda', 'ayudar', 'necesito', 'los', 'las', 'una', 'por', 'favor', 'mi', 'son', 'hacen', 'tienen', 'donar', 'voluntario', 'ninos', 'nino', 'quienes', 'cuanto', 'esta', 'estan', 'hay', 'si', 'puedes', 'pueden', 'buenas', 'saludos', 'eres', 'es', 'de', 'del', 'en', 'la', 'el', 'tu', 'su'];

    // -------------------------------------------------------------------------
    // Matching
    // -------------------------------------------------------------------------
    const normalize = (text) => text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();

    const stem = (w) => {
        if (w.length > 5 && w.endsWith('ing')) return w.slice(0, -3);
        if (w.length > 4 && w.endsWith('ies')) return w.slice(0, -3) + 'y';
        if (w.length > 4 && w.endsWith('es')) return w.slice(0, -2);
        if (w.length > 4 && w.endsWith('ed')) return w.slice(0, -2);
        if (w.length > 3 && w.endsWith('s')) return w.slice(0, -1);
        return w;
    };

    const stems = (list) => new Set((list || []).map(w => stem(normalize(w))));

    function prepare(entry) {
        entry._stems = stems(entry.words);
        entry._phrases = (entry.phrases || []).map(normalize);
        return entry;
    }
    ANSWERS.forEach(prepare);
    SMALLTALK.forEach(prepare);
    prepare(EMERGENCY);

    function score(entry, tokenStems, normalized) {
        let s = 0;
        tokenStems.forEach(t => { if (entry._stems.has(t)) s += entry.weight || 1; });
        entry._phrases.forEach(p => { if (p && (' ' + normalized + ' ').includes(' ' + p + ' ')) s += 3; });
        return s;
    }

    function detectLanguage(tokens, raw) {
        if (/[\u00bf\u00a1\u00f1\u00e1\u00e9\u00ed\u00f3\u00fa]/i.test(raw)) return 'es';
        let es = 0;
        tokens.forEach(t => { if (SPANISH_MARKERS.includes(t)) es += 1; });
        return es >= 1 && es >= tokens.length * 0.25 ? 'es' : 'en';
    }

    function respond(question, previousLang) {
        const normalized = normalize(question);
        const tokens = normalized.split(' ').filter(Boolean);
        const tokenStems = tokens.map(stem);
        let lang = detectLanguage(tokens, question);
        if (lang === 'en' && previousLang === 'es' && tokens.length <= 3) lang = 'es'; // short follow-ups stay in Spanish

        // Safety first.
        if (score(EMERGENCY, tokenStems, normalized) >= 1) return { lang, text: EMERGENCY[lang], id: 'emergency' };

        // Greetings, thanks, "who are you" (only when the message is short, so real questions still get answers).
        for (const t of SMALLTALK) {
            if (t.exact) {
                if (tokens.length <= 3 && score(t, tokenStems, normalized) >= 1 && !ANSWERS.some(a => score(a, tokenStems, normalized) >= 1)) return { lang, text: t[lang], id: t.id };
            } else if (score(t, tokenStems, normalized) >= 3) {
                return { lang, text: t[lang], id: t.id };
            }
        }

        let best = null, bestScore = 0;
        ANSWERS.forEach(a => {
            const s = score(a, tokenStems, normalized);
            if (s > bestScore) { best = a; bestScore = s; }
        });
        if (best && bestScore >= 1) return { lang, text: best[lang], id: best.id, entry: best };
        return { lang, text: FALLBACK[lang], id: 'fallback' };
    }

    // -------------------------------------------------------------------------
    // Widget
    // -------------------------------------------------------------------------
    const el = (tag, attrs, text) => {
        const node = document.createElement(tag);
        Object.entries(attrs || {}).forEach(([k, v]) => node.setAttribute(k, v));
        if (text) node.textContent = text;
        return node;
    };

    // Render text with [label](link) links and bare emails/URLs as real links. Never uses innerHTML.
    function appendLinked(parent, text) {
        const re = /\[([^\]]+)\]\(([^)]+)\)|(https?:\/\/[^\s<>"]+[^\s<>".,;:!?)])|([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g;
        let last = 0, m;
        while ((m = re.exec(text)) !== null) {
            if (m.index > last) parent.appendChild(document.createTextNode(text.slice(last, m.index)));
            let label, href;
            if (m[1]) { label = m[1]; href = m[2]; }
            else if (m[3]) { label = m[3]; href = m[3]; }
            else { label = m[4]; href = 'mailto:' + m[4]; }
            const a = el('a', { href }, label);
            if (/^https?:/i.test(href)) {
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
                a.appendChild(el('span', { class: 'visually-hidden' }, ' (opens in a new tab)'));
            }
            parent.appendChild(a);
            last = m.index + m[0].length;
        }
        if (last < text.length) parent.appendChild(document.createTextNode(text.slice(last)));
    }

    const root = el('div', { class: 'chat-widget' });

    const launcher = el('button', { type: 'button', class: 'chat-launcher', 'aria-expanded': 'false', 'aria-controls': 'chat-panel' });
    launcher.appendChild(el('span', { class: 'chat-launcher-icon', 'aria-hidden': 'true' }, '\u{1F4AC}'));
    launcher.appendChild(el('span', { class: 'chat-launcher-label' }, 'Ask Amour'));

    const panel = el('section', { id: 'chat-panel', class: 'chat-panel', role: 'dialog', 'aria-labelledby': 'chat-title', hidden: '' });

    const header = el('div', { class: 'chat-header' });
    header.appendChild(el('h2', { id: 'chat-title', class: 'chat-title' }, 'Ask Amour'));
    const closeBtn = el('button', { type: 'button', class: 'chat-close', 'aria-label': 'Close chat with Amour' });
    closeBtn.appendChild(el('span', { 'aria-hidden': 'true' }, '×'));
    header.appendChild(closeBtn);

    const notice = el('p', { class: 'chat-notice' },
        'Amour is an automated helper, not a person. It only knows what is on this website and can make mistakes. ' +
        'What you type stays in your browser. Please don’t share personal or payment details.');

    const log = el('div', { class: 'chat-log', role: 'log', 'aria-live': 'polite', 'aria-relevant': 'additions' });

    const form = el('form', { class: 'chat-form', autocomplete: 'off' });
    const label = el('label', { for: 'chat-input', class: 'visually-hidden' }, 'Type your question for Amour');
    const input = el('input', { id: 'chat-input', class: 'chat-input', type: 'text', maxlength: '300', placeholder: 'Type your question', enterkeyhint: 'send' });
    const send = el('button', { type: 'submit', class: 'chat-send' }, 'Send');
    form.append(label, input, send);

    panel.append(header, notice, log, form);
    root.append(launcher, panel);
    document.body.appendChild(root);

    let lang = 'en';
    let chips = null;

    function addMessage(role, text) {
        const wrap = el('div', { class: 'chat-msg chat-msg--' + role });
        wrap.appendChild(el('span', { class: 'visually-hidden' }, role === 'user' ? 'You: ' : 'Amour: '));
        const body = el('span', { class: 'chat-bubble' });
        if (role === 'assistant') appendLinked(body, text); else body.textContent = text;
        wrap.appendChild(body);
        log.appendChild(wrap);
        return wrap;
    }

    // A few tappable suggestions after each answer, so no one has to type.
    function addChips(excludeId) {
        if (chips) chips.remove();
        const pool = ANSWERS.filter(a => a.id !== excludeId && a.chip);
        const picks = excludeId === 'start'
            ? ['about', 'donate', 'volunteer', 'contact'].map(id => ANSWERS.find(a => a.id === id))
            : pool.sort(() => Math.random() - 0.5).slice(0, 3);
        chips = el('div', { class: 'chat-suggestions', role: 'group', 'aria-label': lang === 'es' ? 'Preguntas sugeridas' : 'Suggested questions' });
        picks.forEach(a => {
            const text = a.chip[lang];
            const b = el('button', { type: 'button', class: 'chat-suggestion' }, text);
            b.addEventListener('click', () => ask(text));
            chips.appendChild(b);
        });
        log.appendChild(chips);
    }

    function ask(question) {
        question = (question || '').trim();
        if (!question) return;
        if (chips) { chips.remove(); chips = null; }
        addMessage('user', question);
        input.value = '';
        const result = respond(question, lang);
        lang = result.lang;
        addMessage('assistant', result.text);
        addChips(result.id);
        const lastAnswer = log.querySelectorAll('.chat-msg--assistant');
        // Keep the start of the new answer in view (not the bottom of the chips), so it is easy to read.
        lastAnswer[lastAnswer.length - 1].scrollIntoView({ block: 'start' });
        input.focus();
    }

    function setOpen(open, returnFocus) {
        panel.hidden = !open;
        launcher.setAttribute('aria-expanded', String(open));
        root.classList.toggle('is-open', open);
        if (open) {
            if (!log.children.length) {
                addMessage('assistant', 'Hi, I’m Amour! I can answer questions about LissLovesYou, donating, volunteering, and how to reach us. También respondo en español. What would you like to know?');
                addChips('start');
                log.scrollTop = 0;
            }
            input.focus();
        } else if (returnFocus) {
            launcher.focus();
        }
    }

    launcher.addEventListener('click', () => setOpen(panel.hidden, false));
    closeBtn.addEventListener('click', () => setOpen(false, true));
    form.addEventListener('submit', (e) => { e.preventDefault(); ask(input.value); });
    panel.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') { e.stopPropagation(); setOpen(false, true); }
    });
})();
