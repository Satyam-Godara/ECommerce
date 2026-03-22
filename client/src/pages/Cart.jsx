// import { useCart } from "../context/CartContext";
// import { Link } from "react-router-dom";

// export default function Cart() {
//   const { cart, removeFromCart, updateQty, total } = useCart();

//   if (cart.length === 0)
//     return <h2>Your cart is empty 🛒</h2>;

//   return (
//     <div>
//       <h2>Your Cart</h2>

//       {cart.map(item => (
//         <div key={item._id} style={{
//           display:"flex",
//           gap:20,
//           marginBottom:10,
//           alignItems:"center"
//         }}>
//           <img src={item.image} width="80" />

//           <h4>{item.title}</h4>

//           <input
//             type="number"
//             value={item.qty}
//             min="1"
//             onChange={(e)=>updateQty(item._id, Number(e.target.value))}
//           />

//           <p>₹ {item.price * item.qty}</p>

//           <button onClick={()=>removeFromCart(item._id)}>
//             Remove
//           </button>
//         </div>
//       ))}

//       <hr />

//       <h3>Total: ₹ {total}</h3>

//       <Link to="/checkout">
//         <button>Proceed to Checkout</button>
//       </Link>
//     </div>
//   );
// }



// import { useCart } from "../context/CartContext";
// import { Link } from "react-router-dom";
// import { useState } from "react";

// export default function Cart() {
//   const { cart, removeFromCart, updateQty, total } = useCart();
//   const [warning, setWarning] = useState("");

//   const handleQtyChange = (item, value) => {
//     const qty = Math.max(1, Number(value));

//     // 🔴 stock validation
//     if (qty > item.stock) {
//       setWarning(`Only ${item.stock} units available for "${item.title}"`);
//       updateQty(item._id, item.stock);
//       return;
//     }

//     setWarning("");
//     updateQty(item._id, qty);
//   };

//   // Empty cart UI
//   if (cart.length === 0) {
//     return (
//       <div className="min-h-screen bg-[#fdf6ee] flex flex-col items-center justify-center text-center">
//         <h2 className="text-3xl font-serif text-[#5e3e2d] mb-4">
//           Your cart is empty 🛒
//         </h2>

//         <Link
//           to="/products"
//           className="bg-[#355e3b] text-white px-6 py-3 rounded-full shadow"
//         >
//           Shop Products
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#fdf6ee] px-8 md:px-24 py-16">

//       {/* Heading */}
//       <h2 className="text-4xl font-serif font-bold text-[#5e3e2d] mb-10">
//         Your Cart
//       </h2>

//       {/* Warning */}
//       {warning && (
//         <div className="mb-6 bg-red-100 text-red-600 px-4 py-2 rounded-lg">
//           {warning}
//         </div>
//       )}

//       {/* Cart Items */}
//       <div className="space-y-6">
//         {cart.map(item => (
//           <div
//             key={item._id}
//             className="bg-white rounded-2xl shadow-md p-5 flex flex-col md:flex-row items-center justify-between gap-6"
//           >

//             {/* Left */}
//             <div className="flex items-center gap-5 w-full md:w-auto">
//               <img
//                 src={item.image}
//                 alt={item.title}
//                 className="w-20 h-20 object-contain rounded-lg"
//               />

//               <div>
//                 <h4 className="font-semibold text-[#355e3b]">
//                   {item.title}
//                 </h4>
//                 <p className="text-sm text-gray-500">
//                   Stock: {item.stock}
//                 </p>
//               </div>
//             </div>

//             {/* Quantity */}
//             <input
//               type="number"
//               value={item.qty}
//               min="1"
//               max={item.stock}
//               onChange={(e) => handleQtyChange(item, e.target.value)}
//               className="border rounded-lg px-3 py-2 w-20 text-center"
//             />

//             {/* Price */}
//             <p className="font-bold text-[#8c5a3c] text-lg">
//               ₹ {item.price * item.qty}
//             </p>

//             {/* Remove */}
//             <button
//               onClick={() => removeFromCart(item._id)}
//               className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
//             >
//               Remove
//             </button>
//           </div>
//         ))}
//       </div>

//       {/* Total Section */}
//       <div className="mt-12 bg-white rounded-2xl shadow-md p-8 flex flex-col md:flex-row justify-between items-center gap-6">

//         <h3 className="text-2xl font-bold text-[#5e3e2d]">
//           Total: ₹ {total}
//         </h3>

//         <Link to="/checkout">
//           <button className="bg-[#8c5a3c] hover:bg-[#6f452f] text-white px-8 py-3 rounded-full font-semibold shadow">
//             Proceed to Checkout →
//           </button>
//         </Link>
//       </div>

//     </div>
//   );
// }



// import { useCart } from "../context/CartContext";
// import { useNavigate } from "react-router-dom";
// import { useState } from "react";
// import axios from "axios";

// export default function Cart() {
//   const { cart, removeFromCart, updateQty, total } = useCart();
//   const [warning, setWarning] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   /* ------------------------------
//      Quantity Logic (+ / - buttons)
//   ------------------------------ */

//   const changeQty = (item, newQty) => {
//     const qty = Math.max(1, newQty);

//     if (qty > item.stock) {
//       setWarning(`Only ${item.stock} units available for "${item.title}"`);
//       updateQty(item._id, item.stock);
//       return;
//     }

//     setWarning("");
//     updateQty(item._id, qty);
//   };

//   /* ------------------------------
//      FINAL STOCK CHECK (CRITICAL)
//   ------------------------------ */

//   const verifyStockAndCheckout = async () => {
//     try {
//       setLoading(true);
//       setWarning("");

//       // call backend to re-check stock
//       const res = await axios.post("http://localhost:5000/api/products/check-stock", {
//         items: cart.map(i => ({
//           id: i._id,
//           qty: i.qty
//         }))
//       });

//       if (!res.data.ok) {
//         setWarning(res.data.message);
//         return;
//       }

//       // safe → go to checkout
//       navigate("/checkout");

//     } catch (err) {
//       setWarning("Stock verification failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ------------------------------
//      EMPTY CART
//   ------------------------------ */

//   if (cart.length === 0) {
//     return (
//       <div className="min-h-screen bg-[#fdf6ee] flex items-center justify-center">
//         <h2 className="text-3xl font-serif text-[#5e3e2d]">
//           Your cart is empty 
//           {/* <FontAwesomeIcon icon={byPrefixAndName.fas['cart-shopping']} /> */}
//         </h2>
//       </div>
//     );
//   }

//   /* ------------------------------
//      UI
//   ------------------------------ */

//   return (
//     <div className="min-h-screen bg-[#fdf6ee] px-8 md:px-24 py-16">

//       <h2 className="text-4xl font-serif font-bold text-[#5e3e2d] mb-10">
//         Your Cart
//       </h2>

//       {warning && (
//         <div className="mb-6 bg-red-100 text-red-600 px-4 py-2 rounded-lg">
//           {warning}
//         </div>
//       )}

//       {/* ITEMS */}
//       <div className="space-y-6">
//         {cart.map(item => (
//           <div
//             key={item._id}
//             className="bg-white rounded-2xl shadow-md p-5 flex flex-col md:flex-row items-center justify-between gap-6"
//           >

//             {/* LEFT */}
//             <div className="flex items-center gap-5">
//               <img
//                 src={item.image}
//                 alt={item.title}
//                 className="w-20 h-20 object-contain rounded-lg"
//               />

//               <div>
//                 <h4 className="font-semibold text-[#355e3b]">
//                   {item.title}
//                 </h4>
//                 <p className="text-sm text-gray-500">
//                   Stock: {item.stock}
//                 </p>
//               </div>
//             </div>

//             {/* QUANTITY STEPPER */}
//             <div className="flex items-center border rounded-lg overflow-hidden">

//               <button
//                 onClick={() => changeQty(item, item.qty - 1)}
//                 className="px-3 py-2 bg-[#f2e6d9] hover:bg-[#ead9c8]"
//               >
//                 −
//               </button>

//               <input
//                 type="number"
//                 value={item.qty}
//                 min="1"
//                 max={item.stock}
//                 onChange={(e) =>
//                   changeQty(item, Number(e.target.value))
//                 }
//                 className="w-14 text-center outline-none"
//               />

//               <button
//                 onClick={() => changeQty(item, item.qty + 1)}
//                 className="px-3 py-2 bg-[#f2e6d9] hover:bg-[#ead9c8]"
//               >
//                 +
//               </button>

//             </div>

//             {/* PRICE */}
//             <p className="font-bold text-[#8c5a3c] text-lg">
//               ₹ {item.price * item.qty}
//             </p>

//             {/* REMOVE */}
//             <button
//               onClick={() => removeFromCart(item._id)}
//               className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
//             >
//               Remove
//             </button>
//           </div>
//         ))}
//       </div>

//       {/* TOTAL + CHECKOUT */}
//       <div className="mt-12 bg-white rounded-2xl shadow-md p-8 flex flex-col md:flex-row justify-between items-center gap-6">

//         <h3 className="text-2xl font-bold text-[#5e3e2d]">
//           Total: ₹ {total}
//         </h3>

//         <button
//           onClick={verifyStockAndCheckout}
//           disabled={loading}
//           className="bg-[#8c5a3c] hover:bg-[#6f452f] text-white px-8 py-3 rounded-full font-semibold shadow disabled:opacity-60"
//         >
//           {loading ? "Checking stock..." : "Proceed to Checkout →"}
//         </button>
//       </div>

//     </div>
//   );
// }



import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

export default function Cart() {
  const { cart, removeFromCart, updateQty, total } = useCart();
  const { user } = useAuth(); // ⭐ NEW (token source)
  const [warning, setWarning] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  /* ------------------------------
     Quantity Logic (+ / - buttons)
  ------------------------------ */

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

  /* ------------------------------
     FINAL STOCK CHECK (CRITICAL)
  ------------------------------ */

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
          // ⭐ backend expects product + qty
          items: cart.map(i => ({
            product: i._id,
            qty: i.qty,
          })),
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`, // ⭐ FIX
          },
        }
      );

      if (!res.data.ok) {
        setWarning(res.data.message);
        return;
      }

      // safe → go to checkout
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

  /* ------------------------------
     EMPTY CART
  ------------------------------ */

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#fdf6ee] flex items-center justify-center">
        <h2 className="text-3xl font-serif text-[#5e3e2d]">
          Your cart is empty 🛒
        </h2>
      </div>
    );
  }

  /* ------------------------------
     UI
  ------------------------------ */

  return (
    <div className="min-h-screen bg-[#fdf6ee] px-8 md:px-24 py-16">

      <h2 className="text-4xl font-serif font-bold text-[#5e3e2d] mb-10">
        Your Cart
      </h2>

      {warning && (
        <div className="mb-6 bg-red-100 text-red-600 px-4 py-2 rounded-lg">
          {warning}
        </div>
      )}

      {/* ITEMS */}
      <div className="space-y-6">
        {cart.map(item => (
          <div
            key={item._id}
            className="bg-white rounded-2xl shadow-md p-5 flex flex-col md:flex-row items-center justify-between gap-6"
          >

            {/* LEFT */}
            <div className="flex items-center gap-5">
              <img
                src={item.image}
                alt={item.title}
                className="w-20 h-20 object-contain rounded-lg"
              />

              <div>
                <h4 className="font-semibold text-[#355e3b]">
                  {item.title}
                </h4>
                <p className="text-sm text-gray-500">
                  Stock: {item.stock}
                </p>
              </div>
            </div>

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
                className="w-14 text-center outline-none"
              />

              <button
                onClick={() => changeQty(item, item.qty + 1)}
                className="px-3 py-2 bg-[#f2e6d9] hover:bg-[#ead9c8]"
              >
                +
              </button>

            </div>

            {/* PRICE */}
            <p className="font-bold text-[#8c5a3c] text-lg">
              ₹ {item.price * item.qty}
            </p>

            {/* REMOVE */}
            <button
              onClick={() => removeFromCart(item._id)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* TOTAL */}
      <div className="mt-12 bg-white rounded-2xl shadow-md p-8 flex flex-col md:flex-row justify-between items-center gap-6">

        <h3 className="text-2xl font-bold text-[#5e3e2d]">
          Total: ₹ {total}
        </h3>

        <button
          onClick={verifyStockAndCheckout}
          disabled={loading}
          className="bg-[#8c5a3c] hover:bg-[#6f452f] text-white px-8 py-3 rounded-full font-semibold shadow disabled:opacity-60"
        >
          {loading ? "Checking stock..." : "Proceed to Checkout →"}
        </button>
      </div>

    </div>
  );
}
