import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { api, rupee } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function Checkout() {
  const { user } = useAuth();
  const { lines, subtotal, shipping, total, clear } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: user?.name || '', phone: '', address: '', city: '', state: 'Rajasthan', pincode: '' });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (!lines.length) return <Navigate to="/cart" replace />;
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const order = await api('/orders', {
        method: 'POST',
        body: {
          items: lines.map((l) => ({ productId: l.productId, qty: l.qty, size: l.size })),
          shipping: form,
          paymentMethod,
        },
      });
      clear();
      navigate('/orders', { state: { placed: order._id } });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="wrap pad">
      <h1>Checkout</h1>
      <div className="cart">
        <form className="form" onSubmit={submit}>
          <h2>Delivery address</h2>
          <label>Full name<input value={form.name} onChange={set('name')} autoComplete="name" required /></label>
          <label>Phone number<input value={form.phone} onChange={set('phone')} inputMode="tel" autoComplete="tel" required /></label>
          <label>Address<textarea rows="3" value={form.address} onChange={set('address')} autoComplete="street-address" required /></label>
          <div className="row">
            <label>City<input value={form.city} onChange={set('city')} required /></label>
            <label>State<input value={form.state} onChange={set('state')} required /></label>
            <label>Pincode<input value={form.pincode} onChange={set('pincode')} inputMode="numeric" required /></label>
          </div>
          <h2>Payment</h2>
          <label className="radio"><input type="radio" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} /> Cash on delivery</label>
          <label className="radio"><input type="radio" checked={paymentMethod === 'UPI'} onChange={() => setPaymentMethod('UPI')} /> UPI (we will send a payment link on WhatsApp)</label>
          {error && <p className="notice error" role="alert">{error}</p>}
          <button className="btn" disabled={busy}>{busy ? 'Placing order…' : `Place order for ${rupee(total)}`}</button>
        </form>
        <aside className="summary">
          <h2>In your bag</h2>
          {lines.map((l) => (
            <p key={l.key}><span>{l.name}{l.size && ` (${l.size})`} × {l.qty}</span><span>{rupee(l.price * l.qty)}</span></p>
          ))}
          <p><span>Shipping</span><span>{shipping === 0 ? 'Free' : rupee(shipping)}</span></p>
          <p className="total"><span>Total</span><span>{rupee(total)}</span></p>
        </aside>
      </div>
    </div>
  );
}
