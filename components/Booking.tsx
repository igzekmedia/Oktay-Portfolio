"use client";

import { useState, useCallback, useEffect } from "react";
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
import emailjs from "@emailjs/browser";

const EMAILJS_SERVICE_ID  = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID  ?? "";
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? "";
const EMAILJS_PUBLIC_KEY  = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY  ?? "";



type Status = "idle" | "sending" | "success" | "error";

const TIME_SLOTS = ["10:00 AM","11:00 AM","12:00 PM","1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM","6:00 PM"];
const TATTOO_STYLES = ["Black and Grey","Color","Realism","Portraits","Cover Ups","Other"];
const DAYS = ["Mo","Tu","We","Th","Fr","Sa","Su"];

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
  useEffect(() => {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }, []);

  const minDate = addDays(startOfToday(), 3);

  const [selected, setSelected] = useState<Date | undefined>();
  const [time, setTime] = useState("");
  const [form, setForm] = useState({
    name: "", email: "", phone: "", style: "",
    placement: "", size: "", description: "",
  });
  const [referenceFile, setReferenceFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected || !time) return;
    setStatus("sending");

    try {
      let referenceUrl = "No reference image provided";

      if (referenceFile) {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve((reader.result as string).split(",")[1]);
          reader.onerror = reject;
          reader.readAsDataURL(referenceFile);
        });
        const imgbbData = new FormData();
        imgbbData.append("image", base64);
        const imgbbAlbum = process.env.NEXT_PUBLIC_IMGBB_ALBUM_ID ?? "";
        const imgbbRes = await fetch(
          `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}${imgbbAlbum ? "&album=" + imgbbAlbum : ""}`,
          { method: "POST", body: imgbbData }
        );
        const imgbbJson = await imgbbRes.json();
        if (imgbbJson.success) {
          referenceUrl = imgbbJson.data.url;
        }
      }

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          from_email: form.email,
          phone: form.phone || "Not provided",
          appointment_date: format(selected, "EEEE, MMMM d, yyyy"),
          appointment_time: time,
          tattoo_style: form.style || "Not specified",
          placement: form.placement || "Not specified",
          size: form.size || "Not specified",
          description: form.description,
          reference_image: referenceUrl,
        },
      );
      setStatus("success");
      setSelected(undefined);
      setTime("");
      setForm({ name:"", email:"", phone:"", style:"", placement:"", size:"", description:"" });
      setReferenceFile(null);
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
                  <input type="text" name="size"      placeholder="Approximate Size (e.g. 10×15 cm)"     value={form.size}        onChange={handleChange} className={inputBase} />
                  <textarea name="description" required placeholder="Describe your idea in detail *"
                    value={form.description} onChange={handleChange} rows={4}
                    className={`${inputBase} resize-none`} />

                  {/* Reference image upload */}
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-[var(--muted)] mb-3">
                      Reference Image <span className="text-[var(--border)]">(optional)</span>
                    </label>
                    <label className="flex items-center gap-4 cursor-pointer group">
                      <div className="px-4 py-2 border border-[var(--border)] group-hover:border-[var(--gold-dim)] text-[10px] tracking-[0.2em] uppercase text-[var(--muted)] group-hover:text-[var(--gold)] transition-colors duration-200">
                        {referenceFile ? "Change File" : "Upload File"}
                      </div>
                      <span className="text-xs text-[var(--muted)] truncate max-w-[200px]">
                        {referenceFile ? referenceFile.name : "No file chosen"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => setReferenceFile(e.target.files?.[0] ?? null)}
                      />
                    </label>
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
                Sent. Serdar will be in touch within 48 hours.
              </p>
            )}
            {status === "error" && (
              <p className="text-sm text-red-400">
                Something went wrong — email directly:{" "}
                <a href="mailto:serdarbolukbasi.ink@gmail.com" className="underline">
                  serdarbolukbasi.ink@gmail.com
                </a>
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
