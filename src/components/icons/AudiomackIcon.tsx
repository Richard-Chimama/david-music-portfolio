import React from 'react';

interface AudiomackIconProps {
  href: string;
  size?: number;
  className?: string;
}

const AudiomackIcon: React.FC<AudiomackIconProps> = ({ 
  href, 
  size = 20, 
  className = "" 
}) => {
  return (
    <a 
      href={href} 
      aria-label="Audiomack" 
      className={`group rounded-full p-2 border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)]/80 hover:text-[var(--neon-cyan)] hover:border-[var(--neon-cyan)] transition-colors ${className}`}
    >
      <svg 
        aria-hidden="true" 
        className={`w-${size/4} h-${size/4}`}
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="currentColor"
      >
        <rect x="6" y="8" width="2" height="8" rx="1"></rect>
        <rect x="11" y="6" width="2" height="10" rx="1"></rect>
        <rect x="16" y="10" width="2" height="6" rx="1"></rect>
      </svg>
    </a>
  );
};

export default AudiomackIcon;