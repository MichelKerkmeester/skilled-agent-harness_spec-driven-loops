---
title: "UX Quality Reference"
description: "The objective quality floor every interface must clear regardless of aesthetic direction: accessibility, motion, touch, responsive, forms, and data visualization rules."
trigger_phrases:
  - "ux quality floor rules"
  - "accessibility motion touch responsive gate"
  - "interface pass fail checklist"
  - "wcag contrast keyboard focus rules"
  - "data visualization a11y rules"
importance_tier: normal
contextType: implementation
---

# UX Quality Reference

The objective quality floor every interface must clear, whatever its aesthetic direction. Broken rules make an interface measurably worse for real users.

---

## 1. OVERVIEW

### Core Principle

These are not style choices. They are the rules that, when broken, make an interface measurably worse for real users. When a rule and an aesthetic choice collide, the rule wins.

### When to Use

- After the design direction is set, as the pass/fail gate before shipping.
- When verifying a build against accessibility, motion, touch, responsive, forms, and data-visualization floors.
- When `design_principles.md` has decided what the interface is and you need to confirm it does not break.

### Key Sources

- [design_principles.md](./design_principles.md) decides what the interface is. This reference confirms it does not break.
- Full, queryable rule sets live in [`../assets/data/`](../assets/data/): `ux-guidelines.csv`, `app-interface.csv`, `charts.csv`.
- Distilled from the CRITICAL and HIGH severity rows of the adopted data sets.
- Data provenance: adopted from the MIT-licensed `ui-ux-pro-max` repo. See [`../THIRD-PARTY-NOTICES.md`](../THIRD-PARTY-NOTICES.md).

---

## 2. ACCESSIBILITY (HARD FLOOR)

- **Color contrast** meets WCAG AA: body text 4.5:1, large text and UI affordances 3:1. Verify, do not eyeball.
- **Never encode meaning in color alone.** Pair color with text, icon, or pattern (error states, chart series, status).
- **Every image has alt text.** Decorative images get empty `alt=""`, not a missing attribute.
- **Interactive elements expose accessible names** (ARIA label or visible label). Icon-only buttons MUST set an accessible label.
- **Full keyboard operability** with a visible focus ring on every focusable element. Never remove focus outlines without replacing them.
- **Form controls have real labels** (not placeholder-as-label). Errors are announced, specific, and tied to the field.

---

## 3. MOTION (RESPECT THE USER'S SETTING)

- **Honor `prefers-reduced-motion`.** Drop or reduce non-essential animation. Never gate functionality behind motion.
- **No excessive or scattered motion.** Prefer one orchestrated moment over many competing ones. This is also a `design_principles.md` rule.
- **Loading states are explicit** (skeleton or spinner), not a frozen or empty screen.

---

## 4. TOUCH AND INPUT

- **Touch targets at least 44x44 px** with adequate spacing. Do not rely on hover for primary actions on touch devices.
- **Interactive areas are touch-friendly** on small viewports (spacing, hit area, no tiny tap targets).

---

## 5. RESPONSIVE

- **Set the viewport meta tag.** Design works from mobile up.
- **No unintended horizontal scroll.** Content reflows. It does not force sideways panning.
- **Readable font size** on mobile (body ~16px floor). Never ship sub-legible text to fit a layout.

---

## 6. FORMS AND FEEDBACK

- **Labels are visible and persistent.** Submit and validation feedback is immediate and specific.
- **Errors say what went wrong and how to fix it**, next to the field, not only in a top banner.

---

## 7. DATA VISUALIZATION (`charts.csv`)

- **Match the chart to the data shape** (trend to line, compare to bar, parts-of-whole to stacked or waffle). Do not force a default chart.
- **Charts meet the a11y grade.** Differentiate series by more than color (line style, pattern, direct labels), and provide a data-table or CSV fallback.
- **Respect data-volume thresholds** (SVG vs canvas vs aggregation) so the chart stays readable and performant.

---

## 8. SCOPE NOTE: `react-performance.csv` (DEFERRED TO `sk-code`)

The 002 research marked `react-performance.csv` as ADAPT, to extract only cross-cutting design-quality rows. On inspection, that file is entirely React and Next.js *implementation* performance (async waterfalls, bundle size, re-render control, hydration). Its only design-adjacent concerns, reduced motion, loading and skeleton states, and layout stability, are already covered, and covered better, by the `ux-guidelines.csv` Animation, Accessibility, and Responsive rows distilled above.

**Decision:** `react-performance.csv` is NOT adopted into `sk-interface-design`. React implementation performance is `sk-code`'s domain. This records the explicit deferral that requirement R9 allows, so the 002 verdict is honored without pulling stack-implementation rules into a design skill.

---

## 9. RELATED RESOURCES

- [design_principles.md](./design_principles.md) sets the aesthetic direction this reference gates.
- [design_inventory.md](./design_inventory.md) names the expected default look to deviate from.
- [`../assets/data/`](../assets/data/) holds the queryable rule sets (`ux-guidelines.csv`, `app-interface.csv`, `charts.csv`).
- [`../THIRD-PARTY-NOTICES.md`](../THIRD-PARTY-NOTICES.md) records the `ui-ux-pro-max` data provenance.
