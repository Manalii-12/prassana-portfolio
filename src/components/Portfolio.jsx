"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const DEFAULT_EXPLORE = {
  heading: "Explore My Work",
  subheading: "PORTFOLIO",
  commercial_title: "Commercial Projects",
  commercial_subtitle: "",
  commercial_image: "/images/commercial.jpg",
  personal_title: "Passionate Projects",
  personal_subtitle: "",
  personal_image: "/images/personal.jpg",
};

const CACHE_KEY = "prasanna_cached_explore_data_v3";

export default function Portfolio() {
  const [data, setData] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("prasanna_cached_explore_data");
        localStorage.removeItem("prasanna_cached_explore_data_v2");
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && (parsed.heading || parsed.commercial_title || parsed.commercial_image)) {
            return { ...DEFAULT_EXPLORE, ...parsed };
          }
        }
      } catch (e) {}
    }
    return DEFAULT_EXPLORE;
  });

  const loadExploreData = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/explore?t=${Date.now()}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
      });
      if (res.ok) {
        const json = await res.json();
        if (json && (json.heading || json.commercial_title || json.commercial_image)) {
          const freshData = { ...DEFAULT_EXPLORE, ...json };
          setData(freshData);
          try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(freshData));
          } catch (e) {}
          // Preload images
          [json.commercial_image, json.personal_image].forEach((imgUrl) => {
            if (imgUrl) {
              const img = new Image();
              img.src = imgUrl.replace(/^http:\/\/prassana-backend/, "https://prassana-backend");
            }
          });
        }
      }
    } catch (err) {
      console.warn("Using cached explore section data:", err);
    }
  }, []);

  useEffect(() => {
    // 1. Initial immediate load
    loadExploreData();

    // 2. Re-fetch whenever tab becomes visible, window gains focus, or local storage changes
    const handleSync = () => {
      loadExploreData();
    };

    window.addEventListener("focus", handleSync);
    window.addEventListener("storage", handleSync);
    window.addEventListener("exploreUpdated", handleSync);
    document.addEventListener("visibilitychange", handleSync);

    return () => {
      window.removeEventListener("focus", handleSync);
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("exploreUpdated", handleSync);
      document.removeEventListener("visibilitychange", handleSync);
    };
  }, [loadExploreData]);

  return (
    <section
      id="portfolio"
      className="bg-[#0B0E16] text-white py-16 md:py-20 px-6 md:px-12 lg:px-20"
    >
      <div className="max-w-7xl mx-auto">
        {/* Heading (Loaded from Admin) */}
        <ScrollReveal animation="slide-up">
          <div className="text-center mb-10 md:mb-12">
            {data.subheading && (
              <p className="uppercase tracking-[6px] text-[#D98A63] text-xs md:text-sm font-semibold mb-3">
                {data.subheading}
              </p>
            )}

            <h2 className="designer-font text-4xl sm:text-5xl md:text-6xl uppercase tracking-tight text-white">
              {data.heading || "EXPLORE MY WORK"}
            </h2>
          </div>
        </ScrollReveal>

        {/* Two Compact Cards */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {/* Commercial Projects Card */}
          <ScrollReveal delay={100} animation="scale">
            <Link href="/commercial" className="group block">
              <div className="relative overflow-hidden rounded-2xl cursor-pointer h-[340px] sm:h-[380px] md:h-[400px] border border-white/10 group-hover:border-white/30 transition duration-500 shadow-2xl">
                {/* Background Image (From Admin) */}
                <img
                  src={
                    data.commercial_image
                      ? data.commercial_image.replace(/^http:\/\/prassana-backend/, "https://prassana-backend")
                      : "/images/commercial.jpg"
                  }
                  alt={data.commercial_title || "Commercial Projects"}
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/images/commercial.jpg";
                  }}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Subtle Bottom Ambient Gradient for contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent group-hover:from-black/60 transition duration-500"></div>

                {/* Left Corner Compact Title (no subtitle line) */}
                <div className="absolute bottom-5 left-5 sm:bottom-6 sm:left-6 text-left z-10">
                  <h3 className="text-sm sm:text-base md:text-lg font-bold uppercase tracking-wider text-white drop-shadow-md transition duration-300 group-hover:text-orange-400">
                    {data.commercial_title || "Commercial Projects"}
                  </h3>
                </div>
              </div>
            </Link>
          </ScrollReveal>

          {/* Personal Projects Card */}
          <ScrollReveal delay={200} animation="scale">
            <Link href="/personal" className="group block">
              <div className="relative overflow-hidden rounded-2xl cursor-pointer h-[340px] sm:h-[380px] md:h-[400px] border border-white/10 group-hover:border-white/30 transition duration-500 shadow-2xl">
                {/* Background Image (From Admin) */}
                <img
                  src={
                    data.personal_image
                      ? data.personal_image.replace(/^http:\/\/prassana-backend/, "https://prassana-backend")
                      : "/images/personal.jpg"
                  }
                  alt={data.personal_title || "Passionate Projects"}
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    console.warn("Explore personal image error");
                  }}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Subtle Bottom Ambient Gradient for contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent group-hover:from-black/60 transition duration-500"></div>

                {/* Left Corner Compact Title (no subtitle line) */}
                <div className="absolute bottom-5 left-5 sm:bottom-6 sm:left-6 text-left z-10">
                  <h3 className="text-sm sm:text-base md:text-lg font-bold uppercase tracking-wider text-white drop-shadow-md transition duration-300 group-hover:text-orange-400">
                    {data.personal_title || "Passionate Projects"}
                  </h3>
                </div>
              </div>
            </Link>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}