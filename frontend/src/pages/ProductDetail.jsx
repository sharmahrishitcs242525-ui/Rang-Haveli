import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, rupee } from '../api.js';
import { useCart } from '../context/CartContext.jsx';
import ProductArt from '../components/ProductArt.jsx';
import { catOf } from '../categories.js';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { add } = useCart();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const [size, setSize] = useState('');
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [sizeError, setSizeError] = useState(false);

  useEffect(() => {
    setProduct(null);
    api(`/products/${slug}`, { auth: false }).then(setProduct).catch((e) => setError(e.message));
  }, [slug]);

  if (error) return <div className="wrap pad"><p className="notice error">{error}</p><Link to="/shop">Back to the shop</Link></div>;
  if (!product) return <p className="wrap pad muted">Loading…</p>;

  const cat = catOf(product.category);
  const hasSizes = product.sizes?.length > 0;
  const off = product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;

  const addToBag = (goToBag) => {
    if (hasSizes && !size) return setSizeError(true);
    add(product, { size, qty });
    setAdded(true);
    if (goToBag) navigate('/cart');
  };

  return (
    <div className="wrap pad detail">
      <ProductArt product={product} className="big" />
      <div className="detail-info">
        <p className="muted"><Link to={`/shop?category=${product.category}`}>{cat.label}</Link> / {product.craft}</p>
        <h1>{product.name}</h1>
        <p className="price large">
          <strong>{rupee(product.price)}</strong>
          {off > 0 && <><s>{rupee(product.mrp)}</s><span className="off">{off}% off</span></>}
        </p>
        <p>{product.description}</p>
        <dl className="facts">
          <div><dt>Craft</dt><dd>{product.craft}</dd></div>
          <div><dt>Made in</dt><dd>{product.origin}</dd></div>
          <div><dt>{cat.fabric ? 'Fabric' : 'Material'}</dt><dd>{(cat.fabric ? product.fabric : product.material) || product.fabric || product.material}</dd></div>
          <div><dt>Availability</dt><dd>{product.stock === 0 ? 'Sold out' : product.stock <= 5 ? `Only ${product.stock} left` : 'In stock'}</dd></div>
        </dl>

        {hasSizes && (
          <fieldset className="sizes">
            <legend>{cat.sizeLabel || 'Size'}</legend>
            {product.sizes.map((s) => (
              <label key={s} className={`size ${size === s ? 'on' : ''}`}>
                <input type="radio" name="size" value={s} checked={size === s} onChange={() => { setSize(s); setSizeError(false); }} />
                {s}
              </label>
            ))}
            {sizeError && <p className="notice error">Choose a size before adding to your bag.</p>}
          </fieldset>
        )}

        {product.stock > 0 ? (
          <div className="buy">
            <label className="qty">
              Quantity
              <input type="number" min="1" max={product.stock} value={qty} onChange={(e) => setQty(Math.max(1, Math.min(product.stock, +e.target.value || 1)))} />
            </label>
            <button className="btn" onClick={() => addToBag(false)}>Add to bag</button>
            <button className="btn ghost" onClick={() => addToBag(true)}>Buy now</button>
          </div>
        ) : (
          <p className="notice">This piece is sold out. <Link to={`/shop?category=${product.category}`}>See more {cat.label.toLowerCase()}</Link>.</p>
        )}
        {added && <p className="notice ok">Added to your bag. <Link to="/cart">View bag</Link></p>}
      </div>
    </div>
  );
}
