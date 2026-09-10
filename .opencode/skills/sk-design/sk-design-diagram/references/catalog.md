---
title: "Diagram Catalog"
description: "The index from a reader's question to the one diagram type that answers it and the example that draws it, verified in both directions."
trigger_phrases:
  - "diagram catalog"
  - "which diagram type"
  - "diagram lookup"
importance_tier: important
contextType: reference
version: 1.1.0.2
---

# Diagram Catalog

Read this before choosing a type. The table between the sentinels below is machine-read: the corpus check matches its columns by header name rather than by position. Every row resolves to a canonical example under `assets/examples/`, and every canonical example appears in exactly one row. Prose outside the sentinels is never asserted on, so rewrite this page freely. A ceiling cell carries the number and qualifier its own type file states. `No stated ceiling` means the file states none of its own, so the general budget of 9 nodes and 12 arrows applies.

<!-- DIAGRAM_CATALOG:BEGIN -->
| id | family | question | canonical | variants | ceiling | imports | skin |
| --- | --- | --- | --- | --- | --- | --- | --- |
| architecture | components-and-connections | What components make up this system and how do they connect | assets/examples/example-architecture.html | none | No stated ceiling | assets/examples/example-import-drawio.html, assets/examples/example-import-mermaid.html | light |
| it-state | components-and-connections | What does the legacy landscape look like today, grouped by phase or department | assets/examples/example-it-state.html | none | 16 components, 5 per zone (cap) | none | light |
| flowchart | behavior-and-flow | Which path does the decision logic take at each branch | assets/examples/example-flowchart.html | none | No stated ceiling | none | light |
| sequence | behavior-and-flow | In what order do these actors exchange messages | assets/examples/example-sequence.html | assets/examples/example-sequence-oauth.html, assets/examples/example-sequence-oauth-dark.html, assets/examples/example-sequence-oauth-full.html | No stated ceiling | none | light; dark variant |
| state | behavior-and-flow | Which states exist, what moves between them and what guards each transition | assets/examples/example-state.html | none | No stated ceiling | none | light |
| er | data-structure | Which entities exist, what fields they carry and how they relate | assets/examples/example-er.html | none | No stated ceiling | none | light |
| timeline | time-and-quantity | When did each event happen, in order | assets/examples/example-timeline.html | none | No stated ceiling | none | light |
| swimlane | behavior-and-flow | Who does what across the process and where are the handoffs | assets/examples/example-swimlane.html | none | No stated ceiling | none | light |
| quadrant | structure-and-ranking | Where does each option sit on the two axes | assets/examples/example-quadrant.html | assets/examples/example-quadrant-consultant.html | No stated ceiling | none | light |
| radar | time-and-quantity | How do several entities score across a few shared criteria | assets/examples/example-radar.html | none | 3–5 axes (above 5, split) | none | light |
| loop | structure-and-ranking | What cycle keeps feeding itself and where does the shared state accumulate | assets/examples/example-loop.html | assets/examples/example-loop-terminal.html | 5–8 stations, 1 hub (hard) | none | light |
| nested | structure-and-ranking | What contains what and at which scope | assets/examples/example-nested.html | none | No stated ceiling | none | light |
| tree | structure-and-ranking | Which parent produces which children | assets/examples/example-tree.html | none | No stated ceiling | none | light |
| org-chart | structure-and-ranking | Who owns what, who reports to whom and how does routing escalate | assets/examples/example-org-chart.html | none | No stated ceiling | none | light |
| layers | structure-and-ranking | Which abstraction levels stack and in what order | assets/examples/example-layers.html | none | No stated ceiling | none | light |
| venn | structure-and-ranking | Where do these sets overlap | assets/examples/example-venn.html | none | No stated ceiling | none | light |
| pyramid | structure-and-ranking | How does the ranking hold or where does the funnel drop off | assets/examples/example-pyramid.html | none | No stated ceiling | none | light |
| bar | time-and-quantity | Which category is the biggest | assets/examples/example-bar.html | none | No stated ceiling | none | light |
| line | time-and-quantity | What direction is this measure moving over time | assets/examples/example-line.html | none | No stated ceiling | none | light |
| gantt | time-and-quantity | Which tasks and phases are active when | assets/examples/example-gantt.html | none | No stated ceiling | none | light |
| scatter | time-and-quantity | Do these two variables move together and how do individual values distribute | assets/examples/example-scatter.html | none | No stated ceiling | none | light |
| high-level | components-and-connections | What does the end-to-end data stack look like on the cluster | assets/examples/example-high-level.html | none | 3 outgoing edges per node (max) | none | light |
| process | behavior-and-flow | Which actors run this process in order and where does data change hands | assets/examples/example-process.html | none | 6 lanes, 12 steps (max) | none | light |
| medallion | data-structure | Which storage tiers exist, at which quality levels and under which access policies | assets/examples/example-medallion.html | none | No stated ceiling | none | light |
| data-flow | behavior-and-flow | Which role does what at each step of the data flow | assets/examples/example-data-flow.html | none | 4 lanes, 6 steps (max) | none | light |
| dp-integration | data-structure | How do sources, the platform core and consumers integrate | assets/examples/example-dp-integration.html | none | No stated ceiling | none | light |
| dp-security-matrix | data-structure | Which role holds which permission on which component | assets/examples/example-dp-security-matrix.html | none | 6 roles, 14 components (max) | none | light |
<!-- DIAGRAM_CATALOG:END -->

## Not indexed

The hand-drawn `sketchy` treatment is documented in `references/primitives/primitive-sketchy.md` as a variant that applies to any minimal template, but no example in the corpus exercises it. It is descoped from this catalog with that stated reason, unproven by any example, rather than given a manufactured proof file whose only job would be to demonstrate one primitive.

`assets/icons.html` is a specimen sheet for the icon primitive, not a diagram. It carries no type and no reader question, so it is not indexed as an example.
