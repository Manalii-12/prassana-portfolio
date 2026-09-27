"use client";

import { useEffect, useState } from "react";
import { FaInstagram, FaYoutube, FaWhatsapp } from "react-icons/fa";
import { MapPin, Mail, MessageSquare, ExternalLink, ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const DEFAULT_CONTACT = {
  heading: "CONTACT",
  subheading: "DIRECTOR & CINEMATOGRAPHER",
  location: "Navi Mumbai, Maharashtra, India (Working Worldwide)",
  email: "prasannaoffcials@gmail.com",
  whatsapp: "",
  whatsapp_message: "Hi Prasanna, I would like to discuss a film/production project with you.",
  instagram: "https://instagram.com/your_username",
  youtube: "https://youtube.com/@your_channel",
  social_heading: "SOCIAL MEDIA",
  social_description: "Follow my journey. Behind the scenes, Short Films, Commercial Shoots & Photography.",
  instagram_button_text: "Follow on Instagram →",
  instagram_button_url: "https://instagram.com/your_username",
  image1: "/images/commercial.jpg",
  image2: "/images/about.jpg",
  image3: "/images/hero.png",
  image4: "/images/commercial.jpg",
  image5: "/images/about.jpg",
  image6: "/images/hero.png",
};

export default function Contact() {
  const [data, setData] = useState(DEFAULT_CONTACT);

  useEffect(() => {
    async function fetchContact() {
      try {
        const res = await fetch(`${API_BASE}/api/contact`);
        if (res.ok) {
          const json = await res.json();
          if (json && json.id) {
            setData((prev) => ({ ...prev, ...json }));
          }
        }
      } catch (err) {
        console.warn("Contact API not reachable, using default data:", err);
      }
    }

    fetchContact();
  }, []);

  const cleanPhone = (data.whatsapp || "").replace(/[^0-9]/g, "");
  const effectivePhone = cleanPhone && cleanPhone !== "919876543210" ? cleanPhone : "918097075054";
  const displayPhone = data.whatsapp && cleanPhone !== "919876543210" ? data.whatsapp : "+91 8097075054";
  const whatsappUrl = `https://wa.me/${effectivePhone}?text=${encodeURIComponent(
    data.whatsapp_message || "Hi Prasanna, I would like to discuss a film/production project with you."
  )}`;

  const galleryImages = [
    data.image1 || "/images/commercial.jpg",
    data.image2 || "/images/about.jpg",
    data.image3 || "/images/hero.png",
    data.image4 || "/images/commercial.jpg",
    data.image5 || "/images/about.jpg",
    data.image6 || "/images/hero.png",
  ];

  return (
    <section
      id="contact"
      className="bg-[#080B11] text-white py-16 md:py-24 px-6 md:px-12 select-none border-t border-white/5 relative"
    >
      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-10 lg:gap-14 items-start relative z-10">
        {/* Left Side (Contact Information) */}
        <div className="lg:col-span-7">
          <ScrollReveal animation="slide-up" className="space-y-6">
            <div>
              <span className="text-xs uppercase tracking-[4px] text-orange-400 font-bold block mb-2">
              {data.subheading || "DIRECTOR & CINEMATOGRAPHER"}
            </span>
            <h2 className="designer-font text-4xl sm:text-5xl md:text-6xl uppercase tracking-tight text-white">
              {data.heading || "CONTACT"}
            </h2>
          </div>

          <div className="space-y-4">
            {/* Location */}
            {data.location && (
              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-white/5 text-gray-300 shrink-0 mt-0.5">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Location
                    </p>
                    <p className="text-sm font-medium text-white mt-0.5">
                      {data.location}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Direct Contact (Email & WhatsApp) */}
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Email */}
              {data.email && (
                <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition">
                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 rounded-xl bg-white/5 text-gray-300 shrink-0 mt-0.5">
                      <Mail size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Direct Email
                      </p>
                      <a
                        href={`mailto:${data.email}`}
                        className="text-sm font-medium text-white hover:text-orange-400 transition truncate block mt-0.5"
                      >
                        {data.email}
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* WhatsApp Quick Chat */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-emerald-500/40 hover:bg-white/[0.04] transition group block"
              >
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 shrink-0 mt-0.5 group-hover:scale-105 transition">
                    <FaWhatsapp size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                        WhatsApp Chat
                      </p>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    </div>
                    <p className="text-sm font-bold text-white mt-0.5 group-hover:text-emerald-300 transition truncate">
                      {displayPhone}
                    </p>
                  </div>
                </div>
              </a>
            </div>

            {/* Social Media Section */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-orange-400">
                  {data.social_heading || "SOCIAL MEDIA"}
                </p>
                {data.social_description && (
                  <p className="text-xs text-gray-400 font-light mt-1 leading-relaxed">
                    {data.social_description}
                  </p>
                )}
              </div>

              {/* Social Icon Row */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                {/* Instagram */}
                {data.instagram && (
                  <a
                    href={data.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Follow on Instagram"
                    className="w-10 h-10 rounded-xl bg-white/5 hover:bg-[#E1306C] text-gray-300 hover:text-white border border-white/10 flex items-center justify-center transition-all duration-300 hover:scale-105"
                  >
                    <FaInstagram size={18} />
                  </a>
                )}

                {/* YouTube */}
                {data.youtube && (
                  <a
                    href={data.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Subscribe on YouTube"
                    className="w-10 h-10 rounded-xl bg-white/5 hover:bg-[#FF0000] text-gray-300 hover:text-white border border-white/10 flex items-center justify-center transition-all duration-300 hover:scale-105"
                  >
                    <FaYoutube size={18} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>

        {/* Right Side (Visual Feed Showcase) */}
        <div className="lg:col-span-5">
          <ScrollReveal delay={150} animation="slide-up">
            <div className="bg-white/[0.02] border border-white/10 p-5 sm:p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-[2px] text-orange-400">
                    Visual Feed
                  </span>
                  <h3 className="text-base font-bold text-white">Selected Captures</h3>
                </div>
                <span className="text-[10px] font-mono text-gray-500">Curated Work</span>
              </div>

              {/* 3x2 Curated Photo Grid */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                {galleryImages.map((img, i) => (
                  <div
                    key={`feed-img-${i}`}
                    className="aspect-square rounded-xl overflow-hidden bg-black/40 border border-white/5 group relative"
                  >
                    <img
                      src={img}
                      alt={`Portfolio Capture ${i + 1}`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = "/images/commercial.jpg";
                      }}
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                  </div>
                ))}
              </div>

              {/* Instagram Link CTA Button */}
              <a
                href={data.instagram_button_url || data.instagram || "https://instagram.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl font-medium text-xs tracking-wider text-gray-200 hover:text-white bg-white/5 hover:bg-orange-500 border border-white/10 hover:border-orange-500 transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>{data.instagram_button_text || "Follow on Instagram →"}</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}