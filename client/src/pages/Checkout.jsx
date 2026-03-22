import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { createOrder, verifyPayment } from "../services/orderService";

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, total, clearCart } = useCart();

  // =========================
  // 🔹 Shipping form state
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
  // 🔹 Razorpay Payment
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

      // Step 1 — create razorpay order
      const { data } = await createOrder({ items: cart, total });

      const options = {
        key: "rzp_test_SDnDzFj3dA9kmt",
        amount: data.amount,
        currency: "INR",
        order_id: data.id,

        handler: async function (response) {
          try {
            // Step 2 — verify payment + save order
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
              shippingInfo: shipping, // ✅ NEW
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
  // 🔹 UI
  // =========================
  return (
    <div className="max-w-4xl mx-auto p-6 grid md:grid-cols-2 gap-8">

      {/* LEFT — Shipping */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-bold mb-4">🚚 Shipping Details</h2>

        <input
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        />

        <input
          name="phone"
          placeholder="Mobile Number"
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        />

        <textarea
          name="address"
          placeholder="Full Address"
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        />

        <div className="grid grid-cols-2 gap-3">
          <input
            name="city"
            placeholder="City"
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            name="state"
            placeholder="State"
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>

        <input
          name="pincode"
          placeholder="Pincode"
          onChange={handleChange}
          className="border p-2 w-full mt-3 rounded"
        />
      </div>


      {/* RIGHT — Summary */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-bold mb-4">🛒 Order Summary</h2>

        {cart.map((item) => (
          <div
            key={item._id}
            className="flex justify-between mb-2 text-sm"
          >
            <span>{item.title} × {item.qty}</span>
            <span>₹ {item.price * item.qty}</span>
          </div>
        ))}

        <hr className="my-4" />

        <h3 className="text-lg font-semibold mb-4">
          Total: ₹ {total}
        </h3>

        <button
          onClick={payNow}
          className="bg-green-900 text-white w-full py-3 rounded-xl hover:bg-green-800 transition"
        >
          Pay Now
        </button>
      </div>
    </div>
  );
}
