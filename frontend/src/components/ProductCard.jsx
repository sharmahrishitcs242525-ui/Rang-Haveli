import { Link } from 'react-router-dom';
import ProductArt from './ProductArt.jsx';
import { rupee } from '../api.js';

export default function ProductCard({ product }) {
  const off = product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;
  return (
    <Link to={`/product/${product.slug}`} className="card">
      <ProductArt product={product} />
      <h3>{product.name}</h3>
      <p className="muted">
        {product.craft} from {product.origin}
      </p>
      <p className="price">
        <strong>{rupee(product.price)}</strong>
        {off > 0 && (
          <>
            <s>{rupee(product.mrp)}</s>
            <span className="off">{off}% off</span>
          </>
        )}
      </p>
      {product.stock === 0 && <p className="sold">Sold out</p>}
    </Link>
  );
}
