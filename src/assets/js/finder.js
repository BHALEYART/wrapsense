/* WrapSense Machine Finder: radial product-type wheel + 4-step guided match. */
(function () {
  'use strict';
  var d = document;
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var ICON = function (n, c) { return '<svg class="' + (c || 'icon') + '" aria-hidden="true" focusable="false"><use href="#i-' + n + '"></use></svg>'; };

  /* ───────── Home industry strip: pause / play (WCAG 2.2.2) ───────── */
  var mt = d.querySelector('[data-marquee-toggle]');
  if (mt) mt.addEventListener('click', function () {
    var bar = mt.closest('.ind-marquee'), paused = !bar.classList.contains('is-paused');
    bar.classList.toggle('is-paused', paused);
    mt.setAttribute('aria-pressed', String(paused));
  });

  /* ───────── Wheel (home + finder step 1) ───────── */
  var FORM_EXAMPLES = {};
  d.querySelectorAll('[data-wheel] .wheel__item').forEach(function (li) {
    var input = li.querySelector('input'), ex = li.querySelector('.wheel__ex');
    if (input && ex) FORM_EXAMPLES[input.value] = ex.textContent;
  });

  function syncWheel(wheel) {
    var inputs = wheel.querySelectorAll('.wheel__input');
    var sel = -1, name = '';
    inputs.forEach(function (inp, i) { if (inp.checked) { sel = i; name = inp.parentNode.querySelector('.wheel__name').textContent; } });
    wheel.classList.toggle('has-selection', sel > -1);
    if (sel > -1) wheel.style.setProperty('--sel', sel);
    var selForm = sel > -1 ? inputs[sel].value : '';
    wheel.querySelectorAll('.wheel__seg').forEach(function (seg) { seg.classList.toggle('is-on', seg.getAttribute('data-seg') === selForm); });
    if (sel > -1) wheel.style.setProperty('--sel-c', inputs[sel].closest('.wheel__item').style.getPropertyValue('--c'));
    var pick = wheel.querySelector('[data-wheel-pick]');
    if (pick) pick.textContent = sel > -1 ? name : 'Pick a product type';
    var ex = wheel.querySelector('[data-wheel-examples]');
    if (ex) ex.textContent = sel > -1 ? 'e.g. ' + FORM_EXAMPLES[inputs[sel].value] : '';
  }

  d.querySelectorAll('[data-wheel]').forEach(function (wheel) {
    wheel.addEventListener('change', function () { syncWheel(wheel); });
    // light up a product type's ring segment on hover/focus
    var hl = function (id, on) { var seg = wheel.querySelector('.wheel__seg[data-seg="' + id + '"]'); if (seg) seg.classList.toggle('is-hover', on); };
    wheel.querySelectorAll('.wheel__item').forEach(function (li) {
      var id = li.getAttribute('data-form');
      li.addEventListener('mouseenter', function () { hl(id, true); });
      li.addEventListener('mouseleave', function () { hl(id, false); });
      li.addEventListener('focusin', function () { hl(id, true); });
      li.addEventListener('focusout', function () { hl(id, false); });
    });
    syncWheel(wheel);
  });

  // Home launcher: a real mouse/touch click continues automatically; keyboard users press Continue.
  var launch = d.querySelector('[data-wheel-launch]');
  if (launch) {
    launch.addEventListener('click', function (e) {
      var label = e.target.closest('.wheel__label');
      if (!label || e.detail === 0) return;
      setTimeout(function () {
        if (launch.querySelector('input[name="form"]:checked')) { var f = launch.querySelector('input[name="form"]:checked'); window.WS && WS.track('finder_start', { form: f && f.value, from: 'home' }); launch.requestSubmit ? launch.requestSubmit() : launch.submit(); }
      }, 380);
    });
    launch.addEventListener('submit', function (e) {
      var picked = launch.querySelector('input[name="form"]:checked');
      if (!picked) {
        e.preventDefault();
        var ex = launch.querySelector('[data-wheel-examples]');
        if (ex) ex.textContent = 'Choose what you’re packaging to continue.';
        launch.querySelector('.wheel__input').focus();
      }
    });
  }

  /* ───────── Finder flow ───────── */
  var finder = d.querySelector('[data-finder]');
  if (!finder) return;
  var DATA = JSON.parse(d.getElementById('finder-data').textContent);
  var byId = function (list, key) { var o = {}; list.forEach(function (x) { o[x[key || 'id']] = x; }); return o; };
  var FORMS = byId(DATA.forms), PKGS = byId(DATA.packages), BANDS = byId(DATA.speedBands), ADDONS = byId(DATA.addons), CATS = byId(DATA.categories, 'slug');
  var PRODUCTS = DATA.products, PBYSLUG = byId(PRODUCTS, 'slug');
  var steps = [].slice.call(finder.querySelectorAll('.fstep'));
  var results = finder.querySelector('[data-results]');
  var status = finder.querySelector('[data-finder-status]');
  var progress = finder.querySelectorAll('[data-progress]');
  var current = 1;

  var state = function () {
    var g = function (n) { var el = finder.querySelector('input[name="' + n + '"]:checked'); return el ? el.value : ''; };
    return { form: g('form'), pkg: g('pkg'), speed: g('speed'), add: [].map.call(finder.querySelectorAll('input[name="add"]:checked'), function (i) { return i.value; }) };
  };
  var setVal = function (name, val) {
    var el = finder.querySelector('input[name="' + name + '"][value="' + (window.CSS && CSS.escape ? CSS.escape(val) : val) + '"]');
    if (el) el.checked = true;
  };

  function availablePackages(form) {
    var set = {};
    PRODUCTS.forEach(function (p) {
      if (p.role !== 'primary') return;
      if (p.forms.indexOf(form) > -1) p.packages.forEach(function (k) { set[k] = 1; });
    });
    if (form === 'cases') { set.carton = set['case'] = set.pallet = 1; }
    if (form === 'container') { set.container = set.carton = 1; }
    return set;
  }

  function filterPackages() {
    var s = state(), avail = availablePackages(s.form);
    finder.querySelectorAll('[data-pkg]').forEach(function (opt) {
      var ok = !s.form || avail[opt.getAttribute('data-pkg')];
      opt.classList.toggle('is-dim', !ok);
      var input = opt.querySelector('input');
      input.disabled = !ok;
      if (!ok && input.checked) input.checked = false;
    });
  }

  function stepError(n, msg) {
    var step = steps[n - 1], el = step.querySelector('.fstep__error');
    if (!el) { el = d.createElement('p'); el.className = 'field__error fstep__error'; el.setAttribute('role', 'alert'); var nav = step.querySelector('.fstep__nav'); nav.parentNode.insertBefore(el, nav); }
    el.hidden = !msg; el.textContent = msg || '';
  }

  function show(n, opts) {
    opts = opts || {};
    current = n;
    steps.forEach(function (s, i) { s.classList.toggle('is-current', i + 1 === n); });
    results.hidden = n !== 5;
    progress.forEach(function (li, i) {
      li.classList.toggle('is-done', i + 1 < n);
      li.classList.toggle('is-current', i + 1 === n);
      if (i + 1 === n) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
    });
    var backBtn = steps[n - 1] && steps[n - 1].querySelector('[data-back]');
    if (backBtn) backBtn.hidden = n === 1;
    if (n === 2) filterPackages();
    if (n === 5) renderResults();
    if (!opts.silent) {
      var target = n === 5 ? results : steps[n - 1];
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      var top = finder.getBoundingClientRect().top + window.scrollY - 110;
      if (window.scrollY > top || n === 5) window.scrollTo({ top: top, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      status.textContent = n === 5 ? 'Showing your machine matches.' : 'Step ' + n + ' of 4';
    }
    if (!opts.noHistory) pushUrl(n);
  }

  function pushUrl(n) {
    var s = state(), q = new URLSearchParams();
    if (s.form) q.set('form', s.form);
    if (s.pkg && n > 2) q.set('pkg', s.pkg);
    if (s.speed && n > 3) q.set('speed', s.speed);
    if (s.add.length && n > 4) q.set('add', s.add.join(','));
    if (n === 5) q.set('done', '1');
    q.set('step', String(n));
    history.pushState({ step: n }, '', location.pathname + '?' + q.toString());
  }

  function required(n) {
    var s = state();
    if (n === 1 && !s.form) return 'Choose what you’re packaging to continue.';
    if (n === 2 && !s.pkg) return 'Choose a package format to continue.';
    if (n === 3 && !s.speed) return 'Choose a target output (or “Not sure yet”) to continue.';
    return '';
  }

  function next() {
    var err = required(current);
    stepError(current, err);
    if (err) { var first = steps[current - 1].querySelector('input:not(:disabled)'); if (first) first.focus(); return; }
    if (current === 1 && window.WS) WS.track('finder_start', { form: state().form, from: 'finder' });
    show(current + 1);
  }

  finder.addEventListener('click', function (e) {
    if (e.target.closest('[data-next]')) { e.preventDefault(); next(); }
    else if (e.target.closest('[data-back]')) { e.preventDefault(); show(Math.max(1, current - 1)); }
    else if (e.target.closest('[data-restart]')) {
      finder.querySelectorAll('input').forEach(function (i) { i.checked = false; });
      d.querySelectorAll('[data-wheel]').forEach(syncWheel);
      show(1);
    } else if (e.target.closest('[data-goto]')) { show(+e.target.closest('[data-goto]').getAttribute('data-goto')); }
    else {
      // mouse/touch selection on single-choice steps advances automatically
      var label = e.target.closest('.wheel__label, .opt__card');
      if (label && e.detail > 0 && current < 4) {
        setTimeout(function () { if (!required(current)) { stepError(current, ''); show(current + 1); } }, 320);
      }
    }
  });
  finder.addEventListener('change', function () { stepError(current, ''); });
  window.addEventListener('popstate', function (e) { show((e.state && e.state.step) || 1, { noHistory: true }); });

  /* ───────── Matching ───────── */
  function speedFit(p, band) {
    if (!band || band.id === 'any') return { ok: true, dist: 0 };
    var lo = Math.max(band.min, p.speed.min), hi = Math.min(band.max, p.speed.max);
    var mid = (band.min + Math.min(band.max, 400)) / 2, pmid = (p.speed.min + Math.min(p.speed.max, 400)) / 2;
    return { ok: hi > lo || (p.speed.max >= 400), dist: Math.abs(mid - pmid) };
  }
  function rank(list, band) {
    return list.map(function (p) { var f = speedFit(p, band); return { p: p, ok: f.ok, dist: f.dist }; })
      .sort(function (a, b) { return (b.ok - a.ok) || (a.dist - b.dist); });
  }
  function primaryMatches(s) {
    var band = BANDS[s.speed];
    var list = PRODUCTS.filter(function (p) {
      if (p.role !== 'primary' || p.packages.indexOf(s.pkg) === -1) return false;
      return p.forms.indexOf(s.form) > -1 || p.stageRole === 'end' || p.stageRole === 'finish';
    });
    return rank(list, band);
  }
  var END_ADDONS = { carton: 1, 'case': 1, casepack: 1, pallet: 1 };
  function addonPicks(s, exclude) {
    var band = BANDS[s.speed], out = [];
    s.add.forEach(function (id) {
      var a = ADDONS[id]; if (!a) return;
      var pool = PRODUCTS.filter(function (p) {
        if (exclude[p.slug]) return false;
        // an add-on lists either specific products or whole categories
        var inPool = a.products && a.products.length ? a.products.indexOf(p.slug) > -1 : a.categories.indexOf(p.category) > -1;
        if (!inPool) return false;
        if (END_ADDONS[id]) return true;
        return p.forms.indexOf(s.form) > -1 || (s.form === 'container' && p.forms.indexOf('container') > -1);
      });
      var picks = rank(pool, band).slice(0, 2).map(function (r) { return r.p; });
      out.push({ addon: a, picks: picks });
    });
    return out;
  }
  function autoDose(s, top) {
    if (!top || s.add.indexOf('dose') > -1) return null;
    if (['vertical-form-fill-seal', 'premade-pouch-machines'].indexOf(top.category) === -1) return null;
    var slug = { snacks: 'sensiweigh-pro-multihead-weigher', granular: 'sensiweigh-linear-net-weigher', cannabis: 'sensiweigh-pro-mini', solid: 'sensiweigh-pro-multihead-weigher', powder: 'exactdose-auger-filler' }[s.form];
    return slug ? PBYSLUG[slug] : null;
  }

  function miniCard(p) {
    var c = CATS[p.category];
    return '<li><article class="pcard" style="--a1:' + c.accent[0] + ';--a2:' + c.accent[1] + '">' +
      '<div class="pcard__media"><img class="pcard__img" src="' + esc(p.img) + '" alt="" width="' + p.w + '" height="' + p.h + '" loading="lazy" decoding="async"></div>' +
      '<div class="pcard__body"><p class="pcard__cat">' + esc(c.short) + '</p><h4 class="pcard__title"><a href="' + p.url + '">' + esc(p.name) + '</a></h4>' +
      '<p class="pcard__tagline">' + esc(p.tagline) + '</p>' + (p.speedLabel ? '<p class="pcard__meta">' + ICON('gear') + '<span>' + esc(p.speedLabel) + '</span></p>' : '') + '</div>' +
      '<span class="pcard__go" aria-hidden="true">' + ICON('arrow') + '</span></article></li>';
  }
  function lineItem(p, note) {
    var c = CATS[p.category];
    return '<a class="build-line__item" style="--a1:' + c.accent[0] + '" href="' + p.url + '"><img src="' + esc(p.img) + '" alt="" width="' + p.w + '" height="' + p.h + '" loading="lazy"><span>' + esc(p.name) + (note ? '<small>' + esc(note) + '</small>' : '') + '</span></a>';
  }

  function renderResults() {
    var s = state();
    var ranked = primaryMatches(s);
    var top = ranked[0] && ranked[0].p;
    var alts = ranked.slice(1, 4).map(function (r) { return r.p; });
    var summary = [FORMS[s.form] && FORMS[s.form].name, PKGS[s.pkg] && PKGS[s.pkg].name, BANDS[s.speed] && BANDS[s.speed].name].filter(Boolean);

    finder.querySelector('[data-summary]').innerHTML =
      [[1, 'Product', FORMS[s.form]], [2, 'Package', PKGS[s.pkg]], [3, 'Output', BANDS[s.speed]]].map(function (x) {
        return x[2] ? '<button type="button" data-goto="' + x[0] + '"><span class="visually-hidden">Change </span>' + x[1] + ': <b>' + esc(x[2].name) + '</b> ' + ICON('back', 'icon visually-hidden') + '</button>' : '';
      }).join('') + (s.add.length ? '<button type="button" data-goto="4"><span class="visually-hidden">Change </span>Add-ons: <b>' + s.add.length + '</b></button>' : '');

    var primaryEl = finder.querySelector('[data-primary]');
    if (!top) {
      primaryEl.innerHTML = '<div class="results__empty"><h3 class="h3">Let’s talk about a custom setup</h3><p>We don’t have a standard machine for <b>' + esc(summary[0]) + '</b> in a <b>' + esc(summary[1]) + '</b> — but we modify and build machines for applications like yours. Send us your details and we’ll recommend an approach.</p><button type="button" class="btn btn--text" data-goto="2">' + ICON('back') + ' Try a different package</button></div>';
    } else {
      var fit = ranked[0].ok;
      var why = [
        FORMS[s.form] ? 'Handles ' + FORMS[s.form].name.toLowerCase() : null,
        PKGS[s.pkg] ? 'Makes ' + PKGS[s.pkg].name.toLowerCase() + ' packages' : null,
        top.speedLabel ? (fit ? 'Output fits your target: ' : 'Closest output to your target: ') + top.speedLabel : null,
      ].filter(Boolean);
      var c = CATS[top.category];
      primaryEl.innerHTML =
        '<article class="match-hero" style="--a1:' + c.accent[0] + ';--a2:' + c.accent[1] + '"><span class="match-hero__badge">Best match</span>' +
        '<div class="match-hero__img"><img src="' + esc(top.img) + '" alt="" width="' + top.w + '" height="' + top.h + '"></div>' +
        '<div><p class="pcard__cat">' + esc(c.name) + '</p><h3><a href="' + top.url + '">' + esc(top.fullName) + '</a></h3><p>' + esc(top.tagline) + '</p>' +
        '<ul class="match-hero__why" role="list">' + why.map(function (w) { return '<li>' + ICON('check') + esc(w) + '</li>'; }).join('') + '</ul>' +
        '<div class="match-hero__actions"><a class="btn btn--primary" href="' + top.url + '">View machine ' + ICON('arrow') + '</a></div></div></article>' +
        (alts.length ? '<h3 class="results__alt-title">Also consider</h3><ul class="grid grid--products" role="list">' + alts.map(miniCard).join('') + '</ul>' : '');
    }

    // build-a-line
    var exclude = {}; if (top) exclude[top.slug] = 1;
    var picks = addonPicks(s, exclude);
    var dose = autoDose(s, top);
    var order = ['feed', 'dose', 'pack', 'inspect', 'finish', 'carton', 'case', 'casepack', 'pallet'];
    var stageName = { feed: 'Feed & convey', dose: 'Weigh & fill', pack: 'Your packaging machine', inspect: 'Inspect', finish: 'Label, cap & insert', carton: 'Cartoning', 'case': 'Case erect & seal', casepack: 'Case packing', pallet: 'Palletizing' };
    var cols = [];
    var coreKey = top ? (top.stageRole === 'finish' ? 'finish' : top.stageRole === 'end' ? ({ 'cartoning-machines': 'carton', 'case-packing': 'casepack' }[top.category] || (top.slug.indexOf('palletstakr') > -1 ? 'pallet' : 'case')) : 'pack') : null;
    order.forEach(function (key) {
      var items = [];
      if (key === coreKey && top) items.push(lineItem(top, 'Best match'));
      if (key === 'dose' && dose) items.push(lineItem(dose, 'Usually paired'));
      picks.forEach(function (x) { if (x.addon.id === key) x.picks.forEach(function (p) { items.push(lineItem(p)); }); });
      if (items.length) cols.push('<li class="build-line__stage' + (key === coreKey ? ' is-core' : '') + '"><p class="build-line__label"><span class="build-line__n">' + (cols.length + 1) + '</span>' + esc(stageName[key]) + '</p>' + items.join('') + '</li>');
    });
    finder.querySelector('[data-line]').innerHTML = cols.length > 1
      ? '<h3 class="results__line-title">Your line</h3><ol class="build-line" role="list">' + cols.join('') + '</ol>'
      : (top ? '<p class="fine">Want to automate more of your line? <button type="button" class="btn btn--text" data-goto="4">Add weighing, inspection, cartoning or casing</button></p>' : '');

    // hand-off to the quote form
    var slugs = [];
    if (top) slugs.push(top.slug);
    if (dose) slugs.push(dose.slug);
    picks.forEach(function (x) { x.picks.forEach(function (p) { if (slugs.indexOf(p.slug) === -1) slugs.push(p.slug); }); });
    var q = new URLSearchParams({ from: 'finder', form: s.form, pkg: s.pkg, speed: s.speed });
    if (slugs.length) q.set('interest', slugs.slice(0, 6).join(','));
    finder.querySelector('[data-quote-link]').href = '/contact/?' + q.toString();

    var summaryText = summary.join(' · ') + (s.add.length ? ' · add-ons: ' + s.add.map(function (a) { return ADDONS[a].name; }).join(', ') : '') + (top ? ' → ' + top.name : '');
    if (window.WS) { WS.store.set('finder', { form: s.form, pkg: s.pkg, speed: s.speed, add: s.add, slugs: slugs, summary: summaryText }); WS.track('finder_complete', { form: s.form, pkg: s.pkg, speed: s.speed, match: top ? top.slug : 'none' }); }
  }

  /* ───────── init from URL ───────── */
  var q = new URLSearchParams(location.search);
  ['form', 'pkg', 'speed'].forEach(function (k) { if (q.get(k)) setVal(k, q.get(k)); });
  (q.get('add') || '').split(',').forEach(function (a) { if (a) setVal('add', a); });
  d.querySelectorAll('[data-wheel]').forEach(syncWheel);
  filterPackages();
  var s0 = state();
  var start = q.get('done') && s0.form && s0.pkg && s0.speed ? 5 : !s0.form ? 1 : !s0.pkg ? 2 : !s0.speed ? 3 : 4;
  if (q.get('step')) start = Math.min(start, +q.get('step') || start);
  history.replaceState({ step: start }, '', location.href);
  show(start, { silent: start === 1, noHistory: true });
  if (start > 1) { var t = start === 5 ? results : steps[start - 1]; t.setAttribute('tabindex', '-1'); }
})();
