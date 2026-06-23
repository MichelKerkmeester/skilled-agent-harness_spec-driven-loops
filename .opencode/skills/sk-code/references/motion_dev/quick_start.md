---
title: "Motion.dev Quick Start"
description: "Cross-stack entry point for installing Motion, choosing import modes, and deciding when sk-code should recommend Motion.dev."
trigger_phrases:
  - "motion dev quick start"
  - "install motion dev"
  - "motion import modes"
  - "when to recommend motion"
importance_tier: normal
contextType: implementation
version: 3.5.0.5
---

# Motion.dev Quick Start

Cross-stack entry point for installing Motion, choosing import modes, and deciding when sk-code should recommend Motion.dev.

---

## 1. OVERVIEW

### Core Principle

Choose Motion when JavaScript-owned animation control earns its dependency; keep simple state transitions in CSS.

### Purpose

Motion is a web animation library for JavaScript, React, and Vue. Its JavaScript docs describe a hybrid engine that can animate HTML/CSS, SVG, WebGL, independent transforms, CSS variables, objects, and strings/colors/numbers, with browser acceleration when available (Source: https://motion.dev/docs/quick-start, https://motion.dev/docs/animate).

The cross-stack value for sk-code is that Motion can be used in Webflow via CDN globals, in bundled apps via `npm install motion`, and in future stack-specific references without treating it as a Webflow-only dependency (Source: https://motion.dev/docs/quick-start; in-repo Webflow examples: `a_nobel_en_zn/2_javascript/navigation/nav_dropdown.js`, `a_nobel_en_zn/2_javascript/slider/testimonial.js`).

### When to Use

- You need the fastest orientation to Motion install modes and core APIs.
- You are deciding whether Motion belongs in a Webflow, bundled, or future stack-specific workflow.
- You need cross-stack pointers before loading deeper Motion references.

### Key Sources

- Official: https://motion.dev/docs/quick-start
- Official: https://motion.dev/docs/animate
- In-repo: `a_nobel_en_zn/2_javascript/navigation/nav_dropdown.js`
- In-repo: `a_nobel_en_zn/2_javascript/slider/testimonial.js`

## 2. INSTALLATION & IMPORT MODES

### CDN module import

Use a pinned version, not `@latest`. Motion's quick-start page shows script-tag usage and explicitly recommends replacing `latest` with a concrete version (Source: https://motion.dev/docs/quick-start).

```html
<script type="module">
  import { animate, inView, scroll } from "https://cdn.jsdelivr.net/npm/motion@12.38.0/+esm";

  window.Motion = { ...(window.Motion || {}), animate, inView, scroll };
  window.dispatchEvent(new CustomEvent("motion:ready"));
</script>
```

### CDN global bundle

Legacy/global loading exposes `Motion` on `window`; this matches the guarded Webflow pattern used by `nav_dropdown.js` (Source: https://motion.dev/docs/quick-start; repo: `a_nobel_en_zn/2_javascript/navigation/nav_dropdown.js`).

```html
<script src="https://cdn.jsdelivr.net/npm/motion@12.38.0/dist/motion.js"></script>
<script>
  const { animate, scroll } = window.Motion || {};
</script>
```

### npm / ES modules

Bundled stacks should prefer the package import shown by Motion's quick start (Source: https://motion.dev/docs/quick-start).

```bash
npm install motion
```

```js
import { animate, inView, motionValue, scroll } from "motion";
```

The current repo also uses a dynamic CDN ESM fallback in `testimonial.js`, importing from a pinned jsDelivr URL and then patching `window.Motion` with `animate`, `inView`, `scroll`, and `motionValue` (Repo: `a_nobel_en_zn/2_javascript/slider/testimonial.js`).

## 3. CORE API SURFACE

| API | Use | Source |
|-----|-----|--------|
| `animate` | Create and control animations for selectors, elements, values, objects, sequences, and more | https://motion.dev/docs/animate |
| `timeline` / sequences | Motion's sequence form is handled through `animate(sequence, options)` with segment timing | https://motion.dev/docs/animate |
| `inView` | Trigger callbacks when elements enter/leave the viewport via Intersection Observer | https://motion.dev/docs/inview |
| `scroll` | Bind animation progress or callbacks to scroll progress | https://motion.dev/docs/scroll |
| `spring` | Generate spring easing/animation behavior, often with mini animate | https://motion.dev/docs/spring |
| `motionValue` | Store and observe animatable values; local slider code uses it for drag position state | https://motion.dev/docs/quick-start, `a_nobel_en_zn/2_javascript/slider/testimonial.js` |
| `animateMini` / `motion/mini` | Tree-shakable mini `animate` for HTML/SVG style animations | https://motion.dev/docs/animate |

## 4. WHEN TO USE MOTION.DEV

Use Motion when the current task needs programmatic control, interruptible animations, sequence timing, scroll-linked animation, viewport-triggered behavior, or JS-owned motion values (Sources: https://motion.dev/docs/animate, https://motion.dev/docs/scroll, https://motion.dev/docs/inview).

Prefer CSS first for simple hover/focus states, one-off transitions, and static keyframes that do not need JS state or sequencing. Existing Webflow guidance already encodes this as "CSS first; Motion.dev when you need programmatic control" (Repo: `.opencode/skills/sk-code/references/webflow/implementation/animation_workflows.md`).

## 5. CROSS-STACK NOTES

This directory is intentionally a peer to `webflow/`. Webflow-specific notes live in `../webflow/implementation/animation_workflows.md` and `../webflow/implementation/performance_patterns.md`; generic Motion API guidance lives here.

- Webflow/no-code pages often use CDN globals, `window.Motion`, `motion:ready`, `window.Webflow.push`, and DOM-ready guards (Repo: `a_nobel_en_zn/2_javascript/navigation/nav_dropdown.js`, `a_nobel_en_zn/2_javascript/molecules/link_grid.js`).
- Bundled apps should prefer package imports so bundlers can tree-shake and type-check imports (Source: https://motion.dev/docs/quick-start).
- SSR stacks should avoid touching `window`, `document`, or DOM targets until the client runtime is active; this is a general DOM constraint, not a Motion-specific export (Source for import mode: https://motion.dev/docs/quick-start).

See [integration_patterns.md](./integration_patterns.md).

## 6. REFERENCES AND RELATED RESOURCES

- Official quick start and install modes: https://motion.dev/docs/quick-start
- Core animate API and mini/hybrid distinction: https://motion.dev/docs/animate
- Timeline/sequence behavior: https://motion.dev/docs/animate
- Scroll-linked animations: https://motion.dev/docs/scroll
- Viewport triggers: https://motion.dev/docs/inview
- Spring utility: https://motion.dev/docs/spring
- In-repo CDN global pattern: `a_nobel_en_zn/2_javascript/navigation/nav_dropdown.js`
- In-repo ESM/dynamic import pattern: `a_nobel_en_zn/2_javascript/slider/testimonial.js`
