// Post-build QA: internal links, images, SEO tags, heading order, duplicate ids, labels.
import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../dist');
const files = [];
(function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); e.isDirectory() ? walk(p) : p.endsWith('.html') && files.push(p); } })(dist);

const problems = [];
const titles = new Map(), descs = new Map();
const exists = (url) => {
  const clean = url.split('#')[0].split('?')[0];
  if (!clean) return true;
  const p = path.join(dist, decodeURIComponent(clean));
  return fs.existsSync(p) && (fs.statSync(p).isFile() || fs.existsSync(path.join(p, 'index.html')));
};

for (const f of files) {
  const rel = '/' + path.relative(dist, f).replace(/index\.html$/, '');
  const h = fs.readFileSync(f, 'utf8');
  const bad = (m) => problems.push(`${rel}: ${m}`);
  const dec = (x) => x.replace(/&(amp|lt|gt|quot|#39);/g, 'x');
  const noindex = /name="robots" content="noindex/.test(h);

  const title = (h.match(/<title>([^<]*)<\/title>/) || [])[1];
  const desc = (h.match(/<meta name="description" content="([^"]*)"/) || [])[1];
  if (!title) bad('missing <title>');
  else { if (dec(title).length > 65) bad(`title ${title.length} chars: ${title}`); if (!noindex) { if (titles.has(title)) bad(`duplicate title (also ${titles.get(title)})`); titles.set(title, rel); } }
  if (!desc) bad('missing meta description');
  else { const dl = dec(desc).length; if (!noindex && (dl > 160 || dl < 70)) bad(`description ${dl} chars`); if (!noindex) { if (descs.has(desc)) bad(`duplicate description (also ${descs.get(desc)})`); descs.set(desc, rel); } }
  if (!/<link rel="canonical"/.test(h)) bad('missing canonical');
  if (!/<html lang="/.test(h)) bad('missing lang');

  const h1 = (h.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) bad(`${h1} <h1> elements`);
  // heading order (ignore headings inside <template>/<script>)
  const body = h.replace(/<script[\s\S]*?<\/script>/g, '');
  let last = 0;
  for (const m of body.matchAll(/<h([1-6])[\s>]/g)) { const lv = +m[1]; if (last && lv > last + 1) { bad(`heading jumps h${last} → h${lv}`); break; } last = lv; }

  const ids = [...body.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  const dup = ids.filter((x, i) => ids.indexOf(x) !== i);
  if (dup.length) bad(`duplicate ids: ${[...new Set(dup)].join(', ')}`);

  for (const m of body.matchAll(/<img\b[^>]*>/g)) {
    if (!/\salt="/.test(m[0])) bad(`img without alt: ${m[0].slice(0, 80)}`);
    const src = (m[0].match(/src="([^"]+)"/) || [])[1];
    if (src && src.startsWith('/') && !exists(src)) bad(`missing image ${src}`);
    if (!/\swidth="\d+"/.test(m[0])) bad(`img without width/height: ${src}`);
  }
  for (const m of body.matchAll(/\shref="([^"]+)"/g)) {
    const u = m[1].replace(/&amp;/g, '&');
    if (u.startsWith('/') && !u.startsWith('//') && !u.startsWith('/api/') && !exists(u)) bad(`broken link ${u}`);
  }
  for (const m of body.matchAll(/<(input|select|textarea)\b[^>]*\sid="([^"]+)"[^>]*>/g)) {
    if (/type="hidden"/.test(m[0])) continue;
    const id = m[2];
    if (!new RegExp(`<label[^>]*for="${id}"`).test(body) && !/aria-label=/.test(m[0])) bad(`form control #${id} has no label`);
  }
  for (const m of body.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) if (!/rel="[^"]*noopener/.test(m[0])) bad('target=_blank without rel=noopener');
}

// sitemap entries all exist
const sm = fs.readFileSync(path.join(dist, 'sitemap.xml'), 'utf8');
for (const m of sm.matchAll(/<loc>https:\/\/[^/]+(\/[^<]*)<\/loc>/g)) if (!exists(m[1])) problems.push(`sitemap: ${m[1]} missing`);

console.log(`Checked ${files.length} pages.`);
if (problems.length) { console.log(`\n${problems.length} problem(s):`); problems.forEach((p) => console.log('  - ' + p)); process.exitCode = 1; }
else console.log('No problems found.');
