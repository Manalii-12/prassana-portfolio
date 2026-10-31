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
  const [data, setData] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("prasanna_cached_contact_data");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.id) return parsed;
        }
      } catch (e) {}
    }
    return DEFAULT_CONTACT;
  });

  useEffect(() => {
    try {
      const cached = localStorage.getItem("prasanna_cached_contact_data");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.id) setData(parsed);
      }
    } catch (e) {}

    async function fetchContact() {
      try {
        const res = await fetch(`${API_BASE}/api/contact`);
        if (res.ok) {
          const json = await res.json();
          if (json && json.id) {
            setData((prev) => ({ ...prev, ...json }));
            try {
              localStorage.setItem("prasanna_cached_contact_data", JSON.stringify(json));
            } catch (e) {}
          }
        }
      } catch (err) {
        console.warn("Contact API not reachable, using cached contact data:", err);
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

  return (
    <section
      id="contact"
      className="bg-[#080B11] text-white py-16 md:py-24 px-6 md:px-12 select-none border-t border-white/5 relative"
    >
      <div className="max-w-4xl mx-auto relative z-10">
        <ScrollReveal animation="slide-up" className="space-y-6">
          <div className="text-center sm:text-left">
            {data.subheading && data.subheading.trim() ? (
              <span className="text-xs uppercase tracking-[4px] text-orange-400 font-bold block mb-2">
                {data.subheading}
              </span>
            ) : null}
            {data.heading && data.heading.trim() ? (
              <h2 className="designer-font text-4xl sm:text-5xl md:text-6xl uppercase tracking-tight text-white">
                {data.heading}
              </h2>
            ) : null}
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
    </section>
  );
}