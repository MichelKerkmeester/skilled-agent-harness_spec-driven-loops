---
title: Async Patterns
description: Browser scheduling APIs and patterns for non-blocking code execution.
trigger_phrases:
  - "webflow async patterns"
  - "requestanimationframe pattern"
  - "requestidlecallback scheduling"
  - "non blocking browser scheduling"
importance_tier: normal
contextType: implementation
version: 3.5.0.3
---

# Async Patterns

Browser scheduling APIs and patterns for non-blocking code execution.

---

## 1. OVERVIEW

### Purpose

The four main-thread scheduling APIs — requestAnimationFrame, requestIdleCallback, queueMicrotask, and scheduler.postTask — and when to reach for each to schedule work without blocking rendering.

### When to Use

- Choosing a scheduling primitive for work that must not block rendering
- Deferring low-priority work with requestIdleCallback or scheduler.postTask
- Batching DOM reads and writes, or resolving microtask-ordering issues

Modern browsers provide APIs for scheduling work efficiently without blocking the main thread. This guide covers `requestIdleCallback`, `requestAnimationFrame`, `queueMicrotask`, `scheduler.postTask`, and related patterns for optimizing JavaScript execution timing.

### Key APIs

- **requestAnimationFrame** - Schedule work before next repaint (~16ms at 60fps)
- **requestIdleCallback** - Schedule work during browser idle periods
- **queueMicrotask** - Execute immediately after current task, before repaint
- **scheduler.postTask** - Priority-based task scheduling (Chrome 94+)
- **setTimeout** - Fallback for unsupported browsers

---

## 2. REQUESTANIMATIONFRAME PATTERN

### Overview

`requestAnimationFrame` schedules work to run before the next browser repaint, ideal for visual updates and animations. Runs at ~60fps (16.67ms intervals) when the tab is active.

### Basic RAF Loop with Cleanup

```javascript
// RAF loop with cleanup
function create_raf_loop(callback) {
    let raf_id = null;
    let is_running = false;

    function loop(timestamp) {
        if (!is_running) return;
        callback(timestamp);
        raf_id = requestAnimationFrame(loop);
    }

    return {
        start() {
            if (is_running) return;
            is_running = true;
            raf_id = requestAnimationFrame(loop);
        },
        stop() {
            is_running = false;
            if (raf_id) cancelAnimationFrame(raf_id);
        }
    };
}

// Usage
const animation = create_raf_loop(function(timestamp) {
    update_position(timestamp);
});
animation.start();
// Later: animation.stop();
```

### Throttling with RAF

Use RAF to throttle high-frequency events like pointer/scroll:

```javascript
// RAF-based throttle for pointer events
function create_raf_throttle(callback) {
    let is_scheduled = false;
    let last_args = null;

    return function(...args) {
        last_args = args;
        if (is_scheduled) return;

        is_scheduled = true;
        requestAnimationFrame(function() {
            is_scheduled = false;
            callback.apply(null, last_args);
        });
    };
}

// Usage for scroll handling
const handle_scroll = create_raf_throttle(function(event) {
    update_scroll_position(window.scrollY);
});
window.addEventListener('scroll', handle_scroll, { passive: true });
```

### Background Tab Behavior

- Active tab: ~60fps (16.67ms)
- Background tab: Throttled to ~1fps (1000ms)
- This is browser optimization, not controllable via code
- Design animations to handle variable frame timing

```javascript
// Handle variable frame timing
let last_timestamp = 0;

function animate(timestamp) {
    const delta = timestamp - last_timestamp;
    last_timestamp = timestamp;

    // Use delta for time-based animation (handles throttling)
    position += velocity * (delta / 1000);

    requestAnimationFrame(animate);
}
```

---

## 3. REQUESTIDLECALLBACK PATTERN

### Overview

`requestIdleCallback` schedules work during browser idle periods, preventing main thread blocking.

### Basic Usage

```javascript
if ('requestIdleCallback' in window) {
    requestIdleCallback(function() {
        // Non-critical work here
    });
}
```

### With Timeout

```javascript
requestIdleCallback(my_function, { timeout: 3000 });
```

The `timeout` option ensures the callback runs within the specified time even if the browser is never idle.

### Safari Fallback Pattern

Safari doesn't support `requestIdleCallback`. Always provide a fallback:

```javascript
if ('requestIdleCallback' in window) {
    requestIdleCallback(load_non_critical, { timeout: 3000 });
} else {
    setTimeout(load_non_critical, 2000);
}
```

### Chunked Work with Deadline

```javascript
function process_in_chunks(items, process_item, on_complete) {
    let index = 0;

    function process_chunk(deadline) {
        // Process while we have time remaining (> 1ms)
        while (index < items.length && deadline.timeRemaining() > 1) {
            process_item(items[index]);
            index++;
        }

        if (index < items.length) {
            // More work to do, schedule next chunk
            requestIdleCallback(process_chunk, { timeout: 5000 });
        } else {
            on_complete();
        }
    }

    if ('requestIdleCallback' in window) {
        requestIdleCallback(process_chunk, { timeout: 5000 });
    } else {
        // Fallback: process all at once after delay
        setTimeout(function() {
            items.forEach(process_item);
            on_complete();
        }, 100);
    }
}
```

---

## 4. QUEUEMICROTASK PATTERN

### Overview

`queueMicrotask` schedules a function to run immediately after the current synchronous code completes, but before any setTimeout callbacks or the next event loop tick.

### Basic Usage

```javascript
// Immediate post-current-task execution
// Runs before any setTimeout, even setTimeout(fn, 0)
queueMicrotask(function() {
    // Runs after current synchronous code
    // But before next event loop tick
});
```

### Batching DOM Updates

```javascript
// Use case: Ensure DOM updates are batched
function batch_dom_updates(updates) {
    queueMicrotask(function() {
        updates.forEach(function(update) {
            update();
        });
    });
}

// Usage
const pending_updates = [];
pending_updates.push(function() { element.textContent = 'Updated'; });
pending_updates.push(function() { element.classList.add('active'); });
batch_dom_updates(pending_updates);
```

### When to Use queueMicrotask

- Batching multiple synchronous updates
- Deferring work until after current stack clears
- Ensuring consistent ordering of async operations
- Avoiding setTimeout(fn, 0) overhead

### Caution: Microtask Starvation

```javascript
// WARNING: Don't create infinite microtask loops
// This WILL freeze the browser
function bad_pattern() {
    queueMicrotask(bad_pattern); // Never do this!
}

// Instead, use requestAnimationFrame or setTimeout for recurring work
```

---

## 5. SCHEDULER.POSTTASK PATTERN

### Overview

`scheduler.postTask` provides priority-based task scheduling (Chrome 94+, Edge 94+). Not yet supported in Firefox or Safari.

### Basic Usage

```javascript
// Modern priority-based scheduling (Chrome 94+)
if ('scheduler' in window) {
    // Priority levels: 'user-blocking', 'user-visible', 'background'
    scheduler.postTask(function() {
        // Low priority background work
    }, { priority: 'background' });
}
```

### Priority Levels

| Priority | Use Case | Timing |
|----------|----------|--------|
| `user-blocking` | Critical user interactions | Immediate |
| `user-visible` | Updates user can see | Soon |
| `background` | Non-critical, analytics | When idle |

### Universal Scheduling Function with Fallback

```javascript
// Fallback for unsupported browsers
function schedule_task(callback, priority) {
    priority = priority || 'background';

    if ('scheduler' in window) {
        return scheduler.postTask(callback, { priority: priority });
    }

    // Fallback based on priority
    if (priority === 'user-blocking') {
        queueMicrotask(callback);
        return Promise.resolve();
    } else if (priority === 'background') {
        return new Promise(function(resolve) {
            if ('requestIdleCallback' in window) {
                requestIdleCallback(function() {
                    callback();
                    resolve();
                });
            } else {
                setTimeout(function() {
                    callback();
                    resolve();
                }, 1);
            }
        });
    } else {
        // user-visible
        return new Promise(function(resolve) {
            setTimeout(function() {
                callback();
                resolve();
            }, 0);
        });
    }
}

// Usage
schedule_task(function() {
    send_analytics_event();
}, 'background');
```

---

