import { useEffect, useState, useCallback } from "react";
import { getProducts } from "../services/productService";
import ProductCard from "../components/ProductCard";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     Fetch Products (reusable)
  ========================= */
  const fetchProducts = useCallback(async () => {
    try {
      const res = await getProducts();
      setProducts(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  /* =========================
     Load on mount
  ========================= */
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  /* =========================
     Refresh when tab refocus
     (fix stale stock after checkout)
  ========================= */
  useEffect(() => {
    const onFocus = () => fetchProducts();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [fetchProducts]);

  /* =========================
     UI
  ========================= */
  return (
    <div className="bg-[#fdf6ee] min-h-screen px-8 md:px-20 py-16">

      <div className="text-center mb-14">
        <h2 className="text-4xl font-serif font-bold text-[#5e3e2d]">
          Our Ayurvedic Products
        </h2>
        <p className="text-gray-600 mt-2">
          Handcrafted • Natural • Authentic
        </p>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading products...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {products.map(p => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
