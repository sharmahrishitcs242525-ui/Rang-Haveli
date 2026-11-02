const mongoose = require('mongoose');
const CATEGORIES = require('../config/categories');

const slugify = (s) =>
  s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    category: { type: String, enum: CATEGORIES, required: true, index: true },
    craft: { type: String, required: true, index: true }, // Bandhani, Leheriya, Jhumka, Mojari, Blue pottery...
    origin: { type: String, required: true },             // Jaipur, Kota, Bagru...
    description: { type: String, required: true },
    fabric: String,                                        // sarees
    material: String,                                      // bangles
    price: { type: Number, required: true, min: 0 },
    mrp: { type: Number, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    sizes: [String],                                       // bangle sizes, jutti sizes, lehenga sizes (empty = one size)
    colors: [String],                                      // hex values, used to draw the product art
    pattern: { type: String, default: 'plain' },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

productSchema.pre('validate', function () {
  if (!this.slug && this.name) this.slug = slugify(this.name);
});

module.exports = mongoose.model('Product', productSchema);
