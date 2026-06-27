---
title: Layout Rhythm And Responsive Scenario
description: Manual scenario verifying spacing scale, hierarchy, grid choice, responsive adaptation, and input-context decisions.
trigger_phrases:
  - "test layout rhythm"
  - "test responsive adaptation"
  - "foundations layout scenario"
importance_tier: normal
contextType: reference
version: 1.0.0.0
---

# FOUND-LAYOUT-001 | Layout Rhythm And Responsive

## Prompt

`Fix the layout system for a desktop dashboard that becomes a mobile task flow without hiding core controls.`

## Expected Process

1. Route to `foundations` first; layout, spacing, and grid system decisions resolve here before any `sk-code` implementation handoff.
2. Load `references/layout/layout_responsive.md`.
3. Define spacing scale, grouping, hierarchy, and grid behavior.
4. Adapt the experience for touch and mobile context instead of only scaling widths.

## Pass Criteria

- Uses a spacing scale and proximity before adding containers.
- Chooses grid/flex by structural need.
- Keeps core functionality available on mobile.
- Includes touch target, safe-area, orientation, and content-driven breakpoint notes.
