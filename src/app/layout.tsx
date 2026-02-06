import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MetaMusic | Music Metadata Platform",
  description:
    "Discover songs, albums, artists, and playlists with rich metadata and streaming links.",
  metadataBase: new URL("https://metamusic.local"),
  openGraph: {
    title: "MetaMusic | Music Metadata Platform",
    description:
      "Discover songs, albums, artists, and playlists with rich metadata and streaming links.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans bg-background text-foreground`}>
        {children}
      </body>
    </html>
  );
}
