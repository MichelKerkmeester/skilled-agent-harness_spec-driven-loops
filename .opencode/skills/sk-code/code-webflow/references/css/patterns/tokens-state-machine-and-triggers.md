---
title: CSS Patterns - Webflow Implementation Reference
description: Comprehensive CSS patterns for Webflow development including state machines, validation architecture, accessibility, and design token systems.
trigger_phrases:
  - "webflow css patterns"
  - "css state machines"
  - "design token system webflow"
  - "css validation architecture"
importance_tier: normal
contextType: implementation
version: 3.5.0.4
---

# CSS Patterns - Webflow Implementation Reference

Comprehensive CSS patterns for Webflow development including state machines, validation architecture, accessibility, and design token systems.

---

## 1. OVERVIEW

### Purpose

This reference documents CSS patterns used in example.com's Webflow implementation. These patterns solve common challenges in Webflow projects: managing hover/focus states declaratively, handling form validation visually, ensuring accessibility compliance, and maintaining consistent design tokens.

### Prerequisites

Follow code quality standards for all CSS implementations:
- **Naming:** Use existing conventions documented in this file
- **Accessibility:** Include `prefers-reduced-motion` for all animations
- See [quality_standards.md](./quality_standards.md) for complete requirements

### When to Use This Reference

- Implementing hover/focus animations on cards or interactive elements
- Building form validation with visual feedback
- Ensuring keyboard vs mouse focus distinction
- Working with Webflow Designer mode previews
- Understanding the existing design token system

### Core Principle

**Declarative CSS state management**: Use CSS custom properties as state signals (`--_state---on/off`) to drive animations, letting HTML data attributes determine behavior and CSS handle the visual response.

### Key Sources

| Source File                                     | Pattern                  |
| ----------------------------------------------- | ------------------------ |
| `/src/1_css/animations/hover_state_machine.css` | State machine pattern    |
| `/src/1_css/form/form_validation.css`           | Validation states        |
| `/src/1_css/form/input_main.css`                | Keyboard focus detection |
| `/src/1_css/form/input_global.css`              | Mobile/browser fixes     |

---

## 2. WEBFLOW CSS TOKEN SYSTEM

### Important Disclaimer

> **WEBFLOW-SPECIFIC**: The naming convention documented in this section (`--_category---subcategory--variant`) is specific to Webflow Designer's generated CSS. This is NOT a recommended general practice for CSS custom properties. This section documents how existing code works to ensure consistency when extending it - NOT as a template for new CSS projects outside Webflow.

### Token Naming Convention

Webflow Designer generates CSS custom properties with a specific naming structure:

```
--_category---subcategory--variant
```

**Structure breakdown:**
- `--_` - Prefix (underscore after double dash)
- `category` - Top-level category (e.g., `color-tokens`, `layout`, `typography`)
- `---` - Triple dash separator
- `subcategory` - Specific token group (e.g., `input-bg`, `border-neutral`)
- `--` - Double dash separator
- `variant` - State or variation (e.g., `enabled`, `hover`, `primary`)

### Color Token Categories

**Input tokens** (form elements):
```css
/* [SOURCE: form_validation.css:19-22, input_main.css:12-14] */

/* Background states */
--_color-tokens---input-bg--enabled       /* Default input background */
--_color-tokens---input-bg--negative      /* Invalid/error state background */
--_color-tokens---input-bg--positive      /* Valid/success state background */

/* Border states */
--_color-tokens---input-border--enabled   /* Default border */
--_color-tokens---input-border--hover     /* Hover state border */
--_color-tokens---input-border--active    /* Focused/active border */
--_color-tokens---input-border--negative  /* Invalid/error state border */

/* Content states */
--_color-tokens---input-content--placeholder        /* Placeholder text */
--_color-tokens---input-content--placeholder_hover  /* Placeholder on hover */
--_color-tokens---input-content--negative           /* Error state text */
```

**Semantic state tokens**:
```css
/* [SOURCE: form_validation.css:180, input_main.css:43-44] */

--_color-tokens---state--focused   /* Keyboard focus ring color */
--_color-tokens---state--warning   /* Warning/error state */
--_color-tokens---state--success   /* Success/valid state */
```

**Neutral tokens** (backgrounds, borders, content):
```css
/* [SOURCE: input_global.css:164-168] */

--_color-tokens---bg-neutral--white           /* White background */
--_color-tokens---bg-neutral--light           /* Light gray background */
--_color-tokens---bg-neutral--base            /* Base gray background */
--_color-tokens---border-neutral--dark        /* Dark gray border */
--_color-tokens---border-neutral--darkest     /* Darkest border */
--_color-tokens---content-neutral--dark       /* Dark text */
--_color-tokens---content-neutral--darkest    /* Darkest text */
```

**Brand/highlight tokens**:
```css
/* [SOURCE: link_card.css:25-29, input_global.css:29] */

--_color-tokens---border-highlight--primary   /* Primary brand border */
--_color-tokens---border-brand--base          /* Brand color border */
--_color-tokens---content-highlight--primary  /* Primary highlight (caret) */
```

### Layout Tokens

```css
/* [SOURCE: input_upload.css:32] */

--_layout---radius--base  /* Standard border radius */
```

### Typography Tokens

```css
/* [SOURCE: link_card.css:17] */

--_typography---size--extra-large  /* Extra large text size */
```

### Using Tokens in CSS

**Pattern:** Always reference tokens via `var()` function:

```css
/* [SOURCE: input_main.css:12-14] */

/* Correct: Reference Webflow tokens */
.input {
  background-color: var(--_color-tokens---input-bg--enabled);
  border: 1.5px solid var(--_color-tokens---input-border--enabled);
}

/* Incorrect: Hardcoded values */
.input {
  background-color: #ffffff;  /* DON'T - use token */
  border: 1.5px solid #d1d5db; /* DON'T - use token */
}
```

### Component-Scoped Variables

For component-specific customization, define local CSS variables that reference Webflow tokens:

```css
/* [SOURCE: link_card_product.css:8-16] */

[data-product] {
  /* Map component vars to Webflow tokens */
  --product-border-default: var(--_color-tokens---link-product--border);
  --product-border-hover: var(--_color-tokens---link-product--border_hover);
  --product-button-bg-default: var(--_color-tokens---link-product--button);
  --product-button-bg-hover: var(--_color-tokens---link-product--button_hover);
}
```

**Benefits:**
- Component is self-contained
- Easy to customize per-instance
- Tokens remain the single source of truth

---

## 3. CSS STATE MACHINE PATTERN

### Core Concept

The state machine pattern uses CSS custom properties (`--_state---on` and `--_state---off`) as binary signals (0 or 1) to drive animations. This enables:

1. **Declarative behavior:** HTML attributes define WHAT happens, CSS defines HOW
2. **Composable states:** Multiple triggers (hover, focus, preview) use same variables
3. **Designer preview:** Webflow Designer can trigger states via `data-state="preview"`

### State Variable Declaration

```css
/* [SOURCE: hover_state_machine.css:9-12] */

/* Default: All states start OFF */
[data-state] {
  --_state---on: 0;
  --_state---off: 1;
}
```

**Key insight:** Elements with `data-state` attribute get state variables. The values are:
- `--_state---on: 0` (OFF state) or `--_state---on: 1` (ON state)
- `--_state---off: 1` (OFF state) or `--_state---off: 0` (ON state)

These are always inverses: when one is 0, the other is 1.

### Using State Variables in Animations

**Mathematical interpolation** - Use `calc()` with state variables:

```css
/* [SOURCE: link_card_image.css:6-8] */

/* Width expands from 0% to 100% based on state */
[data-state] [data-hover="divider"] {
  width: calc(100% * clamp(0, var(--_state---on, 0), 1));
  transition: width 300ms ease-out;
}
```

**How it works:**
- When OFF: `width: calc(100% * 0)` = 0%
- When ON: `width: calc(100% * 1)` = 100%
- Transition handles the animation between states

```css
/* [SOURCE: link_card_image.css:23-26] */

/* Scale from 1.0 to 1.05 (5% zoom) */
[data-state] [data-hover="image"] {
  transform: scale(calc(1 + (0.05 * clamp(0, var(--_state---on, 0), 1))));
  transition: transform 300ms ease-out;
}
```

**How it works:**
- When OFF: `scale(1 + (0.05 * 0))` = `scale(1.0)`
- When ON: `scale(1 + (0.05 * 1))` = `scale(1.05)`

```css
/* [SOURCE: link_card_image.css:16-20] */

/* Opacity from 0 to 1 */
@media (min-width: 991px) {
  [data-state] [data-hover="icon"] {
    opacity: calc(0 + (1 * clamp(0, var(--_state---on, 0), 1)));
    transition: opacity 300ms ease-out;
  }
}
```

### Color Interpolation with color-mix()

For color transitions, use `color-mix()` with state percentage:

```css
/* [SOURCE: link_card_product.css:22-27] */

/* Border color transitions from default to hover color */
[data-product][data-state] [data-hover="border"] {
  border-color: color-mix(in srgb,
      var(--product-border-default),
      var(--product-border-hover) calc(var(--_state---on, 0) * 100%));
  transition: border-color 200ms ease-out;
}
```

**How it works:**
- When OFF: `color-mix(default, hover 0%)` = 100% default color
- When ON: `color-mix(default, hover 100%)` = 100% hover color
- Transition animates between

```css
/* [SOURCE: link_card_product.css:40-47] */

/* Button background color transition */
[data-product][data-state] [data-hover="button"] {
  background-color: color-mix(in srgb,
      var(--product-button-bg-default),
      var(--product-button-bg-hover) calc(var(--_state---on, 0) * 100%));
  transition: background-color 200ms ease-out;
}
```

---

## 4. STATE TRIGGERS

### Hover Trigger

```css
/* [SOURCE: hover_state_machine.css:43-48] */

@media (hover: hover) {
  /* Basic hover: Activates on element hover */
  [data-state~="hover"]:hover {
    --_state---on: 1;
    --_state---off: 0;
  }
}
```

**HTML usage:**
```html
<div data-state="hover">
  <img data-hover="image" src="..." />
</div>
```

**Key points:**
- `@media (hover: hover)` prevents activation on touch devices
- `data-state~="hover"` uses attribute contains word selector (allows multiple values)
- On hover, state flips from OFF to ON

### Conditional Hover (Clickable Content)

```css
/* [SOURCE: hover_state_machine.css:50-55] */

@media (hover: hover) {
  /* Only activates if element contains clickable content */
  [data-state~="hover-if-clickable"]:has(.clickable--w:not(.w-condition-invisible)):hover {
    --_state---on: 1;
    --_state---off: 0;
  }
}
```

**Use case:** CMS-driven cards that sometimes have links, sometimes don't. Hover effect only activates when there's actually something to click.

### Focus Trigger

```css
/* [SOURCE: hover_state_machine.css:27-30] */

/* Activates when element or children receive focus */
[data-state~="focus"]:is(:focus-visible, :has(:focus-visible)) {
  --_state---on: 1;
  --_state---off: 0;
}
```

**Key points:**
- `:focus-visible` only shows for keyboard navigation
- `:has(:focus-visible)` catches focus on child elements
- Combined with `:is()` for either condition

### Group Focus (Sibling Highlighting)

```css
/* [SOURCE: hover_state_machine.css:32-38] */

/* When one "focus-other" item is focused, activate state on all NON-focused siblings */
[data-state~="group"]:has([data-state~="focus-other"]:focus-visible, [data-state~="focus-other"] :focus-visible)
  [data-state~="focus-other"]:not(:focus-visible, :has(:focus-visible)) {
  --_state---on: 1;
  --_state---off: 0;
}
```

**Use case:** Grid of cards where focusing one card dims/highlights all others.

**HTML structure:**
```html
<div data-state="group">
  <div data-state="focus-other">Card 1</div>
  <div data-state="focus-other">Card 2</div>
  <div data-state="focus-other">Card 3</div>
</div>
```

### Group Hover (Sibling Dimming)

```css
/* [SOURCE: hover_state_machine.css:57-70] */

@media (hover: hover) {
  /* Activate state on non-hovered siblings when any sibling is hovered */
  [data-state~="group"]:has([data-state~="hover-other"]:hover)
    [data-state~="hover-other"]:not(:hover) {
    --_state---on: 1;
    --_state---off: 0;
  }

  /* Override: Keep hovered element at default state */
  [data-state~="hover-other"]:hover {
    --_state---on: 0 !important;
    --_state---off: 1 !important;
  }
}
```

**Use case:** Hover one card, dim all other cards in the same container.

**Important:** The `!important` on the hovered element ensures it stays at default state while siblings get the "dimmed" state.

### Mobile State (Touch Devices)

```css
/* [SOURCE: hover_state_machine.css:76-81] */

/* Always active on touch devices (no hover capability) */
@media (hover: none) {
  [data-state~="mobile"] {
    --_state---on: 1;
    --_state---off: 0;
  }
}
```

**Use case:** Show expanded state by default on mobile where hover is impossible.

### Preview State (Webflow Designer)

```css
/* [SOURCE: hover_state_machine.css:17-21] */

/* Force ON state in Webflow Designer for preview */
.wf-design-mode [data-state~="preview"] {
  --_state---on: 1;
  --_state---off: 0;
}
```

**Use case:** Preview hover/focus animations while editing in Webflow Designer.

**HTML usage:**
```html
<!-- Add "preview" to data-state to see animation in Designer -->
<div data-state="hover preview">
  ...
</div>
```

**Important:** Remove "preview" before publishing to production.

---
