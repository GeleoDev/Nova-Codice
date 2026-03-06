/**
 * ============================================================
 * NOVA CODICE — main.js  (v3 - performance optimizado)
 * ============================================================
 */

'use strict';

// ============================================================
// SCROLL SCHEDULER
// Un único listener de scroll que ejecuta todos los callbacks
// con throttle via requestAnimationFrame — evita trabajo duplicado
// ============================================================
let _scrollTicking = false;
const _scrollCbs = [];

function addScrollCallback(fn) { _scrollCbs.push(fn); }

window.addEventListener('scroll', () => {
  if (!_scrollTicking) {
    requestAnimationFrame(() => {
      _scrollCbs.forEach(fn => fn());
      _scrollTicking = false;
    });
    _scrollTicking = true;
  }
}, { passive: true });


// ============================================================
// 1. NAVBAR — efecto scroll
// ============================================================
const navbar = document.getElementById('navbar');

function handleNavbarScroll() {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}

addScrollCallback(handleNavbarScroll);
handleNavbarScroll();


// ============================================================
// 2. HAMBURGER MENU
// ============================================================
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.contains('active');
  hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('active');
  hamburger.setAttribute('aria-expanded', String(!isOpen));
  mobileMenu.setAttribute('aria-hidden', String(isOpen));
  document.body.style.overflow = !isOpen ? 'hidden' : '';
});

document.querySelectorAll('.mobile-menu a').forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMobileMenu();
});

function closeMobileMenu() {
  hamburger.classList.remove('active');
  mobileMenu.classList.remove('active');
  hamburger.setAttribute('aria-expanded', 'false');
  mobileMenu.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}


// ============================================================
// 3. SMOOTH SCROLL con offset del navbar
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const selector = this.getAttribute('href');
    if (!selector || selector === '#') return;
    const target = document.querySelector(selector);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


// ============================================================
// 4. ACTIVE NAV LINK — con offsets cacheados para evitar
//    layout thrashing en cada evento de scroll
// ============================================================
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a, .mobile-menu a');
let sectionOffsets = [];

function cacheSectionOffsets() {
  sectionOffsets = Array.from(sections).map(sec => ({
    id:  sec.getAttribute('id'),
    top: sec.offsetTop,
  }));
}

function updateActiveLink() {
  const scrollPos = window.scrollY + navbar.offsetHeight + 120;
  let current = '';
  for (const { id, top } of sectionOffsets) {
    if (scrollPos >= top) current = id;
  }
  navLinks.forEach(link => {
    link.classList.toggle('active-nav', link.getAttribute('href') === `#${current}`);
  });
}

cacheSectionOffsets();
addScrollCallback(updateActiveLink);

let _resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(_resizeTimer);
  _resizeTimer = setTimeout(cacheSectionOffsets, 250);
}, { passive: true });


// ============================================================
// 5. SCROLL ANIMATIONS (IntersectionObserver)
// ============================================================
const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      scrollObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.animate-on-scroll').forEach(el => scrollObserver.observe(el));


// ============================================================
// 6. ABOUT FEATURES — animación de entrada escalonada
// ============================================================
const aboutCard = document.querySelector('.about-card');
if (aboutCard) {
  const featObs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      entries[0].target.querySelectorAll('.about-feature').forEach((feat, i) => {
        feat.style.opacity = '0';
        feat.style.transform = 'translateX(-12px)';
        setTimeout(() => {
          feat.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
          feat.style.opacity = '1';
          feat.style.transform = 'translateX(0)';
        }, i * 150 + 350);
      });
      featObs.disconnect();
    }
  }, { threshold: 0.4 });
  featObs.observe(aboutCard);
}


// ============================================================
// 7. COUNTER ANIMATION — requestAnimationFrame en lugar de
//    setInterval para sincronizar con el ciclo de render
// ============================================================
let countersStarted = false;
const statNumbers = document.querySelectorAll('.stat-number[data-count]');

function animateCounters() {
  if (countersStarted) return;
  countersStarted = true;

  const duration = 2000;
  const startTs  = performance.now();
  const targets  = Array.from(statNumbers).map(el => parseInt(el.dataset.count, 10));

  function step(now) {
    const progress = Math.min((now - startTs) / duration, 1);
    const eased    = progress * (2 - progress);
    statNumbers.forEach((el, i) => { el.textContent = Math.round(targets[i] * eased); });
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      statNumbers.forEach((el, i) => { el.textContent = targets[i]; });
    }
  }

  requestAnimationFrame(step);
}

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
  const counterObs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) { setTimeout(animateCounters, 600); counterObs.disconnect(); }
  }, { threshold: 0.5 });
  counterObs.observe(heroStats);
}


// ============================================================
// 8. TAB SYSTEM
// ============================================================
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    document.getElementById(`tab-${btn.dataset.tab}`)?.classList.add('active');
  });
});


// ============================================================
// 9. BG ORBS — fade-in + rotación via scroll scheduler unificado
// ============================================================
(function initBgOrbs() {
  const orbs = document.querySelectorAll('.bg-orb');
  if (!orbs.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    orbs.forEach((o, i) => { o.style.opacity = String([0.28, 0.24, 0.26, 0.22, 0.20][i]); });
    return;
  }

  const opacity  = [0.28, 0.24, 0.26, 0.22, 0.20];
  const baseRot  = [12, -20, 35, -10, 50];
  const rotSpeed = [0.025, -0.020, 0.018, -0.022, 0.015];

  orbs.forEach((orb, i) => {
    orb.style.transition = `opacity 1.6s ease ${i * 0.2}s`;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      orb.style.opacity = String(opacity[i]);
    }));
  });

  function updateOrbs() {
    const sy = window.scrollY;
    orbs.forEach((orb, i) => {
      const deg = baseRot[i] + sy * rotSpeed[i];
      orb.style.transform = `rotate(${deg.toFixed(2)}deg)`;
    });
  }

  addScrollCallback(updateOrbs);
  updateOrbs();
})();


// ============================================================
// 10. PARTICLE CANVAS — se pausa automáticamente cuando el
//     hero sale del viewport (IntersectionObserver)
// ============================================================
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d');
  let particles = [], animId = null, W, H;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  class Dot {
    constructor() { this.reset(true); }
    reset(init) {
      this.x  = Math.random() * W;
      this.y  = init ? Math.random() * H : Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.r  = Math.random() * 1.6 + 0.4;
      this.a  = Math.random() * 0.4 + 0.07;
      this.c  = Math.random() > 0.55 ? '108,43,255' : '0,245,160';
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.c},${this.a})`;
      ctx.fill();
    }
  }

  function drawLines() {
    const maxDist = 100;
    const len = particles.length;
    for (let i = 0; i < len; i++) {
      for (let j = i + 1; j < len; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d2 = dx * dx + dy * dy;
        if (d2 < maxDist * maxDist) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(108,43,255,${0.1 * (1 - Math.sqrt(d2) / maxDist)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function init() {
    const count = Math.min(45, Math.floor((W * H) / 18000));
    particles = Array.from({ length: count }, () => new Dot());
  }

  function run() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    animId = requestAnimationFrame(run);
  }

  function stop() {
    if (animId !== null) { cancelAnimationFrame(animId); animId = null; }
  }

  resize(); init(); run();

  // Pausa el canvas cuando el hero abandona el viewport
  const heroSection = canvas.closest('section') ?? canvas.parentElement;
  new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) { if (animId === null) run(); }
    else stop();
  }, { threshold: 0 }).observe(heroSection);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else if (animId === null) run();
  });

  let _particleResizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(_particleResizeTimer);
    _particleResizeTimer = setTimeout(() => { resize(); init(); }, 250);
  }, { passive: true });
})();


// ============================================================
// 11. FORM — validación y feedback
// ============================================================
const contactForm = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');

if (contactForm && submitBtn) {
  contactForm.addEventListener('submit', function (e) {
    let valid = true;
    ['nombre', 'email', 'servicio', 'mensaje'].forEach(id => {
      const f = document.getElementById(id);
      if (!f || !f.value.trim()) {
        f.style.borderColor = 'rgba(255,80,80,0.55)';
        f.style.boxShadow   = '0 0 0 3px rgba(255,80,80,0.1)';
        valid = false;
      }
    });

    if (!valid) {
      e.preventDefault();
      const first = contactForm.querySelector('[style*="rgba(255,80,80"]');
      if (first) { first.focus(); first.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
      return;
    }

    const btnText = submitBtn.querySelector('.btn-text');
    if (btnText) btnText.textContent = 'Enviando...';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.75';

    setTimeout(() => {
      if (submitBtn.disabled) {
        if (btnText) btnText.textContent = 'Enviar consulta';
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
      }
    }, 7000);
  });

  contactForm.querySelectorAll('input, select, textarea').forEach(f => {
    f.addEventListener('input', () => {
      if (f.value.trim()) { f.style.borderColor = ''; f.style.boxShadow = ''; }
    });
  });
}


// ============================================================
// 12. HERO — forzar visibilidad al cargar
// ============================================================
window.addEventListener('load', () => {
  document.querySelectorAll('.hero .animate-on-scroll').forEach(el => {
    setTimeout(() => el.classList.add('visible'), 100);
  });
});
