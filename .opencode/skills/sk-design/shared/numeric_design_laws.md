---
title: Numeric Design Laws
description: Shared index of numeric design laws that design modes cite for contrast, motion, spacing, type, and neutral color craft.
trigger_phrases:
  - "numeric design laws"
  - "design thresholds"
  - "contrast motion spacing type thresholds"
importance_tier: normal
contextType: general
version: 1.0.0.0
---

# Numeric Design Laws

Shared index of numeric design laws that design modes cite for contrast, motion, spacing, type, and neutral color craft. The owner source still holds the law; this file gives each value a stable row and an honest enforcement status.

---

## 1. Law Index

| law_id | value/range | owner mode | enforcement target | source | caveat |
|---|---|---|---|---|---|
| contrast-body-aa | 4.5:1 WCAG AA body text | foundations | design-foundations/scripts/contrast_check.py | design-foundations/assets/contrast_pair_inventory.md Section 4 - Use Rules | Product or regulatory contexts may set a stricter bar; failed required pairs block ready claims until repaired or scoped out. |
| contrast-large-ui-aa | 3:1 for large text, icons, visible focus, and UI controls | foundations | design-foundations/scripts/contrast_check.py | design-foundations/assets/contrast_pair_inventory.md Section 4 - Use Rules | Applies only to large text and non-text UI cases; body text still uses the 4.5:1 target. |
| contrast-apca-lc | absolute APCA Lc >= 60 where APCA is available | foundations | design-foundations/scripts/contrast_check.py | design-foundations/references/color/oklch_workflow.md Section 4 - Contrast Repair | Record APCA alongside WCAG evidence; it does not replace WCAG targets in this craft. |
| motion-feedback | 100-150ms for press, hover, tap, and tiny feedback | motion | advisory (no script) | design-motion/references/motion_strategy.md Section 3 - Timing | Values under about 80ms read as effectively instant; keep the tier near its floor without disappearing. |
| motion-state-change | 200-300ms for toggle, dropdown, tooltip, and tab change | motion | advisory (no script) | design-motion/references/motion_strategy.md Section 3 - Timing | User-initiated feedback over 300ms feels laggy; use this for state changes, not tiny feedback. |
| motion-layout-transition | 300-500ms for modal, drawer, accordion, and layout transition | motion | advisory (no script) | design-motion/references/motion_strategy.md Section 3 - Timing | Similar layout transitions should share timing so motion explains continuity rather than calling attention to itself. |
| motion-earned-entrance | 500-800ms for one earned entrance or brand choreography | motion | advisory (no script) | design-motion/references/motion_strategy.md Section 3 - Timing | One memorable entrance can be earned; repeated page-load choreography is not implied by this band. |
| register-product-motion-budget | 150-250ms state transitions for Product surfaces | interface | advisory (no script) | shared/register.md Section 3 - The Six Dials | Drift caveat: the register compresses Product posture, while detailed timing bands remain owned by design-motion/references/motion_strategy.md. |
| spacing-scale | 4px, 8px, 12px, 16px, 24px, 32px, 48px; section spacing clamp(48px, 8vw, 96px) | foundations | design-foundations/scripts/baseline_rhythm_check.py | design-foundations/assets/token_starter.md Section 4 - Spacing Scale | Pull filled spacing tokens from the scale; baseline_rhythm_check.py rejects unmarked one-off spacing values that do not resolve to the baseline. |
| type-modular-ratio | 1.2 for dense Product; 1.25-1.333 for expressive Brand | foundations | advisory (no script) | design-foundations/assets/token_starter.md Section 3 - Type Scale | The ratio sets role rhythm after roles are named; it is not a license for viewport-scaled type. |
| type-body-size | body text at least 16px, sitting near 16px | foundations | advisory (no script) | design-foundations/assets/token_starter.md Section 3 - Type Scale | Body size must still work with measure and line height; size alone does not prove readability. |
| neutral-chroma | neutral tint C 0.005-0.015 toward the brand hue | foundations | advisory (no script) | design-foundations/assets/token_starter.md Section 2 - Color Ramp | Tiny chroma keeps neutrals branded without turning surfaces into accent colors. |

---

## 2. Application Notes

- `foundations` cites contrast, spacing, type, and neutral rows when shaping static systems and proof artifacts.
- `motion` owns timing-band rows and applies them with purpose, easing, staging, and reduced-motion checks.
- `interface` may cite the register motion-budget row when setting Product posture before handoff.
- `audit` may cite any row by `law_id` when a finding depends on a numeric threshold.

Run the completeness gate from this directory:

```bash
python3 scripts/numeric_law_check.py numeric_design_laws.md
```
