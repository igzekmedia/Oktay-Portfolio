import type { Metadata } from "next";
import BookingFunnel from "@/components/BookingFunnel";

export const metadata: Metadata = {
  title: "Book a Session | Oktay Yildirim",
  description:
    "Start your booking with Oktay Yildirim, international award winning tattoo artist at Cleopatra Ink Denver.",
  openGraph: {
    title: "Book a Session | Oktay Yildirim",
    description: "Start your booking with Oktay Yildirim at Cleopatra Ink Denver.",
    type: "website",
  },
};

export default function BookPage() {
  return <BookingFunnel />;
}
