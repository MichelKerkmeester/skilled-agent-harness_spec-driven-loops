# Performance Optimization Patterns - Phase 1 Integration

Performance optimization checklist for frontend development (Motion.dev, HLS video, Webflow).

---

## 1. 📋 OVERVIEW

### Purpose
Performance optimization checklist for frontend development (Motion.dev, HLS video, Webflow).

### When to Use
Apply during Phase 1 (Implementation) when:
- Writing animation code (Motion.dev or CSS animations)
- Implementing video players (HLS.js)
- Adding interactive features
- Optimizing page load time
- Before deploying to production

---

## 2. ⚙️ PERFORMANCE CHECKLIST

### Code Splitting & Lazy Loading

**JavaScript:**
```javascript
// ✅ GOOD: Lazy load heavy libraries
async function load_video_player() {
  const Hls = await import('https://cdn.jsdelivr.net/npm/hls.js@latest/dist/hls.min.js');
  // Initialize player
}

// ❌ BAD: Load everything upfront
<script src="https://cdn.jsdelivr.net/npm/hls.js@latest/dist/hls.min.js"></script>
```

**Checklist:**
- [ ] Non-critical JavaScript loaded via dynamic import
- [ ] Vendor bundles separated from application code
- [ ] Route-based code splitting implemented where applicable

### Asset Optimization

**Images:**
```html
<!-- ✅ GOOD: WebP with fallback -->
<picture>
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="Description" loading="lazy">
</picture>

<!-- ❌ BAD: Large PNG/JPG without optimization -->
<img src="huge-image.png">
```

**Videos:**
```javascript
// ✅ GOOD: HLS streaming for large videos
const video = document.querySelector('video');
if (Hls.isSupported()) {
  const hls = new Hls({
    maxBufferLength: 30,  // Optimize buffer
    maxMaxBufferLength: 600
  });
  hls.loadSource('video.m3u8');
}

// ❌ BAD: Single large MP4 file
<video src="huge-video.mp4"></video>
```

**Fonts:**
```html
<!-- ✅ GOOD: Subset and preload critical fonts -->
<link rel="preload" href="fonts/subset.woff2" as="font" type="font/woff2" crossorigin>

<!-- ❌ BAD: Load entire font family -->
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;200;300;400;500;600;700;800;900">
```

**Checklist:**
- [ ] Images: WebP format with fallback
- [ ] Videos: HLS streaming for files >10MB
- [ ] Fonts: Subset and preload critical fonts (<50KB)
- [ ] CSS: Critical CSS inline, defer non-critical

### Animation Performance (Motion.dev & CSS)

**GPU-Accelerated Properties:**
```javascript
// ✅ GOOD: Use transform/opacity (GPU-accelerated) with Motion.dev
import { animate } from "motion"

animate(
  ".element",
  { y: [100, 0], opacity: [0, 1] },
  { easing: "ease-out" }
);

// ✅ GOOD: CSS animations with transform
@keyframes slideIn {
  from { transform: translateY(100px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

// ❌ BAD: Animate top/left (triggers layout)
animate(
  ".element",
  { top: [100, 0], left: [0, 100] }  // Triggers layout recalculation - Expensive!
);
```

**will-change Management:**
```javascript
// ✅ GOOD: Add/remove will-change with Motion.dev
element.style.willChange = 'transform, opacity';

animate(
  element,
  { x: 250 },
  {
    onComplete: () => {
      element.style.willChange = 'auto';  // Remove after animation
    }
  }
);

// ❌ BAD: Leave will-change active
element.style.willChange = 'transform';  // Never removed
```

**Low-end Device Testing:**
```markdown
Chrome DevTools → Performance tab → CPU throttling (4x slowdown)
Test animations on throttled CPU to verify 60fps maintained
```

**Checklist:**
- [ ] Only animate transform/opacity (no width/height/top/left)
- [ ] Set will-change before animation
- [ ] Remove will-change after animation completes
- [ ] Test on throttled CPU (4x slowdown)
- [ ] Verify 60fps in Performance tab

### Request Optimization

**API Caching:**
```javascript
// ✅ GOOD: Cache API responses
const fetch_data = async (url) => {
  const cached = sessionStorage.getItem(url);
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    const STALE_TIME = 5 * 60 * 1000;  // 5 minutes
    if (Date.now() - timestamp < STALE_TIME) {
      return data;
    }
  }

  const response = await fetch(url);
  const data = await response.json();
  sessionStorage.setItem(url, JSON.stringify({
    data,
    timestamp: Date.now()
  }));
  return data;
};

// ❌ BAD: Fetch on every request
const fetch_data = async (url) => {
  const response = await fetch(url);
  return response.json();
};
```

**Input Debouncing:**
```javascript
// ✅ GOOD: Debounce expensive operations
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

search_input.addEventListener('input', debounce((e) => {
  fetch_search_results(e.target.value);
}, 300));

// ❌ BAD: Fire on every keystroke
search_input.addEventListener('input', (e) => {
  fetch_search_results(e.target.value);  // Expensive API call every keystroke
});
```

**Lazy Loading with IntersectionObserver:**
```javascript
// ✅ GOOD: Lazy load images/content
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      observer.unobserve(img);
    }
  });
});

document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));

// ❌ BAD: Load all images upfront
document.querySelectorAll('img[data-src]').forEach(img => {
  img.src = img.dataset.src;  // All images load immediately
});
```

**Checklist:**
- [ ] API responses cached (staleTime: 5min default)
- [ ] User input handlers debounced (300ms default)
- [ ] Images/content lazy loaded with IntersectionObserver
- [ ] Third-party scripts minimized and loaded async
- [ ] CDN version parameters updated after changes

---

## 3. 📏 PERFORMANCE BUDGETS

**Target metrics:**
- First Contentful Paint (FCP): <1.8s
- Largest Contentful Paint (LCP): <2.5s
- Time to Interactive (TTI): <3.8s
- Total Blocking Time (TBT): <200ms
- Cumulative Layout Shift (CLS): <0.1

**Measure with:**
- Chrome DevTools Lighthouse tab
- Performance tab (record + analyze)
- Network tab (check waterfall)

### Automated Performance Measurement (MCP & CLI)

**Automate performance budget enforcement for regression detection:**

#### Option 1: Chrome DevTools MCP

**Core Web Vitals Monitoring:**
```markdown
1. Navigate to page:
   [Use tool: mcp__chrome_devtools_2__navigate_page]
   - url: "https://anobel.com"

2. Start performance trace:
   [Use tool: mcp__chrome_devtools_2__performance_start_trace]

3. Wait for page load and interaction

4. Stop trace and analyze:
   [Use tool: mcp__chrome_devtools_2__performance_stop_trace]

5. Extract metrics:
   - First Contentful Paint (FCP)
   - Largest Contentful Paint (LCP)
   - Cumulative Layout Shift (CLS)
   - Total Blocking Time (TBT)
```

#### Option 2: workflows-chrome-devtools (Terminal-based)

**Performance Budget Assertion Script:**
```bash
#!/bin/bash
# Enforce performance budgets with assertions

URL="https://anobel.com"

echo "Testing performance for: $URL"

# Start session
bdg "$URL" 2>&1

# Wait for page load
sleep 3

# Get performance metrics
METRICS=$(bdg cdp Performance.getMetrics 2>&1)

# Stop session
bdg stop 2>&1

# Extract key metrics
LAYOUT_DURATION=$(echo "$METRICS" | jq '.result.metrics[] | select(.name=="LayoutDuration") | .value')
SCRIPT_DURATION=$(echo "$METRICS" | jq '.result.metrics[] | select(.name=="ScriptDuration") | .value')
TASK_DURATION=$(echo "$METRICS" | jq '.result.metrics[] | select(.name=="TaskDuration") | .value')

echo "Performance Metrics:"
echo "  Layout Duration: ${LAYOUT_DURATION}ms"
echo "  Script Duration: ${SCRIPT_DURATION}ms"
echo "  Task Duration: ${TASK_DURATION}ms"

# Assert budgets (example thresholds)
FAIL=0

if (( $(echo "$TASK_DURATION > 3000" | bc -l) )); then
  echo "❌ FAIL: Task duration exceeds budget (${TASK_DURATION}ms > 3000ms)"
  FAIL=1
fi

if (( $(echo "$SCRIPT_DURATION > 2000" | bc -l) )); then
  echo "❌ FAIL: Script duration exceeds budget (${SCRIPT_DURATION}ms > 2000ms)"
  FAIL=1
fi

if [ $FAIL -eq 0 ]; then
  echo "✅ PASS: All performance budgets met"
else
  echo "❌ FAIL: Performance budget violations detected"
  exit 1
fi
```

**Network Performance Analysis:**
```bash
# Capture HAR file
bdg https://anobel.com 2>&1
bdg har export performance.har 2>&1
bdg stop 2>&1

# Calculate page load time
PAGE_LOAD=$(jq '[.log.entries[].time] | add' performance.har)
echo "Page load time: ${PAGE_LOAD}ms"

# Find slow requests (>500ms)
echo "Slow requests:"
jq '.log.entries[] | select(.time > 500) | {url: .request.url, time}' performance.har

# Calculate total transfer size
TOTAL_SIZE=$(jq '[.log.entries[].response.bodySize] | add' performance.har)
echo "Total transfer size: $((TOTAL_SIZE / 1024))KB"

# Assert budgets
if (( $(echo "$PAGE_LOAD > 3000" | bc -l) )); then
  echo "❌ FAIL: Page load exceeds budget (${PAGE_LOAD}ms > 3000ms)"
  exit 1
fi

if (( $(echo "$TOTAL_SIZE > 1000000" | bc -l) )); then
  echo "❌ FAIL: Transfer size exceeds budget ($((TOTAL_SIZE / 1024))KB > 1000KB)"
  exit 1
fi

echo "✅ PASS: Network performance budgets met"
```

**Animation Performance Check:**
```bash
# Check animation performance (from animation_workflows.md)
bdg https://anobel.com 2>&1

# Trigger animation
bdg js "document.querySelector('.animated-element').classList.add('animate')" 2>&1
sleep 1

# Get layout metrics
METRICS=$(bdg cdp Performance.getMetrics 2>&1)
bdg stop 2>&1

LAYOUT_COUNT=$(echo "$METRICS" | jq '.result.metrics[] | select(.name=="LayoutCount") | .value')
RECALC_COUNT=$(echo "$METRICS" | jq '.result.metrics[] | select(.name=="RecalcStyleCount") | .value')

echo "Animation Metrics:"
echo "  Layout count: $LAYOUT_COUNT"
echo "  Style recalc count: $RECALC_COUNT"

# Assert animation budgets
if [ "$LAYOUT_COUNT" -gt 3 ]; then
  echo "❌ FAIL: Too many layouts during animation ($LAYOUT_COUNT > 3)"
  exit 1
fi

if [ "$RECALC_COUNT" -gt 5 ]; then
  echo "❌ FAIL: Too many style recalculations ($RECALC_COUNT > 5)"
  exit 1
fi

echo "✅ PASS: Animation performance budgets met"
```

**CI/CD Integration**: These performance checks could be automated with shell scripts in your CI pipeline. Use the patterns above as a starting point.

**See:** `.opencode/skills/workflows-chrome-devtools/` for complete CLI automation patterns

---

## 4. 🚫 ANTI-PATTERNS

**Never:**
- ❌ Animate width/height/top/left (triggers layout)
- ❌ Use synchronous XHR requests
- ❌ Load large libraries without code splitting
- ❌ Leave will-change active after animation
- ❌ Skip lazy loading for below-the-fold content
- ❌ Ignore mobile performance (test on throttled CPU)

---

## 5. 🔗 RELATED RESOURCES

### Reference Files
- [debugging_workflows.md](./debugging_workflows.md) - Performance debugging workflows for identifying bottlenecks
- [verification_workflows.md](./verification_workflows.md) - Browser testing and verification workflows
- [devtools_guide.md](./devtools_guide.md) - Comprehensive Chrome DevTools reference for performance analysis
- [animation_workflows.md](./animation_workflows.md) - Animation performance patterns for GPU-accelerated properties
- [webflow_patterns.md](./webflow_patterns.md) - Webflow-specific performance considerations for collection lists

### Related Skills
- `workflows-chrome-devtools` - Automated performance budget enforcement via CLI for regression detection

### Standards
- **Integration with workflows-code**: Apply during Phase 1 (Implementation checklist), Phase 2 (Performance debugging), Phase 3 (Lighthouse verification)
