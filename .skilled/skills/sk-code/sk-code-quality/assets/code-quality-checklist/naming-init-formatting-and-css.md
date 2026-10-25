---
title: Naming, Initialization, Formatting & CSS Style Checks
description: Surface-neutral JavaScript formatting and CSS checks that no surface language checklist states. — Naming, Initialization, Formatting & CSS Style Checks.
trigger_phrases:
  - "javascript naming checks"
  - "cdn safe initialization"
  - "javascript formatting checks"
  - "css style checks"
importance_tier: normal
contextType: implementation
version: 1.5.2.0
---

# Naming, Initialization, Formatting & CSS Style Checks

Surface-neutral formatting and CSS checks, and where naming and initialization rules live instead.

## 1. OVERVIEW

### Purpose

Hold the JavaScript formatting and CSS checks that apply on every surface and that the surface's own checklist does not already carry. Naming and initialization are surface conventions, so this file points to their owners rather than restating them.

### Usage

Load this file with [overview-header-and-comments.md](./overview-header-and-comments.md) for a `.js` or `.css` target, after the surface's own language checklist. Apply each relevant check before reporting code-quality results.

---

## 2. NAMING AND INITIALIZATION

**Applies to:** JavaScript (`.js`)

No checks here. Identifier naming follows the surface convention.

- **SKILLED:** camelCase variables and functions, `PascalCase` classes, `UPPER_SNAKE_CASE` constants and `is`/`has`/`can` boolean prefixes, per `../../../sk-code-skilled/assets/checklists/javascript-checklist.md` and `../../../sk-code-skilled/references/javascript/style-guide.md` §5.
- **Webflow:** the `snake_case` names, semantic prefixes and the CDN-safe `INIT_FLAG` guard belong to the private `local-webflow` skill, which carries them.

A naming defect is P1 under [code-quality-standards.md](../../../shared/references/universal/code-quality-standards.md) §4: it gets fixed but does not block completion the way a security or correctness defect does.

---

## 3. FORMATTING CHECKS

**Applies to:** JavaScript (`.js`)

Indentation, brace style, semicolons, quotes and line length come from the surface checklist and style guide.

- [ ] **[P2] CHK-FMT-05**: Trailing commas in multi-line structures

---

## 4. CSS STYLE CHECKS

**Applies to:** CSS (`.css`)

Custom-property prefixes, class naming schemes and file naming are surface conventions. The Webflow ones, such as `--vw-*` prefixes, BEM classes and `snake_case` file names, belong to `local-webflow`.

### Attribute Selectors

- [ ] **[P1] CHK-CSS-05**: Data attributes use kebab-case values (`data-render-content="base"`)

### Animation Properties

- [ ] **[P0] CHK-CSS-09**: Animations use GPU-accelerated properties only (`transform`, `opacity`, `scale`)
- [ ] **[P1] CHK-CSS-10**: Layout properties NOT animated (`width`, `height`, `top`, `left`, `padding`, `margin`)
- [ ] **[P1] CHK-CSS-11**: `will-change` managed dynamically (set before animation, reset to `auto` after)

**Compliant Example:**

```css
/* GPU-Accelerated Animation */
.animated-element {
  transform: translateY(0);
  opacity: 1;
  scale: 1;
  /* AVOID: width, height, top, left, padding, margin */
}
```

**Non-Compliant Example:**

```css
/* WRONG: Animating layout properties */
.slide-in {
  transition: left 0.3s;   /* Should use: transform: translateX() */
  transition: width 0.3s;  /* Layout property - causes reflow */
}
```

---
