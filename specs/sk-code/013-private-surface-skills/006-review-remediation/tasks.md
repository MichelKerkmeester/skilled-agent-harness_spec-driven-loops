---
title: "Tasks: Phase 6: review-remediation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "review remediation tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 6: review-remediation

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

- [x] T001 Read the review report and confirm the commit ancestry it relies on (`../review/review-report.md`). Evidence: ten commits are ancestors of `origin/main`.
- [x] T002 Rerun the AC-013 probe. Evidence: `sk-code` with `compiledRoute` target `sk-code-skilled`.
- [x] T003 Take the baseline from the review report, which recorded `131 passed, 0 failed` before the guard change.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Close the phase 002 records (`../002-hub-surface-removal/`)
- [x] T005 Close the phase 003 records and add inventory rows 17 and 18 (`../003-advisor-vocabulary-cleanup/`)
- [x] T006 Tick the phase 004 completion box (`../004-private-local-skills/tasks.md`)
- [x] T007 Reconcile the parent and goal, and rewrite the six research citations (`../spec.md`, `../goal.md`, `../research/`)
- [x] T008 Widen the guard to `ACMRT` and add harness case 81 (`.skilled/scripts/git-hooks/`)
- [x] T009 Route the derived-freshness gate through `listSkillRoots` and test the skip (`sk-create-skill/scripts/`)
- [x] T010 Skip `local-*` in the doctor description audit and test the skip (`.skilled/commands/doctor/scripts/`)
- [x] T011 Add the skills-root reader inventory test (`sk-create-skill/scripts/tests/skill-root-reader-inventory.test.cjs`)
- [x] T012 Add TSDoc to the containment helper (`private-skill-target.ts`)
- [x] T013 Document the gate and the private-root variable (hooks README, advisor README, catalog leaf, playbook scenario 484)
- [x] T014 Rewrite the `not_for` line (`speckit-complete.yaml`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Run every changed script's tests and the harness. Evidence: see `implementation-summary.md` Verification.
- [x] T016 Run each new test against the old script. Evidence: each one failed there.
- [x] T017 Run the doc package validators and recursive strict validation. Evidence: see `implementation-summary.md` Verification.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed. Evidence: scenario 484 was run in a throwaway repository, and goal criterion 3 in the operator checkout.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
