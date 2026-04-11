import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Portfolio from "@/components/Portfolio";
import Awards from "@/components/Awards";
import About from "@/components/About";
import Booking from "@/components/Booking";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <Portfolio />
      <Awards />
      <About />
      <Booking />
      <FAQ />
      <Footer />
    </main>
  );
}
