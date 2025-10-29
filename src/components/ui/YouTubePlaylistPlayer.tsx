/* eslint-disable @next/next/no-img-element */
"use client";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  PlayIcon,
  PauseIcon,
  NextIcon,
  PrevIcon,
  VolumeIcon,
  MuteIcon,
} from "@/components/icons/MediaControls";
import Image from "next/image";

type YouTubePlaylistPlayerProps = {
  className?: string;
  ariaLabel?: string;
  decorative?: boolean;
  playlistId?: string; // YouTube playlist ID (e.g., uploads or curated)
  videoIds?: string[]; // Explicit list of video IDs
  embedUrls?: string[]; // Optional list of embed URLs to extract video IDs from
  searchQuery?: string; // Fallback: search-based playlist (e.g., "swiden369")
  autoplay?: boolean; // Autoplay when ready
};

// Minimal typings for the YouTube IFrame API used here
type YTPlayerOptions = {
  width?: string | number;
  height?: string | number;
  playerVars?: {
    controls?: 0 | 1;
    modestbranding?: 0 | 1;
    rel?: 0 | 1;
    iv_load_policy?: 1 | 3;
    color?: "red" | "white";
    origin?: string;
    playsinline?: 0 | 1;
  };
  events?: {
    onReady?: (event: { target: YTPlayer }) => void;
    onStateChange?: (event: { data: number; target: YTPlayer }) => void;
  };
};

type YTVideoData = {
  title?: string;
};

// Suggested quality options supported by the YouTube IFrame API
type YTSuggestedQuality =
  | "small"
  | "medium"
  | "large"
  | "hd720"
  | "hd1080"
  | "highres"
  | "default";

interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  nextVideo(): void;
  previousVideo(): void;
  destroy(): void;
  getPlayerState(): number;
  getDuration(): number;
  getCurrentTime(): number;
  getVideoData(): YTVideoData;
  cuePlaylist(
    playlist:
      | string
      | string[]
      | {
          listType: "playlist" | "search";
          list: string;
          index?: number;
          startSeconds?: number;
          suggestedQuality?: YTSuggestedQuality;
        }
  ): void;
  loadPlaylist(
    playlist:
      | string
      | string[]
      | {
          listType: "playlist" | "search";
          list: string;
          index?: number;
          startSeconds?: number;
          suggestedQuality?: YTSuggestedQuality;
        }
  ): void;
  // Additional controls and playlist navigation
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  mute(): void;
  unMute(): void;
  isMuted(): boolean;
  setVolume(volume: number): void;
  getVolume(): number;
  getPlaylist(): string[];
  getPlaylistIndex(): number;
  playVideoAt(index: number): void;
  cueVideoById(videoId: string): void;
  loadVideoById(videoId: string): void;
}

interface YTIframeAPI {
  Player: new (elementId: string, options: YTPlayerOptions) => YTPlayer;
}

declare global {
  interface Window {
    YT?: YTIframeAPI;
    onYouTubeIframeAPIReady?: () => void;
  }
}

const YTPlayerState = {
  UNSTARTED: -1,
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
  CUED: 5,
} as const;

export function YouTubePlaylistPlayer({
  className = "",
  ariaLabel,
  decorative = false,
  playlistId,
  videoIds,
  embedUrls,
  searchQuery = "swiden369",
  autoplay = false,
}: YouTubePlaylistPlayerProps) {
  const playerRef = useRef<YTPlayer | null>(null);
  const containerId = useId();
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTitle, setCurrentTitle] = useState<string>("");
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(100);
  const [playlistIds, setPlaylistIds] = useState<string[]>([]);
  const [playlistIndex, setPlaylistIndex] = useState<number>(0);
  const timeIntervalRef = useRef<number | null>(null);

  const loadScript = useCallback(() => {
    if (window.YT && window.YT.Player) return Promise.resolve();
    return new Promise<void>((resolve) => {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = () => {
        resolve();
      };
    });
  }, []);

  const updateMeta = useCallback(() => {
    if (!playerRef.current) return;
    const data = playerRef.current.getVideoData?.() || {};
    setCurrentTitle(data?.title || "");
    setDuration(Math.floor(playerRef.current.getDuration?.() || 0));
    // Sync mute and volume
    try {
      setIsMuted(Boolean(playerRef.current.isMuted?.()));
      const vol = playerRef.current.getVolume?.();
      if (typeof vol === "number") setVolume(vol);
    } catch {}
    // Sync playlist and index
    try {
      const ids = playerRef.current.getPlaylist?.();
      if (Array.isArray(ids)) setPlaylistIds(ids);
      const idx = playerRef.current.getPlaylistIndex?.();
      if (typeof idx === "number") setPlaylistIndex(idx);
    } catch {}
  }, []);

  const startTimePolling = useCallback(() => {
    if (timeIntervalRef.current) return;
    timeIntervalRef.current = window.setInterval(() => {
      if (!playerRef.current) return;
      setCurrentTime(Math.floor(playerRef.current.getCurrentTime?.() || 0));
    }, 500);
  }, []);

  const stopTimePolling = useCallback(() => {
    if (timeIntervalRef.current) {
      window.clearInterval(timeIntervalRef.current);
      timeIntervalRef.current = null;
    }
  }, []);

  const initPlayer = useCallback(async () => {
    await loadScript();
    // Derive effective playlist source ahead of player creation
    const idsFromEmbed = Array.isArray(embedUrls)
      ? embedUrls
          .map((url) => {
            try {
              const u = new URL(url);
              const parts = u.pathname.split("/").filter(Boolean);
              const embedIndex = parts.findIndex((p) => p === "embed");
              if (embedIndex !== -1 && parts.length > embedIndex + 1) {
                return parts[embedIndex + 1];
              }
              return u.searchParams.get("v") || "";
            } catch {
              return "";
            }
          })
          .filter((id) => !!id)
      : undefined;
    const effectiveIds =
      videoIds && videoIds.length > 0 ? videoIds : idsFromEmbed;
    const options: YTPlayerOptions = {
      width: "100%",
      height: "100%",
      playerVars: {
        controls: 0,
        modestbranding: 1,
        rel: 0,
        iv_load_policy: 3,
        color: "white",
        origin:
          typeof window !== "undefined" ? window.location.origin : undefined,
        playsinline: 1,
      },
      events: {
        onReady: (event?: { target: YTPlayer }) => {
          if (event?.target) {
            playerRef.current = event.target;
          }
          setIsReady(true);
          // Configure playlist when the player is ready
          try {
            const player = playerRef.current;
            if (player) {
              if (effectiveIds && effectiveIds.length > 0) {
                if (typeof player.cuePlaylist === "function") {
                  player.cuePlaylist(effectiveIds);
                } else if (typeof player.loadPlaylist === "function") {
                  player.loadPlaylist(effectiveIds);
                } else if (
                  effectiveIds.length > 0 &&
                  typeof player.cueVideoById === "function"
                ) {
                  player.cueVideoById(effectiveIds[0]);
                }
              } else if (playlistId) {
                if (typeof player.cuePlaylist === "function") {
                  player.cuePlaylist({
                    listType: "playlist",
                    list: playlistId,
                  });
                } else if (typeof player.loadPlaylist === "function") {
                  player.loadPlaylist({
                    listType: "playlist",
                    list: playlistId,
                  });
                }
              } else {
                if (typeof player.cuePlaylist === "function") {
                  player.cuePlaylist({ listType: "search", list: searchQuery });
                } else if (typeof player.loadPlaylist === "function") {
                  player.loadPlaylist({
                    listType: "search",
                    list: searchQuery,
                  });
                }
              }
            }
          } catch {}

          updateMeta();
          if (autoplay && playerRef.current) {
            playerRef.current.playVideo?.();
          }
          startTimePolling();
        },
        onStateChange: (e: { data: number; target: YTPlayer }) => {
          const state = e.data;
          setIsPlaying(state === YTPlayerState.PLAYING);
          if (
            state === YTPlayerState.PLAYING ||
            state === YTPlayerState.PAUSED
          ) {
            updateMeta();
          }
          if (state === YTPlayerState.ENDED) {
            // Autoadvance handled by playlist; keep metadata in sync
            updateMeta();
          }
          // Update playlist index on state change
          try {
            const idx = playerRef.current?.getPlaylistIndex?.();
            if (typeof idx === "number") setPlaylistIndex(idx);
          } catch {}
        },
      },
    };

    const yt = window.YT;
    if (!yt || !yt.Player) {
      return;
    }
    playerRef.current = new yt.Player(containerId, options);
  }, [
    autoplay,
    containerId,
    loadScript,
    playlistId,
    searchQuery,
    updateMeta,
    startTimePolling,
    videoIds,
    embedUrls,
  ]);

  useEffect(() => {
    let mounted = true;
    initPlayer();
    const onVisibility = () => {
      if (document.hidden) {
        stopTimePolling();
      } else if (mounted) {
        startTimePolling();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      mounted = false;
      document.removeEventListener("visibilitychange", onVisibility);
      stopTimePolling();
      try {
        playerRef.current?.destroy?.();
      } catch {}
    };
  }, [initPlayer, startTimePolling, stopTimePolling]);

  const playPause = () => {
    if (!playerRef.current) return;
    const state = playerRef.current.getPlayerState?.();
    if (state === YTPlayerState.PLAYING) {
      playerRef.current.pauseVideo?.();
    } else {
      playerRef.current.playVideo?.();
    }
  };

  const next = () => playerRef.current?.nextVideo?.();
  const prev = () => playerRef.current?.previousVideo?.();

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const onSeek = (value: number) => {
    if (!playerRef.current) return;
    const clamped = Math.max(0, Math.min(duration, value));
    playerRef.current.seekTo(clamped, true);
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    if (playerRef.current.isMuted()) {
      playerRef.current.unMute();
      setIsMuted(false);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  };

  const changeVolume = (value: number) => {
    if (!playerRef.current) return;
    const clamped = Math.max(0, Math.min(100, value));
    playerRef.current.setVolume(clamped);
    setVolume(clamped);
  };

  const playAt = (index: number) => {
    if (!playerRef.current) return;
    playerRef.current.playVideoAt(index);
  };

  return (
    <div
      className={`${className} relative w-full max-w-full overflow-x-hidden`}
      role={decorative ? undefined : "group"}
      aria-label={
        decorative ? undefined : ariaLabel || "YouTube playlist player"
      }
      aria-hidden={decorative || undefined}
    >
      <div className="glass rounded-2xl p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold">Swiden — YouTube</p>
            <p className="text-sm text-[var(--foreground)]/70">
              {currentTitle || (isReady ? "Loading…" : "Initializing…")}
            </p>
          </div>
          <a
            href="https://www.youtube.com/@swiden369"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm hover:text-[var(--neon-cyan)] underline-offset-2 hover:underline"
            aria-label="Visit Swiden YouTube channel"
          >
            @swiden369
          </a>
        </div>
        {/* Player */}
        <div className="mt-4 w-full">
          <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-[var(--border)]">
            {/* Ensure the iframe created by YT API never overflows its container on mobile */}
            <div id={containerId} className="absolute inset-0 youtube-iframe-container" />
          </div>
        </div>
        {/* Controls */}
        <div className="mt-4 flex items-center gap-3 sm:gap-4 flex-wrap sm:flex-nowrap">
          <Button
            aria-label={isPlaying ? "Pause video" : "Play video"}
            onClick={playPause}
            className="gap-2 transition-all duration-300"
          >
            {/* Mobile: icon only */}
            <span className="md:hidden inline-flex items-center">
              {isPlaying ? (
                <PauseIcon className="w-5 h-5" />
              ) : (
                <PlayIcon className="w-5 h-5" />
              )}
            </span>
            {/* Desktop: text label */}
            <span className="hidden md:inline">
              {isPlaying ? "Pause" : "Play"}
            </span>
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              aria-label="Previous video"
              onClick={prev}
              className="gap-2 transition-all duration-300"
            >
              {/* Mobile: icon only */}
              <span className="md:hidden inline-flex items-center">
                <PrevIcon className="w-5 h-5" />
              </span>
              {/* Desktop: text label */}
              <span className="hidden md:inline">Prev</span>
            </Button>
            <Button
              variant="secondary"
              aria-label="Next video"
              onClick={next}
              className="gap-2 transition-all duration-300"
            >
              {/* Mobile: icon only */}
              <span className="md:hidden inline-flex items-center">
                <NextIcon className="w-5 h-5" />
              </span>
              {/* Desktop: text label */}
              <span className="hidden md:inline">Next</span>
            </Button>
          </div>
          <div className="flex items-center gap-3 ml-2">
            <button
              className="flex items-center gap-2 text-sm hover:text-[var(--neon-cyan)] transition-all duration-300"
              onClick={toggleMute}
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {/* Mobile: icon only */}
              <span className="md:hidden inline-flex items-center">
                {isMuted ? (
                  <VolumeIcon className="w-5 h-5" />
                ) : (
                  <MuteIcon className="w-5 h-5" />
                )}
              </span>
              {/* Desktop: text label */}
              <span className="hidden md:inline">
                {isMuted ? "Unmute" : "Mute"}
              </span>
            </button>
            <input
              type="range"
              min={0}
              max={100}
              value={volume}
              onChange={(e) => changeVolume(Number(e.target.value))}
              aria-label="Volume"
              className="w-24 sm:w-28 accent-[var(--neon-cyan)] transition-all duration-300"
            />
          </div>
        </div>
        {/* Progress */}
        <div className="mt-3">
          <input
            type="range"
            min={0}
            max={Math.max(duration, 0)}
            value={Math.min(currentTime, duration)}
            onChange={(e) => onSeek(Number(e.target.value))}
            aria-label="Seek"
            className="w-full accent-[var(--neon-purple)]"
          />
          <div className="mt-1 flex justify-between text-xs text-[var(--foreground)]/70">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
        {/* Thumbnail navigator */}
        {playlistIds.length > 0 && (
          <div className="mt-6">
            <div className="flex overflow-x-auto gap-3 no-scrollbar">
              {playlistIds.map((vid, i) => (
                <button
                  key={vid + i}
                  onClick={() => playAt(i)}
                  aria-label={`Play video ${i + 1}`}
                  className={`relative shrink-0 w-28 sm:w-32 aspect-[16/9] rounded-lg overflow-hidden border transition-colors ${
                    i === playlistIndex
                      ? "gradient-neon shadow-glow border-transparent"
                      : "border-[var(--border)] hover:border-[var(--neon-cyan)]"
                  }`}
                >
                  <img
                    src={`https://img.youtube.com/vi/${vid}/hqdefault.jpg`}
                    alt="Video thumbnail"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
        {/* Attribution */}
        <div className="mt-4 flex items-center gap-2 text-sm text-[var(--foreground)]/70">
          <a
            href="https://www.youtube.com/@swiden369"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--neon-cyan)] underline-offset-2 hover:underline"
            aria-label="Visit Swiden YouTube channel"
          >
            Watch on YouTube
          </a>
          <span aria-hidden>•</span>
          <span>@swiden369</span>
        </div>
      </div>
    </div>
  );
}
