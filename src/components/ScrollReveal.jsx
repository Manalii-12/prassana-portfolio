"use client";

import { useEffect, useRef, useState } from "react";

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  animation = "slide-up", // 'slide-up' | 'scale' | 'fade' | 'slide-left' | 'slide-right'
  threshold = 0.1,
  rootMargin = "60px 0px",
  as: Component = "div",
  style = {},
  ...props
}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Fallback if IntersectionObserver is unavailable
    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  let transformStyle = "";
  if (!isVisible) {
    if (animation === "slide-up") {
      transformStyle = "opacity-0 translate-y-10";
    } else if (animation === "scale") {
      transformStyle = "opacity-0 scale-95 translate-y-6";
    } else if (animation === "fade") {
      transformStyle = "opacity-0";
    } else if (animation === "slide-left") {
      transformStyle = "opacity-0 -translate-x-8";
    } else if (animation === "slide-right") {
      transformStyle = "opacity-0 translate-x-8";
    }
  } else {
    transformStyle = "opacity-100 translate-y-0 translate-x-0 scale-100";
  }

  return (
    <Component
      ref={ref}
      style={{
        transitionDuration: "800ms",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        transitionDelay: `${delay}ms`,
        willChange: "opacity, transform",
        ...style,
      }}
      className={`transition-all ${transformStyle} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
