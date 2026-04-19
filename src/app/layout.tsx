import type { Metadata } from "next";
import { IBM_Plex_Mono, Source_Serif_4, Work_Sans } from "next/font/google";
import "./globals.css";

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "KlokPrat | Vanskelige samtaler hjemme",
  description:
    "KlokPrat hjelper foreldre å øve på vanskelige samtaler hjemme med alderspassede scenarioer, tydelige spørsmål og støtte underveis.",
  openGraph: {
    title: "KlokPrat | Vanskelige samtaler hjemme",
    description:
      "Lær barna å tenke selv i vanskelige situasjoner med konkrete samtaleguider for foreldre.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KlokPrat | Vanskelige samtaler hjemme",
    description:
      "Konkrete samtaleguider for foreldre som vil øve på vanskelige situasjoner hjemme.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="no"
      className={`${workSans.variable} ${sourceSerif.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
