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
import { MusicalWave } from "@/components/ui/MusicalWave";
import { useEffect, useRef } from "react";
import { smoothScrollToId } from "@/utils/scroll";

export function Hero() {
  const typewriterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = typewriterRef.current;
    if (!el) return;

    const words = [
      "music producer",
      "songwriter",
      "singer",
      "film star",
      "sound engineer",
      "filmmaker",
    ];
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
      el.textContent = words[0];
      return;
    }

    const tick = () => {
      if (!isVisible) {
        // Recheck later when not visible
        tickTimeout = window.setTimeout(tick, 120);
        return;
      }
      const current = words[wordIndex];
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
          wordIndex = (wordIndex + 1) % words.length;
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
  }, []);

  return (
    <Section className="relative sm:pb-0! pb-0! overflow-hidden">
      <div aria-hidden className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="gradient-neon w-[60%] h-[60%] rounded-full blur-[120px] absolute -top-20 -left-20 animate-float" />
        <div className="gradient-neon w-[50%] h-[50%] rounded-full blur-[100px] absolute -bottom-10 right-0 animate-float" style={{ animationDelay: '1.2s' }} />
      </div>
      <Container className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <Image
            src="/test1.svg"
            alt="Sweden"
            width={500}
            height={500}
            className="w-full h-full object-cover rounded-lg shadow-[0_0_30px_rgba(0,0,0,0.5)]"
          />
          <Subheading>Iam Sweden</Subheading>
          <Heading as="h1" className="text-2xl sm:text-5xl md:text-4xl">
            <span 
              ref={typewriterRef}
              id="hero-typewriter" 
              className="inline-block min-h-[1em] whitespace-nowrap text-[var(--foreground)] transition-opacity duration-300 ease-in-out" 
              aria-live="polite" aria-atomic="true"
            />
          </Heading>
          <Body>
            Sonic landscapes and immersive rhythms. Explore releases, playlists, and connect.
          </Body>
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
            <YouTubeIcon href="https://www.youtube.com/@swiden369" />
            <AudiomackIcon href="https://audiomack.com/swiden" />
            <TikTokIcon href="https://www.tiktok.com/@iamswiden?_t=ZN-90PSwX76KoA&_r=1" />
            <SpotifyIcon href="https://open.spotify.com/artist/7ib41FQHWZxem6NLTqaYH6?si=0dCjFJxfQKGhdwR-EdnfJA" />
            <InstagramIcon href="https://www.instagram.com/beats_by_swiden_?igsh=MWN2ZXFzaGw4dmliYg%3D%3D&utm_source=qr" />
          </div>
        </div>
        <HeroCarousel
          slides={[
            <Image key="slide-sweden" src="/sweden3.png" alt="Abstract sound wave" width={500} height={200} className="w-full h-auto" />,
            <Image key="slide-next" src="/sweden1.png" alt="Neon waveform" width={500} height={200} className="w-full h-auto " />,
            <Image key="slide-vercel" src="/sweden.png" alt="Synth grid" width={500} height={200} className="w-full h-auto" />,
          ]}
          ariaLabel="Hero carousel"
        />
        {/* Mobile social icons (below carousel) */}
        <div className="flex md:hidden items-center gap-4 mt-6 justify-center">
          <YouTubeIcon href="https://www.youtube.com/@swiden369" />
          <AudiomackIcon href="https://audiomack.com/swiden" />
          <TikTokIcon href="https://www.tiktok.com/@iamswiden?_t=ZN-90PSwX76KoA&_r=1" />
          <SpotifyIcon href="https://open.spotify.com/artist/7ib41FQHWZxem6NLTqaYH6?si=0dCjFJxfQKGhdwR-EdnfJA" />
          <InstagramIcon href="https://www.instagram.com/beats_by_swiden_?igsh=MWN2ZXFzaGw4dmliYg%3D%3D&utm_source=qr" />
        </div>
      </Container>
    </Section>
  );
}