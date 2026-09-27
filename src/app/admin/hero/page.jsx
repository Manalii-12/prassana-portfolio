"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { useAdminTheme } from "@/context/AdminThemeContext";
import ImageUpload from "@/components/ImageUpload";
import {
  Sparkles,
  PlusCircle,
  Trash2,
  Play,
  RotateCw,
  Eye,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  X,
  ExternalLink,
  Pencil,
  Shuffle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { parseVideoUrl } from "@/lib/videoUtils";
import { FaInstagram, FaYoutube } from "react-icons/fa";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AdminHero() {
  const { isDark } = useAdminTheme();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [previewVideoUrl, setPreviewVideoUrl] = useState(null);

  // Edit Modal State
  const [editingBanner, setEditingBanner] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    subtitle: "",
    description: "",
    background_image: "",
    video_url: "",
  });
  const [editLoading, setEditLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    description: "",
    background_image: "",
    video_url: "",
  });

  const loadBanners = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/hero`);
      if (res.ok) {
        const data = await res.json();
        setBanners(data);
      }
    } catch (err) {
      console.error("Failed to load hero banners:", err);
      setError("Failed to load banners from backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const setSampleData = (sample) => {
    setForm(sample);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!form.background_image) {
      setError("Please select or upload a background image for the banner.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/api/hero`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "Hero banner added successfully!");
        setForm({
          title: "",
          subtitle: "",
          description: "",
          background_image: "",
          video_url: "",
        });
        loadBanners();
      } else {
        setError(data.message || "Failed to add banner.");
      }
    } catch (err) {
      console.error(err);
      setError("Server communication error.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Are you sure you want to delete banner "${title || 'this item'}"?`)) return;

    try {
      const res = await fetch(`${API_BASE}/api/hero/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Banner removed successfully.");
        setBanners((prev) => prev.filter((b) => b.id !== id));
      } else {
        alert(data.message || "Failed to delete banner.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting banner.");
    }
  };

  // Reorder: Shuffle Slides
  const handleShuffleBanners = async () => {
    if (banners.length <= 1) return;
    const shuffled = [...banners];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setBanners(shuffled);

    try {
      const res = await fetch(`${API_BASE}/api/hero/reorder`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderedIds: shuffled.map((b) => b.id),
        }),
      });
      if (res.ok) {
        setMessage("Hero slides shuffled successfully! Live homepage updated.");
      }
    } catch (err) {
      console.error("Failed to shuffle hero banners:", err);
    }
  };

  // Reorder: Move Slide Earlier or Later
  const handleMoveSlide = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= banners.length) return;

    const newBanners = [...banners];
    const temp = newBanners[index];
    newBanners[index] = newBanners[targetIndex];
    newBanners[targetIndex] = temp;

    setBanners(newBanners);

    try {
      const res = await fetch(`${API_BASE}/api/hero/reorder`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderedIds: newBanners.map((b) => b.id),
        }),
      });
      if (res.ok) {
        setMessage("Slide order updated! Live homepage carousel updated.");
      }
    } catch (err) {
      console.error("Failed to reorder hero banners:", err);
    }
  };

  // Edit Slide: Open Modal
  const handleEditClick = (banner) => {
    setEditingBanner(banner);
    setEditForm({
      title: banner.title || "",
      subtitle: banner.subtitle || "",
      description: banner.description || "",
      background_image: banner.background_image || "",
      video_url: banner.video_url || "",
    });
  };

  // Edit Slide: Save Changes
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingBanner) return;

    setEditLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/hero/${editingBanner.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || "Hero slide updated successfully!");
        setBanners((prev) =>
          prev.map((b) => (b.id === editingBanner.id ? { ...b, ...editForm } : b))
        );
        setEditingBanner(null);
      } else {
        alert(data.message || "Failed to update hero slide");
      }
    } catch (err) {
      console.error(err);
      alert("Network error: Could not update slide.");
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-[3px] text-orange-500 font-bold">
                Homepage Hero Carousel
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-500 uppercase">
                Royal Enfield Style
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-current mt-1">
              Hero Banners & Watch Videos
            </h1>
            <p className="text-xs sm:text-sm opacity-60 mt-1">
              Add rotating background banners with headlines, taglines, and popup video players.
            </p>
          </div>

          <button
            onClick={loadBanners}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition border cursor-pointer ${
              isDark
                ? "bg-[#182033] hover:bg-[#202b44] text-gray-200 border-gray-700"
                : "bg-white hover:bg-slate-100 text-slate-700 border-slate-300 shadow-sm"
            }`}
          >
            <RotateCw size={13} />
            <span>Refresh List</span>
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

        {/* Top Grid: Form + Live Interactive Preview */}
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Add Banner Form */}
          <div
            className={`lg:col-span-6 p-6 sm:p-8 rounded-3xl border transition-all ${
              isDark
                ? "bg-[#141A26] border-gray-800 shadow-xl"
                : "bg-white border-slate-200 shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-current flex items-center gap-2">
                <PlusCircle size={18} className="text-orange-500" />
                <span>Add Banner Slide</span>
              </h2>
              {/* Quick Fill Sample */}
              <button
                type="button"
                onClick={() =>
                  setSampleData({
                    title: "Royal Enfield - Dil Ka Do Pahiya",
                    subtitle: "AUTOMOTIVE CAMPAIGN",
                    description: "Adventure calls. Machine love delivered with cinematic passion.",
                    background_image: "/images/hero.png",
                    video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                  })
                }
                className="text-[11px] text-orange-500 hover:underline font-semibold cursor-pointer"
              >
                + Fill Example
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title (Optional) */}
              <div>
                <label className="block text-xs uppercase font-bold opacity-75 mb-1.5">
                  Banner Headline (Optional)
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g. Expert Care For Every Ride (or leave blank for clean image)"
                  value={form.title}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium border outline-none transition ${
                    isDark
                      ? "bg-[#182033] border-gray-700 text-white focus:border-orange-500"
                      : "bg-slate-50 border-slate-300 text-slate-900 focus:border-orange-500"
                  }`}
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-xs uppercase font-bold opacity-75 mb-1.5">
                  Category / Subtitle Pill
                </label>
                <input
                  type="text"
                  name="subtitle"
                  placeholder="e.g. ROYAL ENFIELD CAMPAIGN or DIRECTOR REEL"
                  value={form.subtitle}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium border outline-none transition ${
                    isDark
                      ? "bg-[#182033] border-gray-700 text-white focus:border-orange-500"
                      : "bg-slate-50 border-slate-300 text-slate-900 focus:border-orange-500"
                  }`}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs uppercase font-bold opacity-75 mb-1.5">
                  Tagline / Description
                </label>
                <textarea
                  name="description"
                  rows={2}
                  placeholder="e.g. Serviced with passion, delivered with precision."
                  value={form.description}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium border outline-none transition ${
                    isDark
                      ? "bg-[#182033] border-gray-700 text-white focus:border-orange-500"
                      : "bg-slate-50 border-slate-300 text-slate-900 focus:border-orange-500"
                  }`}
                />
              </div>

              {/* Background Image Upload */}
              <ImageUpload
                label="Banner Background Image"
                value={form.background_image}
                onChange={(url) => setForm({ ...form, background_image: url })}
                required={true}
                helperText="Upload banner image from your computer (JPG, PNG, WebP up to 15MB)"
                presetOptions={[
                  { label: "Preset: hero.png", value: "/images/hero.png" },
                  { label: "Preset: commercial.jpg", value: "/images/commercial.jpg" },
                  { label: "Preset: personal.jpg", value: "/images/personal.jpg" },
                ]}
              />

              {/* Video URL */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs uppercase font-bold opacity-75">
                    Watch Video URL (YouTube or Instagram Reel)
                  </label>
                  {form.video_url && (
                    <span className="text-[10px] font-bold">
                      {parseVideoUrl(form.video_url).isReel || parseVideoUrl(form.video_url).type === "instagram" ? (
                        <span className="inline-flex items-center gap-1 text-pink-400">
                          <FaInstagram size={11} />
                          <span>Instagram Reel detected</span>
                        </span>
                      ) : parseVideoUrl(form.video_url).type === "youtube" ? (
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
                  name="video_url"
                  placeholder="https://www.youtube.com/watch?v=... or https://www.instagram.com/reel/..."
                  value={form.video_url}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium border outline-none transition ${
                    isDark
                      ? "bg-[#182033] border-gray-700 text-white focus:border-orange-500"
                      : "bg-slate-50 border-slate-300 text-slate-900 focus:border-orange-500"
                  }`}
                />
                <p className="text-[10px] opacity-50 mt-1">
                  Paste normal YouTube link or Instagram Reel URL. Automatically converted to playable embed video player.
                </p>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-2 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-md shadow-orange-500/25 transition disabled:opacity-50 cursor-pointer"
              >
                {submitting ? "Publishing Slide..." : "+ Publish Hero Banner Slide"}
              </button>
            </form>
          </div>

          {/* Live Interactive Preview Card */}
          <div
            className={`lg:col-span-6 p-6 sm:p-8 rounded-3xl border transition-all flex flex-col justify-between ${
              isDark
                ? "bg-[#141A26] border-gray-800 shadow-xl"
                : "bg-white border-slate-200 shadow-sm"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase font-bold text-orange-500 flex items-center gap-1.5">
                  <Eye size={14} />
                  <span>Real-Time Live Preview</span>
                </span>
                <span className="text-[10px] opacity-60 font-mono">
                  As seen on Homepage
                </span>
              </div>

              {/* Mock Homepage Hero Card */}
              <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl flex flex-col justify-end p-6 select-none">
                {/* Background Image */}
                <img
                  src={form.background_image || "/images/hero.png"}
                  alt="Preview"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/20"></div>

                {/* Content Overlay */}
                <div className="relative z-10 space-y-2">
                  {form.subtitle?.trim() && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-[#D98A63] text-[9px] font-bold tracking-wider uppercase border border-white/20 backdrop-blur-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D98A63]"></span>
                      <span>{form.subtitle}</span>
                    </div>
                  )}

                  {form.title?.trim() && (
                    <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight leading-tight">
                      {form.title}
                    </h3>
                  )}

                  {form.description?.trim() && (
                    <p className="text-[11px] text-gray-300 line-clamp-2 max-w-sm">
                      {form.description}
                    </p>
                  )}

                  <div className="pt-2 flex items-center gap-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-black text-[10px] font-bold tracking-wider uppercase shadow">
                      <span>▶</span>
                      <span>WATCH THE FILM</span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/20 text-orange-300 text-[10px] font-bold tracking-wider uppercase border border-orange-500/40">
                      <span>EXPLORE WORK</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Existing Banners Management List */}
        <div
          className={`p-6 sm:p-8 rounded-3xl border transition-all ${
            isDark
              ? "bg-[#141A26] border-gray-800"
              : "bg-white border-slate-200 shadow-sm"
          }`}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
            <div>
              <h2 className="text-lg font-bold text-current">
                Active Hero Carousel Slides ({banners.length})
              </h2>
              <p className="text-xs opacity-60 mt-0.5">
                All slides currently rotating on the public homepage (changes apply live)
              </p>
            </div>

            {/* Shuffle Slides Button */}
            {banners.length > 1 && (
              <button
                onClick={handleShuffleBanners}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                  isDark
                    ? "bg-[#182033] hover:bg-[#202b44] text-orange-400 border-gray-700"
                    : "bg-orange-50 hover:bg-orange-100 text-orange-600 border-orange-200 shadow-sm"
                }`}
                title="Shuffle order of hero slides"
              >
                <Shuffle size={14} />
                <span>Shuffle Slides</span>
              </button>
            )}
          </div>

          {loading ? (
            <div className="py-16 flex justify-center">
              <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : banners.length === 0 ? (
            <div className="py-12 text-center opacity-60 text-xs">
              No banners found in database. Add one above to activate dynamic carousel!
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {banners.map((b, idx) => (
                <div
                  key={b.id}
                  className={`rounded-2xl overflow-hidden border transition flex flex-col justify-between ${
                    isDark
                      ? "bg-[#182033] border-gray-800 hover:border-gray-700"
                      : "bg-slate-50 border-slate-200 hover:border-slate-300 shadow-sm"
                  }`}
                >
                  <div>
                    {/* Thumbnail preview with order controls */}
                    <div className="aspect-[16/9] w-full bg-black relative overflow-hidden group">
                      <img
                        src={b.background_image || "/images/hero.png"}
                        alt={b.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40"></div>

                      {/* Slide Badge */}
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-black/80 text-white border border-white/10 z-10">
                        Slide #{idx + 1}
                      </span>

                      {/* Reorder Arrows: Move Left (Earlier) & Move Right (Later) */}
                      <div className="absolute top-2.5 right-2.5 flex items-center gap-1 z-20">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveSlide(idx, -1);
                          }}
                          disabled={idx === 0}
                          title="Move Earlier"
                          className="w-7 h-7 rounded-lg bg-black/80 hover:bg-orange-500 disabled:opacity-30 disabled:hover:bg-black/80 text-white flex items-center justify-center text-xs transition cursor-pointer border border-white/10"
                        >
                          <ChevronLeft size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveSlide(idx, 1);
                          }}
                          disabled={idx === banners.length - 1}
                          title="Move Later"
                          className="w-7 h-7 rounded-lg bg-black/80 hover:bg-orange-500 disabled:opacity-30 disabled:hover:bg-black/80 text-white flex items-center justify-center text-xs transition cursor-pointer border border-white/10"
                        >
                          <ChevronRight size={14} />
                        </button>
                      </div>

                      {/* Video Quick Test Button */}
                      {b.video_url && (
                        <button
                          onClick={() => setPreviewVideoUrl(parseVideoUrl(b.video_url))}
                          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/60 text-white text-xs font-bold gap-2 cursor-pointer z-10"
                        >
                          <span className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center shadow">
                            ▶
                          </span>
                          <span>Test Video Popup</span>
                        </button>
                      )}
                    </div>

                    {/* Details */}
                    <div className="p-4 space-y-2">
                      {b.subtitle && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-orange-500">
                          {b.subtitle}
                        </span>
                      )}
                      <h3 className="font-bold text-sm text-current leading-tight">
                        {b.title || "(No Headline)"}
                      </h3>
                      {b.description && (
                        <p className="text-[11px] opacity-60 line-clamp-2">
                          {b.description}
                        </p>
                      )}
                      {b.video_url && (
                        <p className="text-[10px] text-blue-500 truncate font-mono">
                          ▶ {b.video_url}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div
                    className={`p-4 border-t flex justify-between items-center text-xs ${
                      isDark ? "border-gray-800" : "border-slate-200"
                    }`}
                  >
                    <span className="font-mono text-[10px] opacity-40">
                      ID: #{b.id}
                    </span>
                    <div className="flex items-center gap-2">
                      {/* Edit Button */}
                      <button
                        onClick={() => handleEditClick(b)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-500/10 hover:bg-blue-500 text-blue-500 hover:text-white transition cursor-pointer"
                        title="Edit Slide"
                      >
                        <Pencil size={12} />
                        <span>Edit</span>
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(b.id, b.title)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition cursor-pointer"
                        title="Delete Slide"
                      >
                        <Trash2 size={12} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Edit Slide Modal */}
        {editingBanner && (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
            onClick={() => setEditingBanner(null)}
          >
            <div
              className={`relative w-full max-w-2xl rounded-3xl border p-6 sm:p-8 shadow-2xl my-8 ${
                isDark ? "bg-[#141A26] border-gray-700 text-white" : "bg-white border-slate-300 text-slate-900"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-inherit/20 mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-wider text-orange-500 font-bold">
                      Hero Slide #{editingBanner.id}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-current mt-0.5">
                    Edit Banner Slide
                  </h3>
                </div>
                <button
                  onClick={() => setEditingBanner(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase font-bold opacity-75 mb-1.5">
                    Headline (Optional)
                  </label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    placeholder="e.g. Expert Care For Every Ride"
                    className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium border outline-none transition ${
                      isDark
                        ? "bg-[#182033] border-gray-700 text-white focus:border-orange-500"
                        : "bg-slate-50 border-slate-300 text-slate-900 focus:border-orange-500"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold opacity-75 mb-1.5">
                    Category / Subtitle Pill
                  </label>
                  <input
                    type="text"
                    value={editForm.subtitle}
                    onChange={(e) => setEditForm({ ...editForm, subtitle: e.target.value })}
                    placeholder="e.g. ROYAL ENFIELD CAMPAIGN"
                    className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium border outline-none transition ${
                      isDark
                        ? "bg-[#182033] border-gray-700 text-white focus:border-orange-500"
                        : "bg-slate-50 border-slate-300 text-slate-900 focus:border-orange-500"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold opacity-75 mb-1.5">
                    Tagline / Description
                  </label>
                  <textarea
                    rows={2}
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    placeholder="Tagline or description..."
                    className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium border outline-none transition ${
                      isDark
                        ? "bg-[#182033] border-gray-700 text-white focus:border-orange-500"
                        : "bg-slate-50 border-slate-300 text-slate-900 focus:border-orange-500"
                    }`}
                  />
                </div>

                {/* Banner Background Image */}
                <ImageUpload
                  label="Banner Background Image"
                  value={editForm.background_image}
                  onChange={(url) => setEditForm({ ...editForm, background_image: url })}
                  required={true}
                  helperText="Upload new image or select a preset"
                  presetOptions={[
                    { label: "Preset: hero.png", value: "/images/hero.png" },
                    { label: "Preset: commercial.jpg", value: "/images/commercial.jpg" },
                    { label: "Preset: personal.jpg", value: "/images/personal.jpg" },
                  ]}
                />

                {/* Video URL */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs uppercase font-bold opacity-75">
                      Watch Video URL (YouTube or Instagram Reel)
                    </label>
                    {editForm.video_url && (
                      <span className="text-[10px] font-bold">
                        {parseVideoUrl(editForm.video_url).isReel || parseVideoUrl(editForm.video_url).type === "instagram" ? (
                          <span className="inline-flex items-center gap-1 text-pink-400">
                            <FaInstagram size={11} />
                            <span>Instagram Reel detected</span>
                          </span>
                        ) : parseVideoUrl(editForm.video_url).type === "youtube" ? (
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
                    value={editForm.video_url}
                    onChange={(e) => setEditForm({ ...editForm, video_url: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=... or https://www.instagram.com/reel/..."
                    className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium border outline-none transition ${
                      isDark
                        ? "bg-[#182033] border-gray-700 text-white focus:border-orange-500"
                        : "bg-slate-50 border-slate-300 text-slate-900 focus:border-orange-500"
                    }`}
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-inherit/20">
                  <button
                    type="button"
                    onClick={() => setEditingBanner(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold opacity-60 hover:opacity-100 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editLoading}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-md shadow-orange-500/25 transition disabled:opacity-50 cursor-pointer"
                  >
                    {editLoading ? "Saving Changes..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Video Preview Modal in Admin (Supports YouTube 16:9 and Reels 9:16) */}
        {previewVideoUrl && (
          <div
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setPreviewVideoUrl(null)}
          >
            {previewVideoUrl.isReel || previewVideoUrl.type === "instagram" ? (
              <div
                className="relative w-full max-w-[360px] h-[80vh] aspect-[9/16] bg-black rounded-2xl overflow-hidden border border-white/20 shadow-2xl flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setPreviewVideoUrl(null)}
                  className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-black/80 hover:bg-white text-white hover:text-black flex items-center justify-center transition cursor-pointer"
                >
                  <X size={16} />
                </button>
                <iframe
                  src={previewVideoUrl.embedUrl}
                  title="Test Reel"
                  className="w-full h-full border-0"
                  allow="autoplay; encrypted-media; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            ) : (
              <div
                className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden border border-white/20 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setPreviewVideoUrl(null)}
                  className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/20 hover:bg-white text-white hover:text-black flex items-center justify-center transition cursor-pointer"
                >
                  <X size={18} />
                </button>
                <iframe
                  src={`${previewVideoUrl.embedUrl || previewVideoUrl}?autoplay=1`}
                  title="Test Video"
                  className="w-full h-full border-0"
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
