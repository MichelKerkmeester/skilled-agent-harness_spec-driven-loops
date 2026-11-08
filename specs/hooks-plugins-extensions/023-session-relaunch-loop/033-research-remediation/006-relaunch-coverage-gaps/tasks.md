---
title: "Tasks: Phase 6: relaunch-coverage-gaps"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "relaunch coverage gaps tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 6: relaunch-coverage-gaps

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

- [x] T001 Confirm phases 002 and 004 are Complete (`../002-consume-locked-withdraw/`, `../004-manual-claim-goal-binding/`) - both specs Status Complete, both acceptance criteria Closeable: Yes
- [x] T002 Run both test commands from `plan.md` section 5 and record the baseline counts - 915 pass, 0 fail (`scratch/baseline-node.txt`); vitest 59 pass (`scratch/baseline-vitest.txt`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [P] Add coverage test "OpenCode 2 equals-form server warns and keeps the launch", asserting the warning and launch arguments equal to `['--server=http://localhost:4096']` with no `--standalone`; it passes on current code (`.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs`)
- [x] T004 [P] Add coverage test "missing runtime binary exits 127" with a PATH the test builds (a directory linking `node`, plus `/usr/bin:/bin`), asserting first that the runtime does not resolve on it; it passes on current code (`.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs`)
- [x] T005 [P] Add coverage test "two concurrent claims have one winner": two child processes behind a start barrier, one winner, the other refused with the `cannot claim handoff with status` prefix, and `claimed_by` naming the winner; note the 2000 ms lock-bypass flake risk in the test; it passes on current code (`.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs`)
- [x] T006 Run T005 once by hand with the lock removed from `claimHandoff`, record whether it fails, and restore the lock - failed 10 of 10 with two winners on a scratchpad copy; the live file was never edited (`scratch/lock-removed-variant.txt`)
- [x] T007 [P] Add failing-first test "a reused note with the goal switch off hands on no packet": prepare with `SESSION_RELAUNCH_GOAL=0`, then consume with the switch off and again with it on, neither reporting `goal_packet` (`.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs`)
- [x] T008 Run T007 against current code and record that the on-at-consume run fails - on-at-consume assertion failed with `goal_packet` present (`scratch/red-before-reused-note.txt`)
- [x] T009 Record the goal-switch state on the relaunch record in `preparePending` and pass it from the CLI prepare (`.skilled/hooks/session-relaunch/lib/relaunch-core.cjs`, `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs`)
- [x] T010 Make the moved `usableGoalPacket` take the recorded state, blocking the packet only on a recorded `false`, and pass the record's state from consume; leave `claim` reading the switch at claim time (`.skilled/hooks/session-relaunch/lib/relaunch-core.cjs`, `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Rerun both test commands and report the delta against the T002 baseline; confirm T007 and the existing consume test at `session-relaunch-cli.test.cjs:2496-2516` pass - 924 pass, 0 fail, exit 0; vitest 59 pass; +9 tests, 4 from this phase and 5 manual-command tests from the phase 003 builder
- [x] T012 Fill evidence in `acceptance-criteria.md`, and record in `implementation-summary.md` the T006 result, the T008 failure and the fix
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Both test commands pass with no regression against the baseline
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

- [x] CHK-010 [P0] Code passes lint/format checks
- [x] CHK-011 [P0] No console errors or warnings
- [x] CHK-012 [P1] Error handling implemented
- [x] CHK-013 [P1] Code follows project patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Manual testing complete - none required; the plan names no live proof, only the T006 hand run
- [x] CHK-022 [P1] Edge cases tested
- [x] CHK-023 [P1] Error scenarios validated
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. Reused note: `cross-consumer` (prepare writes, consume reads); the three gaps: `matrix/evidence`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. `rg goal_packet`: producers are `recordGoalPacket` (prepare and keep); `keep` writes no relaunch record, so only consume and claim read the packet.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. `usableGoalPacket`: CLI consume (passes the record state), CLI claim and `skilled-loop:321` (pass none, unchanged); `preparePending`: one production caller, the CLI prepare; the field survives arm, which spreads the record.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. Not applicable: no security, path, parser or redaction fix.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Recorded switch (off, on, absent) by switch at consume (off, on): six rows; the new test covers recorded-off by both, the existing consume test covers absent by both; recorded-on rows follow the switch at consume, as absent does.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. The new test runs the switch both ways at consume over one recorded-off record.
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. Uncommitted working-tree diff against HEAD `65f37f5d70`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation implemented
- [x] CHK-032 [P1] Auth/authz working correctly - not applicable, no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate
- [x] CHK-042 [P2] README updated (if applicable) - out of scope; drift noted in implementation-summary.md
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] scratch/ cleaned before completion - scratch holds only the evidence logs the criteria cite
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-25
<!-- /ANCHOR:summary -->

---



