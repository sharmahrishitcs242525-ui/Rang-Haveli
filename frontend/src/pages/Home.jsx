import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { CATEGORIES } from '../categories.js';
import ProductArt from '../components/ProductArt.jsx';
import ProductCard from '../components/ProductCard.jsx';

// Static art so the hero never depends on the API being up
const heroSaree = { category: 'sarees', pattern: 'bandhani', colors: ['#B5122E', '#EBA21C', '#F6E7C1'] };
const heroBangles = { category: 'bangles', pattern: 'lac', colors: ['#A8142F', '#EBA21C', '#1B7B5A'] };
const heroEarrings = { category: 'earrings', pattern: 'jhumka', colors: ['#D9A93A', '#1B7B5A', '#F6E7C1'] };

const crafts = [
  { name: 'Bandhani', place: 'Jaipur and Bikaner', text: 'Cloth is tied into thousands of tiny knots before dyeing, which leaves a pattern of dots.' },
  { name: 'Leheriya', place: 'Jodhpur and Udaipur', text: 'Rolled and dyed on the diagonal so the colour flows in waves.' },
  { name: 'Kundan and meenakari', place: 'Jaipur', text: 'Stones are set in gold foil and enamel is fired into engraved metal for earrings, necklaces and bangles.' },
  { name: 'Lac and mojari', place: 'Jaipur and Jodhpur', text: 'Lac bangles are shaped by hand over charcoal. Mojari juttis are stitched from leather and embroidered with zari.' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => {
    api('/products/featured', { auth: false }).then(setFeatured).catch((e) => setError(e.message));
  }, []);

  return (
    <>
      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <h1>Traditional Rajasthani crafts, from sarees to earrings</h1>
            <p>
              Sarees, bangles and earrings first, then necklaces, lehengas, juttis, potli bags and home decor.
              Everything is made by hand in Jaipur, Jodhpur, Kota, Bagru and Jaisalmer.
            </p>
            <div className="hero-cta">
              <Link to="/shop?category=sarees" className="btn gold">Shop sarees</Link>
              <Link to="/shop?category=bangles" className="btn ghost">Shop bangles</Link>
              <Link to="/shop?category=earrings" className="btn ghost">Shop earrings</Link>
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <ProductArt product={heroSaree} className="tall" />
            <div className="hero-stack">
              <ProductArt product={heroBangles} />
              <ProductArt product={heroEarrings} />
            </div>
          </div>
        </div>
      </section>

      <section className="wrap section">
        <h2>Shop by collection</h2>
        <div className="collections">
          {CATEGORIES.map((c) => (
            <Link key={c.slug} to={`/shop?category=${c.slug}`} className="tile">
              <ProductArt product={{ category: c.slug, ...c.sample }} />
              <span>{c.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="crafts">
        <div className="wrap section">
          <h2>Picked by our karigars</h2>
          {error && <p className="notice error">{error}</p>}
          <div className="grid">{featured.map((p) => <ProductCard key={p._id} product={p} />)}</div>
          {!error && featured.length === 0 && <p className="muted">Loading the collection…</p>}
          <p style={{ marginTop: '1.8rem' }}><Link to="/shop">See every product</Link></p>
        </div>
      </section>

      <section className="wrap section">
        <h2>The crafts behind the shop</h2>
        <div className="craft-list">
          {crafts.map((c) => (
            <div key={c.name} className="craft">
              <h3>{c.name}</h3>
              <p className="muted">{c.place}</p>
              <p>{c.text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
