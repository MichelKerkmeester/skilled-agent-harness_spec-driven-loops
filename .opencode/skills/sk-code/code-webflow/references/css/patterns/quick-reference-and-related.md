---
title: Quick Reference & Related
description: Comprehensive CSS patterns for Webflow development including state machines, validation architecture, accessibility, and design token systems. — Quick Reference & Related.
importance_tier: normal
contextType: implementation
version: 3.5.0.4
---

# Quick Reference & Related

## 13. QUICK REFERENCE

### State Machine Setup

```html
<!-- Container with trigger type -->
<div data-state="hover">
  <!-- Children with animation roles -->
  <img data-hover="image" src="..." />
  <div data-hover="divider"></div>
  <span data-hover="icon">...</span>
</div>
```

### State Variable Usage

```css
/* Width/scale/opacity from 0 to X */
property: calc(0 + (X * clamp(0, var(--_state---on, 0), 1)));

/* Width from Y to Z */
property: calc(Y + ((Z - Y) * clamp(0, var(--_state---on, 0), 1)));

/* Color interpolation */
property: color-mix(in srgb, var(--default), var(--hover) calc(var(--_state---on, 0) * 100%));
```

### State Triggers

| Trigger | Attribute Value                 | Activation       |
| ------- | ------------------------------- | ---------------- |
| Hover   | `data-state="hover"`            | Mouse hover      |
| Focus   | `data-state="focus"`            | Keyboard focus   |
| Mobile  | `data-state="mobile"`           | Touch devices    |
| Preview | `data-state="hover preview"`    | Webflow Designer |
| Group   | `data-state="group"` + children | Sibling effects  |

### Validation Classes

| Class                 | Applied To          | Effect          |
| --------------------- | ------------------- | --------------- |
| `.validation-invalid` | `[data-form-field]` | Error styling   |
| `.validation-valid`   | `[data-form-field]` | Success styling |
| `.is--open`           | Container           | Show dropdown   |
| `.is--disabled`       | Container           | Disable input   |
| `.is--selected`       | Option              | Selected option |

### Focus Handling

```css
/* Mouse focus: hide outline */
.element:focus { outline: none; }

/* Keyboard focus: show outline */
body.using-keyboard .element:focus { outline: 4px solid var(--state--focused); }

/* Fallback */
.element:focus-visible { outline: 4px solid var(--state--focused); }
```

### Accessibility Checklist

```
[ ] All animations have @media (prefers-reduced-motion: reduce) variant
[ ] Focus states use :focus-visible or body.using-keyboard
[ ] Color contrast meets WCAG requirements
[ ] Hidden elements use proper screen reader pattern
[ ] Touch targets are at least 44x44px on mobile
```

---

## 14. RELATED RESOURCES

### Reference Files

- [animation_workflows.md](../../implementation/animation_workflows/overview-decision-tree-and-css.md) - Animation implementation patterns
- [quality_standards.md](../quality_standards/patterns-and-naming-enforcement.md) - General coding standards
- [webflow_patterns.md](../../implementation/webflow_patterns/overview-limits-and-collection-lists.md) - Webflow platform constraints

### Source Files

- `/src/1_css/animations/hover_state_machine.css` - State machine core
- `/src/1_css/animations/link_card_image.css` - Card image animations
- `/src/1_css/animations/link_card_product.css` - Product card animations
- `/src/1_css/form/form_validation.css` - Validation states
- `/src/1_css/form/input_main.css` - Input base styles + focus
- `/src/1_css/form/input_select.css` - Custom select component
- `/src/1_css/form/input_global.css` - Mobile/browser fixes
- `/src/1_css/global/performance.css` - Performance optimizations
