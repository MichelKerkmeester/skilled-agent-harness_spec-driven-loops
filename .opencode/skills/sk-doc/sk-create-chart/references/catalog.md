---
title: "Chart Catalog"
description: "The index from a reader's question to the one chart form that answers it and the file that draws it, parsed by the corpus check in both directions."
trigger_phrases:
  - "chart catalog"
  - "which chart type"
  - "chart lookup"
  - "chart index"
importance_tier: normal
contextType: reference
version: 1.0.0.0
---

# Chart Catalog

Read this before writing anything. It turns the comparison a reader needs into one chart form, and it names the file that draws that form.

Every row below points at a template that renders. When no row answers the question in front of you, that is a gap to report rather than a chart to improvise. A freehand chart is what the template-first rule exists to prevent.

---

## 1. HOW TO READ IT

Start from the question, never from the chart name. A request arrives as "show me the split by plan" and the useful move is to ask what the reader will do with it: compare quantities, rank them, track them over time, or find where they pile up. That question picks the row.

When two rows answer the same question, the one whose data shape matches what you hold is the row. The clearest case is the pair at the top of the index. Both answer "which category is biggest" and the only thing that separates them is whether the category names are words or codes, because a word set on its side is unreadable.

---

## 2. THE INDEX

The table is machine-read. The corpus check parses the rows between the sentinels below, matches columns by their header name rather than by position, and then verifies two things: every `id` here resolves to a file that identifies itself with the same `id`, and every chart form on disk appears here. An index that names a chart it cannot reach is worse than no index, so both directions are checked.

Prose outside the sentinels is never asserted on. Rewrite this page freely. Only the header names and the two id-bearing columns are a contract.

<!-- CHART_CATALOG:BEGIN -->

| id | family | question | data shape | system | file |
| --- | --- | --- | --- | --- | --- |
| bar-rows | comparison | Which category is biggest, when the names are words | 8 or fewer categories, one value each | neutral | assets/templates/bar-rows.html |
| bar-columns | comparison | Which category is biggest, when the names are short codes | 8 or fewer categories, one value each | neutral | assets/templates/bar-columns.html |
| grouped-bars | comparison | How does this period compare with the last one | 2 series across 6 or fewer categories | neutral | assets/templates/grouped-bars.html |
| unit-grid | composition | How does the whole split up, in shares a reader can count | Parts summing to 100, 4 or fewer of them | categorical | assets/templates/unit-grid.html |
| unit-ring | composition | How does the whole split up, when every part is a countable record | Whole-number counts across 4 or fewer groups | categorical | assets/templates/unit-ring.html |
| stacked-bars | composition | How do the parts stack up inside each category | 4 or fewer categories by 3 or fewer segments | categorical | assets/templates/stacked-bars.html |
| independent-percentages | composition | How much of each, when the items share no whole | Several percentages that need not sum to 100 | neutral | assets/templates/independent-percentages.html |
| treemap | composition | Where did the budget go across a hierarchy | Two-level hierarchy, non-negative weights, about 30 leaves at most | categorical | assets/templates/treemap.html |
| daily-line | time | What did the daily number do | One reading per day, 30 days or fewer | neutral | assets/templates/daily-line.html |
| daily-range | time | What was the daily spread | A minimum and a maximum per day | neutral | assets/templates/daily-range.html |
| calendar-grid | time | What happened across a full year, day by day | 52 weeks by 7 days of quantities | ordered | assets/templates/calendar-grid.html |
| waterfall | time | What was the step by step movement from gross to net | 6 or fewer signed steps with a running total | categorical | assets/templates/waterfall.html |
| progress-single | time | How far to the target | One value against a goal | ordered | assets/templates/progress-single.html |
| candlestick | time | Where did it open, high, low and close | Four values per period | categorical | assets/templates/candlestick.html |
| stacked-area | time | How did the composition shift over continuous time | 2 to 5 series over a continuous axis, with the total also readable | categorical | assets/templates/stacked-area.html |
| distribution-strip | distribution | How are the individual values spread | Tens to a few hundred records of one variable, grouped | neutral | assets/templates/distribution-strip.html |
| box-plot | distribution | What does the spread look like as a summary | Grouped records where a five-number summary is legitimate | neutral | assets/templates/box-plot.html |
| scatter | relationship | Do these two variables move together | 20 or fewer points across two dimensions | neutral | assets/templates/scatter.html |
| parallel-axes | relationship | How does one entity set compare across several dimensions | The same entities across 3 to 6 continuous dimensions | categorical | assets/templates/parallel-axes.html |
| heat-matrix | matrix | Which combinations are hot | Two discrete dimensions by value, 100 cells or fewer | ordered | assets/templates/heat-matrix.html |

<!-- CHART_CATALOG:END -->

The columns mean:

| Column | What goes in it |
| --- | --- |
| `id` | Lower-case kebab, unique, and identical to the filename stem and to the file's own identity tag |
| `family` | The question group the form belongs to, from section 3 |
| `question` | The question a reader arrives with, written as they would say it |
| `data shape` | What the form needs before it can be honest: how many categories, how many series, what must sum to what |
| `system` | The colour system the template declares |
| `file` | Path from the packet root, which is always `assets/templates/<id>.html` for a chart form |

---

## 3. THE FAMILIES

A family here is a group of questions, not a rendering style. Every form in the corpus is drawn in one visual register, so the family tells a reader which shelf to look on and nothing about how the chart is built.

| Family | The question behind it |
| --- | --- |
| comparison | Which of these is biggest, and how do two periods sit against each other |
| composition | How does a whole divide up, or how do several independent measures stand |
| time | What happened over days, weeks or a year, how a period opened and closed, and how far along a target is |
| distribution | How are individual values spread |
| relationship | Do two variables move together, and how do a few entities compare across several measures |
| matrix | Which combinations of two discrete dimensions are hot |

`assets/examples/` carries one finished delivery per family, chosen to show that family at its most characteristic. Those files are deliveries rather than forms, so they carry no row here.

---

## 4. WHAT IS NOT INDEXED HERE

The catalog governs `assets/templates/` alone. The palette sheets under `assets/color/` are proof sheets for the colour systems rather than chart forms, so they carry no row and the check does not expect one. The same holds for the deliveries under `assets/examples/`.

---

## 5. ADDING A ROW

1. Author the template at `assets/templates/<id>.html` against the template contract.
2. Add one row here with the same `id`.
3. Run the corpus check. It fails when the row and the file disagree, and it prints which side is wrong.

---

## RELATED DOCUMENTS

| Document | Purpose |
| --- | --- |
| [`template-contract.md`](./template-contract.md) | What a template file has to contain |
| [`color-system.md`](./color-system.md) | The three systems, their roles and their ceilings |
| [`README.md`](./README.md) | The reference index |
