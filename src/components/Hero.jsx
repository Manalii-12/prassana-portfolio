"use client";

import { useEffect, useState, useCallback } from "react";
import { parseVideoUrl } from "@/lib/videoUtils";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Live high-impact cinematic banners (matches active database records)
const DEFAULT_BANNERS = [
  {
    id: 8,
    title: "",
    subtitle: "",
    description: "",
    background_image: "https://prassana-backend.onrender.com/api/upload/media/30001",
    video_url: "https://www.instagram.com/reel/DZNDD_wPdkV/?stkn=bm03YWU5czRxbzlq",
    order_index: 1,
  },
  {
    id: 60009,
    title: "",
    subtitle: "",
    description: "",
    background_image: "https://prassana-backend.onrender.com/api/upload/media/90002",
    video_url: "https://www.youtube.com/embed/PTnXUXSF4-8",
    order_index: 2,
  },
  {
    id: 1,
    title: "",
    subtitle: "",
    description: "",
    background_image: "https://prassana-backend.onrender.com/api/upload/media/30003",
    video_url: "https://www.youtube.com/embed/5WiaUcFNYtA",
    order_index: 3,
  },
  {
    id: 3,
    title: "",
    subtitle: "",
    description: "",
    background_image: "https://prassana-backend.onrender.com/api/upload/media/30004",
    video_url: "https://www.youtube.com/embed/klhQIWvOC-U",
    order_index: 4,
  },
  {
    id: 2,
    title: "",
    subtitle: "",
    description: "",
    background_image: "https://prassana-backend.onrender.com/api/upload/media/30005",
    video_url: "https://www.youtube.com/embed/CstXyn49IdE",
    order_index: 5,
  },
];

export default function Hero() {
  const [banners, setBanners] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("prasanna_cached_hero_banners");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {}
    }
    return DEFAULT_BANNERS;
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeVideo, setActiveVideo] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  // Preload all banner images into browser cache so transitions are instant
  useEffect(() => {
    if (Array.isArray(banners)) {
      banners.forEach((b) => {
        if (b && b.background_image) {
          const img = new Image();
          img.src = b.background_image.replace(/^http:\/\/prassana-backend/, "https://prassana-backend");
        }
      });
    }
  }, [banners]);

  // Fetch live banners from backend MySQL database
  useEffect(() => {
    // 1. Immediately check local storage cache if available
    try {
      const cached = localStorage.getItem("prasanna_cached_hero_banners");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setBanners(parsed);
        }
      }
    } catch (e) {}

    // 2. Refresh from backend in background
    async function fetchBanners() {
      try {
        const res = await fetch(`${API_BASE}/api/hero`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setBanners(data);
            try {
              localStorage.setItem("prasanna_cached_hero_banners", JSON.stringify(data));
            } catch (e) {}
          }
        }
      } catch (err) {
        console.warn("Backend hero API not reachable, using cached banners:", err);
      }
    }

    fetchBanners();
  }, []);

  // Slide navigation
  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  // Auto-rotate carousel every 6 seconds (smooth cinematic pacing with zero blackouts)
  useEffect(() => {
    if (activeVideo || banners.length <= 1) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 6000);

    return () => clearInterval(timer);
  }, [activeVideo, banners.length, nextSlide]);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setActiveVideo(null);
      }
    };

    if (activeVideo) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [activeVideo]);

  const currentBanner = banners[currentIndex] || banners[0] || {};
  const currentVideoParsed = parseVideoUrl(currentBanner.video_url);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black select-none">
      {/* Background Slides with Crossfade */}
      {banners.map((banner, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={banner.id || index}
            className={`absolute inset-0 bg-[#0B0E16] transition-opacity duration-1000 ease-in-out ${
              isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            {/* Background Image with subtle Ken Burns effect */}
            {banner.background_image && (
              <img
                src={banner.background_image.replace(/^http:\/\/prassana-backend/, "https://prassana-backend")}
                alt={banner.title || "Hero banner"}
                loading={index === 0 ? "eager" : "lazy"}
                decoding={index === 0 ? "sync" : "async"}
                fetchPriority={index === 0 ? "high" : "auto"}
                onError={(e) => {
                  console.warn("Hero banner image load issue for ID:", banner.id);
                }}
                className={`w-full h-full object-cover transition-transform duration-[7000ms] ease-out ${
                  isActive ? "scale-105" : "scale-100"
                }`}
              />
            )}

            {/* Subtle Bottom Ambient Gradient for button contrast only (no full-screen black shading) */}
            <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
          </div>
        );
      })}

      {/* Content Layer: Anchored to bottom-left with safe navbar clearance */}
      <div className="relative z-20 h-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-end pb-20 md:pb-24 pt-28">
        <div className="max-w-3xl space-y-4 md:space-y-5">
          {/* Subtitle / Category Badge (Optional) */}
          {currentBanner.subtitle?.trim() && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#D98A63] text-xs font-semibold tracking-[3px] uppercase animate-fadeIn">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D98A63] animate-pulse"></span>
              <span>{currentBanner.subtitle}</span>
            </div>
          )}

          {/* Main Title (Optional, sized safely so it never touches top navbar) */}
          {currentBanner.title?.trim() && (
            <h1 className="designer-font text-white text-3xl sm:text-5xl md:text-6xl lg:text-7xl uppercase tracking-tight leading-[1.08] animate-fadeIn">
              {currentBanner.title}
            </h1>
          )}

          {/* Tagline / Description (Optional) */}
          {currentBanner.description?.trim() && (
            <p className="text-gray-300 text-xs sm:text-sm md:text-base max-w-xl font-light leading-relaxed animate-fadeIn">
              {currentBanner.description}
            </p>
          )}

          {/* Action Buttons: Anchored consistently in the exact same position */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            {/* Watch The Film Button */}
            <button
              onClick={() => {
                const target = currentVideoParsed.embedUrl
                  ? currentVideoParsed
                  : parseVideoUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
                setActiveVideo(target);
              }}
              className="group relative inline-flex items-center gap-3 px-6 sm:px-7 py-3.5 sm:py-4 rounded-xl bg-white/10 hover:bg-white text-white hover:text-black border border-white/30 hover:border-white backdrop-blur-md font-bold text-xs tracking-[2px] uppercase transition-all duration-300 shadow-2xl hover:scale-105 cursor-pointer"
            >
              <span className="w-6 h-6 rounded-full bg-white/20 group-hover:bg-black/20 flex items-center justify-center text-xs transition">
                ▶
              </span>
              <span>
                {currentVideoParsed.isReel ? "WATCH REEL" : "WATCH THE FILM"}
              </span>
            </button>

            {/* Secondary CTA Button */}
            <a
              href="#portfolio"
              className="inline-flex items-center gap-2 px-6 sm:px-7 py-3.5 sm:py-4 rounded-xl bg-orange-500/20 hover:bg-orange-500 text-orange-300 hover:text-white border border-orange-500/40 backdrop-blur-md font-bold text-xs tracking-[2px] uppercase transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              <span>EXPLORE WORK</span>
              <span>↓</span>
            </a>
          </div>
        </div>
      </div>

      {/* Slide Navigation Arrows (Hidden on mobile to avoid overlapping content) */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="hidden sm:flex absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/40 hover:bg-white/20 border border-white/10 backdrop-blur-md text-white items-center justify-center transition hover:scale-110"
          >
            ←
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next Slide"
            className="hidden sm:flex absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/40 hover:bg-white/20 border border-white/10 backdrop-blur-md text-white items-center justify-center transition hover:scale-110"
          >
            →
          </button>
        </>
      )}

      {/* Bottom Progress Indicators / Dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
          {banners.map((_, index) => {
            const isActive = index === currentIndex;
            return (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`transition-all duration-500 rounded-full h-2 ${
                  isActive
                    ? "w-8 bg-orange-500"
                    : "w-2 bg-white/40 hover:bg-white/70"
                }`}
              />
            );
          })}
        </div>
      )}

      {/* Video Popup Modal: Supports both 16:9 YouTube and 9:16 Instagram Reels */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 md:p-8"
          onClick={() => setActiveVideo(null)}
        >
          {activeVideo.isReel || activeVideo.type === "instagram" ? (
            /* Instagram Reel / Vertical Video Modal */
            <div
              className="relative w-full max-w-[360px] sm:max-w-[400px] h-[82vh] max-h-[720px] aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/20 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute top-3 right-3 z-30 w-9 h-9 rounded-full bg-black/80 hover:bg-white text-white hover:text-black border border-white/20 flex items-center justify-center text-sm transition duration-200 cursor-pointer"
                aria-label="Close Reel"
              >
                ✕
              </button>
              <iframe
                src={activeVideo.embedUrl}
                title="Featured Instagram Reel"
                className="w-full h-full border-0 rounded-2xl"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          ) : (
            /* Standard 16:9 YouTube Video Modal */
            <div
              className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/15"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/80 hover:bg-white text-white hover:text-black border border-white/20 flex items-center justify-center text-lg transition duration-200 cursor-pointer"
                aria-label="Close Video"
              >
                ✕
              </button>
              <iframe
                src={`${activeVideo.embedUrl}${activeVideo.embedUrl.includes("?") ? "&" : "?"}autoplay=1`}
                title="Featured Video"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </div>
      )}
    </section>
  );
}