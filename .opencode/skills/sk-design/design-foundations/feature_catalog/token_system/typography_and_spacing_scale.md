---
title: "Typography And Spacing Scale"
description: "Current-state reference for design-foundations type roles, pairing, measure, and spacing-scale rhythm."
trigger_phrases:
  - "typography and spacing scale"
  - "design-foundations type scale"
  - "spacing rhythm scale"
  - "font pairing measure"
version: 1.0.0.0
---

# Typography And Spacing Scale

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

`design-foundations` sets type roles and a spacing scale before any decorative type or layout move, so hierarchy and rhythm read as deliberate rather than accidental.

Six roles are named before values: display, heading, body, caption, utility, and data, each with a defined job and guidance.

---

## 2. HOW IT WORKS

Type is paired by job, not taste alone: a loud display face keeps utility text plain, and data-heavy products choose numeral quality and legibility before personality. Numbers that update dynamically (counters, timers, prices) use `font-variant-numeric: tabular-nums`. Fluid type uses `clamp()` only when the minimum, preferred, and maximum values are all deliberate, capped at roughly 2.5x the minimum size.

### Measure And Readability

Body copy targets 45 to 75 characters per line, `text-wrap: balance` is used for short headings and `text-wrap: pretty` for short-to-medium body text, and the mode plans for localization expansion (German runs about 20-35% longer, Finnish about 30-40% longer than English) and for non-Latin script metrics that should not inherit Latin line-height or weight untested.

### Spacing And Hierarchy

Content drives breakpoints rather than fixed device sizes, and hierarchy is built from the fewest dimensions needed: space and grouping first, then weight and size, then color only when it carries meaning, then motion only after static hierarchy is clear.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/sk-design/design-foundations/references/type/typography_system.md` | Shared | Defines type roles, scale, pairing, font loading, measure, and the hierarchy stack. |
| `.opencode/skills/sk-design/design-foundations/references/layout/layout_responsive.md` | Shared | Defines the spacing scale, rhythm, and responsive base that pairs with type roles. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/sk-design/design-foundations/manual_testing_playbook/manual_testing_playbook.md` | Manual playbook | Exercises typography and spacing-scale scenarios against the live mode. |

---

## 4. SOURCE METADATA

- Group: Token System
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `token-system/typography-and-spacing-scale.md`

Related references:
- [oklch-color-and-token-system.md](../token_system/oklch_color_and_token_system.md) - Color token system built alongside type and spacing.
- [../adaptation-and-data/data-visualization-discipline.md](../adaptation_and_data/data_visualization_discipline.md) - Tabular-numeral and alignment rules extended for data tables.
