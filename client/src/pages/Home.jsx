// import { Link } from "react-router-dom";

// export default function Home() {
//   return (
//     <div className="text-center py-24 bg-gradient-to-r from-green-900 to-green-700 text-white">

//       <h1 className="text-5xl font-bold mb-6">
//         Pure Ayurvedic Wellness
//       </h1>

//       <p className="mb-8 text-lg">
//         Natural • Herbal • Authentic
//       </p>

//       <Link
//         to="/products"
//         className="bg-white text-green-900 px-6 py-3 rounded-xl font-semibold"
//       >
//         Shop Now
//       </Link>
//     </div>
//   );
// }



import Products from "./Products.jsx";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
    
    <div className="bg-[#fdf6ee] min-h-screen">

      {/* HERO */}
      <section className="flex flex-col md:flex-row items-center justify-between px-10 md:px-24 py-24 bg-gradient-to-br from-[#fdf6ee] to-[#f2e6d9]">

        {/* Left content */}
        <div className="max-w-xl space-y-6">
          <p className="text-[#8c5a3c] tracking-widest uppercase text-sm font-semibold">
            100% Ayurvedic Wellness
          </p>

          <h1 className="text-5xl md:text-6xl font-serif font-bold text-[#5e3e2d] leading-tight">
            Pure Herbal Care
            <br /> For Mind & Body
          </h1>

          <p className="text-gray-600 text-lg">
            Discover authentic Ayurvedic remedies crafted with nature’s finest
            herbs for glowing skin and better health.
          </p>

          <Link
            to="/products"
            className="inline-block bg-[#8c5a3c] hover:bg-[#6f452f] text-white px-8 py-3 rounded-full font-semibold shadow-md transition"
          >
            Shop Now →
          </Link>
        </div>

        {/* Right image */}
        <img
          src="/pics/kumkumadiAI1.png"
          alt="Ayurveda"
          className="w-80 md:w-96 mt-10 md:mt-0 rounded-3xl shadow-xl"
        />
      </section>


      {/* Categories */}
      <section className="py-20 text-center">
        <h2 className="text-3xl font-semibold text-[#5e3e2d] mb-12">
          Shop by Category
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-10 md:px-32">
          {["Skin Care 🌿", "Wellness 🍯", "Immunity 🛡️", "Body Care 🧴"].map((c) => (
            <div
              key={c}
              className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition cursor-pointer font-medium text-[#355e3b]"
            >
              {c}
            </div>
          ))}
        </div>
      </section>

    </div>
    <Products/>
    </>
  );
}
