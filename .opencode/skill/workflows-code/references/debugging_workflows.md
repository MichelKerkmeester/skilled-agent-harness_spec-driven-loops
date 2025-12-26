# Debugging Workflows - Phase 2

Two systematic approaches to fixing frontend issues using browser DevTools and evidence-based debugging.

---

## 1. 📋 OVERVIEW

### Purpose
Systematic approaches to fixing frontend issues using browser DevTools and evidence-based debugging.

### When to Use
- Console errors or JavaScript failures
- Layout bugs or visual regressions
- Animation issues or jank
- Performance bottlenecks

### Platform-Specific Guides
- **Animation issues:** See [animation_workflows.md Section 7](./animation_workflows.md#7-🐛-common-issues-and-solutions)
- **Webflow issues:** See [webflow_patterns.md Section 3](./webflow_patterns.md#3-📚-collection-list-patterns)

### Core Principle
ALWAYS find root cause before attempting fixes. Symptom fixes are failure.

---

## 2. 🔍 SYSTEMATIC DEBUGGING

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
   - url: "https://anobel.com"

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
  "url": "https://anobel.com/video-player.js",
  "lineNumber": 45,
  "columnNumber": 12,
  "stackTrace": "at VideoPlayer.play (video-player.js:45:12)\n  at initialize (app.js:120:5)"
}
```

**CLI Alternative (browser-debugger-cli):**

For terminal-first workflows, use bdg CLI tool (workflows-chrome-devtools skill):

```bash
# Capture console errors
bdg https://anobel.com 2>&1
bdg console logs 2>&1 | jq '.[] | select(.level=="error")'
bdg stop 2>&1
```

See: .opencode/skill/workflows-chrome-devtools/ for complete CLI automation patterns

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
□ Tablet viewport (768px) - use Chrome DevTools emulation
□ Desktop viewport (1920px)
□ Test all key viewport transitions (320px, 375px, 768px, 1920px)
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
   - url: "https://anobel.com"

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
bdg https://anobel.com 2>&1
bdg har export network.har 2>&1
bdg stop 2>&1

# Analyze HAR file for failures
jq '.log.entries[] | select(.response.status >= 400 or .response.status == 0)' network.har
```

See: .opencode/skill/workflows-chrome-devtools/ for complete CLI automation patterns

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
   - url: "https://anobel.com"

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
bdg https://anobel.com 2>&1
bdg Runtime.evaluate --expression "document.querySelector('[video-hero]') !== null" 2>&1
bdg Runtime.evaluate --expression "typeof Hls" 2>&1
bdg stop 2>&1
```

See: .opencode/skill/workflows-chrome-devtools/ for complete CLI automation patterns

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

### Rules

**ALWAYS:**
- Open browser DevTools console BEFORE attempting fixes
- Read complete error messages and stack traces
- Test across multiple browsers
- Test on mobile viewports (320px, 768px minimum)
- Check Network tab for failed resource loads
- Add console.log statements to trace execution
- Test one change at a time
- Document browser-specific workarounds

**NEVER:**
- Skip console error messages
- Test only in one browser
- Ignore mobile viewport issues
- Change multiple things simultaneously
- Use `!important` without understanding why
- Proceed with 4th fix without questioning approach
- Skip Network tab inspection

**See also:** [debugging_checklist.md](../assets/debugging_checklist.md) for systematic debugging checklist

---

## 3. 🎯 ROOT CAUSE TRACING

**When to use**: Errors deep in call stack, event handlers fail mysteriously, animations break unexpectedly, unclear where invalid data originated

### Core Principle

Trace backward through the call chain and event flow until you find the original trigger, then fix at the source.

### The Tracing Process

#### Step 1: Observe the Symptom

```javascript
// Console error:
// Uncaught TypeError: Cannot read property 'play' of null
//   at VideoPlayer.play (video-player.js:45)
```

What this tells us:
- `video` element is null at line 45
- Error in `play()` method
- But WHY is it null?

#### Step 2: Find Immediate Cause

```javascript
// video-player.js:45
play() {
  this.video.play(); // ← this.video is null
}
```

Question: Why is `this.video` null?

#### Step 3: Trace One Level Up

Using DevTools Call Stack or console.trace():

```javascript
play() ← init_player() ← document.addEventListener('DOMContentLoaded')
```

Check `init_player()`:

```javascript
function init_player() {
  const player = new VideoPlayer('[video-hero]');
  player.play(); // Called play before video initialized
}
```

Problem found: `play()` called immediately after constructor, but video element not yet set.

#### Step 4: Keep Tracing Up

Execution flow:
1. DOMContentLoaded fires
2. init_player() runs
3. new VideoPlayer() constructor runs
4. Constructor querySelector('[video-hero]') returns null ← **ROOT CAUSE**
5. this.video = null
6. play() called on null video
7. Error!

Why did querySelector return null?
- Element doesn't exist yet (script in <head>, runs before <body>)
- Wrong selector
- Element inside iframe
- Webflow interaction hasn't added it yet

#### Step 5: Fix at Source

**DON'T fix the symptom** (adding null check in play()):
```javascript
// ❌ SYMPTOM FIX: Masks the real problem
play() {
  if (!this.video) return; // Silent failure
  this.video.play();
}
```

**DO fix the root cause** (ensure element exists):
```javascript
// ✅ ROOT CAUSE FIX
async function init_player() {
  // Wait for element to exist
  const element = await wait_for_element('[video-hero]');

  const player = new VideoPlayer('[video-hero]');
  await player.initialize(); // Wait for initialization
  player.play(); // Now safe to play
}
```

### Tracing Techniques

#### Technique 1: Browser DevTools Debugger

Most powerful tracing tool:

```javascript
function VideoPlayer(selector) {
  debugger; // Execution pauses here

  this.video = document.querySelector(selector);

  // In DevTools:
  // - Check "this.video" value in Scope panel
  // - Check Call Stack panel
  // - Step through line-by-line
}
```

**DevTools Features:**
- **Breakpoints**: Click line number in Sources tab
- **Conditional breakpoints**: Right-click line → "Add conditional breakpoint"
- **Call Stack**: See full execution path
- **Scope**: Inspect all variables
- **Watch**: Monitor specific expressions
- **Step Over/Into/Out**: Navigate execution

#### Technique 2: console.trace() - Print Call Stack

```javascript
function problematic_function(data) {
  console.trace('[VideoPlayer] play() called with:', {
    video: this.video,
    data: data
  });

  this.video.play();
}
```

Output:
```
[VideoPlayer] play() called with: { video: null, ... }
  play @ video-player.js:45
  init_player @ app.js:120
  (anonymous) @ app.js:15
  DOMContentLoaded
```

#### Technique 3: Console Logging at Boundaries

```javascript
class VideoPlayer {
  constructor(selector) {
    console.log('[VideoPlayer] Constructor called', {
      selector: selector,
      timestamp: Date.now()
    });

    this.video = document.querySelector(selector);

    console.log('[VideoPlayer] Query result', {
      found: !!this.video,
      element: this.video
    });
  }

  play() {
    console.log('[VideoPlayer] play() called', {
      hasVideo: !!this.video,
      readyState: this.video?.readyState
    });

    if (!this.video) {
      console.error('[VideoPlayer] play() called with null video!');
      console.trace(); // Print call stack
      return;
    }

    this.video.play();
  }
}
```

#### Technique 4: Event Listener Inspection

```javascript
// Which events are attached?
getEventListeners(document.querySelector('[nav-button]'));

// Check if events fire
document.querySelector('[nav-button]').addEventListener('click', (e) => {
  console.log('[NavButton] Click event fired', {
    target: e.target,
    timestamp: Date.now()
  });

  console.trace('[NavButton] Click trace');
}, { capture: true });
```

#### Technique 5: Mutation Observer - Track DOM Changes

```javascript
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    console.log('[MutationObserver] DOM changed', {
      type: mutation.type,
      target: mutation.target
    });

    console.trace('[MutationObserver] Change source');
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true
});
```

### Rules

**ALWAYS:**
- Use browser DevTools debugger for complex issues
- Add console.trace() to find call stack
- Log at component boundaries (entry/exit)
- Check DevTools Call Stack panel
- Trace backward from symptom to source
- Fix at the source, not symptom
- Document root cause in comments
- Remove debug logs after fixing

**NEVER:**
- Fix only where error appears without tracing
- Add symptom fixes (null checks without understanding why)
- Skip DevTools investigation
- Guess at root cause without evidence
- Leave production console.log statements
- Stop at first function in stack (keep tracing up)

**See also:** [debugging_checklist.md](../assets/debugging_checklist.md) for tracing checklist

---

## 4. 🔍 PERFORMANCE DEBUGGING

**When to use**: Slow page load, janky animations, memory leaks, high CPU usage

### Core Principle

Identify performance bottlenecks using Chrome DevTools Performance tab before attempting optimizations.

### Performance Profiling

#### Chrome DevTools Performance Tab

**Step 1: Record Performance**
1. Open DevTools → Performance tab
2. Click Record button (circle icon)
3. Perform the interaction you want to optimize
4. Stop recording after 3-5 seconds

**Step 2: Analyze Flame Graph**
```markdown
Colors indicate activity type:
- Yellow = JavaScript execution
- Purple = Rendering (style calculation, layout)
- Green = Painting
- Gray = System/idle time

Look for:
- Long tasks (>50ms) - blocks main thread
- Layout thrashing - repeated forced reflows
- Excessive JavaScript execution
```

**Step 3: Identify Bottlenecks**

**Bottom-Up View:**
- Shows which functions consumed most time
- Sort by "Self Time" to find expensive operations
- Click function to see call sites

**Call Tree View:**
- Shows execution hierarchy
- Trace from top-level to expensive leaf functions
- Reveals why expensive functions were called

**Event Log View:**
- Chronological list of events
- Filter by type (Animation, Rendering, Painting)
- Check durations and identify slow events

#### Bottleneck Detection Patterns

**Layout Thrashing:**
```javascript
// ❌ BAD: Forces layout on every iteration
elements.forEach(el => {
  const height = el.offsetHeight;  // Read (forces layout)
  el.style.top = height + 'px';    // Write
});

// ✅ GOOD: Batch reads, then batch writes
const heights = elements.map(el => el.offsetHeight);  // Batch reads
elements.forEach((el, i) => {
  el.style.top = heights[i] + 'px';  // Batch writes
});
```

**Expensive JavaScript:**
```javascript
// Flame graph shows yellow bar >50ms in process_data()
function process_data(items) {
  // Profile shows nested loop takes 95% of time
  items.forEach(item => {
    items.forEach(other => {  // O(n²) - bottleneck!
      compare(item, other);
    });
  });
}

// Solution: Optimize algorithm
function process_data(items) {
  const map = new Map();  // O(n) instead of O(n²)
  items.forEach(item => map.set(item.id, item));
  // ... optimized logic
}
```

### Memory Leak Detection

#### Chrome DevTools Memory Tab

**Step 1: Take Heap Snapshot**
1. Open DevTools → Memory tab
2. Select "Heap snapshot"
3. Click "Take snapshot" (baseline)

**Step 2: Perform Interaction**
1. Perform the action suspected of leaking (e.g., open/close modal 10 times)
2. Take another snapshot

**Step 3: Compare Snapshots**
1. Select second snapshot
2. Change view to "Comparison"
3. Sort by "Size Delta" (descending)

**Step 4: Identify Leaks**

**Detached DOM Nodes:**
```markdown
Detached nodes = DOM elements removed from tree but still referenced in JS

Look for:
- "Detached HTMLDivElement" in snapshot
- Size delta growing after repeated actions
- Event listeners still attached to detached nodes
```

**Common leak patterns:**
```javascript
// ❌ BAD: Event listener not removed
function show_modal() {
  const modal = document.querySelector('.modal');
  modal.addEventListener('click', handle_click);
  // Modal removed from DOM, but event listener still referenced
}

// ✅ GOOD: Remove event listener
function show_modal() {
  const modal = document.querySelector('.modal');
  const handler = () => handle_click();
  modal.addEventListener('click', handler);

  // Cleanup
  modal.addEventListener('close', () => {
    modal.removeEventListener('click', handler);
  });
}

// ✅ BETTER: Use { once: true }
modal.addEventListener('click', handle_click, { once: true });
```

**Closures Holding References:**
```javascript
// ❌ BAD: Closure holds reference to large data
function process_data() {
  const large_data = fetchLargeDataset();  // 10MB array

  document.querySelector('.btn').addEventListener('click', () => {
    console.log('Clicked');  // Closure holds reference to large_data
  });
}

// ✅ GOOD: Release reference after use
function process_data() {
  let large_data = fetchLargeDataset();
  processIt(large_data);
  large_data = null;  // Release reference

  document.querySelector('.btn').addEventListener('click', () => {
    console.log('Clicked');  // No reference to large_data
  });
}
```

### Network Waterfall Analysis

#### Chrome DevTools Network Tab

**Step 1: Record Network Activity**
1. Open DevTools → Network tab
2. Reload page (Cmd+R)
3. Wait for all resources to load

**Step 2: Analyze Waterfall**

**Resource Timeline:**
```markdown
Blue vertical line = DOMContentLoaded
Red vertical line = Load event

Each request shows:
- Queueing (gray) - waiting for available connection
- Stalled (gray) - waiting due to request prioritization
- DNS Lookup (green)
- Initial Connection (orange)
- SSL (purple)
- Request Sent (light green)
- Waiting (TTFB - green)
- Content Download (blue)
```

**Optimization Opportunities:**

**Slow Requests (>500ms):**
```markdown
1. Filter by "XHR" or "Fetch"
2. Sort by "Time" column (descending)
3. Identify slow API calls
4. Optimize:
   - Add server-side caching
   - Reduce payload size
   - Use CDN for static assets
```

**Failed Requests:**
```markdown
Red requests = failed (400/500 errors)
Blocked = ad blocker or CORS issue

Solutions:
- Check browser console for CORS errors
- Verify resource URLs are correct
- Check Network tab "Status" column
```

**Request Queueing:**
```markdown
Long gray bars at start = request queueing

Browsers limit concurrent connections (6-8 per domain)

Solutions:
- Use HTTP/2 (multiplexing)
- Load from multiple domains (domain sharding)
- Prioritize critical resources
```

**Optimization Checklist:**
```markdown
- [ ] Requests taking >500ms identified and optimized
- [ ] Failed requests (red) investigated and fixed
- [ ] Blocked requests (gray) unblocked or removed
- [ ] Request queueing minimized
- [ ] Resources loaded from CDN where possible
- [ ] Compression enabled (gzip/brotli)
- [ ] HTTP/2 enabled for multiplexing
```

### Automated Performance Metrics (MCP & CLI)

**Automated performance measurement enables objective benchmarking and regression detection:**

#### Option 1: Chrome DevTools MCP

**Core Web Vitals Capture:**
```markdown
1. Navigate to page:
   [Use tool: mcp__chrome_devtools_2__navigate_page]
   - url: "https://anobel.com"

2. Start performance trace:
   [Use tool: mcp__chrome_devtools_2__performance_start_trace]

3. Interact with page (trigger animations, scroll, etc.)

4. Stop trace and get metrics:
   [Use tool: mcp__chrome_devtools_2__performance_stop_trace]

5. Analyze trace data:
   - Look for Long Tasks (>50ms)
   - Check FCP (First Contentful Paint)
   - Check LCP (Largest Contentful Paint)
   - Check CLS (Cumulative Layout Shift)
```

**Network Performance Metrics:**
```markdown
1. Navigate and list network requests:
   [Use tool: mcp__chrome_devtools_2__list_network_requests]

2. Analyze request timing:
   - Total page load time
   - Time to first byte (TTFB)
   - Resource download times
   - Failed/slow requests (>500ms)
```

#### Option 2: workflows-chrome-devtools (Terminal-based)

**Performance Metrics Capture:**
```bash
# Navigate to page
bdg https://anobel.com 2>&1

# Get performance metrics
bdg cdp Performance.getMetrics 2>&1 > performance-metrics.json

# Parse metrics
jq '.result.metrics[] | select(.name | contains("Layout") or contains("Script") or contains("Paint"))' performance-metrics.json

# Stop session
bdg stop 2>&1
```

**Key metrics to monitor:**
- `LayoutCount` - Number of layout operations
- `RecalcStyleCount` - Style recalculations
- `LayoutDuration` - Time spent in layout (ms)
- `ScriptDuration` - JavaScript execution time (ms)
- `TaskDuration` - Total task duration (ms)

**Network HAR Analysis:**
```bash
# Capture full network trace
bdg https://anobel.com 2>&1
bdg har export network-trace.har 2>&1
bdg stop 2>&1

# Find slow requests (>500ms)
jq '.log.entries[] | select(.time > 500) | {url: .request.url, time, status: .response.status}' network-trace.har

# Find large resources (>1MB)
jq '.log.entries[] | select(.response.content.size > 1000000) | {url: .request.url, size: .response.content.size, type: .response.content.mimeType}' network-trace.har

# Calculate total page load time
jq '[.log.entries[].time] | add' network-trace.har
```

**Memory Metrics:**
```bash
# Get JavaScript heap size
bdg https://anobel.com 2>&1
bdg cdp Performance.getMetrics 2>&1 | jq '.result.metrics[] | select(.name | contains("JSHeap"))'
bdg stop 2>&1
```

**Example metrics output:**
```json
{
  "name": "JSHeapUsedSize",
  "value": 12500000
},
{
  "name": "JSHeapTotalSize",
  "value": 25000000
}
```

**DOM Statistics:**
```bash
# Get DOM node count
bdg https://anobel.com 2>&1
bdg js "document.getElementsByTagName('*').length" 2>&1
bdg stop 2>&1

# Get specific element counts
bdg js "document.images.length" 2>&1  # Image count
bdg js "document.scripts.length" 2>&1  # Script count
bdg js "document.styleSheets.length" 2>&1  # Stylesheet count
```

**Performance Baseline Workflow:**
```bash
#!/bin/bash
# Create performance baseline for regression testing

URL="https://anobel.com"
OUTPUT_DIR="performance-baselines"
mkdir -p "$OUTPUT_DIR"

# Start session
bdg "$URL" 2>&1

# Capture metrics
bdg cdp Performance.getMetrics 2>&1 > "$OUTPUT_DIR/metrics-$(date +%Y%m%d).json"

# Capture HAR
bdg har export "$OUTPUT_DIR/network-$(date +%Y%m%d).har" 2>&1

# Capture screenshot
bdg screenshot "$OUTPUT_DIR/screenshot-$(date +%Y%m%d).png" 2>&1

# Stop session
bdg stop 2>&1

echo "✅ Baseline captured: $OUTPUT_DIR/"
```

**See:** `.opencode/skill/workflows-chrome-devtools/` for complete CLI automation patterns

---

## 5. 📋 QUICK REFERENCE

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

## 6. 🔗 RELATED RESOURCES

### Reference Files
- [implementation_workflows.md](./implementation_workflows.md) - Debug timing and validation issues
- [verification_workflows.md](./verification_workflows.md) - Verify fixes work correctly
- [shared_patterns.md](./shared_patterns.md) - Use common DevTools and logging patterns
- [devtools_guide.md](./devtools_guide.md) - Comprehensive DevTools reference

### Templates
- [debugging_checklist.md](../assets/debugging_checklist.md) - Systematic debugging checklist

### Related Skills
- `workflows-chrome-devtools` - CLI-based browser automation via browser-debugger-cli (bdg)

### External Resources
- [MDN Web Docs](https://developer.mozilla.org) - Browser APIs and JavaScript documentation
- [Can I Use](https://caniuse.com) - Browser compatibility tables
- [CSS Tricks](https://css-tricks.com) - CSS patterns and techniques

---

**For complete checklists:**
- [debugging_checklist.md](../assets/debugging_checklist.md) - Systematic debugging checklist
- [devtools_guide.md](./devtools_guide.md) - Comprehensive DevTools reference