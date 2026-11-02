const router = require('express').Router();
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// GET /api/products?category=&craft=&q=&sort=&minPrice=&maxPrice=&page=&limit=
router.get('/', async (req, res, next) => {
  try {
    const { category, craft, q, sort = 'newest', minPrice, maxPrice } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (craft) filter.craft = craft;
    if (q) {
      const rx = new RegExp(escapeRegex(q), 'i');
      filter.$or = [{ name: rx }, { craft: rx }, { origin: rx }, { description: rx }];
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    const sortMap = {
      newest: { createdAt: -1 },
      'price-asc': { price: 1 },
      'price-desc': { price: -1 },
    };
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(48, Math.max(1, parseInt(req.query.limit) || 12));

    const [items, total] = await Promise.all([
      Product.find(filter)
        .sort(sortMap[sort] || sortMap.newest)
        .skip((page - 1) * limit)
        .limit(limit),
      Product.countDocuments(filter),
    ]);
    res.json({ items, total, page, pages: Math.max(1, Math.ceil(total / limit)) });
  } catch (err) {
    next(err);
  }
});

router.get('/featured', async (_req, res, next) => {
  try {
    res.json(await Product.find({ featured: true }).limit(8));
  } catch (err) {
    next(err);
  }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) return res.status(404).json({ message: 'This product could not be found.' });
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// ---- Shop owner only ----
router.post('/', protect, adminOnly, async (req, res, next) => {
  try {
    res.status(201).json(await Product.create(req.body));
  } catch (err) {
    next(err);
  }
});

router.put('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ message: 'This product could not be found.' });
    res.json(product);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'This product could not be found.' });
    res.json({ message: 'Product deleted.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
