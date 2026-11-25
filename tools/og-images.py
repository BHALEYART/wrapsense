"""Generate 1200×630 social share images into src/assets/img/og/.
Usage: python3 tools/og-images.py  (needs Pillow + fonttools[woff] + brotli to read the woff2 fonts)"""
import json, os, subprocess, tempfile, textwrap
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from fontTools.ttLib import TTFont

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
IMG = os.path.join(ROOT, 'src/assets/img')
OUT = os.path.join(IMG, 'og')
os.makedirs(OUT, exist_ok=True)

tmp = tempfile.mkdtemp()
def ttf(name, out):
    f = TTFont(os.path.join(ROOT, 'src/assets/fonts', name)); f.flavor = None
    p = os.path.join(tmp, out); f.save(p); return p
OSWALD, POPPINS = ttf('oswald-latin-wght-normal.woff2', 'o.ttf'), ttf('poppins-latin-500-normal.woff2', 'p.ttf')

data = json.loads(subprocess.run(['node', '-e', """
Promise.all([import('./src/data/products.mjs'), import('./src/data/categories.mjs'), import('./src/data/blog.mjs'), import('./src/data/industries.mjs')]).then(([p, c, b, ind]) => console.log(JSON.stringify({
  industries: ind.industries.map(x => ({ slug: x.slug, name: x.name, image: x.image })),
  posts: b.posts.map(x => ({ slug: x.slug, title: x.title, image: x.image })),
  products: p.products.map(x => ({ slug: x.slug, name: x.fullName, tagline: x.tagline, image: x.image, category: x.category })),
  categories: c.categories.map(x => ({ slug: x.slug, name: x.name, accent: x.accent, image: x.image, series: x.series })) })));
"""], capture_output=True, text=True, cwd=ROOT).stdout)
cats = {c['slug']: c for c in data['categories']}
W, H = 1200, 630
NAVY = (13, 21, 51)

def hexrgb(h): h = h.lstrip('#'); return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))

def glow(base, color, cx, cy, r, a):
    layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(layer).ellipse((cx - r, cy - r, cx + r, cy + r), fill=color + (a,))
    return Image.alpha_composite(base, layer.filter(ImageFilter.GaussianBlur(r * .45)))

def card(title, kicker, sub, accent, image):
    a1, a2 = hexrgb(accent[0]), hexrgb(accent[1])
    im = Image.new('RGBA', (W, H), NAVY + (255,))
    im = glow(im, a2, 1000, 230, 360, 150)
    im = glow(im, a1, 120, 700, 340, 140)
    d = ImageDraw.Draw(im)
    # accent bar
    for x in range(W):
        t = x / W
        d.line([(x, H - 10), (x, H)], fill=tuple(int(a1[i] * (1 - t) + a2[i] * t) for i in range(3)))
    logo = Image.open(os.path.join(IMG, 'brand/wrapsense-logo-light.png')).convert('RGBA')
    logo = logo.resize((260, int(260 * logo.height / logo.width)), Image.LANCZOS)
    im.alpha_composite(logo, (64, 56))
    # product image on the right
    if image and not image.startswith('legacy:') and os.path.exists(os.path.join(IMG, image)):
        p = Image.open(os.path.join(IMG, image)).convert('RGBA')
        box = 470
        p.thumbnail((box, box), Image.LANCZOS)
        panel = Image.new('RGBA', (520, 520), (0, 0, 0, 0))
        ImageDraw.Draw(panel).rounded_rectangle((0, 0, 519, 519), 36, fill=(255, 255, 255, 255))
        panel.alpha_composite(p, ((520 - p.width) // 2, (520 - p.height) // 2))
        im.alpha_composite(panel, (W - 520 - 56, (H - 520) // 2 - 4))
        text_w = 520
    else:
        text_w = 1000
    f_k = ImageFont.truetype(POPPINS, 24)
    y = 200
    if kicker:
        d.text((64, y), kicker.upper(), font=f_k, fill=(143, 211, 240)); y += 48
    size = 68
    while size > 40:
        f_t = ImageFont.truetype(OSWALD, size); f_t.set_variation_by_axes([600])
        chars = max(8, int(text_w / (size * .5)))
        lines = textwrap.wrap(title.upper(), chars)
        if len(lines) <= 3 and all(d.textlength(l, font=f_t) <= text_w for l in lines): break
        size -= 4
    for l in lines:
        d.text((64, y), l, font=f_t, fill=(255, 255, 255)); y += int(size * 1.12)
    if sub:
        y += 24
        f_s = ImageFont.truetype(POPPINS, 26)
        for l in textwrap.wrap(sub, int(text_w / 14))[:2]:
            d.text((64, y), l, font=f_s, fill=(201, 212, 255)); y += 38
    return im.convert('RGB')

def home_card():
    """Homepage share card: the WrapSense logo, centered on white."""
    im = Image.new('RGB', (W, H), (255, 255, 255))
    d = ImageDraw.Draw(im)
    a1, a2 = (14, 30, 60), (42, 117, 209)
    for x in range(W):
        t = x / W
        d.line([(x, H - 12), (x, H)], fill=tuple(int(a1[i] * (1 - t) + a2[i] * t) for i in range(3)))
    logo = Image.open(os.path.join(IMG, 'brand/wrapsense-logo.png')).convert('RGBA')
    lw = 820; logo = logo.resize((lw, round(logo.height * lw / logo.width)), Image.LANCZOS)
    logo = logo.filter(ImageFilter.UnsharpMask(1.2, 60, 2))
    im.paste(logo, ((W - lw) // 2, (H - 12 - logo.height) // 2), logo)
    return im

home_card().save(os.path.join(OUT, 'home.jpg'), quality=90, optimize=True)
card('Packaging machines matched to your product', 'Packaging machinery · Gaithersburg, MD', 'Turn-key packaging solutions for small & medium-size enterprises', ['#0e1e3c', '#2e7ad6'], 'products/fastpack-line.webp').save(os.path.join(OUT, 'default.jpg'), quality=86, optimize=True)
for c in data['categories']:
    card(c['name'], c['series'] or 'WrapSense Packaging', None, c['accent'], c['image']).save(os.path.join(OUT, f"category-{c['slug']}.jpg"), quality=80, optimize=True)
for p in data['products']:
    c = cats[p['category']]
    card(p['name'], c['name'], p['tagline'], c['accent'], p['image']).save(os.path.join(OUT, f"{p['slug']}.jpg"), quality=80, optimize=True)
for b in data['posts']:
    card(b['title'], 'WrapSense Packaging · Guide', None, ['#0e1e3c', '#2e7ad6'], b['image']).save(os.path.join(OUT, f"blog-{b['slug']}.jpg"), quality=80, optimize=True)
for i in data['industries']:
    card(i['name'] + ' packaging machines', 'Industries · WrapSense Packaging', None, ['#0e1e3c', '#2e7ad6'], i['image']).save(os.path.join(OUT, f"industry-{i['slug']}.jpg"), quality=80, optimize=True)
print('OG images:', len(os.listdir(OUT)))
