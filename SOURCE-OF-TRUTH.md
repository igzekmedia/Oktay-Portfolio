# Oktay Portfolio Website, Source of Truth

**Summary:** Personal brand and portfolio website for Oktay Yıldırım, an international award winning tattoo artist at Cleopatra Ink Denver. The site is a single page with sticky nav, portfolio filter, calendar based booking form, and award gallery. Primary goal is a booking inquiry submitted through the calendar plus form on the same page.

---

## 1. Overview

* **Artist:** Oktay Yıldırım
* **Studio:** Cleopatra Ink Denver
* **City:** Denver, Colorado
* **What the site is for:** personal brand, portfolio showcase, awards gallery, and booking funnel on a single page.
* **Primary goal:** booking inquiry via the on page form (name, contact, style, placement, size, description, reference image, calendar date, time slot).
* **Main action for a visitor:** click "Book Session" from the nav or hero, scroll to the Booking section, fill out the form, submit.
* **Positioning:** International Award Winning Tattoo Artist. Dark cinematic editorial, gold as the single accent color.

---

## 2. Tech and Stack

* **Framework:** Next.js 16.2.3 (App Router)
* **Language:** TypeScript 5
* **UI runtime:** React 19.2.4
* **Styling:** Tailwind CSS v4 with `@tailwindcss/postcss`
* **Animation:** framer-motion 12.38.0
* **Icons:** lucide-react 1.7.0 (listed as dependency, actual SVGs mostly inline in components)
* **Date utilities:** date-fns 4.1.0 (used inside Booking for the custom calendar)
* **Date picker:** react-day-picker 9.14.0 (listed as dependency, actual calendar is a custom implementation inside Booking.tsx using date-fns primitives)
* **Email delivery:** @emailjs/browser 4.4.1 (client side send, not Resend)
* **Image upload host:** ImgBB (booking form reference images are uploaded to ImgBB, then the returned URL is embedded in the EmailJS message)
* **Linting:** eslint 9 with eslint-config-next 16.2.3
* **Fonts (loaded via Google Fonts CDN `@import` in `globals.css`, not `next/font`):**
  * Display: Syne, weights 400, 500, 600, 700, 800
  * Body: DM Sans, weights 300, 400, 500 (also 300 italic)
* **Repo location:** `/Users/zeke/Desktop/Second Brain/Second Brain Starter/02 Projects/Websites/oktay-portfolio/`
* **Deploy setup:** implied Vercel (no `vercel.json` or deploy configs in the repo). README references Vercel as the deploy target. Live URL not stated in the repo files.
* **Custom domain:** not stated in the repo files.
* **Environment variables (client, public):**
  * `NEXT_PUBLIC_EMAILJS_SERVICE_ID`
  * `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`
  * `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`
  * `NEXT_PUBLIC_IMGBB_API_KEY`
  * `NEXT_PUBLIC_IMGBB_ALBUM_ID`
* **IGZEK MEDIA hosting guard:** not installed in this project (no snippet in `app/layout.tsx`).
* **Universal rules inherited:** none referenced inside this project. `BUILD_RULES.md` and `website-process.md` were not present or imported when this site was built (implied, confirm).
* **AGENTS.md content:** one line note warning that this is Next.js 16 with breaking changes from prior versions, telling agents to read `node_modules/next/dist/docs/` before writing code.

---

## 3. Pages and Structure

### Single page site

* **Route:** `/` (only route). No `/booking`, `/privacy-policy`, `/terms-and-conditions`, or `/api/*` routes exist.
* **Component composition in `app/page.tsx` (in this exact order):**
  1. Nav
  2. Hero
  3. Portfolio
  4. Awards
  5. About
  6. Booking
  7. FAQ
  8. Footer
* **Anchor IDs:** `#portfolio`, `#awards`, `#about`, `#faq`, `#hero`, `#booking`

### Navigation

* Sticky header at the top of the page
* Desktop nav links: `Work` (to `#portfolio`), `Awards` (to `#awards`), `About` (to `#about`), `FAQ` (to `#faq`)
* Nav "Book Session" CTA button (gold border) scrolls to `#booking`
* Logo (`/Oktay_Logo.png`, alt text: `Oktay Yıldırım — home`) links to top
* Mobile menu: hamburger opens a fullscreen menu. On scroll down on mobile, the header hides itself; scrolling up brings it back.
* Header switches from transparent to a `rgba(9,9,9,0.92)` translucent background after `scrollY > 60`.

### Conversion path

Landing on `/` to Hero primary CTA "View Work" (to `#portfolio`) or Hero secondary "Book Session" (to `#booking`), to fill the Booking form on the same page, to POST via EmailJS to Oktay, to inline success message "Sent. Oktay will be in touch within 48 hours." No separate booking page, no redirect, no thank you page.

---

## 4. Design System and Brand

### Colors, exact hex codes

```
--bg:          #090909    (near black background)
--surface:     #111111    (section elevation, Booking section background)
--surface-2:   #181818    (Awards card hover state)
--border:      #222222    (dividers, form input borders)
--text:        #EDE8E3    (warm off white body text)
--muted:       #7A7470    (secondary text, form placeholders)
--gold:        #d1b468    (primary accent, brightest)
--gold-mid:    #ad8c59    (mid stop of gold gradient)
--gold-dark:   #8f7041    (dark stop of gold gradient)
--gold-dim:    #8f7041    (alias, used for hairlines and borders)
```

Gold is applied as a 135 degree linear gradient in text using `background-clip: text`. Utility classes:
* `.gold-text`, `.gold-gradient-text`, and `.text-\[var\(--gold\)\]` all render gold gradient text via `-webkit-background-clip: text` and transparent fill
* `.gold-border` uses `border-image` with the same gradient

Selection state: gold background on the bg color (`::selection { background: var(--gold); color: var(--bg); }`). Custom slim scrollbar (3px wide, `--border` thumb on `--bg` track).

### Typography

* Display: Syne, weight 800 primary, weight 400 for the gold gradient last name (contrast comes from weight, not color, plus the gradient fill)
* Body: DM Sans, weight 400, with 300 italic available
* Letter spacing on display headings: `-0.03em` (hero, section H2s) and `-0.02em` (About H2)
* Uppercase small caps for eyebrows and links: tracking `0.15em` to `0.35em`, 9 to 11px
* Wordmark treatment on the hero: `OKTAY` in white weight 800 + `YILDIRIM` in gold gradient weight 400

### Layout patterns

* Container: `max-w-7xl mx-auto` inside sections
* Section padding: `py-16 md:py-32 px-6 md:px-12` (except Nav which is `px-8 py-6 md:px-12`)
* Hero: `min-h-screen`, content bottom aligned on mobile (`pb-40`), center aligned on desktop
* Portfolio: CSS columns masonry (`columns-2 md:columns-3`, gap 3 to 4)
* Awards: alternating grid rows (`grid-cols-1 md:grid-cols-[1fr_2fr]`)
* About: two column on lg (`lg:grid-cols-2 gap-20`)
* Booking: two column form (`lg:grid-cols-2 gap-16 xl:gap-24`)
* Footer: flex row on md and up, stacked on mobile

### Motion

* framer-motion is used for hero fade in on load, scroll based reveals in every section (`whileInView` with `viewport={{ once: true }}`), Portfolio image scale on hover, Awards card border color transition on hover, FAQ accordion expand
* Hero stagger: header at delay 0.6s, tagline at 0.8s, CTAs at 1.1s, scroll indicator at 1.5s (all `duration: 0.8` to `1`)
* Mobile nav has an auto hide on scroll down behavior driven by a scroll listener plus a translateY animation
* No `prefers-reduced-motion` override in `globals.css`

### Imagery style

* Hero desktop: full width autoplay muted looping video (`/Oktay - Website VSL.mp4`) with a dark vertical gradient overlay: `linear-gradient(to bottom, rgba(9,9,9,0.65) 0%, rgba(9,9,9,0.2) 35%, rgba(9,9,9,0.3) 60%, rgba(9,9,9,0.85) 80%, rgba(9,9,9,1) 100%)`
* Hero mobile: still image `/Oktay-Mobile-Hero.jpg`
* Portfolio images: `/portfolio/black-and-grey/*.png` (19 files) and `/portfolio/color/*.png` (16 files). Aspect ratio 1080 by 1350 (Instagram portrait size).
* About portrait: `/About-Oktay.png`, square aspect ratio
* Awards: one image per award entry, 400px tall panel next to the details column
* No grain overlay, no torn edges, no custom cursor

### Brand rules present in the code

* Gold gradient is the only accent color. No blues, no reds.
* Wordmark and section headings use display weight contrast (bold plus regular gradient) instead of two different colors
* Uppercase small caps eyebrows in gold sit above every section H2
* All external links open in new tab with `rel="noopener noreferrer"`
* All artwork and images marked as sole property of Oktay Yıldırım in the footer

---

## 5. Copy and Content

### Metadata (from `app/layout.tsx`)

* Title: `Oktay | Tattoo Artist`
* Description: `Oktay — Blackwork tattoo artist at Cleopatra Ink Denver.`
* Open Graph title: `Oktay | Tattoo Artist`
* Open Graph description: `Blackwork Tattoo Artist at Cleopatra Ink Denver`
* Open Graph type: `website`
* No `og:image` set, no Twitter card, no `metadataBase`

> Note: the metadata description uses the word "Blackwork" and an em dash. The site copy elsewhere describes his services as black and grey, color realism, realism, portraits, and cover-ups, which is broader than "Blackwork". Implied inconsistency, confirm.

### Nav

* Logo alt: `Oktay Yıldırım — home`
* Link labels: `Work`, `Awards`, `About`, `FAQ`
* CTA button: `Book Session` (scrolls to `#booking`)

### Hero

* Wordmark line 1: `OKTAY` (white, weight 800)
* Wordmark line 2 or continuation: `YILDIRIM` (gold gradient, weight 400)
* Tagline between horizontal gold rules: `International Award Winning Tattoo Artist`
* Primary CTA button: `View Work` (scrolls to `#portfolio`)
* Secondary CTA button: `Book Session` (scrolls to `#booking`)
* Scroll indicator label: `Scroll`
* No H1 sub headline

### Portfolio section

* Eyebrow: `Portfolio`
* H2: `THE WORK`
* Category filter tabs: `all`, `black-and-grey`, `color`
* Truncation behavior: on mobile shows 4 images, on desktop shows 6, with a Show All toggle when the "all" tab is active and filtered length exceeds the limit (button text not captured in the visible copy pull, implied "Show All" or similar)
* Image alt for every entry: `Tattoo by Oktay`
* One image tagged `excludeFromAll: true` (id 21) does not appear in the All tab
* Award-Winning pieces (marked in comments): ids 4, 16, 24, 30, 31, 35

### Awards section

* Eyebrow: `International Recognition`
* H2 line 1: `AWARD WINNING`
* H2 line 2: `WORK` (gold gradient, weight 400)
* Intro copy: `Over 10+ awards earned across Colorado, Los Angeles, and beyond — each piece judged in open competition against the world's finest artists.`
* Six award entries currently listed:
  1. Villain Arts Tattoo Arts Festival, 2026, Chicago, Illinois, placement TBA, category "Award details coming soon"
  2. Villain Arts Tattoo Arts Festival, 2026, Chicago, Illinois, placement TBA, category "Award details coming soon"
  3. Colorado Tattoo Convention, 2025, Denver, Colorado, placement TBA, category "Award details coming soon"
  4. Villain Arts Tattoo Arts Festival, 2025, Denver, Colorado, placement TBA, category "Award details coming soon"
  5. Villain Arts Tattoo Arts Festival, 2025, Denver, Colorado, placement TBA, category "Award details coming soon"
  6. Villain Arts Tattoo Arts Festival, 2024, Denver, Colorado, placement TBA, category "Award details coming soon"
* Each entry has an image plus year, convention name, location, awards list. The actual placements and categories are all placeholder text "TBA" and "Award details coming soon."

### About section

* Eyebrow: `The Artist`
* H2 line 1: `MASTERED`
* H2 line 2: `THEM ALL` (gold gradient, weight 400)
* Sub tagline in gold: `Black & Grey · Color Realism · Portraits`
* Paragraph 1: "Most tattoo artists have one style they do well. Oktay has mastered them all. An international award-winning artist based in Denver, he specializes in black and grey, color realism, realism, portraits, and cover-ups — with a particular gift for large-scale work including full sleeves and back pieces."
* Paragraph 2: "Originally from Turkey, Oktay has been perfecting his craft since 2010 — bringing a quiet intensity to every piece. He is humble, deeply passionate about his craft, and sought out by clients who want the right artist to trust with their vision — not just someone to fill the space."
* Paragraph 3: "He has earned over 10 awards across Colorado, Los Angeles, Chicago, and beyond — and continues to push his craft at Cleopatra Ink Denver, Colorado's most awarded tattoo studio."
* CTA link: `Follow the Work` links to `https://www.instagram.com/` (generic Instagram root, not the artist's specific handle, implied bug, confirm)
* Stats block (four tiles):
  * `16+` `Years of Practice`
  * `10+` `International Awards`
  * `5K+` `Clients Served`
  * `CO` `Based in Denver`
* Portrait image: `/About-Oktay.png`

### Booking section

* Eyebrow: `Start the Process`
* H2: `BOOK A SESSION`
* Subhead: "All bookings are reviewed personally. You'll receive a confirmation within 48 hours. Please provide as much detail as possible."
* Left column form fields (in order):
  * Section label: `Your Details`
    * `Full Name *` (required, text, autoComplete=name)
    * `Email Address *` (required, email, autoComplete=email)
    * `Phone (optional)` (text, tel, autoComplete=tel)
  * Section label: `Tattoo Details`
    * `Style Preference` (select, options: `Black and Grey`, `Color`, `Realism`, `Portraits`, `Cover Ups`, `Other`)
    * `Placement (e.g. forearm, back)` (text)
    * `Approximate Size (e.g. 10×15 cm)` (text)
    * `Describe your idea in detail *` (required, textarea, 4 rows)
    * `Reference Image (optional)` upload button labeled `Upload File` (changes to `Change File` when a file is selected). Filename displays next to it, "No file chosen" if none.
* Right column:
  * Custom month calendar built with date-fns primitives, days grid Mo Tu We Th Fr Sa Su
  * Minimum date: 3 days from today (`addDays(startOfToday(), 3)`)
  * Time slot selector: `10:00 AM`, `11:00 AM`, `12:00 PM`, `1:00 PM`, `2:00 PM`, `3:00 PM`, `4:00 PM`, `5:00 PM`, `6:00 PM`
  * Studio note: "Open every day except Tuesday, 10:00 AM–6:00 PM Mountain Time (Denver). Minimum 3 days notice required. A deposit will be confirmed upon booking."
* Submit button text: `Send Inquiry` (or `Sending…` during send)
* Success state text: `Sent. Oktay will be in touch within 48 hours.`
* Error state text: `Something went wrong — email directly: oktaytattooart@gmail.com`

### FAQ section

* Eyebrow: `Got Questions`
* H2 line 1: `FREQUENTLY`
* H2 line 2: `ASKED` (gold gradient, weight 400)
* Intro: "Everything you need to know before booking your appointment."
* Ten questions and answers:
  1. Q: "How do I book a tattoo appointment with Oktay?" A: "You can book an appointment by contacting Oktay directly through Instagram, email, or the booking form on this website. We recommend booking in advance, as his schedule in Denver and during guest spots fills up quickly."
  2. Q: "Do I need to pay a deposit?" A: "Yes, a deposit is required to secure your appointment. The deposit goes toward the final cost of your tattoo and ensures your spot in Oktay's schedule. Deposits are non-refundable but transferable if you reschedule in advance."
  3. Q: "How much does a tattoo cost?" A: "Tattoo pricing depends on size, placement, and detail. Black & grey realism and micro-realism tattoos are highly detailed and may require multiple sessions. Oktay will provide a price estimate during your consultation."
  4. Q: "Can I bring my own design idea?" A: "Absolutely. You can bring reference photos, sketches, or any inspiration you have. Oktay specializes in custom designs and will adapt your idea into a unique piece of art that fits your vision and body placement."
  5. Q: "Does getting a tattoo hurt?" A: "Pain levels vary depending on the location and size of the tattoo. Most clients describe the feeling as uncomfortable but manageable. Oktay works with care and patience to make the process as comfortable as possible."
  6. Q: "How should I prepare for my tattoo session?" A: "Get a good night's sleep, eat a full meal before your appointment, and stay hydrated. Avoid alcohol or blood-thinning substances 24 hours before your session. Wear comfortable clothing that allows easy access to the area being tattooed."
  7. Q: "How long does a tattoo session take?" A: "Session length depends on the size and complexity of the tattoo. Small tattoos may take 1–2 hours, while large black & grey realism pieces can require several sessions. Oktay will provide an estimated timeline during your consultation."
  8. Q: "How do I take care of my tattoo afterward?" A: "Oktay provides detailed aftercare instructions to ensure proper healing. Generally, you'll need to keep the area clean, moisturized, and protected from direct sunlight. Avoid swimming, tanning, and intense physical activity until the tattoo heals."
  9. Q: "Can I get tattooed if it's my first time?" A: "Yes! Many of Oktay's clients are first-timers. He will guide you through the process step by step, answer all your questions, and make sure you feel comfortable throughout your tattoo journey."
  10. Q: "Does Oktay do cover-ups or touch-ups?" A: "Yes, Oktay offers both cover-ups and touch-ups, depending on the condition of the old tattoo and the design you want. During the consultation, he will evaluate the possibilities and create a custom plan for your new piece."

### Footer

* Logo: `/Oktay_Logo.png`
* Tagline: `Tattoo Artist · Denver, Colorado`
* Link row:
  * `Instagram` linking to `https://www.instagram.com/oktaytattooart` (this is the correct handle, unlike the About "Follow the Work" link)
  * `Facebook` linking to `https://www.facebook.com/oktay.y.ld.r.m.280118/`
  * `Email` linking to `mailto:oktaytattooart@gmail.com`
  * `Book Appointment` (scrolls to `#booking`)
* Bottom row left: `© {current year} Oktay Yıldırım. All rights reserved.`
* Bottom row right: `All artwork and images are the sole property of Oktay Yıldırım.`

### Artist bio, credentials, awards as stated

* Full name: Oktay Yıldırım
* Studio: Cleopatra Ink Denver (called "Colorado's most awarded tattoo studio" in About paragraph 3)
* Country of origin: Turkey
* Years perfecting craft: since 2010
* Stat block figures:
  * `16+` Years of Practice
  * `10+` International Awards
  * `5K+` Clients Served
  * Based in Denver, Colorado
* Services stated in About: black and grey, color realism, realism, portraits, cover-ups
* Special focus: large-scale work including full sleeves and back pieces
* Awards convention list: Villain Arts Tattoo Arts Festival (Chicago and Denver 2024, 2025, 2026), Colorado Tattoo Convention (Denver 2025)

### Portfolio pieces referenced

* 35 total portfolio entries in the `works` array (ids 1 to 35)
* Distribution: 20 black-and-grey plus 15 color (from the array, though the on disk count is 19 black-and-grey + 16 color images, so numbers do not perfectly reconcile, implied minor mismatch, confirm)
* Featured order (first 5 shown in All tab): ids 1, 2, 3, 4, 5
* One image tagged `excludeFromAll: true` (id 21)
* Award-winning pieces flagged in comments: ids 4, 16, 24, 30, 31, 35
* All alt text: `Tattoo by Oktay`
* All images 1080 by 1350

---

## 6. Technical and Marketing Setup

### Forms

* One form on the site: Booking form on the same page (`#booking`)
* All form logic client side, no server API route

### Where submissions go

* Sent via EmailJS from the browser
* Requires env vars: `NEXT_PUBLIC_EMAILJS_SERVICE_ID`, `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`, `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`
* Reference image upload flow: browser reads file to base64, POSTs to `https://api.imgbb.com/1/upload` with `NEXT_PUBLIC_IMGBB_API_KEY` (and optional `NEXT_PUBLIC_IMGBB_ALBUM_ID`), receives back a hosted URL, then that URL is included in the EmailJS message description under the label "No reference image provided" if the upload was skipped or failed
* Delivery destination is configured in the EmailJS template (not visible in the code)
* No BCC copy visible in the code
* No submissions persisted to any database (implied, confirm)

### Pixel, analytics, tracking

* No Vercel Analytics, no Meta Pixel, no Google Analytics, no Google Tag Manager, no conversion tracking wired in the code

### Integrations

* EmailJS for booking form submissions
* ImgBB for reference image hosting
* No calendar system integration (custom calendar built in Booking.tsx using date-fns)
* No Stripe or payments
* No CRM
* No Supabase
* No IGZEK MEDIA ops app integration
* No SMS notifications

### SEO and metadata notes

* Page level `metadata` object in `app/layout.tsx` sets title, description, and one Open Graph pair
* No `sitemap.xml`, `robots.txt`, or structured data
* No `og:image`
* No Twitter card
* No `metadataBase`
* Default Next.js favicon at `app/favicon.ico`
* Description string calls him a "Blackwork" artist which conflicts with the About copy that lists multiple styles (see Copy section note)

---

## 7. Current State

### Done and on disk

* Full Next.js 16 project scaffolded and functional
* 8 components built: Nav, Hero, Portfolio, Awards, About, Booking, FAQ, Footer
* Single page composition wired in `app/page.tsx`
* Design tokens locked in `app/globals.css`
* Google Fonts loaded (Syne + DM Sans)
* 35 portfolio image references (19 black-and-grey files, 16 color files on disk)
* 6 award entries with images
* Hero desktop video (`Oktay - Website VSL.mp4`) and mobile still (`Oktay-Mobile-Hero.jpg`) in place
* About portrait (`About-Oktay.png`) in place
* Custom Oktay logo (`Oktay_Logo.png`) in place
* Booking form fully wired with client side send via EmailJS plus ImgBB upload
* Custom in file calendar (no library, built with date-fns primitives)
* Time slot selector with 9 one hour slots
* Studio hours note in place
* README.md is the default `create-next-app` template
* AGENTS.md has a one line warning about Next.js 16 breaking changes
* CLAUDE.md is a pointer to AGENTS.md (`@AGENTS.md`)

### Not confirmed or half built

* Awards details are all placeholder ("TBA" and "Award details coming soon"). Real placement and category text has never been entered.
* About paragraph 1 uses phrase "black and grey, color realism, realism, portraits, and cover-ups" (five styles), while the Booking Style Preference dropdown lists "Black and Grey, Color, Realism, Portraits, Cover Ups, Other" (six options including Other). These are close but not identical.
* Metadata description "Blackwork tattoo artist" contradicts the rest of the site copy which is multi-style. Implied inconsistency, confirm.
* Portfolio counts: `works` array has 20 black-and-grey plus 15 color entries (35 total), on disk `public/portfolio/` has 19 black-and-grey plus 16 color files (35 total). Total matches but per-category split does not. Implied mismatch, confirm.
* About section CTA `Follow the Work` links to `https://www.instagram.com/` (Instagram root) instead of the artist handle `@oktaytattooart`. Implied bug, confirm.
* Live URL of the deployed site is not stated in any repo file.
* Custom domain is not stated in any repo file.

### Known issues flagged

* No hosting guard snippet (IGZEK MEDIA guard) in the `<head>`. If Oktay's site is meant to run under the ops app hosting model, this needs adding.
* No `prefers-reduced-motion` override in `globals.css`. Motion is universal, no reduced motion escape hatch.
* No `robots.txt`, no `sitemap.xml`, no structured data.
* No `og:image` set, so social shares will use no preview image.
* Google Fonts loaded via CDN `@import` in `globals.css` instead of `next/font/google`, which foregoes the built in preload plus subsetting benefits.
* EmailJS credentials are in `NEXT_PUBLIC_*` env vars, visible in the client bundle. Standard EmailJS practice for their client side SDK, but worth noting.
* Copy contains em dashes and en dashes inside quotes ("black and grey — bringing a quiet intensity", "10:00 AM–6:00 PM"). If dashes are being sweep-removed to match a rule elsewhere, these need addressing.
* Metadata "Blackwork" vs multi-style copy conflict (see above).
* Portfolio counts (`works` array vs on disk files) do not perfectly line up (see above).
* About "Follow the Work" link goes to generic Instagram root instead of `@oktaytattooart` (see above).
* Six award entries all show "TBA" and "Award details coming soon" placeholder text.
* `date-fns` and `react-day-picker` are both installed but only `date-fns` is actually used. `react-day-picker` appears to be an unused dependency (implied, confirm).
* `lucide-react` is installed but most icons in components are inline SVGs. It may be unused (implied, confirm).

---

## 8. Decisions Present in This Site

Locked in the code, worth preserving as the baseline pattern.

* Site format: single page. No separate booking page, no legal pages, no API routes.
* Section order: Nav to Hero to Portfolio to Awards to About to Booking to FAQ to Footer. Portfolio and Awards come before About, which is a portfolio-first pattern rather than a story-first pattern.
* Palette: dark base with gold as the single accent color, applied as a gradient via `background-clip: text`.
* Typography: Syne (display) plus DM Sans (body), loaded via CDN.
* Every H2 uses a two line structure with the second line in gold gradient weight 400 for tone-and-weight contrast (`AWARD WINNING / WORK`, `MASTERED / THEM ALL`, `FREQUENTLY / ASKED`, `OKTAY / YILDIRIM`).
* Nav uses uppercase small caps in muted grey with hover to full text color.
* Nav "Book Session" CTA has a gold border that fills gold on hover.
* Hero has a full width autoplay muted looping video on desktop and a still image on mobile.
* Booking form uses EmailJS client side, not a server API route.
* Reference images upload to ImgBB, then the URL is embedded in the EmailJS message.
* Booking calendar is a custom in file implementation using date-fns primitives, minimum 3 days out.
* Time slots are 9 one hour blocks from 10 AM to 6 PM.
* Studio hours: every day except Tuesday, 10 AM to 6 PM Mountain Time.
* Portfolio truncates to 4 on mobile and 6 on desktop with a Show All toggle only on the "all" tab.
* Portfolio has a featured order (first 5 items) and one hidden entry excluded from the All tab.
* Awards are shown in a photo-plus-details grid pattern with border color hover.
* About uses a copy-plus-portrait-plus-stats layout with a four tile stat block.
* Footer uses uppercase small caps links for Instagram, Facebook, Email, and Book Appointment.
* Copyright and IP notice appear in the bottom bar of the footer.
* No IGZEK MEDIA hosting guard is installed.
* No legal pages (privacy, terms).
* No standalone booking page.
* No CRM or Supabase integration.

---

## 9. Gaps, What Is Still Missing Before a New Project or Claude Code Can Safely Change Things

Everything below was never covered in the current project files. Provide these before shipping updates or before reusing this codebase as a template.

### Assets and identity

* Higher quality Open Graph share image (og:image)
* Twitter card metadata plus image
* Any additional artist portrait shots (only one currently)
* Any studio interior or process shots (currently no such photos on the site)

### Business details

* Cleopatra Ink Denver street address
* Studio phone number (Oktay's phone is not on the site, only in the booking form field for the visitor to enter their own)
* Confirmed exact services excluded (site says he does black and grey, color realism, realism, portraits, cover-ups, but does not state what he does not do)
* Deposit dollar amount or percentage
* Cancellation and reschedule specifics (site says deposits are "transferable if you reschedule in advance" but does not define the notice window)
* Full aftercare instructions text (FAQ says Oktay provides these but they are not on the site)
* Real award placement and category text (six entries all show "TBA")

### Legal

* Privacy Policy page
* Terms and Conditions page
* Cookie or consent banner (if required in his customer geography)
* Legal review of any copy that makes claims (e.g. "Colorado's most awarded tattoo studio")

### Domain, hosting, and email

* Live production URL of the deployed site
* Custom domain (name, registrar, DNS status)
* Vercel project name and org
* EmailJS credentials (service, template, public key values, plus template destination email)
* ImgBB credentials (API key, album ID)
* IGZEK MEDIA hosting guard snippet install (if this site is meant to run under the ops app hosting model)
* Recurring hosting billing tier and Stripe subscription id (if under the ops model)

### Marketing and tracking

* Any analytics install (Vercel Analytics, Google Analytics, Plausible, etc.)
* Meta Pixel install if ads are planned to run
* Google Ads conversion tracking if ads are planned
* Conversion event definition for form submits
* UTM tracking or referral code system
* Google Business Profile status
* Newsletter or email list integration
* SMS notification on new booking

### SEO and discoverability

* `sitemap.xml`
* `robots.txt`
* Structured data (schema.org `LocalBusiness`, `Person`, `Service`)
* `metadataBase` URL
* Per section unique meta if adding a multi-page structure later
* Redirects from any legacy URLs (previous portfolio, previous booking service)

### Backend and data

* Persistence of booking submissions in a database or CRM (currently EmailJS only, no record beyond the email inbox)
* Calendar integration for reserved slots (currently the calendar accepts any day, does not block slots that are already booked)
* Payment processing for deposits (Stripe or otherwise)
* Client file sharing for design revisions

### Content and operations

* Content update cadence for portfolio (how often gets refreshed)
* Blog or journal section (not included, is it wanted)
* Press kit or high-res image pack
* Handoff document listing what Oktay owns, what IGZEK MEDIA maintains, and check-in cadence
* Metrics or KPIs for measuring the site's success

### Code cleanups and fixes

* Fix About "Follow the Work" link to point at `https://www.instagram.com/oktaytattooart` instead of Instagram root
* Reconcile Portfolio `works` array counts with the actual files on disk in `public/portfolio/`
* Reconcile "Blackwork" in metadata description with the multi-style About copy (pick one direction and align)
* Fill in real Award placement and category text for all six entries
* Remove or use `react-day-picker` (declared but not used)
* Remove or use `lucide-react` if it is not being pulled anywhere (verify)
* Add `prefers-reduced-motion` override to `globals.css`
* Switch from Google Fonts CDN `@import` to `next/font/google` for preload benefits (optional)
* Add hosting guard snippet if joining the ops app hosting model
* Sweep dashes in copy if applying the no-dash rule (currently present inside quoted paragraphs and in the booking error message)

### Systematization follow-up

* Decide whether Oktay's site pattern (portfolio-first, single page, gold accent, on page booking with calendar) becomes the "premium tattoo artist" template variant alongside the Asena / Bil / Aleyna patterns already extracted
* Decide whether to backfill this project into the `TATTOO-ARTIST-WEBSITE-PLAYBOOK.md` as the "single page + on page calendar booking" variant, versus keeping the standalone `/booking` route as the universal skeleton
