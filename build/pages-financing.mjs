import { esc, html, icon, imgTag } from './lib.mjs';
import { layout, breadcrumbs } from './layout.mjs';
import { site, financing } from '../src/data/site.mjs';

const applyHref = () => financing.applyUrl || '/contact/?type=financing';
const applyAttrs = () => (financing.applyUrl ? ' target="_blank" rel="noopener"' : '');
const partner = () => financing.partner || 'our financing partner';

export function financingPage() {
  const bc = breadcrumbs([['Home', '/'], ['Financing', '/financing/']]);
  const num = (id, label, value, { prefix = '', suffix = '', step = 1, min = 0, hint = '' } = {}) => html`
    <div class="calc-field">
      <label for="${id}">${esc(label)}</label>
      <div class="calc-input">${prefix ? `<span aria-hidden="true">${prefix}</span>` : ''}<input id="${id}" name="${id}" type="number" inputmode="decimal" value="${value}" min="${min}" step="${step}"${hint ? ` aria-describedby="${id}-h"` : ''}>${suffix ? `<span aria-hidden="true">${suffix}</span>` : ''}</div>
      ${hint ? `<p class="field__hint" id="${id}-h">${esc(hint)}</p>` : ''}
    </div>`;
  const out = (id, label) => `<div class="calc-out"><dt>${esc(label)}</dt><dd data-out="${id}">—</dd></div>`;

  const body = html`
<section class="page-hero page-hero--split"><div class="container page-hero__split">
  <div>
    ${bc.html}
    <p class="eyebrow">Equipment financing</p>
    <h1 class="page-hero__title">Finance your packaging equipment</h1>
    <p class="page-hero__lead">Start saving labor and adding output now, and spread the cost into monthly payments. Run the numbers below, then apply in a few minutes.</p>
    <div class="hero__actions">
      <a class="btn btn--primary" href="${applyHref()}"${applyAttrs()} data-track="financing_apply">Apply for financing ${icon('arrow')}</a>
      <a class="btn btn--outline" href="#calculator">Estimate my savings</a>
    </div>
  </div>
  <div class="page-hero__img">${imgTag('products/fastpack-line.webp', '', { eager: true })}</div>
</div></section>

<section class="section section--tight"><div class="container">
  <ul class="grid grid--3" role="list">
    <li><article class="scard"><span class="scard__icon">${icon('box')}</span><h2 class="scard__title">Keep your cash working</h2><p>Spread the investment over time instead of paying for a machine or line all at once.</p></article></li>
    <li><article class="scard"><span class="scard__icon">${icon('users')}</span><h2 class="scard__title">Let savings help cover payments</h2><p>Labor saved and extra output start the day the machine runs — often a big share of the monthly payment.</p></article></li>
    <li><article class="scard"><span class="scard__icon">${icon('gear')}</span><h2 class="scard__title">Machines or complete lines</h2><p>Finance a single machine, a full line, or add-ons like weighers, inspection and case packing.</p></article></li>
  </ul>
</div></section>

<section class="section section--alt" id="calculator" aria-labelledby="calc-title"><div class="container">
  <div class="section-head"><p class="eyebrow">Cost analysis</p><h2 id="calc-title" class="section-title">What could automation save you?</h2>
  <p class="section-lead">Enter your numbers for an estimate of labor savings, time saved, added production and payback.</p></div>
  <form class="calc" data-calc onsubmit="return false" aria-describedby="calc-note">
    <div class="calc__inputs">
      <fieldset class="calc-group"><legend>Investment</legend>
        ${num('cost', 'Equipment cost', 100000, { prefix: '$', step: 1000 })}
        ${num('term', 'Finance term', 60, { suffix: 'months', step: 12, min: 12 })}
        ${num('rate', 'Example interest rate', 9, { suffix: '%', step: 0.25, hint: 'For illustration only — your rate comes from the lender.' })}
      </fieldset>
      <fieldset class="calc-group"><legend>Labor</legend>
        ${num('crewNow', 'People packing today (per shift)', 3)}
        ${num('crewAfter', 'People needed with the machine', 1)}
        ${num('wage', 'Hourly cost per person', 22, { prefix: '$', step: 0.5, hint: 'Wage plus taxes and benefits.' })}
      </fieldset>
      <fieldset class="calc-group"><legend>Production</legend>
        ${num('outNow', 'Packages per hour today', 600, { step: 50 })}
        ${num('outAfter', 'Packages per hour with the machine', 1800, { step: 50 })}
        ${num('margin', 'Profit per extra package', 0, { prefix: '$', step: 0.05, hint: 'Leave at 0 if you can’t sell more than you make today.' })}
        ${num('hours', 'Hours per shift', 8)}
        ${num('shifts', 'Shifts per day', 1, { min: 1 })}
        ${num('days', 'Production days per year', 250, { step: 5 })}
      </fieldset>
    </div>
    <div class="calc__results" aria-labelledby="calc-res-title">
      <h3 id="calc-res-title" class="calc__res-title">Your estimate</h3>
      <dl class="calc-outs">
        ${out('labor', 'Annual labor savings')}
        ${out('hoursSaved', 'Labor hours saved per year')}
        ${out('extra', 'Added production capacity per year')}
        ${out('profit', 'Added profit per year')}
        ${out('benefit', 'Total monthly benefit')}
        ${out('payment', 'Estimated monthly payment')}
        ${out('net', 'Benefit after payment, per month')}
        ${out('payback', 'Estimated payback')}
      </dl>
      <div class="calc-bar" aria-hidden="true"><span class="calc-bar__pay" data-bar="pay"></span><span class="calc-bar__ben" data-bar="ben"></span></div>
      <p class="calc-bar__legend" aria-hidden="true"><span class="k k--pay"></span> Monthly payment <span class="k k--ben"></span> Monthly benefit</p>
      <p class="visually-hidden" role="status" aria-live="polite" data-calc-status></p>
      <div class="calc__cta">
        <a class="btn btn--light" href="${applyHref()}"${applyAttrs()} data-track="financing_apply_calc">Apply for financing ${icon('arrow')}</a>
        <a class="btn btn--ghost-light" href="/contact/?type=financing" data-track="financing_quote">Get a quote first</a>
      </div>
    </div>
  </form>
  <p class="fine" id="calc-note">Estimates only, based on the numbers you enter. Not a financing offer or quote; rates, terms and approval are set by the lender.</p>
</div></section>

<section class="section" aria-labelledby="how-title"><div class="container">
  <h2 id="how-title" class="section-title">How it works</h2>
  <ol class="timeline" role="list">
    <li><span class="timeline__n" aria-hidden="true">1</span><h3 class="timeline__title">Get your quote</h3><p>We spec the right machine or line and send a quote.</p></li>
    <li><span class="timeline__n" aria-hidden="true">2</span><h3 class="timeline__title">Apply</h3><p>Apply online with ${esc(partner())}. Include your WrapSense quote number so your approval is tied to your equipment.</p></li>
    <li><span class="timeline__n" aria-hidden="true">3</span><h3 class="timeline__title">Get approved</h3><p>The lender reviews your application and confirms terms.</p></li>
    <li><span class="timeline__n" aria-hidden="true">4</span><h3 class="timeline__title">Build &amp; install</h3><p>We build, test, deliver and install — and train your team.</p></li>
  </ol>
</div></section>

<section class="section section--alt" aria-labelledby="ffaq"><div class="container narrow">
  <h2 id="ffaq" class="section-title">Financing FAQs</h2>
  <details class="faq__item"><summary>Can I finance a complete packaging line?</summary><p>Yes. You can finance a single machine or a full line, including feeding, weighing, inspection and end-of-line equipment.</p></details>
  <details class="faq__item"><summary>Do I need a quote before applying?</summary><p>It helps. Applying with your WrapSense quote makes sure the approved amount matches the equipment you need.</p></details>
  <details class="faq__item"><summary>How does financing work with deposits and build time?</summary><p>It depends on the lender and program. Ask us which terms apply to your quote — some programs keep our standard payment terms during the build.</p></details>
  <details class="faq__item"><summary>Who decides my rate and approval?</summary><p>The lender. The calculator on this page is for planning only.</p></details>
</div></section>

<section class="cta-band"><div class="container cta-band__inner">
  <div><h2 class="cta-band__title">Ready to run the numbers for real?</h2><p>Tell us what you’re packaging and we’ll quote the equipment you can finance.</p></div>
  <div class="cta-band__actions"><a class="btn btn--primary" href="/contact/?type=financing" data-track="financing_band_quote">Request a quote ${icon('arrow')}</a><a class="btn btn--outline" href="${site.phoneHref}" data-track="phone_click">${icon('phone')} ${esc(site.phone)}</a></div>
</div></section>`;
  return layout({
    path: '/financing/',
    title: 'Packaging Equipment Financing & Cost Calculator',
    description: 'Finance WrapSense packaging machines and lines. Estimate labor savings, time saved, added production and payback, then apply online.',
    body,
    scripts: ['financing.js'],
    jsonld: [bc.ld],
  });
}
