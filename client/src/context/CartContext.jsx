import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {

  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );

  // =========================
  // Sync with localStorage
  // =========================
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);


  // =========================
  // ADD TO CART (with stock check)
  // =========================
  const addToCart = (product) => {
    if (product.stock <= 0) {
      alert("❌ Product out of stock");
      return;
    }

    const exists = cart.find(item => item._id === product._id);

    if (exists) {
      if (exists.qty >= product.stock) {
        alert("❌ No more stock available");
        return;
      }

      setCart(cart.map(item =>
        item._id === product._id
          ? { ...item, qty: item.qty + 1 }
          : item
      ));

    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };


  // =========================
  // REMOVE
  // =========================
  const removeFromCart = (id) => {
    setCart(cart.filter(item => item._id !== id));
  };


  // =========================
  // UPDATE QTY
  // =========================
  const updateQty = (id, qty) => {
    if (qty <= 0) return removeFromCart(id);

    setCart(cart.map(item =>
      item._id === id ? { ...item, qty } : item
    ));
  };


  // =========================
  // CLEAR CART  ⭐ VERY IMPORTANT
  // =========================
  const clearCart = () => {
    setCart([]);                     // instant UI update
    localStorage.removeItem("cart"); // persistent clear
  };


  // =========================
  // TOTAL
  // =========================
  const total = cart.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );


  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,   // ⭐ NEW
        total
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
