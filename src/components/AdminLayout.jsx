"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  AdminThemeProvider,
  useAdminTheme,
} from "@/context/AdminThemeContext";
import {
  LayoutDashboard,
  Sparkles,
  FolderKanban,
  PlusCircle,
  Sun,
  Moon,
  LogOut,
  ExternalLink,
  Menu,
  X,
  User,
  ChevronRight,
  Layers,
  Bell,
  PanelLeftClose,
  PanelLeftOpen,
  PhoneCall,
} from "lucide-react";

const navItems = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    name: "Hero Banners",
    href: "/admin/hero",
    icon: Sparkles,
    badge: "Dynamic",
  },
  {
    name: "About Me",
    href: "/admin/about",
    icon: User,
    badge: "Card",
  },
  {
    name: "Explore Work",
    href: "/admin/explore",
    icon: Layers,
    badge: "Section",
  },
  {
    name: "Upcoming Projects",
    href: "/admin/events",
    icon: Bell,
    badge: "Alerts",
  },
  {
    name: "Manage Projects",
    href: "/admin/manage-projects",
    icon: FolderKanban,
    badge: null,
  },
  {
    name: "Add Project",
    href: "/admin/projects",
    icon: PlusCircle,
    badge: null,
  },
  {
    name: "Contact & WhatsApp",
    href: "/admin/contact",
    icon: PhoneCall,
    badge: "Chat",
  },
];

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isDark, toggleTheme } = useAdminTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/admin/login");
    } else {
      setIsAuthenticated(true);
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.replace("/admin/login");
  };

  const getPageTitle = () => {
    switch (pathname) {
      case "/admin/dashboard":
        return "Dashboard";
      case "/admin/hero":
        return "Hero Banners CMS";
      case "/admin/about":
        return "About Me CMS";
      case "/admin/explore":
        return "Explore Work CMS";
      case "/admin/events":
        return "Upcoming Projects CMS";
      case "/admin/manage-projects":
        return "Manage Projects";
      case "/admin/projects":
        return "Add New Project";
      case "/admin/contact":
        return "Contact Details CMS";
      default:
        return "Admin Portal";
    }
  };

  if (loading || !isAuthenticated) {
    return (
      <div
        className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-200 ${
          isDark ? "bg-[#0B0E17] text-white" : "bg-[#F8FAFC] text-slate-800"
        }`}
      >
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xs uppercase font-mono tracking-widest opacity-70">
          Verifying Admin Access...
        </p>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-200 ${
        isDark ? "bg-[#0B0E17] text-white" : "bg-[#F8FAFC] text-slate-900"
      }`}
    >
      {/* Top Header */}
      <header
        className={`sticky top-0 z-40 h-16 border-b transition-colors duration-200 px-4 md:px-8 flex items-center justify-between backdrop-blur-md ${
          isDark
            ? "bg-[#111624]/90 border-gray-800/80 text-white"
            : "bg-white/90 border-slate-200/90 text-slate-900 shadow-sm"
        }`}
      >
        <div className="flex items-center gap-3">
          {/* Mobile Sidebar Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 rounded-xl border transition cursor-pointer flex items-center justify-center text-xs font-semibold ${
              isDark
                ? "bg-[#182033] hover:bg-[#202b44] text-gray-200 border-gray-700"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300"
            }`}
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          {/* Desktop Sidebar Toggle (Open / Close) */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`hidden md:flex p-2 rounded-xl border transition cursor-pointer items-center gap-1.5 text-xs font-semibold ${
              isDark
                ? "bg-[#182033] hover:bg-[#202b44] text-gray-200 border-gray-700"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300"
            }`}
            title={sidebarOpen ? "Close Sidebar" : "Open Sidebar"}
            aria-label="Toggle Sidebar Navigation"
          >
            {sidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
            <span className="text-[11px]">
              {sidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
            </span>
          </button>

          {/* Breadcrumbs */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-medium">
            <span className="opacity-50">Admin</span>
            <ChevronRight size={14} className="opacity-40" />
            <span className="font-semibold text-orange-500">
              {getPageTitle()}
            </span>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2.5 sm:gap-4">

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={toggleTheme}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition border cursor-pointer ${
              isDark
                ? "bg-[#182033] hover:bg-[#202b44] text-amber-300 border-gray-700"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300"
            }`}
            title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
          >
            {isDark ? (
              <>
                <Sun size={15} className="text-amber-400" />
                <span className="hidden sm:inline">Light Mode</span>
              </>
            ) : (
              <>
                <Moon size={15} className="text-slate-600" />
                <span className="hidden sm:inline">Dark Mode</span>
              </>
            )}
          </button>

          {/* View Website External Link */}
          <Link
            href="/"
            target="_blank"
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
              isDark
                ? "bg-gray-800/80 hover:bg-gray-700 text-gray-200 border-gray-700"
                : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200"
            }`}
          >
            <span>Live Site</span>
            <ExternalLink size={13} />
          </Link>

          {/* User Profile Pill */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border ${
              isDark
                ? "bg-[#182033] border-gray-700/80 text-gray-200"
                : "bg-slate-100 border-slate-200 text-slate-800"
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white text-[10px] font-bold">
              A
            </div>
            <span className="hidden lg:inline font-mono">admin@gmail.com</span>
          </div>
        </div>
      </header>

      <div className="flex-1 flex relative">
        {/* Mobile Backdrop Overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-30 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Left Sidebar (Open / Close Collapsible) */}
        <aside
          className={`${
            mobileMenuOpen
              ? "flex fixed top-16 left-0 bottom-0 w-72 max-w-[85vw] z-40 shadow-2xl"
              : "hidden"
          } ${
            sidebarOpen ? "md:flex md:w-64" : "md:hidden"
          } flex-col justify-between border-r shrink-0 transition-all duration-300 md:sticky top-16 h-[calc(100vh-4rem)] z-30 ${
            isDark
              ? "bg-[#111624] border-gray-800/80 text-gray-300"
              : "bg-white border-slate-200 text-slate-700"
          }`}
        >
          <div className="p-5 space-y-6">
            {/* Brand Logo Card */}
            <div
              className={`p-4 rounded-2xl border transition ${
                isDark
                  ? "bg-[#151C2C] border-gray-800"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-orange-500/20">
                  P
                </div>
                <div>
                  <h3 className="font-extrabold text-sm tracking-tight text-current">
                    PRASANNA CMS
                  </h3>
                  <p className="text-[11px] opacity-60 font-medium">
                    Creative Portfolio
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Section */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[2px] opacity-40 px-3 mb-2">
                Navigation
              </p>
              <nav className="space-y-1.5">
                {navItems.map((item) => {
                  const active = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                        active
                          ? "bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md shadow-orange-500/25"
                          : isDark
                          ? "text-gray-300 hover:text-white hover:bg-gray-800/60"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={16} />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            active
                              ? "bg-white/20 text-white"
                              : isDark
                              ? "bg-orange-500/20 text-orange-400"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Sidebar Footer */}
          <div
            className={`p-5 border-t space-y-3 ${
              isDark ? "border-gray-800" : "border-slate-200"
            }`}
          >
            <button
              onClick={handleLogout}
              className={`flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-xs font-semibold transition border cursor-pointer ${
                isDark
                  ? "bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/20"
                  : "bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
              }`}
            >
              <LogOut size={14} />
              <span>Log Out</span>
            </button>
          </div>
        </aside>

        {/* Main Workspace */}
        <main
          className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto min-h-[calc(100vh-4rem)] flex flex-col justify-between w-full"
        >
          <div>{children}</div>

          {/* Admin Footer */}
          <footer
            className={`mt-16 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs select-none ${
              isDark ? "border-gray-800 text-gray-400" : "border-slate-200 text-slate-500"
            }`}
          >
            <p className="font-medium text-center sm:text-left">
              Copyright © 2026 prassana&apos;s approach All Rights Reserved
            </p>
            <div className="flex items-center gap-2 text-[11px] opacity-70">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Prasanna Portfolio CMS v2.0</span>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
