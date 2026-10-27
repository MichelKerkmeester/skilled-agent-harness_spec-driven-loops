---
title: Verification Summary, Quick Reference & Related
description: Verification summary templates and pass criteria for the SKILLED JavaScript and CSS house-style checks.
trigger_phrases:
  - "code quality verification summary"
  - "javascript pass criteria"
  - "css pass criteria"
  - "quality gate resources"
importance_tier: normal
contextType: implementation
version: 1.6.0.0
---

# Verification Summary, Quick Reference & Related

Templates, pass criteria, and source links for reporting the SKILLED JavaScript and CSS house-style checks.

## 1. OVERVIEW

### Purpose

Provide consistent verification summaries, pass criteria, and related standards for the code-quality gate.

### Usage

Use the matching language template after validation, apply the gate rule, and consult the linked standards when remediation is needed.

---

## 2. VERIFICATION SUMMARY TEMPLATE

After completing validation, document the results using the appropriate template. The result line copies the gate the quality runner printed, and no gate value means pass.

### JavaScript Files

```markdown
## Code Quality Verification Summary

**File**: [filename.js]
**Date**: [YYYY-MM-DD]

### Results

| Category | P0 | P1 | P2 | Status |
|----------|----|----|----|----|
| File Header | X/0 | X/0 | X/1 | ✅/❌ |
| Section Organization | X/0 | X/0 | X/1 | ✅/❌ |
| Formatting | X/0 | X/0 | X/1 | ✅/❌ |

**P0 Status**: All passed? [YES/NO]
**P1 Status**: All passed or deferred? [YES/NO]
**Gate Result**: [NO_BLOCKER_FOUND/BLOCKED/NOTHING_CHECKED/UNVERIFIED/ERROR]

### Deferred Items (if any)
- [Item ID]: [Reason for deferral]
```

### CSS Files

```markdown
## Code Quality Verification Summary

**File**: [filename.css]
**Date**: [YYYY-MM-DD]

### Results

| Category | P0 | P1 | P2 | Status |
|----------|----|----|----|----|
| Attribute Selectors | X/0 | X/1 | X/0 | ✅/❌ |
| Animation Properties | X/0 | X/2 | X/1 | ✅/❌ |

**P0 Status**: All passed? [YES/NO]
**P1 Status**: All passed or deferred? [YES/NO]
**Gate Result**: [NO_BLOCKER_FOUND/BLOCKED/NOTHING_CHECKED/UNVERIFIED/ERROR]

### Deferred Items (if any)
- [Item ID]: [Reason for deferral]
```

---

## 3. QUICK REFERENCE

### JavaScript Pass Criteria

These checks add no JavaScript P0. The P0 items that gate a `.js` file come from the SKILLED JavaScript checklist. CHK-CMT-07 is a universal rule in the code style guide and is reported with it.

| Check Category | Minimum for PASS |
|----------------|------------------|
| File Header | CHK-HDR-06 recommended (P2) |
| Section Organization | CHK-SEC-09 recommended (P2) |
| Formatting | CHK-FMT-05 recommended (P2) |

### CSS Pass Criteria

| Check Category | Minimum for PASS |
|----------------|------------------|
| Attribute Selectors | CHK-CSS-05 fixed or deferred with approval (P1) |
| Animation Properties | CHK-CSS-10 and CHK-CSS-11 fixed or deferred with approval (P1), CHK-CSS-09 recommended (P2) |

### Gate Rule

**If ANY P0 item fails, completion is BLOCKED until fixed.**

---

## 4. RELATED RESOURCES

### Per-language source standards

- [javascript-checklist.md](../javascript-checklist.md) - SKILLED JavaScript checks, including the header form and naming
- [style-guide.md](../../../references/javascript/style-guide.md) - SKILLED JavaScript style guide

### Enforcement Reference

- [check-comment-hygiene.sh](../../../../sk-code-quality/scripts/check-comment-hygiene.sh) - Per-file comment-hygiene checker

### Parent Skill

- [SKILL.md](../../../SKILL.md) - The SKILLED surface
- [sk-code-quality SKILL.md](../../../../sk-code-quality/SKILL.md) - Phase 1.5: Code Quality Gate
