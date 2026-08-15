import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/contact
 *
 * Receives the booking-inquiry form (multipart/form-data, incl. up to 5
 * optional reference images). Two independent things happen:
 *   1. The lead is logged to a Google Sheet (SHEETS_WEBHOOK_URL), if configured.
 *   2. If Resend is configured, an inquiry email is sent to Oktay (reference
 *      images as attachments, Add-to-calendar button) plus a branded client
 *      auto-reply.
 * Neither depends on the other, and both are non-fatal, so a booking always
 * returns success as long as the request is valid.
 *
 * Env:
 *   SHEETS_WEBHOOK_URL  (optional)  Google Apps Script web app URL for the lead sheet
 *   RESEND_API_KEY      (optional)  from resend.com; email is skipped if unset
 *   CONTACT_TO_EMAIL    (optional)  defaults to oktaytattooart@gmail.com
 *   CONTACT_FROM_EMAIL  (optional)  branded address on the oktaytattooart.com domain
 */
export const runtime = "nodejs";

const LOGO_URL = "https://oktaytattooart.com/Oktay_Logo.png";
const MAX_FILES = 5;
const MAX_FILE_BYTES = 5 * 1024 * 1024;
const MAX_TOTAL_BYTES = 20 * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    const fd = await req.formData();
    const get = (k: string) => (fd.get(k)?.toString() || "").trim();

    const name = get("name");
    const email = get("email");
    const phone = get("phone");
    const style = get("style");
    const placement = get("placement");
    const size = get("size");
    const purpose = get("purpose");
    const description = get("description");
    const appointmentDate = get("appointment_date");
    const appointmentTime = get("appointment_time");
    const gcalStart = get("gcal_start");
    const gcalEnd = get("gcal_end");

    if (!name || !email || !description) {
      return NextResponse.json(
        { error: "Name, email, and a description are required." },
        { status: 400 },
      );
    }

    // Optional reference images (up to 5) -> base64 attachments
    const attachments: { filename: string; content: string; content_id?: string }[] = [];
    const files = fd
      .getAll("reference")
      .filter(
        (v): v is File =>
          typeof v === "object" &&
          v !== null &&
          "arrayBuffer" in v &&
          (v as File).size > 0,
      );
    let total = 0;
    let idx = 0;
    for (const f of files.slice(0, MAX_FILES)) {
      if (f.size > MAX_FILE_BYTES) {
        return NextResponse.json(
          { error: "Each reference image must be under 5MB." },
          { status: 400 },
        );
      }
      total += f.size;
      if (total > MAX_TOTAL_BYTES) {
        return NextResponse.json(
          { error: "Reference images must total under 20MB." },
          { status: 400 },
        );
      }
      const buf = Buffer.from(await f.arrayBuffer());
      attachments.push({
        filename: f.name || `reference-${idx + 1}.jpg`,
        content: buf.toString("base64"),
      });
      idx++;
    }

    // 1) Log the lead to a Google Sheet for retargeting (independent, non-blocking).
    try {
      const sheetsUrl = process.env.SHEETS_WEBHOOK_URL;
      if (sheetsUrl) {
        await fetch(sheetsUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            timestamp: new Date().toISOString(),
            name,
            email,
            phone,
            purpose,
            style,
            placement,
            size,
            description,
            appointment_date: appointmentDate,
            appointment_time: appointmentTime,
            reference_count: attachments.length,
            source: "oktaytattooart.com",
          }),
        });
      }
    } catch (sheetErr) {
      console.error("[contact] sheet log failed (non-blocking):", sheetErr);
    }

    // 2) Email via Resend (only if configured; independent of the sheet).
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      try {
        const toList = (process.env.CONTACT_TO_EMAIL || "oktaytattooart@gmail.com")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        const fromEmail =
          process.env.CONTACT_FROM_EMAIL ||
          "Oktay Yildirim <bookings@oktaytattooart.com>";

        // Embed the logo as an inline attachment so it renders even when the
        // email client blocks remote images (Apple Mail and others do by
        // default). Falls back to the hosted URL if the fetch fails.
        let logoSrc = LOGO_URL;
        let logoAttachment:
          | { filename: string; content: string; content_id: string }
          | null = null;
        try {
          const logoResp = await fetch(LOGO_URL);
          if (logoResp.ok) {
            const logoBuf = Buffer.from(await logoResp.arrayBuffer());
            logoAttachment = {
              filename: "logo.png",
              content: logoBuf.toString("base64"),
              content_id: "logo",
            };
            logoSrc = "cid:logo";
          }
        } catch {
          // keep the remote URL fallback
        }
        const ownerAttachments = logoAttachment
          ? [logoAttachment, ...attachments]
          : attachments;

        const row = (label: string, value: string) =>
          value
            ? `<tr><td style="padding:12px 16px 12px 0;color:#8a857d;font-size:12px;letter-spacing:0.4px;text-transform:uppercase;border-bottom:1px solid #eee9df;white-space:nowrap;vertical-align:top;">${label}</td><td style="padding:12px 0;color:#1f1c19;font-size:14px;font-weight:500;border-bottom:1px solid #eee9df;vertical-align:top;text-align:right;">${escapeHtml(
                value,
              )}</td></tr>`
            : "";

        const calTitle = `Requested: Tattoo consult with ${name}`;
        const calDetails = `Requested booking via oktaytattooart.com\n\nStyle: ${
          style || "n/a"
        }\nPlacement: ${placement || "n/a"}\nSize: ${
          size || "n/a"
        }\n\nIdea:\n${description}\n\nClient: ${name}\n${email}${
          phone ? "\n" + phone : ""
        }`;
        const gcalUrl =
          gcalStart && gcalEnd
            ? `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                calTitle,
              )}&dates=${gcalStart}/${gcalEnd}&ctz=America/Denver&details=${encodeURIComponent(
                calDetails,
              )}&location=${encodeURIComponent("Cleopatra Ink, 1869 S Broadway, Denver, CO 80210")}`
            : "";
        const buttonsHtml = gcalUrl
          ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0 0;"><tr><td><a href="${gcalUrl}" style="display:inline-block;background:#c8a24e;color:#0a0a0a;font-size:12px;font-weight:bold;letter-spacing:0.5px;text-transform:uppercase;text-decoration:none;padding:12px 22px;border-radius:6px;">Add to calendar</a></td></tr></table>`
          : "";

        const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light"></head><body style="margin:0;background:#ece7de;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:32px 16px;">
    <div style="background:#ffffff;border:1px solid #e6e0d5;border-radius:12px;padding:40px;">
      <img src="${logoSrc}" alt="Oktay Yildirim" width="118" style="width:118px;max-width:50%;height:auto;display:block;margin:0 0 28px;" />
      <div style="border-top:1px solid #e6e0d5;padding-top:28px;">
        <div style="font-size:11px;letter-spacing:2.5px;text-transform:uppercase;color:#9a7b3f;margin:0 0 20px;">New Booking Inquiry</div>
        ${
          appointmentDate
            ? `<div style="margin:0 0 28px;">
          <div style="font-size:21px;font-weight:bold;color:#1f1c19;letter-spacing:-0.01em;">${escapeHtml(appointmentDate)}</div>
          <div style="font-size:14px;color:#9a7b3f;margin-top:6px;">${escapeHtml(appointmentTime)} &middot; Mountain Time</div>
        </div>`
            : ""
        }
        <table style="width:100%;border-collapse:collapse;">
          <tr><td colspan="2" style="border-top:1px solid #e6e0d5;font-size:0;line-height:0;">&nbsp;</td></tr>
          ${row("Purpose", purpose)}
          ${row("Name", name)}
          ${row("Email", email)}
          ${row("Phone", phone)}
          ${row("Style", style)}
          ${row("Placement", placement)}
          ${row("Size", size)}
        </table>
        <div style="margin-top:28px;">
          <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#8a857d;margin:0 0 10px;">Their Idea</div>
          <div style="font-size:14px;color:#1f1c19;line-height:1.65;white-space:pre-wrap;">${escapeHtml(
            description,
          )}</div>
        </div>
        ${
          attachments.length
            ? `<div style="margin-top:26px;">
          <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#8a857d;margin:0 0 8px;">Reference Image${attachments.length > 1 ? "s" : ""}</div>
          <div style="font-size:14px;color:#1f1c19;">${attachments.length} photo${attachments.length > 1 ? "s" : ""} attached to this email. Open or download from the attachment bar.</div>
        </div>`
            : ""
        }
        ${buttonsHtml}
      </div>
    </div>
    <p style="text-align:center;margin:18px 0 0;font-size:11px;color:#8a857d;">Reply directly to this email to reach ${escapeHtml(
      name,
    )}.</p>
  </div>
</body></html>`;

        const resp = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: fromEmail,
            to: toList,
            reply_to: email,
            subject: `New booking inquiry: ${name}`,
            html,
            ...(ownerAttachments.length ? { attachments: ownerAttachments } : {}),
          }),
        });

        if (!resp.ok) {
          const detail = await resp.text();
          console.error("[contact] Resend error (non-blocking):", resp.status, detail);
        } else {
          const firstName = name.split(" ")[0] || name;
          const replyHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light"></head><body style="margin:0;background:#ece7de;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:32px 16px;">
    <div style="background:#ffffff;border:1px solid #e6e0d5;border-radius:12px;padding:40px;">
      <img src="${logoSrc}" alt="Oktay Yildirim" width="118" style="width:118px;max-width:50%;height:auto;display:block;margin:0 0 28px;" />
      <div style="border-top:1px solid #e6e0d5;padding-top:28px;">
        <h1 style="margin:0 0 18px;font-size:19px;font-weight:500;color:#1f1c19;letter-spacing:-0.01em;">Thanks for reaching out, ${escapeHtml(
          firstName,
        )}.</h1>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#4a463f;">
          We've received your inquiry and we'll be in touch within 24 hours to confirm your consultation and talk through your idea.
        </p>
        <p style="margin:0 0 28px;font-size:15px;line-height:1.7;color:#4a463f;">
          In the meantime, feel free to reply to this email with any extra details or reference images you'd like us to see.
        </p>
        <p style="margin:0;font-size:15px;color:#9a7b3f;">Oktay Yildirim</p>
        <p style="margin:24px 0 0;font-size:12px;color:#8a857d;line-height:1.7;border-top:1px solid #e6e0d5;padding-top:20px;">
          Cleopatra Ink &middot; 1869 S Broadway, Denver, CO 80210<br><a href="https://oktaytattooart.com" style="color:#9a7b3f;text-decoration:none;">oktaytattooart.com</a> &middot; <a href="https://instagram.com/oktaytattooart" style="color:#9a7b3f;text-decoration:none;">@oktaytattooart</a>
        </p>
      </div>
    </div>
  </div>
</body></html>`;

          await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: fromEmail,
              to: [email],
              reply_to: toList[0],
              subject: "Thanks for reaching out to Oktay",
              html: replyHtml,
              ...(logoAttachment ? { attachments: [logoAttachment] } : {}),
            }),
          });
        }
      } catch (mailErr) {
        console.error("[contact] email failed (non-blocking):", mailErr);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    console.error("[contact] error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
