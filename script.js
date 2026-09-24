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

  /* ── 7. Geometric background canvas ────────────────────── */
  function initGeoCanvases() {
    // Accent colour components (matches --accent: #8b8ba7)
    var R = 139, G = 139, B = 167;

    // Each section gets its own canvas with a slightly different pattern
    var configs = [
      { selector: '#pricing  .geo-canvas', pattern: 'triangles' },
      { selector: '#services .geo-canvas', pattern: 'hexgrid'  },
      { selector: '#why      .geo-canvas', pattern: 'triangles' },
      { selector: '#work     .geo-canvas', pattern: 'hexgrid'   },
      { selector: '#contact  .geo-canvas', pattern: 'triangles' },
    ];

    configs.forEach(function (cfg) {
      var canvas = document.querySelector(cfg.selector);
      if (!canvas) return;
      var section = canvas.parentElement;
      setupCanvas(canvas, section, cfg.pattern, R, G, B);
    });
  }

  function setupCanvas(canvas, section, pattern, R, G, B) {
    var ctx    = canvas.getContext('2d');
    var nodes  = [];       // for floating-dot network on hex
    var lines  = [];       // animated diagonal lines for triangles
    var raf    = null;
    var visible = false;

    // ── Size canvas to section ────────────────────────────
    function resize() {
      canvas.width  = section.offsetWidth;
      canvas.height = section.offsetHeight;
      if (pattern === 'hexgrid')   buildHexNodes();
      if (pattern === 'triangles') buildTriLines();
    }

    // ── Hex-grid: static hex tessellation + floating nodes ─
    function buildHexNodes() {
      nodes = [];
      var size  = 38;          // hex radius
      var col   = size * 2;
      var row   = size * Math.sqrt(3);
      var cols  = Math.ceil(canvas.width  / col)  + 2;
      var rows  = Math.ceil(canvas.height / row)  + 2;

      for (var r = -1; r < rows; r++) {
        for (var c = -1; c < cols; c++) {
          var x = c * col + (r % 2 === 0 ? 0 : col / 2);
          var y = r * row;
          nodes.push({
            bx: x, by: y,           // base position
            x:  x, y:  y,
            vx: (Math.random() - 0.5) * 0.18,
            vy: (Math.random() - 0.5) * 0.18,
            phase: Math.random() * Math.PI * 2,
          });
        }
      }
    }

    function drawHex(ctx, cx, cy, size) {
      ctx.beginPath();
      for (var i = 0; i < 6; i++) {
        var angle = (Math.PI / 180) * (60 * i - 30);
        var px = cx + size * Math.cos(angle);
        var py = cy + size * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath();
    }

    // ── Triangle-grid: slow drifting diagonal lines ────────
    function buildTriLines() {
      lines = [];
      var count = Math.max(8, Math.floor(canvas.width / 90));
      for (var i = 0; i < count; i++) {
        lines.push({
          x:     Math.random() * canvas.width,
          y:     Math.random() * canvas.height,
          angle: (Math.random() > 0.5 ? 1 : -1) * (Math.PI / 4 + (Math.random() - 0.5) * 0.3),
          speed: 0.08 + Math.random() * 0.1,
          len:   80  + Math.random() * 120,
          alpha: 0.10 + Math.random() * 0.10,
        });
      }
    }

    // ── Draw ──────────────────────────────────────────────
    var tick = 0;

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      tick++;

      if (pattern === 'hexgrid') {
        // Static hex grid
        ctx.strokeStyle = 'rgba(' + R + ',' + G + ',' + B + ', 0.13)';
        ctx.lineWidth   = 1.0;
        nodes.forEach(function (n) {
          drawHex(ctx, n.bx, n.by, 38);
          ctx.stroke();
        });

        // Drifting nodes + connection lines
        nodes.forEach(function (n) {
          n.x += n.vx;
          n.y += n.vy;
          // gentle pull back toward base
          n.vx += (n.bx - n.x) * 0.0004;
          n.vy += (n.by - n.y) * 0.0004;
        });

        // Connect close node pairs
        ctx.lineWidth = 0.7;
        for (var i = 0; i < nodes.length; i++) {
          for (var j = i + 1; j < nodes.length; j++) {
            var dx = nodes[i].x - nodes[j].x;
            var dy = nodes[i].y - nodes[j].y;
            var d  = Math.sqrt(dx * dx + dy * dy);
            if (d < 55) {
              var a = (1 - d / 55) * 0.18;
              ctx.strokeStyle = 'rgba(' + R + ',' + G + ',' + B + ',' + a + ')';
              ctx.beginPath();
              ctx.moveTo(nodes[i].x, nodes[i].y);
              ctx.lineTo(nodes[j].x, nodes[j].y);
              ctx.stroke();
            }
          }
        }

        // Dots at nodes
        nodes.forEach(function (n) {
          var pulse = 0.3 + 0.2 * Math.sin(tick * 0.015 + n.phase);
          ctx.beginPath();
          ctx.arc(n.x, n.y, 1.4, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(' + R + ',' + G + ',' + B + ',' + pulse * 0.9 + ')';
          ctx.fill();
        });
      }

      if (pattern === 'triangles') {
        // Background triangle grid (static)
        var cell = 70;
        var cols = Math.ceil(canvas.width  / cell) + 1;
        var rows = Math.ceil(canvas.height / cell) + 1;

        ctx.lineWidth   = 0.9;
        ctx.strokeStyle = 'rgba(' + R + ',' + G + ',' + B + ', 0.11)';

        for (var r = -1; r < rows; r++) {
          for (var c = -1; c < cols; c++) {
            var x0 = c * cell;
            var y0 = r * cell;
            // Down-right triangle
            ctx.beginPath();
            ctx.moveTo(x0,        y0);
            ctx.lineTo(x0 + cell, y0);
            ctx.lineTo(x0 + cell, y0 + cell);
            ctx.closePath();
            ctx.stroke();
            // Up-left triangle
            ctx.beginPath();
            ctx.moveTo(x0,        y0);
            ctx.lineTo(x0,        y0 + cell);
            ctx.lineTo(x0 + cell, y0 + cell);
            ctx.closePath();
            ctx.stroke();
          }
        }

        // Animated drifting lines
        lines.forEach(function (ln) {
          ln.x += Math.cos(ln.angle) * ln.speed;
          ln.y += Math.sin(ln.angle) * ln.speed;
          // Wrap around
          if (ln.x > canvas.width  + ln.len) ln.x = -ln.len;
          if (ln.x < -ln.len)                ln.x =  canvas.width + ln.len;
          if (ln.y > canvas.height + ln.len) ln.y = -ln.len;
          if (ln.y < -ln.len)                ln.y =  canvas.height + ln.len;

          var grd = ctx.createLinearGradient(
            ln.x - Math.cos(ln.angle) * ln.len / 2,
            ln.y - Math.sin(ln.angle) * ln.len / 2,
            ln.x + Math.cos(ln.angle) * ln.len / 2,
            ln.y + Math.sin(ln.angle) * ln.len / 2
          );
          grd.addColorStop(0,   'rgba(' + R + ',' + G + ',' + B + ',0)');
          grd.addColorStop(0.5, 'rgba(' + R + ',' + G + ',' + B + ',' + ln.alpha + ')');
          grd.addColorStop(1,   'rgba(' + R + ',' + G + ',' + B + ',0)');

          ctx.lineWidth   = 0.8;
          ctx.strokeStyle = grd;
          ctx.beginPath();
          ctx.moveTo(ln.x - Math.cos(ln.angle) * ln.len / 2,
                     ln.y - Math.sin(ln.angle) * ln.len / 2);
          ctx.lineTo(ln.x + Math.cos(ln.angle) * ln.len / 2,
                     ln.y + Math.sin(ln.angle) * ln.len / 2);
          ctx.stroke();
        });
      }

      if (visible) {
        raf = requestAnimationFrame(draw);
      }
    }

    // ── IntersectionObserver — only animate when visible ──
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            visible = true;
            if (!raf) raf = requestAnimationFrame(draw);
          } else {
            visible = false;
            if (raf) { cancelAnimationFrame(raf); raf = null; }
          }
        });
      }, { threshold: 0.01 });
      io.observe(section);
    } else {
      // Fallback: always run
      visible = true;
      raf = requestAnimationFrame(draw);
    }

    // ── Resize ────────────────────────────────────────────
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        resize();
      }, 150);
    });

    resize();
  }

  /* ── Init ───────────────────────────────────────────────── */
  attachRevealClasses();
  initReveal();
  initActiveNav();
  initHeroParallax();
  initGeoCanvases();

})();
