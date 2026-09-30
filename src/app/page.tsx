import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { FeaturedPlaylist } from "@/components/sections/FeaturedPlaylist";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/ui/Footer";
import { ContentfulProvider } from "@/components/state/ContentfulProvider";
import { getHomepageContent } from "@/lib/contentful";

export default async function Home() {
  const homepageContent = await getHomepageContent();

  return (
    <ContentfulProvider initialHomepage={homepageContent}>
      <main className="font-sans">
        <Hero />
        <About />
        <FeaturedPlaylist />
        <Contact />
        <Footer />
      </main>
    </ContentfulProvider>
  );
}
