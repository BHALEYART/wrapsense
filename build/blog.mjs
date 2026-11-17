import { esc, html, icon, imgTag, img } from './lib.mjs';
import { layout, breadcrumbs, orgLd } from './layout.mjs';
import { site } from '../src/data/site.mjs';
import { products } from '../src/data/products.mjs';
import { categories } from '../src/data/categories.mjs';
import { industries } from '../src/data/industries.mjs';
import { posts as rawPosts, topics } from '../src/data/blog.mjs';
import { productUrl, categoryUrl, productCard } from './components.mjs';

const P = Object.fromEntries(products.map((p) => [p.slug, p]));
const C = Object.fromEntries(categories.map((c) => [c.slug, c]));
const I = Object.fromEntries(industries.map((i) => [i.slug, i]));
const T = Object.fromEntries(topics.map((t) => [t.id, t]));
export const postUrl = (p) => `/blog/${p.slug}/`;
const slugify = (s) => s.toLowerCase().replace(/&[a-z]+;/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const fmtDate = (d) => new Date(d + 'T12:00:00Z').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });

// ── markdown subset ─────────────────────────────────────────────
function inline(text, refs, where) {
  let s = esc(text);
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, href) => {
    href = href.replace(/&amp;/g, '&');
    const m = href.match(/^([pci]):(.+)$/);
    if (m) {
      const [, kind, slug] = m;
      const target = kind === 'p' ? P[slug] && productUrl(P[slug]) : kind === 'c' ? C[slug] && categoryUrl(C[slug]) : I[slug] && `/industries/${slug}/`;
      if (!target) throw new Error(`${where}: unknown link target ${href}`);
      refs.add(href);
      href = target;
    } else if (!href.startsWith('/') && !href.startsWith('https://')) throw new Error(`${where}: bad link ${href}`);
    const ext = href.startsWith('http');
    return `<a href="${esc(href)}"${ext ? ' rel="noopener" target="_blank"' : ''}>${label}</a>`;
  });
  return s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\*([^*]+)\*/g, '<em>$1</em>');
}

export function renderMarkdown(src, where) {
  const refs = new Set(), toc = [], out = [];
  const lines = src.trim().split('\n');
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    let m;
    if ((m = line.match(/^(#{2,3}) (.+)$/))) {
      const level = m[1].length, text = m[2], id = slugify(text);
      if (level === 2) toc.push({ id, text });
      out.push(`<h${level} id="${id}">${inline(text, refs, where)}</h${level}>`);
      i++;
    } else if (line.startsWith('|')) {
      const rows = [];
      while (i < lines.length && lines[i].startsWith('|')) rows.push(lines[i++]);
      const cells = (r) => r.replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
      const head = cells(rows[0]), body = rows.slice(2).map(cells);
      out.push(`<div class="table-wrap" role="region" aria-label="Comparison table" tabindex="0"><table class="spec-table spec-table--prose"><thead><tr>${head.map((h) => `<th scope="col">${inline(h, refs, where) || '<span class="visually-hidden">Feature</span>'}</th>`).join('')}</tr></thead><tbody>${body.map((r) => `<tr>${r.map((c, j) => (j === 0 ? `<th scope="row">${inline(c, refs, where)}</th>` : `<td>${inline(c, refs, where)}</td>`)).join('')}</tr>`).join('')}</tbody></table></div>`);
    } else if (/^- /.test(line)) {
      const items = [];
      while (i < lines.length && /^- /.test(lines[i])) items.push(lines[i++].slice(2));
      out.push(`<ul>${items.map((t) => `<li>${inline(t, refs, where)}</li>`).join('')}</ul>`);
    } else if (/^\d+\. /.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) items.push(lines[i++].replace(/^\d+\. /, ''));
      out.push(`<ol>${items.map((t) => `<li>${inline(t, refs, where)}</li>`).join('')}</ol>`);
    } else if (line.startsWith('> ')) {
      const buf = [];
      while (i < lines.length && lines[i].startsWith('> ')) buf.push(lines[i++].slice(2));
      out.push(`<div class="callout">${icon('shield')}<p>${inline(buf.join(' '), refs, where)}</p></div>`);
    } else {
      const buf = [];
      while (i < lines.length && lines[i].trim() && !/^(#{2,3} |\||- |\d+\. |> )/.test(lines[i])) buf.push(lines[i++]);
      out.push(`<p>${inline(buf.join(' '), refs, where)}</p>`);
    }
  }
  return { html: out.join('\n'), toc, refs };
}

// ── prepared posts ──────────────────────────────────────────────
export const posts = rawPosts
  .map((p) => {
    for (const s of p.products || []) if (!P[s]) throw new Error(`blog ${p.slug}: unknown product ${s}`);
    if (!T[p.topic]) throw new Error(`blog ${p.slug}: unknown topic ${p.topic}`);
    for (const i of p.industries || []) if (!I[i]) throw new Error(`blog ${p.slug}: unknown industry ${i}`);
    const r = renderMarkdown(p.body, `blog ${p.slug}`);
    const words = p.body.split(/\s+/).length + (p.faqs || []).flat().join(' ').split(/\s+/).length;
    return { ...p, ...r, minutes: Math.max(3, Math.round(words / 220)) };
  })
  .sort((a, b) => b.date.localeCompare(a.date));

const refsProducts = (post) => new Set([...post.refs].filter((r) => r.startsWith('p:')).map((r) => r.slice(2)).concat(post.products || []));
/** Posts that link to a product, a category (or any product in it), or an industry — for reverse internal links. */
export function postsFor({ product, category, industry }) {
  return posts.filter((post) => {
    if (product) return refsProducts(post).has(product);
    if (category) return post.refs.has('c:' + category) || [...refsProducts(post)].some((s) => P[s].category === category);
    if (industry) return post.refs.has('i:' + industry) || (post.industries || []).includes(industry);
    return false;
  });
}

function postCard(p, { headingLevel = 3, lead = false } = {}) {
  const h = `h${headingLevel}`;
  return html`<article class="bcard${lead ? ' bcard--lead' : ''}">
    <div class="bcard__media">${imgTag(p.image, '')}</div>
    <div class="bcard__body">
      <p class="bcard__meta"><span class="bcard__topic">${esc(T[p.topic].name)}</span> · <time datetime="${p.date}">${fmtDate(p.date)}</time></p>
      <${h} class="bcard__title"><a href="${postUrl(p)}">${esc(p.title)}</a></${h}>
      <p class="bcard__desc">${esc(p.description)}</p>
      <p class="bcard__read">${p.minutes} min read ${icon('arrow')}</p>
    </div>
  </article>`;
}

/** "Guides & answers" strip for machine/category/industry pages. */
export function relatedGuides(list, { title = 'Guides & answers', lead = '' } = {}) {
  if (!list.length) return '';
  return html`<section class="section section--tight related-guides" aria-labelledby="rg-title">
    <div class="container">
      <div class="section-head section-head--row"><div><p class="eyebrow">From the blog</p><h2 id="rg-title" class="section-title">${esc(title)}</h2>${lead ? `<p class="section-lead">${esc(lead)}</p>` : ''}</div><a class="link-arrow" href="/blog/">All guides ${icon('arrow')}</a></div>
      <ul class="guide-list" role="list">${list.slice(0, 3).map((p) => html`<li><a class="guide-link" href="${postUrl(p)}"><span class="guide-link__topic">${esc(T[p.topic].name)}</span><span class="guide-link__title">${esc(p.title)}</span><span class="guide-link__read">${p.minutes} min read ${icon('arrow')}</span></a></li>`)}</ul>
    </div>
  </section>`;
}

export function homeGuides() {
  const pick = ['vffs-vs-premade-pouch-machine', 'packaging-machine-cost', 'signs-its-time-to-automate-packaging'].map((s) => posts.find((p) => p.slug === s));
  return relatedGuides(pick, { title: 'Buying guides & answers', lead: 'Straight answers to the questions we hear most from businesses choosing their first — or next — packaging machine.' });
}

// ── pages ───────────────────────────────────────────────────────
export function blogIndexPage() {
  const bc = breadcrumbs([['Home', '/'], ['Blog', '/blog/']]);
  const [lead, ...rest] = posts;
  const body = html`
<section class="page-hero"><div class="container">
  ${bc.html}
  <p class="eyebrow">Guides &amp; answers</p>
  <h1 class="page-hero__title">Packaging machinery blog</h1>
  <p class="page-hero__lead">Practical guides to choosing, planning and running packaging equipment — from comparing machine types to troubleshooting seals and planning a full line.</p>
</div></section>
<section class="section section--tight"><div class="container">
  <nav class="chips chips--links" aria-label="Blog topics">
    ${topics.map((t) => `<a class="chip-link" href="#topic-${t.id}">${esc(t.name)}</a>`)}
  </nav>
  <div class="blog-lead">${postCard(lead, { headingLevel: 2, lead: true })}</div>
  ${topics.map((t) => {
    const list = rest.filter((p) => p.topic === t.id);
    if (!list.length) return '';
    return html`<section class="blog-topic" id="topic-${t.id}" aria-labelledby="th-${t.id}">
      <h2 class="blog-topic__title" id="th-${t.id}">${esc(t.name)}</h2>
      <ul class="grid grid--blog" role="list">${list.map((p) => `<li>${postCard(p)}</li>`)}</ul>
    </section>`;
  })}
</div></section>
<section class="cta-band"><div class="container cta-band__inner">
  <div><h2 class="cta-band__title">Have a question we haven’t covered?</h2><p>Ask a packaging specialist — or let the Machine Finder narrow down your options.</p></div>
  <div class="cta-band__actions"><a class="btn btn--primary" href="/contact/" data-track="blog_quote">Ask us ${icon('arrow')}</a><a class="btn btn--outline" href="/machine-finder/">Machine Finder</a></div>
</div></section>`;
  return layout({
    path: '/blog/',
    title: 'Packaging Machinery Blog: Guides & Answers',
    description: 'Guides from WrapSense on choosing packaging machines, comparing VFFS, pouch, stick pack and flow wrap options, troubleshooting and planning a packaging line.',
    body,
    jsonld: [bc.ld, {
      '@context': 'https://schema.org', '@type': 'Blog', name: 'WrapSense Packaging Blog', url: site.url + '/blog/', publisher: { '@id': site.url + '/#organization' },
      blogPost: posts.map((p) => ({ '@type': 'BlogPosting', headline: p.title, url: site.url + postUrl(p), datePublished: p.date })),
    }],
  });
}

export function blogPostPage(p) {
  const bc = breadcrumbs([['Home', '/'], ['Blog', '/blog/'], [p.title, postUrl(p)]]);
  const machines = (p.products || []).map((s) => P[s]);
  const related = posts.filter((x) => x.slug !== p.slug).map((x) => ({ x, score: (x.topic === p.topic ? 2 : 0) + [...refsProducts(x)].filter((s) => refsProducts(p).has(s)).length })).sort((a, b) => b.score - a.score).slice(0, 3).map((r) => r.x);
  const hero = img(p.image);
  const body = html`
<article class="post">
  <header class="post-hero"><div class="container post-hero__inner">
    <div>
      ${bc.html}
      <p class="eyebrow"><a href="/blog/#topic-${p.topic}">${esc(T[p.topic].name)}</a></p>
      <h1 class="post-hero__title">${esc(p.title)}</h1>
      <p class="post-hero__lead">${esc(p.description)}</p>
      <p class="post-hero__meta">By the WrapSense Packaging team · <time datetime="${p.date}">${fmtDate(p.date)}</time> · ${p.minutes} min read</p>
    </div>
    <div class="post-hero__media">${imgTag(p.image, p.imageAlt, { eager: true, fetchpriority: 'high' })}</div>
  </div></header>

  <div class="container post-layout">
    <aside class="post-aside" aria-label="Article tools">
      <nav class="toc" aria-labelledby="toc-title">
        <p class="toc__title" id="toc-title">In this article</p>
        <ol role="list">${p.toc.map((t) => `<li><a href="#${t.id}">${esc(t.text)}</a></li>`)}${p.faqs?.length ? '<li><a href="#faq">FAQs</a></li>' : ''}</ol>
      </nav>
      <div class="aside-cta">
        <p class="aside-cta__title">Not sure which machine fits?</p>
        <p>Answer four quick questions and we’ll match machines to your product.</p>
        <a class="btn btn--primary btn--sm" href="/machine-finder/" data-track="blog_finder">Machine Finder ${icon('arrow')}</a>
      </div>
    </aside>
    <div class="post-body prose">
      ${p.html}
      ${p.faqs?.length ? html`<section class="faq" id="faq" aria-labelledby="faq-title">
        <h2 id="faq-title">Frequently asked questions</h2>
        ${p.faqs.map(([q, a]) => html`<details class="faq__item"><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`)}
      </section>` : ''}
      <div class="post-cta">
        <div><p class="post-cta__title">Talk it through with a specialist</p><p>Tell us about your product and we’ll recommend a setup — or test your samples on our machines.</p></div>
        <a class="btn btn--primary" href="/contact/${machines.length ? `?interest=${machines.slice(0, 2).map((m) => m.slug).join(',')}` : ''}" data-track="blog_post_quote">Request a quote ${icon('arrow')}</a>
      </div>
    </div>
  </div>
</article>

${machines.length ? html`<section class="section section--alt" aria-labelledby="mm-title"><div class="container">
  <h2 id="mm-title" class="section-title">Machines in this article</h2>
  <ul class="grid grid--products" role="list">${machines.map((m) => `<li>${productCard(m)}</li>`)}</ul>
</div></section>` : ''}

<section class="section" aria-labelledby="more-title"><div class="container">
  <h2 id="more-title" class="section-title">Keep reading</h2>
  <ul class="grid grid--blog" role="list">${related.map((r) => `<li>${postCard(r)}</li>`)}</ul>
</div></section>`;

  const faqLd = p.faqs?.length ? { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: p.faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) } : null;
  return layout({
    path: postUrl(p),
    title: p.seoTitle || p.title,
    ogTitle: p.title,
    description: p.description,
    body,
    ogType: 'article',
    ogImage: `/assets/img/og/blog-${p.slug}.jpg`,
    preloadImage: hero && !hero.remote ? hero.src : null,
    bodyClass: 'page-post',
    scripts: ['product.js'],
    jsonld: [bc.ld, {
      '@context': 'https://schema.org', '@type': 'BlogPosting', headline: p.title, description: p.description,
      datePublished: p.date, dateModified: p.updated || p.date, mainEntityOfPage: site.url + postUrl(p),
      image: site.url + `/assets/img/og/blog-${p.slug}.jpg`,
      author: { '@type': 'Organization', name: site.name, url: site.url + '/' }, publisher: { '@id': site.url + '/#organization' },
      about: machines.map((m) => ({ '@type': 'Thing', name: m.fullName, url: site.url + productUrl(m) })),
    }, faqLd, orgLd].filter(Boolean),
  });
}
