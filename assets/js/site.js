// ThisIsTea showcase: scroll reveals, lesson tabs, and the four-step mini demo.
(() => {
    'use strict';

    /* ---------- Reveal on scroll ---------- */
    const reveal = document.querySelectorAll('.reveal, .ladder');
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        reveal.forEach((el) => io.observe(el));
    } else {
        reveal.forEach((el) => el.classList.add('in'));
    }

    /* ---------- Lesson tabs ---------- */
    const tabs = [...document.querySelectorAll('[role="tab"]')];
    const select = (tab) => {
        tabs.forEach((t) => {
            const on = t === tab;
            t.setAttribute('aria-selected', String(on));
            t.tabIndex = on ? 0 : -1;
            const id = t.getAttribute('aria-controls');
            document.getElementById(id).hidden = !on;
            document.querySelector(`.tab-caption[data-for="${id}"]`).hidden = !on;
        });
    };
    tabs.forEach((t, i) => {
        t.addEventListener('click', () => select(t));
        t.addEventListener('keydown', (e) => {
            const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
            if (!d) return;
            const next = tabs[(i + d + tabs.length) % tabs.length];
            select(next); next.focus();
        });
    });

    /* ---------- Mini demo (content from content/items/email/email-parcel-fee-01.en.json) ---------- */
    const STEPS = [
        {
            key: 'who', tag: 'WHO', q: 'Who is really writing?',
            choices: ["ParcelPoint's delivery team", 'Someone using a lookalike address', 'The shop you ordered from'],
            correct: 1,
            spider: 'Ah, you read past the name… Most people stop at “ParcelPoint”.',
            why: "The address is on parcelpoint-fees.example, not ParcelPoint's own domain, parcelpoint.example.",
        },
        {
            key: 'emotion', tag: 'FEELING', q: 'What feeling is it pushing?',
            choices: ['None: it is a plain notice', 'Greed for a free gift', 'Hurry: pay within 24 hours or lose the parcel'],
            correct: 2,
            spider: 'A short clock and a small loss. Hurry makes careful people careless.',
            why: '“Within 24 hours” is there to rush you. The tiny fee makes paying feel harmless.',
        },
        {
            key: 'ask', tag: 'ASK', q: 'What exactly does it want you to do?',
            choices: ['Reply with your address', 'Pay a small fee through a link', 'Collect the parcel from a neighbour'],
            correct: 1,
            spider: 'CHF 1.99 is the bait. Your card number is the catch.',
            why: 'The page would ask for your card details. A real carrier does not collect fees through a link in a message.',
        },
        {
            key: 'verify', tag: 'CHECK', q: 'How do you check, through a channel you control?',
            choices: ['Reply STOP so they take you off the list', 'Pay it, it is only CHF 1.99', 'Open the ParcelPoint app yourself and look'],
            correct: 2,
            spider: 'Walk in through a door you already know… and I have nothing.',
            why: 'Never use the path they hand you. Replying STOP only confirms your address is live.',
        },
    ];

    const body = document.getElementById('quiz-body');
    const marks = [...document.querySelectorAll('#quiz-progress span')];
    const email = document.getElementById('demo-email');
    if (!body) return;

    const spiderImg = 'assets/img/guides/spider.webp';
    let step = 0, firstTry = 0, missed = false;

    const el = (tag, attrs = {}, ...kids) => {
        const n = document.createElement(tag);
        Object.entries(attrs).forEach(([k, v]) => (k === 'class' ? (n.className = v) : n.setAttribute(k, v)));
        kids.forEach((k) => n.append(k));
        return n;
    };

    const light = (key) => {
        email.querySelectorAll('[data-flag]').forEach((f) => f.classList.toggle('lit', f.dataset.flag === key));
    };

    function render() {
        marks.forEach((m, i) => { m.className = i < step ? 'done' : i === step ? 'now' : ''; });
        body.replaceChildren();
        if (step >= STEPS.length) return finish();

        const s = STEPS[step];
        missed = false;
        body.append(el('span', { class: 'q-tag' }, s.tag), el('h3', {}, s.q));
        const list = el('div', { role: 'group', 'aria-label': s.q });
        s.choices.forEach((c, i) => {
            const b = el('button', { class: 'choice', type: 'button' }, el('span', { class: 'mark', 'aria-hidden': 'true' }), c);
            b.addEventListener('click', () => answer(s, i, b, list));
            list.append(b);
        });
        body.append(list);
    }

    function answer(s, i, btn, list) {
        if (i !== s.correct) {
            btn.classList.add('wrong'); btn.disabled = true;
            btn.querySelector('.mark').textContent = '✕';
            missed = true;
            return;
        }
        if (!missed) firstTry++;
        btn.classList.add('right'); btn.querySelector('.mark').textContent = '✓';
        list.querySelectorAll('button').forEach((b) => (b.disabled = true));
        light(s.key);

        const fb = el('div', { class: 'quiz-feedback' },
            el('img', { src: spiderImg, alt: 'Spider' }),
            el('div', {}, el('p', {}, s.spider), el('p', { class: 'plain' }, s.why)));
        const next = el('button', { class: 'btn btn-go btn-sm', type: 'button' }, step < STEPS.length - 1 ? 'Next step' : 'See how you did');
        next.addEventListener('click', () => { step++; render(); });
        body.append(fb, el('div', { class: 'quiz-actions' }, next));
        next.focus({ preventScroll: true });
    }

    function finish() {
        email.querySelectorAll('[data-flag]').forEach((f) => f.classList.add('lit'));
        const perfect = firstTry === STEPS.length;
        const again = el('button', { class: 'btn btn-sm', type: 'button' }, 'Try again');
        again.addEventListener('click', () => {
            step = 0; firstTry = 0;
            email.querySelectorAll('[data-flag]').forEach((f) => f.classList.remove('lit'));
            render();
        });
        body.append(el('div', { class: 'quiz-done' },
            el('div', { class: 'score' }, `${firstTry}/4`),
            el('p', {}, perfect ? 'Every step on the first try. Bernard would be proud.' : 'Steps right on the first try. In the app, the ones you missed keep their prompts a little longer.'),
            el('div', { class: 'quiz-feedback', style: 'justify-content:center;text-align:left;margin-top:1.2rem' },
                el('img', { src: spiderImg, alt: 'Spider' }),
                el('p', {}, perfect ? 'Hmph. Next time I will write in a different coat of paint…' : 'No harm done. That is how everyone learns.')),
            el('div', { class: 'quiz-actions', style: 'justify-content:center' },
                el('a', { class: 'btn btn-go btn-sm', href: 'https://stygiansummer.github.io/Lauzhack/' }, 'Do the full lesson'), again)));
    }

    render();
})();
