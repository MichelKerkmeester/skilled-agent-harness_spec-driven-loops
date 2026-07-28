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
  - references/foundations/corpus-map.md
  - ../shared/register.md
  - references/foundations/layout/layout-responsive.md
  - references/foundations/data-viz.md
---

# FOUND-DATAVIZ-001 | Data Visualization Encoding And Color

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `FOUND-DATAVIZ-001`.

**Exact prompt**

```text
Design the data visualization layer for a finance dashboard: a metric trend, a category comparison, a density map and a numeric table.
```

---

## 1. OVERVIEW

This scenario validates chart-type selection, axis honesty, color-for-data scale choice, and numeric-table alignment in `interface`'s `foundations` static-system subworkflow. It confirms each chart is matched to the question being asked rather than to the shape of the dataset.

### Why This Matters

Chart choice driven by dataset shape rather than the question produces charts that are technically correct and practically unreadable. Truncated bar axes, hue-only encoding, and brand color reused as data color are the failures that quietly mislead readers, and they are cheapest to prevent at the foundations stage.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm a multi-chart dashboard request resolves in the foundations subworkflow with question-driven chart selection, honest axes, a correctly typed color-for-data scale, and aligned numeric tables.
- Real user request: `We're building the charts for our finance dashboard. There's a trend metric, a category comparison, a density map, and a plain numbers table.`
- Prompt: `Design the data visualization layer for a finance dashboard: a metric trend, a category comparison, a density map and a numeric table.`
- Expected execution process: Recognize this as `interface`'s `foundations` static-system subworkflow, where chart encoding and color-for-data decisions resolve before any `sk-code` implementation handoff; load `../../references/foundations/data-viz.md`; match each chart to the question rather than the dataset shape; choose the color-for-data scale type per question and keep data color separate from brand color; align the numeric table with right-aligned columns and tabular numerals.
- Expected signals: Each chart is justified by the question it answers; bar value axes start at zero and any non-zero line baseline is labeled; one variable per visual channel; scale type is named as sequential, diverging, or categorical with a stated reason; numeric columns are right-aligned with tabular numerals.
- Desired user-visible outcome: A visualization layer where every chart answers a named question honestly, color carries data meaning correctly, and the numeric table is scannable.
- Pass/fail: PASS if chart type follows the question, axes are honest, the scale type is correctly selected, and numeric alignment is specified; FAIL if a chart is chosen from dataset shape, a bar axis is truncated, color is the only carrier of meaning, or OKLCH channel mechanics are re-derived here instead of deferred to the color references.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Recognize this as `interface`'s `foundations` static-system subworkflow. Chart encoding and color-for-data decisions resolve here before any `sk-code` implementation handoff.
2. Load `references/foundations/data-viz.md`.
3. Match each chart to the question rather than the dataset shape, trend to a line, comparison to a bar, density to a sequential scale.
4. Choose the color-for-data scale type per question and keep data color separate from brand color.
5. Align the numeric table with right-aligned columns and tabular numerals.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| FOUND-DATAVIZ-001 | Data visualization encoding and color-for-data scales | Confirm each chart is matched to its question with honest axes, a correctly typed data scale, and aligned numeric columns | `Design the data visualization layer for a finance dashboard: a metric trend, a category comparison, a density map and a numeric table.` | bash: rg -n "scale" ../../references/foundations/data-viz.md -> bash: rg -n "spacing scale" ../../references/foundations/layout/layout-responsive.md -> bash: rg -n "register" ../../../shared/register.md -> agent: produce the data visualization layer | Step 1: scale-type and encoding rules found; Step 2: layout rhythm rules found; Step 3: register posture found; Step 4: output names the question per chart, the scale type, and the table alignment | Terminal transcript, the produced visualization plan, the per-chart question mapping, and the final PASS or FAIL verdict | PASS when every Pass Criteria bullet below holds; FAIL when any bullet is contradicted, most critically a truncated bar axis, hue-only meaning, or chart type derived from dataset shape | 1. Re-read `../../references/foundations/data-viz.md` for chart-to-question mapping and scale selection; 2. Confirm the bar baseline rule against the produced plan; 3. Re-run with one non-zero line baseline and confirm it is explicitly labeled |

### Pass Criteria

- Picks the chart from the question, comparison, trend, part-to-whole, distribution or relationship.
- Starts bar value axes at zero and labels any non-zero line baseline.
- Encodes one variable per visual channel.
- Selects the scale type correctly, sequential for magnitude, diverging for a real midpoint, categorical for unordered groups, capped near six to eight hues.
- Never makes color the only carrier of meaning, and keeps one color meaning across every view.
- Right-aligns numeric columns with tabular numerals and consistent decimals.
- Provides a non-chart alternative for small screens and assistive technology.
- Defers OKLCH channel mechanics and contrast repair to the color references rather than re-deriving them.

---

## 4. SOURCE FILES

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | Router and foundations resource map |
| `../../references/foundations/corpus-map.md` | Foundations corpus entry point |
| `../../references/foundations/data-viz.md` | Chart-to-question mapping, axis honesty, and color-for-data scale selection |
| `../../references/foundations/layout/layout-responsive.md` | Spacing rhythm and responsive behavior for the chart layer |
| `../../../shared/register.md` | Register posture that sets data density and restraint |

---

## 5. SOURCE METADATA

- Group: Data Viz
- Playbook ID: FOUND-DATAVIZ-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `data-viz/chart-encoding-and-color.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
