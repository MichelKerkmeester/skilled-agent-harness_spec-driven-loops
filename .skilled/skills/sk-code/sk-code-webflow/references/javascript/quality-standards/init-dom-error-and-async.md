---
title: "Webflow JavaScript Quality Standards"
description: "Defensive code patterns for Webflow JS: CDN-safe initialization (MANDATORY), DOM safety, error handling, async, observers, validation, performance, animation quality, state management, cleanup/destroy, shared document listeners, WeakMap/WeakSet caching. Includes JS naming and initialization-pattern enforcement."
trigger_phrases:
  - "webflow javascript quality standards"
  - "cdn safe initialization"
  - "init flag webflow"
  - "webflow push pattern"
  - "weakmap caching webflow"
  - "shared document listener"
  - "cleanup destroy pattern"
importance_tier: normal
contextType: implementation
version: 3.5.0.7
---

# Webflow JavaScript Quality Standards

Defensive JavaScript quality patterns for reliable Webflow component initialization and runtime behavior.

---

## 1. OVERVIEW

### Purpose
Code quality patterns for frontend development covering initialization, error handling, validation, async operations, and performance.

> See [`../style-guide/overview-naming-and-structure.md`](../style-guide/overview-naming-and-structure.md) for naming conventions, formatting, and file structure. See [`../../shared/cross-language-rules.md`](../../shared/cross-language-rules.md) for cross-language rules. This file covers JavaScript quality patterns and JS-specific enforcement.

### Core Principle
Defensive code prevents runtime errors. Quality patterns ensure reliability.

### Key Sources
- Section 2 - CDN-safe initialization pattern (MANDATORY for all components)
- Sections 3-8 - Safety and error handling patterns
- Sections 10-13 - Cleanup, shared listeners, and WeakMap caching patterns
- [animation_workflows.md](../../implementation/animation-workflows/overview-decision-tree-and-css.md) - Complete animation implementation guide
- [./style-guide.md](../style-guide/overview-naming-and-structure.md) - Naming conventions, file structure, commenting rules

### When to Use
- Writing new components (initialization pattern)
- Adding error handling and validation
- Implementing async operations
- Optimizing performance
- Managing component lifecycle (cleanup/destroy)
- Handling events across dynamic elements (shared listeners)
- Caching DOM element state (WeakMap patterns)

---

## 2. INITIALIZATION PATTERN (CDN-SAFE)

### The Standard Pattern (COPY EXACTLY)

**Every component MUST use this pattern:**

```javascript
/* ─────────────────────────────────────────────────────────────
   INITIALIZE
──────────────────────────────────────────────────────────────── */
const INIT_FLAG = '__componentNameCdnInit';  // Unique per component
const INIT_DELAY_MS = 50;                     // Adjust per component

function init_component() {
  // Your initialization code here
}

const start = () => {
  // Guard: Prevent double initialization
  if (window[INIT_FLAG]) return;
  window[INIT_FLAG] = true;

  // If DOM already loaded, delay before initializing
  if (document.readyState !== 'loading') {
    setTimeout(init_component, INIT_DELAY_MS);
    return;
  }

  // Otherwise, wait for DOMContentLoaded with delay
  document.addEventListener(
    'DOMContentLoaded',
    () => setTimeout(init_component, INIT_DELAY_MS),
    { once: true }
  );
};

// Prefer Webflow.push, fallback to immediate start
if (window.Webflow?.push) {
  window.Webflow.push(start);
} else {
  start();
}
```

### Why This Pattern Exists

| Requirement              | Implementation                              | Why Needed                                                     |
| ------------------------ | ------------------------------------------- | -------------------------------------------------------------- |
| **Guard Flag**           | `if (window[INIT_FLAG]) return;`            | Prevents double initialization during Webflow page transitions |
| **Delayed Execution**    | `setTimeout(init_component, INIT_DELAY_MS)` | Ensures DOM and dependencies (Motion.dev) fully ready          |
| **Webflow.push Support** | `window.Webflow.push(start)`                | Integrates with Webflow's native queueing system               |
| **Once-Only Listener**   | `{ once: true }`                            | Prevents memory leaks from duplicate listeners                 |

> **Cross-stack motion.dev reference**: For Motion install modes, API availability, and non-Webflow integration patterns, see [`../../animation/quick-start.md`](../../animation/quick-start.md) and [`../../animation/integration-patterns.md`](../../animation/integration-patterns.md). The guard, delay, and `Webflow.push` rules above remain Webflow-specific.

### When to Adjust INIT_DELAY_MS

| Delay              | When to Use                         | Example                                     |
| ------------------ | ----------------------------------- | ------------------------------------------- |
| **0ms**            | No dependencies, simple DOM queries | Copyright year updater                      |
| **50ms** (default) | Standard components                 | Forms, accordions, navigation               |
| **100ms+**         | Heavy dependencies                  | Hero animations (Motion.dev), video players |

---

## 3. DOM SAFETY PATTERNS

### Element Existence Checks

```javascript
// Guard early for required elements
if (!btn || !dropdown) continue;
if (!video) return;

// Multiple elements check
const elements = document.querySelectorAll('.item');
if (elements.length === 0) return;
```

### Optional Chaining for Safe Access

```javascript
// Safe property access
window.Webflow?.push
element.classList?.contains('active')
field?.getAttribute('type')

// Safe method calls
video?.pause?.()
observer?.disconnect?.()
```

### Node Type Validation

```javascript
// Validate element nodes (nodeType 1 = Element)
function is_element(node) {
  return node && node.nodeType === 1;
}

// Use in MutationObserver callbacks
mutation.addedNodes.forEach((node) => {
  if (is_element(node)) {
    // Safe to use as element
  }
});
```

### Chained Fallback Pattern

```javascript
// Try preferred selector, fallback to parent
return field.closest(SELECTOR) || field.parentElement;

// Multiple fallback chain
const container = element.closest('.wrapper') 
  || element.closest('.container') 
  || element.parentElement;
```

---

## 4. ERROR HANDLING PATTERNS

### Silent Catch for Non-Critical Operations

```javascript
// Pause/play may fail if video not ready - safe to ignore
try { video.pause(); } catch (_) { }

// Focus may fail on hidden elements
try { input.focus(); } catch (_) { }
```

### Storage with Safari Private Mode Fallback

```javascript
// localStorage throws in Safari private browsing
function get_storage(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch { return null; }
}

function set_storage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch { return false; }
}
```

### Library Loading with Retry

```javascript
// Check library availability with retry
if (typeof Hls === 'undefined') {
  console.warn('HLS.js not loaded yet, retrying...');
  setTimeout(init_function, 100);
  return;
}

// Motion.dev availability check
if (!window.Motion) {
  console.warn('Motion.dev not loaded, retrying...');
  setTimeout(init_animations, 100);
  return;
}
```

### Debug Mode Pattern

```javascript
const CONFIG = { debug: false };

function log(...args) {
  if (CONFIG.debug) console.log('[Component]', ...args);
}

// Enable via public API
window.ComponentName = {
  debug: (on) => { CONFIG.debug = Boolean(on); },
};
```

---

## 5. ASYNC PATTERNS

### Safe Play with Promise Handling

```javascript
// Video play returns promise in modern browsers
function safe_play(video) {
  const p = video.play();
  if (p && typeof p.then === 'function') {
    p.catch(() => {}); // Ignore autoplay restrictions
  }
}
```

### Debounce Utility

```javascript
// Standard debounce with cancel support
const debounce = (fn, delay = 300) => {
  let timer;
  const wrapped = (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
  wrapped.cancel = () => clearTimeout(timer);
  return wrapped;
};

// Usage
const handle_resize = debounce(() => {
  recalculate_layout();
}, 250);
```

### Throttle Utility

```javascript
// Throttle for scroll/resize events
const throttle = (fn, limit = 100) => {
  let waiting = false;
  return (...args) => {
    if (!waiting) {
      fn(...args);
      waiting = true;
      setTimeout(() => { waiting = false; }, limit);
    }
  };
};
```

---
