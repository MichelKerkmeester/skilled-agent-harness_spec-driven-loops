# Iteration 3 - Tooltip, legend and interaction states

## Iteration 3 - Tooltip, legend and interaction states

### Focus

Which tooltip, legend and interaction patterns improve reading without adding
decoration?

### Sources Consulted

- Current tooltip and interaction implementation: `.opencode/skills/sk-design/sk-design-chart/assets/templates/daily-line.html:159-203,356-436,599-735`.
- Current keyed legend and multi-measure implementation: `.opencode/skills/sk-design/sk-design-chart/assets/templates/stacked-area.html:155-206,373-457,578-603,664-760` and `.opencode/skills/sk-design/sk-design-chart/assets/templates/bar-line-composed.html:129-190,422-449,645-705`.
- Pointer and card/readout contract: `.opencode/skills/sk-design/sk-design-chart/references/template-contract.md:392-418,517-587,589-619`.
- Local reference descriptions: `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/index.md:11-26` and `library/details/index.md:23-26`.
- Captures inspected: `library/details/shadcn-tooltip-dark-01.jpg` through `shadcn-tooltip-dark-09.jpg`, `vercel-analytics-dark-03.jpg`, `vercel-analytics-light-03.jpg`, `carbon-anatomy-light-01.jpg`, `carbon-legends-light-01.jpg`, `carbon-legends-light-07.jpg`, `carbon-legends-light-12.jpg`, `carbon-legends-light-13.jpg`, `carbon-legends-light-14.jpg`, `mantine-area-light-01.jpg`, and `mantine-area-light-13.jpg`.

### What was read

The current tooltip is an HTML sibling of the SVG. It has a `128px` minimum
width, `6px 10px` padding, a 1px border at half the rule strength, the palette
pill radius, a `0 4px 12px` shadow at 16% ink, a 4px internal gap, and a 0.2s
opacity transition. Each row is at least `16px` high with an `8px` indicator,
6px indicator-to-label gap and a right-aligned value. Single-series forms hide
the indicator. [SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/daily-line.html:173-203]

The tooltip reads a declared `READOUT` block, opens from a registered mark,
measures its own width, keeps at least an 8px edge inset, and flips to the other
side of the mark when it would overflow. Its datum header and rows are filled
from the same values the table formatter uses. [SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/daily-line.html:356-436]

Series dimming uses an empty `data-chart-dim` state, a 0.3 opacity for the
non-selected series and a 0.2s transition. A mark hover previews the series,
clicking a legend entry latches it, and Enter or Space provides the same legend
control from the keyboard. The pointer resolver gives direct hits priority,
then the smallest containing mark, then the nearest mark within `REACH = 36`.
[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/daily-line.html:159-171,599-633,639-703]

Keyed forms place an HTML legend below the SVG inside the figure. The legend is
a wrapping flex row with a 16px gap and 12px top margin. Each entry is a button
with `aria-pressed`, a palette swatch and a matching label. The composed chart's
legend distinguishes a column with a block from a rate with a 2px line rule,
but the tooltip indicator is still the shared 8px square.
[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/stacked-area.html:106-109,578-603]
[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/bar-line-composed.html:144-160,645-671]

The contract requires a positioned HTML tooltip, one keyed legend below the
plot, an empty initial dim state, the table as the accessibility floor, and a
per-form pointer decision. It explicitly says that placement, flipping,
selection latching and the exact handler behavior remain review questions.
[SOURCE: .opencode/skills/sk-design/sk-design-chart/references/template-contract.md:392-418,517-587,589-619]

The nine shadcn tooltip captures cover the default square indicator, line
indicator, no indicator, custom label, label formatter, no label, value
formatter, icons and an advanced total row. Vercel's light and dark analytics
captures show a date header, a contextual event label, a formatted value with
unit and an active point on the line. Carbon's anatomy capture adds a vertical
guide at the active x position, while its legend captures move from a compact
legend beside or below the plot to a show/hide legend panel. Mantine's area
captures put the keyed series row below the plot. [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/index.md:23-26]
[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/shadcn-tooltip-dark-01.jpg]
[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/shadcn-tooltip-dark-02.jpg]
[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/shadcn-tooltip-dark-03.jpg]
[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/shadcn-tooltip-dark-04.jpg]
[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/shadcn-tooltip-dark-05.jpg]
[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/shadcn-tooltip-dark-06.jpg]
[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/shadcn-tooltip-dark-07.jpg]
[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/shadcn-tooltip-dark-08.jpg]
[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/shadcn-tooltip-dark-09.jpg]

### What was seen or measured

- The current tooltip's minimum width is `128px`, its horizontal padding totals `20px`, its row minimum is `16px` and its indicator is `8px`. The card is clamped to the figure with an `8px` inset and a `12px` gap from the mark. [SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/daily-line.html:179-203,421-434]
- The current multi-series readout puts one datum label above the rows and values in a right-aligned monospace column. The stacked area intentionally reports the selected band's whole-period total, while the table carries monthly values and a total footer. [SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/stacked-area.html:410-452,644-662]
- The current legend is below the plot, centered, with `16px` between entries and `12px` from the SVG. The composed legend carries a block swatch for columns and a line rule for the rate. [SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/stacked-area.html:106-109,578-603]
[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/bar-line-composed.html:158-160,645-671]
- The code updates `aria-pressed` on a latched legend button, but it attaches only click and keydown handlers to entries. There is no pointerenter or pointerleave preview for the legend itself, despite the surrounding comments describing a key-entry hover. Mark hover and legend selection are therefore different interaction modes. [SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/stacked-area.html:664-698]
- The shadcn tooltip captures keep the same two-column label/value alignment while varying the indicator, header label, formatter and total row. The advanced capture adds a divider and a `Total` row. [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/shadcn-tooltip-dark-01.jpg]
[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/shadcn-tooltip-dark-02.jpg]
[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/shadcn-tooltip-dark-03.jpg]
[SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/shadcn-tooltip-dark-09.jpg]

### Findings

1. The shipped tooltip geometry is already a strong contract match. The HTML
   card is bounded, palette-driven, positioned against the mark, initialized
   empty and wired to the same `READOUT` values as the table. A global change to
   padding, radius or shadow would be a visual reset without evidence of a
   reading failure. [SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/daily-line.html:173-203,393-436]
   [SOURCE: .opencode/skills/sk-design/sk-design-chart/references/template-contract.md:415-418,621-625]

2. The current header and value alignment is the right default, but some forms
   need an optional readout mode. Shadcn's formatter and advanced total variants
   and Vercel's date, event label and unit show useful additions when a datum
   has a contextual label, unit or derived total. The current stacked-area
   whole-period total is already one example of a derived value that must be
   reconciled with the table. Add these rows only when the data contract names
   them, never as decorative tooltip chrome.
   [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/shadcn-tooltip-dark-05.jpg]
   [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/shadcn-tooltip-dark-09.jpg]
   [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/vercel-analytics-dark-03.jpg]
   [SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/stacked-area.html:644-662]

3. Tooltip indicator shape is the clearest interaction gap. Every current
   tooltip row paints an 8px square, while the composed chart's legend correctly
   distinguishes a column block from a line rule. Shadcn's line-indicator
   variant and Carbon's anatomy capture show that a line-like indicator can
   preserve mark identity inside the readout. The improvement should be a
   per-series `indicator` choice such as `swatch`, `rule` or `none`, defaulting
   to the current swatch. Icons should remain opt-in.
   [SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/daily-line.html:197-203,409-417]
   [SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/bar-line-composed.html:158-160,645-671]
   [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/shadcn-tooltip-dark-02.jpg]
   [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/carbon-anatomy-light-01.jpg]

4. Hover dimming is useful and already bounded. The current `0.3` non-selected
   opacity, empty initial state, pointer-leave reset, click latch and keyboard
   handling give a reader a reversible comparison without changing the settled
   picture. A legend entry is selection-only in the code, not a hover preview.
   That distinction is acceptable, but the comments and contract-facing notes
   should name it accurately before any behavior is extended. [SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/stacked-area.html:155-169,664-698]

5. Below-plot legend placement is the best small-card default. Mantine uses the
   same relationship, while Carbon's right-side legend and show/hide panel
   belong to larger application compositions. Keep the contract's below-plot
   position and `16px` gap. A long-label or high-series form may choose an
   explicit wrap or start alignment, but moving every legend above or beside the
   plot would spend space without improving the common two-to-four-series case.
   [SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/stacked-area.html:106-109,578-603]
   [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/mantine-area-light-13.jpg]
   [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/carbon-legends-light-07.jpg]
   [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/carbon-legends-light-13.jpg]

6. A cursor guide is an optional dense-series aid, not a universal addition.
   Carbon's anatomy and the Vercel analytics capture pair an active point with
   a vertical guide or strong active marker, but shadcn's default tooltip works
   without a full guide. The current bounded card position is adequate for
   single-series forms. A multi-series, close-crossing form could declare a
   `cursorGuide` policy if the x position otherwise cannot be held against the
   header, with the guide kept out of the default register.
   [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/carbon-anatomy-light-01.jpg]
   [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/vercel-analytics-light-03.jpg]
   [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/shadcn-tooltip-dark-01.jpg]

### Recommendations

- Keep the current tooltip geometry, table fallback, initial empty state, and
  bounded placement as the global register.
- Add a per-series tooltip indicator contract. Use a square or swatch for bar
  and area marks, a 2px rule for line marks and `none` only where the label
  already carries the identity. Keep the indicator token palette-driven.
- Permit an optional header label, unit suffix and derived total only when the
  template's data contract supplies them and the table carries the same value.
- Treat legend buttons as selection controls. Either correct the surrounding
  description to say click and keyboard latch, or make hover/focus preview an
  explicit contract change with a separate temporary state. Do not silently
  mix the two behaviors.
- Retain below-plot legends and current dimming. Consider a per-form cursor
  guide only for dense multi-series forms after a rendered review shows that the
  header alone does not anchor the selected x position.

### What this iteration could not settle

- Whether the indicator mode belongs in `CHART_SERIES`, `READOUT` or a new
  tooltip-local block is an implementation seam, not a visual conclusion.
- The captures do not establish a universal series-count or label-length
  threshold for changing legend alignment or adding a cursor guide.
- The table remains the screen-reader data floor. This iteration did not test
  whether adding a tooltip role or live-region announcement would improve a
  particular assistive technology without duplicating the table.
- Exact active-state styling for a latched legend still needs a rendered review;
  the current opacity dim is observable, while an additional icon or underline
  would be a new visual signal.

### Assessment

The interaction system is shipped and mostly sound. The actionable visual gap is
indicator semantics for mixed mark types. Optional contextual headers, totals and
cursor guides should be earned by a form's data shape and density.

### Reflection

The nine shadcn tooltip variants are valuable as a matrix of choices rather than
as nine features to copy. Once compared with the current contract, the stable
pattern is a compact header and aligned value rows. The meaningful divergence is
whether the indicator tells the truth about the mark and whether a selected x
position needs a guide.

### Recommended Next Focus

Angle 4: compare colour and dark-ground values numerically against the cursor
register, palette source and contrast gates. Use numeric token values and
contrast calculations only.

### Ruled-out directions

- Global tooltip padding, radius, shadow or width restyle. [SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/daily-line.html:179-203]
- Icons in every tooltip. [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/shadcn-tooltip-dark-08.jpg]
- Moving every legend above or beside the plot. [SOURCE: .opencode/skills/sk-design/sk-design-chart/references/template-contract.md:549-554]
- A permanent cursor guide on every form. [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/shadcn-tooltip-dark-01.jpg]
- Treating legend click and legend hover as the same state without an explicit
  contract decision. [SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/stacked-area.html:664-698]

### Metrics

- `newInfoRatio`: `0.72`.
- Novelty justification: this iteration confirms the shipped interaction
  geometry and dimming, then isolates mixed-mark tooltip indicators and
  density-earned cursor guides as the two interaction-specific opportunities.
- `ruledOutDirections`: 5.
- `openQuestionsAfterIteration`: 2.
