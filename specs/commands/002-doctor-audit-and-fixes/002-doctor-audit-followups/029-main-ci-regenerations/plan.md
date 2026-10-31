---
title: "Implementation Plan: Phase 29: main-ci-regenerations"
description: "Reproduce each failure locally, run its generator, review the diff and rerun the gates."
trigger_phrases:
  - "main ci regenerations plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 29: main-ci-regenerations

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node and Python generators |
| **Framework** | GitHub Actions checks |
| **Storage** | Generated repository files |
| **Testing** | Hermes sync checks, sk-doc script suite, deep-loop contract tests |

### Overview
Three generators were rerun in write mode. Their diffs total 11 insertions and 8 deletions across five files.
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
Regenerate derived files from unchanged sources.

### Key Components
- **Hermes skill sync**: 2 of 70 copies rewritten
- **README manifest**: 811 directories, one added
- **Contract compiler**: two digests updated

### Data Flow
Reproduce, regenerate, review diff, verify, push.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The Hermes skill and prompt checks pass and command tree parity passes. The sk-doc script suite passes. The contract drift check reports OK for 3 commands, and the two deep-loop contract test files pass 42 of 42, up from 4 failures.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

N/A — record dependencies beyond the components named in the architecture here.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the five generated files.
<!-- /ANCHOR:rollback -->

---
