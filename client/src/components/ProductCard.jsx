import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const outOfStock = product.stock <= 0;

  return (
    <div
      className={`
        bg-white rounded-2xl shadow-md p-4 sm:p-5 relative
        transition-all duration-300 h-full flex flex-col
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
          className="h-36 sm:h-44 w-full object-cover rounded-xl"
        />

        {/* STOCK BADGE */}
        <span
          className={`
            absolute top-2 left-2 text-[10px] sm:text-xs px-2 py-1 rounded-full text-white
            ${outOfStock ? "bg-red-500" : "bg-green-600"}
          `}
        >
          {outOfStock
            ? "Out of Stock"
            : `${product.stock} left`}
        </span>
      </div>

      {/* CONTENT */}
      <div className="mt-3 sm:mt-4 flex flex-col flex-grow">

        <h3 className="font-semibold text-[#355e3b] text-sm sm:text-lg line-clamp-2">
          {product.title}
        </h3>

        <p className="text-[#8c5a3c] font-bold text-base sm:text-lg mt-1">
          ₹ {product.price}
        </p>

        {/* Spacer pushes button to bottom */}
        <div className="flex-grow"></div>

        {/* ADD TO CART */}
        <button
          disabled={outOfStock}
          onClick={() => addToCart(product)}
          className={`
            mt-3 sm:mt-4 w-full py-2 rounded-lg font-semibold text-sm sm:text-base
            transition-all duration-200
            ${outOfStock
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-[#8c5a3c] text-white hover:bg-[#6f452f] active:scale-95"}
          `}
        >
          {outOfStock ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
