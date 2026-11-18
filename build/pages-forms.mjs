import { esc, html, icon, imgTag } from './lib.mjs';
import { layout, breadcrumbs, orgLd } from './layout.mjs';
import { site, forms, packages, speedBands } from '../src/data/site.mjs';
import { products } from '../src/data/products.mjs';
import { categories } from '../src/data/categories.mjs';
import { productUrl } from './components.mjs';

const field = ({ id, label, type = 'text', required = false, hint = '', autocomplete = '', attrs = '', full = false, inputmode = '' }) => html`
<div class="field${full ? ' field--full' : ''}">
  <label for="${id}">${esc(label)}${required ? ' <span class="req" aria-hidden="true">*</span>' : ' <span class="opt-label">(optional)</span>'}</label>
  ${hint ? `<p class="field__hint" id="${id}-hint">${esc(hint)}</p>` : ''}
  ${type === 'textarea'
    ? `<textarea id="${id}" name="${id}" rows="4"${required ? ' required aria-required="true"' : ''}${hint ? ` aria-describedby="${id}-hint ${id}-err"` : ` aria-describedby="${id}-err"`} ${attrs}></textarea>`
    : `<input id="${id}" name="${id}" type="${type}"${autocomplete ? ` autocomplete="${autocomplete}"` : ''}${inputmode ? ` inputmode="${inputmode}"` : ''}${required ? ' required aria-required="true"' : ''}${hint ? ` aria-describedby="${id}-hint ${id}-err"` : ` aria-describedby="${id}-err"`} ${attrs}>`}
  <p class="field__error" id="${id}-err" hidden></p>
</div>`;

const select = ({ id, label, options, required = false, full = false, hint = '' }) => html`
<div class="field${full ? ' field--full' : ''}">
  <label for="${id}">${esc(label)}${required ? ' <span class="req" aria-hidden="true">*</span>' : ' <span class="opt-label">(optional)</span>'}</label>
  ${hint ? `<p class="field__hint" id="${id}-hint">${esc(hint)}</p>` : ''}
  <select id="${id}" name="${id}"${required ? ' required aria-required="true"' : ''} aria-describedby="${hint ? id + '-hint ' : ''}${id}-err">
    <option value="">Select…</option>
    ${options.map(([v, t]) => `<option value="${esc(v)}">${esc(t)}</option>`)}
  </select>
  <p class="field__error" id="${id}-err" hidden></p>
</div>`;

export function contactPage() {
  const bc = breadcrumbs([['Home', '/'], ['Request a Quote', '/contact/']]);
  const types = [
    ['new-machine', 'A packaging machine', 'box'],
    ['line', 'A complete packaging line', 'gear'],
    ['custom', 'A custom machine', 'sparkle'],
    ['service', 'Service, parts or support', 'wrench'],
    ['film', 'Packaging film', 'doc'],
    ['financing', 'Equipment financing', 'flask'],
  ];
  const machineOptions = categories.map((c) => ({ c, list: products.filter((p) => p.category === c.slug) }));
  const body = html`
<section class="page-hero page-hero--contact"><div class="container">
  ${bc.html}
  <h1 class="page-hero__title">Request a quote</h1>
  <p class="page-hero__lead">Tell us what you’re packaging and how you want it packed. A WrapSense packaging specialist will follow up to talk through your application — and set up a test with your samples if you’d like.</p>
</div></section>

<section class="section section--tight"><div class="container contact-layout">
  <form class="lead-form" id="lead-form" action="${site.leadEndpoint}" method="post" novalidate data-lead-form>
    <div class="form-alert" role="alert" tabindex="-1" hidden data-form-alert></div>

    <fieldset class="form-section">
      <legend class="form-section__title"><span class="form-section__n" aria-hidden="true">1</span> Your project</legend>

      <fieldset class="field field--full choice-group" aria-describedby="type-err">
        <legend>What can we help you with? <span class="req" aria-hidden="true">*</span></legend>
        <div class="choice-row">
          ${types.map(([v, t, ic], i) => html`<label class="choice"><input type="radio" name="type" value="${v}"${i === 0 ? ' checked' : ''} required><span>${icon(ic)}${esc(t)}</span></label>`)}
        </div>
        <p class="field__error" id="type-err" hidden></p>
      </fieldset>

      <div class="form-grid" data-show-for="new-machine line custom film financing">
        ${field({ id: 'product', label: 'What are you packaging?', required: true, hint: 'For example: “ground coffee, 12 oz bags” or “protein powder in 30 g stick packs”.', full: true, attrs: 'maxlength="300" data-required-for="new-machine line custom film"' })}
        ${select({ id: 'form', label: 'Product type', options: forms.map((f) => [f.id, f.name]) })}
        ${select({ id: 'pkg', label: 'Package format', options: packages.map((p) => [p.id, p.name]) })}
        ${select({ id: 'speed', label: 'Target output', options: speedBands.map((s) => [s.id, s.name]) })}
        ${select({ id: 'timeline', label: 'Timeline', options: [['asap', 'As soon as possible'], ['1-3', 'Within 1–3 months'], ['3-6', 'Within 3–6 months'], ['6+', '6+ months'], ['research', 'Just researching']] })}

        <fieldset class="field field--full choice-group">
          <legend>Can you send product samples for testing? <span class="opt-label">(optional)</span></legend>
          <div class="choice-row choice-row--sm">
            <label class="choice choice--sm"><input type="radio" name="samples" value="yes"><span>Yes</span></label>
            <label class="choice choice--sm"><input type="radio" name="samples" value="maybe"><span>Maybe</span></label>
            <label class="choice choice--sm"><input type="radio" name="samples" value="no"><span>No</span></label>
          </div>
        </fieldset>
      </div>

      <div class="form-grid" data-show-for="service" hidden>
        ${field({ id: 'machine_model', label: 'Machine make / model', attrs: 'maxlength="200" data-required-for="service"', required: true })}
        ${field({ id: 'serial', label: 'Serial number', attrs: 'maxlength="100"' })}
      </div>

      <div class="field field--full interest" data-interest-wrap>
        <label for="interest-add">Machines you’re interested in <span class="opt-label">(optional)</span></label>
        <ul class="interest__chips" role="list" data-interest-chips aria-live="polite"></ul>
        <select id="interest-add" data-interest-add>
          <option value="">Add a machine…</option>
          ${machineOptions.map(({ c, list }) => `<optgroup label="${esc(c.name)}">${list.map((p) => `<option value="${p.slug}">${esc(p.name)}</option>`).join('')}</optgroup>`)}
        </select>
        <input type="hidden" name="interest" value="" data-interest-input>
      </div>

      ${field({ id: 'message', label: 'Anything else we should know?', type: 'textarea', full: true, hint: 'Bag sizes, fill weights, current process, space constraints, budget — whatever helps.', attrs: 'maxlength="4000"' })}
    </fieldset>

    <fieldset class="form-section">
      <legend class="form-section__title"><span class="form-section__n" aria-hidden="true">2</span> Your details</legend>
      <div class="form-grid">
        ${field({ id: 'first_name', label: 'First name', required: true, autocomplete: 'given-name', attrs: 'maxlength="80"' })}
        ${field({ id: 'last_name', label: 'Last name', required: true, autocomplete: 'family-name', attrs: 'maxlength="80"' })}
        ${field({ id: 'company', label: 'Company', autocomplete: 'organization', attrs: 'maxlength="160"' })}
        ${field({ id: 'email', label: 'Email', type: 'email', required: true, autocomplete: 'email', attrs: 'maxlength="200"' })}
        ${field({ id: 'phone', label: 'Phone', type: 'tel', required: true, autocomplete: 'tel', inputmode: 'tel', attrs: 'maxlength="40"' })}
        ${field({ id: 'zip', label: 'ZIP / postal code', autocomplete: 'postal-code', attrs: 'maxlength="12"', hint: 'Helps us plan delivery and service.' })}
        <fieldset class="field field--full choice-group">
          <legend>Best way to reach you <span class="opt-label">(optional)</span></legend>
          <div class="choice-row choice-row--sm">
            <label class="choice choice--sm"><input type="radio" name="contact_pref" value="phone"><span>Phone</span></label>
            <label class="choice choice--sm"><input type="radio" name="contact_pref" value="email"><span>Email</span></label>
            <label class="choice choice--sm"><input type="radio" name="contact_pref" value="either" checked><span>Either</span></label>
          </div>
        </fieldset>
      </div>
    </fieldset>

    <!-- spam trap: real people never see or fill this -->
    <div class="hp" aria-hidden="true"><label for="website">Website</label><input id="website" name="website" type="text" tabindex="-1" autocomplete="off"></div>
    <input type="hidden" name="_t" value="" data-form-start>
    <div data-attribution></div>

    <div class="form-submit">
      <button class="btn btn--primary btn--lg" type="submit" data-submit>Send my request ${icon('arrow')}</button>
      <p class="fine">By sending this form you agree that WrapSense may contact you about your request. See our <a href="/privacy/">privacy policy</a>.</p>
    </div>
  </form>

  <aside class="contact-aside" aria-label="Other ways to reach us">
    <div class="panel panel--dark">
      <h2 class="h3">Prefer to talk?</h2>
      <address class="contact-list">
        <a href="${site.phoneHref}" data-track="phone_click">${icon('phone')}<span>${esc(site.phone)}</span></a>
        <a href="mailto:${site.email}" data-track="email_click">${icon('mail')}<span>${esc(site.email)}</span></a>
        <a href="${site.mapUrl}" target="_blank" rel="noopener">${icon('pin')}<span>${esc(site.address.street)}<br>${esc(site.address.city)}, ${esc(site.address.region)} ${esc(site.address.postal)}<span class="visually-hidden"> (opens Google Maps in a new tab)</span></span></a>
      </address>
    </div>
    <div class="panel">
      <h2 class="h3">What happens next</h2>
      <ol class="mini-steps" role="list">
        <li><strong>We review your request</strong> and match it with the right specialist.</li>
        <li><strong>We talk through your application</strong> — product, package, output and space.</li>
        <li><strong>We test with your samples</strong> when it helps, then send a quote.</li>
      </ol>
    </div>
    <div class="panel panel--plain">
      <p class="h3">Not sure what to ask for?</p>
      <p>The <a href="/machine-finder/">Machine Finder</a> walks you through it in four questions and fills in this form for you. Wondering about budget? Read <a href="/blog/packaging-machine-cost/">what drives packaging machine cost</a>.</p>
    </div>
  </aside>
</div></section>`;
  return layout({
    path: '/contact/',
    title: 'Request a Quote — Packaging Machines & Lines',
    description: 'Request a quote for a WrapSense packaging machine or complete line, or ask about service and parts. Call 301-200-0048 or email sales@wrapsensepackaging.com.',
    body,
    scripts: ['form.js'],
    jsonld: [bc.ld, { '@context': 'https://schema.org', '@type': 'ContactPage', url: site.url + '/contact/', name: 'Request a quote', about: { '@id': site.url + '/#organization' } }, orgLd],
    bodyClass: 'page-contact',
    footerCta: false,
  });
}

export function catalogPage() {
  const bc = breadcrumbs([['Home', '/'], ['Product Catalog', '/catalog/']]);
  const body = html`
<section class="page-hero"><div class="container">
  ${bc.html}
  <h1 class="page-hero__title">2026 product catalog</h1>
  <p class="page-hero__lead">Prefer a PDF? Download the full WrapSense catalog. Every machine in it also has its own page on this site with current specifications — <a href="/machines/">browse machines</a> or use the <a href="/machine-finder/">Machine Finder</a>.</p>
  <div class="hero__actions">
    <a class="btn btn--primary" href="${site.catalogPdf}" download data-track="catalog_download">${icon('download')} Download PDF (1.9 MB)</a>
    <a class="btn btn--outline" href="${site.catalogPdf}" target="_blank" rel="noopener" data-track="catalog_open">Open in a new tab<span class="visually-hidden"> (PDF)</span></a>
  </div>
</div></section>
<section class="section section--tight"><div class="container">
  <details class="catalog-embed">
    <summary>Preview the catalog here</summary>
    <object data="${site.catalogPdf}#view=FitH" type="application/pdf" aria-label="WrapSense 2026 product catalog (PDF)">
      <p>Your browser can’t preview PDFs. <a href="${site.catalogPdf}" download>Download the catalog</a> instead.</p>
    </object>
  </details>
</div></section>`;
  return layout({ path: '/catalog/', title: '2026 Product Catalog (PDF)', description: 'Download the WrapSense Packaging 2026 product catalog (PDF): VFFS, stick pack, pouch, weighing, flow wrapping, case packing, cartoning and labeling machines.', body, jsonld: [bc.ld] });
}

export function privacyPage() {
  const bc = breadcrumbs([['Home', '/'], ['Privacy & Cookies', '/privacy/']]);
  const body = html`
<section class="page-hero"><div class="container">${bc.html}<h1 class="page-hero__title">Privacy &amp; cookie policy</h1><p class="page-hero__lead">Last updated November 2026.</p></div></section>
<section class="section section--tight"><div class="container prose">
  <h2>Information you give us</h2>
  <p>When you request a quote or contact us, we collect the details you enter — such as your name, company, email, phone number, ZIP code and information about your product and project — so we can respond and prepare a quote.</p>
  <h2>How we track where leads come from</h2>
  <p>To understand which pages and campaigns help people find us, this site stores a small amount of information in your browser’s local storage (not a cookie): the page you first arrived on, the referring website, campaign tags in the link you followed (such as <code>utm_source</code> or ad click IDs), which machine pages you viewed and your Machine Finder answers. This information stays in your browser and is only sent to us if you submit a form, alongside your request.</p>
  <p>If your browser sends a Global Privacy Control signal, we keep this information only for your current visit. You can also clear it at any time by clearing your browser’s site data.</p>
  <h2>Analytics, CRM and advertising</h2>
  <p>We use HubSpot to manage inquiries; quote requests you submit are stored in our HubSpot account, and HubSpot’s tracking code may set cookies to connect your visits with your request. We may also use analytics or advertising tools (for example, Google Analytics or Google Tag Manager) to measure site performance. These tools may set their own cookies. You can block or delete cookies through your browser settings; some site features may not work as intended without them.</p>
  <h2>How we use and share information</h2>
  <p>We use your information to respond to inquiries, provide quotes, deliver products and services, and communicate with you. Service providers that help us run the site or our business (such as email delivery or CRM providers) may process data on our behalf and are not permitted to use it for other purposes. We do not sell your personal information.</p>
  <h2>Your choices</h2>
  <p>You can ask us to access, correct or delete the personal information we hold about you, or to stop contacting you.</p>
  <h2>Children</h2>
  <p>This site is not intended for children under 13, and we do not knowingly collect their information.</p>
  <h2>Security</h2>
  <p>We use commercially reasonable measures to protect information, but no method of transmission or storage is completely secure.</p>
  <h2>Contact</h2>
  <p>Questions about this policy: <a href="mailto:${site.privacyEmail}">${esc(site.privacyEmail)}</a>, or write to ${esc(site.legalName)}, ${esc(site.address.street)}, ${esc(site.address.city)}, ${esc(site.address.region)} ${esc(site.address.postal)}.</p>
</div></section>`;
  return layout({ path: '/privacy/', title: 'Privacy & Cookie Policy', description: 'How WrapSense Packaging collects, uses and protects information submitted through this website, including lead source tracking.', body, jsonld: [bc.ld] });
}

export function accessibilityPage() {
  const bc = breadcrumbs([['Home', '/'], ['Accessibility', '/accessibility/']]);
  const body = html`
<section class="page-hero"><div class="container">${bc.html}<h1 class="page-hero__title">Accessibility statement</h1></div></section>
<section class="section section--tight"><div class="container prose">
  <p>WrapSense Packaging wants everyone to be able to use this website. We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.2 at level AA.</p>
  <h2>What we’ve done</h2>
  <ul>
    <li>Semantic page structure with landmarks, headings and skip links</li>
    <li>Full keyboard support, including menus, the Machine Finder and forms, with visible focus indicators</li>
    <li>Text alternatives for meaningful images; decorative images are hidden from assistive technology</li>
    <li>Color contrast that meets AA guidelines, and layouts that work when zoomed to 400%</li>
    <li>Form fields with visible labels, clear error messages and status announcements</li>
    <li>Respect for reduced-motion preferences</li>
  </ul>
  <h2>Known limitations</h2>
  <p>The downloadable product catalog PDF is not fully tagged for screen readers. Everything in it is also available as accessible web pages under <a href="/machines/">Machines</a>.</p>
  <h2>Feedback</h2>
  <p>If you run into a barrier on this site, please call <a href="${site.phoneHref}">${esc(site.phone)}</a> or email <a href="mailto:${site.email}">${esc(site.email)}</a> and we’ll help you get the information you need.</p>
</div></section>`;
  return layout({ path: '/accessibility/', title: 'Accessibility Statement', description: 'WrapSense Packaging’s commitment to an accessible website that meets WCAG 2.2 AA.', body, jsonld: [bc.ld] });
}

export function searchPage() {
  const body = html`
<section class="page-hero"><div class="container" data-search-page>
  <h1 class="page-hero__title">Search</h1>
  <form class="search-page-form" role="search" action="/search/" method="get">
    <label class="visually-hidden" for="search-page-q">Search machines, industries and guides</label>
    <input id="search-page-q" type="search" name="q" placeholder="Search machines, industries, guides…" autocomplete="off">
    <button class="btn btn--primary" type="submit">${icon('search')} Search</button>
  </form>
  <p class="search-page-status" role="status" aria-live="polite" data-search-page-status></p>
  <noscript><p class="notice">Search needs JavaScript. Browse <a href="/machines/">all machines</a>, <a href="/industries/">industries</a> or the <a href="/blog/">blog</a>.</p></noscript>
  <div class="search-page-results" data-search-page-results></div>
</div></section>`;
  return layout({ path: '/search/', title: 'Search', description: 'Search WrapSense packaging machines, industries and buying guides.', body, noindex: true, footerCta: false });
}

export function thankYouPage() {
  const body = html`
<section class="page-hero page-hero--thanks"><div class="container narrow">
  <span class="thanks-icon" aria-hidden="true">${icon('check')}</span>
  <h1 class="page-hero__title">Thanks — your request is in.</h1>
  <p class="page-hero__lead">A WrapSense packaging specialist will follow up to talk through your project. If it’s urgent, call us at <a href="${site.phoneHref}" data-track="phone_click">${esc(site.phone)}</a>.</p>
  <div class="hero__actions">
    <a class="btn btn--primary" href="/machines/">Keep browsing machines</a>
    <a class="btn btn--outline" href="/services/">Service &amp; support</a>
  </div>
</div></section>`;
  return layout({ path: '/thank-you/', title: 'Thank You', description: 'Your request has been received.', body, noindex: true, bodyClass: 'page-thanks', footerCta: false });
}

export function notFoundPage() {
  const body = html`
<section class="page-hero"><div class="container narrow">
  <p class="eyebrow">Error 404</p>
  <h1 class="page-hero__title">We couldn’t find that page.</h1>
  <p class="page-hero__lead">We’ve rebuilt our website, so some old links have moved. Try one of these instead:</p>
  <div class="hero__actions">
    <a class="btn btn--primary" href="/machines/">Browse machines</a>
    <a class="btn btn--outline" href="/machine-finder/">Machine Finder</a>
    <a class="btn btn--outline" href="/contact/">Contact us</a>
  </div>
</div></section>`;
  return layout({ path: '/404/', title: 'Page Not Found', description: 'The page you requested could not be found.', body, noindex: true });
}
