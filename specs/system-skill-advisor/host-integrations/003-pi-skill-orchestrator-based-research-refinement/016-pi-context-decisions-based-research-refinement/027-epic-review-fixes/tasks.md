---
title: "Tasks: Fix the findings of the fresh epic review"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "epic review fixes tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Fix the findings of the fresh epic review

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

`A` is `.skilled/skills/system-skill-advisor/runtime`. `G` is the session gate runner, which prints one `<gate> exit=<n>` line per gate.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Create the worktree `worktrees/515-epic-review-fixes` with sk-git's naming script and finish its provisioning. Verify: `worktree-naming.sh provision` prints `0 failed`. Evidence: `provisioned: 0 installed, 4 built, 14 already present, 0 failed`.
- [x] T002 Scan the skill graph in the worktree. Verify: `skill-advisor.cjs skill_graph_scan --trusted` exits 0.
- [x] T003 Capture the baseline. Verify: G prints advisor-test exit 0 with `2450 passed | 4 skipped`, and the Python suite `pass=123, fail=0`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Delete `resolvedCalibration`, its override type and `semanticSearchCodeGraphBonus` (`A/lib/scorer/scoring-constants.ts`). Verify: `git grep -n 'resolvedCalibration\|semanticSearchCodeGraphBonus'` prints nothing outside `specs/`.
- [x] T005 Delete query-class routing and the unused explicit-signal input (`A/lib/scorer/fusion.ts`). Verify: `grep -c 'QueryClass\|hasExplicitWorkflowSignal' fusion.ts` prints 0.
- [x] T006 Replace the BM25 query-length switch with one fixed midpoint (`A/lib/scorer/lanes/bm25.ts`). Verify: `grep -c 'QUERY_LENGTH' bm25.ts` prints 0.
- [x] T007 Forward the two location keys (`.skilled/bin/system-skill-advisor-launcher.cjs`) and add their case (`A/tests/launcher-bootstrap.vitest.ts`). Verify: the launcher-bootstrap file passes.
- [x] T008 Delete the dead eval script and its three references (`A/scripts/routing-accuracy/`, `A/tests/parity/holdout-independent.vitest.ts`). Verify: `git grep score-outcome-rerank` prints nothing outside `specs/`.
- [x] T009 Drop the calibration override rows (`ENV-REFERENCE.md`, `.env.example`). Verify: `git grep CALIBRATION_OVERRIDE` prints nothing outside `specs/` and changelogs.
- [x] T010 Drop the retired Python boosts and synonyms (`A/scripts/skill_advisor.py`). Verify: `python3 -m py_compile` exits 0 and the Python suite prints `pass=123, fail=0`.
- [x] T011 Remove the query-class case (`A/tests/scorer/conflict-query-rerank.vitest.ts`) and the two retired fixture columns (`A/tests/scorer/projection-fallback-049-005.vitest.ts`). Verify: both files pass.
- [x] T012 Add the case that runs the cleanup commands (`.skilled/commands/doctor/scripts/tests/doctor-update-contract.test.cjs`). Verify: the suite prints `tests 21`, `pass 21`, `fail 0`.
- [x] T013 Delete the untracked lane build output in the primary checkout's advisor `dist/`. Verify: `ls dist/runtime/lib/scorer/lanes | grep -c semantic` prints 0 and `dist/runtime/lib/embedders` does not exist.
- [x] T014 Fill row 27 and its handoff row in the 016 phase map (`../spec.md`). Verify: `grep -n '027-epic-review-fixes' ../spec.md` prints two lines.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Prove the new contract case catches drift. Verify: with `--verbose` added to the YAML apply command the case fails, and after restoring the file `git diff --quiet` on it exits 0.
- [x] T016 Run the sk-code quality gate on the changed code. Verify: it prints `NO_BLOCKER_FOUND` with zero P0, P1 and P2 and an empty `unverified` list.
- [x] T017 Rerun the whole gate set on the final state. Verify: every gate in plan.md section 5 prints exit 0, as recorded in `implementation-summary.md`.
- [x] T018 Regenerate the trigger index last, then check it. Verify: `generate-trigger-index.mjs --check` prints `stale documents   : 0`.
- [x] T019 Validate the packet and its parent. Verify: `validate.sh --strict` prints `RESULT: PASSED` for 027 and 016.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Every `acceptance-criteria.md` row is Met
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Source review**: See `evidence/review-report.md`
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

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: `spec.md` section 4.
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: `plan.md` sections 3 and 5.
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: `plan.md` section 6.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The advisor typecheck and clean build exit 0. Evidence: `implementation-summary.md` Verification.
- [x] CHK-011 [P0] The quality gate finds no blocker. Evidence: T016.
- [x] CHK-012 [P1] A cleanup command that fails reports the tool's stderr. Evidence: the case's assertion message carries `run.stderr`.
- [x] CHK-013 [P1] Comments keep the durable reason and carry no packet or finding ids. Evidence: the two new comments in the launcher and the contract test name only the reason.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: `acceptance-criteria.md`.
- [x] CHK-021 [P0] The full gate set passes. Evidence: T017.
- [x] CHK-022 [P1] Edge cases tested: an unlisted key is still dropped by the existing filter case, and a drifted command fails the new case. Evidence: T007, T015.
- [x] CHK-023 [P1] Error scenario validated: a rejected flag fails the contract case. Evidence: T015.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each finding has a class: 1, 2 and 5 class-of-bug, 3, 6 and 7 instance-only, 4 test-isolation, as the review assigned.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed. Evidence: the `git grep` in `plan.md` affected surfaces, run before the edits, listed only the sites changed here.
- [x] CHK-FIX-003 [P0] Consumer inventory completed. Evidence: `plan.md` affected-surfaces table, including the two readers that stay unchanged.
- [x] CHK-FIX-004 [P0] N/A: no security, path, parser or redaction logic changed. The new case only runs an existing tool on a temp folder.
- [x] CHK-FIX-005 [P1] Matrix axes listed: setting state by process for the two forwarded keys, four rows, covered by the new set case and the existing filter case.
- [x] CHK-FIX-006 [P1] Hostile env variant executed: the new contract case removes every location variable from the child env before it runs.
- [x] CHK-FIX-007 [P1] Evidence is pinned to the worktree base `e3ca4c96645` plus this packet's commit.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: the new case's only env values are temp paths and a closed local port.
- [x] CHK-031 [P0] Input validation: N/A, no new input surface.
- [x] CHK-032 [P1] Auth: N/A, no auth surface touched.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks name the same files. Evidence: `spec.md` section 3 and tasks T004 to T014.
- [x] CHK-041 [P1] Code comments adequate. Evidence: CHK-013.
- [x] CHK-042 [P2] README updated: the routing-accuracy README no longer lists the deleted script.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in the session scratchpad only, never in the repository.
- [x] CHK-051 [P1] The contract case removes its temp folder in `finally`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-22
<!-- /ANCHOR:summary -->

---
