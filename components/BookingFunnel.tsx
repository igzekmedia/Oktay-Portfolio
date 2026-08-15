"use client";

import Link from "next/link";
import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import {
  format,
  addDays,
  startOfToday,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isSameDay,
  isBefore,
  addMonths,
  subMonths,
  isToday,
} from "date-fns";

const PURPOSES = ["New Tattoo", "Cover Up", "Touch Up"];

const STYLES: { name: string; img: string; pos?: string }[] = [
  { name: "Black and Grey", img: "/portfolio/black-and-grey/1.png" },
  { name: "Realism", img: "/portfolio/color/28.png" },
  { name: "Color", img: "/portfolio/color/24.png" },
  { name: "Portraits", img: "/portfolio/black-and-grey/2.png" },
  { name: "Cover Up", img: "/portfolio/black-and-grey/9.png" },
  { name: "Other", img: "/portfolio/color/6.png", pos: "center 65%" },
];

const SIZES = [
  { key: "Small", detail: "2 to 4 inches" },
  { key: "Medium", detail: "4 to 8 inches" },
  { key: "Large", detail: "8 inches and up" },
];

const TIME_SLOTS = ["10:00 AM","11:00 AM","12:00 PM","1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM","6:00 PM"];
const DAYS = ["Mo","Tu","We","Th","Fr","Sa","Su"];

const MAX_FILES = 5;
const MAX_FILE_BYTES = 5 * 1024 * 1024;
const MAX_TOTAL_BYTES = 20 * 1024 * 1024;

const OTHER_PLACEMENT = "Other / multiple areas";

// TEMP: skip the Resend send so the confirmation page can be previewed locally.
// Set to false before shipping (and to test the real send with Resend configured).
const PREVIEW_BYPASS_SEND: boolean = false;

type Story = "" | "reference" | "idea" | "artist";

function toGCalRange(day: Date, timeStr: string) {
  const m = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!m) return null;
  let h = parseInt(m[1], 10);
  const min = m[2];
  const ap = m[3].toUpperCase();
  if (ap === "PM" && h !== 12) h += 12;
  if (ap === "AM" && h === 12) h = 0;
  const y = day.getFullYear();
  const mo = String(day.getMonth() + 1).padStart(2, "0");
  const d = String(day.getDate()).padStart(2, "0");
  const hh = String(h).padStart(2, "0");
  const eh = String((h + 1) % 24).padStart(2, "0");
  return { start: `${y}${mo}${d}T${hh}${min}00`, end: `${y}${mo}${d}T${eh}${min}00` };
}

// ── Interactive body silhouette ──────────────────────────────────────────────
function BodyMap({
  selected,
  onToggle,
}: {
  selected: string[];
  onToggle: (area: string) => void;
}) {
  const [side, setSide] = useState<"front" | "back">("front");

  const torsoRegions =
    side === "front"
      ? [
          { id: "Chest", points: "104,84 84,92 90,124 120,132 150,124 156,92 136,84" },
          { id: "Stomach", points: "90,124 120,132 150,124 146,166 120,172 94,166" },
        ]
      : [
          { id: "Upper back", points: "104,84 84,92 90,124 120,132 150,124 156,92 136,84" },
          { id: "Lower back", points: "90,124 120,132 150,124 146,166 120,172 94,166" },
        ];

  const regions = [
    { id: "Head", points: "120,20 138,32 140,54 128,70 112,70 100,54 102,32" },
    { id: "Neck", points: "110,70 130,70 134,84 106,84" },
    ...torsoRegions,
    { id: "Left upper arm", points: "74,94 84,92 86,138 72,140" },
    { id: "Right upper arm", points: "166,94 156,92 154,138 168,140" },
    { id: "Left forearm", points: "72,142 86,142 84,190 70,190" },
    { id: "Right forearm", points: "168,142 154,142 156,190 170,190" },
    { id: "Left hand", points: "70,192 84,192 82,215 72,215" },
    { id: "Right hand", points: "170,192 156,192 158,215 168,215" },
    { id: "Left thigh", points: "90,188 118,190 116,270 96,272" },
    { id: "Right thigh", points: "150,188 122,190 124,270 144,272" },
    { id: "Left calf", points: "96,274 116,272 114,340 98,342" },
    { id: "Right calf", points: "144,274 124,272 126,340 142,342" },
    { id: "Left foot", points: "98,344 114,344 112,357 94,359" },
    { id: "Right foot", points: "142,344 126,344 128,357 146,359" },
  ];

  const isSel = (id: string) => selected.includes(id);
  const fillFor = (id: string) => (isSel(id) ? "var(--gold)" : "#171717");
  const strokeFor = (id: string) => (isSel(id) ? "#e0c07e" : "#3a3a3a");

  return (
    <div>
      <div className="flex justify-center gap-2 mb-6">
        {(["front", "back"] as const).map((sd) => (
          <button
            key={sd}
            type="button"
            onClick={() => setSide(sd)}
            className="px-5 py-1.5 text-[10px] tracking-[0.2em] uppercase border transition-colors duration-200 cursor-pointer"
            style={{
              borderColor: side === sd ? "var(--gold)" : "var(--border)",
              color: side === sd ? "var(--gold)" : "var(--muted)",
            }}
          >
            {sd}
          </button>
        ))}
      </div>
      <svg viewBox="0 0 240 380" className="w-full max-w-[300px] mx-auto block h-auto">
        {/* Pelvis (decorative) */}
        <polygon points="94,166 120,172 146,166 150,188 120,196 90,188" fill="#171717" stroke="#3a3a3a" strokeWidth="1" />
        {/* Selectable faceted regions */}
        {regions.map((r) => (
          <polygon
            key={r.id}
            points={r.points}
            fill={fillFor(r.id)}
            stroke={strokeFor(r.id)}
            strokeWidth="1"
            strokeLinejoin="round"
            onClick={() => onToggle(r.id)}
            style={{ cursor: "pointer", transition: "fill 0.15s, stroke 0.15s" }}
          />
        ))}
        {/* Decorative facet lines: chest/abs on front, spine/scapula on back */}
        <g stroke="#3a3a3a" strokeWidth="0.8" fill="none" opacity="0.7" style={{ pointerEvents: "none" }}>
          {side === "front" ? (
            <>
              <line x1="120" y1="88" x2="120" y2="168" />
              <polyline points="106,88 120,100 134,88" />
              <line x1="100" y1="128" x2="120" y2="124" />
              <line x1="140" y1="128" x2="120" y2="124" />
              <line x1="110" y1="150" x2="130" y2="150" />
            </>
          ) : (
            <>
              <line x1="120" y1="86" x2="120" y2="190" />
              <line x1="106" y1="98" x2="115" y2="126" />
              <line x1="134" y1="98" x2="125" y2="126" />
              <line x1="108" y1="150" x2="120" y2="146" />
              <line x1="132" y1="150" x2="120" y2="146" />
            </>
          )}
        </g>
      </svg>
    </div>
  );
}

// ── Calendar (min 3 days out, closed Tuesdays) ───────────────────────────────
function Calendar({
  selected,
  onSelect,
  minDate,
}: {
  selected: Date | undefined;
  onSelect: (d: Date) => void;
  minDate: Date;
}) {
  const [viewMonth, setViewMonth] = useState(startOfMonth(minDate));
  const days = eachDayOfInterval({ start: startOfMonth(viewMonth), end: endOfMonth(viewMonth) });
  const firstDayOffset = (getDay(days[0]) + 6) % 7;
  const isDisabled = (d: Date) => isBefore(d, minDate) || getDay(d) === 2;

  return (
    <div className="w-full select-none">
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={() => setViewMonth(subMonths(viewMonth, 1))}
          className="w-8 h-8 flex items-center justify-center text-[var(--muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
          aria-label="Previous month"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <span
          className="text-sm tracking-[0.15em] uppercase text-[var(--text)]"
          style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
        >
          {format(viewMonth, "MMMM yyyy")}
        </span>
        <button
          type="button"
          onClick={() => setViewMonth(addMonths(viewMonth, 1))}
          className="w-8 h-8 flex items-center justify-center text-[var(--muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
          aria-label="Next month"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
      <div className="grid grid-cols-7 mb-2">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-[10px] tracking-[0.15em] uppercase text-[var(--muted)] py-1">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-1">
        {Array.from({ length: firstDayOffset }).map((_, i) => (
          <div key={`pad-${i}`} />
        ))}
        {days.map((day) => {
          const disabled = isDisabled(day);
          const isSelected = selected ? isSameDay(day, selected) : false;
          const today = isToday(day);
          return (
            <button
              key={day.toISOString()}
              type="button"
              disabled={disabled}
              onClick={() => !disabled && onSelect(day)}
              className="relative flex items-center justify-center h-9 text-sm transition-all duration-150 cursor-pointer disabled:cursor-not-allowed"
              style={{
                color: disabled ? "var(--border)" : isSelected ? "var(--bg)" : today ? "var(--gold)" : "var(--text)",
                background: isSelected ? "var(--gold)" : "transparent",
                fontWeight: isSelected ? 600 : 400,
              }}
            >
              {format(day, "d")}
              {today && !isSelected && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[var(--gold)]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Funnel ───────────────────────────────────────────────────────────────────
type Status = "idle" | "sending" | "error";

export default function BookingFunnel({ embedded = false }: { embedded?: boolean }) {
  const minDate = addDays(startOfToday(), 3);

  const [step, setStep] = useState(embedded ? 1 : 0); // 0 welcome, 1..7 steps, 8 success
  const [status, setStatus] = useState<Status>("idle");

  const [purpose, setPurpose] = useState("");
  const [style, setStyle] = useState("");
  const [story, setStory] = useState<Story>("");
  const [ideaText, setIdeaText] = useState("");
  const [referenceFiles, setReferenceFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState("");
  const [placements, setPlacements] = useState<string[]>([]);
  const [size, setSize] = useState("");
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleFiles = useCallback((incoming: FileList | null) => {
    if (!incoming) return;
    // Snapshot the FileList synchronously: the <input> onChange resets
    // e.target.value right after this call, which empties the live FileList
    // before React runs the (deferred) state updater below.
    const incomingArr = Array.from(incoming);
    if (incomingArr.length === 0) return;
    setFileError("");
    setReferenceFiles((prev) => {
      const next = [...prev];
      for (const f of incomingArr) {
        if (next.length >= MAX_FILES) {
          setFileError(`Up to ${MAX_FILES} images.`);
          break;
        }
        if (f.size > MAX_FILE_BYTES) {
          setFileError("Each image must be under 5MB.");
          continue;
        }
        if (next.some((x) => x.name === f.name && x.size === f.size)) continue;
        next.push(f);
      }
      const totalBytes = next.reduce((sum, f) => sum + f.size, 0);
      if (totalBytes > MAX_TOTAL_BYTES) {
        setFileError("Total images must be under 20MB.");
        return prev;
      }
      return next;
    });
  }, []);

  const removeFile = useCallback((idx: number) => {
    setReferenceFiles((prev) => prev.filter((_, i) => i !== idx));
    setFileError("");
  }, []);

  const previews = useMemo(
    () => referenceFiles.map((f) => ({ name: f.name, url: URL.createObjectURL(f) })),
    [referenceFiles],
  );
  useEffect(() => {
    return () => previews.forEach((p) => URL.revokeObjectURL(p.url));
  }, [previews]);

  // Embedded widget: keep each step aligned to the top of the widget so the
  // user does not have to hunt up and down as step heights change.
  const rootRef = useRef<HTMLDivElement>(null);
  const prevStepRef = useRef<number | null>(null);
  useEffect(() => {
    if (!embedded) return;
    // Only scroll on a real step change, never on mount (guards against
    // React Strict Mode's double-invoked effect scrolling the page on load).
    if (prevStepRef.current === null || prevStepRef.current === step) {
      prevStepRef.current = step;
      return;
    }
    prevStepRef.current = step;
    const target = rootRef.current?.closest("section") ?? rootRef.current;
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step, embedded]);

  const togglePlacement = useCallback((area: string) => {
    setPlacements((prev) => (prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]));
  }, []);

  const emailValid = /.+@.+\..+/.test(email);

  const canAdvance = (() => {
    switch (step) {
      case 1: return !!purpose;
      case 2: return !!style;
      case 3:
        if (story === "reference") return referenceFiles.length > 0;
        if (story === "idea") return ideaText.trim().length > 0;
        return story === "artist";
      case 4: return placements.length > 0;
      case 5: return !!size;
      case 6: return !!date && !!time;
      case 7: return name.trim().length > 0 && emailValid;
      default: return true;
    }
  })();

  const submit = async () => {
    if (!date || !time) return;
    setStatus("sending");
    if (PREVIEW_BYPASS_SEND) {
      setStatus("idle");
      setStep(8);
      return;
    }
    try {
      const description =
        story === "idea"
          ? ideaText.trim()
          : story === "reference"
          ? ideaText.trim() || `Reference image(s) provided (${referenceFiles.length}).`
          : ideaText.trim() || "Artist's choice. Open to Oktay's direction.";

      const data = new FormData();
      data.append("name", name);
      data.append("email", email);
      data.append("phone", phone);
      data.append("purpose", purpose);
      data.append("style", style);
      data.append("placement", placements.join(", "));
      data.append("size", size);
      data.append("description", description);
      data.append("appointment_date", format(date, "EEEE, MMMM d, yyyy"));
      data.append("appointment_time", time);
      const cal = toGCalRange(date, time);
      if (cal) {
        data.append("gcal_start", cal.start);
        data.append("gcal_end", cal.end);
      }
      referenceFiles.forEach((f) => data.append("reference", f));

      const res = await fetch("/api/contact", { method: "POST", body: data });
      if (!res.ok) {
        setStatus("error");
        return;
      }

      const w = window as unknown as { fbq?: (...a: unknown[]) => void };
      w.fbq?.("track", "Lead", { content_name: "Oktay booking funnel" });

      setStatus("idle");
      setStep(8);
    } catch {
      setStatus("error");
    }
  };

  const inputBase =
    "w-full bg-transparent border-b border-[var(--border)] py-3 text-base text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--gold)] transition-colors duration-200";

  const optionCard = (active: boolean) =>
    `w-full text-center px-6 py-5 border transition-all duration-200 cursor-pointer ${
      active ? "" : "hover:border-[var(--gold-dim)]"
    }`;

  return (
    <div
      ref={rootRef}
      className={
        embedded
          ? "w-full max-w-xl md:max-w-2xl mx-auto flex flex-col text-[var(--text)] scroll-mt-32"
          : "min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col"
      }
    >
      {!embedded && step === 0 ? (
        <WelcomeHero onStart={() => setStep(1)} />
      ) : (
        <>
      {/* Header */}
      <header className="px-6 pt-8 pb-4 flex flex-col items-center">
        {!embedded && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src="/Oktay_Logo.png" alt="Oktay Yildirim" className="h-20 w-auto mb-5" />
        )}
        {step >= 1 && step <= 7 && (
          <div className="flex gap-1.5 w-full max-w-sm">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="h-1 flex-1 rounded-full transition-colors duration-300"
                style={{ background: i < step ? "var(--gold)" : "var(--border)" }}
              />
            ))}
          </div>
        )}
      </header>

      <div className={`flex-1 flex flex-col px-6 py-8 mx-auto w-full ${embedded ? "justify-start max-w-xl md:max-w-2xl" : "justify-center max-w-xl"}`}>
        {/* Step 1 — Purpose */}
        {step === 1 && (
          <StepShell eyebrow="Select the purpose of your visit" title="What brings you in?">
            <div className="space-y-3">
              {PURPOSES.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPurpose(p)}
                  className={optionCard(purpose === p)}
                  style={{ borderColor: purpose === p ? "var(--gold)" : "var(--border)" }}
                >
                  <span className="text-lg" style={{ fontFamily: "var(--font-display)" }}>{p}</span>
                </button>
              ))}
            </div>
          </StepShell>
        )}

        {/* Step 2 — Style */}
        {step === 2 && (
          <StepShell eyebrow="What style are you looking for?" title="Choose a Style">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {STYLES.map((s) => (
                <button
                  key={s.name}
                  type="button"
                  onClick={() => setStyle(s.name)}
                  className="relative aspect-square overflow-hidden border transition-all duration-200 cursor-pointer"
                  style={{ borderColor: style === s.name ? "var(--gold)" : "var(--border)" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.img} alt={s.name} className="absolute inset-0 w-full h-full object-cover opacity-80" style={{ objectPosition: s.pos ?? "center" }} />
                  <span
                    className="absolute inset-x-0 bottom-0 p-3 text-left text-xs tracking-[0.15em] uppercase"
                    style={{
                      color: style === s.name ? "var(--gold)" : "#fff",
                      background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent)",
                    }}
                  >
                    {s.name}
                  </span>
                </button>
              ))}
            </div>
          </StepShell>
        )}

        {/* Step 3 — Story */}
        {step === 3 && (
          <StepShell eyebrow="Do you have a reference or idea?" title="Tell Your Story">
            <div className="space-y-3">
              {([
                ["reference", "I have reference images"],
                ["idea", "I have an idea, no image"],
                ["artist", "Artist's choice"],
              ] as const).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setStory(key)}
                  className={optionCard(story === key)}
                  style={{ borderColor: story === key ? "var(--gold)" : "var(--border)" }}
                >
                  <span className="text-base" style={{ fontFamily: "var(--font-display)" }}>{label}</span>
                </button>
              ))}

              {story === "reference" && (
                <div className="pt-2">
                  <label className="flex flex-col items-center justify-center gap-2 w-full px-6 py-8 bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--gold-dim)] transition-colors duration-200 cursor-pointer text-center">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5">
                      <path d="M12 15V3M7 8l5-5 5 5" />
                      <path d="M4 15v3a2 2 0 002 2h12a2 2 0 002-2v-3" />
                    </svg>
                    <span className="text-sm text-[var(--text)]">
                      {referenceFiles.length ? "Add more images" : "Upload reference images"}
                    </span>
                    <span className="text-xs text-[var(--muted)]">
                      {referenceFiles.length ? `${referenceFiles.length} of ${MAX_FILES} added` : "Up to 5, tap to browse"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        handleFiles(e.target.files);
                        e.target.value = "";
                      }}
                    />
                  </label>
                  {previews.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-3">
                      {previews.map((p, i) => (
                        <div key={`${p.name}-${i}`} className="relative w-16 h-16">
                          <button
                            type="button"
                            onClick={() => window.open(p.url, "_blank", "noopener,noreferrer")}
                            className="block w-16 h-16 overflow-hidden rounded-lg border border-[var(--border)] hover:border-[var(--gold-dim)] transition-colors cursor-pointer"
                            aria-label={`Open ${p.name}`}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeFile(i)}
                            className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center rounded-full bg-[var(--bg)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--gold)] transition-colors cursor-pointer"
                            aria-label={`Remove ${p.name}`}
                          >
                            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {fileError && <p className="mt-2 text-xs text-red-400">{fileError}</p>}
                  <textarea
                    value={ideaText}
                    onChange={(e) => setIdeaText(e.target.value)}
                    rows={3}
                    placeholder="Anything else about the idea (optional)"
                    className={`${inputBase} resize-none mt-4`}
                  />
                </div>
              )}

              {story === "idea" && (
                <textarea
                  value={ideaText}
                  onChange={(e) => setIdeaText(e.target.value)}
                  rows={4}
                  placeholder="Describe your idea in detail"
                  className={`${inputBase} resize-none mt-2`}
                />
              )}
            </div>
          </StepShell>
        )}

        {/* Step 4 — Placement */}
        {step === 4 && (
          <StepShell eyebrow="Tap to select all desired areas" title="Placement">
            <BodyMap selected={placements} onToggle={togglePlacement} />
            <button
              type="button"
              onClick={() => togglePlacement(OTHER_PLACEMENT)}
              className="mt-5 w-full py-3 text-[10px] tracking-[0.2em] uppercase border transition-colors cursor-pointer"
              style={{
                borderColor: placements.includes(OTHER_PLACEMENT) ? "var(--gold)" : "var(--border)",
                color: placements.includes(OTHER_PLACEMENT) ? "var(--gold)" : "var(--muted)",
              }}
            >
              Other / multiple areas
            </button>
            {placements.length > 0 && (
              <div className="mt-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-[var(--gold)]">
                    Selected ({placements.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => setPlacements([])}
                    className="text-[10px] tracking-[0.15em] uppercase text-[var(--muted)] hover:text-[var(--gold)] transition-colors cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {placements.map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => togglePlacement(a)}
                      className="px-3 py-1.5 text-[11px] tracking-[0.1em] uppercase border border-[var(--gold-dim)] text-[var(--gold)] flex items-center gap-2 cursor-pointer"
                    >
                      {a}
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </StepShell>
        )}

        {/* Step 5 — Size */}
        {step === 5 && (
          <StepShell eyebrow="Scale of your project" title="Dimensions">
            <div className="space-y-3">
              {SIZES.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setSize(s.key)}
                  className={optionCard(size === s.key)}
                  style={{ borderColor: size === s.key ? "var(--gold)" : "var(--border)" }}
                >
                  <span className="text-lg" style={{ fontFamily: "var(--font-display)" }}>{s.key}</span>
                  <span className="block text-xs text-[var(--muted)] mt-1">{s.detail}</span>
                </button>
              ))}
            </div>
          </StepShell>
        )}

        {/* Step 6 — Date & Time */}
        {step === 6 && (
          <StepShell eyebrow="For your consultation" title="Pick a Date & Time">
            <div className="border border-[var(--border)] p-5">
              <Calendar selected={date} onSelect={setDate} minDate={minDate} />
            </div>
            {date && (
              <p className="mt-3 text-xs text-[var(--gold)] tracking-wide">
                {format(date, "EEEE, MMMM d, yyyy")}
              </p>
            )}
            <p className="mt-3 text-[11px] tracking-[0.2em] uppercase text-[var(--muted)] mb-3">Preferred time</p>
            <div className="grid grid-cols-3 gap-2">
              {TIME_SLOTS.map((slot) => {
                const active = time === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setTime(slot)}
                    className="py-2.5 text-xs tracking-widest border transition-all duration-150 cursor-pointer"
                    style={{
                      borderColor: active ? "var(--gold)" : "var(--border)",
                      color: active ? "var(--gold)" : "var(--muted)",
                      background: active ? "rgba(200,164,110,0.08)" : "transparent",
                    }}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
            <p className="mt-5 text-xs text-[var(--muted)] leading-relaxed border-l-2 border-[var(--border)] pl-4">
              Consultations run every day except Tuesday, 10:00 AM to 6:00 PM Mountain Time (Denver).
              Minimum 3 days notice. Your consultation is confirmed personally within 48 hours.
            </p>
          </StepShell>
        )}

        {/* Step 7 — Contact */}
        {step === 7 && (
          <StepShell eyebrow="Secure your session" title="Your Contact Info">
            <div className="space-y-6">
              <input type="text" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} className={inputBase} autoComplete="name" />
              <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className={inputBase} autoComplete="email" />
              <input type="tel" placeholder="Phone (optional)" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputBase} autoComplete="tel" />
            </div>
            {status === "error" && (
              <p className="mt-5 text-sm text-red-400">
                Something went wrong. Email directly:{" "}
                <a href="mailto:oktaytattooart@gmail.com" className="underline">oktaytattooart@gmail.com</a>
              </p>
            )}
          </StepShell>
        )}

        {/* Step 8 — Success */}
        {step === 8 && (
          <div className="text-center">
            <div className="w-14 h-14 mx-auto mb-6 rounded-full border border-[var(--gold-dim)] flex items-center justify-center">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h2
              className="text-[clamp(1.75rem,5vw,2.5rem)] mb-4"
              style={{ fontFamily: "var(--font-display)", fontWeight: 800, letterSpacing: "-0.02em" }}
            >
              Request received
            </h2>
            <p className="text-sm text-[var(--muted)] max-w-sm mx-auto leading-relaxed">
              Thanks{name ? `, ${name.split(" ")[0]}` : ""}. Your consultation request is in. You will get a
              confirmation email shortly, and the team will be in touch within 48 hours to confirm your consultation.
            </p>
            {!embedded && (
              <div className="mt-10 flex flex-col items-center gap-3 w-full max-w-xs mx-auto">
                <a
                  href="https://instagram.com/oktaytattooart"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-4 text-[11px] tracking-[0.25em] uppercase cursor-pointer"
                  style={{ background: "var(--gold)", color: "var(--bg)", fontWeight: 600 }}
                >
                  Follow Oktay on Instagram
                </a>
                <Link
                  href="/"
                  className="block w-full py-4 text-[11px] tracking-[0.25em] uppercase border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)] hover:border-[var(--gold-dim)] transition-colors cursor-pointer"
                >
                  Back to Site
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer nav */}
      {step >= 1 && step <= 7 && (
        <footer className={`px-6 pb-10 pt-2 mx-auto w-full flex items-center gap-4 ${embedded ? "max-w-xl md:max-w-2xl" : "max-w-xl"}`}>
          {!(embedded && step === 1) && (
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              className="w-12 h-12 flex items-center justify-center rounded-full border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)] transition-colors cursor-pointer shrink-0"
              aria-label="Back"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          {step < 7 ? (
            <button
              type="button"
              disabled={!canAdvance}
              onClick={() => setStep((s) => s + 1)}
              className="flex-1 py-4 text-[11px] tracking-[0.25em] uppercase transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
              style={{
                background: canAdvance ? "var(--gold)" : "var(--border)",
                color: canAdvance ? "var(--bg)" : "var(--muted)",
                fontWeight: 600,
              }}
            >
              Next Step
            </button>
          ) : (
            <button
              type="button"
              disabled={!canAdvance || status === "sending"}
              onClick={submit}
              className="flex-1 py-4 text-[11px] tracking-[0.25em] uppercase transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
              style={{
                background: canAdvance && status !== "sending" ? "var(--gold)" : "var(--border)",
                color: canAdvance && status !== "sending" ? "var(--bg)" : "var(--muted)",
                fontWeight: 600,
              }}
            >
              {status === "sending" ? "Sending…" : "Finalize My Booking"}
            </button>
          )}
        </footer>
      )}
        </>
      )}
    </div>
  );
}

function WelcomeHero({ onStart }: { onStart: () => void }) {
  return (
    <section className="relative min-h-screen flex flex-col items-center overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/Oktay-Mobile-Hero.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center 8%",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(9,9,9,0.9) 0%, rgba(9,9,9,0.35) 30%, rgba(9,9,9,0.55) 62%, rgba(9,9,9,0.98) 88%, rgba(9,9,9,1) 100%)",
        }}
      />
      {/* Nav bar */}
      <nav className="relative z-20 w-full flex items-center justify-center pt-8 pb-5">
        <Link href="/" aria-label="Oktay Yildirim, back to site">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/Oktay_Logo.png" alt="Oktay Yildirim" className="h-20 w-auto" />
        </Link>
      </nav>
      {/* Centered content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6">
        <h1
          className="text-[clamp(2.5rem,8vw,4rem)] leading-[1.05] mb-5 uppercase"
          style={{ fontFamily: "var(--font-display)", fontWeight: 800, letterSpacing: "-0.01em" }}
        >
          Book with <span className="gold-gradient-text">Oktay</span>
        </h1>
        <p
          className="text-[11px] tracking-[0.3em] uppercase mb-12"
          style={{ color: "rgba(237,232,227,0.72)" }}
        >
          International Award Winning Tattoo Artist
        </p>
        <button
          type="button"
          onClick={onStart}
          className="px-14 py-4 text-[11px] tracking-[0.25em] uppercase cursor-pointer"
          style={{ background: "var(--gold)", color: "var(--bg)", fontWeight: 600 }}
        >
          Start Your Journey
        </button>
      </div>
    </section>
  );
}

function StepShell({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-center mb-8">
        <h2
          className="text-[clamp(1.9rem,5.5vw,2.75rem)] leading-tight mb-2"
          style={{ fontFamily: "var(--font-display)", fontWeight: 800, letterSpacing: "-0.02em" }}
        >
          {title}
        </h2>
        <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--muted)]">{eyebrow}</p>
      </div>
      {children}
    </div>
  );
}
