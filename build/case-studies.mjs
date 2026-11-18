import { esc, html, icon, imgTag, img } from './lib.mjs';
import { layout, breadcrumbs } from './layout.mjs';
import { site } from '../src/data/site.mjs';
import { products } from '../src/data/products.mjs';
import { industries } from '../src/data/industries.mjs';
import { visibleCaseStudies } from '../src/data/case-studies.mjs';
import { productCard } from './components.mjs';
import { renderMarkdown, postsFor, relatedGuides } from './blog.mjs';

const P = Object.fromEntries(products.map((p) => [p.slug, p]));
const I = Object.fromEntries(industries.map((i) => [i.slug, i]));

export const caseUrl = (c) => `/case-studies/${c.slug}/`;
export const cases = visibleCaseStudies.map((c) => {
    const where = `case study ${c.slug}`;
    if (!I[c.industry]) throw new Error(`${where}: unknown industry ${c.industry}`);
    for (const s of c.products) if (!P[s]) throw new Error(`${where}: unknown product ${s}`);
    if (!img(c.image)) throw new Error(`${where}: missing image ${c.image}`);
    const md = (k) => renderMarkdown(c[k], `${where} ${k}`).html;
    return { ...c, html: { challenge: md('challenge'), solution: md('solution'), result: md('result') } };
  });

/** Case studies that used a product, any product in a category, or belong to an industry — reverse internal links. */
export function casesFor({ product, category, industry }) {
  return cases.filter((c) =>
    product ? c.products.includes(product) : category ? c.products.some((s) => P[s].category === category) : industry ? c.industry === industry : false);
}

const draftBanner = (c) => (c.draft ? html`<div class="draft-banner" role="note"><div class="container"><strong>Placeholder case study.</strong> Customer, numbers and quote are illustrative and this page is hidden on the live site until real details are approved.</div></div>` : '');

function caseCard(c, { headingLevel = 3 } = {}) {
  const h = `h${headingLevel}`;
  const top = c.stats.find((s) => s.before) || c.stats[0];
  return html`<article class="ccase">
    <div class="ccase__media">${imgTag(c.image, '')}${c.draft ? '<span class="ccase__draft">Placeholder</span>' : ''}</div>
    <div class="ccase__body">
      <p class="ccase__meta">${esc(I[c.industry].name)} · ${esc(c.location)}</p>
      <${h} class="ccase__title"><a href="${caseUrl(c)}">${esc(c.title)}</a></${h}>
      <p class="ccase__stat"><span>${esc(top.label)}</span>${top.before ? `<s>${esc(top.before)}</s> ${icon('arrow')} ` : ''}<strong>${esc(top.after)}</strong></p>
      <p class="ccase__read">Read the case study ${icon('arrow')}</p>
    </div>
  </article>`;
}

/** "Case studies" strip for home / industry / category / product pages. */
export function caseStrip(list, { title = 'Case studies', lead = '', alt = false } = {}) {
  if (!list.length) return '';
  return html`<section class="section${alt ? ' section--alt' : ''}" aria-labelledby="cs-title">
    <div class="container">
      <div class="section-head section-head--row"><div><p class="eyebrow">Results on real lines</p><h2 id="cs-title" class="section-title">${esc(title)}</h2>${lead ? `<p class="section-lead">${esc(lead)}</p>` : ''}</div><a class="link-arrow" href="/case-studies/">All case studies ${icon('arrow')}</a></div>
      <ul class="grid grid--cases" role="list">${list.slice(0, 3).map((c) => `<li>${caseCard(c)}</li>`)}</ul>
    </div>
  </section>`;
}

export const homeCases = () => caseStrip(cases, { title: 'Case studies', lead: 'How businesses like yours automated — the product, the line we built and what changed.' });

export function caseIndexPage() {
  const bc = breadcrumbs([['Home', '/'], ['Case studies', '/case-studies/']]);
  const anyDraft = cases.some((c) => c.draft);
  const body = html`
${anyDraft ? html`<div class="draft-banner" role="note"><div class="container"><strong>Placeholder content.</strong> These case studies are illustrative and hidden on the live site until real customer details are approved.</div></div>` : ''}
<section class="page-hero"><div class="container">
  ${bc.html}
  <p class="eyebrow">Results on real lines</p>
  <h1 class="page-hero__title">Case studies</h1>
  <p class="page-hero__lead">The product, the line we built and what changed — from first machine to full turn-key lines.</p>
</div></section>
<section class="section section--tight"><div class="container">
  <ul class="grid grid--cases" role="list">${cases.map((c) => `<li>${caseCard(c, { headingLevel: 2 })}</li>`)}</ul>
</div></section>
<section class="cta-band"><div class="container cta-band__inner">
  <div><h2 class="cta-band__title">Want results like these?</h2><p>Send us your product and we’ll show you how it runs on our machines.</p></div>
  <div class="cta-band__actions"><a class="btn btn--primary" href="/contact/" data-track="cases_quote">Request a quote ${icon('arrow')}</a><a class="btn btn--outline" href="/machine-finder/">Machine Finder</a></div>
</div></section>`;
  return layout({
    path: '/case-studies/',
    title: 'Packaging Automation Case Studies | WrapSense Packaging',
    description: 'How food, supplement and coffee businesses automated packaging with WrapSense — the product, the line and the results.',
    body,
    noindex: anyDraft,
    jsonld: [bc.ld],
  });
}

export function casePage(c) {
  const bc = breadcrumbs([['Home', '/'], ['Case studies', '/case-studies/'], [c.title, caseUrl(c)]]);
  const ind = I[c.industry];
  const machines = c.products.map((s) => P[s]);
  const guides = [...new Set([...postsFor({ industry: c.industry }), ...c.products.flatMap((s) => postsFor({ product: s }))])];
  const more = cases.filter((x) => x.slug !== c.slug);
  const hero = img(c.image);
  const body = html`
${draftBanner(c)}
<article class="case">
  <header class="post-hero"><div class="container post-hero__inner">
    <div>
      ${bc.html}
      <p class="eyebrow"><a href="/industries/${ind.slug}/">${esc(ind.name)}</a> · Case study</p>
      <h1 class="post-hero__title">${esc(c.title)}</h1>
      <p class="post-hero__lead">${esc(c.summary)}</p>
      <dl class="case-facts">
        <div><dt>Customer</dt><dd>${esc(c.client)}, ${esc(c.location)}</dd></div>
        <div><dt>Product</dt><dd>${esc(c.product)}</dd></div>
        <div><dt>Install</dt><dd>${esc(c.installed)}</dd></div>
      </dl>
    </div>
    <div class="post-hero__media">${imgTag(c.image, '', { eager: true, fetchpriority: 'high' })}</div>
  </div></header>

  <section class="case-stats" aria-label="Results">
    <div class="container"><ul class="case-stats__list" role="list">
      ${c.stats.map((s) => html`<li><p class="case-stats__label">${esc(s.label)}</p><p class="case-stats__vals">${s.before ? `<span class="case-stats__before"><span class="visually-hidden">Before: </span>${esc(s.before)}</span>${icon('arrow')}` : ''}<strong><span class="visually-hidden">${s.before ? 'After: ' : ''}</span>${esc(s.after)}</strong></p></li>`)}
    </ul></div>
  </section>

  <div class="container case-body">
    <div class="prose">
      <h2 id="challenge">The challenge</h2>${c.html.challenge}
      <h2 id="solution">The line we built</h2>${c.html.solution}
      <h2 id="result">The result</h2>${c.html.result}
      ${c.quote ? html`<figure class="case-quote"><blockquote><p>“${esc(c.quote.text)}”</p></blockquote><figcaption>— ${esc(c.quote.name)}, ${esc(c.quote.role)}</figcaption></figure>` : ''}
    </div>
    <aside class="case-aside" aria-label="Get a similar line">
      <div class="aside-cta">
        <p class="aside-cta__title">Want a similar line?</p>
        <p>We’ll spec it for your product — and test your samples first.</p>
        <a class="btn btn--primary btn--sm" href="/contact/?industry=${ind.slug}&amp;interest=${c.products.join(',')}" data-track="case_quote">Quote this line ${icon('arrow')}</a>
      </div>
    </aside>
  </div>
</article>

<section class="section section--alt" aria-labelledby="cm-title"><div class="container">
  <h2 id="cm-title" class="section-title">Machines on this line</h2>
  <ul class="grid grid--products" role="list">${machines.map((m) => `<li>${productCard(m)}</li>`)}</ul>
</div></section>

${relatedGuides(guides, { title: 'Related guides' })}
${caseStrip(more, { title: 'More case studies', alt: true })}`;
  return layout({
    path: caseUrl(c),
    title: c.seoTitle || `${c.title} | Case Study`,
    ogTitle: c.title,
    description: c.summary,
    body,
    ogType: 'article',
    preloadImage: hero && !hero.remote ? hero.src : null,
    noindex: !!c.draft,
    bodyClass: 'page-post',
    jsonld: [bc.ld, ...(c.draft ? [] : [{
      '@context': 'https://schema.org', '@type': 'Article', headline: c.title, description: c.summary, about: ind.name,
      mainEntityOfPage: site.url + caseUrl(c), image: site.url + hero.src,
      author: { '@type': 'Organization', name: site.name, url: site.url + '/' }, publisher: { '@id': site.url + '/#organization' },
    }])],
  });
}
