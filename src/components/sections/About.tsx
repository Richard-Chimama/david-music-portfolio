"use client";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Heading, Body } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { useEffect, useRef, useState } from "react";

export function About() {
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [contentHeight, setContentHeight] = useState(0);

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
          <Heading>About the Artist</Heading>
          <Body className="mt-4">
            Professionally known as Swiden (Iam Swiden), is a multi-talented
            award winning musician, music producer, songwriter, singer, film
            star, sound engineer, filmmaker, and multi-instrumentalist with high
            skils of playing instruments like guitar , piano and drums (
            jazzkits ) , violin and more others, he is one of the greatest music
            producer of all the times whose artistry transcends borders and
            genres. Swiden is a Swedish music producer with Congolese origin
            born on the 15th November 2000. Swiden embodies a rare fusion of 
            cultural richness and sonic innovation.
          </Body>
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
          <Body className="mt-4">
            As a music producer, Swiden has carved a unique sound that blends
            Afrobeats, Pop, Dancehall, Reggae, EdM , Amapiano , electronics,
            kompa Rhumba , Seben and an eclectic mix of global rhythms. His
            music is renowned for its inspirational and deep lyrics , poetic
            depth, infused with emotion, spirituality, and meaning. Every note
            he creates carries energy frequencies that uplifts, heals, his words
            are used as medicine of the heart and souls , and resonates deeply
            with listeners worldwide.
          </Body>
          <Body className="mt-4">
            Swiden has written a lot of hitsongs for different artists world
            wide both in Africa , Asia , America and Europe, has won multiple
            awards as the song writer of the year , producer of the year , the
            best video of the year and more categories, when it comes to love
            his voice defined love before even the whole song is heard and his
            love song lyrics are always the best dedication to lovers he is such
            a gift that the world is extremely grateful to have .
          </Body>
          <Body className="mt-4">
            Swiden&apos;s voice has often been described as magical and angelic,
            with a healing quality that touches the soul. His lyrics reflect
            wisdom, introspection, and passion, while his sound design showcases
            his exceptional skill as a sound engineer and producer. A true
            visionary, he doesn&apos;t limit himself to one style—Swiden is
            versatile, mastering every genre he touches with authenticity and
            creativity.{" "}
          </Body>
          <Body className="mt-4">
            Beyond his musical genius, Swiden is also a film star and filmmaker,
            bringing stories to life through both sound and visuals. His
            artistic mission is to inspire, connect, and spread positivity
            through every form of creative expression.
          </Body>
          <Body className="mt-4">
            These platforms represent his commitment to empowering artists,
            promoting authentic music, and building a global creative community.
          </Body>

          <Body className="mt-4">
            Swiden&apos;s artistry continues to evolve, shaping the future of modern
            music with a sound that is both timeless and healing. His journey is
            one of passion, purpose, and power — a story of a young visionary
            destined to make a lasting impact on the world through the beauty of
            sound.
          </Body>
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
            <li className="flex items-center gap-2">
              <span aria-hidden>🎧</span> 1M+ streams across platforms
            </li>
            <li className="flex items-center gap-2">
              <span aria-hidden>🎹</span> Modular synth enthusiast and sound
              designer
            </li>
            <li className="flex items-center gap-2">
              <span aria-hidden>🌐</span> Collaborations with EU-based vocalists
            </li>
          </ul>

          <h2 className="mt-4">
            He is the Founder and CEO of three influential music entities:
          </h2>
          <ul className="grid gap-3 text-sm mt-4">
            <li className="flex items-center gap-2">
              <span aria-hidden>🎵</span> Swidenation Record Label
            </li>
            <li className="flex items-center gap-2">
              <span aria-hidden>🎶</span> Toko Music Empire
            </li>
            <li className="flex items-center gap-2">
              <span aria-hidden>💫</span> FreeSoul Music
            </li>
          </ul>
        </div>
      </Container>
    </Section>
  );
}
