import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  return (
    <header className="site-header">
      <div className="wrap bar">
        <Link to="/" className="brand">
          <span className="brand-name">Rang Haveli</span>
          <span className="brand-hi" lang="hi">रंग हवेली</span>
        </Link>
        <nav aria-label="Main">
          <Link to="/shop?category=sarees">Sarees</Link>
          <Link to="/shop?category=bangles">Bangles</Link>
          <Link to="/shop?category=earrings">Earrings</Link>
          <Link to="/shop">All collections</Link>
        </nav>
        <div className="bar-actions">
          {user ? (
            <>
              {user.role === 'admin' && <Link to="/admin">Dashboard</Link>}
              <Link to="/orders">{user.name.split(' ')[0]}'s orders</Link>
              <button className="link" onClick={() => { logout(); navigate('/'); }}>Log out</button>
            </>
          ) : (
            <Link to="/login">Log in</Link>
          )}
          <Link to="/cart" className="bag" aria-label={`Bag, ${count} items`}>
            Bag <span className="bag-count">{count}</span>
          </Link>
        </div>
      </div>
      <div className="toran" aria-hidden="true" />
    </header>
  );
}
