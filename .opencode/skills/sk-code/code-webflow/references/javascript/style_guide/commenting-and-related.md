---
title: Commenting (JS-Specific) & Related
description: "JavaScript naming conventions (snake_case), file structure (IIFE wrapper, file header banner, numbered sections), formatting (2-space indent, K&R braces, single quotes, trailing commas), function-purpose comments, JSDoc usage, and debug logging — for the Webflow stack." — Commenting (JS-Specific) & Related.
importance_tier: normal
contextType: implementation
version: 3.5.0.6
---

# Commenting (JS-Specific) & Related

## 5. COMMENTING (JS-SPECIFIC)

> Cross-language commenting rules (WHY-not-WHAT principle, no commented-out code, platform-specific `WEBFLOW:`/`MOTION:`/`LENIS:`/`HLS.JS:` prefixes) live in [`../shared/cross_language_rules.md`](../shared/cross_language_rules.md). This section covers JavaScript-specific comment **layout, frequency, and content** patterns observed in production.

### Comment Density (target, not cap)

Production Webflow JS uses comments **liberally** to make intent visible. Density observed in `anobel.com/src/3_staging/link_card_collapse_expand.js` (~1,166 lines):

- **Roughly 1 comment per 5-10 lines** of code on average — much higher than naive "max 5 per 10" caps suggest
- **~80-90% of function definitions** have a single-line preamble comment above them
- **Section preambles** (after each `/* ─...─*/` header) explain the GROUP'S purpose in 1-2 lines

The frame is "every distinct intent gets a one-line WHY." Don't write comments for trivial setters or self-evident code; do write them for any function whose name leaves the why-this-approach unclear.

### Section Preamble Pattern (after each `/* ─...─*/` header)

Immediately after a section header, drop a 1-line `// ` comment describing what the GROUP does. Distinct from per-function comments — the preamble is the section's intent.

```javascript
/* ─────────────────────────────────────────────────────────────
   2. STYLE & DOM HELPERS
────────────────────────────────────────────────────────────────*/

  // Small helpers keep inline style writes consistent and easy to undo.

  function set_style(element, prop, value, priority) { ... }
```

```javascript
/* ─────────────────────────────────────────────────────────────
   8. CARD ACTIVATION & INTERACTION STATE
────────────────────────────────────────────────────────────────*/

  // The active index is the single source of truth for which card is expanded.
  // Activating one card always collapses the previously active card first.

  function activate_card(card, animated) { ... }
```

A 2-line preamble is acceptable when the section's invariant needs explaining.

### Function Purpose Comments

Single-line `// ` comment ABOVE most function definitions, describing intent. Preferred over JSDoc for internal helpers. From production:

```javascript
// Convert JavaScript style keys into CSS property names.
function css_prop(prop) { ... }

// Use setProperty/removeProperty so important values and cleanup stay predictable.
function set_style(element, prop, value, priority) { ... }

// Apply a small object of inline styles through the same safe writer.
function set_styles(element, styles) { ... }

// Remove only the properties this component owns.
function clear_inline(element, props) { ... }

// Stack button icons so collapsed and expanded icons can crossfade cleanly.
function prepare_button(card) { ... }

// Find the cached card index without relying on DOM order during animation.
function find_index(card) { ... }
```

**Style for the comment:**
- One sentence, ends with period
- Often emphasizes WHY this approach was chosen over alternatives ("so important values and cleanup stay predictable", "so collapsed and expanded icons can crossfade cleanly")
- Avoids re-stating what the function name already says

### Inline Comments Inside Function Bodies

Sparing — drop `// ` ONLY where the next statement(s) need an explanation:

```javascript
// Reset video element to clean state
try {
  video.pause();
} catch (_) {}

// Read configuration from data attributes
const lazy_mode = player.getAttribute('data-player-lazy');

// Track whether user just initiated play to suppress ready flicker
let pending_play = false;

// Autoplay forces muted + loop for iOS compatibility
if (autoplay) {
  video.muted = true;
  video.loop = true;
}

// HLS: Safari can play natively, other browsers need hls.js
const is_safari_native = !!video.canPlayType('application/vnd.apple.mpegurl');
```

**Rule:** if you have to read 3+ lines of code to understand WHY they exist as a group, the group needs a 1-line introductory comment.

### Group-Introductory Comments

When a function does 3-5 distinct things, group statements with a 1-line comment per group:

```javascript
function attach_media_once() {
  if (is_attached) return;
  is_attached = true;

  // HLS: Cleanup existing instance
  if (player._hls) {
    try { player._hls.destroy(); } catch (_) {}
    player._hls = null;
  }

  if (is_safari_native) {
    // Safari native HLS playback
    video.preload = is_lazy_true ? 'none' : 'auto';
    video.src = src;
    ...
  } else if (can_use_hls_js) {
    // HLS.JS: Use library for other browsers
    ...
  } else {
    // Fallback for edge cases
    video.src = src;
  }
}
```

### Silent-Catch Pattern

Production uses `catch (_) {}` (underscore arg, empty body) for non-critical operations that may throw safely:

```javascript
try { video.pause(); } catch (_) {}
try {
  video.removeAttribute('src');
  video.load();
} catch (_) {}
```

When the exception genuinely doesn't matter (e.g. pause() on an unattached video), the underscore arg signals "intentionally ignored" — distinct from `catch (e) {}` which suggests a TODO. Pair with a one-line comment ABOVE if the reason isn't obvious from the surrounding code.

### Underscore-Prefix for Internal/Private State

Module-level mutable state and per-element private flags use a `_` (single underscore) or `__` (double underscore) prefix:

```javascript
// Module-level runtime state
var _cards = [];
var _expanded_index = 0;
var _hovered_card = null;
var _row_element = null;
var _reset_timer = null;
var _hover_timer = null;
var _card_by_wrapper = new WeakMap();
var _animation_runs = new WeakMap();
var _active_animations = new WeakMap();

// Function-scoped flag tracking interaction state
let _user_interacted = false;

// Element-attached private flags use double underscore + camelCase suffix
if (player.__bunnyBound) return;
player.__bunnyBound = true;
```

The underscore signals "owned by this component, do not consume from outside." Also means cleanup code knows what to clear.

### JSDoc Usage

Single line above function describing intent:

```javascript
// Load Botpoison SDK from CDN if not already loaded
// Returns promise resolving to true on success, false on failure
function load_botpoison_sdk() { }

// Show modal with entrance animation using Motion.dev
// Make container visible before animating to avoid layout jumps
async function show_modal() { }

// Calculate time until next office opening
// Returns object with hours, minutes, and isOpen flag
function get_time_until_open(schedule) { }
```

### JSDoc Usage

Use JSDoc for exported/public functions and complex utilities:

```javascript
/**
 * Initialize video hover behavior for all matching containers
 * @param {string} selector - CSS selector for video containers
 * @param {Object} options - Configuration options
 * @param {number} options.delay - Hover delay in milliseconds
 * @param {boolean} options.autoplay - Enable autoplay on hover
 * @returns {Function} Cleanup function to remove event listeners
 */
function init_video_hover(selector, options = {}) { }

/**
 * Format date according to Dutch locale
 * @param {Date} date - Date to format
 * @param {string} format - Output format ('short' | 'long' | 'relative')
 * @returns {string} Formatted date string
 */
function format_date(date, format = 'short') { }
```

### Debug Logging Pattern

```javascript
// Conditional logging for debug mode
const DEBUG = false;
const LOG_PREFIX = '[ComponentName]';

function log(...args) {
  if (DEBUG) {
    console.log(LOG_PREFIX, ...args);
  }
}

// Usage
log('Initialized with config:', config);
log('Processing item:', item.id);
```

## RELATED RESOURCES

- [`../shared/cross_language_rules.md`](../shared/cross_language_rules.md) — file naming, comment principles, file-header banner shape, platform-specific prefixes
- [`./quality_standards.md`](./quality_standards.md) — initialization, DOM safety, error handling, async, observers, validation, performance, animation, state, cleanup, document listener, WeakMap caching
- [`./quick_reference.md`](./quick_reference.md) — JS workflows, code snippets, one-liners
- [`../shared/enforcement.md`](../shared/enforcement.md) — pre-completion gate workflow

### Copy-paste template

- [`../../../assets/webflow/templates/component_template.js`](../../assets/templates/component_template.js) — production-style annotated JS template implementing every convention in this guide (file header, sections, IIFE, INIT_FLAG, snake_case, function preambles, cleanup hook, public API)

### Production reference files (for copying conventions verbatim)

- `anobel.com/src/3_staging/video_hls_background.js` — section preambles, observer + media patterns
- `anobel.com/src/3_staging/link_card_collapse_expand.js` — heavy use of section preambles + per-function comments + WeakMap state + cleanup hook
