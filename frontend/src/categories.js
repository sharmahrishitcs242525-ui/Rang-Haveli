// Every kind of product the shop sells. Keep in sync with backend/config/categories.js
// fabric: show "Fabric" (true) or "Material" (false) in forms
// sizes: sizes offered for the category (empty = one size)
// sample: used for the collection tiles on the home page

const FABRIC_PATTERNS = ['bandhani', 'leheriya', 'kota', 'blockprint', 'gotapatti', 'plain'];

export const CATEGORIES = [
  {
    slug: 'sarees', label: 'Sarees', fabric: true, sizes: [], sizeLabel: '',
    patterns: FABRIC_PATTERNS,
    crafts: ['Bandhani', 'Leheriya', 'Kota Doria', 'Block Print', 'Gota Patti'],
    sample: { pattern: 'bandhani', colors: ['#B5122E', '#EBA21C', '#F6E7C1'] },
  },
  {
    slug: 'bangles', label: 'Bangles', fabric: false, sizes: ['2.2', '2.4', '2.6', '2.8'], sizeLabel: 'Bangle size (inches)',
    patterns: ['lac', 'meenakari', 'kundan', 'glass'],
    crafts: ['Lac', 'Meenakari', 'Kundan', 'Glass'],
    sample: { pattern: 'lac', colors: ['#A8142F', '#EBA21C', '#1B7B5A'] },
  },
  {
    slug: 'earrings', label: 'Earrings', fabric: false, sizes: [], sizeLabel: '',
    patterns: ['jhumka', 'chandbali', 'stud'],
    crafts: ['Kundan', 'Meenakari', 'Lac', 'Oxidised silver', 'Thewa'],
    sample: { pattern: 'jhumka', colors: ['#D9A93A', '#1B7B5A', '#F6E7C1'] },
  },
  {
    slug: 'necklaces', label: 'Necklaces', fabric: false, sizes: [], sizeLabel: '',
    patterns: ['choker'],
    crafts: ['Kundan', 'Meenakari', 'Silver'],
    sample: { pattern: 'choker', colors: ['#D9A93A', '#1B7B5A', '#A8142F'] },
  },
  {
    slug: 'dupattas', label: 'Dupattas', fabric: true, sizes: [], sizeLabel: '',
    patterns: FABRIC_PATTERNS,
    crafts: ['Bandhani', 'Leheriya', 'Gota Patti', 'Block Print'],
    sample: { pattern: 'leheriya', colors: ['#D63A7B', '#EBA21C', '#1B7B5A'] },
  },
  {
    slug: 'lehengas', label: 'Lehengas', fabric: true, sizes: ['S', 'M', 'L', 'XL'], sizeLabel: 'Size',
    patterns: FABRIC_PATTERNS,
    crafts: ['Bandhani', 'Gota Patti', 'Block Print'],
    sample: { pattern: 'bandhani', colors: ['#D9531E', '#6A1B4D', '#EBA21C'] },
  },
  {
    slug: 'juttis', label: 'Juttis', fabric: false, sizes: ['5', '6', '7', '8', '9'], sizeLabel: 'Shoe size (India)',
    patterns: ['mojari'],
    crafts: ['Mojari'],
    sample: { pattern: 'mojari', colors: ['#A8142F', '#EBA21C', '#F6E7C1'] },
  },
  {
    slug: 'potli-bags', label: 'Potli bags', fabric: false, sizes: [], sizeLabel: '',
    patterns: ['potli'],
    crafts: ['Bandhani', 'Mirror work'],
    sample: { pattern: 'potli', colors: ['#B5122E', '#EBA21C', '#F6E7C1'] },
  },
  {
    slug: 'home-decor', label: 'Home decor', fabric: false, sizes: [], sizeLabel: '',
    patterns: ['vase', 'puppet'],
    crafts: ['Blue pottery', 'Kathputli'],
    sample: { pattern: 'vase', colors: ['#233A7A', '#1B7B5A', '#EBA21C'] },
  },
];

export const catOf = (slug) => CATEGORIES.find((c) => c.slug === slug) || CATEGORIES[0];
export const ALL_CRAFTS = [...new Set(CATEGORIES.flatMap((c) => c.crafts))];
