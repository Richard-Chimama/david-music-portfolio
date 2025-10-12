import type { Metadata } from "next";
import { Geist, Geist_Mono, Orbitron, Inter } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Swiden — Award-Winning Multitalented Musician & Producer",
  description:
    "Professionally known as Swiden (Iam Swiden), a multi-talented, award-winning musician, producer, songwriter, singer, film star, sound engineer, filmmaker, and multi-instrumentalist. Born November 15, 2000 in Sweden to Congolese roots, Swiden blends Afrobeats, Pop, Dancehall, Reggae, EDM, Amapiano, Electronic, Kompa, Rhumba, Seben and global rhythms. His poetic, spiritually infused music heals, uplifts, and resonates worldwide.",
  keywords: [
    "Swiden",
    "Iam Swiden",
    "Musician",
    "Music Producer",
    "Singer",
    "Songwriter",
    "Sound Engineer",
    "Filmmaker",
    "Afrobeats",
    "Pop",
    "Dancehall",
    "Reggae",
    "EDM",
    "Amapiano",
    "Electronic",
    "Kompa",
    "Rhumba",
    "Seben",
    "Award-winning",
    "Multi-instrumentalist",
  ],
  applicationName: "Swiden Music",
  authors: [{ name: "Swiden" }],
  creator: "Swiden",
  publisher: "Swiden",
  category: "Music",
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title: "Swiden — Award-Winning Multitalented Musician & Producer",
    description:
      "Swiden (Iam Swiden) is an award-winning musician, producer, songwriter, singer, sound engineer, filmmaker, and multi-instrumentalist blending Afrobeats, Pop, Dancehall, Reggae, EDM, Amapiano, Electronic, Kompa, Rhumba, and Seben.",
    images: [
      {
        url: "/sweden.png",
        width: 1200,
        height: 630,
        alt: "Swiden — Futuristic sound and visuals",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Swiden — Award-Winning Multitalented Musician & Producer",
    description:
      "Swiden (Iam Swiden), award-winning musician, producer, songwriter, singer, sound engineer, filmmaker, and multi-instrumentalist. Born in Sweden with Congolese roots.",
    images: ["/sweden.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const personJson = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Swiden",
    alternateName: ["Iam Swiden", "Swiden"],
    description:
      "Professionally known as Swiden (Iam Swiden), a multi-talented, award-winning musician, producer, songwriter, singer, film star, sound engineer, filmmaker, and multi-instrumentalist. Born November 15, 2000 in Sweden to Congolese roots, Swiden blends Afrobeats, Pop, Dancehall, Reggae, EDM, Amapiano, Electronic, Kompa, Rhumba, Seben and global rhythms.",
    birthDate: "2000-11-15",
    birthPlace: { "@type": "Place", name: "Sweden" },
    nationality: "Congolese",
    genre: [
      "Afrobeats",
      "Pop",
      "Dancehall",
      "Reggae",
      "EDM",
      "Amapiano",
      "Electronic",
      "Kompa",
      "Rhumba",
      "Seben",
    ],
    knowsAbout: [
      "Afrobeats",
      "Pop",
      "Dancehall",
      "Reggae",
      "EDM",
      "Amapiano",
      "Electronic",
      "Kompa",
      "Rhumba",
      "Seben",
    ],
    instrument: ["Guitar", "Piano", "Drums (Jazz Kits)", "Violin"],
    award: [
      "Songwriter of the Year",
      "Producer of the Year",
      "Best Video of the Year",
    ],
    jobTitle: [
      "Musician",
      "Music Producer",
      "Songwriter",
      "Singer",
      "Film Star",
      "Sound Engineer",
      "Filmmaker",
      "Multi-instrumentalist",
    ],
  };

  const faqJson = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Who is Swiden?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Swiden (Iam Swiden) is an award-winning multi-talented musician, producer, songwriter, singer, film star, sound engineer, filmmaker, and multi-instrumentalist born in Sweden with Congolese roots.",
        },
      },
      {
        "@type": "Question",
        name: "What genres does Swiden produce?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "He blends Afrobeats, Pop, Dancehall, Reggae, EDM, Amapiano, Electronic, Kompa, Rhumba, Seben and global rhythms with poetic, spiritually infused sound design.",
        },
      },
      {
        "@type": "Question",
        name: "What instruments does Swiden play?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Guitar, Piano, Drums (Jazz Kits), Violin, and more.",
        },
      },
      {
        "@type": "Question",
        name: "Is Swiden award-winning?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. He has won multiple awards including Songwriter of the Year, Producer of the Year, and Best Video of the Year.",
        },
      },
      {
        "@type": "Question",
        name: "What is Swiden’s mission?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "To inspire, connect, and spread positivity through music and film, creating healing and uplifting energy with deep, poetic lyrics and visionary production.",
        },
      },
    ],
  };
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable} ${inter.variable} antialiased`}
      >
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJson) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJson) }}
        />
      </body>
    </html>
  );
}
