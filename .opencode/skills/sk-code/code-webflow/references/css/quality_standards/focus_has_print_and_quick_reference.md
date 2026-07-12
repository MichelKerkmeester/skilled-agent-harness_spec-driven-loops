---
title: Focus-Visible, :has(), Print & Quick Reference
description: "CSS quality patterns for Webflow: will-change management (set in JS, cleanup after), GPU-accelerated properties (transform/opacity only), Motion.dev-aligned easing, fluid typography. Includes CSS enforcement: custom property naming (--font-/--vw-/--component-/--state-/--global-), attribute selector case-insensitivity (i flag), BEM naming, animation property restrictions." — Focus-Visible, :has(), Print & Quick Reference.
trigger_phrases:
  - "focus visible discipline"
  - "css has parent selector"
  - "webflow print stylesheet"
  - "css deployment checklist"
importance_tier: normal
contextType: implementation
version: 3.5.0.2
---

# Focus-Visible, :has(), Print & Quick Reference

Quality and enforcement guidance for focus visibility, parent-state selectors, print stylesheets, and final CSS checks.

---

## 1. OVERVIEW

### Purpose

Document modern focus indicators, `:has()` parent-state patterns, print behavior, and a compact deployment checklist.

### When to Use

- Migrating focus styling from `:focus` to `:focus-visible`.
- Replacing parent-state class toggles with `:has()` where appropriate.
- Adding print support or performing final CSS quality checks.

---

## 2. :FOCUS-VISIBLE VS :FOCUS DISCIPLINE

The `:focus` pseudo-class fires for ALL focus events — keyboard tab, mouse click, programmatic focus. The `:focus-visible` pseudo-class fires ONLY when the browser determines the user needs visible focus indication (typically keyboard tab, NOT mouse click). Use `:focus-visible` for outline rings to avoid showing them on every mouse click.

### Compliant pattern

```css
/* Keyboard users see the focus ring */
.input:focus-visible {
  outline: 4px solid var(--_color-tokens---state--focused);
  outline-offset: 0;
}

/* Mouse-click focus does NOT show outline (no :focus rule needed) */
.input {
  /* Default — no outline rule */
}

/* Buttons: same pattern */
.btn:focus-visible {
  outline: 2px solid var(--_color-tokens---state--focused);
  outline-offset: 2px;
}
```

### Why not the body.using-keyboard pattern?

The legacy pattern (in `references/webflow/css/quick_reference.md` §5) uses JS to add `body.using-keyboard` on Tab keypress, then CSS targets `body.using-keyboard :focus`. That pattern predates `:focus-visible` and is now legacy. Reasons to migrate:

- `:focus-visible` is browser-native heuristic; matches user expectations across all browsers (including future ones)
- Reduces JS surface area (no Tab/mousedown listeners needed)
- Honors browser settings (a user with keyboard-navigation accessibility settings always sees the ring; mouse-only users never do)

### Migration path

```css
/* OLD (legacy) — kept for compatibility while migrating */
body.using-keyboard .input:focus {
  outline: 4px solid var(--_color-tokens---state--focused);
}

/* NEW — modern :focus-visible */
.input:focus-visible {
  outline: 4px solid var(--_color-tokens---state--focused);
  outline-offset: 0;
}
```

Both rules can coexist during migration. After all consumers update, remove the JS that toggles `.using-keyboard` and the legacy CSS.

### Browser support

`:focus-visible` is supported in Chrome 86+, Firefox 85+, Safari 15.4+. For older browsers, fall back to `:focus` with the legacy `.using-keyboard` pattern OR accept that mouse users see focus rings.

### Validation prompt

> **Check:** Are focus styles applied via `:focus-visible` (modern) rather than `:focus` (legacy)? Is the legacy `body.using-keyboard` pattern marked for migration?

---

## 3. :HAS() PARENT-STATE PATTERNS

`:has()` (Chrome 105+, Firefox 121+, Safari 15.4+) is the long-awaited "parent selector" — a CSS rule can target an element based on its descendants' state. Eliminates many JavaScript-driven class toggles.

### Form-field validation parent style (without JS)

```css
/* OLD pattern: JS adds .validation-invalid to [data-form-field] when input is :invalid */
[data-form-field].validation-invalid {
  border-color: red;
}

/* NEW pattern: CSS handles it via :has() */
[data-form-field]:has(input:invalid) {
  border-color: var(--_color-tokens---input-border--negative);
}

[data-form-field]:has(input:valid:not(:placeholder-shown)) {
  border-color: var(--_color-tokens---input-border--positive);
}
```

The JS class-toggle pattern still has its place (when validation timing must be deferred until blur or submission), but for immediate parent-state styling, `:has()` is simpler and faster.

### Card with image vs no-image styling

```css
/* Card layout adapts based on whether it contains an image */
.card:has(.card--image) {
  display: grid;
  grid-template-columns: 1fr 2fr;
}

.card:not(:has(.card--image)) {
  display: block;
}
```

### Section visibility based on content presence

```css
/* Hide section header if section has no content */
.section:not(:has(.section--body)) {
  display: none;
}

/* Show "load more" button only if there's hidden content */
.list:has(.list--item.is-hidden) ~ .list--load-more {
  display: block;
}
.list--load-more {
  display: none;
}
```

### Validation prompt

> **Check:** Are JS-driven class-toggle patterns that target parent-state styling candidates for `:has()` migration? Is `:has()` used where it simplifies the JS↔CSS contract?

---

## 4. PRINT STYLESHEET PATTERNS

Webflow doesn't generate print stylesheets. If users print pages (common for invoices, contracts, technical specs), add `@media print` rules in the Custom CSS panel.

### Standard print reset

```css
@media print {
  /* Hide non-printable UI */
  .nav,
  .footer,
  .modal,
  .cookie-banner,
  [data-print="hide"] {
    display: none !important;
  }

  /* Force white background, black text — saves toner */
  body {
    background: white;
    color: black;
  }

  /* Honor page-break hints */
  h1, h2, h3 {
    break-after: avoid;
  }

  .card,
  .section {
    break-inside: avoid;
  }

  /* Show full URLs after links (keeps printed output useful) */
  a[href]::after {
    content: " (" attr(href) ")";
    font-size: 0.85em;
    color: #666;
  }

  /* Don't print tracking-pixel images */
  img[src*="analytics"],
  img[src*="pixel"] {
    display: none;
  }
}
```

### Page setup (modern @page rules)

```css
@page {
  size: A4 portrait;
  margin: 1.5cm;
}

@page :first {
  /* First page can have different margins (e.g. for letterhead) */
  margin-top: 3cm;
}
```

### Validation prompt

> **Check:** Does the site have `@media print` rules for any printable content (invoices, articles, contracts)? Are non-print UI elements (nav, modals, banners) hidden in print? Are link hrefs visible in printed output?

---

## 5. CSS QUICK REFERENCE CHECKLIST

Before deploying any component:

**Performance (CSS-applicable):**
- [ ] GPU-accelerated properties for animation
- [ ] `will-change` cleanup on completion

**Animation (CSS-applicable):**
- [ ] `prefers-reduced-motion` support

---

## RELATED RESOURCES

- [`../patterns/tokens_state_machine_and_triggers.md`](../patterns/tokens_state_machine_and_triggers.md) — Webflow CSS patterns reference: token system, state machines, focus detection, form validation, mobile patterns
- [`../style_guide.md`](../style_guide.md) — CSS naming (BEM), custom property prefixes, attribute selectors, animation CSS, file organization
- [`../quick_reference.md`](../quick_reference.md) — Webflow tokens, form validation classes, reduced motion, focus detection
- [`../../shared/cross_language_rules.md`](../../shared/cross_language_rules.md) — cross-language conventions
- [`../../shared/enforcement.md`](../../shared/enforcement.md) — cross-language pre-completion gate (file headers, section organization, comment quality)
- [`../../implementation/animation_workflows/overview-decision-tree-and-css.md`](../../implementation/animation_workflows/overview-decision-tree-and-css.md) — complete CSS + Motion.dev animation guide
