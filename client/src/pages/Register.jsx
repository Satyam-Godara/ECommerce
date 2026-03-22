import { useState } from "react";
import { register } from "../services/authService";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    const res = await register(form);
    localStorage.setItem("user", JSON.stringify(res.data));

    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fdf6ee] to-[#f2e6d9]">

      <form
        onSubmit={submit}
        className="bg-white w-[380px] p-10 rounded-3xl shadow-xl space-y-5"
      >
        <h2 className="text-3xl font-serif text-[#5e3e2d] text-center">
          Create Account
        </h2>

        <input
          placeholder="Full Name"
          className="w-full border border-[#e4d5c6] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8c5a3c]"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Email"
          className="w-full border border-[#e4d5c6] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8c5a3c]"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border border-[#e4d5c6] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8c5a3c]"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="w-full bg-[#8c5a3c] hover:bg-[#6f452f] text-white py-3 rounded-lg font-semibold transition">
          Register
        </button>

        <p className="text-center text-sm text-gray-600">
          Already registered?{" "}
          <Link to="/login" className="text-[#355e3b] font-semibold">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}