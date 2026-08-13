---
title: "Motion.dev Scroll and Gestures"
description: "Cross-stack guidance for scroll-linked animation, in-view triggers, hover/press gestures, and repo examples."
trigger_phrases:
  - "motion dev scroll linked"
  - "motion inview viewport trigger"
  - "scroll progress animation"
  - "motion hover press gestures"
importance_tier: normal
contextType: implementation
version: 3.5.0.3
---

# Motion.dev Scroll and Gestures

Cross-stack guidance for scroll-linked animation, in-view triggers, hover/press gestures, and repo examples.

---

## 1. OVERVIEW

### Core Principle

Use `scroll()` for progress-linked motion, `inView()` for viewport-triggered motion, and gesture helpers only when they beat native event handling.

### Purpose

This reference separates Motion's scroll, viewport, and gesture APIs from local Webflow-specific implementation details while preserving repo anchors.

### When to Use

- You need to choose between scroll-linked and scroll-triggered animation.
- You are wiring viewport reveal, hover, press, or drag-adjacent behavior.
- You need local anchors for testimonial, hero video, hover, or scroll-linked patterns.

### Key Sources

- Official: https://motion.dev/docs/scroll
- Official: https://motion.dev/docs/inview
- Official: https://motion.dev/docs/hover
- Official: https://motion.dev/docs/press
- External/historical: `a_nobel_en_zn/2_javascript/slider/testimonial.js`

---

## 2. scroll() - SCROLL-LINKED ANIMATIONS

`scroll()` creates scroll-linked animations, where animation progress follows scroll progress. It accepts a callback receiving progress or an animation returned from `animate()` (Source: https://motion.dev/docs/scroll).

```js
import { animate, scroll } from "motion";

const animation = animate(".progress-bar", { scaleX: [0, 1] }, { ease: "linear" });
scroll(animation);
```

The docs distinguish scroll-linked animation from scroll-triggered animation: use `scroll()` when values should follow scroll progress, and `inView()` when an animation should start/stop as an element enters or leaves the viewport (Source: https://motion.dev/docs/scroll, https://motion.dev/docs/inview).

Useful options include `axis: "x"`, `container`, `target`, and `offset` for controlling which scroll axis/container/target drives progress (Source: https://motion.dev/docs/scroll).

## 3. inView() - VIEWPORT ENTRY/EXIT TRIGGERS

`inView()` detects when elements enter and leave the viewport. It accepts a selector, `Element`, or array of elements, and its callback receives the matched element plus `IntersectionObserverEntry` information (Source: https://motion.dev/docs/inview).

```js
import { animate, inView } from "motion";

const stop = inView("[data-reveal]", (element) => {
  const animation = animate(element, { opacity: [0, 1], y: [12, 0] }, { duration: 0.35 });

  return () => animation.stop();
}, { amount: 0.3 });
```

`inView()` is built on Intersection Observer, and the docs describe `root`, `margin`, and `amount` options for viewport control (Source: https://motion.dev/docs/inview).

## 4. GESTURES (drag, hover, tap, focus)

For vanilla JavaScript, current Motion docs expose gesture/event helpers including `hover()` and `press()` (Sources: https://motion.dev/docs/hover, https://motion.dev/docs/press).

- `hover()` detects real hover start/end and filters legacy touch-emulated hover events; it accepts selectors or elements and returns a cancel function (Source: https://motion.dev/docs/hover).
- `press()` detects press start/end/cancel, filters secondary pointer events, and makes press-bound elements keyboard accessible via focus and Enter (Source: https://motion.dev/docs/press).

```js
import { animate, hover, press } from "motion";

hover(".card", (element) => {
  const animation = animate(element, { scale: 1.03 }, { duration: 0.2 });
  return () => {
    animation.stop();
    animate(element, { scale: 1 }, { duration: 0.18 });
  };
});

press("button", (element) => {
  animate(element, { scale: 0.96 }, { duration: 0.08 });
  return () => animate(element, { scale: 1 }, { duration: 0.12 });
});
```

Drag behavior in the current repo is implemented manually with Pointer Events plus `motionValue()` and `animate(..., { type: "inertia" })`, not via a vanilla `drag` helper. Cite the local implementation before copying that pattern (External/historical example: `a_nobel_en_zn/2_javascript/slider/testimonial.js`; Motion animation options: https://motion.dev/docs/animate).

---

## 5. EXTERNAL/HISTORICAL EXAMPLES

### Testimonial drag inertia

External/historical example `a_nobel_en_zn/2_javascript/slider/testimonial.js`:
- dynamically imports Motion from a pinned jsDelivr ESM URL when `window.Motion.animate` or `window.Motion.motionValue` is missing,
- uses `motionValue(0)` for loop position,
- tracks pointer samples for velocity,
- releases into `animate_fn(position, position.get(), { type: "inertia", velocity, modifyTarget })`,
- respects `prefers-reduced-motion` by forcing near-instant step duration in the click/snap path.

### Play-on-scroll and scroll-linked video

External/historical example `a_nobel_en_zn/2_javascript/hero/hero_video_scroll.js` uses `window.Motion.scroll` when available and falls back when Motion is missing.

### Play-on-hover and hover patterns

External/historical examples `a_nobel_en_zn/2_javascript/video/video_hls_background_play_on_hover.js`, `a_nobel_en_zn/2_javascript/molecules/link_grid.js`, and `a_nobel_en_zn/2_javascript/molecules/link_hero.js` use pointer/hover guards and native events plus `window.Motion.animate` for hover animations.

---

## 6. REFERENCES AND RELATED RESOURCES

- Scroll-linked animation: https://motion.dev/docs/scroll
- Viewport-triggered `inView()`: https://motion.dev/docs/inview
- Hover helper: https://motion.dev/docs/hover
- Press helper: https://motion.dev/docs/press
- Core animation controls/options used by local drag inertia: https://motion.dev/docs/animate
- External/historical drag inertia implementation: `a_nobel_en_zn/2_javascript/slider/testimonial.js`
- External/historical scroll-linked/video anchor: `a_nobel_en_zn/2_javascript/hero/hero_video_scroll.js`
- External/historical hover/video anchor: `a_nobel_en_zn/2_javascript/video/video_hls_background_play_on_hover.js`
- External/historical hover animation anchors: `a_nobel_en_zn/2_javascript/molecules/link_grid.js`, `a_nobel_en_zn/2_javascript/molecules/link_hero.js`
