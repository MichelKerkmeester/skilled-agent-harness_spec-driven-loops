# Iteration 2 - Mark treatment: lines, areas, bars and fills

## Iteration 2 - Mark treatment: lines, areas, bars and fills

### Focus

Which line, area, bar and fill treatments are genuinely missing or weak after the
shipped phases 15 to 19?

### Sources Consulted

- Current line implementation: `.opencode/skills/sk-design/sk-design-chart/assets/templates/daily-line.html:128-147,332-353,474-524`.
- Current stacked area implementation: `.opencode/skills/sk-design/sk-design-chart/assets/templates/stacked-area.html:128-148,349-370,504-555`.
- Current column implementation: `.opencode/skills/sk-design/sk-design-chart/assets/templates/bar-columns.html:129-164,266-318`.
- The local corpus catalog and current register: `.opencode/skills/sk-design/sk-design-chart/catalog.md:44-69,137-142`.
- The local reference index and detail index: `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/index.md:7-28` and `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/index.md:21-29`.
- Captures inspected: `library/details/shadcn-line-light-03.jpg`, `shadcn-area-light-02.jpg`, `shadcn-bar-light-05.jpg`, `tremor-area-light-01.jpg`, `mantine-area-light-09.jpg`, `mantine-area-light-17.jpg`, `plot-area-docs-light-01.jpg`, `plot-area-docs-dark-06.jpg`, `layerchart-light-06.jpg`, `unovis-gallery-light-01.jpg`, `carbon-storybook-light-01.jpg`, and `carbon-storybook-light-08.jpg`.

### What was read

The current line form uses a 2px line with round joins and caps, a 1px dashed
grid at `stroke-opacity: 0.75`, an area fade from `0.35` at the top to `0.04`
at the baseline, transparent point circles, and a surface-coloured outline on
the emphasized mark. Its path builder supports linear, step and monotone
curves. Missing readings split the line into runs instead of interpolating.
[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/daily-line.html:128-147,332-353,484-524]

The stacked area uses four categorical fills at `fill-opacity: 0.4`, 2px
surface separators, a fourth-series capacity guard, and flat bands rather than
a gradient. The implementation only builds paths across complete runs and
reports values through the keyed series readout.
[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/stacked-area.html:128-148,504-555]

The column form reserves a 652px plot span from `LEFT = 54` to `RIGHT = 706`,
uses a 246px vertical span from `TOP = 16` to `BASE = 262`, keeps five scale
intervals, and gives each column `0.62` of its slot. The path rounds only the
end away from the baseline. Horizontal bars and the composed bar-line form
use the same semantic separation between measured marks and labels.
[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/bar-columns.html:266-318]
[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/bar-rows.html:129-137]
[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/bar-line-composed.html:129-160]

The reference index describes shadcn's linear, step, dot, label and multi-series
line variants, shadcn's labelled and negative bar variants, Tremor's soft
gradient and three-series area treatments, Mantine's dotted, stacked, split and
step areas, Observable Plot's monochrome, negative, gap and faceted areas, and
Unovis and LayerChart's smooth, stacked, grouped and in-band-label variants.
[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/index.md:21-29]

The captures confirm that these are choices attached to data semantics, not one
universal style. The shadcn step line and area cards retain isolated card
framing. Tremor places a two-series area legend above the plot. Mantine shows
visible point markers and separates positive and negative area fills around
zero. Observable Plot uses a dense monochrome area for high-frequency data.
LayerChart and Unovis demonstrate smooth and stacked alternatives, while the
Carbon Storybook bar and area examples reduce the visual to the mark itself.
[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/shadcn-line-light-03.jpg]
[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/tremor-area-light-01.jpg]
[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/mantine-area-light-09.jpg]
[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/plot-area-docs-dark-06.jpg]
[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/unovis-gallery-light-01.jpg]
[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/carbon-storybook-light-01.jpg]
[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/carbon-storybook-light-08.jpg]

### What was seen or measured

- The current single-series line has one full-strength 2px stroke and no visible dots except the emphasized point. The transparent circles are hit regions, so every finite datum remains interactive without adding a second visual layer. [SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/daily-line.html:139,144-147,516-524]
- The current single-series area has two gradient stops at `0.35` and `0.04`, while the stacked bands are flat at `0.4` with a 2px surface separator. That is a clear difference between a single magnitude readout and a composition readout. [SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/daily-line.html:132-139]
[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/stacked-area.html:128-142]
- Current line and stacked-area paths explicitly preserve gaps. The line refuses to invent a value across a missing day, and the stack omits a one-period run from the band while keeping the table as the source of truth. [SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/daily-line.html:484-496]
[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/stacked-area.html:504-513]
- The current column geometry makes baseline contact square and rounds only the free end. The shadcn labelled-bar capture rounds the free ends more visibly, but it does not establish that a baseline corner should be rounded in a quantitative column. [SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/bar-columns.html:129-131,270-280]
[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/shadcn-bar-light-05.jpg]

### Findings

1. The shipped default mark register is already coherent. A 2px round-capped
   line, a restrained gradient for one area, flat separated bands for a stack,
   and baseline-anchored columns cover the common questions without copying the
   most decorative reference variants. The current code also has explicit linear,
   step and monotone choices rather than forcing one interpolation policy.
   [SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/daily-line.html:139,332-353]
   [SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/stacked-area.html:128-142,349-370]
   [SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/bar-columns.html:129-131,270-280]

2. A sparse-series dot policy is a credible gap, but a global visible-dot rule
   would be a regression. The current daily line intentionally leaves all data
   circles transparent and reserves the visible mark for the emphasized low.
   Mantine's area capture and the shadcn line family show that visible points are
   useful variants when the series is short, sparse or point-oriented. The
   upgrade should therefore be a per-form or per-density decision such as
   `dotPolicy: none | sparse | all`, with `none` remaining the default for a
   dense daily series.
   [SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/daily-line.html:516-524]
   [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/index.md:23,26]
   [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/mantine-area-light-17.jpg]

3. Signed area is the strongest mark-level visual gap. The current daily area
   closes every run to `BASE`, so it gives one treatment to values above and
   below a meaningful zero. Mantine's split-colour area and Observable Plot's
   negative-area examples show a useful alternative: positive and negative
   regions can be separated around an explicit zero baseline. This belongs only
   on a form whose question makes zero meaningful, not on every area or stack.
   [SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/daily-line.html:484-513]
   [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/index.md:26,28]
   [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/mantine-area-light-09.jpg]

4. The stacked-area fill should stay flat and separated. Tremor's soft gradient
   is effective for a single or small multi-series magnitude chart, but a
   gradient in the current four-band composition would make the fill intensity
   compete with the series identity. The existing `0.4` fills, surface stroke
   and `CAPACITY = 4` make composition, boundaries and palette capacity legible.
   [SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/stacked-area.html:128-142,515-527]
   [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/tremor-area-light-01.jpg]

5. Baseline contact in columns is not a defect to polish away. The current
   `topRounded` path clamps radius to the column height and leaves the measured
   end square at the baseline. This is a more defensible quantitative default
   than copying fully rounded bar silhouettes from a labelled component example.
   [SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/bar-columns.html:266-280]
   [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/shadcn-bar-light-05.jpg]

6. In-band labels and smoother curves are optional density responses, not shared
   mark defaults. Unovis demonstrates labels inside wide stacked regions and
   LayerChart demonstrates smooth areas, while the current catalog already has
   explicit curve support and separate table readouts. Adding either globally
   would risk label collisions or imply interpolated values where the source is
   sparse. [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/index.md:27,29]
   [SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/daily-line.html:332-353]

### Recommendations

- Keep the current global mark register: 2px line, 1px dashed grid, restrained
  single-area gradient, flat separated stack and baseline-anchored columns.
- Add a per-template mark declaration for sparse dots. The checker should verify
  that the declaration exists when a template renders visible points, but should
  not impose visible dots on dense daily lines.
- Add a signed-area treatment only when the template declares a meaningful zero
  baseline. The visual contract should name positive and negative fills and the
  zero rule. It should not silently split ordinary positive areas.
- Keep curve choice, in-band labels and bar label placement as per-template
  decisions. Do not import a new charting mark family or a global smoothness
  toggle into the standalone corpus.

### What this iteration could not settle

- The evidence establishes signed area as a gap, but not whether it deserves a
  new catalog template or belongs as a variant of an existing area form.
- The local captures do not establish a defensible universal sample-count
  threshold for `dotPolicy: sparse`. The threshold needs a rendered-density
  check during implementation.
- Tooltip indicators, legend placement, active-series dimming and keyboard
  semantics are deferred to angle 3. Palette contrast and dark-ground token
  safety are deferred to angle 4.

### Assessment

The current marks need targeted semantic additions rather than a visual reset.
The two actionable candidates are a sparse-point policy and a signed-area
policy. The shipped gaps handling, stack separators and baseline geometry should
be preserved.

### Reflection

The reference library initially suggests more smoothness, more points and more
fill variation. Reading the current geometry and the question-first catalog
narrows that apparent breadth: most differences are legitimate variants, while
signed polarity and sparse-point disclosure change what a reader can infer.

### Recommended Next Focus

Angle 3: compare tooltip and legend indicators, header/value alignment, hover
dimming and legend placement across the current interaction contract and the
shadcn, Vercel, Carbon and Mantine references.

### Ruled-out directions

- Global visible points on every line and area. [SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/daily-line.html:516-524]
- Universal smooth interpolation or gradient fills for stacked composition.
  [SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/stacked-area.html:128-142]
- Rounding the baseline end of quantitative columns. [SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/bar-columns.html:270-280]
- Adding LayerChart, Unovis or another external mark family to the catalog just
  because the library contains it. [SOURCE: .opencode/skills/sk-design/sk-design-chart/catalog.md:44-69]

### Metrics

- `newInfoRatio`: `0.78`.
- Novelty justification: this iteration isolates two mark-level gaps that angle
  1 could not answer, signed polarity and density-aware point disclosure, while
  confirming that the shipped geometry should remain the baseline.
- `ruledOutDirections`: 4.
- `openQuestionsAfterIteration`: 3.
