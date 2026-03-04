/**
 * ============================================================
 * NOVA CODICE — main.js
 * Animaciones, interactividad y UX de la landing page.
 * ============================================================
 */

'use strict';

// ============================================================
// 1. NAVBAR — Efecto scroll y clase activa
// ============================================================
const navbar = document.getElementById('navbar');

function handleNavbarScroll() {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleNavbarScroll, { passive: true });
handleNavbarScroll(); // estado inicial


// ============================================================
// 2. HAMBURGER MENU — Apertura/cierre del menú mobile
// ============================================================
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.contains('active');

  hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('active');
  hamburger.setAttribute('aria-expanded', String(!isOpen));
  mobileMenu.setAttribute('aria-hidden', String(isOpen));
  document.body.style.overflow = !isOpen ? 'hidden' : '';
});

// Cerrar al hacer clic en cualquier link del menú mobile
document.querySelectorAll('.mobile-menu a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  });
});

// Cerrar al presionar Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
});


// ============================================================
// 3. SMOOTH SCROLL — Navegación suave con offset del navbar
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetSelector = this.getAttribute('href');
    if (!targetSelector || targetSelector === '#') return;

    const target = document.querySelector(targetSelector);
    if (!target) return;

    e.preventDefault();
    const navH = navbar.offsetHeight;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - navH;

    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  });
});


// ============================================================
// 4. ACTIVE NAV LINK — Resaltar el link según la sección visible
// ============================================================
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a, .mobile-menu a');

function updateActiveLink() {
  const scrollPos = window.scrollY + navbar.offsetHeight + 120;
  let current = '';

  sections.forEach(sec => {
    if (scrollPos >= sec.offsetTop) {
      current = sec.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active-nav');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active-nav');
    }
  });
}

window.addEventListener('scroll', updateActiveLink, { passive: true });


// ============================================================
// 5. SCROLL ANIMATIONS — IntersectionObserver para elementos
// ============================================================
const animatedEls = document.querySelectorAll('.animate-on-scroll');

const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      scrollObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -60px 0px'
});

animatedEls.forEach(el => scrollObserver.observe(el));


// ============================================================
// 6. PROGRESS BARS — Animar barras al hacer scroll
// ============================================================
const aboutCard = document.querySelector('.about-card');

if (aboutCard) {
  const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fills = entry.target.querySelectorAll('.progress-fill');
        fills.forEach((fill, i) => {
          setTimeout(() => fill.classList.add('animated'), i * 200 + 400);
        });
        progressObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  progressObserver.observe(aboutCard);
}


// ============================================================
// 7. COUNTER ANIMATION — Contar números en hero stats
// ============================================================
const statNumbers = document.querySelectorAll('.stat-number[data-count]');
let countersStarted = false;

function animateCounters() {
  if (countersStarted) return;
  countersStarted = true;

  statNumbers.forEach(el => {
    const target = parseInt(el.dataset.count, 10);
    const duration = 2000;
    const frameDuration = 1000 / 60;
    const totalFrames = Math.round(duration / frameDuration);
    let frame = 0;

    const easeOutQuad = t => t * (2 - t);

    const counter = setInterval(() => {
      frame++;
      const progress = easeOutQuad(frame / totalFrames);
      const current = Math.round(target * progress);
      el.textContent = current;

      if (frame === totalFrames) {
        el.textContent = target;
        clearInterval(counter);
      }
    }, frameDuration);
  });
}

// Observar cuando el hero sea visible
const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
  const counterObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      setTimeout(animateCounters, 600);
      counterObserver.disconnect();
    }
  }, { threshold: 0.5 });

  counterObserver.observe(heroStats);
}


// ============================================================
// 8. TAB SYSTEM — Pestañas de servicios
// ============================================================
const tabBtns   = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = `tab-${btn.dataset.tab}`;

    // Desactivar todos
    tabBtns.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    tabPanels.forEach(p => p.classList.remove('active'));

    // Activar el seleccionado
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');

    const target = document.getElementById(targetId);
    if (target) target.classList.add('active');
  });
});


// ============================================================
// 9. PARTICLE CANVAS — Fondo animado hero
// ============================================================
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  // No inicializar en dispositivos con poca potencia
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animFrameId;
  let W, H;

  function setSize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(true); }

    reset(init = false) {
      this.x  = Math.random() * W;
      this.y  = init ? Math.random() * H : -5;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.r  = Math.random() * 1.8 + 0.5;
      this.alpha = Math.random() * 0.45 + 0.08;
      this.color = Math.random() > 0.55 ? '108,43,255' : '0,245,160';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < -10 || this.x > W + 10) this.vx *= -1;
      if (this.y < -10 || this.y > H + 10) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
      ctx.fill();
    }
  }

  function initParticleList() {
    particles = [];
    const count = Math.min(90, Math.floor((W * H) / 13000));
    for (let i = 0; i < count; i++) particles.push(new Particle());
  }

  function drawConnections() {
    const len = particles.length;
    for (let i = 0; i < len; i++) {
      for (let j = i + 1; j < len; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 115) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(108,43,255,${0.12 * (1 - dist / 115)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    animFrameId = requestAnimationFrame(animate);
  }

  setSize();
  initParticleList();
  animate();

  // Pausa cuando la tab no está visible (ahorra recursos)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animFrameId);
    } else {
      animate();
    }
  });

  // Resize con debounce
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      setSize();
      initParticleList();
    }, 200);
  });
})();


// ============================================================
// 10. CURSOR GLOW — Efecto sutil de resplandor tras el cursor
// ============================================================
(function initCursorGlow() {
  // Solo en dispositivos con hover (desktop)
  if (!window.matchMedia('(hover: hover)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const glow = document.createElement('div');
  glow.setAttribute('aria-hidden', 'true');
  Object.assign(glow.style, {
    position:      'fixed',
    width:         '500px',
    height:        '500px',
    borderRadius:  '50%',
    background:    'radial-gradient(circle, rgba(108,43,255,0.04) 0%, transparent 70%)',
    pointerEvents: 'none',
    zIndex:        '9998',
    left:          '-250px',
    top:           '-250px',
    transition:    'left 0.15s ease, top 0.15s ease',
    mixBlendMode:  'screen',
  });
  document.body.appendChild(glow);

  document.addEventListener('mousemove', e => {
    glow.style.left = `${e.clientX - 250}px`;
    glow.style.top  = `${e.clientY - 250}px`;
  }, { passive: true });
})();


// ============================================================
// 11. FORM — Feedback visual y validación básica
// ============================================================
const contactForm = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');

if (contactForm && submitBtn) {
  contactForm.addEventListener('submit', function (e) {
    // Validación básica antes de enviar
    const nombre  = document.getElementById('nombre');
    const email   = document.getElementById('email');
    const servicio = document.getElementById('servicio');
    const mensaje  = document.getElementById('mensaje');

    let valid = true;

    [nombre, email, servicio, mensaje].forEach(field => {
      if (!field.value.trim()) {
        field.style.borderColor = 'rgba(255, 80, 80, 0.6)';
        field.style.boxShadow   = '0 0 0 3px rgba(255, 80, 80, 0.1)';
        valid = false;
      } else {
        field.style.borderColor = '';
        field.style.boxShadow   = '';
      }
    });

    if (!valid) {
      e.preventDefault();
      // Scroll suave al primer campo inválido
      const firstInvalid = contactForm.querySelector('[style*="rgba(255, 80, 80"]');
      if (firstInvalid) {
        firstInvalid.focus();
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Feedback visual de envío
    const btnText = submitBtn.querySelector('.btn-text');
    if (btnText) btnText.textContent = 'Enviando...';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.75';

    // FormSubmit maneja el envío real — restaurar UI tras timeout de seguridad
    setTimeout(() => {
      if (submitBtn.disabled) {
        if (btnText) btnText.textContent = 'Enviar consulta';
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
      }
    }, 6000);
  });

  // Limpiar estilos de error al escribir
  contactForm.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('input', () => {
      if (field.value.trim()) {
        field.style.borderColor = '';
        field.style.boxShadow   = '';
      }
    });
  });
}


// ============================================================
// 12. HOVER TILT — Leve efecto de inclinación en tarjetas hero
// ============================================================
(function initTiltEffect() {
  if (!window.matchMedia('(hover: hover)').matches) return;

  document.querySelectorAll('.service-card, .value-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect  = card.getBoundingClientRect();
      const xPos  = (e.clientX - rect.left) / rect.width  - 0.5;
      const yPos  = (e.clientY - rect.top)  / rect.height - 0.5;
      const tiltX = yPos * -8;
      const tiltY = xPos * 8;
      card.style.transform = `translateY(-5px) perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();


// ============================================================
// 13. REVEAL SECTIONS — Pequeño indicador de carga
// ============================================================
window.addEventListener('load', () => {
  document.body.classList.add('loaded');

  // Forzar visibilidad de elementos hero (no esperar scroll)
  document.querySelectorAll('.hero .animate-on-scroll').forEach(el => {
    setTimeout(() => el.classList.add('visible'), 100);
  });
});
