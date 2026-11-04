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
version: 1.2.2.0
---

# Swimlane

Read this when the question is not only what happens, but which team does it and where the work changes hands.

## 1. OVERVIEW

### Purpose

Sets the grammar a cross-functional process is drawn against, so the reader can see which actor performs each step and where ownership passes.

### When to Use

- Cross-functional processes
- RACI-style flows
- Vendor handoffs
- Multi-team shipping workflows

---

## 2. LAYOUT CONVENTIONS
- Horizontal lanes (or vertical columns): one per actor/team.
- Label each lane in the left margin (or top) with a Geist Mono eyebrow.
- Lane dividers: 1px hairlines.
- Process steps are rectangles placed inside the lane of the actor performing them; arrows show flow.
- Don't force equal step count per lane; a lane with one step is fine.
- Handoffs (arrows crossing lane boundaries) are the most important edges — consider coral on the handoff that introduces the most coupling or latency.

---

## 3. ANTI-PATTERNS
- Lanes without labels.
- A step drawn across two lanes (pick one owner).
- Arrows that snake back and forth — reorder steps so the flow is mostly straight.

---

## 4. EXAMPLES
- `assets/diagrams/swimlane.html` — minimal light
- `assets/diagrams/swimlane-dark.html` — minimal dark
- `assets/diagrams/swimlane-full.html` — full editorial
