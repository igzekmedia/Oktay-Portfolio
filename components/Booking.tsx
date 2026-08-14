"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
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


type Status = "idle" | "sending" | "success" | "error";

const TIME_SLOTS = ["10:00 AM","11:00 AM","12:00 PM","1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM","6:00 PM"];
const TATTOO_STYLES = ["Black and Grey","Color","Realism","Portraits","Cover Ups","Other"];
const DAYS = ["Mo","Tu","We","Th","Fr","Sa","Su"];

const MAX_FILES = 5;
const MAX_FILE_BYTES = 5 * 1024 * 1024;
const MAX_TOTAL_BYTES = 20 * 1024 * 1024;

// Build a Google Calendar wall-clock range (interpreted in America/Denver).
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

// ─── Custom Calendar ──────────────────────────────────────────────────────────
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

  // Monday-first offset (0=Mo … 6=Su)
  const firstDayOffset = (getDay(days[0]) + 6) % 7;

  const isDisabled = (d: Date) => isBefore(d, minDate) || getDay(d) === 2; // no Tuesdays

  return (
    <div className="w-full select-none">
      {/* Month nav */}
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

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-[10px] tracking-[0.15em] uppercase text-[var(--muted)] py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-y-1">
        {/* Offset empty cells */}
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
                color: disabled
                  ? "var(--border)"
                  : isSelected
                  ? "var(--bg)"
                  : today
                  ? "var(--gold)"
                  : "var(--text)",
                background: isSelected ? "var(--gold)" : "transparent",
                fontWeight: isSelected ? 600 : 400,
              }}
              onMouseEnter={(e) => {
                if (!disabled && !isSelected)
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(200,164,110,0.1)";
              }}
              onMouseLeave={(e) => {
                if (!isSelected)
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
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
// ─────────────────────────────────────────────────────────────────────────────

export default function Booking() {
  const minDate = addDays(startOfToday(), 3);

  const [selected, setSelected] = useState<Date | undefined>();
  const [time, setTime] = useState("");
  const [form, setForm] = useState({
    name: "", email: "", phone: "", style: "",
    placement: "", size: "", description: "",
  });
  const [referenceFiles, setReferenceFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleFiles = useCallback((incoming: FileList | null) => {
    if (!incoming) return;
    setFileError("");
    setReferenceFiles((prev) => {
      const next = [...prev];
      for (const f of Array.from(incoming)) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected || !time) return;
    setStatus("sending");

    try {
      const data = new FormData();
      data.append("name", form.name);
      data.append("email", form.email);
      data.append("phone", form.phone);
      data.append("style", form.style);
      data.append("placement", form.placement);
      data.append("size", form.size);
      data.append("description", form.description);
      data.append("appointment_date", format(selected, "EEEE, MMMM d, yyyy"));
      data.append("appointment_time", time);
      const cal = toGCalRange(selected, time);
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

      setStatus("success");
      setSelected(undefined);
      setTime("");
      setForm({ name:"", email:"", phone:"", style:"", placement:"", size:"", description:"" });
      setReferenceFiles([]);
      setFileError("");
    } catch (err) {
      console.error("Booking submission error:", err);
      setStatus("error");
    }
  };

  const inputBase =
    "w-full bg-transparent border-b border-[var(--border)] py-3 text-sm text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--gold)] transition-colors duration-200";

  const isValid = form.name && form.email && form.description && selected && time;

  return (
    <section id="booking" className="py-16 md:py-32 px-6 md:px-12 bg-[var(--surface)]">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-20">
          <p className="text-[10px] tracking-[0.35em] uppercase text-[var(--gold)] mb-4">
            Start the Process
          </p>
          <h2
            className="text-[clamp(2.5rem,5vw,4.5rem)] leading-none text-[var(--text)]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 800, letterSpacing: "-0.03em" }}
          >
            BOOK A SESSION
          </h2>
          <p className="mt-5 text-sm text-[var(--muted)] max-w-md leading-relaxed">
            All bookings are reviewed personally. You&apos;ll receive a confirmation
            within 48 hours. Please provide as much detail as possible.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24">

            {/* ── Left: personal + tattoo details ── */}
            <div className="space-y-10">
              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--muted)] mb-6">Your Details</p>
                <div className="space-y-6">
                  <input type="text"  name="name"  required placeholder="Full Name *"       value={form.name}  onChange={handleChange} className={inputBase} autoComplete="name" />
                  <input type="email" name="email" required placeholder="Email Address *"    value={form.email} onChange={handleChange} className={inputBase} autoComplete="email" />
                  <input type="tel"   name="phone"          placeholder="Phone (optional)"   value={form.phone} onChange={handleChange} className={inputBase} autoComplete="tel" />
                </div>
              </div>

              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--muted)] mb-6">Tattoo Details</p>
                <div className="space-y-6">
                  <select name="style" value={form.style} onChange={handleChange}
                    className={`${inputBase} cursor-pointer`} style={{ appearance: "none" }}>
                    <option value="" disabled style={{ background: "#111" }}>Style Preference</option>
                    {TATTOO_STYLES.map((s) => (
                      <option key={s} value={s} style={{ background: "#111", color: "#EDE8E3" }}>{s}</option>
                    ))}
                  </select>
                  <input type="text" name="placement" placeholder="Placement (e.g. forearm, back)"       value={form.placement}   onChange={handleChange} className={inputBase} />
                  <input type="text" name="size"      placeholder="Approximate Size (e.g. 6×4 in)"     value={form.size}        onChange={handleChange} className={inputBase} />
                  <textarea name="description" required placeholder="Describe your idea in detail *"
                    value={form.description} onChange={handleChange} rows={4}
                    className={`${inputBase} resize-none`} />

                  {/* Reference images upload (up to 5) */}
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-[var(--muted)] mb-3">
                      Reference Images <span className="text-[var(--border)]">(optional, up to 5)</span>
                    </label>
                    <label className="flex items-center gap-4 cursor-pointer group">
                      <div className="px-4 py-2 border border-[var(--border)] group-hover:border-[var(--gold-dim)] text-[10px] tracking-[0.2em] uppercase text-[var(--muted)] group-hover:text-[var(--gold)] transition-colors duration-200">
                        {referenceFiles.length ? "Add More" : "Upload Files"}
                      </div>
                      <span className="text-xs text-[var(--muted)] truncate max-w-[200px]">
                        {referenceFiles.length
                          ? `${referenceFiles.length} file${referenceFiles.length > 1 ? "s" : ""} selected`
                          : "No files chosen"}
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
                              className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center rounded-full bg-[var(--bg)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--gold)] hover:border-[var(--gold-dim)] transition-colors cursor-pointer leading-none"
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

                    {fileError && (
                      <p className="mt-2 text-xs text-red-400">{fileError}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right: calendar + time ── */}
            <div className="space-y-10">

              {/* Calendar */}
              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--muted)] mb-6">
                  Select a Date *
                </p>
                <div className="border border-[var(--border)] p-6">
                  <Calendar selected={selected} onSelect={setSelected} minDate={minDate} />
                </div>
                {selected && (
                  <p className="mt-3 text-xs text-[var(--gold)] tracking-wide">
                    {format(selected, "EEEE, MMMM d, yyyy")}
                  </p>
                )}
              </div>

              {/* Time slots */}
              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--muted)] mb-6">
                  Preferred Time *
                </p>
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
              </div>

              {/* Studio note */}
              <p className="text-xs text-[var(--muted)] leading-relaxed border-l-2 border-[var(--border)] pl-4">
                Open every day except Tuesday, 10:00 AM–6:00 PM Mountain Time (Denver).
                Minimum 3 days notice required. A deposit will be confirmed upon booking.
              </p>
            </div>
          </div>

          {/* Submit row */}
          <div className="mt-14 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <button
              type="submit"
              disabled={!isValid || status === "sending"}
              className="px-12 py-4 text-[11px] tracking-[0.25em] uppercase transition-all duration-300 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                background: isValid && status !== "sending" ? "var(--gold)" : "var(--border)",
                color:      isValid && status !== "sending" ? "var(--bg)"   : "var(--muted)",
              }}
            >
              {status === "sending" ? "Sending…" : "Send Inquiry"}
            </button>

            {status === "success" && (
              <p className="text-sm text-[var(--gold)]">
                Sent. Oktay will be in touch within 48 hours.
              </p>
            )}
            {status === "error" && (
              <p className="text-sm text-red-400">
                Something went wrong — email directly:{" "}
                <a href="mailto:oktaytattooart@gmail.com" className="underline">
                  oktaytattooart@gmail.com
                </a>
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
