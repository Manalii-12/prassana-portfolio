"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { useAdminTheme } from "@/context/AdminThemeContext";
import ImageUpload from "@/components/ImageUpload";
import {
  User,
  Save,
  CheckCircle2,
  AlertCircle,
  Eye,
  RotateCw,
  Sparkles,
  Award,
  Film,
  Clock,
  Mail,
  ArrowRight,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const DEFAULT_FORM = {
  heading: "ABOUT ME",
  subheading: "DIRECTOR & CINEMATOGRAPHER",
  bio_p1:
    "I have years of experience creating documentaries, commercials and films for TV & digital platforms. My work focuses on visual storytelling that connects with audiences through emotion and creativity.",
  bio_p2:
    "Every project is crafted with attention to detail, cinematic composition and meaningful narratives. Explore my portfolio below to discover a collection of selected films and creative productions.",
  image_url: "/images/about.jpg",
  stat1_num: "10+",
  stat1_label: "Years Experience",
  stat2_num: "50+",
  stat2_label: "Directed Projects",
  stat3_num: "15+",
  stat3_label: "Festival Screenings",
};

export default function AdminAbout() {
  const { isDark } = useAdminTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState(DEFAULT_FORM);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/about`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.heading) {
          setForm((prev) => ({ ...prev, ...data }));
        }
      }
    } catch (err) {
      console.error("Failed to load about data:", err);
      setError("Could not connect to server. Ensure backend is running.");
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
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/about`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMessage(data.message || "About Me profile card updated successfully!");
        setTimeout(() => setMessage(""), 4000);
      } else {
        setError(data.message || "Failed to update profile card.");
      }
    } catch (err) {
      console.error(err);
      setError("Server error while saving. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const renderHeading = (text) => {
    if (!text) return <span>ABOUT <span className="text-[#D98A63]">ME</span></span>;
    const words = text.trim().split(" ");
    if (words.length === 1) return <span>{words[0]}</span>;
    const lastWord = words.pop();
    return (
      <>
        {words.join(" ")} <span className="text-[#D98A63]">{lastWord}</span>
      </>
    );
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-[3px] text-orange-500 font-bold">
                Profile Showcase
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-500 uppercase">
                Card CMS
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-current mt-1">
              About Me Section
            </h1>
            <p className="text-xs opacity-60 mt-1 max-w-xl">
              Customize the executive filmmaker profile card on the homepage, including biography, director photo, role tags, and career metrics.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setForm(DEFAULT_FORM)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition ${
                isDark
                  ? "bg-white/5 border-gray-700 hover:bg-white/10 text-gray-300"
                  : "bg-slate-100 border-slate-300 hover:bg-slate-200 text-slate-700"
              }`}
            >
              <Sparkles size={14} className="text-orange-500" />
              <span>Reset Defaults</span>
            </button>
            <button
              type="button"
              onClick={loadData}
              disabled={loading}
              className={`p-2.5 rounded-xl border text-xs transition ${
                isDark
                  ? "bg-white/5 border-gray-700 hover:bg-white/10"
                  : "bg-slate-100 border-slate-300 hover:bg-slate-200"
              }`}
              title="Refresh from database"
            >
              <RotateCw size={14} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* Notifications */}
        {message && (
          <div className="flex items-center gap-2.5 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold animate-fadeIn">
            <CheckCircle2 size={16} className="shrink-0" />
            <span>{message}</span>
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2.5 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold animate-fadeIn">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 Cols: Form Inputs */}
            <div className="lg:col-span-7 space-y-6">
              {/* Card Basic Info */}
              <div
                className={`p-6 sm:p-8 rounded-3xl border transition-all space-y-4 ${
                  isDark ? "bg-[#141A26] border-gray-800 shadow-xl" : "bg-white border-slate-200 shadow-sm"
                }`}
              >
                <div className="flex items-center gap-2 pb-3 border-b border-inherit">
                  <div className="p-2 rounded-xl bg-orange-500/15 text-orange-500">
                    <User size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-current">Card Headings & Identity</h3>
                    <p className="text-[11px] opacity-60">Main title and director badge</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase font-bold opacity-75 mb-1.5">
                      Section Heading *
                    </label>
                    <input
                      type="text"
                      name="heading"
                      required
                      value={form.heading}
                      onChange={handleChange}
                      placeholder="e.g. ABOUT ME"
                      className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium border outline-none transition ${
                        isDark
                          ? "bg-[#182033] border-gray-700 text-white focus:border-orange-500"
                          : "bg-slate-50 border-slate-300 text-slate-900 focus:border-orange-500"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-bold opacity-75 mb-1.5">
                      Role / Subtitle Pill
                    </label>
                    <input
                      type="text"
                      name="subheading"
                      value={form.subheading}
                      onChange={handleChange}
                      placeholder="e.g. DIRECTOR & CINEMATOGRAPHER"
                      className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium border outline-none transition ${
                        isDark
                          ? "bg-[#182033] border-gray-700 text-white focus:border-orange-500"
                          : "bg-slate-50 border-slate-300 text-slate-900 focus:border-orange-500"
                      }`}
                    />
                  </div>
                </div>

                {/* Profile Image Direct Upload */}
                <div className="pt-2">
                  <ImageUpload
                    label="Director Portrait Photo"
                    value={form.image_url}
                    onChange={(url) => setForm({ ...form, image_url: url })}
                    required={true}
                    helperText="Upload director portrait photo (JPG, PNG, WebP up to 15MB)"
                    presetOptions={[
                      { label: "Preset: /images/about.jpg", value: "/images/about.jpg" },
                      { label: "Preset: /images/hero.png", value: "/images/hero.png" },
                    ]}
                  />
                </div>
              </div>

              {/* Biography Paragraphs */}
              <div
                className={`p-6 sm:p-8 rounded-3xl border transition-all space-y-4 ${
                  isDark ? "bg-[#141A26] border-gray-800 shadow-xl" : "bg-white border-slate-200 shadow-sm"
                }`}
              >
                <div className="flex items-center gap-2 pb-3 border-b border-inherit">
                  <div className="p-2 rounded-xl bg-orange-500/15 text-orange-500">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-current">Director Biography</h3>
                    <p className="text-[11px] opacity-60">Storytelling vision, background, and philosophy</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold opacity-75 mb-1.5">
                    Bio Paragraph 1
                  </label>
                  <textarea
                    name="bio_p1"
                    rows={3}
                    value={form.bio_p1}
                    onChange={handleChange}
                    placeholder="Write first paragraph..."
                    className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium border outline-none transition leading-relaxed ${
                      isDark
                        ? "bg-[#182033] border-gray-700 text-white focus:border-orange-500"
                        : "bg-slate-50 border-slate-300 text-slate-900 focus:border-orange-500"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold opacity-75 mb-1.5">
                    Bio Paragraph 2
                  </label>
                  <textarea
                    name="bio_p2"
                    rows={3}
                    value={form.bio_p2}
                    onChange={handleChange}
                    placeholder="Write second paragraph..."
                    className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium border outline-none transition leading-relaxed ${
                      isDark
                        ? "bg-[#182033] border-gray-700 text-white focus:border-orange-500"
                        : "bg-slate-50 border-slate-300 text-slate-900 focus:border-orange-500"
                    }`}
                  />
                </div>
              </div>

              {/* Career Highlights / Quick Stats */}
              <div
                className={`p-6 sm:p-8 rounded-3xl border transition-all space-y-4 ${
                  isDark ? "bg-[#141A26] border-gray-800 shadow-xl" : "bg-white border-slate-200 shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between pb-3 border-b border-inherit">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-orange-500/15 text-orange-500">
                      <Award size={18} />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-current">Career Highlights & Stats (Optional)</h3>
                      <p className="text-[11px] opacity-60">Leave blank if you do not want to show stats on the card</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        stat1_num: "",
                        stat1_label: "",
                        stat2_num: "",
                        stat2_label: "",
                        stat3_num: "",
                        stat3_label: "",
                      })
                    }
                    className="text-[10px] px-2.5 py-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold transition"
                  >
                    Clear Stats
                  </button>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  {/* Stat 1 */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] uppercase font-bold opacity-75">Stat 1</label>
                    <input
                      type="text"
                      name="stat1_num"
                      value={form.stat1_num}
                      onChange={handleChange}
                      placeholder="e.g. 10+"
                      className={`w-full px-3 py-2 rounded-xl text-xs font-bold border outline-none transition ${
                        isDark ? "bg-[#182033] border-gray-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                      }`}
                    />
                    <input
                      type="text"
                      name="stat1_label"
                      value={form.stat1_label}
                      onChange={handleChange}
                      placeholder="e.g. Years Experience"
                      className={`w-full px-3 py-2 rounded-xl text-[11px] border outline-none transition ${
                        isDark ? "bg-[#182033] border-gray-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                      }`}
                    />
                  </div>

                  {/* Stat 2 */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] uppercase font-bold opacity-75">Stat 2</label>
                    <input
                      type="text"
                      name="stat2_num"
                      value={form.stat2_num}
                      onChange={handleChange}
                      placeholder="e.g. 50+"
                      className={`w-full px-3 py-2 rounded-xl text-xs font-bold border outline-none transition text-orange-500 ${
                        isDark ? "bg-[#182033] border-gray-700" : "bg-slate-50 border-slate-300"
                      }`}
                    />
                    <input
                      type="text"
                      name="stat2_label"
                      value={form.stat2_label}
                      onChange={handleChange}
                      placeholder="e.g. Directed Projects"
                      className={`w-full px-3 py-2 rounded-xl text-[11px] border outline-none transition ${
                        isDark ? "bg-[#182033] border-gray-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                      }`}
                    />
                  </div>

                  {/* Stat 3 */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] uppercase font-bold opacity-75">Stat 3</label>
                    <input
                      type="text"
                      name="stat3_num"
                      value={form.stat3_num}
                      onChange={handleChange}
                      placeholder="e.g. 15+"
                      className={`w-full px-3 py-2 rounded-xl text-xs font-bold border outline-none transition ${
                        isDark ? "bg-[#182033] border-gray-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                      }`}
                    />
                    <input
                      type="text"
                      name="stat3_label"
                      value={form.stat3_label}
                      onChange={handleChange}
                      placeholder="e.g. Festival Screenings"
                      className={`w-full px-3 py-2 rounded-xl text-[11px] border outline-none transition ${
                        isDark ? "bg-[#182033] border-gray-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-[2px] transition-all shadow-xl hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Save size={16} />
                  <span>{saving ? "Saving Changes..." : "Save About Card"}</span>
                </button>
              </div>
            </div>

            {/* Right 5 Cols: Real-Time Live Preview */}
            <div className="lg:col-span-5 sticky top-24">
              <div
                className={`p-6 rounded-3xl border transition-all ${
                  isDark ? "bg-[#141A26] border-gray-800 shadow-2xl" : "bg-white border-slate-200 shadow-md"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs uppercase font-bold text-orange-500 flex items-center gap-1.5">
                    <Eye size={14} />
                    <span>Real-Time Card Preview</span>
                  </span>
                  <span className="text-[10px] opacity-60 font-mono">
                    As seen on Homepage
                  </span>
                </div>

                {/* Mock Card Preview */}
                <div className="relative rounded-2xl overflow-hidden bg-[#0B0E16] border border-white/10 p-5 shadow-2xl text-white space-y-4">
                  {/* Photo & Identity pill */}
                  <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-black/80 border border-white/10">
                    <img
                      src={form.image_url || "/images/about.jpg"}
                      alt="Director"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <div className="absolute bottom-2 left-2 right-2 p-2 rounded-lg bg-black/70 backdrop-blur-md border border-white/15 flex items-center justify-between">
                      <p className="text-[9px] uppercase font-bold text-[#D98A63] truncate">
                        {form.subheading || "Director"}
                      </p>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    </div>
                  </div>

                  {/* Title & Role */}
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded-full bg-[#D98A63]/15 text-[#D98A63] text-[9px] font-bold uppercase tracking-wider">
                      {form.subheading || "DIRECTOR & CINEMATOGRAPHER"}
                    </span>
                    <h4 className="designer-font text-xl text-white uppercase tracking-tight mt-1">
                      {renderHeading(form.heading)}
                    </h4>
                  </div>

                  {/* Bio snippet */}
                  <p className="text-[11px] text-gray-300 font-light line-clamp-3 leading-relaxed">
                    {form.bio_p1}
                  </p>

                  {/* Stats Mini Row (Only if stats are provided) */}
                  {(form.stat1_num?.trim() || form.stat2_num?.trim() || form.stat3_num?.trim()) && (
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center">
                      {form.stat1_num?.trim() && (
                        <div className="p-2 rounded bg-white/[0.04]">
                          <div className="text-sm font-black text-white">{form.stat1_num}</div>
                          <div className="text-[9px] text-gray-400 truncate">{form.stat1_label}</div>
                        </div>
                      )}
                      {form.stat2_num?.trim() && (
                        <div className="p-2 rounded bg-white/[0.04]">
                          <div className="text-sm font-black text-[#D98A63]">{form.stat2_num}</div>
                          <div className="text-[9px] text-gray-400 truncate">{form.stat2_label}</div>
                        </div>
                      )}
                      {form.stat3_num?.trim() && (
                        <div className="p-2 rounded bg-white/[0.04]">
                          <div className="text-sm font-black text-white">{form.stat3_num}</div>
                          <div className="text-[9px] text-gray-400 truncate">{form.stat3_label}</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
