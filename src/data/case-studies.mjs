// Case studies. Body copy uses the blog's link syntax: [text](p:product-slug), [text](c:category-slug), [text](i:industry-slug).
//
// DRAFTS: `draft: true` entries are built on local and Vercel preview builds only (with a visible
// "placeholder" banner and noindex). They are left out of production builds entirely — no pages,
// no links, no sitemap or search entries — until the client supplies a real customer, real numbers
// and approval to publish. Then replace the copy and delete `draft: true`.
//
// The three below come from the client's prototype (wrapsense-client/app/content-data.js), whose
// own note says: "customer names, numbers and quotes are illustrative. Replace before publishing."

export const caseStudies = [
  {
    slug: 'snack-copacker-trail-mix-giveaway',
    seoTitle: 'Trail-Mix Line Cuts Giveaway to 0.9% | Case Study',
    draft: true,
    client: 'Ridgeline Snack Co.',
    location: 'Lancaster, PA',
    industry: 'snacks',
    title: 'Cutting giveaway from 4.2% to 0.9% on a trail-mix line',
    summary: 'A regional co-packer swapped volumetric cups for a weigher-over-bagger line and paid it back in 11 months.',
    image: 'photos/weigher-snacks.webp',
    products: ['sensiweigh-pro-multihead-weigher', 'fastpack-intermittent-motion-vffs', 'casemaster-velocity-prime-case-erector'],
    product: 'Trail mix, 8–16 oz pillow bags',
    installed: '6 weeks, PO to production',
    stats: [
      { label: 'Product giveaway', before: '4.2%', after: '0.9%' },
      { label: 'Bags per minute', before: '45', after: '70' },
      { label: 'Payback', before: '', after: '11 mo' },
    ],
    challenge: `Ridgeline ran three SKUs of trail mix through a volumetric cup filler. Nuts and dried fruit settle differently, so the cups were set high to stay legal on weight — almost a quarter-ounce of free product in every bag. (Here's [why giveaway adds up so fast](/blog/reduce-product-giveaway/).)

The bagger was also near end of life. Two unplanned stops a week were normal.`,
    solution: `We paired a 14-head [SensiWeigh multihead weigher](p:sensiweigh-pro-multihead-weigher) with a [FastPack VFFS bagger](p:fastpack-intermittent-motion-vffs) on a shared mezzanine, then added a [CaseMaster case erector](p:casemaster-velocity-prime-case-erector) at the end of the line so one operator could run the whole cell.

Recipes for all three SKUs were loaded before shipping, and we ran their product at our facility before the line left the building.`,
    result: `Giveaway dropped to under 1% in the first week. Speed went from 45 to 70 bags per minute on the same film.

The line paid for itself in 11 months on product savings alone. See more [snack packaging lines](i:snacks).`,
    quote: { text: 'We figured we’d need a year to dial it in. It was running clean in a week.', name: 'Plant Manager', role: 'Ridgeline Snack Co.' },
  },
  {
    slug: 'supplement-stick-packs-in-house',
    seoTitle: 'In-House Stick Pack Line for Supplements | Case Study',
    draft: true,
    client: 'Northfield Nutrition',
    location: 'Boise, ID',
    industry: 'nutrition',
    title: 'Bringing stick-pack production in-house',
    summary: 'A growing electrolyte brand stopped paying a co-packer and started running its own 4-lane stick line.',
    image: 'products/quickstick-pro.webp',
    products: ['quickstick-pro', 'exactdose-auger-filler', 'cartomate-h-horizontal-cartoner'],
    product: 'Electrolyte powder, 7 g stick packs, 20-count cartons',
    installed: '8 weeks, PO to production',
    stats: [
      { label: 'Sticks per minute', before: '0', after: '240' },
      { label: 'Cost per stick', before: '$0.11', after: '$0.04' },
      { label: 'Co-packer lead time', before: '9 wk', after: 'None' },
    ],
    challenge: `Northfield's co-packer had a nine-week queue. Every flavor launch waited in line, and margins shrank as volume grew.

The team had never run packaging equipment. They needed something an operator could learn in a day.`,
    solution: `We specified a 4-lane [QuickStick Pro](p:quickstick-pro) with [auger fillers](p:exactdose-auger-filler) for fine powder, feeding a [CartoMate horizontal cartoner](p:cartomate-h-horizontal-cartoner) that counts and cartons 20 sticks per box. (Weighing up [stick packs vs. sachets](/blog/stick-packs-vs-sachets/)?)

We trained two operators on site, left a spare-parts kit, and set up remote support on the HMI.`,
    result: `Northfield now runs 240 sticks per minute on one shift. Per-stick cost dropped by roughly two-thirds.

New flavors go from formula to shelf in under three weeks. More on [supplement packaging](i:nutrition).`,
    quote: { text: 'Our operators had never touched a packaging machine. They were running it alone by day two.', name: 'Director of Operations', role: 'Northfield Nutrition' },
  },
  {
    slug: 'coffee-roaster-retail-pouches',
    seoTitle: 'Coffee Roaster Automates Retail Pouches | Case Study',
    draft: true,
    client: 'Harbor Point Roasters',
    location: 'Portland, ME',
    industry: 'coffee-tea',
    title: 'From six hand-fillers to two operators on retail pouches',
    summary: 'A specialty roaster automated valved stand-up pouches without giving up its small-batch SKU mix.',
    image: 'products/rapidbagger-inline.webp',
    products: ['rapidbagger-inline', 'labelease-combo-fbcl-front-back-labeler'],
    product: 'Whole-bean coffee, 12 oz stand-up pouches with one-way valve',
    installed: '5 weeks, PO to production',
    stats: [
      { label: 'Operators per shift', before: '6', after: '2' },
      { label: 'Pouches per minute', before: '12', after: '40' },
      { label: 'Changeover', before: '', after: '< 10 min' },
    ],
    challenge: `Harbor Point hand-filled and heat-sealed every retail bag. Holiday volume meant overtime and temp labor every year.

They run 22 SKUs in small batches, so any machine had to change over fast.`,
    solution: `We installed a [RapidBagger Inline](p:rapidbagger-inline) [premade pouch machine](c:premade-pouch-machines) with a valve applicator and nitrogen flush, followed by a [LabelEase front-back labeler](p:labelease-combo-fbcl-front-back-labeler). (See our [coffee packaging machine guide](/blog/coffee-packaging-machines-guide/).)

Pouch width changes are tool-free, and recipes live on the HMI by SKU.`,
    result: `Two operators now do the work of six. The line runs 40 pouches per minute and changes SKUs in under ten minutes.

The holiday rush ran on a normal schedule for the first time. More on [coffee & tea packaging](i:coffee-tea).`,
    quote: { text: 'It didn’t change how we roast. It changed how we go home at night.', name: 'Owner', role: 'Harbor Point Roasters' },
  },
];

// Drafts build locally and on Vercel previews; production (VERCEL_ENV=production) leaves them out.
// Force either way with SHOW_DRAFTS=1 / SHOW_DRAFTS=0.
export const SHOW_DRAFTS = process.env.SHOW_DRAFTS ? process.env.SHOW_DRAFTS === '1' : process.env.VERCEL_ENV !== 'production';
export const visibleCaseStudies = caseStudies.filter((c) => SHOW_DRAFTS || !c.draft);
