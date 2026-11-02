import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap foot">
        <div>
          <p className="brand-name">Rang Haveli</p>
          <p>Traditional Rajasthani sarees, bangles, earrings and more, made by hand in Jaipur, Jodhpur, Kota, Bagru and Jaisalmer.</p>
        </div>
        <div>
          <p><strong>Shop</strong></p>
          <p><Link to="/shop?category=sarees">Sarees</Link></p>
          <p><Link to="/shop?category=bangles">Bangles</Link></p>
          <p><Link to="/shop?category=earrings">Earrings</Link></p>
          <p><Link to="/shop">All collections</Link></p>
        </div>
        <div>
          <p><strong>Delivery</strong></p>
          <p>Free shipping on orders above ₹2,999. Otherwise ₹99.</p>
          <p>Cash on delivery and UPI accepted.</p>
        </div>
      </div>
    </footer>
  );
}
