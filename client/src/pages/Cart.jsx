
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

export default function Cart() {
  const { cart, removeFromCart, updateQty, total } = useCart();
  const { user } = useAuth();
  const [warning, setWarning] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // =========================
  // QUANTITY LOGIC
  // =========================
  const changeQty = (item, newQty) => {
    const qty = Math.max(1, newQty);

    if (qty > item.stock) {
      setWarning(`Only ${item.stock} units available for "${item.title}"`);
      updateQty(item._id, item.stock);
      return;
    }

    setWarning("");
    updateQty(item._id, qty);
  };

  // =========================
  // STOCK CHECK
  // =========================
  const verifyStockAndCheckout = async () => {
    try {
      if (!user) {
        navigate("/login");
        return;
      }

      setLoading(true);
      setWarning("");

      const res = await axios.post(
        "https://ecommerce-jlg9.onrender.com/api/products/check-stock",
        {
          items: cart.map((i) => ({
            product: i._id,
            qty: i.qty,
          })),
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (!res.data.ok) {
        setWarning(res.data.message);
        return;
      }

      navigate("/checkout");
    } catch (err) {
      setWarning(
        err.response?.data?.message ||
          "Stock verification failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // EMPTY CART
  // =========================
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#fdf6ee] flex items-center justify-center px-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-serif text-[#5e3e2d] text-center">
          Your cart is empty 🛒
        </h2>
      </div>
    );
  }

  // =========================
  // UI
  // =========================
  return (
    <div className="min-h-screen bg-[#fdf6ee] px-4 sm:px-6 md:px-16 lg:px-24 py-8 sm:py-12 md:py-16">

      {/* TITLE */}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#5e3e2d] mb-8 sm:mb-10">
        Your Cart
      </h2>

      {/* WARNING */}
      {warning && (
        <div className="mb-6 bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm sm:text-base">
          {warning}
        </div>
      )}

      {/* ITEMS */}
      <div className="space-y-4 sm:space-y-6">
        {cart.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-2xl shadow-md p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6"
          >

            {/* LEFT */}
            <div className="flex items-center gap-3 sm:gap-5">
              <img
                src={item.image}
                alt={item.title}
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-lg"
              />

              <div>
                <h4 className="font-semibold text-[#355e3b] text-sm sm:text-base">
                  {item.title}
                </h4>

                <p className="text-xs sm:text-sm text-gray-500">
                  Stock: {item.stock}
                </p>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full lg:w-auto justify-between">

              {/* QUANTITY */}
              <div className="flex items-center border rounded-lg overflow-hidden">

                <button
                  onClick={() => changeQty(item, item.qty - 1)}
                  className="px-3 py-2 bg-[#f2e6d9] hover:bg-[#ead9c8]"
                >
                  −
                </button>

                <input
                  type="number"
                  value={item.qty}
                  min="1"
                  max={item.stock}
                  onChange={(e) =>
                    changeQty(item, Number(e.target.value))
                  }
                  className="w-12 sm:w-14 text-center outline-none text-sm"
                />

                <button
                  onClick={() => changeQty(item, item.qty + 1)}
                  className="px-3 py-2 bg-[#f2e6d9] hover:bg-[#ead9c8]"
                >
                  +
                </button>
              </div>

              {/* PRICE */}
              <p className="font-bold text-[#8c5a3c] text-sm sm:text-lg">
                ₹ {item.price * item.qty}
              </p>

              {/* REMOVE */}
              <button
                onClick={() => removeFromCart(item._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 sm:px-4 py-2 rounded-lg text-sm"
              >
                Remove
              </button>

            </div>
          </div>
        ))}
      </div>

      {/* TOTAL */}
      <div className="mt-10 sm:mt-12 bg-white rounded-2xl shadow-md p-5 sm:p-8 flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">

        <h3 className="text-lg sm:text-2xl font-bold text-[#5e3e2d]">
          Total: ₹ {total}
        </h3>

        <button
          onClick={verifyStockAndCheckout}
          disabled={loading}
          className="w-full md:w-auto bg-[#8c5a3c] hover:bg-[#6f452f] text-white px-6 sm:px-8 py-3 rounded-full font-semibold shadow disabled:opacity-60 text-sm sm:text-base"
        >
          {loading ? "Checking stock..." : "Proceed to Checkout →"}
        </button>
      </div>

    </div>
  );
}
