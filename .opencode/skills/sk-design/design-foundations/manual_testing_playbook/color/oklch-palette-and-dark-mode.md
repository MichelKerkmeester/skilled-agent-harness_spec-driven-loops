---
title: OKLCH Palette And Dark Mode Scenario
description: Manual scenario verifying OKLCH color planning, semantic roles, contrast repair, and dark-mode mapping.
trigger_phrases:
  - "test oklch palette"
  - "test dark mode tokens"
  - "foundations color scenario"
importance_tier: normal
contextType: reference
version: 1.0.0.1
expected_intent: COLOR
expected_resources:
  - references/corpus_map.md
  - ../shared/register.md
  - references/color/oklch_workflow.md
  - references/color/palette_theming.md
---

**Exact prompt**

```
Create a color token system for a finance dashboard with a teal brand color, restrained product UI, semantic states, and dark mode.
```

# FOUND-COLOR-001 | OKLCH Palette And Dark Mode

## Prompt

`Create a color token system for a finance dashboard with a teal brand color, restrained product UI, semantic states, and dark mode.`

## Expected Process

1. Route to `foundations` rather than `interface`.
2. Load `references/color/oklch_workflow.md` and `references/color/palette_theming.md`.
3. Ground the palette in one physical-scene sentence before choosing light, dark, restrained, committed, full-palette, or drenched.
4. Produce semantic roles before values.
5. State contrast, dangerous meaning-pair, color-vision, and dark-mode rules.

## Pass Criteria

- Uses OKLCH or explains a compatibility exception.
- Names the physical scene first: who uses it, where they are, ambient light, and the intended mood before deciding light versus dark.
- Includes the canonical color roles: primary/accent, neutral, semantic, surface, border, and text.
- Covers the accent states (action, selection, focus) under the primary/accent role rather than inventing a separate focus role.
- Warns against dangerous meaning pairs such as red/green, blue/red, and yellow/white, and notes that roughly 8% of men have a color-vision deficiency.
- Never encodes meaning by hue alone; pairs hue with text, icon shape, pattern, position, or state copy.
- Repairs contrast through lightness changes.
- Dark mode uses surface lightness and semantic token remapping, not inversion.
- Verifies theme-specific media, including logos, illustrations, screenshots, maps, charts, and embedded media, so assets remain legible and brand marks do not disappear in each supported theme.
- Notes when semantically loaded colors need locale-aware review because status, ritual, political, or cultural meanings could change by market.
