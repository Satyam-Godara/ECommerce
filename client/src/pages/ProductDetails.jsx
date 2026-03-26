import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProduct } from "../services/productService";
import { useCart } from "../context/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProduct(id);
        setProduct(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  /* =========================
     LOADING STATE
  ========================= */
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="animate-pulse text-gray-500">
          Loading product...
        </p>
      </div>
    );
  }

  /* =========================
     ERROR STATE
  ========================= */
  if (!product) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl text-[#5e3e2d]">
          Product not found 😢
        </h2>
      </div>
    );
  }

  /* =========================
     MAIN UI
  ========================= */
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10 py-10">

      <div className="grid md:grid-cols-2 gap-10 items-center">

        {/* IMAGE */}
        <div className="flex justify-center">
          <img
            src={product.image}
            alt={product.title}
            className="w-72 sm:w-80 md:w-[400px] rounded-3xl shadow-xl object-cover"
          />
        </div>

        {/* DETAILS */}
        <div className="space-y-5">

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#5e3e2d]">
            {product.title}
          </h1>

          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            {product.description}
          </p>

          {/* PRICE */}
          <div className="flex items-center gap-4">
            <span className="text-2xl sm:text-3xl font-bold text-[#355e3b]">
              ₹ {product.price}
            </span>

            <span className="text-sm text-gray-400 line-through">
              ₹ {Math.round(product.price * 1.3)}
            </span>

            <span className="text-green-600 text-sm font-semibold">
              30% OFF
            </span>
          </div>

          {/* FEATURES */}
          <div className="text-sm text-gray-500 space-y-1">
            <p>✔ 100% Natural Ingredients</p>
            <p>✔ No Chemicals or Preservatives</p>
            <p>✔ Trusted Ayurvedic Formula</p>
          </div>

          {/* BUTTON */}
          <button
            onClick={() => addToCart(product)}
            className="w-full sm:w-auto bg-[#8c5a3c] hover:bg-[#6f452f] text-white px-8 py-3 rounded-full font-semibold shadow-md transition"
          >
            Add to Cart 🛒
          </button>

        </div>
      </div>

      {/* EXTRA SECTION */}
      <div className="mt-16 bg-white rounded-2xl shadow p-6 md:p-8">
        <h2 className="text-xl font-semibold text-[#5e3e2d] mb-4">
          Product Details
        </h2>

        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
          {product.description}
        </p>
      </div>
    </div>
  );
}
