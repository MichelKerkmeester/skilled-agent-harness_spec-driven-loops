---
title: OKLCH Palette And Dark Mode Scenario
description: Manual scenario verifying OKLCH color planning, semantic roles, contrast repair, and dark-mode mapping.
trigger_phrases:
  - "test oklch palette"
  - "test dark mode tokens"
  - "foundations color scenario"
importance_tier: normal
contextType: reference
version: 1.0.0.0
---

# FOUND-COLOR-001 | OKLCH Palette And Dark Mode

## Prompt

`Create a color token system for a finance dashboard with a teal brand color, restrained product UI, semantic states, and dark mode.`

## Expected Process

1. Route to `sk-design-foundations` rather than `sk-design-interface`.
2. Load `references/color/oklch_workflow.md` and `references/color/palette_theming.md`.
3. Produce semantic roles before values.
4. State contrast and dark-mode rules.

## Pass Criteria

- Uses OKLCH or explains a compatibility exception.
- Includes the canonical color roles: primary/accent, neutral, semantic, surface, border, and text.
- Covers the accent states (action, selection, focus) under the primary/accent role rather than inventing a separate focus role.
- Repairs contrast through lightness changes.
- Dark mode uses surface lightness and semantic token remapping, not inversion.
