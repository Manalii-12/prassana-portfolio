"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { useAdminTheme } from "@/context/AdminThemeContext";
import ImageUpload from "@/components/ImageUpload";
import {
  Layers,
  Save,
  CheckCircle2,
  AlertCircle,
  Eye,
  Film,
  Video,
  Sparkles,
  ArrowUpRight,
  RotateCw,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AdminExplore() {
  const { isDark } = useAdminTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    heading: "Explore My Work",
    subheading: "Portfolio",
    commercial_title: "Commercial Projects",
    commercial_subtitle: "Brand Campaigns & Directed Films",
    commercial_image: "/images/commercial.jpg",
    personal_title: "Personal Projects",
    personal_subtitle: "Documentaries & Narrative Stories",
    personal_image: "/images/personal.jpg",
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/explore`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.commercial_title) {
          setForm(data);
        }
      }
    } catch (err) {
      console.error("Failed to load explore data:", err);
      setError("Cannot load explore settings from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setSaving(true);

    try {
      const res = await fetch(`${API_BASE}/api/explore`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "Explore section updated successfully!");
      } else {
        setError(data.message || "Failed to update explore section");
      }
    } catch (err) {
      console.error(err);
      setError("Server connection error.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-[3px] text-orange-500 font-bold">
                Homepage Showcase Section
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-500 uppercase">
                Explore My Work CMS
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-current mt-1">
              Customize &ldquo;Explore My Work&rdquo; Section
            </h1>
            <p className="text-xs sm:text-sm opacity-60 mt-1">
              Edit the section title, cover images, and descriptions for both Commercial & Personal showcase cards.
            </p>
          </div>

          <button
            onClick={loadData}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition border cursor-pointer ${
              isDark
                ? "bg-[#182033] hover:bg-[#202b44] text-gray-200 border-gray-700"
                : "bg-white hover:bg-slate-100 text-slate-700 border-slate-300 shadow-sm"
            }`}
          >
            <RotateCw size={13} />
            <span>Reset / Reload</span>
          </button>
        </div>

        {/* Notifications */}
        {message && (
          <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 text-xs font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span>{message}</span>
            </div>
            <button onClick={() => setMessage("")} className="hover:opacity-75">✕</button>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-500 text-xs font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
            <button onClick={() => setError("")} className="hover:opacity-75">✕</button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section Titles Settings */}
          <div
            className={`p-6 sm:p-8 rounded-3xl border transition-all ${
              isDark ? "bg-[#141A26] border-gray-800 shadow-xl" : "bg-white border-slate-200 shadow-sm"
            }`}
          >
            <h2 className="text-base font-bold text-current mb-4 flex items-center gap-2">
              <Sparkles size={16} className="text-orange-500" />
              <span>Section Heading & Subheading</span>
            </h2>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase font-bold opacity-75 mb-1.5">
                  Section Main Heading
                </label>
                <input
                  type="text"
                  name="heading"
                  value={form.heading}
                  onChange={handleChange}
                  placeholder="Explore My Work"
                  className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium border outline-none transition ${
                    isDark
                      ? "bg-[#182033] border-gray-700 text-white focus:border-orange-500"
                      : "bg-slate-50 border-slate-300 text-slate-900 focus:border-orange-500"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold opacity-75 mb-1.5">
                  Small Tag / Subheading
                </label>
                <input
                  type="text"
                  name="subheading"
                  value={form.subheading}
                  onChange={handleChange}
                  placeholder="Portfolio"
                  className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium border outline-none transition ${
                    isDark
                      ? "bg-[#182033] border-gray-700 text-white focus:border-orange-500"
                      : "bg-slate-50 border-slate-300 text-slate-900 focus:border-orange-500"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Cards Customization Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Commercial Card Settings */}
            <div
              className={`p-6 sm:p-8 rounded-3xl border transition-all space-y-4 ${
                isDark ? "bg-[#141A26] border-gray-800 shadow-xl" : "bg-white border-slate-200 shadow-sm"
              }`}
            >
              <div className="flex items-center gap-2 pb-3 border-b border-inherit">
                <div className="p-2 rounded-xl bg-blue-500/15 text-blue-500">
                  <Film size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-current">Commercial Projects Card</h3>
                  <p className="text-[11px] opacity-60">Shown on the left of &ldquo;Explore My Work&rdquo;</p>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-bold opacity-75 mb-1.5">
                  Card Title
                </label>
                <input
                  type="text"
                  name="commercial_title"
                  value={form.commercial_title}
                  onChange={handleChange}
                  placeholder="Commercial Projects"
                  className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium border outline-none transition ${
                    isDark
                      ? "bg-[#182033] border-gray-700 text-white focus:border-orange-500"
                      : "bg-slate-50 border-slate-300 text-slate-900 focus:border-orange-500"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold opacity-75 mb-1.5">
                  Card Subtitle / Description
                </label>
                <textarea
                  name="commercial_subtitle"
                  rows={2}
                  value={form.commercial_subtitle}
                  onChange={handleChange}
                  placeholder="Brand campaigns & directed films"
                  className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium border outline-none transition ${
                    isDark
                      ? "bg-[#182033] border-gray-700 text-white focus:border-orange-500"
                      : "bg-slate-50 border-slate-300 text-slate-900 focus:border-orange-500"
                  }`}
                />
              </div>

              <ImageUpload
                label="Commercial Cover Image"
                value={form.commercial_image}
                onChange={(url) => setForm({ ...form, commercial_image: url })}
                helperText="Upload commercial card cover image (JPG, PNG, WebP up to 15MB)"
                presetOptions={[
                  { label: "Preset: commercial.jpg", value: "/images/commercial.jpg" },
                  { label: "Preset: hero.png", value: "/images/hero.png" },
                ]}
              />

              {/* Preview Box */}
              <div className="pt-2">
                <span className="text-[10px] uppercase font-bold text-orange-500 flex items-center gap-1 mb-2">
                  <Eye size={12} />
                  <span>Card Preview</span>
                </span>
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-black border border-white/10 shadow-lg">
                  <img
                    src={form.commercial_image || "/images/commercial.jpg"}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h4 className="designer-font text-white text-xl uppercase tracking-tight">{form.commercial_title}</h4>
                    <p className="text-[11px] text-gray-300 line-clamp-1">{form.commercial_subtitle}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Card Settings */}
            <div
              className={`p-6 sm:p-8 rounded-3xl border transition-all space-y-4 ${
                isDark ? "bg-[#141A26] border-gray-800 shadow-xl" : "bg-white border-slate-200 shadow-sm"
              }`}
            >
              <div className="flex items-center gap-2 pb-3 border-b border-inherit">
                <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-500">
                  <Video size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-current">Personal Projects Card</h3>
                  <p className="text-[11px] opacity-60">Shown on the right of &ldquo;Explore My Work&rdquo;</p>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-bold opacity-75 mb-1.5">
                  Card Title
                </label>
                <input
                  type="text"
                  name="personal_title"
                  value={form.personal_title}
                  onChange={handleChange}
                  placeholder="Personal Projects"
                  className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium border outline-none transition ${
                    isDark
                      ? "bg-[#182033] border-gray-700 text-white focus:border-orange-500"
                      : "bg-slate-50 border-slate-300 text-slate-900 focus:border-orange-500"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold opacity-75 mb-1.5">
                  Card Subtitle / Description
                </label>
                <textarea
                  name="personal_subtitle"
                  rows={2}
                  value={form.personal_subtitle}
                  onChange={handleChange}
                  placeholder="Documentaries & narrative stories"
                  className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium border outline-none transition ${
                    isDark
                      ? "bg-[#182033] border-gray-700 text-white focus:border-orange-500"
                      : "bg-slate-50 border-slate-300 text-slate-900 focus:border-orange-500"
                  }`}
                />
              </div>

              <ImageUpload
                label="Personal Cover Image"
                value={form.personal_image}
                onChange={(url) => setForm({ ...form, personal_image: url })}
                helperText="Upload personal card cover image (JPG, PNG, WebP up to 15MB)"
                presetOptions={[
                  { label: "Preset: personal.jpg", value: "/images/personal.jpg" },
                  { label: "Preset: hero.png", value: "/images/hero.png" },
                ]}
              />

              {/* Preview Box */}
              <div className="pt-2">
                <span className="text-[10px] uppercase font-bold text-emerald-500 flex items-center gap-1 mb-2">
                  <Eye size={12} />
                  <span>Card Preview</span>
                </span>
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-black border border-white/10 shadow-lg">
                  <img
                    src={form.personal_image || "/images/personal.jpg"}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h4 className="designer-font text-white text-xl uppercase tracking-tight">{form.personal_title}</h4>
                    <p className="text-[11px] text-gray-300 line-clamp-1">{form.personal_subtitle}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={saving}
            className="w-full py-4 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-lg shadow-orange-500/25 transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving Changes to Database...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Save Explore Section Changes</span>
              </>
            )}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
