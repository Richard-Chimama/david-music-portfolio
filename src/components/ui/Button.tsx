import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";

export function Button({ variant = "primary", className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  const base = "focus-ring inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed";
  const styles: Record<Variant, string> = {
    primary: "bg-[var(--neon-blue)] hover:bg-[var(--neon-purple)] text-black shadow-[0_0_12px_rgba(43,134,197,0.6)]",
    secondary: "bg-[var(--surface)] text-[var(--foreground)] border border-[var(--border)] hover:border-[var(--neon-cyan)]",
    ghost: "bg-transparent text-[var(--foreground)] hover:text-[var(--neon-cyan)]",
  };
  return <button className={`${base} ${styles[variant]} ${className}`} {...props} />;
}