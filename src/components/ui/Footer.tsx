"use client";
import React from "react";
import { Container } from "@/components/ui/Container";

export interface FooterProps {
  className?: string;
  ariaLabel?: string;
}

export const Footer: React.FC<FooterProps> = ({
  className = "",
  ariaLabel = "Site footer",
}) => {
  const year = new Date().getFullYear();

  return (
    <footer
      role="contentinfo"
      aria-label={ariaLabel}
      className={`mt-12 border-t border-[var(--border)]/50 bg-[var(--background)]/40 backdrop-blur-sm ${className}`}
    >
      <Container>
        <div className="py-6 sm:py-8 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <div className="text-xs sm:text-sm text-[var(--foreground)]/70">
            &copy; {year} Swiden
          </div>
          <div className="text-xs sm:text-sm text-[var(--foreground)]/60">
            Content by <span className="text-[var(--neon-cyan)]">Iam Sweden</span> · All rights reserved
          </div>
        </div>
      </Container>
    </footer>
  );
};