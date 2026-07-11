---
title: Debugging Workflows - Phase 2
description: Systematic debugging with four-phase investigation, root cause tracing, and performance profiling.
trigger_phrases:
  - "webflow debugging workflows"
  - "four phase debugging"
  - "root cause investigation"
  - "browser devtools profiling"
importance_tier: normal
contextType: implementation
version: 3.5.0.18
---

# Debugging Workflows - Phase 2

Systematic debugging with four-phase investigation, root cause tracing, and performance profiling.

---

## 1. OVERVIEW

### Purpose
Evidence-based debugging workflows for frontend issues using browser DevTools, console analysis, and performance profiling.

### When to Use
- Console errors or JavaScript failures
- Layout bugs or visual regressions
- Animation issues or jank
- Performance bottlenecks

### Platform-Specific Guides
- **Animation issues:** See [animation_workflows.md Section 7](../../implementation/animation_workflows/overview-decision-tree-and-css.md#7-🐛-common-issues-and-solutions)
- **Webflow issues:** See [webflow_patterns.md Section 3](../../implementation/webflow_patterns/overview-limits-and-collection-lists.md#3-📚-collection-list-patterns)

### Core Principle
ALWAYS find root cause before attempting fixes. Symptom fixes are failure.

---

## 2. SYSTEMATIC DEBUGGING

### The Four Phases

You MUST complete each phase before proceeding to the next.

#### Phase 1: Root Cause Investigation

**BEFORE attempting ANY fix:**

**Step 1: Read Error Messages Carefully**
- Open browser DevTools console (F12 or Cmd+Option+I)
- Don't skip past errors or warnings
- Read stack traces completely
- Note file names, line numbers, error codes
- Check Network tab for failed requests
- Review Console tab for JavaScript errors
- Inspect Elements tab for CSS/DOM issues

**Common Browser Errors:**
```javascript
// Uncaught TypeError: Cannot read property 'X' of undefined
// → Variable is undefined, check initialization

// Failed to load resource: net::ERR_BLOCKED_BY_CLIENT
// → Ad blocker or browser extension blocking resource

// Uncaught ReferenceError: $ is not defined
// → jQuery not loaded or loading order incorrect

// Mixed Content: The page was loaded over HTTPS...
// → Trying to load HTTP resource on HTTPS page
```

**Automated Console Error Capture:**

Instead of manually opening DevTools, capture console output programmatically:

```markdown
1. Navigate to page:
   [Use tool: mcp__chrome_devtools_2__navigate_page]
   - url: "https://example.com"

 2. List console messages:
    [Use tool: mcp__chrome_devtools_2__list_console_messages]

 3. Filter for errors in response:
    - Look for messages where type === "error"
    - Note file name, line number, stack trace
```

**What you'll see:**
- Structured error data with type, text, source, lineNumber
- Complete stack traces for debugging
- Easier to filter and analyze programmatically

**Example automated error output:**
```json
{
  "type": "error",
  "text": "Uncaught TypeError: Cannot read property 'play' of null",
  "url": "https://example.com/video-player.js",
  "lineNumber": 45,
  "columnNumber": 12,
  "stackTrace": "at VideoPlayer.play (video-player.js:45:12)\n  at initialize (app.js:120:5)"
}
```

**CLI Alternative (browser-debugger-cli):**

For terminal-first workflows, use bdg CLI tool (mcp-chrome-devtools skill):

```bash
# Capture console errors
bdg https://example.com 2>&1
bdg console logs 2>&1 | jq '.[] | select(.level=="error")'
bdg stop 2>&1
```

See: .opencode/skills/mcp-tooling/mcp-chrome-devtools/ for complete CLI automation patterns

**Step 2: Reproduce Consistently**
- Can you trigger it reliably?
- Does it happen on every page load?
- Is it timing-dependent (race condition)?
- Does it only occur in certain browsers?
- Does it only happen on certain viewport sizes?
- If not reproducible → gather more data, don't guess

**Browser Testing Checklist:**
```markdown
□ Chrome (via Chrome DevTools MCP)
□ Mobile viewport (375px) - use Chrome DevTools emulation
□ Tablet viewport (991px) - use Chrome DevTools emulation
□ Desktop viewport (1920px)
□ Test all key viewport transitions (320px, 375px, 991px, 1920px)
```

**Note:** All browser testing done via Chrome. Cross-browser testing beyond Chrome is out of scope (MCP is Chrome-only).

**Step 3: Check Recent Changes**
- What changed that could cause this?
- `git log -5` to see recent commits
- `git diff` to see current changes
- New dependencies added?
- CDN version changes?
- Webflow republish introduced changes?

**Step 4: Gather Evidence in Browser DevTools**

Add diagnostic instrumentation at component boundaries:

```javascript
// Console.log at boundaries
console.log('[PageLoader] Initializing...', {
  element: loaderElement,
  duration: ANIMATION_DURATION,
  timestamp: Date.now()
});

// Log function entry/exit
function init_hero_video() {
  console.log('[HeroVideo] Init start', {
    video_element: document.querySelector('[video-hero]'),
    hls_supported: Hls.isSupported()
  });

  // ... implementation ...

  console.log('[HeroVideo] Init complete');
}

// Log state changes
element.addEventListener('transitionend', (event) => {
  console.log('[Animation] Transition end', {
    propertyName: event.propertyName,
    elapsedTime: event.elapsedTime
  });
});
```

**Multi-layer system example:**
```javascript
// Layer 1: DOM Ready
console.log('=== Document State ===', {
  readyState: document.readyState,
  bodyLoaded: !!document.body
});

// Layer 2: External Dependencies
console.log('=== Dependencies ===', {
  jQuery: typeof $ !== 'undefined',
  HLS: typeof Hls !== 'undefined'
});

// Layer 3: Element Availability
console.log('=== DOM Elements ===', {
  video_element: document.querySelector('[video-player]'),
  loader_element: document.querySelector('[page-loader]')
});
```

**Automated Network Request Capture:**

Instead of manually checking Network tab, capture requests programmatically:

```markdown
1. Navigate to page:
   [Use tool: mcp__chrome_devtools_2__navigate_page]
   - url: "https://example.com"

2. List network requests:
   [Use tool: mcp__chrome_devtools_2__list_network_requests]

3. Filter for failures in response:
   - Look for requests where status >= 400
   - Look for requests where status === 0 (blocked by ad blocker/CORS)
   - Note URL, status, type, size
```

**What you'll see:**
- All network requests with structured data
- Status codes, URLs, request types, file sizes
- Timing information for each request

**Example automated network output (failed request):**
```json
{
  "url": "https://cdn.jsdelivr.net/npm/hls.js@latest/dist/hls.min.js",
  "status": 0,
  "statusText": "Failed",
  "type": "script",
  "duration": 0,
  "size": 0
}
```

**Common failure patterns:**
- `status: 0` → Blocked by ad blocker, CORS issue, or network failure
- `status: 404` → Resource not found
- `status: 500` → Server error
- `status: 403` → Forbidden/authentication required

**CLI Alternative (browser-debugger-cli):**

For terminal-first workflows, use bdg CLI tool:

```bash
# Navigate and capture network activity (HAR file)
bdg https://example.com 2>&1
bdg har export network.har 2>&1
bdg stop 2>&1

# Analyze HAR file for failures
jq '.log.entries[] | select(.response.status >= 400 or .response.status == 0)' network.har
```

See: .opencode/skills/mcp-tooling/mcp-chrome-devtools/ for complete CLI automation patterns

**Step 5: Trace Data Flow**

Use browser DevTools Debugger:
- Set breakpoints in Sources tab
- Step through code execution
- Inspect variable values at each step
- Check call stack panel

```javascript
// Add debugger statement
function problematic_function(data) {
  debugger; // Execution pauses here
  process_data(data);
}

// Add stack trace logging
function track_error(error) {
  console.error('Error occurred:', error);
  console.trace(); // Prints full call stack
}
```

#### Phase 2: Pattern Analysis

**Find the pattern before fixing:**

**Step 1: Find Working Examples**
- Locate similar working code in same codebase
- Check other pages/components that work correctly
- Review past implementations in git history

**Step 2: Compare Against References**
- Read reference implementation COMPLETELY
- Check MDN Web Docs for browser API documentation
- Review library documentation (HLS.js, jQuery, etc.)
- Don't skim - read every line

**Useful References:**
- MDN Web Docs: https://developer.mozilla.org
- Can I Use: https://caniuse.com (browser compatibility)
- CSS Tricks: https://css-tricks.com

**Step 3: Identify Differences**
- What's different between working and broken?
- List every difference, however small
- Check CSS specificity differences
- Compare DOM structure
- Verify JavaScript execution order

**Comparison Checklist:**
```markdown
□ HTML structure identical?
□ CSS classes applied the same?
□ JavaScript execution order same?
□ Event listeners attached correctly?
□ Dependencies loaded in same order?
□ Webflow interactions configured identically?
```

**Step 4: Understand Dependencies**
- What other components does this need?
- What settings, config, environment?
- What assumptions does it make?
- Browser API availability?

#### Phase 3: Hypothesis and Testing

**Scientific method for frontend debugging:**

**Step 1: Form Single Hypothesis**
- State clearly: "I think X is the root cause because Y"
- Write it down in comments or console
- Be specific, not vague

**Example:**
```javascript
// HYPOTHESIS: Video not loading because HLS.js CDN blocked by ad blocker
// EVIDENCE: Console shows "Failed to load resource" for hls.js
// TEST: Load HLS.js from different CDN or local copy
```

**Step 2: Test Minimally**
- Make the SMALLEST possible change to test hypothesis
- One variable at a time
- Don't fix multiple things at once
- Use browser DevTools for live testing

**Testing Techniques:**
```javascript
// Technique 1: Console testing (no file changes)
document.querySelector('[video-player]').play();

// Technique 2: DevTools overrides
// Sources → Overrides → Enable local overrides
// Edit files live, see changes immediately
```

**Automated JavaScript Execution:**

Instead of manually typing in console, execute JavaScript via MCP tools:

```markdown
1. Navigate to page:
   [Use tool: mcp__chrome_devtools_2__navigate_page]
   - url: "https://example.com"

2. Test if element exists:
   [Use tool: mcp__chrome_devtools_2__evaluate_script]
   - script: "const element = document.querySelector('[video-hero]'); ({ exists: !!element, tagName: element?.tagName })"

3. Test if function is defined:
   [Use tool: mcp__chrome_devtools_2__evaluate_script]
   - script: "({ hlsAvailable: typeof Hls !== 'undefined' })"

4. Trigger function and check result:
   [Use tool: mcp__chrome_devtools_2__evaluate_script]
   - script: "const player = document.querySelector('video'); player.play(); ({ playing: !player.paused })"
```

**What you'll see:**
- Return values from JavaScript execution
- Structured data easy to analyze
- Test hypotheses without manual browser interaction

**Example automated test output:**
```json
{
  "success": true,
  "result": {
    "exists": true,
    "tagName": "VIDEO"
  }
}
```

This allows testing hypotheses programmatically without manual console typing.

**CLI Alternative (browser-debugger-cli):**

For terminal-first workflows, use bdg CLI tool:

```bash
# Navigate and execute JavaScript
bdg https://example.com 2>&1
bdg Runtime.evaluate --expression "document.querySelector('[video-hero]') !== null" 2>&1
bdg Runtime.evaluate --expression "typeof Hls" 2>&1
bdg stop 2>&1
```

See: .opencode/skills/mcp-tooling/mcp-chrome-devtools/ for complete CLI automation patterns

**Step 3: Verify Before Continuing**
- Did it work? Yes → Phase 4
- Didn't work? Form NEW hypothesis
- DON'T add more fixes on top

**Verification Checklist:**
```markdown
□ Issue resolved in current browser?
□ Issue resolved across all browsers?
□ Issue resolved on mobile viewports?
□ No new console errors introduced?
□ Animation timing still correct?
□ Performance not degraded?
```

**Step 4: When You Don't Know**
- Say "I don't understand X"
- Don't pretend to know
- Research more (MDN, Stack Overflow, etc.)
- Check browser compatibility tables

#### Phase 4: Implementation

**Fix the root cause, not the symptom:**

**Step 1: Document the Fix**
```javascript
// FIX: Chrome autoplay policy requires muted videos for autoplay
// See: https://developer.chrome.com/blog/autoplay
// Solution: Mute video initially, unmute on user interaction
videoElement.muted = true;
videoElement.play();

document.addEventListener('click', () => {
  videoElement.muted = false;
}, { once: true });
```

**Step 2: Implement Single Fix**
- Address the root cause identified
- ONE change at a time
- No "while I'm here" improvements

**Step 3: Verify Fix**
- Test in all target browsers
- Test on all viewport sizes
- Check console for errors
- Verify animations smooth

**Step 4: If Fix Doesn't Work**
- STOP
- Count: How many fixes have you tried?
- If < 3: Return to Phase 1
- **If ≥ 3: STOP and question the approach**

**Step 5: If 3+ Fixes Failed: Question Architecture**

Pattern indicating architectural problem:
- Each fix reveals new issue in different place
- Fixes require "massive refactoring"
- Each fix creates new symptoms elsewhere

STOP and question fundamentals:
- Is this pattern fundamentally sound for browsers?
- Are we fighting against browser defaults?
- Should we refactor architecture vs. continue fixing?

Discuss with project lead before attempting more fixes.

