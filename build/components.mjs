import { esc, html, icon, img, imgTag } from './lib.mjs';
import { forms, stages } from '../src/data/site.mjs';
import { categories } from '../src/data/categories.mjs';
import { products } from '../src/data/products.mjs';

export const catBySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));
export const productUrl = (p) => `/machines/${p.category}/${p.slug}/`;
export const categoryUrl = (c) => `/machines/${typeof c === 'string' ? c : c.slug}/`;
export const productsIn = (slug) => products.filter((p) => p.category === slug);

export function categoryImage(c) {
  if (c.image) return c.image;
  if (c.legacyImage) return 'legacy:' + c.legacyImage;
  return productsIn(c.slug)[0]?.image;
}

export const accentStyle = (c) => `--a1:${c.accent[0]};--a2:${c.accent[1]}`;

export function speedLabel(p) {
  if (!p.speed || p.speed.max >= 400) return null;
  const unitMap = { 'case-erectors-sealers': 'cases/min', 'case-packing': 'per min', 'cartoning-machines': 'cartons/min', 'labeling-machines': 'units/min', 'capping-auxiliary': 'units/min', 'weighing-filling': 'cycles/min' };
  const unit = unitMap[p.category] || 'packs/min';
  return p.speed.min ? `${p.speed.min}–${p.speed.max} ${unit}` : `Up to ${p.speed.max} ${unit}`;
}

export function productCard(p, { headingLevel = 3, showCategory = true } = {}) {
  const c = catBySlug[p.category];
  const h = `h${headingLevel}`;
  const spd = speedLabel(p);
  return html`<article class="pcard" style="${accentStyle(c)}" data-category="${c.slug}" data-stage="${c.stage}" data-forms="${p.forms.join(' ')}" data-packages="${p.packages.join(' ')}" data-industries="${p.industries.join(' ')}">
    <div class="pcard__media">${imgTag(p.image, '', { cls: 'pcard__img' })}</div>
    <div class="pcard__body">
      ${showCategory ? `<p class="pcard__cat">${esc(c.short)}</p>` : ''}
      <${h} class="pcard__title"><a href="${productUrl(p)}">${esc(p.name)}</a></${h}>
      <p class="pcard__tagline">${esc(p.tagline)}</p>
      ${spd ? `<p class="pcard__meta">${icon('gear')}<span>${esc(spd)}</span></p>` : ''}
    </div>
    <span class="pcard__go" aria-hidden="true">${icon('arrow')}</span>
  </article>`;
}

export function categoryCard(c, { headingLevel = 3 } = {}) {
  const h = `h${headingLevel}`;
  const count = productsIn(c.slug).length;
  return html`<article class="ccard" style="${accentStyle(c)}">
    <div class="ccard__media">${imgTag(categoryImage(c), '', { cls: 'ccard__img' })}</div>
    <div class="ccard__body">
      ${c.series ? `<p class="ccard__series">${esc(c.series)}</p>` : ''}
      <${h} class="ccard__title"><a href="${categoryUrl(c)}">${esc(c.name)}</a></${h}>
      <p class="ccard__count">${count} ${count === 1 ? 'machine' : 'machines'}</p>
    </div>
  </article>`;
}

/** The radial "what are you packaging?" selector. Native radios → keyboard + screen reader friendly. */
export function wheel({ id = 'wheel', compact = false, legendTag = 'h2', stepLabel = 'Step 1 of 4', selected = '' } = {}) {
  const n = forms.length;
  return html`<fieldset class="wheel${compact ? ' wheel--compact' : ''}" id="${id}" data-wheel style="--n:${n};--sel:0">
    <legend class="wheel__legend"><span class="wheel__step">${esc(stepLabel)}</span> <span class="wheel__q">What are you packaging?</span></legend>
    <div class="wheel__stage">
      <div class="wheel__ring" aria-hidden="true">
        <svg viewBox="0 0 400 400" class="wheel__svg">
          ${forms.map((f, i) => `<circle class="wheel__seg" data-seg="${f.id}" cx="200" cy="200" r="168" fill="none" stroke="${f.color}" stroke-width="56" pathLength="${n}" stroke-dasharray="1 ${n - 1}" transform="rotate(${(i * 360) / n - 90 - 180 / n} 200 200)"/>`)}
          ${forms.map((_, i) => {
            const a = ((i / n) * 360 - 90 + 360 / n / 2) * (Math.PI / 180);
            const x1 = 200 + Math.cos(a) * 140, y1 = 200 + Math.sin(a) * 140, x2 = 200 + Math.cos(a) * 196, y2 = 200 + Math.sin(a) * 196;
            return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#fff" stroke-width="4"/>`;
          })}
        </svg>
      </div>
      <div class="wheel__hub" aria-hidden="true">
        <span class="wheel__hub-step">${esc(stepLabel)}</span>
        <span class="wheel__hub-q">What are you packaging?</span>
        <span class="wheel__hub-pick" data-wheel-pick>Pick a product type</span>
      </div>
      <ul class="wheel__items" role="list">
        ${forms.map((f, i) => html`<li class="wheel__item" style="--i:${i};--c:${f.color}" data-form="${f.id}">
          <input class="wheel__input visually-hidden" type="radio" name="form" id="${id}-${f.id}" value="${f.id}"${selected === f.id ? ' checked' : ''} required>
          <label class="wheel__label" for="${id}-${f.id}">
            ${icon(f.icon, 'wheel__icon')}
            <span class="wheel__name">${esc(f.name)}</span>
            <span class="wheel__ex visually-hidden">${esc(f.examples)}</span>
          </label>
        </li>`)}
      </ul>
    </div>
    <p class="wheel__examples" data-wheel-examples aria-live="polite"></p>
  </fieldset>`;
}

/** Horizontal "your line" stage diagram used on home + category pages. */
export function lineDiagram({ highlight = null, link = true } = {}) {
  const shown = stages.filter((s) => s.id !== 'specialty');
  return html`<ol class="line" role="list">
    ${shown.map((s, i) => {
      const cats = categories.filter((c) => c.stage === s.id);
      const active = highlight === s.id;
      return html`<li class="line__stage${active ? ' is-active' : ''}">
        <span class="line__num" aria-hidden="true">${i + 1}</span>
        <p class="line__name">${esc(s.name)}</p>
        ${link ? html`<ul class="line__cats" role="list">${cats.map((c) => `<li><a href="${categoryUrl(c)}">${esc(c.short)}</a></li>`)}</ul>` : ''}
      </li>`;
    })}
  </ol>`;
}

export function specTable(rows, caption) {
  return html`<div class="table-wrap" role="region" aria-label="${esc(caption)}" tabindex="0"><table class="spec-table">
    <caption class="visually-hidden">${esc(caption)}</caption>
    <tbody>${Object.entries(rows).map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`)}</tbody>
  </table></div>`;
}

export function modelsTable(p) {
  const keys = [...new Set(p.models.flatMap((m) => Object.keys(m.specs)))];
  return html`<div class="table-wrap" role="region" aria-label="${esc(p.name)} model specifications" tabindex="0"><table class="spec-table spec-table--models">
    <caption class="visually-hidden">${esc(p.name)} models compared</caption>
    <thead><tr><th scope="col">Model</th>${keys.map((k) => `<th scope="col">${esc(k)}</th>`)}</tr></thead>
    <tbody>${p.models.map((m) => html`<tr><th scope="row">${esc(m.name)}</th>${keys.map((k) => `<td>${esc(m.specs[k] ?? '—')}</td>`)}</tr>`)}</tbody>
  </table></div>`;
}

export function ctaBand({ title = 'Talk to a packaging specialist', text = 'Tell us about your product and we’ll recommend the right machine — or set up a test run with your samples.', interest = '' } = {}) {
  return html`<section class="cta-band" aria-labelledby="cta-band-title">
    <div class="container cta-band__inner">
      <div><h2 id="cta-band-title" class="cta-band__title">${esc(title)}</h2><p>${esc(text)}</p></div>
      <div class="cta-band__actions">
        <a class="btn btn--primary" href="/contact/${interest ? `?interest=${encodeURIComponent(interest)}` : ''}" data-track="cta_band_quote">Request a Quote ${icon('arrow')}</a>
        <a class="btn btn--outline" href="/machine-finder/" data-track="cta_band_finder">Use the Machine Finder</a>
      </div>
    </div>
  </section>`;
}

export { img };
