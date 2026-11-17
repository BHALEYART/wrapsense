/* WrapSense — site-wide behavior: navigation + first-party lead attribution. No dependencies. */
(function () {
  'use strict';
  var d = document, w = window;
  d.documentElement.classList.add('js');

  /* ───────────── Lead attribution (first-party, localStorage — no cookies) ─────────────
     first touch  : where the visitor originally came from (never overwritten)
     last touch   : most recent campaign / external referral
     journey      : pages viewed this session, machines viewed, finder answers
     Everything stays in the browser until a form is submitted. With Global Privacy Control
     on, data is kept for the current session only. */
  var GPC = !!navigator.globalPrivacyControl;
  var persist = (function () { try { var s = GPC ? sessionStorage : localStorage; s.setItem('_t', '1'); s.removeItem('_t'); return s; } catch (e) { return null; } })();
  var session = (function () { try { return sessionStorage; } catch (e) { return null; } })();
  var get = function (s, k) { try { return JSON.parse(s.getItem('ws_' + k)); } catch (e) { return null; } };
  var set = function (s, k, v) { try { s && s.setItem('ws_' + k, JSON.stringify(v)); } catch (e) {} };

  var params = new URLSearchParams(location.search);
  var CAMPAIGN_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'gbraid', 'wbraid', 'fbclid', 'msclkid', 'li_fat_id', 'ttclid'];
  var ref = d.referrer && d.referrer.indexOf(location.host) === -1 ? d.referrer : '';
  var touch = { ts: new Date().toISOString(), landing: location.pathname + location.search, referrer: ref };
  var hasCampaign = false;
  CAMPAIGN_KEYS.forEach(function (k) { var v = params.get(k); if (v) { touch[k] = v.slice(0, 200); hasCampaign = true; } });
  if (!touch.utm_source && !hasCampaign) touch.source = ref ? (function () { try { return new URL(ref).hostname; } catch (e) { return 'referral'; } })() : 'direct';

  if (persist) {
    if (!get(persist, 'ft')) set(persist, 'ft', touch);
    if (hasCampaign || ref || !get(persist, 'lt')) set(persist, 'lt', touch);
    if (session && !get(session, 'sess')) { set(session, 'sess', 1); set(persist, 'visits', (get(persist, 'visits') || 0) + 1); }
  }
  if (session) {
    var pages = get(session, 'pages') || [];
    pages.push(location.pathname);
    set(session, 'pages', pages.slice(-25));
  }

  w.dataLayer = w.dataLayer || [];
  var WS = (w.WS = w.WS || {});
  WS.track = function (event, data) {
    var payload = Object.assign({ event: event }, data || {});
    w.dataLayer.push(payload);
  };
  WS.store = { get: function (k) { return persist && get(persist, k); }, set: function (k, v) { set(persist, k, v); } };
  WS.noteInterest = function (slug) {
    if (!slug || !persist) return;
    var list = (get(persist, 'interest') || []).filter(function (s) { return s !== slug; });
    list.unshift(slug);
    set(persist, 'interest', list.slice(0, 12));
  };
  WS.attribution = function () {
    var ft = (persist && get(persist, 'ft')) || touch, lt = (persist && get(persist, 'lt')) || touch;
    var flat = {};
    Object.keys(ft).forEach(function (k) { flat['ft_' + k] = ft[k]; });
    Object.keys(lt).forEach(function (k) { flat['lt_' + k] = lt[k]; });
    flat.visits = (persist && get(persist, 'visits')) || 1;
    flat.pages = ((session && get(session, 'pages')) || []).join(' > ');
    flat.viewed_machines = ((persist && get(persist, 'interest')) || []).join(',');
    var f = persist && get(persist, 'finder');
    if (f) flat.finder = f.summary || '';
    flat.submitted_from = location.pathname;
    flat.gpc = GPC ? '1' : '0';
    return flat;
  };

  // product pages: remember which machines were viewed
  var pm = location.pathname.match(/^\/machines\/[^/]+\/([^/]+)\/$/);
  if (pm) WS.noteInterest(pm[1]);

  // click tracking: [data-track] plus tel:/mailto:/pdf links
  d.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a, button');
    if (!a) return;
    var name = a.getAttribute('data-track');
    var href = a.getAttribute('href') || '';
    if (!name) {
      if (href.indexOf('tel:') === 0) name = 'phone_click';
      else if (href.indexOf('mailto:') === 0) name = 'email_click';
      else if (/\.pdf(#|$)/i.test(href)) name = 'catalog_download';
    }
    if (name) WS.track(name, { link_url: href, product: a.getAttribute('data-product') || undefined, page: location.pathname });
  });

  /* ───────────── Navigation ───────────── */
  var header = d.getElementById('site-header');
  var toggle = d.querySelector('.nav-toggle');
  var nav = d.getElementById('site-nav');
  var triggers = [].slice.call(d.querySelectorAll('.site-nav__trigger'));
  var mq = w.matchMedia('(max-width: 1080px)');

  function setMega(t, open) {
    triggers.forEach(function (o) {
      var on = o === t && open;
      o.setAttribute('aria-expanded', String(on));
      d.getElementById(o.getAttribute('aria-controls')).hidden = !on;
    });
  }
  var openTrigger = function () { return triggers.filter(function (t) { return t.getAttribute('aria-expanded') === 'true'; })[0]; };
  function setNav(open) {
    if (!toggle) return;
    if (open && header) d.documentElement.style.setProperty('--nav-top', Math.max(0, header.getBoundingClientRect().bottom) + 'px');
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
    d.body.classList.toggle('nav-open', open);
    if (!open) setMega(null, false);
  }
  if (toggle) toggle.addEventListener('click', function () { setNav(toggle.getAttribute('aria-expanded') !== 'true'); });
  triggers.forEach(function (t) { t.addEventListener('click', function () { setMega(t, t.getAttribute('aria-expanded') !== 'true'); }); });

  d.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var ot = openTrigger();
    if (ot) { setMega(null, false); ot.focus(); }
    else if (toggle && toggle.getAttribute('aria-expanded') === 'true') { setNav(false); toggle.focus(); }
  });
  d.addEventListener('click', function (e) {
    if (!mq.matches && openTrigger() && !e.target.closest('.has-mega')) setMega(null, false);
  });
  // close the desktop mega menu when focus leaves it
  d.addEventListener('focusin', function (e) {
    var ot = openTrigger();
    if (!mq.matches && ot && e.target.closest('.has-mega') !== ot.closest('.has-mega')) setMega(null, false);
  });
  mq.addEventListener && mq.addEventListener('change', function () { setNav(false); });

  var onScroll = function () { header && header.classList.toggle('is-scrolled', w.scrollY > 8); };
  w.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var y = d.querySelector('[data-year]');
  if (y) y.textContent = new Date().getFullYear();
})();
