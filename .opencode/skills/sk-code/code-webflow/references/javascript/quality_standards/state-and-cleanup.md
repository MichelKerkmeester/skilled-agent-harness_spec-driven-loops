---
title: State Management & Cleanup/Destroy Patterns
description: "Defensive code patterns for Webflow JS: CDN-safe initialization (MANDATORY), DOM safety, error handling, async, observers, validation, performance, animation quality, state management, cleanup/destroy, shared document listeners, WeakMap/WeakSet caching. Includes JS naming and initialization-pattern enforcement." — State Management & Cleanup/Destroy Patterns.
importance_tier: normal
contextType: implementation
version: 3.5.0.7
---

# State Management & Cleanup/Destroy Patterns

## 9. ANIMATION QUALITY PATTERNS (JS SIDE)

### Quick Decision Tree

```
Need animation?
├─> Can CSS express it (transform/opacity)?
│   └─> Use CSS transitions/keyframes
└─> Requires sequencing/scroll/in-view logic?
    └─> Use Motion.dev
```

### Essential Patterns

**CSS animations (first choice):**
- Use GPU-accelerated properties only (transform, opacity)
- Add `prefers-reduced-motion` support (MANDATORY)
- Timing: 200-400ms for most interactions

**Motion.dev (for complexity):**
- Library loading: Global ES module import in global.html
- Retry pattern: Check `window.Motion` with setTimeout fallback
- Standardized easing: `[0.22, 1, 0.36, 1]` (ease-out), `[0.16, 1, 0.3, 1]` (expo-out)
- Performance: Remove `will-change` in `onComplete`

> **Note:** CSS-side animation quality (will-change management, GPU-accelerated property rules, easing standards, fluid typography) is in [`../../css/quality_standards/patterns-and-naming-enforcement.md`](../../css/quality_standards/patterns-and-naming-enforcement.md).

### Complete Animation Guide

**For implementation, debugging, and testing:**
- **Decision tree and patterns:** [animation_workflows.md](../../implementation/animation_workflows/overview-decision-tree-and-css.md)
- **Complete reference:** [animation_workflows.md](../../implementation/animation_workflows/overview-decision-tree-and-css.md) contains all animation policy, rationale, and implementation details

---

## 10. STATE MANAGEMENT PATTERNS

### Module-Level State with Cleanup

```javascript
let is_initialized = false;
let cleanup_handlers = [];

function init() {
  if (is_initialized) return;
  is_initialized = true;
  
  // Setup with cleanup tracking
  const handler = () => { /* ... */ };
  window.addEventListener('resize', handler);
  cleanup_handlers.push(() => window.removeEventListener('resize', handler));
}

function cleanup() {
  cleanup_handlers.forEach((fn) => fn());
  cleanup_handlers = [];
  is_initialized = false;
}
```

### Data Attribute State

```javascript
// Use data attributes for element state
function set_status(element, value) {
  element.setAttribute('data-status', value);
}

function get_status(element) {
  return element.getAttribute('data-status');
}

// CSS can target state
// [data-status="loading"] { opacity: 0.5; }
// [data-status="ready"] { opacity: 1; }
```

### Public API Exposure

```javascript
// Expose controlled API on window
window.ComponentName = {
  init,
  refresh,
  cleanup,
  debug: (on) => { CONFIG.debug = Boolean(on); },
};
```

---

## 11. CLEANUP/DESTROY PATTERNS

Proper resource cleanup prevents memory leaks and ensures components can be safely reinitialized.

### Component Cleanup Pattern (COPY EXACTLY)

```javascript
/* ─────────────────────────────────────────────────────────────
   CLEANUP PATTERN - Comprehensive resource cleanup
──────────────────────────────────────────────────────────────── */
let observer = null;
let handler = null;
let interval = null;
const instances = new Map();

function cleanup() {
  // 1. Disconnect observers
  if (observer) {
    observer.disconnect();
    observer = null;
  }

  // 2. Remove event listeners (must have stored reference)
  if (handler) {
    document.removeEventListener('click', handler);
    handler = null;
  }

  // 3. Clear intervals and timeouts
  if (interval) {
    clearInterval(interval);
    interval = null;
  }

  // 4. Clear instance collections
  instances.clear();

  // 5. Reset initialization flag (allows reinit)
  window[INIT_FLAG] = false;
}

// Expose cleanup on public API
window.ComponentName = {
  init,
  cleanup,
  refresh: () => { cleanup(); init(); },
};
```

### What Must Be Cleaned Up

| Resource Type            | Cleanup Method                       | Why                                           |
| ------------------------ | ------------------------------------ | --------------------------------------------- |
| **IntersectionObserver** | `observer.disconnect()`              | Continues firing callbacks if not stopped     |
| **MutationObserver**     | `observer.disconnect()`              | Watches DOM indefinitely                      |
| **ResizeObserver**       | `observer.disconnect()`              | Fires on every size change                    |
| **Event Listeners**      | `removeEventListener(type, handler)` | Keeps reference to handler function           |
| **setInterval**          | `clearInterval(intervalId)`          | Runs forever until cleared                    |
| **setTimeout**           | `clearTimeout(timeoutId)`            | May fire after component destroyed            |
| **Map/Set instances**    | `collection.clear()`                 | Holds references preventing garbage collection|

### Cleanup Timing

```javascript
// Pattern: Track all cleanups in array
let cleanups = [];

function setup() {
  // Track each resource for cleanup
  const resizeHandler = () => update_layout();
  window.addEventListener('resize', resizeHandler);
  cleanups.push(() => window.removeEventListener('resize', resizeHandler));

  const io = new IntersectionObserver(handle_visibility);
  elements.forEach((el) => io.observe(el));
  cleanups.push(() => io.disconnect());

  const intervalId = setInterval(poll_status, 1000);
  cleanups.push(() => clearInterval(intervalId));
}

function cleanup() {
  cleanups.forEach((fn) => fn());
  cleanups = [];
}
```

### Webflow Page Transition Cleanup

```javascript
// Re-run cleanup on Webflow page transitions
document.addEventListener('DOMContentLoaded', () => {
  // Cleanup previous state before reinit
  cleanup();
});

// Or use Webflow's built-in event
if (window.Webflow) {
  window.Webflow.ready(() => {
    cleanup();
    init();
  });
}
```

---

