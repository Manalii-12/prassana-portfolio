"use client";

import { useState } from "react";
import { ChevronRight, Play, X } from "lucide-react";
import { FaInstagram, FaYoutube } from "react-icons/fa";
import { parseVideoUrl, getVideoCover } from "@/lib/videoUtils";
import { useScrollReveal } from "@/lib/useScrollReveal";

export default function ProjectCard({ project, onOpenVideo }) {
  const [cardRef, isVisible] = useScrollReveal({ threshold: 0.08, rootMargin: "80px 0px" });
  const rawUrl = project.youtube_url || project.youtube || project.video_url || "";
  const parsedVideo = parseVideoUrl(rawUrl);

  const [isPlaying, setIsPlaying] = useState(false);
  const [imgSrc, setImgSrc] = useState(
    getVideoCover(rawUrl, project.cover_image, project.thumbnail || "/images/commercial.jpg")
  );

  const handleClick = () => {
    if (onOpenVideo && parsedVideo.embedUrl) {
      onOpenVideo(parsedVideo);
    } else if (parsedVideo.embedUrl) {
      setIsPlaying(true);
    }
  };

  const handleImageError = () => {
    if (parsedVideo.type === "youtube" && parsedVideo.hqThumbnailUrl && imgSrc !== parsedVideo.hqThumbnailUrl) {
      setImgSrc(parsedVideo.hqThumbnailUrl);
    } else {
      setImgSrc("/images/commercial.jpg");
    }
  };

  return (
    <>
      <div
        ref={cardRef}
        onClick={handleClick}
        className={`group relative w-full h-full rounded-lg sm:rounded-xl overflow-hidden cursor-pointer bg-neutral-950 border border-white/10 hover:border-white/30 transition-all duration-700 ease-out select-none shadow-xl ${
          isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-[0.98]"
        }`}
      >
        {/* Full-Bleed Cover Image with Lazy Loading */}
        <img
          src={imgSrc}
          alt={project.title || "Project Cover"}
          loading="lazy"
          decoding="async"
          onError={handleImageError}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Format Pill (Top Right) */}
        {parsedVideo.type !== "none" && (
          <div className="absolute top-3 right-3 z-20">
            {parsedVideo.isReel || parsedVideo.type === "instagram" ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-gradient-to-r from-purple-600/90 to-pink-600/90 text-white backdrop-blur-md border border-pink-400/30 shadow-lg">
                <FaInstagram size={11} />
                <span>Reel</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-black/60 text-gray-200 backdrop-blur-md border border-white/20">
                <FaYoutube size={12} className="text-red-500" />
                <span>Video</span>
              </span>
            )}
          </div>
        )}

        {/* Dark Vignette Overlay (Darker at bottom for text readability) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-black/5 group-hover:from-black/90 transition-colors duration-300" />

        {/* Non-intrusive center play cue that subtly appears only on hover */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-md border border-white/30 text-white flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform duration-300 shadow-2xl">
            <Play size={18} className="ml-0.5 fill-white text-white" />
          </div>
        </div>

        {/* Bottom Bar: Title on left, Chevron right on right */}
        <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 flex items-end justify-between gap-3 z-10">
          <div className="min-w-0 flex-1">
            {project.category && (
              <span className="text-[10px] tracking-[2px] uppercase text-orange-400 font-bold block mb-1 opacity-90 truncate">
                {project.category}
              </span>
            )}
            <h3 className="text-white text-sm sm:text-base font-semibold tracking-wide truncate group-hover:text-orange-200 transition-colors duration-200">
              {project.title || "Untitled Project"}
            </h3>
            {project.role && (
              <p className="text-[11px] text-gray-400 font-light truncate mt-0.5">
                {project.role} {project.year ? `• ${project.year}` : ""}
              </p>
            )}
          </div>

          {/* Simple Clean Chevron Right */}
          <div className="shrink-0 text-white/80 group-hover:text-white group-hover:translate-x-1.5 transition-all duration-300 pb-0.5">
            <ChevronRight size={20} />
          </div>
        </div>
      </div>

      {/* Standalone Video Modal (Used when onOpenVideo callback is not passed) */}
      {isPlaying && parsedVideo.embedUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 md:p-8"
          onClick={() => setIsPlaying(false)}
        >
          {parsedVideo.isReel || parsedVideo.type === "instagram" ? (
            <div
              className="relative w-full max-w-[360px] sm:max-w-[400px] h-[82vh] max-h-[720px] aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/20 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsPlaying(false)}
                className="absolute top-3 right-3 z-30 w-9 h-9 rounded-full bg-black/80 hover:bg-white text-white hover:text-black border border-white/20 flex items-center justify-center text-sm transition duration-200 cursor-pointer"
                aria-label="Close Reel"
              >
                <X size={16} />
              </button>
              <iframe
                src={parsedVideo.embedUrl}
                title={project.title || "Instagram Reel"}
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
                onClick={() => setIsPlaying(false)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/80 hover:bg-white text-white hover:text-black border border-white/20 flex items-center justify-center text-lg transition duration-200 cursor-pointer"
                aria-label="Close Video"
              >
                <X size={18} />
              </button>
              <iframe
                src={`${parsedVideo.embedUrl}${parsedVideo.embedUrl.includes("?") ? "&" : "?"}autoplay=1`}
                title={project.title || "Project Video"}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </div>
      )}
    </>
  );
}