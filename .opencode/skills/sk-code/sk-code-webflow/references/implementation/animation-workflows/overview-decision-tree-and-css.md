---
title: Animation Workflows - Phase 1 Implementation
description: CSS-first animation guide with Motion.dev integration for complex sequences and scroll-triggered effects.
trigger_phrases:
  - "webflow animation workflows"
  - "css first animation"
  - "motion dev webflow sequences"
  - "scroll triggered effects"
importance_tier: normal
contextType: implementation
version: 3.5.0.9
---

# Animation Workflows - Phase 1 Implementation

CSS-first animation guide with Motion.dev integration for complex sequences and scroll-triggered effects.

---

## 1. OVERVIEW

### Purpose
Complete animation implementation guide covering decision trees, CSS patterns, Motion.dev integration, performance optimization, and accessibility compliance.

### When to Use
- Implementing UI animations
- Choosing between CSS and JavaScript animations
- Optimizing animation performance

### Core Principle
CSS first for simplicity and performance. Motion.dev when you need programmatic control.

### Prerequisites
Follow code quality standards:
- **Initialization:** Use CDN-safe pattern with guard flags and delays
- **Naming:** Use `snake_case` for functions/variables
- See [code-quality-standards.md](../../javascript/quality-standards/init-dom-error-and-async.md) for complete standards

---

## 2. ANIMATION DECISION TREE

### Primary Decision Order

Use this sequence when implementing animations:

1. **CSS transitions/keyframes** - First choice for hover, focus, small reveals, and state changes
2. **Motion.dev** - Use when you need programmatic control, in-view triggers, or coordinated sequences

### Quick Decision Flow

```
Need animation?
├─> Can CSS express it (transform/opacity/clip/mask)?
│   └─> Use CSS transitions or @keyframes
└─> Requires sequencing/stagger/scroll/in-view logic?
    └─> Use Motion.dev
```

**When CSS is sufficient:**
- Hover/focus states
- Simple state transitions (open/close, show/hide)
- Single-property animations
- Looping animations without timing dependencies

**When Motion.dev is required:**
- Scroll-triggered animations
- In-view entrance sequences
- Staggered animations (multiple elements with delays)
- Coordinated multi-step sequences
- Programmatic timing control

---

## 3. CSS ANIMATION PATTERNS

### GPU-Accelerated Properties Only

**Use these properties for smooth 60fps animations:**

```css
.element {
  /* ✅ GPU-accelerated - USE THESE */
  transform: translate(0, 0);  /* Position changes */
  opacity: 1;                  /* Fade effects */
  scale: 1;                    /* Size changes */
  rotate: 0deg;                /* Rotation */

  /* ❌ Layout properties - AVOID THESE */
  width: 200px;    /* Causes layout recalculation */
  height: 100px;   /* Causes layout recalculation */
  top: 0;          /* Causes layout recalculation */
  left: 0;         /* Causes layout recalculation */
}
```

### Timing Guidance

**Recommended durations by interaction type:**

| Interaction Type | Duration | Easing | Example |
|-----------------|----------|--------|---------|
| **Micro-interactions** | 150-250ms | ease-out | Button hover, icon changes |
| **Standard transitions** | 200-400ms | ease-out | Dropdowns, modals, cards |
| **Entrance animations** | 400-600ms | custom cubic-bezier | Hero elements, sections |
| **Exit animations** | 200-300ms | ease-in | Modal close, element removal |

**Standard easing curves:**
```css
.element {
  /* General purpose */
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);

  /* Snappy interactions */
  transition: opacity 0.2s ease-out;

  /* Continuous motion */
  transition: transform 0.5s linear;
}
```

### Accessibility Compliance (MANDATORY)

**Every animated element MUST respect prefers-reduced-motion:**

```css
/* Your animation */
.animated-element {
  transition: transform 0.3s ease-out, opacity 0.2s ease-out;
}

/* Disable for users who prefer reduced motion */
@media (prefers-reduced-motion: reduce) {
  .animated-element {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Why 0.01ms instead of 0ms:** Setting to 0ms can prevent transition/animation events from firing. 0.01ms applies end state while preserving event handling.

### Dropdown Pattern (No Layout Jump)

**Problem:** Height transitions from `0` to `auto` cause layout jumps because CSS cannot transition to/from `auto`.

**Solution:** Measure natural height, transition to pixel value, then set auto after transition completes:

```css
.dropdown {
  overflow: hidden;
  height: 0;
  opacity: 0;
  transition:
    height 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.2s cubic-bezier(0.22, 1, 0.36, 1);
}

.dropdown[open] {
  /* Will be set to pixel value by JavaScript, then auto */
  height: auto;
  opacity: 1;
}
```

```javascript
function open_dropdown(dropdown) {
  const natural_height = dropdown.scrollHeight;
  dropdown.setAttribute('open', '');
  dropdown.style.height = `${natural_height}px`;

  dropdown.addEventListener('transitionend', () => {
    dropdown.style.height = 'auto';
  }, { once: true });
}

function close_dropdown(dropdown) {
  const current_height = dropdown.scrollHeight;
  dropdown.style.height = `${current_height}px`;

  // Force reflow so browser registers the pixel value
  dropdown.offsetHeight;

  dropdown.style.height = '0';
  dropdown.removeAttribute('open');
}
```

**Reference implementation:** `src/javascript/navigation/language_selector.js` - Complete dropdown with measured height animation

---
