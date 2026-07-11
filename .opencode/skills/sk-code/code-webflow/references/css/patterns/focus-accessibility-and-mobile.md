---
title: Focus Detection, Accessibility & Mobile/Browser Patterns
description: Comprehensive CSS patterns for Webflow development including state machines, validation architecture, accessibility, and design token systems. — Focus Detection, Accessibility & Mobile/Browser Patterns.
importance_tier: normal
contextType: implementation
version: 3.5.0.4
---

# Focus Detection, Accessibility & Mobile/Browser Patterns

## 7. KEYBOARD VS MOUSE FOCUS DETECTION

### The Problem

Mouse users don't need visible focus rings (they know where they clicked), but keyboard users need them for navigation. CSS `:focus` applies to both, `:focus-visible` helps but has edge cases.

### Solution: Body Class Pattern

JavaScript detects input method and adds class to `<body>`:

```javascript
// Keyboard navigation detected
document.body.classList.add('using-keyboard');

// Mouse click detected
document.body.classList.remove('using-keyboard');
```

### CSS Implementation

```css
/* [SOURCE: input_main.css:30-37] */

/* Mouse focus: Hide outline */
.input:focus,
.w-input:focus {
  background-color: var(--_color-tokens---input-bg--enabled);
  border-color: var(--_color-tokens---input-border--active);
  outline: none !important;
  outline-width: 0 !important;
}
```

```css
/* [SOURCE: input_main.css:39-45] */

/* Keyboard focus: Show visible outline */
body.using-keyboard .input:focus,
body.using-keyboard .w-input:focus {
  border-color: var(--_color-tokens---input-border--enabled);
  outline: 4px solid var(--_color-tokens---state--focused) !important;
  outline-offset: 0;
}
```

```css
/* [SOURCE: input_main.css:47-53] */

/* Fallback: :focus-visible (modern browsers) */
.input:focus-visible,
.w-input:focus-visible {
  border-color: var(--_color-tokens---input-border--enabled);
  outline: 4px solid var(--_color-tokens---state--focused) !important;
  outline-offset: 0;
}
```

```css
/* [SOURCE: input_main.css:55-60] */

/* Explicit mouse override: Hide outline */
body:not(.using-keyboard) .input:focus,
body:not(.using-keyboard) .w-input:focus {
  outline: none !important;
  outline-width: 0 !important;
}
```

### Priority Order

1. `body:not(.using-keyboard)` - Mouse users: no outline
2. `body.using-keyboard` - Keyboard users: visible outline
3. `:focus-visible` - Fallback for browsers/cases where JS hasn't run

### Select Input Implementation

```css
/* [SOURCE: input_select.css:40-46] */

/* Keyboard focus for custom select */
body.using-keyboard .input[data-select="input"]:focus,
body.using-keyboard [data-select="input"]:focus {
  border-color: var(--_color-tokens---input-border--enabled);
  outline: 4px solid var(--_color-tokens---state--focused) !important;
  outline-offset: 0;
}
```

---

## 8. ACCESSIBILITY PATTERNS

### Reduced Motion Support

**MANDATORY:** All animations must respect user's motion preference.

```css
/* [SOURCE: link_card_image.css:29-36] */

@media (prefers-reduced-motion: reduce) {
  [data-state] [data-hover="divider"],
  [data-state] [data-hover="icon"],
  [data-state] [data-hover="image"] {
    transition-duration: 0ms;
  }
}
```

```css
/* [SOURCE: link_card_product.css:52-58] */

@media (prefers-reduced-motion: reduce) {
  [data-product][data-state] [data-hover="border"],
  [data-product][data-state] [data-hover="image"],
  [data-product][data-state] [data-hover="button"] {
    transition-duration: 0ms;
  }
}
```

**Pattern:** Set `transition-duration: 0ms` rather than removing the transition property. This ensures:
- State changes still happen (no broken functionality)
- No animation occurs (respects user preference)
- Easier maintenance (one line change)

### Focus Visibility

Use `:focus-visible` instead of `:focus` for keyboard-only focus indicators:

```css
/* [SOURCE: hover_state_machine.css:27-30] */

/* Only activates on keyboard focus, not mouse clicks */
[data-state~="focus"]:is(:focus-visible, :has(:focus-visible)) {
  --_state---on: 1;
  --_state---off: 0;
}
```

### Color Contrast

Validation states use semantic color tokens with sufficient contrast:

| State   | Background Token       | Border Token               |
| ------- | ---------------------- | -------------------------- |
| Error   | `--input-bg--negative` | `--input-border--negative` |
| Success | `--input-bg--positive` | (optional)                 |
| Focus   | (unchanged)            | `--state--focused`         |

### Screen Reader Hidden Elements

```css
/* [SOURCE: input_select.css:200-210] */

/* Visually hidden but accessible to screen readers */
[data-select="hidden"] {
  position: absolute !important;
  width: 1.5px !important;
  height: 1.5px !important;
  padding: 0 !important;
  margin: -1.5px !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  white-space: nowrap !important;
  border: 0 !important;
}
```

**Use case:** Hidden `<select>` element for form submission while showing custom dropdown UI.

---

## 9. MOBILE AND BROWSER-SPECIFIC PATTERNS

### Hover Media Query

```css
/* [SOURCE: hover_state_machine.css:43, input_global.css:48] */

/* Only apply hover styles on devices that support hover */
@media (hover: hover) {
  .element:hover { }
}
```

**Why:** Touch devices trigger `:hover` on tap and it stays until you tap elsewhere. This media query prevents sticky hover states on mobile.

### Touch Device Detection

```css
/* [SOURCE: input_global.css:114] */

/* Target touch devices with coarse pointer */
@media (hover: none) and (pointer: coarse) {
  /* Touch-specific styles */
}
```

### Mobile Zoom Prevention

iOS Safari zooms in on inputs with font-size < 16px. This prevents zoom:

```css
/* [SOURCE: input_global.css:64-111] */

@media screen and (max-width: 991px) {
  input[type="text"],
  input[type="email"],
  input[type="password"],
  input[type="tel"],
  textarea,
  select,
  .input,
  .w-input {
    font-size: 16px !important;
    -webkit-text-size-adjust: 100% !important;
  }
}
```

**Key points:**
- `16px` is the exact threshold - iOS only zooms on smaller fonts
- Applied at tablet/mobile breakpoint (991px)
- `!important` overrides Webflow's responsive font sizes

### Safari Hover Fix

```css
/* [SOURCE: input_global.css:47-58] */

@media (hover: hover) {
  .input:hover:not(:focus),
  .w-input:hover:not(:focus) {
    border-color: var(--_color-tokens---border-neutral--darkest);
  }
}
```

**Why `:not(:focus)`:** Prevents border color flashing when clicking into input (hover -> focus transition).

### Autofill Neutralization

```css
/* [SOURCE: input_global.css:152-175] */

/* Remove browser's autofill background */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0px 1000px var(--_color-tokens---bg-neutral--white) inset !important;
  box-shadow: 0 0 0px 1000px var(--_color-tokens---bg-neutral--white) inset !important;
  -webkit-text-fill-color: var(--_color-tokens---content-neutral--darkest) !important;
  border: 1.5px solid var(--_color-tokens---border-neutral--dark) !important;
  transition: background-color 5000s ease-in-out 0s !important;
}

/* Firefox autofill */
input:autofill {
  background-color: var(--_color-tokens---bg-neutral--white) !important;
}
```

---
