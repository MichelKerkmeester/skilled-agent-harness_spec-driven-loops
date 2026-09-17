---
title: Quick Reference & Lenis Conflict Resolution
description: Systematic debugging with four-phase investigation, root cause tracing, and performance profiling. — Quick Reference & Lenis Conflict Resolution.
trigger_phrases:
  - "quick reference and lenis"
  - "quick reference and lenis webflow"
  - "quick reference and lenis reference"
importance_tier: normal
contextType: implementation
version: 3.5.0.18
---


# Quick Reference & Lenis Conflict Resolution

Systematic debugging with four-phase investigation, root cause tracing, and performance profiling.

---

## 1. OVERVIEW

### Purpose

Provides the detailed quick reference & lenis conflict resolution guidance for the broader Webflow workflow.

### When to Use

- Use this reference when applying or troubleshooting the documented quick reference & lenis conflict resolution practices.

---

## 2. QUICK REFERENCE

### DevTools Keyboard Shortcuts

```markdown
F12 / Cmd+Option+I - Open DevTools
Cmd+Shift+C - Inspect element
Cmd+Shift+R - Hard refresh (bypass cache)
```

### Debugging Commands

```javascript
// Pause execution
debugger;

// Print call stack
console.trace();

// Check event listeners
getEventListeners(element);

// Inspect scope
console.dir(object);
```

### Decision Matrix

| Scenario | Start Phase | Key Action |
|----------|-------------|------------|
| Console error | Phase 1 | Read full stack trace |
| CSS layout bug | Phase 1 | Inspect element, computed styles |
| Animation jank | Phase 1 | Performance tab, frame rate |
| Click not working | Phase 1 | Event listeners, z-index |
| Mobile-only bug | Phase 1 | Device emulation |
| Intermittent bug | Phase 1 | Extensive logging |

---

## 3. LENIS CONFLICT RESOLUTION

**When to use**: Anchor scrolling not working, double-scroll behavior, scroll position off by header height, smooth scroll library intercepting events

### Core Principle

Lenis smooth scroll virtualizes scrolling and can intercept anchor link clicks. Use capturing phase event listeners with `stopImmediatePropagation()` to maintain control over custom scroll behavior.

### Understanding the Conflict

#### The Problem

Lenis (and similar smooth scroll libraries) often initialize with automatic anchor handling:

```javascript
// Site initialization (often in Webflow)
const lenis = new Lenis({
  anchors: true,  // <-- This adds invisible anchor handling
  // ...
});
```

When clicking an anchor link:
1. Your handler calls `lenis.scrollTo(target, { offset: -90 })` - scrolls correctly
2. Lenis's built-in anchor handler ALSO fires - scrolls WITHOUT offset
3. Final position is wrong!

**Evidence from table_of_content.js (lines 343-344):**
```javascript
// src/javascript/cms/table_of_content.js:343-344
event.preventDefault();
event.stopImmediatePropagation(); // Prevent Lenis's built-in anchor handler from also scrolling
```

#### Detection Techniques

**Trace Double-Scroll with Interceptor:**
```javascript
// Paste in DevTools console to detect multiple scroll calls
window._scrollTrace = [];
const originalScrollTo = window.scrollTo.bind(window);
window.scrollTo = function(...args) {
  window._scrollTrace.push({
    scrollY: window.scrollY,
    targetY: args[0]?.top ?? args[1],
    stack: new Error().stack.split('\n').slice(1, 4).join('\n')
  });
  return originalScrollTo(...args);
};

// Click anchor link, then check:
console.log(window._scrollTrace);
// If multiple entries -> double-scroll problem confirmed
```

**Position Comparison (5px threshold):**
```javascript
// After clicking anchor, check if position is correct
const target = document.getElementById('section-id');
const rect = target.getBoundingClientRect();
const expectedTop = 90; // Your header height
const tolerance = 5;

if (Math.abs(rect.top - expectedTop) > tolerance) {
  console.error('Scroll position off by:', rect.top - expectedTop, 'px');
}
```

### The Solution Pattern

**Use Capturing Phase + stopImmediatePropagation:**

```javascript
// CRITICAL: Use capturing phase (true) to run BEFORE Lenis's handler
document.addEventListener("click", handle_link_click, true);

function handle_link_click(event) {
  const link = event.target.closest('a[href^="#"]');
  if (!link) return;

  const href = link.getAttribute("href");
  if (!href?.startsWith("#")) return;

  const target = document.getElementById(href.substring(1));
  if (!target) return;

  event.preventDefault();
  event.stopImmediatePropagation(); // CRITICAL: Block Lenis's anchor handler

  // Get scroll-margin-top from CSS (for sticky header offset)
  const scroll_margin = parseInt(getComputedStyle(target).scrollMarginTop) || 0;

  // Helper to finalize scroll (focus + URL update)
  const finalize_scroll = () => {
    if (!target.hasAttribute("tabindex")) {
      target.setAttribute("tabindex", "-1");
    }
    target.focus({ preventScroll: true });
    history.pushState(null, "", href);
  };

  // Use Lenis API if available
  if (window.lenis) {
    window.lenis.scrollTo(target, {
      offset: -scroll_margin,
      immediate: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      onComplete: finalize_scroll
    });
  } else {
    // Native fallback
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    finalize_scroll();
  }
}
```

**Why This Works:**
- `stopImmediatePropagation()` prevents ALL other handlers (including Lenis's)
- Capturing phase (`true` third argument) ensures our handler runs first
- `onComplete` callback waits for animation before updating URL/focus
- `offset: -scroll_margin` tells Lenis to account for sticky header

### Modal Scroll Control

When opening modals, stop Lenis to prevent background scroll:

**From modal_cookie_consent.js (lines 955-957, 1007-1009):**
```javascript
// Opening modal - stop Lenis
function lock_scroll() {
  document.body.style.overflow = 'hidden';
  if (window.lenis?.stop) {
    window.lenis.stop();
  }
}

// Closing modal - restart Lenis
function unlock_scroll() {
  document.body.style.overflow = '';
  if (window.lenis?.start) {
    window.lenis.start();
  }
}
```

### Diagnostic Commands

**Using Chrome DevTools MCP:**
```markdown
1. Navigate to page:
   [Use tool: mcp__chrome_devtools_2__navigate_page]
   - url: "https://example.com/page-with-toc"

2. Check Lenis initialization options:
   [Use tool: mcp__chrome_devtools_2__evaluate_script]
   - script: "window.initLenis?.toString() || 'No initLenis found'"

3. Check if Lenis is active:
   [Use tool: mcp__chrome_devtools_2__evaluate_script]
   - script: "({ hasLenis: !!window.lenis, isRunning: window.lenis?.isRunning })"

4. Test scroll with offset:
   [Use tool: mcp__chrome_devtools_2__evaluate_script]
   - script: "const t = document.getElementById('section-id'); window.lenis?.scrollTo(t, { offset: -90 }); 'Scrolling...'"
```

**Using bdg CLI:**
```bash
# Check Lenis initialization
bdg https://example.com 2>&1
bdg dom eval "window.initLenis?.toString()" 2>&1

# Install scroll interceptor
bdg dom eval "
window._trace = [];
const orig = window.scrollTo.bind(window);
window.scrollTo = function(...args) {
  window._trace.push({ scrollY: window.scrollY, target: args[0]?.top });
  return orig(...args);
};
" 2>&1

# Click anchor and check result
bdg dom eval "document.querySelector('a[href=\"#section\"]').click()" 2>&1
sleep 2
bdg dom eval "({ scrollY: window.scrollY, trace: window._trace })" 2>&1
bdg stop 2>&1
```

### Common Lenis Conflict Scenarios

| Scenario | Symptom | Solution |
|----------|---------|----------|
| Double-scroll | Position off by header height | `stopImmediatePropagation()` + capturing phase |
| Modal background scrolls | Content behind modal moves | `window.lenis.stop()` on open |
| Form scroll lock broken | Page scrolls during form submission | Pause Lenis during async operations |
| TOC highlight jumps | Wrong section highlighted after click | Instant feedback before IO catches up |
| Native scrollIntoView ignored | CSS `scroll-margin-top` not respected | Use `lenis.scrollTo()` with `offset` |

### Rules

**ALWAYS:**
- Use capturing phase (`true`) for anchor click handlers
- Use `stopImmediatePropagation()`, not just `stopPropagation()`
- Check for `window.lenis` before using its API
- Use `onComplete` callback for post-scroll actions
- Test with Chrome DevTools scroll interceptor

**NEVER:**
- Rely on native `scrollIntoView()` when Lenis is active
- Update URL/focus before scroll animation completes
- Assume `stopPropagation()` alone will block Lenis
- Forget to restart Lenis after modal/overlay closes

**See also:** `(retired) lenis-patterns.js` for complete Lenis integration patterns

---
