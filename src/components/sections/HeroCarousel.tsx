import { Carousel } from "@/components/ui/Carousel";
import type { ReactNode } from "react";

type HeroCarouselProps = {
  slides: ReactNode[];
  ariaLabel?: string;
  cardClassName?: string;
};

export function HeroCarousel({
  slides,
  ariaLabel = "Hero carousel",
  cardClassName = "glass rounded-2xl p-6 pb-0 shadow-glow",
}: HeroCarouselProps) {
  const wrappedSlides = slides.map((slide, i) => (
    <div key={`hero-slide-${i}`} className={cardClassName}>
      {slide}
    </div>
  ));

  return <Carousel slides={wrappedSlides} ariaLabel={ariaLabel} />;
}