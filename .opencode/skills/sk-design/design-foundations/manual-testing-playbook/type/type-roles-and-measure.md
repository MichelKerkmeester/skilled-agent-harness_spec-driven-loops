---
title: Type Roles And Measure Scenario
description: Manual scenario verifying role-based typography, scale, pairing, measure, and data text guidance.
trigger_phrases:
  - "test typography roles"
  - "test type measure"
  - "foundations type scenario"
importance_tier: normal
contextType: reference
version: 1.0.0.1
expected_intent: TYPE
expected_resources:
  - references/corpus-map.md
  - ../shared/register.md
  - references/type/typography-system.md
---

**Exact prompt**

```
Define typography for a dense analytics app with long labels, metrics, and a small marketing header.
```

# FOUND-TYPE-001 | Type Roles And Measure

## Prompt

`Define typography for a dense analytics app with long labels, metrics, and a small marketing header.`

## Expected Process

1. Load `references/type/typography-system.md`.
2. Define display, heading, body, caption, utility, and data roles.
3. Name measure and line-height constraints.
4. Include tabular numerals for metrics.
5. Check web-font loading performance: `font-display`, metric-matched fallbacks, critical-only preload, and whether a variable font is earned by at least three weights or axes.
6. Bound any `clamp()` type scale so the maximum is no more than about 2.5x the minimum.
7. Specify OpenType features only where they serve the content: fractions, real small caps, deliberate ligatures, kerning, and uppercase tracking.
8. Include light-on-dark optical compensation across line height, letter spacing, and weight.

## Pass Criteria

- Does not pick fonts before roles.
- Keeps expressive display type limited to identity moments.
- Addresses long labels and localization expansion.
- Any fluid type uses deliberate `clamp()` values with a maximum no more than about 2.5x the minimum.
- Web-font guidance covers `font-display`, metric-compatible fallbacks, critical above-the-fold preload only, and a variable-font threshold based on three or more weights or axes.
- OpenType guidance includes fractions, real small caps, ligature control, `font-kerning: normal`, and 0.05em-0.12em tracking only for short uppercase labels or eyebrows.
- Light-on-dark type compensates across all three axes: line height, letter spacing where needed, and weight.
- Checks non-Latin scripts beyond RTL and expansion, including line height, weight, fallback fonts, and glyph shaping for CJK, Arabic, Devanagari, and similar systems.
- Provides implementable role guidance for `sk-code`.
