/* ═══════════════════════════════════════════════
   MODA ECCI — main.js  (Bilingual Edition)
═══════════════════════════════════════════════ */

// ── BILINGUAL ENGINE ──────────────────────────
let currentLang = localStorage.getItem('modaLang') || 'es';

function applyLang(lang) {
  currentLang = lang;
  localStorage.setItem('modaLang', lang);

  // Update html lang attribute
  document.getElementById('htmlRoot').lang = lang === 'es' ? 'es' : 'en';

  // Update toggle label
  const label = document.getElementById('langLabel');
  if (label) label.textContent = lang === 'es' ? 'ES' : 'EN';

  // Translate all [data-es] / [data-en] elements
  document.querySelectorAll('[data-es]').forEach(el => {
    const raw = lang === 'es' ? el.getAttribute('data-es') : el.getAttribute('data-en');
    if (!raw) return;
    // decode HTML entities in attribute values, then set innerHTML
    const decoded = raw
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
    el.innerHTML = decoded;
  });

  // Gallery modal captions use data-caption-es / data-caption-en
  document.querySelectorAll('[data-caption-es]').forEach(el => {
    const cap = lang === 'es'
      ? el.getAttribute('data-caption-es')
      : el.getAttribute('data-caption-en');
    el.setAttribute('data-caption', cap || '');
  });

  // Title tag
  document.title = lang === 'es'
    ? 'Moda ECCI – Experiencia Académica'
    : 'Moda ECCI – Academic Experience';
}

function toggleLang() {
  applyLang(currentLang === 'es' ? 'en' : 'es');
}

// ── Color Wheel Canvas (animated hero) ──
let wheelAngle = 0;
function drawAnimatedWheel() {
  const canvas = document.getElementById('wheelDisplay');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const r = Math.min(cx, cy) - 15;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(wheelAngle * Math.PI / 180);
  ctx.translate(-cx, -cy);

  const segments = 360;
  for (let i = 0; i < segments; i++) {
    const startAngle = (i / segments) * 2 * Math.PI;
    const endAngle = ((i + 1) / segments) * 2 * Math.PI;
    const hue = (i / segments) * 360;
    const gr = ctx.createRadialGradient(cx, cy, r * 0.3, cx, cy, r);
    gr.addColorStop(0, `hsla(${hue}, 30%, 80%, 0.6)`);
    gr.addColorStop(1, `hsla(${hue}, 100%, 50%, 0.9)`);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = gr;
    ctx.fill();
  }
  ctx.restore();

  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.28, 0, 2 * Math.PI);
  ctx.fillStyle = '#0D0D0D';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx, cy, 8, 0, 2 * Math.PI);
  ctx.fillStyle = '#E91E8C';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, 2 * Math.PI);
  ctx.strokeStyle = 'rgba(233,30,140,0.3)';
  ctx.lineWidth = 2;
  ctx.stroke();

  wheelAngle += 0.15;
  requestAnimationFrame(drawAnimatedWheel);
}

// ── Circular Economy Canvas ──
function drawCircularEconomy() {
  const canvas = document.getElementById('circularCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;

  const phases = [
    { label: currentLang === 'es' ? 'Diseño'     : 'Design',     color: '#E91E8C' },
    { label: currentLang === 'es' ? 'Producción' : 'Production', color: '#F0C040' },
    { label: currentLang === 'es' ? 'Uso'        : 'Use',        color: '#00D4C8' },
    { label: currentLang === 'es' ? 'Reciclaje'  : 'Recycling',  color: '#7C3AED' },
  ];

  const r = 110;
  const segAngle = (2 * Math.PI) / phases.length;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  phases.forEach((phase, i) => {
    const startAngle = i * segAngle - Math.PI / 2;
    const endAngle = startAngle + segAngle;
    const midAngle = startAngle + segAngle / 2;

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = phase.color + '33';
    ctx.fill();
    ctx.strokeStyle = phase.color;
    ctx.lineWidth = 2;
    ctx.stroke();

    const lx = cx + (r * 0.65) * Math.cos(midAngle);
    const ly = cy + (r * 0.65) * Math.sin(midAngle);
    ctx.fillStyle = phase.color;
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(phase.label, lx, ly);
  });

  ctx.beginPath();
  ctx.arc(cx, cy, 30, 0, 2 * Math.PI);
  ctx.fillStyle = '#111';
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,212,200,0.4)';
  ctx.lineWidth = 2;
  ctx.stroke();
}

// ── Photo Modal ──
function initPhotoModal() {
  const thumbs = document.querySelectorAll('.photo-thumb');
  const modalImg = document.getElementById('modalImg');
  const modalCaption = document.getElementById('modalCaption');

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      const imgSrc = thumb.getAttribute('data-img');
      const caption = thumb.getAttribute('data-caption') || '';
      if (modalCaption) modalCaption.textContent = caption;
      if (modalImg && imgSrc) {
        modalImg.src = imgSrc;
        modalImg.style.display = 'block';
      }
    });
  });
}

// ── Navbar scroll ──
function initNavbar() {
  const nav = document.getElementById('mainNav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.style.background = window.scrollY > 60
      ? 'rgba(13,13,13,0.97)'
      : 'rgba(13,13,13,0.85)';
  });
}

// ── Fade-in on scroll ──
function initFadeIn() {
  const targets = document.querySelectorAll('.info-card, .adso-card, .conclusion-card, .color-history-card, .sustain-item');
  targets.forEach(el => el.classList.add('fade-in'));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  targets.forEach(el => observer.observe(el));
}

// ── ScrollSpy ──
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('#mainNav .nav-link');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 100) current = section.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
  });
}

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
  applyLang(currentLang);
  drawAnimatedWheel();
  drawCircularEconomy();
  initPhotoModal();
  initNavbar();
  initFadeIn();
  initScrollSpy();
});
