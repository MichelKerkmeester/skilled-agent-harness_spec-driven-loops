---
title: "Webflow JavaScript Quick Reference"
description: "Copy-paste-ready JS snippets and one-liners for Webflow: condition-based waiting (waitForElement, waitForLibrary), validation wrapper, MutationObserver, IntersectionObserver, Lenis scrollTo, Motion.dev animate/inView, Webflow guard flag, custom event dispatch, safe optional chaining."
trigger_phrases:
  - "webflow javascript quick reference"
  - "waitforelement helper"
  - "waitforlibrary helper"
  - "lenis scrollto snippet"
  - "motion dev animate snippet"
  - "webflow guard flag"
importance_tier: normal
contextType: implementation
---

# Webflow JavaScript Quick Reference

Copy-paste-ready JS snippets and one-liners for the Webflow stack — condition-based waiting, observers, animation helpers, custom events, optional chaining.

---

## 1. OVERVIEW

### Purpose

Copy-paste-ready JS snippets and one-liners for the Webflow stack — condition-based waiting, observers, animation, custom events, optional chaining.

### When to Use

- Need a snippet for a common pattern (waitForElement, IntersectionObserver, debounce)
- Validating commit-ready JS against a quick checklist
- Looking up a Motion.dev or Lenis one-liner

### Core Principle

Production-tested snippets beat ad-hoc inventions for Webflow's CDN-loaded runtime.

> See [`../shared/dev_workflow.md`](../shared/dev_workflow.md) for cross-language commands (DevTools, validation patterns, security, debugging) and decision matrix.

---

## 2. PRE-COMMIT JS CHECKLIST

### Naming
- [ ] All variables/functions use `snake_case`
- [ ] Constants use `UPPER_SNAKE_CASE`
- [ ] Boolean variables use `is_` or `has_` prefix
- [ ] Semantic prefixes used (`init_`, `handle_`, `get_`, `set_`, etc.)
- [ ] File names use `snake_case` (e.g., `component_name.js`)

### File Structure
- [ ] Three-line file header with box-drawing characters
- [ ] Category and component name in ALL CAPS
- [ ] No metadata in headers (no dates/authors/tickets)
- [ ] No ephemeral artifact ids in comments (tickets, spec/phase/packet numbers, ADR ids) — see `../../universal/code_style_guide.md` §4
- [ ] Numbered section headers for organization
- [ ] Wrapped in IIFE `(() => { ... })()`

### Formatting
- [ ] 2-space indentation (no tabs)
- [ ] Same-line opening braces (K&R style)
- [ ] Semicolons always used
- [ ] Single quotes for strings
- [ ] Trailing commas in multi-line structures
- [ ] Line length under 120 characters

### Comments
- [ ] Maximum 5 comments per 10 lines
- [ ] Focus on WHY, not WHAT
- [ ] Platform constraints documented (WEBFLOW, MOTION, LENIS)
- [ ] No commented-out code
- [ ] JSDoc for public/exported functions

---

## 3. CODE SNIPPETS

### waitForElement

```javascript
async function waitForElement(selector, timeout = 5000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const el = document.querySelector(selector);
    if (el) return el;
    await new Promise(r => setTimeout(r, 50));
  }
  throw new Error(`Element ${selector} not found`);
}
```

### waitForLibrary

```javascript
async function waitForLibrary(name, timeout = 10000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (typeof window[name] !== 'undefined') {
      return window[name];
    }
    await new Promise(r => setTimeout(r, 50));
  }
  throw new Error(`Library ${name} not loaded`);
}
```

### Validation Wrapper

```javascript
function validate(value, type, fallback) {
  if (!value || typeof value !== type) {
    console.warn(`Invalid ${type}, using fallback`);
    return fallback;
  }
  return value;
}

// Usage
const userId = validate(input, 'string', 'anonymous');
```

---

## 4. COMMON ONE-LINERS

### MutationObserver

```javascript
// Watch for DOM changes (child additions/removals)
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes.length) {
      // Handle added nodes
    }
  });
});
observer.observe(element, { childList: true, subtree: true });

// Disconnect when done
observer.disconnect();
```

### IntersectionObserver

```javascript
// Detect element visibility in viewport
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // Element is visible
      io.unobserve(entry.target);  // One-time trigger
    }
  });
}, { threshold: 0.5 });  // 50% visible

io.observe(element);
```

### Lenis scrollTo

```javascript
// Smooth scroll to element with offset
window.lenis?.scrollTo(element, {
  offset: -100,      // Offset from top (negative = above element)
  duration: 1.2,     // Animation duration in seconds
  immediate: false   // Set true to skip animation
});

// Scroll to position
window.lenis?.scrollTo(500, { duration: 0.8 });

// Scroll to top
window.lenis?.scrollTo(0);
```

### Motion.dev inView

```javascript
// One-time entrance animation
inView('.element', ({ target }) => {
  animate(target, { opacity: [0, 1], y: [40, 0] }, { duration: 0.6 });
});

// With cleanup (runs when element leaves viewport)
inView('.element', () => {
  const controls = animate('.child', { opacity: 1 });
  return () => controls.stop();  // Cleanup function
});
```

### Motion.dev animate

```javascript
// Basic animation with easing
animate(element, { opacity: [0, 1] }, {
  duration: 0.6,
  easing: [0.22, 1, 0.36, 1]
});

// With cleanup callback
animate(element, { y: [40, 0] }, {
  duration: 0.5,
  onComplete: () => {
    element.style.willChange = 'auto';
  }
});
```

### Webflow Guard Flag

```javascript
// Prevent double initialization during page transitions
const INIT_FLAG = '__componentNameInit';
if (window[INIT_FLAG]) return;
window[INIT_FLAG] = true;
```

### Custom Event Dispatch

```javascript
// Dispatch custom event for inter-component communication
document.dispatchEvent(new Event('heroAnimationComplete'));

// Listen for custom event
document.addEventListener('heroAnimationComplete', () => {
  // React to event
});

// With data
document.dispatchEvent(new CustomEvent('dataLoaded', {
  detail: { items: data }
}));
```

### Safe Optional Chaining

```javascript
// Safe property access with fallback
const value = obj?.nested?.property ?? 'default';

// Safe method call
element?.classList?.add('active');

// Safe array access
const first = items?.[0]?.name ?? 'Unknown';
```

### Force Layout Reflow

```javascript
// Force browser to recalculate layout before animation
element.style.height = '0';
void element.offsetHeight;  // Force reflow
element.style.height = `${targetHeight}px`;  // Animate to new height
```

### Remove Inline Styles

```javascript
// Clear specific inline styles
['transform', 'opacity', 'willChange'].forEach(prop => {
  element.style.removeProperty(prop.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`));
});
```

---

## 5. FORM VALIDATION CLASSES

| Class                 | Purpose             | Applied To          |
| --------------------- | ------------------- | ------------------- |
| `.validation-invalid` | Invalid/error state | `[data-form-field]` |
| `.validation-valid`   | Valid/success state | `[data-form-field]` |

```javascript
// Toggle validation states (typically called by form-validation JS)
field.classList.remove('validation-invalid');
field.classList.add('validation-valid');
```

CSS counterpart and full pattern reference: [`../css/quick_reference.md`](../css/quick_reference.md) §3 Form Validation Classes.

---

## RELATED RESOURCES

- [`./style_guide.md`](./style_guide.md) — JS naming, file structure, formatting rules
- [`./quality_standards.md`](./quality_standards.md) — defensive patterns with rationale
- [`../shared/cross_language_rules.md`](../shared/cross_language_rules.md) — cross-language conventions
- [`../shared/dev_workflow.md`](../shared/dev_workflow.md) — DevTools, common commands, debugging checklist
- [`../css/quick_reference.md`](../css/quick_reference.md) — CSS counterpart (Webflow tokens, validation classes, reduced motion, focus detection)

### Copy-paste template

- [`../../../assets/webflow/templates/component_template.js`](../../../assets/webflow/templates/component_template.js) — production-style annotated JS template
