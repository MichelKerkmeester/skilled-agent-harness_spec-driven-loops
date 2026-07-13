---
title: ResizeObserver, Best Practices, Quick Reference & SharedObservers
description: Browser observer APIs for reactive DOM watching, visibility detection, and scroll-triggered behaviors. — ResizeObserver, Best Practices, Quick Reference & SharedObservers.
trigger_phrases:
  - "resizeobserver best practices"
  - "quick reference sharedobservers"
  - "resizeobserver best patterns"
  - "webflow resizeobserver best"
importance_tier: normal
contextType: implementation
version: 3.5.0.4
---

# ResizeObserver, Best Practices, Quick Reference & SharedObservers

Browser observer APIs for reactive DOM watching, visibility detection, and scroll-triggered behaviors. — ResizeObserver, Best Practices, Quick Reference & SharedObservers.

---

## 1. OVERVIEW

### Purpose

ResizeObserver usage and best practices, a quick reference, and the SharedObservers consolidation pattern for reusing one observer across many elements.

### When to Use

Use this reference when implementing or troubleshooting resizeobserver, best practices, quick reference & sharedobservers.

---

## 2. RESIZEOBSERVER

> **Note:** Not currently used in this codebase. Documented for reference.

### When to Use

- Container queries (before native CSS support)
- Canvas/chart resizing
- Custom responsive behavior beyond media queries
- Element-level responsive design

### Basic Pattern

```javascript
/**
 * ResizeObserver for element size changes
 * @param {Element} element - Element to observe
 * @param {ResizeObserverCallback} callback - Handler for size changes
 * @returns {Function} Cleanup function
 */
function observe_resize(element, callback) {
  const observer = new ResizeObserver(callback);
  observer.observe(element);
  
  return () => observer.disconnect();
}

// Usage with debouncing (resize fires frequently)
const debouncedResize = debounce((entries) => {
  entries.forEach(entry => {
    const { width, height } = entry.contentRect;
    console.log(`Element resized: ${width}x${height}`);
  });
}, 100);

const cleanup = observe_resize(container, debouncedResize);
```

---

## 3. BEST PRACTICES

### Always Disconnect

Observers that aren't disconnected continue running and can cause:
- Memory leaks (retained references)
- Unnecessary CPU usage
- Bugs in SPA navigation (stale callbacks)

```javascript
const cleanups = [];

function setup() {
  const observer = new IntersectionObserver(callback);
  observer.observe(element);
  cleanups.push(() => observer.disconnect());
}

// Call on page unload or component destroy
function teardown() {
  cleanups.forEach(fn => fn());
  cleanups.length = 0;
}
```

### Debouncing Callbacks

MutationObserver can fire many times for batched DOM changes:

```javascript
/**
 * Debounce utility for observer callbacks
 */
function debounce(fn, ms) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms);
  };
}

// Usage
const debouncedHandler = debounce((mutations) => {
  console.log('Mutations settled:', mutations.length);
}, 100);

const observer = new MutationObserver(debouncedHandler);
```

### Memory Management

```javascript
/**
 * Memory-safe observer pattern
 * - WeakMap for element -> observer mapping
 * - Automatic cleanup when element is garbage collected
 */
const observerMap = new WeakMap();

function observe(element, callback) {
  // Prevent duplicate observers
  if (observerMap.has(element)) {
    return observerMap.get(element);
  }

  const observer = new IntersectionObserver(callback);
  observer.observe(element);
  observerMap.set(element, observer);

  return observer;
}

function unobserve(element) {
  const observer = observerMap.get(element);
  if (observer) {
    observer.disconnect();
    observerMap.delete(element);
  }
}
```

### Combining Observers

When using both MutationObserver and IntersectionObserver:

```javascript
/**
 * Combined observer pattern for dynamic content
 * 1. IntersectionObserver handles visibility
 * 2. MutationObserver handles DOM changes that add new elements
 */
function setup_combined_observers(container) {
  const cleanups = [];

  const intersectionObserver = new IntersectionObserver(handleVisibility);
  
  const mutationObserver = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE && node.matches('.observable')) {
          intersectionObserver.observe(node);
        }
      });
    });
  });

  container.querySelectorAll('.observable').forEach(el => {
    intersectionObserver.observe(el);
  });

  mutationObserver.observe(container, { childList: true, subtree: true });

  cleanups.push(
    () => intersectionObserver.disconnect(),
    () => mutationObserver.disconnect()
  );

  return () => cleanups.forEach(fn => fn());
}
```

---

## 4. QUICK REFERENCE

| Observer | Events | Common Options |
|----------|--------|----------------|
| **MutationObserver** | DOM changes | `attributes`, `childList`, `subtree`, `attributeFilter` |
| **IntersectionObserver** | Visibility changes | `root`, `rootMargin`, `threshold` |
| **ResizeObserver** | Size changes | (element only) |

| Pattern | When to Use |
|---------|-------------|
| `attributeFilter` | Only care about specific attributes |
| `rootMargin` | Offset trigger point from viewport edge |
| `threshold: [0, 1]` | Know when element enters AND fully visible |
| RAF batching | Prevent jank from rapid callbacks |
| Cleanup arrays | SPA-safe resource management |

---

## 5. SHAREDOBSERVERS CONSOLIDATION PATTERN

### Overview

When a page has many scripts creating individual IntersectionObserver instances with the same options, the browser creates separate observer objects. The **SharedObservers** pattern consolidates these into a shared registry (`window.SharedObservers`) that multiplexes callbacks through fewer observer instances.

**Implemented in:** `shared_observers.js` (global script, loaded on all pages)

### API Surface

```javascript
// Primary: observe with shared observer (returns unobserve cleanup function)
const unobserve = window.SharedObservers.observe(element, callback, options);

// One-time observation (auto-unobserves after first intersection)
const unobserve = window.SharedObservers.observeOnce(element, callback, options);

// Convenience presets with predefined thresholds/margins:
window.SharedObservers.visibility.observe(element, callback);  // threshold: 0
window.SharedObservers.lazy.observe(element, callback);        // rootMargin: '200px'
window.SharedObservers.full.observe(element, callback);        // threshold: 1.0
```

**Key concept:** Options are serialized to a config key (`JSON.stringify`). All observers with identical options share a single `IntersectionObserver` instance.

### Migration Pattern (Single Element)

When migrating a script from raw `IntersectionObserver` to `SharedObservers`:

```javascript
// ─── BEFORE: Raw IntersectionObserver ───
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) handle_visible(entry);
    else handle_hidden(entry);
  });
}, { threshold: [0, 0.1, 0.25], rootMargin: '20% 0px 20% 0px' });

observer.observe(player);
// Cleanup: observer.disconnect();

// ─── AFTER: SharedObservers with fallback ───
const viewport_handler = (entry) => {
  if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
    handle_visible(entry);
  } else if (!entry.isIntersecting) {
    handle_hidden(entry);
  }
};

const viewport_options = { threshold: [0, 0.1, 0.25], rootMargin: '20% 0px 20% 0px' };

if (window.SharedObservers) {
  const unobserve = window.SharedObservers.observe(player, viewport_handler, viewport_options);
  add_cleanup(unobserve);  // Store for teardown
} else {
  // Fallback: raw IntersectionObserver if SharedObservers not loaded
  const observer = new IntersectionObserver(
    (entries) => entries.forEach(viewport_handler),
    viewport_options,
  );
  observer.observe(player);
  add_cleanup(() => observer.disconnect());
}
```

**Key points:**
- **Always provide fallback** — SharedObservers may not be loaded yet (script order)
- **Extract callback** — The handler function works with both paths (single entry)
- **Cleanup function** — `SharedObservers.observe()` returns an unobserve function (same interface as cleanup array pattern)

### Migration Pattern (Multiple Elements)

When observing multiple elements (e.g., TOC sections), collect unobserve functions:

```javascript
// ─── From table_of_content.js ───
function create_observer() {
  const root_margin = `${config.root_margin_top} 0px ${config.root_margin_bottom} 0px`;
  const observer_options = { root: null, rootMargin: root_margin, threshold: [0] };

  if (window.SharedObservers) {
    const unobserve_fns = [];
    sections.forEach((section) => {
      unobserve_fns.push(
        window.SharedObservers.observe(section, handle_intersection, observer_options)
      );
    });
    // Wrap cleanup in disconnect-compatible interface
    observer = { disconnect: () => unobserve_fns.forEach((fn) => fn()) };
  } else {
    observer = new IntersectionObserver(handle_intersection, observer_options);
    sections.forEach((section) => observer.observe(section));
  }
}
```

**Key insight:** Wrap unobserve functions in a `{ disconnect: () => ... }` object to maintain compatibility with existing teardown code that calls `observer.disconnect()`.

### When to Use SharedObservers

| Scenario | Use SharedObservers | Use Raw IO |
|----------|:-------------------:|:----------:|
| Multiple scripts observe with same options | Yes | - |
| Global script loaded on all pages | Yes | - |
| Single script, unique options | - | Yes |
| No dependency on global load order | - | Yes |
| Convenience presets (lazy, visibility) | Yes | - |

### Benefits

- **Fewer observer instances** — Scripts with matching options share one browser observer
- **Consistent cleanup API** — All paths return an unobserve function
- **Presets** — `visibility`, `lazy`, `full` presets reduce boilerplate
- **No breaking change** — Fallback to raw IO preserves behavior when SharedObservers isn't available

---

## 6. RELATED RESOURCES

### Reference Files
- [implementation_workflows.md](../implementation_workflows/condition_based_waiting.md) - Condition-based waiting patterns using observers
- [webflow_patterns.md](../webflow_patterns/overview_limits_and_collection_lists.md) - Collection list patterns that use MutationObserver
- [animation_workflows.md](../animation_workflows/overview_decision_tree_and_css.md) - IntersectionObserver for scroll-triggered animations
- [performance_patterns.md](../performance_patterns/overview_and_checklist.md) - Lazy loading with IntersectionObserver
- `shared_observers.js` (global) - SharedObservers registry implementation
