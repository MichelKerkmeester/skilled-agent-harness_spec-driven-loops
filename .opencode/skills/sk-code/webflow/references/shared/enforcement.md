---
title: "Webflow Code Style Enforcement: Cross-Language Workflow"
description: "Enforcement workflow, validation prompts, and remediation guidance for cross-language style rules (file headers, section organization, comment quality). Per-language enforcement (JS naming, JS init patterns, CSS BEM, CSS attribute selectors, CSS animation properties) lives in the matching language quality_standards.md."
trigger_phrases:
  - "webflow style enforcement"
  - "code style enforcement gate"
  - "pre completion gate"
  - "p0 p1 p2 violations"
  - "validation prompts remediation"
importance_tier: important
contextType: implementation
version: 3.5.0.2
---

# Webflow Code Style Enforcement: Cross-Language Workflow

This file enforces rules that apply to all Webflow languages (JavaScript and CSS). Per-language enforcement (JS naming conventions, JS initialization patterns, CSS custom properties, CSS attribute selectors, CSS BEM, CSS animation properties) lives in the matching language `quality_standards.md`.

**Related Documents:**
- [`../javascript/style_guide.md`](../javascript/style_guide.md) — JS style conventions (naming, file structure, formatting, JSDoc)
- [`../css/style_guide.md`](../css/style_guide.md) — CSS style conventions (BEM, custom properties, attribute selectors, animation CSS)
- [`../javascript/quality_standards.md`](../javascript/quality_standards.md) — JS quality patterns + JS naming/init enforcement
- [`../css/quality_standards.md`](../css/quality_standards.md) — CSS quality patterns + 4 CSS enforcement subsections
- [`../../../assets/webflow/checklists/code_quality_checklist.md`](../../../code-quality/assets/code_quality_checklist.md) — validation checklist used at the pre-completion gate

---

## 1. OVERVIEW

### Purpose

This document provides:
- Validation prompts for checking code compliance
- Pattern recognition guidance for identifying violations
- Compliant and non-compliant examples for comparison
- Remediation instructions for fixing common violations

### When to Use

Use this enforcement reference when:
- Validating **JavaScript or CSS** code before claiming implementation complete
- Fixing violations identified by the code quality checklist
- Understanding the difference between compliant and non-compliant patterns
- Training on code style standards

### Enforcement Philosophy

- **P0 violations** are HARD BLOCKERS - must be fixed before completion
- **P1 violations** should be fixed OR documented with approval
- **P2 violations** can be deferred with documented reason
- When in doubt, fix the violation rather than defer

---

## 2. FILE HEADER ENFORCEMENT

### Validation Prompt

> **Check:** Does the file start with a three-line header using box-drawing characters?

**What to look for:**
1. First line: `// ─` followed by 63 more `─` characters (67 total including `// `)
2. Second line: `// CATEGORY: COMPONENT NAME` (ALL CAPS)
3. Third line: Same as first line

### Pattern Recognition

**Compliant Pattern:**
```javascript
// ───────────────────────────────────────────────────────────────
// VIDEO: BACKGROUND HLS HOVER
// ───────────────────────────────────────────────────────────────
```

**Violation Patterns:**

| Violation        | Example                 | How to Identify                 |
| ---------------- | ----------------------- | ------------------------------- |
| Missing header   | File starts with code   | No header lines at top          |
| Wrong character  | `// ---...`             | Uses hyphen `-` instead of `─`  |
| Wrong length     | Short header line       | Count characters (should be 67) |
| Metadata present | `// Created 2024-01-15` | Contains dates, names, versions |
| Wrong case       | `// video: Background`  | Not ALL CAPS                    |

### Remediation

**To fix missing header:**
1. Insert three lines at the top of the file
2. Copy the template:
```javascript
// ───────────────────────────────────────────────────────────────
// [CATEGORY]: [COMPONENT NAME]
// ───────────────────────────────────────────────────────────────
```
3. Replace `[CATEGORY]` with component type (VIDEO, FORM, MODAL, etc.)
4. Replace `[COMPONENT NAME]` with descriptive name (2-4 words, ALL CAPS)

**To fix wrong character:**
- Find and replace all `-` (hyphen) with `─` (box-drawing U+2500)
- Use: `// ───────────────────────────────────────────────────────────────`

---

## 3. SECTION ORGANIZATION ENFORCEMENT

### Validation Prompt

> **Check:** Are code sections organized with numbered headers in standard order?

**What to look for:**
1. IIFE wrapper: `(() => { ... })()`
2. Numbered section headers using `/* ─... */` format
3. Standard section order (when applicable)

> **Note for CSS:** Section organization guidelines for CSS follow the same numbered-header structure but with CSS-specific section names. See [`../css/quality_standards.md`](../css/quality_standards.md) for CSS section-organization details.

### Pattern Recognition

**Compliant Pattern:**
```javascript
(() => {
  'use strict';

  /* ─────────────────────────────────────────────────────────────
     1. CONFIGURATION
  ──────────────────────────────────────────────────────────────── */
  const INIT_FLAG = '__componentInit';

  /* ─────────────────────────────────────────────────────────────
     2. UTILITIES
  ──────────────────────────────────────────────────────────────── */
  function is_valid(el) { }

  /* ─────────────────────────────────────────────────────────────
     3. INITIALIZE
  ──────────────────────────────────────────────────────────────── */
  function init_component() { }

})();
```

**Violation Patterns:**

| Violation    | Example                  | How to Identify                     |
| ------------ | ------------------------ | ----------------------------------- |
| No IIFE      | Code at global scope     | Missing `(() => { ... })()` wrapper |
| No sections  | Flat code structure      | No section headers                  |
| Wrong format | `// === SECTION ===`     | Not using `/* ─...` format          |
| Not numbered | `/* CONFIGURATION */`    | Missing number prefix               |
| Wrong case   | `/* 1. Configuration */` | Title not ALL CAPS                  |

### Remediation

**To add section headers:**
```javascript
/* ─────────────────────────────────────────────────────────────
   [N]. [SECTION NAME]
──────────────────────────────────────────────────────────────── */
```

**Standard section order:**
1. CONFIGURATION - Constants, settings, selectors
2. UTILITIES - Helper functions
3. CORE FUNCTIONS - Main logic
4. EVENT HANDLERS - Event handler functions
5. INITIALIZE - Initialization function
6. PUBLIC API - (optional) Exposed window methods

---

## 4. COMMENT QUALITY ENFORCEMENT

### Validation Prompt

> **Check:** Do comments explain WHY, not WHAT? Are there any commented-out code blocks?

**What to look for:**
1. No commented-out code (delete it, git preserves history)
2. Comments explain reasoning, constraints, or platform requirements
3. Platform prefixes: WEBFLOW, MOTION, LENIS, HLS.JS

> **Cross-stack motion.dev reference**: For the Motion API and integration assumptions behind `MOTION:` comments, see [`../../motion_dev/quick_start.md`](../../../animation/references/quick_start.md) and [`../../motion_dev/integration_patterns.md`](../../../animation/references/integration_patterns.md). This file remains the Webflow style-enforcement source for comment quality.

### Pattern Recognition

**Compliant Comments (WHY):**
```javascript
// Prevent background scroll while modal is open
if (window.lenis) { window.lenis.stop(); }

// WEBFLOW: Page transitions may re-execute scripts
if (window[INIT_FLAG]) return;

// Add 10 second timeout to prevent infinite hang
setTimeout(() => reject(new Error('Timeout')), 10000);

// MOTION: Animation requires Motion.dev library loaded globally
if (!window.Motion) { return; }
```

**Non-Compliant Comments (WHAT):**
```javascript
// Set price to price times 100 ← WRONG: narrates code
const price_cents = price * 100;

// Loop through items ← WRONG: states the obvious
for (const item of items) { }

// Check if element exists ← WRONG: describes what, not why
if (element) { }

// Add click handler ← WRONG: code is self-explanatory
button.addEventListener('click', handle_click);
```

### Remediation

**To fix "WHAT" comments:**
1. Delete if the code is self-explanatory
2. OR replace with WHY: explain reasoning, constraints, or edge case

**Before:**
```javascript
// Check if element exists
if (element) {
  // Set the text content
  element.textContent = 'Hello';
}
```

**After:**
```javascript
// Guard: Some pages may not have this optional element
if (element) {
  element.textContent = 'Hello';
}
```

**To remove commented-out code:**
1. Delete the commented code block entirely
2. If you need to preserve it, git history has it
3. If it's important context, add a comment explaining WHY it was removed

---

## 5. ENFORCEMENT WORKFLOW

### Pre-Completion Gate

Before claiming "done" or "complete" on **JavaScript or CSS** implementation:

1. **Identify file type** - JavaScript or CSS
2. **Load** [`code_quality_checklist.md`](../../../code-quality/assets/code_quality_checklist.md)
3. **Apply cross-language rules** from this document (Sections 2-4: file headers, section organization, comment quality)
4. **Apply per-language rules** from the matching `quality_standards.md` ([JS](../javascript/quality_standards.md) | [CSS](../css/quality_standards.md))
5. **Check** each P0 item systematically for that file type
6. **Fix** any P0 violations found
7. **Check** P1 items
8. **Fix** or document approved deferrals for P1
9. **Document** P2 deferrals with reasons
10. **Only then** claim completion

For formal findings-first review output, run `sk-code`'s code-review mode as baseline and use this workflow as web overlay evidence.

### Language-Specific Gate Selection

| File Type | Cross-Language (this file) | Per-Language Quality Standards |
|-----------|---------------------------|-------------------------------|
| JavaScript (`.js`) | Sections 2-4 (headers, organization, comments) | [`../javascript/quality_standards.md`](../javascript/quality_standards.md) (naming, init patterns) |
| CSS (`.css`) | Sections 2-4 (headers, organization, comments) | [`../css/quality_standards.md`](../css/quality_standards.md) (custom properties, BEM, attribute selectors, animations) |
| Both | All cross-language + both per-language files | Combined |

### Violation Resolution Flow

```
Violation Found
    │
    ├─► P0 Violation → MUST FIX → Fix violation → Re-check
    │
    ├─► P1 Violation → Fix OR get approval to defer
    │                   │
    │                   ├─► Fix → Re-check
    │                   └─► Defer → Document reason → Continue
    │
    └─► P2 Violation → Can defer → Document reason → Continue
```

### Escalation

If you cannot resolve a violation:
1. Document the specific violation
2. Explain why it cannot be fixed
3. Ask for guidance or approval to deviate
4. Route unresolved findings through `sk-code`'s code-review mode for severity-ranked reporting

---

## 6. PER-LANGUAGE ENFORCEMENT (POINTERS)

For language-specific enforcement, see:

- **JavaScript** naming conventions + initialization patterns: [`../javascript/quality_standards.md`](../javascript/quality_standards.md)
- **CSS** custom properties + attribute selectors + BEM + animation properties: [`../css/quality_standards.md`](../css/quality_standards.md)

---

## 7. RELATED RESOURCES

### Primary Standards (per-language tree)
- [`../javascript/style_guide.md`](../javascript/style_guide.md) — JS style guide
- [`../css/style_guide.md`](../css/style_guide.md) — CSS style guide
- [`../javascript/quality_standards.md`](../javascript/quality_standards.md) — JS quality patterns + enforcement
- [`../css/quality_standards.md`](../css/quality_standards.md) — CSS quality patterns + enforcement
- [`./cross_language_rules.md`](./cross_language_rules.md) — cross-language file naming, comment principles, banner format

### Checklists
- [`../../../assets/webflow/checklists/code_quality_checklist.md`](../../../code-quality/assets/code_quality_checklist.md) — validation checklist

### Production Examples

**JavaScript:**
- `src/javascript/video/video_background_hls_hover.js` - Complete compliant example
- `src/javascript/form/file_upload.js` - Form component with full structure

**CSS:**
- `src/1_css/global/fluid_responsive.css` - Custom property naming example
- `src/1_css/button/btn_primary.css` - BEM naming example
- `src/1_css/animations/hover_state_machine.css` - GPU-accelerated animations
