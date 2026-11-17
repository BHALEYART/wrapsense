// Builds the client-side search index (dist/assets/search-index.json).
import { products } from '../src/data/products.mjs';
import { categories } from '../src/data/categories.mjs';
import { industries } from '../src/data/industries.mjs';
import { packages, forms } from '../src/data/site.mjs';
import { posts } from './blog.mjs';
import { productUrl, categoryUrl, categoryImage } from './components.mjs';
import { img } from './lib.mjs';

const C = Object.fromEntries(categories.map((c) => [c.slug, c]));
const PK = Object.fromEntries(packages.map((p) => [p.id, p.name]));
const FM = Object.fromEntries(forms.map((f) => [f.id, f.name]));
const IN = Object.fromEntries(industries.map((i) => [i.slug, i.name]));

// Extra search terms people actually type, so "vffs", "bagger" or "taper" still find the right pages.
const ALIASES = {
  'vertical-form-fill-seal': 'vffs bagger bagging machine form fill seal pillow bag chip bag vertical packaging machine',
  'stick-pack-sachet-machines': 'stickpack stick packs sachet single serve 3 side seal packet multi lane',
  'premade-pouch-machines': 'pouch filler stand up pouch zipper pouch doypack spout pouch bagger rotary pouch',
  'flow-wrappers': 'flow wrap flowrapper horizontal wrapper pillow wrap hffs bar wrapper inverted',
  'weighing-filling': 'scale combination weigher combi multihead multi head auger powder filler net weigher dosing filling',
  'metal-detectors-checkweighers': 'inspection metal detection check weigher checkweigher haccp sqf reject food safety',
  'labeling-machines': 'labeler labeller label applicator wrap around front back top bottom',
  'capping-auxiliary': 'capper capping screw cap bottle cap oxygen absorber desiccant inserter',
  'cartoning-machines': 'cartoner carton boxing box folding carton',
  'case-erectors-sealers': 'case former box erector carton erector taper case sealer box sealer tape palletizer palletizing pallet',
  'case-packing': 'case packer robot pick and place packing boxes',
  'conveyors-elevators': 'conveyor elevator incline bucket feeder take away',
  'specialty-machines': 'pre roll preroll cone joint cake cutter slicer custom',
  'packaging-film': 'rollstock roll stock printed film laminate packaging material',
};

const clip = (s, n) => (s.length > n ? s.slice(0, n) : s);
const strip = (md) => md.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[#*>|_`-]+/g, ' ').replace(/\s+/g, ' ').trim();

export function buildSearchIndex() {
  const out = [];
  for (const p of products) {
    const c = C[p.category];
    const i = img(p.image);
    out.push({
      t: 'Machine', title: p.name, sub: c.name, url: productUrl(p), img: i.src, desc: p.tagline, w: p.role === 'primary' || p.stageRole === 'dose' ? 2 : 0, a: [p.series, (p.models || []).map((m) => m.name).join(' ')].filter(Boolean).join(' '),
      kw: [p.fullName, p.series, c.name, c.short, ALIASES[c.slug], (p.models || []).map((m) => m.name).join(' '), p.packages.map((x) => PK[x]).join(' '), p.forms.map((x) => FM[x]).join(' '), p.industries.map((x) => IN[x]).join(' ')].filter(Boolean).join(' '),
      body: clip([p.summary, p.highlights.join('. '), p.uses.join(', '), (p.options || []).join(', ')].join(' '), 1500),
    });
  }
  for (const c of categories) {
    out.push({ t: 'Category', img: img(categoryImage(c)).src, title: c.name, sub: c.series ? `${c.series} series` : 'Machine category', url: categoryUrl(c), desc: c.intro.slice(0, 140), a: [c.short, c.series, ALIASES[c.slug]].filter(Boolean).join(' '), kw: '', body: [c.intro, c.bestFor.join('. ')].join(' ') });
  }
  for (const i of industries) {
    out.push({ t: 'Industry', img: img(i.image).src, title: `${i.name} packaging machines`, sub: 'Industry', a: i.short, url: `/industries/${i.slug}/`, desc: i.intro.slice(0, 140), kw: [i.name, i.short, i.examples.join(' '), i.packages.map((x) => PK[x]).join(' ')].join(' '), body: clip([i.intro, i.intro2, i.benefits.map((b) => b.join(' ')).join(' '), i.faqs.map((f) => f.join(' ')).join(' ')].join(' '), 2000) });
  }
  for (const b of posts) {
    out.push({ t: 'Guide', title: b.title, sub: `${b.minutes} min read`, url: `/blog/${b.slug}/`, desc: b.description, kw: [b.seoTitle, b.toc.map((x) => x.text).join(' '), (b.faqs || []).map((f) => f[0]).join(' ')].join(' '), body: clip(strip(b.body) + ' ' + (b.faqs || []).map((f) => f[1]).join(' '), 3500) });
  }
  const pages = [
    ['Machine Finder', '/machine-finder/', 'Answer four questions to match a machine to your product.', 'finder quiz recommend which machine help choose wizard selector'],
    ['Request a quote', '/contact/', 'Tell us what you’re packaging and get a quote.', 'quote price pricing cost contact sales email phone call'],
    ['Service & support', '/services/', 'Installation, training, maintenance, parts and custom machines.', 'service repair parts spare parts maintenance installation training technician support warranty'],
    ['About WrapSense', '/about/', 'Packaging machinery and turn-key lines from Gaithersburg, Maryland.', 'about company who we are maryland gaithersburg'],
    ['2026 product catalog', '/catalog/', 'Download the full WrapSense catalog (PDF).', 'catalog catalogue brochure pdf download spec sheet'],
    ['All machines', '/machines/', 'Browse every WrapSense machine.', 'machines products equipment all'],
    ['Blog & buying guides', '/blog/', 'Guides to choosing and running packaging equipment.', 'blog articles guides faq resources'],
  ];
  for (const [title, url, desc, kw] of pages) out.push({ t: 'Page', title, sub: 'Page', url, desc, kw, body: '' });
  return JSON.stringify(out);
}
