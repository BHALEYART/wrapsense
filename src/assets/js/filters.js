/* Machines page filtering — progressive enhancement over a fully rendered list. */
(function () {
  'use strict';
  var form = document.querySelector('[data-filters]');
  if (!form) return;
  var cards = [].slice.call(document.querySelectorAll('[data-card]'));
  var count = form.querySelector('[data-filter-count]');
  var empty = document.querySelector('[data-filter-empty]');
  var total = cards.length;
  var timer;

  function read() {
    var st = form.querySelector('input[name="stage"]:checked');
    return {
      stage: st ? st.value : '',
      forms: form.querySelector('[data-filter="forms"]').value,
      packages: form.querySelector('[data-filter="packages"]').value,
      industries: form.querySelector('[data-filter="industries"]').value,
    };
  }
  function has(el, attr, v) { return !v || (' ' + el.getAttribute('data-' + attr) + ' ').indexOf(' ' + v + ' ') > -1; }

  function apply(push) {
    var f = read(), n = 0;
    cards.forEach(function (li) {
      var c = li.firstElementChild;
      var ok = has(c, 'stage', f.stage) && has(c, 'forms', f.forms) && has(c, 'packages', f.packages) && has(c, 'industries', f.industries);
      li.hidden = !ok;
      if (ok) n++;
    });
    document.querySelectorAll('[data-cat-group]').forEach(function (g) { g.hidden = !g.querySelector('[data-card]:not([hidden])'); });
    document.querySelectorAll('[data-group]').forEach(function (g) { g.hidden = !g.querySelector('[data-cat-group]:not([hidden])'); });
    empty.hidden = n > 0;
    clearTimeout(timer);
    timer = setTimeout(function () { count.textContent = n === total ? 'Showing all ' + total + ' machines' : 'Showing ' + n + ' of ' + total + ' machines'; }, 250);
    if (push) {
      var q = new URLSearchParams();
      Object.keys(f).forEach(function (k) { if (f[k]) q.set(k, f[k]); });
      history.replaceState(null, '', location.pathname + (q.toString() ? '?' + q : ''));
      if (window.WS) WS.track('machines_filter', f);
    }
  }

  form.addEventListener('change', function () { apply(true); });
  document.querySelectorAll('[data-filter-reset]').forEach(function (b) {
    b.addEventListener('click', function (e) {
      e.preventDefault();
      form.reset();
      apply(true);
      form.querySelector('input[name="stage"]').focus();
    });
  });

  // restore from URL
  var q = new URLSearchParams(location.search);
  if (q.get('stage')) { var r = form.querySelector('input[name="stage"][value="' + q.get('stage') + '"]'); if (r) r.checked = true; }
  ['forms', 'packages', 'industries'].forEach(function (k) { if (q.get(k)) form.querySelector('[data-filter="' + k + '"]').value = q.get(k); });
  apply(false);
})();
