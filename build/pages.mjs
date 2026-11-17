import { esc, html, icon, imgTag, img, truncate } from './lib.mjs';
import { layout, breadcrumbs, orgLd } from './layout.mjs';
import { site, stages, forms, packages, speedBands, addons, process, services } from '../src/data/site.mjs';
import { categories } from '../src/data/categories.mjs';
import { products } from '../src/data/products.mjs';
import { industries } from '../src/data/industries.mjs';
import {
  catBySlug, productUrl, categoryUrl, productsIn, categoryImage, accentStyle, speedLabel,
  productCard, categoryCard, wheel, lineDiagram, specTable, modelsTable, ctaBand,
} from './components.mjs';
import { relatedGuides, postsFor, homeGuides } from './blog.mjs';

const bySlug = Object.fromEntries(products.map((p) => [p.slug, p]));
const indBySlug = Object.fromEntries(industries.map((i) => [i.slug, i]));
const pkgById = Object.fromEntries(packages.map((p) => [p.id, p]));

// Machines commonly paired with each category, for "complete your line" sections.
const PAIRS = {
  'vertical-form-fill-seal': ['sensiweigh-pro-multihead-weigher', 'exactdose-auger-filler', 'bucket-elevator-conveyor', 'take-away-exit-conveyor', 'food-metal-detector', 'pickn-pack-casepacker-3'],
  'stick-pack-sachet-machines': ['high-precision-checkweigher', 'cartomate-h-horizontal-cartoner', 'food-metal-detector', 'custom-printed-packaging-film'],
  'premade-pouch-machines': ['sensiweigh-pro-multihead-weigher', 'exactdose-auger-filler', 'oxygen-sachet-inserter', 'food-metal-detector', 'pickn-pack-casepacker-3'],
  'flow-wrappers': ['food-metal-detector', 'high-precision-checkweigher', 'cartomate-h-horizontal-cartoner', 'casemaster-velocity-prime-case-erector'],
  'weighing-filling': ['fastpack-intermittent-motion-vffs', 'rapidbagger-compact', 'bucket-elevator-conveyor', 'capvantage-sdl-2-capping-machine'],
  'metal-detectors-checkweighers': ['take-away-exit-conveyor', 'fastpack-intermittent-motion-vffs', 'quickstick-pro'],
  'labeling-machines': ['capvantage-sdl-2-capping-machine', 'oxygen-sachet-inserter', 'cartomate-v-vertical-cartoner', 'exactdose-auger-filler'],
  'capping-auxiliary': ['labelease-cl2-cylindrical-labeler', 'exactdose-auger-filler', 'cartomate-v-vertical-cartoner'],
  'cartoning-machines': ['quickstick-pro', 'labelease-tbl-top-bottom-labeler', 'casemaster-velocity-prime-case-erector', 'casemaster-fastseal-case-sealer'],
  'case-erectors-sealers': ['pickn-pack-casepacker-3', 'pickn-pack-casepacker-2', 'casemaster-fastseal-case-sealer', 'casemaster-palletstakr-palletizer'],
  'case-packing': ['casemaster-velocity-ultra-case-erector', 'casemaster-fastseal-case-sealer', 'casemaster-palletstakr-palletizer'],
  'conveyors-elevators': ['sensiweigh-pro-multihead-weigher', 'fastpack-intermittent-motion-vffs', 'food-metal-detector'],
  'specialty-machines': ['sensiweigh-pro-mini', 'labelease-cl2-cylindrical-labeler', 'triservo-33000-3sp-flow-wrapper'],
  'packaging-film': ['fastpack-intermittent-motion-vffs', 'quickstick-eco', 'triservo-23000-3sp-flow-wrapper'],
};

for (const [k, list] of Object.entries(PAIRS)) for (const s of list) if (!bySlug[s]) throw new Error(`PAIRS ${k}: unknown product ${s}`);

const PACKAGE_LINKS = {
  'pillow-bag': 'vertical-form-fill-seal', 'stick-pack': 'stick-pack-sachet-machines', 'stand-up-pouch': 'premade-pouch-machines',
  'flow-wrap': 'flow-wrappers', container: 'labeling-machines', carton: 'cartoning-machines', case: 'case-erectors-sealers', pallet: 'case-erectors-sealers',
};

const catalogLink = (page) => `${site.catalogPdf}#page=${page}`;

// ════════════════════════════ HOME ════════════════════════════
export function homePage() {
  const packCats = categories.filter((c) => ['pack', 'dose', 'finish', 'end'].includes(c.stage)).slice(0, 8);
  const body = html`
<section class="hero" aria-labelledby="hero-title">
  <div class="hero__bg" aria-hidden="true"></div>
  <div class="container hero__inner">
    <div class="hero__copy">
      <p class="eyebrow eyebrow--light">Packaging machinery · Gaithersburg, Maryland</p>
      <h1 id="hero-title" class="hero__title">Packaging machines, matched to <span class="hl">your product.</span></h1>
      <p class="hero__lead">WrapSense designs, builds and services automated packaging machines and complete lines for small and medium-size businesses — from your first bagger to a fully automated end of line.</p>
      <ul class="hero__proof" role="list">
        <li>${icon('check')} Testing with your product samples</li>
        <li>${icon('check')} Installation, training &amp; service from our technicians</li>
        <li>${icon('check')} Standard or fully custom machines</li>
      </ul>
      <div class="hero__actions">
        <a class="btn btn--light" href="/machines/" data-track="hero_browse">Browse all machines</a>
        <a class="btn btn--ghost-light" href="/contact/" data-track="hero_quote">Request a quote</a>
      </div>
    </div>
    <form class="hero__finder card-glass" action="/machine-finder/" method="get" data-wheel-launch>
      ${wheel({ id: 'home-wheel', stepLabel: 'Machine Finder' })}
      <div class="hero__finder-foot">
        <p>Pick what you’re packaging to see machines that fit.</p>
        <button class="btn btn--primary" type="submit" data-track="hero_finder_continue">Continue ${icon('arrow')}</button>
      </div>
    </form>
  </div>
</section>

<section class="section section--tight" aria-labelledby="pkg-title">
  <div class="container">
    <div class="section-head section-head--row">
      <div>
        <p class="eyebrow">Shop by package</p>
        <h2 id="pkg-title" class="section-title">Already know your package?</h2>
      </div>
      <a class="link-arrow" href="/machines/">All machine categories ${icon('arrow')}</a>
    </div>
    <ul class="pkg-strip" role="list">
      ${Object.entries(PACKAGE_LINKS).map(([pk, cat]) => {
        const P = pkgById[pk];
        return html`<li><a class="pkg-tile" href="${categoryUrl(cat)}${pk === 'pallet' ? '#casemaster-palletstakr-palletizer' : ''}">
          <span class="pkg-tile__img">${imgTag(P.image, '')}</span>
          <span class="pkg-tile__name">${esc(P.name)}</span>
          <span class="pkg-tile__cat">${esc(catBySlug[cat].short)}</span>
        </a></li>`;
      })}
    </ul>
  </div>
</section>

<section class="section section--alt" aria-labelledby="line-title">
  <div class="container">
    <div class="section-head">
      <p class="eyebrow">Step 1: pack your products · Step 2: automate additional processes</p>
      <h2 id="line-title" class="section-title">Build a complete packaging line</h2>
      <p class="section-lead">Most lines start with one packaging machine and grow. Every WrapSense machine is designed to connect — from feeding and weighing through inspection, cartoning, casing and palletizing.</p>
    </div>
    ${lineDiagram()}
  </div>
</section>

<section class="section" aria-labelledby="cats-title">
  <div class="container">
    <div class="section-head section-head--row">
      <div><p class="eyebrow">Our automated solutions</p><h2 id="cats-title" class="section-title">Machines for every stage</h2></div>
      <a class="link-arrow" href="/machines/">See all ${products.length} machines ${icon('arrow')}</a>
    </div>
    <ul class="grid grid--cats" role="list">${packCats.map((c) => `<li>${categoryCard(c)}</li>`)}</ul>
  </div>
</section>

<section class="section section--dark" aria-labelledby="ind-title">
  <div class="container">
    <div class="section-head section-head--row">
      <div><p class="eyebrow eyebrow--light">Industries</p><h2 id="ind-title" class="section-title">Built for what you make</h2></div>
      <a class="link-arrow link-arrow--light" href="/industries/">All industries ${icon('arrow')}</a>
    </div>
    <ul class="ind-grid" role="list">
      ${industries.map((i) => html`<li><a class="ind-tile" href="/industries/${i.slug}/"><span class="ind-tile__img">${imgTag(i.image, '')}</span><span class="ind-tile__name">${esc(i.name)}</span>${icon('arrow')}</a></li>`)}
    </ul>
  </div>
</section>

<section class="section" aria-labelledby="how-title">
  <div class="container split">
    <div class="split__media">
      ${imgTag('photos/technician.webp', 'WrapSense service technician working on a packaging machine control panel', { cls: 'rounded' })}
      <div class="values" aria-label="Built on value, quality and service">
        ${site.values.map((v) => `<span>${icon('check')} ${esc(v)}</span>`)}
      </div>
    </div>
    <div class="split__copy">
      <p class="eyebrow">How we work</p>
      <h2 id="how-title" class="section-title">From first conversation to long-term support</h2>
      <p class="section-lead">We take your project from idea through manufacturing, testing and installation — then stay with you after the machine is running.</p>
      <ol class="steps" role="list">
        ${process.map((s, i) => html`<li class="steps__item"><span class="steps__n" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><div><h3 class="steps__title">${esc(s.name)}</h3><p>${esc(s.text)}</p></div></li>`)}
      </ol>
      <a class="btn btn--outline" href="/services/">Service &amp; support ${icon('arrow')}</a>
    </div>
  </div>
</section>

${homeGuides()}

${ctaBand({ title: 'Send us your product. We’ll show you how it runs.', text: 'We can set up testing with your products and packaging so you can see results before you invest.' })}
`;
  return layout({
    path: '/',
    title: 'Packaging Machines & Turn-Key Lines | WrapSense Packaging',
    description: 'Packaging machines and turn-key lines for small and medium businesses: VFFS, stick pack, pouch, flow wrap, weighing, labeling, cartoning and case packing.',
    body,
    scripts: ['finder.js'],
    jsonld: [orgLd, { '@context': 'https://schema.org', '@type': 'WebSite', '@id': site.url + '/#website', url: site.url + '/', name: site.name, publisher: { '@id': site.url + '/#organization' } }],
    bodyClass: 'page-home',
  });
}

// ════════════════════════════ ALL MACHINES ════════════════════════════
export function machinesPage() {
  const bc = breadcrumbs([['Home', '/'], ['Machines', '/machines/']]);
  const sel = (id, label, opts) => html`<div class="field field--inline"><label for="${id}">${label}</label>
    <select id="${id}" data-filter="${id.replace('f-', '')}"><option value="">All</option>${opts.map(([v, t]) => `<option value="${v}">${esc(t)}</option>`)}</select></div>`;
  const body = html`
<section class="page-hero">
  <div class="container">
    ${bc.html}
    <h1 class="page-hero__title">Packaging machines</h1>
    <p class="page-hero__lead">${products.length} machines across ${categories.length} categories — from VFFS baggers and stick-pack machines to labelers, cartoners and palletizers. Filter by what you’re packaging, or <a href="/machine-finder/">let the Machine Finder narrow it down</a>.</p>
  </div>
</section>
<section class="section section--tight">
  <div class="container">
    <form class="filters" aria-label="Filter machines" data-filters onsubmit="return false">
      <fieldset class="chips" aria-describedby="stage-hint">
        <legend class="visually-hidden">Line stage</legend>
        <span id="stage-hint" class="chips__label">Stage</span>
        <label class="chip"><input type="radio" name="stage" value="" checked><span>All</span></label>
        ${stages.map((s) => `<label class="chip"><input type="radio" name="stage" value="${s.id}"><span>${esc(s.short)}</span></label>`)}
      </fieldset>
      <div class="filters__selects">
        ${sel('f-forms', 'Product', forms.map((f) => [f.id, f.name]))}
        ${sel('f-packages', 'Package', packages.map((p) => [p.id, p.name]))}
        ${sel('f-industries', 'Industry', industries.map((i) => [i.slug, i.name]))}
        <button class="btn btn--text" type="reset" data-filter-reset>${icon('restart')} Reset</button>
      </div>
      <p class="filters__count" role="status" aria-live="polite" data-filter-count>Showing all ${products.length} machines</p>
    </form>
    ${stages.map((s) => {
      const cats = categories.filter((c) => c.stage === s.id);
      return html`<section class="machine-group" data-group aria-labelledby="g-${s.id}">
        <h2 class="machine-group__title" id="g-${s.id}">${esc(s.name)}</h2>
        ${cats.map((c) => html`<div class="machine-cat" data-cat-group>
          <div class="machine-cat__head"><h3 class="machine-cat__title"><a href="${categoryUrl(c)}">${esc(c.name)}</a></h3><a class="link-arrow" href="${categoryUrl(c)}">Overview ${icon('arrow')}</a></div>
          <ul class="grid grid--products" role="list">${productsIn(c.slug).map((p) => `<li data-card>${productCard(p, { headingLevel: 4, showCategory: false })}</li>`)}</ul>
        </div>`)}
      </section>`;
    })}
    <p class="empty" hidden data-filter-empty>No machines match those filters. <button type="button" class="btn btn--text" data-filter-reset>Reset filters</button> or <a href="/contact/">ask us</a> — we also build custom machines.</p>
  </div>
</section>
${ctaBand()}`;
  return layout({
    path: '/machines/',
    title: 'Packaging Machines: VFFS, Stick Pack, Pouch & More',
    description: `Browse ${products.length} WrapSense packaging machines — VFFS baggers, stick pack, premade pouch, flow wrappers, weighers, labelers, cartoners and case packers.`,
    body,
    scripts: ['filters.js'],
    jsonld: [bc.ld],
  });
}

// ════════════════════════════ CATEGORY ════════════════════════════
export function categoryPage(c) {
  const list = productsIn(c.slug);
  const st = stages.find((s) => s.id === c.stage);
  const bc = breadcrumbs([['Home', '/'], ['Machines', '/machines/'], [c.name, categoryUrl(c)]]);
  const pairs = (PAIRS[c.slug] || []).map((s) => bySlug[s]).filter((p) => p && p.category !== c.slug);
  const related = categories.filter((x) => x.stage === c.stage && x.slug !== c.slug);
  const heroImg = img(categoryImage(c));
  const body = html`
<section class="cat-hero" style="${accentStyle(c)}">
  <div class="container cat-hero__inner">
    <div class="cat-hero__copy">
      ${bc.html}
      ${c.series ? `<p class="cat-hero__series">${esc(c.series)}</p>` : ''}
      <h1 class="cat-hero__title">${esc(c.name)}</h1>
      <p class="cat-hero__lead">${esc(c.intro)}</p>
      <div class="cat-hero__actions">
        <a class="btn btn--light" href="#models">Compare ${list.length} ${list.length === 1 ? 'machine' : 'machines'}</a>
        <a class="btn btn--ghost-light" href="/contact/?category=${c.slug}" data-track="category_quote">Request a quote</a>
      </div>
    </div>
    <div class="cat-hero__media">${imgTag(categoryImage(c), `${c.name} by WrapSense`, { eager: true, fetchpriority: 'high' })}</div>
  </div>
</section>

<section class="section section--tight">
  <div class="container cat-intro">
    <div>
      <h2 class="h3">Best for</h2>
      <ul class="checklist" role="list">${c.bestFor.map((b) => `<li>${icon('check')}${esc(b)}</li>`)}</ul>
    </div>
    <div class="cat-intro__stage">
      <h2 class="h3">Where it fits in your line</h2>
      <p>${esc(st.name)} — ${esc(st.blurb)}</p>
      ${c.catalogPage ? `<a class="link-arrow" href="${catalogLink(c.catalogPage)}" data-track="catalog_download">${icon('doc')} View catalog page ${icon('arrow')}</a>` : ''}
    </div>
  </div>
</section>

<section class="section section--alt" id="models" aria-labelledby="models-title">
  <div class="container">
    <h2 id="models-title" class="section-title">${esc(c.name)} models</h2>
    <ul class="grid grid--products" role="list">${list.map((p) => `<li id="${p.slug}">${productCard(p, { headingLevel: 3, showCategory: false })}</li>`)}</ul>
    ${list.length > 1 ? html`
    <h3 class="h3 compare-title">Compare at a glance</h3>
    <div class="table-wrap" role="region" aria-label="Compare ${esc(c.name)}" tabindex="0">
      <table class="spec-table spec-table--compare">
        <caption class="visually-hidden">Comparison of ${esc(c.name)}</caption>
        <thead><tr><th scope="col">Machine</th><th scope="col">Output</th><th scope="col">Package formats</th><th scope="col">Best for</th></tr></thead>
        <tbody>${list.map((p) => html`<tr><th scope="row"><a href="${productUrl(p)}">${esc(p.name)}</a></th><td>${esc(speedLabel(p) || 'Configured to your line')}</td><td>${esc(p.packages.map((x) => pkgById[x]?.name).filter(Boolean).join(', ') || '—')}</td><td>${esc(p.uses.slice(0, 3).join(', '))}</td></tr>`)}</tbody>
      </table>
    </div>` : ''}
  </div>
</section>

${pairs.length ? html`<section class="section" aria-labelledby="pairs-title">
  <div class="container">
    <h2 id="pairs-title" class="section-title">Complete the line</h2>
    <p class="section-lead">Machines commonly paired with ${esc(c.short)}.</p>
    <ul class="grid grid--products" role="list">${pairs.map((p) => `<li>${productCard(p)}</li>`)}</ul>
  </div>
</section>` : ''}

${relatedGuides(postsFor({ category: c.slug }), { title: `${c.short.charAt(0).toUpperCase() + c.short.slice(1)}: guides & answers` })}

${related.length ? html`<section class="section section--tight" aria-labelledby="rel-title"><div class="container">
  <h2 id="rel-title" class="h3">Related categories</h2>
  <ul class="tag-list" role="list">${related.map((r) => `<li><a class="tag" href="${categoryUrl(r)}">${esc(r.name)}</a></li>`)}</ul>
</div></section>` : ''}

${ctaBand({ title: `Not sure which ${c.short.replace(/s$/, '')} fits?`, text: 'Tell us about your product, package size and target output. We’ll recommend a model — and can test with your samples.' })}
`;
  return layout({
    path: categoryUrl(c),
    title: c.seoTitle,
    description: c.seoDescription,
    body,
    preloadImage: heroImg && !heroImg.remote ? heroImg.src : null,
    ogImage: `/assets/img/og/category-${c.slug}.jpg`,
    jsonld: [bc.ld, {
      '@context': 'https://schema.org', '@type': 'CollectionPage', name: c.name, url: site.url + categoryUrl(c), description: c.seoDescription,
      isPartOf: { '@id': site.url + '/#website' },
      mainEntity: { '@type': 'ItemList', itemListElement: list.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: site.url + productUrl(p), name: p.fullName })) },
    }],
  });
}

// ════════════════════════════ PRODUCT ════════════════════════════
export function productPage(p) {
  const c = catBySlug[p.category];
  const bc = breadcrumbs([['Home', '/'], ['Machines', '/machines/'], [c.name, categoryUrl(c)], [p.name, productUrl(p)]]);
  const gallery = [p.image, ...(p.gallery || [])];
  const alts = gallery.map((g, i) => (i === 0 ? `${p.fullName}` : g.startsWith('photos/') ? `${p.name} in production` : g.startsWith('packages/') ? `Package format made with the ${p.name}` : `${p.name} — view ${i + 1}`));
  const siblings = productsIn(c.slug).filter((x) => x.slug !== p.slug);
  const pairs = (PAIRS[c.slug] || []).map((s) => bySlug[s]).filter((x) => x && x.slug !== p.slug).slice(0, 4);
  const inds = p.industries.map((s) => indBySlug[s]).filter(Boolean);
  const spd = speedLabel(p);
  const keyFacts = [
    spd && ['Output', spd],
    p.packages.length && ['Packages', p.packages.map((x) => pkgById[x]?.name).filter(Boolean).slice(0, 3).join(', ')],
    p.models && ['Models', `${p.models.length} ${p.models.length === 1 ? 'model' : 'models'}`],
  ].filter(Boolean);
  const mainImg = img(p.image);
  const desc = truncate(`${p.fullName}: ${p.summary}`, 158);

  const body = html`
<div class="container">${bc.html}</div>
<section class="product-hero" style="${accentStyle(c)}">
  <div class="container product-hero__inner">
    <div class="gallery" data-gallery>
      <div class="gallery__main">
        ${gallery.map((g, i) => html`<figure class="gallery__slide"${i ? ' hidden' : ''} id="slide-${i}">${imgTag(g, alts[i], { eager: i === 0, fetchpriority: i === 0 ? 'high' : '' })}</figure>`)}
      </div>
      ${gallery.length > 1 ? html`<div class="gallery__thumbs" role="group" aria-label="Choose image">
        ${gallery.map((g, i) => html`<button type="button" class="gallery__thumb" aria-controls="slide-${i}" aria-pressed="${i === 0}" aria-label="Show image ${i + 1} of ${gallery.length}">${imgTag(g, '')}</button>`)}
      </div>` : ''}
    </div>
    <div class="product-hero__copy">
      <p class="product-hero__cat"><a href="${categoryUrl(c)}">${esc(c.name)}</a>${p.series ? ` · ${esc(p.series)} series` : ''}</p>
      <h1 class="product-hero__title">${esc(p.fullName)}</h1>
      <p class="product-hero__tagline">${esc(p.tagline)}</p>
      <p>${esc(p.summary)}</p>
      ${keyFacts.length ? html`<dl class="facts">${keyFacts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`)}</dl>` : ''}
      <div class="product-hero__actions">
        <a class="btn btn--primary" href="/contact/?interest=${p.slug}" data-track="product_quote" data-product="${p.slug}">Request a quote ${icon('arrow')}</a>
        <a class="btn btn--outline" href="/contact/?interest=${p.slug}&amp;samples=yes" data-track="product_test" data-product="${p.slug}">${icon('flask')} Test my product</a>
      </div>
      <ul class="product-hero__links" role="list">
        <li><a href="${site.phoneHref}" data-track="phone_click">${icon('phone')} Call ${esc(site.phone)}</a></li>
        ${p.catalogPage ? `<li><a href="${catalogLink(p.catalogPage)}" data-track="catalog_download" data-product="${p.slug}">${icon('doc')} Catalog spec page (PDF)</a></li>` : ''}
      </ul>
    </div>
  </div>
</section>

<nav class="subnav" aria-label="On this page">
  <div class="container"><ul role="list">
    <li><a href="#overview">Overview</a></li>
    ${p.models || p.specs ? '<li><a href="#specs">Specifications</a></li>' : ''}
    <li><a href="#applications">Applications</a></li>
    ${pairs.length ? '<li><a href="#line">Complete the line</a></li>' : ''}
  </ul></div>
</nav>

<section class="section" id="overview" aria-labelledby="ov-title">
  <div class="container two-col">
    <div>
      <h2 id="ov-title" class="section-title">Highlights</h2>
      <ul class="checklist checklist--cols" role="list">${p.highlights.map((h) => `<li>${icon('check')}${esc(h)}</li>`)}</ul>
    </div>
    ${p.options?.length ? html`<aside class="panel">
      <h2 class="h3">Options &amp; integrations</h2>
      <ul class="dash-list" role="list">${p.options.map((o) => `<li>${esc(o)}</li>`)}</ul>
      <p class="panel__note">Every machine can be configured to your product. <a href="/contact/?interest=${p.slug}">Ask about options</a>.</p>
    </aside>` : ''}
  </div>
</section>

${p.models || p.specs ? html`<section class="section section--alt" id="specs" aria-labelledby="spec-title">
  <div class="container">
    <h2 id="spec-title" class="section-title">Specifications</h2>
    ${p.models ? modelsTable(p) : specTable(p.specs, `${p.name} specifications`)}
    <p class="fine">${p.note ? esc(p.note) + ' ' : ''}Speeds and size ranges depend on your product, film and package. We confirm performance by testing with your samples.</p>
  </div>
</section>` : ''}

<section class="section" id="applications" aria-labelledby="app-title">
  <div class="container two-col">
    <div>
      <h2 id="app-title" class="section-title">What it packages</h2>
      <ul class="pill-list" role="list">${p.uses.map((u) => `<li>${esc(u)}</li>`)}</ul>
      ${p.packages.length ? html`<h3 class="h3 mt">Package formats</h3>
      <ul class="pkg-mini" role="list">${p.packages.map((x) => pkgById[x]).filter(Boolean).map((P) => html`<li>${P.image ? imgTag(P.image, '') : ''}<span>${esc(P.name)}</span></li>`)}</ul>` : ''}
    </div>
    ${inds.length ? html`<div>
      <h2 class="h3">Industries</h2>
      <ul class="tag-list" role="list">${inds.map((i) => `<li><a class="tag" href="/industries/${i.slug}/">${esc(i.name)}</a></li>`)}</ul>
      <div class="next-steps">
        <h2 class="h3">How buying works</h2>
        <ol role="list">
          <li><strong>Tell us about your product</strong> — what it is, package size and target output.</li>
          <li><strong>Test with your samples</strong> — we can run your product and packaging before you commit.</li>
          <li><strong>Quote, build &amp; install</strong> — we deliver, install and train your team.</li>
        </ol>
        <a class="btn btn--primary" href="/contact/?interest=${p.slug}" data-track="product_quote_lower" data-product="${p.slug}">Start with a quote ${icon('arrow')}</a>
      </div>
    </div>` : ''}
  </div>
</section>

${pairs.length ? html`<section class="section section--alt" id="line" aria-labelledby="line-title">
  <div class="container">
    <h2 id="line-title" class="section-title">Complete the line</h2>
    <p class="section-lead">Machines that commonly run alongside the ${esc(p.name)}.</p>
    <ul class="grid grid--products" role="list">${pairs.map((x) => `<li>${productCard(x)}</li>`)}</ul>
  </div>
</section>` : ''}

${relatedGuides(postsFor({ product: p.slug }), { title: 'Guides & answers' })}

${siblings.length ? html`<section class="section" aria-labelledby="sib-title">
  <div class="container">
    <h2 id="sib-title" class="section-title">Other ${esc(c.name.toLowerCase())}</h2>
    <ul class="grid grid--products" role="list">${siblings.slice(0, 4).map((x) => `<li>${productCard(x, { showCategory: false })}</li>`)}</ul>
  </div>
</section>` : ''}

<div class="sticky-cta" data-sticky-cta>
  <span class="sticky-cta__name">${esc(p.name)}</span>
  <a class="btn btn--primary btn--sm" href="/contact/?interest=${p.slug}" data-track="product_sticky_quote" data-product="${p.slug}">Get a quote</a>
</div>
`;
  return layout({
    path: productUrl(p),
    title: `${p.fullName} | ${c.name}`.length + 12 <= 60 ? `${p.fullName} | ${c.name}` : p.fullName,
    ogTitle: p.fullName,
    description: desc,
    body,
    bodyClass: 'page-product',
    scripts: ['product.js'],
    preloadImage: mainImg && !mainImg.remote ? mainImg.src : null,
    ogImage: `/assets/img/og/${p.slug}.jpg`,
    ogImageAlt: p.fullName,
    jsonld: [bc.ld],
  });
}

// ════════════════════════════ FINDER ════════════════════════════
export function finderData() {
  return {
    forms, packages, speedBands, addons, stages,
    categories: categories.map((c) => ({ slug: c.slug, name: c.name, short: c.short, stage: c.stage, accent: c.accent })),
    products: products.map((p) => {
      const i = img(p.image);
      return {
        slug: p.slug, name: p.name, fullName: p.fullName, category: p.category, role: p.role, stageRole: p.stageRole || catBySlug[p.category].stage,
        tagline: p.tagline, forms: p.forms, packages: p.packages, speed: p.speed, url: productUrl(p), img: i.src, w: i.w, h: i.h, speedLabel: speedLabel(p),
      };
    }),
  };
}

export function finderPage() {
  const bc = breadcrumbs([['Home', '/'], ['Machine Finder', '/machine-finder/']]);
  const step = (n, title, hint, inner, { multi = false } = {}) => html`<fieldset class="fstep" data-step="${n}" id="step-${n}">
    <legend class="fstep__legend"><span class="fstep__n">Step ${n} of 4</span><span class="fstep__q">${title}</span></legend>
    ${hint ? `<p class="fstep__hint">${hint}</p>` : ''}
    ${inner}
    <div class="fstep__nav">
      <button type="button" class="btn btn--text" data-back>${icon('back')} Back</button>
      <button type="button" class="btn btn--primary" data-next>${n === 4 ? 'See my matches' : 'Next'} ${icon('arrow')}</button>
    </div>
  </fieldset>`;

  const body = html`
<section class="page-hero page-hero--finder">
  <div class="container">
    ${bc.html}
    <h1 class="page-hero__title">Machine Finder</h1>
    <p class="page-hero__lead">Four quick questions about your product and package. We’ll match you with machines — and show you how to build out the rest of your line.</p>
  </div>
</section>
<section class="section section--tight finder-section">
  <div class="container">
    <noscript><p class="notice">The Machine Finder needs JavaScript. You can still <a href="/machines/">browse all machines</a> or <a href="/contact/">tell us about your product</a> and we’ll recommend a machine.</p></noscript>
    <form class="finder" data-finder action="/contact/" method="get" novalidate>
      <ol class="finder__progress" role="list" aria-label="Progress">
        ${['Product', 'Package', 'Output', 'Add-ons', 'Matches'].map((t, i) => `<li data-progress="${i + 1}"><span class="finder__dot" aria-hidden="true">${i + 1}</span><span>${t}</span></li>`)}
      </ol>
      <p class="visually-hidden" role="status" aria-live="polite" data-finder-status></p>

      <div class="fstep" data-step="1" id="step-1">
        ${wheel({ id: 'finder-wheel', legendTag: 'h2' })}
        <div class="fstep__nav fstep__nav--center">
          <button type="button" class="btn btn--primary" data-next>Next ${icon('arrow')}</button>
        </div>
      </div>

      ${step(2, 'What package do you want to make?', 'Showing formats that suit your product. Not sure? Pick the closest.', html`<div class="opt-grid opt-grid--pkg" data-pkg-options>
        ${packages.map((P) => html`<div class="opt" data-pkg="${P.id}">
          <input class="visually-hidden" type="radio" name="pkg" id="pkg-${P.id}" value="${P.id}">
          <label for="pkg-${P.id}" class="opt__card">${P.image ? `<span class="opt__img">${imgTag(P.image, '')}</span>` : `<span class="opt__img opt__img--icon">${icon('cannabis', 'opt__icon')}</span>`}<span class="opt__name">${esc(P.name)}</span><span class="opt__note">${esc(P.note)}</span></label>
        </div>`)}
      </div>`)}

      ${step(3, 'How many packages per minute do you need?', 'A rough target is fine — it helps us size the machine.', html`<div class="opt-grid opt-grid--speed">
        ${speedBands.map((s) => html`<div class="opt">
          <input class="visually-hidden" type="radio" name="speed" id="speed-${s.id}" value="${s.id}">
          <label for="speed-${s.id}" class="opt__card opt__card--text"><span class="opt__name">${esc(s.name)}</span><span class="opt__note">${esc(s.note)}</span></label>
        </div>`)}
      </div>`)}

      ${step(4, 'What else would you like to automate?', 'Optional — choose any that apply and we’ll suggest machines to complete your line.', html`<div class="opt-grid opt-grid--addons">
        ${addons.map((a) => html`<div class="opt">
          <input class="visually-hidden" type="checkbox" name="add" id="add-${a.id}" value="${a.id}">
          <label for="add-${a.id}" class="opt__card opt__card--check">${icon('check', 'opt__tick')}<span class="opt__name">${esc(a.name)}</span></label>
        </div>`)}
      </div>`)}

      <section class="results" data-results hidden tabindex="-1" aria-labelledby="results-title">
        <div class="results__head">
          <div>
            <p class="eyebrow">Your matches</p>
            <h2 id="results-title" class="section-title">Machines that fit your product</h2>
            <p class="results__summary" data-summary></p>
          </div>
          <button type="button" class="btn btn--text" data-restart>${icon('restart')} Start over</button>
        </div>
        <div data-primary></div>
        <div data-line></div>
        <div class="results__cta">
          <div>
            <h3 class="h3">Get a quote for this setup</h3>
            <p>We’ll send your selections to a WrapSense specialist so you don’t have to repeat yourself.</p>
          </div>
          <a class="btn btn--primary" href="/contact/" data-quote-link data-track="finder_quote">Send to a specialist ${icon('arrow')}</a>
        </div>
      </section>
    </form>
  </div>
</section>
<script type="application/json" id="finder-data">${JSON.stringify(finderData()).replace(/</g, '\\u003c')}</script>
`;
  return layout({
    path: '/machine-finder/',
    title: 'Machine Finder: Match a Machine to Your Product',
    description: 'Answer four quick questions about your product, package and output to find the right WrapSense packaging machine — and the equipment to complete your line.',
    body,
    scripts: ['finder.js'],
    jsonld: [bc.ld],
    bodyClass: 'page-finder',
  });
}

// ════════════════════════════ INDUSTRIES ════════════════════════════
export function industriesPage() {
  const bc = breadcrumbs([['Home', '/'], ['Industries', '/industries/']]);
  const body = html`
<section class="page-hero"><div class="container">
  ${bc.html}
  <h1 class="page-hero__title">Industries we serve</h1>
  <p class="page-hero__lead">WrapSense machines package food, beverage, supplements, pharmaceuticals, cosmetics, cannabis and more. Pick your industry to see the machines and package formats that fit.</p>
</div></section>
<section class="section"><div class="container">
  <ul class="grid grid--ind" role="list">
    ${industries.map((i) => {
      const count = products.filter((p) => p.industries.includes(i.slug)).length;
      return html`<li><article class="icard">
        <div class="icard__img">${imgTag(i.image, '')}</div>
        <div><h2 class="icard__title"><a href="/industries/${i.slug}/">${esc(i.name)}</a></h2>
        <p>${esc(truncate(i.intro, 120))}</p><p class="icard__count">${count} recommended machines</p></div>
      </article></li>`;
    })}
  </ul>
</div></section>
${ctaBand()}`;
  return layout({ path: '/industries/', title: 'Packaging Machinery by Industry', description: 'Packaging machines for snacks, coffee, supplements, bakery, frozen foods, produce, pet food, spices, pharmaceuticals, cosmetics and cannabis.', body, jsonld: [bc.ld] });
}

export function industryPage(i) {
  const bc = breadcrumbs([['Home', '/'], ['Industries', '/industries/'], [i.name, `/industries/${i.slug}/`]]);
  const list = products.filter((p) => p.industries.includes(i.slug));
  const primary = list.filter((p) => p.role === 'primary');
  const support = list.filter((p) => p.role !== 'primary');
  const body = html`
<section class="page-hero page-hero--split"><div class="container page-hero__split">
  <div>
    ${bc.html}
    <p class="eyebrow">Industry</p>
    <h1 class="page-hero__title">${esc(i.name)} packaging machines</h1>
    <p class="page-hero__lead">${esc(i.intro)}</p>
    <a class="btn btn--primary" href="/machine-finder/?form=${i.forms[0]}" data-track="industry_finder">Find my machine ${icon('arrow')}</a>
  </div>
  <div class="page-hero__img">${imgTag(i.image, '', { eager: true })}</div>
</div></section>
<section class="section section--tight"><div class="container two-col">
  <div><h2 class="h3">What matters in ${esc(i.name.toLowerCase())}</h2>
  <ul class="checklist" role="list">${i.challenges.map((c) => `<li>${icon('check')}${esc(c)}</li>`)}</ul></div>
  <div><h2 class="h3">Common package formats</h2>
  <ul class="pkg-mini" role="list">${i.packages.map((x) => pkgById[x]).filter(Boolean).map((P) => html`<li>${P.image ? imgTag(P.image, '') : ''}<span>${esc(P.name)}</span></li>`)}</ul></div>
</div></section>
<section class="section section--alt" aria-labelledby="ip-title"><div class="container">
  <h2 id="ip-title" class="section-title">Packaging machines for ${esc(i.name.toLowerCase())}</h2>
  <ul class="grid grid--products" role="list">${primary.map((p) => `<li>${productCard(p)}</li>`)}</ul>
  ${support.length ? html`<h2 class="section-title mt-lg">Weighing, inspection &amp; line equipment</h2>
  <ul class="grid grid--products" role="list">${support.map((p) => `<li>${productCard(p)}</li>`)}</ul>` : ''}
</div></section>
${relatedGuides(postsFor({ industry: i.slug }))}

${ctaBand({ title: `Packaging ${i.name.toLowerCase()}? Let’s talk.`, text: 'Send us your product details or samples and we’ll recommend a machine or full line.' })}`;
  return layout({
    path: `/industries/${i.slug}/`,
    title: `${i.name} Packaging Machines`.length + 12 <= 60 ? `${i.name} Packaging Machines` : `${i.name} Packaging`,
    description: truncate(`Packaging machines for ${i.name.toLowerCase()}: ${i.intro}`, 158),
    body,
    jsonld: [bc.ld],
  });
}

// ════════════════════════════ SERVICES ════════════════════════════
export function servicesPage() {
  const bc = breadcrumbs([['Home', '/'], ['Service & Support', '/services/']]);
  const icons = { setup: 'wrench', training: 'users', maintenance: 'shield', custom: 'gear', procurement: 'box', testing: 'flask' };
  const body = html`
<section class="page-hero page-hero--split"><div class="container page-hero__split">
  <div>
    ${bc.html}
    <h1 class="page-hero__title">Service &amp; support</h1>
    <p class="page-hero__lead">The right machine is only half the job. Our technicians install it, train your team and help keep it running — so you get the output you paid for.</p>
    <div class="hero__actions">
      <a class="btn btn--primary" href="/contact/?type=service" data-track="service_request">Request service ${icon('arrow')}</a>
      <a class="btn btn--outline" href="${site.phoneHref}" data-track="phone_click">${icon('phone')} ${esc(site.phone)}</a>
    </div>
  </div>
  <div class="page-hero__img">${imgTag('photos/technician.webp', 'WrapSense technician servicing a packaging machine', { eager: true, cls: 'rounded' })}</div>
</div></section>
<section class="section"><div class="container">
  <ul class="grid grid--services" role="list">
    ${services.map((s) => html`<li><article class="scard" id="${s.id}"><span class="scard__icon">${icon(icons[s.id])}</span><h2 class="scard__title">${esc(s.name)}</h2><p>${esc(s.text)}</p></article></li>`)}
  </ul>
</div></section>
<section class="section section--alt" aria-labelledby="proc-title"><div class="container">
  <div class="section-head"><p class="eyebrow">Business process</p><h2 id="proc-title" class="section-title">How we work</h2></div>
  <ol class="timeline" role="list">
    ${process.map((s, i) => html`<li><span class="timeline__n" aria-hidden="true">${i + 1}</span><h3 class="timeline__title">${esc(s.name)}</h3><p>${esc(s.text)}</p></li>`)}
  </ol>
</div></section>
<section class="section"><div class="container split">
  <div class="split__media">${imgTag('photos/vffs-install.webp', 'Packaging machines installed on a production floor', { cls: 'rounded' })}</div>
  <div class="split__copy">
    <h2 class="section-title">Warranty and spare parts</h2>
    <p>WrapSense machines are backed by a warranty, and we stock spare parts for the machines we sell — so a worn part doesn’t turn into weeks of downtime. Service contracts are available for planned maintenance.</p>
    <a class="btn btn--primary" href="/contact/?type=service">Ask about parts or service ${icon('arrow')}</a>
  </div>
</div></section>
${ctaBand()}`;
  return layout({ path: '/services/', title: 'Installation, Training & Machine Service', description: 'WrapSense installs, trains and services packaging machinery: set-up, operator training, preventive maintenance, spare parts, custom builds and product testing.', body, jsonld: [bc.ld, { '@context': 'https://schema.org', '@type': 'Service', serviceType: 'Packaging machinery installation, training and maintenance', provider: { '@id': site.url + '/#organization' }, areaServed: 'US' }] });
}

// ════════════════════════════ ABOUT ════════════════════════════
export function aboutPage() {
  const bc = breadcrumbs([['Home', '/'], ['About', '/about/']]);
  const body = html`
<section class="page-hero page-hero--split"><div class="container page-hero__split">
  <div>
    ${bc.html}
    <p class="eyebrow">About WrapSense</p>
    <h1 class="page-hero__title">If you have an idea, we can design it. Manufacture it. Service it.</h1>
    <p class="page-hero__lead">WrapSense Packaging designs and manufactures packaging machinery and complete packaging lines, with a focus on turn-key solutions for small and medium-size enterprises.</p>
  </div>
  <div class="page-hero__img">${imgTag('photos/filling-closeup.webp', 'Automatic filler dosing product into containers', { eager: true, cls: 'rounded' })}</div>
</div></section>
<section class="section"><div class="container two-col">
  <div class="prose">
    <h2>Built on value, quality and service</h2>
    <p>Our engineering team focuses on packaging machinery for the food, beverage, pharmaceutical, dietary supplement and cannabis industries. We help businesses of every size automate their lines, reduce labor costs, increase productivity and — where it’s needed — run around the clock.</p>
    <p>We can take a project from concept through manufacturing and service: recommending standard machines where they fit, and modifying or custom-building equipment when your product calls for it.</p>
  </div>
  <div class="panel">
    <h2 class="h3">Headquarters</h2>
    <address class="contact-list">
      <a href="${site.mapUrl}" target="_blank" rel="noopener">${icon('pin')}<span>${esc(site.address.street)}, ${esc(site.address.city)}, ${esc(site.address.region)} ${esc(site.address.postal)}<span class="visually-hidden"> (opens Google Maps in a new tab)</span></span></a>
      <a href="${site.phoneHref}" data-track="phone_click">${icon('phone')}<span>${esc(site.phone)}</span></a>
      <a href="mailto:${site.email}" data-track="email_click">${icon('mail')}<span>${esc(site.email)}</span></a>
    </address>
  </div>
</div>
<div class="container">
  <h2 class="section-title mt-lg">Why customers choose WrapSense</h2>
  <ul class="grid grid--3" role="list">
    <li><article class="scard"><span class="scard__icon">${icon('shield')}</span><h3 class="scard__title">Quality</h3><p>Machines backed by a warranty, with spare parts kept in stock for the equipment we sell.</p></article></li>
    <li><article class="scard"><span class="scard__icon">${icon('sparkle')}</span><h3 class="scard__title">Value</h3><p>Performance you need at a price that makes automation realistic for growing businesses.</p></article></li>
    <li><article class="scard"><span class="scard__icon">${icon('wrench')}</span><h3 class="scard__title">Service</h3><p>Project planning, installation, integration, training and service contracts to reduce downtime.</p></article></li>
  </ul>
</div></section>
<section class="section section--alt"><div class="container">
  <div class="section-head"><h2 class="section-title">What automation can do for your line</h2></div>
  <ul class="grid grid--4 benefits" role="list">
    <li><strong>Reduce labor costs</strong><span>Free your team from repetitive hand-packing.</span></li>
    <li><strong>Automate packaging</strong><span>Consistent fills, seals and labels on every pack.</span></li>
    <li><strong>Increase productivity</strong><span>More output from the same floor space and shifts.</span></li>
    <li><strong>Custom-designed machines</strong><span>Equipment adapted to your product when standard won’t do.</span></li>
  </ul>
</div></section>
${ctaBand()}`;
  return layout({ path: '/about/', title: 'About WrapSense Packaging', description: 'WrapSense Packaging designs, builds and services packaging machinery and turn-key lines for small and medium businesses. Based in Gaithersburg, Maryland.', body, jsonld: [bc.ld, orgLd] });
}
