---
title: "sk-create-chart References"
description: "Router for this packet's reference set: the colour systems, the template contract and the index from a comparison to the chart form that answers it."
trigger_phrases:
  - "chart references"
  - "which chart type"
  - "chart lookup"
  - "chart catalog"
  - "chart template contract"
importance_tier: normal
contextType: reference
version: 1.0.0.0
---

# sk-create-chart References

The reference set answers three questions in order: which chart form answers the comparison the reader needs, what colour means in the chart and what the file has to contain.

---

## 1. OVERVIEW

Three files sit here, each one a lookup or a contract rather than a guide to read end to end. Load the one the table names for the question in front of you.

| Load | When |
| --- | --- |
| [`catalog.md`](./catalog.md) | **First, always.** Maps a comparison to one chart form and the file that draws it |
| [`color-system.md`](./color-system.md) | Before choosing a palette, and whenever a request asks for more categories than a system carries |
| [`template-contract.md`](./template-contract.md) | Before authoring or editing any template file |

The catalog holds twenty chart forms across six question families. When no row answers the question in front of you, defer with the gap named rather than answering freehand, because a freehand chart is what the template-first rule exists to prevent.

---

## 2. WHAT BELONGS HERE

Reference files in this packet are lookups and contracts. They route a request to a template and they carry no render code of their own, because a render block copied into a reference is a second copy that drifts from the template it came from.

Chart markup lives in `../assets/`. Colour values live in `../assets/color/palettes.json` and nowhere else. This directory holds the index that finds them and the rules they follow.

---

## 3. WHAT IS DELIBERATELY ABSENT

**Report mode.** There is no report catalog and no multi-chart report page, and none is planned. A report is a second product with its own layouts, its own selection rules and its own index, and nothing in the chart capability depends on it. The capability analysis this packet was built from recommended leaving it out and that recommendation was taken.

**Galleries.** There are no gallery pages. One chart form is one file, the catalog points straight at it, and a new form starts as a copy of a whole skeleton file rather than as a block extracted from a page of demos. The reason is the one `template-contract.md` gives: what reaches a reader is a delivery, and a gallery ships every other form's demo data alongside the one they asked for.
