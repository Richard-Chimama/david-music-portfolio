"use client";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Heading, Body } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { useEffect, useRef, useState } from "react";
import { useContentfulState } from "@/components/state/ContentfulProvider";
import type { Icon } from "@/types/types";

const fallbackAboutParagraphs = [
  "Professionally known as Swiden (Iam Swiden), is a multi-talented award winning musician, music producer, songwriter, singer, film star, sound engineer, filmmaker, and multi-instrumentalist with high skils of playing instruments like guitar, piano and drums (jazzkits), violin and more others, he is one of the greatest music producer of all the times whose artistry transcends borders and genres. Swiden is a Swedish music producer with Congolese origin born on the 15th November 2000. Swiden embodies a rare fusion of cultural richness and sonic innovation.",
  "As a music producer, Swiden has carved a unique sound that blends Afrobeats, Pop, Dancehall, Reggae, EdM, Amapiano, electronics, kompa Rhumba, Seben and an eclectic mix of global rhythms. His music is renowned for its inspirational and deep lyrics, poetic depth, infused with emotion, spirituality, and meaning. Every note he creates carries energy frequencies that uplifts, heals, his words are used as medicine of the heart and souls, and resonates deeply with listeners worldwide.",
  "Swiden has written a lot of hitsongs for different artists world wide both in Africa, Asia, America and Europe, has won multiple awards as the song writer of the year, producer of the year, the best video of the year and more categories, when it comes to love his voice defined love before even the whole song is heard and his love song lyrics are always the best dedication to lovers he is such a gift that the world is extremely grateful to have.",
  "Swiden's voice has often been described as magical and angelic, with a healing quality that touches the soul. His lyrics reflect wisdom, introspection, and passion, while his sound design showcases his exceptional skill as a sound engineer and producer. A true visionary, he doesn't limit himself to one style—Swiden is versatile, mastering every genre he touches with authenticity and creativity.",
  "Beyond his musical genius, Swiden is also a film star and filmmaker, bringing stories to life through both sound and visuals. His artistic mission is to inspire, connect, and spread positivity through every form of creative expression.",
  "These platforms represent his commitment to empowering artists, promoting authentic music, and building a global creative community.",
  "Swiden's artistry continues to evolve, shaping the future of modern music with a sound that is both timeless and healing. His journey is one of passion, purpose, and power—a story of a young visionary destined to make a lasting impact on the world through the beauty of sound.",
];

const fallbackHighlights = [
  { icon: "🎧", internalTitle: "streams", text: "1M+ streams across platforms" },
  { icon: "🎹", internalTitle: "sound-design", text: "Modular synth enthusiast and sound designer" },
  { icon: "🌐", internalTitle: "collaborations", text: "Collaborations with EU-based vocalists" },
];

const fallbackEntities = [
  "Swidenation Record Label",
  "Toko Music Empire",
  "FreeSoul Music",
];

const validIconWeights = new Set([
  "thin",
  "light",
  "regular",
  "bold",
  "fill",
  "duotone",
]);

function normalizeIconToken(value: string): string {
  return value
    .trim()
    .replace(/^ph-/i, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function getPhosphorIconClass(icon: Icon["phosphorIcon"]): string | null {
  if (!icon) return null;

  const iconName = normalizeIconToken(icon.name || icon.componentName || "")
    .replace(/-(thin|light|regular|bold|fill|duotone)$/, "");
  if (!iconName) return null;

  const weight = (icon.weight || "regular").trim().toLowerCase();
  const validWeight = validIconWeights.has(weight) ? weight : "regular";
  return `ph ph-${iconName} ${validWeight}`;
}

function ProfileIcon({
  icon,
  fallback,
}: {
  icon: Icon["phosphorIcon"];
  fallback: string;
}) {
  const className = getPhosphorIconClass(icon);
  const position = icon?.position?.trim().toLowerCase();
  const isTrailing = position === "right" || position === "after";

  return (
    <span
      aria-hidden="true"
      className={`inline-flex w-5 shrink-0 justify-center text-[var(--neon-cyan)]${
        isTrailing ? " order-last" : ""
      }`}
    >
      {className ? <i className={className} /> : fallback}
    </span>
  );
}

function richTextToParagraphs(value: unknown): string[] {
  const getText = (node: unknown): string => {
    if (Array.isArray(node)) return node.map(getText).join("");
    if (!node || typeof node !== "object") return "";

    const record = node as Record<string, unknown>;
    if (record.nodeType === "text" && typeof record.value === "string") {
      return record.value;
    }
    return getText(record.content);
  };

  const paragraphs: string[] = [];
  const visit = (node: unknown) => {
    if (Array.isArray(node)) {
      node.forEach(visit);
      return;
    }
    if (!node || typeof node !== "object") return;

    const record = node as Record<string, unknown>;
    if (["paragraph", "list-item", "blockquote"].includes(String(record.nodeType))) {
      const text = getText(record.content).trim();
      if (text) paragraphs.push(text);
      return;
    }
    visit(record.content);
  };

  visit(value);
  return paragraphs;
}

export function About() {
  const { homepage } = useContentfulState();
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const profile = homepage?.profile;
  const sidebar = profile?.musicProfileSidebar;
  const descriptionParagraphs = richTextToParagraphs(profile?.description?.json);
  const aboutParagraphs = descriptionParagraphs.length
    ? descriptionParagraphs
    : fallbackAboutParagraphs;
  const highlights = sidebar?.highlightCollection.items.length
    ? sidebar.highlightCollection.items.map((highlight) => ({
        internalTitle: highlight.internalTitle,
        text: highlight.text,
        icon: highlight.icon?.phosphorIcon ?? null,
        fallbackIcon: "•",
      }))
    : fallbackHighlights.map((highlight) => ({
        internalTitle: highlight.internalTitle,
        text: highlight.text,
        icon: null,
        fallbackIcon: highlight.icon,
      }));
  const entities = sidebar?.entitiesCollection.items.length
    ? sidebar.entitiesCollection.items.map((entity) => ({
        internalTitle: entity.internalTitle,
        name: entity.name,
        icon: entity.icon?.phosphorIcon ?? null,
        fallbackIcon: "🎵",
      }))
    : fallbackEntities.map((name, index) => ({
        internalTitle: `fallback-entity-${index}`,
        name,
        icon: null,
        fallbackIcon: ["🎵", "🎶", "💫"][index % 3],
      }));

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    let ro: ResizeObserver | null = null;
    const measure = () => setContentHeight(el.scrollHeight);

    if (expanded) {
      measure();
      ro = new ResizeObserver(measure);
      ro.observe(el);
    }

    return () => {
      if (ro) ro.disconnect();
    };
  }, [expanded]);

  return (
    <Section id="about">
      <Container className="grid md:grid-cols-2 gap-10">
        <div>
          <Heading>{profile?.aboutHeading || "About the Artist"}</Heading>
          <Body className="mt-4">{aboutParagraphs[0]}</Body>
          {!expanded && (
            <div className="mt-4">
              <Button
                variant="secondary"
                aria-label="Read more about the artist"
                onClick={() => setExpanded(true)}
                className="shadow-glow"
              >
                Read More
              </Button>
            </div>
          )}
          <div
            ref={contentRef}
            className="overflow-hidden transition-[height,opacity] duration-500 ease-out"
            style={{ height: expanded ? contentHeight : 0, opacity: expanded ? 1 : 0 }}
            aria-hidden={!expanded}
          >
            {aboutParagraphs.slice(1).map((paragraph, index) => (
              <Body className="mt-4" key={`about-${index}`}>
                {paragraph}
              </Body>
            ))}
            <div className="mt-6">
              <Button
                variant="secondary"
                aria-label="Close expanded about section"
                onClick={() => setExpanded(false)}
                className="shadow-glow"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
        <div className="glass rounded-2xl p-6 h-100">
          <ul className="grid gap-3 text-sm">
            {highlights.map((highlight) => (
              <li className="flex items-center gap-2" key={highlight.internalTitle}>
                <ProfileIcon icon={highlight.icon} fallback={highlight.fallbackIcon} />
                {highlight.text}
              </li>
            ))}
          </ul>

          <h2 className="mt-4">
            {sidebar?.entitiesHeading ||
              "He is the Founder and CEO of three influential music entities:"}
          </h2>
          <ul className="grid gap-3 text-sm mt-4">
            {entities.map((entity) => (
              <li className="flex items-center gap-2" key={entity.internalTitle}>
                <ProfileIcon icon={entity.icon} fallback={entity.fallbackIcon} />
                {entity.name}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
