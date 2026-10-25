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

- [ ] T001 Confirm phases 002 and 004 are Complete (`../002-consume-locked-withdraw/`, `../004-manual-claim-goal-binding/`)
- [ ] T002 Run both test commands from `plan.md` section 5 and record the baseline counts
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 [P] Add coverage test "OpenCode 2 equals-form server warns and keeps the launch", asserting the warning and launch arguments equal to `['--server=http://localhost:4096']` with no `--standalone`; it passes on current code (`.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs`)
- [ ] T004 [P] Add coverage test "missing runtime binary exits 127" with a PATH the test builds (a directory linking `node`, plus `/usr/bin:/bin`), asserting first that the runtime does not resolve on it; it passes on current code (`.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs`)
- [ ] T005 [P] Add coverage test "two concurrent claims have one winner": two child processes behind a start barrier, one winner, the other refused with the `cannot claim handoff with status` prefix, and `claimed_by` naming the winner; note the 2000 ms lock-bypass flake risk in the test; it passes on current code (`.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs`)
- [ ] T006 Run T005 once by hand with the lock removed from `claimHandoff`, record whether it fails, and restore the lock
- [ ] T007 [P] Add failing-first test "a reused note with the goal switch off hands on no packet": prepare with `SESSION_RELAUNCH_GOAL=0`, then consume with the switch off and again with it on, neither reporting `goal_packet` (`.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs`)
- [ ] T008 Run T007 against current code and record that the on-at-consume run fails
- [ ] T009 Record the goal-switch state on the relaunch record in `preparePending` and pass it from the CLI prepare (`.skilled/hooks/session-relaunch/lib/relaunch-core.cjs`, `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs`)
- [ ] T010 Make the moved `usableGoalPacket` take the recorded state, blocking the packet only on a recorded `false`, and pass the record's state from consume; leave `claim` reading the switch at claim time (`.skilled/hooks/session-relaunch/lib/relaunch-core.cjs`, `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Rerun both test commands and report the delta against the T002 baseline; confirm T007 and the existing consume test at `session-relaunch-cli.test.cjs:2496-2516` pass
- [ ] T012 Fill evidence in `acceptance-criteria.md`, and record in `implementation-summary.md` the T006 result, the T008 failure and the fix
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Both test commands pass with no regression against the baseline
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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks
- [ ] CHK-011 [P0] No console errors or warnings
- [ ] CHK-012 [P1] Error handling implemented
- [ ] CHK-013 [P1] Code follows project patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Manual testing complete
- [ ] CHK-022 [P1] Edge cases tested
- [ ] CHK-023 [P1] Error scenarios validated
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Input validation implemented
- [ ] CHK-032 [P1] Auth/authz working correctly
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Code comments adequate
- [ ] CHK-042 [P2] README updated (if applicable)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | [X] | [ ]/[X] |
| P1 Items | [Y] | [ ]/[Y] |
| P2 Items | [Z] | [ ]/[Z] |

**Verification Date**: 2026-10-25
<!-- /ANCHOR:summary -->

---



