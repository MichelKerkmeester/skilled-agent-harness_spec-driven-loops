---
title: Data Visualization Foundations
description: Chart-type selection, axis and encoding discipline, color-for-data scales, sparklines and data-table alignment for static visual systems.
trigger_phrases:
  - "data visualization"
  - "chart type selection"
  - "color for data"
  - "sparklines and data tables"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Data Visualization Foundations

Chart-type selection, axis and encoding discipline, color-for-data scales, sparklines and data-table alignment. This reference owns how a static system encodes quantitative content. It does not re-derive OKLCH channels, contrast math or general palette roles, which live in the color references.

---

## 1. OVERVIEW

### Core Principle

A chart is a sentence about the data, so the encoding must match the question. Pick the simplest chart that answers the question, maximize the share of ink that carries data and let one accent do the pointing. Color for data is a separate discipline from brand color: a categorical hue set and a sequential ramp answer different questions and follow different rules.

### When to Use

- Choosing a chart type for comparison, trend, part-to-whole, distribution or relationship.
- Building color scales for data: sequential, diverging or categorical.
- Setting axis baselines, gridline weight and direct labels.
- Designing sparklines and aligning numeric tables beyond tabular numerals.

---

## 2. CHART TYPE SELECTION

Match the chart to the question, not to the dataset shape. The most common failure is reaching for the chart that looks rich rather than the one that answers the question.

| Question | First choice | Alternatives |
| --- | --- | --- |
| Compare categories | bar chart | grouped bars for multi-series, bullet chart for target vs actual |
| Trend over time | line chart | area chart for accumulated volume, sparkline for inline trend |
| Part of a whole | stacked bar | pie or donut only for a few large slices, treemap for hierarchy |
| Distribution | histogram | box plot for spread and outliers, scatter plot for raw points |
| Relationship | scatter plot | bubble chart for a third value, heatmap for a dense matrix |

Rules:
- Choose the simplest chart that communicates the insight, because a clear bar chart beats a clever one.
- Reserve pie and donut for two to four slices where the part-to-whole reading is the point. Past that a bar chart ranks more honestly.
- Prefer a table when the reader needs exact values, and a chart when the reader needs the shape.

---

## 3. AXIS AND ENCODING

The axis is the contract between the number and the pixel. Break it and the chart lies even when the data is correct.

- Start the bar-chart value axis at zero. A truncated baseline exaggerates differences and is the most common honest-looking distortion.
- A line chart may use a non-zero baseline when the question is rate of change rather than absolute size, but label the baseline so the reader sees it.
- Encode one variable per visual channel. Length, position, area and color each carry one meaning, so do not also map color to a value the bar length already shows.
- Length and position read more accurately than area, angle and color, so spend the accurate channels on the most important comparison.
- Label axes and units directly. When a series can be labeled at its end, do that instead of forcing a legend lookup.
- Keep gridlines quiet. Hairline neutral lines, or none, so the data sits above the scaffold rather than behind a grid.

---

## 4. COLOR FOR DATA

Color for data is encoding, not decoration, so each scale type answers a specific question. Build these scales in OKLCH for even lightness steps, but the scale-type rules below are what make them readable. Defer channel mechanics and contrast repair to the color references.

| Scale | Question it answers | Construction |
| --- | --- | --- |
| Sequential | how much, on an ordered measure | one hue, lightness ramped from light to dark, low to high |
| Diverging | how far above or below a meaningful midpoint | two hues meeting at a neutral midpoint, balanced lightness on each arm |
| Categorical | which group, with no order | distinct hues at similar lightness and chroma so no category looks heavier |

Rules:
- Use sequential for ordered magnitude such as density, volume or score. Ramp lightness, because lightness is what the eye reads as more.
- Use diverging only when the midpoint means something, such as zero, a target or an average. Keep the two arms balanced so neither side looks more intense by accident.
- Use categorical for unordered groups and cap it near six to eight hues. Past that, hues stop being distinguishable and the chart needs grouping or direct labels instead.
- Keep one color meaning across every view in a dashboard, so a category that is teal in one chart is never amber in the next.
- Use colorblind-safe pairings and never encode meaning with red against green alone, since a large share of male viewers cannot separate them.
- Never rely on color alone. Pair every data color with a label, a shape, a pattern or a position so the chart survives grayscale and low vision.

---

## 5. SPARKLINES AND DENSE DISPLAYS

A sparkline is a word-sized graphic that shows trend inside running text or a table cell, where shape matters more than exact value.

- Strip the chrome. No axes, no legend and at most one marked point such as the latest or the peak.
- Keep the aspect ratio short and wide so the trend reads at a glance without dominating the line of text.
- Use one neutral line for the series and a single accent dot for the point that matters.
- Give a paired number the exact current value, and let the sparkline carry the shape, since the two together beat either alone.
- In dense small-multiple grids, hold the value axis identical across every cell, because a shared scale is the only thing that makes the panels comparable.

---

## 6. DATA TABLES

A data table is a visualization, so alignment is the encoding. Misaligned numbers force the reader to compare digit by digit.

- Right-align numeric columns so the ones, tens and hundreds stack and magnitude reads down the column.
- Use tabular numerals (`font-variant-numeric: tabular-nums`) so every digit takes equal width and rows line up. This is the floor, not the finish.
- Align the decimal point and keep decimal places consistent within a column, so `9.5` and `12.50` still align on the point.
- Left-align text columns and headers, and align each numeric header with its column body.
- Right-align units and currency with their numbers, or attach the unit to the header so the cells stay clean.
- Keep row separation quiet with spacing or a hairline, and reserve color for a value that earns attention such as a threshold breach.
- Make totals visually distinct with weight or a single rule above them, not a heavy fill that competes with the data.

---

## 7. RESPONSIVE AND ACCESSIBLE CHARTS

A chart adapts to context the same way a layout does: rethink it, do not shrink it.

- Simplify at small sizes. Show fewer data points, enlarge labels and drop secondary series rather than cramming the full chart into a phone.
- Offer an alternative view on small screens. A sortable table often beats a squeezed multi-series chart on a phone.
- Make tooltips and targets touch-friendly, and never hide the only path to a value behind hover, since touch users cannot hover.
- Provide a text alternative or a data table behind every chart, and keep interactive charts keyboard navigable.
- Meet contrast for data marks and their labels, treating thin lines and small points as UI components that still need a visible contrast ratio.

---

## 8. VERIFICATION

Check:
- The chart type matches the question, comparison, trend, part-to-whole, distribution or relationship.
- Bar value axes start at zero, and any non-zero line baseline is labeled.
- Each visual channel encodes exactly one variable.
- The color scale type matches the data, sequential for magnitude, diverging for a real midpoint, categorical for unordered groups.
- Color is never the only carrier of meaning, and the palette survives grayscale and colorblind simulation.
- Numeric table columns are right-aligned with tabular numerals and consistent decimals.
- A non-chart alternative exists for small screens and assistive technology.
