import React from 'react';

interface YouTubeIconProps {
  href: string;
  size?: number;
  className?: string;
}

const YouTubeIcon: React.FC<YouTubeIconProps> = ({ 
  href, 
  size = 20, 
  className = "" 
}) => {
  return (
    <a 
      href={href} 
      aria-label="YouTube" 
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
        <rect x="3" y="5" width="18" height="14" rx="3"></rect>
        <polygon points="10,9 16,12 10,15" fill="currentColor"></polygon>
      </svg>
    </a>
  );
};

export default YouTubeIcon;