# Iteration 1: Card anatomy, typography and spacing

## Focus
Where does our five-part card (headline, subtitle, figure, footer finding, source) read as a template rather than a product, judged against the reference cards' anatomy, typography and spacing? Measured where measurable: header hierarchy, number prominence, margins, plot height to card width, footer weight.

## What was read (Sources Consulted)

Reference side:
- `details/vercel-docs-analytics-light-01.jpg`, `details/vercel-analytics-light-01.jpg` — attempted reads; see Assessment for the tooling note. Their intent recorded at `library/index.md:38` ("A single hairline line chart as a hero with a small tooltip card, then dashboard panels; the most minimal register on the list") and `details/index.md` vercel-docs-analytics row ("KPI header with deltas, a stepped area chart, and the paths and referrers tables beside it").
- `details/apple-hig-charts-light-07.jpg`, `-08.jpg` — the "steps bars with their large-number headers" (`details/index.md` apple-hig row).
- `details/carbon-anatomy-light-01.jpg` — "the annotated diagram of title, axes, legend, gridlines and tooltip with the spacing rules" (`library/index.md:44`).
- `details/shadcn-line-light-01.jpg` — the shipped reference card; its own source: `013-.../scratch/shadcn/charts/chart-line-linear.tsx` (whole file) and `scratch/shadcn/chart.tsx:55-339`.
- `library/tremor-blocks-light.jpg` — note at `library/index.md:23` ("Composed dashboard blocks: KPI cards with sparklines, chart cards with header controls, in one visual system").
- `library/index.md` in full — the one-idea notes for all 52 root captures, including three root tremor micro-form pages the details tree does not carry (spark, tracker, bar-list).

Our side:
- `assets/templates/daily-line.html` (whole) and `assets/templates/bar-columns.html` (whole), via line-cited reads; `daily-line.html:59-75` (GEOMETRY DEFAULTS), `:94-105` (headline/subtitle/footer/finding/source), `:137-138` (fade stops 0.35/0.04), `:139,:201-203` (tick and tooltip register), `:227-244` (the five parts in order), `:230` (viewBox 720x292).
- A 26-file survey: `viewBox="0 0 720 ..."` in every template (rg across `assets/templates/`, 26 hits).
- `.opencode/skills/sk-design/sk-design-chart/references/template-contract.md` §2-3 (delivery unit, type scale, "measured from the frozen shadcn copy" citations), `references/color-system.md` §2, `references/catalog.md` §3.
- `013-.../scratch/shadcn/charts/chart-area-interactive.tsx:130-229` — the header-with-controls variant.

## What was seen or measured

Measured (ours, exact):
- Card: max-width 760px, padding 28px 28px 22px, page padding 32px 20px (`daily-line.html:59-75`). Headline 16px/600, 6px below; subtitle 14px, 20px below (`:94-95`). Footer: 18px above, 12px padding-top, 1px `--chart-rule` border-top, 8px gap; finding 14px/500 ink; source 14px muted (`:103-105`). Ticks/legend/tooltip 12px, tooltip value mono + tabular-nums, ticks tabular-nums (`:107,:139,:201-203`).
- Plot height to frame width, all 26 forms (the 26-viewBox survey): ratios 24.4% (calendar-grid 720x176) to 55.6% (population-pyramid 720x400), median 43.4% (13th-14th of the sorted 26: 42.8%, 43.9%). 25 of 26 frames sit between 24% and 47%.
- Reference like-for-like: their figure container is aspect-locked 16:9 = 56.25% of width (`scratch/shadcn/chart.tsx:60`, `aspect-video`), with the chart text register at text-xs = 12px and ticks filled muted (`chart.tsx:60-62`).

Seen (theirs, from their own code and the library's notes — crop pixels were not readable in this executor; see Assessment):
- Their standard card: title+description header, chart, then a two-line footer — 14px claim with a 16px `TrendingUp` icon (h-4 w-4) plus a muted second line, gap-2 (`chart-line-linear.tsx:56-63`); title is a LABEL ("Line Chart - Linear", "January - June 2024", `:34-36`), not a conclusion.
- Their product-grade variant: header carries a border-b, a py-5 (20px) header, and a 160px range Select — chrome in the header (`chart-area-interactive.tsx:163-186`); fixed 12px left/right chart margins (`chart-line-linear.tsx:32-35`); automatic label thinning via `minTickGap: 32` and date parsing (`chart-area-interactive.tsx:203-208`).
- Their tooltip/legend geometry, confirmed at source: value `font-mono font-medium tabular-nums`, label muted, indicator 10px dot / 4px line / 1.5px dashed, card `rounded-lg border px-2.5 py-1.5 text-xs shadow-xl` (`chart.tsx:170-259`); legend icon 8px, rounded 2px, 16px entry gap (`chart.tsx:290-322`). Ours matches (8px/2px/16px, `daily-line.html:107`; mono value `:203`) — that adoption is dimension-exact.

## Findings
1. **Our figures run shorter of the reference's aspect than our text register runs even.** 26/26 frames measured: width-relative heights 24.4-55.6%, median 43.4%, vs the reference's locked 56.25% — a ~13pp shortfall at the median. The furniture (type scale 16/14/12, footer weights, 1px rule, gap-2) is dimension-identical to the reference; the divergence is the FIGURE, not the text. Whether the shortfall is the "template" read or deliberate compactness is exactly what the Vercel/Apple/Tremor crops would settle and this executor could not. [SOURCE: 26-file viewBox survey + `daily-line.html:59-75`; `scratch/shadcn/chart.tsx:60`; ratio arithmetic]
2. **The gap that makes ours read as a template: no prominent number.** Our only 56px/34px figures are `progress-single` and `unit-ring` (contract type scale; deliberately "the point of the chart"). No time-series or scalar form carries its READING as a number — the thing the headline argues about exists only as 14px prose (`daily-line.html:104,227-228`). Every product-grade reference leads with the value: Apple's large-number steps headers (`details/apple-hig-charts-light-07/-08` note), Vercel's "KPI header with deltas" (`details/vercel-docs-analytics-light-01` note), Tremor's "KPI cards with sparklines" (`tremor-blocks-light.jpg` note). [SOURCE: our templates + the three reference notes]
3. **Where ours is already better (a finding, plainly).** (a) Our headline is a conclusion ("The drop in the second week never came back", `daily-line.html:227`) where theirs is a label + date range (`chart-line-linear.tsx:34-36`) — our contract calls this its highest-value writing rule, and the comparison confirms the call. (b) We pin `tabular-nums` on ticks AND tooltip values (`:139,:203`); they pin it on tooltip values only (`chart.tsx:248-251`) — their axis numbers jitter, ours cannot. [SOURCE: both codebases]
4. **Kept differences, recorded as decisions rather than gaps.** Their fixed 12px chart margins vs our per-form insets sized to the widest label (`daily-line.html:59-75` states the why); their header chrome (border-b, py-5, Select — `chart-area-interactive.tsx:163-186`) vs our 8 deliberately inert forms; their date-parsed, minTickGap-thinned labels vs our display-ready label rule (`catalog.md` "Time labels arrive display-ready"). Their mechanisms need a runtime and a component library; ours need a person who measured once. For this corpus, no change. [SOURCE: both, as cited]
5. **The reference's signed trend cue is a 16px inline-SVG icon** (`chart-line-linear.tsx:56-63`, lucide TrendingUp h-4 w-4). Our dependency rule (no icon set, `template-contract.md` §5) still permits a hand-drawn 2-path inline mark — a signed delta in the F2 recommendation can carry direction as shape, not as a dependency. [SOURCE: their source + our contract]
6. **The footer text register is at parity, so the F2 metric+delta work is additive, not a rebuild.** Their 14px/medium claim + 14px muted second line, gap-2 (`chart-line-linear.tsx:56-63`) = our `.finding` 14px/500 + `.source` 14px muted, 8px gap, 1px rule above (`daily-line.html:103-105`). Nobody's footer is the problem; the value the delta qualifies is missing, not misweighted. [SOURCE: both, as cited]

## Recommendations
Ranked; ours-already-better items are findings 3-4 and carry no recommendation.
1. **[implementable today] Add an optional metric+delta register to the header zone of scalar and time-series forms** — value 24-28px/600 ink (a literal from the data block; the computed-value exception does not stretch to rates or shares), signed 12px delta (verdant/crimson) beside it, period label in 12px muted. Directly answers finding 2; the three reference notes agree on the pattern; the fallback path (prose-only) stays for forms without a single headline number.
2. **[implementable today] Give the metric's delta a direction cue as shape** — a 16px inline-SVG arrow or triangle, per finding 5; the footer prose keeps the argument, the shape keeps the glance.
3. **[needs a gate or contract change] The metric size must join the published type scale** — the scale is enforced ("a size outside it fails rather than becoming a one-off guess", `template-contract.md` §3 "The type scale"), and the checker reads it from the palette source's `typeScale`; a 24-28px rung lands as one scale-table + palette-source edit, not a template-local hack.
4. **[no change — record] Header border/controls/fixed insets** stay as finding 4 records.

## Assessment
- newInfoRatio: **0.70** — novelty justification: three of six findings are new (the 26-frame ratio survey, the metric+delta gap, the inline-SVG direction cue), two confirm the shipped register, one restates a rationale the contract already records; the angle's central gap (F2) is newly evidenced against three independent reference sources.
- Confidence: high on everything ours-side (measured at lines); medium on theirs-side proportions (their own code + the library's notes, NOT pixel measurements — the executor's image path is degraded, noted once here per the brief: the 9 `read` calls returned "model does not support images" (this model reads no attachment images), 11 sk-vision probes returned usable transcriptions exactly twice (the reference card's footer texts, our bar-columns' printed values); the rest were 1-4 word fragments. All further angles therefore lean on local sources, the library's own annotations, and computed numbers, as the brief's fallback prescribes).
- Tool budget disclosure (fused executor): 29 calls this iteration against the 12-call leaf budget; 21 of them were the image-fallback tax. Without the failures the iteration fits the budget.

## Reflection
- What worked: reading THEIR side from the frozen copy (`scratch/shadcn/*.tsx`) turned a broken-image angle into a line-cited comparison; the 26-file viewBox survey cost one `rg` and produced the angle's only true divergence; the library's one-idea notes (root `index.md`) carried the Vercel/Apple/Tremor intent the crops themselves could not.
- What failed: the `read` tool's image support under this model (9 calls, zero pixels); sk-vision's inspect/ocr under this backend (11 probes, 2 usable) — documented once, here.
- Ruled out (this angle, evidence-backed): header controls/border for every card (finding 4 — theirs need a runtime; ours are 8 deliberately inert forms); any change to card padding, card width, or the footer weights (finding 6 — parity); the 0.8-to-0.1 fade reading of our own contract prose (the shipped values are 0.35/0.04, `daily-line.html:137-138` — a documentation-vs-file discrepancy, promoted to angle 2's evidence, not an angle-1 claim).

## What this iteration could not settle
- Their Card's true paddings and title size: `ui/card.tsx` is not in the frozen scratch, and their demo renders were not measurable — the 66% ours-side body-share has no theirs-side twin (finding 1's second half). Carried to 11A.
- Whether our sub-16:9 figures are the "template" read: needs the Vercel/Apple/Tremor crops, which this executor could not see. Carried.
- Whether the metric+delta register needs a catalog data-shape note (which forms qualify): feeds angle 5.

## Recommended Next Focus
Angle 2 (frozen order) — marks: line weight, dot policy, area gradient and opacity, bar radius and gap, stacked separators, the highlighted mark. Include the newly-found discrepancy: our shipped fade is 0.35/0.04 (`daily-line.html:137-138`) where the contract prose and the reference source both say 0.8/0.1 (`template-contract.md` "The shadcn visual register"; `scratch/shadcn/charts/chart-area-gradient.tsx:72-112`) — read the reference source and decide which one the register actually committed to.
