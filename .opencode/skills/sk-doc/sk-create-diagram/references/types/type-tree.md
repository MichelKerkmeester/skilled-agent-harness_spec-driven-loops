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
version: 1.0.0.0
---

# Tree / Hierarchy

**Best for:** org charts, dependency trees, taxonomy, file trees, decision breakdowns, skill trees.

## 1. Layout conventions
- Root at top, children fan out below (or root at left, children to right).
- Nodes are small labeled rectangles (`rx=6`), Geist 12px 600 name + optional Geist Mono 9px sublabel. Width 120–180px, height 40–52px.
- **Connectors are orthogonal (elbow-style), never diagonal.** Parent drops a short vertical line, then a horizontal bus connects siblings, then each child has a short vertical drop into its top edge. 1px muted stroke.
- Leaf indicator: thinner stroke (0.8) or different fill — OR let terminal position do the work.
- Max depth: 4 (root + 3 tiers). Max breadth per level: 5.
- Coral on **one** node: root OR critical leaf. Not both.
- Draw connectors before nodes.

## 2. Anti-patterns
- Tree 5+ levels deep on a single page (illegible — split).
- Nodes of wildly varying widths — pick 2 widths max.
- Diagonal connector lines.
- Skipped levels (parent connected to grandchild with no middle).
- Coral on root AND a leaf.

## 3. Examples
- `assets/examples/example-tree.html` — minimal light
- `assets/examples/example-tree-dark.html` — minimal dark
- `assets/examples/example-tree-full.html` — full editorial
