"use client";

import { useState } from "react";
import ProjectCard from "@/components/ProjectCard";
import { ChevronDown } from "lucide-react";

export default function ProjectBentoGrid({
  projects = [],
  onOpenVideo,
  sectionType = "commercial",
}) {
  const [showMore, setShowMore] = useState(false);

  if (!projects || projects.length === 0) return null;

  // The first 4 projects form the signature Royal Enfield Bento Grid
  const featured = projects.slice(0, 4);
  // Any projects beyond the first 4 appear in the "More Projects" section
  const more = projects.slice(4);

  return (
    <div className="space-y-8">
      {/* 1. Main Signature Bento Grid (Top 4 Featured Projects) */}
      {featured.length === 4 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Column 1: Left Tall (spans full height) */}
          <div className="h-[320px] sm:h-[400px] lg:h-[520px]">
            <ProjectCard project={featured[0]} onOpenVideo={onOpenVideo} />
          </div>

          {/* Column 2: 2 Stacked Landscape Cards */}
          <div className="flex flex-col gap-4 h-auto lg:h-[520px] md:col-span-1">
            <div className="h-[240px] sm:h-[260px] lg:h-[252px]">
              <ProjectCard project={featured[1]} onOpenVideo={onOpenVideo} />
            </div>
            <div className="h-[240px] sm:h-[260px] lg:h-[252px]">
              <ProjectCard project={featured[2]} onOpenVideo={onOpenVideo} />
            </div>
          </div>

          {/* Column 3: Right Tall (spans full height) */}
          <div className="h-[320px] sm:h-[400px] lg:h-[520px] md:col-span-2 lg:col-span-1">
            <ProjectCard project={featured[3]} onOpenVideo={onOpenVideo} />
          </div>
        </div>
      ) : featured.length === 3 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="h-[320px] sm:h-[400px] lg:h-[520px]">
            <ProjectCard project={featured[0]} onOpenVideo={onOpenVideo} />
          </div>
          <div className="flex flex-col gap-4 h-auto lg:h-[520px] md:col-span-1">
            <div className="h-[240px] sm:h-[260px] lg:h-[252px]">
              <ProjectCard project={featured[1]} onOpenVideo={onOpenVideo} />
            </div>
            <div className="h-[240px] sm:h-[260px] lg:h-[252px]">
              <ProjectCard project={featured[2]} onOpenVideo={onOpenVideo} />
            </div>
          </div>
        </div>
      ) : featured.length === 2 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featured.map((p, idx) => (
            <div key={`p-2-${idx}`} className="h-[280px] sm:h-[340px]">
              <ProjectCard project={p} onOpenVideo={onOpenVideo} />
            </div>
          ))}
        </div>
      ) : (
        <div className="h-[320px] sm:h-[400px] w-full">
          <ProjectCard project={featured[0]} onOpenVideo={onOpenVideo} />
        </div>
      )}

      {/* 2. "More Projects" Expandable Section (If projects > 4) */}
      {more.length > 0 && (
        <div className="pt-6 sm:pt-10 flex flex-col items-center">
          {/* Subtle Aesthetic Divider */}
          <div className="w-full flex items-center justify-center relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative px-4 bg-[#080B11] text-[10px] font-bold tracking-[3px] uppercase text-gray-500">
              Additional {sectionType === "commercial" ? "Commercial" : "Personal"} Works
            </div>
          </div>

          {/* Interactive Toggle Button */}
          <button
            onClick={() => setShowMore(!showMore)}
            className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full text-xs sm:text-sm font-bold tracking-wider uppercase bg-gradient-to-r from-orange-500/15 to-amber-500/15 hover:from-orange-500/25 hover:to-amber-500/25 text-orange-400 hover:text-orange-300 border border-orange-500/30 hover:border-orange-500/60 shadow-lg shadow-orange-500/10 transition-all duration-300 cursor-pointer group"
          >
            <span>
              {showMore
                ? "Show Fewer Projects"
                : `View More ${sectionType === "commercial" ? "Commercial" : "Personal"} Projects (${more.length})`}
            </span>
            <ChevronDown
              size={16}
              className={`transform transition-transform duration-300 ${
                showMore ? "rotate-180" : "group-hover:translate-y-0.5"
              }`}
            />
          </button>

          {/* Expandable Grid of Additional Projects */}
          {showMore && (
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-10 text-left">
              {more.map((project) => (
                <div key={project.id} className="h-[280px] sm:h-[340px]">
                  <ProjectCard project={project} onOpenVideo={onOpenVideo} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
