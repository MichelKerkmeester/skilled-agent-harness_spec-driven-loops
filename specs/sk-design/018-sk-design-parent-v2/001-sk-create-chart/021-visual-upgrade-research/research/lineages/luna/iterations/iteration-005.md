# Iteration 5 — Missing micro-forms and checker assertions

## Iteration 5 — Missing micro-forms and checker assertions

### Focus

Which missing micro-forms earn a place, and which enforceable rules belong in
the checker?

### Sources Consulted

- Question-first catalog and current form inventory: `.opencode/skills/sk-design/sk-design-chart/references/catalog.md:42-69,122-167`.
- Per-form pointer contract and checker boundary: `.opencode/skills/sk-design/sk-design-chart/references/template-contract.md:394-410,502-545,558-587`.
- Checker assertion inventory and failure responsibilities: `.opencode/skills/sk-design/sk-design-chart/scripts/README.md:73-131`.
- Micro-form captures: `tremor-tracker-light.jpg`, `tremor-bar-list-light.jpg`, `tremor-spark-light.jpg`, `tremor-blocks-light.jpg` and `vercel-analytics-light-01.jpg`.
- Radial and ring captures: `layerchart-light-01.jpg` through `layerchart-light-04.jpg`, `apple-health-light-01.jpg` and `apple-health-light-02.jpg`.
- Reference descriptions: `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/index.md:17-29`.

### What was read

The question-first catalog contains 26 current forms. It already has
`daily-line` for one reading per day, `bar-rows` for word-heavy horizontal
comparison, `progress-single` for one value against a goal and `unit-ring` for
countable part-to-whole groups. The catalog also records `unit-grid` as the
percentage counterpart and explicitly keeps arc-based pie, radar and sankey out
of the corpus. [SOURCE: .opencode/skills/sk-design/sk-design-chart/references/catalog.md:42-69,128-142,149-167]

The pointer contract says that a card exists on only 18 forms today, while
other forms print their values or declare an inert reason. It names
`progress-single` and `unit-ring` as already self-describing, and it gives
`bar-rows` a terminal value at the bar end. The contract therefore separates a
new question from a compact rendering of an existing question. [SOURCE: .opencode/skills/sk-design/sk-design-chart/references/template-contract.md:535-587]

The checker already has file-level, palette, card, geometry, interaction,
catalog and render assertions. The documented extended set includes
`empty-notice`, `interaction-hygiene`, `interaction-state`, `number-format`,
`gradient-sweep`, `pointer-contract-coverage`, `pointer-reach`,
`card-readout`, `palette-source`, `palette-source-dark`, `catalog`,
`catalog-system` and `geometry-block`. It checks declared contracts and
machine-observable behavior, not whether a headline is a good conclusion or
whether a particular chart type is aesthetically appropriate. [SOURCE: .opencode/skills/sk-design/sk-design-chart/scripts/README.md:73-131] [SOURCE: .opencode/skills/sk-design/sk-design-chart/references/template-contract.md:502-514]

### What was seen or measured

The Tremor tracker capture is a single horizontal run of small, equally sized
status blocks. Its example includes long runs of green with isolated red and
amber blocks, a missing-data segment in the larger example and an optional
hover effect. This is a discrete status-over-time question rather than a
continuous quantity that should be folded into `calendar-grid` or `daily-line`.
[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/tremor-tracker-light.jpg]

The Tremor bar-list capture places the category name inside each horizontal bar
and the value at the right edge. It is compact and rank-readable even when the
labels are path-like words. That differs from the current `bar-rows` geometry,
which leaves the label outside the bar and uses the bar end as the value
anchor. [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/tremor-bar-list-light.jpg] [SOURCE: .opencode/skills/sk-design/sk-design-chart/references/catalog.md:49-50]

The Tremor spark capture shows line, filled-area and column variants in the
same small footprint. Its context example pairs a compact line with a primary
value and a green period delta. Vercel's analytics capture demonstrates the
same low-height trend role with multiple thin series and a sparse time axis.
[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/tremor-spark-light.jpg] [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/vercel-analytics-light-01.jpg]

LayerChart details 01 through 04 show a 70 percent gauge, a partial ring and
multi-ring progress compositions. The Apple Health captures show a product
notification and a heart-shaped status icon, not a quantitative ring chart
whose values can be read as a standalone corpus form. [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/layerchart-light-01.jpg] [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/layerchart-light-02.jpg] [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/layerchart-light-03.jpg] [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/layerchart-light-04.jpg] [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/apple-health-light-01.jpg] [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/apple-health-light-02.jpg]

### Findings

1. The missing set is a micro-form frontier, not a hole in the full-size
   quantitative catalog. The current 26 rows already cover the common
   distribution, comparison, composition, time, relationship and matrix
   questions. The reference library adds compact monitoring and context
   components that are not represented as rows, so the additions should be
   limited to forms with a distinct question or a distinct compact reading
   contract. [SOURCE: .opencode/skills/sk-design/sk-design-chart/references/catalog.md:42-69,105-118] [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/index.md:25-29]

2. A spark capability earns a place as one question with line, area and bar
   mark variants. The question is a small trend used beside a primary value,
   not a replacement for the full `daily-line` form. Treating the three marks
   as one spark family avoids three catalog rows that differ only in mark
   geometry. If the one-file-per-identity rule requires separate files, the
   files should remain linked variants of one `spark` question rather than
   independent gaps. [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/tremor-spark-light.jpg] [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/vercel-analytics-light-01.jpg] [SOURCE: .opencode/skills/sk-design/sk-design-chart/references/catalog.md:57]

3. A tracker earns a place as a discrete status-over-time form. Its equal
   blocks answer whether each period was healthy, missing or exceptional,
   while `daily-line` answers how a numeric reading moved and `calendar-grid`
   answers a year of quantities. A tracker can use the existing categorical
   role and must not introduce a new status palette solely to copy the
   reference capture. [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/tremor-tracker-light.jpg] [SOURCE: .opencode/skills/sk-design/sk-design-chart/references/catalog.md:57,59] [SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/color/palettes.json:95-103]

4. A bar-list earns a place as a compact ranked-list variant, but not as a
   new comparison family. In-bar labels and right-edge values make long names
   readable in the compact footprint shown by Tremor. The distinction from
   `bar-rows` is a stable label-placement and density contract, so the
   implementation should share the existing comparison semantics and palette
   register rather than inventing a new mark family. [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/tremor-bar-list-light.jpg] [SOURCE: .opencode/skills/sk-design/sk-design-chart/references/catalog.md:49-50]

5. KPI delta belongs in card anatomy, not in the chart catalog. Vercel,
   Tremor and Apple foreground a primary value with a period or range before a
   chart, so the earlier metric-and-delta opportunity remains useful for forms
   whose data supplies a meaningful baseline. It should be optional and
   data-backed. `progress-single` already answers value versus goal and
   `unit-ring` already answers countable part-to-whole, so a generic
   `progress-circle` or `radial-ring` row would duplicate an existing question
   and add angle-estimation cost. [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/tremor-spark-light.jpg] [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/vercel-docs-analytics-light-01.jpg] [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/apple-hig-charts-light-07.jpg] [SOURCE: .opencode/skills/sk-design/sk-design-chart/references/catalog.md:53,61,132,139-142]

6. The checker should enforce stable shared contracts and leave question-fit
   and visual judgement to each template. Existing assertions can enforce the
   document and identity shape (`document-shape`, `identity`, `accessibility`,
   `script-parses`, `unique-ids`, `determinism`, `motion`), the card and layout
   register (`card-parts`, `type-scale`, `radius`, `geometry-block`,
   `narrow-viewport`), the palette (`palette-block`, `design-md`,
   `colour-literals`, `palette-source`, `palette-source-dark`,
   `catalog-system`, `series-mapping`, `gradient-sweep`) and the interaction
   and data boundary (`empty-notice`, `interaction-hygiene`,
   `interaction-state`, `number-format`, `legend`, `tooltip-card`,
   `pointer-contract-coverage`, `card-readout`, `pointer-reach`). Their
   failures are concrete: a missing card part, an unapproved font size, a
   hard-coded corner, a drifted geometry block, a literal outside the palette,
   a palette that fails a theme gate, an index/file mismatch, a shuffled series
   token, a gradient that encodes unordered categories, an empty-state guard
   that draws anyway, a prefilled tooltip, a host-locale number, an unreachable
   mark or a card value absent from the table. [SOURCE: .opencode/skills/sk-design/sk-design-chart/scripts/README.md:73-131] [SOURCE: .opencode/skills/sk-design/sk-design-chart/references/template-contract.md:394-410,543-545,589-619]

7. Two new assertions would be justified only if the corresponding contracts
   are first made explicit. A proposed `mark-policy` assertion could require a
   new form to declare its point, curve, fill and meaningful-zero policy, with
   an error such as `mark policy is missing or combines signed data with a
   non-zero baseline`; it should not decide whether a particular density
   deserves visible dots. A proposed `tooltip-indicator` assertion could
   compare each tooltip indicator kind with the declared mark kind, failing a
   composed form that reports a line with a bar-shaped square. Until those
   declarations exist, metric eligibility, headline quality, guide density,
   legend position outside the compact default, hue or CVD robustness and the
   decision to add a radial form remain per-template review. The contract
   explicitly says it does not judge the headline or the picture by eye, which
   is the boundary to preserve. [SOURCE: .opencode/skills/sk-design/sk-design-chart/references/template-contract.md:502-514,539-545] [SOURCE: .opencode/skills/sk-design/sk-design-chart/scripts/README.md:97-116]

### Recommendations

- Add one `spark` capability with line, area and bar variants, plus `tracker`
  and `bar-list` as the three micro-form additions that answer distinct compact
  reading needs. Reuse the existing five-part card, geometry block, type scale
  and palette systems.
- Keep KPI delta as an optional metric-and-delta anatomy block. Require a
  supplied baseline and use the existing number-format and table contract. Do
  not add it as a standalone chart id.
- Keep `progress-single`, `unit-ring` and `unit-grid` as the current answers
  for goal progress and countable or percentage part-to-whole. Do not add
  `progress-circle` or `radial-ring` from the inspected captures alone.
- Make the listed existing assertions the acceptance floor for every new
  micro-form. Consider `mark-policy` and `tooltip-indicator` only after their
  declarations are part of the written contract. Leave visual hierarchy,
  density, guide use, metric eligibility and the question-fit decision to
  per-template review.

### What this iteration could not settle

- The local captures do not provide enough interaction evidence to choose a
  definitive tracker tooltip contract or decide whether a spark should be
  inert, tooltip-bearing or table-first for every variant.
- The one-file catalog shape does not currently define how linked visual
  variants share one question id, so `spark` versus three sibling ids needs a
  catalog decision before implementation.
- No static checker rule can decide whether a metric delta is analytically
  meaningful, whether visible dots help at a given density or whether a
  radial representation is honest for a particular unit.
- The proposed new assertion names are recommendations, not existing checks.
  Their exact markup contract and error wording remain to be designed if the
  corpus adopts them.
- The inspected Apple Health ring imagery is product status art rather than a
  standalone chart reference, so it cannot settle a chart-level radial use
  case. [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/apple-health-light-01.jpg] [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/apple-health-light-02.jpg]

### Assessment

The final frontier is small and specific. Add compact trend, status and ranked
list capabilities, then carry the existing card, palette, data and interaction
contracts into them. Treat KPI delta as conditional anatomy and keep progress
and radial rings out of the catalog until a distinct question and an honest
reading contract exist.

### Reflection

The reference library is broad enough to make omission visible, but breadth is
not itself a reason to grow the corpus. The useful additions are the captures
that change the question or the compact reading mode. The ring captures change
shape without changing the already-covered question, while the tracker, spark
and bar-list captures change what a reader can ask in a small footprint.

### Recommended Next Focus

Synthesis: combine the five angle results into a ranked visual-upgrade brief,
separate checker gates from template judgement and preserve the exact palette
and scope boundaries.

### Ruled-out directions

- Adding `progress-circle` or `radial-ring` as new catalog questions solely from
  gauge and ring imagery. [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/layerchart-light-01.jpg] [SOURCE: .opencode/skills/sk-design/sk-design-chart/references/catalog.md:61,132,139-142]
- Treating KPI delta as a sixth universal card part or a standalone chart id.
  [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/tremor-spark-light.jpg] [SOURCE: .opencode/skills/sk-design/sk-design-chart/references/catalog.md:61]
- Adding three unrelated catalog rows for spark line, spark area and spark bar.
  [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/tremor-spark-light.jpg]
- Replacing the current `bar-rows` comparison semantics with a new palette or
  external implementation merely to reproduce the Tremor bar-list capture.
  [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/tremor-bar-list-light.jpg] [SOURCE: .opencode/skills/sk-design/sk-design-chart/references/catalog.md:49-50]
- Making the checker judge headline quality, guide density, metric eligibility
  or radial worth. [SOURCE: .opencode/skills/sk-design/sk-design-chart/references/template-contract.md:506-514]

### Metrics

- `newInfoRatio`: `0.74`.
- Novelty justification: this iteration resolves the missing-form frontier into
  three compact additions and separates stable checker contracts from
  per-template judgement, which the previous four angles did not settle.
- `ruledOutDirections`: 5.
- `openQuestionsAfterIteration`: 0.
