/* Home: quick financing estimate. Same example assumptions as the full calculator on /financing/. */
(function () {
  'use strict';
  var f = document.querySelector('[data-fin-mini]');
  if (!f) return;
  var TERM = 60, RATE = 9, WAGE = 22, HOURS = 8, SHIFTS = 1, DAYS = 250;
  var money = function (v) { return '$' + Math.round(v).toLocaleString('en-US'); };
  var out = function (k, t) { var el = f.querySelector('[data-fm-out="' + k + '"]'); if (el) el.textContent = t; };
  var full = document.querySelector('[data-fin-full]');
  var status = f.querySelector('[data-fm-status]'), timer, tracked = false;
  function calc() {
    var P = +f.elements.cost.value, people = +f.elements.people.value, r = RATE / 100 / 12;
    var payment = P * r / (1 - Math.pow(1 + r, -TERM));
    var savings = people * WAGE * HOURS * SHIFTS * DAYS / 12;
    var payback = savings > 0 ? P / savings : Infinity;
    out('cost', money(P)); out('people', String(people));
    out('payment', money(payment)); out('savings', money(savings));
    out('payback', isFinite(payback) ? (payback < 1 ? 'Under 1 month' : Math.round(payback) + ' months') : '—');
    f.classList.toggle('is-covered', savings >= payment);
    var crewNow = Math.max(people + 1, 3);
    if (full) full.href = '/financing/?cost=' + P + '&crewNow=' + crewNow + '&crewAfter=' + (crewNow - people) + '#calculator';
    clearTimeout(timer);
    timer = setTimeout(function () { status.textContent = 'Estimated monthly payment ' + money(payment) + ', labor savings ' + money(savings) + ' a month, payback ' + (isFinite(payback) ? Math.round(payback) + ' months' : 'not reached') + '.'; }, 700);
  }
  f.addEventListener('input', function () { calc(); if (!tracked && window.WS) { tracked = true; WS.track('home_fin_estimate_used'); } });
  calc();
})();
