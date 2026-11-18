/* Quote / contact form: prefill, conditional fields, accessible validation, attribution, async submit. */
(function () {
  'use strict';
  var d = document;
  var form = d.querySelector('[data-lead-form]');
  if (!form) return;
  var alertBox = form.querySelector('[data-form-alert]');
  var submitBtn = form.querySelector('[data-submit]');
  var chips = form.querySelector('[data-interest-chips]');
  var addSel = form.querySelector('[data-interest-add]');
  var interestInput = form.querySelector('[data-interest-input]');
  var q = new URLSearchParams(location.search);
  var attempted = false, started = false;
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };

  form.querySelector('[data-form-start]').value = String(Date.now());

  /* ── interest chips ── */
  var names = {};
  [].forEach.call(addSel.options, function (o) { if (o.value) names[o.value] = o.textContent; });
  var interest = [];
  function renderChips() {
    chips.innerHTML = interest.map(function (s) {
      return '<li class="interest__chip">' + esc(names[s] || s) + '<button type="button" data-remove="' + s + '" aria-label="Remove ' + esc(names[s] || s) + '"><svg class="icon" aria-hidden="true"><use href="#i-close"></use></svg></button></li>';
    }).join('');
    interestInput.value = interest.join(',');
    [].forEach.call(addSel.options, function (o) { if (o.value) o.disabled = interest.indexOf(o.value) > -1; });
  }
  function addInterest(slug) { if (slug && names[slug] && interest.indexOf(slug) === -1) { interest.push(slug); renderChips(); } }
  addSel.addEventListener('change', function () { addInterest(addSel.value); addSel.value = ''; });
  chips.addEventListener('click', function (e) {
    var b = e.target.closest('[data-remove]');
    if (!b) return;
    var idx = interest.indexOf(b.getAttribute('data-remove'));
    interest.splice(idx, 1);
    renderChips();
    var next = chips.querySelectorAll('button')[Math.min(idx, interest.length - 1)];
    (next || addSel).focus();
  });

  /* ── conditional sections ── */
  function currentType() { var r = form.querySelector('input[name="type"]:checked'); return r ? r.value : ''; }
  function syncType() {
    var t = currentType();
    form.querySelectorAll('[data-show-for]').forEach(function (el) {
      var on = el.getAttribute('data-show-for').split(' ').indexOf(t) > -1;
      el.hidden = !on;
      el.querySelectorAll('[data-required-for]').forEach(function (inp) {
        var req = on && inp.getAttribute('data-required-for').split(' ').indexOf(t) > -1;
        inp.required = req;
        inp.setAttribute('aria-required', String(req));
      });
    });
  }
  form.addEventListener('change', function (e) { if (e.target.name === 'type') syncType(); });

  /* ── prefill ── */
  var setSelect = function (name, v) { var el = form.elements[name]; if (el && v && el.querySelector('option[value="' + v + '"]')) el.value = v; };
  var setRadio = function (name, v) { var el = form.querySelector('input[name="' + name + '"][value="' + v + '"]'); if (el) el.checked = true; };
  if (q.get('type')) setRadio('type', q.get('type'));
  setSelect('form', q.get('form')); setSelect('pkg', q.get('pkg')); setSelect('speed', q.get('speed'));
  if (q.get('samples')) setRadio('samples', q.get('samples'));
  if (q.get('product')) form.elements.product.value = q.get('product').slice(0, 300);
  (q.get('interest') || '').split(',').forEach(addInterest);
  if (q.get('industry')) {
    var hi = d.createElement('input'); hi.type = 'hidden'; hi.name = 'industry'; hi.value = q.get('industry'); form.appendChild(hi);
  }
  if (q.get('category')) {
    var h = d.createElement('input'); h.type = 'hidden'; h.name = 'category'; h.value = q.get('category'); form.appendChild(h);
  }
  var finder = window.WS && WS.store.get('finder');
  if (finder && !q.get('form') && !q.get('interest')) {
    setSelect('form', finder.form); setSelect('pkg', finder.pkg); setSelect('speed', finder.speed);
    (finder.slugs || []).slice(0, 4).forEach(addInterest);
  }
  if (q.get('from') === 'finder' || (finder && !q.toString())) {
    var note = d.createElement('p'); note.className = 'fine'; note.textContent = 'We’ve filled in your Machine Finder answers — adjust anything you like.';
    form.querySelector('.form-section').insertBefore(note, form.querySelector('.choice-group').nextSibling);
  }
  renderChips();
  syncType();

  /* ── validation ── */
  var rules = {
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : 'Enter an email address like name@company.com.'; },
    phone: function (v) { return v.replace(/\D/g, '').length >= 7 ? '' : 'Enter a phone number we can reach you on.'; },
  };
  var labelOf = function (el) { var l = form.querySelector('label[for="' + el.id + '"]'); return l ? l.childNodes[0].textContent.trim() : el.name; };
  function check(el) {
    if (!el.id || el.closest('[hidden]')) return '';
    var v = (el.value || '').trim(), msg = '';
    if (el.required && !v) msg = (el.id === 'product' ? 'Tell us what you’re packaging.' : labelOf(el) + ' is required.');
    else if (v && rules[el.id]) msg = rules[el.id](v);
    var err = d.getElementById(el.id + '-err');
    if (err) { err.textContent = msg; err.hidden = !msg; }
    if (msg) el.setAttribute('aria-invalid', 'true'); else el.removeAttribute('aria-invalid');
    return msg;
  }
  form.addEventListener('blur', function (e) { if (attempted && e.target.matches('input, select, textarea')) check(e.target); }, true);
  form.addEventListener('input', function (e) { if (e.target.getAttribute('aria-invalid') === 'true') check(e.target); });
  form.addEventListener('focusin', function () { if (!started) { started = true; window.WS && WS.track('form_start', { form: 'quote' }); } });

  function showAlert(type, html) {
    alertBox.className = 'form-alert form-alert--' + type;
    alertBox.innerHTML = html;
    alertBox.hidden = false;
    alertBox.focus();
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    attempted = true;
    var errors = [];
    form.querySelectorAll('input:not([type=hidden]):not([type=radio]):not([type=checkbox]), select:not([data-interest-add]), textarea').forEach(function (el) {
      var m = check(el); if (m) errors.push({ el: el, msg: m });
    });
    if (errors.length) {
      showAlert('error', '<strong>Please fix ' + (errors.length === 1 ? 'this field' : 'these ' + errors.length + ' fields') + ':</strong><ul>' +
        errors.map(function (x) { return '<li><a href="#' + x.el.id + '">' + esc(x.msg) + '</a></li>'; }).join('') + '</ul>');
      alertBox.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function (ev) { ev.preventDefault(); d.getElementById(a.getAttribute('href').slice(1)).focus(); }); });
      return;
    }

    var data = {};
    new FormData(form).forEach(function (v, k) { data[k] = typeof v === 'string' ? v.trim() : v; });
    var attr = window.WS ? WS.attribution() : {};
    data.attribution = attr;
    data.page = location.pathname + location.search;
    var hutk = document.cookie.match(/(?:^|; )hubspotutk=([^;]+)/);
    if (hutk) data.hutk = decodeURIComponent(hutk[1]);

    submitBtn.classList.add('is-loading');
    submitBtn.setAttribute('aria-disabled', 'true');
    alertBox.hidden = true;

    fetch(form.action, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, body: j }; }); })
      .then(function (res) {
        if (!res.ok) throw res.body;
        if (window.WS) WS.track('generate_lead', { lead_type: data.type, interest: data.interest, source: attr.ft_utm_source || attr.ft_source || '', medium: attr.ft_utm_medium || '' });
        try { sessionStorage.setItem('ws_lead_sent', '1'); } catch (x) {}
        showAlert('success', 'Thanks — your request was sent. Taking you to the confirmation page…');
        setTimeout(function () { location.href = '/thank-you/'; }, 600);
      })
      .catch(function (err) {
        submitBtn.classList.remove('is-loading');
        submitBtn.removeAttribute('aria-disabled');
        var fieldErrs = err && err.fields;
        if (fieldErrs) Object.keys(fieldErrs).forEach(function (k) { var el = form.elements[k]; if (el && el.id) { var er = d.getElementById(el.id + '-err'); if (er) { er.textContent = fieldErrs[k]; er.hidden = false; } el.setAttribute('aria-invalid', 'true'); } });
        var body = 'Sorry — we couldn’t send your request just now. Please try again, or call <a href="tel:+13012000048">301-200-0048</a> or email <a href="mailto:sales@wrapsensepackaging.com?subject=' + encodeURIComponent('Quote request') + '&body=' + encodeURIComponent((data.product || '') + '\n\n' + (data.message || '')) + '">sales@wrapsensepackaging.com</a>.';
        showAlert('error', (err && err.error ? esc(err.error) + ' ' : '') + body);
        window.WS && WS.track('form_error', { form: 'quote' });
      });
  });
})();
