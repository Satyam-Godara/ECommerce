import { useEffect, useState, useCallback } from "react";
import { getProducts } from "../services/productService";
import ProductCard from "../components/ProductCard";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  /* =========================
     Fetch Products
  ========================= */
  const fetchProducts = useCallback(async () => {
    try {
      const res = await getProducts();
      setProducts(res.data);
      setFiltered(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  /* =========================
     Refetch on tab focus
  ========================= */
  useEffect(() => {
    const onFocus = () => fetchProducts();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [fetchProducts]);

  /* =========================
     Search + Sort Logic
  ========================= */
  useEffect(() => {
    let temp = [...products];

    // 🔍 Search
    if (search) {
      temp = temp.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    // 🔽 Sort
    if (sort === "low") {
      temp.sort((a, b) => a.price - b.price);
    } else if (sort === "high") {
      temp.sort((a, b) => b.price - a.price);
    }

    setFiltered(temp);
  }, [search, sort, products]);

  /* =========================
     UI
  ========================= */
  return (
    <div className="bg-[#fdf6ee] min-h-screen px-4 sm:px-8 md:px-16 lg:px-24 py-10 md:py-16">

      {/* HEADER */}
      <div className="text-center mb-10 md:mb-14">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#5e3e2d]">
          Our Ayurvedic Products
        </h2>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          Handcrafted • Natural • Authentic
        </p>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">

        {/* SEARCH */}
        <input
          type="text"
          placeholder="🔍 Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 border border-[#e4d5c6] p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8c5a3c]"
        />

        {/* SORT */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="w-full md:w-48 border border-[#e4d5c6] p-2.5 rounded-lg focus:outline-none"
        >
          <option value="">Sort By</option>
          <option value="low">Price: Low → High</option>
          <option value="high">Price: High → Low</option>
        </select>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="flex justify-center items-center h-[40vh]">
          <p className="text-gray-500 animate-pulse">
            Loading products...
          </p>
        </div>
      ) : filtered.length === 0 ? (
        /* EMPTY STATE */
        <div className="text-center mt-20">
          <h3 className="text-xl text-[#5e3e2d]">
            No products found 😢
          </h3>
          <p className="text-gray-500 mt-2">
            Try adjusting your search
          </p>
        </div>
      ) : (
        /* PRODUCT GRID */
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 md:gap-8">
          {filtered.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}

      {/* FOOTER INFO */}
      <div className="text-center mt-12 text-sm text-gray-500">
        Showing {filtered.length} product(s)
      </div>
    </div>
  );
}
