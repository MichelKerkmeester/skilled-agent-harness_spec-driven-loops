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
