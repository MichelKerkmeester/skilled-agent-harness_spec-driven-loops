---
title: Priority/Timing Decision Tree, Compatibility & Webflow Timing
description: Browser scheduling APIs and patterns for non-blocking code execution. — Priority/Timing Decision Tree, Compatibility & Webflow Timing.
importance_tier: normal
contextType: implementation
version: 3.5.0.3
---

# Priority/Timing Decision Tree, Compatibility & Webflow Timing

## 6. PRIORITY & TIMING DECISION TREE

### Quick Reference Table

| Need | API | Timing |
|------|-----|--------|
| Visual updates (animation) | `requestAnimationFrame` | ~16ms (60fps) |
| After current task, before repaint | `queueMicrotask` | Immediate |
| When browser is idle | `requestIdleCallback` | Variable |
| Low priority background | `scheduler.postTask('background')` | Variable |
| Specific delay | `setTimeout` | Specified ms |

### Decision Flowchart

```
Is it a visual/animation update?
├─ YES → requestAnimationFrame
└─ NO → Is it time-critical for user experience?
         ├─ YES → queueMicrotask or scheduler.postTask('user-blocking')
         └─ NO → Can it wait for idle time?
                  ├─ YES → requestIdleCallback with timeout
                  └─ NO → setTimeout with appropriate delay
```

### Common Patterns by Use Case

| Use Case | API | Timeout/Fallback |
|----------|-----|------------------|
| Analytics/GTM | requestIdleCallback | timeout: 3000ms, fallback: 2000ms setTimeout |
| Non-critical init | requestIdleCallback | timeout: 5000ms, fallback: 3000ms setTimeout |
| Prefetching | requestIdleCallback | no timeout, fallback: 1000ms setTimeout |
| Animation loop | requestAnimationFrame | N/A |
| DOM batching | queueMicrotask | N/A |
| Background tasks | scheduler.postTask | fallback: requestIdleCallback |

---

## 7. BROWSER COMPATIBILITY

### Support Matrix

| API | Chrome | Firefox | Safari | Edge |
|-----|--------|---------|--------|------|
| `requestAnimationFrame` | 24+ | 23+ | 6.1+ | 12+ |
| `requestIdleCallback` | 47+ | 55+ | ❌ | 79+ |
| `queueMicrotask` | 71+ | 69+ | 12.1+ | 79+ |
| `scheduler.postTask` | 94+ | ❌ | ❌ | 94+ |
| `setTimeout` | ✅ | ✅ | ✅ | ✅ |

### Safari-Safe Pattern

Always provide fallbacks for Safari:

```javascript
// Universal async scheduler
const async_scheduler = {
    on_idle: function(callback, timeout) {
        if ('requestIdleCallback' in window) {
            requestIdleCallback(callback, { timeout: timeout || 5000 });
        } else {
            setTimeout(callback, Math.min(timeout || 5000, 2000) / 2);
        }
    },

    on_frame: function(callback) {
        requestAnimationFrame(callback);
    },

    immediate: function(callback) {
        if (typeof queueMicrotask === 'function') {
            queueMicrotask(callback);
        } else {
            Promise.resolve().then(callback);
        }
    }
};
```

---

## 8. WEBFLOW-SPECIFIC TIMING PATTERNS

### Wait for Collection List Render

Collection items render asynchronously after DOMContentLoaded:

```javascript
// Wait for Webflow to finish rendering collection lists
// Collection items render async after DOMContentLoaded
function wait_for_collection_render(selector, timeout) {
    timeout = timeout || 3000;

    return new Promise(function(resolve, reject) {
        var start = Date.now();

        function check() {
            var items = document.querySelectorAll(selector);
            if (items.length > 0) {
                resolve(items);
                return;
            }
            if (Date.now() - start > timeout) {
                reject(new Error('Collection ' + selector + ' not rendered within timeout'));
                return;
            }
            requestAnimationFrame(check);
        }

        check();
    });
}

// Usage
wait_for_collection_render('.w-dyn-item')
    .then(function(items) {
        initialize_collection_features(items);
    })
    .catch(function(error) {
        console.warn('Collection render timeout:', error);
    });
```

### Wait for Webflow Interactions to Initialize

```javascript
// Webflow.push ensures code runs after Webflow JS initializes
window.Webflow = window.Webflow || [];
window.Webflow.push(function() {
    // Safe to interact with Webflow-managed elements
    // Interactions, forms, and other Webflow features are ready
});
```

### Combining with Idle Callback

```javascript
// Initialize non-critical features after Webflow + idle
window.Webflow = window.Webflow || [];
window.Webflow.push(function() {
    if ('requestIdleCallback' in window) {
        requestIdleCallback(function() {
            init_analytics();
            init_scroll_tracking();
        }, { timeout: 3000 });
    } else {
        setTimeout(function() {
            init_analytics();
            init_scroll_tracking();
        }, 2000);
    }
});
```

---

## 9. REAL EXAMPLE: GTM DELAY

```javascript
(function() {
    function load_gtm() {
        // GTM initialization code
        var script = document.createElement('script');
        script.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-XXXX';
        document.head.appendChild(script);
    }

    if ('requestIdleCallback' in window) {
        requestIdleCallback(load_gtm, { timeout: 3000 });
    } else {
        setTimeout(load_gtm, 2000);
    }
})();
```

---

## 10. RELATED RESOURCES

### Internal References

- [implementation_workflows.md](../implementation_workflows/condition-based-waiting.md) - Condition-based waiting patterns
- [performance_patterns.md](../performance_patterns/overview-and-checklist.md) - Throttle/debounce and performance optimization
- [../performance/third_party.md](../../performance/third_party.md) - Third-party script loading optimization

### External References

- [MDN: requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)
- [MDN: requestIdleCallback](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback)
- [MDN: queueMicrotask](https://developer.mozilla.org/en-US/docs/Web/API/queueMicrotask)
- [MDN: Scheduler.postTask](https://developer.mozilla.org/en-US/docs/Web/API/Scheduler/postTask)
