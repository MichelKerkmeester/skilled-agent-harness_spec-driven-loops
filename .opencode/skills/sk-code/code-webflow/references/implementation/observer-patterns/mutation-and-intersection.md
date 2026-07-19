---
title: Observer Patterns Reference
description: Browser observer APIs for reactive DOM watching, visibility detection, and scroll-triggered behaviors.
trigger_phrases:
  - "webflow observer patterns"
  - "mutationobserver cms content"
  - "intersectionobserver visibility"
  - "resizeobserver cleanup"
importance_tier: normal
contextType: implementation
version: 3.5.0.4
---

# Observer Patterns Reference

Browser observer APIs for reactive DOM watching, visibility detection, and scroll-triggered behaviors.

---

## 1. OVERVIEW

### Purpose
Production-tested patterns for MutationObserver, IntersectionObserver, and ResizeObserver in Webflow projects with proper cleanup and performance optimization.

### When to Use (Observers vs Polling)

| Approach | Use When | Performance |
|----------|----------|-------------|
| **MutationObserver** | Watching DOM changes (attributes, children, text) | Event-driven, efficient |
| **IntersectionObserver** | Detecting element visibility/scroll position | Hardware-accelerated |
| **Polling (setInterval)** | External state changes not reflected in DOM | Resource-intensive, avoid |
| **ResizeObserver** | Tracking element size changes | Not currently used in codebase |

**Rule of thumb:** If watching the DOM, use an observer. If watching non-DOM state, consider event listeners first.

---

## 2. MUTATIONOBSERVER

### When to Use

- CMS content that loads dynamically after page render
- Third-party widgets that modify the DOM
- Attribute changes that trigger business logic (e.g., status indicators)
- Webflow interactions that change data attributes

### Basic Pattern

```javascript
/**
 * Basic MutationObserver setup
 * @param {Element} target - Element to observe
 * @param {MutationCallback} callback - Handler for mutations
 * @param {MutationObserverInit} options - Observer configuration
 * @returns {Function} Cleanup function
 */
function observe_mutations(target, callback, options = {}) {
  const observer = new MutationObserver(callback);
  
  observer.observe(target, {
    attributes: true,
    attributeFilter: [],    // Empty array = watch all attributes
    childList: false,
    subtree: false,
    characterData: false,
    ...options
  });
  
  return () => observer.disconnect();
}
```

### CMS Content Observation

From `nav_notifications.js` - Watching office hours indicator for status changes:

```javascript
/**
 * Observe a status indicator element for attribute changes
 * Used when CMS or external scripts update element state
 * 
 * @example
 * // HTML: <div data-office-hours="indicator" data-status="open">
 * observeOfficeHours();
 */
function observeOfficeHours() {
  const indicator = document.querySelector('[data-office-hours="indicator"]');
  if (!indicator) {
    console.log('Office hours indicator not found');
    return;
  }

  const getStatus = () => {
    const status = indicator.getAttribute('data-status');
    return (status === 'open' || status === 'closed') ? status : null;
  };

  let currentStatus = getStatus();

  const observer = new MutationObserver(() => {
    const newStatus = getStatus();
    if (newStatus !== currentStatus) {
      currentStatus = newStatus;
      console.log(`Status changed: ${newStatus}`);
      updateVisibility();
    }
  });

  observer.observe(indicator, {
    attributes: true,
    attributeFilter: ['data-status'],  // Only watch this specific attribute
  });

  state.cleanups.push(() => observer.disconnect());
}
```

**Key patterns:**
- **attributeFilter**: Only watch specific attributes to reduce callback frequency
- **Initial state capture**: Get the value before observing to detect actual changes
- **Cleanup storage**: Store disconnect function for proper teardown

### Cleanup Pattern

```javascript
/**
 * Cleanup pattern for MutationObserver
 * Store cleanup functions in a state array for batch disposal
 */
const state = {
  cleanups: [],
};

function init() {
  const observer = new MutationObserver(handleMutation);
  observer.observe(element, { attributes: true });
  state.cleanups.push(() => observer.disconnect());
}

function destroy() {
  state.cleanups.forEach(cleanup => cleanup());
  state.cleanups = [];
}
```

---

## 3. INTERSECTIONOBSERVER

### When to Use

- Scroll-based active states (Table of Contents, navigation highlighting)
- Lazy loading images/components
- Triggering animations when elements enter viewport
- Infinite scroll pagination
- Analytics (tracking element visibility)

### Basic Pattern

```javascript
/**
 * Basic IntersectionObserver setup
 * @param {Element[]} elements - Elements to observe
 * @param {IntersectionObserverCallback} callback - Handler for intersections
 * @param {IntersectionObserverInit} options - Observer configuration
 * @returns {IntersectionObserver} The observer instance
 */
function observe_intersections(elements, callback, options = {}) {
  const observer = new IntersectionObserver(callback, {
    root: null,           // null = viewport, or specify scroll container
    rootMargin: '0px',
    threshold: 0,
    ...options
  });

  elements.forEach(el => observer.observe(el));
  
  return observer;
}
```

### Multiple Thresholds

```javascript
/**
 * Multiple thresholds for progressive visibility tracking
 * Useful for parallax effects or visibility percentages
 */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const visibility = Math.round(entry.intersectionRatio * 100);
    entry.target.style.setProperty('--visibility', visibility);
  });
}, {
  threshold: [0, 0.25, 0.5, 0.75, 1]  // Fire at 0%, 25%, 50%, 75%, 100%
});
```

### Animation Start/Stop Pattern (0.1 Threshold)

Use a 0.1 (10%) threshold for animation visibility gates. This is early enough to start animations before the element is fully visible, giving time for preparation.

```javascript
/**
 * Animation visibility control with 0.1 threshold
 * Used for video autoplay, Swiper pagination, scroll-triggered animations
 *
 * WHY 0.1? Early enough for animation preparation without wasting resources
 * on barely-visible elements
 */
function observe_autoplay(elements, callbacks = {}) {
  const { on_visible = () => {}, on_hidden = () => {} } = callbacks;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // Check both intersection AND ratio to avoid edge cases
      if (entry.isIntersecting && entry.intersectionRatio >= 0.1) {
        on_visible(entry);
      } else if (!entry.isIntersecting) {
        on_hidden(entry);
      }
    });
  }, {
    root: null,
    rootMargin: '0px',
    threshold: [0, 0.1]  // Fire at 0% (exit) and 10% (enter)
  });

  elements.forEach(el => observer.observe(el));
  return observer;
}

// Example: Video autoplay control
const videos = document.querySelectorAll('video[autoplay]');
observe_autoplay(videos, {
  on_visible: (entry) => entry.target.play(),
  on_hidden: (entry) => entry.target.pause(),
});

// Example: Swiper autoplay control
const swipers = document.querySelectorAll('.swiper');
observe_autoplay(swipers, {
  on_visible: (entry) => entry.target.swiper?.autoplay?.start(),
  on_hidden: (entry) => entry.target.swiper?.autoplay?.stop(),
});
```

**Threshold Array Examples:**

| Threshold | Use Case |
|-----------|----------|
| `[0, 0.1]` | Animation start/stop (early trigger + exit detection) |
| `[0, 0.1, 0.25]` | Progressive loading (lazy → prepare → activate) |
| `[0, 0.25, 0.5, 0.75, 1]` | Parallax effects, visibility percentage tracking |
| `[0]` | Simple lazy loading (trigger when any pixel visible) |
| `[1]` | Trigger only when fully visible |

See [performance-patterns.js](../../assets/patterns/performance-patterns.js) for production-ready `observe_autoplay()` utility.

### rootMargin for Offset

From `table_of_content.js` - Using rootMargin to create a "detection zone":

```javascript
/**
 * rootMargin shrinks the effective viewport for intersection detection
 * 
 * Format: "top right bottom left" (like CSS margin)
 * Negative values = shrink viewport
 * Positive values = expand viewport
 * 
 * This creates a detection band in the upper portion of the viewport:
 * - Top 10% ignored (header area)
 * - Bottom 60% ignored (focus on upper content)
 */
const DEFAULT_CONFIG = {
  root_margin_top: "-10%",
  root_margin_bottom: "-60%",
};

function create_observer() {
  const root_margin = `${config.root_margin_top} 0px ${config.root_margin_bottom} 0px`;

  observer = new IntersectionObserver(handle_intersection, {
    root: null,
    rootMargin: root_margin,
    threshold: [0],
  });

  sections.forEach(section => observer.observe(section));
}
```

**Visual representation:**
```
+------------------------+
|   Ignored (10%)        |  <- root_margin_top: "-10%"
+------------------------+
|                        |
|   Detection Zone       |  <- Elements trigger here
|   (30% of viewport)    |
|                        |
+------------------------+
|                        |
|   Ignored (60%)        |  <- root_margin_bottom: "-60%"
|                        |
+------------------------+
```

### RAF Batching for Performance

From `table_of_content.js` - Batching DOM updates with requestAnimationFrame:

```javascript
let visible_sections = {};
let raf_pending = false;

/**
 * Handle intersection entries with RAF batching
 * Prevents layout thrashing from rapid intersection callbacks
 * 
 * @param {IntersectionObserverEntry[]} entries
 */
function handle_intersection(entries) {
  // 1. Update state (cheap)
  entries.forEach(entry => {
    const id = entry.target.id;
    if (entry.isIntersecting) {
      visible_sections[id] = true;
    } else {
      delete visible_sections[id];
    }
  });

  // 2. Batch DOM updates with RAF (prevents multiple reflows)
  if (!raf_pending) {
    raf_pending = true;
    requestAnimationFrame(() => {
      const new_active = determine_active_section();
      update_toc_highlight(new_active);
      raf_pending = false;
    });
  }
}
```

**Why RAF batching matters:**
- IntersectionObserver can fire multiple times per frame
- Each DOM update causes browser reflow
- RAF consolidates updates to once per frame (60fps)
- Results in smooth, jank-free scrolling

### Cleanup Pattern

```javascript
let observer = null;

function init() {
  observer = new IntersectionObserver(handleIntersection, options);
  elements.forEach(el => observer.observe(el));
}

function destroy() {
  if (observer) {
    observer.disconnect();  // Stops observing all elements
    observer = null;
  }
}

// Alternative: stop observing specific element
function unobserve_element(element) {
  if (observer) {
    observer.unobserve(element);
  }
}
```

---

