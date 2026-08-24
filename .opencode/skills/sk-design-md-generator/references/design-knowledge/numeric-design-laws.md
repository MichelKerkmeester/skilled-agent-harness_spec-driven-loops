---
title: Numeric Design Laws
description: A stable, citable index of numeric design thresholds for contrast, motion, spacing, type, and neutral color, used when a reference finding depends on a number.
trigger_phrases:
  - "numeric design laws"
  - "design thresholds"
  - "contrast motion spacing type thresholds"
importance_tier: normal
contextType: general
version: 1.0.0.0
---

# Numeric Design Laws

A condensed index of numeric design thresholds for contrast, motion, spacing, type, and neutral color. Each row gives a stable value to cite when reading an extracted surface, so a finding can rest on a number instead of a guess.

---

## 1. OVERVIEW

### Purpose

Give one stable, citable row per numeric threshold instead of re-deriving contrast, motion, spacing, type, and neutral-color values independently when a captured surface is measured.

### Usage

Cite a row by `law_id` when a finding or observation about an extracted surface depends on a numeric threshold. Values are craft targets, not hard gates in this skill — a captured surface may legitimately differ; the row explains what "on target" means.

---

## 2. LAW INDEX

| law_id | value/range | caveat |
|---|---|---|
| contrast-body-aa | 4.5:1 WCAG AA body text | Product or regulatory contexts may set a stricter bar; failing body pairs are a real finding. |
| contrast-large-ui-aa | 3:1 for large text, icons, visible focus, and UI controls | Applies to large text and non-text UI only; body text still uses 4.5:1. |
| contrast-apca-lc | absolute APCA Lc >= 60 where APCA is available | Record APCA alongside WCAG evidence; it does not replace WCAG targets. |
| motion-feedback | 100-150 ms for press, hover, tap, and tiny feedback | Under ~80 ms reads as instant; keep near the floor without disappearing. |
| motion-state-change | 200-300 ms for toggle, dropdown, tooltip, and tab change | User-initiated feedback over 300 ms feels laggy; use for state changes, not tiny feedback. |
| motion-layout-transition | 300-500 ms for modal, drawer, accordion, and layout transition | Similar transitions should share timing so motion explains continuity. |
| motion-earned-entrance | 500-800 ms for one earned entrance or brand choreography | One memorable entrance can be earned; repeated page-load choreography is not. |
| register-product-motion-budget | 150-250 ms state transitions for Product surfaces | Compresses the Product posture; see `./register.md` Section 3. |
| spacing-scale | 4, 8, 12, 16, 24, 32, 48 px; section spacing clamp(48px, 8vw, 96px) | Captured spacing that does not resolve to a baseline step is a one-off worth noting. |
| type-modular-ratio | 1.2 for dense Product; 1.25-1.333 for expressive Brand | The ratio sets role rhythm after roles are named; not a license for viewport-scaled type. |
| type-body-size | body text at least 16px, sitting near 16px | Body size must still work with measure and line height; size alone does not prove readability. |
| neutral-chroma | neutral tint C 0.005-0.015 toward the brand hue | Tiny chroma keeps neutrals branded without turning surfaces into accent colors. |

---

## 3. HOW THIS SKILL USES IT

Cite a row by `law_id` when a measured observation about an extracted surface depends on a threshold — a contrast pair, a motion band, a spacing step, a type ratio. The values give a Style Reference honest, comparable numbers instead of vague adjectives.
