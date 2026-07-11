---
title: Observer, Validation, Performance & Animation Patterns
description: "Defensive code patterns for Webflow JS: CDN-safe initialization (MANDATORY), DOM safety, error handling, async, observers, validation, performance, animation quality, state management, cleanup/destroy, shared document listeners, WeakMap/WeakSet caching. Includes JS naming and initialization-pattern enforcement." — Observer, Validation, Performance & Animation Patterns.
importance_tier: normal
contextType: implementation
version: 3.5.0.7
---

# Observer, Validation, Performance & Animation Patterns

## 6. OBSERVER PATTERNS

### IntersectionObserver for Visibility-Triggered Actions

```javascript
// Lazy load or animate when visible
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // Element visible - trigger action
      entry.target.classList.add('visible');
    } else {
      // Element hidden
      entry.target.classList.remove('visible');
    }
  });
}, { threshold: 0.1 });

// Observe elements
document.querySelectorAll('.lazy-load').forEach((el) => io.observe(el));
```

### MutationObserver for Dynamic Content

```javascript
// Watch for dynamically added elements
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === 1) {
        // Process new element
        if (node.matches('.target-class')) {
          init_element(node);
        }
      }
    });
  });
});

observer.observe(document.body, { childList: true, subtree: true });

// Cleanup when done
// observer.disconnect();
```

### ResizeObserver for Layout Changes

```javascript
// Watch element size changes
const ro = new ResizeObserver((entries) => {
  for (const entry of entries) {
    const { width, height } = entry.contentRect;
    update_layout(width, height);
  }
});

ro.observe(container);
```

---

## 7. VALIDATION PATTERNS

### Type-Safe Number Parsing

```javascript
// Safe parseInt with fallback
function parse_int(value, fallback = 0) {
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? fallback : parsed;
}

// Safe parseFloat with fallback
function parse_float(value, fallback = 0) {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? fallback : parsed;
}
```

### Secure Randomness (CWE-330 Fix)

```javascript
// Use crypto.getRandomValues instead of Math.random for IDs
let counter = (function() {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0] % 10000;
  }
  // Fallback for older browsers
  return Math.floor(Math.random() * 10000);
})();

function generate_id(prefix = 'id') {
  return `${prefix}_${++counter}`;
}
```

### String Validation

```javascript
// Non-empty string check
function is_non_empty_string(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

// Email format validation (basic)
function is_valid_email(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
```

---

## 8. PERFORMANCE PATTERNS

### RequestAnimationFrame for Visual Updates

```javascript
// Batch visual updates to animation frame
let raf_pending = false;

function schedule_update() {
  if (!raf_pending) {
    raf_pending = true;
    requestAnimationFrame(() => {
      update_visuals();
      raf_pending = false;
    });
  }
}
```

### GPU Acceleration Hints

```javascript
// Apply before animation
element.style.willChange = 'transform';
element.style.transform = 'translateZ(0)';

// Remove after animation completes
function on_animation_complete() {
  element.style.willChange = 'auto';
}
```

### Debounced Resize Handlers

```javascript
// Prevent excessive resize calculations
let resize_timer;
window.addEventListener('resize', () => {
  clearTimeout(resize_timer);
  resize_timer = setTimeout(handle_resize, 250);
});
```

### Efficient Event Delegation

```javascript
// Single listener for multiple elements
container.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  
  const action = btn.dataset.action;
  handle_action(action, btn);
});
```

---
