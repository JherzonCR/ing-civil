/* ============================================
   app.js — Women's Day Web App for Isaura
   ============================================ */

// ==========================================
// 1. SVG GRADIENT FOR HEART
// ==========================================
(function injectSVGDefs() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('style', 'position:absolute;width:0;height:0');
  svg.innerHTML = `
    <defs>
      <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#ff3d9a;stop-opacity:1"/>
        <stop offset="100%" style="stop-color:#bf5fff;stop-opacity:1"/>
      </linearGradient>
    </defs>
  `;
  document.body.prepend(svg);
})();

// ==========================================
// 2. PARTICLE CANVAS
// ==========================================
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  const NUM = 80;
  const particles = [];

  function rand(min, max) { return Math.random() * (max - min) + min; }

  class Particle {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x = rand(0, W);
      this.y = init ? rand(0, H) : rand(-20, 0);
      this.r = rand(0.8, 2.5);
      this.speedY = rand(0.2, 0.6);
      this.speedX = rand(-0.2, 0.2);
      this.alpha = rand(0.2, 0.7);
      const hue = rand(260, 320);
      this.color = `hsla(${hue}, 80%, 65%, ${this.alpha})`;
      this.twinkleSpeed = rand(0.01, 0.03);
      this.twinkleOffset = rand(0, Math.PI * 2);
    }
    update(t) {
      this.y += this.speedY;
      this.x += this.speedX;
      const twinkle = Math.sin(t * this.twinkleSpeed + this.twinkleOffset);
      this.drawAlpha = this.alpha * (0.6 + 0.4 * twinkle);
      if (this.y > H + 10) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color.replace(/[\d.]+\)$/, this.drawAlpha + ')');
      ctx.fill();
    }
  }

  for (let i = 0; i < NUM; i++) particles.push(new Particle());

  window.addEventListener('resize', () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });

  let t = 0;
  function animate() {
    ctx.clearRect(0, 0, W, H);
    t++;
    particles.forEach(p => { p.update(t); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
})();

// ==========================================
// 3. FLOATING PETALS
// ==========================================
(function initPetals() {
  const container = document.getElementById('petals');
  if (!container) return;

  const PETALS = ['🌸', '🌺', '🌷', '💜', '✨', '🌹', '💫'];
  const NUM_PETALS = 18;

  for (let i = 0; i < NUM_PETALS; i++) {
    const petal = document.createElement('div');
    petal.className = 'petal';
    const emoji = PETALS[Math.floor(Math.random() * PETALS.length)];
    petal.textContent = emoji;

    const left = Math.random() * 100;
    const delay = Math.random() * 15;
    const duration = 10 + Math.random() * 10;
    const size = 0.8 + Math.random() * 0.8;

    petal.style.cssText = `
      left: ${left}%;
      animation-delay: ${delay}s;
      animation-duration: ${duration}s;
      font-size: ${size}rem;
      opacity: ${0.4 + Math.random() * 0.4};
    `;

    container.appendChild(petal);
  }
})();

// ==========================================
// 4. SCROLL AOS (Animate On Scroll)
// ==========================================
(function initAOS() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.getAttribute('data-delay') || 0;
        setTimeout(() => entry.target.classList.add('aos-animate'), parseInt(delay));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));
})();

// ==========================================
// 5. SMOOTH HERO PARALLAX
// ==========================================
(function initParallax() {
  const hero = document.querySelector('.hero-content');
  if (!hero) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    hero.style.transform = `translateY(${y * 0.25}px)`;
    hero.style.opacity = Math.max(0, 1 - y / 500);
  }, { passive: true });
})();

// ==========================================
// 6. GALLERY ITEMS — pulsing colors
// ==========================================
(function initGalleryColors() {
  const colors = [
    'linear-gradient(135deg, rgba(106,13,173,0.35), rgba(255,61,154,0.2))',
    'linear-gradient(135deg, rgba(255,61,154,0.25), rgba(106,13,173,0.2))',
    'linear-gradient(135deg, rgba(0,100,200,0.3), rgba(106,13,173,0.3))',
    'linear-gradient(135deg, rgba(191,95,255,0.3), rgba(255,61,154,0.15))',
    'linear-gradient(135deg, rgba(255,100,100,0.2), rgba(191,95,255,0.3))',
  ];

  const galItems = document.querySelectorAll('.gallery-item');
  galItems.forEach((item, i) => {
    item.style.background = colors[i % colors.length];
  });
})();

// ==========================================
// 7. PILLAR CARDS — staggered entrance
// ==========================================
(function initPillars() {
  const cards = document.querySelectorAll('.pillar-card');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const idx = Array.from(cards).indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('aos-animate');
        }, idx * 100);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  cards.forEach(c => observer.observe(c));
})();

// ==========================================
// 8. CURRENT DATE / GREETING
// ==========================================
(function initDate() {
  const now = new Date();
  const isWomensDay = now.getMonth() === 2 && now.getDate() === 8;
  if (isWomensDay) {
    // Add extra flare if it's March 8!
    document.title = '🌸 ¡Feliz Día! — Isaura 💜';
  }
})();

// ==========================================
// 9. INTERACTIVE HEART (click to pop petals)
// ==========================================
(function initHeartClick() {
  const heartAnim = document.querySelector('.heart-animation');
  if (!heartAnim) return;

  heartAnim.addEventListener('click', () => {
    for (let i = 0; i < 8; i++) {
      const burst = document.createElement('div');
      burst.style.cssText = `
        position: fixed;
        pointer-events: none;
        font-size: ${1 + Math.random()}rem;
        left: ${heartAnim.getBoundingClientRect().left + heartAnim.offsetWidth / 2}px;
        top: ${heartAnim.getBoundingClientRect().top + heartAnim.offsetHeight / 2}px;
        z-index: 9999;
        transform-origin: center;
        animation: burstFly 1.2s ease forwards;
        --dx: ${(Math.random() - 0.5) * 200}px;
        --dy: ${-80 - Math.random() * 150}px;
      `;
      const emojis = ['💜', '🌸', '✨', '🌺', '💫', '🌷'];
      burst.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      document.body.appendChild(burst);
      setTimeout(() => burst.remove(), 1200);
    }
  });

  // Add burst keyframe dynamically
  const style = document.createElement('style');
  style.textContent = `
    @keyframes burstFly {
      0%   { transform: translate(0, 0) scale(0); opacity: 1; }
      100% { transform: translate(var(--dx), var(--dy)) scale(1.2); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
})();

// ==========================================
// 10. LETTER — typewriter reveal on scroll
// ==========================================
(function initLetterReveal() {
  const letter = document.querySelector('.letter-paper');
  if (!letter) return;
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      letter.style.transition = 'all 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      letter.style.opacity = '1';
      letter.style.transform = 'translateY(0)';
      observer.unobserve(letter);
    }
  }, { threshold: 0.2 });
  letter.style.opacity = '0';
  letter.style.transform = 'translateY(40px)';
  observer.observe(letter);
})();
