document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  // --- Scroll-based nav styling ---
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    nav.classList.toggle('scrolled', scrollY > 50);
    lastScroll = scrollY;
  }, { passive: true });

  // --- Mobile menu toggle ---
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // --- Scroll reveal ---
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach((el, i) => {
    const parent = el.closest('section') || el.closest('.hero');
    const siblings = parent ? parent.querySelectorAll('.reveal') : [];
    const siblingIndex = Array.from(siblings).indexOf(el);
    el.dataset.delay = siblingIndex * 100;
    revealObserver.observe(el);
  });

  // --- Animated counters ---
  const counters = document.querySelectorAll('[data-count]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1500;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // --- Active nav link on scroll ---
  const sections = document.querySelectorAll('section[id]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.querySelectorAll('a').forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '-80px 0px -50% 0px'
  });

  sections.forEach(section => sectionObserver.observe(section));

  // --- Contact form ---
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = contactForm.querySelector('#name').value.trim();
    const email = contactForm.querySelector('#email').value.trim();
    const subject = contactForm.querySelector('#subject').value.trim();
    const message = contactForm.querySelector('#message').value.trim();

    if (!name || !email || !message) {
      showStatus('Bitte füllen Sie alle Pflichtfelder aus.', 'error');
      return;
    }

    if (!isValidEmail(email)) {
      showStatus('Bitte geben Sie eine gültige E-Mail-Adresse ein.', 'error');
      return;
    }

    const btn = contactForm.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.querySelector('span').textContent = 'Wird gesendet...';

    // Simulate sending (replace with actual API call)
    setTimeout(() => {
      showStatus('Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet.', 'success');
      contactForm.reset();
      btn.disabled = false;
      btn.querySelector('span').textContent = 'Nachricht senden';
    }, 1200);
  });

  function showStatus(msg, type) {
    formStatus.textContent = msg;
    formStatus.className = `form__status ${type}`;
    setTimeout(() => {
      formStatus.textContent = '';
      formStatus.className = 'form__status';
    }, 5000);
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});
