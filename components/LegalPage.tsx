import Link from "next/link";

export interface LegalSection {
  heading: string;
  body: string[];
}

export default function LegalPage({
  title,
  lastUpdated,
  intro,
  sections,
}: {
  title: string;
  lastUpdated: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <header className="flex items-center justify-between px-5 sm:px-8 md:px-12 py-6 border-b border-[var(--border)]">
        <Link
          href="/"
          className="uppercase text-[var(--text)]"
          style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "16px", letterSpacing: "0.05em" }}
        >
          Oktay Yildirim
        </Link>
        <Link
          href="/"
          className="text-[11px] tracking-[0.15em] uppercase text-[var(--muted)] hover:text-[var(--gold)] transition-colors duration-300"
        >
          Back to site
        </Link>
      </header>

      <article className="max-w-3xl mx-auto px-5 sm:px-8 md:px-12 py-16 sm:py-24">
        <h1
          className="uppercase leading-[0.95] text-[var(--text)]"
          style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(2rem, 6vw, 4rem)", letterSpacing: "-0.03em" }}
        >
          {title}
        </h1>
        <p className="mt-4 text-[12px] tracking-[0.15em] uppercase text-[var(--muted)]">
          Last updated: {lastUpdated}
        </p>

        <p className="mt-10 text-[15px] sm:text-base leading-[1.7] text-[var(--muted)]">{intro}</p>

        <div className="mt-12 space-y-10">
          {sections.map((s) => (
            <section key={s.heading}>
              <h2
                className="uppercase text-[var(--text)]"
                style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(1.05rem, 2.2vw, 1.4rem)", letterSpacing: "-0.01em" }}
              >
                {s.heading}
              </h2>
              <div className="mt-4 space-y-4">
                {s.body.map((p, i) => (
                  <p key={i} className="text-[15px] sm:text-base leading-[1.7] text-[var(--muted)]">
                    {p}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-[var(--border)]">
          <Link
            href="/"
            className="inline-flex items-center gap-2 border border-[var(--gold-dim)] text-[var(--gold)] px-7 py-4 text-[11px] tracking-[0.2em] uppercase hover:bg-[var(--gold)] hover:text-[var(--bg)] transition-colors duration-300"
          >
            Back to Oktay Yildirim
          </Link>
        </div>
      </article>
    </main>
  );
}
