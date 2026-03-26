import { useState } from "react";
import { login } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const { login: setAuth } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      return alert("Please fill all fields");
    }

    try {
      setLoading(true);
      const res = await login(form);
      setAuth(res.data);
      navigate("/products");
    } catch {
      alert("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[#fdf6ee] to-[#f2e6d9]">

      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden grid md:grid-cols-2">

        {/* LEFT SIDE (Brand Panel) */}
        <div className="hidden md:flex flex-col justify-center items-center bg-[#355e3b] text-white p-10 space-y-4">
          <h1 className="text-3xl lg:text-4xl font-serif font-bold text-center">
            🌿 Sattva Siddhi
          </h1>

          <p className="text-center text-sm lg:text-base text-gray-200">
            Experience the power of Ayurveda with natural skincare
            and wellness products crafted for your body & soul.
          </p>

          <div className="w-32 h-1 bg-white/40 rounded-full"></div>

          <p className="text-xs text-gray-300 text-center">
            Pure • Herbal • Authentic
          </p>
        </div>

        {/* RIGHT SIDE (Form) */}
        <form
          onSubmit={submit}
          className="p-6 sm:p-10 md:p-12 space-y-5 flex flex-col justify-center"
        >
          <h2 className="text-2xl sm:text-3xl font-serif text-[#5e3e2d] text-center md:text-left">
            Welcome Back 👋
          </h2>

          {/* Email */}
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full mt-1 border border-[#e4d5c6] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8c5a3c]"
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-600">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full mt-1 border border-[#e4d5c6] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8c5a3c]"
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <a
              href="#"
              className="text-sm text-[#355e3b] hover:underline"
            >
              Forgot Password?
            </a>
          </div>

          {/* Button */}
          <button
            disabled={loading}
            className="w-full bg-[#8c5a3c] hover:bg-[#6f452f] text-white py-3 rounded-lg font-semibold transition flex justify-center items-center"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-xs text-gray-400">OR</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Register */}
          <p className="text-center text-sm text-gray-600">
            New here?{" "}
            <Link
              to="/register"
              className="text-[#355e3b] font-semibold hover:underline"
            >
              Create Account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
