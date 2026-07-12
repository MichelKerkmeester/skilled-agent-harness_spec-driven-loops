---
title: Naming/Init Enforcement & Quick Reference
description: "JavaScript naming and initialization enforcement patterns with a pre-deployment quality checklist for Webflow components."
trigger_phrases:
  - "webflow naming enforcement"
  - "webflow initialization enforcement"
  - "javascript deployment checklist"
  - "cdn safe init checklist"
importance_tier: normal
contextType: implementation
version: 3.5.0.7
---

# Naming/Init Enforcement & Quick Reference

Naming and initialization enforcement guidance with a concise deployment checklist for Webflow JavaScript.

---

## 1. OVERVIEW

### Purpose

Provides validation prompts, recognition patterns, and remediation steps for JavaScript naming and CDN-safe initialization.

### When to Use

- Reviewing JavaScript identifiers for naming compliance
- Validating the Webflow initialization guard pattern
- Running a final component deployment checklist

---

## 2. NAMING CONVENTION ENFORCEMENT

### Validation Prompt

> **Check:** Are all identifiers using snake_case? Do boolean variables use is_/has_ prefix?

**What to look for:**
1. Variables: `snake_case`
2. Functions: `snake_case` with semantic prefixes
3. Constants: `UPPER_SNAKE_CASE`
4. Booleans: `is_` or `has_` prefix

### Pattern Recognition

**Compliant Naming:**
```javascript
// Variables
const hover_timer = null;
const is_attached = false;
const _internal_cache = {};

// Constants
const INIT_FLAG = '__componentInit';
const MAX_RETRIES = 3;
const INIT_DELAY_MS = 50;

// Functions
function is_valid_email(email) { }
function get_form_data(form) { }
function handle_submit(event) { }
function init_component() { }
```

**Non-Compliant Naming (camelCase):**
```javascript
// WRONG: camelCase variables
const hoverTimer = null;        // Should be: hover_timer
const isAttached = false;       // Should be: is_attached

// WRONG: camelCase functions
function isValidEmail(email) { }  // Should be: is_valid_email
function getFormData(form) { }    // Should be: get_form_data
function handleSubmit(event) { }  // Should be: handle_submit

// WRONG: Missing prefix on boolean
const attached = false;           // Should be: is_attached
const required = true;            // Should be: is_required or has_required
```

### Remediation

**Conversion rules:**
| From            | To               |
| --------------- | ---------------- |
| `camelCase`     | `snake_case`     |
| `isActive`      | `is_active`      |
| `hasLoaded`     | `has_loaded`     |
| `getUserData`   | `get_user_data`  |
| `handleClick`   | `handle_click`   |
| `initComponent` | `init_component` |

**Semantic prefix guide:**

| Prefix      | Use When         | Returns            |
| ----------- | ---------------- | ------------------ |
| `is_`       | Boolean check    | true/false         |
| `has_`      | Presence check   | true/false         |
| `get_`      | Data retrieval   | data (no mutation) |
| `set_`      | Data mutation    | void/success       |
| `handle_`   | Event handler    | void               |
| `init_`     | Initialization   | void               |
| `bind_`     | Event binding    | void               |
| `toggle_`   | State toggle     | void               |
| `validate_` | Validation       | boolean/errors     |
| `load_`     | Resource loading | Promise            |

---

## 3. INITIALIZATION PATTERN ENFORCEMENT

### Validation Prompt

> **Check:** Does the file use the CDN-safe initialization pattern with guard flag and Webflow.push?

**What to look for:**
1. `INIT_FLAG` constant with unique name
2. Guard check: `if (window[INIT_FLAG]) return;`
3. Guard set: `window[INIT_FLAG] = true;`
4. `INIT_DELAY_MS` constant
5. DOM ready handling with setTimeout
6. Webflow.push with fallback

### Pattern Recognition

**Compliant Initialization:**
```javascript
const INIT_FLAG = '__componentNameCdnInit';
const INIT_DELAY_MS = 50;

function init_component() {
  // initialization code
}

const start = () => {
  if (window[INIT_FLAG]) return;
  window[INIT_FLAG] = true;

  if (document.readyState !== 'loading') {
    setTimeout(init_component, INIT_DELAY_MS);
    return;
  }

  document.addEventListener(
    'DOMContentLoaded',
    () => setTimeout(init_component, INIT_DELAY_MS),
    { once: true }
  );
};

if (window.Webflow?.push) {
  window.Webflow.push(start);
} else {
  start();
}
```

**Non-Compliant Patterns:**

| Violation         | Example                 | Problem                         |
| ----------------- | ----------------------- | ------------------------------- |
| No guard          | Missing INIT_FLAG check | Script runs multiple times      |
| No delay          | Direct call to init     | DOM/libraries not ready         |
| No Webflow.push   | Only DOMContentLoaded   | Misses Webflow page transitions |
| Hardcoded timeout | `setTimeout(init, 100)` | No configurable constant        |

### Remediation

**To add initialization pattern:**
1. Add at the top of your code:
```javascript
const INIT_FLAG = '__[componentName]CdnInit';
const INIT_DELAY_MS = 50;
```

2. Wrap initialization in guarded start function
3. Add Webflow.push with fallback
4. See Section 2 (Initialization Pattern) for complete template

---

## 4. QUICK REFERENCE CHECKLIST

Before deploying any component:

**Initialization:**
- [ ] Unique `INIT_FLAG` constant
- [ ] `INIT_DELAY_MS` constant (50ms default)
- [ ] Guard check and set present
- [ ] DOM readiness with setTimeout
- [ ] `{ once: true }` on event listener
- [ ] Webflow.push with fallback

**DOM Safety:**
- [ ] Element existence checks before use
- [ ] Optional chaining for uncertain properties
- [ ] Node type validation in observers

**Error Handling:**
- [ ] Silent catch for non-critical operations
- [ ] Storage access wrapped in try/catch
- [ ] Library loading with retry logic
- [ ] Debug mode for development

**Async:**
- [ ] Video play promises handled
- [ ] Debounce on rapid-fire events
- [ ] Throttle on scroll/resize handlers

**Performance:**
- [ ] RequestAnimationFrame for visual updates
- [ ] `will-change` cleanup on completion
- [ ] Event delegation where appropriate

**Animation:**
- [ ] CSS used for simple transitions
- [ ] Motion.dev for complex sequences
- [ ] `prefers-reduced-motion` support

**Cleanup/Destroy:**
- [ ] Observers disconnected (`disconnect()`)
- [ ] Event listeners removed (stored handler reference)
- [ ] Intervals/timeouts cleared
- [ ] Instance collections cleared
- [ ] Cleanup exposed on public API

**Shared Listeners:**
- [ ] Document-level delegation for dynamic elements
- [ ] Single listener attachment guard
- [ ] Action routing via data attributes

**Caching:**
- [ ] WeakMap for DOM element metadata (not Map)
- [ ] Binding guard (`__componentBound`) for double-init prevention
- [ ] WeakSet for processed element tracking

---

## 5. RELATED RESOURCES

- [`../style_guide/overview_naming_and_structure.md`](../style_guide/overview_naming_and_structure.md) — JS naming, file structure, formatting
- [`../quick_reference.md`](../quick_reference.md) — JS workflows, snippets, one-liners
- [`../../shared/cross_language_rules.md`](../../shared/cross_language_rules.md) — file naming, comment principles
- [`../../shared/enforcement.md`](../../shared/enforcement.md) — cross-language pre-completion gate
- [`../../shared/dev_workflow/overview_nav_and_logging.md`](../../shared/dev_workflow/overview_nav_and_logging.md) — DevTools, logging, testing patterns
- [`../../implementation/animation_workflows/overview-decision-tree-and-css.md`](../../implementation/animation_workflows/overview-decision-tree-and-css.md) — full animation guide (CSS + Motion.dev)
- [`../../implementation/webflow_patterns/overview-limits-and-collection-lists.md`](../../implementation/webflow_patterns/overview-limits-and-collection-lists.md) — Webflow-specific patterns
