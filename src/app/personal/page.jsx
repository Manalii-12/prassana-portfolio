"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProjectBentoGrid from "@/components/ProjectBentoGrid";
import personalProjects from "@/data/personalProjects";
import { ArrowLeft, Film, X } from "lucide-react";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

import { parseVideoUrl } from "@/lib/videoUtils";

export default function PersonalPage() {
  const [projects, setProjects] = useState(personalProjects);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch(`${API_BASE}/api/projects/personal`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setProjects(data);
          }
        }
      } catch (err) {
        console.warn("Backend not reachable, displaying static projects:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

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
          Personal Showcase
        </span>
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pb-24">
        {/* Title Header */}
        <ScrollReveal animation="slide-up">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-3">
            <p className="text-xs uppercase tracking-[5px] text-[#D98A63] font-semibold">
              Narrative & Documentaries
            </p>
            <h1 className="designer-font text-4xl sm:text-5xl md:text-6xl lg:text-7xl uppercase tracking-tight text-white">
              Personal Projects
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 font-light max-w-xl mx-auto leading-relaxed">
              Independent films, culture stories, and personal cinematic journeys captured with raw human emotion.
            </p>
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 text-gray-500 text-sm">
            No personal projects found. Add projects from the Admin Panel.
          </div>
        ) : (
          /* Royal Enfield Asymmetric Bento Grid */
          <ProjectBentoGrid
            projects={projects}
            onOpenVideo={(video) => setActiveVideo(video)}
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
                title="Personal Reel"
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
                title="Personal Project Video"
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