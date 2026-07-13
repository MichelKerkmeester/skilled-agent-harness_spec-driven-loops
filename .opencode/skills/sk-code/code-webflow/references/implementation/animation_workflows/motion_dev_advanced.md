---
title: Motion.dev Advanced Patterns & Related
description: CSS-first animation guide with Motion.dev integration for complex sequences and scroll-triggered effects. — Motion.dev Advanced Patterns & Related.
trigger_phrases:
  - "motion dev advanced"
  - "dev advanced patterns"
  - "motion dev patterns"
  - "webflow motion dev"
importance_tier: normal
contextType: implementation
version: 3.5.0.9
---

# Motion.dev Advanced Patterns & Related

CSS-first animation guide with Motion.dev integration for complex sequences and scroll-triggered effects. — Motion.dev Advanced Patterns & Related.

---

## 1. OVERVIEW

### Purpose

Advanced motion.dev animation techniques for Webflow — sequencing, scroll-linked and gesture-driven motion, and the edge cases that sit beyond the basic integration — with pointers to the related animation references.

### When to Use

- Building sequenced or timeline-based motion.dev animations beyond simple transitions
- Coordinating scroll-linked or gesture-driven motion in a Webflow project
- Debugging advanced motion.dev behavior the basic integration guide does not cover

---

## 2. MOTION.DEV ADVANCED PATTERNS

### Timeline Sequences

**For coordinated multi-element animations with precise timing:**

```javascript
// From hero_general.js - Background padding animation followed by content
const { animate } = window.Motion;

// Parallel animations with shared timeline
if (elements.backgrounds.length) {
  animate(elements.backgrounds, {
    paddingTop: [CONFIG.styles.background_padding.initial_top, CONFIG.styles.background_padding.top],
    paddingLeft: [CONFIG.styles.background_padding.initial_sides, CONFIG.styles.background_padding.sides],
    paddingRight: [CONFIG.styles.background_padding.initial_sides, CONFIG.styles.background_padding.sides],
  }, {
    duration: 1.4,
    delay: 0,
    easing: [0.16, 1, 0.3, 1],  // expo_out
    onComplete: () => remove_will_change_batch(elements.backgrounds)
  });
}

// Sequenced content animation (starts after background)
if (elements.headers.length && header_animation) {
  animate(elements.headers, header_animation, {
    duration: 0.9,
    delay: 0.65,  // Starts after background begins
    easing: [0.16, 1, 0.3, 1],
    onComplete: () => remove_will_change_batch(elements.headers, ["transform", "opacity"])
  });
}
```

**Key pattern:** Use `delay` to sequence animations without nesting callbacks.

### Stagger Animations

**For animating multiple elements with incremental delays:**

```javascript
// Manual stagger pattern (hero_general.js approach)
const cards = target.querySelectorAll('.card');

cards.forEach((card, index) => {
  animate(card,
    { opacity: [0, 1], y: [20, 0] },
    {
      duration: 0.5,
      delay: index * 0.1  // 100ms stagger between each card
    }
  );
});

// Alternative: Using Motion.dev stagger function
const { animate, stagger } = window.Motion;

animate('.card', 
  { opacity: [0, 1], y: [20, 0] },
  { 
    duration: 0.5,
    delay: stagger(0.1)  // 100ms between each element
  }
);

// Stagger with easing (start slow, speed up)
animate('.item',
  { opacity: [0, 1] },
  {
    delay: stagger(0.1, { ease: [0.22, 1, 0.36, 1] })
  }
);
```

### Scroll-Triggered with inView()

**Trigger animations when elements enter viewport:**

```javascript
const { animate, inView } = window.Motion;

// Basic inView entrance (one-time trigger)
inView('.hero-section', (info) => {
  // Prevent duplicate animation
  if (info.target.dataset.animated === 'done') return;
  info.target.dataset.animated = 'done';
  
  build_hero_animation(info.target);
}, { 
  amount: 0.1  // Trigger when 10% visible
});

// inView with cleanup function (for continuous animations)
inView('.video-section', ({ target }) => {
  const controls = animate(target, { opacity: 1 }, { duration: 0.6 });

  return () => {
    controls.stop();
    target.style.opacity = '0';
  };
});

// Multiple thresholds
inView('.section', callback, { 
  amount: 0.3,  // 30% of element visible
  margin: '-100px'  // Offset trigger by 100px
});
```

### Cleanup Patterns

**Proper resource management after animations:**

```javascript
// 1. Remove will-change after animation completes
const remove_will_change = (element, extra_properties = []) => {
  if (!element || !element.style) return;
  element.style.removeProperty('will-change');
  element.style.removeProperty('transition');
  extra_properties.forEach(prop => {
    const css_property = prop.includes('-')
      ? prop
      : prop.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
    element.style.removeProperty(css_property);
  });
};

// 2. Batch cleanup for multiple elements
const remove_will_change_batch = (nodes, extra_properties = []) => {
  if (!nodes) return;
  const list = nodes.length !== undefined ? nodes : [nodes];
  Array.from(list).forEach((node) => remove_will_change(node, extra_properties));
};

// 3. Use in animation onComplete callback
animate(element, { opacity: [0, 1], y: [40, 0] }, {
  duration: 0.6,
  easing: [0.22, 1, 0.36, 1],
  onComplete: () => remove_will_change_batch(element, ['transform', 'opacity'])
});

// 4. Animation controls for manual stop
const controls = animate(element, { x: [0, 100] }, { duration: 2 });

// Stop animation early (e.g., on user interaction or component unmount)
controls.stop();

// 5. will-change lifecycle: Set before → Animate → Remove after
element.style.willChange = 'transform, opacity';
await animate(element, properties, {
  onComplete: () => {
    element.style.willChange = 'auto';  // Reset to default
  }
});
```

### Viewport-Responsive Timing

**Adjust animation timing based on device:**

```javascript
// Cache viewport type for performance
let cached_viewport = null;
let viewport_cache_time = 0;
const CACHE_DURATION = 100; // ms

const get_viewport_type = () => {
  const now = performance.now();
  if (!cached_viewport || now - viewport_cache_time > CACHE_DURATION) {
    cached_viewport = {
      is_desktop: window.innerWidth >= 992,
      is_mobile: window.innerWidth < 992,
    };
    viewport_cache_time = now;
  }
  return cached_viewport;
};

// Use in animation setup
const { is_desktop, is_mobile } = get_viewport_type();

const timing = {
  duration: is_mobile ? 0.8 : 0.6,
  delay: is_mobile ? 0.1 : 0.65,
  slide_distance: is_mobile ? '3rem' : '50%',
};

animate(element, {
  y: [timing.slide_distance, '0'],
  opacity: [0, 1]
}, {
  duration: timing.duration,
  delay: timing.delay,
  easing: is_mobile ? [0.16, 1, 0.3, 1] : [0.22, 1, 0.36, 1]
});
```

**Reference implementation:** `src/javascript/hero/hero_general.js:302-549`

---

## 3. RELATED RESOURCES

### Reference Files
- [`../../css/patterns/tokens_state_machine_and_triggers.md`](../../css/patterns/tokens_state_machine_and_triggers.md) — CSS animation-relevant patterns (state machine pattern, color-mix interpolation, GPU-accelerated state triggers)
- [implementation_workflows.md](../implementation_workflows/condition_based_waiting.md) - Implementation phase guidance
- [debugging_workflows.md](../../debugging/debugging_workflows/systematic_four_phases.md) - Animation debugging techniques
- [verification_workflows.md](../../verification/verification_workflows/gate_and_automated_options.md) - Animation verification procedures
- [code_quality_standards.md](../../javascript/quality_standards/init_dom_error_and_async.md) - CDN-safe initialization patterns
- [`../../css/quality_standards/patterns_and_naming_enforcement.md`](../../css/quality_standards/patterns_and_naming_enforcement.md) - CSS animation quality patterns (will-change management, GPU-accelerated properties, easing standards aligned with Motion.dev, fluid typography)

### Related Skills
- `mcp-chrome-devtools` - CLI-based performance profiling and animation testing

### External Resources
- [Motion.dev Documentation](https://motion.dev) - Motion animation library documentation
- [MDN Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API) - Browser animation APIs
- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/) - Performance profiling guide

---

**Core principle:** CSS first for simplicity, Motion.dev for complexity. Keeps payloads small, performance high, and behavior predictable.
