// Industries served (from the previous site's "Industries" section plus catalog applications).
export const industries = [
  {
    slug: 'snacks', name: 'Snacks & Confectionery', image: 'packages/pillow-bag.webp',
    intro: 'Chips, nuts, jerky, candy and gummies are fragile, irregular and often sold by weight. The right line weighs accurately to limit giveaway, handles product gently and seals bags that hold up on the shelf.',
    challenges: ['Weight accuracy on irregular pieces', 'Gentle handling of fragile product', 'Fast changeovers between flavors and sizes'],
    forms: ['snacks'], packages: ['pillow-bag', 'stand-up-pouch', 'flow-wrap'],
  },
  {
    slug: 'coffee-tea', name: 'Coffee & Tea', image: 'packages/stand-up-pouch.webp',
    intro: 'Whole bean, ground, single-serve or loose leaf — coffee and tea packaging is about accurate fills, freshness and a premium look on the shelf.',
    challenges: ['Accurate fills of beans and grounds', 'Freshness and shelf life', 'Premium stand-up pouches and single-serve sticks'],
    forms: ['granular', 'powder'], packages: ['stand-up-pouch', 'gusseted-bag', 'stick-pack'],
  },
  {
    slug: 'nutrition', name: 'Protein Powder & Supplements', image: 'packages/stick-pack.webp',
    intro: 'Powders, capsules and gummies sold in tubs, pouches and single-serve sticks need precise dosing, dust control and clean labeling.',
    challenges: ['Dosing fine and non-free-flowing powders', 'Single-serve stick packs and sachets', 'Bottles that need capping, labeling and inserts'],
    forms: ['powder', 'container'], packages: ['stick-pack', 'stand-up-pouch', 'container'],
  },
  {
    slug: 'bakery', name: 'Bakery', image: 'packages/flow-wrap.webp',
    intro: 'Cookies, muffins, bars, breads and cakes are often soft or delicate. Flow wrapping protects them individually, and the right handling keeps them looking fresh.',
    challenges: ['Wrapping soft or delicate items', 'Variable product sizes', 'Food-safety inspection'],
    forms: ['solid'], packages: ['flow-wrap', 'pillow-bag', 'carton'],
  },
  {
    slug: 'dairy-frozen', name: 'Dairy & Frozen Foods', image: 'packages/flat-pouch.webp',
    intro: 'Cheese, ice cream bars and frozen foods need packaging that seals reliably in cold, wet environments — and equipment built to be cleaned.',
    challenges: ['Reliable seals in cold or wet conditions', 'Sanitary, wash-down construction', 'Metal detection for food safety'],
    forms: ['snacks', 'solid'], packages: ['pillow-bag', 'flat-pouch', 'flow-wrap'],
  },
  {
    slug: 'produce', name: 'Fruit & Vegetables', image: 'packages/case-pack.webp',
    intro: 'Fresh produce is soft, uneven and perishable. Inverted flow wrappers, weighers and case-handling equipment help you pack it quickly without bruising.',
    challenges: ['Soft, irregular products', 'Speed during peak harvest', 'Case erecting and packing'],
    forms: ['solid'], packages: ['flow-wrap', 'case'],
  },
  {
    slug: 'pet-food', name: 'Pet Food & Treats', image: 'packages/weigh-fill.webp',
    intro: 'Kibble, treats and chews are sold in everything from small pouches to large bags. Accurate weighing and durable seals matter at every size.',
    challenges: ['Wide range of bag sizes', 'Weighing kibble and irregular treats', 'Durable seals on heavy bags'],
    forms: ['granular', 'snacks'], packages: ['stand-up-pouch', 'gusseted-bag', 'pillow-bag'],
  },
  {
    slug: 'spices', name: 'Spices & Seasonings', image: 'packages/label-cap.webp',
    intro: 'Spices and seasonings are dusty, fine and often sold in jars, pouches and sachets. Auger fillers dose accurately, and labeling and capping finish the jar.',
    challenges: ['Dust control and accurate powder dosing', 'Jars that need capping and labels', 'Sachets and stick packs'],
    forms: ['powder', 'container'], packages: ['container', 'stand-up-pouch', 'sachet'],
  },
  {
    slug: 'pharmaceutical', name: 'Pharmaceutical', image: 'packages/carton.webp',
    intro: 'Pharmaceutical and OTC products demand accuracy, traceability and clean equipment — from stick packs and sachets to bottles, labels and cartons.',
    challenges: ['Dose accuracy and checkweighing', 'Lot coding and labeling', 'Cartoning with inserts'],
    forms: ['powder', 'container'], packages: ['stick-pack', 'sachet', 'container', 'carton'],
  },
  {
    slug: 'cosmetics', name: 'Cosmetics & Personal Care', image: 'packages/spout-pouch.webp',
    intro: 'Creams, gels, soaps and samples come in jars, bottles, sachets and spout pouches. Labeling, capping and cartoning are where automation saves the most time.',
    challenges: ['Labeling jars and bottles of many shapes', 'Sachet samples and spout pouches', 'Retail cartoning'],
    forms: ['liquid', 'container'], packages: ['container', 'sachet', 'spout-pouch', 'carton'],
  },
  {
    slug: 'cannabis', name: 'Cannabis & Hemp', image: 'packages/jar.webp',
    intro: 'Prerolls, flower and edibles are high-value products where fill accuracy and compliant packaging matter. Small-dose weighers, pouch machines and preroll equipment help licensed operators scale.',
    challenges: ['Small, precise fill weights', 'Preroll production', 'Child-resistant pouches and labeled containers'],
    forms: ['cannabis'], packages: ['preroll', 'stand-up-pouch', 'container', 'flow-wrap'],
  },
];
