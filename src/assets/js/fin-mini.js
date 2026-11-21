/* Home: quick labor-savings estimate (no pricing). Same example assumptions as the full calculator on /financing/. */
(function () {
  'use strict';
  var f = document.querySelector('[data-fin-mini]');
  if (!f) return;
  var WAGE = 22, HOURS = 8, DAYS = 250;
  var money = function (v) { return '$' + Math.round(v).toLocaleString('en-US'); };
  var out = function (k, t) { var el = f.querySelector('[data-fm-out="' + k + '"]'); if (el) el.textContent = t; };
  var full = document.querySelector('[data-fin-full]');
  var status = f.querySelector('[data-fm-status]'), timer, tracked = false;
  function calc() {
    var people = +f.elements.people.value, shifts = +f.elements.shifts.value;
    var hours = people * HOURS * shifts * DAYS, year = hours * WAGE;
    out('people', String(people)); out('shifts', String(shifts));
    out('month', money(year / 12)); out('year', money(year)); out('hours', Math.round(hours).toLocaleString('en-US') + ' hrs');
    var crewNow = Math.max(people + 1, 3);
    if (full) full.href = '/financing/?crewNow=' + crewNow + '&crewAfter=' + (crewNow - people) + '&shifts=' + shifts + '#calculator';
    clearTimeout(timer);
    timer = setTimeout(function () { status.textContent = 'Estimated labor savings ' + money(year / 12) + ' a month, ' + money(year) + ' a year.'; }, 700);
  }
  f.addEventListener('input', function () { calc(); if (!tracked && window.WS) { tracked = true; WS.track('home_fin_estimate_used'); } });
  calc();
})();
