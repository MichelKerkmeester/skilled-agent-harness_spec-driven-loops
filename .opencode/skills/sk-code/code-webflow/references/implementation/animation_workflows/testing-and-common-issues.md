---
title: Testing/Debugging Procedures & Common Issues
description: CSS-first animation guide with Motion.dev integration for complex sequences and scroll-triggered effects. — Testing/Debugging Procedures & Common Issues.
importance_tier: normal
contextType: implementation
version: 3.5.0.9
---

# Testing/Debugging Procedures & Common Issues

## 6. TESTING AND DEBUGGING PROCEDURES

### Pre-Deployment Checklist

**Cross-device timing verification:**
1. **Desktop** - Verify full animation durations feel natural
2. **Tablet** - Check medium viewport behavior, adjust if needed
3. **Mobile** - Ensure animations are brief (300ms max recommended for mobile)

**Why mobile needs shorter durations:** Mobile devices have smaller screens where motion is more noticeable, and users expect snappier interactions.

### Layout Stability Testing

**Prevent content jumps during animation:**

1. **Measure before animating** - Capture `scrollHeight`, `offsetWidth` before transition
2. **Apply transitions to measured pixel values** - Animate from/to known values
3. **Set `auto` after transition completes** - Use `transitionend` event
4. **Verify no content jumps** - Check surrounding content doesn't shift

**Testing procedure:**
```javascript
// Add visual debugging
element.addEventListener('transitionstart', () => {
  console.log('Animation start:', {
    height: element.offsetHeight,
    scroll: window.scrollY
  });
});

element.addEventListener('transitionend', () => {
  console.log('Animation end:', {
    height: element.offsetHeight,
    scroll: window.scrollY
  });
});

// Scroll position should not change during animation
```

### Reduced Motion Testing

**Required testing for accessibility compliance:**

1. **Enable "Reduce motion" in OS settings**
   - macOS: System Preferences → Accessibility → Display → Reduce motion
   - Windows: Settings → Ease of Access → Display → Show animations
   - iOS/Android: Accessibility settings → Reduce motion

2. **Verify animations skip or use minimal duration (<20ms)**
   - Elements should instantly appear in final state
   - No jarring transitions or sudden movements

3. **Confirm end states are visually correct without animation**
   - All content visible and positioned correctly
   - No missing or hidden elements

**JavaScript detection pattern:**
```javascript
const prefers_reduced_motion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

if (prefers_reduced_motion) {
  // Skip animation, apply end state directly
  element.style.opacity = '1';
  element.style.transform = 'none';
} else {
  // Run full animation sequence
  animate(element, { opacity: [0, 1] }, { duration: 0.6 });
}
```

### Performance Profiling

**Use Chrome DevTools Performance panel:**

1. **Open DevTools** → Performance tab
2. **Record during animation sequence** (click record, trigger animation, stop)
3. **Analyze for performance issues:**

**What to look for:**

| Issue | Visual Indicator | Fix |
|-------|-----------------|-----|
| **Long tasks** | Red bars >50ms | Split work into smaller chunks, use requestAnimationFrame |
| **Forced reflows** | Purple bars labeled "Layout" | Batch style reads/writes, avoid layout properties |
| **Excessive layers** | Many green "Paint" bars | Remove unnecessary will-change, limit animated elements |
| **Jank (dropped frames)** | Choppy FPS graph | Use GPU-accelerated properties only (transform, opacity) |

**Target metrics:**
- **60 FPS** - 16.67ms per frame maximum
- **No long tasks** - All main thread work <50ms
- **Minimal layout** - Only 1-2 layout recalculations per animation

### Automated Animation Testing (MCP & CLI)

**Automated testing enables visual regression detection and objective performance measurement:**

#### Visual State Capture (Before/After Animation)

**Option 1: Chrome DevTools MCP**
```markdown
1. Navigate to page:
   [Use tool: mcp__chrome_devtools_2__navigate_page]
   - url: "https://example.com"

2. Capture before state:
   [Use tool: mcp__chrome_devtools_2__take_screenshot]
   - Save as "animation-before.png"

3. Trigger animation (via evaluate_script or user interaction)

4. Capture after state:
   [Use tool: mcp__chrome_devtools_2__take_screenshot]
   - Save as "animation-after.png"

5. Compare screenshots visually
```

**Option 2: mcp-chrome-devtools (Terminal-based)**
```bash
# Visual regression testing workflow
bdg https://example.com 2>&1

# Capture initial state
bdg screenshot animation-before.png 2>&1

# Trigger animation (wait for completion)
sleep 2

# Capture final state
bdg screenshot animation-after.png 2>&1

# Stop session
bdg stop 2>&1

# Compare screenshots (use diff tool)
compare animation-before.png animation-after.png animation-diff.png
```

#### Animation Performance Metrics

**CLI Performance Profiling:**
```bash
# Navigate to page
bdg https://example.com 2>&1

# Trigger animation and capture metrics immediately after
bdg js "document.querySelector('.animated-element').classList.add('animate')" 2>&1
sleep 1  # Wait for animation to complete

# Get performance metrics
bdg cdp Performance.getMetrics 2>&1 > animation-metrics.json

# Check for layout thrashing
jq '.result.metrics[] | select(.name == "LayoutCount" or .name == "RecalcStyleCount")' animation-metrics.json

# Check timing metrics
jq '.result.metrics[] | select(.name | contains("Duration"))' animation-metrics.json

# Stop session
bdg stop 2>&1
```

**Key animation metrics:**
```json
{
  "name": "LayoutCount",
  "value": 2  // Should be ≤3 per animation
},
{
  "name": "RecalcStyleCount",
  "value": 1  // Should be minimal
},
{
  "name": "TaskDuration",
  "value": 145  // Total task time in ms
}
```

**Performance Assertion Example:**
```bash
#!/bin/bash
# Assert animation performance meets targets

bdg https://example.com 2>&1

# Trigger animation
bdg js "document.querySelector('.hero').classList.add('animate-in')" 2>&1
sleep 0.6  # Animation duration

# Get metrics
METRICS=$(bdg cdp Performance.getMetrics 2>&1)
bdg stop 2>&1

# Extract layout count
LAYOUT_COUNT=$(echo "$METRICS" | jq '.result.metrics[] | select(.name=="LayoutCount") | .value')

# Assert performance target
if [ "$LAYOUT_COUNT" -gt 3 ]; then
  echo "❌ FAIL: Too many layouts ($LAYOUT_COUNT > 3)"
  exit 1
else
  echo "✅ PASS: Layout count within target ($LAYOUT_COUNT ≤ 3)"
fi
```

#### Multi-Viewport Animation Testing

**Automated cross-viewport testing:**
```bash
#!/bin/bash
# Test animations at all viewports

VIEWPORTS=("1920:1080:desktop" "991:1024:tablet" "375:667:mobile")
URL="https://example.com"

for viewport in "${VIEWPORTS[@]}"; do
  IFS=':' read -r width height name <<< "$viewport"

  echo "Testing $name viewport (${width}x${height})..."

  bdg "$URL" 2>&1

  # Set viewport
  bdg cdp Emulation.setDeviceMetricsOverride "{\"width\":$width,\"height\":$height,\"deviceScaleFactor\":2,\"mobile\":false}" 2>&1

  # Capture before animation
  bdg screenshot "animation-${name}-before.png" 2>&1

  # Trigger animation
  bdg js "document.querySelector('.animated-element').classList.add('animate')" 2>&1
  sleep 1

  # Capture after animation
  bdg screenshot "animation-${name}-after.png" 2>&1

  # Get performance metrics
  bdg cdp Performance.getMetrics 2>&1 > "animation-${name}-metrics.json"

  bdg stop 2>&1

  echo "✅ $name viewport captured"
done

echo "✅ All viewport tests complete"
```

#### Reduced Motion Testing

**Automated prefers-reduced-motion verification:**
```bash
# Test with reduced motion preference
bdg https://example.com 2>&1

# Enable reduced motion emulation
bdg cdp Emulation.setEmulatedMedia '{"features":[{"name":"prefers-reduced-motion","value":"reduce"}]}' 2>&1

# Check if animations are disabled
REDUCED_MOTION=$(bdg js "window.matchMedia('(prefers-reduced-motion: reduce)').matches" 2>&1)

echo "Reduced motion active: $REDUCED_MOTION"

# Capture screenshot in reduced motion mode
bdg screenshot animation-reduced-motion.png 2>&1

bdg stop 2>&1
```

**See:** `.opencode/skills/mcp-tooling/mcp-chrome-devtools/` for complete CLI automation patterns

---

## 7. COMMON ISSUES AND SOLUTIONS

### Layout Jump on Height Animation

**Issue:** Content shifts when transitioning `height: 0` to `height: auto`

**Cause:** CSS cannot animate to `auto` value, snaps instead of transitioning

**Solution:**
```javascript
const natural_height = element.scrollHeight;

element.style.height = `${natural_height}px`;

element.addEventListener('transitionend', () => {
  element.style.height = 'auto';
}, { once: true });
```

### Jank on Scroll-Triggered Animations

**Issue:** Animations stutter or drop frames during scrolling

**Cause:** Animating layout properties (width, height, top, left) forces reflows

**Solution:**
```javascript
// ❌ BAD: Animates layout properties
animate(element, {
  width: [100, 200],    // Causes reflow
  top: [0, 100]         // Causes reflow
});

// ✅ GOOD: GPU-accelerated properties only
animate(element, {
  scale: [0.5, 1],      // GPU-accelerated
  y: [0, 100]           // GPU-accelerated (translateY)
});
```

**Additional optimization:**
```javascript
element.style.willChange = 'transform, opacity';

animate(element, properties, {
  onComplete: () => {
    element.style.willChange = '';
  }
});
```

### Animation Doesn't Start (Motion.dev Not Loaded)

**Issue:** `window.Motion` is undefined, animations don't run

**Cause:** CDN loading slower than component initialization

**Solution:** Use retry logic pattern
```javascript
function init_animation() {
  const { animate, inView } = window.Motion || {};

  // CDN loading is unpredictable — retry until Motion library is available
  if (!animate || !inView) {
    setTimeout(init_animation, 100);
    return;
  }

  inView('.hero', ({ target }) => {
    animate(target, { opacity: [0, 1] }, { duration: 0.6 });
  });
}
```

### Elements Flicker Before Animation

**Issue:** Elements visible in default state, then jump to animated start state

**Cause:** CSS initial state not set before JavaScript runs

**Solution:** Set initial state in CSS
```css
/* Set initial state for all animated elements */
.hero-element {
  opacity: 0;
  transform: translateY(40px);
}

.hero-element.animated {
  opacity: 1;
  transform: translateY(0);
}
```

**Alternative:** Use JavaScript to set state before DOM renders (in `<head>`)
```html
<script>
  // Placed in <head> to execute before paint — prevents FOUC
  document.documentElement.classList.add('js-enabled');
</script>

<style>
  .js-enabled .hero-element {
    opacity: 0;
    transform: translateY(40px);
  }
</style>
```

---

