import React from 'react';

interface SpotifyIconProps {
  href: string;
  size?: number;
  className?: string;
}

const SpotifyIcon: React.FC<SpotifyIconProps> = ({ 
  href, 
  size = 20, 
  className = "" 
}) => {
  return (
    <a 
      href={href} 
      aria-label="Spotify" 
      className={`group rounded-full p-2 border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)]/80 hover:text-[var(--neon-cyan)] hover:border-[var(--neon-cyan)] transition-colors ${className}`}
    >
      <svg 
        aria-hidden="true" 
        className={`w-${size/4} h-${size/4}`}
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M5 9c4-1 10 0 14 2"></path>
        <path d="M5 13c4-1 9 0 13 2"></path>
        <path d="M5 17c4-1 8 0 12 2"></path>
      </svg>
    </a>
  );
};

export default SpotifyIcon;