"use client";
import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Heading, Body } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";

type Track = { id: number; title: string; duration: string; src: string };

const tracks: Track[] = [
  { id: 1, title: "Aurora Pulse", duration: "3:42", src: "/audio/sample1.mp3" },
  { id: 2, title: "Neon Drift", duration: "4:05", src: "/audio/sample2.mp3" },
  { id: 3, title: "Cyan Skyline", duration: "2:58", src: "/audio/sample3.mp3" },
];

export function FeaturedPlaylist() {
  const [current, setCurrent] = useState<Track | null>(tracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <Section id="playlist">
      <Container>
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1">
            <Heading>Featured Playlist</Heading>
            <Body className="mt-2">Dive into curated tracks that define the NeoSound vibe.</Body>
            <div className="glass rounded-2xl p-6 mt-6">
              <div className="flex items-center gap-4">
                <Button aria-label={isPlaying ? "Pause" : "Play"} onClick={() => setIsPlaying(p => !p)}>
                  {isPlaying ? "Pause" : "Play"}
                </Button>
                <div>
                  <p className="font-medium">{current?.title}</p>
                  <p className="text-sm text-[var(--foreground)]/70">{current?.duration}</p>
                </div>
              </div>
              <audio aria-label="Audio player" className="mt-4 w-full" src={current?.src} controls />
            </div>
          </div>
          <div className="w-full md:w-80">
            <ul className="glass rounded-2xl p-4 divide-y divide-[var(--border)]">
              {tracks.map((t) => (
                <li key={t.id} className="py-3 flex items-center justify-between">
                  <button
                    className="text-left hover:text-[var(--neon-cyan)]"
                    onClick={() => setCurrent(t)}
                    aria-current={current?.id === t.id ? "true" : "false"}
                  >
                    {t.title}
                  </button>
                  <span className="text-sm text-[var(--foreground)]/70">{t.duration}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  );
}