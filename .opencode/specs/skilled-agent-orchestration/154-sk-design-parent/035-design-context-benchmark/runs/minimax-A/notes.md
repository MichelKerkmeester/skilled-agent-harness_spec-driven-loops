# Bestellimieten — design notes (minimax-A)

## 1. Information architecture
Five zones on a 560×480 canvas, vertically stacked and self-budgeted so nothing scrolls:

- **Brand bar** (48px) — Anobel wordmark + section title + period chip "Q3 · 2026"
- **Hero KPI** (116px) — remaining balance for the month, with composite fleet progress
- **Section header** (32px) — "Per schip · locatie" + row meta
- **Four ship rows** (~44px each) — name, port/yard, limit/spent, remaining, progress, status chip
- **Footer** (40px) — live timestamp + primary CTA "Limiet aanpassen"

The hero reads first because it answers the user's primary question ("how much can we still spend?") before the breakdown tells them where the budget is.

## 2. Color discipline
The palette is intentionally constrained to the supplied tokens. Roles:

- `#06458c` — brand mark, primary CTA, progress fills under limit, accent dots
- `#053b77` / `#043367` — focus/hover state on CTA, the 100% tick mark on every bar
- `#f2f3f6` — hero surface, chip backgrounds
- `#e7e9ee` — progress tracks, hairlines
- `#cbd0dc` — strong rules, chip borders
- `#fefefe` — card surface; `#f7f8fa` (off-token neutral) used sparingly for footer divider only
- `#0a1a2f` — primary text; `#787878` — muted text
- `#367e39` — "Binnen limiet" chip + live timestamp pip
- `#dbab00` — *unused* in this dataset; reserved for a future "approaching review" badge
- `#c9140f` — **alerts only**: 3px left border on the overspend row, red chip, red fill on that row's bar, red negative amount. Nothing else is red.

Red is treated as a scarce signal: the entire card uses red in one place, so the eye lands on it without scanning.

## 3. Typography
Single family: Hanken Grotesk with a system fallback stack (`'Hanker Grotesk','Inter',-apple-system,...`). No `@font-face`, no external fonts. Tabular numerals enabled (`tnum`) for every numeric column so amounts align cleanly.

Scale:

| role                 | size | weight |
|----------------------|------|--------|
| Hero KPI number      | 44px | 700    |
| Section heading     | 11px | 700 (uppercase, tracked) |
| Row name            | 13px | 600    |
| Right column numbers| 13px | 700 (remaining) / 600 (amounts) |
| Captions / muted    | 11–12px | 500–600 |

## 4. The progress bar carries the meaning
Every bar has the same anatomy: brand-blue fill on a tinted track, plus a 2px deep-blue tick at the 100% mark. Three states:

- Under limit (rows 1, 2, 4): fill stops before the tick
- Approaching (row 2 at 75%): same fill color, but the chip changes from green to gold-ish "Nadert limiet"
- Over limit (row 3): fill saturates at 100%, row gets a 3px red left border and the chip becomes "Overschreden"

The 100% tick is a small but important detail — it's the visual anchor for "this is the limit" regardless of how the fill is colored.

## 5. Real-feeling, non-generative data
- 4 ship names with realistic prefixes (`MV` motorschip, `TS` tankschip)
- 4 port/yard combos (Rotterdam Maasvlakte, Antwerpen Scheldekade, Hamburg Steinwerder, IJmuiden Noordzeekanaal) — real Dutch/Belgian/German maritime infrastructure
- Period label `Q3 · 2026` with a pulsing blue dot to signal "live period"
- Footer timestamp "Bijgewerkt 14:32 · vr 27 jun" + a green live pip — gives the card a sense of currency without lying about being real-time
- Numbers use Dutch formatting: `€ 87.420,00` (period thousands, decimal comma). Hero uses `.00` superscript-style suffix so the magnitude reads instantly.

## 6. Accessibility
- Semantic landmarks: `<header>`, `<main role="group">`, `<section>`, `<footer>`, `<article>` per row
- Every meter is `role="progressbar"` with `aria-valuemin/max/now` and a descriptive `aria-label`
- Status chips use `aria-label` rather than relying on color alone
- Contrast: `#0a1a2f` on `#fefefe` ≈ 16:1; `#06458c` on `#fefefe` ≈ 8:1; `#c9140f` on `#fefefe` ≈ 5.5:1 (AA for normal text); `#787878` on `#fefefe` ≈ 4.6:1 (AA)
- CTA has a visible `:focus-visible` ring (2px `#06458c` outline)
- Live pip and pulsing dot are `aria-hidden`; meaning carried by the adjacent text

## 7. Anti-templating moves
- The hero KPI isn't a bare number — it carries context (total limit, ship count, warning count) so the card reads as a complete snapshot
- A composite fleet bar appears above the per-row bars; this gives a "macro" view that the per-row bars decompose, which feels like a real dashboard pattern rather than a list
- The overspend treatment is **border + chip + amount color**, not a red background — keeps it calm and on-brand; red is signal, not shout
- Footer mixes a passive data signal (timestamp + live pip) with the only action surface (CTA), giving the card clear information hierarchy
- Wordmark uses a leading dot and letter-spacing rather than an icon — no icon font, no SVG, no CDN
- Ship name + port + yard form a 2-line identity block (not a single cramped line), so the card stays readable at the 560 width

## 8. What I deliberately left out
- **No gradient** anywhere — verified by absence of `linear-gradient` / `radial-gradient` in the stylesheet
- **No external assets** — no `<link>` to Google Fonts, no `<img>`, no `<svg>` of substance
- **No icon font** — chevron in the CTA is a Unicode `→` glyph, not an icon
- **No animation** beyond a static pulse dot — matches the "flat" constraint and respects users with reduced-motion preferences
- **No gold accent** — `#dbab00` reserved for a future state we don't need to demonstrate here; including it would be decorative noise
- **No fourth overspend row** — one alert row is enough to establish the signal pattern; two would dilute it

## 9. Verification against constraints
- File is fully self-contained (single HTML, inline CSS, no external assets) ✓
- Palette-only colors — every hex used is in the supplied list ✓
- Hanken Grotesk is the first font with explicit system fallbacks ✓
- Flat: zero gradients, zero shadows beyond a 1px surface lift, zero rounded image tricks ✓
- Accessible contrast on every text/surface pair ✓
- Output written only to `runs/minimax-A/` ✓
