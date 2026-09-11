---
title: "assets/diagrams: The Form Library"
description: "Index of the 38 forms: 27 canonical diagrams, 7 pattern variants and 4 skin starters, each a working file to copy and adjust."
importance_tier: normal
trigger_phrases:
  - "diagram form library index"
  - "which diagram to copy"
  - "skin starters"
contextType: general
version: 1.2.0.1
---

# assets/diagrams

The 38 forms this skill draws with. Every one is a complete, self-contained HTML file: copy the one
whose question matches yours and change it until it answers your question instead.

---

## 1. OVERVIEW

There is no separate template directory and no separate example directory, because the distinction
was never real. A worked diagram is the best starting point there is — it shows a convention applied
rather than described, and adjusting one is faster than filling a blank. So the library holds both
kinds side by side and neither is precious: 27 canonical diagrams, one per type, 7 variants that
demonstrate a specific pattern, and 4 starters for when you want the skin without the drawing.

Nothing here is a strict template. Change the data, the labels, the geometry, the node count. The
corpus check holds the rules that matter — accessibility wiring, one skin per file, tokens that come
from the palette source, connectors that meet their targets — and says nothing about what you draw.

The four starters are named `starter-light`, `starter-dark`, `starter-terminal` and `starter-full`.
They are the only forms that carry a palette block for every role, because they are what a new
diagram is copied from; a worked form keeps the tokens it actually draws with. They answer no
question of their own, which is why the catalog does not index them.

Inside a starter the drawing references its roles by name rather than by value, so repainting the
block repaints the figure. Three of the four ship an empty placeholder drawing, so there is nothing
in them to repaint until you draw it — that is what makes them starters. The full one carries a
worked figure, and theming it moves every mark.

To repaint any of these in another visual language, see
[`../../references/design-md-theming.md`](../../references/design-md-theming.md).

---

## 2. CANONICAL DIAGRAMS (27)

| File | Diagram Type | Reference |
|---|---|---|
| `architecture.html` | Architecture | [`type-architecture.md`](../../references/types/type-architecture.md) |
| `bar.html` | Bar / Column Chart | [`type-bar.md`](../../references/types/type-bar.md) |
| `data-flow.html` | Data Flow | [`type-data-flow.md`](../../references/types/type-data-flow.md) |
| `dp-integration.html` | DP integration | [`type-dp-integration.md`](../../references/types/type-dp-integration.md) |
| `dp-security-matrix.html` | DP security matrix | [`type-dp-security-matrix.md`](../../references/types/type-dp-security-matrix.md) |
| `er.html` | ER / Data Model | [`type-er.md`](../../references/types/type-er.md) |
| `flowchart.html` | Flowchart | [`type-flowchart.md`](../../references/types/type-flowchart.md) |
| `gantt.html` | Gantt Chart | [`type-gantt.md`](../../references/types/type-gantt.md) |
| `high-level.html` | High-Level | [`type-high-level.md`](../../references/types/type-high-level.md) |
| `it-state.html` | IT current-state | [`type-it-state.md`](../../references/types/type-it-state.md) |
| `layers.html` | Layer Stack | [`type-layers.md`](../../references/types/type-layers.md) |
| `line.html` | Line Chart | [`type-line.md`](../../references/types/type-line.md) |
| `loop.html` | Loop | [`type-loop.md`](../../references/types/type-loop.md) |
| `medallion.html` | Medallion | [`type-medallion.md`](../../references/types/type-medallion.md) |
| `nested.html` | Nested Containment | [`type-nested.md`](../../references/types/type-nested.md) |
| `org-chart.html` | Org Chart | [`type-org-chart.md`](../../references/types/type-org-chart.md) |
| `process.html` | Process | [`type-process.md`](../../references/types/type-process.md) |
| `pyramid.html` | Pyramid / Funnel | [`type-pyramid.md`](../../references/types/type-pyramid.md) |
| `quadrant.html` | Quadrant | [`type-quadrant.md`](../../references/types/type-quadrant.md) |
| `radar.html` | Radar / Spider | [`type-radar.md`](../../references/types/type-radar.md) |
| `scatter.html` | Scatter Plot | [`type-scatter.md`](../../references/types/type-scatter.md) |
| `sequence.html` | Sequence | [`type-sequence.md`](../../references/types/type-sequence.md) |
| `state.html` | State Machine | [`type-state.md`](../../references/types/type-state.md) |
| `swimlane.html` | Swimlane | [`type-swimlane.md`](../../references/types/type-swimlane.md) |
| `timeline.html` | Timeline | [`type-timeline.md`](../../references/types/type-timeline.md) |
| `tree.html` | Tree / Hierarchy | [`type-tree.md`](../../references/types/type-tree.md) |
| `venn.html` | Venn / Set Overlap | [`type-venn.md`](../../references/types/type-venn.md) |

---

## 3. PATTERN VARIANTS (7)

| File | Demonstrates |
|---|---|
| `import-drawio.html` | Output of the draw.io redraw procedure on a sample source. |
| `import-mermaid.html` | Output of the Mermaid redraw procedure on a sample source. |
| `loop-terminal.html` | The Loop type rendered in the terminal skin primitive. |
| `quadrant-consultant.html` | The Quadrant type at the full/consultant density variant. |
| `sequence-oauth.html` | A Sequence diagram of an OAuth flow, default skin. |
| `sequence-oauth-dark.html` | The same OAuth sequence, dark-mode inversion. |
| `sequence-oauth-full.html` | The same OAuth sequence, full/consultant density variant. |

---

## 4. SKIN STARTERS (4)

| File | What it gives you |
|---|---|
| `starter-light.html` | The default light editorial skin, nothing drawn in it. |
| `starter-dark.html` | The dark inversion of that skin. |
| `starter-terminal.html` | The fixed CLI-chrome terminal skin (see [`primitive-terminal.md`](../../references/primitives/primitive-terminal.md)). |
| `starter-full.html` | The consultant-density layout: boundaries, a legend and info cards already placed. |

---

## 5. RELATED

| Document | Purpose |
|---|---|
| [`../../SKILL.md`](../../SKILL.md) | Type-selection guide. |
| [`../../references/types/`](../../references/types/) | The layout convention each form implements. |
| [`../../references/design-md-theming.md`](../../references/design-md-theming.md) | Repainting any of these in another visual language. |
