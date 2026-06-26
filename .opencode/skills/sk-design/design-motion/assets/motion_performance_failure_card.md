---
title: Motion Performance Failure Card
description: A build-side card of the motion patterns that drop frames, each with its failure signature and the cheaper mechanism to replace it with before shipping.
trigger_phrases:
  - "motion performance failure"
  - "animation jank card"
  - "dropped frames motion"
  - "motion performance check"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Motion Performance Failure Card

Check a motion build against this card before handing it off. Each row is a pattern that drops frames, drains battery or stutters under load. This is a build-side card for catching the failure while you write the motion, not a release audit. Severity scoring and findings reports for motion performance belong to the `audit` mode. The deeper technique guidance lives in `references/performance_reduced_motion.md`.

Use it like a pre-flight: read each failure signature, check whether your build does it and apply the fix where it does. The recurring root cause is asking the browser to do layout or paint work every frame when transform and opacity would carry the same intent on the compositor.

---

## 1. THE RENDERING COST FLOOR

Three rendering steps, cheapest first. Stay as high in this list as the effect allows.

- **Composite.** `transform` and `opacity`. Runs on the compositor, skips layout and paint. The default for any motion.
- **Paint.** color, border, shadow, filter, mask, image. Acceptable only on small, isolated, short-lived surfaces.
- **Layout.** width, height, top, left, margin, flow. Never animate continuously. Use a transform or a FLIP technique instead.

---

## 2. FAILURE MODES

| Failure | Signature in the build | Why it drops frames | Fix |
|---|---|---|---|
| **Layout thrash** | Reading geometry and writing styles in the same frame, or animating `width`, `height`, `top`, `left` or margin on a meaningful surface. | Each read forces the browser to recompute layout that the previous write invalidated, so the frame stalls. | Batch all reads before writes. Animate `transform` instead of size or position. Use FLIP for layout-like motion. |
| **Scroll polling** | A `scroll` event handler that sets opacity, transform or position from `scrollTop` or `scrollY`. | The handler runs off the frame clock and forces style and layout work on every scroll tick. | Use a Scroll or View Timeline when supported, or `IntersectionObserver` for visibility and reveal. Never drive motion from raw scroll values. |
| **Endless rAF** | A `requestAnimationFrame` loop with no stop condition, or one that keeps running while off-screen. | The loop burns a frame budget forever, even when nothing is visible or changing. | Give the loop an explicit stop condition. Pause or cancel it when the element is off-screen, using `IntersectionObserver` to gate it. |
| **Mixed systems** | Two animation systems inside one interaction surface, each measuring or mutating layout, for example a library layout animation fighting a hand-rolled rAF. | The systems compete to measure and write the same layout, multiplying the per-frame cost and causing visible conflict. | Use one system per surface. Do not partially migrate APIs inside a component. Apply fixes within the existing system rather than introducing a second one. |
| **Layer promotion** | `will-change` left on permanently, set on many elements or set to `will-change: all`. | Each promoted layer consumes memory, and too many or oversized layers slow the compositor instead of helping it. | Use `will-change` temporarily and surgically, only on `transform`, `opacity` or `filter`, only when first-frame stutter is observed, then remove it after. |
| **Paint-heavy effects** | Animating color, gradient, box-shadow, mask or filter on a large container, or animating a CSS variable that drives transform or position, especially an inherited one. | Paint on a large surface repaints a large region every frame, and an inherited CSS variable recalculates styles for every child. | Keep paint animation on small, isolated elements. Update `transform` directly on the element instead of animating an inherited variable. Scope animated variables locally. |
| **Blur** | Animating `blur` continuously, on a large surface or above roughly `8px`. | Blur is one of the most expensive paint operations, and animating it every frame on a big region tanks the frame rate, worst in Safari. | Keep blur at or below `8px` and use it only for short one-time effects. Prefer opacity and translate first. Never animate blur continuously or on a large surface. |

---

## 3. PRE-HANDOFF CHECK

Tick each before handing the build to review.

- [ ] Motion uses `transform` and `opacity` by default, and any paint or layout animation is small, isolated and justified by a stated constraint.
- [ ] No reads and writes are interleaved in the same frame.
- [ ] No animation is driven from `scrollTop`, `scrollY` or raw scroll events.
- [ ] Every `requestAnimationFrame` loop has a stop condition and pauses off-screen.
- [ ] One animation system per interaction surface, with no partial migration inside a component.
- [ ] `will-change` is temporary, surgical, on compositable properties only, never `all`.
- [ ] No `transition: all`, and exact properties are named.
- [ ] Blur stays at or below `8px` and is never continuous or on a large surface.
- [ ] Performance was checked on the lowest target device, not only desktop Chrome.

A build that clears every box is ready for the `audit` mode to score. A box left unchecked is a frame-rate defect to fix before handoff, not a finding to defer.
