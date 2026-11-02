require('dns').setServers(['8.8.8.8', '1.1.1.1']); // fixes 'querySrv' DNS errors on some networks
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');

const S = ['2.2', '2.4', '2.6', '2.8'];

const products = [
  // ---------- SAREES ----------
  {
    name: 'Jaipur Bandhani Georgette Saree', category: 'sarees', craft: 'Bandhani', origin: 'Jaipur',
    fabric: 'Georgette', price: 4200, mrp: 5200, stock: 12, featured: true, pattern: 'bandhani',
    colors: ['#B5122E', '#EBA21C', '#F6E7C1'],
    description: 'Thousands of tiny knots, each tied by hand and dyed in lac red, make the dotted bandhani pattern. Light enough for a long wedding day, with a marigold-dotted pallu.',
  },
  {
    name: 'Jodhpur Leheriya Chiffon Saree', category: 'sarees', craft: 'Leheriya', origin: 'Jodhpur',
    fabric: 'Chiffon', price: 3800, mrp: 4600, stock: 9, featured: true, pattern: 'leheriya',
    colors: ['#1B7B5A', '#EBA21C', '#B5122E'],
    description: 'Leheriya means waves. The cloth is rolled and tie-dyed on the diagonal, so colour ripples across the saree like desert wind. Worn for Teej and Gangaur.',
  },
  {
    name: 'Kota Doria Cotton-Silk Saree', category: 'sarees', craft: 'Kota Doria', origin: 'Kota',
    fabric: 'Cotton-silk', price: 5600, mrp: 6400, stock: 7, featured: true, pattern: 'kota',
    colors: ['#F2E3C0', '#1D1C4F', '#C99A2E'],
    description: 'Woven in small squares called khats, Kota Doria is airy, crisp and cool in summer. This one has an indigo border with fine gold zari.',
  },
  {
    name: 'Sanganeri Block Print Cotton Saree', category: 'sarees', craft: 'Block Print', origin: 'Sanganer',
    fabric: 'Cotton', price: 2400, mrp: 2900, stock: 20, pattern: 'blockprint',
    colors: ['#F4EFE4', '#1D1C4F', '#A8142F'],
    description: 'Printed with hand-carved teak blocks along the Saleh Sagar banks. A soft everyday cotton with red floral motifs on ivory.',
  },
  {
    name: 'Gota Patti Wedding Saree', category: 'sarees', craft: 'Gota Patti', origin: 'Jaipur',
    fabric: 'Georgette', price: 9800, mrp: 12000, stock: 4, featured: true, pattern: 'gotapatti',
    colors: ['#6A1B4D', '#EBA21C', '#F6E7C1'],
    description: 'Strips of gold-toned gota ribbon are folded and stitched onto deep plum georgette in a diamond lattice. Made for the bride\'s family on wedding days.',
  },
  {
    name: 'Bagru Indigo Dabu Saree', category: 'sarees', craft: 'Block Print', origin: 'Bagru',
    fabric: 'Cotton', price: 2900, mrp: 3400, stock: 11, pattern: 'blockprint',
    colors: ['#233A7A', '#F4EFE4', '#233A7A'],
    description: 'Dabu is mud-resist printing. The cloth is stamped with a clay paste, dipped in indigo and washed, leaving crackled white motifs on deep blue.',
  },
  {
    name: 'Bikaner Pomcha Bandhani Silk Saree', category: 'sarees', craft: 'Bandhani', origin: 'Bikaner',
    fabric: 'Silk', price: 7400, mrp: 8800, stock: 5, pattern: 'bandhani',
    colors: ['#D9531E', '#6A1B4D', '#EBA21C'],
    description: 'Pomcha is a bandhani saree with a bright orange body and plum border, dotted by hand in the old Bikaner style.',
  },
  {
    name: 'Udaipur Mothra Leheriya Saree', category: 'sarees', craft: 'Leheriya', origin: 'Udaipur',
    fabric: 'Chiffon', price: 4100, mrp: 4900, stock: 8, pattern: 'leheriya',
    colors: ['#D63A7B', '#EBA21C', '#1B7B5A'],
    description: 'Mothra is the criss-cross form of leheriya, where two sets of waves cross to form a checked ripple. Pink and parrot-green, finished with a gold edge.',
  },

  // ---------- BANGLES ----------
  {
    name: 'Jaipuri Lac Bangle Set (12 pieces)', category: 'bangles', craft: 'Lac', origin: 'Jaipur',
    material: 'Lac with stone work', price: 1200, mrp: 1500, stock: 30, sizes: S, featured: true, pattern: 'lac',
    colors: ['#A8142F', '#EBA21C', '#1B7B5A'],
    description: 'Made in Maniharon ka Rasta, where lac is melted, shaped on a charcoal fire and set with tiny stones. Six red and six green bangles for each wrist.',
  },
  {
    name: 'Meenakari Gold Kada Pair', category: 'bangles', craft: 'Meenakari', origin: 'Jaipur',
    material: 'Brass, gold plated, enamel', price: 3600, mrp: 4200, stock: 10, sizes: S, featured: true, pattern: 'meenakari',
    colors: ['#EBA21C', '#1B7B5A', '#A8142F'],
    description: 'Jaipur\'s meenakari artists fire coloured enamel into engraved gold. A pair of broad kadas with peacock-green and red petals.',
  },
  {
    name: 'Kundan Polki Bangle Set', category: 'bangles', craft: 'Kundan', origin: 'Jaipur',
    material: 'Gold plated, polki stones', price: 5200, mrp: 6100, stock: 6, sizes: S, pattern: 'kundan',
    colors: ['#D9A93A', '#F6E7C1', '#A8142F'],
    description: 'Uncut polki-style stones are set in gold foil for a soft, glassy shine. Best with a plain silk saree.',
  },
  {
    name: 'Rajwadi Glass Bangles (24 pieces)', category: 'bangles', craft: 'Glass', origin: 'Firozabad',
    material: 'Glass', price: 650, mrp: 800, stock: 40, sizes: S, pattern: 'glass',
    colors: ['#1B7B5A', '#D63A7B', '#EBA21C', '#233A7A'],
    description: 'Slim glass bangles in four bright colours, two dozen to a box. Easy to match with any saree and cheap enough to break and replace.',
  },
  {
    name: 'Lac Mirror-Work Bangle Set', category: 'bangles', craft: 'Lac', origin: 'Jaipur',
    material: 'Lac with mirror work', price: 1450, mrp: 1750, stock: 18, sizes: S, pattern: 'lac',
    colors: ['#233A7A', '#EBA21C', '#F6E7C1'],
    description: 'Indigo lac bangles set with tiny mirrors and gold dots. They catch the light when you move your hands.',
  },
  {
    name: 'Marwari Bridal Chooda Set', category: 'bangles', craft: 'Lac', origin: 'Jodhpur',
    material: 'Lac, ivory-look resin', price: 6800, mrp: 7900, stock: 3, sizes: S, featured: true, pattern: 'lac',
    colors: ['#F6E7C1', '#A8142F'],
    description: 'A bridal set of ivory and red bangles, worn from wrist to forearm in the Marwari tradition. Includes 21 pieces for each arm.',
  },
  {
    name: 'Thewa Work Peacock Bangles', category: 'bangles', craft: 'Meenakari', origin: 'Pratapgarh',
    material: 'Silver-gilt, glass, 23k gold sheet', price: 2800, mrp: 3300, stock: 8, sizes: S, pattern: 'meenakari',
    colors: ['#D9A93A', '#1B7B5A'],
    description: 'Thewa is fine gold-sheet filigree fused onto coloured glass, a craft that comes from Pratapgarh. These bangles carry a peacock on each one.',
  },
];


const SHOE = ['5', '6', '7', '8', '9'];
const CLOTHES = ['S', 'M', 'L', 'XL'];

products.push(
  // ---------- EARRINGS ----------
  {
    name: 'Jaipuri Kundan Jhumka Earrings', category: 'earrings', craft: 'Kundan', origin: 'Jaipur',
    material: 'Gold plated, kundan, pearls', price: 2400, mrp: 2900, stock: 14, featured: true, pattern: 'jhumka',
    colors: ['#D9A93A', '#1B7B5A', '#F6E7C1'],
    description: 'Bell-shaped jhumkas with green meenakari trim and a fringe of pearls. The classic Rajasthani earring, light enough to wear all day.',
  },
  {
    name: 'Meenakari Chandbali Earrings', category: 'earrings', craft: 'Meenakari', origin: 'Jaipur',
    material: 'Brass, gold plated, enamel', price: 3200, mrp: 3800, stock: 9, featured: true, pattern: 'chandbali',
    colors: ['#EBA21C', '#A8142F', '#F6E7C1'],
    description: 'Chandbali means moon-shaped. These gold crescents carry red and green enamel work and hang with small pearl drops.',
  },
  {
    name: 'Lac Jhumka Earrings', category: 'earrings', craft: 'Lac', origin: 'Jaipur',
    material: 'Lac, gold-tone metal', price: 650, mrp: 800, stock: 25, pattern: 'jhumka',
    colors: ['#A8142F', '#EBA21C', '#1B7B5A'],
    description: 'Red lac jhumkas, light on the ears and made to match lac bangles from the same workshop.',
  },
  {
    name: 'Oxidised Silver Rajasthani Jhumki', category: 'earrings', craft: 'Oxidised silver', origin: 'Jaipur',
    material: 'Oxidised silver', price: 1100, mrp: 1400, stock: 16, pattern: 'jhumka',
    colors: ['#9AA0A6', '#4B5563', '#F6E7C1'],
    description: 'Dark-finished silver jhumkis in a tribal style. They look good with cotton sarees and block-print kurtas.',
  },
  {
    name: 'Polki Flower Stud Earrings', category: 'earrings', craft: 'Kundan', origin: 'Jaipur',
    material: 'Gold plated, polki-style stones', price: 1800, mrp: 2200, stock: 12, pattern: 'stud',
    colors: ['#D9A93A', '#A8142F', '#F6E7C1'],
    description: 'Flower-shaped studs with a red centre stone. A small, everyday option from the kundan workshops.',
  },
  {
    name: 'Thewa Peacock Earrings', category: 'earrings', craft: 'Thewa', origin: 'Pratapgarh',
    material: 'Silver-gilt, glass, gold sheet', price: 2600, mrp: 3100, stock: 6, pattern: 'chandbali',
    colors: ['#D9A93A', '#1B7B5A', '#F6E7C1'],
    description: 'Thewa is fine gold-sheet filigree fused onto green glass. A peacock is cut into each earring by hand.',
  },

  // ---------- NECKLACES ----------
  {
    name: 'Kundan Choker Necklace Set', category: 'necklaces', craft: 'Kundan', origin: 'Jaipur',
    material: 'Gold plated, kundan, pearls', price: 6400, mrp: 7600, stock: 5, featured: true, pattern: 'choker',
    colors: ['#D9A93A', '#1B7B5A', '#A8142F'],
    description: 'A choker with a central pendant, sold with matching earrings. Wear it with a plain silk or georgette saree.',
  },
  {
    name: 'Meenakari Rani Haar', category: 'necklaces', craft: 'Meenakari', origin: 'Jaipur',
    material: 'Brass, gold plated, enamel', price: 8900, mrp: 10500, stock: 3, pattern: 'choker',
    colors: ['#EBA21C', '#A8142F', '#1B7B5A'],
    description: 'A long bridal necklace with red and green enamel on gold. The rani haar was worn by queens in the Rajput courts.',
  },
  {
    name: 'Silver Tribal Hasli Necklace', category: 'necklaces', craft: 'Silver', origin: 'Jaisalmer',
    material: 'Oxidised silver', price: 4500, mrp: 5200, stock: 7, pattern: 'choker',
    colors: ['#B8BEC4', '#4B5563', '#F6E7C1'],
    description: 'A heavy silver collar, the kind worn by women in the villages around Jaisalmer. Pair with a plain cotton saree.',
  },

  // ---------- DUPATTAS ----------
  {
    name: 'Jodhpur Leheriya Chiffon Dupatta', category: 'dupattas', craft: 'Leheriya', origin: 'Jodhpur',
    fabric: 'Chiffon', price: 1400, mrp: 1700, stock: 22, pattern: 'leheriya',
    colors: ['#D63A7B', '#EBA21C', '#1B7B5A'],
    description: 'Diagonal tie-dyed waves in pink, gold and green. Brightens a plain kurta or lehenga.',
  },
  {
    name: 'Bandhani Georgette Dupatta', category: 'dupattas', craft: 'Bandhani', origin: 'Jaipur',
    fabric: 'Georgette', price: 1650, mrp: 2000, stock: 18, pattern: 'bandhani',
    colors: ['#1B7B5A', '#EBA21C', '#F6E7C1'],
    description: 'A green dupatta dotted with hand-tied bandhani in gold and cream, with a lace border.',
  },
  {
    name: 'Gota Patti Dupatta', category: 'dupattas', craft: 'Gota Patti', origin: 'Jaipur',
    fabric: 'Georgette', price: 2900, mrp: 3500, stock: 8, pattern: 'gotapatti',
    colors: ['#A8142F', '#EBA21C', '#F6E7C1'],
    description: 'Red georgette with a lattice of gold gota ribbon. A festive dupatta for weddings and Teej.',
  },

  // ---------- LEHENGAS ----------
  {
    name: 'Jaipur Bandhani Lehenga', category: 'lehengas', craft: 'Bandhani', origin: 'Jaipur',
    fabric: 'Silk blend', price: 12500, mrp: 14500, stock: 4, sizes: CLOTHES, pattern: 'bandhani',
    colors: ['#D9531E', '#6A1B4D', '#EBA21C'],
    description: 'A full-flared orange lehenga with bandhani dots and a plum border. Sold as a skirt; blouse and dupatta can be added separately.',
  },
  {
    name: 'Gota Patti Bridal Lehenga', category: 'lehengas', craft: 'Gota Patti', origin: 'Jaipur',
    fabric: 'Georgette', price: 28500, mrp: 33000, stock: 2, sizes: CLOTHES, pattern: 'gotapatti',
    colors: ['#6A1B4D', '#EBA21C', '#F6E7C1'],
    description: 'A plum bridal lehenga covered in a lattice of gold gota. Takes about three weeks to make by hand.',
  },

  // ---------- JUTTIS ----------
  {
    name: 'Jaipuri Embroidered Mojari', category: 'juttis', craft: 'Mojari', origin: 'Jaipur',
    material: 'Leather, thread embroidery', price: 1350, mrp: 1600, stock: 20, sizes: SHOE, pattern: 'mojari',
    colors: ['#A8142F', '#EBA21C', '#F6E7C1'],
    description: 'Hand-stitched leather juttis with a pointed toe and gold thread work. Soft after a few days of wear.',
  },
  {
    name: 'Bridal Zari Jutti', category: 'juttis', craft: 'Mojari', origin: 'Jodhpur',
    material: 'Leather, zari', price: 1950, mrp: 2300, stock: 10, sizes: SHOE, pattern: 'mojari',
    colors: ['#1D1C4F', '#EBA21C', '#F6E7C1'],
    description: 'Indigo juttis with zari embroidery across the toe. Made to go with a bandhani or gota patti saree.',
  },

  // ---------- POTLI BAGS ----------
  {
    name: 'Bandhani Potli Bag', category: 'potli-bags', craft: 'Bandhani', origin: 'Jaipur',
    material: 'Bandhani silk, drawstring', price: 850, mrp: 1050, stock: 24, pattern: 'potli',
    colors: ['#B5122E', '#EBA21C', '#F6E7C1'],
    description: 'A small drawstring pouch in bandhani silk with gold tassels. Holds a phone, keys and a lipstick.',
  },
  {
    name: 'Mirror Work Potli Bag', category: 'potli-bags', craft: 'Mirror work', origin: 'Jaisalmer',
    material: 'Cotton, mirror embroidery', price: 1150, mrp: 1400, stock: 15, pattern: 'potli',
    colors: ['#233A7A', '#EBA21C', '#F6E7C1'],
    description: 'An indigo potli with tiny mirrors stitched by hand in the Jaisalmer style.',
  },

  // ---------- HOME DECOR ----------
  {
    name: 'Jaipur Blue Pottery Vase', category: 'home-decor', craft: 'Blue pottery', origin: 'Jaipur',
    material: 'Quartz-based ceramic', price: 1800, mrp: 2200, stock: 9, pattern: 'vase',
    colors: ['#233A7A', '#1B7B5A', '#EBA21C'],
    description: 'Jaipur blue pottery is made without clay, from quartz and glass. Each vase is painted by hand with cobalt-blue flowers.',
  },
  {
    name: 'Kathputli Puppet Pair', category: 'home-decor', craft: 'Kathputli', origin: 'Jaipur',
    material: 'Wood, cotton, thread', price: 950, mrp: 1200, stock: 17, pattern: 'puppet',
    colors: ['#A8142F', '#EBA21C', '#1B7B5A'],
    description: 'A king and queen string puppet, as used by Rajasthani street puppeteers. Hang on a wall or door.',
  }
);

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Product.deleteMany({});
    await Product.create(products);
    console.log(`Seeded ${products.length} products.`);

    const email = (process.env.ADMIN_EMAIL || 'admin@ranghaveli.test').toLowerCase();
    if (!(await User.findOne({ email }))) {
      await User.create({ name: 'Shop Owner', email, password: process.env.ADMIN_PASSWORD || 'admin123', role: 'admin' });
      console.log(`Created admin user: ${email}`);
    }
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();
