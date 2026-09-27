/* fabianocouto.me: language switch, SVG charts (sample data), reveal-on-scroll, mobile menu, copy e-mail. */
(function () {
  'use strict';

  var doc = document.documentElement;
  var NS = 'http://www.w3.org/2000/svg';

  var TEXT = {
    en: {
      title: 'Fabiano Couto | Systems & Data Analyst',
      description: 'Fabiano Couto, Systems and Data Analyst. Sankhya ERP dashboards, SQL and automation. Twenty years in live television and hands-on work experience.',
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      regions: ['Southeast', 'Northeast', 'South', 'Center-West', 'North'],
      dre: ['Gross revenue', 'Deductions', 'Net revenue', 'COGS', 'Gross profit', 'Opex', 'EBITDA'],
      aging: ['1-30 days', '31-60 days', '61-90 days', '90+ days'],
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      week: 'W',
      thousand: 'R$ thousand',
      projected: 'Projected',
      copied: 'E-mail copied.',
      copyFail: 'Could not copy. The address is fcoutopereira@live.com',
      menuOpen: 'Open menu',
      menuClose: 'Close menu'
    },
    pt: {
      title: 'Fabiano Couto | Analista de Sistemas e Dados',
      description: 'Fabiano Couto, Analista de Sistemas e Dados. Dashboards, SQL e automação no ERP Sankhya. Vinte anos de televisão ao vivo e experiência em trabalho manual.',
      months: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
      regions: ['Sudeste', 'Nordeste', 'Sul', 'Centro-Oeste', 'Norte'],
      dre: ['Receita bruta', 'Deduções', 'Receita líquida', 'CMV', 'Lucro bruto', 'Despesas', 'EBITDA'],
      aging: ['1 a 30 dias', '31 a 60 dias', '61 a 90 dias', '+90 dias'],
      days: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
      week: 'S',
      thousand: 'R$ mil',
      projected: 'Projeção',
      copied: 'E-mail copiado.',
      copyFail: 'Não deu para copiar. O endereço é fcoutopereira@live.com',
      menuOpen: 'Abrir menu',
      menuClose: 'Fechar menu'
    }
  };

  /* ---------- sample data (illustrative, R$ thousand unless noted) ---------- */
  var DATA = {
    revenue: [412, 438, 471, 455, 502, 538, 521, 566, 590, 574, 611, 648],
    goal: [430, 440, 460, 470, 490, 510, 520, 540, 560, 570, 590, 610],
    regions: [2914, 1487, 986, 612, 327],
    dre: [6326, -742, 5584, -3512, 2072, -1238, 834],
    cash: [1.82, 1.74, 1.91, 2.05, 1.97, 2.12, 2.31, 2.24, 2.40, 2.36, 2.55, 2.61], // R$ million, last 3 projected
    aging: [184, 97, 52, 38]
  };
  // six weeks x seven days of output (t); Sunday runs a reduced shift
  DATA.heat = (function () {
    var seed = 7, rows = [];
    function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
    var base = [118, 124, 121, 127, 115, 86, 34];
    for (var w = 0; w < 6; w++) {
      var r = [];
      for (var d = 0; d < 7; d++) r.push(Math.round(base[d] * (0.84 + rnd() * 0.3) + w * 2));
      rows.push(r);
    }
    rows[3][2] = 71; // a visible slow day (line stop)
    return rows;
  })();

  // wide charts get a compact layout on phones instead of shrinking their text
  var narrow = window.matchMedia('(max-width: 600px)');

  function lang() { return doc.lang === 'pt-BR' ? 'pt' : 'en'; }
  function t() { return TEXT[lang()]; }
  function fmt(n, dec) {
    return new Intl.NumberFormat(lang() === 'pt' ? 'pt-BR' : 'en-US', {
      minimumFractionDigits: dec || 0, maximumFractionDigits: dec || 0
    }).format(n);
  }

  /* ---------- tiny SVG helpers ---------- */
  function el(name, attrs, parent) {
    var n = document.createElementNS(NS, name);
    for (var k in attrs) if (attrs[k] !== undefined) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function txt(parent, x, y, s, attrs) {
    var n = el('text', Object.assign({ x: x, y: y }, attrs || {}), parent);
    n.textContent = s;
    return n;
  }
  function svg(w, h, label) {
    return el('svg', { viewBox: '0 0 ' + w + ' ' + h, class: 'chart', role: 'img', 'aria-label': label });
  }
  function pathFrom(points) {
    return points.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' ');
  }

  /* ---------- charts ---------- */
  var charts = {
    revenue: function () {
      var nar = narrow.matches;
      var W = nar ? 360 : 560, H = nar ? 200 : 210, L = nar ? 30 : 36, R = 4, T = 10, B = 24, max = 700;
      var s = svg(W, H, lang() === 'pt' ? 'Faturamento mensal x meta' : 'Monthly revenue vs. goal');
      var ih = H - T - B, iw = W - L - R, step = iw / 12, bw = step * 0.56;
      [0, 200, 400, 600].forEach(function (v) {
        var y = T + ih - (v / max) * ih;
        el('line', { x1: L, x2: W - R, y1: y, y2: y, class: 'grid' }, s);
        txt(s, L - 8, y + 4, v ? fmt(v) : '0', { 'text-anchor': 'end' });
      });
      DATA.revenue.forEach(function (v, i) {
        var h = (v / max) * ih, x = L + i * step + (step - bw) / 2;
        el('rect', { x: x, y: T + ih - h, width: bw, height: h, rx: 4, class: 'bar grow', style: '--i:' + i }, s);
        txt(s, x + bw / 2, H - 6, t().months[i], { 'text-anchor': 'middle' });
      });
      var pts = DATA.goal.map(function (v, i) { return [L + i * step + step / 2, T + ih - (v / max) * ih]; });
      el('path', { d: pathFrom(pts), class: 'goal draw', pathLength: 1 }, s);
      return s;
    },

    regions: function () {
      var W = 290, H = 132, L = 80, R = 40, row = 26, max = 3000;
      var s = svg(W, H, lang() === 'pt' ? 'Vendas por região' : 'Sales by region');
      DATA.regions.forEach(function (v, i) {
        var y = 6 + i * row, w = (v / max) * (W - L - R);
        txt(s, 0, y + 12, t().regions[i]);
        el('rect', { x: L, y: y + 2, width: w, height: 14, rx: 4, class: (i ? 'bar-soft' : 'bar') + ' grow-x', style: '--i:' + i }, s);
        txt(s, L + w + 6, y + 13, fmt(v), { class: 'val fade', style: '--i:' + i });
      });
      return s;
    },

    waterfall: function () {
      var nar = narrow.matches;
      var W = nar ? 360 : 640, H = nar ? 300 : 340, L = 4, R = 4, T = 30, B = nar ? 40 : 30, max = 7000;
      var s = svg(W, H, lang() === 'pt' ? 'DRE em cascata' : 'Income statement waterfall');
      var ih = H - T - B, step = (W - L - R) / 7, bw = step * 0.6, level = 0;
      function Y(v) { return T + ih - (v / max) * ih; }
      txt(s, L, 12, t().thousand);
      el('line', { x1: L, x2: W - R, y1: Y(0), y2: Y(0), class: 'grid' }, s);
      DATA.dre.forEach(function (v, i) {
        var total = v > 0, top, bottom, cls;
        if (total) { top = v; bottom = 0; level = v; } else { top = level; bottom = level + v; level = bottom; }
        cls = v < 0 ? 'bar-neg' : (i === 0 || i === 6 ? 'bar' : 'bar-soft');
        var x = L + i * step + (step - bw) / 2;
        el('rect', { x: x, y: Y(top), width: bw, height: Y(bottom) - Y(top), rx: 5, class: cls + ' grow', style: '--i:' + i * 2 }, s);
        txt(s, x + bw / 2, Y(top) - 8, (v < 0 ? '-' : '') + fmt(Math.abs(v)), { 'text-anchor': 'middle', class: 'val fade', style: '--i:' + i * 2 });
        if (nar) { // two-line labels so they fit narrow columns
          var words = t().dre[i].split(' ');
          txt(s, x + bw / 2, H - 22, words[0], { 'text-anchor': 'middle' });
          if (words[1]) txt(s, x + bw / 2, H - 8, words[1], { 'text-anchor': 'middle' });
        } else {
          txt(s, x + bw / 2, H - 8, t().dre[i], { 'text-anchor': 'middle' });
        }
        // connector at the running level, where the next bar starts
        if (i < 6) el('line', { x1: x + bw, x2: x + step, y1: Y(level), y2: Y(level), class: 'conn fade', style: '--i:' + i * 2 }, s);
      });
      return s;
    },

    cash: function () {
      var W = 320, H = 170, L = 30, R = 8, T = 22, B = 22, min = 1.5, max = 2.8;
      var s = svg(W, H, lang() === 'pt' ? 'Saldo de caixa semanal' : 'Weekly cash balance');
      var ih = H - T - B, iw = W - L - R, n = DATA.cash.length;
      function X(i) { return L + (i / (n - 1)) * iw; }
      function Y(v) { return T + ih - ((v - min) / (max - min)) * ih; }
      [1.5, 2.0, 2.5].forEach(function (v) {
        el('line', { x1: L, x2: W - R, y1: Y(v), y2: Y(v), class: 'grid' }, s);
        txt(s, L - 6, Y(v) + 4, fmt(v, 1), { 'text-anchor': 'end' });
      });
      var cut = n - 3; // last three weeks are a projection
      var real = DATA.cash.slice(0, cut + 1).map(function (v, i) { return [X(i), Y(v)]; });
      var proj = DATA.cash.slice(cut).map(function (v, i) { return [X(cut + i), Y(v)]; });
      el('path', { d: pathFrom(real) + ' L' + X(cut).toFixed(1) + ' ' + Y(min) + ' L' + L + ' ' + Y(min) + ' Z', class: 'area fade' }, s);
      el('path', { d: pathFrom(real), class: 'line draw', pathLength: 1 }, s);
      el('path', { d: pathFrom(proj), class: 'goal fade', style: '--i:20' }, s);
      el('circle', { cx: X(cut), cy: Y(DATA.cash[cut]), r: 4, class: 'dot fade', style: '--i:24' }, s);
      txt(s, X(cut) + 6, T - 8, t().projected, { class: 'fade', style: '--i:24' });
      el('line', { x1: X(cut), x2: X(cut), y1: T - 4, y2: T + ih, class: 'conn fade', style: '--i:24' }, s);
      [0, 3, 6, 9, 11].forEach(function (i) { txt(s, X(i), H - 4, t().week + (i + 1), { 'text-anchor': 'middle' }); });
      return s;
    },

    aging: function () {
      var W = 320, H = 150, L = 84, R = 40, row = 34, max = 200;
      var s = svg(W, H, lang() === 'pt' ? 'Inadimplência por faixa de atraso' : 'Overdue receivables by age');
      DATA.aging.forEach(function (v, i) {
        var y = 8 + i * row, w = (v / max) * (W - L - R);
        txt(s, 0, y + 14, t().aging[i]);
        el('rect', { x: L, y: y + 2, width: w, height: 18, rx: 5, class: (i === 3 ? 'bar' : 'bar-soft') + ' grow-x', style: '--i:' + i }, s);
        txt(s, L + w + 6, y + 15, fmt(v), { class: 'val fade', style: '--i:' + i });
      });
      return s;
    },

    heat: function () {
      var nar = narrow.matches;
      var W = nar ? 340 : 640, H = nar ? 250 : 214, L = nar ? 26 : 34, T = 22, gap = nar ? 4 : 5;
      var s = svg(W, H, lang() === 'pt' ? 'Mapa de calor da produção diária' : 'Daily production heatmap');
      var cw = (W - L) / 7, ch = (H - T) / 6, all = [].concat.apply([], DATA.heat);
      var lo = Math.min.apply(null, all), hi = Math.max.apply(null, all);
      t().days.forEach(function (d, i) { txt(s, L + i * cw + cw / 2, 12, d, { 'text-anchor': 'middle' }); });
      DATA.heat.forEach(function (row, w) {
        txt(s, 0, T + w * ch + ch / 2 + 4, t().week + (w + 1));
        row.forEach(function (v, d) {
          var o = 0.1 + 0.9 * ((v - lo) / (hi - lo));
          el('rect', {
            x: L + d * cw, y: T + w * ch, width: cw - gap, height: ch - gap, rx: 6,
            class: 'bar fade', 'fill-opacity': o.toFixed(2), style: '--i:' + (w * 7 + d)
          }, s);
        });
      });
      return s;
    }
  };

  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -40px 0px' }) : null;

  function watch(node) { if (io) io.observe(node); else node.classList.add('in'); }

  function renderCharts() {
    document.querySelectorAll('[data-chart]').forEach(function (slot) {
      var fn = charts[slot.getAttribute('data-chart')];
      if (!fn) return;
      var old = slot.querySelector('svg'), seen = old && old.classList.contains('in');
      var node = fn();
      slot.replaceChildren(node);
      if (seen) node.classList.add('in'); else watch(node);
    });
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
    renderCharts();
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
  if (narrow.addEventListener) narrow.addEventListener('change', renderCharts);
})();
