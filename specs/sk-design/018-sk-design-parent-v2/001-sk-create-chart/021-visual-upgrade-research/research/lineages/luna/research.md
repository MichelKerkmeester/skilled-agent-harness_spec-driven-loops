# Visual Upgrade Research

Topic: What should the standalone chart corpus visually upgrade, judged against the external reference library.

This progressive synthesis is local-only. The curated captures and the repository chart corpus are the admissible reference surface.

## Iteration 1 — Card anatomy, typography and spacing

The current standalone card already has the fixed five-part order of headline, subtitle, figure, footer finding and source. Its representative stylesheet uses a 760px card, 28px/28px/22px padding, 16px headline, 14px subtitle and a footer rule after an 18px figure gap. [SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/daily-line.html:77-107,226-245] [SOURCE: .opencode/skills/sk-design/sk-design-chart/references/template-contract.md:27-39]

The rendered card confirms that the conclusion remains above the plot and the finding/source pair remains below a divider. The separate data table does not move the narrative card sideways. [SOURCE: .opencode/skills/sk-design/sk-design-chart/screenshots/templates/daily-line.png]

The local references show a narrower opportunity. Apple HIG, Vercel Web Analytics and Tremor foreground a primary value or period delta before the plot, while the generic current time-series card leads with narrative text. A metric-and-delta treatment is therefore worth investigating for scalar and time-series forms, but it should not become a universal sixth card part without a contract decision. [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/apple-hig-charts-light-07.jpg] [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/vercel-docs-analytics-light-01.jpg] [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/tremor-blocks-light.jpg] [SOURCE: .opencode/skills/sk-design/sk-design-chart/references/template-contract.md:27-39]

The global card shell should remain stable. Vercel and Carbon show application dashboards with controls, toolbars and surrounding context, not evidence that the standalone 760px card needs more padding or product chrome. Plot height, left inset and label density remain per-form questions. [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/vercel-docs-analytics-light-01.jpg] [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/carbon-anatomy-light-01.jpg] [SOURCE: .opencode/skills/sk-design/sk-design-chart/references/template-contract.md:150-164]

Angle result: keep the shipped card register, investigate a narrowly scoped metric-and-delta pattern and rule out universal dashboard chrome. `newInfoRatio=0.86` because this angle separates the established shell from a concrete targeted gap. The next focus is angle 2, mark treatment.

## Iteration 2 — Mark treatment: lines, areas, bars and fills

The current mark register is coherent. The line uses a 2px round-capped stroke,
the single area fades from `0.35` to `0.04`, the stacked area uses four flat
`0.4` fills with 2px surface separators, and columns round only the end away
from their baseline. Missing readings are split into runs rather than
interpolated. [SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/daily-line.html:128-147,332-353,484-524] [SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/stacked-area.html:128-148,504-555] [SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/bar-columns.html:129-164,266-318]

The local references show mark choices as semantic variants. Shadcn supplies
linear, step, dot and label line forms plus labelled and negative bars. Tremor
uses soft gradient areas and a top-right legend. Mantine shows visible dots and
split positive/negative fills around zero. Observable Plot demonstrates dense
monochrome and gap-aware areas. LayerChart and Unovis show smooth, stacked,
grouped and in-band-label variants. Carbon's storybook captures reduce the
mark to a plain area or bar. [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/index.md:21-29] [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/shadcn-line-light-03.jpg] [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/mantine-area-light-09.jpg] [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/plot-area-docs-dark-06.jpg] [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/carbon-storybook-light-08.jpg]

Two targeted opportunities survive the comparison. First, the current daily
line keeps all data circles transparent and reserves the visible point for the
emphasized datum. A sparse or short form needs an explicit point policy, while
dense daily data should remain dotless. Second, a signed area form is missing:
the current area closes to one baseline treatment, while Mantine and Observable
show that a meaningful zero can separate positive and negative fills. Both
should be per-template declarations, not global restyles. [SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/daily-line.html:516-524] [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/index.md:23,26,28] [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/mantine-area-light-17.jpg]

The existing stack and column geometry should remain. Flat stack fills keep
series identity apart from intensity, and the free-end-only column radius keeps
the measured mark in contact with its baseline. Smooth interpolation, gradient
stack fills, universal dots, baseline rounding and new external mark families
are ruled out without a specific question. [SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/stacked-area.html:128-142,515-527] [SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/bar-columns.html:266-280] [SOURCE: .opencode/skills/sk-design/sk-design-chart/references/catalog.md:44-69]

Angle result: preserve the shipped global mark register, add a sparse-point
policy and a meaningful-zero signed-area policy as per-form opportunities, and
keep curve, label and density choices local to each form. `newInfoRatio=0.78`
because this angle resolves the mark question with two actionable gaps and four
explicitly ruled-out global changes. The next focus is angle 3, tooltip, legend
and interaction states.

## Iteration 3 — Tooltip, legend and interaction states

The shipped interaction contract is already strong. The tooltip is an HTML
card with a `128px` minimum width, `6px 10px` padding, an 8px indicator, a 16px
row floor, bounded placement and the same `READOUT` values used by the table.
The card starts empty and flips within an 8px figure inset. [SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/daily-line.html:173-203,393-436] [SOURCE: .opencode/skills/sk-design/sk-design-chart/references/template-contract.md:415-418,621-625]

The current dimming is reversible: non-selected series fall to `0.3` opacity,
the initial state is empty, pointer leave clears a preview, legend click latches
selection, and Enter or Space provides the same control. Pointer resolution uses
direct hits, containing marks and a bounded `REACH = 36`. [SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/daily-line.html:159-171,599-633,639-703] [SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/stacked-area.html:155-169,664-698]

All nine local shadcn tooltip captures were inspected. They vary the indicator,
label, formatter, icon and total-row treatments while preserving compact aligned
rows. Vercel adds a date, event label, unit and active marker. Carbon shows a
vertical guide and larger legend controls, while Mantine keeps compact legends
below the plot. [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/index.md:23-26] [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/shadcn-tooltip-dark-01.jpg] [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/shadcn-tooltip-dark-02.jpg] [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/shadcn-tooltip-dark-03.jpg] [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/shadcn-tooltip-dark-04.jpg] [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/shadcn-tooltip-dark-05.jpg] [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/shadcn-tooltip-dark-06.jpg] [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/shadcn-tooltip-dark-07.jpg] [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/shadcn-tooltip-dark-08.jpg] [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/shadcn-tooltip-dark-09.jpg] [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/vercel-analytics-dark-03.jpg]

The actionable gap is indicator semantics. The current tooltip always paints an
8px square, while the composed legend correctly distinguishes a column block
from a line rule. A per-series `swatch`, `rule` or `none` indicator would carry
that mark identity into the readout. Optional headers, units and derived totals
are also defensible when the data contract and table supply them. [SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/daily-line.html:197-203,409-417] [SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/bar-line-composed.html:158-160,645-671] [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/shadcn-tooltip-dark-02.jpg] [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/shadcn-tooltip-dark-09.jpg]

Below-plot legend placement should remain the small-card default. Carbon's side
legend and show/hide panel serve larger application compositions. A cursor guide
can be earned by a dense multi-series form, but shadcn's default tooltip does not
need one. The current code's legend control is click and keyboard based, with no
pointerenter or pointerleave preview, so that distinction should remain explicit
unless the contract changes. [SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/stacked-area.html:106-109,578-603,664-698] [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/mantine-area-light-13.jpg] [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/carbon-legends-light-07.jpg] [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/carbon-anatomy-light-01.jpg]

Angle result: retain tooltip geometry, table fallback, below-plot legends and
reversible dimming. Add per-series tooltip indicator shapes and allow data-backed
contextual totals. Earn cursor guides by density and do not add icons or global
legend movement. `newInfoRatio=0.72` because this angle confirms the shipped
interaction system and isolates mixed-mark indicator semantics plus conditional
cursor anchoring as the useful changes. The next focus is angle 4, colour and the
dark ground.

## Iteration 4 — Colour and the dark ground

The cursor palette is already safe under the local two-theme gates, although
several margins are intentionally narrow. The lowest light neutral and
categorical mark ratios are `3.01:1` and `3.02:1`, the light ordered adjacent
step is `1.30:1`, and the corresponding dark minima are `5.94:1`, `3.05:1` and
`1.32:1`. [SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/color/palettes.json:64-103] [SOURCE: .opencode/skills/sk-design/sk-design-chart/scripts/color-gates.cjs:38-60]

Light and dark values are authored as separate neutral, ordered and categorical
systems. The dark ground is `#26251E`, its ink is `#F7F7F4` and its rule is
`#F7F7F417`, or `9.02%` alpha. Rule is structural and is intentionally outside
the mark gates. [SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/color/palettes.json:5-17,76-103] [SOURCE: .opencode/skills/sk-design/sk-design-chart/references/color-system.md:197-203,292-294]

The ordered ramp is the only supported multi-step sweep. A local shadcn numeric
comparison does not establish a safer raw blue family, and the local Carbon,
Apple, Vercel and Observable captures do not expose external hex or RGB token
values for an admissible contrast calculation. [SOURCE: .opencode/skills/sk-design/sk-design-chart/references/color-system.md:50-64,223-240] [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/index.md:7-14,35-38,49-58]

Angle result: preserve the exact palette, its separate dark blocks, role
semantics and structural rule. Use existing tokens for signed-area additions
and rerun both-theme gates for any future source change. `newInfoRatio=0.68`
because this angle supplies the full two-theme contrast evidence and rules out
unmeasured palette swaps. The next focus is angle 5, missing micro-forms and
checker assertions.

## Iteration 5 — Missing micro-forms and checker assertions

The current question-first catalog has 26 full-size forms. It already answers
numeric daily trend, word-heavy horizontal comparison, goal progress and
countable part-to-whole, while explicitly keeping pie, radar and sankey out.
The remaining gap is compact monitoring and context rather than another broad
quantitative family. [SOURCE: .opencode/skills/sk-design/sk-design-chart/references/catalog.md:42-69,128-142,149-167] [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/index.md:25-29]

Three additions earn a place. `spark` should be one compact-trend capability
with line, area and bar variants. `tracker` should represent equal discrete
status blocks over time. `bar-list` should be a compact ranked-list variant
with in-bar labels and right-edge values, sharing the existing comparison
semantics rather than starting a new family. [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/tremor-spark-light.jpg] [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/tremor-tracker-light.jpg] [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/tremor-bar-list-light.jpg] [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/vercel-analytics-light-01.jpg]

KPI delta remains optional card anatomy when the data supplies a meaningful
baseline, not a catalog id. `progress-single` and `unit-ring` already cover
their questions, so the inspected gauge and ring imagery does not justify
`progress-circle` or `radial-ring` rows. [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/tremor-spark-light.jpg] [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/layerchart-light-01.jpg] [SOURCE: .opencode/skills/sk-design/sk-design-chart/references/catalog.md:53,61,132,139-142]

The existing checker can enforce file shape, identity, card parts, type scale,
radius, geometry, palette gates, series mapping, empty state, number format,
catalog alignment, tooltip state and pointer or table reach through its named
assertions. Headline quality, metric eligibility, point density, meaningful
zero, guide density, hue robustness and radial worth remain per-template
judgement. Two proposed assertions, `mark-policy` and `tooltip-indicator`,
would be justified only after those declarations enter the written contract.
[SOURCE: .opencode/skills/sk-design/sk-design-chart/scripts/README.md:73-131] [SOURCE: .opencode/skills/sk-design/sk-design-chart/references/template-contract.md:502-514,539-545,589-619]

Angle result: add `spark`, `tracker` and `bar-list`; keep KPI delta conditional;
preserve the existing progress and ring answers; and use the current checker
as the acceptance floor. `newInfoRatio=0.74` because this angle resolves the
missing-form frontier and separates stable checker contracts from per-template
judgement. The next phase is synthesis.

## Final Synthesis

### Decision

The standalone corpus should receive a narrow visual upgrade focused on compact
reading modes and explicit per-template semantics. The evidence does not support
a global card restyle, a new dashboard shell, a palette replacement or a blanket
change to marks and interaction geometry. The current five-part card, geometry
block, type scale, palette systems, tooltip card, below-plot legend and reversible
dimming are the baseline to carry forward. [SOURCE: iterations/iteration-001.md] [SOURCE: iterations/iteration-002.md] [SOURCE: iterations/iteration-003.md] [SOURCE: iterations/iteration-004.md]

### Ranked upgrade recommendations

1. Add one `spark` capability with line, area and bar variants. It answers the
   compact trend question shown by Tremor and Vercel while `daily-line` remains
   the full one-reading-per-day form. If the one-file identity rule requires
   three files, keep them linked as one question family rather than three
   unrelated catalog gaps. [SOURCE: iterations/iteration-005.md] [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/tremor-spark-light.jpg] [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/vercel-analytics-light-01.jpg]

2. Add `tracker` as a discrete status-over-time form. Its equal blocks answer
   healthy, missing or exceptional periods, which is not the numeric question
   answered by `daily-line` or the full-year quantity question answered by
   `calendar-grid`. Use the existing categorical role and no new unmeasured
   status palette. [SOURCE: iterations/iteration-005.md] [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/tremor-tracker-light.jpg] [SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/color/palettes.json:95-103]

3. Add `bar-list` as a compact ranked-list variant. In-bar labels and right-edge
   values solve the long-name density problem shown by Tremor, while the reader
   question remains comparison and can share `bar-rows` semantics and the
   existing palette. [SOURCE: iterations/iteration-005.md] [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/tremor-bar-list-light.jpg] [SOURCE: .opencode/skills/sk-design/sk-design-chart/references/catalog.md:49-50]

4. Add an optional metric-and-delta anatomy block only when the data supplies a
   meaningful baseline. It belongs around an existing chart question, not in
   the catalog as `kpi-delta`, and its values must remain in the chart table.
   [SOURCE: iterations/iteration-001.md] [SOURCE: iterations/iteration-005.md] [SOURCE: .opencode/skills/sk-design/sk-design-chart/references/template-contract.md:604-619]

5. Apply the scoped per-template refinements: a sparse-point policy, a
   meaningful-zero signed-area policy, truthful tooltip indicator kinds, and
   data-backed contextual totals. A cursor guide is earned only by a dense
   multi-series form. These are decisions at the form boundary, not global
   resets. [SOURCE: iterations/iteration-002.md] [SOURCE: iterations/iteration-003.md]

### Preserve unchanged

- Keep the 760px card, shared padding, five-part order, figure floor and
  conclusion footer. [SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/daily-line.html:59-107,226-245]
- Keep the 2px line, restrained single-area fade, flat separated stack and
  baseline-anchored columns. [SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/daily-line.html:128-147] [SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/stacked-area.html:128-142,515-527] [SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/bar-columns.html:266-280]
- Keep the 128px tooltip floor, 6px by 10px padding, bounded placement,
  table-backed readout, reversible dimming and below-plot legend default.
  [SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/daily-line.html:173-203,393-436,599-703] [SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/stacked-area.html:578-603,664-698]
- Keep the exact light and dark palette blocks, their three semantic systems,
  ordered-only sweeps and structural rule role. The local gates clear both
  themes but several margins are narrow. [SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/color/palettes.json:5-17,64-103] [SOURCE: .opencode/skills/sk-design/sk-design-chart/references/color-system.md:197-240,244-294]

### Checker-enforceable boundary

The following existing assertions belong in the acceptance floor for every new
micro-form. They check stable contracts or machine-observable behavior, with
the listed failure as the proof target.

| Contract surface | Existing assertions | Failure caught |
| --- | --- | --- |
| File and identity | `document-shape`, `identity`, `accessibility`, `script-parses`, `unique-ids`, `determinism`, `motion` | A fragment, wrong id, inaccessible document, parse error, duplicate id or unstable drawing ships as a form |
| Card and geometry | `card-parts`, `type-scale`, `radius`, `geometry-block`, `narrow-viewport` | A required part is missing or out of order, a font size or corner is off-register, shared geometry drifts or the drawing has no narrow-screen pan floor |
| Palette and mapping | `palette-block`, `design-md`, `colour-literals`, `palette-source`, `palette-source-dark`, `series-mapping`, `gradient-sweep` | A theme block drifts, a literal leaks outside it, a light or dark gate fails, series indices shuffle or an unordered category receives a magnitude sweep |
| Catalog and data | `data-block`, `empty-notice`, `number-format`, `catalog`, `catalog-system` | A form has no bounded data, draws through its empty notice, depends on host locale formatting or disagrees with the index or declared system |
| Interaction and readout | `interaction-hygiene`, `interaction-state`, `legend`, `tooltip-card`, `pointer-contract-coverage`, `card-readout`, `pointer-reach` | Focus or selection hygiene is removed, a tooltip opens prefilled, a legend omits a series, a form has no contract row, the card outruns its table or a mark cannot be reached |

[SOURCE: .opencode/skills/sk-design/sk-design-chart/scripts/README.md:73-131] [SOURCE: .opencode/skills/sk-design/sk-design-chart/references/template-contract.md:394-410,543-545,589-619]

Two additional assertions are justified only after their declarations are added
to the written contract:

- `mark-policy` could require `point`, `curve`, `fill` and `meaningful-zero`
  declarations. Its error should identify a missing policy or a signed area
  paired with a non-zero baseline. It must not decide whether a particular
  density deserves visible dots.
- `tooltip-indicator` could require the tooltip indicator kind to match the
  declared mark kind. Its error should identify a composed series whose line is
  represented by a bar-shaped indicator. It must not force icons or a single
  indicator treatment on every form.

These are proposed assertions, not current checks. [SOURCE: iterations/iteration-005.md] [SOURCE: .opencode/skills/sk-design/sk-design-chart/scripts/README.md:97-116]

### Per-template judgement

The following remain review decisions: whether a headline is a conclusion,
whether a metric delta is meaningful, whether dots help at a given density,
whether zero is semantically meaningful, which curve and label density a form
needs, whether a cursor guide earns its space, whether a contextual total is
data-backed, whether a legend should depart from the compact default, and
whether hue or CVD review finds a problem. Static checks should not pretend to
settle these questions. [SOURCE: .opencode/skills/sk-design/sk-design-chart/references/template-contract.md:506-514,539-545] [SOURCE: iterations/iteration-002.md] [SOURCE: iterations/iteration-003.md] [SOURCE: iterations/iteration-004.md]

### Explicit exclusions

Do not add `progress-circle` or `radial-ring` as new catalog questions from the
inspected gauge and ring imagery alone. `progress-single`, `unit-ring` and
`unit-grid` already provide honest goal-progress and countable or percentage
part-to-whole answers, while the Apple Health ring imagery is product status art
rather than a standalone quantitative chart. Do not add universal KPI tabs,
dashboard chrome, global visible dots, universal gradients, global tooltip
restyling, a permanent cursor guide, a raw shadcn blue family, reversed dark
arrays or categorical sweeps. [SOURCE: .opencode/skills/sk-design/sk-design-chart/references/catalog.md:53,61,132,139-142] [SOURCE: iterations/iteration-001.md] [SOURCE: iterations/iteration-002.md] [SOURCE: iterations/iteration-003.md] [SOURCE: iterations/iteration-004.md] [SOURCE: iterations/iteration-005.md]

## Eliminated Alternatives

| Alternative | Why it was eliminated | Evidence |
| --- | --- | --- |
| Universal dashboard chrome or a larger global card shell | The references show application context while the standalone contract already has a measured five-part card and per-form plot geometry. | [SOURCE: iterations/iteration-001.md] |
| Global dots, smooth stacks, baseline-end rounding or global tooltip restyling | Point, curve, fill, baseline and interaction choices carry meaning at the form boundary. | [SOURCE: iterations/iteration-002.md] [SOURCE: iterations/iteration-003.md] |
| Raw shadcn blue palette, reversed dark arrays or categorical sweeps | The current two-theme role systems clear their gates, the dark values are explicit and categorical colour does not encode magnitude. | [SOURCE: iterations/iteration-004.md] |
| Progress-circle or radial-ring catalog rows | Existing progress and countable-ring forms cover the questions, while the inspected radial imagery adds shape without a distinct data contract. | [SOURCE: iterations/iteration-005.md] |
| Checker assertions for headline quality, metric eligibility or guide density | These are review judgements rather than stable machine-observable contracts. | [SOURCE: iterations/iteration-005.md] [SOURCE: .opencode/skills/sk-design/sk-design-chart/references/template-contract.md:506-514] |

## Divergence Map

- Saturated directions: global card shell, dashboard chrome, global mark
  restyle, global tooltip geometry, global legend relocation and unmeasured
  palette replacement.
- Pivots taken: none. Failed pivots: none. Audited overrides: none.
- Remaining frontier: none. The five ordered angles were all completed and the
  final question was resolved into spark, tracker, bar-list and checker-boundary
  recommendations.
- Council artifacts: none. This detached lineage used the inline executor and
  did not dispatch a nested agent.
  [SOURCE: deep-research-strategy.md] [SOURCE: findings-registry.json]

### Evidence limits and terminal report

The run used the curated local library only. The screenshots establish
composition and mark roles, but the Carbon, Apple, Vercel and Observable
captures do not supply external hex or RGB tokens, so no external contrast
claim was made. Tracker and spark interaction contracts still need a later
rendered review when their templates exist. [SOURCE: iterations/iteration-004.md] [SOURCE: iterations/iteration-005.md]

All five ordered angles completed with ratios `0.86`, `0.78`, `0.72`, `0.68`
and `0.74`. The terminal synthesis stopped at the configured cap with
`stopReason: maxIterationsReached`. Convergence telemetry was treated as
telemetry only, as required by the brief. [SOURCE: deep-research-config.json] [SOURCE: deep-research-state.jsonl]

## Convergence Report

- Stop reason: `maxIterationsReached`
- Total iterations: 5
- Questions answered: 5 / 5
- Remaining questions: 0
- Last 3 iteration summaries: run 3, tooltip and interaction states (`0.72`); run 4, colour and dark ground (`0.68`); run 5, micro-forms and checker assertions (`0.74`)
- Convergence threshold: `0.05`
- Divergence summary: no pivots, no failures, no audited overrides and no remaining frontier. [SOURCE: deep-research-config.json] [SOURCE: deep-research-strategy.md] [SOURCE: findings-registry.json]
