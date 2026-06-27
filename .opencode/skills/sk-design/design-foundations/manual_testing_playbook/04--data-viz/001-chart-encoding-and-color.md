---
title: Data Visualization Encoding And Color Scenario
description: Manual scenario verifying chart-type selection, axis honesty, color-for-data scale choice and data-table alignment.
trigger_phrases:
  - "test data visualization"
  - "test chart encoding"
  - "foundations data-viz scenario"
importance_tier: normal
contextType: reference
version: 1.0.0.1
expected_intent: LAYOUT
expected_resources:
  - references/corpus_map.md
  - ../shared/register.md
  - references/layout/layout_responsive.md
  - references/data_viz.md
---

**Exact prompt**

```
Design the data visualization layer for a finance dashboard: a metric trend, a category comparison, a density map and a numeric table.
```

# FOUND-DATAVIZ-001 | Data Visualization Encoding And Color

## Prompt

`Design the data visualization layer for a finance dashboard: a metric trend, a category comparison, a density map and a numeric table.`

## Expected Process

1. Route to `foundations` first. Chart encoding and color-for-data decisions resolve here before any `sk-code` implementation handoff.
2. Load `references/data_viz.md`.
3. Match each chart to the question rather than the dataset shape, trend to a line, comparison to a bar, density to a sequential scale.
4. Choose the color-for-data scale type per question and keep data color separate from brand color.
5. Align the numeric table with right-aligned columns and tabular numerals.

## Pass Criteria

- Picks the chart from the question, comparison, trend, part-to-whole, distribution or relationship.
- Starts bar value axes at zero and labels any non-zero line baseline.
- Encodes one variable per visual channel.
- Selects the scale type correctly, sequential for magnitude, diverging for a real midpoint, categorical for unordered groups, capped near six to eight hues.
- Never makes color the only carrier of meaning, and keeps one color meaning across every view.
- Right-aligns numeric columns with tabular numerals and consistent decimals.
- Provides a non-chart alternative for small screens and assistive technology.
- Defers OKLCH channel mechanics and contrast repair to the color references rather than re-deriving them.
