# Resend Setup, Oktay Booking Email

How the booking form on oktaytattooart.com delivers email, and the exact steps to
turn it on. The site posts the form to a server route at `app/api/contact/route.ts`,
which sends through Resend: an inquiry notification to Oktay plus a branded auto-reply
to the client, with reference images as inline attachments and an Add-to-calendar
button.

## Account model

- Uses a Resend account under Oktay's own email (decided 2026-08-13). Set up when we
  have his email access.
- `oktaytattooart.com` is added as a domain under that account and verified via DNS.
- The API key from that account is stored only in Oktay's Vercel project env.

## One-time setup

### 1. Add the domain in Resend
1. Resend dashboard, Domains, Add Domain.
2. Enter `oktaytattooart.com`. Region US is fine.
3. Resend shows a set of DNS records to add (SPF/MX, DKIM, and DMARC). See the
   "DNS records" section below, which is filled in with the exact values.

### 2. Add the DNS records at the domain's DNS provider
1. Log into wherever oktaytattooart.com's DNS is managed.
2. Add each record exactly as Resend lists it (type, name/host, value, priority).
3. Save. Back in Resend, click Verify. Propagation is usually minutes, up to a
   couple hours.

### 3. Create an API key
1. Resend dashboard, API Keys, Create API Key.
2. Name it `oktay-portfolio`. Permission: Sending access. Domain: oktaytattooart.com.
3. Copy the key now (Resend shows it once). It looks like `re_...`.

### 4. Add the key to Vercel
1. Vercel, the oktay-portfolio project, Settings, Environment Variables.
2. Add `RESEND_API_KEY` = the `re_...` value. Apply to Production, Preview, Development.
3. Optional overrides (defaults already work once the domain is verified):
   - `CONTACT_TO_EMAIL` = `oktaytattooart@gmail.com` (where inquiries land)
   - `CONTACT_FROM_EMAIL` = `Oktay Yildirim <bookings@oktaytattooart.com>`
4. Redeploy so the new env var takes effect (push to main, or Vercel, Deployments,
   Redeploy).

### 5. Test
1. On oktaytattooart.com, submit a booking inquiry with one or more reference images.
2. Confirm the inquiry email lands at oktaytattooart@gmail.com with the thumbnails and
   a working Add-to-calendar button.
3. Confirm the auto-reply arrives at the address you submitted with.

## DNS records (from Resend)

Filled in once the domain is added in Resend:

| Type | Name / Host | Value | Priority |
| ---- | ----------- | ----- | -------- |
| TBD  | TBD         | TBD   | TBD      |

## Fast local test (no DNS needed)

To test before DNS verifies, using Resend's sandbox:
1. Put `RESEND_API_KEY=re_...` in local `.env.local`.
2. Set `CONTACT_FROM_EMAIL="Oktay <onboarding@resend.dev>"` in `.env.local`.
3. `npm run dev`, open localhost:3000, submit the form using `oktaytattooart@gmail.com`
   as the client email (Resend sandbox only delivers to the account owner's address).
4. Real production sending to any client email requires the verified domain.

## Env var reference

| Var | Required | Default | Purpose |
| --- | -------- | ------- | ------- |
| `RESEND_API_KEY` | Yes | none | Resend API key, Vercel only |
| `CONTACT_TO_EMAIL` | No | oktaytattooart@gmail.com | Inbox that receives inquiries |
| `CONTACT_FROM_EMAIL` | No | Oktay Yildirim <bookings@oktaytattooart.com> | Sending address, domain must be verified |

## Troubleshooting

- Form shows the error state: usually `RESEND_API_KEY` missing in Vercel, or the
  domain is not verified yet.
- Auto-reply never arrives but the inquiry does: the from-domain is not fully
  verified, so Resend blocks sending to arbitrary addresses. Finish DNS verification.
- Logo missing in the email: it loads from https://oktaytattooart.com/Oktay_Logo.png,
  which must stay live at that path.
