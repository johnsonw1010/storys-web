# Storys — Brand Voice (episode blurbs & site copy)

> **On-disk memory for the content loop** (loop-eng Build 2). Every drafting run — the
> writer agent, the checker agent, and any human editing at the gate — reads this file first.
> Canonical copy lives here in the repo (the drafting loop runs in-repo); mirror to the
> Obsidian hub `projects/storys/storys-brand-voice.md` if you want it in the vault too.
>
> **Source of truth:** reverse-engineered from the 11 human-approved blurbs
> (`src/lib/episode-summaries.json`, eps 1·3·5·7·8·9·10·11·12·13·15) + the VIS.
> Johnson edits/approves this file; the writer must not drift from it.

---

## Who we are
**Storys（創業之聲）** is a Traditional-Chinese podcast that tells the real stories of
Taiwanese brand founders. Tagline: **從第一步，到每一步 / from first step to every step.**
The name *is* the promise — **we tell stories, we don't write PR.** Every episode is one
founder's arc; every blurb should read like the opening of a good long-form profile.

## The one-line voice
> **Editorial, warm, and sharp — an admiring but analytical storyteller.**
> Concrete over abstract, tension over summary, earned insight over hype.
> Never fluffy PR; never dry corporate. Traditional Chinese, Taiwan business usage.

---

## Blurb anatomy (match this exactly)
Each episode summary is a JSON object with **`blurb` · `takeaways`(×3) · `metaDesc`**.

### 1. `blurb` — 120–170 Chinese characters, one paragraph
- **Hook first.** Open on a paradox, tension, surprising image, or a real question —
  *not* a summary sentence.
  - ✅ 「一台從國外買回、改了又改的二手列印機，竟長成台灣少數打進國際的 3D 列印品牌。」
  - ✅ 「年收千萬卻毅然離開夜市、如今展店超過三十間的飾品品牌 Vacanza…」
  - ✅ 「募到再多錢，為什麼有人捐得不甘願？」(a question hook)
  - ❌ 「這集我們訪問了 XX 品牌的創辦人，聊他的創業故事。」(dead summary open)
- **Then the arc:** origin → struggle/insight → what it became. Present-tense narration.
- **Name the founder** with the English name in parens on first mention:
  吳彞任（Ray）· 邱光宗（KT）· 張文哲（Russell）· 陳明明.
- **Land on the theme** in the last sentence: 「一段把危機化為轉機的創業故事。」
- End with the brand + what this episode is really about.

### 2. `takeaways` — exactly **3**, each `{ title, body }`
- **`title` = a memorable, often contrarian principle** (aphorism / imperative), ~6–14 chars:
  - 「先求能走，再求跑得快」·「與其挑一桶水，不如幫他挖一口井」·「錯了就改，速度決定一切」·
    「看著存款下降會慌，就先別創業」·「被同業看不起的技術，反而是缺口」
- **`body` = 50–95 chars**: explain the principle **through the specific story detail** —
  the number, the mechanism, the decision. Show the receipts, don't assert.
  - ✅ 「…把固化時間從 10 秒壓到 1.5 秒，速度提升五倍，重新定義了這個賽道。」
- Three takeaways should span **different beats** (a tactic, a mindset, a hard truth), not
  three angles on the same point.

### 3. `metaDesc` — ~150 chars, SEO/AEO
- Formula: **「{品牌} 創辦人{姓名}（{English}）專訪：{arc in one breath}。」**
  - 「普羅森 Phrozen 創辦人吳彞任（Ray）專訪：從杜邦工程師到自建光固化材料，把被看衰的 LCD 做成五倍速主流，帶台灣 3D 列印品牌走向世界。」
- Front-load 品牌 + 姓名 + 「專訪」 (what people search). One sentence, no line breaks.

---

## Do
- **Ground every claim in a concrete detail** — a number, a date, a place, a decision.
  (12 分鐘清 12 萬張票 · 過敏率壓到 2% · 50 億集資 · 選行政院公告最貴的雞蛋.)
- **Keep the founder the hero.** We narrate their choices; we don't lecture.
- **Use Taiwan-natural business vocabulary**, including the loanwords founders actually use
  (紅海 · 飛輪 · 溢價 · TA · insight · moment · MVP) — but sparingly, never as filler.
- **Let contrarian truths breathe** — the best takeaways surprise ("被看不起的技術反而是缺口").

## Don't
- ❌ No hype adjectives without proof (革命性 · 顛覆 · 神級 · 完美). If it's great, *show why*.
- ❌ No dead openings ("這集訪問了…"), no "在本集中".
- ❌ No Simplified Chinese, no Mainland-usage terms (用「行動」不用「移动」, etc.).
- ❌ Don't invent facts, quotes, numbers, or titles. If the transcript doesn't say it, it
  doesn't go in. (The checker enforces this against the transcript.)
- ❌ Don't overstate the host's opinion as fact on 回顧/discussion episodes.
- ❌ **No cross-episode contamination.** Draft ONLY from this episode's own transcript. Multi-part
  series (Part 3 vs Part 4) and interview/回顧 pairs share a story — but if a fact was said in the
  *other* episode, it doesn't go in this one. (The most common writer failure in practice: eps 21 and
  50 both pulled facts from their sibling episode's transcript and needed checker rework.)

## Special formats
- **回顧 / discussion episodes** (e.g. ep 8): frame as the hosts (Jonathan · Tim · Johnson)
  reflecting after the interview — "三位主持人回到麥克風前，聊…". Takeaways = the ideas they
  surfaced, not a founder's principles.
- **Multi-part series** (e.g. Vacanza eps 9–13): label the part + its beat in the blurb
  ("Part 1 起源篇…"), keep continuity across parts, don't repeat the same three takeaways.

## Mini-glossary / spellings (lock these)
- 品牌與人名照官方：真芳炭烤土司 · 拓元售票 tixCraft · 酷遊天 KKday · 假期飾品 Vacanza ·
  貝殼放大 · 普羅森 Phrozen. English names in parens on first mention.
- Show name in copy: **Storys 創業之聲**. Series JSON-LD name: 「Storys 創業之聲」.

---

## The loop (writer ≠ checker, human-gated) — how this file is used
1. **Writer agent** (cheap model): transcript → `blurb` + 3 `takeaways` + `metaDesc`,
   following this file. Output `status: "draft"`.
2. **Checker agent** (Opus, *separate*): verify against the transcript —
   (a) every fact/number/name is supported, (b) voice matches this file, (c) zh-Hant reads
   naturally, (d) lengths in range. Flag → writer revises. On pass → `status: "ready-for-review"`.
3. **Human gate (Johnson):** edit/approve in the sheet → only `approved` renders on the site.
   **Nothing AI-written publishes unreviewed.**

*Checker rejection criteria (fail if any):* fabricated detail · Simplified/Mainland usage ·
hype-without-proof · dead opening · wrong founder/brand name · takeaway not in transcript ·
blurb outside 120–170 chars.
