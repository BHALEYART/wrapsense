// Industry landing pages. Each industry curates the machines that apply to it; the build
// groups them by production stage (weigh & fill → primary packaging → inspection →
// label & cap → secondary / end of line), mirrors them onto product pages as "Industries",
// and drives the machines-page industry filter.
// Applications come from the 2026 catalog and the previous wrapsensepackaging.com product pages.

export const industries = [
  // ─────────────────────────────────────────────
  {
    slug: 'snacks', name: 'Snack Food', short: 'Snack food', image: 'industries/snacks.webp',
    seoTitle: 'Snack Food Packaging Machines', seoDescription: 'Snack food packaging machines for chips, pretzels, popcorn, nuts and jerky: multihead weighers, VFFS baggers, pouch machines, inspection and case packing.',
    intro: 'Chips, pretzels, popcorn, nuts and jerky are light, fragile and sold by weight — a combination that punishes inaccurate filling and rough handling. WrapSense snack lines pair accurate combination weighing with fast baggers and pouch machines, then carry packs through inspection to the case.',
    intro2: 'Whether you’re moving off hand-scooping or adding a second high-speed line, we can match the machines to your bag size, product and output — and test with your product first.',
    examples: ['Potato and tortilla chips', 'Pretzels and popcorn', 'Nuts and trail mix', 'Jerky and meat snacks', 'Crackers and puffed snacks', 'Dried fruit'],
    benefits: [
      ['Less giveaway', 'Multihead weighers combine several weighments to land close to target — even with irregular chips and clusters.'],
      ['Gentle handling', 'Controlled drop heights and feeding help keep fragile product whole.'],
      ['Faster changeovers', 'Recipe memory and quick adjustments make switching flavors and bag sizes faster.'],
      ['More output per shift', 'Continuous-motion baggers reach up to 140 bags per minute.'],
    ],
    stageNotes: {
      dose: 'Snacks are irregular and fragile, so combination (multihead) weighing is the standard. A bucket elevator lifts product gently to the weigher.',
      pack: 'Pillow and gusseted bags run on VFFS baggers; stand-up zipper pouches for jerky and premium snacks run on premade pouch machines.',
      inspect: 'Metal detection and checkweighing protect your customers and show you exactly how much product you’re giving away.',
      finish: 'For jerky and other shelf-sensitive snacks, an oxygen-absorber inserter drops a sachet into each pouch.',
      end: 'Case erecting, packing and sealing remove some of the most repetitive work at the end of a snack line.',
    },
    machines: ['bucket-elevator-conveyor', 'sensiweigh-pro-multihead-weigher', 'sensiweigh-pro-mini', 'fastpack-pro-continuous-motion-vffs', 'fastpack-intermittent-motion-vffs', 'rapidbagger-compact', 'rapidbagger-inline', 'rapidbagger-model-x', 'take-away-exit-conveyor', 'food-metal-detector', 'high-precision-checkweigher', 'oxygen-sachet-inserter', 'casemaster-velocity-ultra-case-erector', 'pickn-pack-casepacker-3', 'casemaster-fastseal-case-sealer', 'casemaster-palletstakr-palletizer', 'custom-printed-packaging-film'],
    typicalLine: ['bucket-elevator-conveyor', 'sensiweigh-pro-multihead-weigher', 'fastpack-pro-continuous-motion-vffs', 'food-metal-detector', 'pickn-pack-casepacker-3', 'casemaster-fastseal-case-sealer'],
    packages: ['pillow-bag', 'gusseted-bag', 'stand-up-pouch'],
    faqs: [
      ['What is the best packaging machine for potato chips?', 'Most chip lines use a multihead weigher on top of a vertical form fill seal (VFFS) bagger. The weigher portions the fragile chips accurately and the VFFS forms, fills and seals pillow bags from rollstock film at high speed.'],
      ['Can I pack jerky in stand-up zipper pouches automatically?', 'Yes. A premade pouch machine such as the RapidBagger opens, fills and seals stand-up zipper pouches, usually fed by a multihead weigher. An oxygen-absorber inserter can be added for shelf life.'],
      ['How do I reduce breakage on a snack line?', 'Reduce drop heights between the weigher and bagger, feed product evenly, and use gentle infeed such as a bucket elevator. Testing with your actual product is the best way to tune it.'],
    ],
  },
  // ─────────────────────────────────────────────
  {
    slug: 'confectionery', name: 'Candy & Confectionery', short: 'Candy & confectionery', image: 'packages/flow-wrap-bag.webp',
    seoTitle: 'Candy & Confectionery Packaging Machines', seoDescription: 'Packaging machines for candy, chocolate, gummies and confections: flow wrappers, multihead weighers, VFFS and pouch machines, cartoners and inspection.',
    intro: 'Candy is sold every way imaginable — individually wrapped bars, bags of gummies, peg-bag assortments, stand-up pouches and retail cartons. WrapSense confectionery equipment covers wrapping single pieces, weighing loose candy into bags and pouches, and boxing finished goods.',
    intro2: 'Sticky gummies, delicate chocolate and hard candy all behave differently, so we size and configure machines around your product — and can test with your samples.',
    examples: ['Chocolate and candy bars', 'Gummies and jellies', 'Hard candy and mints', 'Truffles and pralines', 'Licorice and chews', 'Seasonal assortments'],
    benefits: [
      ['Wrap at high speed', 'Triple-jaw flow wrappers reach up to 350 packs per minute on small items.'],
      ['Accurate bag weights', 'Combination weighing keeps bags of gummies and loose candy close to their declared weight.'],
      ['Retail-ready presentation', 'Consistent seals, stand-up pouches and cartons look good on shelf.'],
      ['Fewer hands on product', 'Automation reduces handling of food-contact product.'],
    ],
    stageNotes: {
      dose: 'Multihead weighers portion loose candy and gummies; dimpled buckets help with sticky products.',
      pack: 'Flow wrappers wrap individual bars and pieces; VFFS and premade pouch machines bag loose candy.',
      end: 'Horizontal cartoners load wrapped bars and multipacks into retail boxes before casing.',
    },
    machines: ['sensiweigh-pro-multihead-weigher', 'sensiweigh-pro-mini', 'triservo-23000-3sp-flow-wrapper', 'triservo-33000-3sp-flow-wrapper', 'fastpack-intermittent-motion-vffs', 'fastpack-pro-continuous-motion-vffs', 'rapidbagger-compact', 'rapidbagger-inline', 'food-metal-detector', 'high-precision-checkweigher', 'cartomate-h-horizontal-cartoner', 'casemaster-velocity-prime-case-erector', 'pickn-pack-casepacker-3', 'casemaster-fastseal-case-sealer', 'custom-printed-packaging-film'],
    typicalLine: ['triservo-23000-3sp-flow-wrapper', 'food-metal-detector', 'cartomate-h-horizontal-cartoner', 'casemaster-velocity-prime-case-erector', 'casemaster-fastseal-case-sealer'],
    packages: ['flow-wrap', 'pillow-bag', 'stand-up-pouch', 'carton'],
    faqs: [
      ['What machine wraps individual candy bars?', 'A horizontal flow wrapper. Bars travel on an infeed conveyor and are wrapped and sealed in a continuous film tube. The TriServo 23000-3SP reaches up to 350 packs per minute on small items.'],
      ['Can a multihead weigher handle sticky gummies?', 'Yes, with the right configuration — for example dimpled or coated contact parts and tuned feeding. Testing with your product confirms the setup.'],
      ['How are candy multipacks boxed?', 'A horizontal cartoner erects folding cartons, loads wrapped pieces or bags, and closes the carton automatically.'],
    ],
  },
  // ─────────────────────────────────────────────
  {
    slug: 'coffee-tea', name: 'Coffee & Tea', short: 'Coffee & tea', image: 'packages/stand-up-pouch.webp',
    seoTitle: 'Coffee & Tea Packaging Machines', seoDescription: 'Coffee and tea packaging machines for whole bean, ground and single-serve: weighers, auger fillers, pouch machines, VFFS baggers and stick pack machines.',
    intro: 'Whole bean, ground, single-serve or loose leaf — coffee and tea packaging is about accurate fills, freshness and a premium look on the shelf. WrapSense helps roasters and tea brands automate everything from 12 oz retail pouches to 5 lb wholesale bags and single-serve sticks.',
    intro2: 'Many roasters start with a compact pouch machine and weigher, then add inspection and end-of-line equipment as wholesale volume grows.',
    examples: ['Whole bean coffee', 'Ground coffee', 'Instant coffee sticks', 'Loose-leaf tea', 'Wholesale and food-service bags', 'Subscription packs'],
    benefits: [
      ['Consistent fill weights', 'Linear and multihead weighers dose beans accurately; augers dose grounds.'],
      ['Premium pouches', 'Stand-up zipper pouches give specialty coffee the shelf presence it deserves.'],
      ['Freshness-focused sealing', 'Reliable seals — with gas-flush options on pouch machines — help protect freshness.'],
      ['Reclaim roasting time', 'Automating packing day frees your team to roast and sell.'],
    ],
    stageNotes: {
      dose: 'Whole beans weigh well on linear or multihead weighers; ground coffee behaves like a powder and is usually dosed with an auger filler.',
      pack: 'Stand-up zipper pouches run on RapidBagger premade pouch machines; gusseted bags run on FastPack VFFS baggers; single-serve sticks run on QuickStick machines.',
    },
    machines: ['bucket-elevator-conveyor', 'sensiweigh-linear-net-weigher', 'sensiweigh-pro-multihead-weigher', 'sensiweigh-pro-mini', 'exactdose-auger-filler', 'rapidbagger-compact', 'rapidbagger-inline', 'rapidbagger-model-x', 'fastpack-intermittent-motion-vffs', 'fastpack-pro-continuous-motion-vffs', 'quickstick-eco', 'quickstick-pro', 'food-metal-detector', 'oxygen-sachet-inserter', 'pickn-pack-casepacker-3', 'casemaster-fastseal-case-sealer', 'custom-printed-packaging-film'],
    typicalLine: ['bucket-elevator-conveyor', 'sensiweigh-linear-net-weigher', 'rapidbagger-compact', 'food-metal-detector', 'casemaster-fastseal-case-sealer'],
    packages: ['stand-up-pouch', 'gusseted-bag', 'stick-pack'],
    faqs: [
      ['What machine do I need to package whole bean coffee?', 'Most roasters pair a weigher — linear for economy or multihead for speed — with a premade pouch machine for stand-up bags or a VFFS bagger for gusseted bags.'],
      ['Can the same line pack whole beans and ground coffee?', 'Often, but ground coffee is usually dosed with an auger filler rather than a weigher. We can configure lines to handle both.'],
      ['Can you package instant coffee in stick packs?', 'Yes. QuickStick machines produce single-serve sticks from one lane up to eight lanes, using auger dosing for powders.'],
    ],
  },
  // ─────────────────────────────────────────────
  {
    slug: 'nutrition', name: 'Protein Powder & Supplements', short: 'Supplements & nutraceuticals', image: 'packages/stick-pack.webp',
    seoTitle: 'Supplement & Protein Powder Packaging Machines', seoDescription: 'Packaging machines for protein powder, supplements and nutraceuticals: auger fillers, stick packs, pouches, capping, labeling, oxygen inserters and cartoning.',
    intro: 'Protein powders, pre-workouts, drink mixes, gummies and capsules are sold in tubs, pouches, bottles and single-serve sticks. Each format needs precise dosing, dust control and clean, compliant labeling. WrapSense supplies the dosing, packaging, container-finishing and cartoning equipment to automate them.',
    intro2: 'Because supplement brands often run many SKUs, we focus on flexible machines and quick changeovers — and can test your powders before you buy.',
    examples: ['Protein and pre-workout powders', 'Electrolyte and drink-mix sticks', 'Gummy vitamins', 'Capsules and tablets in bottles', 'Collagen and greens powders', 'Sample sachets'],
    benefits: [
      ['Accurate powder dosing', 'Servo-driven augers dose free-flowing and non-free-flowing powders consistently.'],
      ['Single-serve growth', 'Stick packs and sachets open up sampling, retail multipacks and on-the-go formats.'],
      ['Finished containers', 'Capping, labeling and oxygen-absorber insertion complete bottles and jars automatically.'],
      ['Traceability', 'Date and lot coding options support recordkeeping.'],
    ],
    stageNotes: {
      dose: 'Auger fillers dose powders into pouches, tubs and stick packs. Multihead weighers handle gummies.',
      pack: 'QuickStick machines make single-serve sticks and sachets; RapidBagger machines fill stand-up pouches.',
      finish: 'For bottles and jars: CapVantage capping, LabelEase labeling and oxygen-absorber or desiccant inserters.',
      end: 'Cartoners box stick-pack multipacks and bottles for retail.',
    },
    machines: ['exactdose-auger-filler', 'sensiweigh-pro-multihead-weigher', 'sensiweigh-pro-mini', 'quickstick-eco', 'quickstick-pro', 'quickstick-pro-xl', 'rapidbagger-compact', 'rapidbagger-inline', 'fastpack-intermittent-motion-vffs', 'high-precision-checkweigher', 'food-metal-detector', 'capvantage-sdl-2-capping-machine', 'oxygen-sachet-inserter', 'labelease-cl2-cylindrical-labeler', 'labelease-combo-fbcl-front-back-labeler', 'cartomate-h-horizontal-cartoner', 'cartomate-v-vertical-cartoner', 'casemaster-fastseal-case-sealer'],
    typicalLine: ['exactdose-auger-filler', 'quickstick-pro', 'high-precision-checkweigher', 'cartomate-h-horizontal-cartoner', 'casemaster-fastseal-case-sealer'],
    packages: ['stick-pack', 'sachet', 'stand-up-pouch', 'container'],
    faqs: [
      ['What is the best way to fill protein powder?', 'A servo-driven auger filler. It meters powder by volume with consistent dosing and keeps dust contained, filling pouches, tubs or stick packs.'],
      ['Can I automate capping and labeling supplement bottles?', 'Yes. A capping machine like the CapVantage SDL-2 and a LabelEase labeler can be combined, with an oxygen-absorber or desiccant inserter if needed.'],
      ['Are stick packs good for supplements?', 'Stick packs are popular for drink mixes, electrolytes and single-serve powders because they are portable, easy to pour and work well in retail multipacks.'],
    ],
  },
  // ─────────────────────────────────────────────
  {
    slug: 'pharmaceutical', name: 'Pharmaceutical & OTC', short: 'Pharmaceutical', image: 'packages/carton.webp',
    seoTitle: 'Pharmaceutical & OTC Packaging Machines', seoDescription: 'Pharmaceutical and OTC packaging equipment: stick packs and sachets, auger fillers, checkweighers, metal detection, capping, labeling and cartoning.',
    intro: 'Pharmaceutical and over-the-counter products demand dose accuracy, inspection and clear labeling — from single-dose powder sachets to bottles and retail cartons. WrapSense supplies stick-pack and sachet machines, powder dosing, checkweighing, bottle finishing and cartoning.',
    intro2: 'We’ll work with your quality team on documentation, materials and inspection requirements for your application.',
    examples: ['Single-dose powder sachets', 'Oral rehydration and electrolyte sticks', 'OTC tablets and capsules in bottles', 'Sample packs', 'Retail cartons with leaflets'],
    benefits: [
      ['Dose consistency', 'Servo augers and checkweighers help keep every dose in tolerance.'],
      ['Automatic rejects', 'Checkweighers and metal detectors remove off-spec packs without stopping the line.'],
      ['Labeling and coding', 'Labelers and date/lot coders support traceability.'],
      ['Cartoning with leaflets', 'Cartoners can be fitted with leaflet inserters.'],
    ],
    stageNotes: {
      pack: 'Single-dose powders and liquids are packed in stick packs and sachets on multi-lane QuickStick machines.',
      inspect: 'A high-precision checkweigher with air reject verifies every stick and sachet.',
      finish: 'Bottled products are capped and labeled, with optional desiccant insertion.',
      end: 'Horizontal and vertical cartoners load sachets, sticks and bottles into retail cartons.',
    },
    machines: ['exactdose-auger-filler', 'quickstick-eco', 'quickstick-pro', 'quickstick-pro-xl', 'high-precision-checkweigher', 'food-metal-detector', 'capvantage-sdl-2-capping-machine', 'oxygen-sachet-inserter', 'labelease-cl2-cylindrical-labeler', 'labelease-combo-fbcl-front-back-labeler', 'cartomate-h-horizontal-cartoner', 'cartomate-v-vertical-cartoner', 'casemaster-fastseal-case-sealer'],
    typicalLine: ['exactdose-auger-filler', 'quickstick-pro', 'high-precision-checkweigher', 'cartomate-h-horizontal-cartoner'],
    packages: ['stick-pack', 'sachet', 'container', 'carton'],
    faqs: [
      ['What machine makes single-dose powder sachets?', 'A stick-pack or sachet machine with an auger filler. QuickStick machines run from one to eight lanes depending on output.'],
      ['How do I verify the weight of every sachet?', 'Add a high-precision checkweigher after the packaging machine. It weighs each pack in motion and rejects any that fall outside your limits.'],
      ['Can a cartoner insert leaflets?', 'Yes — leaflet inserters are an available option on CartoMate cartoners.'],
    ],
  },
  // ─────────────────────────────────────────────
  {
    slug: 'bakery', name: 'Bakery', short: 'Bakery', image: 'packages/flow-wrap.webp',
    seoTitle: 'Bakery Packaging Machines', seoDescription: 'Bakery packaging machines for cookies, muffins, bars, breads and cakes: flow wrappers, inverted wrappers, cake slicers, metal detectors and cartoners.',
    intro: 'Cookies, muffins, brownies, bars, breads and cakes are often soft, delicate and irregular. Flow wrapping protects them individually and extends presentation; the right handling keeps them looking fresh. WrapSense bakery equipment covers slicing, wrapping, inspection and boxing.',
    intro2: 'Soft or loose items often run better on an inverted flow wrapper, where the product rides on the film. We’ll help you choose with your products in hand.',
    examples: ['Cookies and wafers', 'Muffins and snack cakes', 'Brownies and bars', 'Breads and tortillas', 'Layer cakes', 'Donuts and pastries'],
    benefits: [
      ['Individually wrapped', 'Flow wrapping protects each item and makes grab-and-go retail easy.'],
      ['Gentle on soft products', 'Inverted wrappers carry delicate items on the film rather than pushing them.'],
      ['Consistent slicing', 'BakeSense horizontal slicers cut even cake layers with less labor.'],
      ['Food-safety inspection', 'Metal detection after wrapping supports your safety program.'],
    ],
    stageNotes: {
      pack: 'Standard TriServo wrappers handle firm items like cookies and bars; inverted models handle muffins, cakes and soft goods; large-format and reciprocating wrappers handle breads and trays.',
      end: 'Wrapped items go into retail cartons or shipping cases.',
    },
    machines: ['bakesense-horizontal-cake-slicer', 'triservo-23000-3sp-flow-wrapper', 'triservo-33000-3sp-flow-wrapper', 'triservo-63000-3sp-flow-wrapper', 'triservo-inverted-33000-i3sp', 'triservo-inverted-63000-i3sp', 'reciprocating-jaw-flow-wrapper', 'fastpack-intermittent-motion-vffs', 'rapidbagger-sideload', 'food-metal-detector', 'labelease-tbl-top-bottom-labeler', 'cartomate-h-horizontal-cartoner', 'casemaster-velocity-prime-case-erector', 'casemaster-fastseal-case-sealer', 'custom-printed-packaging-film'],
    typicalLine: ['triservo-inverted-33000-i3sp', 'food-metal-detector', 'cartomate-h-horizontal-cartoner', 'casemaster-fastseal-case-sealer'],
    packages: ['flow-wrap', 'pillow-bag', 'carton'],
    faqs: [
      ['What is the best way to wrap muffins individually?', 'An inverted flow wrapper is often the better choice for soft products like muffins, because the product rides on the film instead of being pushed by conveyor flights.'],
      ['Can one flow wrapper handle different bakery items?', 'Yes, within its size range. Recipe memory and an adjustable forming box make changeovers between products faster.'],
      ['Do you have equipment for slicing cakes?', 'Yes — the BakeSense horizontal cake slicer cuts layer cakes with an adjustable-height band saw, with additional saws available.'],
    ],
  },
  // ─────────────────────────────────────────────
  {
    slug: 'frozen-foods', name: 'Frozen Foods', short: 'Frozen foods', image: 'industries/frozen-foods.webp',
    seoTitle: 'Frozen Food Packaging Machines', seoDescription: 'Frozen food packaging machines: multihead weighers, VFFS baggers, pouch machines, inspection and case packing for frozen vegetables, fruit and meals.',
    intro: 'Frozen vegetables, fruit, potato products, dumplings and prepared meals are bagged fast, often in cold and wet conditions. WrapSense frozen food lines combine combination weighing with VFFS baggers or pouch machines, inspection and automated casing.',
    intro2: 'We’ll configure machines for your product size, bag format and environment — including stainless and wash-down options.',
    examples: ['Frozen vegetables and fruit', 'Fries and potato products', 'Dumplings and appetizers', 'Prepared meals', 'Seafood portions', 'Ice'],
    benefits: [
      ['Fast bagging', 'VFFS baggers produce pillow and gusseted bags quickly from rollstock.'],
      ['Accurate weights', 'Multihead weighers handle irregular frozen pieces.'],
      ['Built for the environment', 'Stainless frames and wash-down options for cold, wet rooms.'],
      ['Automated casing', 'Case erectors, packers and sealers reduce cold-room labor.'],
    ],
    stageNotes: {
      dose: 'Bucket elevators feed frozen pieces to a multihead weigher.',
      pack: 'FastPack VFFS baggers make pillow and gusseted bags; RapidBagger machines fill stand-up and side-load pouches.',
    },
    machines: ['bucket-elevator-conveyor', 'sensiweigh-pro-multihead-weigher', 'fastpack-intermittent-motion-vffs', 'fastpack-pro-continuous-motion-vffs', 'rapidbagger-inline', 'rapidbagger-sideload', 'triservo-inverted-33000-i3sp', 'take-away-exit-conveyor', 'food-metal-detector', 'casemaster-velocity-ultra-case-erector', 'casemaster-velocity-turbo-case-erector', 'pickn-pack-casepacker-2', 'casemaster-fastseal-case-sealer', 'casemaster-palletstakr-palletizer'],
    typicalLine: ['bucket-elevator-conveyor', 'sensiweigh-pro-multihead-weigher', 'fastpack-intermittent-motion-vffs', 'food-metal-detector', 'pickn-pack-casepacker-2', 'casemaster-fastseal-case-sealer'],
    packages: ['pillow-bag', 'gusseted-bag', 'stand-up-pouch', 'flat-pouch'],
    faqs: [
      ['What packaging machine is used for frozen vegetables?', 'Frozen vegetables are commonly packed on a VFFS bagger fed by a multihead weigher and bucket elevator.'],
      ['Can packaging machines run in a freezer environment?', 'Machines can be configured for cold, wet environments with appropriate materials. Share your room temperature and sanitation needs so we can specify the equipment.'],
      ['Can you automate casing frozen product?', 'Yes. Case erectors, case packers, sealers and a palletizer can automate the end of the line.'],
    ],
  },
  // ─────────────────────────────────────────────
  {
    slug: 'produce', name: 'Fruit & Vegetables', short: 'Fresh produce', image: 'industries/produce.webp',
    seoTitle: 'Fresh Produce Packaging Machines', seoDescription: 'Fresh produce packaging machines: inverted flow wrappers, weighers, baggers, side-load pouch machines, case erectors and case packers for fruit and vegetables.',
    intro: 'Fresh produce is soft, uneven and perishable, and volumes spike at harvest. Inverted flow wrappers, weighers and case-handling equipment help growers and packers move product quickly without bruising.',
    intro2: 'From wrapped cucumbers and salad kits to bagged baby carrots and boxed shipments, we’ll help you match equipment to your crop and season.',
    examples: ['Wrapped cucumbers and peppers', 'Salad kits and trays', 'Baby carrots and snack vegetables', 'Berries and cut fruit', 'Herbs and greens', 'Shipping cases'],
    benefits: [
      ['Gentle handling', 'Inverted flow wrappers carry soft produce on the film.'],
      ['Peak-season capacity', 'Automation keeps up when harvest volumes spike.'],
      ['Accurate weights', 'Multihead weighers portion irregular produce.'],
      ['End-of-line relief', 'Case erectors and packers reduce manual boxing.'],
    ],
    stageNotes: {
      pack: 'Inverted TriServo wrappers handle loose and soft produce; VFFS and side-load pouch machines bag it.',
      end: 'Case erectors, packers and sealers prepare shipments for the cold chain.',
    },
    machines: ['sensiweigh-pro-multihead-weigher', 'triservo-inverted-33000-i3sp', 'triservo-inverted-63000-i3sp', 'triservo-63000-3sp-flow-wrapper', 'reciprocating-jaw-flow-wrapper', 'fastpack-intermittent-motion-vffs', 'rapidbagger-sideload', 'food-metal-detector', 'labelease-tbl-top-bottom-labeler', 'ws-300-carton-erector', 'casemaster-velocity-ultra-case-erector', 'pickn-pack-casepacker-2', 'casemaster-fastseal-case-sealer'],
    typicalLine: ['triservo-inverted-33000-i3sp', 'labelease-tbl-top-bottom-labeler', 'casemaster-velocity-ultra-case-erector', 'casemaster-fastseal-case-sealer'],
    packages: ['flow-wrap', 'pillow-bag', 'case'],
    faqs: [
      ['How do you flow wrap fresh produce?', 'An inverted flow wrapper is usually best, because the produce rides on the film rather than a flighted conveyor. That handles soft, loose or unstable items more gently.'],
      ['Can I label produce trays automatically?', 'Yes. A top-and-bottom labeler applies labels to trays and container tops.'],
      ['What helps most during harvest peaks?', 'Many packers start by automating wrapping or bagging, then add case erecting and sealing to remove end-of-line bottlenecks.'],
    ],
  },
  // ─────────────────────────────────────────────
  {
    slug: 'pet-food', name: 'Pet Food & Treats', short: 'Pet food', image: 'industries/pet-food.webp',
    seoTitle: 'Pet Food & Treat Packaging Machines', seoDescription: 'Pet food and treat packaging machines: weighers, VFFS baggers, stand-up pouch machines, inspection, case packers and palletizing for kibble and treats.',
    intro: 'Kibble, treats, chews and jerky are sold in everything from small resealable pouches to large bags. Accurate weighing and durable seals matter at every size. WrapSense pet food lines cover weighing, bagging, pouching, inspection and the end of line.',
    intro2: 'Heavy bags and dusty kibble put different demands on equipment than small treat pouches — we size machines for your real product mix.',
    examples: ['Dry kibble', 'Training treats', 'Jerky and chews', 'Freeze-dried food', 'Bulk bags', 'Sample packs'],
    benefits: [
      ['Range of bag sizes', 'From small treat pouches to bulk bags up to 20 kg on linear weighers.'],
      ['Resealable pouches', 'Premade stand-up zipper pouches for premium treats.'],
      ['Durable seals', 'Consistent sealing for heavier fills.'],
      ['Less heavy lifting', 'Case packers and palletizers handle heavy cases.'],
    ],
    stageNotes: {
      dose: 'Linear weighers suit free-flowing kibble economically; multihead weighers handle irregular treats and higher speeds.',
      end: 'CasePacker 2 handles heavier products with a 33 lb payload; PalletStakr stacks cases.',
    },
    machines: ['bucket-elevator-conveyor', 'sensiweigh-linear-net-weigher', 'sensiweigh-pro-multihead-weigher', 'fastpack-intermittent-motion-vffs', 'fastpack-pro-continuous-motion-vffs', 'rapidbagger-compact', 'rapidbagger-inline', 'rapidbagger-model-x', 'food-metal-detector', 'oxygen-sachet-inserter', 'pickn-pack-casepacker-3', 'pickn-pack-casepacker-2', 'casemaster-fastseal-case-sealer', 'casemaster-palletstakr-palletizer'],
    typicalLine: ['bucket-elevator-conveyor', 'sensiweigh-linear-net-weigher', 'fastpack-intermittent-motion-vffs', 'food-metal-detector', 'pickn-pack-casepacker-2', 'casemaster-palletstakr-palletizer'],
    packages: ['stand-up-pouch', 'gusseted-bag', 'pillow-bag'],
    faqs: [
      ['What machine is best for bagging dog kibble?', 'A weigher feeding a VFFS bagger is common for kibble. Linear weighers are economical for free-flowing product; multihead weighers add speed and handle mixed shapes.'],
      ['Can I pack pet treats in resealable pouches?', 'Yes. RapidBagger premade pouch machines open, fill and seal stand-up zipper pouches.'],
      ['Can you handle large bag sizes?', 'SensiWeigh Linear models weigh up to 20 kg. Bag size limits depend on the bagger; tell us your largest SKU.'],
    ],
  },
  // ─────────────────────────────────────────────
  {
    slug: 'spices', name: 'Spices & Seasonings', short: 'Spices & seasonings', image: 'packages/label-cap.webp',
    seoTitle: 'Spice & Seasoning Packaging Machines', seoDescription: 'Spice and seasoning packaging machines: auger fillers, stick packs and sachets, pouch machines, jar capping and labeling, and cartoning.',
    intro: 'Spices and seasonings are fine, dusty powders and granules sold in jars, pouches, sachets and food-service bags. Accurate auger dosing, dust control and clean jar finishing are what matter most. WrapSense supplies equipment from filling through capping, labeling and cartoning.',
    intro2: 'Many spice brands start with a filler and labeler for jars, then add pouch or sachet formats for retail and food service.',
    examples: ['Spice and herb jars', 'Seasoning blends', 'Rubs and marinades mixes', 'Salt and sugar', 'Food-service portion packs', 'Refill pouches'],
    benefits: [
      ['Accurate, dust-controlled filling', 'Servo augers dose fine powders consistently.'],
      ['Finished jars', 'Capping and labeling complete jars without hand work.'],
      ['New formats', 'Sachets and stick packs for single-serve and food service.'],
      ['Retail ready', 'Cartoning for gift sets and multipacks.'],
    ],
    stageNotes: {
      dose: 'ExactDose auger fillers dose powders; linear weighers handle coarse salts and granules.',
      finish: 'CapVantage caps jars and LabelEase labels them — wrap-around or front and back.',
    },
    machines: ['exactdose-auger-filler', 'sensiweigh-linear-net-weigher', 'quickstick-eco', 'quickstick-pro-xl', 'rapidbagger-compact', 'fastpack-intermittent-motion-vffs', 'high-precision-checkweigher', 'capvantage-sdl-2-capping-machine', 'labelease-cl2-cylindrical-labeler', 'labelease-combo-fbcl-front-back-labeler', 'cartomate-v-vertical-cartoner', 'casemaster-fastseal-case-sealer'],
    typicalLine: ['exactdose-auger-filler', 'capvantage-sdl-2-capping-machine', 'labelease-cl2-cylindrical-labeler', 'casemaster-fastseal-case-sealer'],
    packages: ['container', 'stand-up-pouch', 'sachet', 'stick-pack'],
    faqs: [
      ['How do you fill spice jars automatically?', 'An auger filler doses the spice into each jar, then a capping machine and labeler finish it. Conveyors connect the steps into a line.'],
      ['Can you package seasonings in single-serve sachets?', 'Yes. QuickStick machines make stick packs and 3-side-seal sachets with auger dosing for powders.'],
      ['How do you control dust when filling spices?', 'Auger fillers contain the powder in an enclosed hopper and tube; dust control can be added at the discharge point.'],
    ],
  },
  // ─────────────────────────────────────────────
  {
    slug: 'beverage', name: 'Beverage & Drink Mixes', short: 'Beverage & drink mixes', image: 'industries/beverage.webp',
    seoTitle: 'Beverage & Drink Mix Packaging Machines', seoDescription: 'Packaging machines for drink mixes, electrolytes and liquids: stick pack machines, spout pouch machines, bottle capping and labeling, and cartoning.',
    intro: 'Powdered drink mixes, electrolytes, instant coffee, syrups and liquid shots are increasingly sold in single-serve sticks, spout pouches and bottles. WrapSense supplies stick-pack and pouch equipment with the right dosing for powders or liquids, plus capping, labeling and cartoning.',
    intro2: 'Tell us whether your product is a powder or a liquid and the dose size — dosing is configured around it.',
    examples: ['Electrolyte and hydration sticks', 'Powdered drink mixes', 'Instant coffee and tea', 'Syrups and concentrates', 'Liquid shots in spout pouches', 'Bottled beverages'],
    benefits: [
      ['Single-serve formats', 'Stick packs are easy to pour into a bottle and suit retail multipacks.'],
      ['Liquid or powder dosing', 'Auger dosing for powders and pump dosing for liquids.'],
      ['Spout pouches', 'Premade spout pouches for liquids and gels.'],
      ['Bottle finishing', 'Capping and labeling for bottled products.'],
    ],
    stageNotes: {
      pack: 'QuickStick machines produce stick packs at up to 360 per minute; RapidBagger machines fill spout pouches.',
      finish: 'Bottled beverages are capped and labeled with CapVantage and LabelEase equipment.',
    },
    machines: ['exactdose-auger-filler', 'quickstick-eco', 'quickstick-pro', 'quickstick-pro-xl', 'rapidbagger-compact', 'rapidbagger-inline', 'high-precision-checkweigher', 'capvantage-sdl-2-capping-machine', 'labelease-cl2-cylindrical-labeler', 'labelease-combo-fbcl-front-back-labeler', 'cartomate-h-horizontal-cartoner', 'cartomate-v-vertical-cartoner', 'casemaster-fastseal-case-sealer'],
    typicalLine: ['exactdose-auger-filler', 'quickstick-pro', 'high-precision-checkweigher', 'cartomate-h-horizontal-cartoner', 'casemaster-fastseal-case-sealer'],
    packages: ['stick-pack', 'sachet', 'spout-pouch', 'container'],
    faqs: [
      ['What machine packages drink mix stick packs?', 'A multi-lane stick pack machine with an auger filler. QuickStick machines run from 1 lane (up to 50 per minute) to 8 lanes (up to 360 per minute).'],
      ['Can stick pack machines fill liquids?', 'Yes, with pump dosing. Liquids, gels and syrups can be packed in sticks and sachets.'],
      ['How are liquids packed in pouches?', 'Spout pouches are filled and sealed on a premade pouch machine configured with a liquid filler.'],
    ],
  },
  // ─────────────────────────────────────────────
  {
    slug: 'cosmetics', name: 'Cosmetics & Personal Care', short: 'Cosmetics & personal care', image: 'products/labelease-combo-fbcl.webp',
    seoTitle: 'Cosmetics & Personal Care Packaging Machines', seoDescription: 'Cosmetics and personal care packaging equipment: bottle and jar labeling, capping, sachet samples, spout pouches, flow wrapping and cartoning.',
    intro: 'Creams, serums, shampoos, soaps and samples come in jars, bottles, tubes, sachets and boxes — often in short runs with many SKUs. Labeling, capping and cartoning are where automation saves the most time. WrapSense supplies equipment for finishing containers, making samples and boxing retail products.',
    intro2: 'Brand presentation matters in beauty, so precise label placement and clean cartons are a focus.',
    examples: ['Cream and lotion jars', 'Shampoo and body-wash bottles', 'Serum bottles', 'Sample sachets', 'Bar soap', 'Gift sets and retail cartons'],
    benefits: [
      ['Precise labeling', 'Front, back and wrap-around labels on many container shapes.'],
      ['Consistent capping', 'Automatic capping applies consistent torque.'],
      ['Samples at scale', 'Sachet machines produce trial-size samples.'],
      ['Retail cartons', 'Vertical cartoners box bottles and jars.'],
    ],
    stageNotes: {
      pack: 'Bar soap and individual items are flow wrapped; samples are made as sachets.',
      finish: 'LabelEase labelers and CapVantage cappers finish bottles and jars.',
      end: 'CartoMate-V loads bottles and jars into retail cartons.',
    },
    machines: ['quickstick-eco', 'quickstick-pro-xl', 'rapidbagger-compact', 'triservo-23000-3sp-flow-wrapper', 'triservo-33000-3sp-flow-wrapper', 'reciprocating-jaw-flow-wrapper', 'capvantage-sdl-2-capping-machine', 'labelease-cl2-cylindrical-labeler', 'labelease-combo-fbcl-front-back-labeler', 'labelease-tbl-top-bottom-labeler', 'cartomate-h-horizontal-cartoner', 'cartomate-v-vertical-cartoner', 'casemaster-fastseal-case-sealer'],
    typicalLine: ['capvantage-sdl-2-capping-machine', 'labelease-combo-fbcl-front-back-labeler', 'cartomate-v-vertical-cartoner', 'casemaster-fastseal-case-sealer'],
    packages: ['container', 'sachet', 'spout-pouch', 'carton', 'flow-wrap'],
    faqs: [
      ['What labeler is best for cosmetic bottles?', 'It depends on shape. Round bottles use a wrap-around labeler like the LabelEase CL2; square or oval bottles that need front and back labels use the LabelEase Combo FBCL.'],
      ['Can I make cosmetic sample sachets in-house?', 'Yes. A sachet machine with liquid dosing produces trial-size samples of creams and serums.'],
      ['How do I box bottles automatically?', 'A vertical cartoner loads upright bottles and jars into folding cartons.'],
    ],
  },
  // ─────────────────────────────────────────────
  {
    slug: 'cannabis', name: 'Cannabis & Hemp', short: 'Cannabis & hemp', image: 'packages/jar.webp',
    seoTitle: 'Cannabis Packaging Machines', seoDescription: 'Cannabis and hemp packaging machines: preroll filling, small-dose weighers, child-resistant pouch filling, flow wrapping, labeling and capping.',
    intro: 'Prerolls, flower, edibles and concentrates are high-value products where fill accuracy and compliant, labeled packaging matter. WrapSense equipment helps licensed operators scale — from preroll filling and small-dose weighing to pouch filling, wrapping, labeling and capping.',
    intro2: 'Packaging and labeling requirements vary by state; we’ll configure equipment around your formats and your compliance team’s requirements.',
    examples: ['Prerolls', 'Flower in jars and pouches', 'Gummies and edibles', 'Chocolate bars', 'Vape cartridges in cartons', 'Hemp and CBD products'],
    benefits: [
      ['Precise small doses', 'The SensiWeigh Pro Mini weighs doses from 2 g.'],
      ['Preroll automation', 'Automatic preroll machines weigh, fill and close cones.'],
      ['Pouch and jar filling', 'Child-resistant pouches and jars filled consistently.'],
      ['Labeled and sealed', 'Labeling and capping finish containers for retail.'],
    ],
    stageNotes: {
      dose: 'Small-dose multihead weighers portion flower and edibles accurately.',
      pack: 'Preroll machines fill cones; RapidBagger fills child-resistant pouches; TriServo wraps edibles and bars.',
      finish: 'Containers are capped and labeled; oxygen absorbers can be inserted for freshness.',
    },
    machines: ['sensiweigh-pro-mini', 'sensiweigh-pro-multihead-weigher', 'automatic-preroll-cone-filling-machine', 'rapidbagger-compact', 'rapidbagger-inline', 'fastpack-intermittent-motion-vffs', 'triservo-23000-3sp-flow-wrapper', 'triservo-33000-3sp-flow-wrapper', 'high-precision-checkweigher', 'oxygen-sachet-inserter', 'capvantage-sdl-2-capping-machine', 'labelease-cl2-cylindrical-labeler', 'labelease-tbl-top-bottom-labeler', 'cartomate-h-horizontal-cartoner', 'custom-printed-packaging-film'],
    typicalLine: ['sensiweigh-pro-mini', 'rapidbagger-compact', 'high-precision-checkweigher', 'labelease-tbl-top-bottom-labeler'],
    packages: ['preroll', 'stand-up-pouch', 'container', 'flow-wrap'],
    faqs: [
      ['How do I automate preroll production?', 'An automatic preroll machine weighs, fills and closes cones in one process. Configuration depends on cone size and output.'],
      ['What weigher is accurate enough for cannabis flower?', 'A small-bucket multihead weigher like the SensiWeigh Pro Mini handles doses from 2 g to 200 g.'],
      ['Can you fill child-resistant pouches?', 'Yes. Premade pouch machines fill and seal child-resistant pouch styles; confirm your pouch specifications with us.'],
    ],
  },
  // ─────────────────────────────────────────────
  {
    slug: 'hardware', name: 'Hardware & Non-Food', short: 'Hardware & non-food', image: 'industries/hardware.webp',
    seoTitle: 'Hardware & Non-Food Packaging Machines', seoDescription: 'Packaging machines for hardware, small parts and non-food products: count and weigh fillers, VFFS baggers, flow wrappers, case erecting and sealing.',
    intro: 'Screws, fasteners, small parts, masks, air fresheners, cleaning products and household goods all benefit from the same automation as food. WrapSense weighers, baggers, flow wrappers, labelers and end-of-line equipment adapt well to non-food products.',
    intro2: 'If you’re packing by hand or by count today, we can recommend equipment and test with your parts.',
    examples: ['Screws, nuts and fasteners', 'Small parts kits', 'Face masks', 'Air fresheners', 'Cleaning products', 'Promotional items'],
    benefits: [
      ['Accurate by weight', 'Multihead weighers portion small parts by weight.'],
      ['Clean retail packs', 'Pillow bags, hole-punch bags and flow wraps for pegboard and shelf.'],
      ['Labeling', 'Labels and codes for SKUs and lots.'],
      ['End of line', 'Erecting and sealing cases for distribution.'],
    ],
    stageNotes: {
      pack: 'VFFS baggers with hole-punch options make pegboard bags; flow wrappers wrap individual items.',
    },
    machines: ['sensiweigh-pro-multihead-weigher', 'sensiweigh-linear-net-weigher', 'fastpack-intermittent-motion-vffs', 'rapidbagger-sideload', 'triservo-33000-3sp-flow-wrapper', 'triservo-63000-3sp-flow-wrapper', 'reciprocating-jaw-flow-wrapper', 'labelease-combo-fbcl-front-back-labeler', 'labelease-tbl-top-bottom-labeler', 'cartomate-h-horizontal-cartoner', 'ws-300-carton-erector', 'casemaster-velocity-prime-case-erector', 'casemaster-fastseal-case-sealer'],
    typicalLine: ['sensiweigh-pro-multihead-weigher', 'fastpack-intermittent-motion-vffs', 'casemaster-velocity-prime-case-erector', 'casemaster-fastseal-case-sealer'],
    packages: ['pillow-bag', 'flow-wrap', 'carton', 'case'],
    faqs: [
      ['Can a multihead weigher package screws and small parts?', 'Yes — multihead weighers are used for hardware and small parts. Product shape and abrasion affect configuration, so testing with your parts is recommended.'],
      ['Can a VFFS bagger make hang-tab bags?', 'Yes, with the optional hole-punch sealing jaw.'],
      ['Do flow wrappers work for non-food items?', 'Yes. Masks, air fresheners, soap and many household items are flow wrapped.'],
    ],
  },
];
