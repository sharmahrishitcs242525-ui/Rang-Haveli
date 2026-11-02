import { useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { api, rupee } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { CATEGORIES, catOf } from '../categories.js';

const STATUSES = ['placed', 'packed', 'shipped', 'delivered', 'cancelled'];
const EMPTY = {
  name: '', category: 'sarees', craft: '', origin: '', description: '', fabric: '', material: '',
  price: '', mrp: '', stock: '', colors: '#B5122E, #EBA21C, #F6E7C1', pattern: 'bandhani', featured: false,
};

export default function Admin() {
  const { user, ready } = useAuth();
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const load = () => {
    api('/products?limit=48', { auth: false }).then((d) => setProducts(d.items)).catch((e) => setMessage({ type: 'error', text: e.message }));
    api('/orders').then(setOrders).catch((e) => setMessage({ type: 'error', text: e.message }));
  };
  useEffect(() => { if (user?.role === 'admin') load(); }, [user]);

  const stats = useMemo(() => ({
    products: products.length,
    orders: orders.length,
    revenue: orders.filter((o) => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0),
    low: products.filter((p) => p.stock <= 5).length,
  }), [products, orders]);

  if (!ready) return <p className="wrap pad">Loading…</p>;
  if (user?.role !== 'admin') return <Navigate to="/" replace />;

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  const flash = (type, text) => setMessage({ type, text });

  const edit = (p) => {
    setEditingId(p._id);
    setForm({
      name: p.name, category: p.category, craft: p.craft, origin: p.origin, description: p.description,
      fabric: p.fabric || '', material: p.material || '', price: p.price, mrp: p.mrp || '', stock: p.stock,
      colors: (p.colors || []).join(', '), pattern: p.pattern, featured: !!p.featured,
    });
    setTab('form');
    window.scrollTo(0, 0);
  };

  const save = async (e) => {
    e.preventDefault();
    const body = {
      ...form,
      price: Number(form.price),
      mrp: Number(form.mrp) || Number(form.price),
      stock: Number(form.stock),
      colors: form.colors.split(',').map((c) => c.trim()).filter(Boolean),
      sizes: catOf(form.category).sizes,
    };
    try {
      if (editingId) await api(`/products/${editingId}`, { method: 'PUT', body });
      else await api('/products', { method: 'POST', body });
      flash('ok', editingId ? 'Product updated.' : 'Product added.');
      setForm(EMPTY);
      setEditingId(null);
      setTab('products');
      load();
    } catch (err) {
      flash('error', err.message);
    }
  };

  const remove = async (p) => {
    if (!window.confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    try {
      await api(`/products/${p._id}`, { method: 'DELETE' });
      flash('ok', 'Product deleted.');
      load();
    } catch (err) {
      flash('error', err.message);
    }
  };

  const setStatus = async (id, status) => {
    try {
      await api(`/orders/${id}/status`, { method: 'PATCH', body: { status } });
      setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, status } : o)));
    } catch (err) {
      flash('error', err.message);
    }
  };

  return (
    <div className="wrap pad">
      <h1>Shop dashboard</h1>

      <div className="stats">
        <div><span>{stats.products}</span>Products</div>
        <div><span>{stats.orders}</span>Orders</div>
        <div><span>{rupee(stats.revenue)}</span>Revenue</div>
        <div><span>{stats.low}</span>Low stock (5 or fewer)</div>
      </div>

      <div className="chips tabs" role="tablist">
        <button className={`chip ${tab === 'products' ? 'on' : ''}`} onClick={() => setTab('products')}>Products</button>
        <button className={`chip ${tab === 'orders' ? 'on' : ''}`} onClick={() => setTab('orders')}>Orders</button>
        <button className={`chip ${tab === 'form' ? 'on' : ''}`} onClick={() => { setEditingId(null); setForm(EMPTY); setTab('form'); }}>
          {editingId ? 'Edit product' : 'Add product'}
        </button>
      </div>

      {message.text && <p className={`notice ${message.type}`} role="status">{message.text}</p>}

      {tab === 'products' && (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Name</th><th>Category</th><th>Craft</th><th>Price</th><th>Stock</th><th></th></tr></thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>{p.craft}</td>
                  <td>{rupee(p.price)}</td>
                  <td className={p.stock <= 5 ? 'low' : ''}>{p.stock}</td>
                  <td className="actions">
                    <button className="link" onClick={() => edit(p)}>Edit</button>
                    <button className="link" onClick={() => remove(p)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'orders' && (
        <div className="table-wrap">
          {orders.length === 0 && <p className="notice">No orders yet.</p>}
          {orders.length > 0 && (
            <table>
              <thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th></tr></thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id}>
                    <td>{o._id.slice(-6).toUpperCase()}<br /><span className="muted small">{new Date(o.createdAt).toLocaleDateString('en-IN')}</span></td>
                    <td>{o.user?.name}<br /><span className="muted small">{o.shipping?.city}, {o.shipping?.phone}</span></td>
                    <td>{o.items.map((i) => `${i.name} × ${i.qty}`).join(', ')}</td>
                    <td>{rupee(o.total)}</td>
                    <td>{o.paymentMethod}</td>
                    <td>
                      <select value={o.status} onChange={(e) => setStatus(o._id, e.target.value)} aria-label={`Status of order ${o._id.slice(-6)}`}>
                        {STATUSES.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === 'form' && (
        <form className="form admin-form" onSubmit={save}>
          <h2>{editingId ? 'Edit product' : 'Add a product'}</h2>
          <label>Name<input value={form.name} onChange={set('name')} required /></label>
          <div className="row">
            <label>Category
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value, pattern: catOf(e.target.value).patterns[0] })}>
                {CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.label}</option>)}
              </select>
            </label>
            <label>Craft<input value={form.craft} onChange={set('craft')} placeholder="Bandhani, Lac, Mojari, Blue pottery…" required /></label>
            <label>Made in<input value={form.origin} onChange={set('origin')} placeholder="Jaipur" required /></label>
          </div>
          <label>Description<textarea rows="3" value={form.description} onChange={set('description')} required /></label>
          {catOf(form.category).fabric
            ? <label>Fabric<input value={form.fabric} onChange={set('fabric')} /></label>
            : <label>Material<input value={form.material} onChange={set('material')} /></label>}
          <div className="row">
            <label>Price (₹)<input type="number" min="0" value={form.price} onChange={set('price')} required /></label>
            <label>MRP (₹)<input type="number" min="0" value={form.mrp} onChange={set('mrp')} /></label>
            <label>Stock<input type="number" min="0" value={form.stock} onChange={set('stock')} required /></label>
          </div>
          <div className="row">
            <label>Pattern shown in the picture
              <select value={form.pattern} onChange={set('pattern')}>{catOf(form.category).patterns.map((p) => <option key={p}>{p}</option>)}</select>
            </label>
            <label>Colours (hex, comma separated)<input value={form.colors} onChange={set('colors')} /></label>
          </div>
          <label className="radio"><input type="checkbox" checked={form.featured} onChange={set('featured')} /> Show on the home page</label>
          <div className="buy">
            <button className="btn">{editingId ? 'Save changes' : 'Add product'}</button>
            {editingId && <button type="button" className="btn ghost" onClick={() => { setEditingId(null); setForm(EMPTY); setTab('products'); }}>Cancel</button>}
          </div>
        </form>
      )}
    </div>
  );
}
