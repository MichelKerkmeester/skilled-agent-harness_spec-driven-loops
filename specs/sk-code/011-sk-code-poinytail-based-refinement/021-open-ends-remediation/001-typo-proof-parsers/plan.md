---
title: "Implementation Plan: Phase 1: typo-proof-parsers"
description: "Add a rejecting branch to each flagged parser and a non-zero exit to each detected-problem path, proven by typo-flag tests written before the fix."
trigger_phrases:
  - "typo proof parsers plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: typo-proof-parsers

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (CommonJS, ESM, TypeScript) and Bash |
| **Framework** | None, standalone CLI scripts |
| **Storage** | None |
| **Testing** | node --test, vitest and Bash harnesses beside each skill's existing tests |

### Overview
Each flagged script checks its arguments against its own option list and refuses the first unknown one, using the script's existing usage code or 2. The ten class 2 scripts exit non-zero where they already detect the problem. A typo-flag test per skill is written and run red before any script changes.
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
Standalone CLI scripts, each owning its own argument parser.

### Key Components
- **Per-script parsers**: hold the option list and the rejecting branch.
- **`cli-guards.cjs` and `reject-unknown-options.mjs`**: the two shared helpers, used only where three or more callers in one skill share a parser shape.

### Data Flow
Arguments reach the parser, an unknown option stops the run before any read or write, and known options flow on unchanged.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

N/A — record any testing beyond the verification tasks in `tasks.md` here.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

N/A — record dependencies beyond the components named in the architecture here.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

N/A — record rollback steps beyond reverting the scoped change here.
<!-- /ANCHOR:rollback -->

---

