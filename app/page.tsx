import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Portfolio from "@/components/Portfolio";
import Awards from "@/components/Awards";
import About from "@/components/About";
import BookingFunnel from "@/components/BookingFunnel";
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
      <section
        id="booking"
        className="py-16 md:py-32 px-6 md:px-12 bg-[var(--surface)] scroll-mt-24"
      >
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 md:gap-20 md:items-start">
          <div className="md:pt-4">
            <p className="text-[10px] tracking-[0.35em] uppercase text-[var(--gold)] mb-4">
              Start the Process
            </p>
            <h2
              className="text-[clamp(2.5rem,5vw,4.5rem)] leading-none text-[var(--text)]"
              style={{ fontFamily: "var(--font-display)", fontWeight: 800, letterSpacing: "-0.03em" }}
            >
              BOOK A
              <br />
              <span className="gold-gradient-text" style={{ fontWeight: 400 }}>CONSULTATION</span>
            </h2>
            <p className="mt-6 text-sm text-[var(--muted)] leading-relaxed max-w-sm">
              Every piece begins with a consultation, a design session to shape your idea before any ink.
            </p>
          </div>
          <div>
            <BookingFunnel embedded />
          </div>
        </div>
      </section>
      <FAQ />
      <Footer />
    </main>
  );
}
