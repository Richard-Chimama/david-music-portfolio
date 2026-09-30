"use client";
import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Heading, Body } from "@/components/ui/Typography";
import { YouTubePlaylistPlayer } from "@/components/ui/YouTubePlaylistPlayer";
import { PreviewPlayer } from "@/components/ui/PreviewPlayer";
import { PurchaseButton } from "@/components/ui/PurchaseButton";

type Track = { 
  id: number; 
  title: string; 
  src: string;
  format: string;
  sizeInMB: number;
};

// Local sample tracks
const fallbackTracksBase = [
  { id: 1, title: "Sample 1", src: "/audio/sample1.mp3", format: "MP3", sizeInMB: 8.5 },
  { id: 2, title: "Sample 2", src: "/audio/sample2.mp3", format: "MP3", sizeInMB: 9.2 },
  { id: 3, title: "Sample 3", src: "/audio/sample3.mp3", format: "MP3", sizeInMB: 6.8 },
];

// Removed local helpers; now using '@/utils/duration'

export function FeaturedPlaylist() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [current, setCurrent] = useState<Track | null>(null);
  // Optional YouTube configuration from environment
  const uploadsPlaylistId = process.env.NEXT_PUBLIC_YT_UPLOADS_PLAYLIST_ID;
  const videoIdsCsv = process.env.NEXT_PUBLIC_YT_VIDEO_IDS;
  const videoIds = videoIdsCsv
    ? videoIdsCsv.split(",").map((id) => id.trim()).filter(Boolean)
    : undefined;

  useEffect(() => {
    const initializeFallbackTracks = async () => {
      console.log("🎵 Initializing fallback tracks (no duration displayed)...");
      setTracks(fallbackTracksBase);
      setCurrent(fallbackTracksBase[0] || null);
    };

    initializeFallbackTracks();
  }, []);

  // Mobile-aware expand/collapse for track list
  const [isMobile, setIsMobile] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    // Detect mobile viewport and respond to changes
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 768px)');
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    setIsMobile(mq.matches);
    // Support older browsers
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', onChange);
      else mq.removeListener(onChange);
    };
  }, []);

  // Ensure desktop shows all tracks by default
  useEffect(() => {
    if (!isMobile) {
      setExpanded(true);
    } else {
      setExpanded(false);
    }
  }, [isMobile]);

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
                className="mt-6"
              />
            )}

            {/* Purchase Section */}
            {current && (
              <PurchaseButton
                trackId={current.id}
                title={current.title}
                src={current.src}
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
              {/* Mobile-responsive list: show 3 items by default, expandable */}
              <div
                className="transition-all duration-300 ease-in-out"
                style={{ willChange: 'height, opacity', transform: 'translateZ(0)' }}
              >
                <ul
                  id="playlist-tracklist"
                  className="divide-y divide-[var(--border)]"
                  aria-live="polite"
                >
                  {(isMobile && !expanded ? tracks.slice(0, 3) : tracks).map((t) => (
                    <li key={t.id} className="py-3 flex items-center justify-between motion-safe:transition-opacity motion-safe:duration-300">
                      <button
                        className={`text-left hover:text-[var(--neon-cyan)] transition-colors ${
                          current?.id === t.id ? 'text-[var(--neon-cyan)]' : ''
                        }`}
                        onClick={() => setCurrent(t)}
                        aria-current={current?.id === t.id ? 'true' : 'false'}
                      >
                        <div>
                          <div className="font-medium">{t.title}</div>
                          <div className="text-xs text-[var(--foreground)]/60">
                            {t.format} • {t.sizeInMB}MB
                          </div>
                        </div>
                      </button>
                      {/* Creative UI: pulsing dot to indicate selectable track */}
                      <span className="inline-flex items-center">
                        <span
                          className={`inline-block w-2.5 h-2.5 rounded-full ${
                            current?.id === t.id ? 'bg-[var(--neon-cyan)] animate-pulse' : 'bg-[var(--border)]'
                          }`}
                          aria-label={current?.id === t.id ? 'Current track' : 'Track'}
                        />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Expand/Collapse control - visible only on mobile when more than 3 tracks */}
              {isMobile && tracks.length > 3 && (
                <div className="mt-3">
                  <button
                    type="button"
                    className="w-full text-sm px-3 py-2 rounded-md bg-[var(--border)]/30 hover:bg-[var(--border)]/50 transition-colors"
                    aria-expanded={expanded}
                    aria-controls="playlist-tracklist"
                    onClick={() => setExpanded((v) => !v)}
                  >
                    {expanded ? 'Show fewer tracks' : 'Show all tracks'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="h-50"></div>
        {/* YouTube playlist section */}
        <div className="mt-8">
          <div className="w-full sm:w-[92%] md:w-[88%] lg:w-[80%] xl:w-[70%] max-w-[1200px] mx-auto">
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