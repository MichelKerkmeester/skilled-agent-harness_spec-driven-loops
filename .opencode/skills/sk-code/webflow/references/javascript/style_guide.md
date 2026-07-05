---
title: "Webflow JavaScript Style Guide"
description: "JavaScript naming conventions (snake_case), file structure (IIFE wrapper, file header banner, numbered sections), formatting (2-space indent, K&R braces, single quotes, trailing commas), function-purpose comments, JSDoc usage, and debug logging — for the Webflow stack."
trigger_phrases:
  - "webflow javascript style guide"
  - "snake case javascript webflow"
  - "iife wrapper webflow"
  - "jsdoc webflow usage"
  - "numbered section banner"
importance_tier: normal
contextType: implementation
version: 3.5.0.6
---

# Webflow JavaScript Style Guide

> See [`../shared/cross_language_rules.md`](../shared/cross_language_rules.md) for rules that apply to all languages (file naming, comment WHY-not-WHAT, file-header banner shape, platform-specific comment prefixes). This file covers JavaScript-specific conventions only.

## 1. OVERVIEW

### Purpose

Defines JavaScript naming conventions, file structure, formatting rules, JSDoc usage, and debug logging patterns for code targeting the Webflow stack.

### When to Use

- Writing new JavaScript files for Webflow projects
- Reviewing JS code for style compliance before commit
- Onboarding contributors to the codebase's JS conventions
- Refactoring existing JS to align with the canonical patterns

### Core Principle

Consistency at the file level enables every reviewer to focus on logic, not formatting.

---

## 2. NAMING CONVENTIONS

### JavaScript Identifiers

All JavaScript code uses `snake_case` for consistency with the codebase:

| Type      | Convention            | Example                                     |
| --------- | --------------------- | ------------------------------------------- |
| Variables | `snake_case`          | `user_data`, `hover_timer`, `is_valid`      |
| Functions | `snake_case`          | `handle_submit()`, `init_component()`       |
| Constants | `UPPER_SNAKE_CASE`    | `MAX_RETRIES`, `INIT_DELAY_MS`, `INIT_FLAG` |
| Private   | `_snake_case`         | `_internal_cache`, `_pending_play`          |
| Booleans  | `is_` / `has_` prefix | `is_attached`, `has_loaded`, `is_playing`   |

**Production examples from src/:**
```javascript
// Variables
const hover_timer = null;
const is_attached = false;
const pending_play = [];

// Constants
const INIT_FLAG = '__videoHlsHoverInit';
const INIT_DELAY_MS = 50;
const MAX_HLS_RETRIES = 3;
```

### Semantic Function Prefixes

Use standard prefixes to indicate function purpose:

| Prefix      | Purpose          | Returns            | Example                   |
| ----------- | ---------------- | ------------------ | ------------------------- |
| `is_`       | Boolean check    | true/false         | `is_valid_email()`        |
| `has_`      | Presence check   | true/false         | `has_required_fields()`   |
| `get_`      | Data retrieval   | data (no mutation) | `get_form_data()`         |
| `set_`      | Data mutation    | void/success       | `set_loading_state()`     |
| `handle_`   | Event handler    | void               | `handle_submit()`         |
| `init_`     | Initialization   | void               | `init_validation()`       |
| `bind_`     | Event binding    | void               | `bind_hover_events()`     |
| `toggle_`   | State toggle     | void               | `toggle_visibility()`     |
| `validate_` | Validation       | boolean/errors     | `validate_form()`         |
| `load_`     | Resource loading | Promise            | `load_external_library()` |

**Production examples:**
```javascript
function is_valid_email(email) { }
function has_required_fields(form) { }
function get_form_data(form) { }
function set_loading_state(enabled) { }
function handle_submit(event) { }
function init_validation() { }
function bind_hover_events(container) { }
function toggle_visibility(element) { }
function validate_form(form_data) { }
function load_botpoison_sdk() { }
```

---

## 3. FILE STRUCTURE

> The file-header banner shape and section-header format are defined in [`../shared/cross_language_rules.md`](../shared/cross_language_rules.md). Below is the JavaScript-specific rendering.

### File Header (JavaScript-specific delimiter)

Every JavaScript file MUST start with a three-line header using box-drawing characters:

```javascript
// ───────────────────────────────────────────────────────────────
// CATEGORY: COMPONENT NAME
// ───────────────────────────────────────────────────────────────
```

**Header specifications:**
- Line width: 67 characters (using `─` box-drawing character U+2500)
- Category label: ALL CAPS
- No metadata: No dates, authors, version numbers, or ticket references

**Production examples:**
```javascript
// ───────────────────────────────────────────────────────────────
// VIDEO: BACKGROUND HLS HOVER
// ───────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────
// MODAL: COOKIE CONSENT
// ───────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────
// FORM: FILE UPLOAD
// ───────────────────────────────────────────────────────────────
```

### Section Headers

Organize code into logical sections with numbered headers:

```javascript
/* ─────────────────────────────────────────────────────────────
   1. CONFIGURATION & FLAGS
────────────────────────────────────────────────────────────────*/

/* ─────────────────────────────────────────────────────────────
   2. STYLE & DOM HELPERS
────────────────────────────────────────────────────────────────*/

/* ─────────────────────────────────────────────────────────────
   3. EVENT HANDLERS
────────────────────────────────────────────────────────────────*/

/* ─────────────────────────────────────────────────────────────
   4. INITIALIZATION
────────────────────────────────────────────────────────────────*/
```

**Section header specifications** (matches production conventions in `anobel.com/src/3_staging/*.js`):
- Uses `/* */` multi-line comment style
- Opening line: `/* ─` followed by 60 `─` characters (total 65 chars)
- Title line: 3-space indent, ALL CAPS, may include `&` for compound names (e.g. `CONFIGURATION & FLAGS`, `STYLE & DOM HELPERS`)
- Closing line: 64 `─` characters immediately followed by `*/` (no space, glued: `────────────────────────────────────────────────────────────────*/`)
- Sections are sequentially numbered starting at 1; sub-sections may use decimals (`1.1`) for fine-grained grouping

**Compliant production example** (from `video_hls_background.js`):

```javascript
/* ─────────────────────────────────────────────────────────────
   2. HLS.JS DETECTION & SETUP
────────────────────────────────────────────────────────────────*/
```

**Common violation:** writing the closing line as `──── */` (with a space before `*/`) — that is the CSS file-header convention, not the JS section-header convention. JS section headers glue `*/` to the dashes.

### Standard File Organization

Every JavaScript file should follow this structure:

```javascript
// ───────────────────────────────────────────────────────────────
// CATEGORY: COMPONENT NAME
// ───────────────────────────────────────────────────────────────

(() => {
  'use strict';  // Optional but recommended

  /* ─────────────────────────────────────────────────────────────
     1. CONFIGURATION
  ──────────────────────────────────────────────────────────────── */
  const INIT_FLAG = '__componentNameInit';
  const INIT_DELAY_MS = 50;
  const SELECTORS = {
    container: '[data-component="name"]',
    trigger: '[data-trigger]'
  };

  /* ─────────────────────────────────────────────────────────────
     2. UTILITIES
  ──────────────────────────────────────────────────────────────── */
  function get_elements(selector) { }
  function is_valid(element) { }

  /* ─────────────────────────────────────────────────────────────
     3. CORE FUNCTIONS
  ──────────────────────────────────────────────────────────────── */
  function process_item(item) { }

  /* ─────────────────────────────────────────────────────────────
     4. EVENT HANDLERS
  ──────────────────────────────────────────────────────────────── */
  function handle_click(event) { }
  function bind_events() { }

  /* ─────────────────────────────────────────────────────────────
     5. INITIALIZE
  ──────────────────────────────────────────────────────────────── */
  function init_component() { }

  const start = () => {
    if (window[INIT_FLAG]) return;
    window[INIT_FLAG] = true;
    // ... initialization logic
  };

  if (window.Webflow?.push) {
    window.Webflow.push(start);
  } else {
    start();
  }

  /* ─────────────────────────────────────────────────────────────
     6. PUBLIC API (Optional)
  ──────────────────────────────────────────────────────────────── */
  window.ComponentName = {
    init: init_component,
    destroy: cleanup
  };

})();
```

---

## 4. FORMATTING

### Indentation

**2 spaces, no tabs:**

```javascript
// Correct
function example() {
  if (condition) {
    do_something();
  }
}

// Incorrect (tabs or 4 spaces)
function example() {
    if (condition) {
        do_something();
    }
}
```

### Brackets and Braces

**Same-line opening brace (K&R style):**

```javascript
// Correct
function example() {
  if (condition) {
    return true;
  }
}

// Incorrect (Allman style)
function example()
{
  if (condition)
  {
    return true;
  }
}
```

**Single-statement if blocks still use braces:**

```javascript
// Correct
if (condition) {
  return early;
}

// Avoid (no braces)
if (condition) return early;
```

### Semicolons

**Always use semicolons:**

```javascript
// Correct
const value = 42;
do_something();
return result;

// Incorrect (ASI-dependent)
const value = 42
do_something()
return result
```

### Quotes

**Single quotes for strings, template literals for interpolation:**

```javascript
// Correct
const message = 'Hello world';
const greeting = `Hello, ${user_name}!`;
const html = `<div class="container">${content}</div>`;

// Incorrect (double quotes for simple strings)
const message = "Hello world";
```

**Exception:** JSON and HTML attributes use double quotes where required.

### Trailing Commas

**Use trailing commas in multi-line structures:**

```javascript
// Correct
const config = {
  name: 'component',
  delay: 50,
  enabled: true,  // trailing comma
};

const items = [
  'first',
  'second',
  'third',  // trailing comma
];

// Incorrect (no trailing comma)
const config = {
  name: 'component',
  delay: 50,
  enabled: true
};
```

**Benefits:**
- Cleaner git diffs (adding item doesn't modify previous line)
- Easier reordering
- Consistent structure

### Line Length

**Generally under 120 characters:**

```javascript
// Correct - break long lines
const result = some_function(
  first_argument,
  second_argument,
  third_argument
);

// Correct - chain on new lines
const processed = items
  .filter(is_valid)
  .map(transform_item)
  .sort(compare_items);

// Avoid - single long line
const result = some_function(first_argument, second_argument, third_argument, fourth_argument);
```

### Whitespace

**Consistent spacing around operators and keywords:**

```javascript
// Correct
const sum = a + b;
if (condition) { }
for (const item of items) { }
function example(param) { }

// Incorrect
const sum = a+b;
if(condition){ }
for(const item of items){ }
function example (param) { }
```

---

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
