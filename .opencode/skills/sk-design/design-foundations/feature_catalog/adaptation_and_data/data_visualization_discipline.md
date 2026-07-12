---
title: "Data Visualization Discipline"
description: "Current-state reference for design-foundations chart-type selection, encoding discipline, color-for-data scales, and table alignment."
trigger_phrases:
  - "data visualization discipline"
  - "design-foundations chart selection"
  - "color for data scales"
  - "data table alignment"
version: 1.0.0.0
---

# Data Visualization Discipline

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

`design-foundations` treats chart and table encoding as design: a chart type is chosen by the question rather than the dataset shape, every visual channel carries one variable, and numeric tables align for magnitude rather than decoration.

Color for data is kept as a separate discipline from brand color, since a categorical hue set and a sequential ramp answer different questions and follow different construction rules.

---

## 2. HOW IT WORKS

Chart selection matches the question: bar charts for category comparison, line or area charts for trend, stacked bars or treemaps for part-to-whole, histograms or box plots for distribution, and scatter or heatmaps for relationship. Bar-chart value axes start at zero, and any non-zero line baseline is labeled so the reader sees it; each visual channel encodes exactly one variable rather than doubling color onto a value the bar length already shows.

### Color-For-Data Scales

Sequential scales ramp one hue's lightness for ordered magnitude; diverging scales meet at a meaningful midpoint with balanced arms; categorical scales use distinct hues at similar lightness and chroma, capped near six to eight hues. Color is never the sole carrier of meaning, and red-green pairings are avoided so the chart survives grayscale and colorblind simulation.

### Tables And Small Screens

Numeric table columns right-align with tabular numerals and consistent decimal places so magnitude reads down the column; text columns and headers left-align. At small sizes the mode simplifies rather than shrinks: fewer data points, larger labels, and a sortable-table alternative to a squeezed multi-series chart.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/sk-design/design-foundations/references/data_viz.md` | Shared | Defines chart-type selection, axis/encoding rules, color-for-data scales, sparklines, and table alignment. |
| `.opencode/skills/sk-design/design-foundations/references/color/oklch_workflow.md` | Shared | Supplies the OKLCH channel mechanics used to build even lightness-ramped data scales. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/sk-design/design-foundations/manual_testing_playbook/manual_testing_playbook.md` | Manual playbook | Exercises data-visualization scenarios against the live mode. |

---

## 4. SOURCE METADATA

- Group: Adaptation And Data
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `adaptation-and-data/data-visualization-discipline.md`

Related references:
- [context-adaptation-matrix.md](../adaptation_and_data/context_adaptation_matrix.md) - Responsive and accessible chart adaptation per context.
- [../procedure-cards/foundations-procedure-card-inventory.md](../procedure_cards/foundations_procedure_card_inventory.md) - Private cards that review token, hierarchy, and control decisions after data work.
