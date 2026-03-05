/**
 * ============================================================
 * NOVA CODICE — main.js  (v2 - optimizado)
 * ============================================================
 */

'use strict';

// ============================================================
// 1. NAVBAR — efecto scroll
// ============================================================
const navbar = document.getElementById('navbar');

function handleNavbarScroll() {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}

window.addEventListener('scroll', handleNavbarScroll, { passive: true });
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
// 4. ACTIVE NAV LINK
// ============================================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');

function updateActiveLink() {
  const scrollPos = window.scrollY + navbar.offsetHeight + 120;
  let current = '';
  sections.forEach(sec => {
    if (scrollPos >= sec.offsetTop) current = sec.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.toggle('active-nav', link.getAttribute('href') === `#${current}`);
  });
}

window.addEventListener('scroll', updateActiveLink, { passive: true });


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
// 7. COUNTER ANIMATION
// ============================================================
let countersStarted = false;
const statNumbers = document.querySelectorAll('.stat-number[data-count]');

function animateCounters() {
  if (countersStarted) return;
  countersStarted = true;

  statNumbers.forEach(el => {
    const target = parseInt(el.dataset.count, 10);
    const totalFrames = Math.round(2000 / (1000 / 60));
    let frame = 0;

    const easeOut = t => t * (2 - t);
    const timer = setInterval(() => {
      frame++;
      el.textContent = Math.round(target * easeOut(frame / totalFrames));
      if (frame >= totalFrames) { el.textContent = target; clearInterval(timer); }
    }, 1000 / 60);
  });
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
// 9. BG ORBS — fade-in al cargar + rotación suave al scrollear
//    Los orbs son elipses ancladas a su sección (position:absolute).
//    La rotación las hace "moverse" sin que cambien de lugar.
// ============================================================
(function initBgOrbs() {
  const orbs = document.querySelectorAll('.bg-orb');
  if (!orbs.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    orbs.forEach((o, i) => { o.style.opacity = '0.22'; });
    return;
  }

  // Opacidad estática de cada orb (sutiles)
  const opacity = [0.28, 0.24, 0.26, 0.22, 0.20];

  // Rotación base de cada orb (ángulo inicial distinto para variedad)
  const baseRot = [12, -20, 35, -10, 50];

  // Cuántos grados rota por cada 1000px scrolleados (lento = sutil)
  const rotSpeed = [0.025, -0.020, 0.018, -0.022, 0.015];

  // Fade-in suave y escalonado al cargar
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
      // Solo rotación — el orb no se mueve de su posición en la página
      orb.style.transform = `rotate(${deg.toFixed(2)}deg)`;
    });
  }

  window.addEventListener('scroll', updateOrbs, { passive: true });
  updateOrbs();
})();

// ============================================================
// 11. PARTICLE CANVAS — versión optimizada (sin conexiones)
// ============================================================
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d');
  let particles = [], animId, W, H;

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

  // Conexiones ligeras: solo entre partículas cercanas, con límite de pares
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
    // Máximo 45 partículas para buena performance en cualquier equipo
    const count = Math.min(45, Math.floor((W * H) / 18000));
    particles = Array.from({ length: count }, () => new Dot());
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    animId = requestAnimationFrame(animate);
  }

  resize(); init(); animate();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(animId);
    else animate();
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { resize(); init(); }, 250);
  }, { passive: true });
})();


// ============================================================
// 10. FORM — validación y feedback
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

    // Restaurar si no hubo redirección
    setTimeout(() => {
      if (submitBtn.disabled) {
        if (btnText) btnText.textContent = 'Enviar consulta';
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
      }
    }, 7000);
  });

  // Limpiar error al escribir
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
