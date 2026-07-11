---
title: Performance Debugging
description: Systematic debugging with four-phase investigation, root cause tracing, and performance profiling. — Performance Debugging.
importance_tier: normal
contextType: implementation
version: 3.5.0.18
---

# Performance Debugging

## 4. PERFORMANCE DEBUGGING

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
   - url: "https://example.com"

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

#### Option 2: mcp-chrome-devtools (Terminal-based)

**Performance Metrics Capture:**
```bash
# Navigate to page
bdg https://example.com 2>&1

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
bdg https://example.com 2>&1
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
bdg https://example.com 2>&1
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
bdg https://example.com 2>&1
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

URL="https://example.com"
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

**See:** `.opencode/skills/mcp-tooling/mcp-chrome-devtools/` for complete CLI automation patterns

---

