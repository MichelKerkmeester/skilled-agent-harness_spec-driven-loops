---
title: JavaScript Minification Guide
description: Safe minification workflow for Webflow projects with verification to prevent breaking functionality.
trigger_phrases:
  - "webflow minification guide"
  - "terser minification workflow"
  - "safe javascript minification"
  - "minified ast verification"
importance_tier: normal
contextType: implementation
version: 3.5.0.15
---

# JavaScript Minification Guide

Safe minification workflow for Webflow projects with verification to prevent breaking functionality.

---

## 1. OVERVIEW

### Purpose

Provides systematic workflows for safely minifying JavaScript files using terser, with AST verification and runtime testing to ensure critical patterns are preserved and functionality is not broken.

### When to Use

- After making JavaScript changes that need deployment
- When optimizing file sizes for production
- Before uploading to CDN
- When setting up minification pipeline for new files

### Core Principle

Minification is safe when verified - AST check preserves critical patterns, runtime test catches execution errors, browser test confirms functionality.

### Why Minify?

| Benefit              | Impact                                    |
| -------------------- | ----------------------------------------- |
| File size reduction  | 60-80% smaller files                      |
| Faster page loads    | Less bandwidth, quicker parsing           |
| Bandwidth savings    | Lower CDN costs                           |
| Obfuscation          | Harder to read (minor security benefit)   |

### Risks of Minification

Minification can break code when:
- Dynamic property access uses string-based lookups
- Code relies on function/variable names at runtime
- Global variables are expected by external code
- String literals are incorrectly identified as dead code

**Solution:** Verification pipeline catches these issues before deployment.

---

## 2. TERSER CONFIGURATION

### Basic Command

```bash
npx terser [source] --compress --mangle -o [output]
```

### Options Explained

| Option           | What It Does                                              | Safe?                    |
| ---------------- | --------------------------------------------------------- | ------------------------ |
| `--compress`     | Dead code elimination, constant folding, simplification   | Usually safe             |
| `--mangle`       | Renames local variables to shorter names                  | Usually safe             |
| `--mangle-props` | Renames object properties                                 | **DANGEROUS** - avoid    |

### What `--compress` Does

- Removes unreachable code
- Evaluates constant expressions (`1 + 1` → `2`)
- Simplifies conditionals (`if (true)` → removes check)
- Removes unused variables
- Inlines simple functions

### What `--mangle` Does

- Renames local variables (`myLongVariableName` → `a`)
- Preserves global references (`window`, `document`)
- Preserves string literals
- Preserves property names (unless `--mangle-props`)

### Example

```bash
# Minify single file — output ALWAYS uses .min.js suffix in z_minified/
npx terser src/javascript/hero/hero_video.js --compress --mangle -o src/javascript/z_minified/hero/hero_video.min.js

# Check sizes
wc -c src/javascript/hero/hero_video.js src/javascript/z_minified/hero/hero_video.min.js
# Output: 27187 (original) → 8085 (minified) = 70% reduction
```

> **Output naming convention (2026-05-17):** `src/2_javascript/z_minified/` contains **only `.min.js` files**. The minify pipeline (`minify-webflow.mjs`) automatically rewrites the output filename from `foo.js` → `foo.min.js`. Do NOT place unsuffixed `.js` files in `z_minified/`.

---

## 3. CRITICAL PATTERNS FOR WEBFLOW

These patterns MUST be preserved during minification. The verification scripts check for them.

### Data Attribute Selectors

```javascript
// These string selectors must remain intact
const SELECTORS = {
  section: "[data-target='hero-section']",
  content: "[data-target='hero-content']",
  header: "[data-target='hero-header']",
  item: "[data-target='hero-item']",
};
```

**Why:** Used with `document.querySelector()` - if string changes, elements won't be found.

### Webflow.push Pattern

```javascript
// This pattern integrates with Webflow's lifecycle
if (window.Webflow?.push) {
  window.Webflow.push(start);
} else {
  start();
}
```

**Why:** Webflow expects this exact pattern for proper initialization timing.

### Motion.dev / GSAP References

> **Cross-stack motion.dev reference**: For Motion API import modes and integration trade-offs that apply outside Webflow minification, see [`../../animation/quick_start.md`](../../animation/quick_start.md) and [`../../animation/integration_patterns.md`](../../animation/integration_patterns.md). The Webflow guidance below remains authoritative for CDN globals that minification must preserve.

```javascript
// External library references must be preserved
if (window.Motion && typeof window.Motion.animate === 'function') {
  const { animate } = window.Motion;
  // ...
}
```

**Why:** These are global objects loaded from CDN - names cannot change.

### Global Init Flags

```javascript
// Prevent double initialization
const INIT_FLAG = '__heroVideoNoLoaderCdnInit';
if (window[INIT_FLAG]) return;
window[INIT_FLAG] = true;
```

**Why:** Flag name is used as string key - must remain identical.

### DOM Event Names

```javascript
// Event names are strings that must match browser expectations
document.addEventListener('DOMContentLoaded', init);
window.addEventListener('resize', handleResize);
element.addEventListener('click', handleClick);
```

**Why:** Browser APIs expect exact event name strings.

### CSS Property Names

```javascript
// CSS properties used in animations
element.style.opacity = '1';
element.style.transform = 'translateY(0)';
animate(element, { opacity: [0, 1], y: ['4rem', '0px'] });
```

**Why:** Property names must match CSS specification exactly.

---

