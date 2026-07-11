---
title: Designer Mode, Component State & Performance Patterns
description: Comprehensive CSS patterns for Webflow development including state machines, validation architecture, accessibility, and design token systems. — Designer Mode, Component State & Performance Patterns.
importance_tier: normal
contextType: implementation
version: 3.5.0.4
---

# Designer Mode, Component State & Performance Patterns

## 10. WEBFLOW DESIGNER MODE SUPPORT

### Designer Mode Detection

Webflow adds `.wf-design-mode` class to body when in Designer:

```css
/* [SOURCE: hover_state_machine.css:17-21] */

.wf-design-mode [data-state~="preview"] {
  --_state---on: 1;
  --_state---off: 0;
}
```

### Preview Pattern Usage

**Development workflow:**

1. Add `preview` to `data-state` attribute:
```html
<div data-state="hover preview">
```

2. See hover animation in Designer without hovering

3. Remove `preview` before publishing:
```html
<div data-state="hover">
```

### Conditional Visibility Classes

Webflow generates `.w-condition-invisible` for conditional visibility:

```css
/* [SOURCE: hover_state_machine.css:52] */

/* Only activate if clickable content is visible (not conditionally hidden) */
[data-state~="hover-if-clickable"]:has(.clickable--w:not(.w-condition-invisible)):hover {
  --_state---on: 1;
}
```

### Webflow Form Classes

```css
/* [SOURCE: input_global.css:8-21] */

/* Support Webflow's form container classes */
.w-form .input,
.w-form .w-input,
.form-block .input,
.form-block .w-input {
  /* Styles here apply to inputs inside Webflow forms */
}
```

---

## 11. COMPONENT STATE PATTERNS

### Open/Closed State (Dropdown)

```css
/* [SOURCE: input_select.css:105-118] */

/* Parent container controls child states */
.input--container.is--open .input[data-select="input"],
[data-select="wrapper"].is--open [data-select="input"] {
  border-color: var(--_color-tokens---input-border--active);
}

/* Chevron rotation when open */
.input--container.is--open [data-hover="input-select"],
[data-select="wrapper"].is--open [data-hover="input-select"] {
  transform: rotate(180deg);
  transition: transform 0.2s ease;
}
```

### Visibility Toggle (No Display None)

```css
/* [SOURCE: input_select.css:131-151] */

/* Hidden: Use opacity + visibility + pointer-events (NOT display:none) */
.input--dropdown-w,
[data-select="dropdown"] {
  opacity: 0 !important;
  visibility: hidden !important;
  pointer-events: none !important;
  transform: translateY(-4px);
  transition:
    opacity 0.2s ease,
    visibility 0.2s ease,
    transform 0.2s ease;
}

/* Visible */
.input--container.is--open .input--dropdown-w,
[data-select="wrapper"].is--open [data-select="dropdown"] {
  opacity: 1 !important;
  visibility: visible !important;
  pointer-events: auto !important;
  transform: translateY(0);
}
```

**Why not `display: none`:** Cannot transition from `display: none`. Using opacity/visibility enables smooth fade animations.

### Disabled State

```css
/* [SOURCE: input_select.css:188-193] */

.input--container.is--disabled .input[data-select="input"],
[data-select="wrapper"].is--disabled [data-select="input"] {
  opacity: 0.5;
  pointer-events: none;
  cursor: not-allowed;
}
```

### Selected State

```css
/* [SOURCE: input_select.css:172-182] */

/* Option selected state */
.input--option.is--selected,
[data-select="option"].is--selected {
  background-color: var(--_color-tokens---bg-neutral--base);
  font-weight: 500;
}

/* Hover + Selected combined */
.input--option.is--selected:hover,
[data-select="option"].is--selected:hover {
  background-color: var(--_color-tokens---bg-neutral--base);
}
```

---

## 12. PERFORMANCE PATTERNS

### Content Visibility

```css
/* [SOURCE: performance.css:14-30] */

/* Large sections (~720px) */
[data-render-content="large" i] {
  content-visibility: auto;
  contain-intrinsic-size: auto 45rem;
}

/* Base sections (~480px) */
[data-render-content="base" i] {
  content-visibility: auto;
  contain-intrinsic-size: auto 30rem;
}

/* Small sections (~320px) */
[data-render-content="small" i] {
  content-visibility: auto;
  contain-intrinsic-size: auto 20rem;
}
```

**How it works:**
- `content-visibility: auto` - Browser skips rendering off-screen sections
- `contain-intrinsic-size` - Provides placeholder size for scroll calculations

### Overflow-Safe Containment

```css
/* [SOURCE: performance.css:36-39] */

/* For sections with overflow (CTAs, decorative elements) */
[data-render-content="overflow" i] {
  contain: layout style;
  contain-intrinsic-block-size: auto 30rem;
}
```

**Why:** `content-visibility: auto` clips overflow. Using `contain: layout style` gives partial performance benefit while preserving overflow.

### Will-Change Property

```css
/* [SOURCE: link_card.css:58] */

.link--card .link--divider-line {
  will-change: width;
}
```

**Use sparingly:** Only on elements that will actually animate. Overuse hurts performance.

### Transition Best Practices

```css
/* [SOURCE: input_main.css:16-17] */

/* Transition specific properties, not 'all' */
.input {
  transition: border-color 0.2s ease-in-out, outline 0.1s ease-in-out;
}
```

**Why:** `transition: all` is inefficient and can cause unexpected animations.

---
