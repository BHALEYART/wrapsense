// Images that exist only on the current WordPress site (not in the 2026 catalog).
// Run `npm run fetch-images` BEFORE pointing the domain at the new site: once the old
// WordPress install is gone, these remote URLs stop working. The build prefers local copies
// in src/assets/img/legacy/ and warns about any it still has to hotlink.
const WP = 'https://www.wrapsensepackaging.com/wp-content/uploads';

export const legacyImages = {
  'checkweigher': { src: `${WP}/2019/09/Checkweigher.jpg`, file: 'checkweigher.jpg', w: 1000, h: 812, alt: 'WrapSense high-precision checkweigher with air reject' },
  'metal-detector': { src: `${WP}/2019/09/WrapSense-High-Quality-Food-Metal-Detector-w-After-Sales-Service.jpg`, file: 'metal-detector.jpg', w: 1000, h: 1000, alt: 'WrapSense food metal detector with conveyor' },
  'take-away-conveyor': { src: `${WP}/2020/05/Take-Away-Conveyor.jpg`, file: 'take-away-conveyor.jpg', w: 1000, h: 1000, alt: 'Stainless steel take-away exit conveyor' },
  'bucket-elevator': { src: `${WP}/2020/05/bucket-elevator.png`, file: 'bucket-elevator.png', w: 880, h: 1000, alt: 'Stainless steel bucket elevator with food-grade buckets' },
  'preroll': { src: `${WP}/2020/05/Automatic-Preroll-Cone-Machine-scaled.jpg`, file: 'preroll-cone-machine.jpg', w: 1000, h: 1000, alt: 'Automatic preroll cone filling and sealing machine' },
  'bakesense': { src: `${WP}/2019/09/BakeSense-Horizontal-Cake-CuttingSlicer-Machine-for-Layer-Cakes-copy.jpg`, file: 'bakesense-cake-slicer.jpg', w: 1000, h: 1000, alt: 'BakeSense horizontal cake slicer with band saw' },
  'ws-300': { src: `${WP}/2019/09/Carton-Erector-Taper-w-Carton-SealerTaper-e1591028499167.jpeg`, file: 'ws-300-carton-erector.jpg', w: 1000, h: 357, alt: 'WS-300 automatic carton erector with case sealer' },
  'carton-sealer': { src: `${WP}/2020/05/CartonBox-Taping-Machine.jpg`, file: 'carton-sealer.jpg', w: 1000, h: 833, alt: 'Automatic carton and box taping machine' },
  'reciprocating': { src: `${WP}/2020/05/reciprocating-flow-wrapper.jpg`, file: 'reciprocating-flow-wrapper.jpg', w: 1000, h: 1000, alt: 'Servo-driven reciprocating-jaw horizontal flow wrapper' },
  'inverted': { src: `${WP}/2020/05/inverted-flow-wrapper.jpg`, file: 'inverted-flow-wrapper.jpg', w: 1000, h: 1000, alt: 'Servo-driven inverted flow wrapper' },
  'vffs': { src: `${WP}/2020/05/VFFS-400_500_600.jpg`, file: 'vffs-fastpack.jpg', w: 1000, h: 1000, alt: 'FastPack vertical form fill and seal machine' },
  'multihead': { src: `${WP}/2020/05/10-head-multihead-weigher.jpg`, file: 'multihead-weigher.jpg', w: 1000, h: 1000, alt: 'Multihead combination weigher' },
  'film-1': { src: `${WP}/2019/02/custom-field-one.jpg`, file: 'film-1.jpg', w: 600, h: 600, alt: 'Custom printed flexible packaging film' },
  'film-2': { src: `${WP}/2019/02/custom-field-two.jpg`, file: 'film-2.jpg', w: 600, h: 600, alt: 'Custom printed packaging film rolls' },
  'film-3': { src: `${WP}/2019/02/custom-field-three.jpg`, file: 'film-3.jpg', w: 600, h: 600, alt: 'Printed flexible packaging' },
  'film-4': { src: `${WP}/2019/02/custom-field-four.jpg`, file: 'film-4.jpg', w: 600, h: 600, alt: 'Custom packaging film samples' },
};
