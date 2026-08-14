"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border)] py-16 px-8 md:px-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center text-center gap-8"
        >
          {/* Name mark */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative w-[100px] h-[100px]">
              <Image
                src="/Oktay_Logo.png"
                alt="Oktay Yıldırım"
                fill
                className="object-contain"

              />
            </div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-[var(--muted)]">
              Tattoo Artist · Denver, Colorado
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-8">
            <a
              href="https://www.instagram.com/oktaytattooart"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-[var(--muted)] hover:text-[var(--gold)] transition-colors duration-300 cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
              Instagram
            </a>
            <a
              href="https://www.facebook.com/oktay.y.ld.r.m.280118/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-[var(--muted)] hover:text-[var(--gold)] transition-colors duration-300 cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
              Facebook
            </a>
            <a
              href="mailto:oktaytattooart@gmail.com"
              className="flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-[var(--muted)] hover:text-[var(--gold)] transition-colors duration-300 cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              Email
            </a>
            <button
              onClick={() => {
                const el = document.querySelector("#booking");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-[var(--gold)] hover:text-[var(--text)] transition-colors duration-300 cursor-pointer"
            >
              Book Consultation
            </button>
          </nav>
        </motion.div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-[var(--border)] flex flex-col items-center gap-5 text-center">
          <div className="flex flex-col items-center gap-2">
          <p className="text-[10px] tracking-[0.1em] text-[#5a5652]">
            © {year} Oktay Yıldırım. All rights reserved.
          </p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-3 text-[10px] tracking-[0.15em] uppercase text-[var(--muted)]">
              <Link href="/privacy-policy" className="hover:text-[var(--gold)] transition-colors duration-300">
                Privacy Policy
              </Link>
              <span aria-hidden="true" className="text-[var(--muted)]">&middot;</span>
              <Link href="/terms-and-conditions" className="hover:text-[var(--gold)] transition-colors duration-300">
                Terms and Conditions
              </Link>
            </div>
            <p className="text-[10px] tracking-[0.1em] uppercase text-[var(--muted)]">
              Designed by{" "}
              <a
                href="https://igzekmedia.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text)] hover:text-[var(--gold)] transition-colors duration-300"
              >
                IGZEK MEDIA
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
