// LissLovesYou site scripts (accessibility-reviewed)

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
if (navbar) {
    const updateNavbar = () => navbar.classList.toggle('scrolled', window.scrollY > 50);
    window.addEventListener('scroll', updateNavbar, { passive: true });
    updateNavbar();
}

// Mobile menu toggle (keeps aria-expanded in sync, closes with Escape)
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuToggle && navLinks) {
    const setMenu = (open, returnFocus) => {
        mobileMenuToggle.classList.toggle('active', open);
        navLinks.classList.toggle('active', open);
        mobileMenuToggle.setAttribute('aria-expanded', String(open));
        if (!open && returnFocus) {
            mobileMenuToggle.focus();
        }
    };

    mobileMenuToggle.addEventListener('click', () => {
        setMenu(!navLinks.classList.contains('active'));
    });

    // Close menu when choosing a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => setMenu(false));
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenuToggle.contains(e.target) && !navLinks.contains(e.target)) {
            setMenu(false);
        }
    });

    // Close menu with the Escape key and return focus to the toggle button
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            setMenu(false, true);
        }
    });

    // Reset when the window grows to the desktop layout
    const desktopQuery = window.matchMedia('(min-width: 969px)');
    const onDesktopChange = (e) => { if (e.matches) { setMenu(false); } };
    if (desktopQuery.addEventListener) {
        desktopQuery.addEventListener('change', onDesktopChange);
    } else if (desktopQuery.addListener) {
        desktopQuery.addListener(onDesktopChange);
    }
}

// Scroll to top button
const scrollToTopBtn = document.getElementById('scrollToTop');
if (scrollToTopBtn) {
    const updateScrollBtn = () => {
        scrollToTopBtn.style.display = window.pageYOffset > 300 ? 'flex' : 'none';
    };
    window.addEventListener('scroll', updateScrollBtn, { passive: true });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion.matches ? 'auto' : 'smooth' });
        // The button hides itself at the top of the page, so move keyboard focus somewhere sensible
        const firstLink = document.querySelector('.skip-link') || document.querySelector('.navbar a');
        if (firstLink) {
            firstLink.focus({ preventScroll: true });
        }
    });
}

// Copy wallet address buttons (crypto page), with announcements for screen readers
function announceStatus(message) {
    let live = document.getElementById('copy-status');
    if (!live) {
        live = document.createElement('p');
        live.id = 'copy-status';
        live.className = 'visually-hidden';
        live.setAttribute('role', 'status');
        live.setAttribute('aria-live', 'polite');
        document.body.appendChild(live);
    }
    live.textContent = '';
    window.setTimeout(() => { live.textContent = message; }, 50);
}

function copyAddress(elementId, button) {
    const el = document.getElementById(elementId);
    if (!el) { return; }
    const text = el.textContent.trim();
    const coin = (button && button.dataset.copyLabel) || 'Wallet';

    const finish = (ok) => {
        if (ok) {
            announceStatus(coin + ' wallet address copied to the clipboard.');
        } else {
            announceStatus('Could not copy automatically. Please select the ' + coin +
                ' wallet address text on the page and copy it manually.');
        }
        if (button) {
            const original = button.dataset.originalText || button.textContent;
            button.dataset.originalText = original;
            button.textContent = ok ? 'Copied!' : 'Copy failed - select text instead';
            window.setTimeout(() => { button.textContent = original; }, 2500);
        }
    };

    const fallbackCopy = () => {
        try {
            const range = document.createRange();
            range.selectNodeContents(el);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            const ok = document.execCommand('copy');
            selection.removeAllRanges();
            finish(ok);
        } catch (err) {
            finish(false);
        }
    };

    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => finish(true), fallbackCopy);
    } else {
        fallbackCopy();
    }
}

document.querySelectorAll('[data-copy-target]').forEach(btn => {
    btn.addEventListener('click', () => copyAddress(btn.dataset.copyTarget, btn));
});


// Optional high-contrast mode: off by default; remembers the visitor's choice and
// switches on automatically when their device asks for more contrast.
(function () {
    const root = document.documentElement;
    const buttons = document.querySelectorAll('.contrast-toggle');
    let stored = null;
    try { stored = localStorage.getItem('high-contrast'); } catch (e) { /* storage unavailable */ }
    const wantsMore = window.matchMedia && window.matchMedia('(prefers-contrast: more)').matches;
    const apply = (on) => {
        root.classList.toggle('high-contrast', on);
        buttons.forEach(b => {
            b.setAttribute('aria-pressed', String(on));
            b.textContent = on ? 'High contrast: on' : 'High contrast: off';
        });
    };
    apply(stored === null ? wantsMore : stored === 'on');
    buttons.forEach(b => b.addEventListener('click', () => {
        const on = !root.classList.contains('high-contrast');
        apply(on);
        try { localStorage.setItem('high-contrast', on ? 'on' : 'off'); } catch (e) { /* ignore */ }
    }));
})();
