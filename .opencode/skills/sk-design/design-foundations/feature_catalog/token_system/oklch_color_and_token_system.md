---
title: "OKLCH Color And Token System"
description: "Current-state reference for design-foundations register-gated OKLCH color, semantic token naming, contrast repair, and gamut fallback."
trigger_phrases:
  - "oklch color and token system"
  - "design-foundations color tokens"
  - "contrast repair oklch"
  - "gamut fallback color"
version: 1.0.0.0
---

# OKLCH Color And Token System

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

`design-foundations` builds every color system in OKLCH so lightness steps read as brightness steps, hue stays stable across a scale, and chroma can be managed explicitly instead of guessed from hex.

The mode reads the shared Brand-vs-Product register before any color value, because that call sets the color strategy and density everything else inherits.

---

## 2. HOW IT WORKS

The workflow generates a lightness ladder first (near-white backgrounds, mid accents, deep text, dark surfaces), then assigns semantic token roles before implementation values: `primary/accent`, `neutral`, `semantic`, `surface`, `border`, `text`. Chroma is set as a percentage of each hue's displayable maximum rather than the same absolute chroma across hues, and is reduced near lightness extremes to avoid neon whites and muddy blacks.

### Contrast Repair

Contrast failures are fixed by adjusting lightness first. Normal text targets APCA `|Lc| >= 60` and WCAG AA `4.5:1`; chroma and hue changes are branding choices, not reliable contrast fixes, and semantic meaning stays stable (error red darkens or lightens within the role rather than shifting to orange).

### Gamut And Dark Mode

High-chroma OKLCH values that leave sRGB are clamped to the maximum chroma for the chosen lightness/hue, or given a guarded `@media (color-gamut: p3)` fallback path. Dark mode is rebuilt as a separate surface system rather than an inverted palette, and dark-mode colors are never hand-picked independently from the token roles.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/sk-design/design-foundations/references/color/oklch_workflow.md` | Shared | Defines OKLCH channels, palette generation, contrast repair, and gamut/fallback rules. |
| `.opencode/skills/sk-design/design-foundations/references/color/palette_theming.md` | Shared | Defines color dosage, semantic roles, tinted neutrals, surface scales, and dark-mode mapping. |
| `.opencode/skills/sk-design/shared/register.md` | Shared | Supplies the Brand-vs-Product register read before color strategy is set. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/sk-design/design-foundations/manual_testing_playbook/manual_testing_playbook.md` | Manual playbook | Exercises OKLCH color and token-system scenarios against the live mode. |

---

## 4. SOURCE METADATA

- Group: Token System
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `token-system/oklch-color-and-token-system.md`

Related references:
- [typography-and-spacing-scale.md](typography-and-spacing-scale.md) - Type and spacing scale built alongside the color system.
- [../adaptation-and-data/context-adaptation-matrix.md](../adaptation-and-data/context-adaptation-matrix.md) - Adaptation dimensions the token system must survive.
