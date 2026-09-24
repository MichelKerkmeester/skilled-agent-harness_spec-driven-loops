---
title: "Implementation Plan: Phase 59: Phase-map sync normalization"
description: "Make the phase-map sync tool compare statuses by meaning, keep only the leading status, warn about rows it cannot see, and report completion mismatches without writing them."
trigger_phrases:
  - "phase map sync plan"
  - "status agreement check"
  - "completion pct report only plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 59: Phase-map sync normalization

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node |
| **Framework** | None. A command-line tool |
| **Storage** | A phase parent's `spec.md` map table |
| **Testing** | Vitest, `cli` project |

### Overview
Two small helpers carry most of the change: one takes the leading status from a cell, the other decides whether a map row and a child's status already say the same thing. The row loop gains two warnings, and the completion pass keeps its detection but drops its write.
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
Extend in place, inside `sync-phase-map-status.ts`.

### Key Components
- **`leadingStatus`**: the status before any note.
- **`statusesAgree`**: the same status in any casing, or two completion words.
- **Row loop**: warns about a blank line that ends the table early and about children no row matched.
- **Completion pass**: collects mismatches for the summary and writes nothing.

### Data Flow
`runSyncPhaseMapStatus` resolves each direct child's status, rewrites disagreeing map rows in the parent's `spec.md`, then walks descendants to report completion mismatches.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Each change gets a test that builds its own parent in a temp directory and fails against the previous tool, which the orchestrator checks by running the new suite against the previous file. Two existing tests change expectation, because completion is now reported rather than written.

### Delivery
A GPT-6 Luna executor wrote the code and tests from a brief; the orchestrator reviewed the diff, ran the checks and the negative control, and updated the README entry itself.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None beyond the tool and its test.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the phase commit.
<!-- /ANCHOR:rollback -->

---
