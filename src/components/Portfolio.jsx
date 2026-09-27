"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const DEFAULT_EXPLORE = {
  heading: "Explore My Work",
  subheading: "PORTFOLIO",
  commercial_title: "Commercial Projects",
  commercial_subtitle: "",
  commercial_image: "/images/commercial.jpg",
  personal_title: "Personal Projects",
  personal_subtitle: "",
  personal_image: "/images/personal.jpg",
};

export default function Portfolio() {
  const [data, setData] = useState(DEFAULT_EXPLORE);

  useEffect(() => {
    async function loadExploreData() {
      try {
        const res = await fetch(`${API_BASE}/api/explore`);
        if (res.ok) {
          const json = await res.json();
          if (json && (json.commercial_title || json.commercial_image)) {
            setData((prev) => ({ ...prev, ...json }));
          }
        }
      } catch (err) {
        console.warn("Using default explore section data:", err);
      }
    }

    loadExploreData();
  }, []);

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
                  src={data.commercial_image || "/images/commercial.jpg"}
                  alt={data.commercial_title || "Commercial Projects"}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Clean Dark Vignette Overlay (No color tint) */}
                <div className="absolute inset-0 bg-black/55 group-hover:bg-black/45 transition duration-500"></div>

                {/* Clean White Text Overlay (Overlaid inside the box) */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <h3 className="designer-font text-white text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight transition duration-300">
                    {data.commercial_title || "Commercial Projects"}
                  </h3>

                  {data.commercial_subtitle?.trim() && (
                    <p className="text-gray-300 text-xs sm:text-sm font-light mt-2 max-w-sm">
                      {data.commercial_subtitle}
                    </p>
                  )}
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
                  src={data.personal_image || "/images/personal.jpg"}
                  alt={data.personal_title || "Personal Projects"}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Clean Dark Vignette Overlay (No color tint) */}
                <div className="absolute inset-0 bg-black/55 group-hover:bg-black/45 transition duration-500"></div>

                {/* Clean White Text Overlay (Overlaid inside the box) */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <h3 className="designer-font text-white text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight transition duration-300">
                    {data.personal_title || "Personal Projects"}
                  </h3>

                  {data.personal_subtitle?.trim() && (
                    <p className="text-gray-300 text-xs sm:text-sm font-light mt-2 max-w-sm">
                      {data.personal_subtitle}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}