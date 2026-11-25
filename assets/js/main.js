/* fabianocouto.me: language & theme switch, scroll progress, active nav, hero spotlight,
   rolling numbers, shutter & bar reveals, ink fill, mobile menu, copy e-mail, toolset marquee. */
(function () {
  'use strict';

  var doc = document.documentElement;
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var TEXT = {
    en: {
      title: 'Fabiano Couto | Data & Systems Analyst',
      description: 'Fabiano Couto, Data and Systems Analyst for large companies and industries in Brazil. SQL, Oracle and Sankhya ERP. 20 years at TV Gazeta, hands-on work and long-term commitment.',
      copied: 'E-mail copied.',
      copyFail: 'Could not copy. The address is fcoutopereira@live.com',
      menuOpen: 'Open menu',
      menuClose: 'Close menu',
      toDark: 'Switch to dark theme',
      toLight: 'Switch to light theme'
    },
    pt: {
      title: 'Fabiano Couto | Analista de Dados e de Sistemas',
      description: 'Fabiano Couto, Analista de Dados e de Sistemas para grandes empresas e indústrias do Brasil. SQL, Oracle e ERP Sankhya. 20 anos na TV Gazeta, trabalho manual e compromisso de longo prazo.',
      copied: 'E-mail copiado.',
      copyFail: 'Não deu para copiar. O endereço é fcoutopereira@live.com',
      menuOpen: 'Abrir menu',
      menuClose: 'Fechar menu',
      toDark: 'Mudar para tema escuro',
      toLight: 'Mudar para tema claro'
    }
  };

  function lang() { return doc.lang === 'pt-BR' ? 'pt' : 'en'; }
  function t() { return TEXT[lang()]; }

  /* ---------- theme toggle ---------- */
  var themeBtn = document.querySelector('[data-theme-toggle]');
  function currentTheme() {
    var attr = doc.getAttribute('data-theme');
    if (attr === 'dark' || attr === 'light') return attr;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function syncThemeBtn() {
    if (!themeBtn) return;
    var dark = currentTheme() === 'dark';
    var use = themeBtn.querySelector('use');
    if (use) use.setAttribute('href', '#i-' + (dark ? 'sun' : 'moon'));
    themeBtn.setAttribute('aria-label', dark ? t().toLight : t().toDark);
  }
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      doc.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
      syncThemeBtn();
    });
  }

  /* ---------- rolling numbers ---------- */
  function rollNumber(el) {
    var target = parseInt(el.getAttribute('data-roll'), 10);
    if (!target || reduced || !('requestAnimationFrame' in window)) {
      el.textContent = String(target || el.textContent);
      return;
    }
    var start = null;
    var dur = 850;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min(1, (ts - start) / dur);
      var eased = 1 - Math.pow(2, -10 * p);
      el.textContent = String(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = String(target);
    }
    requestAnimationFrame(step);
  }

  /* ---------- reveal on scroll (sections, bars, steps, numbers) ---------- */
  var revealSelector = '.reveal, .reveal-bar, .reveal-step';
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      e.target.querySelectorAll('[data-roll]').forEach(function (num) {
        if (num.dataset.rolled) return;
        num.dataset.rolled = '1';
        rollNumber(num);
      });
      if (e.target.hasAttribute('data-roll') && !e.target.dataset.rolled) {
        e.target.dataset.rolled = '1';
        rollNumber(e.target);
      }
      io.unobserve(e.target);
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -36px 0px' }) : null;

  function watch(node) {
    if (io && !reduced) io.observe(node);
    else node.classList.add('in');
  }

  /* ---------- progressive ink-fill on bridge paragraph (bilingual-safe) ---------- */
  if (!reduced && window.CSS && CSS.supports && CSS.supports('animation-timeline: view()')) {
    document.querySelectorAll('[data-fill]').forEach(function (p) {
      p.querySelectorAll('[data-l]').forEach(function (span) {
        var words = span.textContent.trim().split(/\s+/);
        span.textContent = '';
        words.forEach(function (w, i) {
          var el = document.createElement('span');
          el.className = 'fill-word';
          el.textContent = w;
          span.appendChild(el);
          if (i < words.length - 1) span.appendChild(document.createTextNode(' '));
        });
      });
      p.classList.add('is-filling');
    });
  }

  /* ---------- hero reactive spotlight (pointer-fine only, GPU transform) ---------- */
  var hero = document.querySelector('.hero');
  if (hero && !reduced && window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var rafSpot = 0;
    var targetX = 0, targetY = 0;
    hero.addEventListener('pointermove', function (e) {
      var rect = hero.getBoundingClientRect();
      targetX = e.clientX - rect.left - 40;
      targetY = e.clientY - rect.top - 40;
      if (rafSpot) return;
      rafSpot = requestAnimationFrame(function () {
        rafSpot = 0;
        hero.style.setProperty('--px', Math.round(targetX) + 'px');
        hero.style.setProperty('--py', Math.round(targetY) + 'px');
      });
    }, { passive: true });
  }

  /* ---------- scroll progress fallback for browsers without animation-timeline ---------- */
  if (!window.CSS || !CSS.supports || !CSS.supports('animation-timeline: scroll()')) {
    var rafProg = 0;
    var updateProgress = function () {
      rafProg = 0;
      var max = doc.scrollHeight - window.innerHeight;
      var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      doc.style.setProperty('--scroll-p', p.toFixed(4));
    };
    window.addEventListener('scroll', function () {
      if (!rafProg) rafProg = requestAnimationFrame(updateProgress);
    }, { passive: true });
    updateProgress();
  }

  /* ---------- active nav link on scroll ---------- */
  var navLinks = document.querySelectorAll('.nav-links a[data-nav]');
  var sections = [];
  navLinks.forEach(function (a) {
    var sec = document.getElementById(a.getAttribute('data-nav'));
    if (sec) sections.push({ id: a.getAttribute('data-nav'), el: sec, link: a });
  });
  if (sections.length && 'IntersectionObserver' in window) {
    var setActive = function (id) {
      sections.forEach(function (s) {
        var on = s.id === id;
        s.link.classList.toggle('is-active', on);
        if (on) s.link.setAttribute('aria-current', 'true');
        else s.link.removeAttribute('aria-current');
      });
    };
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) setActive(e.target.id);
      });
    }, { rootMargin: '-38% 0px -52% 0px', threshold: 0 });
    sections.forEach(function (s) { navObserver.observe(s.el); });
  }

  /* ---------- language ---------- */
  function applyLang(l, save) {
    doc.lang = l === 'pt' ? 'pt-BR' : 'en';
    if (save) { try { localStorage.setItem('lang', l); } catch (e) {} }
    document.title = TEXT[l].title;
    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', TEXT[l].description);
    document.querySelectorAll('[data-set-lang]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-set-lang') === l));
    });
    document.querySelectorAll('[data-alt-' + l + ']').forEach(function (n) { n.alt = n.getAttribute('data-alt-' + l); });
    document.querySelectorAll('[data-aria-' + l + ']').forEach(function (n) { n.setAttribute('aria-label', n.getAttribute('data-aria-' + l)); });
    syncMenuLabel();
    syncThemeBtn();
  }
  document.querySelectorAll('[data-set-lang]').forEach(function (b) {
    b.addEventListener('click', function () {
      var l = b.getAttribute('data-set-lang');
      if (l !== lang()) applyLang(l, true);
    });
  });

  /* ---------- mobile menu ---------- */
  var menuBtn = document.querySelector('.menu-btn');
  var menu = document.getElementById('mobile-nav');
  function syncMenuLabel() {
    if (!menuBtn) return;
    var open = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-label', open ? t().menuClose : t().menuOpen);
    menuBtn.querySelector('use').setAttribute('href', '#i-' + (open ? 'x' : 'list'));
  }
  function setMenu(open) {
    menuBtn.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('open', open);
    syncMenuLabel();
  }
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', function () { setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'); });
    menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  /* ---------- header border once the page leaves the top ---------- */
  var header = document.querySelector('.site-header');
  var sentinel = document.getElementById('top');
  if (header && sentinel && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      header.classList.toggle('scrolled', !entries[0].isIntersecting);
    }, { rootMargin: '8px 0px 0px 0px' }).observe(sentinel);
  }

  /* ---------- copy e-mail with icon feedback ---------- */
  var status = document.querySelector('.copy-status');
  var statusTimer;
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var value = btn.getAttribute('data-copy');
      var use = btn.querySelector('use');
      function say(msg, ok) {
        if (status) status.textContent = msg;
        if (ok && use) {
          use.setAttribute('href', '#i-check');
          btn.classList.add('copied');
        }
        clearTimeout(statusTimer);
        statusTimer = setTimeout(function () {
          if (status) status.textContent = '';
          if (use) use.setAttribute('href', '#i-copy');
          btn.classList.remove('copied');
        }, 3200);
      }
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(value).then(function () { say(t().copied, true); }, function () { say(t().copyFail, false); });
      } else {
        say(t().copyFail, false);
      }
    });
  });

  /* ---------- marquee: duplicate the track once for a seamless loop ---------- */
  var track = document.querySelector('.tools-track');
  if (track) {
    Array.prototype.slice.call(track.children).forEach(function (c) {
      var clone = c.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });
  }

  /* ---------- attach observers ---------- */
  document.querySelectorAll(revealSelector).forEach(watch);

  applyLang(lang(), false);
})();
