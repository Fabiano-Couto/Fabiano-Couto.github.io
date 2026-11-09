/* fabianocouto.me: language switch, reveal-on-scroll, mobile menu, copy e-mail, toolset marquee. */
(function () {
  'use strict';

  var doc = document.documentElement;

  var TEXT = {
    en: {
      title: 'Fabiano Couto | Data & Systems Analyst',
      description: 'Fabiano Couto, Data and Systems Analyst for large companies and industries in Brazil. SQL, Oracle and Sankhya ERP. 20 years at TV Gazeta, hands-on work and long-term commitment.',
      copied: 'E-mail copied.',
      copyFail: 'Could not copy. The address is fcoutopereira@live.com',
      menuOpen: 'Open menu',
      menuClose: 'Close menu'
    },
    pt: {
      title: 'Fabiano Couto | Analista de Dados e de Sistemas',
      description: 'Fabiano Couto, Analista de Dados e de Sistemas para grandes empresas e indústrias do Brasil. SQL, Oracle e ERP Sankhya. 20 anos na TV Gazeta, trabalho manual e compromisso de longo prazo.',
      copied: 'E-mail copiado.',
      copyFail: 'Não deu para copiar. O endereço é fcoutopereira@live.com',
      menuOpen: 'Abrir menu',
      menuClose: 'Fechar menu'
    }
  };

  function lang() { return doc.lang === 'pt-BR' ? 'pt' : 'en'; }
  function t() { return TEXT[lang()]; }

  /* ---------- reveal on scroll ---------- */
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -40px 0px' }) : null;

  function watch(node) { if (io) io.observe(node); else node.classList.add('in'); }

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
    menuBtn.querySelector('use').setAttribute('href', 'assets/icons.svg#i-' + (open ? 'x' : 'list'));
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

  /* ---------- header border once the page leaves the top (no scroll listener) ---------- */
  var header = document.querySelector('.site-header');
  var sentinel = document.getElementById('top');
  if (header && sentinel && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      header.classList.toggle('scrolled', !entries[0].isIntersecting);
    }, { rootMargin: '8px 0px 0px 0px' }).observe(sentinel);
  }

  /* ---------- copy e-mail ---------- */
  var status = document.querySelector('.copy-status');
  var statusTimer;
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var value = btn.getAttribute('data-copy');
      function say(msg) {
        if (!status) return;
        status.textContent = msg;
        clearTimeout(statusTimer);
        statusTimer = setTimeout(function () { status.textContent = ''; }, 4000);
      }
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(value).then(function () { say(t().copied); }, function () { say(t().copyFail); });
      } else {
        say(t().copyFail);
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

  /* ---------- reveal ---------- */
  document.querySelectorAll('.reveal').forEach(watch);

  applyLang(lang(), false);
})();
