---
title: "Motion.dev Animate and Timelines"
description: "Core animate API, sequence/timeline patterns, animateMini guidance, and local examples."
trigger_phrases:
  - "motion dev animate api"
  - "motion dev timeline sequence"
  - "animate keyframes options"
  - "motion animatemini usage"
  - "javascript animation timeline"
importance_tier: normal
contextType: implementation
version: 3.5.0.4
---

# Motion.dev Animate and Timelines

Core animate API, sequence/timeline patterns, animateMini guidance, and local examples.

---

## 1. OVERVIEW

### Core Principle

Use `animate()` as the shared primitive for single-target animation, JavaScript-owned values, and sequence-style timelines.

### Purpose

This reference captures Motion's core JavaScript animation forms and maps them to local Webflow examples without duplicating Webflow-only operational guidance.

### When to Use

- You need selector, element, value, object, or sequence examples for `animate()`.
- You are choosing between mini and hybrid Motion imports.
- You need local examples for dropdown, slider, hover, or sequence-style animation.

### Key Sources

- Official: https://motion.dev/docs/animate
- Official: https://motion.dev/docs/animate
- In-repo: `a_nobel_en_zn/2_javascript/navigation/nav_dropdown.js`
- In-repo: `a_nobel_en_zn/2_javascript/slider/testimonial.js`

---

## 2. animate(target, keyframes, options) - value, keyframe array, segment forms

`animate()` accepts selectors or elements for HTML/SVG styles and can also animate values, objects, motion values, and sequences when using the hybrid import (Source: https://motion.dev/docs/animate).

```js
import { animate } from "motion";

animate(".card", { opacity: [0, 1], x: [24, 0] }, { duration: 0.35, ease: "easeOut" });
```

Target forms:
- CSS selector or element list for DOM/SVG animation (Source: https://motion.dev/docs/animate).
- Numeric/color/string/object values for non-DOM or render-target-specific animation (Source: https://motion.dev/docs/animate).
- Sequence arrays for timeline-style animation (Source: https://motion.dev/docs/animate).

Sequence segment form:

```js
const sequence = [
  [".panel", { opacity: [0, 1], y: [16, 0] }, { duration: 0.3 }],
  [".panel button", { opacity: [0, 1] }, { at: "-0.1", duration: 0.2 }],
];

animate(sequence);
```

## 3. animate(target, keyframes, options) - duration, easing, delay, repeat, repeatType

Motion transition options configure playback. The docs show `duration`, `delay`, `ease`, `repeat`, and per-value transition overrides; durations are expressed in seconds in Motion's API (Sources: https://motion.dev/docs/animate, https://motion.dev/docs/improvements-to-the-web-animations-api-dx).

```js
animate(
  ".badge",
  { scale: [0.9, 1], opacity: [0, 1] },
  {
    duration: 0.25,
    delay: 0.05,
    ease: [0.22, 1, 0.36, 1],
    repeat: 0,
  },
);
```

The current Webflow codebase often uses `easing` in options while official docs use `ease` in current examples. When authoring new generic snippets, prefer the official option name unless a local component pattern proves compatibility constraints (Sources: https://motion.dev/docs/animate; repo examples: `a_nobel_en_zn/2_javascript/navigation/nav_dropdown.js`, `a_nobel_en_zn/2_javascript/molecules/link_hero.js`).

## 4. Timelines (sequence, parallel, with relative/absolute positioning)

Motion's timeline-style sequencing is expressed as an array passed to `animate()`. Segment timing can be positioned:
- sequentially by array order,
- in parallel with `at: "<"`,
- relative to the previous segment end with `at: "+0.5"` or `at: "-0.2"`,
- relative to the previous segment start with `at: "<0.5"` or `at: "<-0.2"` (Source: https://motion.dev/docs/animate).

```js
const sequence = [
  [".drawer", { x: ["100%", "0%"] }, { duration: 0.35 }],
  [".drawer-backdrop", { opacity: [0, 1] }, { at: "<", duration: 0.2 }],
  [".drawer-item", { opacity: [0, 1], y: [8, 0] }, { at: "-0.05", duration: 0.2 }],
];

animate(sequence, { defaultTransition: { ease: "easeOut" } });
```

`defaultTransition` can set default segment timing, and individual segment options can override it (Source: https://motion.dev/docs/animate).

## 5. animateMini for tree-shakable bundles

Motion documents two JavaScript `animate` sizes: the mini version from `motion/mini` for HTML/SVG style animation, and the hybrid version from `motion` for independent transforms, CSS variables, SVG paths, sequences, JavaScript objects, and WebGL (Source: https://motion.dev/docs/animate).

```js
import { animate as animateMini } from "motion/mini";

animateMini(".toast", { opacity: [0, 1], transform: ["translateY(8px)", "translateY(0px)"] });
```

Use the mini import for bundle-sensitive HTML/SVG style animation. Use the hybrid import when you need independent transform axes like `x`, `y`, `rotateZ`, sequence arrays, or non-DOM values (Source: https://motion.dev/docs/animate).

## 6. In-repo examples

### `window.Motion` guarded dropdowns

`a_nobel_en_zn/2_javascript/navigation/nav_dropdown.js` reads `const { animate } = window.Motion || {};` and exits if `animate` is missing. It then animates dropdown opacity/height, button color, and icon rotation with measured heights and `onComplete` cleanup.

Representative local pattern:

```js
const { animate } = window.Motion || {};
if (!animate || typeof animate !== 'function') return;

animate(dropdown, { opacity: [0, 1], height: ["0px", `${natural_height}px`] }, {
  duration: 0.3,
  easing: ease_out,
});
```

### `motionValue`-driven slider

`a_nobel_en_zn/2_javascript/slider/testimonial.js` ensures `animate` and `motionValue` exist, dynamically imports Motion when needed, and uses a motion value as the draggable loop's position state. The drag release branch uses `type: "inertia"`, `velocity`, and `modifyTarget` to snap to the nearest slide (Repo: `a_nobel_en_zn/2_javascript/slider/testimonial.js`; Motion API surface: https://motion.dev/docs/animate).

## 7. REFERENCES AND RELATED RESOURCES

- Core `animate()` behavior, import modes, mini/hybrid distinction, options, controls, sequences, and stagger: https://motion.dev/docs/animate
- Timeline/sequence entry point: https://motion.dev/docs/animate
- WAAPI improvements and seconds-based duration note: https://motion.dev/docs/improvements-to-the-web-animations-api-dx
- In-repo dropdown pattern: `a_nobel_en_zn/2_javascript/navigation/nav_dropdown.js`
- In-repo draggable slider pattern: `a_nobel_en_zn/2_javascript/slider/testimonial.js`
- In-repo hover/card patterns: `a_nobel_en_zn/2_javascript/molecules/link_grid.js`, `a_nobel_en_zn/2_javascript/molecules/link_hero.js`
