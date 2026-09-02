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

| Load | When |
| --- | --- |
| [`catalog.md`](./catalog.md) | **First, always.** Maps a comparison to one chart form and the file that draws it |
| [`color-system.md`](./color-system.md) | Before choosing a palette, and whenever a request asks for more categories than a system carries |
| [`template-contract.md`](./template-contract.md) | Before authoring or editing any template file |

The catalog holds no chart forms yet. Until a row exists, a chart request is deferred with the gap named rather than answered freehand, because a freehand chart is what the template-first rule exists to prevent. The colour systems and the template contract are complete and binding now.

---

## WHAT BELONGS HERE

Reference files in this packet are lookups and contracts. They route a request to a template and they carry no render code of their own, because a render block copied into a reference is a second copy that drifts from the template it came from.

Chart markup lives in `../assets/`. Colour values live in `../assets/color/palettes.json` and nowhere else. This directory holds the index that finds them and the rules they follow.

---

## WHERE SKILL.md IS AHEAD OF THE CORPUS

The packet's `SKILL.md` and `README.md` were written before the corpus existed and they describe two things that are not there. Where they and these documents disagree, `template-contract.md` is what the corpus check enforces, so the contract wins and the descriptions are the ones to correct.

**Report mode.** An earlier version of this index promised a `report-catalog.md` for multi-chart report pages. No such catalog exists and none is planned inside the current corpus. The capability analysis this packet was built from recommends leaving report mode out: it is a second product with its own layouts, its own selection rules and its own index, and nothing in the chart capability depends on it. That recommendation has not been ruled on, so it is recorded rather than acted on, and `assets/reports/` stays empty.

**Galleries.** `SKILL.md` describes opening a gallery page, finding a card on it and taking that card's render block. The corpus has no gallery pages. One chart form is one file, the catalog points straight at it, and a new template starts as a copy of a whole skeleton file rather than as an extracted block. The reason is the one `template-contract.md` gives: what reaches a user is a delivery, and a gallery ships every other chart's demo data alongside the one chart they asked for.
