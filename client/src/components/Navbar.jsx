// import { Link } from "react-router-dom";
// import { useCart } from "../context/CartContext";
// import { useAuth } from "../context/AuthContext";

// export default function Navbar() {
//   const { cart } = useCart();
//   const { user, logout } = useAuth();

//   return (
//     <nav className="bg-brand-dark text-white px-8 py-4 flex justify-between items-center shadow-md">

//       <Link to="/" className="text-2xl font-bold tracking-wide">
//         🌿 Sattva Siddhi
//       </Link>

//       <div className="flex gap-6 items-center">
//         <Link to="/products">Products</Link>
//         <Link to="/cart">Cart ({cart.length})</Link>

//         {user ? (
//           <>
//             <Link to="/orders">Orders</Link>
//             {user.role === "admin" && <Link to="/admin">Admin</Link>}
//             <button
//               onClick={logout}
//               className="bg-white text-brand-dark px-3 py-1 rounded"
//             >
//               Logout
//             </button>
//           </>
//         ) : (
//           <Link to="/login">Login</Link>
//         )}
//       </div>
//     </nav>
//   );
// }



import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { cart } = useCart();
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-[#fdf6ee]/95 backdrop-blur border-b border-[#eadfd3] shadow-sm">

      <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-serif font-bold text-[#5e3e2d] tracking-wide hover:opacity-80 transition"
        >
          🌿 Sattva Siddhi
        </Link>

        {/* Links */}
        <div className="flex items-center gap-8 text-[#b07958] font-medium">

          <Link
            to="/"
            className="hover:text-[#8c5a3c] transition"
          >
            Home
          </Link>

          <Link
            to="/products"
            className="hover:text-[#8c5a3c] transition"
          >
            Products
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="relative hover:text-[#8c5a3c] transition"
          >
            Cart

            {cart.length > 0 && (
              <span className="absolute -top-2 -right-4 bg-[#8c5a3c] text-white text-xs px-2 py-0.5 rounded-full">
                {cart.length}
              </span>
            )}
          </Link>

          {user ? (
            <>
              <Link
                to="/orders"
                className="hover:text-[#8c5a3c] transition"
              >
                Orders
              </Link>

              {user.role === "admin" && (
                <Link
                  to="/admin"
                  className="hover:text-[#8c5a3c] transition"
                >
                  Admin
                </Link>
              )}

              <button
                onClick={logout}
                className="ml-2 bg-[#8c5a3c] hover:bg-[#6f452f] text-white px-4 py-1.5 rounded-full shadow-sm transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-[#355e3b] hover:bg-[#24492b] text-white px-4 py-1.5 rounded-full shadow-sm transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
