// ---------- mobile nav ----------
const navToggle = document.querySelector('.nav__toggle');
const nav = document.querySelector('.nav');
if (navToggle) {
    navToggle.addEventListener('click', () => {
        nav.classList.toggle('is-open');
    });
    document.querySelectorAll('.nav__links a').forEach(a => {
        a.addEventListener('click', () => nav.classList.remove('is-open'));
    });
}

// ---------- scroll reveal ----------
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
} else {
    revealEls.forEach(el => el.classList.add('is-visible'));
}

// ---------- skill bars ----------
const bars = document.querySelectorAll('.bar-fill');
if ('IntersectionObserver' in window && bars.length) {
    const barIo = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.width = entry.target.dataset.value + '%';
                barIo.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });
    bars.forEach(b => barIo.observe(b));
}

// ---------- terminal typing effect ----------
const terminalBody = document.querySelector('[data-terminal]');
if (terminalBody) {
    const lines = [
        { html: '<span class="c-key">class</span> <span class="c-class">HounmenouJohn</span> <span class="c-key">extends</span> <span class="c-class">Developer</span>', pause: 200 },
        { html: '{', pause: 120 },
        { html: '&nbsp;&nbsp;<span class="c-key">protected</span> $stack = [', pause: 60 },
        { html: '&nbsp;&nbsp;&nbsp;&nbsp;<span class="c-str">\'PHP\'</span>, <span class="c-str">\'Laravel\'</span>, <span class="c-str">\'MySQL\'</span>,', pause: 60 },
        { html: '&nbsp;&nbsp;&nbsp;&nbsp;<span class="c-str">\'Vue.js\'</span>, <span class="c-str">\'REST API\'</span>', pause: 60 },
        { html: '&nbsp;&nbsp;];', pause: 160 },
        { html: '', pause: 80 },
        { html: '&nbsp;&nbsp;<span class="c-com">// École 229 · Godomey-Togoudo, Bénin</span>', pause: 120 },
        { html: '&nbsp;&nbsp;<span class="c-key">public function</span> <span class="c-fn">buildSomethingUseful</span>() {', pause: 100 },
        { html: '&nbsp;&nbsp;&nbsp;&nbsp;<span class="c-key">return</span> <span class="c-str">\'des systèmes qui résolvent de vrais problèmes.\'</span>;', pause: 100 },
        { html: '&nbsp;&nbsp;}', pause: 80 },
        { html: '}', pause: 0 },
    ];

    let lineIndex = 0;
    function typeNextLine() {
        if (lineIndex >= lines.length) {
            const cursor = document.createElement('span');
            cursor.className = 'cursor';
            terminalBody.appendChild(cursor);
            return;
        }
        const row = document.createElement('div');
        terminalBody.appendChild(row);
        const target = lines[lineIndex].html;
        row.innerHTML = target;
        row.style.opacity = '0';
        requestAnimationFrame(() => {
            row.style.transition = 'opacity .15s ease';
            row.style.opacity = '1';
        });
        lineIndex++;
        setTimeout(typeNextLine, lines[lineIndex - 1].pause + 90);
    }
    typeNextLine();
}

// ---------- active nav link ----------
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav__links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        a.classList.add('is-active');
    }
});

// ---------- contact form (static demo) ----------
const contactForm = document.querySelector('[data-contact-form]');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button[type="submit"]');
        const original = btn.textContent;
        btn.textContent = 'Message envoyé ✓';
        contactForm.reset();
        setTimeout(() => { btn.textContent = original; }, 2600);
    });
}