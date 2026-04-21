"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const works = [
  // ── Featured order (All tab preview) ────────────────────────────────────
  { id: 1,  src: "/portfolio/black-and-grey/2.png",  alt: "Tattoo by Oktay", category: "black-and-grey", w: 1080, h: 1350 }, // Featured 1
  { id: 2,  src: "/portfolio/color/14.png",           alt: "Tattoo by Oktay", category: "color",          w: 1080, h: 1350 }, // Featured 2
  { id: 3,  src: "/portfolio/black-and-grey/21.png", alt: "Tattoo by Oktay", category: "black-and-grey", w: 1080, h: 1350 }, // Featured 3 — Portrait
  { id: 4,  src: "/portfolio/color/6.png",            alt: "Tattoo by Oktay", category: "color",          w: 1080, h: 1350 }, // Featured 4 — Award-Winning
  { id: 5,  src: "/portfolio/black-and-grey/5.png",  alt: "Tattoo by Oktay", category: "black-and-grey", w: 1080, h: 1350 }, // Featured 5
  { id: 6,  src: "/portfolio/color/7.png",            alt: "Tattoo by Oktay", category: "color",          w: 1080, h: 1350 }, // Featured 6
  // ── Award-Winning — excluded from All, visible in category tabs ──────────
  { id: 7,  src: "/portfolio/black-and-grey/1.png",  alt: "Tattoo by Oktay", category: "black-and-grey", w: 1080, h: 1350, excludeFromAll: true },
  // ── Rest of portfolio ────────────────────────────────────────────────────
  { id: 8,  src: "/portfolio/black-and-grey/4.png",  alt: "Tattoo by Oktay", category: "black-and-grey", w: 1080, h: 1350 },
  { id: 9,  src: "/portfolio/black-and-grey/5.png",  alt: "Tattoo by Oktay", category: "black-and-grey", w: 1080, h: 1350 },
  { id: 10, src: "/portfolio/black-and-grey/8.png",  alt: "Tattoo by Oktay", category: "black-and-grey", w: 1080, h: 1350 },
  { id: 11, src: "/portfolio/black-and-grey/9.png",  alt: "Tattoo by Oktay", category: "black-and-grey", w: 1080, h: 1350 },
  { id: 12, src: "/portfolio/black-and-grey/11.png", alt: "Tattoo by Oktay", category: "black-and-grey", w: 1080, h: 1350 },
  { id: 13, src: "/portfolio/black-and-grey/12.png", alt: "Tattoo by Oktay", category: "black-and-grey", w: 1080, h: 1350 },
  { id: 14, src: "/portfolio/black-and-grey/16.png", alt: "Tattoo by Oktay", category: "black-and-grey", w: 1080, h: 1350 },
  { id: 15, src: "/portfolio/black-and-grey/17.png", alt: "Tattoo by Oktay", category: "black-and-grey", w: 1080, h: 1350 },
  { id: 16, src: "/portfolio/color/10.png",           alt: "Tattoo by Oktay", category: "color",          w: 1080, h: 1350 },
  { id: 17, src: "/portfolio/color/13.png",           alt: "Tattoo by Oktay", category: "color",          w: 1080, h: 1350 },
  { id: 18, src: "/portfolio/color/15.png",           alt: "Tattoo by Oktay", category: "color",          w: 1080, h: 1350 },
  { id: 19, src: "/portfolio/color/18.png",           alt: "Tattoo by Oktay", category: "color",          w: 1080, h: 1350 },
  { id: 20, src: "/portfolio/color/19.png",           alt: "Tattoo by Oktay", category: "color",          w: 1080, h: 1350 },
  { id: 21, src: "/portfolio/color/20.png",           alt: "Tattoo by Oktay", category: "color",          w: 1080, h: 1350 },
];

const categories = ["all", "black-and-grey", "color"];

export default function Portfolio() {
  const [active, setActive] = useState("all");
  const [showAll, setShowAll] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const filtered = active === "all"
    ? works.filter((w) => !w.excludeFromAll)
    : works.filter((w) => w.category === active);

  const limit = isMobile ? 4 : 6;
  const isTruncated = active === "all" && !showAll && filtered.length > limit;
  const displayed = isTruncated ? filtered.slice(0, limit) : filtered;

  const handleCategoryChange = (cat: string) => {
    setActive(cat);
    setShowAll(false);
  };

  return (
    <section id="portfolio" className="py-16 md:py-32 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <p className="text-[10px] tracking-[0.35em] uppercase text-[var(--gold)] mb-4">Portfolio</p>
            <h2
              className="text-[clamp(2.5rem,5vw,4.5rem)] leading-none text-[var(--text)]"
              style={{ fontFamily: "var(--font-display)", fontWeight: 800, letterSpacing: "-0.03em" }}
            >
              THE WORK
            </h2>
          </div>
        </motion.div>

        <div className="flex flex-wrap gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-5 py-2 text-[10px] tracking-[0.25em] uppercase transition-all duration-300 cursor-pointer border ${
                active === cat
                  ? "bg-[var(--gold)] text-[var(--bg)] border-[var(--gold)]"
                  : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--gold-dim)] hover:text-[var(--text)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="columns-2 md:columns-3 gap-3 md:gap-4"
          >
            {displayed.map((work) => (
              <motion.div
                key={work.id}
                layout
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.4 }}
                className="mb-3 md:mb-4 break-inside-avoid overflow-hidden group cursor-pointer"
              >
                <div className="relative overflow-hidden" style={{ aspectRatio: `${work.w} / ${work.h}` }}>
                  <Image
                    src={work.src}
                    alt={work.alt}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {isTruncated && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-12 text-center"
          >
            <button
              onClick={() => setShowAll(true)}
              className="px-12 py-3.5 border border-[var(--border)] text-[11px] tracking-[0.25em] uppercase text-[var(--muted)] hover:border-[var(--gold-dim)] hover:text-[var(--text)] transition-all duration-300 cursor-pointer"
            >
              Show More
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
