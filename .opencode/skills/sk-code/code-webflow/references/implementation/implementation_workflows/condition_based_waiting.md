---
title: Implementation Workflows - Phase 1
description: Three specialized workflows for writing robust frontend code with proper timing, validation, and cache management.
trigger_phrases:
  - "webflow implementation workflows"
  - "condition based waiting"
  - "frontend timing validation"
  - "cache management workflow"
importance_tier: normal
contextType: implementation
version: 3.5.0.10
---

# Implementation Workflows - Phase 1

Three specialized workflows for writing robust frontend code with proper timing, validation, and cache management.

---

## 1. OVERVIEW

### Purpose
Specialized workflows for writing robust frontend code with proper timing, validation, and cache management.

### Prerequisites
Follow code quality standards for all implementations:
- **Naming:** Use `snake_case` for functions/variables, semantic prefixes (`is_`, `has_`, `get_`, etc.)
- **Initialization:** Use CDN-safe pattern with guard flags and delays
- **Animation:** CSS first, Motion.dev for complexity - see [animation_workflows.md](../animation_workflows/overview_decision_tree_and_css.md)
- **Webflow:** Collection list patterns, async rendering - see [webflow_patterns.md](../webflow_patterns/overview_limits_and_collection_lists.md)
- See [code_quality_standards.md](../../javascript/quality_standards/init_dom_error_and_async.md) for complete standards

> **Cross-stack motion.dev reference**: For Motion API and integration guidance that is not Webflow-specific, see [`../../animation/quick_start.md`](../../animation/quick_start.md) and [`../../animation/integration_patterns.md`](../../animation/integration_patterns.md). Webflow lifecycle, CDN timing, and Designer constraints remain covered by the Webflow implementation guides linked here.

### When to Use
- Handling async operations and race conditions
- Validating data and inputs
- Managing CDN assets and caching

---

## 2. CONDITION-BASED WAITING

**When to use**: DOM elements not ready, async libraries loading, race conditions, timing issues

### Core Principle

Wait for the actual condition you care about, not a guess about how long it takes.

```javascript
// ❌ BEFORE: Guessing at timing
setTimeout(() => {
  const video = document.querySelector('[video-hero]');
  initializeVideo(video); // Might be null!
}, 100); // Why 100ms? Will it be enough on slow devices?

// ✅ AFTER: Waiting for condition
wait_for_element('[video-hero]').then(video => {
  init_video(video); // Guaranteed to exist
});
```

### Common Patterns

| Scenario | Arbitrary Delay | Condition-Based | Why Better |
|----------|----------------|-----------------|------------|
| **Wait for DOM element** | `setTimeout(() => querySelector(), 50)` | `wait_for_element(selector)` | Works regardless of load speed |
| **Wait for external library** | `setTimeout(() => new Hls(), 200)` | `wait_for_library('Hls')` | CDN speed varies |
| **Wait for image load** | `setTimeout(() => useImage(), 1000)` | `img.onload` or `wait_for_image_load(img)` | Image size varies |
| **Wait for animation end** | `setTimeout(() => next(), 500)` | `element.addEventListener('transitionend')` | Animation duration might change |
| **Wait for video ready** | `setTimeout(() => video.play(), 2000)` | `video.addEventListener('canplay')` | Network speed varies |
| **Wait for font load** | `setTimeout(() => measure(), 100)` | `document.fonts.ready` | Font loading varies |

### Implementation Patterns

#### Pattern 1: Wait for DOM Element

```javascript
async function wait_for_element(selector, timeout = 5000) {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const element = document.querySelector(selector);
    if (element) return element;

    // Check every 50ms
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  throw new Error(`Element ${selector} not found after ${timeout}ms`);
}

// Usage
wait_for_element('[page-loader]')
  .then(loader => {
    // Element guaranteed to exist
    init_page_loader(loader);
  })
  .catch(error => {
    console.error('Page loader element not found:', error);
  });
```

#### Pattern 2: Wait for External Library

```javascript
async function wait_for_library(global_name, timeout = 10000) {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    if (typeof window[global_name] !== 'undefined') {
      return window[global_name];
    }

    await new Promise(resolve => setTimeout(resolve, 50));
  }

  throw new Error(`Library ${global_name} not loaded after ${timeout}ms`);
}

// Usage
wait_for_library('Hls')
  .then(Hls => {
    console.log('HLS.js loaded, initializing video...');
    init_video(Hls);
  })
  .catch(error => {
    console.error('HLS.js failed to load:', error);
    // Fallback to native video
    init_fallback_video();
  });
```

#### Pattern 3: Wait for Image Load

```javascript
function wait_for_image_load(img) {
  return new Promise((resolve, reject) => {
    if (img.complete) {
      // Image already loaded
      resolve(img);
    } else {
      img.addEventListener('load', () => resolve(img));
      img.addEventListener('error', () => reject(new Error('Image failed to load')));
    }
  });
}

// Usage
const img = document.querySelector('[hero-image]');
wait_for_image_load(img)
  .then(loaded_img => {
    const width = loaded_img.offsetWidth; // Guaranteed to have dimensions
    calculate_layout(width);
  })
  .catch(error => {
    console.error('Image load failed:', error);
    use_default_layout();
  });
```

#### Pattern 4: Wait for Animation End

```javascript
function wait_for_transition_end(element, property = null) {
  return new Promise(resolve => {
    function handler(event) {
      // If property specified, only resolve for that property
      if (property && event.propertyName !== property) return;

      element.removeEventListener('transitionend', handler);
      resolve(event);
    }

    element.addEventListener('transitionend', handler);
  });
}

// Usage
element.classList.add('fade-out');
await wait_for_transition_end(element, 'opacity');
element.remove(); // Animation guaranteed complete
```

**See also:** [animation_workflows.md](../animation_workflows/overview_decision_tree_and_css.md) - Complete animation implementation guide including CSS patterns, Motion.dev integration, and performance optimization.

#### Pattern 5: DOM Content Ready

```javascript
function dom_ready() {
  return new Promise(resolve => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', resolve);
    } else {
      // DOM already ready
      resolve();
    }
  });
}

// Usage
dom_ready().then(() => {
  console.log('DOM ready, initializing...');
  init_app();
});
```

#### Pattern 6: RAF Loop with Throttling

Use requestAnimationFrame loops for smooth animations. RAF auto-throttles to ~1fps in background tabs - no manual visibility management needed.

```javascript
/**
 * Create a throttled requestAnimationFrame loop
 * RAF natively runs at ~60fps (~16ms), but can be throttled for less critical animations
 *
 * TIMING:
 * - 0ms (default): RAF native ~60fps, ideal for smooth animations
 * - 64ms: ~15fps, good for particle effects or secondary animations
 *
 * BROWSER INSIGHT: RAF auto-throttles to ~1fps in background tabs
 * No need for manual document.hidden checks!
 */
function create_raf_loop(callback, throttle_ms = 0) {
  let raf_id = null;
  let running = false;
  let last_time = 0;

  function tick(timestamp) {
    if (!running) return;

    if (throttle_ms > 0) {
      const elapsed = timestamp - last_time;
      if (elapsed < throttle_ms) {
        raf_id = requestAnimationFrame(tick);
        return;
      }
      last_time = timestamp;
    }

    callback(timestamp);
    raf_id = requestAnimationFrame(tick);
  }

  return {
    start() {
      if (running) return;
      running = true;
      last_time = 0;
      raf_id = requestAnimationFrame(tick);
    },
    stop() {
      running = false;
      if (raf_id !== null) {
        cancelAnimationFrame(raf_id);
        raf_id = null;
      }
    },
    get running() { return running; }
  };
}

// Usage: Smooth animation loop (RAF native ~60fps)
const animation_loop = create_raf_loop((timestamp) => {
  update_animation(timestamp);
});

animation_loop.start();
// Later...
animation_loop.stop();

// Usage: Throttled particle system (~15fps)
const particle_loop = create_raf_loop((timestamp) => {
  update_particles(timestamp);
}, 64);  // 64ms = ~15fps
```

See [performance_patterns.js](../../assets/patterns/performance_patterns.js) for production-ready RAF utilities.

### Rules

**ALWAYS:**
- Wait for actual conditions, not arbitrary timeouts
- Include timeout limits (default 5-10 seconds)
- Provide clear error messages when timeouts occur
- Use promises for async waiting
- Handle both success and error cases
- Log when waiting completes successfully
- Document WHY waiting is necessary

**NEVER:**
- Use `setTimeout` without documenting WHY
- Wait without timeout (infinite loops)
- Ignore timeout errors silently
- Poll faster than 10ms (wastes CPU)
- Assume elements exist without checking
- Chain multiple arbitrary timeouts

**See also:** [wait_patterns.js](../../assets/patterns/wait_patterns.js) for production-ready code templates

---
