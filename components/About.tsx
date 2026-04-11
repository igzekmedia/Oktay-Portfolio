"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const awards = [
  { year: "2023", title: "Best Fine Line", venue: "London International Tattoo Convention" },
  { year: "2022", title: "1st Place Blackwork", venue: "Berlin Tattoo Convention" },
  { year: "2022", title: "Best of Day", venue: "Milan Tattoo Convention" },
  { year: "2021", title: "Best Geometric", venue: "Amsterdam Tattoo Convention" },
  { year: "2020", title: "Best Sleeve", venue: "Paris Tattoo Show" },
];

const stats = [
  { value: "15+", label: "Years of Practice" },
  { value: "20+", label: "International Awards" },
  { value: "10K+", label: "Clients Worldwide" },
  { value: "30+", label: "Countries Visited" },
];

export default function About() {
  return (
    <section id="about" className="py-16 md:py-32 px-6 md:px-12">
      {/* Top rule */}
      <div className="max-w-7xl mx-auto">
        <div className="w-full h-px bg-[var(--border)] mb-24" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          {/* Left — Text */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-[10px] tracking-[0.35em] uppercase text-[var(--gold)] mb-6"
            >
              The Artist
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="text-[clamp(2.5rem,4.5vw,4rem)] leading-tight text-[var(--text)] mb-4"
              style={{ fontFamily: "var(--font-display)", fontWeight: 700, letterSpacing: "-0.02em" }}
            >
              THE DETAIL
              <br />
              <span style={{ color: "var(--gold)", fontWeight: 400 }}>
                IS THE ART
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="text-[11px] tracking-[0.2em] uppercase text-[var(--gold)] mb-10"
            >
              Color Realism • Micro-Realism • Denver, CO
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-5 text-sm leading-relaxed text-[var(--muted)]"
              style={{ maxWidth: "480px" }}
            >
              <p>
                From an early age, Serdar developed a strong passion for drawing and visual arts. His curiosity about creativity and body art naturally led him into the world of tattooing. In 2015, he began his professional journey as a tattoo artist, learning the fundamentals alongside skilled mentors who shared their knowledge and techniques.
              </p>
              <p>
                Over the years, Serdar built a solid foundation in realism and micro-realism, mastering fine shading, lifelike portraiture, and meticulous detail. Today, he is increasingly focused on color realism, bringing vivid palettes, accurate skin tones, and true-to-life depth to each piece—while still offering the precision and restraint that define his black & grey and micro-realism work.
              </p>
              <p>
                Based in Denver, Colorado, Serdar continues to push creative boundaries and serve clients from across the U.S. He regularly attends tattoo conventions, collaborates with international studios, and is proud to be part of the award-winning Cleopatra Ink team.
              </p>
            </motion.div>

            <motion.a
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              href="https://www.instagram.com/serdarbolukbasi.ink/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 mt-10 text-[11px] tracking-[0.2em] uppercase text-[var(--gold)] hover:text-[var(--text)] transition-colors duration-300 cursor-pointer"
            >
              Follow the Work
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M7 17L17 7M17 7H7M17 7v10" />
              </svg>
            </motion.a>
          </div>

          {/* Right — Photo + Stats */}
          <div className="space-y-10">
            {/* Photo */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="relative w-full overflow-hidden"
              style={{ aspectRatio: "4 / 3" }}
            >
              <Image
                src="/Still 2025-09-30 100704_1.47.1.jpg"
                alt="Serdar Bolukbaşi at work"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-top"
              />
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-2 gap-px bg-[var(--border)]"
            >
              {stats.map((s) => (
                <div key={s.label} className="bg-[var(--bg)] px-6 py-8">
                  <p
                    className="text-4xl text-[var(--text)] mb-2"
                    style={{ fontFamily: "var(--font-display)", fontWeight: 300 }}
                  >
                    {s.value}
                  </p>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--muted)]">
                    {s.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
