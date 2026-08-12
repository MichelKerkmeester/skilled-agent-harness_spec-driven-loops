---
title: "references/types: Diagram Type Conventions"
description: "Index of the 27 per-type layout conventions loaded conditionally for a generate request."
importance_tier: normal
trigger_phrases:
  - "diagram type conventions index"
  - "27 diagram types"
contextType: general
version: 1.0.0.0
---

# references/types

Per-type layout conventions, ceilings, and anti-patterns — one file per supported diagram type.

---

## 1. OVERVIEW

The router loads exactly one of these files per generate request, selected by `SKILL.md`'s type-selection guide. Each file documents that type's grammar-specific rules: layout formulas, complexity ceiling, and common anti-patterns.

---

## 2. FILES

| File | Diagram Type |
|---|---|
| `type-architecture.md` | Architecture |
| `type-bar.md` | Bar / Column Chart |
| `type-data-flow.md` | Data Flow |
| `type-dp-integration.md` | DP integration |
| `type-dp-security-matrix.md` | DP security matrix |
| `type-er.md` | ER / Data Model |
| `type-flowchart.md` | Flowchart |
| `type-gantt.md` | Gantt Chart |
| `type-high-level.md` | High-Level |
| `type-it-state.md` | IT current-state |
| `type-layers.md` | Layer Stack |
| `type-line.md` | Line Chart |
| `type-loop.md` | Loop |
| `type-medallion.md` | Medallion |
| `type-nested.md` | Nested Containment |
| `type-org-chart.md` | Org Chart / Responsibility Map |
| `type-process.md` | Process |
| `type-pyramid.md` | Pyramid / Funnel |
| `type-quadrant.md` | Quadrant |
| `type-radar.md` | Radar / Spider |
| `type-scatter.md` | Scatter Plot |
| `type-sequence.md` | Sequence |
| `type-state.md` | State Machine |
| `type-swimlane.md` | Swimlane |
| `type-timeline.md` | Timeline |
| `type-tree.md` | Tree / Hierarchy |
| `type-venn.md` | Venn / Set Overlap |

---

## 3. RELATED

| Document | Purpose |
|---|---|
| [`../../SKILL.md`](../../SKILL.md) | Type-selection guide and Smart Router. |
| [`../foundations/style-guide.md`](../foundations/style-guide.md) | The shared design tokens every type draws against. |
| [`../../assets/examples/`](../../assets/examples/) | One canonical rendered example per type. |
