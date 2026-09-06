# Iteration 002 — Styling & theming system (KQ3)

- **Focus:** Design tokens, CSS variable layer, dark mode, radius, spacing scale, typography scale, motion defaults — concrete values — compared against the corpus palette system.
- **Method:** Read `src/app/globals.css` (559 lines, all), `components.json`, `package.json` (head); target `assets/color/palettes.json` (all), `references/color-system.md` (all), `scripts/check-corpus.cjs` (head, 715 total), plus a mechanical audit of radius/typography across the 20 templates via grep.
- **All citations resolve inside `.../context/evilcharts/`.**

## Key findings

**F2.1 — Token layer: shadcn semantic roles over oklch.** `:root` defines `--radius: 0.525rem` (8.4px) and a full neutral ramp in pure oklch with zero chroma: background `oklch(1 0 0)`, foreground `oklch(0.145 0 0)`, muted `oklch(0.97 0 0)`, muted-foreground `oklch(0.4 0 0)`, border `oklch(0.922 0 0)`. [SOURCE: src/app/globals.css:54-100]

**F2.2 — Five chart hues per theme, re-hued (not lightened) in dark.** Light: chart-1..5 = oklch(0.646 0.222 41.116), oklch(0.6 0.118 184.704), oklch(0.398 0.07 227.392), oklch(0.828 0.189 84.429), oklch(0.769 0.188 70.08) (orange, teal, dark blue, yellow, amber). Dark: oklch(0.488 0.243 264.376), oklch(0.696 0.17 162.48), oklch(0.769 0.188 70.08), oklch(0.627 0.265 303.9), oklch(0.645 0.246 16.439) — violet, green, amber, magenta, red. The dark set shifts hue, not just lightness. [SOURCE: src/app/globals.css:75-79, 122-126]

**F2.3 — Dark mode is a first-class twin.** Whole `.dark` block: background `oklch(14% 0 270)` (near-black with a slight blue cast), dark borders are white at alpha — `--border: oklch(100% 0 271.152 / 0.075)` and `--sidebar-border / 10%` — so borders read as translucency over the ground rather than solid grey. [SOURCE: src/app/globals.css:102-147 (esp. 103, 119, 133)]

**F2.4 — Radius ladder is a single knob.** `--radius-sm: calc(var(--radius) - 4px)`, `--radius-md: calc(var(--radius) - 2px)`, `--radius-lg: var(--radius)`, `--radius-xl: calc(var(--radius) + 4px)`. One value scales every corner in the product. [SOURCE: src/app/globals.css:47-50, 55]

**F2.5 — SVG hygiene rules.** All svg/text-shaped elements get `outline: none !important; box-shadow: none !important` on focus (kills double rings around chart marks), and `text, tspan { user-select: none }` (dragging a chart never accidentally selects labels). [SOURCE: src/app/globals.css:318-337]

**F2.6 — Typography.** Chart text base is `text-xs` = 12px (set on the chart container, recharts-chart.tsx:112); tooltip values are mono `tabular-nums`; docs body is a separate scale. The `easing-gradient` utility (559-line file tail) builds a 24-stop perceptual gradient ease in oklch via `color-mix`. [SOURCE: src/app/globals.css:338-559; src/registry/ui/recharts-tooltip.tsx:154]

**F2.7 — Build & registry mechanics.** `registry:build` (bun, `src/scripts/build-registry.mts`) regenerates `registry.json`, `public/r/`, and `src/registry/__index__.tsx`; `components.json` points `@evilcharts` registry at `http://localhost:3000/r/{name}.json` (a locally served shadcn registry); baseColor `neutral`, style `base-nova`, icon library lucide. [SOURCE: components.json:1-23; package.json:11-13]

## Corpus-side comparison (audit, grep across the 20 templates)

- `border-radius: 10px` appears **exactly 20 times** — every template already carries an identical card radius, enforced by nothing.
- Font sizes in use: 13px (×63), 12px (×32), 15px (×21), 21px (×20 headlines), 14px (×20), 11px (×18) — an undocumented but consistent scale.
- `prefers-color-scheme`: **0 of 20** templates carry any dark-mode support.
- No SVG `rx=` corners: corpus marks are deliberately square-ended; evilcharts rounds bar corners (radius `[r,r,r,r]`, e.g. brush mini-chart barRadius default 3).

## RANKED CHANGES TO sk-create-chart

| # | Change | Evilcharts evidence (resolves) | Target | Verdict | Level | Route to single self-contained offline HTML |
|---|---|---|---|---|---|---|
| 1 | Ship a dark twin for every palette: second sentinel-dark block per template under `@media (prefers-color-scheme: dark)`, with series values re-hued (not merely lightened) and dark rules as ink-at-alpha rather than solid grey. Palette source gains per-system `seriesDark`/`chromeDark` values; checker gains a dark section | globals.css:102-147, 119 | `assets/color/palettes.json` (add dark fields) + `assets/templates/*.html` palette blocks + `scripts/check-corpus.cjs` (dark section) + `references/template-contract.md` §3 (document the second block) | ADOPT AS IDEA | contract-level (operator decision: contract says "exactly one palette block"; a second media-scoped block is a contract amendment — mechanically checked the same way) | CSS custom properties inside the existing `<style>`; zero deps, still one file; falls back to light everywhere media queries don't reach |
| 2 | SVG hygiene pair for any template that becomes interactive: focus outline/box-shadow suppression on svg shapes + `text, tspan { user-select: none }` | globals.css:318-337 | `assets/templates/*.html` (only the ones gaining interaction from iteration-1 change #4: grouped-bars, stacked-bars, stacked-area, daily-line) | ADOPT AS IDEA | template-level | Two CSS rules in the existing style block |
| 3 | Formalize the radius convention: add `radius` (card) and `radiusMark` (0 for corpus) to the chrome roles in palettes.json so the contract's "corner radius identical everywhere" claim (color-system.md §3) becomes checkable; document `border-radius: 10px` as the value | globals.css:47-50, 55 | `assets/color/palettes.json` + `references/color-system.md` §3 + checker (advisory assert) | ADOPT AS IDEA | template-level (formalizes existing practice; no template redraw — 10px already uniform) | Palette block extension; no runtime cost |
| 4 | Publish the typography scale the corpus already uses (21 headline / 15 subtitle / 13 labels / 12 tick / 11 minor) as named roles in the contract skeleton comment; adopt evilcharts' mono tabular-nums rule for data values in tooltips and source figures | recharts-chart.tsx:112; recharts-tooltip.tsx:154 | `references/template-contract.md` §3 skeleton comment (documentation of existing practice) + templates with hover (value formatting) | ADOPT AS IDEA | template-level | Doc + CSS only |
| 5 | Dark-mode hue rotation as an aesthetic principle (dark themes get different hues, not tinted light hues) | globals.css:75-79 vs 122-126 | folded into change #1 | ADOPT AS IDEA (part of #1) | contract-level (same amendment) | CSS vars |
| 6 | Five-hue library-style categorical default | globals.css:75-79 | — | REJECT WITH REASON: corpus capacity ceilings (4 categorical, palettes.json:44-50) and the greyscale-survival luminance spread are deliberate; a fifth hue is a library default the corpus out-thought | contract-level | n/a (rejected) |
| 7 | oklch neutral ramp replacing warm hex paper (`#FAF8F5` surface, `#1A1917` ink) | globals.css:54-100 | — | REJECT WITH REASON: the warm paper surface is the corpus's visual identity and is hand-editable hex (the reader edits numbers by hand); contrast gates already enforce the function oklch optimizes | contract-level | n/a |
| 8 | 24-stop perceptual `easing-gradient` utility | globals.css:338-559 | — | REJECT WITH REASON: no corpus form consumes a perceptual gradient ease; complexity without a consumer (the corpus's own standard for cutting, color-system.md §7) | contract-level | Technically reachable as plain CSS — rejected on grounds of no consumer |
| 9 | shadcn registry serving (`components.json` registries → localhost HTTP, build-registry script, public/r items) | components.json:21-23; package.json:11-13 | — | REJECT WITH REASON: build-tool registry mechanics contradict the no-build-step delivery contract; corpus catalog fences (check-corpus.cjs:34-35) already machine-index the packet | contract-level | Cannot — inverts the delivery model |

## Ruled out / tried and failed this iteration

- Reading the full `easing-gradient` derivation math beyond confirming it is a perceptual ease — no corpus consumer, stop at classification.
- No writes outside the lineage directory; subject and target read-only.

## newInfoRatio: 0.6 (partially new — the evilcharts token layer is new evidence feeding KQ3/KQ4, but a third of the iteration's findings are confirmations that the corpus already meets or beats evilcharts on colour semantics; novelty justification: concrete dark-mode, radius-ladder and SVG-hygiene patterns are all absent from the corpus and all adoptable)

**Next focus (iteration 3):** KQ2 catalog of forms — read `registry.json` structure, all 16 `src/registry/charts/*` compositions (form + composition), `src/registry/blocks/`, `src/registry/examples/`; read `references/catalog.md` + 2–3 target templates for form-level comparison; classify each form: exists-in-both / only-there / only-here; extend the ranked list with catalog-level changes.
