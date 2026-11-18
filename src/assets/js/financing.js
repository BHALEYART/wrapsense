/* Financing cost-analysis calculator. Estimates only — everything runs in the browser. */
(function () {
  'use strict';
  var form = document.querySelector('[data-calc]');
  if (!form) return;
  var $ = function (id) { var v = parseFloat(form.elements[id].value); return isFinite(v) && v >= 0 ? v : 0; };
  var money = function (v) { return '$' + Math.round(v).toLocaleString('en-US'); };
  var n = function (v) { return Math.round(v).toLocaleString('en-US'); };
  var set = function (k, t) { var el = form.querySelector('[data-out="' + k + '"]'); if (el) el.textContent = t; };
  var status = form.querySelector('[data-calc-status]');
  var timer, tracked = false;

  function calc() {
    var hoursYear = $('hours') * $('shifts') * $('days');
    var crewSaved = Math.max(0, $('crewNow') - $('crewAfter'));
    var hoursSaved = crewSaved * hoursYear;
    var labor = hoursSaved * $('wage');
    var extra = Math.max(0, $('outAfter') - $('outNow')) * hoursYear;
    var profit = extra * $('margin');
    var benefit = (labor + profit) / 12;
    var P = $('cost'), months = Math.max(1, Math.round($('term'))), r = $('rate') / 100 / 12;
    var payment = r ? P * r / (1 - Math.pow(1 + r, -months)) : P / months;
    var net = benefit - payment;
    var payback = benefit > 0 ? P / benefit : Infinity;

    set('labor', money(labor));
    set('hoursSaved', n(hoursSaved) + ' hrs');
    set('extra', n(extra) + ' packages');
    set('profit', money(profit));
    set('benefit', money(benefit));
    set('payment', money(payment));
    set('net', (net >= 0 ? '+' : '−') + money(Math.abs(net)));
    set('payback', isFinite(payback) ? (payback < 1 ? 'Under 1 month' : Math.round(payback) + ' months') : '—');
    form.querySelector('[data-out="net"]').classList.toggle('is-neg', net < 0);

    var max = Math.max(payment, benefit, 1);
    form.querySelector('[data-bar="pay"]').style.width = (payment / max * 100) + '%';
    form.querySelector('[data-bar="ben"]').style.width = (benefit / max * 100) + '%';

    clearTimeout(timer);
    timer = setTimeout(function () {
      status.textContent = 'Estimated monthly benefit ' + money(benefit) + ', monthly payment ' + money(payment) + ', payback ' + (isFinite(payback) ? Math.round(payback) + ' months' : 'not reached') + '.';
    }, 600);
    return { labor: labor, benefit: benefit, payment: payment, payback: payback };
  }
  form.addEventListener('input', function () {
    var res = calc();
    if (!tracked && window.WS) { tracked = true; WS.track('financing_calculator_used', { equipment_cost: $('cost') }); }
    if (window.WS) WS.store.set('financing', { cost: $('cost'), monthly_benefit: Math.round(res.benefit), payment: Math.round(res.payment) });
  });
  calc();
})();
