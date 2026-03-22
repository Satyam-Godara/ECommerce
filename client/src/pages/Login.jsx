// import { useState } from "react";
// import { login } from "../services/authService";
// import { useAuth } from "../context/AuthContext";
// import { Link } from "react-router-dom";

// export default function Login() {
//   const [form, setForm] = useState({ email:"", password:"" });

//   const { login: setAuth } = useAuth();

//   const submit = async (e) => {
//   e.preventDefault();
//   const res = await login(form);

//   setAuth(res.data);
// };

//   return (
//     <>
//     <form onSubmit={submit}>
//       <input placeholder="Email"
//         onChange={e=>setForm({...form,email:e.target.value})} />

//       <input type="password" placeholder="Password"
//         onChange={e=>setForm({...form,password:e.target.value})} />

//       <button>Login</button>
//     </form>
//     <Link to="/register">New User? Register</Link>
//     </>
//   );
// }

import { useState } from "react";
import { login } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login: setAuth } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    try {
      const res = await login(form);
      setAuth(res.data);
      navigate("/products");
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fdf6ee] to-[#f2e6d9]">

      <form
        onSubmit={submit}
        className="bg-white w-[380px] p-10 rounded-3xl shadow-xl space-y-5"
      >
        <h2 className="text-3xl font-serif text-[#5e3e2d] text-center">
          Welcome Back
        </h2>

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
          Login
        </button>

        <p className="text-center text-sm text-gray-600">
          New here?{" "}
          <Link to="/register" className="text-[#355e3b] font-semibold">
            Create Account
          </Link>
        </p>
      </form>
    </div>
  );
}