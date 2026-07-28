---
title: Code Quality Checklist
description: Validation checklist for JavaScript and CSS code quality and style compliance.
trigger_phrases:
  - "webflow code quality checklist"
  - "javascript css style compliance"
  - "file header checks webflow"
  - "review baseline handoff"
importance_tier: normal
contextType: implementation
version: 3.5.0.17
---

# Code Quality Checklist

Validation checklist for JavaScript and CSS code quality and style compliance.

## 1. OVERVIEW

### Purpose

Validate code against style standards before claiming implementation is complete. This checklist ensures consistent, maintainable code across the codebase.

### Usage

1. **Load** this checklist when completing code implementation
2. **Identify** file type (JavaScript → Sections 2-7, CSS → Section 8)
3. **Validate** each applicable item against the code
4. **Mark** items `[x]` when verified
5. **Block** completion if any P0 item fails
6. **Document** P2 deferrals with reasons

### Language Coverage

| Language | File Extension | Checklist Sections |
|----------|----------------|-------------------|
| JavaScript | `.js` | Sections 2-7 |
| CSS | `.css` | Section 8 |

### Review Baseline Handoff

For formal findings-first review output, run `sk-code`'s code-review mode as the baseline and use this checklist as the web overlay.

- Severity model and review output contract: `sk-code/code-review/references/quick-reference.md`
- Baseline security/quality/test review checks: `sk-code`'s code-review mode references
- This checklist: web-specific JavaScript/CSS standards evidence

### Source Standards (per-language tree)

- [shared/cross-language-rules.md](../../../code-webflow/references/shared/cross-language-rules.md) - Cross-language rules (file naming, comment WHY-not-WHAT, banner format, platform prefixes)
- [javascript/style-guide.md](../../../code-webflow/references/javascript/style-guide/overview-naming-and-structure.md) - JS naming (`snake_case`), file structure, formatting, JSDoc, debug logging
- [javascript/quality-standards.md](../../../code-webflow/references/javascript/quality-standards/init-dom-error-and-async.md) - JS defensive patterns + JS naming/init enforcement
- [css/style-guide.md](../../../code-webflow/references/css/style-guide.md) - CSS naming (BEM), custom properties, attribute selectors, animation CSS, file org
- [css/quality-standards.md](../../../code-webflow/references/css/quality-standards/patterns-and-naming-enforcement.md) - CSS quality patterns + CSS enforcement subsections

---

## 2. FILE HEADER CHECKS

**Applies to:** JavaScript (`.js`)

**Reference:** [code-style-guide.md Section 3](../../../code-webflow/references/javascript/style-guide/overview-naming-and-structure.md)

### File Header Format

- [ ] **[P0] CHK-HDR-01**: File starts with three-line header
- [ ] **[P0] CHK-HDR-02**: Header uses box-drawing character `─` (U+2500), not hyphen `-`
- [ ] **[P0] CHK-HDR-03**: Header line width is 67 characters
- [ ] **[P1] CHK-HDR-04**: Category label is ALL CAPS
- [ ] **[P1] CHK-HDR-05**: Component name is descriptive (2-4 words)
- [ ] **[P2] CHK-HDR-06**: No metadata (dates, authors, version numbers) in header
- [ ] **[P1] CHK-CMT-01**: No ephemeral artifact ids in any comment (ticket/ClickUp ids, spec/phase/packet numbers, ADR ids) — keep the WHY; see [references/universal/code-style-guide.md](../../../shared/references/universal/code-style-guide.md) §4

**Compliant Example:**
```javascript
// ───────────────────────────────────────────────────────────────
// VIDEO: BACKGROUND HLS HOVER
// ───────────────────────────────────────────────────────────────
```

**Non-Compliant Examples:**
```javascript
// WRONG: Using hyphens instead of box-drawing characters
// -------------------------------------------------------------------
// VIDEO: BACKGROUND HLS HOVER
// -------------------------------------------------------------------

// WRONG: Missing header entirely
(() => {
  // code starts without header
})();

// WRONG: Metadata in header
// ───────────────────────────────────────────────────────────────
// VIDEO: BACKGROUND HLS HOVER - Created 2024-01-15 by Developer
// ───────────────────────────────────────────────────────────────
```

---

## 3. SECTION ORGANIZATION CHECKS

**Applies to:** JavaScript (`.js`)

**Reference:** [code-style-guide.md Section 3](../../../code-webflow/references/javascript/style-guide/overview-naming-and-structure.md)

### Section Headers

- [ ] **[P0] CHK-SEC-01**: Code is wrapped in IIFE `(() => { ... })()`
- [ ] **[P0] CHK-SEC-02**: Section headers use multi-line comment format `/* ... */`
- [ ] **[P0] CHK-SEC-03**: Section headers are numbered (1, 2, 3, etc.)
- [ ] **[P1] CHK-SEC-04**: Section titles are ALL CAPS
- [ ] **[P1] CHK-SEC-05**: Section header line width is 68 characters
- [ ] **[P1] CHK-SEC-06**: Opening line starts with `/* ─`
- [ ] **[P1] CHK-SEC-07**: Closing line starts with `──` (not `*/` on same line as title)

### Standard Section Order

- [ ] **[P1] CHK-SEC-08**: Sections follow standard order (when applicable):
  1. CONFIGURATION
  2. UTILITIES
  3. CORE FUNCTIONS
  4. EVENT HANDLERS
  5. INITIALIZE
  6. PUBLIC API (optional)

- [ ] **[P2] CHK-SEC-09**: Each section contains related code only

**Compliant Example:**
```javascript
/* ─────────────────────────────────────────────────────────────
   1. CONFIGURATION
──────────────────────────────────────────────────────────────── */
const INIT_FLAG = '__componentNameInit';
const INIT_DELAY_MS = 50;

/* ─────────────────────────────────────────────────────────────
   2. UTILITIES
──────────────────────────────────────────────────────────────── */
function is_valid(element) { }
```

**Non-Compliant Examples:**
```javascript
// WRONG: Missing numbered sections
/* CONFIGURATION */
const INIT_FLAG = '__componentNameInit';

// WRONG: Using single-line comments for sections
// ═══════════════════════════════════════════════════════════════
// 1. CONFIGURATION
// ═══════════════════════════════════════════════════════════════

// WRONG: Title not in ALL CAPS
/* ─────────────────────────────────────────────────────────────
   1. Configuration
──────────────────────────────────────────────────────────────── */
```

---

## 4. COMMENT QUALITY CHECKS

**Applies to:** JavaScript (`.js`)

**Reference:** [code-style-guide.md Section 5](../../../code-webflow/references/javascript/style-guide/overview-naming-and-structure.md)

### Comment Principles

- [ ] **[P0] CHK-CMT-01**: No commented-out code (delete unused code, git preserves history)
- [ ] **[P1] CHK-CMT-02**: Comments explain WHY, not WHAT
- [ ] **[P1] CHK-CMT-03**: Maximum 5 comments per 10 lines of code (not over-commented)
- [ ] **[P1] CHK-CMT-04**: Platform constraints documented (WEBFLOW, MOTION, LENIS, HLS.JS)

> **Cross-stack motion.dev reference**: For motion.dev API surface, decision matrix, and integration patterns that apply across stacks (not just Webflow), see [`../../../code-webflow/references/animation/quick-start.md`](../../../code-webflow/references/animation/quick-start.md) and the documents in [`../../code-webflow/references/animation`](../../code-webflow/references/animation). The MOTION constraint above remains a Webflow-CDN-specific platform marker.

### Function Comments

- [ ] **[P1] CHK-CMT-05**: Functions have single-line purpose comment above
- [ ] **[P2] CHK-CMT-06**: Complex/public functions have JSDoc with `@param` and `@returns`

**Compliant Comments (WHY):**
```javascript
// Prevent background scroll while modal is open
if (window.lenis) {
  window.lenis.stop();
}

// WEBFLOW: Page transitions may re-execute scripts
if (window[INIT_FLAG]) return;

// Add 10 second timeout to prevent infinite hang
const timeout = new Promise((_, reject) =>
  setTimeout(() => reject(new Error('Timeout')), 10000)
);
```

**Non-Compliant Comments (WHAT):**
```javascript
// WRONG: Narrates implementation
// Set price to price times 100
const price_cents = price * 100;

// WRONG: States the obvious
// Loop through items
for (const item of items) { }

// WRONG: Describes what code does, not why
// Check if element exists
if (element) { }
```

---
