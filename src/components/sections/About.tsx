import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Heading, Body } from "@/components/ui/Typography";

export function About() {
  return (
    <Section id="about">
      <Container className="grid md:grid-cols-2 gap-10">
        <div>
          <Heading>About the Artist</Heading>
          <Body className="mt-4">
            With a decade of genre-bending production, NeoSound blends synthwave, ambient, and experimental rhythms.
            Performances across EU festivals and collaborations with emerging vocalists highlight a dynamic portfolio.
          </Body>
        </div>
        <div className="glass rounded-2xl p-6">
          <ul className="grid gap-3 text-sm">
            <li className="flex items-center gap-2"><span aria-hidden>🏆</span> Featured at Nordic Waves 2023</li>
            <li className="flex items-center gap-2"><span aria-hidden>🎧</span> 5M+ streams across platforms</li>
            <li className="flex items-center gap-2"><span aria-hidden>🎹</span> Modular synth enthusiast and sound designer</li>
            <li className="flex items-center gap-2"><span aria-hidden>🌐</span> Collaborations with EU-based vocalists</li>
          </ul>
        </div>
      </Container>
    </Section>
  );
}