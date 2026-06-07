---
title: "Webflow Dev Workflow: Cross-Language Patterns"
description: "DevTools, logging, testing, automation patterns, error handling, and browser compatibility for Webflow stack — applies to all languages."
trigger_phrases:
  - "webflow dev workflow"
  - "webflow devtools"
  - "webflow testing"
  - "webflow automation"
  - "webflow error patterns"
  - "browser compatibility"
---

# Webflow Dev Workflow: Cross-Language Patterns

Cross-language operational reference for DevTools, logging, testing, automation, error patterns, and browser compatibility — orthogonal to the per-language style guides.

---

## 1. OVERVIEW

### Purpose

Cross-language operational reference for DevTools usage, console logging, manual testing, automation patterns (chrome-devtools-MCP), error patterns, and browser compatibility — orthogonal to per-language style guides.

### When to Use

- Setting up automated browser testing or screenshot capture
- Standardizing console logging across components
- Debugging frontend errors or browser-specific behavior
- Looking up a common DevTools command or shortcut

### Core Principle

Automated DevTools workflows + structured logging make every Webflow component observable and reproducible.

---

## 2. NAVIGATION DECISION TREE

```
┌─ Need to write code? ─────────────────────────────────┐
│                                                       │
│  Async/timing issues?  → condition-based-waiting      │
│  Validation needed?    → defense-in-depth             │
│  After JS changes?     → cdn-versioning               │
│  Animation needed?     → animation-workflows           │
│  Webflow collections?  → webflow-patterns               │
│  Performance needed?   → performance-patterns         │
│  Security needed?      → security-patterns            │
│                                                       │
└───────────────────────────────────────────────────────┘

┌─ Need to debug? ──────────────────────────────────────┐
│                                                       │
│  First debugging attempt?     → systematic-debugging  │
│  Deep call stack issue?       → root-cause-tracing    │
│  Animation issues?            → animation-workflows    │
│  Webflow collection issues?   → webflow-patterns        │
│  Performance issues?          → performance-debugging │
│  Error in unknown location?   → systematic-debugging  │
│                                                       │
└───────────────────────────────────────────────────────┘

┌─ Ready to claim complete? ────────────────────────────┐
│                                                       │
│  ALWAYS → verification-before-completion               │
│                                                       │
│  NO EXCEPTIONS. Test in browser first.                 │
│                                                       │
└───────────────────────────────────────────────────────┘
```

---

## 3. DEVTOOLS QUICK REFERENCE

### Opening DevTools

| Browser | Shortcut | Menu Path |
|---------|----------|-----------|
| Chrome/Edge | F12 or Cmd+Option+I | More Tools → Developer Tools |

### Essential Panels

**Console**
- View error messages and warnings
- Execute JavaScript commands
- View logged output from code
- Monitor network errors

**Elements/Inspector**
- Inspect DOM structure
- View computed CSS styles
- Edit HTML/CSS live
- Check element dimensions and positioning

**Sources/Debugger**
- Set breakpoints
- Step through code execution
- Watch variables
- View call stack

**Network**
- Monitor all resource requests
- Check for failed loads (404, 500, etc.)
- Inspect request/response headers
- Analyze load timing

**Performance**
- Record page performance
- Identify frame rate issues
- Find expensive operations
- Analyze rendering bottlenecks

### Common DevTools Commands

```javascript
// Check element exists
document.querySelector('[selector]');

// View all event listeners on element
getEventListeners(element);

// Inspect object structure
console.dir(object);

// Print call stack
console.trace();

// Measure performance
console.time('operation');
// ... code ...
console.timeEnd('operation');

// Group related logs
console.group('GroupName');
console.log('item 1');
console.log('item 2');
console.groupEnd();
```

### Keyboard Shortcuts

| Action | Chrome Shortcut |
|--------|----------------|
| Open DevTools | F12 / Cmd+Option+I |
| Inspect element | Cmd+Shift+C |
| Console | Cmd+Option+J |
| Hard refresh | Cmd+Shift+R |
| Toggle device toolbar | Cmd+Shift+M |

---

## 4. LOGGING STANDARDS

### Consistent Log Format

Use consistent prefixes to identify component sources:

```javascript
// Component initialization
console.log('[ComponentName] Initializing...', {
  timestamp: Date.now(),
  config: config
});

// Success operations
console.log('[ComponentName] Operation successful', result);

// Warnings
console.warn('[ComponentName] Potential issue detected', details);

// Errors
console.error('[ComponentName] Operation failed:', error);

// Debug-only logs
if (DEBUG) {
  console.log('[ComponentName] Debug info:', debugData);
}
```

### Log Levels

```javascript
// INFO: Normal operation
console.log('[VideoPlayer] Playing video');

// WARN: Recoverable issues
console.warn('[VideoPlayer] Quality downgraded due to network');

// ERROR: Failures
console.error('[VideoPlayer] Failed to load video source');

// DEBUG: Development only
if (process.env.NODE_ENV === 'development') {
  console.debug('[VideoPlayer] Current state:', state);
}
```

### Structured Logging

```javascript
// Good: Object with context
console.log('[VideoPlayer] State change', {
  from: 'loading',
  to: 'playing',
  timestamp: Date.now(),
  duration: video.duration
});

// Bad: Concatenated string
console.log('[VideoPlayer] State changed from loading to playing');
```

### Log Grouping

```javascript
console.group('[VideoPlayer] Initialization');
console.log('Config:', config);
console.log('Element:', videoElement);
console.log('HLS supported:', Hls.isSupported());
console.groupEnd();
```

---

## 5. TESTING REQUIREMENTS

### Manual Testing Checklist

```markdown
BROWSER TESTING:
□ Chrome (automated: MCP or mcp-chrome-devtools, manual: DevTools)

VIEWPORT TESTING:
□ Mobile (375px)
□ Tablet (991px)
□ Desktop (1920px)
□ Breakpoint transitions

FUNCTIONALITY:
□ Click all interactive elements
□ Submit all forms
□ Watch all animations complete
□ Test all navigation paths

CONSOLE:
□ No errors in any browser
□ No warnings (or documented)
□ Network tab clean

PERFORMANCE:
□ Animations smooth (60fps)
□ Page loads quickly (< 3s)
□ No janky scrolling
```

### Device Emulation Settings

**Chrome DevTools Device Toolbar (Cmd+Shift+M):**
- iPhone SE (375x667) - Small mobile
- iPhone 12 Pro (390x844) - Modern mobile
- iPad (991x1024) - Tablet (Webflow breakpoint)
- Responsive - Custom dimensions

**Network Throttling:**
- Fast 3G - Typical mobile
- Slow 3G - Poor connection
- Offline - Test error states

**CPU Throttling:**
- 4x slowdown - Low-end mobile
- 6x slowdown - Very slow device

---

## 6. AUTOMATION PATTERNS

### Chrome DevTools MCP Automation

**Automated testing using MCP tools for faster, repeatable verification:**

### Pattern 1: Console Error Validation

**Automated workflow to check for console errors:**

```markdown
1. Navigate to page:
   [Use tool: mcp__chrome_devtools_2__navigate_page]
   - url: "https://example.com"

2. List console messages:
   [Use tool: mcp__chrome_devtools_2__list_console_messages]

3. Filter for errors in response:
   - Check if any message has type === "error"
   - Report errors with file, line number, message

Expected result: No errors found
```

### Pattern 2: Multi-Viewport Screenshot Capture

**Automated workflow to capture all breakpoints:**

```markdown
1. Navigate once:
   [Use tool: mcp__chrome_devtools_2__navigate_page]
   - url: "https://example.com"

2. Mobile (375px):
   [Use tool: mcp__chrome_devtools_2__resize_page]
   - width: 375, height: 667
   [Use tool: mcp__chrome_devtools_2__take_screenshot]

3. Tablet (991px):
   [Use tool: mcp__chrome_devtools_2__resize_page]
   - width: 991, height: 1024
   [Use tool: mcp__chrome_devtools_2__take_screenshot]

4. Desktop (1920px):
   [Use tool: mcp__chrome_devtools_2__resize_page]
   - width: 1920, height: 1080
   [Use tool: mcp__chrome_devtools_2__take_screenshot]

Result: Three screenshots at exact dimensions for visual review
```

### Pattern 3: Performance Measurement

**Automated workflow to measure Core Web Vitals:**

```markdown
1. Navigate to page:
   [Use tool: mcp__chrome_devtools_2__navigate_page]
   - url: "https://example.com"

2. Start performance trace:
   [Use tool: mcp__chrome_devtools_2__performance_start_trace]

3. Stop performance trace:
   [Use tool: mcp__chrome_devtools_2__performance_stop_trace]

4. Analyze results:
   - LCP (Largest Contentful Paint): Target <2500ms
   - FID (First Input Delay): Target <100ms
   - CLS (Cumulative Layout Shift): Target <0.1

Result: Objective performance metrics
```

### Pattern 4: Network Request Validation

**Automated workflow to check for failed requests:**

```markdown
1. Navigate to page:
   [Use tool: mcp__chrome_devtools_2__navigate_page]
   - url: "https://example.com"

2. List network requests:
   [Use tool: mcp__chrome_devtools_2__list_network_requests]

3. Filter for failures:
   - Check if any request has status >= 400
   - Check if any request has status === 0 (blocked)
   - Report failed requests with URL + status

Expected result: No failed requests
```

### Pattern 5: Complete Automated Verification

**Full verification workflow combining all patterns:**

```markdown
1. Navigate once:
   [Use tool: mcp__chrome_devtools_2__navigate_page]
   - url: "https://example.com"

2. Check console errors:
   [Use tool: mcp__chrome_devtools_2__list_console_messages]
   - Filter for type === "error"
   - Report: ✅ Pass or ❌ Fail with details

3. Check network failures:
   [Use tool: mcp__chrome_devtools_2__list_network_requests]
   - Filter for status >= 400 or status === 0
   - Report: ✅ Pass or ❌ Fail with details

4. Measure performance:
   [Use tool: mcp__chrome_devtools_2__performance_start_trace]
   [Use tool: mcp__chrome_devtools_2__performance_stop_trace]
   - Check LCP, FID, CLS against targets
   - Report: ✅ Pass or ⚠️ Warning with metrics

5. Capture all viewports:
   [Resize + Screenshot for 375px, 991px, 1920px]
   - Save screenshots for manual review

Final report:
- Console: ✅/❌
- Network: ✅/❌
- Performance: ✅/⚠️ (with metrics)
- Screenshots: Ready for review
```

### Multi-Agent Concurrency

**Multiple agents can test simultaneously:**

```markdown
Agent 1: Use mcp__chrome_devtools_1__* tools
Agent 2: Use mcp__chrome_devtools_2__* tools

Both can navigate, test, and screenshot without conflicts.
```

### CLI Alternatives (browser-debugger-cli)

**For terminal-first workflows, mcp-chrome-devtools skill provides equivalent patterns via bdg tool:**

- Console errors: `bdg console logs | jq '.[] | select(.level=="error")'`
- Screenshots: `bdg screenshot output.png --width 375 --height 667`
- Performance: `bdg performance trace` (Core Web Vitals)
- Network: `bdg har export network.har`

**See**: .opencode/skills/mcp-chrome-devtools/SKILL.md for complete CLI automation workflows

### When to Use Automated vs. Manual

**Use Automated (MCP Tools) for:**
- Console error checking (faster, structured data)
- Multi-viewport screenshots (consistent dimensions)
- Performance measurement (objective metrics)
- Network request validation (easy filtering)
- Regression testing (repeatable)

**Use Manual (Browser DevTools) for:**
- Visual quality assessment (colors, spacing, polish)
- Animation smoothness perception ("feel" of 60fps)
- Interactive responsiveness (click/hover tactile feedback)
- Accessibility testing (screen readers)
- Real device testing (not emulation)
- Browser-specific debugging beyond Chrome

---

## 7. ERROR PATTERNS

### Common Frontend Errors

**1. Element Not Found**
```javascript
// Error: Cannot read property 'X' of null
// Cause: querySelector returned null

// Solution: Wait for element or validate
const element = await waitForElement('[selector]');
if (!element) {
  console.error('[Component] Element not found');
  return;
}
```

**2. Library Not Loaded**
```javascript
// Error: Hls is not defined
// Cause: Script not loaded or wrong load order

// Solution: Wait for library
const Hls = await waitForLibrary('Hls');
if (!Hls.isSupported()) {
  console.warn('[Video] HLS not supported');
  useFallback();
}
```

**3. Race Condition**
```javascript
// Error: Intermittent failures
// Cause: Code runs before dependencies ready

// Solution: Use condition-based waiting
await Promise.all([
  domReady(),
  waitForLibrary('Hls'),
  waitForElement('[video]')
]);
// Now safe to initialize
```

**4. XSS Vulnerability**
```javascript
// Risk: element.innerHTML = userInput
// Cause: Unsanitized user data

// Solution: Use textContent or sanitize
element.textContent = userInput; // Safe
// OR
element.innerHTML = sanitizeHTML(userInput); // Sanitized
```

**5. Memory Leak**
```javascript
// Cause: Event listeners not removed

// Solution: Clean up in destroy
class Component {
  constructor() {
    this.handleClick = this.handleClick.bind(this);
    element.addEventListener('click', this.handleClick);
  }

  destroy() {
    element.removeEventListener('click', this.handleClick);
  }
}
```

### Error Handling Pattern

```javascript
async function robustOperation() {
  try {
    // Layer 1: Validate inputs
    if (!isValid(input)) {
      throw new Error('Invalid input');
    }

    // Layer 2: Perform operation
    const result = await operation();

    // Layer 3: Validate output
    if (!result || !result.data) {
      throw new Error('Invalid result');
    }

    return result;

  } catch (error) {
    // Layer 4: Handle error
    console.error('[Component] Operation failed:', error);

    // Layer 5: Provide fallback
    return getDefaultValue();
  }
}
```

---

## 8. BROWSER COMPATIBILITY

### Feature Detection

```javascript
// Check browser support before using
if ('IntersectionObserver' in window) {
  // Use Intersection Observer
} else {
  // Fallback approach
}

// Check CSS support
if (CSS.supports('display', 'grid')) {
  // Use CSS Grid
} else {
  // Use flexbox fallback
}
```

### Polyfill Loading

```javascript
// Load polyfills only when needed
if (!window.Promise) {
  await loadScript('/polyfills/promise.js');
}

if (!Element.prototype.closest) {
  await loadScript('/polyfills/closest.js');
}
```

### Browser-Specific Workarounds

```javascript
// Chrome autoplay restrictions
video.muted = true; // Chrome requires muted autoplay for programmatic playback
video.playsInline = true; // Required for mobile devices

// Force reflow before animation if needed
element.offsetHeight;
element.classList.add('animate');
```

### Cross-Browser Testing Tools

- **BrowserStack**: Real device testing
- **LambdaTest**: Cross-browser testing
- **Can I Use**: Feature compatibility tables
- **MDN Web Docs**: Browser support tables

---

## 9. COMMON COMMANDS

### Condition-Based Waiting

```javascript
// Wait for element
await wait_for_element('[selector]', 5000);

// Wait for library
await wait_for_library('LibraryName', 10000);

// Wait for image
await wait_for_image_load(imgElement);

// Wait for transition
await wait_for_transition_end(element, 'opacity');

// DOM ready
await dom_ready();
```

### Validation Patterns

```javascript
// Entry validation
if (!param || typeof param !== 'expected') {
  console.error('[Component] Invalid parameter');
  return null;
}

// Safe nested access
const value = obj?.nested?.property ?? 'default';

// Sanitize text
text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
```

### Performance Patterns

See: [performance_patterns.md](../implementation/performance_patterns.md)

> **Cross-stack motion.dev reference**: For deeper Motion API, performance, and decision guidance beyond this Webflow quick reference, see [`../../motion_dev/quick_start.md`](../../motion_dev/quick_start.md), [`../../motion_dev/performance_and_pitfalls.md`](../../motion_dev/performance_and_pitfalls.md), and [`../../motion_dev/decision_matrix.md`](../../motion_dev/decision_matrix.md).

```javascript
// ✅ Animate transform/opacity only (Motion.dev)
import { animate } from "motion"
animate('.el', { y: [100, 0], opacity: [0, 1] }, { easing: "ease-out" });

// ✅ Lazy load with IntersectionObserver
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.src = entry.target.dataset.src;
    }
  });
});

// ✅ Debounce user input
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
```

### Security Patterns

See: [security_patterns.md](../implementation/security_patterns.md)

```javascript
// ✅ Sanitize user input
function sanitize_html(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ✅ Use textContent instead of innerHTML
element.textContent = user_input;

// ✅ Validate input format
const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!email_regex.test(email)) throw new Error('Invalid email');
```

### Performance Debugging

See: [debugging_workflows.md](../debugging/debugging_workflows.md)

```markdown
Chrome DevTools → Performance tab
1. Record (circle icon)
2. Perform interaction
3. Stop after 3-5 seconds
4. Analyze flame graph (Yellow=JS, Purple=Render, Green=Paint)
5. Bottom-Up view: Find expensive functions
6. Fix bottlenecks (batch DOM reads/writes, optimize algorithms)

Memory leaks:
1. Memory tab → Take snapshot
2. Perform action (e.g., open/close modal 10x)
3. Take second snapshot
4. Comparison view → Sort by Size Delta
5. Look for Detached DOM nodes
```

### DevTools Commands

```javascript
// Find elements
$$('[selector]');

// Get event listeners
getEventListeners(element);

// Monitor events
monitorEvents(element, 'click');

// Copy to clipboard
copy(object);

// Print call stack
console.trace();

// Pause execution
debugger;
```

### Browser Verification (CLI Alternative)

**Automated browser testing via mcp-chrome-devtools skill:**

```bash
# Console error checking
bdg https://example.com 2>&1
bdg console logs 2>&1 | jq '.[] | select(.level=="error")'
bdg stop 2>&1

# Multi-viewport screenshots
bdg https://example.com 2>&1
bdg screenshot desktop.png 2>&1  # Default: ~1920x1080

# Mobile viewport (requires Emulation.setDeviceMetricsOverride first)
bdg cdp Emulation.setDeviceMetricsOverride '{"width":375,"height":667,"deviceScaleFactor":2,"mobile":true}' 2>&1
bdg screenshot mobile.png 2>&1
bdg stop 2>&1

# DOM inspection
bdg https://example.com 2>&1
bdg dom query ".header-nav" 2>&1
bdg js "document.title" 2>&1
bdg stop 2>&1

# Network monitoring
bdg https://example.com 2>&1
bdg network cookies 2>&1
bdg har export network-trace.har 2>&1
bdg stop 2>&1

# Performance metrics
bdg https://example.com 2>&1
bdg cdp Performance.getMetrics 2>&1
bdg stop 2>&1
```

**Installation:**
```bash
npm install -g browser-debugger-cli@alpha
```

**See:** [`.opencode/skills/mcp-chrome-devtools/SKILL.md`](../../../../mcp-chrome-devtools/SKILL.md) for complete CLI workflows.

---

## 10. DEBUGGING CHECKLIST

```markdown
□ PHASE 1: ROOT CAUSE INVESTIGATION
  □ Read error messages completely
  □ Check DevTools Console
  □ Reproduce consistently
  □ Check recent changes (git log)
  □ Gather evidence with logging

□ PHASE 2: PATTERN ANALYSIS
  □ Find working examples
  □ Compare against references
  □ Identify differences
  □ Understand dependencies

□ PHASE 3: HYPOTHESIS & TESTING
  □ Form single hypothesis
  □ Test minimally (one change)
  □ Verify before continuing
  □ Ask if unsure

□ PHASE 4: IMPLEMENTATION
  □ Document the fix
  □ Implement single fix
  □ Verify in browser
  □ If 3+ fixes failed → question approach
```

---

## 11. VERIFICATION CHECKLIST

```markdown
□ BROWSER TESTING
  □ Chrome (via Chrome DevTools MCP automated testing)
  □ Desktop viewport (1920px)
  □ Mobile emulation (375px)

□ VIEWPORT TESTING
  □ Mobile (375px)
  □ Tablet (991px)
  □ Desktop (1920px)
  □ Transitions smooth

□ FUNCTIONALITY
  □ Clicked interactive elements
  □ Watched full animation
  □ Tested form submissions
  □ Tested media playback

□ CONSOLE/ERRORS
  □ No console errors
  □ No console warnings
  □ No failed network requests
```

---

## 12. DECISION MATRIX

| Scenario                | Workflow                | Key Action                        |
| ----------------------- | ----------------------- | --------------------------------- |
| Element not ready       | condition-based-waiting | waitForElement                    |
| Form validation         | defense-in-depth        | Multi-layer validation            |
| After JS change         | cdn-versioning          | Run version updater               |
| Animation needed        | animation-workflows     | CSS vs Motion.dev decision tree   |
| Webflow collection list | webflow-patterns        | Event delegation, async rendering |
| Console error           | systematic-debugging    | Phase 1: Investigation            |
| Deep stack error        | root-cause-tracing      | Use debugger, trace back          |
| Ready to claim done     | verification            | Test in browser first             |
| Layout bug              | systematic-debugging    | Inspect element, computed styles  |
| Animation issue         | animation-workflows     | Motion.dev loading, layout jumps  |
| Webflow ID duplication  | webflow-patterns        | Use classes, event delegation     |
| Click not working       | systematic-debugging    | Check event listeners             |

---

## 13. QUICK COMMAND REFERENCE

### DevTools Console Commands

```javascript
// Find all elements matching selector
$$('[data-*]');

// Get computed style
getComputedStyle(element);

// Monitor all events on element
monitorEvents(element);
monitorEvents(element, 'click'); // Specific event

// Stop monitoring
unmonitorEvents(element);

// Copy to clipboard
copy(object);

// Clear console
clear();
```

### Performance Monitoring

```javascript
// Mark timing points
performance.mark('start');
// ... operation ...
performance.mark('end');

// Measure duration
performance.measure('operation', 'start', 'end');

// Get all measures
performance.getEntriesByType('measure');
```

### Network Debugging

```javascript
// Check if online
if (navigator.onLine) {
  // Network available
}

// Listen for online/offline
window.addEventListener('online', handleOnline);
window.addEventListener('offline', handleOffline);
```

---

## RELATED RESOURCES

### Per-Language Style Guides
- [JavaScript Style Guide](../javascript/style_guide.md)
- [CSS Style Guide](../css/style_guide.md)

### Shared Rules
- [Cross-Language Rules](./cross_language_rules.md)
- [Enforcement Guide](./enforcement.md)

### Implementation Workflows
- [implementation/](../implementation/) — Implementation workflows directory
- [debugging/](../debugging/) — Debugging workflows directory
- [verification/](../verification/) — Verification workflows directory
- [deployment/](../deployment/) — Deployment workflows directory

### Related Skills
- `mcp-chrome-devtools` — Chrome DevTools reference and CLI-based browser automation via browser-debugger-cli (bdg)

### External Resources
- [MDN Web Docs](https://developer.mozilla.org) — JavaScript, CSS, and browser API documentation
- [Can I Use](https://caniuse.com) — Browser compatibility tables
- [Chrome DevTools Docs](https://developer.chrome.com/docs/devtools/) — Official DevTools documentation
