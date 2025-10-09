import { ReactNode, ElementType } from "react";

type HeadingProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
};

export function Heading({ children, className = "", as: Tag = "h2" }: HeadingProps) {
  const Component = Tag as ElementType;
  return (
    <Component className={`font-display tracking-wider text-3xl sm:text-4xl md:text-5xl neon-text ${className}`}>{children}</Component>
  );
}

export function Subheading({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`text-sm sm:text-base uppercase tracking-[0.25em] text-[var(--neon-cyan)] ${className}`}>{children}</p>;
}

export function Body({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`text-base sm:text-lg text-[var(--foreground)]/90 ${className}`}>{children}</p>;
}