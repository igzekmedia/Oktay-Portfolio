"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Hero() {
  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-end pb-40 md:justify-center md:pb-0 overflow-hidden"
    >
      {/* Background photo */}
      <Image
        src="/hero-bg.jpg"
        alt="Serdar Bolukbaşi studio"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />

      {/* Dark overlay — heavier at top and bottom, lighter in middle */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(9,9,9,0.65) 0%, rgba(9,9,9,0.2) 35%, rgba(9,9,9,0.3) 60%, rgba(9,9,9,0.85) 80%, rgba(9,9,9,1) 100%)",
        }}
      />

      {/* Vertical rule lines — decorative */}
      <div className="absolute left-8 top-0 bottom-0 w-px bg-white/10 hidden lg:block" />
      <div className="absolute right-8 top-0 bottom-0 w-px bg-white/10 hidden lg:block" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center md:mt-64 w-full">

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-[clamp(2rem,5.5vw,4.5rem)] leading-none text-white"
          style={{ fontFamily: "var(--font-display)", fontWeight: 800, letterSpacing: "-0.03em" }}
        >
          SERDAR <span style={{ color: "var(--gold)", fontWeight: 400 }}>BOLUKBAŞI</span>
        </motion.h1>

        {/* Award badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="inline-flex items-center gap-3 mt-8"
        >
          <span className="block w-12 h-px bg-[var(--gold-dim)]" />
          <span className="text-[10px] tracking-[0.35em] uppercase text-[var(--gold)]">
            International Award Winning Artist
          </span>
          <span className="block w-12 h-px bg-[var(--gold-dim)]" />
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="mt-12 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 w-full sm:w-auto"
        >
          <button
            onClick={() => scrollTo("#portfolio")}
            className="w-full sm:w-auto px-10 py-3.5 bg-[var(--gold)] text-[var(--bg)] text-[11px] tracking-[0.25em] uppercase hover:bg-[var(--text)] transition-colors duration-300 cursor-pointer"
          >
            View Work
          </button>
          <button
            onClick={() => scrollTo("#booking")}
            className="w-full sm:w-auto px-10 py-3.5 border border-white/25 text-white/70 text-[11px] tracking-[0.25em] uppercase hover:border-white/60 hover:text-white transition-colors duration-300 cursor-pointer"
          >
            Book Session
          </button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[9px] tracking-[0.3em] uppercase text-white/30">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent"
        />
      </motion.div>
    </section>
  );
}
