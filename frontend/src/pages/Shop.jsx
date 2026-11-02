import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api.js';
import { CATEGORIES, ALL_CRAFTS, catOf } from '../categories.js';
import ProductCard from '../components/ProductCard.jsx';

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const category = params.get('category') || '';
  const craft = params.get('craft') || '';
  const sort = params.get('sort') || 'newest';
  const page = params.get('page') || '1';
  const q = params.get('q') || '';
  const [search, setSearch] = useState(q);
  const [data, setData] = useState({ items: [], total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const update = (changes) => {
    const next = new URLSearchParams(params);
    Object.entries(changes).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    if (!('page' in changes)) next.delete('page');
    setParams(next);
  };

  useEffect(() => {
    setLoading(true);
    setError('');
    const qs = new URLSearchParams({ sort, page, limit: 12 });
    if (category) qs.set('category', category);
    if (craft) qs.set('craft', craft);
    if (q) qs.set('q', q);
    api(`/products?${qs}`, { auth: false })
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [category, craft, sort, page, q]);

  const craftOptions = category ? catOf(category).crafts : ALL_CRAFTS;
  const title = category ? catOf(category).label : 'All products';

  return (
    <div className="wrap pad">
      <h1>{title}</h1>

      <div className="chips wrapchips" role="group" aria-label="Category">
        <button className={`chip ${category === '' ? 'on' : ''}`} onClick={() => update({ category: '', craft: '' })} aria-pressed={category === ''}>All</button>
        {CATEGORIES.map((c) => (
          <button key={c.slug} className={`chip ${category === c.slug ? 'on' : ''}`} onClick={() => update({ category: c.slug, craft: '' })} aria-pressed={category === c.slug}>
            {c.label}
          </button>
        ))}
      </div>

      <div className="filters">
        <form className="search" onSubmit={(e) => { e.preventDefault(); update({ q: search.trim() }); }}>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, craft or city" aria-label="Search products" />
          <button className="btn small">Search</button>
        </form>
        <select value={craft} onChange={(e) => update({ craft: e.target.value })} aria-label="Craft">
          <option value="">Every craft</option>
          {craftOptions.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select value={sort} onChange={(e) => update({ sort: e.target.value })} aria-label="Sort">
          <option value="newest">Newest</option>
          <option value="price-asc">Price, low to high</option>
          <option value="price-desc">Price, high to low</option>
        </select>
      </div>

      {error && <p className="notice error">{error}</p>}
      {loading && <p className="muted">Loading…</p>}
      {!loading && !error && data.items.length === 0 && (
        <p className="notice">No products match. Clear a filter or try a different search.</p>
      )}
      <div className="grid">{data.items.map((p) => <ProductCard key={p._id} product={p} />)}</div>

      {data.pages > 1 && (
        <div className="pager">
          <button className="btn ghost small" disabled={+page <= 1} onClick={() => update({ page: String(+page - 1) })}>Previous</button>
          <span>Page {data.page} of {data.pages}</span>
          <button className="btn ghost small" disabled={+page >= data.pages} onClick={() => update({ page: String(+page + 1) })}>Next</button>
        </div>
      )}
    </div>
  );
}
