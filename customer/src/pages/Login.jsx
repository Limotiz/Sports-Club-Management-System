import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await login(formData.email, formData.password);
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <section className="min-h-[85vh] flex items-center justify-center px-6 py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl"
      >
        <h1 className="text-3xl font-black text-white mb-2">Welcome back</h1>

        <p className="text-slate-400 mb-8">
          Login to manage your sports club.
        </p>

        <label className="block text-sm text-slate-300 mb-2">Email</label>
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 mb-5 outline-none focus:border-emerald-500"
          placeholder="Enter your email"
        />

        <label className="block text-sm text-slate-300 mb-2">Password</label>
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 mb-6 outline-none focus:border-emerald-500"
          placeholder="Enter your password"
        />

        <button className="w-full bg-emerald-500 text-slate-950 py-3 rounded-xl font-bold hover:bg-emerald-400">
          Login
        </button>

        <p className="text-center text-slate-400 mt-6">
          No account?{" "}
          <Link to="/register" className="text-emerald-400 font-semibold">
            Register
          </Link>
        </p>
      </form>
    </section>
  );
}

export default Login;