---
title: Motion.dev Integration & Performance Optimization
description: CSS-first animation guide with Motion.dev integration for complex sequences and scroll-triggered effects. — Motion.dev Integration & Performance Optimization.
importance_tier: normal
contextType: implementation
version: 3.5.0.9
---

# Motion.dev Integration & Performance Optimization

## 4. MOTION.DEV INTEGRATION

> **Cross-stack motion.dev reference**: The full Motion.dev knowledge base lives at [`../animation/`](../animation/). Load by topic:
>
> - [`quick_start.md`](../animation/quick_start.md) — install modes, API availability, first-call patterns
> - [`animation_principles.md`](../animation/animation_principles.md) — timing, easing, stagger direction, anticipation, arc, and depth vocabulary
> - [`decision_matrix.md`](../animation/decision_matrix.md) — when to use Motion.dev vs CSS vs `requestAnimationFrame`
> - [`integration_patterns.md`](../animation/integration_patterns.md) — non-Webflow integration patterns and module loading
> - [`animate_and_timelines.md`](../animation/animate_and_timelines.md) — `animate()` API surface, keyframe shapes, easing
> - [`scroll_and_gestures.md`](../animation/scroll_and_gestures.md) — `scroll()`, `inView()`, gesture-driven animation
> - [`performance_and_pitfalls.md`](../animation/performance_and_pitfalls.md) — `will-change` cleanup, GPU acceleration, frame-rate gotchas
>
> The Webflow guidance in this section remains authoritative for Webflow CDN loading, `window.Motion`, and Designer-specific initialization timing.

### Library Loading (Global Setup)

**Load Motion.dev once as ES module in global.html:**

```html
<!-- src/html/global.html -->
<script type="module">
  const lib = await import('https://cdn.jsdelivr.net/npm/motion@{version}/+esm');
  window.Motion = lib; // { animate, inView, scroll, stagger, ... }
</script>
```

> **Note**: Check `global.html` for the current pinned version.

**Why this approach:**
- Single CDN request for all components
- Global availability prevents import duplication
- Version-locked for stability
- All Motion.dev functions available via `window.Motion`

### Component Initialization Pattern with Retry Logic

**Standard pattern for components using Motion.dev:**

```javascript
(() => {
  const INIT_FLAG = '__animationComponentCdnInit';
  const INIT_DELAY_MS = 100;  // Higher delay for Motion.dev dependency

  function init_animation() {
    const { animate, inView } = window.Motion || {};

    // CDN loading is unpredictable — retry until Motion library is available
    if (!animate || !inView) {
      setTimeout(init_animation, 100);
      return;
    }

    inView('.hero-element', ({ target }) => {
      animate(target,
        { opacity: [0, 1], y: [40, 0] },
        { duration: 0.6, easing: [0.22, 1, 0.36, 1] }
      );
    });
  }

  const start = () => {
    if (window[INIT_FLAG]) return;
    window[INIT_FLAG] = true;

    if (document.readyState !== 'loading') {
      setTimeout(init_animation, INIT_DELAY_MS);
      return;
    }

    document.addEventListener(
      'DOMContentLoaded',
      () => setTimeout(init_animation, INIT_DELAY_MS),
      { once: true }
    );
  };

  // Webflow compatibility
  if (window.Webflow?.push) {
    window.Webflow.push(start);
  } else {
    start();
  }
})();
```

**Pattern explanation:**
- `INIT_FLAG` prevents double initialization
- `INIT_DELAY_MS = 100` allows Motion.dev to load from CDN
- Retry logic handles variable CDN loading times
- `window.Motion || {}` safely destructures even if undefined

**See:** [code_quality_standards.md](../javascript/quality_standards.md) Section 4 for complete CDN-safe pattern documentation.

### Standardized Animation Parameters

**From/to arrays for properties (recommended approach):**

```javascript
const { animate } = window.Motion;

// Single property
animate(element, {
  opacity: [0, 1]  // From 0 to 1
}, { duration: 0.6 });

// Multiple properties
animate(element, {
  opacity: [0, 1],
  y: [40, 0],           // From 40px down to 0 (entrance from below)
  scale: [0.95, 1]      // From slightly smaller to full size
}, {
  duration: 0.6,
  easing: [0.22, 1, 0.36, 1]
});
```

**Standardized easing curves (aligned with Webflow):**

```javascript
const easings = {
  easeOut: [0.22, 1, 0.36, 1],    // General purpose, smooth deceleration
  expoOut: [0.16, 1, 0.3, 1]      // Dramatic entrances, strong deceleration
};

animate(element, properties, {
  duration: 0.6,
  easing: easings.easeOut
});
```

### In-View One-Time Entrances

**Trigger animations when elements scroll into view:**

```javascript
const { inView } = window.Motion;

// Basic in-view entrance
inView('.section', ({ target }) => {
  animate(target,
    { opacity: [0, 1], y: [40, 0] },
    { duration: 0.6 }
  );
}, {
  amount: 0.3  // Trigger when 30% of element is visible
});

// Multiple elements with stagger
inView('.card-grid', ({ target }) => {
  const cards = target.querySelectorAll('.card');

  cards.forEach((card, index) => {
    animate(card,
      { opacity: [0, 1], y: [20, 0] },
      {
        duration: 0.5,
        delay: index * 0.1  // Stagger by 100ms per card
      }
    );
  });
}, {
  amount: 0.2
});
```

### Performance Cleanup Pattern

**Always remove will-change after animations complete:**

```javascript
const { animate } = window.Motion;

animate(element, { opacity: [0, 1] }, {
  duration: 0.6,
  onComplete: () => {
    element.style.willChange = '';  // Remove GPU hint
  }
});
```

**Why this matters:**
- `will-change` promotes element to GPU layer (expensive)
- Keeping it active after animation wastes memory
- Browser manages layers better when will-change is removed

**Reference implementations:**

| File | Pattern Demonstrated |
|------|---------------------|
| `src/javascript/hero/hero_general.js` | InView-based multi-phase sequence, easing maps, loader fadeout, will-change cleanup |
| `src/javascript/hero/hero_blog_article.js` | Content-first then overlay, short durations, expoOut easing |

---

## 5. PERFORMANCE OPTIMIZATION

### Set Initial States (Prevent Flicker)

**Problem:** Elements are visible before JavaScript runs, then jump when animation starts.

**Solution:** Set initial animated state in CSS:

```css
/* Set initial state for entrance animations */
.animated-entrance {
  opacity: 0;
  transform: translateY(40px);
}

/* After JS runs, animate to final state */
.animated-entrance.is-visible {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}
```

```javascript
inView('.animated-entrance', ({ target }) => {
  target.classList.add('is-visible');
});
```

### Batch Style Reads and Writes

**Problem:** Interleaving reads and writes causes layout thrashing (multiple reflows).

**Solution:** Batch all reads first, then all writes:

```javascript
// ❌ BAD: Causes layout thrashing
elements.forEach(el => {
  const height = el.scrollHeight;  // Forces synchronous layout calculation
  el.style.height = `${height}px`;
  el.classList.add('active');
});
// Browser reflows 3 times (read-write-write per iteration)

// ✅ GOOD: Batch reads, then writes
const heights = elements.map(el => el.scrollHeight);
elements.forEach((el, i) => {
  el.style.height = `${heights[i]}px`;
  el.classList.add('active');
});
// Browser reflows only once (after all writes)
```

### Will-Change Lifecycle Management

**Proper will-change usage:**

```javascript
element.style.willChange = 'transform, opacity';

await animate(element, properties, {
  duration: 0.6,
  onComplete: () => {
    element.style.willChange = '';
  }
});
```

**When to use will-change:**
- Complex animations (multiple properties)
- Scroll-triggered animations (set on scroll start, remove on scroll end)
- High-frequency animations (dragging, following cursor)

**When NOT to use will-change:**
- Simple hover states (browser optimizes automatically)
- Permanent state (wastes GPU memory)
- Static elements (no animation planned)

---
