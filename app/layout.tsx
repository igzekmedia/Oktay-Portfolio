import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Serdar Bolukbaşi — International Award Winning Tattoo Artist",
  description:
    "Fine line and blackwork tattoo art by Serdar Bolukbaşi. Book your appointment with one of the world's most recognized tattoo artists.",
  openGraph: {
    title: "Serdar Bolukbaşi — Tattoo Artist",
    description: "International Award Winning Tattoo Artist",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
