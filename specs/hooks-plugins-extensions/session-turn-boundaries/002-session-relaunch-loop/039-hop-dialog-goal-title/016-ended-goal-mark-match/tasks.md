---
title: "Tasks: Phase 16: ended-goal-mark-match"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "ended goal mark match tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 16: ended-goal-mark-match

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

**Task variables**: `RL` is `.skilled/hooks/session-relaunch`. `PHASE` is this phase folder. `FIX` is the commit that lands this phase. `PATTERN` is `ended-goal mark counts only|session log cannot be read`.

**Test environment**: run the suites as `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test <file>`, because a dispatched child marker and an inherited OpenCode database path both change how the relaunch tests behave.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Take the suite baseline before any edit (`RL/tests`). Verify: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0, and its `tests`, `pass` and `fail` lines and the exit status are saved in `PHASE/scratch/baseline.txt`.
- [ ] T002 Confirm the status-blind match and the two early returns (`RL/lib/relaunch-core.cjs`). Verify: the first command of `spec.md` Measured Behavior prints lines 639, 658 and 673, and `sed -n '661,665p' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` shows the failed-read return.
- [ ] T003 Confirm the goal is resolved before the claimed notes are superseded (`RL/bin/session-relaunch.cjs`). Verify: the second command of `spec.md` Measured Behavior prints line 485 before lines 603 and 637.

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add the test `the ended-goal mark counts only from the note this session claimed last`. It writes two notes with `writeHandoff` under two writer ids, both claimed by `GOAL_SESSION_ID`: an older one with `status: done`, an older `claimed_at` and `goal_ended: true`, and a newer one with `status: claimed` and no mark. With a whole log and no goal entry it expects `{ packet: GOAL_PARENT, reason: '', ended: false }`. It then removes the newer note and expects `ended: true` (`RL/tests/relaunch-core.test.cjs`). Verify: `node --check .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0.
- [ ] T005 Add the test `a goal the sender ended stays ended when the session log cannot be read`. With a marked claimed note it expects `ended: true` for a missing config folder and for a log path that is a directory, and with the mark removed it expects `{ packet: '', reason: '', ended: false }` (`RL/tests/relaunch-core.test.cjs`). Verify: `node --check .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0.
- [ ] T006 Run the red tests before the source edit (`PHASE/scratch/red.txt`). Verify: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test --test-name-pattern='ended-goal mark counts only|session log cannot be read' .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 1 with `tests 2`, `pass 0` and `fail 2`.
- [ ] T007 Keep only the note this session claimed last in `claimedNoteEndedGoal`, ordered by `claimed_at` with a missing value counted as oldest (`RL/lib/relaunch-core.cjs`). Verify: `rg -n 'claimed_at' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` prints a line inside `claimedNoteEndedGoal`.
- [ ] T008 Ask the helper on the missing-log return and the failed-read return of `claudeGoalPacketResult` (`RL/lib/relaunch-core.cjs`). Verify: `rg -c 'claimedNoteEndedGoal\(handoffPath, sessionId\)' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` prints 4, or 3 when one guard serves both returns. Today it prints 2: the definition and one call.
- [ ] T009 Comment why the claimed-last note decides and why an unreadable log keeps the mark (`RL/lib/relaunch-core.cjs`). Verify: `git diff -- .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` shows the comment, and no added line names a packet, phase, task or finding number.
- [ ] T010 Correct the Claude row of the goal table (`RL/README.md`). Verify: `rg -c 'claimed last' .skilled/hooks/session-relaunch/README.md` prints 1 or more, and `rg -c 'With no readable log the goal cannot be proven, so no field is written' .skilled/hooks/session-relaunch/README.md` prints nothing with exit 1.

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Run the two new tests and the two existing ended-goal tests (`RL/tests/relaunch-core.test.cjs`). Verify: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test --test-name-pattern='ended-goal mark counts only|session log cannot be read|stays ended for a receiver that sets none|answers empty when no Claude log' .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0 with `tests 4`, `pass 4` and `fail 0`, saved to `PHASE/scratch/green.txt`.
- [ ] T012 Run the relaunch and OpenCode plugin suites (`RL/tests` and `.opencode/plugins/tests`). Verify: the command of T001 exits 0 with `fail 0` and a `tests` count two above the one in `PHASE/scratch/baseline.txt`, saved to `PHASE/scratch/final-suite.txt`.
- [ ] T013 Check the core parses (`RL/lib/relaunch-core.cjs`). Verify: `node --check .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` exits 0.
- [ ] T014 Check that the fix adds no file, no note field and no record key (`FIX`). Verify: `git show --stat FIX` lists the core, the test file and the README, `git show FIX | rg -c '^new file'` prints nothing with exit 1, and `git show FIX -- .skilled/hooks/session-relaunch/lib | rg -c '^\+.*goal_[a-z_]+:'` prints nothing with exit 1.
- [ ] T015 Validate the phase folder (`PHASE`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/016-ended-goal-mark-match --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed: `scratch/red.txt` shows both new tests failing and `scratch/green.txt` shows 4 of 4
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **The mark this narrows**: `../010-goal-ending-carry/`
- **The limit this leaves open**: `../014-review-wording-fixes/`
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

A blocked task is marked `[B]` with its reason in `goal.md`. A `[B]` on T001 blocks every implementation task, because the count in T012 is read against the baseline.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md: `rg -c '^\| REQ-' spec.md` prints 6.
- [ ] CHK-002 [P0] Technical approach defined in plan.md: `rg -c '^## 3. ARCHITECTURE' plan.md` prints 1.
- [ ] CHK-003 [P1] The baseline count is saved before the first edit (T001).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `node --check` exits 0 on the core and on the test file (T013, T004).
- [ ] CHK-011 [P0] A note that cannot be read or parsed still says nothing about a goal.
- [ ] CHK-012 [P1] The change adds no exported symbol and no helper beside `claimedNoteEndedGoal`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] AC-001 and AC-002 pass with their commands.
- [ ] CHK-021 [P0] Both new tests failed before the edit (`scratch/red.txt`).
- [ ] CHK-022 [P1] The two existing ended-goal tests pass unchanged (`scratch/green.txt`).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [ ] CHK-FIX-001 [P0] The finding class is `instance-only`: `claimedNoteEndedGoal` is the one reader of `goal_ended`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory: `rg -n 'goal_ended' .skilled/hooks/session-relaunch/lib .skilled/hooks/session-relaunch/bin` lists one reader and one writer, and only the reader changes.
- [ ] CHK-FIX-003 [P0] Consumer inventory: `rg -n 'claimedNoteEndedGoal' .skilled .opencode --glob '*.cjs' --glob '*.mjs'` lists the definition and its calls in the core only.
- [ ] CHK-FIX-004 [P0] The invariant holds: the mark comes from at most one note, and an unreadable log never turns a mark into no mark.
- [ ] CHK-FIX-005 [P1] Matrix axes listed in plan.md: log state crossed with claimed notes, with the row each test covers.
- [ ] CHK-FIX-006 [P1] The tests run with `AI_SESSION_CHILD` and `OPENCODE_DB` unset.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to the fix commit, named in `goal.md` section 4.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secrets: the change reads no credential.
- [ ] CHK-031 [P0] The scan stays in the folder of the note being handed over.
- [ ] CHK-032 [P1] N/A: no auth surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` all name the claimed-last rule and the unreadable log.
- [ ] CHK-041 [P1] The changed comment names no packet, phase or task number (T009).
- [ ] CHK-042 [P2] The README Claude row states both rules (T010).
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Test runs live under `scratch/` only.
- [ ] CHK-051 [P1] No temporary file is left outside `scratch/`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 11 | 0/11 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Not yet verified. The build fills this in.
<!-- /ANCHOR:summary -->

---
