---
title: "Webflow CSS Quality Standards"
description: "CSS quality patterns for Webflow: will-change management (set in JS, cleanup after), GPU-accelerated properties (transform/opacity only), Motion.dev-aligned easing, fluid typography. Includes CSS enforcement: custom property naming (--font-/--vw-/--component-/--state-/--global-), attribute selector case-insensitivity (i flag), BEM naming, animation property restrictions."
trigger_phrases:
  - "webflow css quality standards"
  - "will change management"
  - "gpu accelerated properties"
  - "css custom property prefix"
  - "bem naming enforcement"
  - "css attribute selector flag"
  - "fluid typography webflow"
importance_tier: normal
contextType: implementation
version: 3.5.0.2
---

# Webflow CSS Quality Standards

> See [`../style_guide.md`](../style_guide.md) for CSS naming, custom property prefixes, attribute selectors, animation CSS, and file organization. See [`../../shared/cross_language_rules.md`](../../shared/cross_language_rules.md) for cross-language rules. This file covers CSS quality patterns AND CSS-specific enforcement.

---

## 1. OVERVIEW

### Purpose

CSS quality patterns (will-change management, GPU acceleration, easing standards, fluid typography) plus the four CSS-specific enforcement subsections (custom property naming, attribute selector i flag, BEM, animation properties).

### When to Use

- Validating CSS before claiming implementation complete
- Fixing CSS violations identified by the code quality checklist
- Setting up will-change cleanup or fluid-typography breakpoints

### Core Principle

Defensive CSS patterns prevent runtime jank; explicit enforcement rules prevent silent regressions.

---

## 2. CSS QUALITY PATTERNS

### will-change Management

```css
/* Set will-change in JavaScript BEFORE animation starts */
.animating {
  will-change: transform, opacity;
}

/* Reset after animation completes (via JavaScript) */
.animation-complete {
  will-change: auto;
}
```

### GPU-Accelerated Properties Only

```css
.animated-element {
  /* ✅ GPU-accelerated - USE THESE */
  transform: translateY(0);
  opacity: 1;
  scale: 1;
  
  /* ❌ Layout properties - AVOID ANIMATING */
  /* width, height, top, left, padding, margin */
}
```

### Easing Standards (Aligned with Motion.dev)

```css
/* General purpose - smooth deceleration */
transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);

/* Dramatic entrances - strong deceleration */
transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1);
```

### Fluid Typography Formula

```css
/* Core formula: base + coefficient * viewport width */
html {
  font-size: calc(var(--base) * 1rem + var(--coefficient) * 1vw);
}

/* Breakpoint-specific values */
@media screen and (max-width: 1920px) {
  :root {
    --font-from: 15;
    --font-to: 16;
    --vw-from: calc(1440 / 100);
    --vw-to: calc(1920 / 100);
  }
}
```

---

## 3. CUSTOM PROPERTY NAMING ENFORCEMENT

#### Validation Prompt

> **Check:** Do CSS custom properties use semantic prefixes?

**What to look for:**
1. `--font-*` for typography values
2. `--vw-*` for viewport calculations
3. `--component-*` or `--{name}-*` for component-specific values
4. `--state-*` for interactive states
5. `--global-*` for site-wide values

#### Pattern Recognition

**Compliant Pattern:**
```css
:root {
  --font-from: 18;
  --font-to: 24;
  --vw-from: calc(1920 / 100);
  --vw-to: calc(2560 / 100);
  --hero-padding: 2rem;
  --state-hover-opacity: 0.8;
  --global-max-width: 1440px;
}
```

**Violation Patterns:**

| Violation           | Example                | How to Identify              |
| ------------------- | ---------------------- | ---------------------------- |
| No prefix           | `--from: 18;`          | Generic name without context |
| Wrong scope         | `--padding: 2rem;`     | Ambiguous - which component? |
| Inconsistent naming | `--heropadding: 2rem;` | Missing dash separator       |

#### Remediation

**Conversion rules:**
| From        | To                                   |
| ----------- | ------------------------------------ |
| `--from`    | `--font-from` or `--vw-from`         |
| `--padding` | `--hero-padding` or `--card-padding` |
| `--color`   | `--state-color` or `--theme-color`   |

---

## 4. ATTRIBUTE SELECTOR ENFORCEMENT

#### Validation Prompt

> **Check:** Do attribute selectors for custom data attributes include the case-insensitivity flag `i`?

**What to look for:**
1. `[data-*="value" i]` - note the `i` flag after the closing quote
2. Applies to ALL custom data attributes
3. Prevents silent selector failures from casing variations

#### Pattern Recognition

**Compliant Pattern:**
```css
/* Case-insensitive - matches "Base", "base", "BASE" */
[data-render-content="base" i] {
  content-visibility: auto;
}

[data-component="hero" i] {
  position: relative;
}
```

**Non-Compliant Pattern:**
```css
/* WRONG: Case-sensitive - only matches exact "base" */
[data-render-content="base"] {
  content-visibility: auto;
}
```

#### Remediation

**To fix missing `i` flag:**
1. Find all `[data-*="value"]` selectors
2. Add ` i` after the closing quote: `[data-*="value" i]`

**Browser support:** Chrome 49+, Firefox 47+, Safari 9+, Edge 79+

---

## 5. BEM NAMING ENFORCEMENT

#### Validation Prompt

> **Check:** Do CSS class names follow BEM convention with correct separators?

**What to look for:**
1. Block: `.block` (single class)
2. Element: `.block--element` (double-dash separator)
3. Modifier: `.block-modifier` (single-dash separator)

#### Pattern Recognition

**Compliant Pattern:**
```css
.hero { }                    /* Block */
.hero--title { }             /* Element (double-dash) */
.hero--overlay { }           /* Element */
.hero-featured { }           /* Modifier (single-dash) */
.btn { }                     /* Block */
.btn--icon { }               /* Element */
.btn-primary { }             /* Modifier */
```

**Violation Patterns:**

| Violation       | Example                 | Correct        |
| --------------- | ----------------------- | -------------- |
| camelCase       | `.heroTitle`            | `.hero--title` |
| snake_case      | `.hero_title`           | `.hero--title` |
| Wrong separator | `.hero-title` (element) | `.hero--title` |
| Mixed styles    | `.Hero--Title`          | `.hero--title` |

#### Remediation

**Conversion rules:**
| From             | To                          |
| ---------------- | --------------------------- |
| `.heroTitle`     | `.hero--title` (element)    |
| `.hero_overlay`  | `.hero--overlay` (element)  |
| `.Hero-Featured` | `.hero-featured` (modifier) |

---

## 6. ANIMATION PROPERTY ENFORCEMENT

#### Validation Prompt

> **Check:** Do animations use only GPU-accelerated properties?

**What to look for:**
1. **ALLOWED (GPU-accelerated):** `transform`, `opacity`, `scale`
2. **FORBIDDEN (layout triggers):** `width`, `height`, `top`, `left`, `right`, `bottom`, `padding`, `margin`
3. `will-change` is set dynamically, not permanently

#### Pattern Recognition

**Compliant Pattern:**
```css
.animated-element {
  /* GPU-accelerated - USE THESE */
  transform: translateY(0);
  opacity: 1;
  scale: 1;
  transition: transform 0.3s ease-out, opacity 0.3s ease-out;
}

/* will-change set via JavaScript before animation */
.animating {
  will-change: transform, opacity;
}

/* Reset after animation completes */
.animation-complete {
  will-change: auto;
}
```

**Non-Compliant Pattern:**
```css
/* WRONG: Animating layout properties causes reflow */
.slide-in {
  transition: left 0.3s;        /* Should use: transform: translateX() */
}

.expand {
  transition: width 0.3s;       /* Should use: transform: scaleX() */
}

.move {
  transition: top 0.3s, left 0.3s;  /* Should use: transform: translate() */
}

/* WRONG: Permanent will-change wastes GPU memory */
.always-ready {
  will-change: transform, opacity;  /* Set dynamically, not in CSS */
}
```

#### Remediation

**Property conversion:**
| From (Layout)                 | To (GPU-accelerated)                     |
| ----------------------------- | ---------------------------------------- |
| `left: 100px`                 | `transform: translateX(100px)`           |
| `top: 50px`                   | `transform: translateY(50px)`            |
| `width: 200%`                 | `transform: scaleX(2)`                   |
| `height: 0` to `height: auto` | Use `transform: scaleY()` or `clip-path` |

**For `will-change`:**
1. Remove from CSS
2. Set via JavaScript BEFORE animation: `element.style.willChange = 'transform, opacity'`
3. Reset AFTER animation: `element.style.willChange = 'auto'`

---

