---
title: "Tree / Hierarchy"
description: "Layout conventions for parent→children relationships — orthogonal elbow connectors, depth/breadth caps, node treatments, and single focal node accent."
trigger_phrases:
  - "tree diagram layout"
  - "hierarchy tree"
  - "dependency tree"
  - "taxonomy tree"
  - "decision breakdown"
importance_tier: normal
contextType: implementation
version: 1.2.2.0
---

# Tree / Hierarchy

Open this when a structure has levels and the reader must see which node owns which without tracing diagonals.

## 1. OVERVIEW

### Purpose

Sets the grammar a hierarchy is drawn against, so every level and parent-child link stays readable at a glance.

### When to Use

- Org charts
- Dependency trees
- Taxonomy
- File trees
- Decision breakdowns
- Skill trees

---

## 2. LAYOUT CONVENTIONS
- Root at top, children fan out below (or root at left, children to right).
- Draw connectors before nodes.
- Nodes are small labeled rectangles (`rx=6`), Geist 12px 600 name + optional Geist Mono 9px sublabel. Width 120–180px, height 40–52px.
- **Connectors are orthogonal (elbow-style), never diagonal.** 1px muted stroke.
  1. Parent drops a short vertical line.
  2. A horizontal bus connects siblings.
  3. Each child has a short vertical drop into its top edge.
- Leaf indicator: thinner stroke (0.8) or different fill — OR let terminal position do the work.
- Max depth: 4 (root + 3 tiers). Max breadth per level: 5.
- Coral on **one** node: root OR critical leaf. Not both.

---

## 3. ANTI-PATTERNS
- Tree 5+ levels deep on a single page (illegible — split).
- Nodes of wildly varying widths — pick 2 widths max.
- Diagonal connector lines.
- Skipped levels (parent connected to grandchild with no middle).
- Coral on root AND a leaf.

---

## 4. EXAMPLES
- `assets/diagrams/tree.html` — minimal light
- `assets/diagrams/tree-dark.html` — minimal dark
- `assets/diagrams/tree-full.html` — full editorial
