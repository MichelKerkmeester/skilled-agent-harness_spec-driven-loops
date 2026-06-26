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
| `external/oklch-skill.md` | `color/oklch_workflow.md` | OKLCH channels, perceptual lightness, hue stability, APCA/WCAG thresholds, gamut and Tailwind patterns |
| `external/colorize.md` | `color/palette_theming.md` | Color strategy registers, semantic roles, dosage, tinted neutrals, dark-mode surface scales |
| `external/layout.md` | `layout/layout_responsive.md` | Spacing scale, rhythm, proximity, grid choice, hierarchy, optical alignment, touch targets, container queries |
| `external/baseline.md` | `type/typography_system.md` and all references | Anti-slop constraints for spacing and typography: tabular-nums for data, `text-wrap` balance/pretty, letter-spacing restraint, plus motion restraint, gradients, focus, and responsive details |
| `designer-skills-main` `ui-design/skills/typography-scale` and `ui-design/skills/readable-measure` | `type/typography_system.md` | Modular scale and role separation, weight/line-height relationships, and the 45-75ch readable measure with line-height growing as the column widens |
| `external/adapt.md` | `layout/layout_responsive.md` | Context adaptation, mobile/tablet/desktop patterns, input-method queries, safe areas, responsive images |

---

## 3. PARENT SHARED BASE USED BY REFERENCE

The parent `sk-design` references are cited for shared vocabulary only:
- `anti_slop_principles.md` for default-avoidance language.
- `design_token_vocabulary.md` for token role names.
- `cognitive_laws.md` for hierarchy and grouping rationale.
