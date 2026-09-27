"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  Calendar,
  MapPin,
  ExternalLink,
  Ticket,
} from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function Upcoming() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/api/events`);
        if (res.ok) {
          const list = await res.json();
          if (Array.isArray(list)) {
            setEvents(list);
          }
        }
      } catch (err) {
        console.warn("Could not load events from server:", err);
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  // Strict User Rule: If nothing there, nothing should be shown!
  if (!loading && events.length === 0) {
    return null;
  }

  return (
    <section
      id="upcoming"
      className="bg-[#0B0E16] text-white py-8 md:py-10 px-6 md:px-12 lg:px-20 relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        <ScrollReveal animation="slide-up">
          {/* Compact Header */}
        <div className="flex items-center justify-between gap-3 mb-5 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center w-7 h-7 rounded-lg bg-orange-500/15 text-orange-400 border border-orange-500/30">
              <Bell size={14} />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping"></span>
            </div>
            <h3 className="designer-font text-xl sm:text-2xl text-white uppercase tracking-tight">
              Upcoming Projects
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400 border border-orange-500/30">
              {events.length} Live
            </span>
          </div>

          <span className="text-[11px] text-gray-400 font-mono hidden sm:inline">
            Releases & Screenings
          </span>
        </div>

        {/* Compact Events Display */}
        {events.length === 1 ? (
          // Single Event: Sleek Horizontal Notification Bar (Zero Wasted Space)
          <div className="rounded-2xl bg-gradient-to-r from-[#141A26] to-[#0E131E] border border-white/10 hover:border-orange-500/40 p-4 sm:p-5 transition shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-orange-500/15 text-orange-400 border border-orange-500/30">
                  {events[0].badge || "PREMIERE"}
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-300 font-medium">
                  <Calendar size={12} className="text-orange-400" />
                  <span>{events[0].date}</span>
                </span>
                {events[0].location && (
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <MapPin size={12} className="text-red-400" />
                    <span>{events[0].location}</span>
                  </span>
                )}
              </div>

              <h4 className="designer-font text-lg sm:text-xl text-white uppercase tracking-tight">
                {events[0].title}
              </h4>

              {events[0].description && (
                <p className="text-xs text-gray-300 font-light leading-relaxed line-clamp-2">
                  {events[0].description}
                </p>
              )}
            </div>

            {/* Action / Badge */}
            <div className="shrink-0 flex items-center gap-3">
              {events[0].link_url && events[0].link_url !== "#" ? (
                <a
                  href={events[0].link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider transition shadow"
                >
                  <Ticket size={13} />
                  <span>Passes / Details</span>
                  <ExternalLink size={11} />
                </a>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Official Premiere</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Multiple Events: Compact 2 or 3 Column Cards
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="rounded-2xl bg-gradient-to-b from-[#141A26] to-[#0E131E] border border-white/10 hover:border-orange-500/40 p-4 transition shadow-md flex flex-col justify-between gap-3"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-orange-500/15 text-orange-400 border border-orange-500/30">
                      {event.badge || "UPCOMING"}
                    </span>
                    <span className="text-[11px] text-gray-400 font-medium flex items-center gap-1">
                      <Calendar size={11} className="text-orange-400" />
                      <span>{event.date}</span>
                    </span>
                  </div>

                  <h4 className="designer-font text-base sm:text-lg text-white uppercase tracking-tight">
                    {event.title}
                  </h4>

                  {event.location && (
                    <p className="text-[11px] text-gray-400 flex items-center gap-1">
                      <MapPin size={11} className="text-red-400" />
                      <span>{event.location}</span>
                    </p>
                  )}

                  {event.description && (
                    <p className="text-xs text-gray-300 font-light line-clamp-2">
                      {event.description}
                    </p>
                  )}
                </div>

                {event.link_url && event.link_url !== "#" && (
                  <div className="pt-2 border-t border-white/5">
                    <a
                      href={event.link_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-400 hover:text-orange-300 transition"
                    >
                      <Ticket size={12} />
                      <span>Details & Passes</span>
                      <ExternalLink size={10} />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        </ScrollReveal>
      </div>
    </section>
  );
}