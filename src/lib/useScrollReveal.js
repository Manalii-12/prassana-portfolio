"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Custom hook to detect when an element scrolls into view.
 * Enables lazy loading of heavy elements (images, iframes, sections)
 * and triggering smooth scroll-in animations.
 */
export function useScrollReveal(options = { threshold: 0.1, rootMargin: "60px" }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(el);
      }
    }, options);

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [options]);

  return [ref, isVisible];
}
