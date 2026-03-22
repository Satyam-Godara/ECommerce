import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const outOfStock = product.stock <= 0;

  return (
    <div
      className={`
        bg-white rounded-2xl shadow-md p-5 relative
        transition-all duration-300
        ${outOfStock
          ? "opacity-60"
          : "hover:shadow-xl hover:-translate-y-1"}
      `}
    >
      {/* IMAGE */}
      <div className="relative">

        <img
          src={product.image || "/placeholder.png"}
          alt={product.title}
          className="h-44 w-full object-cover rounded-xl"
        />

        {/* STOCK BADGE */}
        <span
          className={`
            absolute top-2 left-2 text-xs px-2 py-1 rounded-full text-white
            ${outOfStock ? "bg-red-500" : "bg-green-600"}
          `}
        >
          {outOfStock
            ? "Out of Stock"
            : `${product.stock} left`}
        </span>
      </div>

      {/* CONTENT */}
      <div className="mt-4">

        <h3 className="font-semibold text-[#355e3b] text-lg line-clamp-2">
          {product.title}
        </h3>

        <p className="text-[#8c5a3c] font-bold text-lg mt-1">
          ₹ {product.price}
        </p>

        {/* ADD TO CART */}
        <button
          disabled={outOfStock}
          onClick={() => addToCart(product)}
          className={`
            mt-4 w-full py-2 rounded-lg font-semibold
            ${outOfStock
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-[#8c5a3c] text-white hover:bg-[#6f452f]"}
          `}
        >
          {outOfStock ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
