import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { cart } = useCart();
  const { user, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#fdf6ee]/95 backdrop-blur border-b border-[#eadfd3] shadow-sm">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-3 sm:py-4 flex justify-between items-center">

        {/* Logo */}
        <Link
          to="/"
          className="text-lg sm:text-2xl font-serif font-bold text-[#5e3e2d] tracking-wide"
        >
          🌿 Sattva Siddhi
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-[#b07958] font-medium">

          <Link to="/" className="hover:text-[#8c5a3c] transition">
            Home
          </Link>

          <Link to="/products" className="hover:text-[#8c5a3c] transition">
            Products
          </Link>

          <Link to="/cart" className="relative hover:text-[#8c5a3c] transition">
            Cart
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-4 bg-[#8c5a3c] text-white text-xs px-2 py-0.5 rounded-full">
                {cart.length}
              </span>
            )}
          </Link>

          {user ? (
            <>
              <Link to="/orders" className="hover:text-[#8c5a3c] transition">
                Orders
              </Link>

              {user.role === "admin" && (
                <Link to="/admin" className="hover:text-[#8c5a3c] transition">
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

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-[#5e3e2d] text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-3 text-[#5e3e2d] font-medium bg-[#fdf6ee] border-t border-[#eadfd3]">

          <Link to="/" onClick={() => setMenuOpen(false)} className="block">
            Home
          </Link>

          <Link to="/products" onClick={() => setMenuOpen(false)} className="block">
            Products
          </Link>

          <Link to="/cart" onClick={() => setMenuOpen(false)} className="block">
            Cart ({cart.length})
          </Link>

          {user ? (
            <>
              <Link to="/orders" onClick={() => setMenuOpen(false)} className="block">
                Orders
              </Link>

              {user.role === "admin" && (
                <Link to="/admin" onClick={() => setMenuOpen(false)} className="block">
                  Admin
                </Link>
              )}

              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="w-full text-left bg-[#8c5a3c] text-white px-4 py-2 rounded-lg"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="block bg-[#355e3b] text-white px-4 py-2 rounded-lg text-center"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
