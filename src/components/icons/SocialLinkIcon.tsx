import type { SocialLink } from "@/types/types";
import AudiomackIcon from "@/components/icons/AudiomackIcon";
import InstagramIcon from "@/components/icons/InstagramIcon";
import SpotifyIcon from "@/components/icons/SpotifyIcon";
import TikTokIcon from "@/components/icons/TikTokIcon";
import UnsupportedSocialIcon from "@/components/icons/UnsupportedSocialIcon";
import YouTubeIcon from "@/components/icons/YouTubeIcon";

const socialLabels: Record<string, string> = {
  audiomack: "Audiomack",
  instagram: "Instagram",
  spotify: "Spotify",
  tiktok: "TikTok",
  youtube: "YouTube",
};

export function getSocialLinkLabel(name: string): string {
  const normalizedName = name.trim().toLowerCase();
  const knownName = Object.keys(socialLabels).find((key) =>
    normalizedName.includes(key),
  );

  return knownName
    ? socialLabels[knownName]
    : name.trim().replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function SocialLinkIcon({ link }: { link: SocialLink }) {
  const name = link.name.trim().toLowerCase();

  if (name.includes("youtube")) return <YouTubeIcon href={link.url} />;
  if (name.includes("audiomack")) return <AudiomackIcon href={link.url} />;
  if (name.includes("tiktok")) return <TikTokIcon href={link.url} />;
  if (name.includes("spotify")) return <SpotifyIcon href={link.url} />;
  if (name.includes("instagram")) return <InstagramIcon href={link.url} />;

  return <UnsupportedSocialIcon name={link.name} href={link.url} />;
}