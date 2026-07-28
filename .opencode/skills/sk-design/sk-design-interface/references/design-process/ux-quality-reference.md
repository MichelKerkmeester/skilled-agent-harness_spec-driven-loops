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
version: 1.5.0.5
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
- When `design-principles.md` has decided what the interface is and you need to confirm it does not break.

### Key Sources

- [design_principles.md](./design-principles.md) decides what the interface is. This reference confirms it does not break.
- This is the authored quality floor for the skill. The rules below are the distilled accessibility, motion, touch, responsive, forms, and data-visualization facts an interface must clear, kept here as paraphrased non-copyrightable facts rather than as shipped data.

---

## 2. ACCESSIBILITY (HARD FLOOR)

- **Color contrast** meets WCAG AA: body text 4.5:1, large text and UI affordances 3:1. Verify, do not eyeball.
- **Never encode meaning in color alone.** Pair color with text, icon, or pattern (error states, chart series, status).
- **Every image has alt text.** Decorative images get empty `alt=""`, not a missing attribute.
- **Interactive elements expose accessible names** (ARIA label or visible label). Icon-only buttons MUST set an accessible label.
- **Full keyboard operability** with a visible focus ring on every focusable element. Never remove focus outlines without replacing them.
- **Focus rings use `:focus-visible`, not raw `:focus`.** Add `outline-offset` so the ring is legible outside the control edge, and verify the ring reaches at least 3:1 contrast against the adjacent background.
- **Form controls have real labels** (not placeholder-as-label). Errors are announced, specific, and tied to the field.

---

## 3. MOTION (RESPECT THE USER'S SETTING)

- **Honor `prefers-reduced-motion`.** Drop or reduce non-essential animation. Never gate functionality behind motion.
- **No excessive or scattered motion.** Prefer one orchestrated moment over many competing ones. This is also a `design-principles.md` rule.
- **Loading states are explicit** (skeleton or spinner), not a frozen or empty screen.

---

## 4. TOUCH AND INPUT

- **Touch targets at least 44x44 px** with adequate spacing. Do not rely on hover for primary actions on touch devices.
- **Interactive areas are touch-friendly** on small viewports (spacing, hit area, no tiny tap targets).

### Interactive State Table

Every interactive element specifies all routine states, even when a state is visually quiet. Missing states are product defects, not polish items.

| State | Requirement |
| ----- | ----------- |
| Default | The resting control is recognizable, named, and meets contrast. |
| Hover | Pointer feedback clarifies affordance without being the only signal. |
| Focus | Keyboard focus is visible with `:focus-visible`, offset, and 3:1 ring contrast. |
| Active | Pressed or selected feedback confirms the action is being taken. |
| Disabled | Unavailable controls explain or imply why, and never rely on opacity alone below contrast. |
| Loading | The control or region shows progress and prevents duplicate action when needed. |
| Error | The failed element gets nearby, specific recovery copy tied to the cause. |
| Success | The completed action gets brief confirmation in the same vocabulary as the trigger. |

---

## 5. RESPONSIVE

- **Set the viewport meta tag.** Design works from mobile up.
- **No unintended horizontal scroll.** Content reflows. It does not force sideways panning.
- **Readable font size** on mobile (body ~16px floor). Never ship sub-legible text to fit a layout.

---

## 6. FORMS AND FEEDBACK

- **Labels are visible and persistent.** Submit and validation feedback is immediate and specific.
- **Errors say what went wrong and how to fix it**, next to the field, not only in a top banner.

### Compact Product Flow Floor

Product UI flows fail if any routine state is missing or displaced. Forms need visible labels, validation, error recovery, and a clear next step after submit. Search needs loading, empty, zero-result, and success states, with the query preserved so the user can recover. Navigation needs a current-location signal and a reliable back path. Feedback and errors sit near the cause, not in a detached global message unless the whole page is affected. First-run and empty states explain what will appear there, guide the first useful action, and expose a clear CTA.

### First-Value Onboarding Floor

Onboarding succeeds when the user reaches the first useful outcome quickly, not when the tour is complete.

- **Skip and dismissal are always available.** A first-run prompt, checklist, coach mark, or setup guide must be dismissible without blocking the core product.
- **Teach at the point of use.** Prefer contextual, just-in-time hints beside the thing the user is doing. Do not front-load a wall of tour tooltips before the user has a reason to care.
- **Optimize for first value.** The first-run path should get the user to a saved object, useful preview, connected account, answered question, or equivalent concrete outcome as fast as the product honestly allows.

---

## 7. DATA VISUALIZATION

- **Match the chart to the data shape** (trend to line, compare to bar, parts-of-whole to stacked or waffle). Do not force a default chart.
- **Charts meet the a11y grade.** Differentiate series by more than color (line style, pattern, direct labels), and provide a data-table or CSV fallback.
- **Respect data-volume thresholds** (SVG vs canvas vs aggregation) so the chart stays readable and performant.

---

## 8. SCOPE NOTE: REACT IMPLEMENTATION PERFORMANCE

React and Next.js implementation performance (async waterfalls, bundle size, re-render control, hydration) is out of scope for this floor. Its only design-adjacent concerns, reduced motion, loading and skeleton states, and layout stability, are already covered, and covered better, by the Motion, Accessibility, and Responsive rules above.

**Decision:** React implementation performance is `sk-code`'s domain and is not pulled into this design floor.

---

## 9. RELATED RESOURCES

- [design_principles.md](./design-principles.md) sets the aesthetic direction this reference gates.
- [design_inventory.md](../design-grounding/design-inventory.md) names the expected default look to deviate from.
