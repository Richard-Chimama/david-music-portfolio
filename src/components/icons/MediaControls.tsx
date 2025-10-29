import React from "react";

type IconProps = {
  className?: string;
  title?: string;
};

export function PlayIcon({ className = "w-5 h-5", title }: IconProps) {
  return (
    <svg
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {title ? <title>{title}</title> : null}
      <polygon points="8,5 19,12 8,19" fill="currentColor" />
    </svg>
  );
}

export function PauseIcon({ className = "w-5 h-5", title }: IconProps) {
  return (
    <svg
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {title ? <title>{title}</title> : null}
      <rect x="7" y="5" width="3" height="14" fill="currentColor" />
      <rect x="14" y="5" width="3" height="14" fill="currentColor" />
    </svg>
  );
}

export function NextIcon({ className = "w-5 h-5", title }: IconProps) {
  return (
    <svg
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {title ? <title>{title}</title> : null}
      <polygon points="5,6 16,12 5,18" fill="currentColor" />
      <rect x="17" y="5" width="2" height="14" fill="currentColor" />
    </svg>
  );
}

export function PrevIcon({ className = "w-5 h-5", title }: IconProps) {
  return (
    <svg
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {title ? <title>{title}</title> : null}
      <polygon points="19,6 8,12 19,18" fill="currentColor" />
      <rect x="5" y="5" width="2" height="14" fill="currentColor" />
    </svg>
  );
}

export function VolumeIcon({ className = "w-5 h-5", title }: IconProps) {
  return (
    <svg
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {title ? <title>{title}</title> : null}
      <polygon points="4,9 9,9 13,5 13,19 9,15 4,15" fill="currentColor" />
      <path d="M16 9a3 3 0 0 1 0 6" />
      <path d="M18 7a6 6 0 0 1 0 10" />
    </svg>
  );
}

export function MuteIcon({ className = "w-5 h-5", title }: IconProps) {
  return (
    <svg
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {title ? <title>{title}</title> : null}
      <polygon points="4,9 9,9 13,5 13,19 9,15 4,15" fill="currentColor" />
      <line x1="16" y1="9" x2="22" y2="15" />
      <line x1="22" y1="9" x2="16" y2="15" />
    </svg>
  );
}