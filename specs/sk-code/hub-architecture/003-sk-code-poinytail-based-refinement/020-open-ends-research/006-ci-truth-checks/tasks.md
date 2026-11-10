---
title: "Tasks: Phase 6: ci-truth-checks"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "ci truth checks tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 6: ci-truth-checks

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Scaffold the child with create.sh `--with-goal` and bind it in the parent (`../spec.md`, `../goal.md`)
- [x] T002 Baseline the catalog validator, its fixture test and the scanner census
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [P] Gate script and its unit test (`.skilled/skills/sk-doc/shared/scripts/cite-drift-gate.mjs`, `.skilled/skills/sk-doc/scripts/tests/test-cite-drift-gate.mjs`)
- [x] T004 [P] Catalog and citation jobs (`.github/workflows/sk-doc-script-tests.yml`)
- [x] T005 sk-doc version bump and changelog entry (`.skilled/skills/sk-doc/changelog/`)
- [x] T006 Release-note item (`.skilled/changelog/skilled/v4.0.0.4.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Gate tests fail before the gate exists and pass after
- [x] T008 Simulate a branch with one new broken citation (exit 1) and one with none (exit 0); run the catalog step
- [x] T009 actionlint on the workflow; strict recursive validation of the parent
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
