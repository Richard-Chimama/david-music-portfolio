import React from "react";

function UnsupportedSocialIcon({ name, href }: { name: string; href: string }) {
  return (
    <a
      href={href}
      aria-label={name}
      title={name}
      target="_blank"
      rel="noopener noreferrer"
      className="group rounded-full p-2 border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)]/80 hover:text-[var(--neon-cyan)] hover:border-[var(--neon-cyan)] transition-colors"
    >
      <svg
        aria-hidden="true"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10 13a5 5 0 0 0 7.07.07l2-2a5 5 0 0 0-7.07-7.07l-1.15 1.15" />
        <path d="M14 11a5 5 0 0 0-7.07-.07l-2 2A5 5 0 0 0 7 20l1.15-1.15" />
      </svg>
    </a>
  );
}

export default UnsupportedSocialIcon;