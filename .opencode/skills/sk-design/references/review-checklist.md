---
title: UI Review Checklist
description: A severity-tiered audit pass over UI code — WCAG-cited accessibility checks, then visual and component checks — producing findings with file and line references.
trigger_phrases:
  - "review this ui code"
  - "accessibility audit checklist"
  - "wcag design review"
  - "component quality check"
  - "design review findings"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# UI Review Checklist

An audit pass over UI code rather than a rendered picture. Every finding names a file, a line, the criterion it violates, and the fix.

---

## 1. OVERVIEW

### Core Principle

Read the code before assessing it. A review that reports a problem without a line number and a concrete fix is an opinion, not a finding.

### When to Use

- Reviewing a component, a page, or a pull request that touches UI.
- A design review that must produce actionable items rather than impressions.
- Checking accessibility before shipping.

### How It Differs From Diagnosis

[`diagnosis-table.md`](diagnosis-table.md) starts from a **complaint** and works back to a cause. This starts from the **code** and works forward to findings, whether or not anyone has complained. Use both on a substantial review: the checklist catches what nobody noticed, the diagnosis table explains what somebody did.

### Source

The accessibility and visual-review structure is adapted from the Rams design-review skill (<https://www.ui-skills.com/skills/rams/rams>). Its checks are restated here and merged with the interaction, motion and visual rules from the other references so one pass covers all of them.

---

## 2. ACCESSIBILITY, CRITICAL

Fix before merge. Each row breaks the interface for someone.

| Check | WCAG | What to look for |
|---|---|---|
| Images without alt | 1.1.1 | `<img>` with no `alt` attribute |
| Icon-only buttons | 4.1.2 | `<button>` containing only an SVG or icon, with no `aria-label` |
| Form inputs without labels | 1.3.1 | `<input>`, `<select>`, `<textarea>` with no associated `<label>` and no `aria-label` |
| Non-semantic click handlers | 2.1.1 | `<div onClick>` or `<span onClick>` without `role`, `tabIndex` and `onKeyDown` |
| Missing link destination | 2.1.1 | `<a>` with only `onClick` and no `href` |
| HTML illustrations unlabelled | 1.1.1 | A composition of divs with no `aria-label`, so a screen reader announces the DOM tree |

---

## 3. ACCESSIBILITY, SERIOUS

| Check | WCAG | What to look for |
|---|---|---|
| Focus outline removed | 2.4.7 | `outline-none` or `outline: none` with no visible focus replacement. The replacement should be `box-shadow`, which respects border radius |
| Missing keyboard handlers | 2.1.1 | Interactive elements with `onClick` but no `onKeyDown` or `onKeyUp` |
| Color-only information | 1.4.1 | Status or error indicated by color alone, with no icon or text |
| Touch target too small | 2.5.5 | Clickable elements under 44 by 44px. Expand with padding or a negative-inset pseudo-element, not by growing the visual box |
| Text contrast below minimum | 1.4.3 | Normal text under 4.5:1. The 3:1 allowance applies only to 24px regular or 18.66px bold |
| Functional border contrast | 1.4.11 | A border that is the only thing identifying a control, under 3:1 against its background |
| Tooltip on a disabled button | 4.1.2 | Disabled elements are not focusable, so the tooltip is unreachable |
| Interactive content in a hover tooltip | 2.1.1 | Same cause: the content cannot be reached by keyboard |

---

## 4. ACCESSIBILITY, MODERATE

| Check | WCAG | What to look for |
|---|---|---|
| Heading hierarchy | 1.3.1 | Skipped levels, such as `h1` straight to `h3` |
| Positive tabIndex | 2.4.3 | `tabIndex` greater than 0, which disrupts natural tab order |
| Role without required attributes | 4.1.2 | `role="button"` with no `tabIndex="0"` |
| List keyboard navigation | 2.1.1 | A sequential list of focusable elements not navigable with arrow keys |

---

## 5. VISUAL AND COMPONENT CHECKS

### Layout and spacing

- Spacing values that are not on the scale in `SKILL.md` Section 3.
- Equal spacing inside and between groups, which makes grouping ambiguous.
- Overflow and alignment problems; `z-index` conflicts.
- Percentage widths on elements that should not scale.

### Typography

- Mixed font families, weights or sizes with no system behind them.
- Font sizes off the type scale, or `em` used for the type scale.
- Line height not inversely tracking size; measure outside 45 to 75 characters.
- Missing font fallbacks.
- Font weight changing on hover or selected state, which shifts layout.

### Color and contrast

- Contrast below the minimums in Sections 3 and 4.
- Grey text on a colored background.
- Shades generated at runtime with `lighten()` or `darken()`.
- Dark mode inconsistencies: a mechanically inverted ramp, accents that were not desaturated, text a shade too bright.

### Components

- Missing button states: disabled, loading, hover, active, focus. The `:active` state needs a scale transform.
- Missing form field states: error, success, disabled.
- Inconsistent borders, shadows or icon sizing.
- Shadows chosen by looks rather than by z-position, or two elevation systems mixed in one project.

### Motion

- Durations outside the bands in [`motion-principles.md`](motion-principles.md) Section 5.
- Similar elements with different timing values.
- Linear easing on anything that is not a progress indicator.
- Deformation outside 0.95 to 1.05; stagger over 50ms per item.
- Animation on high-frequency interactions, keyboard navigation, or context-menu entrances.

---

## 6. REPORT FORMAT

Group by severity, most severe first. Every finding carries a location, the offending code, the fix, and the criterion where one applies.

```text
UI REVIEW: <file or scope>

CRITICAL (n)
  [A11Y] path/to/file.tsx:24 — Button has no accessible name
    <button><CloseIcon /></button>
    Fix: add aria-label="Close"
    WCAG: 4.1.2

SERIOUS (n)
  [VISUAL] path/to/file.css:88 — Off-scale spacing (17px)
    padding: 17px;
    Fix: use 16px (--space-4)

MODERATE (n)
  ...

SUMMARY: n critical, n serious, n moderate
```

Report a count of zero explicitly rather than omitting the tier. A missing tier reads as "not checked".

---

## 7. RULES FOR THE REVIEWER

1. Read the files before assessing them. No finding from a filename or a guess.
2. Give a line number and the actual snippet for every finding.
3. Give the fix, not only the problem.
4. Order by severity: critical accessibility first, always.
5. Do not report a value as off-scale without checking the project's own token file first — a project's established system outranks this skill's defaults.
6. Offer to apply the fixes; do not apply them unasked.

---

## 8. REFERENCES AND RELATED RESOURCES

- [`diagnosis-table.md`](diagnosis-table.md) — the complaint-driven counterpart to this code-driven pass.
- [`interaction-craft.md`](interaction-craft.md) — the implementation detail behind most Section 5 checks.
- [`motion-principles.md`](motion-principles.md) — the motion values Section 5 checks against.
- [`../assets/token-starter-set.md`](../assets/token-starter-set.md) — which grey belongs to which text role, when a contrast finding needs a replacement value.
