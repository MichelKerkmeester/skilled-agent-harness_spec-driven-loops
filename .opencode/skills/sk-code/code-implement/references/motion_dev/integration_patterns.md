---
title: "Motion.dev Integration Patterns"
description: "Stack-aware integration patterns for CDN, ES modules, Webflow, non-Webflow stacks, and initialization safeguards."
trigger_phrases:
  - "motion dev integration patterns"
  - "motion cdn script tag"
  - "motion es module import"
  - "motion webflow integration"
  - "animation initialization safeguards"
importance_tier: normal
contextType: implementation
version: 3.5.0.5
---

# Motion.dev Integration Patterns

Stack-aware integration patterns for CDN, ES modules, Webflow, non-Webflow stacks, and initialization safeguards.

---

## 1. OVERVIEW

### Core Principle

Load Motion through the stack's native dependency path, and guard DOM animation until the runtime and targets are ready.

### Purpose

This reference centralizes install and initialization patterns so Webflow-specific references can link here for generic Motion details.

### When to Use

- You need CDN, ESM, or npm import examples for Motion.
- You are adapting Motion to Webflow, bundled, or SSR-style client code.
- You need initialization guards for optional or late-loaded Motion.

### Key Sources

- Official: https://motion.dev/docs/quick-start
- Official: https://motion.dev/docs/animate
- In-repo: `a_nobel_en_zn/2_javascript/navigation/nav_dropdown.js`
- In-repo: `a_nobel_en_zn/2_javascript/slider/testimonial.js`

---

## 2. CDN SCRIPT TAG

Motion's quick start documents script-tag usage for basic HTML pages and no-code tools, including Webflow, and recommends pinning a concrete version instead of `@latest` (Source: https://motion.dev/docs/quick-start).

```html
<script src="https://cdn.jsdelivr.net/npm/motion@12.38.0/dist/motion.js"></script>
<script>
  const { animate } = window.Motion || {};
  if (typeof animate === "function") {
    animate(".box", { opacity: [0, 1] });
  }
</script>
```

Local anchor: `a_nobel_en_zn/2_javascript/navigation/nav_dropdown.js` destructures `animate` from `window.Motion || {}` and exits with a warning if it is unavailable.

## 3. NPM / ES MODULES

Bundled projects should use package imports so the bundler can resolve dependencies and tree-shake where possible (Source: https://motion.dev/docs/quick-start, https://motion.dev/docs/animate).

```bash
npm install motion
```

```js
import { animate, inView, motionValue, scroll } from "motion";
```

Local anchor: `a_nobel_en_zn/2_javascript/slider/testimonial.js` uses a dynamic import from a pinned CDN ESM URL as a Webflow-friendly fallback, then patches `window.Motion` with `animate`, `inView`, `scroll`, and `motionValue`.

## 4. WEBFLOW-CDN-SPECIFIC NOTES

For Webflow, link to the existing Webflow references rather than duplicating all Webflow operational detail here:
- `.opencode/skills/sk-code/references/webflow/implementation/animation_workflows.md`
- `.opencode/skills/sk-code/references/webflow/implementation/performance_patterns.md`
- `.opencode/skills/sk-code/references/webflow/javascript/quality_standards.md`

Webflow patterns in this repo include:
- `window.Webflow.push(start)` when available,
- global init flags such as `__linkGridCdnInit`,
- `DOMContentLoaded` fallback,
- `motion:ready` listener and timeout fallback,
- guarded `window.Motion || {}` reads.

Source anchors: `a_nobel_en_zn/2_javascript/molecules/link_grid.js`, `a_nobel_en_zn/2_javascript/molecules/link_hero.js`, `a_nobel_en_zn/2_javascript/navigation/nav_dropdown.js`.

## 5. NON-WEBFLOW STACKS

Use the stack's native client-only lifecycle:
- Bundled SPA/MPA: import from `"motion"` inside client-side modules (Source: https://motion.dev/docs/quick-start).
- SSR/hydrated UI: defer DOM-targeting `animate()`, `scroll()`, `hover()`, and `inView()` until the client has `window` and DOM nodes available. This follows the browser API requirements implied by those functions accepting DOM selectors/elements (Sources: https://motion.dev/docs/animate, https://motion.dev/docs/scroll, https://motion.dev/docs/inview, https://motion.dev/docs/hover).
- Bundle-sensitive UI: use `motion/mini` when only mini-supported HTML/SVG style animation is needed (Source: https://motion.dev/docs/animate).

## 6. INITIALIZATION SAFEGUARDS

### CDN-safe guard

```js
(() => {
  "use strict";

  const INIT_FLAG = "__motionComponentCdnInit";

  function init_component() {
    const { animate } = window.Motion || {};
    if (typeof animate !== "function") return;

    animate("[data-motion-component]", { opacity: [0, 1] }, { duration: 0.25 });
  }

  function start() {
    if (window[INIT_FLAG]) return;
    window[INIT_FLAG] = true;

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init_component, { once: true });
    } else {
      requestAnimationFrame(init_component);
    }
  }

  if (window.Webflow?.push) window.Webflow.push(start);
  else start();
})();
```

This mirrors local Webflow safety patterns and keeps Motion optional for non-critical interactions (Repo: `a_nobel_en_zn/2_javascript/navigation/nav_dropdown.js`, `.opencode/skills/sk-code/references/webflow/javascript/quality_standards.md`).

### ESM bootstrap

```js
import { animate, inView, motionValue, scroll } from "motion";

export function init_motion_component(root = document) {
  const target = root.querySelector("[data-motion-component]");
  if (!target) return null;

  return animate(target, { opacity: [0, 1] }, { duration: 0.25 });
}
```

## 7. REFERENCES AND RELATED RESOURCES

- Official install and script-tag guidance: https://motion.dev/docs/quick-start
- Official mini/hybrid and target guidance: https://motion.dev/docs/animate
- Official scroll/inView/hover APIs: https://motion.dev/docs/scroll, https://motion.dev/docs/inview, https://motion.dev/docs/hover
- Local CDN-global dropdown pattern: `a_nobel_en_zn/2_javascript/navigation/nav_dropdown.js`
- Local ESM/dynamic import pattern: `a_nobel_en_zn/2_javascript/slider/testimonial.js`
- Local Webflow init patterns: `a_nobel_en_zn/2_javascript/molecules/link_grid.js`, `a_nobel_en_zn/2_javascript/molecules/link_hero.js`
