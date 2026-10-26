---
title: Code Quality Checklist
description: Surface-neutral JavaScript header, section and comment checks that no surface language checklist states.
trigger_phrases:
  - "javascript css style compliance"
  - "review baseline handoff"
importance_tier: normal
contextType: implementation
version: 1.5.4.0
---

# Code Quality Checklist

Surface-neutral JavaScript header, section and comment checks that no surface language checklist states.

## 1. OVERVIEW

### Purpose

Hold the few JavaScript checks that apply on every surface and that the surface's own language checklist does not already carry. The surface checklist owns everything else: the header form, section dividers, naming, comment density and the init pattern.

### Usage

1. **Load** the surface's JavaScript checklist first. For SKILLED that is `../../../sk-code-skilled/assets/checklists/javascript-checklist.md` with its style guide.
2. **Load** this file and its companion, [naming-init-formatting-and-css.md](./naming-init-formatting-and-css.md), for a `.js` or `.css` target.
3. **Validate** each applicable item against the code.
4. **Mark** items `[x]` when verified.
5. **Block** completion if any P0 item fails.
6. **Document** P2 deferrals with reasons.

### Language Coverage

| Language | File Extension | Where |
|----------|----------------|-------|
| JavaScript | `.js` | Sections 2-4 of this file, plus the formatting section of the companion |
| CSS | `.css` | The CSS section of the companion |

### What Is Not Here

A site house style is not a surface-neutral rule. Webflow conventions, such as `snake_case` JavaScript names, the IIFE wrapper, `/* */` numbered section headers, the `CATEGORY: COMPONENT NAME` header and `WEBFLOW:`, `MOTION:` or `LENIS:` comment prefixes, are not checks here. An operator-private Webflow surface skill carries them. On SKILLED they contradict the camelCase and `MODULE:` header rules of the SKILLED JavaScript checklist.

### Review Baseline Handoff

For formal findings-first review output, run `sk-code`'s code-review mode as the baseline and use this checklist as additional JavaScript and CSS evidence.

- Severity model and review output contract: `sk-code/sk-code-review/references/quick-reference.md`
- Baseline security/quality/test review checks: `sk-code`'s code-review mode references
- This checklist: surface-neutral JavaScript and CSS evidence

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

---

## 4. COMMENT QUALITY CHECKS

**Applies to:** JavaScript (`.js`)

Commented-out code, WHY-not-WHAT, function purpose comments, JSDoc and the comment budget are surface checklist rules. Ephemeral artifact ids in comments are blocked by `scripts/check-comment-hygiene.sh` and [references/code-style-guide.md](../../references/code-style-guide.md) §4.

- [ ] **[P1] CHK-CMT-07**: Each comment describes what the code does now, never how it got there, what it used to do or which change introduced it

A comment that narrates its own history is wrong the moment the next change lands. On any collision, the root document's comment-hygiene hard block wins. This rule adds to it and does not soften it. Before: `// this check used to live in the old loader`. After: `// skips blank lines so the count stays true`.

---
