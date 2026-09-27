"use client";

import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import Link from "next/link";
import { useAdminTheme } from "@/context/AdminThemeContext";
import ImageUpload from "@/components/ImageUpload";
import {
  Film,
  Video,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { FaInstagram, FaYoutube } from "react-icons/fa";
import { parseVideoUrl } from "@/lib/videoUtils";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ProjectsPage() {
  const { isDark } = useAdminTheme();
  const [form, setForm] = useState({
    type: "commercial",
    title: "",
    category: "",
    youtube_url: "",
    cover_image: "",
    description: "",
    role: "",
    year: "2025",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const setSample = (sample) => {
    setForm(sample);
  };

  const submit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "Project Added Successfully!");
        setForm({
          type: "commercial",
          title: "",
          category: "",
          youtube_url: "",
          cover_image: "",
          description: "",
          role: "",
          year: "2025",
        });
      } else {
        setError(data.message || "Failed to add project");
      }
    } catch (err) {
      console.error(err);
      setError("Server connection error. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-[3px] text-orange-500 font-bold">
                Portfolio CMS
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-500 uppercase">
                New Upload
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-current mt-1">
              Add New Project
            </h1>
            <p className="text-xs sm:text-sm opacity-60 mt-1">
              Upload a commercial brand film or personal artistic narrative to the portfolio.
            </p>
          </div>

          <Link
            href="/admin/manage-projects"
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition border ${
              isDark
                ? "bg-[#182033] hover:bg-[#202b44] text-gray-200 border-gray-700"
                : "bg-white hover:bg-slate-100 text-slate-700 border-slate-300 shadow-sm"
            }`}
          >
            <ArrowLeft size={14} />
            <span>Manage All Projects</span>
          </Link>
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

        {/* Main Card Form */}
        <div
          className={`p-6 sm:p-8 rounded-3xl border transition-all ${
            isDark
              ? "bg-[#141A26] border-gray-800 shadow-xl"
              : "bg-white border-slate-200 shadow-sm"
          }`}
        >
          {/* Quick Examples Fill */}
          <div className="flex justify-between items-center pb-6 border-b border-inherit mb-6">
            <h2 className="text-base font-bold text-current">Project Information</h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  setSample({
                    type: "commercial",
                    title: "Puma - Forever Faster",
                    category: "Brand Campaign",
                    youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                    cover_image: "",
                    description: "High-octane commercial featuring world-class athletes with fast-paced cuts and sound design.",
                    role: "Director & Editor",
                    year: "2025",
                  })
                }
                className="text-[11px] text-orange-500 hover:underline font-semibold cursor-pointer"
              >
                + Commercial Example
              </button>
              <span className="opacity-30">•</span>
              <button
                type="button"
                onClick={() =>
                  setSample({
                    type: "personal",
                    title: "Echoes of the Valley",
                    category: "Short Documentary",
                    youtube_url: "https://www.youtube.com/watch?v=Ne9aVylBJmA",
                    cover_image: "",
                    description: "An intimate cinematic exploration into the remote nomadic lives of high mountain dwellers.",
                    role: "Cinematographer",
                    year: "2024",
                  })
                }
                className="text-[11px] text-emerald-500 hover:underline font-semibold cursor-pointer"
              >
                + Personal Example
              </button>
            </div>
          </div>

          {/* Bento Grid vs More Projects Info Banner */}
          <div className="mb-6 p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-xs flex items-start gap-3">
            <Sparkles size={16} className="text-orange-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-orange-400">
                Automatic Bento Grid & "More Projects" Placement:
              </p>
              <p className="opacity-75 leading-relaxed text-[11px]">
                The first 4 projects of each type (Commercial or Personal) form the signature 4-card Bento Grid. Any additional projects automatically appear in the expandable <strong className="text-white">"More Projects"</strong> section below the grid with the exact same video popup and details!
              </p>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-6">
            {/* Visual Type Selector (Cards) */}
            <div>
              <label className="block text-xs uppercase font-bold opacity-75 mb-2.5">
                Select Project Type *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, type: "commercial" })}
                  className={`p-4 rounded-2xl border text-left transition cursor-pointer flex items-start gap-3 ${
                    form.type === "commercial"
                      ? "border-blue-500 bg-blue-500/10 shadow-sm"
                      : isDark
                      ? "border-gray-800 bg-[#182033]/60 hover:border-gray-700"
                      : "border-slate-200 bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  <div
                    className={`p-2.5 rounded-xl ${
                      form.type === "commercial"
                        ? "bg-blue-500 text-white"
                        : "bg-black/10 dark:bg-white/10 opacity-70"
                    }`}
                  >
                    <Film size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-current">Commercial Project</h4>
                    <p className="text-[11px] opacity-60 mt-0.5">Brand campaigns, TV commercials, client work</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setForm({ ...form, type: "personal" })}
                  className={`p-4 rounded-2xl border text-left transition cursor-pointer flex items-start gap-3 ${
                    form.type === "personal"
                      ? "border-emerald-500 bg-emerald-500/10 shadow-sm"
                      : isDark
                      ? "border-gray-800 bg-[#182033]/60 hover:border-gray-700"
                      : "border-slate-200 bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  <div
                    className={`p-2.5 rounded-xl ${
                      form.type === "personal"
                        ? "bg-emerald-500 text-white"
                        : "bg-black/10 dark:bg-white/10 opacity-70"
                    }`}
                  >
                    <Video size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-current">Personal Project</h4>
                    <p className="text-[11px] opacity-60 mt-0.5">Short films, documentaries, creative experiments</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Title & Category Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase font-bold opacity-75 mb-1.5">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  name="title"
                  placeholder="e.g. Royal Enfield - Machine Love"
                  value={form.title}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium border outline-none transition ${
                    isDark
                      ? "bg-[#182033] border-gray-700 text-white focus:border-orange-500"
                      : "bg-slate-50 border-slate-300 text-slate-900 focus:border-orange-500"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold opacity-75 mb-1.5">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  placeholder="e.g. Brand Commercial or Music Video"
                  value={form.category}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium border outline-none transition ${
                    isDark
                      ? "bg-[#182033] border-gray-700 text-white focus:border-orange-500"
                      : "bg-slate-50 border-slate-300 text-slate-900 focus:border-orange-500"
                  }`}
                />
              </div>
            </div>

            {/* Video URL (YouTube or Instagram Reel) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs uppercase font-bold opacity-75">
                  Video Link (YouTube or Instagram Reel) *
                </label>
                {form.youtube_url && (
                  <span className="text-[10px] font-bold">
                    {parseVideoUrl(form.youtube_url).isReel || parseVideoUrl(form.youtube_url).type === "instagram" ? (
                      <span className="inline-flex items-center gap-1 text-pink-400">
                        <FaInstagram size={11} />
                        <span>Instagram Reel detected</span>
                      </span>
                    ) : parseVideoUrl(form.youtube_url).type === "youtube" ? (
                      <span className="inline-flex items-center gap-1 text-red-400">
                        <FaYoutube size={11} />
                        <span>YouTube Video detected</span>
                      </span>
                    ) : null}
                  </span>
                )}
              </div>
              <input
                type="text"
                required
                name="youtube_url"
                placeholder="https://www.youtube.com/watch?v=... or https://www.instagram.com/reel/..."
                value={form.youtube_url}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium border outline-none transition ${
                  isDark
                    ? "bg-[#182033] border-gray-700 text-white focus:border-orange-500"
                    : "bg-slate-50 border-slate-300 text-slate-900 focus:border-orange-500"
                }`}
              />
              <p className="text-[10px] opacity-50 mt-1">
                Paste any standard YouTube video link or Instagram Reel link. Automatically converted to embed player.
              </p>
            </div>

            {/* Custom Cover Image (Optional - Fallback to Video Thumbnail) */}
            <div className="space-y-1.5">
              <ImageUpload
                label="Custom Cover Image (Optional)"
                value={form.cover_image}
                onChange={(url) => setForm({ ...form, cover_image: url })}
                helperText="Upload custom poster (JPG, PNG, WebP) or leave empty"
              />
              <p className="text-[11px] opacity-60 flex items-center gap-1.5">
                <span className="text-orange-500 font-bold">💡 Automatic Fallback:</span>
                <span>For YouTube, the video thumbnail is used automatically. For Instagram Reels, upload a custom cover or default artwork will appear.</span>
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs uppercase font-bold opacity-75 mb-1.5">
                Project Story / Description
              </label>
              <textarea
                name="description"
                rows={3}
                placeholder="Brief synopsis of the visual style, production background, and creative intent..."
                value={form.description}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium border outline-none transition ${
                  isDark
                    ? "bg-[#182033] border-gray-700 text-white focus:border-orange-500"
                    : "bg-slate-50 border-slate-300 text-slate-900 focus:border-orange-500"
                }`}
              />
            </div>

            {/* Role & Year */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase font-bold opacity-75 mb-1.5">
                  Your Role
                </label>
                <input
                  type="text"
                  name="role"
                  placeholder="e.g. Director & Cinematographer"
                  value={form.role}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium border outline-none transition ${
                    isDark
                      ? "bg-[#182033] border-gray-700 text-white focus:border-orange-500"
                      : "bg-slate-50 border-slate-300 text-slate-900 focus:border-orange-500"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold opacity-75 mb-1.5">
                  Release Year
                </label>
                <input
                  type="text"
                  name="year"
                  placeholder="2025"
                  value={form.year}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium border outline-none transition ${
                    isDark
                      ? "bg-[#182033] border-gray-700 text-white focus:border-orange-500"
                      : "bg-slate-50 border-slate-300 text-slate-900 focus:border-orange-500"
                  }`}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-md shadow-orange-500/25 transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving Project to Database...</span>
                </>
              ) : (
                <>
                  <PlusCircle size={16} />
                  <span>Publish Project to Portfolio</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}