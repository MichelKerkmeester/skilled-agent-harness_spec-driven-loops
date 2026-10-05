---
title: "Implementation Plan: Phase 28: advisor-stress-fixtures"
description: "Trace each failure to the code change it predates, update the fixture to the current contract and rerun both suites."
trigger_phrases:
  - "advisor stress fixtures plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 28: advisor-stress-fixtures

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript tests |
| **Framework** | Vitest |
| **Storage** | None |
| **Testing** | Advisor stress suite and unit suite |

### Overview
Each test now matches the contract the code already follows: the hyphenated future folder, and a stdin request bounded by the prompt byte budget.
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
Fix the stale test, not the intended behavior.

### Key Components
- **sa-016**: lifecycle routing over 900 synthetic entries
- **sa-034**: OpenCode plugin bridge with a mocked child process

### Data Flow
Run the stress suite, trace each failure, edit the fixture, rerun.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The stress suite passes 64 of 64 across 21 files, up from 62 with 2 failures. The unit suite passes 1005 with 6 skipped. The package typecheck passes; it excludes the stress directory, which vitest runs untyped.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

N/A — record dependencies beyond the components named in the architecture here.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the two test files.
<!-- /ANCHOR:rollback -->

---
