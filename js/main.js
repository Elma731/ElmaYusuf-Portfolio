/* ═══════════════════════════════════════════════
   ELMA YUSUF — PORTFOLIO JS
   ═══════════════════════════════════════════════ */

'use strict';

/* ──────────────────────────────────────────────
   1. HEADER SCROLL SHADOW
────────────────────────────────────────────── */
const siteHeader = document.getElementById('site-header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    siteHeader.classList.add('scrolled');
  } else {
    siteHeader.classList.remove('scrolled');
  }
}, { passive: true });


/* ──────────────────────────────────────────────
   2. HAMBURGER MENU (mobile)
────────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close on nav link click
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// Close on outside click
document.addEventListener('click', (e) => {
  if (!siteHeader.contains(e.target) && navLinks.classList.contains('open')) {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
});


/* ──────────────────────────────────────────────
   3. SMOOTH SCROLL with header offset
────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    // Account for split header total height
    const headerH = siteHeader ? siteHeader.getBoundingClientRect().height : 120;
    const top = target.getBoundingClientRect().top + window.scrollY - headerH - 8;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* ──────────────────────────────────────────────
   4. ACTIVE NAV SECTION (Intersection Observer)
────────────────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${entry.target.id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}, {
  rootMargin: '-30% 0px -60% 0px',
  threshold: 0
});

sections.forEach(s => sectionObserver.observe(s));


/* ──────────────────────────────────────────────
   5. SCROLL ANIMATIONS (Intersection Observer)
────────────────────────────────────────────── */
const animItems = document.querySelectorAll('.animate-on-scroll');

const animObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const card = entry.target.closest('.project-card') || entry.target;
      const isCard = entry.target.classList.contains('project-card');
      const delay = isCard
        ? Array.from(document.querySelectorAll('.project-card')).indexOf(card) * 80
        : 0;

      setTimeout(() => {
        entry.target.classList.add('in-view');
      }, delay);

      animObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
});

animItems.forEach(el => animObserver.observe(el));


/* ──────────────────────────────────────────────
   6. TYPING ANIMATION — hero title
────────────────────────────────────────────── */
const typedEl   = document.getElementById('typed-title');
const cursorEl  = document.querySelector('.typing-cursor');
const titleText = 'Web Developer';

function typeTitle() {
  if (!typedEl) return;
  let i = 0;
  const interval = setInterval(() => {
    typedEl.textContent = titleText.slice(0, i + 1);
    i++;
    if (i >= titleText.length) {
      clearInterval(interval);
      setTimeout(() => {
        if (cursorEl) cursorEl.classList.add('hide');
      }, 1000);
    }
  }, 50);
}

window.addEventListener('load', () => {
  setTimeout(typeTitle, 400);
});


/* ──────────────────────────────────────────────
   7. STAT COUNTERS
────────────────────────────────────────────── */
function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const suffix   = el.dataset.suffix || '';
  const duration = 1500;
  const start    = performance.now();

  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = easeOutExpo(progress);
    const current  = Math.round(eased * target);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

const statNumbers = document.querySelectorAll('.stat-number');
let statsAnimated = false;

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !statsAnimated) {
      statsAnimated = true;
      statNumbers.forEach(el => animateCounter(el));
    }
  });
}, { threshold: 0.5 });

const statsStrip = document.querySelector('.stats-strip');
if (statsStrip) statsObserver.observe(statsStrip);


/* ──────────────────────────────────────────────
   8. PROJECT FILTER TABS
────────────────────────────────────────────── */
const filterBtns   = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    projectCards.forEach(card => {
      const category = card.dataset.category;
      const matches  = filter === 'all' || category === filter;

      if (matches) {
        card.classList.remove('hidden');
        card.classList.remove('fade-out');
        void card.offsetWidth;
        card.style.opacity   = '1';
        card.style.transform = '';
      } else {
        card.style.opacity   = '0';
        card.style.transform = 'scale(0.95)';
        card.addEventListener('transitionend', function handler() {
          if (card.style.opacity === '0') {
            card.classList.add('hidden');
          }
          card.removeEventListener('transitionend', handler);
        });
      }
    });
  });
});


/* ──────────────────────────────────────────────
   9. MAGNETIC BUTTONS
────────────────────────────────────────────── */
const magneticBtns = document.querySelectorAll('.magnetic-btn');

magneticBtns.forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    const dx   = (e.clientX - cx) * 0.25;
    const dy   = (e.clientY - cy) * 0.25;
    const max  = 6;
    const mx   = Math.max(-max, Math.min(max, dx));
    const my   = Math.max(-max, Math.min(max, dy));
    btn.style.transform = `translate(${mx}px, ${my}px)`;
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});


/* ──────────────────────────────────────────────
   10. SCROLL TO TOP
────────────────────────────────────────────── */
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }
}, { passive: true });

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ──────────────────────────────────────────────
   11. CONTACT FORM VALIDATION
────────────────────────────────────────────── */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const submitWrap  = document.getElementById('formSubmitWrap');
const submitBtn   = document.getElementById('submitBtn');

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(inputId, errorId) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  input.classList.add('error');
  if (error) error.classList.add('visible');
}

function clearError(inputId, errorId) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  input.classList.remove('error');
  if (error) error.classList.remove('visible');
}

['name', 'email', 'subject', 'message'].forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('input',  () => clearError(id, id + 'Error'));
  el.addEventListener('change', () => clearError(id, id + 'Error'));
});

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name    = document.getElementById('name');
    const email   = document.getElementById('email');
    const subject = document.getElementById('subject');
    const message = document.getElementById('message');

    let valid = true;

    if (!name.value.trim()) {
      showError('name', 'nameError');
      valid = false;
    } else {
      clearError('name', 'nameError');
    }

    if (!email.value.trim() || !isValidEmail(email.value)) {
      showError('email', 'emailError');
      valid = false;
    } else {
      clearError('email', 'emailError');
    }

    if (!subject.value) {
      showError('subject', 'subjectError');
      valid = false;
    } else {
      clearError('subject', 'subjectError');
    }

    if (!message.value.trim()) {
      showError('message', 'messageError');
      valid = false;
    } else {
      clearError('message', 'messageError');
    }

    if (!valid) return;

    // Show loading state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    try {
      const response = await fetch(
        'https://formspree.io/f/xbdqnjnr',
        {
          method: 'POST',
          body: new FormData(contactForm),
          headers: { 'Accept': 'application/json' }
        }
      );

      if (response.ok) {
        // Success — show message, hide form
        submitWrap.style.display = 'none';
        formSuccess.classList.add('visible');
        contactForm.reset();
      } else {
        // Formspree returned an error
        submitBtn.textContent = 'Send Message →';
        submitBtn.disabled = false;
        alert(
          'Something went wrong. ' +
          'Please email me directly at ' +
          'elmay7799@gmail.com'
        );
      }
    } catch (error) {
      // Network error
      submitBtn.textContent = 'Send Message →';
      submitBtn.disabled = false;
      alert(
        'Something went wrong. ' +
        'Please email me directly at ' +
        'elmay7799@gmail.com'
      );
    }
  });
}