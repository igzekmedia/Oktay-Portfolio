"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Update these with the real images / award pairings ──────────────────────
// Each entry supports multiple images — add as many as you like to the images array.
const entries = [
  {
    images: [
      { src: "/awards/Villain Arts Tattoo Arts Festival 2025/1.png", w: 1080, h: 1350 },
      { src: "/awards/Villain Arts Tattoo Arts Festival 2025/2.png", w: 1080, h: 1350 },
      { src: "/awards/Villain Arts Tattoo Arts Festival 2025/3.png", w: 1080, h: 1350 },
    ],
    convention: "Villain Arts Tattoo Arts Festival",
    year: "2025",
    location: "Denver, Colorado",
    awards: [
      { placement: "TBA", category: "Award details coming soon" },
    ],
  },
  {
    images: [
      { src: "/awards/Colorado Tattoo Convention 2025/5.png", w: 1080, h: 1350 },
    ],
    convention: "Colorado Tattoo Convention",
    year: "2025",
    location: "Denver, Colorado",
    awards: [
      { placement: "TBA", category: "Award details coming soon" },
    ],
  },
  {
    images: [
      { src: "/awards/Colorado Tattoo Convention 2025.1/6.png", w: 1080, h: 1350 },
    ],
    convention: "Colorado Tattoo Convention",
    year: "2025",
    location: "Denver, Colorado",
    awards: [
      { placement: "TBA", category: "Award details coming soon" },
    ],
  },
  {
    images: [
      { src: "/awards/Villan Arts Tattoo Arts Festival 2024/4.png", w: 1080, h: 1350 },
    ],
    convention: "Villain Arts Tattoo Arts Festival",
    year: "2024",
    location: "Denver, Colorado",
    awards: [
      { placement: "TBA", category: "Award details coming soon" },
    ],
  },
];
// ─────────────────────────────────────────────────────────────────────────────

const totalAwards = 12;

function EntryGallery({ images }: { images: { src: string; w: number; h: number }[] }) {
  const [index, setIndex] = useState(0);

  if (images.length === 0) return null;

  const current = images[index];

  return (
    <div className="relative overflow-hidden w-full" style={{ height: "400px" }}>
      <AnimatePresence mode="wait">
        <motion.img
          key={current.src}
          src={current.src}
          alt="Award winning tattoo"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AnimatePresence>

      {/* Prev / Next arrows — only shown when multiple images */}
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-black/50 text-white hover:bg-black/75 transition-colors duration-200 cursor-pointer"
            aria-label="Previous photo"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setIndex((i) => (i + 1) % images.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-black/50 text-white hover:bg-black/75 transition-colors duration-200 cursor-pointer"
            aria-label="Next photo"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                className="w-1.5 h-1.5 rounded-full transition-all duration-200 cursor-pointer"
                style={{ background: i === index ? "var(--gold)" : "rgba(255,255,255,0.3)" }}
                aria-label={`Photo ${i + 1}`}
              />
            ))}
          </div>

          {/* Counter */}
          <div className="absolute top-3 right-3 px-2 py-0.5 bg-black/50 text-[9px] tracking-widest text-white/70">
            {index + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
}

export default function Awards() {
  return (
    <section id="awards" className="pt-16 pb-10 md:pt-32 md:pb-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <p className="text-[10px] tracking-[0.35em] uppercase text-[var(--gold)] mb-4">
              International Recognition
            </p>
            <h2
              className="text-[clamp(2.5rem,5vw,4.5rem)] leading-none text-[var(--text)]"
              style={{ fontFamily: "var(--font-display)", fontWeight: 800, letterSpacing: "-0.03em" }}
            >
              AWARD WINNING
              <br />
              <span style={{ color: "var(--gold)", fontWeight: 400 }}>WORK</span>
            </h2>
          </div>
          <p className="text-sm text-[var(--muted)] max-w-xs leading-relaxed">
            Recognised across {entries.length} international competitions —
            each piece judged in open competition against the world&apos;s finest artists.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="space-y-px">
          {entries.map((entry, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.07 }}
              className="group grid grid-cols-1 md:grid-cols-[1fr_2fr] border border-[var(--border)] hover:border-[var(--gold-dim)] transition-colors duration-500 overflow-hidden"
            >
              {/* Photo gallery */}
              <EntryGallery images={entry.images} />

              {/* Info panel */}
              <div className="flex flex-col p-8 md:p-12 bg-[var(--surface)] group-hover:bg-[var(--surface-2)] transition-colors duration-500">

                {/* Convention */}
                <div className="mb-8">
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--muted)]">
                      Convention
                    </p>
                    <span className="text-sm text-[var(--muted)] tabular-nums shrink-0">
                      {entry.year}
                    </span>
                  </div>
                  <h3
                    className="text-[clamp(1.4rem,2.8vw,2.2rem)] leading-tight text-[var(--text)]"
                    style={{ fontFamily: "var(--font-display)", fontWeight: 700, letterSpacing: "-0.02em" }}
                  >
                    {entry.convention}
                  </h3>
                  <p className="mt-1.5 text-sm text-[var(--muted)]">
                    {entry.location}
                  </p>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-[var(--border)] mb-8" />

                {/* Awards list */}
                <div>
                  <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--muted)] mb-5">
                    {entry.awards.length === 1 ? "Award" : "Awards"}
                  </p>
                  <ul className="space-y-4">
                    {entry.awards.map((award, j) => (
                      <li key={j} className="flex items-center gap-4">
                        <span className="shrink-0 px-3 py-1 border border-[var(--gold-dim)] text-[9px] tracking-[0.2em] uppercase text-[var(--gold)] whitespace-nowrap">
                          {award.placement}
                        </span>
                        <span className="text-sm text-[var(--text)]">
                          {award.category}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer count */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-6 flex items-center justify-between border-t border-[var(--border)] pt-4"
        >
          <p className="text-[10px] tracking-[0.25em] uppercase text-[var(--muted)]">
            Total awards won
          </p>
          <p
            className="text-4xl text-[var(--gold)]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
          >
            {totalAwards}+
          </p>
        </motion.div>

      </div>
    </section>
  );
}
