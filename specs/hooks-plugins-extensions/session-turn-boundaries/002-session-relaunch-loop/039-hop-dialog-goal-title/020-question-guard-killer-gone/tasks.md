---
title: "Tasks: Phase 20: question-guard-killer-gone"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "question guard killer gone tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 20: question-guard-killer-gone

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

**Task variables**: `RL` is `.skilled/hooks/session-relaunch`. `PHASE` is this phase folder. `FIX` is the commit that lands this phase.

**Test environment**: run every suite as `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test <file>`, because a dispatched child marker and an inherited OpenCode database path both change how the relaunch tests behave.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Take the suite baseline before any edit (`RL/tests`). Verify: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0, and its `tests`, `pass` and `fail` lines and the exit status are saved in `PHASE/scratch/baseline.txt`. Result: the orchestrator's baseline is saved at scratch/baseline.txt, tests 1553, pass 1553, fail 0, exit 0. It was not rerun for this task.
- [x] T002 Confirm the guard's one accepted reason and the core's two armable reasons (`RL/claude/subagent-guard.mjs`, `RL/lib/relaunch-core.cjs`). Verify: the first two commands of `spec.md` Measured Behavior print `84:verdict.reason === 'pending'`, `1180:armable: true, reason: 'pending'` and `1183:armable: true, reason: 'killer-gone'`, each exit 0. Result: printed 84:verdict.reason === 'pending', 1180:armable: true, reason: 'pending' and 1183:armable: true, reason: 'killer-gone', each exit 0.
- [x] T003 Confirm a spawn failure leaves the record armed and that the armed-record test passes today (`RL/tests/claude-adapters.test.cjs`, `RL/tests/subagent-guard.test.cjs`). Verify: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test --test-name-pattern='async killer spawn error|once the record is armed' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs .skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs` exits 0 with `fail 0`, saved to `PHASE/scratch/current.txt`. Result: saved to scratch/current.txt with tests 2, pass 2, fail 0, exit 0.

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Split `subagent-guard lets a question dialog through once the record is armed` into `subagent-guard denies a question dialog over an armed record whose killer is gone` and `subagent-guard lets a question dialog through over an armed record with a live killer` (`RL/tests/subagent-guard.test.cjs`). The denial test arms the record and writes no lock. The control writes `${process.pid} ${new Date().toISOString()}\n` to `path.join(core.stateDir(sandbox.env), `killer-${LOOP_ID}.lock`)` after `core.arm` returns. Verify: `node --check .skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs` exits 0. Result: node --check exited 0. The split tests are at tests/subagent-guard.test.cjs:313 and :324.
- [x] T005 Add `subagent-guard lets a question dialog through when the record read throws` beside the split tests (`RL/tests/subagent-guard.test.cjs`). The test prepares a pending record, calls `fs.chmodSync(core.relaunchFilePath(LOOP_ID, sandbox.env), 0o000)` and runs the guard, then restores mode `0o600` in `t.after`. Verify: `node --check .skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs` exits 0. Result: node --check exited 0. The test is at tests/subagent-guard.test.cjs:335 and it passed in both the red and the green run, as an evidence test should.
- [x] T006 Run the two new tests before the source edit (`PHASE/scratch/red.txt`). Verify: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test --test-name-pattern='killer is gone|record read throws' .skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs` exits 1 with `fail 1`, because the killer-gone test receives no denial. The throwing-read test passes in the same run. Result: scratch/red.txt shows tests 2, pass 1, fail 1, exit 1. The killer-gone denial prints a cross mark, the throwing-read test prints a tick, and the assertion is the empty stdout.
- [x] T007 Return the record for any armable verdict (`RL/claude/subagent-guard.mjs`). Verify: `rg -n 'verdict.armable' .skilled/hooks/session-relaunch/claude/subagent-guard.mjs` prints 1 and `rg -c "verdict.reason === 'pending'" .skilled/hooks/session-relaunch/claude/subagent-guard.mjs` prints nothing with exit 1. Result: rg -n 'verdict.armable' printed 1 at claude/subagent-guard.mjs:85, and the removed condition printed nothing with exit 1.
- [x] T008 Correct the comment above `pendingHandOver` so it says a live killer ends the idle session and every record that can still be armed is held (`RL/claude/subagent-guard.mjs`). Verify: `git diff -- .skilled/hooks/session-relaunch/claude/subagent-guard.mjs` shows the comment, and no added line names a packet, phase, task or finding number. Result: git diff shows the corrected comment, and no added line names a packet, phase, task or finding number.
- [x] T009 State the rule in the `subagent-guard.mjs` row (`RL/claude/README.md`). Verify: `rg -c 'live killer' .skilled/hooks/session-relaunch/claude/README.md` prints 1 or more, and the row says an armed record with no live killer is denied. Result: rg -c 'live killer' printed 1, and the row says an armed record with no live killer is denied.

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run the changed tests (`RL/tests/subagent-guard.test.cjs`). Verify: the command of T006 exits 0 with `fail 0`, saved to `PHASE/scratch/green.txt`, and the live-killer control passes in `PHASE/scratch/control.txt`. Result: scratch/green.txt shows tests 2, pass 2, fail 0, exit 0. scratch/control.txt shows the live-killer control passing with tests 1, pass 1, fail 0, exit 0.
- [x] T011 Run the guard suite (`RL/tests/subagent-guard.test.cjs`). Verify: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs` exits 0 with `fail 0`, saved to `PHASE/scratch/guard-suite.txt`. Result: scratch/guard-suite.txt shows tests 23, pass 23, fail 0, exit 0.
- [x] T012 Run the Claude adapter and conformance suites (`RL/tests`). Verify: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs .skilled/hooks/session-relaunch/tests/adapter-conformance.test.cjs` exits 0 with `fail 0`, saved to `PHASE/scratch/claude-conformance.txt`. Result: scratch/claude-conformance.txt shows tests 115, pass 115, fail 0, exit 0.
- [x] T013 Run the relaunch and OpenCode plugin suites (`RL/tests` and `.opencode/plugins/tests`). Verify: the command of T001 exits 0 with `fail 0` and two more tests than `PHASE/scratch/baseline.txt`, saved to `PHASE/scratch/final-suite.txt`. Result: scratch/final-suite.txt shows tests 1555, pass 1555, fail 0, exit 0, two above the 1553 baseline.
- [x] T014 Check that the fix adds no file, no record key and no log event (`FIX`). Verify: `git show --diff-filter=A --name-only FIX | rg -v '020-question-guard-killer-gone/'` prints nothing with exit 1, and `git show FIX -- .skilled/hooks/session-relaunch | rg -c "^\+.*logEvent\('"` prints nothing with exit 1. Result: run on the working tree, because the fix commit is the orchestrator's to make. `git ls-files --others` lists only files in this child, and the added logEvent count in `git diff` printed nothing with exit 1. The commit-scoped form runs after the commit.
- [x] T015 Validate the phase folder (`PHASE`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/020-question-guard-killer-gone --strict` prints `RESULT: PASSED`. Result: RESULT: PASSED with Errors 0 and Warnings 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Every task is resolved: T001 to T015 are complete, and T014 ran against the fix commit. Result: T014 ran on the working tree, and its commit-scoped form waits for the fix commit the orchestrator makes.
- [x] No `[B]` blocked tasks remaining: no task is blocked. Result: none is marked `[B]`.
- [x] Manual verification passed: `scratch/red.txt` shows the killer-gone denial failing, `scratch/green.txt` shows it passing and `scratch/control.txt` shows the live-killer control passing. Result: all three files are saved and read.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **The verdict this guard reads**: `../005-parked-record-escape/`
- **The notice on the Stop that leaves the record armed**: `../017-missing-transcript-notice/`
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

A blocked task is marked `[B]` with its reason in `goal.md`. A `[B]` on T001 blocks every implementation task, because the count in T013 is read against the baseline.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md: `rg -c '^\| REQ-' spec.md` prints 6. Result: rg -c printed 6.
- [x] CHK-002 [P0] Technical approach defined in plan.md: `rg -c '^## 3. ARCHITECTURE' plan.md` prints 1. Result: rg -c printed 1.
- [x] CHK-003 [P1] The baseline count is saved before the first edit (T001). Result: scratch/baseline.txt holds the 1553 count taken before the first edit.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `node --check` exits 0 on the adapter and the test file (T004, T005, T007). Result: node --check exited 0 on claude/subagent-guard.mjs and on tests/subagent-guard.test.cjs.
- [x] CHK-011 [P0] The guard exits 0 on every path, including a record read that throws. The new test proves the throwing path. Result: the guard catches the read at claude/subagent-guard.mjs:75 to :77 and the new throwing-read test passes in scratch/guard-suite.txt.
- [x] CHK-012 [P1] The condition reads `verdict.armable` and adds no helper function. Result: claude/subagent-guard.mjs:85 reads verdict.armable and no helper was added.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] AC-001 and AC-002 pass with their commands. `scratch/red.txt` shows the denial failing before the edit and `scratch/green.txt` shows it passing after, and `scratch/control.txt` shows the live-killer control passing. Result: AC-001 to AC-005 are Met in acceptance-criteria.md from scratch/red.txt, scratch/green.txt, scratch/control.txt and scratch/guard-suite.txt.
- [x] CHK-021 [P0] The killer-gone denial failed before the source edit (`scratch/red.txt`). Result: scratch/red.txt shows the killer-gone denial failing before the source edit.
- [x] CHK-022 [P1] The pending-record denial and the five existing pass-through tests still pass in `scratch/guard-suite.txt`. Result: scratch/guard-suite.txt prints the pending denial and the pass-through tests with fail 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] The finding class is `class-of-bug`: every guarded dialog state is checked against the one verdict the core owns. Result: the guard now acts on the one verdict armableRecord owns, for both armable reasons and the live-killer refusal.
- [x] CHK-FIX-002 [P0] Same-class producer inventory: `rg -n "verdict.reason === 'pending'" .skilled` prints one line, the condition this phase changes. Result: rg -n "verdict.reason === 'pending'" .skilled prints nothing with exit 1 after the edit, because the one producer was the condition changed here.
- [x] CHK-FIX-003 [P0] Consumer inventory: `pendingHandOver` has one caller, `main` at `claude/subagent-guard.mjs:117`, and `armableRecord` does not change. Result: rg -n pendingHandOver prints the definition at :66 and one caller at :118. armableRecord and relaunch-core.cjs are unchanged in git status.
- [x] CHK-FIX-004 [P0] The denial text is unchanged, and no payload field reaches it. Result: git diff shows no change to questionDenialReason, which names record.handoff and record.loopId only.
- [x] CHK-FIX-005 [P1] Matrix axes listed in plan.md: record state crossed with stdout. All rows are named. Result: every row of the plan matrix has a test in scratch/guard-suite.txt or scratch/control.txt.
- [x] CHK-FIX-006 [P1] The tests run with `AI_SESSION_CHILD` and `OPENCODE_DB` unset. Every saved command line begins `env -u AI_SESSION_CHILD -u OPENCODE_DB`. Result: the seven run files saved here begin with `env -u AI_SESSION_CHILD -u OPENCODE_DB`. The baseline file was saved by the orchestrator with its output only.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to the fix commit, named in `goal.md` section 4.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets: the change reads no credential. Result: the change reads no credential.
- [x] CHK-031 [P0] No payload text reaches the denial, which holds the record's note path and loop id only. Result: the denial text is unchanged and holds the note path and loop id only.
- [x] CHK-032 [P1] N/A: no auth surface. Result: not applicable, the guard has no auth surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` all name the armable rule and the live-killer exception. Result: spec.md, plan.md and tasks.md already name the armable rule and the live-killer exception.
- [x] CHK-041 [P1] The changed comment names no packet, phase or task number (T008). Result: the changed comment names no number.
- [x] CHK-042 [P2] The Claude adapter README names the rule (T009). Result: rg -c 'live killer' printed 1 in claude/README.md.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Test runs live under `scratch/` only. Result: every saved run lives under scratch/.
- [x] CHK-051 [P1] No temporary file is left outside `scratch/`. Result: no temporary file is left outside scratch/, and this recorder is deleted after it runs.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 11 | 10/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-14. Every row above cites the scratch file that holds its run. CHK-FIX-007 stays open until the fix commit exists.
<!-- /ANCHOR:summary -->

---
