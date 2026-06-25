# Inbound forms — plan (save for later)

> Status: **not started.** This is a written plan to execute later, not current behavior.
> Today the forms are inert (see Context). Owner: Johnson.

## Context
The site moved from Netlify → Cloudflare Workers. The existing forms
(`contact`, `sponsor`, `brand-application` in `src/pages/contact.astro` + `apply.astro`)
still use `data-netlify="true"`, which **does nothing on Cloudflare** — submissions
currently go nowhere.

We want an **inbound** mechanism and prefer to stay in the **Google** ecosystem, because the
whole content model is already Sheets-as-CMS (one mental model: everything lives in Sheets).

## Recommended approach — on-brand form → Apps Script → Sheet
Keep the site's own styled Astro forms; POST them to a **Google Apps Script Web App** that
appends a row to a Google Sheet and emails Johnson.

**Why this one:** keeps forms on-brand (no Google-styled iframe), no new vendor, no
service-account / OAuth complexity (Apps Script runs as the sheet owner), free, and all inbound
lands in Sheets next to the rest of the content.

**Pieces to build:**
1. **Sheet** — new tabs (in the Master Sheet or a separate "Inbound" sheet): `inbound_contact`,
   `inbound_sponsor`, `inbound_apply`. Columns: `timestamp`, `name`, `email`, `message`, + intent-specific fields.
2. **Apps Script Web App** (`doPost`): verify a shared secret → `sheet.appendRow(...)` →
   `MailApp.sendEmail(...)`. Deploy as a web app with "Anyone" access; copy the deployment URL.
3. **Astro forms**: remove the `data-netlify` / honeypot Netlify attributes; on submit, `fetch()`
   POST the fields to the Apps Script URL; show success / error UI in-page.
4. **Spam**: keep a honeypot field; optionally add Cloudflare **Turnstile** (free, native to our host).

**Effort:** ~half a day.

## Fallback — Google Forms (ship-today, zero code)
One Google Form per intent; responses auto-collect in a Sheet; turn on email notification.
Link out (or iframe-embed) from a styled button on the page.
- Pro: zero code, instant.
- Con: Google's visual styling (off-brand), iframe embed feels bolted on.

Use this only if we need *something* working immediately; migrate to the recommended approach after.

## Open questions (decide at execution time)
- Responses in the **Master Sheet** vs a separate **Inbound** sheet? (Lean: separate, to keep
  content and leads apart.)
- Which destination email(s)? (`hi@` / `sponsors@` / `apply@`, or one inbox with subject prefixes.)
- Add Turnstile, or honeypot only?
- Form labels in zh + en.

## Trigger
Execute after the README/cleanup pass; can run independently of Phase 1. Not blocking.
