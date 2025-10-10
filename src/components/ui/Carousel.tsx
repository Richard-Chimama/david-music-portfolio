"use client";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

type CarouselProps = {
  slides: ReactNode[];
  ariaLabel?: string;
};

export function Carousel({ slides, ariaLabel = "Carousel" }: CarouselProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(0);

  // Update index on scroll for snap-based carousels
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const w = el.clientWidth;
        const i = Math.round(el.scrollLeft / (w || 1));
        setIndex(Math.max(0, Math.min(slides.length - 1, i)));
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [slides.length]);

  const goTo = (i: number) => {
    const el = containerRef.current;
    if (!el) return;
    const w = el.clientWidth;
    el.scrollTo({ left: i * w, behavior: "smooth" });
    setIndex(i);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(Math.min(index + 1, slides.length - 1));
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(Math.max(index - 1, 0));
    } else if (e.key === "Home") {
      e.preventDefault();
      goTo(0);
    } else if (e.key === "End") {
      e.preventDefault();
      goTo(slides.length - 1);
    }
  };

  return (
    <div className="w-full" aria-roledescription="carousel" aria-label={ariaLabel}>
      <div
        ref={containerRef}
        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth touch-pan-x no-scrollbar"
        role="group"
        tabIndex={0}
        onKeyDown={onKeyDown}
        aria-live="polite"
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            className="shrink-0 w-full snap-center transition-transform duration-500 ease-out px-0 md:px-2"
            aria-roledescription="slide"
            aria-label={`Slide ${i + 1} of ${slides.length}`}
          >
            {slide}
          </div>
        ))}
      </div>

      {/* Mobile indicators (dots) */}
      <div className="mt-4 flex md:hidden items-center justify-center gap-2" role="tablist" aria-label="Slide indicators">
        {slides.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={index === i}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 w-2 rounded-full transition-colors ${index === i ? "bg-[var(--neon-cyan)]" : "bg-[var(--border)]"}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>

      {/* Desktop indicators (neon bars) */}
      <div className="mt-6 hidden md:flex items-center justify-center gap-3" role="tablist" aria-label="Slide indicators">
        {slides.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={index === i}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 w-10 rounded-full transition-all ${index === i ? "gradient-neon shadow-glow" : "bg-[var(--border)] hover:bg-[var(--neon-purple)]"}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div>
  );
}