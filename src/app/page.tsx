import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { FeaturedPlaylist } from "@/components/sections/FeaturedPlaylist";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <main className="font-sans">
      <Hero />
      <About />
      <FeaturedPlaylist />
      <Contact />
    </main>
  );
}
