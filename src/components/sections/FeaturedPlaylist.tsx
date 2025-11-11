"use client";
import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Heading, Body } from "@/components/ui/Typography";
import { YouTubePlaylistPlayer } from "@/components/ui/YouTubePlaylistPlayer";
import { PreviewPlayer } from "@/components/ui/PreviewPlayer";
import { PurchaseButton } from "@/components/ui/PurchaseButton";
import { storage } from "@/lib/firebase";
// import { collection, getDocs } from "firebase/firestore";
import { getDownloadURL, ref as storageRef, listAll, getMetadata } from "firebase/storage";
import type { StorageReference, FullMetadata } from "firebase/storage";
// Removed duration utilities as we no longer display duration

type Track = { 
  id: number; 
  title: string; 
  src: string;
  format: string;
  sizeInMB: number;
};

// Local fallback samples (used when Firebase isn't configured)
// We'll calculate durations dynamically instead of hardcoding them
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

  // Initialize with fallback tracks (we no longer show duration)
  useEffect(() => {
    const initializeFallbackTracks = async () => {
      console.log("🎵 Initializing fallback tracks (no duration displayed)...");
      setTracks(fallbackTracksBase);
      setCurrent(fallbackTracksBase[0] || null);
    };

    initializeFallbackTracks();
  }, []);

  // Recursively list all files in a Storage folder (including nested subfolders)
  const listAllDeep = async (folderRef: StorageReference): Promise<StorageReference[]> => {
    const collected: StorageReference[] = [];
    const traverse = async (ref: StorageReference): Promise<void> => {
      const res = await listAll(ref);
      collected.push(...res.items);
      for (const prefix of res.prefixes) {
        await traverse(prefix);
      }
    };
    await traverse(folderRef);
    return collected;
  };

  // Load tracks from Firebase Storage (and resolve download URLs)
  useEffect(() => {
    const load = async () => {
      if (!storage) {
        // Firebase Storage not configured – keep fallback (already initialized)
        console.warn("Firebase Storage not configured. Using fallback tracks.");
        return;
      }
      try {
        const folderPath = process.env.NEXT_PUBLIC_STORAGE_TRACKS_PATH || "tracks";
        console.log(`🎵 Listing Firebase Storage folder: ${folderPath}`);
        const folder = storageRef(storage, folderPath);
        const items = await listAllDeep(folder);
        if (items.length === 0) {
          console.warn(`No audio files found in Storage at path: ${folderPath}. Using fallback tracks.`);
          return;
        }
        const fetched = await Promise.all(
          items.map(async (itemRef, idx) => {
            const url = await getDownloadURL(itemRef);
            const meta: FullMetadata | null = await getMetadata(itemRef).catch(() => null);
            const bytes = meta?.size ?? 0;
            const sizeInMB = bytes ? Number((bytes / 1_000_000).toFixed(1)) : 0;
            const name = itemRef.name;
            const format = (name.split(".").pop() || "mp3").toUpperCase();
            const title = name.replace(/\.[^/.]+$/, "");

            // Duration probing removed to avoid misleading displays

            // Validate the final src URL
            try {
              new URL(url); // Validate URL format
              console.log(`✓ Valid audio URL for "${title}": ${url.substring(0, 80)}...`);
            } catch {
              console.warn(`❌ Invalid URL format for "${title}": ${url}`);
            }

            return { id: idx + 1, title, src: url, format, sizeInMB } as Track;
          })
        );

        console.log("📊 Fetched tracks summary:", {
          total: fetched.length,
          withValidSrc: fetched.filter(t => t.src).length,
          withoutSrc: fetched.filter(t => !t.src).length
        });

        if (fetched.length > 0) {
          setTracks(fetched);
          setCurrent(fetched[0]);
        }
      } catch (e: unknown) {
        const error = e as { code?: string; message?: string };
        console.error("Failed to load tracks from Firebase Storage:", {
          errorCode: error?.code,
          errorMessage: error?.message,
          fullError: e
        });
      }
    };
    load();
  }, []);

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
                    {/* Creative UI: pulsing dot to indicate selectable track */}
                    <span className="inline-flex items-center">
                      <span
                        className={`inline-block w-2.5 h-2.5 rounded-full ${
                          current?.id === t.id ? 'bg-[var(--neon-cyan)] animate-pulse' : 'bg-[var(--border)]'
                        }`}
                        aria-label={current?.id === t.id ? "Current track" : "Track"}
                      />
                    </span>
                  </li>
                ))}
              </ul>
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