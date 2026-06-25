---
title: "sk-design-foundations: Feature Catalog"
description: "Lean capability inventory for the static visual-system child covering color, typography, layout, responsive adaptation, and token handoff."
trigger_phrases:
  - "sk-design-foundations feature catalog"
  - "foundations capabilities"
  - "static visual system inventory"
last_updated: "2026-06-25"
version: 1.0.0.0
---

# sk-design-foundations: Feature Catalog

This catalog records the current capability surface for `sk-design-foundations`.

## 1. OVERVIEW

| Capability | What it does | Detail file |
| --- | --- | --- |
| Color systems | Converts color intent into OKLCH, semantic roles, contrast-safe palettes, gamut handling, and dark-mode mapping | [`01--color-systems/color-systems.md`](01--color-systems/color-systems.md) |
| Typography systems | Defines type roles, scale, pairing, measure, data text, and readability checks | [`02--typography-systems/typography-systems.md`](02--typography-systems/typography-systems.md) |
| Layout and adaptation | Defines spacing, hierarchy, grid, density, responsive adaptation, input method, and handoff rules | [`03--layout-adaptation/layout-adaptation.md`](03--layout-adaptation/layout-adaptation.md) |

## 2. CURRENT REALITY

The skill is a static-system child. It does not invent the art direction and does not audit release readiness. It receives a brief, existing design direction, or target UI and returns concrete token guidance that `sk-code` can implement.

## 3. SOURCE ANCHORS

- `SKILL.md` for routing and boundaries.
- `references/color/oklch_workflow.md` and `references/color/palette_theming.md` for color.
- `references/type/typography_system.md` for type.
- `references/layout/layout_responsive.md` for layout and adaptation.
