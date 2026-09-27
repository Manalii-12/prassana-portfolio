"use client";

import ProjectCard from "@/components/ProjectCard";

export default function ProjectBentoGrid({ projects = [], onOpenVideo }) {
  if (!projects || projects.length === 0) return null;

  // Chunk projects into blocks of 4
  const chunks = [];
  for (let i = 0; i < projects.length; i += 4) {
    chunks.push(projects.slice(i, i + 4));
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {chunks.map((chunk, chunkIdx) => {
        // Complete 4-Card Royal Enfield Bento Block
        // (Left Tall, 2 Stacked Center, Right Tall)
        if (chunk.length === 4) {
          const [p0, p1, p2, p3] = chunk;
          return (
            <div
              key={`bento-block-${chunkIdx}`}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {/* Column 1: Left Tall (spans full height) */}
              <div className="h-[320px] sm:h-[400px] lg:h-[520px]">
                <ProjectCard project={p0} onOpenVideo={onOpenVideo} />
              </div>

              {/* Column 2: 2 Stacked Landscape Cards */}
              <div className="flex flex-col gap-4 h-auto lg:h-[520px] md:col-span-1">
                <div className="h-[240px] sm:h-[260px] lg:h-[252px]">
                  <ProjectCard project={p1} onOpenVideo={onOpenVideo} />
                </div>
                <div className="h-[240px] sm:h-[260px] lg:h-[252px]">
                  <ProjectCard project={p2} onOpenVideo={onOpenVideo} />
                </div>
              </div>

              {/* Column 3: Right Tall (spans full height) */}
              <div className="h-[320px] sm:h-[400px] lg:h-[520px] md:col-span-2 lg:col-span-1">
                <ProjectCard project={p3} onOpenVideo={onOpenVideo} />
              </div>
            </div>
          );
        }

        // 3 Cards: Left tall + 2 stacked center
        if (chunk.length === 3) {
          const [p0, p1, p2] = chunk;
          return (
            <div
              key={`bento-block-${chunkIdx}`}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              <div className="h-[320px] sm:h-[400px] lg:h-[520px]">
                <ProjectCard project={p0} onOpenVideo={onOpenVideo} />
              </div>
              <div className="flex flex-col gap-4 h-auto lg:h-[520px] md:col-span-1">
                <div className="h-[240px] sm:h-[260px] lg:h-[252px]">
                  <ProjectCard project={p1} onOpenVideo={onOpenVideo} />
                </div>
                <div className="h-[240px] sm:h-[260px] lg:h-[252px]">
                  <ProjectCard project={p2} onOpenVideo={onOpenVideo} />
                </div>
              </div>
            </div>
          );
        }

        // 2 Cards: 2 balanced side-by-side cards
        if (chunk.length === 2) {
          return (
            <div
              key={`bento-block-${chunkIdx}`}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {chunk.map((p, idx) => (
                <div key={`p-2-${idx}`} className="h-[280px] sm:h-[340px]">
                  <ProjectCard project={p} onOpenVideo={onOpenVideo} />
                </div>
              ))}
            </div>
          );
        }

        // 1 Card: Single wide card
        return (
          <div key={`bento-block-${chunkIdx}`} className="h-[320px] sm:h-[400px] w-full">
            <ProjectCard project={chunk[0]} onOpenVideo={onOpenVideo} />
          </div>
        );
      })}
    </div>
  );
}
