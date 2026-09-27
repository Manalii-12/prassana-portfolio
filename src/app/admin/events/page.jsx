"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { useAdminTheme } from "@/context/AdminThemeContext";
import {
  Bell,
  PlusCircle,
  Trash2,
  Calendar,
  MapPin,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  RotateCw,
  Sparkles,
  Ticket,
  Eye,
  Info,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const SAMPLE_EVENTS = [
  {
    title: "Goa International Film Festival",
    date: "12 December 2026",
    location: "Goa, India",
    description: "Premiere screening of the latest documentary.",
    link_url: "https://filmfestival.example.com",
    badge: "PREMIERE",
  },
  {
    title: "Mumbai International Documentary Fest",
    date: "25 January 2027",
    location: "NCPA, Mumbai",
    description: "Keynote presentation & panel on cinematic documentary storytelling.",
    link_url: "https://mumbaifestival.example.com",
    badge: "FESTIVAL",
  },
];

export default function AdminEvents() {
  const { isDark } = useAdminTheme();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
    link_url: "",
    badge: "PREMIERE",
  });

  const loadEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/events`);
      if (res.ok) {
        const list = await res.json();
        setEvents(Array.isArray(list) ? list : []);
      }
    } catch (err) {
      console.error("Failed to load events:", err);
      setError("Could not connect to events API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const setSample = (sample) => {
    setForm(sample);
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Please provide an event title.");
      return;
    }

    setSubmitting(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMessage("Upcoming event published successfully!");
        setForm({
          title: "",
          date: "",
          location: "",
          description: "",
          link_url: "",
          badge: "PREMIERE",
        });
        loadEvents();
        setTimeout(() => setMessage(""), 4000);
      } else {
        setError(data.message || "Failed to add event.");
      }
    } catch (err) {
      console.error(err);
      setError("Server error adding event.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEvent = async (id, title) => {
    if (!confirm(`Are you sure you want to delete event "${title}"?`)) return;

    try {
      const res = await fetch(`${API_BASE}/api/events/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMessage(`Event "${title}" deleted.`);
        setEvents((prev) => prev.filter((ev) => ev.id !== id));
        setTimeout(() => setMessage(""), 4000);
      } else {
        alert(data.message || "Failed to delete event.");
      }
    } catch (err) {
      console.error(err);
      alert("Error communicating with server.");
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
                Announcements CMS
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-500 uppercase">
                Optional
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-current mt-1">
              Upcoming Projects & Announcements
            </h1>
            <p className="text-xs opacity-60 mt-1 max-w-xl">
              Add multiple upcoming projects, screenings, or festival releases. If no items are added, the upcoming section is automatically hidden from the website.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadEvents}
              disabled={loading}
              className={`p-2.5 rounded-xl border text-xs transition ${
                isDark
                  ? "bg-white/5 border-gray-700 hover:bg-white/10"
                  : "bg-slate-100 border-slate-300 hover:bg-slate-200"
              }`}
              title="Refresh list"
            >
              <RotateCw size={14} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* Live Status Notice Bar */}
        <div
          className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${
            events.length > 0
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : isDark
              ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
              : "bg-amber-50 border-amber-200 text-amber-800"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                events.length > 0 ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
              }`}
            ></div>
            <span className="font-bold">
              {events.length > 0
                ? `${events.length} Upcoming Project${events.length > 1 ? "s" : ""} Active — Visible on Homepage`
                : "0 Projects Active — Upcoming Section & Navbar Link Are Completely Hidden"}
            </span>
          </div>
          <span className="opacity-75 text-[11px]">
            {events.length > 0
              ? "Delete all to hide from site"
              : "Add an upcoming project below to show on site"}
          </span>
        </div>

        {/* Alerts */}
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

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left 6 Cols: Add Event Form */}
          <div className="lg:col-span-6 space-y-6">
            <div
              className={`p-6 sm:p-8 rounded-3xl border transition-all space-y-5 ${
                isDark ? "bg-[#141A26] border-gray-800 shadow-xl" : "bg-white border-slate-200 shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-inherit">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-orange-500/15 text-orange-500">
                    <PlusCircle size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-current">Add New Event</h3>
                    <p className="text-[11px] opacity-60">Publish a screening, festival, or talk</p>
                  </div>
                </div>

                {/* Quick Fill Samples */}
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSample(SAMPLE_EVENTS[0])}
                    className="text-[10px] px-2 py-1 rounded bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 font-semibold"
                  >
                    + Sample 1
                  </button>
                  <button
                    type="button"
                    onClick={() => setSample(SAMPLE_EVENTS[1])}
                    className="text-[10px] px-2 py-1 rounded bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 font-semibold"
                  >
                    + Sample 2
                  </button>
                </div>
              </div>

              <form onSubmit={handleAddEvent} className="space-y-4">
                {/* Event Title */}
                <div>
                  <label className="block text-xs uppercase font-bold opacity-75 mb-1.5">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g. Goa International Film Festival"
                    className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium border outline-none transition ${
                      isDark
                        ? "bg-[#182033] border-gray-700 text-white focus:border-orange-500"
                        : "bg-slate-50 border-slate-300 text-slate-900 focus:border-orange-500"
                    }`}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Date */}
                  <div>
                    <label className="block text-xs uppercase font-bold opacity-75 mb-1.5">
                      Event Date / Time *
                    </label>
                    <input
                      type="text"
                      name="date"
                      required
                      value={form.date}
                      onChange={handleChange}
                      placeholder="e.g. 12 December 2026"
                      className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium border outline-none transition ${
                        isDark
                          ? "bg-[#182033] border-gray-700 text-white focus:border-orange-500"
                          : "bg-slate-50 border-slate-300 text-slate-900 focus:border-orange-500"
                      }`}
                    />
                  </div>

                  {/* Badge */}
                  <div>
                    <label className="block text-xs uppercase font-bold opacity-75 mb-1.5">
                      Badge / Category
                    </label>
                    <select
                      name="badge"
                      value={form.badge}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium border outline-none transition ${
                        isDark
                          ? "bg-[#182033] border-gray-700 text-white focus:border-orange-500"
                          : "bg-slate-50 border-slate-300 text-slate-900 focus:border-orange-500"
                      }`}
                    >
                      <option value="PREMIERE">PREMIERE</option>
                      <option value="FESTIVAL">FESTIVAL</option>
                      <option value="SCREENING">SCREENING</option>
                      <option value="TALK / KEYNOTE">TALK / KEYNOTE</option>
                      <option value="AWARD">AWARD</option>
                      <option value="UPCOMING">UPCOMING</option>
                    </select>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-xs uppercase font-bold opacity-75 mb-1.5">
                    Location / Venue
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="e.g. Goa, India or Online"
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
                    Description / Highlight
                  </label>
                  <textarea
                    name="description"
                    rows={2}
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Brief description of the screening or presentation..."
                    className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium border outline-none transition ${
                      isDark
                        ? "bg-[#182033] border-gray-700 text-white focus:border-orange-500"
                        : "bg-slate-50 border-slate-300 text-slate-900 focus:border-orange-500"
                    }`}
                  />
                </div>

                {/* Ticket / External Link */}
                <div>
                  <label className="block text-xs uppercase font-bold opacity-75 mb-1.5">
                    Ticket / Event Link (Optional)
                  </label>
                  <input
                    type="text"
                    name="link_url"
                    value={form.link_url}
                    onChange={handleChange}
                    placeholder="https://festival.com/tickets or leave blank"
                    className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium border outline-none transition ${
                      isDark
                        ? "bg-[#182033] border-gray-700 text-white focus:border-orange-500"
                        : "bg-slate-50 border-slate-300 text-slate-900 focus:border-orange-500"
                    }`}
                  />
                </div>

                {/* Submit */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full px-6 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-[2px] transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <PlusCircle size={16} />
                    <span>{submitting ? "Publishing Event..." : "Publish Event"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right 6 Cols: Active Events List */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-current flex items-center gap-2">
                <Bell size={16} className="text-orange-500" />
                <span>Active Published Events ({events.length})</span>
              </h3>
              <span className="text-[11px] opacity-60">
                Sorted by newest
              </span>
            </div>

            {loading ? (
              <div className="p-8 text-center text-xs opacity-60">
                Loading events from server...
              </div>
            ) : events.length === 0 ? (
              <div
                className={`p-10 rounded-3xl border text-center space-y-3 ${
                  isDark ? "bg-[#141A26] border-gray-800" : "bg-white border-slate-200"
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 mx-auto flex items-center justify-center">
                  <Bell size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-current">No Upcoming Projects</h4>
                  <p className="text-xs opacity-60 mt-1 max-w-xs mx-auto">
                    The upcoming projects section and alerts are currently completely hidden from the website.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {events.map((ev, index) => (
                  <div
                    key={ev.id}
                    className={`p-5 rounded-2xl border transition-all space-y-3 ${
                      isDark
                        ? "bg-[#141A26] border-gray-800 hover:border-gray-700"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-orange-500/15 text-orange-400">
                            {ev.badge || "UPCOMING"}
                          </span>
                          <span className="text-xs font-semibold text-current">
                            {ev.date}
                          </span>
                        </div>
                        <h4 className="font-bold text-base text-current">
                          {ev.title}
                        </h4>
                      </div>

                      {/* Delete Action */}
                      <button
                        type="button"
                        onClick={() => handleDeleteEvent(ev.id, ev.title)}
                        className="p-2 rounded-xl text-red-500 hover:bg-red-500/10 transition"
                        title="Delete this event"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {ev.location && (
                      <p className="text-xs opacity-60 flex items-center gap-1.5">
                        <MapPin size={12} className="text-red-400" />
                        <span>{ev.location}</span>
                      </p>
                    )}

                    {ev.description && (
                      <p className="text-xs opacity-75 font-light leading-relaxed">
                        {ev.description}
                      </p>
                    )}

                    {ev.link_url && ev.link_url !== "#" && (
                      <a
                        href={ev.link_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-500 hover:underline"
                      >
                        <Ticket size={12} />
                        <span>View Link</span>
                        <ExternalLink size={10} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
