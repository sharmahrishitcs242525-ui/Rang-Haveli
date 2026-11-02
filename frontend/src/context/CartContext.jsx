import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

const load = () => {
  try {
    return JSON.parse(localStorage.getItem('rh_cart')) || [];
  } catch {
    return [];
  }
};

export function CartProvider({ children }) {
  const [lines, setLines] = useState(load);
  useEffect(() => {
    localStorage.setItem('rh_cart', JSON.stringify(lines));
  }, [lines]);

  const add = (product, { size = '', qty = 1 } = {}) => {
    const key = `${product._id}-${size}`;
    setLines((prev) => {
      const existing = prev.find((l) => l.key === key);
      if (existing)
        return prev.map((l) => (l.key === key ? { ...l, qty: Math.min(product.stock, l.qty + qty) } : l));
      return [
        ...prev,
        {
          key,
          productId: product._id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          category: product.category,
          pattern: product.pattern,
          colors: product.colors,
          stock: product.stock,
          size,
          qty: Math.min(product.stock, qty),
        },
      ];
    });
  };
  const setQty = (key, qty) =>
    setLines((prev) => prev.map((l) => (l.key === key ? { ...l, qty: Math.max(1, Math.min(l.stock, qty)) } : l)));
  const remove = (key) => setLines((prev) => prev.filter((l) => l.key !== key));
  const clear = () => setLines([]);

  const count = lines.reduce((s, l) => s + l.qty, 0);
  const subtotal = lines.reduce((s, l) => s + l.qty * l.price, 0);
  const shipping = subtotal === 0 || subtotal >= 2999 ? 0 : 99; // display only; the server recalculates
  return (
    <CartContext.Provider value={{ lines, add, setQty, remove, clear, count, subtotal, shipping, total: subtotal + shipping }}>
      {children}
    </CartContext.Provider>
  );
}
