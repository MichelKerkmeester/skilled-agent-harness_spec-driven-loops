# Iteration 001 — Component architecture (KQ1)

- **Focus:** How evilcharts assembles a chart from shadcn primitives over Recharts (and where ECharts steps in); what the shared container/tooltip/legend/dot/brush/background components do; which of those responsibilities exist in the sk-create-chart corpus.
- **Method:** Read `src/registry/ui/recharts-chart.tsx` (259 lines), `recharts-tooltip.tsx` (189), `recharts-legend.tsx` (204), `recharts-dot.tsx` (175), `recharts-brush.tsx` (702), `recharts-background.tsx` (229), `echarts-chart.tsx` (head), `registry-chart.ts` (head), `charts/recharts-line-chart.tsx` (head, 1002 total); target `references/template-contract.md`, `SKILL.md`.
- **All citations resolve inside `specs/sk-doc/051-sk-create-chart/008-evilcharts-reference-research/context/evilcharts/`.**

## Key findings

**F1.1 — Architecture: a declarative shell, not a chart.** `EvilLineChart` owns only data, config, loading state and brush wiring; everything visual (axes, grid, tooltip, legend, lines) is composed as children reading one shared context (`config`, `curveType`, `animationType`, `isLoading`, `selectedDataKey`) — no prop drilling. [SOURCE: src/registry/charts/recharts-line-chart.tsx:83-149]

**F1.2 — The restyle trick: evilcharts never draws its own axes.** It restyles Recharts' built-in SVG through one CSS selector blob on the container: axis tick text → `muted-foreground`, cartesian grid line → `border` at 50% opacity, tooltip cursor (line/rectangle) → `border`/`muted`, radial-bar background sector → `muted`, default white dot strokes → transparent, and a base `text-xs` (12px) font for all chart text. [SOURCE: src/registry/ui/recharts-chart.tsx:112-113]

**F1.3 — Config-driven colour with per-series multi-colour arrays.** `ChartConfig` maps each series key to `{label, icon, colors?}` where `colors` is `{light: string[], dark: string[]}`; runtime validation demands ≥1 theme key. [SOURCE: src/registry/ui/recharts-chart.tsx:8, 22-44] `distributeColors` spreads N authored colours evenly across slots ("2 colors for 4 slots → [red, red, pink, pink]"), and `ChartStyle` emits `--color-{key}-{n}` CSS variables scoped `[data-chart={id}]` (light) and `.dark [data-chart={id}]` (dark). [SOURCE: src/registry/ui/recharts-chart.tsx:145-206]

**F1.4 — Multi-colour series surface as gradients, not averages.** Tooltip and legend indicators render `linear-gradient(to right, var(--color-k-0) 0%, …)` when `colorsCount > 1`; legend outline variants use a mask-composite XOR trick so the "border" follows the gradient and respects radius. [SOURCE: src/registry/ui/recharts-tooltip.tsx:171-183; src/registry/ui/recharts-legend.tsx:156-200]

**F1.5 — Tooltip is a designed object, not a default.** `border-border/50 grid min-w-32 (128px) gap-1.5 px-2.5 py-1.5 text-xs shadow-xl`, default roundness `lg`, variants `default` (solid bg) vs `frosted-glass` (`bg-background/70 backdrop-blur-sm`); values in `font-mono font-medium tabular-nums` with `toLocaleString()`; three indicator shapes (dot / 1px line / dashed); an empty active state returns `<span class="p-4">` specifically so the tooltip never animates from a 0,0 origin; tooltip motion is `animationDuration = 200`. [SOURCE: src/registry/ui/recharts-tooltip.tsx:8-19, 80, 88-90, 118, 154, 186-189]

**F1.6 — Interactive legend with 30% dimming.** Legend items are clickable (`cursor-pointer`, `onSelectChange`), dim non-selected series to `opacity-30`, share the selection state with the tooltip (same `opacity-30` on non-selected tooltip rows), and offer 7 indicator variants (square, circle, circle-outline, rounded-square, rounded-square-outline, vertical-bar, horizontal-bar). [SOURCE: src/registry/ui/recharts-legend.tsx:6-13, 63-80, 104-148]

**F1.7 — Custom dots replace library dots.** `ChartDot` ships 3 variants: `default` (r=3, gradient-filled rectangle clipped to a circle so the dot colour matches its x-position on the series gradient), `border` (r=6, background-coloured ring), `colored-border` (r=3 + 1px gradient ring). [SOURCE: src/registry/ui/recharts-dot.tsx:4, 83-106, 110-141, 145-171]

**F1.8 — Brush = zoom footer with spring physics.** `EvilBrush` renders a 56px mini-chart of the FULL dataset with per-series gradients, dimmed out-of-range overlays (`bg-background/70 backdrop-blur-[2px]`), spring-driven handles (`{stiffness: 300, damping: 35, mass: 0.8}`), pointer-capture drag (mouse+touch+pen), handle hover labels, `minSpan=2`, and deferred re-render of the main chart. [SOURCE: src/registry/ui/recharts-brush.tsx:88, 194, 369-416, 440-475]

**F1.9 — Decorative background patterns with edge fade.** 11 SVG `<pattern>` variants (dots, grid, cross-hatch, diagonal-lines, plus, falling-triangles, 4-pointed-star, tiny-checkers, overlapping-circles, wiggle-lines, bubbles), all `text-border`-coloured, rendered at zIndex −1 behind the plot through a Gaussian-blurred mask (rect 8%/20%/85%/60%, blur stdDeviation 25). [SOURCE: src/registry/ui/recharts-background.tsx:12-23, 206-228]

**F1.10 — Loading state is first-class.** `LoadingIndicator` overlays a centered pill with a spinner (`animate-spin` 12px ring) and "Loading"; `getLoadingData(points, 0–70%)` generates skeleton series data; the line chart wires a `loading` data key with 2000ms animation. [SOURCE: src/registry/ui/recharts-chart.tsx:131-142, 248-254]

**F1.11 — ECharts is a parallel pipeline with the same API surface.** `echarts-chart.tsx` replicates `ChartConfig`/`THEMES`/`distributeColors`/`buildChartCss` verbatim ("so the charts stay self-contained — no recharts ui imports") and adds a canvas `normalizeColor()` (1×1 canvas read-back) for ECharts' inability to consume CSS vars directly. [SOURCE: src/registry/ui/echarts-chart.tsx:18-54, 56-95, 97-118] Every chart declares its shared-UI deps as registry items (`@evilcharts/echarts-chart`, `-tooltip`, `-legend`, `-dot`, `-brush`; deps `echarts`, `motion`). [SOURCE: src/registry/registry-chart.ts:5-27]

**F1.12 — Intro reveal animation.** Recharts' own line animation is "permanently disabled" (it drew the line after dots popped); evilcharts replaces it with per-frame animated SVG mask wipes: `REVEAL_DURATION = 1`s, `REVEAL_EASE = [0, 0.7, 0.5, 1]`, directions left-to-right / right-to-left / center-out / edges-in, `strokeWidth 0.8` default, and `"none"` is the automatic fallback under the OS reduce-motion preference (`useReducedMotion`). [SOURCE: src/registry/charts/recharts-line-chart.tsx:53-76]

## Responsibility map vs sk-create-chart corpus

| evilcharts responsibility | In corpus? | Evidence |
|---|---|---|
| Global axis/grid restyle layer | **No** — each of the 20 templates hand-styles its own axis/grid CSS | recharts-chart.tsx:112 |
| Per-series multi-colour → gradient | **No** — color-system.md roles are single-colour (checked in iter 3 for detail) | recharts-chart.tsx:149 |
| Hover tooltip | Partially (some templates have hover) | recharts-tooltip.tsx:88 |
| Interactive legend (click-to-select, 30% dim) | **No** | recharts-legend.tsx:72-79 |
| Custom dot variants | **No** | recharts-dot.tsx:4 |
| Zoom brush footer | **No** | recharts-brush.tsx:188-419 |
| Background patterns | **No** | recharts-background.tsx:184-196 |
| Loading state | **No** — and largely inapplicable (delivery is a static file) | recharts-chart.tsx:131,248 |
| First-paint reveal animation | **No** (corpus rule 13 covers reduced-motion only if animated) | recharts-line-chart.tsx:59-76 |
| Four-part card (headline/subtitle/figure/source) | **Corpus is ahead** — evilcharts has no equivalent writing layer | template-contract.md §2 |

## RANKED CHANGES TO sk-create-chart

| # | Change | Evilcharts evidence (resolves) | Target | Verdict | Level | Route to single self-contained offline HTML |
|---|---|---|---|---|---|---|
| 1 | Add a shared axis/grid restyle block to every template: tick text in muted foreground ink, grid lines at 50% opacity of the frame colour, 12px base chart type | recharts-chart.tsx:112 | `assets/templates/*.html` (per-template `<style>`; note in `references/template-contract.md` §3 skeleton comment) | ADOPT AS IDEA | template-level (apply now) | Pure CSS selectors against the template's own SVG classes; no deps |
| 2 | First-paint reveal wipe on time-series templates (left-to-right mask wipe, 1s, cubic-bezier(0, 0.7, 0.5, 1), reduced-motion → static) | recharts-line-chart.tsx:59-76 | `assets/templates/daily-line.html`, `stacked-area.html`, `daily-range.html` | ADOPT AS IDEA | template-level | Animated SVG `<mask>` rect or CSS clip-path; honours rule 13 (prefers-reduced-motion) and rule 12 (final state deterministic) |
| 3 | Tooltip design kit for templates that hover: 128px min width, 1px border at 50% alpha, shadow-xl, 10px/6px padding, mono tabular-nums values with thousands separators, 200ms follow transition, `rounded-lg` | recharts-tooltip.tsx:88-90, 154, 186 | `assets/templates/daily-line.html`, `scatter.html`, `candlestick.html`, `heat-matrix.html`, `treemap.html` (any template with hover already) | ADOPT AS IDEA | template-level | Absolutely-positioned HTML div driven by mousemove over the inline SVG; no deps |
| 4 | Interactive legend on multi-series templates: click a legend entry to dim all other series to 30% opacity | recharts-legend.tsx:72-79 | `assets/templates/grouped-bars.html`, `stacked-bars.html`, `stacked-area.html`, `daily-line.html` | ADOPT AS IDEA | template-level | `addEventListener('click')` toggling `opacity` on SVG `<g>` elements; no deps |
| 5 | Gradient legend/tooltip indicators when a series legitimately encodes a range of hues (e.g. stacked area segments of one metric) | recharts-legend.tsx:156-167 | `references/color-system.md` (define when a series may carry >1 colour) + templates using it | ADOPT WITH ATTRIBUTION (MIT; but SKILL.md NEVER-rule bars pasting outside-library fragments, so this is a re-implementation, credited in a header comment) | contract-level (operator decision: amend colour-system doc to allow multi-hue series) | SVG `<linearGradient>` stops read from palette vars via `getComputedStyle` — offline |
| 6 | End-point dot treatment on line-family templates: r=3 gradient-filled dot on the last data point only (not every point), optional 6px "border" halo for the focused point | recharts-dot.tsx:83-106, 110-141 | `assets/templates/daily-line.html`, `stacked-area.html` | ADOPT AS IDEA | template-level | Plain SVG `<circle>`/`<rect>` with clip; no deps |
| 7 | Zoom brush footer for dense time series (>30 points): 56px mini-chart of the full series, draggable window, dimmed out-of-range with 2px backdrop blur | recharts-brush.tsx:194, 385-416 | New capability on `daily-line.html`/`stacked-area.html` only when data is dense; or documented gap in `references/catalog.md` | ADOPT AS IDEA | template-level | Vanilla pointer events + `viewBox`/transform recompute; no spring needed (direct mapping); no deps. Rejected for templates <30 points (interaction without need) |
| 8 | Decorative background patterns (11 variants) behind the plot | recharts-background.tsx:12-23, 218-224 | — | REJECT WITH REASON: decor behind data fights the corpus's print-honesty stance (contract §2: headline is an argument; source line cites provenance); a patterned plot bed biases value reading in a static deliverable | contract-level | Could reach the file (SVG pattern + mask, offline) — rejected on editorial grounds, not feasibility |
| 9 | Loading skeleton state (`getLoadingData`, spinner pill, 2000ms skeleton animation) | recharts-chart.tsx:131-142, 248 | — | REJECT WITH REASON: the delivery unit never fetches (contract §4: data block holds literal values, never fetches, never reads the clock) and rule 12 bans randomness; a static file renders instantly, so a loading state solves a problem the artifact cannot have | contract-level | Technically reachable (CSS spinner is offline) but meaningless here |
| 10 | Adopt React/Recharts/ECharts/shadcn component pipeline incl. registry dependency declarations | registry-chart.ts:5-27 | — | REJECT WITH REASON: violates frozen contract (one file, no build step, no framework, no remote dep) | contract-level | Cannot — this is the architecture the corpus exists to avoid |

## Ruled out / tried and failed this iteration

- Reading `echarts-line-chart.tsx` (2111 lines) in full — deferred to iteration 4/5 as the ECharts-side beauty sample; the head of `echarts-chart.tsx` already established the parallel-pipeline pattern.
- No code modified anywhere; subject and target both read-only.

## newInfoRatio: 1.0 (fully new — first iteration; 12 findings, 10 ranked changes, 1 responsibility map)

**Next focus (iteration 2):** KQ3 styling/theming — `src/app/globals.css`, `components.json`, `package.json`; extract concrete token values (radius, spacing, typography scale, dark-mode var layer, motion defaults) and compare against the corpus palette blocks.
