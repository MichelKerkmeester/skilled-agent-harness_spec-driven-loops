---
title: Performance And Reduced Motion
description: Animation performance, compositor safety, FLIP, scroll motion, layers, blur/filter bounds, and reduced-motion alternatives.
trigger_phrases:
  - "motion performance"
  - "reduced motion"
  - "animation jank"
  - "FLIP animation"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Performance And Reduced Motion

Motion that janks, drains battery, or ignores user preference is not polish. It is a defect.

---

## 1. OVERVIEW

### Purpose

Keep motion smooth, battery-safe, and respectful of user preference. This reference covers rendering cost, the critical never patterns, the FLIP technique, scroll motion, blur and layer bounds, reduced-motion alternatives, and the checks that confirm performance before claiming it.

### When to Use

- Choosing properties that stay on the compositor and avoid layout thrash.
- Implementing layout-like transitions via FLIP or driving scroll-linked motion safely.
- Bounding blur, filters, and promoted layers to protect memory and frame rate.
- Providing a reduced-motion path that still communicates state, and verifying it.

---

## 2. RENDERING COST

| Rendering step | Examples | Guidance |
| --- | --- | --- |
| Composite | `transform`, `opacity` | Default for reliable motion. |
| Paint | color, border, shadow, filter, mask, image | Allowed for small, bounded, short-lived effects. |
| Layout | width, height, top, left, margin, flow changes | Avoid continuous animation; use FLIP or structural alternatives. |

## 3. CRITICAL NEVER PATTERNS

- Do not interleave layout reads and writes in the same frame.
- Do not drive animation from `scrollTop`, `scrollY`, or raw scroll events.
- Do not run `requestAnimationFrame` loops without a stop condition.
- Do not mix multiple animation systems inside the same interaction surface.
- Do not add `will-change` everywhere; use it temporarily and surgically, only on compositable properties (`transform`, `opacity`, `filter`), and never `will-change: all`.
- Never use `transition: all`. Name the exact properties instead, for example `transition-property: transform, opacity`. `transition: all` animates unexpected properties and can trigger layout or paint work you never intended.

## 4. FLIP PATTERN

For layout-like transitions:
1. Measure the first geometry.
2. Apply the layout change.
3. Measure the last geometry.
4. Invert with transform.
5. Play transform back to zero.

This makes the user perceive layout motion while the animation itself stays compositor-friendly.

## 5. SCROLL MOTION

- Use IntersectionObserver for visibility and pausing.
- Use Scroll or View Timelines when the platform supports them.
- Unobserve one-shot reveals after they run.
- Avoid default fade-and-rise section reveals across an entire page.
- Pause loops when off-screen.

## 6. BLUR, FILTERS, AND LAYERS

- Keep blur small, typically `<= 8px`, and short-lived.
- Avoid continuous blur on large surfaces.
- Isolate expensive effects with containment when possible.
- Limit promoted layers; too many layers consume memory and can reduce performance.

## 7. REDUCED MOTION

Reduced motion does not mean no state feedback. Replace movement with instant state changes, opacity shifts, color/focus changes, or static progress cues.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

For React motion, use `useReducedMotion()` and swap to `{ duration: 0 }` or a non-motion state.

## 8. VERIFICATION

- Test on the lowest target device, not only desktop Chrome.
- Confirm no interaction is blocked during motion.
- Confirm loops pause off-screen.
- Confirm reduced-motion path communicates the same state.
- Measure before claiming performance improved.
