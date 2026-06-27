---
title: Accessibility And Performance
description: Accessibility, WCAG, keyboard, focus, semantics, forms, motion performance, rendering, loading, and measurement checks.
trigger_phrases:
  - "accessibility performance"
  - "WCAG audit"
  - "keyboard focus audit"
  - "motion performance audit"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Accessibility And Performance

Accessibility and performance are release gates. A beautiful UI that blocks keyboard users or janks on target devices is not ready.

## 1. Accessibility Priority Order

| Priority | Category | Checks |
| --- | --- | --- |
| 1 | Accessible names | interactive controls named; icon buttons use `aria-label`; decorative icons hidden |
| 2 | Keyboard access | all controls reachable; visible focus; no `tabindex > 0`; Escape closes overlays |
| 3 | Focus and dialogs | trap focus in modals; restore focus to trigger; initial focus placed intentionally |
| 4 | Semantics | native elements first; headings not skipped; tables use headers; lists use lists |
| 5 | Forms and errors | labels, `aria-describedby`, `aria-invalid`, required indicators, helpful errors |
| 6 | Announcements | loading/status/errors use live regions or status text where needed |
| 7 | Contrast and states | text/icon contrast, focus contrast, no color-only meaning |
| 8 | Media and motion | alt text, captions when relevant, reduced motion, no sound autoplay |

Prefer native HTML before adding ARIA. Do not add ARIA to compensate for avoidable custom controls.

### Modality Coverage

Before a release-ready accessibility verdict, cover the main modalities:

| Modality | Minimum audit pass |
| --- | --- |
| Keyboard | Reach every control, see focus, operate menus/dialogs, and escape overlays. |
| Screen reader | Names, roles, values, headings, regions, live updates, and error relationships make sense in reading order. |
| Zoom and reflow | 200% zoom and narrow widths preserve content, controls, and reading order without two-axis scrolling. |
| High contrast | Text, icons, focus indicators, borders, and selected states survive forced-color or high-contrast themes. |
| Reduced motion | Motion-heavy feedback has a reduced path without hiding state changes or progress. |

A11y findings can be grouped under POUR when useful: Perceivable, Operable, Understandable, Robust.

### Concrete Thresholds (verify, do not eyeball)

These are the pass/fail numbers behind the contrast and touch checks. Cite a measured ratio or size in the finding; do not file a contrast or touch P0-P3 on a guess.

| Check | WCAG AA (floor) | WCAG AAA |
| --- | --- | --- |
| Body text contrast | 4.5:1 | 7:1 |
| Large text contrast (>=18.66px bold, or >=24px) | 3:1 | 4.5:1 |
| UI components and graphical affordances (icons, focus ring, control borders) | 3:1 | n/a |
| Touch target size | 44x44px (24x24px CSS is the WCAG 2.2 minimum) | n/a |

## 2. Accessibility Findings

For each issue, report:
- Exact element or snippet.
- Why it matters to users.
- Minimal fix.
- Severity based on user impact.

Common fixes:

```html
<button aria-label="Close"><svg aria-hidden="true">...</svg></button>
<input id="email" aria-describedby="email-error" aria-invalid="true" />
<span id="email-error">Email addresses need an @ symbol.</span>
```

## 3. Performance Checks

Measure before and after when possible.

| Area | Checks |
| --- | --- |
| Core Web Vitals | LCP under 2.5s, INP under 200ms, CLS under 0.1 when applicable |
| Loading | image formats/sizes, lazy loading, code splitting, font display, critical resources |
| Rendering | layout thrashing, DOM size, containment, content visibility, virtualized long lists |
| Motion | transform/opacity default, bounded paint, no continuous layout animation |
| Network | request count, payload size, caching, compression, slow-connection behavior |

## 4. Motion Performance

Critical failures:
- Interleaved layout reads and writes.
- Scroll event polling for animation.
- Endless `requestAnimationFrame` loops.
- Large continuous blur/filter animation.
- `will-change` applied broadly or permanently.
- `transition: all` or Tailwind's bare `transition` shorthand on interaction surfaces; both are static-risk findings because they map to broad property animation.
- Mixing animation libraries inside one interaction surface.

Recommended fixes:
- Use FLIP for layout-like motion.
- Use IntersectionObserver for visibility and pausing.
- Scope paint-heavy effects to small surfaces.
- Name exact transition properties instead of using all-property shorthands.
- Pause off-screen loops.
- Downgrade technique before deleting useful state feedback.

## 5. Performance Evidence

Use real metrics when available. If metrics are unavailable, label findings as static-risk findings and state the measurement needed to confirm.
