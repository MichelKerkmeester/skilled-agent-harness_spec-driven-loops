---
title: "Implementation Plan: Phase 12: review-remediation"
description: "One small change per review finding in the source-tag helper, the three frontmatter-value readers and the citation census, each pinned by a test that fails on the old code."
trigger_phrases:
  - "050 review remediation plan"
  - "frontmatter scalar comment rule"
  - "cutoff calendar date check"
  - "census line feed path"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 12: review-remediation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (ESM and CommonJS), Python 3 |
| **Framework** | None |
| **Storage** | None |
| **Testing** | vitest, node:test, a plain Python runner |

### Overview
Each finding gets the narrowest fix at the place the review named. The three readers keep their own parsers, since one is Python and the other two load in different module systems, so the same scalar rule is written once per reader: a quoted value keeps what sits between its quotes, an unquoted value ends where ` #` begins a comment.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: local fixes in standalone CLI tools.

### Key Components
- **`cutoffDate`**: keeps the shape check and adds a round trip through `Date.UTC`, so a day that does not exist falls back to the default.
- **Scalar readers**: `scalarValue` in the spec-kit helper, `_frontmatter_scalar` in the Python validator and `enumScalar` in the skill-doc checker apply the comment rule; the checker also lowercases, as the other readers already did.
- **`prefetchCommitted`**: filters out paths that hold a line feed; `readCommittedText` then reads each with `git show`, where the path is one argument.

### Data Flow
Unchanged. Each tool reads the same inputs and writes the same outputs; only the parsing of one value, or the read path of one rare file name, changes.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

One new case per finding. Each was run against the pre-fix source (the five source files swapped back to `HEAD`, the new tests kept) and failed, then passed against the fix. The real tree is checked too: the skill-doc checker reports the same result before and after.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

N/A — record dependencies beyond the components named in the architecture here.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the phase commit. No data or generated artifact depends on the new behavior.
<!-- /ANCHOR:rollback -->

---
