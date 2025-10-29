import React from 'react';

interface TikTokIconProps {
  href: string;
  size?: number;
  className?: string;
}

const TikTokIcon: React.FC<TikTokIconProps> = ({ 
  href, 
  size = 20, 
  className = "" 
}) => {
  return (
    <a 
      href={href} 
      aria-label="TikTok" 
      className={`group rounded-full p-2 border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)]/80 hover:text-[var(--neon-cyan)] hover:border-[var(--neon-cyan)] transition-colors ${className}`}
      target="_blank"
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
        <circle cx="9" cy="16" r="2"></circle>
        <path d="M11 16V8l6 2"></path>
      </svg>
    </a>
  );
};

export default TikTokIcon;