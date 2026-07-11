---
title: Automation Patterns, Error Patterns & Browser Compatibility
description: "DevTools, logging, testing, automation patterns, error handling, and browser compatibility for Webflow stack — applies to all languages." — Automation Patterns, Error Patterns & Browser Compatibility.
importance_tier: normal
contextType: implementation
version: 3.5.0.6
---

# Automation Patterns, Error Patterns & Browser Compatibility

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

**See**: .opencode/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md for complete CLI automation workflows

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

