"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function Navbar({ openContact }) {
  const [hasEvents, setHasEvents] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/events`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setHasEvents(true);
        } else {
          setHasEvents(false);
        }
      })
      .catch(() => setHasEvents(false));
  }, []);

  const navLinks = [
    { name: "HOME", href: "#" },
    { name: "PORTFOLIO", href: "#portfolio" },
    { name: "ABOUT US", href: "#about" },
    ...(hasEvents ? [{ name: "UPCOMING PROJECTS", href: "#upcoming", hasBadge: true }] : []),
    { name: "CONTACT", href: "#contact" },
  ];

  return (
    <header className="absolute top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between md:justify-center px-6 sm:px-8 py-6 md:py-8">
        {/* Mobile Brand Tag (visible only on mobile) */}
        <a
          href="#"
          className="md:hidden font-black text-sm tracking-[3px] text-white flex items-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          <span>PRASANNA</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center justify-center gap-10">
          {navLinks.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-white hover:text-[#d8a56d] transition duration-300 flex items-center gap-1.5 text-sm font-semibold tracking-wider"
            >
              <span>{item.name}</span>
              {item.hasBadge && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                </span>
              )}
            </a>
          ))}
        </nav>

        {/* Mobile Hamburger Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-white transition flex items-center justify-center cursor-pointer"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown / Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-6 pb-6 pt-2">
          <nav className="bg-[#0B0E17]/95 border border-white/15 backdrop-blur-xl rounded-2xl p-5 shadow-2xl space-y-3 animate-fadeIn">
            {navLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2.5 px-3 rounded-xl text-xs font-bold tracking-widest text-gray-200 hover:text-white hover:bg-white/10 transition"
              >
                <span>{item.name}</span>
                {item.hasBadge && (
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                    Live
                  </span>
                )}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}