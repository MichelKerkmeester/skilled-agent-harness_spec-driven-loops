---
title: "Motion.dev Install Card"
description: "Quick copy-paste install, import, version-pin, and verification reference for Motion.dev."
trigger_phrases:
  - "motion dev install card"
  - "motion cdn npm install"
  - "motion version pin"
  - "motion import verification"
importance_tier: normal
contextType: implementation
version: 3.5.0.3
---

# Motion.dev Install Card - Install and Import Snippets

Quick copy-paste install, import, version-pin, and verification reference for Motion.dev.

## 1. OVERVIEW

### Purpose

Provide reusable Motion install snippets for CDN, npm, ESM, and quick export verification while keeping production examples version-pinned.

### Usage

Copy the matching snippet for the target stack, replace the pinned version only after checking the current package, and rerun the related Motion manual testing scenario after upgrades.

---

## 2. CDN SNIPPET

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

## 3. NPM INSTALL SNIPPET

```bash
npm install motion
```

```js
import { animate, inView, scroll } from "motion";
```

## 4. ES MODULE IMPORT PATTERNS

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

## 5. VERSION-PIN GUIDANCE

- Pin Motion CDN URLs to an exact version.
- Do not use `@latest` in production or reusable snippets.
- Record the version in the owning reference or loader.
- Re-run MR-002 from the manual testing playbook after changing the pinned version.

## 6. VERIFICATION SNIPPET

CDN global:

```js
console.log(window.Motion?.animate);
```

ES module:

```js
import { animate } from "motion";
console.log(animate);
```

## 7. RELATED RESOURCES

- Install modes and version-pin recommendation: https://motion.dev/docs/quick-start
- Mini/hybrid import distinction: https://motion.dev/docs/animate
- Latest-version authoring cross-check: https://motion.dev/
- Local ESM import pattern: `a_nobel_en_zn/2_javascript/slider/testimonial.js`
- Local `window.Motion` pattern: `a_nobel_en_zn/2_javascript/navigation/nav_dropdown.js`
