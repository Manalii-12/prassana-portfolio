"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import ProjectBentoGrid from "@/components/ProjectBentoGrid";
import commercialProjects from "@/data/commercialProjects";
import { ArrowLeft, Film, X } from "lucide-react";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

import { parseVideoUrl } from "@/lib/videoUtils";

const DEFAULT_COMMERCIAL_HEADER = {
  commercial_page_badge: "Commercial Showcase",
  commercial_page_subtitle: "Brand Films & Commercials",
  commercial_page_title: "Commercial Projects",
  commercial_page_description:
    "High-impact brand campaigns, automotive reels, and directed commercial films created for TV & digital screens.",
};

const CACHE_HEADER_KEY = "prasanna_cached_commercial_header_v2";

export default function CommercialPage() {
  const [headerData, setHeaderData] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("prasanna_cached_commercial_header_v1");
        const cached = localStorage.getItem(CACHE_HEADER_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && (parsed.commercial_page_title || parsed.commercial_page_badge)) {
            return { ...DEFAULT_COMMERCIAL_HEADER, ...parsed };
          }
        }
      } catch (e) {}
    }
    return DEFAULT_COMMERCIAL_HEADER;
  });

  const [projects, setProjects] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("prasanna_cached_commercial_projects");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {}
    }
    return commercialProjects;
  });
  const [loading, setLoading] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);

  const fetchHeaderData = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/explore?t=${Date.now()}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (data && (data.commercial_page_title || data.commercial_page_badge)) {
          const freshHeader = { ...DEFAULT_COMMERCIAL_HEADER, ...data };
          setHeaderData(freshHeader);
          try {
            localStorage.setItem(CACHE_HEADER_KEY, JSON.stringify(freshHeader));
          } catch (e) {}
        }
      }
    } catch (err) {
      console.warn("Could not load fresh commercial header data:", err);
    }
  }, []);

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/projects/commercial?t=${Date.now()}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setProjects(data);
          try {
            localStorage.setItem("prasanna_cached_commercial_projects", JSON.stringify(data));
          } catch (e) {}
          // Preload images
          data.forEach((p) => {
            if (p && p.cover_image) {
              const img = new Image();
              img.src = p.cover_image.replace(/^http:\/\/prassana-backend/, "https://prassana-backend");
            }
          });
        }
      }
    } catch (err) {
      console.warn("Backend not reachable, displaying cached commercial projects:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // 1. Initial load
    fetchHeaderData();
    fetchProjects();

    // 2. Real-time tab sync
    const handleSync = () => {
      fetchHeaderData();
      fetchProjects();
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
  }, [fetchHeaderData, fetchProjects]);

  const parsedActiveVideo = activeVideo
    ? typeof activeVideo === "object"
      ? activeVideo
      : parseVideoUrl(activeVideo)
    : null;

  return (
    <main className="bg-[#080B11] min-h-screen text-white select-none">
      {/* Top Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-8 pb-4 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[2px] text-gray-400 hover:text-white transition group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition" />
          <span>Back to Home</span>
        </Link>

        <span className="text-[10px] font-bold uppercase tracking-[3px] text-orange-400 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20">
          {headerData.commercial_page_badge || "Commercial Showcase"}
        </span>
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pb-24">
        {/* Title Header */}
        <ScrollReveal animation="slide-up">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-3">
            <p className="text-xs uppercase tracking-[5px] text-[#D98A63] font-semibold">
              {headerData.commercial_page_subtitle || "Brand Films & Commercials"}
            </p>
            <h1 className="designer-font text-4xl sm:text-5xl md:text-6xl lg:text-7xl uppercase tracking-tight text-white">
              {headerData.commercial_page_title || "Commercial Projects"}
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 font-light max-w-xl mx-auto leading-relaxed">
              {headerData.commercial_page_description ||
                "High-impact brand campaigns, automotive reels, and directed commercial films created for TV & digital screens."}
            </p>
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 text-gray-500 text-sm">
            No commercial projects found. Add projects from the Admin Panel.
          </div>
        ) : (
          /* Royal Enfield Asymmetric Bento Grid */
          <ProjectBentoGrid
            projects={projects}
            onOpenVideo={(video) => setActiveVideo(video)}
            sectionType="commercial"
          />
        )}
      </section>

      {/* Global Shared Video Player Modal (Supports YouTube 16:9 & Instagram Reels 9:16) */}
      {parsedActiveVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 md:p-8"
          onClick={() => setActiveVideo(null)}
        >
          {parsedActiveVideo.isReel || parsedActiveVideo.type === "instagram" ? (
            <div
              className="relative w-full max-w-[360px] sm:max-w-[400px] h-[82vh] max-h-[720px] aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/20 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute top-3 right-3 z-30 w-9 h-9 rounded-full bg-black/80 hover:bg-white text-white hover:text-black border border-white/20 flex items-center justify-center text-sm transition duration-200 cursor-pointer"
                aria-label="Close Reel"
              >
                <X size={16} />
              </button>
              <iframe
                src={parsedActiveVideo.embedUrl}
                title="Commercial Reel"
                className="w-full h-full border-0 rounded-2xl"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          ) : (
            <div
              className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/15"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/80 hover:bg-white text-white hover:text-black border border-white/20 flex items-center justify-center text-lg transition duration-200 cursor-pointer"
                aria-label="Close Video"
              >
                <X size={18} />
              </button>
              <iframe
                src={`${parsedActiveVideo.embedUrl}${parsedActiveVideo.embedUrl.includes("?") ? "&" : "?"}autoplay=1`}
                title="Commercial Project Video"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </div>
      )}

      <Footer />
    </main>
  );
}