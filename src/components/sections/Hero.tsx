import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Heading, Subheading, Body } from "@/components/ui/Typography";
import { HeroCarousel } from "@/components/sections/HeroCarousel";
import { MusicalWave } from "@/components/ui/MusicalWave";
import { AdvancedMusicalWave } from "../ui/AdvancedMusicalWave";

export function Hero() {
  return (
    <Section className="relative sm:pb-0! pb-0! overflow-hidden">
      <div aria-hidden className="absolute inset-0 opacity-30">
        <div className="gradient-neon w-[60%] h-[60%] rounded-full blur-[120px] absolute -top-20 -left-20 animate-float" />
        <div className="gradient-neon w-[50%] h-[50%] rounded-full blur-[100px] absolute -bottom-10 right-0 animate-float" style={{ animationDelay: '1.2s' }} />
      </div>
      <Container className="grid md:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <Subheading>I&apos;am Sweden</Subheading>
          <Heading as="h1" className="text-4xl sm:text-5xl md:text-6xl">VIBRATION</Heading>
          <Body>
            Sonic landscapes and immersive rhythms. Explore releases, playlists, and connect.
          </Body>
          <MusicalWave className="h-20 w-full" decorative aria-label="Hero musical wave" />
          <div className="flex gap-4">
            <Button aria-label="Listen to featured playlist">Listen Now</Button>
            <Button variant="secondary" aria-label="Contact the artist">Contact</Button>
          </div>
        </div>
        <HeroCarousel
          slides={[
            <Image key="slide-sweden" src="/sweden.png" alt="Abstract sound wave" width={500} height={200} className="w-full h-auto" />,
            <Image key="slide-next" src="/next.svg" alt="Neon waveform" width={500} height={200} className="w-full h-auto dark:invert" />,
            <Image key="slide-vercel" src="/vercel.svg" alt="Synth grid" width={500} height={200} className="w-full h-auto dark:invert" />,
          ]}
          ariaLabel="Hero carousel"
        />
      </Container>
        <AdvancedMusicalWave 
            className="h-10 w-full mt-16 sm:mt-24" 
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