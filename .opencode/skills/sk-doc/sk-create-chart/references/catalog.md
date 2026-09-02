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

The corpus holds no chart forms yet, so the table below is empty. Until a row exists, say so and defer rather than drawing a chart freehand. A freehand chart is what the template-first rule exists to prevent.

---

## 1. HOW TO READ IT

Start from the question, never from the chart name. A request arrives as "show me the split by plan" and the useful move is to ask what the reader will do with it: compare quantities, rank them, track them over time, or find where they pile up. That question picks the row.

When two rows answer the same question, take the one whose data shape matches what you actually have. When no row answers it, that is a gap in the corpus rather than a licence to improvise. Say which question had no answer.

---

## 2. THE INDEX

The table is machine-read. The corpus check parses the rows between the sentinels below, matches columns by their header name rather than by position, and then verifies two things: every `id` here resolves to a file that identifies itself with the same `id`, and every chart form on disk appears here. An index that names a chart it cannot reach is worse than no index, so both directions are checked.

Prose outside the sentinels is never asserted on. Rewrite this page freely. Only the header names and the two id-bearing columns are a contract.

<!-- CHART_CATALOG:BEGIN -->

| id | question | data shape | system | file |
| --- | --- | --- | --- | --- |

<!-- CHART_CATALOG:END -->

The columns mean:

| Column | What goes in it |
| --- | --- |
| `id` | Lower-case kebab, unique, and identical to the filename stem and to the file's own identity tag |
| `question` | The question a reader arrives with, written as they would say it |
| `data shape` | What the form needs before it can be honest: how many categories, how many series, what has to sum to what |
| `system` | The colour system the template declares |
| `file` | Path from the packet root, which is always `assets/templates/<id>.html` for a chart form |

---

## 3. WHAT IS NOT INDEXED HERE

The catalog governs `assets/templates/` alone. The palette sheets under `assets/color/` are proof sheets for the colour systems rather than chart forms, so they carry no row and the check does not expect one.

---

## 4. ADDING A ROW

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
