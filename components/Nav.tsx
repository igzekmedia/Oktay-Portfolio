"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { label: "Work", href: "#portfolio" },
  { label: "Awards", href: "#awards" },
  { label: "About", href: "#about" },
  { label: "FAQ", href: "#faq" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileHidden, setMobileHidden] = useState(false);
  const lastScrollY = useRef(0);
  const isMobile = useRef(false);

  useEffect(() => {
    isMobile.current = window.innerWidth < 768;

    const onResize = () => {
      isMobile.current = window.innerWidth < 768;
    };

    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 60);

      if (isMobile.current) {
        if (y > 80) {
          setMobileHidden(y > lastScrollY.current);
        } else {
          setMobileHidden(false);
        }
      }
      lastScrollY.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const handleLink = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: mobileHidden ? "-110%" : 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 md:px-12"
        style={{
          background: scrolled ? "rgba(9,9,9,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid #1a1a1a" : "none",
          transition: "background 0.4s, backdrop-filter 0.4s, border-color 0.4s",
        }}
      >
        <a
          href="#hero"
          onClick={(e) => { e.preventDefault(); handleLink("#hero"); }}
          className="relative block w-[110px] h-[110px] cursor-pointer opacity-90 hover:opacity-100 transition-opacity duration-300"
          aria-label="Oktay Yıldırım — home"
        >
          <Image
            src="/Oktay_Logo.png"
            alt="Oktay Yıldırım"
            fill
            className="object-contain"
          />
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <button
              key={l.href}
              onClick={() => handleLink(l.href)}
              className="text-[11px] tracking-[0.2em] uppercase text-[var(--muted)] hover:text-[var(--text)] transition-colors duration-300 cursor-pointer"
            >
              {l.label}
            </button>
          ))}
          <button
            onClick={() => handleLink("#booking")}
            className="text-[11px] tracking-[0.2em] uppercase px-5 py-2 border border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-[var(--bg)] transition-all duration-300 cursor-pointer"
          >
            Inquire
          </button>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 cursor-pointer p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className="block w-6 h-px bg-[var(--text)] transition-all duration-300"
            style={{ transform: menuOpen ? "rotate(45deg) translateY(4px)" : "" }}
          />
          <span
            className="block w-6 h-px bg-[var(--text)] transition-all duration-300"
            style={{ opacity: menuOpen ? 0 : 1 }}
          />
          <span
            className="block w-6 h-px bg-[var(--text)] transition-all duration-300"
            style={{ transform: menuOpen ? "rotate(-45deg) translateY(-4px)" : "" }}
          />
        </button>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[var(--bg)] flex flex-col items-center justify-center gap-10"
          >
            {links.map((l, i) => (
              <motion.button
                key={l.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => handleLink(l.href)}
                className="font-display text-4xl font-light tracking-wide text-[var(--text)] hover:text-[var(--gold)] transition-colors duration-300 cursor-pointer"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {l.label}
              </motion.button>
            ))}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28 }}
              onClick={() => handleLink("#booking")}
              className="mt-4 text-[11px] tracking-[0.2em] uppercase px-8 py-3 border border-[var(--gold)] text-[var(--gold)] cursor-pointer"
            >
              Book Appointment
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
