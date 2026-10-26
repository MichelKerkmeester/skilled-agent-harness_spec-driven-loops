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

<!-- ANCHOR:phase-4 -->
## Phase 4: Second Round

- [x] T018 Class each T105 round 1 finding and tick phase 002 CHK-FIX-001 (`../002-hub-surface-removal/`). Evidence: the P1 is classed `instance-only`. The two P2s were never recorded anywhere, so their part of the row is waived with that reason.
- [x] T019 Re-run the lint and syntax checks for phase 003 CHK-010 (`../003-advisor-vocabulary-cleanup/tasks.md`). Evidence: `tsc` exit 0, `node --check` 12 of 12, `ast.parse` 4 of 4, `eslint` exit 0 on the 2 files a config covers.
- [x] T020 Re-run the five vitest files and the Python suite for phase 003 CHK-011. Evidence: `Tests  66 passed (66)` and `Summary: pass=84, fail=0`.
- [x] T021 Add a `Class:` to each round 1 to 4 finding for phase 003 CHK-FIX-001 (`../003-advisor-vocabulary-cleanup/decision-record.md`). Evidence: 34 labels.
- [x] T022 Add playbook scenario AI-007 for phase 003 CHK-FIX-003 (`system-skill-advisor/manual-testing-playbook/auto-indexing/private-skill-roots.md`). Evidence: the validator reports `scenarios=62` and `violations=0`.
- [x] T023 Add the delimiter, sibling-prefix and empty-variable cases for phase 003 CHK-FIX-004 (`runtime/tests/private-skill-target.vitest.ts`). Evidence: `Tests  11 passed (11)`, and each new case fails against a mutated helper.
- [x] T024 Regenerate the advisor `leaf-manifest.json` and `leaf-aliases.json` for the new scenario. Evidence: the root-metadata gate prints `checked=14 passed=14 failed=0`.
- [x] T025 Skip `local-*` in `command-catalog-mirror-check.cjs`, test it and move it to the inventory's ruled set (`.skilled/commands/doctor/scripts/`). Evidence: 11 of 11 pass, and the new case fails without the skip.
- [x] T026 Retire the two Webflow benchmark scenarios (`.skilled/skills/sk-code/benchmark/`). Evidence: no runner or test reads the fixtures, and the sk-code drift guards pass 4 of 4.
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`. T018 closed with the unrecorded P2 findings waived.
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
