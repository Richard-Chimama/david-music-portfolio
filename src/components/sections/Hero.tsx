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
import { AdvancedMusicalWave } from "../ui/AdvancedMusicalWave";
import { useEffect, useRef } from "react";
import { smoothScrollToId } from "@/utils/scroll";

// Minimal jQuery typings used for the typewriter effect
type JQueryInstance = {
  length: number;
  text: (val: string) => JQueryInstance;
};
type JQueryStatic = (selector: string) => JQueryInstance;

export function Hero() {
  const typewriterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const w = window as unknown as { jQuery?: JQueryStatic; $?: JQueryStatic };
    let startTimeout: number | null = null;
    let tickTimeout: number | null = null;
    let isVisible = false;
    let isPaused = false;

    const startTyping = (jq: JQueryStatic) => {
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
      const typingSpeed = 200; // ms per character
      const pauseBetweenWords = 900; // pause after a word is complete

      const $el = jq("#hero-typewriter");
      if (!$el.length) return;

      const tick = () => {
        // Only continue if visible and not paused
        if (!isVisible || isPaused) {
          tickTimeout = window.setTimeout(tick, 100); // Check again in 100ms
          return;
        }

        const current = words[wordIndex];
        if (!deleting) {
          charIndex++;
          $el.text(current.slice(0, charIndex));
          if (charIndex >= current.length) {
            deleting = true;
            tickTimeout = window.setTimeout(tick, pauseBetweenWords);
            return;
          }
        } else {
          charIndex--;
          $el.text(current.slice(0, Math.max(charIndex, 0)));
          if (charIndex <= 0) {
            deleting = false;
            wordIndex = (wordIndex + 1) % words.length;
          }
        }
        tickTimeout = window.setTimeout(tick, typingSpeed);
      };

      // Start the animation
      tick();

      // Set up Intersection Observer for visibility detection
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const wasVisible = isVisible;
            isVisible = entry.isIntersecting;
            
            // Smooth transition: if becoming visible after being hidden, resume
            if (isVisible && !wasVisible) {
              isPaused = false;
            }
            // If becoming hidden, pause after a short delay for smooth transition
            else if (!isVisible && wasVisible) {
              isPaused = true;
            }
          });
        },
        {
          threshold: 0.1, // Trigger when 10% of element is visible
          rootMargin: '50px 0px', // Add some buffer for smoother transitions
        }
      );

      // Start observing the typewriter element
      if (typewriterRef.current) {
        observer.observe(typewriterRef.current);
        isVisible = true; // Initially visible
      }

      // Return cleanup function for observer
      return () => {
        observer.disconnect();
      };
    };

    const tryStart = () => {
      const jq = w.jQuery ?? w.$;
      if (!jq) {
        startTimeout = window.setTimeout(tryStart, 50);
        return;
      }
      const cleanup = startTyping(jq);
      return cleanup;
    };

    const cleanup = tryStart();

    return () => {
      if (startTimeout) window.clearTimeout(startTimeout);
      if (tickTimeout) window.clearTimeout(tickTimeout);
      if (cleanup) cleanup();
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
          <Subheading>I&apos;am Sweden</Subheading>
          <Heading as="h1" className="text-2xl sm:text-5xl md:text-4xl">
            <span 
              ref={typewriterRef}
              id="hero-typewriter" 
              className="inline-block min-h-[1em] text-[var(--foreground)] transition-opacity duration-300 ease-in-out" 
              aria-live="polite" 
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
        <AdvancedMusicalWave 
            className="h-10 w-full mt-16 sm:mt-24 pointer-events-none" 
            aria-label="Hero musical wave"
            audioSource="/audio/sample1.mp3"
            waveCount={4}
            amplitude={1.2}
            speed={0.8}
            glowIntensity={1.1}
            particleCount={15}
            enablePhysics={false}
          />
    </Section>
  );
}