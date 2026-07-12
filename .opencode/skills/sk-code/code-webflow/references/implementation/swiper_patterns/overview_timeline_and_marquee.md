---
title: Swiper.js Integration Patterns
description: Production-tested Swiper.js configurations for carousels and marquees with IntersectionObserver autoplay control, accessibility, and Webflow integration.
trigger_phrases:
  - "webflow swiper patterns"
  - "swiper carousel configuration"
  - "marquee autoplay control"
  - "intersectionobserver autoplay"
importance_tier: normal
contextType: implementation
version: 3.5.0.4
---

# Swiper.js Integration Patterns

Production-tested Swiper.js configurations for carousels and marquees with IntersectionObserver autoplay control, accessibility, and Webflow integration.

---

## 1. OVERVIEW

### Purpose

This reference documents the Swiper.js patterns used in the example.com codebase, including standard carousel configuration, continuous marquee animations, visibility-based autoplay control, and Webflow class integration.

### When to Use

| Use Case | Pattern | Reference |
|----------|---------|-----------|
| Standard carousel with navigation | Timeline Pattern | Section 2 |
| Continuous scrolling marquee | Marquee Pattern | Section 3 |
| CPU-efficient autoplay | IntersectionObserver | Section 4 |
| Screen reader support | a11y Configuration | Section 5 |
| Webflow class integration | Custom Class Names | Section 6 |

### Core Principle

Swiper carousels must pause when off-screen to conserve CPU. Use IntersectionObserver with 0.1 threshold to start/stop autoplay based on visibility.

### Primary Sources

| File | Purpose | LOC |
|------|---------|-----|
| `/src/javascript/swiper/timeline.js` | Carousel with navigation/pagination | 158 |
| `/src/javascript/swiper/marquee_brands.js` | Continuous brand logo marquee | 133 |
| `/src/javascript/swiper/marquee_clients.js` | Continuous client logo marquee | 133 |

---

## 2. TIMELINE CAROUSEL PATTERN

### Configuration

Standard carousel configuration with navigation, pagination, and autoplay from `timeline.js:9-55`:

```javascript
const SWIPER_CONFIG = {
  // Basic settings
  speed: 600,
  slidesPerView: 1,
  spaceBetween: 0,
  centeredSlides: true,
  autoHeight: true,
  grabCursor: true,

  // Classes - Webflow integration
  wrapperClass: "swiper--wrapper",
  slideClass: "swiper--slide",

  // Navigation
  navigation: {
    nextEl: '[timeline-navigation="next"]',
    prevEl: '[timeline-navigation="previous"]',
  },

  // Pagination - fraction type
  pagination: {
    el: ".swiper-pagination",
    type: "fraction",
  },

  // Autoplay
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  },

  // Keyboard control
  keyboard: {
    enabled: true,
    onlyInViewport: true,
  },

  // Touch settings
  simulateTouch: true,
  touchEventsTarget: "container",

  // Accessibility
  a11y: {
    enabled: true,
  },
};
```

### Configuration Options Explained

| Option | Value | Purpose |
|--------|-------|---------|
| `speed` | 600 | Transition duration in milliseconds |
| `slidesPerView` | 1 | Show one slide at a time |
| `centeredSlides` | true | Active slide centered in viewport |
| `autoHeight` | true | Adjust height to match active slide |
| `grabCursor` | true | Show grab cursor on hover (desktop) |
| `disableOnInteraction` | false | Continue autoplay after user interaction |
| `pauseOnMouseEnter` | true | Pause autoplay on hover |
| `onlyInViewport` | true | Keyboard nav only when carousel visible |

### Loop Detection

From `timeline.js:78-86` - Only enable loop mode when multiple slides exist:

```javascript
// Check number of slides for loop functionality
const slides = contentContainer.querySelectorAll(".swiper--slide");
const slidesCount = slides.length;

// Reason: Only enable loop if more than one slide exists
const config = {
  ...SWIPER_CONFIG,
  loop: slidesCount > 1,
  // ... rest of config
};
```

### Initialization with Retry

From `timeline.js:60-77` - Handle Swiper loading asynchronously:

```javascript
function initTimelineSwiper() {
  // @ts-ignore - Swiper loaded externally
  if (typeof Swiper === "undefined") {
    console.warn("Timeline: Swiper not loaded yet, retrying...");
    setTimeout(initTimelineSwiper, 100);
    return;
  }

  const contentContainer = /** @type {HTMLElement|null} */ (
    document.querySelector(TIMELINE_CONTAINER)
  );

  if (!contentContainer) {
    console.warn("Timeline: Container not found");
    return;
  }

  // @ts-ignore - Swiper loaded externally
  const mainSwiper = new Swiper(contentContainer, config);
}
```

**Key patterns:**
- **Retry mechanism**: 100ms polling until Swiper library loads
- **TypeScript safety**: `@ts-ignore` for externally-loaded library
- **JSDoc casting**: Type annotations for DOM elements
- **Guard clauses**: Early return if container missing

---

## 3. MARQUEE PATTERN

### Configuration

Continuous scrolling marquee configuration from `marquee_brands.js:73-89`:

```javascript
const swiper = new Swiper(marqueeTrack, {
  wrapperClass: "marquee--container",
  slideClass: "marquee--item",
  spaceBetween: 0,                        // CSS handles spacing, not Swiper
  allowTouchMove: false,
  // Reason: Disable a11y for purely decorative scrolling content
  a11y: false,
  speed: 8000,                            // Animation duration in ms
  loop: true,                             // Enable infinite loop
  loopAddBlankSlides: false,              // Manual duplicates handle ultra-wide displays
  watchOverflow: false,                   // Keep autoplay running even if slides < viewport
  slidesPerView: "auto",                  // Auto-fit slides
  autoplay: {
    delay: 0,
    disableOnInteraction: false,          // Continuous motion even when user touches
  },
});
```

### Marquee vs Carousel Configuration

| Option | Marquee | Carousel | Reason |
|--------|---------|----------|--------|
| `speed` | 8000 | 600 | Slow continuous scroll vs quick transitions |
| `delay` | 0 | 3000 | Continuous vs paused between slides |
| `allowTouchMove` | false | true | Decorative vs interactive |
| `a11y` | false | true | Decorative content vs content navigation |
| `slidesPerView` | "auto" | 1 | Show all vs one at a time |
| `loop` | true | conditional | Always loop vs depends on slide count |

### Slide Duplication for Seamless Loop

From `marquee_brands.js:33-70` - Calculate and create duplicates for seamless infinite scroll:

```javascript
const slides = Array.from(marqueeContainer.querySelectorAll(".marquee--item"));
if (!slides.length) return;

// Calculate dimensions
const slideMetrics = slides.map((slide) => {
  const rect = slide.getBoundingClientRect();
  const width = rect.width || slide.offsetWidth || slide.scrollWidth || 0;
  return { slide, width };
});

const baseWidth = slideMetrics.reduce((sum, metric) => sum + metric.width, 0);
if (!baseWidth) return;

const trackWidth = Math.max(
  marqueeTrack.offsetWidth,
  marqueeTrack.getBoundingClientRect().width
);
const requiredWidth = trackWidth * 3;

// Calculate repeats needed for seamless loop
const repeatsNeeded = Math.max(
  2,
  Math.ceil(requiredWidth / baseWidth)
);
const MAX_REPEATS = 40;
const cappedRepeats = Math.min(repeatsNeeded, MAX_REPEATS);

if (cappedRepeats > 1) {
  const fragment = document.createDocumentFragment();

  for (let repeat = 1; repeat < cappedRepeats; repeat += 1) {
    slideMetrics.forEach(({ slide }) => {
      const clone = /** @type {HTMLElement} */ (slide.cloneNode(true));
      clone.setAttribute("data-marquee-duplicate", "true");
      clone.setAttribute("aria-hidden", "true");
      clone.removeAttribute("id");
      fragment.appendChild(clone);
    });
  }

  marqueeContainer.appendChild(fragment);
}
```

**Key patterns:**
- **3x viewport coverage**: Ensure enough content for seamless loop on wide screens
- **MAX_REPEATS cap**: Prevent DOM bloat (40 max)
- **DocumentFragment**: Batch DOM insertions for performance
- **aria-hidden**: Hide duplicates from screen readers
- **ID removal**: Prevent duplicate ID violations

---

