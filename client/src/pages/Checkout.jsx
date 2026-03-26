import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { createOrder, verifyPayment } from "../services/orderService";

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, total, clearCart } = useCart();

  // =========================
  // Shipping state
  // =========================
  const [shipping, setShipping] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const handleChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  // =========================
  // Payment
  // =========================
  const payNow = async () => {
    try {
      if (
        !shipping.name ||
        !shipping.phone ||
        !shipping.address ||
        !shipping.city ||
        !shipping.state ||
        !shipping.pincode
      ) {
        return alert("Please fill shipping details");
      }

      const { data } = await createOrder({ items: cart, total });

      const options = {
        key: "rzp_test_SDnDzFj3dA9kmt",
        amount: data.amount,
        currency: "INR",
        order_id: data.id,

        handler: async function (response) {
          try {
            await verifyPayment({
              ...response,
              items: cart.map((item) => ({
                product: item._id,
                title: item.title,
                price: item.price,
                qty: item.qty,
                image: item.image,
              })),
              total,
              shippingInfo: shipping,
            });

            clearCart();
            alert("✅ Order placed successfully");
            navigate("/orders");
          } catch {
            alert("❌ Payment verification failed");
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      alert("❌ Payment initialization failed");
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="min-h-screen bg-[#fdf6ee] px-4 sm:px-6 md:px-12 lg:px-20 py-8 sm:py-12">

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">

        {/* ================= LEFT: SHIPPING ================= */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-md">

          <h2 className="text-lg sm:text-xl font-bold mb-4 text-[#5e3e2d]">
            🚚 Shipping Details
          </h2>

          <div className="space-y-3">

            <input
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              className="border p-2.5 w-full rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-[#8c5a3c]"
            />

            <input
              name="phone"
              placeholder="Mobile Number"
              onChange={handleChange}
              className="border p-2.5 w-full rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-[#8c5a3c]"
            />

            <textarea
              name="address"
              placeholder="Full Address"
              onChange={handleChange}
              className="border p-2.5 w-full rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-[#8c5a3c]"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                name="city"
                placeholder="City"
                onChange={handleChange}
                className="border p-2.5 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-[#8c5a3c]"
              />

              <input
                name="state"
                placeholder="State"
                onChange={handleChange}
                className="border p-2.5 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-[#8c5a3c]"
              />
            </div>

            <input
              name="pincode"
              placeholder="Pincode"
              onChange={handleChange}
              className="border p-2.5 w-full rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-[#8c5a3c]"
            />
          </div>
        </div>

        {/* ================= RIGHT: SUMMARY ================= */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-md flex flex-col">

          <h2 className="text-lg sm:text-xl font-bold mb-4 text-[#5e3e2d]">
            🛒 Order Summary
          </h2>

          <div className="space-y-2 text-sm sm:text-base flex-grow">

            {cart.map((item) => (
              <div
                key={item._id}
                className="flex justify-between"
              >
                <span className="line-clamp-1">
                  {item.title} × {item.qty}
                </span>

                <span>₹ {item.price * item.qty}</span>
              </div>
            ))}

          </div>

          <hr className="my-4" />

          <h3 className="text-base sm:text-lg font-semibold mb-4">
            Total: ₹ {total}
          </h3>

          <button
            onClick={payNow}
            className="w-full bg-[#355e3b] hover:bg-[#24492b] text-white py-3 rounded-xl text-sm sm:text-base font-semibold transition-all active:scale-95"
          >
            Pay Now
          </button>

        </div>
      </div>
    </div>
  );
}
