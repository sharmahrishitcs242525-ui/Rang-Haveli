const router = require('express').Router();
const Product = require('../models/Product');
const Order = require('../models/Order');
const { protect, adminOnly } = require('../middleware/auth');

const FREE_SHIPPING_ABOVE = 2999;
const SHIPPING_FEE = 99;

// POST /api/orders  - prices are always read from the database, never trusted from the client
router.post('/', protect, async (req, res, next) => {
  try {
    const { items, shipping, paymentMethod = 'COD' } = req.body;
    if (!Array.isArray(items) || !items.length)
      return res.status(400).json({ message: 'Your bag is empty.' });

    const needed = { name: 'name', phone: 'phone number', address: 'address', city: 'city', state: 'state', pincode: 'pincode' };
    for (const [key, label] of Object.entries(needed)) {
      if (!String(shipping?.[key] ?? '').trim())
        return res.status(400).json({ message: `Enter your ${label}.` });
    }
    if (!['COD', 'UPI'].includes(paymentMethod))
      return res.status(400).json({ message: 'Choose a payment method.' });

    const products = await Product.find({ _id: { $in: items.map((i) => i.productId) } });
    const byId = new Map(products.map((p) => [p.id, p]));

    const lines = [];
    const qtyPerProduct = new Map();
    for (const it of items) {
      const p = byId.get(String(it.productId));
      const qty = parseInt(it.qty);
      if (!p) return res.status(400).json({ message: 'A product in your bag is no longer available.' });
      if (!qty || qty < 1) return res.status(400).json({ message: `Check the quantity for ${p.name}.` });
      if (p.sizes?.length && !p.sizes.includes(it.size))
        return res.status(400).json({ message: `Choose a size for ${p.name}.` });
      qtyPerProduct.set(p.id, (qtyPerProduct.get(p.id) || 0) + qty);
      lines.push({ product: p._id, name: p.name, slug: p.slug, price: p.price, qty, size: it.size || '' });
    }
    for (const [id, qty] of qtyPerProduct) {
      const p = byId.get(id);
      if (p.stock < qty)
        return res.status(400).json({ message: `${p.name}: only ${p.stock} left in stock.` });
    }

    // reduce stock (only if still available)
    const result = await Product.bulkWrite(
      [...qtyPerProduct].map(([id, qty]) => ({
        updateOne: { filter: { _id: id, stock: { $gte: qty } }, update: { $inc: { stock: -qty } } },
      }))
    );
    if (result.modifiedCount !== qtyPerProduct.size)
      return res.status(409).json({ message: 'Some items just sold out. Please review your bag.' });

    const itemsTotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
    const shippingFee = itemsTotal >= FREE_SHIPPING_ABOVE ? 0 : SHIPPING_FEE;
    const order = await Order.create({
      user: req.user._id,
      items: lines,
      shipping,
      paymentMethod,
      itemsTotal,
      shippingFee,
      total: itemsTotal + shippingFee,
    });
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
});

router.get('/mine', protect, async (req, res, next) => {
  try {
    res.json(await Order.find({ user: req.user._id }).sort({ createdAt: -1 }));
  } catch (err) {
    next(err);
  }
});

// Shop owner: all orders + status update
router.get('/', protect, adminOnly, async (_req, res, next) => {
  try {
    res.json(await Order.find().sort({ createdAt: -1 }).populate('user', 'name email'));
  } catch (err) {
    next(err);
  }
});

router.patch('/:id/status', protect, adminOnly, async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true });
    if (!order) return res.status(404).json({ message: 'Order not found.' });
    res.json(order);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
