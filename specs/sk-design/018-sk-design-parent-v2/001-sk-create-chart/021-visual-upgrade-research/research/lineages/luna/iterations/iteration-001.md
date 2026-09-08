# Iteration 1 - Card anatomy, typography and spacing

## Iteration 1 — Card anatomy, typography and spacing

### What was read

- The brief names the five comparison surfaces and requires the current templates to be read before proposing a gap. [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/021-visual-upgrade-research/research/dispatch-prompt.md:1]
- The current `daily-line` card has a headline, subtitle, figure, footer finding and source in that order. [SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/daily-line.html:226-245]
- The shared contract defines those same five parts as the delivery unit and says the headline is a conclusion while the footer carries the finding and source. [SOURCE: .opencode/skills/sk-design/sk-design-chart/references/template-contract.md:27-39]
- The contract records the compact type scale, the shadcn-informed register, the 760px card width, the 28px/28px/22px card padding and per-form plot insets. [SOURCE: .opencode/skills/sk-design/sk-design-chart/references/template-contract.md:102-164]
- The local library index describes the Vercel, Apple, Carbon, Tremor and shadcn captures used for this comparison. [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/index.md:7-23] [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/index.md:49-58]

### What was seen or measured

- The current stylesheet sets a 32px/20px page inset, a 760px maximum card width, 20px card separation and 28px/28px/22px card padding. The headline is 16px semibold with a 6px bottom margin, the subtitle is 14px with a 20px bottom margin and the footer starts 18px below the figure with a 12px top inset and a 1px rule. [SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/daily-line.html:77-107]
- The current rendered card visibly keeps the conclusion at the top, the plot in the middle and the finding/source pair under a divider. The second card keeps the data table separate from the narrative card. [SOURCE: .opencode/skills/sk-design/sk-design-chart/screenshots/templates/daily-line.png]
- The Vercel Web Analytics capture adds a product context row, controls and a KPI tab row before the plot. Its chart panel is a dashboard surface rather than a single standalone delivery card. [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/vercel-docs-analytics-light-01.jpg]
- The Vercel Analytics capture is materially leaner than the dashboard panel: the plot is a hairline multi-series chart with sparse gridlines and no visible card-level narrative chrome in the crop. [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/vercel-analytics-light-01.jpg]
- The Apple HIG captures put a large primary value and date range above the plot, while the plot keeps a clear baseline, labelled scale and a restrained bar treatment. [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/apple-hig-charts-light-07.jpg] [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/apple-hig-charts-light-08.jpg]
- The Carbon anatomy captures expose chart title, axis labels, gridlines, legend, tooltip and toolbar as distinct reading parts. The annotated donut also uses a large centre total and an explicit legend below the mark. [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/carbon-anatomy-light-01.jpg] [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/carbon-anatomy-light-02.jpg]
- The shadcn line capture combines a chart title and period subtitle above the plot with a conclusion-like trend line and a secondary explanatory line below it. The current contract explicitly derives its 16px, 14px and 12px scale from the frozen shadcn examples. [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/shadcn-line-light-01.jpg] [SOURCE: .opencode/skills/sk-design/sk-design-chart/references/template-contract.md:104-123]
- The Tremor blocks capture uses a large KPI value above a compact chart and shows that a composed dashboard can repeat small chart cards without making every chart card carry dashboard controls. [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/tremor-blocks-light.jpg]

### Findings

1. The current standalone card anatomy is already a strong match to the library's reusable chart-card register. It has the fixed five-part reading order and its concrete measurements are consistent across the representative template. The visible output confirms that the footer finding is separated from the figure and that the source remains attached to the finding. [SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/daily-line.html:226-245] [SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/daily-line.html:86-106] [SOURCE: .opencode/skills/sk-design/sk-design-chart/screenshots/templates/daily-line.png]

2. The most credible anatomy gap is not missing chrome. It is the lack of an optional primary metric and change readout for forms whose question is a single current value or a period delta. Apple, Vercel Web Analytics and Tremor all place a prominent scalar before or beside the plot, while the generic `daily-line` card begins with narrative text and reaches its numbers through the plot and footer. [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/apple-hig-charts-light-07.jpg] [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/vercel-docs-analytics-light-01.jpg] [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/tremor-blocks-light.jpg] [SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/daily-line.html:227-244]

3. The global spacing values should not be widened to imitate dashboard references. The current card is a 760px standalone unit with a 480px figure floor, while Vercel and Carbon show larger application surfaces with controls and surrounding context. The contract also says frame height and plot insets are per-form, so any visual tightening or expansion belongs at the chart-frame level after a form-specific inspection. [SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/daily-line.html:59-73] [SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/templates/daily-line.html:86-103] [SOURCE: .opencode/skills/sk-design/sk-design-chart/references/template-contract.md:150-164] [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/vercel-docs-analytics-light-01.jpg] [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/carbon-anatomy-light-01.jpg]

4. The current narrative hierarchy is intentionally different from references that label a chart by type. The contract asks the headline to state a conclusion and the footer to state what to notice, which matches the shadcn line capture's trend statement below the plot while preserving a more useful editorial top line. Replacing conclusions with generic chart titles would reduce the standalone card's information density. [SOURCE: .opencode/skills/sk-design/sk-design-chart/references/template-contract.md:31-39] [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/shadcn-line-light-01.jpg]

5. Dashboard controls, toolbars, mini-maps and application-level KPI tabs are not justified as universal additions to the standalone corpus. Carbon and Vercel demonstrate those controls in product contexts, while the current delivery unit is explicitly one chart card and one separate data table. Copying the surrounding dashboard would change the delivery boundary rather than improve the chart card. [SOURCE: .opencode/skills/sk-design/sk-design-chart/references/template-contract.md:27-43] [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/carbon-anatomy-light-01.jpg] [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/vercel-docs-analytics-light-01.jpg]

### Recommendations

- Keep the shared card width, padding, compact type scale, five-part order and footer divider as the baseline. There is no angle-1 evidence for a global card restyle. [SOURCE: .opencode/skills/sk-design/sk-design-chart/references/template-contract.md:29-39] [SOURCE: .opencode/skills/sk-design/sk-design-chart/references/template-contract.md:102-123]
- Investigate an optional primary metric and period-delta treatment for scalar and time-series forms. The design decision must first resolve whether the value belongs inside the existing headline/subtitle contract or requires a sixth declared card part. This is a contract question, not permission to add a universal KPI header. [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/apple-hig-charts-light-07.jpg] [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/vercel-docs-analytics-light-01.jpg] [SOURCE: .opencode/skills/sk-design/sk-design-chart/references/template-contract.md:29-39]
- Review chart-frame height, left inset and label density per template when a capture shows a reading problem. Do not alter the global card spacing to match a dashboard or a mobile product crop. [SOURCE: .opencode/skills/sk-design/sk-design-chart/references/template-contract.md:150-164]

### What this iteration could not settle

- It did not determine which existing templates have a data question strong enough to earn a primary metric or delta. That requires the angle-5 micro-form catalog and a per-template question review. [SOURCE: .opencode/skills/sk-design/sk-design-chart/references/catalog.md:1-191]
- It did not test hover tooltip placement, series dimming or legend controls. Those are reserved for angle 3 because the static captures and the current contract treat them as a separate pointer register. [SOURCE: .opencode/skills/sk-design/sk-design-chart/references/template-contract.md:502-556]
- It did not settle colour or dark-ground changes. The card comparison used structure and hierarchy only, while palette safety belongs to angle 4. [SOURCE: .opencode/skills/sk-design/sk-design-chart/references/color-system.md:270-302]

## Sources Consulted

- Current source: `.opencode/skills/sk-design/sk-design-chart/assets/templates/daily-line.html:59-107,226-245`.
- Contract: `.opencode/skills/sk-design/sk-design-chart/references/template-contract.md:27-39,102-164,502-556`.
- Local reference index: `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/index.md:7-23,49-58`.
- Captures: `vercel-docs-analytics-light-01.jpg`, `vercel-analytics-light-01.jpg`, `apple-hig-charts-light-07.jpg`, `apple-hig-charts-light-08.jpg`, `carbon-anatomy-light-01.jpg`, `carbon-anatomy-light-02.jpg`, `shadcn-line-light-01.jpg` and `tremor-blocks-light.jpg` under `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/` or `library/` as named above.

## Assessment

The corpus already has a coherent standalone card register. The highest-value visual upgrade surfaced by this angle is a narrowly scoped metric-and-delta treatment for forms whose question is scalar or period-over-period. The shared shell should remain stable.

## Reflection

This angle separated the reusable card anatomy from application-level dashboard composition. The negative finding is important: larger reference panels are not evidence that the 760px card or its padding is wrong.

## Recommended Next Focus

Angle 2, mark treatment for lines, areas, bars and fills.

## Ruled-out directions

- Universal KPI tabs, toolbar, minimap or product-context header inside every standalone delivery card. The references show those as application composition, not a required chart-card part. [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/vercel-docs-analytics-light-01.jpg] [SOURCE: specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/020-external-reference-library/library/details/carbon-anatomy-light-01.jpg]
- A global increase to card padding, card width or card radius based only on larger reference crops. The current contract deliberately fixes those values and leaves plot geometry per form. [SOURCE: .opencode/skills/sk-design/sk-design-chart/references/template-contract.md:150-164]

## Metrics

- `newInfoRatio`: 0.86
- `noveltyJustification`: This iteration distinguishes the already-shipped five-part card register from the narrower missing metric-and-delta opportunity and rules out dashboard chrome as a standalone-card upgrade.
- `qualityGuards`: source diversity passed across current source, contract, Vercel, Apple, Carbon, Tremor and shadcn captures; focus alignment passed; no single weak source carries the recommendation.
