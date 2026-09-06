# Ranked Synthesis — evilcharts reference research (deepseek-flash-max lineage)

Fan-out lineage `deepseek-flash-max` · session `fanout-deepseek-flash-max-1788412334414-fbd7s9` · five iterations, stop policy max-iterations · subject pinned at `500ecd44c1fdcf319ba83ea68f3771bc76125974` (MIT, `context/evilcharts/LICENSE`).

**What this document is.** The operator does not like what `sk-create-chart` produces. This is the account of what the vendored evilcharts source does differently, reduced to ranked, concrete changes: what to change, in which file under `.opencode/skills/sk-doc/sk-create-chart/`, and why. Every row carries an evilcharts `file:line` that resolves inside `context/evilcharts/`, one of three verdicts, a template-level or contract-level label, and its route into the one-file no-build no-network contract.

**One correction that governs everything.** The packet's own rule `SKILL.md:134` — "Never copy a template, a fragment or a snippet from an outside chart library into this packet" — is a blanket ban that does not carve out MIT sources. The evilcharts licence permits reuse; the packet does not. Every adoption below is therefore an *idea* adoption (re-authored in the corpus's own idiom). There is exactly one row where the operator could choose code-copy (background patterns), and that row says so.

---

## 1. THE RANKED LIST

### Tier 1 — the "why it looks plain" fixes. Template-level, apply now.

| # | Change | Evilcharts evidence | Target file | Verdict | One-file route |
|---|--------|--------------------|-------------|---------|----------------|
| 1 | **Thin the marks.** Series strokes 2px → 0.8–1px; gridlines from 1px solid full-width → 1px dashed, horizontal-only; the file's own comment already calls for a hairline. Keep the ladder, thinning and anchoring rules untouched | `src/registry/charts/recharts-line-chart.tsx:56` (0.8 stroke), `:471-473` (dashed h-only grid), `:413-417` (no axis/tick lines); corpus side `assets/templates/daily-line.html:61-62` + `:101-102` (comment vs value) | `assets/templates/daily-line.html`, `daily-range.html`, `stacked-area.html`, and the shared `.grid`/`.line`/`.mark` CSS in `assets/color/palette-sheet-neutral.html` (skeleton) | ADOPT AS IDEA | Pure CSS property changes in the inline stylesheet |
| 2 | **Fade area fills toward the baseline.** Flat `fill-opacity: 0.10` → vertical gradient strongest at the line, dissolving to the axis (evilcharts uses 0.1 → 0) | `src/registry/charts/recharts-area-chart.tsx:766-768`; corpus side `assets/templates/daily-line.html:60` | `assets/templates/stacked-area.html`, `daily-line.html` (underlay), `daily-range.html` | ADOPT AS IDEA | `<linearGradient>` in the file's own defs, stops painted with `var(--chart-series-N)` |
| 3 | **Set every number in a system mono stack with tabular figures.** Ticks, value labels, notes, source line. The corpus already does `.tick`; extend to all numeric text | `src/registry/ui/recharts-tooltip.tsx:154` (`font-mono font-medium tabular-nums`); `src/app/globals.css:16` (mono token) | `assets/color/palette-sheet-neutral.html` (skeleton CSS) + all 20 templates | ADOPT AS IDEA | `font-family: ui-monospace, SFMono-Regular, Menlo, monospace` — system stack, respects the web-font ban at `template-contract.md:128` |
| 4 | **Highlighted-point language.** Small 3px dot per reading; 6px background-ring dot on the point the headline is about, so emphasis reads on any theme | `src/registry/ui/recharts-dot.tsx:83-106` (default r=3), `:110-141` (border r=6, ring in background colour) | `assets/templates/daily-line.html`, `stacked-area.html` | ADOPT AS IDEA | Inline SVG circles; the ring is `fill: var(--chart-surface)` |
| 5 | **Empty-data notice.** When the data block holds no readable values, the figure draws one line in the established notice voice ("no readings to draw") instead of an empty box. The playbook test "a chart that draws nothing" already names the failure | idea source: `src/registry/ui/recharts-chart.tsx:131-144` (a non-data figure state); carrier: corpus's own gap notice `assets/templates/daily-line.html:191-195` | all 20 templates | ADOPT AS IDEA | One conditional at the top of each drawing script; the notice is already an in-figure SVG text element |
| 6 | **Radius ladder.** Single 10px card radius → contextual 4.4/6.4/8.4/12.4px steps (card and tooltip 8.4px, swatches and dots 2–3px) | `src/app/globals.css:47-50`, `:55`; `src/registry/ui/recharts-tooltip.tsx:88`; `src/registry/ui/recharts-legend.tsx:146-147` | `assets/color/palette-sheet-neutral.html` (radius tokens) + affected templates | ADOPT AS IDEA | CSS custom properties in the skeleton's style block |

### Tier 2 — the interaction layer. Template-level, apply now (static files may be interactive; rule 12 bans randomness and clocks, not event handlers).

| # | Change | Evilcharts evidence | Target file | Verdict | One-file route |
|---|--------|--------------------|-------------|---------|----------------|
| 7 | **Hover tooltip** on mark-dense forms: a positioned overlay toggled per mark, styled on the evilcharts recipe — 8.4px radius, hairline border at 50% of the rule colour, 12px text, values in mono tabular figures, label medium | `src/registry/ui/recharts-tooltip.tsx:85-92` (card recipe), `:154` (value face) | `assets/templates/scatter.html`, `heat-matrix.html`, `calendar-grid.html`, `candlestick.html`, `box-plot.html`, `distribution-strip.html` | ADOPT AS IDEA | `mouseenter`/`mouseleave` per mark toggling a positioned SVG group; no network, deterministic |
| 8 | **Visual legend** inside the figure for every multi-series form: right-aligned row, 8px rounded-square swatch, 4px gap; the subtitle sentence stays the caption, not the legend | `src/registry/ui/recharts-legend.tsx:42-49` (row recipe), `:146-147` (default marker) | `assets/templates/grouped-bars.html`, `stacked-bars.html`, `stacked-area.html`, `parallel-axes.html`, `independent-percentages.html` | ADOPT AS IDEA | Inline SVG swatches + text |
| 9 | **Hover-dim**: hovering one series dims the others to 0.3 opacity, paired with the tooltip so the dimmed state always has a reading | `src/registry/charts/recharts-line-chart.tsx:542-548` | `assets/templates/grouped-bars.html`, `stacked-bars.html`, `stacked-area.html`, `parallel-axes.html` | ADOPT AS IDEA | One handler per series group adjusting `opacity` attributes |
| 10 | **First-paint reveal** on line/area forms: 0.6–1s left-to-right wipe (SVG mask, ease `[0, 0.7, 0.5, 1]`), gated behind `prefers-reduced-motion` per rule 13, fully settled before 1s so screenshots agree | `src/registry/charts/recharts-line-chart.tsx:59-60`, `:726-779`; contract `template-contract.md:166` (rule 13) | `assets/templates/daily-line.html`, `stacked-area.html`, `daily-range.html` | ADOPT AS IDEA | CSS `@keyframes` on a mask rect; settle time is the acceptance test for rule 12's two-screenshots agreement |

### Tier 3 — one new form. Template-level via the catalog's own authoring workflow.

| # | Change | Evilcharts evidence | Target file | Verdict | One-file route |
|---|--------|--------------------|-------------|---------|----------------|
| 11 | **Composed magnitude-and-rate form** (`bar-line-composed`): bars for a count series, line for a rate series on a shared axis, the rate on a right-hand scale only when magnitudes differ by an order. This answers the spec's open question: yes, one evilcharts form belongs in the catalog | `src/registry/registry-chart.ts:220-239` (composed as a first-class type), `:69-87` (ECharts twin) | `references/catalog.md` (new row) + `assets/templates/bar-line-composed.html` | ADOPT AS IDEA | Hand-drawn bars + polyline, both scales computed from the data block; deterministic; one file (authoring workflow: `catalog.md:143-147`) |

### Tier 4 — contract-level decisions. Each needs the operator's call.

| # | Change | Evilcharts evidence | Target file | Verdict | One-file route |
|---|--------|--------------------|-------------|---------|----------------|
| 12 | **Dark theme.** Derive dark values for the three systems by mixing toward `ink` (the palette file's own rule), ship as a second block behind `@media (prefers-color-scheme: dark)`, with chart hues re-chosen for dark surfaces rather than lightened (evilcharts re-hues: blue/teal/gold/purple/red on dark, vs orange/teal/blue/yellow/gold on light). Answers the spec's second open question: recommended yes, because a delivered file is opened in a browser whose OS theme is a legitimate signal; the doc-already-picked-a-theme stance is the counter | `src/app/globals.css:102-126` (full dark re-derivation); corpus `references/color-system.md:75` (derive, never introduce a hue); gates must re-pass per theme | `assets/color/palettes.json`, `references/color-system.md`, skeleton palette block | ADOPT AS IDEA | `prefers-color-scheme` media block in the existing single file; theme switch is user-driven and deterministic per theme, so rules 12/13 are unaffected |
| 13 | **Catalog system reassignment.** `grouped-bars` is on `neutral` while `stacked-bars` and `stacked-area` — the same series-membership kind — are on `categorical`. The colour system's own definition says multi-series comparison forms should be `categorical`. Re-check every row's system column against `color-system.md:31-37` | `references/color-system.md:31-37` vs `references/catalog.md:45-58`; evilcharts chromatic default `src/registry/examples/recharts/ex-line-chart.tsx:24-35` (2 series = 2 hues) | `references/catalog.md` (system column) | ADOPT AS IDEA | No mechanism change; one column of the catalog, palette blocks already exist |
| 14 | **Background patterns.** Eleven decorative plot-area patterns (dots, grid, cross-hatch, diagonal-lines, plus, falling-triangles, 4-pointed-star, tiny-checkers, overlapping-circles, wiggle-lines, bubbles) at z −1 with a soft edge fade, drawn in the rule colour. **Code-copy is blocked by `SKILL.md:134` regardless of MIT**; the operator may (a) accept re-authored patterns in the corpus's own idiom, (b) amend the NEVER clause to admit MIT sources with attribution, or (c) reject. Note the tension with `color-system.md:154-168` (pattern fills deliberately absent — that clause targets mark fills; a plot background is a different register, but the "one visual register" argument applies) | `src/registry/ui/recharts-background.tsx:12-23` (variants), `:213-227` (z-index −1 + edge-fade mask); blocker `SKILL.md:134` | `references/template-contract.md` (skeleton section) + chosen templates | ADOPT AS IDEA (re-authored) — ADOPT WITH ATTRIBUTION requires the NEVER clause to change first | Inline `<pattern>` defs; one file |
| 15 | **Ordered-ramp gradient stroke.** On `ordered`-system forms only, a single series may sweep light→dark across its own ramp (calendar-grid, heat-matrix, progress-single). Prohibited on `neutral`/`categorical` where the sweep would invent meaning | `src/registry/charts/recharts-line-chart.tsx:785-809` (slot gradient on the stroke); `references/color-system.md:75` (derive, never introduce a hue) | `assets/templates/calendar-grid.html`, `heat-matrix.html`, `progress-single.html` | ADOPT AS IDEA | `<linearGradient>` with two palette values of the same system |
| 16 | **Standardize shared defaults in the skeleton.** One aspect convention, one geometry-constants block, one stroke-weight default at the top of the drawing code, so the corpus stops hand-varying margins and weights per template | `src/registry/ui/recharts-chart.tsx:113` (aspect-video default), `src/registry/charts/recharts-line-chart.tsx:56-60` (defaults owned by the root) | `assets/color/palette-sheet-neutral.html` (skeleton) | ADOPT AS IDEA | The skeleton is already one file; this standardizes its constants |

### Rejected — with the reason each row carries into the next phase so none is relitigated.

| # | Proposal | Evilcharts evidence | Verdict / reason |
|---|----------|--------------------|------------------|
| R1-6 | Interactive range brush | `src/registry/charts/recharts-line-chart.tsx:220-240`, `src/registry/ui/recharts-brush.tsx` (702 lines) | REJECT WITH REASON — the delivery unit is a static read/email artifact; user-driven zoom makes the figure stateful and breaks the two-screenshots-agree model. The static "range emphasis" variant (dim outside a window) is a valid idea if ever wanted |
| R1-7 | Loading skeleton state | `src/registry/ui/recharts-chart.tsx:131-144`, `:248-253` | REJECT WITH REASON — a static file has no async phase; the skeleton generator is random and would fail rule 12. Its *idea* (the figure has non-data states) is harvested into row 5 (empty notice) |
| R2-2 | Pie/donut form | `src/registry/registry-chart.ts:241-258` vs corpus `references/catalog.md:127-131` | REJECT WITH REASON — the catalog documents unit-ring/unit-grid as deliberate countable substitutes; arc pies contradict the honesty rule. The padded-arc/outside-label styling could later enrich unit-ring only |
| R2-3 | Radar form | `src/registry/registry-chart.ts:279-297` vs corpus `references/catalog.md:62`, `:129` | REJECT WITH REASON — `parallel-axes` already answers the multi-dimension comparison question; radar re-introduces angle/area estimation, the same perception problem the corpus rejects for pies |
| R2-4 | Sankey flow form | `src/registry/registry-chart.ts:299-315` vs corpus `references/template-contract.md:130` | REJECT WITH REASON — the contract already excludes layout-engine forms; a hand-drawn approximation is less honest than the real thing. If flow is ever wanted, the exclusion is the thing to revisit, not the form |
| R3-5 | Strip SVG focus outlines / disable text selection | `src/app/globals.css:318-337` | REJECT WITH REASON — a delivered chart is a document, not a dashboard; keyboard focus and copyable numbers are features |
| R3-6 | Adopt evilcharts chrome (pure white, neutral grey, no warm surface) | `src/app/globals.css:56-67` vs corpus `palettes.json` chrome | REJECT WITH REASON — the warm `#FAF8F5`/terracotta voice is a deliberate product difference, not a deficiency |
| R4-7 | Glow filter / endless animated dash | `src/registry/charts/recharts-line-chart.tsx:812-831`, `:685-704` | REJECT WITH REASON — watch-me dashboard effects; an infinite animation makes two screenshots of one file disagree (rule 12's purpose) and prints poorly |
| R4-8 | Change tick density, thinning, anchoring, single formatter | `src/registry/charts/recharts-line-chart.tsx:415-417` vs corpus `assets/templates/daily-line.html:134-144`, `:197-206` | REJECT WITH REASON — the corpus already out-designs the reference here |
| R1-8 / R2-5 / R5-2 / R5-3 / R5-4 | Accessibility layer, corpus-only forms, manifest shape, per-chart docs, validator | `src/registry/charts/recharts-line-chart.tsx:245`; `registry.json:1`; `src/scripts/build-registry.mts:1` | REJECT WITH REASON (already present or already exceeding the reference) — rule 10 + `data-chart-table`; twelve corpus-only forms; catalog ↔ files in both directions; catalog row + contract + examples; a stricter validator than the generator |

---

## 2. WHAT WAS ESTABLISHED ACROSS THE FIVE QUESTIONS

1. **Component architecture.** evilcharts composes charts from shared primitives: a container that owns aspect, per-chart CSS-variable scoping and a footer slot (`recharts-chart.tsx:90-129`), a tooltip card, a seven-variant legend, a three-variant dot language, an eleven-pattern background subsystem, and an optional brush. The corpus has no interaction layer at all; accessibility parity already exists (rule 10).
2. **Catalog of forms.** evilcharts ships eight types × two providers plus 22 blocks; five question-pairs exist on both sides; twelve corpus forms have no twin (the corpus is broader); pie/radar/sankey are rejected with the corpus's own documented reasons; composed is the one genuine gap.
3. **Theming.** Radius ladder 4.4/6.4/8.4/12.4px vs one 10px; five-hue chromatic defaults vs four greys + terracotta; mono tabular values vs system face; full re-hued dark theme vs light-first; `grouped-bars` mis-assigned to `neutral` against the system's own definition.
4. **Beauty.** Thin 0.8px strokes, dashed horizontal-only grid, no axis lines, fade-to-baseline fills, slot-gradient strokes, 1s left-to-right reveal with a long soft landing, 0.3 dim on selection, 8.4px tooltip card. The corpus's tick ladder, thinning and notice machinery are already the designed ones.
5. **Registry/install.** 279 items in a `{name, homepage, items}` envelope; one `shadcn add` resolves the scope through `components.json`, copies the chart plus its six dependency components, and adds `recharts` + `motion`. Incommensurable with the corpus by design — the corpus's manifest is `catalog.md` and its validator is stricter than the reference's generator. The packet's NEVER clause (`SKILL.md:134`) blocks code-copy adoption regardless of MIT.

---

## 3. CONVERGENCE REPORT

- **Stop reason**: `max_iterations` (5/5, per `stopPolicy: max-iterations`; convergence disabled).
- **Total iterations completed**: 5, all `complete`.
- **Questions answered**: 5/5 (Q1 component architecture, Q2 catalog, Q3 theming, Q4 beauty, Q5 registry/install).
- **newInfoRatio trend**: 0.90 → 0.80 → 0.85 → 0.75 → 0.70 (average 0.80). Declining as expected across a fixed corpus; the last iteration still produced the NEVER-clause re-verdict, which changed an earlier verdict, so the tail was not empty.
- **Ruled-out directions preserved**: brush, loading state, pie, radar, sankey, glow, endless dash, focus stripping, chrome change, code-copy under MIT (blocked by `SKILL.md:134`).

---

## 4. OPEN QUESTIONS ANSWERED (from spec.md §12)

- **"Whether any evilcharts form belongs in the catalog"**: yes, exactly one — the composed bar+line form (row 11). Pie, radar and sankey are rejected with reasons in the rejection table.
- **"Whether the corpus should gain a dark theme"**: recommendation is yes via `prefers-color-scheme` with values derived under the palette file's own rule (row 12), with the light-first stance named as the counter; the operator decides.

---

## 5. WHAT THE NEXT PHASE SHOULD DO FIRST

1. Apply Tier 1 rows 1-3 to one form (`daily-line.html`) as a proof, render with `node scripts/check-corpus.cjs --render`, and review the diff by eye — these three are the highest-leverage "why it looks plain" fixes.
2. Take the four Tier 4 decisions (dark theme, catalog reassignment, background patterns stance, ordered-ramp gradient) as a single operator review; rows 12-15 change the product voice, not just the corpus.
3. Then roll Tier 1-2 across the corpus and add the composed form (row 11) via the documented authoring workflow.

Every row above is a recommendation. Nothing under `.opencode/skills/sk-doc/sk-create-chart/` was modified by this lineage.
