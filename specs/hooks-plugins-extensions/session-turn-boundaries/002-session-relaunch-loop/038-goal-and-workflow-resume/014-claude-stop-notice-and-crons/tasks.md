---
title: "Tasks: Phase 14: claude-stop-notice-and-crons"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "claude stop notice and crons tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 14: claude-stop-notice-and-crons

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

**Task variables**: `ADAPTER` is `.skilled/hooks/session-relaunch/claude/stop-arm.mjs`. `TESTS` is `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs`. `PHASE` is this phase folder.

**Test environment**: run the suites as `env -u AI_SESSION_CHILD node --test <file>`, because a dispatched child marker makes the claim cases silent.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Observe live, in a throwaway checkout, whether crons end on a hop (`PHASE/scratch/live-crons.txt`). Start a Claude sender under `skilled-loop`, add a temporary Stop hook that copies its payload to the scratch folder, create one task with `/loop 10m echo ping`, list the scheduled tasks, write a note and run `prepare`, then list the scheduled tasks in the receiver. In the same run the sender writes a two-item todo list before the hop, and the file records under `todo list` whether the receiver still shows it. Verify: `rg -n 'session_crons|sender tasks|receiver tasks' PHASE/scratch/live-crons.txt` prints the saved entry, a sender list with one task and a receiver list with none. A refuted claim stops the build and is logged in `goal.md`.
- [ ] T002 Confirm that a Stop hook's `{"systemMessage": ...}` on stdout with exit 0 is shown to the operator and does not continue the turn (`PHASE/scratch/live-crons.txt`). Use Claude Code's hook documentation or one live Stop in the same checkout. Verify: `rg -n 'systemMessage' PHASE/scratch/live-crons.txt` prints the quoted source or the screen text. A refuted claim stops the build and is logged in `goal.md`.
- [ ] T003 Confirm phase 011 has landed in the adapter (`ADAPTER`). Verify: `git log --oneline -1 -- .skilled/hooks/session-relaunch/claude/stop-arm.mjs` prints a commit from phase 011, and `rg -n 'armed = arm\(' .skilled/hooks/session-relaunch/claude/stop-arm.mjs` prints one line.
- [ ] T004 Record the baseline of the relaunch suite (`.skilled/hooks/session-relaunch/tests`). Verify: `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/*.test.cjs` exits 0 with `fail 0`, and the pass count is written to `goal.md`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Replace the empty-stdout assertion of `stop-arm defers pending state when background tasks exist and logs the reason` with a parse of one JSON line whose `systemMessage` matches `1 background task` and `session-relaunch.cjs cancel` and that has no `decision` key (`TESTS`). Verify: `env -u AI_SESSION_CHILD node --test --test-name-pattern 'stop-arm defers pending state' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits 1 on the stdout assertion, saved to `PHASE/scratch/red.txt`.
- [ ] T006 Add the test `stop-arm logs the cron count of a session whose hop is armable`, which sends two `session_crons` entries and no background tasks and asserts one `session-crons` line with `crons=2` in `relaunch.log` (`TESTS`). Verify: `env -u AI_SESSION_CHILD node --test --test-name-pattern 'stop-arm logs the cron count' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits 1, appended to `PHASE/scratch/red.txt`.
- [ ] T007 Write the deferral notice through a `dependencies.write` seam in the deferral branch, after `markDeferred` and before `return null` (`ADAPTER`). Verify: the T005 command exits 0 with `fail 0`, saved to `PHASE/scratch/green.txt`.
- [ ] T008 Log `session-crons` with `loopId`, `sessionId` and `crons` right after the armable check, only for a non-empty array (`ADAPTER`). Verify: the T006 command exits 0 with `fail 0`, appended to `PHASE/scratch/green.txt`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Run the guard tests named in REQ-005 (`TESTS`). Verify: `env -u AI_SESSION_CHILD node --test --test-name-pattern 'stop-arm arms a matching|stop-arm leaves a pending record alone|stop-arm defers an armed record' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits 0 with `fail 0`.
- [ ] T010 Run the whole relaunch suite (`.skilled/hooks/session-relaunch/tests`). Verify: `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/*.test.cjs` exits 0 with `fail 0` and a pass count of the T004 baseline plus 1.
- [ ] T011 Check the scope of the diff (`ADAPTER`, `TESTS`). Verify: `git diff --name-only` lists only the adapter, the test file and files inside `PHASE`.
- [ ] T012 Validate the phase folder (`PHASE`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/014-claude-stop-notice-and-crons --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed: `scratch/live-crons.txt` holds both live checks
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Research**: `../research/research.md` section 9, ranks 4 and 8, and section 7 item 2
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

A blocked task is marked `[B]` with its reason in `goal.md`, and a `[B]` on T001 or T002 blocks every implementation task.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md: `rg -c '^\| REQ-' spec.md` prints 5
- [ ] CHK-002 [P0] Technical approach defined in plan.md, with decision D2 on the cron list
- [ ] CHK-003 [P1] Phase 011 merged and both live checks recorded in `scratch/live-crons.txt`
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `node --check .skilled/hooks/session-relaunch/claude/stop-arm.mjs` exits 0
- [ ] CHK-011 [P0] The hook exits 0 on every path, asserted by the deferral and arm tests
- [ ] CHK-012 [P1] A failed stdout write or log append is caught and never changes the exit code
- [ ] CHK-013 [P1] The new code uses `logEvent` and the existing section layout of the adapter
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] AC-003 and AC-004 pass with their commands
- [ ] CHK-021 [P0] AC-001 and AC-002 hold their live evidence
- [ ] CHK-022 [P1] An empty `session_crons` writes no line, covered by the arm test that sends the fixture's empty array
- [ ] CHK-023 [P1] A non-array `session_crons` writes no line
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [ ] CHK-FIX-001 [P0] Each finding has a class: both are `instance-only`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory: `rg -n 'session_crons|systemMessage' .skilled/hooks/session-relaunch` printed only the fixture line before the edit.
- [ ] CHK-FIX-003 [P0] Consumer inventory: `rg -n 'armPendingRecord' .skilled/hooks/session-relaunch` lists the adapter, `claude-adapters.test.cjs` and `adapter-conformance.test.cjs`.
- [ ] CHK-FIX-004 [P0] N/A: no security, path, parser or redaction fix.
- [ ] CHK-FIX-005 [P1] Matrix axes listed in plan.md: record state, task count and cron field.
- [ ] CHK-FIX-006 [P1] The suite runs with `AI_SESSION_CHILD` unset.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to the fix commit sha in `goal.md`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secrets: the change reads no credential
- [ ] CHK-031 [P0] The notice prints a count and a fixed command, never payload text
- [ ] CHK-032 [P1] N/A: no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` all name `session-crons` and the `cancel` command
- [ ] CHK-041 [P1] The new branch carries a comment on why the notice is a `systemMessage` and never a `decision`
- [ ] CHK-042 [P2] N/A here: the README paragraph is phase 017's
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Live evidence and test runs live under `scratch/` only
- [ ] CHK-051 [P1] The temporary Stop hook lives only in the throwaway checkout and is gone from this repository
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Pending
<!-- /ANCHOR:summary -->

---
