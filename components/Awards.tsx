"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const entries = [
  {
    src: "/awards/Villain Arts Chicago 2026/28.png",
    convention: "Villain Arts Tattoo Arts Festival",
    year: "2026",
    location: "Chicago, Illinois",
    awards: [{ placement: "TBA", category: "Award details coming soon" }],
  },
  {
    src: "/awards/Villain Arts Chicago 2026 - 2/35.png",
    convention: "Villain Arts Tattoo Arts Festival",
    year: "2026",
    location: "Chicago, Illinois",
    awards: [{ placement: "TBA", category: "Award details coming soon" }],
  },
  {
    src: "/awards/Villain Arts Tattoo Arts Festival 2025/6.png",
    convention: "Villain Arts Tattoo Arts Festival",
    year: "2025",
    location: "Denver, Colorado",
    awards: [{ placement: "TBA", category: "Award details coming soon" }],
  },
  {
    src: "/awards/Villain Arts Tattoo Arts Festival 2025 - 2/26.png",
    convention: "Villain Arts Tattoo Arts Festival",
    year: "2025",
    location: "Denver, Colorado",
    awards: [{ placement: "TBA", category: "Award details coming soon" }],
  },
  {
    src: "/awards/Villain Arts Tattoo Arts Festival 2024/25.png",
    convention: "Villain Arts Tattoo Arts Festival",
    year: "2024",
    location: "Denver, Colorado",
    awards: [{ placement: "TBA", category: "Award details coming soon" }],
  },
  {
    src: "/awards/Colorado Tattoo Convention 2025/1.png",
    convention: "Colorado Tattoo Convention",
    year: "2025",
    location: "Denver, Colorado",
    awards: [{ placement: "TBA", category: "Award details coming soon" }],
  },
];

export default function Awards() {
  return (
    <section id="awards" className="pt-16 pb-10 md:pt-32 md:pb-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">

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
              <span className="gold-gradient-text" style={{ fontWeight: 400 }}>WORK</span>
            </h2>
          </div>
          <p className="text-sm text-[var(--muted)] max-w-xs leading-relaxed">
            Over 10+ awards earned across Colorado, Los Angeles, and beyond — each piece judged in open competition against the world&apos;s finest artists.
          </p>
        </motion.div>

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
              {/* Photo */}
              <div className="relative overflow-hidden" style={{ height: "400px" }}>
                <Image
                  src={entry.src}
                  alt="Award winning tattoo by Oktay"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>

              {/* Info */}
              <div className="flex flex-col p-8 md:p-12 bg-[var(--surface)] group-hover:bg-[var(--surface-2)] transition-colors duration-500">
                <div className="mb-8">
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--muted)]">Convention</p>
                    <span className="text-sm text-[var(--muted)] tabular-nums shrink-0">{entry.year}</span>
                  </div>
                  <h3
                    className="text-[clamp(1.4rem,2.8vw,2.2rem)] leading-tight text-[var(--text)]"
                    style={{ fontFamily: "var(--font-display)", fontWeight: 700, letterSpacing: "-0.02em" }}
                  >
                    {entry.convention}
                  </h3>
                  <p className="mt-1.5 text-sm text-[var(--muted)]">{entry.location}</p>
                </div>

                <div className="w-full h-px bg-[var(--border)] mb-8" />

                <div>
                  <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--muted)] mb-5">Awards</p>
                  <ul className="space-y-4">
                    {entry.awards.map((award, j) => (
                      <li key={j} className="flex items-center gap-4">
                        <span className="shrink-0 px-3 py-1 border border-[var(--gold-dim)] text-[9px] tracking-[0.2em] uppercase text-[var(--gold)] whitespace-nowrap">
                          {award.placement}
                        </span>
                        <span className="text-sm text-[var(--text)]">{award.category}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
