# Iteration 004 — Beauty physics (KQ4)

- **Focus:** What makes evilcharts output read as designed: grid/axis weight, tick density, label typography, colour ramps, opacity/layering, radius, padding, hover/focus, empty/loading, first-paint — with concrete values, in a physical delta table against the corpus.
- **Method:** Grep-driven deep extraction over `src/registry/charts/recharts-bar-chart.tsx`, `recharts-line-chart.tsx`, `echarts-bar-chart.tsx`, `echarts-line-chart.tsx`; deep-read of corpus `assets/templates/daily-line.html` (233 lines); container/tooltip values carried from iteration 1.
- **All citations resolve inside `.../context/evilcharts/` or the target packet.**

## Physical delta table

| Dimension | evilcharts (cited) | Corpus (cited) | Delta verdict |
|---|---|---|---|
| Axis lines | Off: `tickLine = false`, `axisLine = false` on every axis (recharts-line-chart.tsx:413-415, 442-445; recharts-bar-chart.tsx:421-435); echarts `axisLine: { show: false }` (echarts-line-chart.tsx:727, 763) | No axis line either (daily-line.html draws grid + labels only, lines 62, 162, 205) | **Parity — no change** |
| Tick marks | ECharts replaces ticks with **round dots**: `axisTick.lineStyle: { color: tickDotColor, width: 3, cap: "round" }` where tickDotColor = split-line color flattened onto background (echarts-line-chart.tsx:710, 738, 770) | No tick marks; labels only | **ADOPT** — see ranked #4 |
| Grid style | Recharts `Grid` dasharray default `"3 3"` (recharts-bar-chart.tsx:484-489); echarts splitLine `type: [3,3], width: 1`, color = border at alpha (echarts-line-chart.tsx:775); container CSS: grid `[stroke='#ccc']` → `stroke-border/50` (recharts-chart.tsx:112) | Solid: `.grid { stroke: var(--chart-rule); stroke-width: 1 }` (daily-line.html:62) | **ADOPT** — dashed 3-3 grid, see ranked #1 |
| Series stroke | `STROKE_WIDTH = 0.8` hairline both engines (recharts-line-chart.tsx:56; echarts-line-chart.tsx:108) + 4-layer glow behind lines: width 2 at opacity 0.9/0.6/0.38/0.22 with blur 5/12/24/42 (echarts-line-chart.tsx:136-140, 521-545) | 2px round-capped line (daily-line.html:61) | **Split** — reject the width change (see #5), adopt optional glow (see #7) |
| Bar corner radius | `DEFAULT_BAR_RADIUS = 2` on both engines (recharts-bar-chart.tsx:45; echarts-bar-chart.tsx:98); brush mini-bars r=3 (recharts-brush.tsx:602) | Square marks: zero `rx=` attributes across all 20 templates (iteration-2 audit) | **ADOPT** — see ranked #2 |
| Bar motion | `BAR_GROW_DURATION = 0.5s` per-bar grow-in, easing `cubicOut` (recharts-bar-chart.tsx:49; echarts-bar-chart.tsx:101, 1325-1326) | No motion in bar templates | **ADOPT** — see ranked #3 |
| Line first paint | Recharts animation disabled; replaced by mask wipe `REVEAL_DURATION = 1s`, ease `[0, 0.7, 0.5, 1]`, auto `none` under reduce-motion (recharts-line-chart.tsx:56-76) | No motion in daily-line | **Already ranked** (iteration-1 #2) — stands |
| Hover/selection dimming | `SELECTION_DIM = 0.3`, `HOVER_BLUR = 0.3` — unselected series and non-hovered bars dim to 30% (echarts-bar-chart.tsx:107-108, 992, 1320); legend `opacity-30` (recharts-legend.tsx:73) | No hover anywhere in daily-line (0 mousemove/hover matches) | **ADOPT** — fold into interactive-legend change (see ranked #6) |
| Tooltip values | `toLocaleString()` — locale-dependent (recharts-tooltip.tsx:154) | **Fixed comma formatter**, never host-locale, six-decimal dust stripping, em-dash for gaps (daily-line.html:114-119) | **REJECT `toLocaleString`** — corpus is more deterministic; see correction below |
| Plot margins | ECharts grid: left/right/bottom 8px, top 16px (42 with top legend), legend row 34px, brush gap added (echarts-line-chart.tsx:695-701) | Card padding 28/28/22, SVG flush (daily-line.html:38, 50-51) | **REJECT as numeric import** — canvas-specific numbers, see ranked #8 |
| Loading skeleton | Smooth random-walk skeleton data "reads like a chart" (echarts-line-chart.tsx:580); random `getLoadingData` (recharts-chart.tsx:248) | — | **REJECT** — unchanged from iteration 1 |
| Typography | 12px chart text (recharts-chart.tsx:112), mono tabular-nums values | 11px `.tick`, 13px labels, 21px headline (daily-line.html:43-44, 198) | Type-scale doc change already ranked (iteration-2 #4); tick labels 11px is fine |

## CORRECTION to iteration-001 #3

The tooltip kit entry cited `toLocaleString()` as part of the adopted pattern. On physical inspection the corpus's own formatter (daily-line.html:114-119) is deliberately locale-independent with fixed comma grouping, dust stripping and em-dash gaps — that is the better anchor under contract rule 12 (determinism: two renders must agree). The adopted tooltip kit keeps the VISUAL treatment (mono, tabular-nums, thousands grouping) but binds it to the corpus's existing formatter, not `toLocaleString()`. Final synthesis carries this correction.

## RANKED CHANGES TO sk-create-chart

| # | Change | Evilcharts evidence (resolves) | Target | Verdict | Level | Route to single self-contained offline HTML |
|---|---|---|---|---|---|---|
| 1 | Dashed grid: change `.grid` to `stroke-dasharray: 3 3` corpus-wide, keeping the rule token at full opacity (the token is pale enough; evilcharts doubles the effect with 50% opacity + dashes) | recharts-bar-chart.tsx:484-489; echarts-line-chart.tsx:775 | `assets/templates/*.html` — one CSS line per template `.grid` rule | ADOPT AS IDEA | template-level | Pure CSS attribute; zero deps |
| 2 | 2px corner radius on bar ends (outer end only for stacked segments — the separator-stroke contract already prevents colour sharing; radius applies to the topmost visible edge) | recharts-bar-chart.tsx:45, 656; echarts-bar-chart.tsx:98, 1128 | `assets/templates/bar-columns.html`, `bar-rows.html`, `grouped-bars.html`, `waterfall.html`, `stacked-bars.html` (top segment), `progress-single.html` | ADOPT AS IDEA | template-level | SVG `rx` attribute on rects; zero deps |
| 3 | 0.5s cubic-out grow-in on bar templates (bars rise from baseline), with `prefers-reduced-motion` static fallback — gives contract rule 13 its first bar-side consumer | recharts-bar-chart.tsx:49; echarts-bar-chart.tsx:101, 1325-1326 | `assets/templates/bar-*.html`, `waterfall.html`, `progress-single.html` | ADOPT AS IDEA | template-level | CSS transition or rAF on rect height/y from the data block's own values (deterministic final state); no deps |
| 4 | Round tick dots (r=1.5, flattened border-on-surface colour) instead of tick lines on value axes of bar/scatter forms — anchors grid rows physically without adding a line | echarts-line-chart.tsx:710, 738, 770 | `assets/templates/bar-columns.html`, `scatter.html` (optional; review per template) | ADOPT AS IDEA | template-level | SVG circles at tick positions; zero deps |
| 5 | Hairline 0.8px series stroke | recharts-line-chart.tsx:56 | — | REJECT WITH REASON: corpus 2px round-capped stroke is its print register; no evidence the weight is the defect; the comment in daily-line.html:26 already calls its weight deliberate | contract-level | n/a |
| 6 | Hover dimming at 30% alongside click-to-select on grouped/stacked forms | echarts-bar-chart.tsx:107-108, 1320; recharts-legend.tsx:73 | folds into iteration-001 #4 (interactive legend) | ADOPT AS IDEA | template-level | `mouseenter`/`mouseleave` toggling opacity; no deps |
| 7 | Optional single-layer glow behind the emphasis line only (one feGaussianBlur layer, opacity ~0.25) — not the 4-layer stack | echarts-line-chart.tsx:136-140 | `assets/templates/daily-line.html` (emphasis only), conditional on review | ADOPT AS IDEA | template-level (optional) | SVG `<filter feGaussianBlur>` on a duplicated path; deterministic, offline; cut if it muddies print |
| 8 | Numeric plot margins | echarts-line-chart.tsx:695-701 | — | REJECT WITH REASON: canvas-layout numbers without a corpus consumer; per-form SVG sizing already handles layout | contract-level | n/a |

## Ruled out / tried and failed this iteration

- Full read of recharts-bar-chart.tsx (1,298 lines) — grep extraction of every physical property was sufficient; the file's remaining bulk is state wiring already understood from the line chart.
- Trying to find an explicit tickCount/interval strategy: neither engine hardcodes tick density in these files; density is library-auto or data-driven, so there is no citable density value to adopt. Corpus thinning rules (daily-line.html:198-205) remain the more honest, documented approach.

## newInfoRatio: 0.8 (novelty justification: first physical-value extraction on both sides — grid dash 3-3, tick-dot width 3, radius 2, 0.5s cubic-out, 4-layer glow constants, 8px margins; plus a citation-level correction to iteration-1's tooltip formatter anchor)

**Next focus (iteration 5):** KQ5 registry & CLI install (what a consumer receives: registry.json item shape, docs pages, install flow) + gap sweep + begin final consolidation of the complete ranked list across all five iterations.
