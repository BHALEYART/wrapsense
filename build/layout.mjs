import { site, stages } from '../src/data/site.mjs';
import { categories } from '../src/data/categories.mjs';
import { industries } from '../src/data/industries.mjs';
import { esc, html, icon, img, imgTag } from './lib.mjs';

export const assetVersion = { css: '', js: '', search: '' };
// Fingerprinted file names (site.3f2a9c1b.css) so no cache can ever pair new HTML with an old asset.
export const assetFile = (name) => assetVersion.files?.[name] || name;

const sprite = `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">
<defs>
<symbol id="i-phone" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></symbol>
<symbol id="i-mail" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></g></symbol>
<symbol id="i-pin" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></g></symbol>
<symbol id="i-arrow" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-6-6 6 6-6 6"/></symbol>
<symbol id="i-back" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M19 12H5m6 6-6-6 6-6"/></symbol>
<symbol id="i-chevron" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="m6 9 6 6 6-6"/></symbol>
<symbol id="i-check" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="m5 12.5 4.5 4.5L19 7.5"/></symbol>
<symbol id="i-menu" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M4 7h16M4 12h16M4 17h16"/></symbol>
<symbol id="i-close" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M6 6l12 12M18 6 6 18"/></symbol>
<symbol id="i-download" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M12 4v11m-5-5 5 5 5-5M5 20h14"/></symbol>
<symbol id="i-doc" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h6"/></g></symbol>
<symbol id="i-wrench" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M14.5 6.5a4 4 0 0 0 5 5l-8.5 8.5a2.1 2.1 0 0 1-3-3l8.5-8.5a4 4 0 0 0-2-2zM14.5 6.5 17 4l3 3-2.5 2.5"/></symbol>
<symbol id="i-flask" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3l-5-9V3M7.5 15h9"/></symbol>
<symbol id="i-gear" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3M4.9 4.9 7 7m10 10 2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/></g></symbol>
<symbol id="i-users" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6"/></g></symbol>
<symbol id="i-shield" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6zm-3.5 9 2.5 2.5 4.5-5"/></symbol>
<symbol id="i-box" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5z"/><path d="M3 7.5 12 12l9-4.5M12 12v9"/></g></symbol>
<symbol id="i-sparkle" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/></symbol>
<symbol id="i-pause" viewBox="0 0 24 24"><path fill="currentColor" d="M7 5h3.5v14H7zm6.5 0H17v14h-3.5z"/></symbol>
<symbol id="i-play" viewBox="0 0 24 24"><path fill="currentColor" d="M8 5.5v13l10-6.5z"/></symbol>
<symbol id="i-search" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/></g></symbol>
<symbol id="i-restart" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M4 12a8 8 0 1 0 2.3-5.7M4 4v4h4"/></symbol>
<!-- product forms -->
<symbol id="i-powder" viewBox="0 0 48 48"><g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 38c3-9 9-15 16-15s13 6 16 15z"/><path d="M24 6v8M19 10l5 5 5-5"/><circle cx="18" cy="31" r=".6" fill="currentColor"/><circle cx="26" cy="29" r=".6" fill="currentColor"/><circle cx="31" cy="34" r=".6" fill="currentColor"/><circle cx="22" cy="35" r=".6" fill="currentColor"/></g></symbol>
<symbol id="i-granular" viewBox="0 0 48 48"><g fill="none" stroke="currentColor" stroke-width="2.2"><ellipse cx="15" cy="30" rx="5" ry="6.5" transform="rotate(-25 15 30)"/><ellipse cx="29" cy="33" rx="5" ry="6.5" transform="rotate(20 29 33)"/><ellipse cx="23" cy="17" rx="5" ry="6.5" transform="rotate(-10 23 17)"/><ellipse cx="36" cy="18" rx="4" ry="5.5" transform="rotate(30 36 18)"/><path d="M13 27c2 1 3 4 2 6M27 30c-1 2 0 5 2 6M22 13c-1 2 0 5 2 7" stroke-linecap="round"/></g></symbol>
<symbol id="i-snacks" viewBox="0 0 48 48"><g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M10 8h28l-3 7v18l3 7H10l3-7V15z"/><path d="M17 22c3-3 7-3 10 0s4 6 1 8-9 2-11-1-2-5 0-7z"/></g></symbol>
<symbol id="i-solid" viewBox="0 0 48 48"><g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><rect x="6" y="17" width="36" height="14" rx="3"/><path d="M6 21h-2M6 27h-2M42 21h2M42 27h2M14 17v14M34 17v14" stroke-linecap="round"/></g></symbol>
<symbol id="i-liquid" viewBox="0 0 48 48"><g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M24 6s-12 13-12 22a12 12 0 0 0 24 0C36 19 24 6 24 6z"/><path d="M18 29a6 6 0 0 0 6 6" stroke-linecap="round"/></g></symbol>
<symbol id="i-container" viewBox="0 0 48 48"><g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><rect x="15" y="5" width="18" height="6" rx="1.5"/><path d="M14 11h20l1 4v25a3 3 0 0 1-3 3H16a3 3 0 0 1-3-3V15z"/><rect x="17" y="21" width="14" height="12" rx="1"/></g></symbol>
<symbol id="i-cannabis" viewBox="0 0 48 48"><g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"><path d="M14 40 32 8l6 3-14 32z"/><path d="M32 8c2-2 5-1 6 3M20 30l7 3"/></g></symbol>
<symbol id="i-cases" viewBox="0 0 48 48"><g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M6 16 24 8l18 8v18l-18 8-18-8z"/><path d="M6 16l18 8 18-8M24 24v18M15 12l18 8"/></g></symbol>
</defs></svg>`;

const hubspotId = process.env.HUBSPOT_PORTAL_ID || site.hubspotPortalId;

function headTags(p) {
  const url = site.url + p.path;
  // Keep titles ≤ 60 characters where possible: full brand → short brand → none.
  const fit = (t) => [`${t} | ${site.name}`, `${t} | WrapSense`, t].find((x) => x.length <= 60) || t;
  const title = p.path === '/' ? p.title : fit(p.title);
  const ogImg = p.ogImage ? site.url + p.ogImage : site.url + '/assets/img/og/default.jpg';
  const ld = [].concat(p.jsonld || []);
  return html`
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(p.description)}">
${p.noindex ? '<meta name="robots" content="noindex, follow">' : '<meta name="robots" content="index, follow, max-image-preview:large">'}
<link rel="canonical" href="${esc(url)}">
<meta property="og:type" content="${p.ogType || 'website'}">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(p.ogTitle || p.title)}">
<meta property="og:description" content="${esc(p.description)}">
<meta property="og:url" content="${esc(url)}">
<meta property="og:image" content="${esc(ogImg)}">
<meta property="og:image:alt" content="${esc(p.ogImageAlt || p.title)}">
<meta property="og:locale" content="en_US">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0d1533">
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" href="/assets/img/brand/w-mark-192.png" type="image/png" sizes="192x192">
<link rel="apple-touch-icon" href="/assets/img/brand/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preload" href="/assets/fonts/oswald-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/poppins-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
${p.preloadImage ? `<link rel="preload" as="image" href="${esc(p.preloadImage)}" fetchpriority="high">` : ''}
<link rel="stylesheet" href="/assets/css/${assetFile('site.css')}">
${ld.map((o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`)}
${hubspotId ? `<script id="hs-script-loader" async defer src="https://js.hs-scripts.com/${hubspotId}.js"></script>` : ''}
${site.gtmId ? `<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${site.gtmId}');</script>` : ''}`;
}

function megaMenu() {
  const cols = stages
    .map((st) => {
      const cats = categories.filter((c) => c.stage === st.id);
      if (!cats.length) return '';
      return html`<div class="mega__col">
        <p class="mega__stage">${esc(st.name)}</p>
        <ul role="list">${cats.map((c) => `<li><a href="/machines/${c.slug}/">${esc(c.name)}</a></li>`)}</ul>
      </div>`;
    })
    .join('');
  return html`<div class="mega" id="mega-machines" hidden>
    <div class="container mega__inner">
      <div class="mega__grid">${cols}</div>
      <aside class="mega__cta">
        <p class="mega__cta-title">Not sure which machine you need?</p>
        <p>Answer four quick questions and we’ll match you with machines for your product, package and output.</p>
        <a class="btn btn--primary" href="/machine-finder/" data-track="nav_finder">Find your machine ${icon('arrow')}</a>
        <a class="mega__all" href="/machines/">Browse all machines ${icon('arrow')}</a>
      </aside>
    </div>
  </div>`;
}

function megaIndustries() {
  return html`<div class="mega mega--industries" id="mega-industries" hidden>
    <div class="container mega__inner">
      <div>
        <p class="mega__stage">Packaging machines by industry</p>
        <ul class="mega-ind" role="list">${industries.map((i) => html`<li><a class="mega-ind__link" href="/industries/${i.slug}/"><span class="mega-ind__img">${imgTag(i.image, '')}</span><span>${esc(i.name)}</span></a></li>`)}</ul>
      </div>
      <aside class="mega__cta">
        <p class="mega__cta-title">Every industry, every stage</p>
        <p>See the weighing, packaging, inspection and end-of-line machines for your products — plus a typical line for your industry.</p>
        <a class="btn btn--primary" href="/industries/" data-track="nav_industries">All industries ${icon('arrow')}</a>
        <a class="mega__all" href="/machine-finder/">Or use the Machine Finder ${icon('arrow')}</a>
      </aside>
    </div>
  </div>`;
}

function header(p) {
  const cur = (href) => (p.path === href || (href !== '/' && p.path.startsWith(href)) ? ' aria-current="page"' : '');
  return html`
<a class="skip-link" href="#main">Skip to main content</a>
<aside class="topbar" aria-label="Contact WrapSense">
  <div class="container topbar__inner">
    <p class="topbar__tag">${esc(site.tagline)}</p>
    <ul class="topbar__contact" role="list">
      <li><a href="${site.phoneHref}" data-track="phone_click">${icon('phone')}<span>${esc(site.phone)}</span></a></li>
      <li><a href="mailto:${site.email}" data-track="email_click">${icon('mail')}<span>${esc(site.email)}</span></a></li>
    </ul>
  </div>
</aside>
<header class="site-header" id="site-header">
  <div class="container site-header__inner">
    <a class="brand" href="/" aria-label="WrapSense Packaging Machinery — home">
      <img src="/assets/img/brand/wrapsense-logo.png" alt="" width="${img('brand/wrapsense-logo.png').w}" height="${img('brand/wrapsense-logo.png').h}">
    </a>
    <button class="search-toggle" type="button" aria-haspopup="dialog" aria-controls="site-search" data-search-open>${icon('search')}<span class="visually-hidden">Search the site</span></button>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">
      ${icon('menu', 'icon icon--open')}${icon('close', 'icon icon--close')}<span class="visually-hidden">Menu</span>
    </button>
    <nav class="site-nav" id="site-nav" aria-label="Main">
      <ul class="site-nav__list" role="list">
        <li class="has-mega">
          <button type="button" class="site-nav__link site-nav__trigger" aria-expanded="false" aria-controls="mega-machines"${p.path.startsWith('/machines') ? ' data-current="true"' : ''}>Machines ${icon('chevron')}</button>
          ${megaMenu()}
        </li>
        <li><a class="site-nav__link" href="/machine-finder/"${cur('/machine-finder/')}>Machine Finder</a></li>
        <li class="has-mega">
          <button type="button" class="site-nav__link site-nav__trigger" aria-expanded="false" aria-controls="mega-industries"${p.path.startsWith('/industries') ? ' data-current="true"' : ''}>Industries ${icon('chevron')}</button>
          ${megaIndustries()}
        </li>
        <li><a class="site-nav__link" href="/services/"${cur('/services/')}>Service</a></li>
        <li><a class="site-nav__link" href="/financing/"${cur('/financing/')}>Financing</a></li>
        <li><a class="site-nav__link" href="/about/"${cur('/about/')}>About</a></li>
        <li class="site-nav__phone"><a class="site-nav__link" href="${site.phoneHref}" data-track="phone_click">${icon('phone')} ${esc(site.phone)}</a></li>
      </ul>
      <a class="btn btn--primary site-nav__cta" href="/contact/" data-track="nav_quote">Get a Quote</a>
    </nav>
  </div>
</header>`;
}

function footer(p) {
  const col = (title, links) =>
    html`<div class="footer__col"><h2 class="footer__title">${title}</h2><ul role="list">${links.map(([h, t]) => `<li><a href="${h}">${esc(t)}</a></li>`)}</ul></div>`;
  return html`
<footer class="site-footer">
  ${p.footerCta === false ? '' : html`<div class="footer-cta">
    <div class="container footer-cta__inner">
      <div>
        <p class="eyebrow eyebrow--light">If you have an idea, we can design it. Manufacture it. Service it.</p>
        <h2 class="footer-cta__title">Let’s package your product.</h2>
        <p>We can set up testing for your products and talk through your application.</p>
      </div>
      <div class="footer-cta__actions">
        <a class="btn btn--light" href="/contact/" data-track="footer_quote">Request a Quote ${icon('arrow')}</a>
        <a class="btn btn--ghost-light" href="${site.phoneHref}" data-track="phone_click">${icon('phone')} ${esc(site.phone)}</a>
      </div>
    </div>
  </div>`}
  <div class="container footer__main">
    <div class="footer__brand">
      <img src="/assets/img/brand/wrapsense-logo-light.png" alt="WrapSense Packaging Machinery" width="${img('brand/wrapsense-logo-light.png').w}" height="${img('brand/wrapsense-logo-light.png').h}" loading="lazy">
      <p>Turn-key packaging machinery and lines for small and medium-size enterprises — built on value, quality and service.</p>
      <address>
        <a href="${site.mapUrl}" rel="noopener" target="_blank">${icon('pin')}<span>${esc(site.address.street)}<br>${esc(site.address.city)}, ${esc(site.address.region)} ${esc(site.address.postal)}<span class="visually-hidden"> (opens Google Maps in a new tab)</span></span></a>
        <a href="${site.phoneHref}" data-track="phone_click">${icon('phone')}<span>${esc(site.phone)}</span></a>
        <a href="mailto:${site.email}" data-track="email_click">${icon('mail')}<span>${esc(site.email)}</span></a>
      </address>
    </div>
    ${col('Packaging', categories.filter((c) => c.stage === 'pack' || c.stage === 'dose').map((c) => [`/machines/${c.slug}/`, c.name]))}
    ${col('Line & end of line', categories.filter((c) => !['pack', 'dose'].includes(c.stage)).map((c) => [`/machines/${c.slug}/`, c.name]))}
    ${col('Industries', industries.map((i) => [`/industries/${i.slug}/`, i.name]))}
    ${col('Company', [
      ['/machine-finder/', 'Machine Finder'],
      ['/machines/', 'All Machines'],
      ['/industries/', 'Industries'],
      ['/services/', 'Service & Support'],
      ['/financing/', 'Equipment Financing'],
      ['/about/', 'About WrapSense'],
      ['/contact/', 'Request a Quote'],
      ['/blog/', 'Blog & Buying Guides'],
      ['/catalog/', '2026 Product Catalog'],
    ])}
  </div>
  <div class="container footer__legal">
    <p>© <span data-year>2026</span> ${esc(site.legalName)}. All rights reserved.</p>
    <ul role="list"><li><a href="/privacy/">Privacy &amp; Cookies</a></li><li><a href="/accessibility/">Accessibility</a></li><li><a href="/sitemap.xml">Sitemap</a></li></ul>
  </div>
</footer>`;
}

/**
 * page({ path, title, description, body, jsonld, scripts, ogImage, noindex, bodyClass })
 */
export function layout(p) {
  return `<!doctype html>
<html lang="en-US">
<head>${headTags(p)}
</head>
<body class="${p.bodyClass || ''}">
${site.gtmId ? `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${site.gtmId}" height="0" width="0" style="display:none;visibility:hidden" title="Google Tag Manager"></iframe></noscript>` : ''}
${sprite}
${header(p)}
<main id="main" tabindex="-1">
${p.body}
</main>
${footer(p)}
<dialog class="search-dialog" id="site-search" aria-labelledby="search-title" data-index="/assets/search-index.json?v=${assetVersion.search}">
  <form class="search-form" role="search" action="/search/" method="get" data-search-form>
    <h2 id="search-title" class="visually-hidden">Search WrapSense</h2>
    <label class="search-form__field">
      ${icon('search')}
      <span class="visually-hidden">Search machines, industries and guides</span>
      <input type="search" name="q" placeholder="Search machines, industries, guides…" autocomplete="off" spellcheck="false" aria-describedby="search-status" data-search-input>
    </label>
    <button type="button" class="search-form__close" data-search-close>${icon('close')}<span class="visually-hidden">Close search</span></button>
  </form>
  <p id="search-status" class="search-status" role="status" aria-live="polite" data-search-status></p>
  <div class="search-results" data-search-results>
    <div class="search-suggest">
      <p class="search-suggest__title">Popular searches</p>
      <ul class="search-suggest__list" role="list">${['VFFS bagger', 'stick pack', 'stand-up pouch', 'multihead weigher', 'flow wrapper', 'labeler', 'case erector', 'coffee', 'cannabis', 'machine cost'].map((t) => `<li><button type="button" class="search-chip" data-search-term="${esc(t)}">${esc(t)}</button></li>`).join('')}</ul>
    </div>
  </div>
</dialog>
<script src="/assets/js/${assetFile('site.js')}" defer></script>
<script src="/assets/js/${assetFile('search.js')}" defer></script>
${(p.scripts || []).map((s) => `<script src="/assets/js/${assetFile(s)}" defer></script>`).join('\n')}
</body>
</html>
`;
}

export function breadcrumbs(items) {
  // items: [[label, path], ...] last item is current page
  const list = html`<nav class="breadcrumbs" aria-label="Breadcrumb"><ol role="list">${items.map(([label, path], i) =>
    i === items.length - 1 ? `<li><span aria-current="page">${esc(label)}</span></li>` : `<li><a href="${path}">${esc(label)}</a></li>`
  )}</ol></nav>`;
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map(([label, path], i) => ({ '@type': 'ListItem', position: i + 1, name: label, item: site.url + path })),
  };
  return { html: list, ld };
}

export const orgLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': site.url + '/#organization',
  name: site.name,
  alternateName: 'Wrapsense Packaging Machinery',
  url: site.url + '/',
  logo: site.url + '/assets/img/brand/w-mark-512.png',
  email: site.email,
  telephone: '+1-301-200-0048',
  slogan: 'Value. Quality. Service.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: site.address.street,
    addressLocality: site.address.city,
    addressRegion: site.address.region,
    postalCode: site.address.postal,
    addressCountry: site.address.country,
  },
  contactPoint: [{ '@type': 'ContactPoint', telephone: '+1-301-200-0048', email: site.email, contactType: 'sales', areaServed: 'US', availableLanguage: 'English' }],
};
