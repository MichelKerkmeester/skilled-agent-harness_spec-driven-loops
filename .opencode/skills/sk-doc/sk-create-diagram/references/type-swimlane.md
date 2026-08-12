---
title: "Swimlane"
description: "Layout conventions for cross-functional processes — horizontal or vertical lanes per actor, lane-labeled steps, handoff accent, and hairline dividers."
trigger_phrases:
  - "swimlane diagram layout"
  - "cross functional process"
  - "raci style flow"
  - "vendor handoff"
  - "multi team workflow"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Swimlane

**Best for:** cross-functional processes, RACI-style flows, vendor handoffs, multi-team shipping workflows.

## 1. Layout conventions
- Horizontal lanes (or vertical columns) — one per actor/team. Label each lane in the left margin (or top) with a Geist Mono eyebrow.
- Lane dividers: 1px hairlines.
- Process steps are rectangles placed inside the lane of the actor performing them; arrows show flow.
- Handoffs (arrows crossing lane boundaries) are the most important edges — consider coral on the handoff that introduces the most coupling or latency.
- Don't force equal step count per lane; a lane with one step is fine.

## 2. Anti-patterns
- Lanes without labels.
- A step drawn across two lanes (pick one owner).
- Arrows that snake back and forth — reorder steps so the flow is mostly straight.

## 3. Examples
- `assets/example-swimlane.html` — minimal light
- `assets/example-swimlane-dark.html` — minimal dark
- `assets/example-swimlane-full.html` — full editorial
