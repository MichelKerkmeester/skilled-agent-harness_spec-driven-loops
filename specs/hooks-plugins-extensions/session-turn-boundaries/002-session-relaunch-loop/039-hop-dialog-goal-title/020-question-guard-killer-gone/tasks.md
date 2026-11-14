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

- [ ] T001 Take the suite baseline before any edit (`RL/tests`). Verify: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0, and its `tests`, `pass` and `fail` lines and the exit status are saved in `PHASE/scratch/baseline.txt`.
- [ ] T002 Confirm the guard's one accepted reason and the core's two armable reasons (`RL/claude/subagent-guard.mjs`, `RL/lib/relaunch-core.cjs`). Verify: the first two commands of `spec.md` Measured Behavior print `84:verdict.reason === 'pending'`, `1180:armable: true, reason: 'pending'` and `1183:armable: true, reason: 'killer-gone'`, each exit 0.
- [ ] T003 Confirm a spawn failure leaves the record armed and that the armed-record test passes today (`RL/tests/claude-adapters.test.cjs`, `RL/tests/subagent-guard.test.cjs`). Verify: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test --test-name-pattern='async killer spawn error|once the record is armed' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs .skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs` exits 0 with `fail 0`, saved to `PHASE/scratch/current.txt`.

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Split `subagent-guard lets a question dialog through once the record is armed` into `subagent-guard denies a question dialog over an armed record whose killer is gone` and `subagent-guard lets a question dialog through over an armed record with a live killer` (`RL/tests/subagent-guard.test.cjs`). The denial test arms the record and writes no lock. The control writes `${process.pid} ${new Date().toISOString()}\n` to `path.join(core.stateDir(sandbox.env), `killer-${LOOP_ID}.lock`)` after `core.arm` returns. Verify: `node --check .skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs` exits 0.
- [ ] T005 Add `subagent-guard lets a question dialog through when the record read throws` beside the split tests (`RL/tests/subagent-guard.test.cjs`). The test prepares a pending record, calls `fs.chmodSync(core.relaunchFilePath(LOOP_ID, sandbox.env), 0o000)` and runs the guard, then restores mode `0o600` in `t.after`. Verify: `node --check .skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs` exits 0.
- [ ] T006 Run the two new tests before the source edit (`PHASE/scratch/red.txt`). Verify: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test --test-name-pattern='killer is gone|record read throws' .skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs` exits 1 with `fail 1`, because the killer-gone test receives no denial. The throwing-read test passes in the same run.
- [ ] T007 Return the record for any armable verdict (`RL/claude/subagent-guard.mjs`). Verify: `rg -n 'verdict.armable' .skilled/hooks/session-relaunch/claude/subagent-guard.mjs` prints 1 and `rg -c "verdict.reason === 'pending'" .skilled/hooks/session-relaunch/claude/subagent-guard.mjs` prints nothing with exit 1.
- [ ] T008 Correct the comment above `pendingHandOver` so it says a live killer ends the idle session and every record that can still be armed is held (`RL/claude/subagent-guard.mjs`). Verify: `git diff -- .skilled/hooks/session-relaunch/claude/subagent-guard.mjs` shows the comment, and no added line names a packet, phase, task or finding number.
- [ ] T009 State the rule in the `subagent-guard.mjs` row (`RL/claude/README.md`). Verify: `rg -c 'live killer' .skilled/hooks/session-relaunch/claude/README.md` prints 1 or more, and the row says an armed record with no live killer is denied.

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Run the changed tests (`RL/tests/subagent-guard.test.cjs`). Verify: the command of T006 exits 0 with `fail 0`, saved to `PHASE/scratch/green.txt`, and the live-killer control passes in `PHASE/scratch/control.txt`.
- [ ] T011 Run the guard suite (`RL/tests/subagent-guard.test.cjs`). Verify: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs` exits 0 with `fail 0`, saved to `PHASE/scratch/guard-suite.txt`.
- [ ] T012 Run the Claude adapter and conformance suites (`RL/tests`). Verify: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs .skilled/hooks/session-relaunch/tests/adapter-conformance.test.cjs` exits 0 with `fail 0`, saved to `PHASE/scratch/claude-conformance.txt`.
- [ ] T013 Run the relaunch and OpenCode plugin suites (`RL/tests` and `.opencode/plugins/tests`). Verify: the command of T001 exits 0 with `fail 0` and two more tests than `PHASE/scratch/baseline.txt`, saved to `PHASE/scratch/final-suite.txt`.
- [ ] T014 Check that the fix adds no file, no record key and no log event (`FIX`). Verify: `git show --diff-filter=A --name-only FIX | rg -v '020-question-guard-killer-gone/'` prints nothing with exit 1, and `git show FIX -- .skilled/hooks/session-relaunch | rg -c "^\+.*logEvent\('"` prints nothing with exit 1.
- [ ] T015 Validate the phase folder (`PHASE`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/020-question-guard-killer-gone --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] Every task is resolved: T001 to T015 are complete, and T014 ran against the fix commit.
- [ ] No `[B]` blocked tasks remaining: no task is blocked.
- [ ] Manual verification passed: `scratch/red.txt` shows the killer-gone denial failing, `scratch/green.txt` shows it passing and `scratch/control.txt` shows the live-killer control passing.
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

- [ ] CHK-001 [P0] Requirements documented in spec.md: `rg -c '^\| REQ-' spec.md` prints 6.
- [ ] CHK-002 [P0] Technical approach defined in plan.md: `rg -c '^## 3. ARCHITECTURE' plan.md` prints 1.
- [ ] CHK-003 [P1] The baseline count is saved before the first edit (T001).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `node --check` exits 0 on the adapter and the test file (T004, T005, T007).
- [ ] CHK-011 [P0] The guard exits 0 on every path, including a record read that throws. The new test proves the throwing path.
- [ ] CHK-012 [P1] The condition reads `verdict.armable` and adds no helper function.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] AC-001 and AC-002 pass with their commands. `scratch/red.txt` shows the denial failing before the edit and `scratch/green.txt` shows it passing after, and `scratch/control.txt` shows the live-killer control passing.
- [ ] CHK-021 [P0] The killer-gone denial failed before the source edit (`scratch/red.txt`).
- [ ] CHK-022 [P1] The pending-record denial and the five existing pass-through tests still pass in `scratch/guard-suite.txt`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [ ] CHK-FIX-001 [P0] The finding class is `class-of-bug`: every guarded dialog state is checked against the one verdict the core owns.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory: `rg -n "verdict.reason === 'pending'" .skilled` prints one line, the condition this phase changes.
- [ ] CHK-FIX-003 [P0] Consumer inventory: `pendingHandOver` has one caller, `main` at `claude/subagent-guard.mjs:117`, and `armableRecord` does not change.
- [ ] CHK-FIX-004 [P0] The denial text is unchanged, and no payload field reaches it.
- [ ] CHK-FIX-005 [P1] Matrix axes listed in plan.md: record state crossed with stdout. All rows are named.
- [ ] CHK-FIX-006 [P1] The tests run with `AI_SESSION_CHILD` and `OPENCODE_DB` unset. Every saved command line begins `env -u AI_SESSION_CHILD -u OPENCODE_DB`.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to the fix commit, named in `goal.md` section 4.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secrets: the change reads no credential.
- [ ] CHK-031 [P0] No payload text reaches the denial, which holds the record's note path and loop id only.
- [ ] CHK-032 [P1] N/A: no auth surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` all name the armable rule and the live-killer exception.
- [ ] CHK-041 [P1] The changed comment names no packet, phase or task number (T008).
- [ ] CHK-042 [P2] The Claude adapter README names the rule (T009).
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

**Verification Date**: Pending. The builder records each observed run here and cites the scratch file.
<!-- /ANCHOR:summary -->

---
