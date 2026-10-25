---
title: "Tasks: Fix the stale-lock reclaim race in the shared deep-loop writer lock"
description: "Task Format: T### [P?] Description (file path). Reproduce the lost-writer failure, decide whether the inferred cause holds, fix the reclaim path in cli-guards.cjs and verify against the baselines. Each task carries the check that shows it is done."
trigger_phrases:
  - "writer lock stale reclaim race tasks"
  - "writer lock reproduction tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Fix the stale-lock reclaim race in the shared deep-loop writer lock

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

All paths below are relative to the repository root. `RT` means `.skilled/skills/system-deep-loop/runtime`. Run vitest from inside `RT`.

- [ ] T001 Save the baselines on the unchanged code: the pair of lock files, the full runtime suite and the typecheck (`scratch/base-lock-files.txt`, `scratch/base-suite.txt`, `scratch/base-typecheck.txt`). Check: the pair prints `Test Files  2 passed (2)` and `Tests  18 passed (18)`, the suite file ends with its totals line and the typecheck exit code is saved
- [ ] T002 Run the CI case in a loop on the unchanged code and save the failure counts. The plain loop repeats `npx vitest run --no-coverage tests/unit/jsonl-repair.vitest.ts -t "does not drop a plain appendJsonlRecord"` 200 times (`scratch/stress-before.txt`). The widened loop runs the same nine-record case 200 times through a scratch driver whose preload delays `fs.rmSync` on the lock path (`scratch/widened-driver.cjs`, `scratch/stress-before-widened.txt`). Check: each count file ends with a line `rounds=200 failures=N`, with N recorded whatever it is
- [ ] T003 [P] Write the R1 reproduction (the lock file vanishes after the failed open and a peer creates a fresh lock) with `node:fs` spies (`RT/tests/unit/cli-guards-writer-lock.vitest.ts`). Check: on the unchanged `cli-guards.cjs` the new test fails because the writer acquires and the peer's lock is gone, and the output is saved in `scratch/repro-before.txt`
- [ ] T004 [P] Write the R5 reproduction (a stale body is judged, then a peer swaps in a fresh lock before the removal) in the same file. Check: it fails on the unchanged code the same way, and its output is appended to `scratch/repro-before.txt`
- [ ] T005 Decide the cause status by the rule in `plan.md` section 4 and change the **Cause status** line there. Check: `rg -n "Cause status" specs/system-deep-loop/041-writer-lock-stale-reclaim-race/plan.md` shows CONFIRMED, DEFECT-ONLY or REFUTED. A REFUTED verdict ends the packet here with a report to the operator and no lock change
- [ ] T006 Take the same-class and consumer inventories from `plan.md` section 3, then choose the fix shape and record it and the window it leaves in the **Chosen shape** line. Check: the output of both `rg` commands is in `scratch/inventory.txt` and the Chosen shape line names a shape
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T007 Get the operator's branch for the fix and write it into the `spec.md` metadata. Check: the Branch field in `spec.md` names it and the first open question there is answered
- [ ] T008 Implement the chosen shape in `RT/scripts/lib/cli-guards.cjs` only: the reclaim branch (lines 533 to 541 at the time of writing) and the ENOENT answer at line 351. Check: `git diff --stat` lists `cli-guards.cjs` and the lock test file only, and the diff touches neither the `module.exports` block nor the constants near the top
- [ ] T009 Settle the other two removal sites (lines 489 and 568). Fix a site in the same change only if the inventory shows the same defect is reachable there. Otherwise record "not reachable" with the reason under Known Limitations in `implementation-summary.md`. Check: the CHK-FIX-002 line states the verdict for both sites
- [ ] T010 Keep the reproductions as regression tests: restore the spies and the environment knobs in `afterEach` and leave no state between tests. Check: the lock file passes in two separate runs, and `git diff` shows no edit to the body of any of the 6 existing tests
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Rerun the reproductions on the fixed code. Check: both pass, and the output is saved in `scratch/repro-after.txt`
- [ ] T012 Rerun the 200-round loops on the fixed code, plain and widened. Check: each file ends with `rounds=200 failures=0` (`scratch/stress-after.txt`, `scratch/stress-after-widened.txt`)
- [ ] T013 Run the pair of lock files, the full runtime suite and the typecheck, and compare with the baselines. Check: the pair reads 18 plus the new tests passed with 0 failed, the suite totals are at or above `scratch/base-suite.txt` with 0 failed and the typecheck exit code matches `scratch/base-typecheck.txt`
- [ ] T014 Scope check on the finished change. Check: `git diff --name-only <base> <fix-sha>` lists only the two code files and files under this packet
- [ ] T015 Close the packet: fill `implementation-summary.md` with the real results, set each `acceptance-criteria.md` row to the evidence observed and run the packet validator. Check: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-deep-loop/041-writer-lock-stale-reclaim-race --strict --no-recursive` prints `RESULT: PASSED` and no acceptance row reads Unmet
- [ ] T016 Watch the next deep-loop-runtime runs on main after the fix lands. Check: `gh run list --workflow deep-loop-runtime.yml --limit 10` shows no repeat of the 8-of-9 failure
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
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

- [ ] CHK-001 [P0] Requirements documented in spec.md. Check: `spec.md` section 4 lists REQ-001 to REQ-004
- [ ] CHK-002 [P0] Technical approach defined in plan.md. Check: `plan.md` sections 3 and 4 hold the interleaving, the candidate shapes and the decide rule
- [ ] CHK-003 [P1] Dependencies identified and available. Check: `plan.md` section 6, and `scratch/base-lock-files.txt` from T001
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks. Check: `npm --prefix .skilled/skills/system-deep-loop/runtime run typecheck` exits as it did at baseline (`scratch/base-typecheck.txt`)
- [ ] CHK-011 [P0] No new console errors or warnings. Check: the after-run files hold no output the baseline files lack, apart from the new test names
- [ ] CHK-012 [P1] Error handling implemented. Check: a failed removal in the reclaim loop is still caught and counted, and the release function still never throws
- [ ] CHK-013 [P1] Code follows project patterns. Check: the edit keeps the section layout, JSDoc and comment style of `cli-guards.cjs`, and no comment names a packet, task or finding id
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met. Check: every row of `acceptance-criteria.md` reads Met with its evidence
- [ ] CHK-021 [P0] The reproduction fails before the fix and passes after it. Check: `scratch/repro-before.txt` shows the failure and `scratch/repro-after.txt` shows the pass, for the same test names
- [ ] CHK-022 [P1] Edge cases tested. Check: rows R1 to R7 in `plan.md` section 3 each map to a new test, an existing test or the loop
- [ ] CHK-023 [P1] Error scenarios validated. Check: the dead-pid and aged-out tests pass unedited and a failed removal is retried
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class. Check: `implementation-summary.md` names the class, expected to be `class-of-bug` (a removal that follows a verdict about a file that may have changed)
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed. Check: `scratch/inventory.txt` lists the removal sites at lines 489, 536 and 568, and T009 states the verdict for lines 489 and 568
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers. Check: `scratch/inventory.txt` lists the five call sites of `acquireWriterLock` in four files, and the diff leaves them unchanged
- [ ] CHK-FIX-004 [P0] Adversarial interleaving tests exist. This is a concurrency fix, not a security, path or parser fix, so the adversarial cases are the interleavings. Check: the R1 and R5 tests are in the lock test file and pass
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Check: `plan.md` section 3 lists 3 axes and 7 rows
- [ ] CHK-FIX-006 [P1] Hostile global state executed. Check: the spies and environment knobs are restored in `afterEach`. The lock file passes in two separate runs and the loops run with real processes
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range. Check: `implementation-summary.md` names the SHA that the saved outputs came from
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets. Check: the diff holds only fabricated pid and nonce strings in tests
- [ ] CHK-031 [P0] Input validation unchanged. Check: the diff leaves the lock path handling, including `mkdirSync`, alone
- [ ] CHK-032 [P1] Auth/authz not applicable. Check: the lock code has no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized. Check: the cause status, chosen shape and results agree across `spec.md`, `plan.md` and `implementation-summary.md`
- [ ] CHK-041 [P1] Code comments adequate. Check: the reclaim branch carries one comment giving the reason a verdict is never applied to a different file
- [ ] CHK-042 [P2] README updated (if applicable). Check: `database/README.md` line 28 still describes the lock correctly, so no edit is needed
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only. Check: `git status --short` lists nothing outside the two code files and this packet
- [ ] CHK-051 [P1] scratch/ cleaned before completion. Check: every file left in `scratch/` is named by a task or an acceptance row
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Not verified yet. The packet was opened on 2026-10-25.
<!-- /ANCHOR:summary -->

---
