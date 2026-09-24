/* ============================================================
   OBSIDIAN WEB — script.js
   Smooth scroll, nav state, mobile menu, scroll-reveal
   ============================================================ */

(function () {
  'use strict';

  /* ── DOM refs ──────────────────────────────────────────── */
  const header    = document.querySelector('.site-header');
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  /* ── 1. Header scroll state ────────────────────────────── */
  function onScroll() {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run on load

  /* ── 2. Mobile nav toggle ──────────────────────────────── */
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      // Prevent body scroll when menu is open
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu when a nav link is clicked
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close menu on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        navToggle.focus();
      }
    });

    // Close menu if user clicks outside nav
    document.addEventListener('click', function (e) {
      if (
        navLinks.classList.contains('open') &&
        !navLinks.contains(e.target) &&
        !navToggle.contains(e.target)
      ) {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── 3. Smooth scroll for anchor links ─────────────────── */
  // Native CSS smooth-scroll handles most cases; this JS layer
  // adds the fixed-header offset so content isn't hidden behind the nav.
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const navHeight = header ? header.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({ top, behavior: 'smooth' });

      // Update URL hash without jumping
      if (history.pushState) {
        history.pushState(null, '', targetId);
      }
    });
  });

  /* ── 4. Scroll-reveal (IntersectionObserver) ───────────── */
  function initReveal() {
    if (!('IntersectionObserver' in window)) {
      // Fallback: just make everything visible
      document.querySelectorAll('.reveal, .reveal-stagger').forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }

    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.reveal, .reveal-stagger').forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  // Attach reveal classes to elements after DOM is ready
  function attachRevealClasses() {
    // Section headers
    document.querySelectorAll('.section-header').forEach(function (el) {
      el.classList.add('reveal');
    });

    // Services cards — stagger as a group
    const cardsGrid = document.querySelector('.cards-grid');
    if (cardsGrid) cardsGrid.classList.add('reveal-stagger');

    // Why items — stagger as a group
    const whyGrid = document.querySelector('.why-grid');
    if (whyGrid) whyGrid.classList.add('reveal-stagger');

    // Work cards — stagger as a group
    const workGrid = document.querySelector('.work-grid');
    if (workGrid) workGrid.classList.add('reveal-stagger');

    // Contact CTA
    const contactInner = document.querySelector('.contact-inner');
    if (contactInner) contactInner.classList.add('reveal');
  }

  /* ── 5. Active nav link highlighting on scroll ─────────── */
  function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
    if (!sections.length || !navAnchors.length) return;

    const sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const id = '#' + entry.target.getAttribute('id');
            navAnchors.forEach(function (a) {
              a.classList.toggle('active', a.getAttribute('href') === id);
            });
          }
        });
      },
      {
        threshold: 0.35,
        rootMargin: '-68px 0px 0px 0px',
      }
    );

    sections.forEach(function (s) { sectionObserver.observe(s); });
  }

  /* ── 6. Subtle cursor-parallax on hero crystal ─────────── */
  function initHeroParallax() {
    const heroMark = document.querySelector('.hero-mark');
    const heroCompass = document.querySelector('.hero-compass svg');
    if (!heroMark || !heroCompass) return;

    // Only run on non-touch devices
    if (window.matchMedia('(hover: none)').matches) return;

    let rafId = null;
    let mx = 0, my = 0;

    document.addEventListener('mousemove', function (e) {
      mx = (e.clientX / window.innerWidth  - 0.5) * 2; // -1 to 1
      my = (e.clientY / window.innerHeight - 0.5) * 2; // -1 to 1

      if (rafId) return;
      rafId = requestAnimationFrame(function () {
        rafId = null;
        heroMark.style.transform    = 'translate(' + mx * 6 + 'px, ' + my * 6 + 'px)';
        heroCompass.style.transform = 'translate(' + mx * -3 + 'px, ' + my * -3 + 'px) rotate(0deg)';
      });
    });
  }

  /* ── Init ───────────────────────────────────────────────── */
  attachRevealClasses();
  initReveal();
  initActiveNav();
  initHeroParallax();

})();
