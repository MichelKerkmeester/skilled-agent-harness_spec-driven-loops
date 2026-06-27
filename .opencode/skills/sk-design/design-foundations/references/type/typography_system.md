---
title: Typography System
description: Role-based typography guidance for scale, pairing, measure, hierarchy, data text, and readability checks.
trigger_phrases:
  - "typography system"
  - "font pairing"
  - "type scale"
  - "line length"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Typography System

Role-based typography guidance for scale, pairing, measure, hierarchy, data text, and readability checks.

---

## 1. OVERVIEW

### Core Principle

Typography is hierarchy and reading comfort first, personality second. Define roles before picking fonts.

### When to Use

- Defining display, heading, body, caption, utility, and data type roles.
- Choosing a scale and pairing that separate roles instead of decorating them.
- Setting measure, line height, and localization-resilient readability constraints.
- Verifying hierarchy and data-text legibility before handoff.

---

## 2. ROLES

| Role | Job | Guidance |
| --- | --- | --- |
| Display | identity moment | Use sparingly; one expressive face can carry the brand. |
| Heading | structure | Clear size/weight steps; enough space above to mark sections. |
| Body | reading | Comfortable line height, plain enough for long text. |
| Caption | metadata and helper text | Small but not faint; never below accessible readability. |
| Utility | buttons, nav, badges, dense controls | Stable, compact, high legibility. |
| Data | numbers, metrics, tables | Use tabular numerals and predictable alignment. |

Use `font-variant-numeric: tabular-nums` for numbers that update dynamically: counters, timers, prices, and updating numeric tables or columns. Static or decorative numerals do not need tabular alignment by default.

---

## 3. SCALE

Use a modular scale only as a starting point. The useful result is role separation:
- Body default: large enough for the platform, usually at least `16px` on mobile.
- Body line height: enough for scanning, usually `1.45` to `1.7` depending on measure.
- Heading ratios: strong hierarchy needs roughly 2 to 3 times contrast across primary levels when size is the main tool.
- Dense UI: prefer fewer sizes and stronger weight/spacing differences.

### Fluid Type Bounds

Use `clamp()` for fluid type only when the minimum, preferred, and maximum values are all deliberate. Cap the maximum size at no more than about `2.5x` the minimum size; wider ranges tend to shout on large viewports and can break zoom, reflow, and localization.

---

## 4. PAIRING

Pair typefaces by job, not taste alone:
- Display plus neutral body is safer than two expressive faces.
- If a display face is loud, keep utility text plain.
- If the product is data-heavy, choose numeral quality and legibility before personality.
- Avoid changing letter spacing by reflex; use it only for uppercase utility text or deliberate optical correction.

### Font Loading

- Use `font-display: swap` for most UI text; use `optional` when the brand face is decorative or the fallback is acceptable.
- Choose metric-matched fallback fonts so the fallback and loaded face have similar x-height, width, and line metrics. This reduces layout shift when the web font arrives.
- Preload only the critical above-the-fold weight and style. Extra preloads compete with product content and should earn their cost.
- Prefer a variable font when the design uses at least three weights or axes from the same family and the compressed file is competitive. Use static files when the system needs only one or two weights.

### OpenType Polish

Use OpenType features for text that needs typographic finish, not as blanket decoration:
- Use diagonal fractions for measurements, recipes, odds, and compact numeric annotations.
- Use real small caps for short labels only when the face includes them.
- Control ligatures deliberately: keep standard ligatures for body text, disable them for code, identifiers, and dense data.
- Set `font-kerning: normal` unless a browser or face produces visible defects.
- Track short uppercase labels and eyebrows by about `0.05em` to `0.12em`; avoid tracking lowercase body text.

---

## 5. MEASURE AND READABILITY

- Body copy usually reads best at 45 to 75 characters per line.
- Use `text-wrap: balance` for headings when available.
- Use `text-wrap: pretty` for paragraphs when available.
- Apply macOS font smoothing once at the root with `-webkit-font-smoothing: antialiased;` and `-moz-osx-font-smoothing: grayscale;`. Other platforms ignore it, so it is safe globally and should not be repeated per component.
- Use `text-wrap: balance` only for short headings; browsers only balance short blocks, usually around six lines or fewer.
- Use `text-wrap: pretty` for short-to-medium body and UI text to avoid orphans.
- Use neither wrap hint for long text, roughly 10 or more lines, where default wrapping is fine and cheaper.
- Use truncation or line clamp only when the full value is available elsewhere or not required for the task.
- Plan for text expansion in localization; German strings run about 20-35% longer and Finnish about 30-40% longer than English.
- Non-Latin scripts need script-specific checks for line height, weight, fallback fonts, and glyph shaping; CJK, Arabic, Devanagari, and similar systems should not inherit Latin metrics untested.

### Light-On-Dark Compensation

Light text on a dark background needs optical correction:
- Increase line height by about `0.05` to `0.1`.
- Add about `0.01em` to `0.02em` letter spacing when the face closes up.
- Step weight up one notch when thin light text starts to sparkle or break on dark surfaces.

---

## 6. HIERARCHY STACK

Hierarchy can come from size, weight, color, position, and space. Use the fewest dimensions needed:
1. Space and grouping.
2. Weight and size.
3. Color only when it carries meaning or emphasis.
4. Motion only after static hierarchy is clear.

---

## 7. VERIFICATION

Check:
- Can the primary heading, next action, and group boundaries be identified with the squint test?
- Are headings and body text readable at mobile widths?
- Do data values use tabular numerals?
- Are labels specific enough to be understood without placeholders?
- Does type still work under 200 percent zoom or longer translated strings?
