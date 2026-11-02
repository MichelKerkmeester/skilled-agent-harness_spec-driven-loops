---
title: "Tasks: Phase 6: doctor-update-local-state"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "doctor update local state tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 6: doctor-update-local-state

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Create the numbered worktree through sk-git (`/Users/michelkerkmeester/worktrees/public/308-doctor-update-local-state`). Verify: `git worktree list` shows `worktrees/308-doctor-update-local-state`.
- [x] T002 Record the baseline (`release-update.test.cjs`). Verify: it prints `tests 73`, `pass 73`, `fail 0`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Move the state paths and add the legacy reader (`.skilled/commands/doctor/scripts/release-update.cjs`). Verify: `--help` names `.skilled/skills/.state/doctor-update/` three times.
- [x] T004 Drop the tracked-record refusals and keep them for framework files (`release-update.cjs`). Verify: the record-base test against a base.json that differs from HEAD passes.
- [x] T005 Delete `.skilled/release/.gitignore`. Verify: `ls .skilled/release` fails.
- [x] T006 [P] Move the apply-lock path (`upgrade-legacy.mjs`, `upgrade-legacy.vitest.ts`). Verify: the vitest exits 0.
- [x] T007 [P] Update the workflow YAML, presentation text, command contract and playbook pages. Verify: `rg -n "\.skilled/release" .skilled -g '!**/changelog/**'` lists only legacy-fallback references.
- [x] T008 [P] Accept the new folder in the validator's installed-state exception (`validate-playbook-package.cjs`). Verify: the root playbook prints the same 0 errors and 12 warnings as main.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run the suites (`release-update.test.cjs`, `doctor-update-contract.test.cjs`, `validate-playbook-package.test.cjs`). Verify: `pass 75 fail 0`, `pass 12 fail 0`, validator exit 0.
- [x] T010 Commit on `worktrees/308-doctor-update-local-state` by explicit path. Verify: `git show --stat HEAD` lists only this change. Done: `96b456e0a3`, 32 files.
- [x] T011 Re-pin Barter's `skilled/` to that commit. Verify: `replay.cjs --check` ends `miss=0` and `ls skilled/.skilled/release` fails. Done: `checked=49 ok=49 miss=0`, `RESULT: PASSED`; the folder is gone.
- [x] T012 Fix the independent review's findings: exclude only `.skilled/skills/.state/doctor-update/` from update units, and keep record bytes out of the `apply --dry-run` preview (`release-update.cjs`, its tests, the validator test). Verify: the two changed tests fail on the first commit's engine and pass after; full suite `pass 75 fail 0`.
- [x] T013 Add the rollback tests the review asked for: a second apply rewrites an existing local base record and rollback restores its earlier bytes, and a tampered before-image is refused (`release-update.test.cjs`). Verify: each test fails when its branch in the restore code is disabled and passes on the real code.
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

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `node --check` passes on the changed scripts; `git diff --check` is clean
- [x] CHK-011 [P0] No new warning in the root playbook validation (12 before, 12 after)
- [x] CHK-012 [P1] An unreadable record still fails with `cannot read <path>`
- [x] CHK-013 [P1] Comments carry no packet, phase or task ids
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Manual testing complete (Barter re-pin)
- [x] CHK-022 [P1] Edge cases tested: legacy only (`release-update.test.cjs:653`), neither present (the existing suites). Both present is not tested separately: the new record wins because `loadRecordJson` reads it first
- [x] CHK-023 [P1] Error scenarios validated: a dirty framework file still refuses apply
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Finding class: `cross-consumer` (the state path is read by `release-update.cjs` and `upgrade-legacy.mjs`).
- [x] CHK-FIX-002 [P0] Same-class producers: `rg -n "RELEASE_DIR|\.skilled/release" .skilled` before and after.
- [x] CHK-FIX-003 [P0] Consumers: `upgrade-legacy.mjs`, the playbook validator, the command contract, YAML, presentation and playbook pages.
- [x] CHK-FIX-004 [P0] Path tests: legacy fallback (`:653`), a record that differs from HEAD (`:687`), a second apply with local records (`:995`), rollback accepting a legacy record path.
- [x] CHK-FIX-005 [P1] Matrix axes: record location (new, legacy, both, none) by command (record-base, apply, rollback).
- [x] CHK-FIX-006 [P1] N/A: no environment variable or process-wide state is read.
- [x] CHK-FIX-007 [P1] Evidence pinned to commit `96b456e0a3`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Rollback restores only the record files and paths inside the plan's units
- [x] CHK-032 [P1] N/A: no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate
- [x] CHK-042 [P2] N/A: no README names the folder
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-02
<!-- /ANCHOR:summary -->

---
