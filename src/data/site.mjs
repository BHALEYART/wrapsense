// Global site configuration. Contact details reused from the existing site and 2026 catalog.
export const site = {
  name: 'WrapSense Packaging',
  legalName: 'Wrapsense Packaging',
  url: 'https://www.wrapsensepackaging.com',
  tagline: 'Turn-key packaging solutions for small & medium-size enterprises',
  values: ['Value', 'Quality', 'Service'],
  phone: '301-200-0048',
  phoneHref: 'tel:+13012000048',
  email: 'sales@wrapsensepackaging.com',
  privacyEmail: 'chris@wrapsensepackaging.com',
  address: {
    street: '7928 Queenair Dr',
    city: 'Gaithersburg',
    region: 'MD',
    postal: '20879',
    country: 'US',
  },
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=7928+Queenair+Dr+Gaithersburg+MD+20879',
  catalogPdf: '/assets/docs/WrapSense-Catalog-2026.pdf',
  // Optional analytics. Leave blank to load nothing. Example: 'GTM-XXXXXXX'
  gtmId: '',
  // HubSpot tracking code (portal / Hub ID). Can also be set with the HUBSPOT_PORTAL_ID env var at build time.
  // Loading it lets HubSpot attach page views and traffic source to each quote request.
  hubspotPortalId: '',
  // Where finished leads are posted. See README → "Lead delivery".
  leadEndpoint: '/api/lead',
};

// Line stages drive the machine navigation, the finder and the "build your line" diagrams.
export const stages = [
  { id: 'feed', name: 'Feed & convey', short: 'Feed', blurb: 'Lift and move product into your line and finished packs out of it.' },
  { id: 'dose', name: 'Weigh & fill', short: 'Weigh & fill', blurb: 'Portion product accurately by weight, volume or count.' },
  { id: 'pack', name: 'Form & seal', short: 'Pack', blurb: 'Bag, pouch, stick-pack or flow-wrap your product.' },
  { id: 'inspect', name: 'Inspect', short: 'Inspect', blurb: 'Catch metal contamination and off-weight packs before they ship.' },
  { id: 'finish', name: 'Label & cap', short: 'Label & cap', blurb: 'Cap, label and insert for jars, bottles and containers.' },
  { id: 'end', name: 'End of line', short: 'End of line', blurb: 'Carton, case, seal and palletize finished goods.' },
  { id: 'specialty', name: 'Specialty & materials', short: 'Specialty', blurb: 'Custom machines, specialty processes and printed film.' },
];

// Product forms: step 1 of the machine finder ("What are you packaging?")
export const forms = [
  { id: 'powder', name: 'Powders', examples: 'Protein, spices, coffee grounds, flour, drink mixes', icon: 'powder', color: '#c2410c' },
  { id: 'granular', name: 'Granules & free-flowing', examples: 'Coffee beans, rice, seeds, nuts, pet kibble', icon: 'granular', color: '#1d7a48' },
  { id: 'snacks', name: 'Snacks & irregular pieces', examples: 'Chips, jerky, candy, gummies, frozen pieces', icon: 'snacks', color: '#1a73c9' },
  { id: 'solid', name: 'Single solid items', examples: 'Bars, cookies, baked goods, produce, soap', icon: 'solid', color: '#0f7f74' },
  { id: 'liquid', name: 'Liquids & pastes', examples: 'Sauces, gels, oils, honey, liquid supplements', icon: 'liquid', color: '#7a3fc0' },
  { id: 'container', name: 'Jars & bottles', examples: 'Filled jars, bottles and tubs that need caps, labels or cartons', icon: 'container', color: '#3d4fb8' },
  { id: 'cannabis', name: 'Cannabis & prerolls', examples: 'Prerolls, flower, edibles', icon: 'cannabis', color: '#b0237a' },
  { id: 'cases', name: 'Finished packs', examples: 'Bags, pouches or boxes that need cartoning, casing or palletizing', icon: 'cases', color: '#a85d00' },
];

// Package formats: step 2 of the finder
export const packages = [
  { id: 'pillow-bag', name: 'Pillow bag', note: 'Classic chip-style bag', image: 'packages/pillow-bag.webp', category: 'vertical-form-fill-seal' },
  { id: 'gusseted-bag', name: 'Gusseted bag', note: 'Stands up with side or bottom gussets', image: 'packages/weigh-fill.webp', category: 'vertical-form-fill-seal' },
  { id: 'stick-pack', name: 'Stick pack', note: 'Single-serve narrow tube', image: 'packages/stick-pack.webp', category: 'stick-pack-sachet-machines' },
  { id: 'sachet', name: 'Sachet / 3-side seal', note: 'Flat single-serve packet', image: 'packages/sachet.webp', category: 'stick-pack-sachet-machines' },
  { id: 'stand-up-pouch', name: 'Stand-up / zipper pouch', note: 'Premade retail pouch', image: 'packages/stand-up-pouch.webp', category: 'premade-pouch-machines' },
  { id: 'flat-pouch', name: 'Flat pouch', note: 'Premade lay-flat pouch', image: 'packages/flat-pouch.webp', category: 'premade-pouch-machines' },
  { id: 'spout-pouch', name: 'Spout / shaped pouch', note: 'For liquids, gels and pastes', image: 'packages/spout-pouch.webp', category: 'premade-pouch-machines' },
  { id: 'flow-wrap', name: 'Flow wrap', note: 'Wrapped bars, baked goods, single items', image: 'packages/flow-wrap-bag.webp', category: 'flow-wrappers' },
  { id: 'container', name: 'Jar / bottle', note: 'Caps, labels and inserts', image: 'packages/label-cap.webp', category: 'labeling-machines' },
  { id: 'carton', name: 'Folding carton', note: 'Retail boxes', image: 'packages/carton.webp', category: 'cartoning-machines' },
  { id: 'case', name: 'Shipping case', note: 'Corrugated cases, erected and sealed', image: 'packages/case-erect.webp', category: 'case-erectors-sealers' },
  { id: 'pallet', name: 'Pallet', note: 'Stacked, ready for freight', image: 'packages/pallet.webp', category: 'case-erectors-sealers' },
  { id: 'preroll', name: 'Preroll cone', note: 'Filled and closed cones', image: null, category: 'specialty-machines' },
];

export const speedBands = [
  { id: 's1', name: 'Up to 20 per minute', note: 'Starting out or replacing hand packing', min: 0, max: 20 },
  { id: 's2', name: '20–60 per minute', note: 'Growing brand, single shift', min: 20, max: 60 },
  { id: 's3', name: '60–150 per minute', note: 'High volume or co-packing', min: 60, max: 150 },
  { id: 's4', name: '150+ per minute', note: 'Multi-lane, high-speed lines', min: 150, max: 1000 },
  { id: 'any', name: 'Not sure yet', note: 'We’ll help you size it', min: 0, max: 1000 },
];

// "Also automate" add-ons: step 4 of the finder. Each maps to categories.
export const addons = [
  { id: 'feed', name: 'Feeding & conveying', categories: ['conveyors-elevators'] },
  { id: 'dose', name: 'Weighing & filling', categories: ['weighing-filling'] },
  { id: 'inspect', name: 'Metal detection & checkweighing', categories: ['metal-detectors-checkweighers'] },
  { id: 'finish', name: 'Labeling, capping & inserts', categories: ['labeling-machines', 'capping-auxiliary'] },
  { id: 'carton', name: 'Cartoning', categories: ['cartoning-machines'] },
  { id: 'case', name: 'Case erecting & sealing', categories: ['case-erectors-sealers'], products: ['casemaster-velocity-prime-case-erector', 'casemaster-velocity-ultra-case-erector', 'casemaster-velocity-turbo-case-erector', 'casemaster-fastseal-case-sealer', 'ws-300-carton-erector'] },
  { id: 'casepack', name: 'Case packing', categories: ['case-packing'] },
  { id: 'pallet', name: 'Palletizing', categories: [], products: ['casemaster-palletstakr-palletizer'] },
];

export const process = [
  { name: 'Consult', text: 'We set up a consultation to make sure we fully understand your project needs.' },
  { name: 'Advise', text: 'We recommend the right machine for your product, package and output.' },
  { name: 'Assess', text: 'We review every project specification and confirm what we will deliver.' },
  { name: 'Plan', text: 'Together we map out a complete packaging solution for your line.' },
  { name: 'Manufacture', text: 'Your machine is built standard or fully customized — whichever fits the project.' },
  { name: 'Construct', text: 'Once the design is approved, we build your packaging machine.' },
  { name: 'Test', text: 'We run the machine with your packaging samples and troubleshoot before it ships.' },
  { name: 'Deliver', text: 'After it passes testing and you approve it, the machine ships.' },
  { name: 'Support', text: 'A dedicated service tech supports you after installation.' },
];

export const services = [
  {
    id: 'setup',
    name: 'Set-up & installation',
    text: 'Our service technicians assemble every component, check electrical and pneumatic connections, and make adjustments during the first run so the machine runs smoothly.',
  },
  {
    id: 'training',
    name: 'Training & operation',
    text: 'We walk your staff through operation, changeovers and troubleshooting, and can run live production alongside your team until they are comfortable running it on their own.',
  },
  {
    id: 'maintenance',
    name: 'Preventive maintenance',
    text: 'Field service technicians review maintenance and sanitation requirements with you to help keep equipment and components running longer with less downtime.',
  },
  {
    id: 'custom',
    name: 'Custom machines',
    text: 'If a standard machine doesn’t fit, we modify equipment or design a custom build around the product you need to package.',
  },
  {
    id: 'procurement',
    name: 'Procurement & line integration',
    text: 'We source machines and automation that fit your current needs and your growth, then integrate them into one working line.',
  },
  {
    id: 'testing',
    name: 'Product testing',
    text: 'Send us your product and packaging. We can set up testing on our machines and discuss your application before you commit.',
  },
];

// Homepage hero copy. Christopher is finalizing this; edit here and rebuild.
export const hero = {
  eyebrow: 'Packaging machinery · Gaithersburg, Maryland',
  title: 'Packaging machines,',
  highlight: 'matched to your product.',
  lead: 'Turn-key machines and complete lines for small and medium-size businesses — built on value, quality and service.',
  promptLabel: 'What are you packaging?',
  promptPlaceholder: 'e.g. 150 bags/min of snack chips',
};

// Equipment financing. Add the partner's application URL when it's confirmed;
// until then "Apply" buttons go to the quote form with financing selected.
export const financing = {
  partner: '',            // e.g. 'American Packaging Capital'
  applyUrl: '',           // the partner's online application link
};
