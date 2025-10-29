import React from 'react';

interface InstagramIconProps {
  href: string;
  size?: number;
  className?: string;
}

const InstagramIcon: React.FC<InstagramIconProps> = ({ 
  href, 
  size = 20, 
  className = "" 
}) => {
  return (
    <a 
      href={href} 
      aria-label="Instagram" 
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
        <rect x="3" y="3" width="18" height="18" rx="5"></rect>
        <circle cx="12" cy="12" r="4"></circle>
        <circle cx="17" cy="7" r="1" fill="currentColor"></circle>
      </svg>
    </a>
  );
};

export default InstagramIcon;