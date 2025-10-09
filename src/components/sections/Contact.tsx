"use client";
import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";

export function Contact() {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = (formData.get("name") || "").toString().trim();
    const email = (formData.get("email") || "").toString().trim();
    const message = (formData.get("message") || "").toString().trim();

    if (!name || !email || !message) {
      setStatus("Please fill out all fields.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      // For now we simulate sending; integrate with API later
      await new Promise((res) => setTimeout(res, 800));
      setStatus("Thanks! Your message has been sent.");
      form.reset();
    } catch (err) {
      setStatus("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Section id="contact">
      <Container>
        <Heading>Contact</Heading>
        <form onSubmit={onSubmit} className="mt-6 grid gap-4 glass rounded-2xl p-6" aria-describedby="contact-status">
          <label className="grid gap-2">
            <span className="text-sm">Name</span>
            <input name="name" type="text" required className="rounded-md bg-[var(--surface)] border border-[var(--border)] px-3 py-2" />
          </label>
          <label className="grid gap-2">
            <span className="text-sm">Email</span>
            <input name="email" type="email" required className="rounded-md bg-[var(--surface)] border border-[var(--border)] px-3 py-2" />
          </label>
          <label className="grid gap-2">
            <span className="text-sm">Message</span>
            <textarea name="message" rows={4} required className="rounded-md bg-[var(--surface)] border border-[var(--border)] px-3 py-2" />
          </label>
          <div className="flex items-center gap-3">
            <Button type="submit" disabled={loading}>{loading ? "Sending..." : "Send Message"}</Button>
            <span id="contact-status" role="status" aria-live="polite" className="text-sm text-[var(--foreground)]/80">{status}</span>
          </div>
        </form>
      </Container>
    </Section>
  );
}