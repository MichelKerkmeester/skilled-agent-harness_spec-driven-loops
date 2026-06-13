# UX Quality Reference

The objective quality floor every interface must clear, regardless of aesthetic direction. These are not style choices: they are the rules that, when broken, make an interface measurably worse for real users. Distilled from the CRITICAL and HIGH severity rows of the adopted data sets; the full, queryable rule sets live in [`../assets/data/`](../assets/data/) (`ux-guidelines.csv`, `app-interface.csv`, `charts.csv`).

> Use this AFTER the design direction is set, as the pass/fail gate. `design_principles.md` decides what the interface *is*; this reference confirms it does not break. When a rule and an aesthetic choice collide, the rule wins.

Data provenance: adopted from the MIT-licensed `ui-ux-pro-max` repo. See [`../THIRD-PARTY-NOTICES.md`](../THIRD-PARTY-NOTICES.md).

---

## 1. Accessibility (hard floor)

- **Color contrast** meets WCAG AA: body text 4.5:1, large text and UI affordances 3:1. Verify, do not eyeball.
- **Never encode meaning in color alone.** Pair color with text, icon, or pattern (error states, chart series, status).
- **Every image has alt text**; decorative images get empty `alt=""`, not a missing attribute.
- **Interactive elements expose accessible names** (ARIA label or visible label). Icon-only buttons MUST set an accessible label.
- **Full keyboard operability** with a visible focus ring on every focusable element. Never remove focus outlines without replacing them.
- **Form controls have real labels** (not placeholder-as-label). Errors are announced, specific, and tied to the field.

## 2. Motion (respect the user's setting)

- **Honor `prefers-reduced-motion`**: drop or reduce non-essential animation; never gate functionality behind motion.
- **No excessive or scattered motion.** Prefer one orchestrated moment over many competing ones (this is also a `design_principles.md` rule).
- **Loading states are explicit** (skeleton or spinner), not a frozen or empty screen.

## 3. Touch & input

- **Touch targets ≥ 44x44 px** with adequate spacing; do not rely on hover for primary actions on touch devices.
- **Interactive areas are touch-friendly** on small viewports (spacing, hit area, no tiny tap targets).

## 4. Responsive

- **Set the viewport meta** tag; design works from mobile up.
- **No unintended horizontal scroll.** Content reflows; it does not force sideways panning.
- **Readable font size** on mobile (body ~16px floor); never ship sub-legible text to fit a layout.

## 5. Forms & feedback

- **Labels are visible and persistent**; submit/validation feedback is immediate and specific.
- **Errors say what went wrong and how to fix it**, next to the field, not only in a top banner.

## 6. Data visualization (`charts.csv`)

- **Match the chart to the data shape** (trend → line, compare → bar, parts-of-whole → stacked/waffle); do not force a default chart.
- **Charts meet the a11y grade**: differentiate series by more than color (line style, pattern, direct labels), and provide a data-table or CSV fallback.
- **Respect data-volume thresholds** (SVG vs canvas vs aggregation) so the chart stays readable and performant.

---

## Scope note: `react-performance.csv` (deferred to `sk-code`)

The 002 research marked `react-performance.csv` as ADAPT — extract only cross-cutting design-quality rows. On inspection, that file is entirely React/Next.js *implementation* performance (async waterfalls, bundle size, re-render control, hydration). Its only design-adjacent concerns — reduced motion, loading/skeleton states, layout stability — are already covered, and covered better, by the `ux-guidelines.csv` Animation, Accessibility, and Responsive rows distilled above.

**Decision:** `react-performance.csv` is NOT adopted into `sk-interface-design`. React implementation performance is `sk-code`'s domain. This records the explicit deferral that requirement R9 allows, so the 002 verdict is honored without pulling stack-implementation rules into a design skill.
