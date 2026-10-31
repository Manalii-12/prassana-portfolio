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
  FolderKanban,
  FileText,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const CACHE_EXPLORE_KEY = "prasanna_cached_explore_data_v2";
const CACHE_COMMERCIAL_KEY = "prasanna_cached_commercial_header_v1";
const CACHE_PERSONAL_KEY = "prasanna_cached_personal_header_v1";

export default function AdminExplore() {
  const { isDark } = useAdminTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    // Homepage Section (Image 3)
    heading: "Explore My Work",
    subheading: "PORTFOLIO",
    commercial_title: "Commercial Projects",
    commercial_subtitle: "",
    commercial_image: "/images/commercial.jpg",
    personal_title: "Passion Projects",
    personal_subtitle: "",
    personal_image: "/images/personal.jpg",

    // Commercial Showcase Page Header (Image 1)
    commercial_page_badge: "Commercial Showcase",
    commercial_page_subtitle: "Brand Films & Commercials",
    commercial_page_title: "Commercial Projects",
    commercial_page_description:
      "High-impact brand campaigns, automotive reels, and directed commercial films created for TV & digital screens.",

    // Personal Showcase Page Header (Image 2)
    personal_page_badge: "Personal Showcase",
    personal_page_subtitle: "Narrative & Documentaries",
    personal_page_title: "Personal Projects",
    personal_page_description:
      "Independent films, culture stories, and personal cinematic journeys captured with raw human emotion.",
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/explore?t=${Date.now()}`, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
      });
      if (res.ok) {
        const data = await res.json();
        if (data && (data.commercial_title || data.heading)) {
          setForm((prev) => ({
            ...prev,
            ...data,
            // Ensure defaults if empty from DB
            commercial_page_badge: data.commercial_page_badge || prev.commercial_page_badge,
            commercial_page_subtitle: data.commercial_page_subtitle || prev.commercial_page_subtitle,
            commercial_page_title: data.commercial_page_title || prev.commercial_page_title,
            commercial_page_description: data.commercial_page_description || prev.commercial_page_description,
            personal_page_badge: data.personal_page_badge || prev.personal_page_badge,
            personal_page_subtitle: data.personal_page_subtitle || prev.personal_page_subtitle,
            personal_page_title: data.personal_page_title || prev.personal_page_title,
            personal_page_description: data.personal_page_description || prev.personal_page_description,
          }));
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
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const syncCaches = (dataToSync) => {
    try {
      localStorage.removeItem("prasanna_cached_explore_data");
      localStorage.setItem(CACHE_EXPLORE_KEY, JSON.stringify(dataToSync));
      localStorage.setItem(CACHE_COMMERCIAL_KEY, JSON.stringify(dataToSync));
      localStorage.setItem(CACHE_PERSONAL_KEY, JSON.stringify(dataToSync));
    } catch (e) {}
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
        setMessage(data.message || "Explore & Showcase settings updated successfully!");
        syncCaches(form);
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
                Portfolio Showcase CMS
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-500 uppercase">
                Explore & Category Headers
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-current mt-1">
              Customize Explore & Showcase Pages
            </h1>
            <p className="text-xs sm:text-sm opacity-60 mt-1">
              Edit the homepage Explore section heading and cards, plus the headers for Commercial and Personal project showcase pages.
            </p>
          </div>

          <button
            onClick={loadData}
            type="button"
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition border cursor-pointer ${
              isDark
                ? "bg-[#182033] hover:bg-[#202b44] text-gray-200 border-gray-700"
                : "bg-white hover:bg-slate-100 text-slate-700 border-slate-300 shadow-sm"
            }`}
          >
            <RotateCw size={13} className={loading ? "animate-spin" : ""} />
            <span>{loading ? "Refreshing..." : "Reset / Reload"}</span>
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
          {/* ============================================================ */}
          {/* SECTION 1: HOMEPAGE "EXPLORE MY WORK" SECTION (IMAGE 3) */}
          {/* ============================================================ */}
          <div
            className={`p-6 sm:p-8 rounded-3xl border transition-all space-y-6 ${
              isDark ? "bg-[#141A26] border-gray-800 shadow-xl" : "bg-white border-slate-200 shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between border-b border-inherit pb-4">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-orange-500/15 text-orange-500">
                  <Sparkles size={18} />
                </span>
                <div>
                  <h2 className="text-base font-bold text-current">
                    1. Homepage Explore Section (Third Image)
                  </h2>
                  <p className="text-[11px] opacity-60">
                    Controls the main title, eyebrow tag, and the two showcase cards on the homepage.
                  </p>
                </div>
              </div>
            </div>

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
                  Eyebrow Tag / Subheading
                </label>
                <input
                  type="text"
                  name="subheading"
                  value={form.subheading}
                  onChange={handleChange}
                  placeholder="PORTFOLIO"
                  className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium border outline-none transition ${
                    isDark
                      ? "bg-[#182033] border-gray-700 text-white focus:border-orange-500"
                      : "bg-slate-50 border-slate-300 text-slate-900 focus:border-orange-500"
                  }`}
                />
              </div>
            </div>

            {/* Two Cards Settings on Homepage */}
            <div className="grid lg:grid-cols-2 gap-6 pt-2">
              {/* Commercial Card on Homepage */}
              <div className="p-5 rounded-2xl border border-inherit space-y-4 bg-inherit/40">
                <div className="flex items-center gap-2">
                  <Film size={16} className="text-blue-500" />
                  <h3 className="font-bold text-xs text-current uppercase tracking-wider">
                    Homepage Commercial Card
                  </h3>
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold opacity-75 mb-1.5">
                    Card Title (Shown on Card Corner)
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

                <ImageUpload
                  label="Card Cover Image"
                  value={form.commercial_image}
                  onChange={(url) => setForm((prev) => ({ ...prev, commercial_image: url }))}
                  helperText="Upload commercial card cover image (JPG, PNG, WebP up to 15MB)"
                  presetOptions={[
                    { label: "Preset: commercial.jpg", value: "/images/commercial.jpg" },
                    { label: "Preset: hero.png", value: "/images/hero.png" },
                  ]}
                />
              </div>

              {/* Personal Card on Homepage */}
              <div className="p-5 rounded-2xl border border-inherit space-y-4 bg-inherit/40">
                <div className="flex items-center gap-2">
                  <Video size={16} className="text-emerald-500" />
                  <h3 className="font-bold text-xs text-current uppercase tracking-wider">
                    Homepage Personal Card
                  </h3>
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold opacity-75 mb-1.5">
                    Card Title (Shown on Card Corner)
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

                <ImageUpload
                  label="Card Cover Image"
                  value={form.personal_image}
                  onChange={(url) => setForm((prev) => ({ ...prev, personal_image: url }))}
                  helperText="Upload personal card cover image (JPG, PNG, WebP up to 15MB)"
                  presetOptions={[
                    { label: "Preset: personal.jpg", value: "/images/personal.jpg" },
                    { label: "Preset: hero.png", value: "/images/hero.png" },
                  ]}
                />
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* SECTION 2: COMMERCIAL SHOWCASE PAGE HEADER (IMAGE 1) */}
          {/* ============================================================ */}
          <div
            className={`p-6 sm:p-8 rounded-3xl border transition-all space-y-6 ${
              isDark ? "bg-[#141A26] border-gray-800 shadow-xl" : "bg-white border-slate-200 shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between border-b border-inherit pb-4">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-blue-500/15 text-blue-500">
                  <Film size={18} />
                </span>
                <div>
                  <h2 className="text-base font-bold text-current">
                    2. Commercial Showcase Page Header (First Image)
                  </h2>
                  <p className="text-[11px] opacity-60">
                    Controls all text on the dedicated <span className="font-mono text-orange-500">/commercial</span> page.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase font-bold opacity-75 mb-1.5">
                  Top-Right Badge Text
                </label>
                <input
                  type="text"
                  name="commercial_page_badge"
                  value={form.commercial_page_badge}
                  onChange={handleChange}
                  placeholder="Commercial Showcase"
                  className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium border outline-none transition ${
                    isDark
                      ? "bg-[#182033] border-gray-700 text-white focus:border-orange-500"
                      : "bg-slate-50 border-slate-300 text-slate-900 focus:border-orange-500"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold opacity-75 mb-1.5">
                  Eyebrow / Subtitle (Above Main Title)
                </label>
                <input
                  type="text"
                  name="commercial_page_subtitle"
                  value={form.commercial_page_subtitle}
                  onChange={handleChange}
                  placeholder="Brand Films & Commercials"
                  className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium border outline-none transition ${
                    isDark
                      ? "bg-[#182033] border-gray-700 text-white focus:border-orange-500"
                      : "bg-slate-50 border-slate-300 text-slate-900 focus:border-orange-500"
                  }`}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs uppercase font-bold opacity-75 mb-1.5">
                  Main Page Heading
                </label>
                <input
                  type="text"
                  name="commercial_page_title"
                  value={form.commercial_page_title}
                  onChange={handleChange}
                  placeholder="Commercial Projects"
                  className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium border outline-none transition ${
                    isDark
                      ? "bg-[#182033] border-gray-700 text-white focus:border-orange-500"
                      : "bg-slate-50 border-slate-300 text-slate-900 focus:border-orange-500"
                  }`}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs uppercase font-bold opacity-75 mb-1.5">
                  Description / Subtext
                </label>
                <textarea
                  name="commercial_page_description"
                  rows={3}
                  value={form.commercial_page_description}
                  onChange={handleChange}
                  placeholder="High-impact brand campaigns, automotive reels, and directed commercial films created for TV & digital screens."
                  className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium border outline-none transition ${
                    isDark
                      ? "bg-[#182033] border-gray-700 text-white focus:border-orange-500"
                      : "bg-slate-50 border-slate-300 text-slate-900 focus:border-orange-500"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* SECTION 3: PERSONAL SHOWCASE PAGE HEADER (IMAGE 2) */}
          {/* ============================================================ */}
          <div
            className={`p-6 sm:p-8 rounded-3xl border transition-all space-y-6 ${
              isDark ? "bg-[#141A26] border-gray-800 shadow-xl" : "bg-white border-slate-200 shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between border-b border-inherit pb-4">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-500/15 text-emerald-500">
                  <Video size={18} />
                </span>
                <div>
                  <h2 className="text-base font-bold text-current">
                    3. Personal Showcase Page Header (Second Image)
                  </h2>
                  <p className="text-[11px] opacity-60">
                    Controls all text on the dedicated <span className="font-mono text-orange-500">/personal</span> page.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase font-bold opacity-75 mb-1.5">
                  Top-Right Badge Text
                </label>
                <input
                  type="text"
                  name="personal_page_badge"
                  value={form.personal_page_badge}
                  onChange={handleChange}
                  placeholder="Personal Showcase"
                  className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium border outline-none transition ${
                    isDark
                      ? "bg-[#182033] border-gray-700 text-white focus:border-orange-500"
                      : "bg-slate-50 border-slate-300 text-slate-900 focus:border-orange-500"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold opacity-75 mb-1.5">
                  Eyebrow / Subtitle (Above Main Title)
                </label>
                <input
                  type="text"
                  name="personal_page_subtitle"
                  value={form.personal_page_subtitle}
                  onChange={handleChange}
                  placeholder="Narrative & Documentaries"
                  className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium border outline-none transition ${
                    isDark
                      ? "bg-[#182033] border-gray-700 text-white focus:border-orange-500"
                      : "bg-slate-50 border-slate-300 text-slate-900 focus:border-orange-500"
                  }`}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs uppercase font-bold opacity-75 mb-1.5">
                  Main Page Heading
                </label>
                <input
                  type="text"
                  name="personal_page_title"
                  value={form.personal_page_title}
                  onChange={handleChange}
                  placeholder="Personal Projects"
                  className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium border outline-none transition ${
                    isDark
                      ? "bg-[#182033] border-gray-700 text-white focus:border-orange-500"
                      : "bg-slate-50 border-slate-300 text-slate-900 focus:border-orange-500"
                  }`}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs uppercase font-bold opacity-75 mb-1.5">
                  Description / Subtext
                </label>
                <textarea
                  name="personal_page_description"
                  rows={3}
                  value={form.personal_page_description}
                  onChange={handleChange}
                  placeholder="Independent films, culture stories, and personal cinematic journeys captured with raw human emotion."
                  className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium border outline-none transition ${
                    isDark
                      ? "bg-[#182033] border-gray-700 text-white focus:border-orange-500"
                      : "bg-slate-50 border-slate-300 text-slate-900 focus:border-orange-500"
                  }`}
                />
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
                <span>Saving All Showcase Changes...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Save All Changes to Live Website</span>
              </>
            )}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
