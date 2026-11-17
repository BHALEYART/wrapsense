/* Site search: header dialog with instant results + /search/ results page.
   The index (machines, categories, industries, guides, pages) loads on first use. */
(function () {
  'use strict';
  var d = document;
  var dialog = d.getElementById('site-search');
  if (!dialog) return;
  var INDEX_URL = dialog.getAttribute('data-index');
  var input = dialog.querySelector('[data-search-input]');
  var form = dialog.querySelector('[data-search-form]');
  var resultsEl = dialog.querySelector('[data-search-results]');
  var statusEl = dialog.querySelector('[data-search-status]');
  var suggestHTML = resultsEl.innerHTML;
  var index = null, loading = null, opener = null, timer;

  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var norm = function (s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’']/g, '').replace(/[^a-z0-9]+/g, ' ').trim(); };
  var STOP = { the: 1, a: 1, an: 1, and: 1, or: 1, for: 1, of: 1, to: 1, in: 1, my: 1, i: 1, is: 1, what: 1, how: 1, do: 1, with: 1, machine: 0 };

  function load() {
    if (index) return Promise.resolve(index);
    if (!loading) loading = fetch(INDEX_URL).then(function (r) { return r.json(); }).then(function (data) {
      index = data.map(function (e) { return Object.assign(e, { _t: norm(e.title + ' ' + (e.a || '')), _k: norm(e.kw), _b: norm(e.body + ' ' + e.desc) }); });
      return index;
    });
    return loading;
  }

  function score(e, terms, phrase) {
    var s = 0;
    for (var i = 0; i < terms.length; i++) {
      var t = terms[i], hit = 0, re = new RegExp('(^| )' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
      if (re.test(e._t)) hit = 12; else if (e._t.indexOf(t) > -1) hit = 6;
      if (re.test(e._k)) hit = Math.max(hit, 6) + 2; else if (e._k.indexOf(t) > -1) hit = Math.max(hit, 3);
      if (!hit && re.test(e._b)) hit = 1.5;
      if (!hit && t.length > 4 && e._b.indexOf(t.slice(0, -1)) > -1) hit = .8; // plural / partial
      if (!hit) return 0; // every term must match somewhere
      s += hit;
    }
    if (phrase.length > 3 && e._t.indexOf(phrase) > -1) s += 15;
    else if (phrase.length > 3 && (e._k.indexOf(phrase) > -1 || e._b.indexOf(phrase) > -1)) s += 6;
    s += ({ Machine: 1.5, Category: 5, Industry: 3, Guide: 0, Page: .5 }[e.t] || 0) + (e.w || 0);
    return s;
  }

  var vocab = null;
  function lev(a, b) {
    if (Math.abs(a.length - b.length) > 2) return 9;
    var prev = [], cur, i, j;
    for (j = 0; j <= b.length; j++) prev[j] = j;
    for (i = 1; i <= a.length; i++) {
      cur = [i];
      for (j = 1; j <= b.length; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = cur;
    }
    return prev[b.length];
  }
  function correct(t) {
    if (!vocab) { vocab = {}; index.forEach(function (e) { (e._t + ' ' + e._k).split(' ').forEach(function (w) { if (w.length > 3) vocab[w] = (vocab[w] || 0) + 1; }); }); }
    if (vocab[t] || t.length < 4) return t;
    var max = t.length >= 6 ? 2 : 1, best = t, bd = max + 1;
    Object.keys(vocab).forEach(function (w) {
      var dd = lev(t, w);
      if (dd < bd || (dd === bd && vocab[w] > vocab[best])) { bd = dd; best = w; }
    });
    return bd <= max ? best : t;
  }
  function rank(terms, phrase) {
    return index.map(function (e) { return { e: e, s: score(e, terms, phrase) }; })
      .filter(function (r) { return r.s > 0; })
      .sort(function (a, b) { return b.s - a.s; })
      .map(function (r) { return r.e; });
  }
  var corrected = '';
  function search(q) {
    corrected = '';
    var phrase = norm(q);
    var terms = phrase.split(' ').filter(function (t) { return t && !STOP[t]; });
    if (!terms.length) return [];
    var list = rank(terms, phrase);
    if (!list.length) {
      var fixed = terms.map(correct);
      if (fixed.join(' ') !== terms.join(' ')) { list = rank(fixed, fixed.join(' ')); if (list.length) corrected = fixed.join(' '); }
    }
    return list;
  }

  var ORDER = ['Category', 'Machine', 'Industry', 'Guide', 'Page'];
  var LABEL = { Machine: 'Machines', Category: 'Machine categories', Industry: 'Industries', Guide: 'Guides & answers', Page: 'Pages' };
  function render(list, q, limitPer, hl) {
    hl = hl || 'h3';
    if (!list.length) {
      return '<div class="search-empty"><p><strong>No results for “' + esc(q) + '”.</strong></p><p>Try a broader term like “pouch”, “weigher” or “labeler” — or <a href="/contact/">ask a packaging specialist</a>. The <a href="/machine-finder/">Machine Finder</a> can also help.</p></div>';
    }
    var groups = {}, top = list[0];
    list.slice(1).forEach(function (e) { (groups[e.t] = groups[e.t] || []).push(e); });
    var hit = function (e) {
      return '<li><a class="search-hit" href="' + e.url + '" data-track="search_click">' +
        (e.img ? '<span class="search-hit__img"><img src="' + esc(e.img) + '" alt="" loading="lazy"></span>' : '<span class="search-hit__img search-hit__img--type">' + esc(e.t.charAt(0)) + '</span>') +
        '<span class="search-hit__text"><span class="search-hit__title">' + esc(e.title) + '</span><span class="search-hit__desc">' + esc(e.sub ? e.sub + ' · ' : '') + esc(e.desc || '') + '</span></span></a></li>';
    };
    return (corrected ? '<p class="search-corrected">Showing results for <strong>' + esc(corrected) + '</strong></p>' : '') +
      '<section class="search-group search-group--top"><' + hl + ' class="search-group__title">Best match</' + hl + '><ul class="search-list" role="list">' + hit(top) + '</ul></section>' +
      ORDER.filter(function (t) { return groups[t]; }).map(function (t) {
      var items = limitPer ? groups[t].slice(0, limitPer) : groups[t];
      return '<section class="search-group"><' + hl + ' class="search-group__title">' + LABEL[t] + ' <span>(' + groups[t].length + ')</span></' + hl + '><ul class="search-list" role="list">' +
        items.map(hit).join('') + '</ul></section>';
    }).join('');
  }

  function run(q, push) {
    q = q.trim();
    if (q.length < 2) { resultsEl.innerHTML = suggestHTML; statusEl.textContent = ''; return; }
    load().then(function () {
      var list = search(q);
      resultsEl.innerHTML = render(list, q, 4) + (list.length > 8 ? '<p class="search-all"><a href="/search/?q=' + encodeURIComponent(q) + '">See all ' + list.length + ' results</a></p>' : '');
      statusEl.textContent = list.length ? (corrected ? 'Showing results for ' + corrected + '. ' : '') + list.length + ' result' + (list.length === 1 ? '' : 's') + ' for ' + q + '. Press down arrow to browse.' : 'No results for ' + q;
      if (push && window.WS) WS.track('site_search', { search_term: q, results: list.length });
    });
  }

  /* ── dialog ── */
  function open(prefill) {
    opener = d.activeElement;
    if (typeof dialog.showModal === 'function') dialog.showModal(); else dialog.setAttribute('open', '');
    d.body.classList.add('search-open');
    if (prefill) input.value = prefill;
    input.focus();
    input.select();
    load();
    if (input.value) run(input.value);
  }
  function close() {
    if (dialog.open && typeof dialog.close === 'function') dialog.close(); else dialog.removeAttribute('open');
  }
  dialog.addEventListener('close', function () { d.body.classList.remove('search-open'); if (opener && opener.focus) opener.focus(); });
  d.querySelectorAll('[data-search-open]').forEach(function (b) { b.addEventListener('click', function () { open(); }); });
  dialog.querySelector('[data-search-close]').addEventListener('click', close);
  dialog.addEventListener('click', function (e) { if (e.target === dialog) close(); }); // backdrop
  d.addEventListener('keydown', function (e) {
    var tag = (e.target.tagName || '').toLowerCase();
    if ((e.key === '/' && !/input|textarea|select/.test(tag) && !e.target.isContentEditable) || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) {
      if (!dialog.open) { e.preventDefault(); open(); }
    }
  });

  input.addEventListener('input', function () { clearTimeout(timer); timer = setTimeout(function () { run(input.value, true); }, 120); });
  resultsEl.addEventListener('click', function (e) {
    var chip = e.target.closest('[data-search-term]');
    if (chip) { input.value = chip.getAttribute('data-search-term'); run(input.value, true); input.focus(); }
  });
  form.addEventListener('submit', function (e) {
    if (!input.value.trim()) { e.preventDefault(); return; }
    // Enter goes to the full results page; keep it simple and predictable.
  });
  // arrow-key navigation between input and results
  dialog.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    var links = [].slice.call(resultsEl.querySelectorAll('a, button'));
    if (!links.length) return;
    var i = links.indexOf(d.activeElement);
    e.preventDefault();
    if (e.key === 'ArrowDown') (i < 0 ? links[0] : links[Math.min(i + 1, links.length - 1)]).focus();
    else if (i <= 0) input.focus(); else links[i - 1].focus();
  });

  /* ── /search/ page ── */
  var page = d.querySelector('[data-search-page]');
  if (page) {
    var q = new URLSearchParams(location.search).get('q') || '';
    var pageInput = page.querySelector('input[name="q"]');
    var out = page.querySelector('[data-search-page-results]');
    var st = page.querySelector('[data-search-page-status]');
    pageInput.value = q;
    var go = function (val) {
      val = val.trim();
      if (val.length < 2) { out.innerHTML = ''; st.textContent = ''; return; }
      load().then(function () {
        var list = search(val);
        out.innerHTML = render(list, val, 0, 'h2');
        st.textContent = list.length ? list.length + ' result' + (list.length === 1 ? '' : 's') + ' for “' + val + '”' : '';
      });
    };
    go(q);
    if (q && window.WS) load().then(function () { WS.track('site_search', { search_term: q, results: search(q).length, page: 'results' }); });
    page.querySelector('form').addEventListener('submit', function (e) {
      e.preventDefault();
      history.replaceState(null, '', '?q=' + encodeURIComponent(pageInput.value.trim()));
      go(pageInput.value);
    });
  }
})();
