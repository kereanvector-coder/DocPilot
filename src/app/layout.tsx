import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "DocPilot — Smart PDF Toolkit | Merge, Compress, Convert & Chat with PDFs",
  description: "All-in-one PDF and image toolkit powered by AI. Merge, split, compress, convert PDFs, remove backgrounds, upscale images, and chat with documents using Pilot AI. No install, no signup, privacy-first. Free to use.",
  keywords: ["PDF tools", "merge PDF", "compress PDF", "PDF to Word", "chat with PDF", "AI PDF assistant", "image tools", "remove background", "PDF toolkit", "DocPilot"],
  authors: [{ name: "Emmanuel Eleweke" }],
  robots: "index, follow",
  alternates: {
    canonical: "https://doc-pilot.netlify.app/",
  },
  openGraph: {
    type: "website",
    url: "https://doc-pilot.netlify.app/",
    title: "DocPilot — Your PDFs Finally Have a Co-Pilot",
    description: "14 PDF and image tools in one tab. Merge, compress, convert, and chat with your documents using Pilot AI. Free, private, no account needed.",
    images: [{ url: "https://doc-pilot.netlify.app/og-image.png", width: 1200, height: 630 }],
    siteName: "DocPilot",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "DocPilot — Your PDFs Finally Have a Co-Pilot",
    description: "14 PDF and image tools in one tab. Chat with documents using Pilot AI. Free, private, no signup.",
    images: ["https://doc-pilot.netlify.app/og-image.png"],
    creator: "@EmmanuelEleweke",
  },
  icons: {
    icon: "/favicon.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased scroll-smooth overflow-x-hidden`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
