"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminLayout from "@/components/AdminLayout";
import { useAdminTheme } from "@/context/AdminThemeContext";
import {
  Sparkles,
  FolderKanban,
  Film,
  Video,
  PlusCircle,
  ExternalLink,
  ArrowRight,
  TrendingUp,
  Sliders,
  CheckCircle2,
  Bell,
  User,
  Layers,
  PhoneCall,
  MessageCircle,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function Dashboard() {
  const { isDark } = useAdminTheme();
  const [stats, setStats] = useState({
    totalProjects: 0,
    commercialProjects: 0,
    personalProjects: 0,
    heroBanners: 0,
    upcomingEvents: 0,
  });
  const [recentBanners, setRecentBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [projRes, heroRes, eventRes] = await Promise.all([
          fetch(`${API_BASE}/api/projects`).catch(() => null),
          fetch(`${API_BASE}/api/hero`).catch(() => null),
          fetch(`${API_BASE}/api/events`).catch(() => null),
        ]);

        let total = 0;
        let comm = 0;
        let pers = 0;
        let hero = 0;
        let evCount = 0;

        if (projRes && projRes.ok) {
          const projs = await projRes.json();
          if (Array.isArray(projs)) {
            total = projs.length;
            comm = projs.filter((p) => p.type === "commercial").length;
            pers = projs.filter((p) => p.type === "personal").length;
          }
        }

        if (heroRes && heroRes.ok) {
          const heroes = await heroRes.json();
          if (Array.isArray(heroes)) {
            hero = heroes.length;
            setRecentBanners(heroes);
          }
        }

        if (eventRes && eventRes.ok) {
          const evs = await eventRes.json();
          if (Array.isArray(evs)) {
            evCount = evs.length;
          }
        }

        setStats({
          totalProjects: total,
          commercialProjects: comm,
          personalProjects: pers,
          heroBanners: hero,
          upcomingEvents: evCount,
        });
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const statCards = [
    {
      title: "Hero Banners",
      value: stats.heroBanners,
      desc: "Auto-rotating slides",
      icon: Sparkles,
      color: "from-blue-500 to-indigo-600",
      textColor: "text-blue-500",
      bgColor: isDark ? "bg-blue-500/10 border-blue-500/20" : "bg-blue-50 border-blue-200",
      href: "/admin/hero",
    },
    {
      title: "About Me",
      value: "Card",
      desc: "Profile, bio & stats",
      icon: User,
      color: "from-amber-500 to-orange-600",
      textColor: "text-orange-500",
      bgColor: isDark ? "bg-orange-500/10 border-orange-500/20" : "bg-orange-50 border-orange-200",
      href: "/admin/about",
    },
    {
      title: "Explore Work",
      value: "Section",
      desc: "Commercial & Personal",
      icon: Layers,
      color: "from-cyan-500 to-blue-600",
      textColor: "text-cyan-500",
      bgColor: isDark ? "bg-cyan-500/10 border-cyan-500/20" : "bg-cyan-50 border-cyan-200",
      href: "/admin/explore",
    },
    {
      title: "Upcoming Projects",
      value: stats.upcomingEvents,
      desc: stats.upcomingEvents > 0 ? "Active on site" : "Hidden (0 projects)",
      icon: Bell,
      color: "from-rose-500 to-pink-600",
      textColor: "text-rose-500",
      bgColor: isDark ? "bg-rose-500/10 border-rose-500/20" : "bg-rose-50 border-rose-200",
      href: "/admin/events",
    },
    {
      title: "Commercial Work",
      value: stats.commercialProjects,
      desc: "Brand campaigns & ads",
      icon: Film,
      color: "from-purple-500 to-pink-600",
      textColor: "text-purple-500",
      bgColor: isDark ? "bg-purple-500/10 border-purple-500/20" : "bg-purple-50 border-purple-200",
      href: "/admin/manage-projects",
    },
    {
      title: "Personal Work",
      value: stats.personalProjects,
      desc: "Documentary & narratives",
      icon: Video,
      color: "from-emerald-500 to-teal-600",
      textColor: "text-emerald-500",
      bgColor: isDark ? "bg-emerald-500/10 border-emerald-500/20" : "bg-emerald-50 border-emerald-200",
      href: "/admin/manage-projects",
    },
    {
      title: "Contact & WhatsApp",
      value: "Quick Chat",
      desc: "Phone, pre-fill text & email",
      icon: MessageCircle,
      color: "from-green-500 to-emerald-600",
      textColor: "text-emerald-500",
      bgColor: isDark ? "bg-emerald-500/10 border-emerald-500/20" : "bg-emerald-50 border-emerald-200",
      href: "/admin/contact",
    },
  ];

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome Hero Banner */}
        <div
          className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 border transition-all ${
            isDark
              ? "bg-gradient-to-br from-[#141B2D] via-[#101524] to-[#0D111D] border-gray-800 shadow-2xl"
              : "bg-gradient-to-br from-white via-slate-50 to-orange-50/30 border-slate-200 shadow-sm"
          }`}
        >
          {/* Subtle Ambient Light */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/15 text-orange-500 border border-orange-500/25">
                <Sparkles size={13} />
                <span>Prasanna Portfolio Admin Panel</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-current">
                Welcome to Control Center
              </h1>
              <p className="text-xs sm:text-sm opacity-70 max-w-xl font-normal leading-relaxed">
                Heyy Prasanna
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/admin/hero"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-md shadow-orange-500/25 transition cursor-pointer"
              >
                <PlusCircle size={15} />
                <span>New Hero Banner</span>
              </Link>
              <Link
                href="/admin/projects"
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition border ${
                  isDark
                    ? "bg-gray-800/80 hover:bg-gray-700 text-white border-gray-700"
                    : "bg-white hover:bg-slate-100 text-slate-800 border-slate-300 shadow-sm"
                }`}
              >
                <Film size={15} />
                <span>New Project</span>
              </Link>
              <Link
                href="/admin/contact"
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition border ${
                  isDark
                    ? "bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border-emerald-500/30"
                    : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200 shadow-sm"
                }`}
              >
                <MessageCircle size={15} />
                <span>WhatsApp & Contact</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Live Metric Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link key={card.title} href={card.href}>
                <div
                  className={`p-5 sm:p-6 rounded-2xl border transition-all duration-200 hover:-translate-y-1 hover:shadow-lg cursor-pointer ${
                    isDark
                      ? "bg-[#141A26] border-gray-800/90 hover:border-gray-700"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-semibold opacity-60 uppercase tracking-wider">
                      {card.title}
                    </span>
                    <div className={`p-2 rounded-xl border ${card.bgColor}`}>
                      <Icon size={16} className={card.textColor} />
                    </div>
                  </div>

                  <div className="text-2xl sm:text-3xl font-black text-current mb-1">
                    {loading ? "..." : card.value}
                  </div>
                  <p className="text-[11px] opacity-60 font-medium">
                    {card.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Dynamic Hero Carousel Live Preview Widget */}
        <div
          className={`p-6 sm:p-8 rounded-3xl border transition-all ${
            isDark
              ? "bg-[#141A26] border-gray-800"
              : "bg-white border-slate-200 shadow-sm"
          }`}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-current">
                  Active Homepage Hero Banners
                </h2>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/25 uppercase">
                  Live on Site
                </span>
              </div>
              <p className="text-xs opacity-60 mt-1">
                These slides auto-rotate every 3 seconds on http://localhost:3000
              </p>
            </div>

            <Link
              href="/admin/hero"
              className="flex items-center gap-1.5 text-xs font-bold text-orange-500 hover:text-orange-600 transition"
            >
              <span>Manage Banners</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {recentBanners.length === 0 ? (
            <div className="py-12 text-center opacity-60 text-xs">
              No custom banners added yet. Default cinematic slides are active.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentBanners.map((b, idx) => (
                <div
                  key={b.id}
                  className={`group relative rounded-2xl overflow-hidden border transition hover:shadow-md ${
                    isDark
                      ? "bg-[#182033] border-gray-800"
                      : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <div className="aspect-[16/9] w-full overflow-hidden bg-black relative">
                    <img
                      src={b.background_image || "/images/hero.png"}
                      alt={b.title}
                      className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-black/70 text-white border border-white/10">
                      Slide #{idx + 1}
                    </span>
                    {b.video_url && (
                      <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500 text-white flex items-center gap-1 shadow-sm">
                        ▶ Video
                      </span>
                    )}
                  </div>

                  <div className="p-4 space-y-1.5">
                    {b.subtitle && (
                      <p className="text-[10px] font-bold uppercase tracking-wider text-orange-500">
                        {b.subtitle}
                      </p>
                    )}
                    <h3 className="font-bold text-xs sm:text-sm text-current truncate">
                      {b.title}
                    </h3>
                    {b.description && (
                      <p className="text-[11px] opacity-60 line-clamp-2 leading-relaxed">
                        {b.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Navigation Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <Link href="/admin/hero">
            <div
              className={`p-6 rounded-2xl border transition-all duration-200 hover:-translate-y-1 hover:shadow-md cursor-pointer ${
                isDark
                  ? "bg-[#141A26] border-gray-800 hover:border-orange-500/50"
                  : "bg-white border-slate-200 hover:border-orange-500/50 shadow-sm"
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 rounded-xl bg-orange-500/15 text-orange-500">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-current">
                    Hero Banner & Video CMS
                  </h3>
                  <p className="text-xs opacity-60">
                    Add new banners, change titles, update video links
                  </p>
                </div>
              </div>
              <div className="flex items-center text-xs font-bold text-orange-500 gap-1.5 mt-4">
                <span>Configure Banners</span>
                <ArrowRight size={13} />
              </div>
            </div>
          </Link>

          <Link href="/admin/manage-projects">
            <div
              className={`p-6 rounded-2xl border transition-all duration-200 hover:-translate-y-1 hover:shadow-md cursor-pointer ${
                isDark
                  ? "bg-[#141A26] border-gray-800 hover:border-emerald-500/50"
                  : "bg-white border-slate-200 hover:border-emerald-500/50 shadow-sm"
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 rounded-xl bg-emerald-500/15 text-emerald-500">
                  <FolderKanban size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-current">
                    Project Database Manager
                  </h3>
                  <p className="text-xs opacity-60">
                    Search, inspect, and remove commercial or personal works
                  </p>
                </div>
              </div>
              <div className="flex items-center text-xs font-bold text-emerald-500 gap-1.5 mt-4">
                <span>Manage All Projects</span>
                <ArrowRight size={13} />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}