---
title: "Tasks: Phase 13: conformance-stamp-pin"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "conformance stamp pin tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 13: conformance-stamp-pin

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

**Task variables**: `RL` is `.skilled/hooks/session-relaunch`. `PHASE` is this phase folder. `FIX` is the commit that lands this phase. `CASE` is the command `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test --test-name-pattern='no process below the loop' .skilled/hooks/session-relaunch/tests/adapter-conformance.test.cjs`.

**Test environment**: run the suites as `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test <file>`, because a dispatched child marker and an inherited OpenCode database path both change how the relaunch tests behave.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Take the suite baseline before any edit (`RL/tests`). Verify: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0, and its `tests` and `pass` lines are saved in `PHASE/scratch/baseline.txt`. Result: `scratch/baseline.txt` records the known 2026-11-14 run at `94e83013fa`, tests 1550, pass 1550, fail 0, exit 0. The suite was not rerun for this task.
- [x] T002 List the runtimes that run the case and confirm the adapter reaches the check (`RL/tests/adapter-conformance.test.cjs`). Verify: `CASE` exits 0 and prints one `✔` line per runtime, saved in `PHASE/scratch/cases.txt`, and `rg -c '\}, adapter\);' .skilled/hooks/session-relaunch/tests/adapter-conformance.test.cjs` prints 1 or more. Result: `scratch/cases.txt` prints the claude and codex cases, tests 2, pass 2, fail 0, exit 0. The adapter count prints 1.
- [x] T003 Show the hole: remove the `markParked` call at line 183 (`c69f278cfc`) in the working tree and run the case under the old helper (`RL/claude/stop-arm.mjs`). Verify: `CASE` still exits 0 with `fail 0`, saved in `PHASE/scratch/hole.txt`. Result: `scratch/hole.txt` prints both cases passing with fail 0 and exit 0, so the old helper hides the missing stamp.
- [x] T004 Put the stamp call back (`RL/claude/stop-arm.mjs`). Verify: `git diff --quiet HEAD -- .skilled/hooks/session-relaunch/claude/stop-arm.mjs` exits 0. Result: the call is back and the diff check exits 0.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Mark on the Claude entry of the adapter table that its Stop stamps a record it could not arm (`RL/tests/adapter-conformance.test.cjs`). Verify: `sed -n '182,220p' .skilled/hooks/session-relaunch/tests/adapter-conformance.test.cjs` shows the mark on the Claude entry and `sed -n '220,290p'` of the same file shows none. Result: `stampsDeferred: true` sits beside `killerTarget: '60'` on the Claude entry at line 203, and the 220 to 290 range shows no mark.
- [x] T006 Make `assertStillPending` read the mark: a parseable `deferredAt` for a runtime that stamps, no `deferredAt` key for one that does not, and the rest equal to the record before (`RL/tests/adapter-conformance.test.cjs`). Verify: `CASE` exits 0 with `fail 0`, and `rg -c 'deferredAt' .skilled/hooks/session-relaunch/tests/adapter-conformance.test.cjs` prints more than 1. Result: the helper reads `adapter.stampsDeferred`. `CASE` exits 0 with fail 0, and the search prints 5.
- [x] T007 Rewrite the comment above the helper to say which runtime stamps and why the other does not yet (`RL/tests/adapter-conformance.test.cjs`). Verify: `rg -c 'the stamp is set aside' .skilled/hooks/session-relaunch/tests/adapter-conformance.test.cjs` prints nothing with exit 1, and the new comment names no packet, phase or task number. Result: the search exits 1 with no output. The new comment names Claude and Codex and no packet, phase or task number.
- [x] T008 Save the Claude red run: remove the `markParked` call at line 183 (`c69f278cfc`) in the working tree and run the case (`RL/claude/stop-arm.mjs`). Verify: `CASE` exits 1, and `PHASE/scratch/red-claude.txt` prints `✖ claude: an arm leaves the record pending when no process below the loop is found`. Result: `scratch/red-claude.txt` exits 1 and prints the `✖ claude` line with `AssertionError: a stamping runtime writes a string stamp`. The first failing run is also saved as `scratch/red.txt`.
- [x] T009 Put the stamp call back (`RL/claude/stop-arm.mjs`). Verify: `git diff --quiet HEAD -- .skilled/hooks/session-relaunch/claude/stop-arm.mjs` exits 0. Result: the call is back and the diff check exits 0.
- [x] T016 Save the unmarked red run: take the mark off the Claude entry in the working tree and run the case, then put the mark back (`RL/tests/adapter-conformance.test.cjs`). Verify: with the mark off `CASE` exits 1 and `PHASE/scratch/red-unmarked.txt` prints `✖ claude: an arm leaves the record pending when no process below the loop is found`, and with the mark back `CASE` exits 0 with `fail 0`. Task ids are stable, so this task carries the next free id and runs here, after T009. Result: `scratch/red-unmarked.txt` exits 1 and prints the `✖ claude` line with `AssertionError: a runtime that does not stamp adds no deferredAt key`. With the mark back `scratch/t016-restored.txt` exits 0 with fail 0.
- [x] T010 Save the Codex red run: set the mark on the Codex entry in the working tree and run the case (`RL/tests/adapter-conformance.test.cjs`). Verify: `CASE` exits 1, and `PHASE/scratch/red-codex.txt` prints `✖ codex: an arm leaves the record pending when no process below the loop is found`. Result: `scratch/red-codex.txt` exits 1 and prints the `✖ codex` line with `AssertionError: a stamping runtime writes a string stamp`.
- [x] T011 Take the mark off the Codex entry again (`RL/tests/adapter-conformance.test.cjs`). Verify: `CASE` exits 0 with `fail 0`, saved in `PHASE/scratch/green.txt`. Result: `scratch/green.txt` prints `✔` for both cases, tests 2, pass 2, fail 0, exit 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Check that no source file is left changed (`RL`). Verify: `git diff --quiet HEAD -- .skilled/hooks/session-relaunch/claude .skilled/hooks/session-relaunch/codex .skilled/hooks/session-relaunch/lib` exits 0. Result: the diff exits 0 and `git status` lists only `adapter-conformance.test.cjs` under the test and source paths.
- [x] T013 Run the relaunch and OpenCode plugin suites (`RL/tests` and `.opencode/plugins/tests`). Verify: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with `fail 0` and the `tests` count of `PHASE/scratch/baseline.txt`. Result: `scratch/suite.txt` prints tests 1550, pass 1550, fail 0, exit 0, the baseline count. The command ran with `AI_SESSION_CHILD` and `OPENCODE_DB` unset.
- [x] T014 Check the test file parses and the fix changes one file (`FIX`). Verify: `node --check .skilled/hooks/session-relaunch/tests/adapter-conformance.test.cjs` exits 0, and `git show --stat FIX` lists one file. Result: `node --check` exits 0. Commit `c69f278cfc` (`Commit-Id` 0013980) changes one file, and the orchestrator's own suite run gave 1550 of 1550, exit 0.
- [x] T015 Validate the phase folder (`PHASE`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/013-conformance-stamp-pin --strict` prints `RESULT: PASSED`. Result: after `repair-derived.cjs --apply` the run printed `Summary: Errors: 0  Warnings: 0` and `RESULT: PASSED` with exit 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: `scratch/hole.txt` shows the hole, `scratch/red-claude.txt`, `scratch/red-codex.txt` and `scratch/red-unmarked.txt` each show one failing case, and `scratch/green.txt` shows none
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **The stamp this pins**: `../005-parked-record-escape/`
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

A blocked task is marked `[B]` with its reason in `goal.md`. A `[B]` on T004 or T009 blocks every later task, because a source file would still carry a proof mutation.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md: `rg -c '^\| REQ-' spec.md` prints 5
- [x] CHK-002 [P0] Technical approach defined in plan.md: `rg -c '^## 3. ARCHITECTURE' plan.md` prints 1
- [x] CHK-003 [P1] The hole is shown before the helper changes (T003)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `node --check` exits 0 on the changed test file (T014)
- [x] CHK-011 [P0] The helper still compares every other field with the record before and still asserts no killer was spawned
- [x] CHK-012 [P1] The stamp is asserted with `Date.parse` and never against a fixed time
- [x] CHK-013 [P1] The mark lives in the adapter table beside `killerTarget`, and the helper holds no runtime name
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] AC-001 and AC-002 pass with their commands
- [x] CHK-021 [P0] Each branch of the assertion has a saved red run from a reverted mutation: a stamp expected and none found (`scratch/red-claude.txt`, `scratch/red-codex.txt`), and no stamp expected and one found (`scratch/red-unmarked.txt`)
- [x] CHK-022 [P1] The case passes for every runtime that runs it once all three mutations are reverted (`scratch/green.txt`)
- [x] CHK-023 [P1] The three Claude stamp tests in `claude-adapters.test.cjs` are unchanged: `git show --stat` of the fix commit does not list the file. Observed in the tree: `git status` does not list the file. The commit stat is the orchestrator's post-commit step
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] The finding class is `matrix/evidence`: a shared case that asserted nothing about one field.
- [x] CHK-FIX-002 [P0] Same-class producer inventory: `rg -n 'check: assert' .skilled/hooks/session-relaunch/tests/adapter-conformance.test.cjs` prints three lines, and only `assertStillPending` sets a field aside.
- [x] CHK-FIX-003 [P0] Consumer inventory: `rg -n 'assertStillPending' .skilled/hooks/session-relaunch/tests` prints the conformance file only.
- [x] CHK-FIX-004 [P0] N/A: no security, path, parser or redaction fix.
- [x] CHK-FIX-005 [P1] Matrix axes listed in plan.md: the runtime stamps or not, crossed with the record stamped or not, four rows.
- [x] CHK-FIX-006 [P1] The cases run with `AI_SESSION_CHILD` and `OPENCODE_DB` unset.
- [x] CHK-FIX-007 [P1] Evidence is pinned to the fix commit, named in `goal.md` section 4. Deferred: the orchestrator creates the fix commit after this build and records its hash in the goal log.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets: the change reads no credential
- [x] CHK-031 [P0] N/A: a test file takes no outside input
- [x] CHK-032 [P1] N/A: no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` all name `assertStillPending`, the mark in the adapter table and the three mutations
- [x] CHK-041 [P1] The comment above the helper says who stamps and why, with no packet, phase or task number in it (T007)
- [x] CHK-042 [P2] N/A: no README states the conformance case, so none changes
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Test runs live under `scratch/` only
- [x] CHK-051 [P1] No proof mutation and no temporary file is left outside `scratch/` (T012)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13, with CHK-FIX-007 recorded as the orchestrator's post-commit step |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-14.
<!-- /ANCHOR:summary -->

---
