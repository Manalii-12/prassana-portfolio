"use client";

import { useEffect, useState } from "react";
import ScrollReveal from "@/components/ScrollReveal";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const DEFAULT_ABOUT = {
  heading: "ABOUT ME",
  subheading: "STORYTELLER",
  bio_p1:
    "I’m Prasanna. Filmmaker. Director. Professional overthinker.\n\nI make documentaries, brand films and digital content about people, places, culture and things that I find interesting enough to point a camera at.\n\nI’ve spent the last few years travelling across India, living in an ashram, hitchhiking, chasing stories, and somehow turning all of that into a career.",
  bio_p2:
    "My filmmaking brain is documentary-first: find the story, make it feel real, then make it look bloody good. I like fancy transitions too. I just prefer when they have a reason to exist.\n\nCurrently making Nothing Hits Like Rain, a feature documentary about the Indian monsoon, and Gods of Bharat, a series about India’s wonderfully chaotic culture.\nSo basically, I make films, and sometimes they even pay for themselves.",
  image_url: "https://prassana-backend.onrender.com/api/upload/media/2",
  stat1_num: "10+",
  stat1_label: "Year Experience",
  stat2_num: "",
  stat2_label: "",
  stat3_num: "",
  stat3_label: "",
};

export default function About() {
  const [data, setData] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("prasanna_cached_about_data");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.heading) return parsed;
        }
      } catch (e) {}
    }
    return DEFAULT_ABOUT;
  });

  useEffect(() => {
    // Check localStorage cache on mount
    try {
      const cached = localStorage.getItem("prasanna_cached_about_data");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.heading) {
          setData(parsed);
        }
      }
    } catch (e) {}

    async function loadAbout() {
      try {
        const res = await fetch(`${API_BASE}/api/about`);
        if (res.ok) {
          const json = await res.json();
          if (json && typeof json === "object") {
            setData((prev) => ({ ...prev, ...json }));
            try {
              localStorage.setItem("prasanna_cached_about_data", JSON.stringify(json));
            } catch (e) {}
            // Preload portrait
            if (json.image_url) {
              const img = new Image();
              img.src = json.image_url.replace(/^http:\/\/prassana-backend/, "https://prassana-backend");
            }
          }
        }
      } catch (err) {
        console.warn("Using cached about data:", err);
      }
    }
    loadAbout();
  }, []);

  // Format heading with copper accent on the last word
  const renderHeading = (text) => {
    if (!text || !text.trim()) return null;
    const words = text.trim().split(" ");
    if (words.length === 1) return <span>{words[0]}</span>;
    const lastWord = words.pop();
    return (
      <>
        {words.join(" ")} <span className="text-[#D98A63]">{lastWord}</span>
      </>
    );
  };

  // Stats are NOT compulsory: check if at least one stat has a valid value
  const activeStats = [
    { num: data.stat1_num?.trim(), label: data.stat1_label?.trim() || "Experience" },
    { num: data.stat2_num?.trim(), label: data.stat2_label?.trim() || "Projects" },
    { num: data.stat3_num?.trim(), label: data.stat3_label?.trim() || "Screenings" },
  ].filter((s) => s.num);

  return (
    <section
      id="about"
      className="bg-[#0B0E16] text-white py-12 md:py-16 px-6 md:px-12 lg:px-20 relative overflow-hidden"
    >
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-80 h-80 bg-[#D98A63]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto">
        {/* Compact Filmmaker Profile Card */}
        <ScrollReveal animation="slide-up">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#141A26]/90 via-[#0F1420]/95 to-[#0B0E16] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl p-6 sm:p-8 lg:p-10 transition-all duration-300 hover:border-white/20">
          
          <div className="grid md:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Portrait */}
            <div className="md:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[320px] sm:max-w-[340px] aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border border-white/15 group bg-black/60">
                {/* Director Photo */}
                <img
                  src={
                    data.image_url
                      ? data.image_url.replace(/^http:\/\/prassana-backend/, "https://prassana-backend")
                      : "/images/about.jpg"
                  }
                  alt={data.heading || "About Director"}
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    console.warn("About image failed to load, preserving current state");
                  }}
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Subtle Inner Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/20 pointer-events-none"></div>

                {/* Overlaid Bottom Identity Pill */}
                <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/15 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-[#D98A63] tracking-[2px]">
                      Director & Cinematographer
                    </p>
                    <p className="text-xs font-semibold text-white mt-0.5">
                      Prasanna • Mumbai & Worldwide
                    </p>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </div>
              </div>
            </div>

            {/* Right Column: Story & Philosophy */}
            <div className="md:col-span-7 space-y-4">
              {/* Category Pill */}
              {data.subheading?.trim() && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D98A63]/10 border border-[#D98A63]/30 text-[#D98A63] text-[11px] font-bold tracking-[2.5px] uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D98A63]"></span>
                  <span>{data.subheading}</span>
                </div>
              )}

              {/* Card Title */}
              {renderHeading(data.heading) && (
                <h2 className="designer-font text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight leading-[1.05] text-white">
                  {renderHeading(data.heading)}
                </h2>
              )}

              {/* Bio Paragraphs */}
              <div className="space-y-3 text-gray-300 text-xs sm:text-sm md:text-[15px] leading-relaxed font-light">
                {data.bio_p1 && <p>{data.bio_p1}</p>}
                {data.bio_p2 && <p>{data.bio_p2}</p>}
              </div>

              {/* Optional Career Stats (Only rendered if stats are provided) */}
              {activeStats.length > 0 && (
                <div
                  className={`grid gap-3 pt-3 border-t border-white/10 ${
                    activeStats.length === 1
                      ? "grid-cols-1"
                      : activeStats.length === 2
                      ? "grid-cols-2"
                      : "grid-cols-3"
                  }`}
                >
                  {activeStats.map((st, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center sm:text-left"
                    >
                      <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
                        {st.num}
                      </div>
                      <div className="text-[10px] sm:text-[11px] text-gray-400 mt-0.5 font-medium line-clamp-1">
                        {st.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  </section>
);
}