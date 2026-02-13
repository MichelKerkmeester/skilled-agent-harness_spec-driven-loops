---
name: responsive-design
description: Create web interfaces that work well across all device sizes and orientations.
category: design
triggers:
  - responsive
  - mobile
  - breakpoints
  - layout
version: 0.1.0
---

# Responsive Design Skill

## Purpose
Create web interfaces that work well across all device sizes and orientations.

## Core Principles

### 1. Mobile-First
Design for mobile first, then enhance for larger screens.

```css
/* Mobile styles (default) */
.container { padding: 1rem; }

/* Tablet and up */
@media (min-width: 768px) {
  .container { padding: 2rem; }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .container { padding: 3rem; max-width: 1200px; }
}
```

### 2. Fluid Layouts
Use relative units and flexible containers.

```css
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 clamp(1rem, 5vw, 3rem);
}
```

### 3. Responsive Images

```html
<picture>
  <source media="(min-width: 1024px)" srcset="large.jpg">
  <source media="(min-width: 768px)" srcset="medium.jpg">
  <img src="small.jpg" alt="Description">
</picture>
```

## Breakpoints

| Name | Min Width | Target |
|------|-----------|--------|
| sm | 640px | Large phones |
| md | 768px | Tablets |
| lg | 1024px | Laptops |
| xl | 1280px | Desktops |
| 2xl | 1536px | Large screens |

## Testing Checklist

- [ ] Test on actual devices, not just browser resize
- [ ] Check touch targets (min 44x44px)
- [ ] Verify text readability at all sizes
- [ ] Test landscape and portrait orientations
- [ ] Check for horizontal scroll issues
