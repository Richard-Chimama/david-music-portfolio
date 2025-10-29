"use client";
import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Heading, Body } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { YouTubePlaylistPlayer } from "@/components/ui/YouTubePlaylistPlayer";
import { PreviewPlayer } from "@/components/ui/PreviewPlayer";
import { PurchaseButton } from "@/components/ui/PurchaseButton";

type Track = { 
  id: number; 
  title: string; 
  duration: string; 
  src: string;
  format: string;
  sizeInMB: number;
};

const tracks: Track[] = [
  { 
    id: 1, 
    title: "Test 1", 
    duration: "3:42", 
    src: "/audio/sample1.mp3",
    format: "MP3",
    sizeInMB: 8.5
  },
  { 
    id: 2, 
    title: "Test 2", 
    duration: "4:05", 
    src: "/audio/sample2.mp3",
    format: "MP3",
    sizeInMB: 9.2
  },
  { 
    id: 3, 
    title: "Test 3", 
    duration: "2:58", 
    src: "/audio/sample3.mp3",
    format: "MP3",
    sizeInMB: 6.8
  },
];

export function FeaturedPlaylist() {
  const [current, setCurrent] = useState<Track | null>(tracks[0]);
  // Optional YouTube configuration from environment
  const uploadsPlaylistId = process.env.NEXT_PUBLIC_YT_UPLOADS_PLAYLIST_ID;
  const videoIdsCsv = process.env.NEXT_PUBLIC_YT_VIDEO_IDS;
  const videoIds = videoIdsCsv
    ? videoIdsCsv.split(",").map((id) => id.trim()).filter(Boolean)
    : undefined;

  return (
    <Section id="playlist">
      <Container>
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex-1">
            <Heading>Featured Playlist</Heading>
            <Body className="mt-2">Dive into curated tracks that define the Iam Sweden vibe.</Body>
            
            {/* Preview Player */}
            {current && (
              <PreviewPlayer
                src={current.src}
                title={current.title}
                duration={current.duration}
                className="mt-6"
              />
            )}

            {/* Purchase Section */}
            {current && (
              <PurchaseButton
                trackId={current.id}
                title={current.title}
                format={current.format}
                sizeInMB={current.sizeInMB}
                price="€2"
                className="mt-6"
              />
            )}
          </div>
          
          {/* Track List */}
          <div className="w-full lg:w-80">
            <div className="glass rounded-2xl p-4">
              <h3 className="font-medium mb-4 text-[var(--neon-cyan)]">Track List</h3>
              <ul className="divide-y divide-[var(--border)]">
                {tracks.map((t) => (
                  <li key={t.id} className="py-3 flex items-center justify-between">
                    <button
                      className={`text-left hover:text-[var(--neon-cyan)] transition-colors ${
                        current?.id === t.id ? 'text-[var(--neon-cyan)]' : ''
                      }`}
                      onClick={() => setCurrent(t)}
                      aria-current={current?.id === t.id ? "true" : "false"}
                    >
                      <div>
                        <div className="font-medium">{t.title}</div>
                        <div className="text-xs text-[var(--foreground)]/60">
                          {t.format} • {t.sizeInMB}MB
                        </div>
                      </div>
                    </button>
                    <span className="text-sm text-[var(--foreground)]/70">{t.duration}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="h-50"></div>
        {/* YouTube playlist section */}
        <div className="mt-8 grid md:grid-cols-2 gap-8 items-start">
          <div className="flex-1">
            <Heading as="h2">Featured Videos</Heading>
            <Body className="mt-2">Watch the latest releases and visuals from Swiden.</Body>
            <YouTubePlaylistPlayer
              className="mt-6"
              ariaLabel="Swiden YouTube playlist player"
              // Prefer explicit playlist or video IDs via env; fallback to channel handle search.
              playlistId={uploadsPlaylistId}
              videoIds={videoIds}
              embedUrls={[
                "https://www.youtube.com/embed/pS_pmJQZD5o?si=OwXp79aNkQnW1vMI",
                "https://www.youtube.com/embed/Ckir2dnZJG0?si=4K4OrCnXKD3MT3Dv",
                "https://www.youtube.com/embed/9v4_jksBNSQ?si=ShXAuFIT5XS0poRx",
              ]}
              searchQuery="@swiden369"
            />
          </div>
        </div>
      </Container>
    </Section>
  );
}