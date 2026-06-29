---
title: Layout Rhythm And Responsive Scenario
description: Manual scenario verifying spacing scale, hierarchy, grid choice, responsive adaptation, and input-context decisions.
trigger_phrases:
  - "test layout rhythm"
  - "test responsive adaptation"
  - "foundations layout scenario"
importance_tier: normal
contextType: reference
version: 1.0.0.1
expected_intent: LAYOUT
expected_resources:
  - references/corpus_map.md
  - ../shared/register.md
  - references/layout/layout_responsive.md
---

**Exact prompt**

```
Fix the layout system for a desktop dashboard that becomes a mobile task flow without hiding core controls.
```

# FOUND-LAYOUT-001 | Layout Rhythm And Responsive

## Prompt

`Fix the layout system for a desktop dashboard that becomes a mobile task flow without hiding core controls.`

## Expected Process

1. Route to `foundations` first; layout, spacing, and grid system decisions resolve here before any `sk-code` implementation handoff.
2. Load `references/layout/layout_responsive.md`.
3. Define spacing scale, grouping, hierarchy, and grid behavior.
4. Adapt the experience for touch and mobile context instead of only scaling widths.
5. Use an intrinsic grid recipe before media queries for simple card, gallery, tile, or metric grids.

## Pass Criteria

- Uses a spacing scale and proximity before adding containers.
- Chooses grid/flex by structural need.
- Defines the grid contract before placement, including columns, gutters, page margins, and region ownership for phone, tablet, and desktop breakpoints.
- For simple equal-width tile grids, reaches first for `repeat(auto-fit, minmax(280px, 1fr))` before breakpoint-specific media queries.
- Names comfortable and compact density behavior from the same spacing scale while preserving touch targets, focus rings, and readable row height.
- Applies containment restraint: borders, fills, elevation, and cards are used only when proximity, alignment, headings, or dividers are insufficient.
- Keeps core functionality available on mobile.
- Includes touch target, safe-area, orientation, and content-driven breakpoint notes.
