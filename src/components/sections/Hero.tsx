"use client";
import Image from "next/image";

import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Heading, Subheading, Body } from "@/components/ui/Typography";
import { HeroCarousel } from "@/components/sections/HeroCarousel";
import YouTubeIcon from "@/components/icons/YouTubeIcon";
import AudiomackIcon from "@/components/icons/AudiomackIcon";
import TikTokIcon from "@/components/icons/TikTokIcon";
import SpotifyIcon from "@/components/icons/SpotifyIcon";
import InstagramIcon from "@/components/icons/InstagramIcon";
import UnsupportedSocialIcon from "@/components/icons/UnsupportedSocialIcon";
import { MusicalWave } from "@/components/ui/MusicalWave";
import { useEffect, useRef } from "react";
import { smoothScrollToId } from "@/utils/scroll";
import { HeroContent, SocialLink } from "@/types/types";
import { useContentfulState } from "@/components/state/ContentfulProvider";

const fallbackSocialLinks = [
  { name: "youtube", url: "https://www.youtube.com/@swiden369" },
  { name: "audiomack", url: "https://audiomack.com/swiden" },
  { name: "tiktok", url: "https://www.tiktok.com/@iamswiden" },
  { name: "spotify", url: "https://open.spotify.com/artist/7ib41FQHWZxem6NLTqaYH6" },
  { name: "instagram", url: "https://www.instagram.com/beats_by_swiden_/" },
];

const fallbackHeroImages = [
  { url: "/sweden3.png", title: "Abstract sound wave", description: "", width: 500, height: 200 },
  { url: "/sweden1.png", title: "Neon waveform", description: "", width: 500, height: 200 },
  { url: "/sweden.png", title: "Synth grid", description: "", width: 500, height: 200 },
];

function richTextToPlainText(value: unknown): string {
  if (!value || typeof value !== "object") return "";
  if (Array.isArray(value)) {
    return value.map(richTextToPlainText).join("");
  }

  const node = value as Record<string, unknown>;
  if (node.nodeType === "text" && typeof node.value === "string") {
    return node.value;
  }

  const content = richTextToPlainText(node.content);
  return node.nodeType === "paragraph" ? `${content}\n` : content;
}


function SocialLinks({ links }: { links: SocialLink[] }) {
  return (
    <>
      {links.map((link) => {
        const name = link.name.trim().toLowerCase();
        const key = link.id || `${name}-${link.url}`;

        if (name.includes("youtube")) return <YouTubeIcon key={key} href={link.url} />;
        if (name.includes("audiomack")) return <AudiomackIcon key={key} href={link.url} />;
        if (name.includes("tiktok")) return <TikTokIcon key={key} href={link.url} />;
        if (name.includes("spotify")) return <SpotifyIcon key={key} href={link.url} />;
        if (name.includes("instagram")) return <InstagramIcon key={key} href={link.url} />;

        return <UnsupportedSocialIcon key={key} name={link.name} href={link.url} />;
      })}
    </>
  );
}

export function Hero() {
  const { homepage } = useContentfulState();
  const viewModel: HeroContent = homepage?.hero ?? {
    primaryImageText: "Swiden",
    words: ["music producer"],
    textBody: null,
    socialIconsCollection: null,
    primaryImage: null,
    heroImagesCollection: { items: [] },
  };
  const socialIcons = Array.isArray(viewModel.socialIconsCollection?.items)
    ? viewModel.socialIconsCollection.items
    : [];
  const heroImages = Array.isArray(viewModel.heroImagesCollection?.items)
    ? viewModel.heroImagesCollection.items
    : [];
  const contentfulHeroImages = heroImages.filter(
    (image) => typeof image.url === "string" && image.url.trim().length > 0,
  );
  const heroSlides = contentfulHeroImages.length
    ? contentfulHeroImages
    : fallbackHeroImages;
  const typewriterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = typewriterRef.current;
    if (!el) return;

    const contentfulWords = Array.isArray(viewModel.words) ? viewModel.words : [];
    const typewriterWords = contentfulWords.length ? contentfulWords : ["musician"];
    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let tickTimeout: number | null = null;
    let isVisible = true;

    const typingSpeed = 160; // slightly faster for snappier feel
    const pauseBetweenWords = 800;

    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      el.textContent = typewriterWords[0];
      return;
    }

    const tick = () => {
      if (!isVisible) {
        // Recheck later when not visible
        tickTimeout = window.setTimeout(tick, 120);
        return;
      }
      const current = typewriterWords[wordIndex];
      if (!deleting) {
        charIndex++;
        el.textContent = current.slice(0, Math.min(charIndex, current.length));
        if (charIndex >= current.length) {
          deleting = true;
          tickTimeout = window.setTimeout(tick, pauseBetweenWords);
          return;
        }
      } else {
        charIndex--;
        el.textContent = current.slice(0, Math.max(charIndex, 0));
        if (charIndex <= 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % typewriterWords.length;
        }
      }
      tickTimeout = window.setTimeout(tick, typingSpeed);
    };

    // Visibility detection using IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.1, rootMargin: '50px 0px' }
    );
    observer.observe(el);

    // Start animation
    tick();

    return () => {
      if (tickTimeout) window.clearTimeout(tickTimeout);
      observer.disconnect();
    };
  }, [viewModel.words]);

  const socialLinks = socialIcons.length
    ? socialIcons
    : fallbackSocialLinks;
  const bodyText = richTextToPlainText(viewModel.textBody?.json).trim();

  return (
    <Section className="relative sm:pb-0! pb-0! overflow-hidden">
      <div aria-hidden className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="gradient-neon w-[60%] h-[60%] rounded-full blur-[120px] absolute -top-20 -left-20 animate-float" />
        <div className="gradient-neon w-[50%] h-[50%] rounded-full blur-[100px] absolute -bottom-10 right-0 animate-float" style={{ animationDelay: '1.2s' }} />
      </div>
      <Container className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <Image
            src={viewModel.primaryImage?.url || "/test1.svg"}
            alt={viewModel.primaryImage?.description || viewModel.primaryImageText || "Swiden"}
            width={500}
            height={500}
            className="w-full h-full object-cover rounded-lg shadow-[0_0_30px_rgba(0,0,0,0.5)]"
          />
          <Subheading>{viewModel.primaryImageText || "Iam Swiden"}</Subheading>
          <Heading as="h1" className="text-2xl sm:text-5xl md:text-4xl">
            <span 
              ref={typewriterRef}
              id="hero-typewriter" 
              className="inline-block min-h-[1em] whitespace-nowrap text-[var(--foreground)] transition-opacity duration-300 ease-in-out" 
              aria-live="polite" aria-atomic="true"
            />
          </Heading>
          <Body>{bodyText || "Sonic landscapes and immersive rhythms. Explore releases, playlists, and connect."}</Body>
          <MusicalWave className="h-20 w-full" decorative aria-label="Hero musical wave" />
          <div className="flex gap-4">
            <a 
              href="#playlist" 
              className="focus-ring inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 ease-in-out cursor-pointer bg-[var(--neon-blue)] hover:bg-[var(--neon-purple)] hover:scale-105 hover:shadow-[0_0_20px_rgba(43,134,197,0.8)] text-black shadow-[0_0_12px_rgba(43,134,197,0.6)] active:scale-95 active:shadow-[0_0_8px_rgba(43,134,197,0.4)]"
              aria-label="Listen to featured playlist"
              onClick={(e) => {
                e.preventDefault();
                smoothScrollToId('playlist');
              }}
            >
              Listen Now
            </a>
            <a 
              href="#contact" 
              className="focus-ring inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 ease-in-out cursor-pointer bg-[var(--surface)] text-[var(--foreground)] border border-[var(--border)] hover:border-[var(--neon-cyan)] hover:scale-105 hover:shadow-[0_0_16px_rgba(34,211,238,0.4)] active:scale-95 active:border-[var(--neon-purple)]"
              aria-label="Contact the artist"
              onClick={(e) => {
                e.preventDefault();
                smoothScrollToId('contact');
              }}
            >
              Contact
            </a>
          </div>
          {/* Social Icons - Desktop */}
          <div className="hidden md:flex items-center flex-start gap-4 mt-8">
            <SocialLinks links={socialLinks} />
          </div>
        </div>
        <HeroCarousel
          slides={heroSlides.map((image, index) => (
            <Image
              key={`${image.url}-${index}`}
              src={image.url}
              alt={image.description || image.title || "Hero artwork"}
              width={image.width || 500}
              height={image.height || 200}
              className="w-full h-auto"
              unoptimized={image.url.startsWith("http")}
            />
          ))}
          ariaLabel="Hero carousel"
        />
        {/* Mobile social icons (below carousel) */}
        <div className="flex md:hidden items-center gap-4 mt-6 justify-center">
          <SocialLinks links={socialLinks} />
        </div>
      </Container>
    </Section>
  );
}