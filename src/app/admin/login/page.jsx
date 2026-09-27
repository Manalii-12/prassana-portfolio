"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sun, Moon, ArrowLeft, Lock, Mail, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AdminLogin() {
  const router = useRouter();
  const [theme, setTheme] = useState("dark");
  const [form, setForm] = useState({
    email: "admin@gmail.com",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedTheme = localStorage.getItem("admin_theme") || "dark";
    setTheme(savedTheme);

    const token = localStorage.getItem("token");
    if (token) {
      router.replace("/admin/dashboard");
    }
  }, [router]);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("admin_theme", newTheme);
  };

  const isDark = theme === "dark";

  const login = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        router.push("/admin/dashboard");
      } else {
        setError(data.message || "Invalid email or password.");
      }
    } catch (err) {
      console.error(err);
      setError("Cannot reach backend server. Please verify backend is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-center items-center px-4 relative overflow-hidden transition-colors duration-200 ${
        isDark ? "bg-[#07090E] text-white" : "bg-slate-100 text-slate-900"
      }`}
    >
      {/* Top Controls Bar */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-20 max-w-6xl mx-auto">
        <Link
          href="/"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
            isDark
              ? "bg-gray-800/80 hover:bg-gray-700 text-gray-300 border-gray-700"
              : "bg-white hover:bg-slate-50 text-slate-700 border-slate-300 shadow-sm"
          }`}
        >
          <ArrowLeft size={14} />
          <span>Back to Portfolio</span>
        </Link>

        <button
          onClick={toggleTheme}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition border cursor-pointer ${
            isDark
              ? "bg-[#182033] hover:bg-[#202b44] text-amber-300 border-gray-700"
              : "bg-white hover:bg-slate-50 text-slate-700 border-slate-300 shadow-sm"
          }`}
        >
          {isDark ? (
            <>
              <Sun size={14} className="text-amber-400" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon size={14} className="text-slate-600" />
              <span>Dark Mode</span>
            </>
          )}
        </button>
      </div>

      {/* Glow effect */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Login Card */}
      <div
        className={`w-full max-w-md rounded-3xl p-8 border relative z-10 transition-all shadow-2xl ${
          isDark
            ? "bg-[#111622]/90 border-gray-800 backdrop-blur-xl"
            : "bg-white border-slate-200"
        }`}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-orange-500/15 text-orange-500 mb-3 border border-orange-500/25">
            <Sparkles size={11} />
            <span>PRASANNA CMS</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-current">Admin Portal</h1>
          <p className="text-xs opacity-60 mt-1">Sign in to manage hero banners and video works</p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-red-500/15 border border-red-500/30 rounded-2xl text-red-500 text-xs font-semibold flex items-center gap-2">
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={login} className="space-y-4">
          <div>
            <label className="block text-xs uppercase font-bold opacity-75 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none"
              />
              <input
                type="email"
                required
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-medium border outline-none transition ${
                  isDark
                    ? "bg-[#182033] border-gray-700 text-white focus:border-orange-500"
                    : "bg-slate-50 border-slate-300 text-slate-900 focus:border-orange-500"
                }`}
                placeholder="admin@gmail.com"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase font-bold opacity-75 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none"
              />
              <input
                type="password"
                required
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-medium border outline-none transition ${
                  isDark
                    ? "bg-[#182033] border-gray-700 text-white focus:border-orange-500"
                    : "bg-slate-50 border-slate-300 text-slate-900 focus:border-orange-500"
                }`}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-md shadow-orange-500/25 transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Signing In...</span>
              </>
            ) : (
              <span>Sign In to Admin Dashboard →</span>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-inherit text-center">
          <p className="text-xs opacity-60">
            Default credentials:{" "}
            <span className="font-mono font-bold text-orange-500">admin@gmail.com</span> /{" "}
            <span className="font-mono font-bold text-orange-500">admin123</span>
          </p>
        </div>
      </div>
    </div>
  );
}