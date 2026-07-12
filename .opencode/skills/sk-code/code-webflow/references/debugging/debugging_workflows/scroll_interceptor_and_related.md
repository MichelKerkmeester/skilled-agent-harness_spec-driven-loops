---
title: Scroll Interceptor Debugging & Related
description: Systematic debugging with four-phase investigation, root cause tracing, and performance profiling. — Scroll Interceptor Debugging & Related.
trigger_phrases:
  - "scroll interceptor and related"
  - "scroll interceptor and related webflow"
  - "scroll interceptor and related reference"
importance_tier: normal
contextType: implementation
version: 3.5.0.18
---


# Scroll Interceptor Debugging & Related

Systematic debugging with four-phase investigation, root cause tracing, and performance profiling.

---

## 1. OVERVIEW

### Purpose

Provides the detailed scroll interceptor debugging & related guidance for the broader Webflow workflow.

### When to Use

- Use this reference when applying or troubleshooting the documented scroll interceptor debugging & related practices.

---

## 2. SCROLL INTERCEPTOR DEBUGGING

**When to use**: Double-scroll problems, scroll position inconsistencies, debugging smooth scroll library conflicts, tracing scroll event sources

### Core Principle

Intercept scroll calls to trace their source. Position comparison with threshold tolerance reveals conflicts between multiple scroll handlers.

### The Scroll Interceptor Technique

#### Basic Interceptor

```javascript
// Install in DevTools console BEFORE triggering scroll
window._scrollTrace = [];
const originalScrollTo = window.scrollTo.bind(window);

window.scrollTo = function(xOrOptions, y) {
  const targetY = typeof xOrOptions === 'object' ? xOrOptions.top : y;

  window._scrollTrace.push({
    timestamp: performance.now(),
    fromY: window.scrollY,
    toY: targetY,
    stack: new Error().stack.split('\n').slice(1, 5).join('\n')
  });

  return originalScrollTo(xOrOptions, y);
};

console.log('[ScrollInterceptor] Installed. Trigger scroll, then check window._scrollTrace');
```

#### Advanced Interceptor (Multiple Methods)

```javascript
// Intercept all scroll methods
window._scrollTrace = [];

// 1. window.scrollTo
const origScrollTo = window.scrollTo.bind(window);
window.scrollTo = function(...args) {
  window._scrollTrace.push({
    method: 'scrollTo',
    args: args,
    scrollY: window.scrollY,
    timestamp: performance.now()
  });
  return origScrollTo(...args);
};

// 2. window.scroll
const origScroll = window.scroll.bind(window);
window.scroll = function(...args) {
  window._scrollTrace.push({
    method: 'scroll',
    args: args,
    scrollY: window.scrollY,
    timestamp: performance.now()
  });
  return origScroll(...args);
};

// 3. Element.scrollTo
const origElemScrollTo = Element.prototype.scrollTo;
Element.prototype.scrollTo = function(...args) {
  window._scrollTrace.push({
    method: 'Element.scrollTo',
    element: this.tagName + (this.id ? '#' + this.id : ''),
    args: args,
    timestamp: performance.now()
  });
  return origElemScrollTo.apply(this, args);
};

// 4. scrollIntoView
const origScrollIntoView = Element.prototype.scrollIntoView;
Element.prototype.scrollIntoView = function(...args) {
  window._scrollTrace.push({
    method: 'scrollIntoView',
    element: this.tagName + (this.id ? '#' + this.id : ''),
    args: args,
    timestamp: performance.now()
  });
  return origScrollIntoView.apply(this, args);
};

console.log('[ScrollInterceptor] All methods intercepted');
```

### Position Comparison with Threshold

#### The 5px Tolerance Pattern

```javascript
/**
 * Compare scroll position against expected target
 * 5px tolerance accounts for:
 * - Subpixel rendering differences
 * - Rounding in scroll calculations
 * - Minor timing variations
 */
function verify_scroll_position(targetElement, expectedOffset = 90) {
  const rect = targetElement.getBoundingClientRect();
  const tolerance = 5; // pixels

  const result = {
    actualTop: rect.top,
    expectedTop: expectedOffset,
    difference: Math.abs(rect.top - expectedOffset),
    withinTolerance: Math.abs(rect.top - expectedOffset) <= tolerance,
    status: null
  };

  if (result.withinTolerance) {
    result.status = 'PASS';
  } else if (result.difference < 20) {
    result.status = 'MINOR_DEVIATION';
  } else {
    result.status = 'FAIL - likely double-scroll';
  }

  return result;
}

// Usage after scroll completes:
const target = document.getElementById('section-id');
const result = verify_scroll_position(target, 90);
console.log('Scroll verification:', result);
```

#### Automated Verification Script

```javascript
async function test_anchor_scroll(anchorSelector, expectedOffset = 90) {
  // Clear previous trace
  window._scrollTrace = [];

  // Click the anchor
  const anchor = document.querySelector(anchorSelector);
  if (!anchor) {
    return { error: 'Anchor not found: ' + anchorSelector };
  }

  anchor.click();

  // Wait for scroll animation (Lenis default ~1000ms)
  await new Promise(r => setTimeout(r, 1200));

  // Get target element
  const href = anchor.getAttribute('href');
  const targetId = href.startsWith('#') ? href.slice(1) : href;
  const target = document.getElementById(targetId);

  if (!target) {
    return { error: 'Target not found: ' + targetId };
  }

  // Verify position
  const rect = target.getBoundingClientRect();
  const tolerance = 5;

  return {
    anchor: anchorSelector,
    target: targetId,
    scrollCalls: window._scrollTrace.length,
    finalScrollY: window.scrollY,
    targetTop: rect.top,
    expectedTop: expectedOffset,
    difference: Math.abs(rect.top - expectedOffset),
    passed: Math.abs(rect.top - expectedOffset) <= tolerance,
    trace: window._scrollTrace
  };
}

// Usage:
test_anchor_scroll('a[href="#section-1"]').then(console.log);
```

### Diagnosing Common Issues

#### Pattern: Multiple Scroll Calls

```javascript
// After clicking anchor, check trace:
console.log('Scroll call count:', window._scrollTrace.length);

if (window._scrollTrace.length > 1) {
  console.warn('Multiple scroll calls detected!');

  // Analyze the calls
  window._scrollTrace.forEach((call, i) => {
    console.log(`Call ${i + 1}:`, {
      toY: call.toY,
      timeDelta: i > 0 ? call.timestamp - window._scrollTrace[i-1].timestamp : 0
    });
  });

  // If calls are close in time (<100ms), likely a conflict
  const timeBetweenCalls = window._scrollTrace[1].timestamp - window._scrollTrace[0].timestamp;
  if (timeBetweenCalls < 100) {
    console.error('CONFLICT: Two scroll handlers fighting!');
  }
}
```

#### Pattern: Scroll Drift Detection

```javascript
// Detect if scroll position drifts after animation
async function detect_scroll_drift(targetElement, checkDuration = 500) {
  const positions = [];
  const startTime = performance.now();

  // Sample position over time
  while (performance.now() - startTime < checkDuration) {
    positions.push({
      time: performance.now() - startTime,
      scrollY: window.scrollY,
      targetTop: targetElement.getBoundingClientRect().top
    });
    await new Promise(r => setTimeout(r, 50));
  }

  // Analyze for drift
  const firstPos = positions[0].targetTop;
  const lastPos = positions[positions.length - 1].targetTop;
  const maxDrift = Math.max(...positions.map(p => Math.abs(p.targetTop - firstPos)));

  return {
    driftDetected: maxDrift > 5,
    maxDrift: maxDrift,
    finalDrift: Math.abs(lastPos - firstPos),
    samples: positions
  };
}
```

### Chrome DevTools Integration

**Using MCP:**
```markdown
1. Navigate to page:
   [Use tool: mcp__chrome_devtools_2__navigate_page]
   - url: "https://example.com/page"

2. Install interceptor:
   [Use tool: mcp__chrome_devtools_2__evaluate_script]
   - script: "[paste basic interceptor code]"

3. Trigger scroll via click:
   [Use tool: mcp__chrome_devtools_2__evaluate_script]
   - script: "document.querySelector('a[href=\"#section\"]').click()"

4. Wait for animation:
   [Use tool: mcp__chrome_devtools_2__evaluate_script]
   - script: "await new Promise(r => setTimeout(r, 1500)); 'done'"

5. Check trace:
   [Use tool: mcp__chrome_devtools_2__evaluate_script]
   - script: "({ callCount: window._scrollTrace.length, trace: window._scrollTrace })"
```

**Using bdg CLI:**
```bash
# Install interceptor and test
bdg https://example.com 2>&1

# Install interceptor
bdg dom eval "
window._scrollTrace = [];
const orig = window.scrollTo.bind(window);
window.scrollTo = function(...args) {
  window._scrollTrace.push({ scrollY: window.scrollY, target: args[0]?.top, time: performance.now() });
  return orig(...args);
};
" 2>&1

# Click anchor
bdg dom eval "document.querySelector('a[href=\"#section\"]').click()" 2>&1

# Wait for animation
sleep 2

# Check results
bdg dom eval "({
  calls: window._scrollTrace.length,
  finalY: window.scrollY,
  targetTop: document.getElementById('section').getBoundingClientRect().top,
  trace: window._scrollTrace
})" 2>&1

bdg stop 2>&1
```

### Decision Matrix

| Trace Result | Diagnosis | Fix |
|--------------|-----------|-----|
| 1 call, correct position | Working correctly | None needed |
| 1 call, wrong position | Offset calculation error | Check scroll-margin-top, offset value |
| 2+ calls, close timing (<100ms) | Handler conflict | stopImmediatePropagation + capture phase |
| 2+ calls, spread timing | Animation + correction | Check for scroll listeners updating position |
| Position drifts after settling | Post-scroll handler | Check for scroll event listeners modifying position |

### Rules

**ALWAYS:**
- Install interceptor BEFORE triggering scroll
- Use 5px tolerance for position comparisons
- Check scroll trace call count first
- Include timestamps in trace for timing analysis
- Clean up interceptor after debugging (restore original methods)

**NEVER:**
- Leave scroll interceptors in production code
- Assume single scroll call without verification
- Ignore timing between multiple scroll calls
- Skip position verification after fix

**See also:** Section 6 (Lenis Conflict Resolution) for specific smooth scroll library conflicts

---

## 3. RELATED RESOURCES

### Reference Files
- [implementation_workflows.md](../../implementation/implementation_workflows/condition-based-waiting.md) - Debug timing and validation issues
- [verification_workflows.md](../../verification/verification_workflows/gate_and_automated_options.md) - Verify fixes work correctly
- [dev_workflow.md](../../shared/dev_workflow/overview-nav-and-logging.md) - Use common DevTools and logging patterns

### Asset Files
- [lenis_patterns.js](../../assets/integrations/lenis_patterns.js) - Complete Lenis smooth scroll integration patterns
- [debugging_checklist.md](../../../assets/webflow-debugging_checklist.md) - Systematic debugging checklist

### Related Skills
- `mcp-chrome-devtools` - CLI-based browser automation via browser-debugger-cli (bdg)
- `system-spec-kit` - Spec folder management and Task-tool debug escalation

### Related Commands
- `Task tool -> @debug` - Dispatch the fresh-perspective debugging specialist after repeated failures

### Memory Files (Evidence)
- `specs/005-example.com/z_archive/004-table-of-content/003-icon-animation-isolation/memory/2024-12-14_toc-scroll-lenis-fix.md` - Lenis conflict resolution case study
- `specs/03--commands-and-skills/001-commands/005-subagent-delegation/implementation-summary.md` - Sub-agent delegation pattern implementation

### External Resources
- [MDN Web Docs](https://developer.mozilla.org) - Browser APIs and JavaScript documentation
- [Can I Use](https://caniuse.com) - Browser compatibility tables
- [Lenis Documentation](https://lenis.studiofreight.com/) - Official Lenis smooth scroll library docs

---

**For complete checklists:**
- [debugging_checklist.md](../../../assets/webflow-debugging_checklist.md) - Systematic debugging checklist
- See `mcp-chrome-devtools` skill for comprehensive DevTools reference
