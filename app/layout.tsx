import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Oktay | Tattoo Artist",
  description:
    "Oktay — Blackwork tattoo artist at Cleopatra Ink Denver.",
  openGraph: {
    title: "Oktay | Tattoo Artist",
    description: "Blackwork Tattoo Artist at Cleopatra Ink Denver",
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
