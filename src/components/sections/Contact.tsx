"use client";
import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Heading, Body } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import InstagramIcon from "@/components/icons/InstagramIcon";
import SpotifyIcon from "@/components/icons/SpotifyIcon";
import YouTubeIcon from "@/components/icons/YouTubeIcon";
import TikTokIcon from "@/components/icons/TikTokIcon";
import AudiomackIcon from "@/components/icons/AudiomackIcon";

export function Contact() {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [projectType, setProjectType] = useState<string>("");
  const [otherProjectType, setOtherProjectType] = useState<string>("");

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
    if (!projectType) {
      setStatus("Please select a project type.");
      return;
    }
    if (projectType === "others" && !otherProjectType.trim()) {
      setStatus("Please specify your project type.");
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
      setProjectType("");
      setOtherProjectType("");
    } catch (err) {
      setStatus("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const handleProjectTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setProjectType(value);
    if (value !== "others") {
      setOtherProjectType("");
    }
  };

  return (
    <Section id="contact">
      <Container>
        {/* Two-line heading */}
        <div className="space-y-2">
          <Heading as="h2">Get In Touch</Heading>
          <Body className="text-[var(--foreground)]/80">Ready to collaborate or have a question?</Body>
        </div>

        {/* Responsive two-column layout */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Informational message + socials (left on large screens, first on mobile) */}
          <div className="glass rounded-2xl p-6 flex flex-col justify-between">
            <div className="space-y-3">
              <Heading as="h3" className="text-2xl sm:text-3xl md:text-4xl">Let&#39;s Create Something Amazing</Heading>
              <Body>
                Whether you&#39;re looking for original music, sound design, or collaboration opportunities, I&#39;d love to hear from you.
              </Body>
            </div>
            <div className="mt-6">
              <div className="flex flex-col items-start gap-3" aria-label="Social media links">
                {/* Replace hrefs with your actual profiles */}
                <div className="flex items-center gap-3">
                  <InstagramIcon href="https://www.instagram.com/beats_by_swiden_?igsh=MWN2ZXFzaGw4dmliYg%3D%3D&utm_source=qr" />
                  <span className="text-sm text-[var(--foreground)]/80">Instagram</span>
                </div>
                <div className="flex items-center gap-3">
                  <SpotifyIcon href="https://open.spotify.com/artist/7ib41FQHWZxem6NLTqaYH6?si=0dCjFJxfQKGhdwR-EdnfJA" />
                  <span className="text-sm text-[var(--foreground)]/80">Spotify</span>
                </div>
                <div className="flex items-center gap-3">
                  <YouTubeIcon href="https://www.youtube.com/@swiden369" />
                  <span className="text-sm text-[var(--foreground)]/80">YouTube</span>
                </div>
                <div className="flex items-center gap-3">
                  <TikTokIcon href="https://www.tiktok.com/@iamswiden?_t=ZN-90PSwX76KoA&_r=1" />
                  <span className="text-sm text-[var(--foreground)]/80">TikTok</span>
                </div>
                <div className="flex items-center gap-3">
                  <AudiomackIcon href="https://audiomack.com/swiden" />
                  <span className="text-sm text-[var(--foreground)]/80">Audiomack</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact form (right on large screens, second on mobile) */}
          <form onSubmit={onSubmit} className="glass rounded-2xl p-6 grid gap-4" aria-describedby="contact-status">
            <label className="grid gap-2">
              <span className="text-sm">Name</span>
              <input name="name" type="text" required className="rounded-md bg-[var(--surface)] border border-[var(--border)] px-3 py-2" />
            </label>
            <label className="grid gap-2">
              <span className="text-sm">Email</span>
              <input name="email" type="email" required className="rounded-md bg-[var(--surface)] border border-[var(--border)] px-3 py-2" />
            </label>
            <label className="grid gap-2">
              <span className="text-sm">Project Type</span>
              <select 
                value={projectType} 
                onChange={handleProjectTypeChange}
                required 
                className="rounded-md bg-[var(--surface)] border border-[var(--border)] px-3 py-2 text-[var(--foreground)]"
                aria-label="Select project type"
                aria-describedby="project-type-help"
              >
                <option value="">Select a project type</option>
                <option value="music-production">Music Production</option>
                <option value="collaboration">Collaboration</option>
                <option value="sound-design">Sound Design</option>
                <option value="others">Others</option>
              </select>
              <span id="project-type-help" className="sr-only">Choose the type of project you need help with</span>
            </label>
            {projectType === "others" && (
              <label className="grid gap-2">
                <span className="text-sm">Please specify</span>
                <input 
                  type="text" 
                  value={otherProjectType}
                  onChange={(e) => setOtherProjectType(e.target.value)}
                  required
                  placeholder="Describe your project type"
                  className="rounded-md bg-[var(--surface)] border border-[var(--border)] px-3 py-2"
                  aria-label="Specify other project type"
                />
              </label>
            )}
            <label className="grid gap-2">
              <span className="text-sm">Message</span>
              <textarea name="message" rows={4} required className="rounded-md bg-[var(--surface)] border border-[var(--border)] px-3 py-2" />
            </label>
            <div className="flex items-center gap-3">
              <Button type="submit" disabled={loading}>{loading ? "Sending..." : "Send Message"}</Button>
              <span id="contact-status" role="status" aria-live="polite" className="text-sm text-[var(--foreground)]/80">{status}</span>
            </div>
          </form>
        </div>
      </Container>
    </Section>
  );
}