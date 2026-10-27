---
title: Code Quality Checklist
description: SKILLED JavaScript header and section house checks that the SKILLED JavaScript checklist does not state.
trigger_phrases:
  - "javascript css style compliance"
  - "review baseline handoff"
importance_tier: normal
contextType: implementation
version: 1.6.0.0
---

# Code Quality Checklist

SKILLED JavaScript header and section house checks that the SKILLED JavaScript checklist does not state.

## 1. OVERVIEW

### Purpose

Hold the few JavaScript checks the SKILLED surface applies on top of its JavaScript checklist. They are house style, not universal rules, so they load only when SKILLED resolves for a `.js` or `.css` target. The SKILLED JavaScript checklist owns everything else: the header form, section dividers, naming, comment density and the init pattern.

### Usage

1. **Load** the SKILLED JavaScript checklist first, `../javascript-checklist.md`, with its style guide.
2. **Load** this file and its companion, [naming-init-formatting-and-css.md](./naming-init-formatting-and-css.md), for a `.js` or `.css` target.
3. **Validate** each applicable item against the code.
4. **Mark** items `[x]` when verified.
5. **Block** completion if any P0 item fails.
6. **Document** P2 deferrals with reasons.

### Language Coverage

| Language | File Extension | Where |
|----------|----------------|-------|
| JavaScript | `.js` | Sections 2 and 3 of this file, plus the formatting section of the companion |
| CSS | `.css` | The CSS section of the companion |

### What Is Not Here

A site house style is not a SKILLED rule. Webflow conventions, such as `snake_case` JavaScript names, the IIFE wrapper, `/* */` numbered section headers, the `CATEGORY: COMPONENT NAME` header and `WEBFLOW:`, `MOTION:` or `LENIS:` comment prefixes, are not checks here. An operator-private Webflow surface skill carries them. On SKILLED they contradict the camelCase and `MODULE:` header rules of the SKILLED JavaScript checklist.

Comment rules are not here either. Commented-out code, WHY-not-WHAT, function purpose comments, JSDoc and the comment budget are SKILLED JavaScript checklist rules. Ephemeral artifact ids and history comments (CHK-CMT-07) are universal rules in [code-style-guide.md](../../../../sk-code-quality/references/code-style-guide.md) §4.

### Review Baseline Handoff

For formal findings-first review output, run `sk-code`'s code-review mode as the baseline and use this checklist as additional JavaScript and CSS evidence.

- Severity model and review output contract: `sk-code/sk-code-review/references/quick-reference.md`
- Baseline security/quality/test review checks: `sk-code`'s code-review mode references
- This checklist: SKILLED JavaScript and CSS house-style evidence

---

## 2. FILE HEADER CHECKS

**Applies to:** JavaScript (`.js`)

The header form itself comes from the surface checklist.

- [ ] **[P2] CHK-HDR-06**: No metadata (dates, authors, version numbers) in the file header

**Non-Compliant Example:**
```javascript
// WRONG: Metadata in header
// ───────────────────────────────────────────────────────────────────
// MODULE: Config Loader - Created 2024-01-15 by Developer
// ───────────────────────────────────────────────────────────────────
```

---

## 3. SECTION ORGANIZATION CHECKS

**Applies to:** JavaScript (`.js`)

The divider form and the standard section order come from the surface checklist.

- [ ] **[P2] CHK-SEC-09**: Each section contains related code only
