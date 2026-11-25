"""Re-generate site images from the WrapSense catalog PDF.
Usage: python3 tools/extract-catalog-images.py path/to/catalog.pdf
Requires poppler-utils (pdfimages) and Pillow."""
import subprocess, sys, os, tempfile
from PIL import Image, ImageFilter

ROOT = os.path.join(os.path.dirname(__file__), '..', 'src', 'assets', 'img')
pdf = sys.argv[1]

# catalog image index -> (output folder, name, kind)
# kind: cut = transparent machine/package cutout, photo = rectangular photo
MAP = {
  75:('products','fastpack-line','cut'),
  89:('products','quickstick-eco','cut'), 91:('products','quickstick-pro','cut'), 93:('products','quickstick-pro-xl','cut'),
  103:('products','rapidbagger-compact','cut'), 105:('products','rapidbagger-inline','cut'),
  107:('products','rapidbagger-model-x','cut'), 109:('products','rapidbagger-sideload','cut'),
  111:('products','rapidbagger-line','cut'),
  121:('products','sensiweigh-pro','cut'), 135:('products','sensiweigh-pro-mini','cut'),
  139:('products','sensiweigh-linear','cut'), 141:('products','exactdose-auger','cut'),
  153:('products','triservo-23000-3sp','cut'), 151:('products','triservo-33000-3sp','cut'),
  161:('products','triservo-63000-3sp','cut'), 163:('products','triservo-inverted-63000-i3sp','cut'),
  165:('products','triservo-inverted-33000-i3sp','cut'),
  171:('products','casemaster-line','cut'), 173:('products','casemaster-velocity-prime','cut'),
  175:('products','casemaster-velocity-ultra','cut'), 177:('products','casemaster-velocity-turbo','cut'),
  179:('products','casemaster-fastseal','cut'), 167:('products','casemaster-palletstakr','cut'),
  191:('products','pickn-pack-casepacker-3','cut'), 203:('products','pickn-pack-casepacker-2','cut'),
  187:('products','pickn-pack-line','cut'),
  214:('products','cartomate-h','cut'), 216:('products','cartomate-v','cut'),
  238:('products','labelease-cl2','cut'), 240:('products','labelease-combo-fbcl','cut'), 234:('products','labelease-tbl','cut'),
  248:('products','capvantage-sdl-2','cut'), 244:('products','oxygen-sachet-inserter','cut'),
  # package types
  49:('packages','pillow-bag','cut'), 52:('packages','flow-wrap','cut'), 54:('packages','stick-pack','cut'),
  56:('packages','sachet','cut'), 60:('packages','stand-up-pouch','cut'), 62:('packages','spout-pouch','cut'),
  64:('packages','weigh-fill','cut'), 65:('packages','case-erect','cut'), 67:('packages','case-pack','cut'),
  69:('packages','carton','cut'), 71:('packages','label-cap','cut'), 73:('packages','pallet','cut'),
  157:('packages','flow-wrap-bag','cut'), 115:('packages','stand-up-zipper','cut'), 117:('packages','flat-pouch','cut'),
  119:('packages','spout-shaped','cut'), 133:('packages','jar','cut'),
  # photos
  0:('photos','film-line','photo'), 3:('photos','filling-closeup','photo'), 4:('photos','technician','photo'),
  123:('photos','weigher-snacks','photo'), 125:('photos','weigher-install','photo'), 128:('photos','vffs-install','photo'),
  206:('photos','case-packing-action','photo'), 251:('photos','weigher-detail','photo'),
}

tmp = tempfile.mkdtemp()
subprocess.run(['pdfimages', '-png', pdf, f'{tmp}/x'], check=True, stderr=subprocess.DEVNULL)
rows = [l.split() for l in subprocess.run(['pdfimages', '-list', pdf], capture_output=True, text=True).stdout.splitlines()[2:]]
smask_for = {}
for i, r in enumerate(rows):
    if r[2] == 'image' and i + 1 < len(rows) and rows[i + 1][2] == 'smask':
        smask_for[int(r[1])] = int(rows[i + 1][1])

for num, (folder, name, kind) in MAP.items():
    im = Image.open(f'{tmp}/x-{num:03d}.png').convert('RGB')
    if kind == 'cut' and num in smask_for:
        m = Image.open(f'{tmp}/x-{smask_for[num]:03d}.png').convert('L')
        if m.size != im.size:
            im = im.resize(m.size, Image.LANCZOS)
        im = im.convert('RGBA'); im.putalpha(m)
        im = im.crop(im.getbbox())
    # modest upscale for small sources so they render crisply at card sizes
    target = 800 if folder != 'packages' else 360
    scale = min(2.0, target / max(im.size))
    if scale > 1:
        im = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)
        im = im.filter(ImageFilter.UnsharpMask(radius=1.2, percent=60, threshold=2))
    out = os.path.join(ROOT, folder); os.makedirs(out, exist_ok=True)
    im.save(os.path.join(out, f'{name}.webp'), 'WEBP', quality=86, method=6)
    print(folder, name, im.size)
