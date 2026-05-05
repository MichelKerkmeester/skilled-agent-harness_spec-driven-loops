---
title: "Motion.dev Install Card"
description: "Quick copy-paste install, import, version-pin, and verification reference for Motion.dev."
---

# Motion.dev Install Card

## CDN snippet

Pinned examples in this card use `12.38.0`, the latest stable package version observed during authoring on 2026-05-05. Recheck the package before future upgrades; never copy `@latest` into production snippets. Motion's quick start recommends replacing `latest` with a concrete version (Source: https://motion.dev/docs/quick-start; version cross-check: https://motion.dev/).

```html
<script src="https://cdn.jsdelivr.net/npm/motion@12.38.0/dist/motion.js"></script>
<script>
  console.log(window.Motion?.animate);
</script>
```

ESM CDN:

```html
<script type="module">
  import { animate, inView, scroll, motionValue } from "https://cdn.jsdelivr.net/npm/motion@12.38.0/+esm";

  window.Motion = { ...(window.Motion || {}), animate, inView, scroll, motionValue };
  window.dispatchEvent(new CustomEvent("motion:ready"));
</script>
```

## npm install snippet

```bash
npm install motion
```

```js
import { animate, inView, scroll } from "motion";
```

## ES module import patterns

Hybrid import:

```js
import { animate, inView, motionValue, scroll } from "motion";
```

Mini import for smaller HTML/SVG style animations:

```js
import { animate as animateMini } from "motion/mini";
```

Dynamic CDN ESM pattern, matching the repo's Webflow-friendly approach:

```js
const motion = await import("https://cdn.jsdelivr.net/npm/motion@12.38.0/+esm");
window.Motion = { ...(window.Motion || {}), ...motion };
```

## Version-pin guidance

- Pin Motion CDN URLs to an exact version.
- Do not use `@latest` in production or reusable snippets.
- Record the version in the owning reference or loader.
- Re-run MR-002 from the manual testing playbook after changing the pinned version.

## Verification snippet

CDN global:

```js
console.log(window.Motion?.animate);
```

ES module:

```js
import { animate } from "motion";
console.log(animate);
```

## Citations

- Install modes and version-pin recommendation: https://motion.dev/docs/quick-start
- Mini/hybrid import distinction: https://motion.dev/docs/animate
- Latest-version authoring cross-check: https://motion.dev/
- Local ESM import pattern: `a_nobel_en_zn/2_javascript/slider/testimonial.js`
- Local `window.Motion` pattern: `a_nobel_en_zn/2_javascript/navigation/nav_dropdown.js`
