---
title: Design System Extraction
description: Private procedure card for design-md-generator measured design-system extraction.
trigger_phrases:
  - "design system extraction"
  - "design md generation"
  - "css token extraction"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Design System Extraction

Private procedure card for applying the existing design-md-generator measured extraction workflow.

## 1. REQUIRED FIELDS

| Field | Value |
|---|---|
| Purpose | Let `design-md-generator` adapt measured source design data into a faithful Style Reference workflow. |
| Owning mode | `design-md-generator` |
| Source reference | `design-system-extract.md` |
| Trigger | Use when the user asks to extract tokens, capture CSS, generate `DESIGN.md`, or ground future work in a live site, source design system, screenshot, or brand reference. |
| Output contract | A measured extraction plan or generated reference containing colors, typography, spacing, radii, shadows, additional tokens, source list, gaps, inconsistencies, and next steps. |
| Proof gate | Every reported value traces to source evidence or is explicitly labeled absent; gaps and inconsistencies are surfaced instead of silently filled. |
| Privacy rule | This private card belongs to the existing `design-md-generator` mode and does not add a public extraction skill. |

## 2. TOOL BOUNDARY

`design-md-generator` is the only mutating sk-design mode. It may use its existing extraction pipeline when the mode contract permits. The card does not grant Write, Edit, or Bash to the four read-only advisory modes.

## 3. PROCEDURE

1. Identify source type: codebase, live site, screenshots, brand guide, or existing design-system project.
2. Extract by category: colors, typography, spacing, radii, shadows, and any present z-index, animation, breakpoint, or container tokens.
3. Keep source names, intended usage, gaps, and inconsistencies visible.
4. Emit or plan the target reference format that matches the mode's current extraction contract.
5. Recommend review before future interface or foundations work consumes the extracted system.

## 4. CONFLICT RULE

If no measurable source exists and the user wants a new direction from a brief, route to `design-interface/procedures/aesthetic_direction.md` instead.
