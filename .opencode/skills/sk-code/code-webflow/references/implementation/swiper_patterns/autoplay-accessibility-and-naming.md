---
title: IntersectionObserver Autoplay, Accessibility & Class Naming
description: Production-tested Swiper.js configurations for carousels and marquees with IntersectionObserver autoplay control, accessibility, and Webflow integration. — IntersectionObserver Autoplay, Accessibility & Class Naming.
importance_tier: normal
contextType: implementation
version: 3.5.0.4
---

# IntersectionObserver Autoplay, Accessibility & Class Naming

## 4. INTERSECTIONOBSERVER AUTOPLAY CONTROL

### Core Pattern

From `timeline.js:106-116` - Pause autoplay when carousel is off-screen to save CPU:

```javascript
// Pause autoplay when off-screen to save CPU
const timeline_visibility_observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      mainSwiper.autoplay.start();
    } else {
      mainSwiper.autoplay.stop();
    }
  });
}, { threshold: 0.1 });
timeline_visibility_observer.observe(contentContainer);
```

### Marquee Variant

From `marquee_brands.js:91-101` - Same pattern for marquee elements:

```javascript
// Pause autoplay when off-screen to save CPU
const visibility_observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      swiper.autoplay.start();
    } else {
      swiper.autoplay.stop();
    }
  });
}, { threshold: 0.1 });
visibility_observer.observe(marqueeTrack);
```

### Why 0.1 Threshold

| Threshold | Behavior | Use Case |
|-----------|----------|----------|
| 0 | Fires when any pixel visible/hidden | Too sensitive, false triggers |
| 0.1 | Fires when 10% visible | Balance of early start + reliability |
| 0.5 | Fires when 50% visible | Too late for autoplay start |
| 1.0 | Fires when 100% visible | Only for "fully visible" requirements |

**0.1 is optimal because:**
- Starts autoplay before user expects animation (smooth UX)
- Stops when mostly scrolled out (saves CPU)
- Avoids edge-case flickering at viewport boundaries

### Generic Reusable Pattern

```javascript
/**
 * Create visibility-based autoplay controller for Swiper
 * @param {Object} swiper - Swiper instance
 * @param {HTMLElement} container - Container element to observe
 * @returns {IntersectionObserver} Observer instance for cleanup
 */
function createAutoplayVisibilityObserver(swiper, container) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        swiper.autoplay.start();
      } else {
        swiper.autoplay.stop();
      }
    });
  }, { threshold: 0.1 });

  observer.observe(container);
  return observer;
}

// Usage
const swiper = new Swiper(container, config);
const visibilityObserver = createAutoplayVisibilityObserver(swiper, container);

// Cleanup (on page navigation or component destroy)
// visibilityObserver.disconnect();
```

---

## 5. ACCESSIBILITY CONFIGURATION

### Interactive Carousels (a11y: enabled)

From `timeline.js:52-54` - Enable accessibility for content carousels:

```javascript
// Accessibility
a11y: {
  enabled: true,
},
```

When `a11y: true`, Swiper automatically:
- Adds `role="group"` to slides
- Adds `aria-label` to navigation buttons
- Manages `aria-live` for slide changes
- Handles focus management

### Enhanced a11y with ARIA Labels

For more descriptive accessibility:

```javascript
a11y: {
  enabled: true,
  prevSlideMessage: 'Previous slide',
  nextSlideMessage: 'Next slide',
  firstSlideMessage: 'This is the first slide',
  lastSlideMessage: 'This is the last slide',
  paginationBulletMessage: 'Go to slide {{index}}',
  slideLabelMessage: 'Slide {{index}} of {{slidesLength}}',
},
```

### Manual ARIA Enhancement

From `timeline.js:87-92` - Adding custom ARIA attributes in init callback:

```javascript
on: {
  init: function (swiper) {
    const wrapper = swiper.wrapperEl;
    if (wrapper) {
      wrapper.setAttribute("role", "region");
      wrapper.setAttribute("aria-label", "Carousel slides");
    }
  },
},
```

### Decorative Marquees (a11y: disabled)

From `marquee_brands.js:78-79` - Disable accessibility for purely decorative content:

```javascript
// Reason: Disable a11y for purely decorative scrolling content
a11y: false,
```

**When to disable a11y:**
- Decorative marquees (logos, background animations)
- Duplicate content already accessible elsewhere
- Auto-scrolling content without user control

**When a11y disabled, ensure:**
- Duplicated content has `aria-hidden="true"`
- Essential content is available in accessible form elsewhere
- Container is not focusable

---

## 6. WEBFLOW CLASS NAMING

### Custom Class Configuration

Swiper uses default classes (`swiper-wrapper`, `swiper-slide`). Override for Webflow conventions:

```javascript
// From timeline.js:19-20
wrapperClass: "swiper--wrapper",
slideClass: "swiper--slide",

// From marquee_brands.js:74-75
wrapperClass: "marquee--container",
slideClass: "marquee--item",
```

### Class Naming Conventions

| Element Type | Default Class | Webflow Class | Pattern |
|--------------|---------------|---------------|---------|
| Wrapper | `swiper-wrapper` | `swiper--wrapper` | BEM-style double hyphen |
| Slide | `swiper-slide` | `swiper--slide` | BEM-style double hyphen |
| Marquee Wrapper | `swiper-wrapper` | `marquee--container` | Context-specific naming |
| Marquee Item | `swiper-slide` | `marquee--item` | Context-specific naming |

### Navigation with Data Attributes

From `timeline.js:23-26` - Using data attributes for navigation targeting:

```javascript
navigation: {
  nextEl: '[timeline-navigation="next"]',
  prevEl: '[timeline-navigation="previous"]',
},
```

**Advantages of data attributes:**
- More semantic than generic class selectors
- Scoped to component (multiple carousels on page)
- Self-documenting purpose
- Easy to find in Webflow Designer

### Webflow HTML Structure

```html
<!-- Timeline Carousel Structure -->
<div id="swiper-timeline" class="swiper">
  <div class="swiper--wrapper">
    <div class="swiper--slide">Slide 1</div>
    <div class="swiper--slide">Slide 2</div>
    <div class="swiper--slide">Slide 3</div>
  </div>
  <div class="swiper-pagination"></div>
  <button timeline-navigation="previous">Prev</button>
  <button timeline-navigation="next">Next</button>
</div>

<!-- Marquee Structure -->
<div class="marquee--track">
  <div class="marquee--container">
    <div class="marquee--item">Brand 1</div>
    <div class="marquee--item">Brand 2</div>
    <div class="marquee--item">Brand 3</div>
  </div>
</div>
```

---

