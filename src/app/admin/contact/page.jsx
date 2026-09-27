"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { useAdminTheme } from "@/context/AdminThemeContext";
import ImageUpload from "@/components/ImageUpload";
import {
  PhoneCall,
  Mail,
  MapPin,
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  MessageCircle,
  Share2,
  Images,
} from "lucide-react";
import { FaWhatsapp, FaInstagram, FaYoutube, FaLinkedinIn } from "react-icons/fa";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ContactAdminPage() {
  const { isDark } = useAdminTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    heading: "CONTACT",
    subheading: "DIRECTOR & CINEMATOGRAPHER",
    location: "Navi Mumbai, Maharashtra, India (Working Worldwide)",
    email: "prasannaoffcials@gmail.com",
    whatsapp: "",
    whatsapp_message: "Hi Prasanna, I would like to discuss a film/production project with you.",
    instagram: "https://instagram.com/your_username",
    youtube: "https://youtube.com/@your_channel",
    social_heading: "SOCIAL MEDIA",
    social_description: "Follow my journey. Behind the scenes, Short Films, Commercial Shoots & Photography.",
    instagram_button_text: "Follow on Instagram →",
    instagram_button_url: "https://instagram.com/your_username",
    image1: "/images/commercial.jpg",
    image2: "/images/about.jpg",
    image3: "/images/hero.png",
    image4: "/images/commercial.jpg",
    image5: "/images/about.jpg",
    image6: "/images/hero.png",
  });

  const loadContact = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/contact`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.id) {
          setForm(data);
        }
      }
    } catch (err) {
      console.error(err);
      setError("Failed to connect to backend server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContact();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (key, url) => {
    setForm((prev) => ({
      ...prev,
      [key]: url,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "Contact details updated successfully!");
      } else {
        setError(data.message || "Failed to update contact details");
      }
    } catch (err) {
      console.error(err);
      setError("Server connection error while saving.");
    } finally {
      setSaving(false);
    }
  };

  const cleanPhone = (form.whatsapp || "").replace(/[^0-9]/g, "");
  const whatsappPreviewUrl = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(form.whatsapp_message || "")}`
    : "#";

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-[3px] text-orange-500 font-bold">
                Portfolio CMS
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 uppercase">
                Contact & WhatsApp
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-current mt-1">
              Contact Section Settings
            </h1>
            <p className="text-xs sm:text-sm opacity-60 mt-1">
              Customize direct contacts, WhatsApp phone & automated message, location, social links, and the visual feed gallery.
            </p>
          </div>

          <a
            href="/#contact"
            target="_blank"
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition border ${
              isDark
                ? "bg-[#182033] hover:bg-[#202b44] text-gray-200 border-gray-700"
                : "bg-white hover:bg-slate-100 text-slate-700 border-slate-300 shadow-sm"
            }`}
          >
            <span>View Live Section</span>
            <ExternalLink size={13} />
          </a>
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

        {loading ? (
          <div
            className={`p-20 rounded-3xl border flex justify-center items-center ${
              isDark ? "bg-[#141A26] border-gray-800" : "bg-white border-slate-200"
            }`}
          >
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section 1: Headings & Location */}
            <div
              className={`p-6 sm:p-8 rounded-3xl border space-y-5 ${
                isDark ? "bg-[#141A26] border-gray-800 shadow-xl" : "bg-white border-slate-200 shadow-sm"
              }`}
            >
              <div className="flex items-center gap-2.5 pb-4 border-b border-inherit">
                <MapPin className="text-orange-500" size={18} />
                <h2 className="text-base font-bold text-current">Title & Location Details</h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs uppercase font-bold opacity-75 mb-1.5">
                    Main Heading *
                  </label>
                  <input
                    type="text"
                    required
                    name="heading"
                    value={form.heading}
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
                    Subheading / Tagline
                  </label>
                  <input
                    type="text"
                    name="subheading"
                    value={form.subheading}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium border outline-none transition ${
                      isDark
                        ? "bg-[#182033] border-gray-700 text-white focus:border-orange-500"
                        : "bg-slate-50 border-slate-300 text-slate-900 focus:border-orange-500"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-bold opacity-75 mb-1.5">
                  Location Text
                </label>
                <input
                  type="text"
                  name="location"
                  placeholder="e.g. Navi Mumbai, Maharashtra, India (Working Worldwide)"
                  value={form.location}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium border outline-none transition ${
                    isDark
                      ? "bg-[#182033] border-gray-700 text-white focus:border-orange-500"
                      : "bg-slate-50 border-slate-300 text-slate-900 focus:border-orange-500"
                  }`}
                />
              </div>
            </div>

            {/* Section 2: Direct Email & WhatsApp (Requested by User) */}
            <div
              className={`p-6 sm:p-8 rounded-3xl border space-y-5 ${
                isDark ? "bg-[#141A26] border-gray-800 shadow-xl" : "bg-white border-slate-200 shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between pb-4 border-b border-inherit">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
                    <FaWhatsapp size={16} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-current">Email & WhatsApp Configuration</h2>
                    <p className="text-[11px] opacity-60">Set WhatsApp phone number and custom message</p>
                  </div>
                </div>

                {cleanPhone && (
                  <a
                    href={whatsappPreviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-emerald-500 hover:underline flex items-center gap-1"
                  >
                    <span>Test WhatsApp Link</span>
                    <ExternalLink size={11} />
                  </a>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                {/* Email Address */}
                <div>
                  <label className="block text-xs uppercase font-bold opacity-75 mb-1.5">
                    Direct Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@gmail.com"
                    value={form.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium border outline-none transition ${
                      isDark
                        ? "bg-[#182033] border-gray-700 text-white focus:border-orange-500"
                        : "bg-slate-50 border-slate-300 text-slate-900 focus:border-orange-500"
                    }`}
                  />
                </div>

                {/* WhatsApp Phone Number */}
                <div>
                  <label className="block text-xs uppercase font-bold opacity-75 mb-1.5">
                    WhatsApp Phone Number (with Country Code)
                  </label>
                  <input
                    type="text"
                    name="whatsapp"
                    placeholder="e.g. +91 8097075054"
                    value={form.whatsapp}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium border outline-none transition ${
                      isDark
                        ? "bg-[#182033] border-gray-700 text-white focus:border-orange-500"
                        : "bg-slate-50 border-slate-300 text-slate-900 focus:border-orange-500"
                    }`}
                  />
                  <p className="text-[10px] opacity-50 mt-1">
                    Include country code (+91 for India, etc.).
                  </p>
                </div>
              </div>

              {/* WhatsApp Default Message */}
              <div>
                <label className="block text-xs uppercase font-bold opacity-75 mb-1.5">
                  Automated WhatsApp Message (Sent when visitor clicks chat)
                </label>
                <textarea
                  rows={2}
                  name="whatsapp_message"
                  placeholder="Hi Prasanna, I would like to discuss a film/production project..."
                  value={form.whatsapp_message}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium border outline-none transition ${
                    isDark
                      ? "bg-[#182033] border-gray-700 text-white focus:border-orange-500"
                      : "bg-slate-50 border-slate-300 text-slate-900 focus:border-orange-500"
                  }`}
                />
                <p className="text-[10px] opacity-50 mt-1">
                  This text will automatically pre-fill in the visitor's WhatsApp message box.
                </p>
              </div>

              {/* Live Card Preview on Website */}
              <div className="pt-2">
                <p className="text-[11px] font-bold uppercase tracking-wider opacity-60 mb-2">
                  Live Portfolio Preview (How it appears in Contact Section):
                </p>
                <div className="max-w-sm p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-emerald-500 text-black shrink-0 shadow-md shadow-emerald-500/20">
                    <FaWhatsapp size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                        WhatsApp Chat
                      </p>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                    <p className="text-sm font-bold text-current mt-0.5 truncate">
                      {form.whatsapp || "+91 8097075054 (Default)"}
                    </p>
                    <p className="text-[10px] opacity-50 mt-1 truncate">
                      Prefill: &quot;{form.whatsapp_message || "Hi Prasanna, I would like to discuss a film/production project with you."}&quot;
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Social Media Links */}
            <div
              className={`p-6 sm:p-8 rounded-3xl border space-y-5 ${
                isDark ? "bg-[#141A26] border-gray-800 shadow-xl" : "bg-white border-slate-200 shadow-sm"
              }`}
            >
              <div className="flex items-center gap-2.5 pb-4 border-b border-inherit">
                <Share2 className="text-orange-500" size={18} />
                <h2 className="text-base font-bold text-current">Social Media Profiles</h2>
              </div>

              <div>
                <label className="block text-xs uppercase font-bold opacity-75 mb-1.5">
                  Social Blurb / Description
                </label>
                <textarea
                  rows={2}
                  name="social_description"
                  value={form.social_description}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium border outline-none transition ${
                    isDark
                      ? "bg-[#182033] border-gray-700 text-white focus:border-orange-500"
                      : "bg-slate-50 border-slate-300 text-slate-900 focus:border-orange-500"
                  }`}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {/* Instagram URL */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs uppercase font-bold opacity-75 mb-1.5">
                    <FaInstagram className="text-[#E1306C]" />
                    <span>Instagram Profile URL</span>
                  </label>
                  <input
                    type="text"
                    name="instagram"
                    value={form.instagram}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium border outline-none transition ${
                      isDark
                        ? "bg-[#182033] border-gray-700 text-white focus:border-orange-500"
                        : "bg-slate-50 border-slate-300 text-slate-900 focus:border-orange-500"
                    }`}
                  />
                </div>

                {/* YouTube URL */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs uppercase font-bold opacity-75 mb-1.5">
                    <FaYoutube className="text-[#FF0000]" />
                    <span>YouTube Channel URL</span>
                  </label>
                  <input
                    type="text"
                    name="youtube"
                    value={form.youtube}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium border outline-none transition ${
                      isDark
                        ? "bg-[#182033] border-gray-700 text-white focus:border-orange-500"
                        : "bg-slate-50 border-slate-300 text-slate-900 focus:border-orange-500"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Visual Feed Gallery (6 Images) */}
            <div
              className={`p-6 sm:p-8 rounded-3xl border space-y-6 ${
                isDark ? "bg-[#141A26] border-gray-800 shadow-xl" : "bg-white border-slate-200 shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between pb-4 border-b border-inherit">
                <div className="flex items-center gap-2.5">
                  <Images className="text-orange-500" size={18} />
                  <div>
                    <h2 className="text-base font-bold text-current">Visual Feed / Instagram Grid (6 Images)</h2>
                    <p className="text-[11px] opacity-60">Upload custom gallery images displayed on the right-hand card</p>
                  </div>
                </div>
              </div>

              {/* Instagram Button Settings */}
              <div className="grid sm:grid-cols-2 gap-4 pb-2">
                <div>
                  <label className="block text-xs uppercase font-bold opacity-75 mb-1.5">
                    Instagram Button Text
                  </label>
                  <input
                    type="text"
                    name="instagram_button_text"
                    value={form.instagram_button_text}
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
                    Instagram Button URL / Link
                  </label>
                  <input
                    type="text"
                    name="instagram_button_url"
                    value={form.instagram_button_url}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium border outline-none transition ${
                      isDark
                        ? "bg-[#182033] border-gray-700 text-white focus:border-orange-500"
                        : "bg-slate-50 border-slate-300 text-slate-900 focus:border-orange-500"
                    }`}
                  />
                </div>
              </div>

              {/* 6 Images Grid with ImageUpload component */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
                {[1, 2, 3, 4, 5, 6].map((num) => {
                  const key = `image${num}`;
                  return (
                    <div key={key} className="space-y-1">
                      <ImageUpload
                        label={`Feed Photo ${num}`}
                        value={form[key]}
                        onChange={(url) => handleImageChange(key, url)}
                        compact={true}
                        presetOptions={[
                          { label: "Commercial", value: "/images/commercial.jpg" },
                          { label: "About", value: "/images/about.jpg" },
                          { label: "Hero", value: "/images/hero.png" },
                        ]}
                        helperText="1:1 Square"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={saving}
              className="w-full py-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-lg shadow-orange-500/25 transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving Contact Settings...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Save All Contact Details</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </AdminLayout>
  );
}
