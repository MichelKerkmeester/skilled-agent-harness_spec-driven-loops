---
title: "Cross-Language Rules: Webflow"
description: "File naming, comment principles, file-header banner format, and platform-specific comment conventions that apply to JavaScript, CSS, and HTML in the Webflow stack."
trigger_phrases:
  - "webflow cross language rules"
  - "webflow comment style"
  - "webflow file header banner"
  - "why not what comments"
importance_tier: normal
contextType: implementation
version: 3.5.0.3
---

# Cross-Language Rules: Webflow

These rules apply to ALL Webflow code — JavaScript, CSS, and HTML alike. Per-language conventions (naming, formatting, type-specific patterns) live in:
Cross-language naming, commenting, and file-structure rules for JavaScript, CSS, and HTML in the Webflow stack.

---

## 1. OVERVIEW

### Purpose

File naming conventions, comment principles (WHY-not-WHAT), file-header banner format, and platform-specific comment prefixes that apply equally to JavaScript, CSS, and HTML in the Webflow stack.

Per-language conventions (naming, formatting, type-specific patterns) live in:
- [`../javascript/style_guide/overview_naming_and_structure.md`](../javascript/style_guide/overview_naming_and_structure.md)
- [`../css/style_guide.md`](../css/style_guide.md)
- [`../html/style_guide.md`](../html/style_guide.md)

If a rule appears in a per-language file, it is language-specific. If it appears here, it applies to every language in the stack.

### When to Use

- Creating any new file (JS, CSS, or HTML) in a Webflow project
- Reviewing comments and file headers for compliance
- Documenting Webflow, Motion.dev, Lenis, or HLS.js platform constraints in code

### Core Principle

Cross-language consistency in file naming and commenting reduces cognitive load when switching files.

---

## 2. CORE PRINCIPLES

1. **Quantity limit:** Maximum 5 comments per 10 lines of code
2. **Focus on WHY, not WHAT:** Explain intent, constraints, platform requirements
3. **No commented-out code:** Delete unused code (git preserves history)
4. **Platform-specific notes:** Document Webflow, Motion.dev, Lenis constraints

> **Cross-stack motion.dev reference**: For Motion API assumptions and integration modes that can inform `MOTION:` comments across stacks, see [`../animation/quick_start.md`](../animation/quick_start.md) and [`../animation/integration_patterns.md`](../animation/integration_patterns.md). Webflow comment and naming conventions remain defined in this style guide.

---

## 3. FILE NAMING

JavaScript and CSS files use `snake_case`:

```
// JavaScript files
video_background_hls_hover.js
modal_cookie_consent.js
contact_office_hours.js

// CSS files
btn_app_store.css
form_file_upload.css
fluid_responsive.css
```

---

## 4. FILE HEADER BANNER (MANDATORY)

Three-line header at the top of every file:

```javascript
// ───────────────────────────────────────────────────────────────
// CATEGORY: COMPONENT NAME
// ───────────────────────────────────────────────────────────────
```

The banner shape is **identical for JS and CSS** — only the comment delimiter differs (JS uses `//`, CSS uses `/* */`). Per-language style guides include the language-specific delimiter form.

---

## 5. SECTION HEADER FORMAT

Numbered sections with box-drawing characters:

```javascript
/* ─────────────────────────────────────────────────────────────
   1. SECTION NAME
──────────────────────────────────────────────────────────────── */
```

CSS uses `/* */` natively; JS uses `/* */` for section headers despite the rest of JS using `//` for line comments.

---

## 6. INLINE COMMENTS — WHY, NOT WHAT

**Good examples (explain reasoning):**

```javascript
// Prevent background scroll while modal is open
if (window.lenis) {
  window.lenis.stop();
}

// Add 10 second timeout to prevent infinite hang
const timeout = new Promise((_, reject) =>
  setTimeout(() => reject(new Error('Timeout')), 10000)
);

// Use modern Array.from or fallback to slice for IE11
return Array.from ? Array.from(list) : Array.prototype.slice.call(list);

// Debounce resize handler to prevent layout thrashing
let resize_timer = null;
window.addEventListener('resize', () => {
  clearTimeout(resize_timer);
  resize_timer = setTimeout(handle_resize, 150);
});

// Guard: Exit early if already initialized
if (window[INIT_FLAG]) return;
```

**Bad examples (narrate implementation):**

```javascript
// Set price to price times 100
const price_cents = price * 100;

// Loop through items
for (const item of items) { }

// Check if element exists
if (element) { }

// Add click handler
button.addEventListener('click', handle_click);
```

---

## 7. PLATFORM-SPECIFIC COMMENT PREFIXES

Reference external constraints explicitly:

```javascript
// WEBFLOW: Collection list constraint (max 100 items per list)
const MAX_ITEMS = 100;

// MOTION: Animation requires Motion.dev library loaded globally
if (!window.Motion) {
  console.warn('Motion.dev not loaded');
  return;
}

// LENIS: Smooth scroll integration - must stop during modal
window.lenis?.stop();

// HLS.JS: Safari handles HLS natively, others need library
const needs_hls_library = !video.canPlayType('application/vnd.apple.mpegurl');

// WEBFLOW: Page transitions may re-execute scripts
if (window[INIT_FLAG]) return;
```

> **Allowed vs. forbidden — see the canonical rule.** The prefixes above (`WEBFLOW:`, `MOTION:`, `LENIS:`, `HLS.JS:`) are allowed because they name a durable platform/library. The flip side — comments must **never** name an ephemeral tracking artifact (a ClickUp/ticket id like `CU-8abc`, a project-spec folder or number, a phase/packet number, or an ADR id) — is defined once for both surfaces in [`../../universal/code_style_guide.md`](../../../shared/references/universal/code_style_guide.md) §4 "No ephemeral-artifact pointers". It extends the existing "no ticket references in file headers" rule to **all** inline comments. Keep the WHY; drop the ephemeral pointer.

---

## 8. KEY PRINCIPLES (DISTILLED)

**Implementation:**
- Wait for conditions, not timeouts
- Validate at every layer
- Update versions after JS changes

**Debugging:**
- Find root cause before fixing
- Use DevTools extensively
- Document the fix

**Verification:**
- Test in browser BEFORE claiming
- Multiple viewports required
- DevTools console must be clear

---

## 9. RELATED RESOURCES

- Per-language style guides (linked above)
- [`./enforcement.md`](./enforcement.md) — how these rules get enforced at gate time
- [`dev_workflow/overview_nav_and_logging.md`](dev_workflow/overview_nav_and_logging.md) — DevTools, logging, testing patterns shared across languages
