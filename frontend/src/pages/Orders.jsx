import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { api, rupee } from '../api.js';

export default function Orders() {
  const location = useLocation();
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    api('/orders/mine').then(setOrders).catch((e) => setError(e.message));
  }, []);

  return (
    <div className="wrap pad">
      <h1>Your orders</h1>
      {location.state?.placed && <p className="notice ok">Order placed. Thank you! We will message you when it ships.</p>}
      {error && <p className="notice error">{error}</p>}
      {orders && orders.length === 0 && <p className="notice">No orders yet. <Link to="/shop">Start shopping</Link>.</p>}
      <ul className="orders">
        {orders?.map((o) => (
          <li key={o._id}>
            <div className="order-head">
              <p><strong>Order {o._id.slice(-6).toUpperCase()}</strong> <span className="muted">{new Date(o.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span></p>
              <span className={`status ${o.status}`}>{o.status}</span>
            </div>
            {o.items.map((i, idx) => (
              <p key={idx} className="order-line">
                <Link to={`/product/${i.slug}`}>{i.name}</Link>{i.size && ` (size ${i.size})`} × {i.qty}
                <span>{rupee(i.price * i.qty)}</span>
              </p>
            ))}
            <p className="order-line total"><span>Total, {o.paymentMethod === 'COD' ? 'cash on delivery' : 'UPI'}</span><span>{rupee(o.total)}</span></p>
          </li>
        ))}
      </ul>
    </div>
  );
}
