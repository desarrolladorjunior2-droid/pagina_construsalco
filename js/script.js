// Theme toggle (light / dark) with persistence
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;

function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
}

let savedTheme = 'light';
try {
  savedTheme = localStorage.getItem('construsalco-theme') || 'light';
} catch (err) { /* localStorage unavailable */ }
applyTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  try { localStorage.setItem('construsalco-theme', next); } catch (err) { /* ignore */ }
});

// Header scroll state + progress bar
const header = document.getElementById('siteHeader');
const progressBar = document.getElementById('progressBar');
const heroImg = document.querySelector('.hero-img');
const heroCrane = document.querySelector('.hero-crane');

function onScroll() {
  const scrolled = window.scrollY;
  header.classList.toggle('scrolled', scrolled > 40);

  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrolled / docHeight) * 100 : 0;
  progressBar.style.width = progress + '%';

  if (scrolled < window.innerHeight) {
    if (heroImg) heroImg.style.transform = `scale(1.05) translateY(${scrolled * 0.15}px)`;
    if (heroCrane) heroCrane.style.transform = `translateY(${scrolled * -0.08}px)`;
  }
}
document.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Mobile menu
const burger = document.getElementById('burger');
const mainNav = document.getElementById('mainNav');

burger.addEventListener('click', () => {
  mainNav.classList.toggle('open');
});

// Mobile dropdown toggle (tap to expand submenu)
const navDropdown = document.querySelector('.nav-dropdown');
if (navDropdown) {
  const dropdownTrigger = navDropdown.querySelector('.nav-link');
  dropdownTrigger.addEventListener('click', (e) => {
    if (window.innerWidth <= 720) {
      e.preventDefault();
      navDropdown.classList.toggle('open');
    }
  });
}

// Close mobile menu on link click
document.querySelectorAll('.main-nav a').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 720 && !link.closest('.nav-dropdown')) {
      mainNav.classList.remove('open');
    }
  });
});

// Active nav link on scroll
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function setActiveLink() {
  let current = '';
  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= 120 && rect.bottom >= 120) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}
document.addEventListener('scroll', setActiveLink, { passive: true });

// Reveal on scroll
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => observer.observe(el));

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// 3D tilt on hover (skips touch devices — no mousemove there)
function initTilt(selector, intensity) {
  document.querySelectorAll(selector).forEach(card => {
    card.classList.add('tilt');
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * intensity;
      const rotateX = -((y - rect.height / 2) / (rect.height / 2)) * intensity;
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}
initTilt('.mv-card', 6);
initTilt('.value-card', 8);
initTilt('.partner-card', 10);
initTilt('.service-media', 4);

// Contact form (static — no backend, opens WhatsApp with prefilled message)
const form = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const nombre = data.get('nombre');
  const celular = data.get('celular');
  const email = data.get('email');
  const mensaje = data.get('mensaje');

  const texto = `Hola Construsalco, soy ${nombre}.%0AEmail: ${email}%0ACelular: ${celular}%0AMensaje: ${mensaje}`;
  formNote.textContent = 'Abriendo WhatsApp...';
  window.open(`https://wa.me/573164639446?text=${texto}`, '_blank');
  form.reset();
});
