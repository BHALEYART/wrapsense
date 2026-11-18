// Static site build: node build/build.mjs → dist/
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { DIST, SRC, ROOT, write, copyDir, warnings } from './lib.mjs';
import { assetVersion } from './layout.mjs';
import { site, addons } from '../src/data/site.mjs';
import { categories } from '../src/data/categories.mjs';
import { products } from '../src/data/products.mjs';
import { industries } from '../src/data/industries.mjs';
import { productUrl, categoryUrl } from './components.mjs';
import {
  homePage, machinesPage, categoryPage, productPage, finderPage, industriesPage, industryPage, servicesPage, aboutPage,
} from './pages.mjs';
import { blogIndexPage, blogPostPage, posts } from './blog.mjs';
import { caseIndexPage, casePage, cases, caseUrl } from './case-studies.mjs';
import { buildSearchIndex } from './search-index.mjs';
import { financingPage } from './pages-financing.mjs';
import { contactPage, catalogPage, privacyPage, accessibilityPage, thankYouPage, notFoundPage, searchPage } from './pages-forms.mjs';

const t0 = Date.now();
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });

// ── assets ──
copyDir(path.join(SRC, 'assets'), path.join(DIST, 'assets'));
fs.copyFileSync(path.join(SRC, 'assets/img/brand/favicon.ico'), path.join(DIST, 'favicon.ico'));
const hash = (dir) => {
  const h = crypto.createHash('sha1');
  for (const f of fs.readdirSync(dir).sort()) h.update(fs.readFileSync(path.join(dir, f)));
  return h.digest('hex').slice(0, 10);
};
assetVersion.css = hash(path.join(SRC, 'assets/css'));
assetVersion.js = hash(path.join(SRC, 'assets/js'));
assetVersion.files = {};
for (const dir of ['css', 'js']) {
  for (const f of fs.readdirSync(path.join(DIST, 'assets', dir))) {
    const buf = fs.readFileSync(path.join(DIST, 'assets', dir, f));
    const h = crypto.createHash('sha1').update(buf).digest('hex').slice(0, 10);
    const hashed = f.replace(/\.(css|js)$/, `.${h}.$1`);
    fs.renameSync(path.join(DIST, 'assets', dir, f), path.join(DIST, 'assets', dir, hashed));
    assetVersion.files[f] = hashed;
  }
}

// ── search index (versioned so browsers pick up changes) ──
const searchJson = buildSearchIndex();
assetVersion.search = crypto.createHash('sha1').update(searchJson).digest('hex').slice(0, 10);
write('assets/search-index.json', searchJson);

// ── data integrity ──
const catSlugs = new Set(categories.map((c) => c.slug));
const seen = new Set();
for (const p of products) {
  if (!catSlugs.has(p.category)) throw new Error(`${p.slug}: unknown category ${p.category}`);
  if (seen.has(p.slug)) throw new Error(`duplicate product slug ${p.slug}`);
  seen.add(p.slug);
}
for (const c of categories) if (!products.some((p) => p.category === c.slug)) throw new Error(`empty category ${c.slug}`);
for (const i of industries) for (const s of [...i.machines, ...i.typicalLine]) if (!seen.has(s)) throw new Error(`industry ${i.slug}: unknown product ${s}`);
for (const a of addons) for (const s of a.products || []) if (!seen.has(s)) throw new Error(`addon ${a.id}: unknown product ${s}`);
for (const a of addons) for (const c of a.categories) if (!catSlugs.has(c)) throw new Error(`addon ${a.id}: unknown category ${c}`);

// OG images fall back to the default if a per-page image hasn't been generated
const ogDir = path.join(SRC, 'assets/img/og');
const ogExists = (f) => fs.existsSync(path.join(ogDir, f));

// ── pages ──
const pages = [];
const emit = (urlPath, htmlStr, { priority = 0.6, sitemap = true, lastmod = null } = {}) => {
  let out = htmlStr;
  const m = out.match(/property="og:image" content="[^"]*\/assets\/img\/og\/([^"]+)"/);
  if (m && !ogExists(m[1])) out = out.replace(`/assets/img/og/${m[1]}`, '/assets/img/og/default.jpg');
  write(urlPath === '/404/' ? '404.html' : path.join(urlPath, 'index.html'), out);
  if (sitemap) pages.push({ loc: site.url + urlPath, priority, lastmod });
};

emit('/', homePage(), { priority: 1.0 });
emit('/machines/', machinesPage(), { priority: 0.9 });
emit('/machine-finder/', finderPage(), { priority: 0.9 });
for (const c of categories) emit(categoryUrl(c), categoryPage(c), { priority: 0.85 });
for (const p of products) emit(productUrl(p), productPage(p), { priority: 0.8 });
emit('/industries/', industriesPage(), { priority: 0.7 });
for (const i of industries) emit(`/industries/${i.slug}/`, industryPage(i), { priority: 0.7 });
emit('/blog/', blogIndexPage(), { priority: 0.7 });
for (const b of posts) emit(`/blog/${b.slug}/`, blogPostPage(b), { priority: 0.6, lastmod: b.updated || b.date });
if (cases.length) {
  emit('/case-studies/', caseIndexPage(), { priority: 0.6, sitemap: cases.some((c) => !c.draft) });
  for (const c of cases) emit(caseUrl(c), casePage(c), { priority: 0.6, sitemap: !c.draft });
}
emit('/services/', servicesPage(), { priority: 0.7 });
emit('/financing/', financingPage(), { priority: 0.7 });
emit('/about/', aboutPage(), { priority: 0.6 });
emit('/contact/', contactPage(), { priority: 0.8 });
emit('/catalog/', catalogPage(), { priority: 0.4 });
emit('/privacy/', privacyPage(), { priority: 0.2 });
emit('/accessibility/', accessibilityPage(), { priority: 0.2 });
emit('/thank-you/', thankYouPage(), { sitemap: false });
emit('/search/', searchPage(), { sitemap: false });
emit('/404/', notFoundPage(), { sitemap: false });

// ── sitemap / robots / manifest ──
const today = new Date().toISOString().slice(0, 10);
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((p) => `  <url><loc>${p.loc}</loc><lastmod>${p.lastmod || today}</lastmod><priority>${p.priority.toFixed(1)}</priority></url>`).join('\n')}
</urlset>
`);
write('robots.txt', `User-agent: *
Allow: /
Disallow: /api/
Disallow: /thank-you/
Disallow: /search/

Sitemap: ${site.url}/sitemap.xml
`);
write('site.webmanifest', JSON.stringify({
  name: site.name, short_name: 'WrapSense', start_url: '/', display: 'browser', background_color: '#ffffff', theme_color: '#0e1e3c',
  icons: [{ src: '/assets/img/brand/w-mark-192.png', sizes: '192x192', type: 'image/png' }, { src: '/assets/img/brand/w-mark-512.png', sizes: '512x512', type: 'image/png' }],
}, null, 2));

// ── report ──
const unique = [...new Set(warnings)];
console.log(`Built ${pages.length + 2} pages in ${Date.now() - t0} ms → ${path.relative(ROOT, DIST)}/`);
if (unique.length) {
  console.warn(`\n⚠ ${unique.length} warning(s):`);
  for (const w of unique) console.warn('  - ' + w);
}
