"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const works = [
  // ── TOP 6 — array order controls visual layout in 3-col masonry:
  //    arr[1]=col1-top  arr[2]=col1-bot  arr[3]=col2-top
  //    arr[4]=col2-bot  arr[5]=col3-top  arr[6]=col3-bot
  { id: 18, src: "/blackwork/IMG_5103.JPG",  alt: "Tattoo by Serdar Bolukbaşi", category: "blackwork", w: 3024, h: 4032 }, // col1-top: bike
  { id: 14, src: "/realism/21.png",          alt: "Tattoo by Serdar Bolukbaşi", category: "realism",   w: 1080, h: 1350 }, // col1-bot: horse
  { id: 4,  src: "/color/SnapInsta.to_375145342_835218171650416_6824207980199041988_n.jpg", alt: "Tattoo by Serdar Bolukbaşi", category: "color", w: 1440, h: 1800 }, // col2-top: joker
  { id: 19, src: "/blackwork/IMG_5109.jpg",  alt: "Tattoo by Serdar Bolukbaşi", category: "blackwork", w: 4284, h: 5712 }, // col2-bot: sword
  { id: 26, src: "/realism/23.png",          alt: "Tattoo by Serdar Bolukbaşi", category: "realism",   w: 1080, h: 1350 }, // col3-top: peaky blinders
  { id: 21, src: "/blackwork/20.png",         alt: "Tattoo by Serdar Bolukbaşi", category: "blackwork", w: 1080, h: 1350 }, // col3-bot: face
  // ── rest of portfolio ────────────────────────────────────────────────────
  // color
  { id: 1,  src: "/color/IMG_2213.JPG",    alt: "Tattoo by Serdar Bolukbaşi", category: "color",        w: 1080, h: 1350, excludeFromAll: true },
  { id: 2,  src: "/color/IMG_3203.jpg",    alt: "Tattoo by Serdar Bolukbaşi", category: "color",        w: 5712, h: 4284, excludeFromAll: true },
  { id: 3,  src: "/color/IMG_5322.JPG",    alt: "Tattoo by Serdar Bolukbaşi", category: "color",        w: 4284, h: 5712, excludeFromAll: true },
  { id: 5,  src: "/color/SnapInsta.to_520569583_18514216570028898_4657283457264374493_n.jpg", alt: "Tattoo by Serdar Bolukbaşi", category: "color", w: 1080, h: 1440 },
  { id: 6,  src: "/color/7.png",           alt: "Tattoo by Serdar Bolukbaşi", category: "color",        w: 1080, h: 1350 },
  { id: 7,  src: "/color/8.png",           alt: "Tattoo by Serdar Bolukbaşi", category: "color",        w: 1080, h: 1350 },
  { id: 8,  src: "/color/13.png",          alt: "Tattoo by Serdar Bolukbaşi", category: "color",        w: 1080, h: 1350 },
  { id: 9,  src: "/color/22.png",          alt: "Tattoo by Serdar Bolukbaşi", category: "color",        w: 1080, h: 1350 },
  // surrealism
  { id: 27, src: "/surrealism/1.JPG",      alt: "Tattoo by Serdar Bolukbaşi", category: "surrealism",   w: 1080, h: 1350 },
  // realism
  { id: 10, src: "/realism/IMG_3276.jpg",  alt: "Tattoo by Serdar Bolukbaşi", category: "realism",      w: 5712, h: 4284 },
  { id: 12, src: "/realism/11.png",        alt: "Tattoo by Serdar Bolukbaşi", category: "realism",      w: 1080, h: 1350 },
  { id: 13, src: "/realism/16.png",        alt: "Tattoo by Serdar Bolukbaşi", category: "realism",      w: 1080, h: 1350 },
  // micro-realism
  { id: 15, src: "/micro-realism/IMG_2467.JPG", alt: "Tattoo by Serdar Bolukbaşi", category: "micro-realism", w: 4284, h: 5712 },
  { id: 16, src: "/micro-realism/14.png",  alt: "Tattoo by Serdar Bolukbaşi", category: "micro-realism", w: 1080, h: 1350 },
  { id: 17, src: "/micro-realism/15.png",  alt: "Tattoo by Serdar Bolukbaşi", category: "micro-realism", w: 1080, h: 1350 },
  // blackwork
  { id: 20, src: "/blackwork/19.png",      alt: "Tattoo by Serdar Bolukbaşi", category: "blackwork",    w: 1080, h: 1350 },
  { id: 21, src: "/blackwork/20.png",      alt: "Tattoo by Serdar Bolukbaşi", category: "blackwork",    w: 1080, h: 1350 },
  // geometric
  { id: 22, src: "/geometric/12.png",      alt: "Tattoo by Serdar Bolukbaşi", category: "geometric",    w: 1080, h: 1350 },
  // botanical
  { id: 23, src: "/botanical/18.png",      alt: "Tattoo by Serdar Bolukbaşi", category: "botanical",    w: 1080, h: 1350 },
  // anime
  { id: 24, src: "/anime/9.png",           alt: "Tattoo by Serdar Bolukbaşi", category: "anime",        w: 1080, h: 1350 },
  { id: 25, src: "/anime/17.png",          alt: "Tattoo by Serdar Bolukbaşi", category: "anime",        w: 1080, h: 1350 },
];

const categories = ["all", "color", "realism", "micro-realism", "surrealism", "blackwork", "geometric", "botanical", "anime"];

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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8"
        >
          <div>
            <p className="text-[10px] tracking-[0.35em] uppercase text-[var(--gold)] mb-4">
              Selected Works
            </p>
            <h2
              className="text-[clamp(2.5rem,5vw,4.5rem)] leading-none text-[var(--text)]"
              style={{ fontFamily: "var(--font-display)", fontWeight: 800, letterSpacing: "-0.03em" }}
            >
              THE ART
            </h2>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-6 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className="text-[10px] tracking-[0.2em] uppercase transition-colors duration-200 cursor-pointer pb-0.5"
                style={{
                  color: active === cat ? "var(--gold)" : "var(--muted)",
                  borderBottom: active === cat ? "1px solid var(--gold)" : "1px solid transparent",
                }}
              >
                {cat === "all" ? "All" : cat.replace("-", " ")}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Masonry grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-3 space-y-3">
          <AnimatePresence mode="popLayout">
            {displayed.map((work, i) => (
              <motion.div
                key={work.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, delay: i * 0.03 }}
                className="relative group overflow-hidden break-inside-avoid cursor-pointer"
                style={{ aspectRatio: `${work.w} / ${work.h}` }}
              >
                <Image
                  src={work.src}
                  alt={work.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-[var(--bg)] opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <span className="text-[9px] tracking-[0.25em] uppercase text-[var(--gold)]">
                    {work.category.replace("-", " ")}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Show More — All tab only */}
        {isTruncated && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-10 text-center"
          >
            <button
              onClick={() => setShowAll(true)}
              className="inline-flex items-center gap-3 text-[11px] tracking-[0.25em] uppercase text-[var(--muted)] hover:text-[var(--gold)] transition-colors duration-300 cursor-pointer border border-current px-6 py-3"
            >
              Show More
            </button>
          </motion.div>
        )}

        {/* Instagram CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16 text-center"
        >
          <a
            href="https://www.instagram.com/serdarbolukbasi.ink/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 text-[11px] tracking-[0.25em] uppercase text-[var(--muted)] hover:text-[var(--gold)] transition-colors duration-300 cursor-pointer"
          >
            <span className="block w-8 h-px bg-current" />
            View Full Portfolio on Instagram
            <span className="block w-8 h-px bg-current" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
