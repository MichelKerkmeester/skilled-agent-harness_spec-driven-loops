# Iteration 4 - Colour and the dark ground

## Iteration 4 - Colour and the dark ground

### Focus

Which colour and dark-ground changes are numerically safe under the cursor
register and its gates?

### Sources Consulted

- Palette source: `.opencode/skills/sk-design/sk-design-chart/assets/color/palettes.json:1-105`.
- Cursor register, semantic systems and gates: `.opencode/skills/sk-design/sk-design-chart/references/color-system.md:41-58,183-240,244-294`.
- Shared contrast arithmetic: `.opencode/skills/sk-design/sk-design-chart/scripts/color-gates.cjs:17-60`.
- Checker gate descriptions: `.opencode/skills/sk-design/sk-design-chart/scripts/README.md:75-81,126-130`.
- Numeric shadcn comparison already recorded in the local reference: `.opencode/skills/sk-design/sk-design-chart/references/color-system.md:50-64`.
- Reference captures inspected: `library/details/carbon-palettes-light-01.jpg` through `carbon-palettes-light-08.jpg`, `apple-hig-charts-light-01.jpg`, `apple-hig-charts-light-07.jpg`, `apple-hig-charts-light-08.jpg`, `shadcn-area-light-02.jpg`, `shadcn-bar-light-05.jpg`, `vercel-analytics-light-01.jpg`, `vercel-analytics-light-03.jpg`, `vercel-analytics-dark-03.jpg`, `plot-area-docs-light-01.jpg`, and `plot-area-docs-dark-06.jpg`.

### What was read

The palette source defines light chrome as surface `#F7F7F4`, ink `#26251E`,
muted `#72716C` and rule `#CDCDC9`. Dark chrome uses surface `#26251E`, ink
`#F7F7F4`, muted `#A1A19F` and rule `#F7F7F417`, where the final byte is the
alpha channel. The radius ladder is `2px`, `4px`, `4px`, `4px`, `8px`, and the
text and mark gate thresholds are stored in the same source.
[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/color/palettes.json:5-39,64-74]

The neutral system has four light series values `#26251E`, `#7A7974`,
`#84847E`, `#908F8D` and four dark values `#F7F7F4`, `#E6E5E0`, `#CDCDC9`,
`#A1A19F`. The ordered system has five light values from `#E64B02` to
`#F7DACB` and five dark values from `#F54E00` to `#603116`. The categorical
system has light values `#F54E00`, `#1F8A65`, `#CF2D56`, `#BE8332` and dark
values `#F54E00`, `#1F8A65`, `#CF2D56`, `#C08532`.
[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/color/palettes.json:76-103]

The color system says neutral is the default and categorical is for four or
fewer unordered categories. Ordered is for magnitude or position. Index zero
stays furthest from the ground in each theme. Sweeps are restricted to ordered
systems, while a one-series two-opacity area fade remains a fade rather than a
multi-series sweep. [SOURCE: .opencode/skills/sk-design/sk-design-chart/references/color-system.md:41-48,197-240]

The gates are `textOnSurface >= 4.5`, `markOnSurface >= 3.0`,
`rampDarkestOnSurface >= 3.0`, `rampLightestOnSurface >= 1.15`,
`rampStepSeparation >= 1.3` and `emphasisAgainstFirstSeries >= 1.5`. They run
separately against each theme's own surface. Rule is intentionally ungated.
[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/color/palettes.json:64-74]
[SOURCE: .opencode/skills/sk-design/sk-design-chart/references/color-system.md:244-294]

The shared arithmetic converts sRGB channels to linear light, calculates
relative luminance and returns the WCAG contrast ratio. The independent
calculation for this iteration used that exact local implementation and the
hex values in the palette source. [SOURCE: .opencode/skills/sk-design/sk-design-chart/scripts/color-gates.cjs:17-60]

The local reference set contains Carbon palette crops, Apple chart crops,
shadcn area and bar crops, Vercel analytics crops and Observable Plot area
crops. The capture files provide rendered pixels and the local index provides
source descriptions, but they do not provide an accompanying external hex or
RGB token table. The only external numeric colour comparison available in the
local text is the previously recorded shadcn comparison.
[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/index.md:7-14,35-38,49-58]
[SOURCE: .opencode/skills/sk-design/sk-design-chart/references/color-system.md:50-64]

### What was seen or measured

The contrast calculation produced these ratios, rounded to two decimals:

| System or role | Light-ground result | Dark-ground result | Gate |
| --- | ---: | ---: | ---: |
| Ink on surface | 14.33 | 14.33 | 4.50 |
| Muted on surface | 4.56 | 5.94 | 4.50 |
| Neutral series minimum on surface | 3.01 | 5.94 | 3.00 |
| Categorical series minimum on surface | 3.02 | 3.05 | 3.00 |
| Ordered far end on surface | 3.64 | 4.37 | 3.00 |
| Ordered near end on surface | 1.23 | 1.43 | 1.15 |
| Ordered adjacent-step minimum | 1.30 | 1.32 | 1.30 |
| Categorical emphasis against series 1 | 4.37 | 3.28 | 1.50 |
| Ordered emphasis against series 1 | 3.93 | 3.28 | 1.50 |

[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/color/palettes.json:5-15,77-103]
[SOURCE: .opencode/skills/sk-design/sk-design-chart/references/color-system.md:253-260]
[SOURCE: .opencode/skills/sk-design/sk-design-chart/scripts/color-gates.cjs:38-60]

The current dark rule is `#F7F7F417`, which is `23/255 = 9.02%` alpha. Rule
is excluded from the ratio gates by design. The neutral, ordered and categorical
dark arrays are not byte-reversed copies of the light arrays; each has explicit
values for the dark surface. [SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/color/palettes.json:11-17,81-102]

The local text records the shadcn comparison as `16.0°` minimum adjacent hue
gap and `1.72:1` minimum own/opposite-ground contrast for shadcn light, versus
`92.9°` and `3.37:1` for standalone categorical light. On dark, it records
`71.1°` and `2.92:1/2.15:1` for shadcn versus `96.5°` and `3.38:1/1.72:1`
for standalone categorical. [SOURCE: .opencode/skills/sk-design/sk-design-chart/references/color-system.md:50-58]

The Carbon, Apple, Vercel and Observable crops were inspected for token evidence.
No local file exposes external hex or RGB values, so no external contrast ratio
was inferred from screenshot pixels. Their visible rendering is therefore not
used to justify a new numeric token. [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/carbon-palettes-light-01.jpg]
[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/carbon-palettes-light-05.jpg]
[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/carbon-palettes-light-08.jpg]
[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/apple-hig-charts-light-01.jpg]
[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/shadcn-area-light-02.jpg]
[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/shadcn-bar-light-05.jpg]
[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/vercel-analytics-light-01.jpg]
[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/vercel-analytics-light-03.jpg]
[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/plot-area-docs-light-01.jpg]
[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/plot-area-docs-dark-06.jpg]

### Findings

1. The stock palette clears every applicable numeric gate in both themes, but
   some margins are intentionally narrow. The lowest light categorical mark is
   `3.02:1` against the `3.0:1` gate, the lowest neutral mark is `3.01:1`, and
   the last light ordered step is exactly `1.30:1` from its neighbour. These
   values are safe as shipped and leave little room for an unmeasured lightening,
   opacity change or borrowed reference token. [SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/color/palettes.json:64-103]
   [SOURCE: .opencode/skills/sk-design/sk-design-chart/scripts/color-gates.cjs:38-60]

2. The dark ground is a separate token design, not a reversed light array. The
   dark surface is `#26251E`, the dark ink is `#F7F7F4`, and the dark categorical
   values retain mark ratios of `4.37`, `3.57`, `3.05` and `4.86`. Copying a
   light blue ramp into the dark ground would have to clear the same `3.0:1`
   mark gate and the separate dark ramp rules before it could be considered.
   [SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/color/palettes.json:11-17,95-103]
   [SOURCE: .opencode/skills/sk-design/sk-design-chart/references/color-system.md:197-203,248-271]

3. The numeric comparison supports retaining the standalone role split over a
   raw shadcn blue set. The local record puts shadcn below standalone on the
   recorded own/opposite-ground measures in both themes, while standalone
   categorical reaches `3.37:1` light and `3.38:1` dark on its minimum reported
   measure. This is evidence for keeping the cursor register, not evidence for
   adding another blue family. [SOURCE: .opencode/skills/sk-design/sk-design-chart/references/color-system.md:50-64]

4. The rule value should not be promoted into a mark colour. Light rule is
   `#CDCDC9` and dark rule is `#F7F7F417`, with `9.02%` alpha in the dark form.
   The source explicitly excludes rule from contrast gates because a `3.0:1`
   grid would compete with data. Any new signed-area separator or tooltip border
   should continue to use the existing surface or rule roles rather than invent
   a literal. [SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/color/palettes.json:5-17,64-74]
   [SOURCE: .opencode/skills/sk-design/sk-design-chart/references/color-system.md:219,292-294]

5. The ordered ramp is the only safe place for a multi-step colour sweep under
   the current contract. Its light ratios are `3.64`, `2.77`, `2.11`, `1.61`
   and `1.23` against surface, its dark ratios are `4.37`, `3.32`, `2.51`,
   `1.88` and `1.43`, and adjacent steps clear `1.30` in both themes. A new
   gradient on categorical series would encode an order that the data does not
   have. [SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/color/palettes.json:86-93]
   [SOURCE: .opencode/skills/sk-design/sk-design-chart/references/color-system.md:223-240,253-260]

6. The local Carbon, Apple, Vercel and Observable screenshots cannot establish
   safe external tokens. They can be used as rendered reference material in
   other angles, but this angle has no admissible external hex or RGB values to
   calculate. A direct screenshot sampling would mix anti-aliasing, alpha and
   surrounding pixels and would not identify the source token. [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/index.md:7-14,35-38,49-58]
   [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/carbon-palettes-light-01.jpg]
   [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/apple-hig-charts-light-01.jpg]
   [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/vercel-analytics-dark-03.jpg]
   [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/plot-area-docs-dark-06.jpg]

### Recommendations

- Do not replace the cursor palette, add a blue family or lighten the existing
  categorical and neutral values. Preserve the exact source values and calculate
  any future token through the same gates.
- Keep light and dark palette blocks independently authored. Do not reverse one
  array into the other and do not copy an external screenshot colour without a
  local token and both-theme ratio evidence.
- Keep `rule` as the structural role, including its dark `9.02%` alpha, and use
  `surface` for separators between touching marks.
- If signed-area positive and negative fills are added, choose existing
  categorical tokens or a documented system change and rerun both ground gates.
  Do not create a new polarity palette from an unmeasured red or green.
- Treat hue discrimination and screenshot appearance as review evidence, not as
  numeric gate evidence. The current gates do not define a CVD or hue threshold.

### What this iteration could not settle

- The local reference captures do not expose external hex or RGB token values,
  so exact Carbon, Apple, Vercel and Observable contrast comparisons remain
  unmeasured.
- The ratios are for solid source tokens. Contrast after alpha compositing a
  mark over a non-solid gradient or over another fill needs a rendered review.
- The current gate set does not numerically settle hue distinction or color
  vision deficiency robustness. Those remain review questions under the
  color-not-only-cue rule.
- No palette change is justified by this angle. Any future color upgrade would
  be a source and checker change, not a template-local tweak.

### Assessment

The current cursor palette is numerically safe and intentionally close to several
lower gates. The correct visual upgrade is palette restraint: preserve the three
systems, their separate dark values and their role semantics while using existing
tokens for the scoped mark and interaction additions.

### Reflection

The reference screenshots contain many attractive color families, but the local
evidence boundary changes the conclusion. Only the cursor source supplies tokens
that can be calculated against both grounds, and its ratios already explain why
unmeasured swaps would be risky.

### Recommended Next Focus

Angle 5: inspect the question-first catalog and missing micro-forms, then sort
angle 1 through angle 4 findings into checker-enforceable rules versus
per-template judgement.

### Ruled-out directions

- Replacing the cursor palette with a raw shadcn blue set. [SOURCE: .opencode/skills/sk-design/sk-design-chart/references/color-system.md:50-64]
- Reversing the light arrays to make the dark theme. [SOURCE: .opencode/skills/sk-design/sk-design-chart/references/color-system.md:197-203]
- Adding a new unmeasured external palette token from Carbon, Apple, Vercel or
  Observable screenshots. [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/index.md:7-14,35-38,49-58]
- Using the structural rule role as a data mark. [SOURCE: .opencode/skills/sk-design/sk-design-chart/references/color-system.md:292-294]
- Adding categorical multi-step sweeps. [SOURCE: .opencode/skills/sk-design/sk-design-chart/references/color-system.md:223-228]

### Metrics

- `newInfoRatio`: `0.68`.
- Novelty justification: this iteration supplies the full two-theme contrast
  evidence and rules out unmeasured palette swaps, leaving palette restraint as
  the only numerically supported outcome.
- `ruledOutDirections`: 5.
- `openQuestionsAfterIteration`: 1.
