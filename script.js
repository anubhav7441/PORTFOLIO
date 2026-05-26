/* ============================================================
   ANUBHAV PANDEY — PORTFOLIO  |  script.js
   Features:
     - Particle canvas background
     - Scroll reveal animations
     - Skill bar animations on scroll
     - Active nav link tracking
     - Mobile hamburger menu
     - Header scroll effect
     - Contact form validation
     - Resume download
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── Year ─── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ─── Particle Canvas ─── */
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    const NUM_PARTICLES = 55;

    class Particle {
      constructor() { this.reset(true); }
      reset(fresh = false) {
        this.x    = Math.random() * canvas.width;
        this.y    = fresh ? Math.random() * canvas.height : canvas.height + 10;
        this.size = Math.random() * 1.8 + 0.4;
        this.speedY = Math.random() * 0.4 + 0.15;
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.color = Math.random() > 0.5 ? '77,240,255' : '124,92,255';
      }
      update() {
        this.y -= this.speedY;
        this.x += this.speedX;
        if (this.y < -10) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < NUM_PARTICLES; i++) particles.push(new Particle());

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(animate);
    };
    animate();
  }

  /* ─── Header Scroll Effect ─── */
  const header = document.getElementById('header');
  const onScroll = () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
    updateActiveNav();
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ─── Active Nav Link ─── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const updateActiveNav = () => {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 100;
      if (window.scrollY >= top) current = section.id;
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  };

  /* ─── Mobile Nav ─── */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  hamburger?.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      hamburger?.classList.remove('open');
      hamburger?.setAttribute('aria-expanded', 'false');
    });
  });

  /* ─── Scroll Reveal ─── */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ─── Skill Bar Animations ─── */
  const skillFills = document.querySelectorAll('.skill-fill');
  const skillObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const pct = el.getAttribute('data-pct') || '70';
        el.style.width = '0%';
        requestAnimationFrame(() => {
          setTimeout(() => {
            el.style.width = pct + '%';
          }, 80);
        });
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  skillFills.forEach(bar => skillObserver.observe(bar));

  /* ─── Contact Form ─── */
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit-btn');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      status.textContent = '';

      const name    = form.name.value.trim();
      const email   = form.email.value.trim();
      const message = form.message.value.trim();

      if (!name || !email || !message) {
        status.textContent = '⚠ Please fill in all fields.';
        status.style.color = '#ff9a9a';
        return;
      }

      if (!validateEmail(email)) {
        status.textContent = '⚠ Please enter a valid email address.';
        status.style.color = '#ff9a9a';
        return;
      }

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';
      status.textContent = '';
      status.style.color = '';

      setTimeout(() => {
        status.textContent = '✓ Message sent — thank you, I\'ll reply soon!';
        status.style.color = '#4ade80';
        form.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
      }, 1100);
    });
  }

  /* ─── Resume Download ─── */
  const resumeBtn = document.getElementById('download-resume');
  if (resumeBtn) {
    resumeBtn.addEventListener('click', (e) => {
      // If you have a real PDF, update the href on the element instead
      const url = resumeBtn.getAttribute('href');
      if (!url || url === '#') {
        e.preventDefault();
        alert('Resume PDF not found. Please add your resume as assets/Anubhav_Pandey_Resume.pdf');
      }
      // If href is a real file, the browser default download will handle it
    });
  }

  /* ─── Helpers ─── */
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

});