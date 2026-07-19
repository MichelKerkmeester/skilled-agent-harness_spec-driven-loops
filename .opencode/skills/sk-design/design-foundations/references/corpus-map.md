---
title: Foundations Corpus Map
description: Source-to-guidance map for the static visual-system material distilled into foundations.
trigger_phrases:
  - "foundations corpus"
  - "static visual system sources"
  - "oklch layout type corpus"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Foundations Corpus Map

Source-to-guidance traceability for the static visual-system corpus distilled into this skill.

---

## 1. OVERVIEW

### Purpose

This skill distills the static visual-system corpus into actionable guidance rather than copying source files. This map records which source corpus file fed which reference and what practical guidance was kept.

### Distillation Boundary

This child owns static systems. It does not own broad interface direction (`interface`), motion build (`motion`), or review/scoring (`audit`).

---

## 2. SOURCE FILES

| Corpus file | Distilled into | Practical guidance kept |
| --- | --- | --- |
| `external/oklch-skill.md` | `color/oklch-workflow.md` | OKLCH channels, perceptual lightness, hue stability, APCA/WCAG thresholds, gamut and Tailwind patterns |
| `external/colorize.md` | `color/palette-theming.md` | Color strategy registers, semantic roles, dosage, tinted neutrals, dark-mode surface scales |
| `external/layout.md` | `layout/layout-responsive.md` | Spacing scale, rhythm, proximity, grid choice, hierarchy, optical alignment, touch targets, container queries |
| `external/baseline.md` | `type/typography-system.md` and all references | Anti-slop constraints for spacing and typography: tabular-nums for data, `text-wrap` balance/pretty, letter-spacing restraint, plus motion restraint, gradients, focus, and responsive details |
| `designer-skills-main` `ui-design/skills/typography-scale` and `ui-design/skills/readable-measure` | `type/typography-system.md` | Modular scale and role separation, weight/line-height relationships, and the 45-75ch readable measure with line-height growing as the column widens |
| `external/adapt.md` | `layout/layout-responsive.md` and `layout/adaptation-matrix.md` | Context adaptation, mobile/tablet/desktop patterns, input-method queries, safe areas, responsive images and the four-dimension adaptation matrix |
| `external/colorize.md` (data viz) and `designer-skills-main` `ui-design/skills/data-visualization` | `data-viz.md` | Chart-type selection, axis and encoding, color-for-data scales (sequential, diverging, categorical), sparklines and data-table alignment beyond tabular-nums |
| `external/oklch-skill.md` and `external/layout.md` (scales) | `assets/token-starter.md` | Fill-in OKLCH ramp, modular type scale and 4-point spacing scale keyed to the shared register |

---

## 3. PARENT SHARED BASE USED BY REFERENCE

The parent `sk-design` references are cited for shared vocabulary only:
- `anti-slop-principles.md` for default-avoidance language.
- `design-token-vocabulary.md` for token role names.
- `cognitive-laws.md` for hierarchy and grouping rationale.
