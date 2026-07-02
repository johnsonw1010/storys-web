# Storys — Content Setup Guide (for VA)

Hi! This is mostly a **one-time setup** to get the Storys website's content complete and accurate. It's organized admin + web research — no coding. After this first pass, upkeep is light (just the occasional new brand or store). Read "Before you start," then do the tasks in order.

> **Don't worry about breaking anything:** your edits don't go live instantly, and everything is reviewed before it ships. Just aim for accuracy and ask if unsure.

---

## Before you start — you need these
> 🟨 **Johnson: fill blanks 3 & 4 before sending.**

1. **Master Sheet (Google Sheets):** https://docs.google.com/spreadsheets/d/1axbM6qDG1pz1jCZ3_NyBZWtgcNbNb6cNtnou7FBI2P4/edit
   👉 It already has **three tabs**: `Episodes`, `brands`, `locations`. **Edit only this sheet.**
2. **Logos folder (Google Drive):** https://drive.google.com/drive/folders/1F_r8yBFLPXXVwsCGM4iN3fV3jtQSna1L
   👉 Drop each brand logo here, named `{id}.png`.
3. **Questions / send finished work to:** 🟨 ‹‹ name + email/LINE ››
4. **Deadline / priority:** 🟨 ‹‹ e.g. "logos by Fri, locations by next Wed" ››

---

## Is this a one-time job? — Yes
The sheet is already seeded with the 20 known brands and a starter set of store locations. You're **completing and verifying**, not starting from zero:
- **Logos** — collect a fresh, transparent, high-res logo for **every** brand (the old ones are being replaced).
- **Brands tab** — quick review; add any new brands Johnson gives you.
- **Locations tab** — the main task: add *every* store for each retail brand.
- **Episodes tab** — nothing for you; it's handled automatically.

---

## What "id" means (you'll see it everywhere)
An **id** is a short English nickname for a brand: lowercase English letters/numbers only, spaces → hyphens, no Chinese, no symbols.
- 真芳 碳烤吐司 → `zhenfang`  ·  Chill Ice Bath → `chill-ice-bath`
- Existing brands already have an `id` — **never change it.**
- A new brand gets a new id (made this way), and that **same id** is its logo filename.

---

## Task A — Brand logos  ⭐ start here
**Every brand needs a brand-new logo.** The current ones are too small and sit on a solid/wrong background, so we're replacing **all** of them. Collect one fresh logo per brand into the logos folder.
- **Filename = the brand's `id` + `.png`** — e.g. `zhenfang.png`, `vacanza.png`. (The `id` is the first column of the `brands` tab.)
- **All PNGs go directly in the one folder** — no subfolders.
- **Transparent background — REQUIRED.** The logo must sit on transparency (you'll see a grey/white checkerboard behind it when you preview the PNG), **not** inside a white or colored box. If you can only find it on a solid background, flag that brand — don't submit the boxed version.
- **Large & sharp** — at least **800 px** on the longest side (bigger is better). A vector logo (SVG) exported to PNG is ideal. No screenshots, no blurry or pixelated copies.
- **Official source only:** the brand's website footer / press or brand-kit page / official social profile.
- **Do every brand** in the `brands` tab (all 20) — plus any new ones Johnson adds.
- ✅ A transparent, high-res `{id}.png` in the folder = done for that brand. (Ignore the `has_logo` column — it's automatic.)

---

## Task B — `brands` tab (quick review + add new)
The 20 brands are already filled in. For each row:
1. Click the `website` link — confirm it opens and matches the brand.
2. If something's off (dead link, wrong name), **highlight the cell / leave a comment — don't rewrite descriptions.**
3. **Add new brands** (only the ones Johnson lists) as new rows — give each a lowercase `id`, pick one `category` from the allowed list, and collect its logo (Task A).

---

## Task C — `locations` tab ⭐ the main job
The map shows a pin for every physical store. The tab currently has only a starter set — **most brands are missing branches.** For **each retail brand**, add a row for **every** store:
1. Find the brand's official **門市 / 據點 / store-locator** page (best source — more reliable than Google Maps).
2. Add one row per store: **store name (zh/en) + full, exact address.**
3. **Fill `lat` / `lng` from Google Maps** — find the store in Google Maps, **right-click the pin → click the `25.0…, 121.5…` numbers to copy them**, then paste into the `lat` and `lng` columns. The **address must still be exact** too (building number, district, floor).
4. **`brand_id` must exactly match the brand's `id`** in the `brands` tab (lowercase).
5. **`kind` column:** leave it **blank** for any shop a customer can walk into. Type `hq` (lowercase) **only** for a company office/headquarters customers don't visit — those still show on the brand's page, just not as a map pin. (If a place is both a flagship store *and* the office, treat it as a store: leave blank. When unsure → blank.)
6. **Online-only brand with no place to visit?** Don't add location rows at all — just make sure its `type` is `online` in the `brands` tab, and it'll appear in the Online Directory automatically.

> Example: Vacanza has 30+ branches but only a handful are in the sheet — add the rest.

---

## Column reference

### `brands` tab
| column | required | what it is | example |
|---|---|---|---|
| `id` | ✅ | short nickname (see "What id means") | `zhenfang` |
| `name_zh` | ✅ | Chinese name | `真芳 碳烤吐司` |
| `name_en` | ⬜ | English name (blank → shows Chinese) | `Zhen Fang` |
| `category` | ✅ | pick exactly ONE (list below) | `food` |
| `type` | ✅ | `retail` (has stores) or `online` | `retail` |
| `desc_zh` | ✅ | 1–2 sentence Chinese description | … |
| `desc_en` | ⬜ | English description (blank if none) | … |
| `domain` | ✅ | domain, no `https://` (social-only → e.g. `instagram.com`) | `zhenfang.com.tw` |
| `website` | ✅ | full link | `https://www.zhenfang.com.tw` |
| `has_logo` | ⚙️ | ignore — automatic | |
| `hero_image` | ⬜ | leave blank | |

**Allowed `category` (use one):** food, fashion, wellness, tech, media, travel, platform, community, retail, creator, education, mobility, investment

### `locations` tab
| column | required | what it is | example |
|---|---|---|---|
| `brand_id` | ✅ | must match a brand `id` (lowercase) | `vacanza` |
| `name_zh` | ✅ | store name (Chinese) | `Vacanza Lab 實驗店` |
| `name_en` | ⬜ | store name (English) | `Vacanza Lab` |
| `address_zh` | ✅ | full Chinese address — **be exact** | `台北市中山區…` |
| `address_en` | ⬜ | full English address | `Zhongshan Dist., Taipei…` |
| `kind` | ⬜ | **blank** = a shop customers visit · `hq` = office/HQ they can't shop at | (blank) |
| `lat` | ✅ | from Google Maps (right-click pin → click to copy the two numbers) | `25.0330` |
| `lng` | ✅ | from Google Maps (copied together with `lat`) | `121.5654` |
| `gmaps_url` | ⬜ | **leave blank** — not needed (the site builds the Maps link automatically from the address/coords) | |

---

## ✅ You're done when…
- [ ] Every brand has a fresh `{id}.png` logo — **transparent background, ≥800 px** — in the folder (all 20 + any new brands).
- [ ] `brands` tab reviewed; any new brands added.
- [ ] **Every retail brand's stores fully listed** in `locations` with exact addresses **and lat/lng from Google Maps**.
- [ ] Tell 🟨 ‹‹ contact ›› it's ready for review.
