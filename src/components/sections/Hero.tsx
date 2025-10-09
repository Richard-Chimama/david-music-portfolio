import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Heading, Subheading, Body } from "@/components/ui/Typography";

export function Hero() {
  return (
    <Section className="relative overflow-hidden">
      <div aria-hidden className="absolute inset-0 opacity-30">
        <div className="gradient-neon w-[60%] h-[60%] rounded-full blur-[120px] absolute -top-20 -left-20 animate-float" />
        <div className="gradient-neon w-[50%] h-[50%] rounded-full blur-[100px] absolute -bottom-10 right-0 animate-float" style={{ animationDelay: '1.2s' }} />
      </div>
      <Container className="grid md:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <Subheading>NeoSound</Subheading>
          <Heading as="h1" className="text-4xl sm:text-5xl md:text-6xl">Futuristic Music Portfolio</Heading>
          <Body>
            Sonic landscapes and immersive rhythms. Explore releases, playlists, and connect.
          </Body>
          <div className="flex gap-4">
            <Button aria-label="Listen to featured playlist">Listen Now</Button>
            <Button variant="secondary" aria-label="Contact the artist">Contact</Button>
          </div>
        </div>
        <div className="glass rounded-2xl p-6 shadow-glow">
          <Image src="/next.svg" alt="Abstract sound wave" width={500} height={200} className="w-full h-auto dark:invert" />
        </div>
      </Container>
    </Section>
  );
}