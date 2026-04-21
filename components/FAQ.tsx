"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    q: "How do I book a tattoo appointment with Oktay?",
    a: "You can book an appointment by contacting Oktay directly through Instagram, email, or the booking form on this website. We recommend booking in advance, as his schedule in Denver and during guest spots fills up quickly.",
  },
  {
    q: "Do I need to pay a deposit?",
    a: "Yes, a deposit is required to secure your appointment. The deposit goes toward the final cost of your tattoo and ensures your spot in Oktay's schedule. Deposits are non-refundable but transferable if you reschedule in advance.",
  },
  {
    q: "How much does a tattoo cost?",
    a: "Tattoo pricing depends on size, placement, and detail. Black & grey realism and micro-realism tattoos are highly detailed and may require multiple sessions. Oktay will provide a price estimate during your consultation.",
  },
  {
    q: "Can I bring my own design idea?",
    a: "Absolutely. You can bring reference photos, sketches, or any inspiration you have. Oktay specializes in custom designs and will adapt your idea into a unique piece of art that fits your vision and body placement.",
  },
  {
    q: "Does getting a tattoo hurt?",
    a: "Pain levels vary depending on the location and size of the tattoo. Most clients describe the feeling as uncomfortable but manageable. Oktay works with care and patience to make the process as comfortable as possible.",
  },
  {
    q: "How should I prepare for my tattoo session?",
    a: "Get a good night's sleep, eat a full meal before your appointment, and stay hydrated. Avoid alcohol or blood-thinning substances 24 hours before your session. Wear comfortable clothing that allows easy access to the area being tattooed.",
  },
  {
    q: "How long does a tattoo session take?",
    a: "Session length depends on the size and complexity of the tattoo. Small tattoos may take 1–2 hours, while large black & grey realism pieces can require several sessions. Oktay will provide an estimated timeline during your consultation.",
  },
  {
    q: "How do I take care of my tattoo afterward?",
    a: "Oktay provides detailed aftercare instructions to ensure proper healing. Generally, you'll need to keep the area clean, moisturized, and protected from direct sunlight. Avoid swimming, tanning, and intense physical activity until the tattoo heals.",
  },
  {
    q: "Can I get tattooed if it's my first time?",
    a: "Yes! Many of Oktay's clients are first-timers. He will guide you through the process step by step, answer all your questions, and make sure you feel comfortable throughout your tattoo journey.",
  },
  {
    q: "Does Oktay do cover-ups or touch-ups?",
    a: "Yes, Oktay offers both cover-ups and touch-ups, depending on the condition of the old tattoo and the design you want. During the consultation, he will evaluate the possibilities and create a custom plan for your new piece.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-16 md:py-32 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <p className="text-[10px] tracking-[0.35em] uppercase text-[var(--gold)] mb-4">
              Got Questions
            </p>
            <h2
              className="text-[clamp(2.5rem,5vw,4.5rem)] leading-none text-[var(--text)]"
              style={{ fontFamily: "var(--font-display)", fontWeight: 800, letterSpacing: "-0.03em" }}
            >
              FREQUENTLY
              <br />
              <span className="gold-gradient-text" style={{ fontWeight: 400 }}>ASKED</span>
            </h2>
          </div>
          <p className="text-sm text-[var(--muted)] max-w-xs leading-relaxed">
            Everything you need to know before booking your appointment.
          </p>
        </motion.div>

        {/* Accordion */}
        <div className="divide-y divide-[var(--border)]">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.04 }}
            >
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-8 py-6 text-left cursor-pointer group"
              >
                <span
                  className="text-sm md:text-base text-[var(--text)] group-hover:text-[var(--gold)] transition-colors duration-200"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 600, letterSpacing: "-0.01em" }}
                >
                  {faq.q}
                </span>
                <span
                  className="shrink-0 w-6 h-6 flex items-center justify-center border border-[var(--border)] group-hover:border-[var(--gold-dim)] transition-all duration-300"
                  style={{ transform: open === i ? "rotate(45deg)" : "rotate(0deg)", transition: "transform 0.3s ease, border-color 0.2s" }}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M5 1v8M1 5h8" />
                  </svg>
                </span>
              </button>

              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="pb-6 text-sm leading-relaxed text-[var(--muted)] max-w-3xl">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
