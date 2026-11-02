import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import { useAuth } from './context/AuthContext.jsx';
import Home from './pages/Home.jsx';
import Shop from './pages/Shop.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import AuthPage from './pages/AuthPage.jsx';
import Orders from './pages/Orders.jsx';
import Admin from './pages/Admin.jsx';

function RequireLogin({ children }) {
  const { user, ready } = useAuth();
  const location = useLocation();
  if (!ready) return <p className="wrap pad">Loading…</p>;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  return children;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<RequireLogin><Checkout /></RequireLogin>} />
          <Route path="/orders" element={<RequireLogin><Orders /></RequireLogin>} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/register" element={<AuthPage mode="register" />} />
          <Route path="*" element={<div className="wrap pad"><h1>Page not found</h1><p>Go back to the <a href="/">home page</a>.</p></div>} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
