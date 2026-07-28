---
title: Performance Optimization Patterns - Phase 1 Integration
description: Performance optimization checklist covering animations, assets, requests, and Core Web Vitals budgets.
trigger_phrases:
  - "webflow performance patterns"
  - "core web vitals budgets"
  - "lazy loading code splitting"
  - "asset optimization checklist"
importance_tier: normal
contextType: implementation
version: 3.5.0.17
---

# Performance Optimization Patterns - Phase 1 Integration

Performance optimization checklist covering animations, assets, requests, and Core Web Vitals budgets.

---

## 1. OVERVIEW

### Purpose
Comprehensive performance optimization patterns for frontend development targeting Motion.dev animations, HLS video streaming, and Webflow platform constraints.

> **Cross-stack motion.dev reference**: For Motion-specific performance pitfalls, reduced-motion handling, and CSS/Motion/GSAP trade-offs outside Webflow, see [`../../animation/performance-and-pitfalls.md`](../../animation/performance-and-pitfalls.md) and [`../../animation/decision-matrix.md`](../../animation/decision-matrix.md). This Webflow performance guide remains authoritative for Webflow deployment and CWV evidence.

### When to Use
Apply during Phase 1 (Implementation) when:
- Writing animation code (Motion.dev or CSS animations)
- Implementing video players (HLS.js)
- Adding interactive features
- Optimizing page load time
- Before deploying to production

---

## 2. PERFORMANCE CHECKLIST

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

### `content-visibility` and Overflow-Visible Sections

`content-visibility:auto` is useful for long below-fold sections, but it adds skipped-paint behavior. On iOS WebKit browsers, including iOS Chrome, that can briefly expose the page background during scroll or viewport-bar changes when the section is also expected to paint overflow.

**Rule:** Never combine `content-visibility:auto` with Webflow sections that need visible overflow, sticky/overlapping descendants, or animated reveal content.

```html
<!-- GOOD: overflow-sensitive section uses the containment-only variant -->
<section class="section u--overflow-visible" data-render-content="overflow">
  ...
</section>

<!-- BAD: skipped-paint behavior can blank the section on iOS WebKit -->
<section class="section u--overflow-visible" data-render-content="large">
  ...
</section>
```

Keep the CSS guard in the global performance stylesheet so Designer mistakes fail safe:

```css
.u--overflow-visible[data-render-content] {
  content-visibility: visible;
  contain: layout style;
  contain-intrinsic-size: none;
}
```

**Verification:** On mobile Safari or iOS Chrome, scroll through the affected section and confirm it never flashes to the page background. In DevTools, the section should compute `content-visibility: visible`, not `auto`.

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

The codebase had **9 static `will-change` declarations in CSS** and **40+ premature declarations in JavaScript**, creating permanent compositor layers that waste GPU memory on every page load — even when no animation runs.

```css
/* ❌ BAD: Static will-change in CSS (creates permanent layer) */
.hero-card {
  will-change: transform, opacity;  /* Layer exists from page load! */
}

/* ✅ GOOD: No will-change in CSS — set dynamically via JS only */
.hero-card {
  /* No will-change here */
}
```

```javascript
// ✅ GOOD: Add will-change just before animation, remove after
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

// ❌ BAD: Set will-change in init() — never removed
function init() {
  element.style.willChange = 'transform';  // Permanent layer from page load
}

// ❌ BAD: Leave will-change active
element.style.willChange = 'transform';  // Never removed
```

**Rule:** Never use `will-change` in CSS stylesheets. Set dynamically in JS immediately before animation, remove on `onComplete`.

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

**Event Throttling (64ms for pointer events):**
```javascript
// ✅ GOOD: Throttle high-frequency events at 64ms (~15 Hz)
// Why 64ms? Perceptually smooth for cursor tracking, balances performance
const throttle = (func, wait = 64) => {
  let last_time = 0;
  let timeout_id = null;

  const throttled = (...args) => {
    const now = Date.now();
    const remaining = wait - (now - last_time);

    if (remaining <= 0) {
      last_time = now;
      func.apply(this, args);
    } else if (!timeout_id) {
      timeout_id = setTimeout(() => {
        last_time = Date.now();
        timeout_id = null;
        func.apply(this, args);
      }, remaining);
    }
  };

  throttled.cancel = () => {
    if (timeout_id) clearTimeout(timeout_id);
    timeout_id = null;
  };

  return throttled;
};

// Throttle pointermove to 64ms (~15 Hz)
const handle_pointer = throttle((e) => {
  update_cursor_position(e.clientX, e.clientY);
}, 64);

element.addEventListener('pointermove', handle_pointer);

// ❌ BAD: Fire on every pointer event (can be 60+ Hz on modern displays)
element.addEventListener('pointermove', (e) => {
  update_cursor_position(e.clientX, e.clientY);  // Fires every frame!
});
```

**Throttle vs Debounce - When to Use:**

| Pattern      | Timing | Use Case                       | Behavior                      |
| ------------ | ------ | ------------------------------ | ----------------------------- |
| **Throttle** | 64ms   | pointermove, scroll, RAF loops | Executes at regular intervals |
| **Debounce** | 100ms  | Search input                   | Waits for pause in input      |
| **Debounce** | 180ms  | Form validation                | Faster than typing speed      |
| **Debounce** | 200ms  | Resize handlers                | Avoids layout thrashing       |

**Key insight:** Throttle is for continuous events where you need regular updates. Debounce is for discrete events where you want to wait for the user to finish.

**Browser Auto-Throttling Insight:**
```javascript
// BROWSER FACT: requestAnimationFrame auto-throttles to ~1fps in background tabs
// No need for manual visibility management in RAF loops!

// ✅ GOOD: Let the browser handle background throttling
function animate_loop() {
  update_animation();
  requestAnimationFrame(animate_loop);  // Browser throttles when tab inactive
}

// ❌ UNNECESSARY: Manual visibility checks for RAF
document.addEventListener('visibilitychange', () => {
  if (document.hidden) stop_loop();  // Browser already does this!
  else start_loop();
});
```

See [performance-patterns.js](../../assets/patterns/performance-patterns.js) for production-ready throttle/debounce utilities with cancel methods.

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

