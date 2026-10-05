"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "./Button";

interface PreviewPlayerProps {
  src: string;
  title: string;
  className?: string;
  onPlay?: () => void;
  onPause?: () => void;
}

function clampVolume(value: number): number {
  return Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0;
}

export function PreviewPlayer({ 
  src, 
  title, 
  onPlay, 
  onPause 
}: PreviewPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const audioRef = useRef<HTMLAudioElement>(null);
  const volumeRef = useRef(0.7);
  const isPlayingRef = useRef(false);
  const fadeFrameRef = useRef<number | null>(null);

  const PREVIEW_DURATION = 60; // 60 seconds

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      const current = audio.currentTime;
      setCurrentTime(current);
      
      const remaining = Math.max(0, PREVIEW_DURATION - current);
      setTimeRemaining(Math.ceil(remaining));
      
      // Stop at 60 seconds
      if (current >= PREVIEW_DURATION) {
        audio.pause();
        isPlayingRef.current = false;
        setIsPlaying(false);
        onPause?.();
      }
    };

    const handleEnded = () => {
      isPlayingRef.current = false;
      setIsPlaying(false);
      setCurrentTime(0);
      setTimeRemaining(60);
      onPause?.();
    };

    const handleLoadedMetadata = () => {
      audio.volume = isPlayingRef.current ? 0 : clampVolume(volume);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [volume, onPause]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let cancelled = false;
    const resumePlayback = isPlayingRef.current;

    if (fadeFrameRef.current !== null) {
      cancelAnimationFrame(fadeFrameRef.current);
      fadeFrameRef.current = null;
    }

    setCurrentTime(0);
    setTimeRemaining(PREVIEW_DURATION);
    audio.pause();
    audio.currentTime = 0;
    audio.volume = resumePlayback ? 0 : clampVolume(volumeRef.current);
    audio.load();

    if (!resumePlayback) return;

    const startPlayback = () => {
      if (cancelled) return;

      audio.play().then(() => {
        const fadeStartedAt = performance.now();
        const fadeIn = (now: number) => {
          if (cancelled) return;

          const progress = Math.min(1, Math.max(0, (now - fadeStartedAt) / 300));
          audio.volume = clampVolume(volumeRef.current * progress);

          if (progress < 1) {
            fadeFrameRef.current = requestAnimationFrame(fadeIn);
          } else {
            fadeFrameRef.current = null;
          }
        };

        fadeFrameRef.current = requestAnimationFrame(fadeIn);
      }).catch(() => {
        if (cancelled) return;
        isPlayingRef.current = false;
        setIsPlaying(false);
      });
    };

    if (audio.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      startPlayback();
    } else {
      audio.addEventListener("canplay", startPlayback, { once: true });
    }

    return () => {
      cancelled = true;
      audio.removeEventListener("canplay", startPlayback);
      if (fadeFrameRef.current !== null) {
        cancelAnimationFrame(fadeFrameRef.current);
        fadeFrameRef.current = null;
      }
    };
  }, [src]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      isPlayingRef.current = false;
      setIsPlaying(false);
      onPause?.();
    } else {
      // Reset to beginning if at end
      if (currentTime >= PREVIEW_DURATION) {
        audio.currentTime = 0;
        setCurrentTime(0);
        setTimeRemaining(60);
      }
      audio.play().then(() => {
        isPlayingRef.current = true;
        setIsPlaying(true);
        onPlay?.();
      }).catch(() => {
        isPlayingRef.current = false;
        setIsPlaying(false);
      });
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = clampVolume(Number.parseFloat(e.target.value));
    volumeRef.current = newVolume;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Creative replacement for duration: mood tags derived from title
  const getMoodTags = (t: string): string[] => {
    const tags = [
      "Chill",
      "Groove",
      "Ambient",
      "Uplifting",
      "Dark",
      "Dreamy",
      "Energetic",
      "Lofi",
      "Vintage",
      "Modern",
    ];
    const seed = Array.from(t).reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const pick = (offset: number) => tags[(seed + offset) % tags.length];
    // Ensure unique selection
    const first = pick(0);
    let second = pick(3);
    let third = pick(7);
    if (second === first) second = pick(4);
    if (third === first || third === second) third = pick(8);
    return [first, second, third];
  };
  const moodTags = getMoodTags(title);

  return (
    <div className={`glass rounded-2xl p-6`}>
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        aria-label={`Preview of ${title}`}
      />
      
      {/* Preview Badge */}
      <div className="flex items-center justify-between mb-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[var(--neon-cyan)]/20 text-[var(--neon-cyan)] border border-[var(--neon-cyan)]/30">
          Preview
        </span>
        <div className="text-sm text-[var(--foreground)]/70">
          {formatTime(timeRemaining)} remaining
        </div>
      </div>

      {/* Track Info */}
      <div className="mb-4">
        <h3 className="font-medium text-lg">{title}</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {moodTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--neon-purple)]/20 text-[var(--neon-purple)] border border-[var(--neon-purple)]/30"
              aria-label={`Mood tag: ${tag}`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 mb-4">
        <Button 
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause preview" : "Play preview"}
          className="flex items-center gap-2"
        >
          {isPlaying ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
          {isPlaying ? "Pause" : "Play"}
        </Button>

        {/* Volume Control */}
        <div className="flex items-center gap-2 flex-1 max-w-32">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-[var(--foreground)]/70">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
          </svg>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            className="flex-1 h-2 bg-[var(--border)] rounded-lg appearance-none cursor-pointer slider"
            aria-label="Volume control"
          />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[var(--border)] rounded-full h-2 mb-2">
        <div 
          className="bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-purple)] h-2 rounded-full transition-all duration-100"
          style={{ width: `${(currentTime / PREVIEW_DURATION) * 100}%` }}
        />
      </div>
      
      <div className="flex justify-between text-xs text-[var(--foreground)]/70">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(PREVIEW_DURATION)}</span>
      </div>
    </div>
  );
}