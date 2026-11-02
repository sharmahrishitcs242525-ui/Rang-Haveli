import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import ProductArt from '../components/ProductArt.jsx';
import { rupee } from '../api.js';

export default function Cart() {
  const { lines, setQty, remove, subtotal, shipping, total } = useCart();
  const navigate = useNavigate();

  if (!lines.length)
    return (
      <div className="wrap pad">
        <h1>Your bag</h1>
        <p className="notice">Your bag is empty. <Link to="/shop">Browse the collections</Link>.</p>
      </div>
    );

  return (
    <div className="wrap pad">
      <h1>Your bag</h1>
      <div className="cart">
        <ul className="cart-lines">
          {lines.map((l) => (
            <li key={l.key}>
              <ProductArt product={l} className="thumb" />
              <div className="cart-info">
                <Link to={`/product/${l.slug}`}><strong>{l.name}</strong></Link>
                {l.size && <p className="muted">Size {l.size}</p>}
                <p>{rupee(l.price)}</p>
                <button className="link" onClick={() => remove(l.key)}>Remove</button>
              </div>
              <label className="qty">
                Quantity
                <input type="number" min="1" max={l.stock} value={l.qty} onChange={(e) => setQty(l.key, +e.target.value || 1)} />
              </label>
              <p className="line-total">{rupee(l.price * l.qty)}</p>
            </li>
          ))}
        </ul>
        <aside className="summary">
          <h2>Order summary</h2>
          <p><span>Items</span><span>{rupee(subtotal)}</span></p>
          <p><span>Shipping</span><span>{shipping === 0 ? 'Free' : rupee(shipping)}</span></p>
          {shipping > 0 && <p className="muted small">Add {rupee(2999 - subtotal)} more for free shipping.</p>}
          <p className="total"><span>Total</span><span>{rupee(total)}</span></p>
          <button className="btn wide" onClick={() => navigate('/checkout')}>Continue to checkout</button>
        </aside>
      </div>
    </div>
  );
}
