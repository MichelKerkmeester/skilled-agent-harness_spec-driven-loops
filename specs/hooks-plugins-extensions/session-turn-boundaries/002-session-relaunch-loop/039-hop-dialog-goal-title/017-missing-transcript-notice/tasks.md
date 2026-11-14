---
title: "Tasks: Phase 17: missing-transcript-notice"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "missing transcript notice tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 17: missing-transcript-notice

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

**Test environment**: run the suites as `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test <file>`, because a dispatched child marker and an inherited OpenCode database path both change how the relaunch tests behave.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Take the suite baseline before any edit (`RL/tests`). Verify: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0, and its `tests`, `pass` and `fail` lines and the exit status are saved in `PHASE/scratch/baseline.txt`. Observed: the orchestrator took the baseline on this tree after child 016 was committed (`c37531f72b`): `scratch/baseline.txt:1565` prints `ℹ tests 1553`, `:1567` `ℹ pass 1553` and `:1568` `ℹ fail 0`, and its recorded exit status is 0. Not rerun, per the dispatch.
- [x] T002 Confirm the branch logs and stamps and prints nothing (`RL/claude/stop-arm.mjs`). Verify: the first and fourth commands of `spec.md` Measured Behavior print lines 137, 138 and 162 and line 958. Observed before the edit: the first command printed `137:logEvent('missing-transcript-path'`, `138:markParked(loopId, env)` and `162:systemMessage: ` with exit 0, and the fourth printed `958:assert.equal(result.stdout, '')` with exit 0.
- [x] T003 Confirm a prompt withdraws a stamped record and the operator sees nothing of it, by running the existing tests that cover it (`RL/tests/claude-adapters.test.cjs`). Verify: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test --test-name-pattern='missing-transcript-path and marks|withdraw' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits 0, saved to `PHASE/scratch/withdraw-tests.txt`. Observed: eight `✔` lines at `scratch/withdraw-tests.txt:2` to `:9`, `ℹ tests 8` at `:10`, `ℹ pass 8` at `:12`, `ℹ fail 0` at `:13` and `exit=0` at `:18`; the withdraw helper's tests pass unchanged, so a stamped record still withdraws on the next prompt.

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Change the test `stop-arm logs missing-transcript-path and marks the pending record deferred` to expect one stdout line that parses as JSON with a `systemMessage` matching `/no transcript path/` and `/next prompt withdraws/` and no `decision` key, and exactly one `missing-transcript-path` line in the log (`RL/tests/claude-adapters.test.cjs`). Verify: `node --check .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits 0. Observed: exited 0. The assertions sit at `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs:958` to `:973`: one line, the two matches, `Object.hasOwn(notice, 'decision')` false, the record unchanged apart from `deferredAt`, and one filtered log line.
- [x] T005 Run the red test before the source edit (`PHASE/scratch/red.txt`). Verify: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test --test-name-pattern='missing-transcript-path and marks' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits 1 with `fail 1`, and the failure names the empty stdout. Observed: `scratch/red.txt:2` prints `✖ stop-arm logs missing-transcript-path and marks the pending record deferred`, `ℹ tests 1` at `:3`, `ℹ pass 0` at `:5`, `ℹ fail 1` at `:6`, the `AssertionError` at `:16` reads `stdout is empty: the missing-transcript Stop printed no notice`, and `exit=1` at `:28`.
- [x] T006 Write the notice after the stamp in the missing-transcript branch, inside a `try` that logs `stop-arm-error` with `stage: 'notice'` (`RL/claude/stop-arm.mjs`). Verify: `rg -c 'could not arm the hop because this Stop carried no transcript path' .skilled/hooks/session-relaunch/claude/stop-arm.mjs` prints 1 and `node --check .skilled/hooks/session-relaunch/claude/stop-arm.mjs` exits 0. Observed: `rg -c` printed 1 with exit 0 and `node --check` exited 0. The guarded write sits at `.skilled/hooks/session-relaunch/claude/stop-arm.mjs:143` to `:152`, after `markParked` at `:140`, and reuses `dependencies.write` at `:144` as the background-task branch does.
- [x] T007 Extend the comment above the branch to say it prints the notice (`RL/claude/stop-arm.mjs`). Verify: `git diff -- .skilled/hooks/session-relaunch/claude/stop-arm.mjs` shows the comment, and no added line names a packet, phase, task or finding number. Observed: the diff adds three comment lines at `.skilled/hooks/session-relaunch/claude/stop-arm.mjs:134` to `:136` saying the prompt cannot tell this cause from the other stamping paths so the notice prints here, plus two at `:141` to `:142` on the `systemMessage` contract; a scan for `T[0-9]{3}`, `REQ-`, `AC-`, `CHK-`, `phase [0-9]`, `017`, `039`, `ADR-` and `finding [0-9]` found none.
- [x] T008 Name the notice in the sentence on a missing `transcript_path` (`RL/README.md`). Verify: `rg -c 'no transcript path' .skilled/hooks/session-relaunch/README.md` prints 1 or more. Observed: printed 1 with exit 0. The sentence now says the hook logs `missing-transcript-path`, stamps `deferredAt`, prints one JSON line whose `systemMessage` says the next prompt withdraws the hop because the Stop carried no transcript path, and returns.
- [x] T009 Name the notice in the `stop-arm.mjs` row (`RL/claude/README.md`). Verify: `rg -c 'no transcript path' .skilled/hooks/session-relaunch/claude/README.md` prints 1 or more. Observed: printed 1 with exit 0. The row's "What it does" cell now says a Stop whose payload carries no transcript path prints a notice that the next prompt withdraws the hop.

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run the changed test (`RL/tests/claude-adapters.test.cjs`). Verify: the command of T005 exits 0 with `pass 1` and `fail 0`, saved to `PHASE/scratch/green.txt`. Observed: `scratch/green.txt:2` prints `✔ stop-arm logs missing-transcript-path and marks the pending record deferred`, `ℹ tests 1` at `:3`, `ℹ pass 1` at `:5`, `ℹ fail 0` at `:6` and `exit=0` at `:11`.
- [x] T011 Run the Claude adapter and conformance suites (`RL/tests`). Verify: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs .skilled/hooks/session-relaunch/tests/adapter-conformance.test.cjs` exits 0 with `fail 0`. Observed: `ℹ tests 115` at `scratch/claude-conformance.txt:117`, `ℹ pass 115` at `:119`, `ℹ fail 0` at `:120` and `exit=0` at `:125`, with no `✖` line in the file; the changed test prints `✔` at `:81`, and the background-task notice test passes in the same run.
- [x] T012 Run the relaunch and OpenCode plugin suites (`RL/tests` and `.opencode/plugins/tests`). Verify: the command of T001 exits 0 with `fail 0` and the `tests` count in `PHASE/scratch/baseline.txt`, saved to `PHASE/scratch/final-suite.txt`. Observed: `ℹ tests 1553` at `scratch/final-suite.txt:1566`, `ℹ pass 1553` at `:1568`, `ℹ fail 0` at `:1569` and `exit=0` at `:1574`, equal to the 1553 baseline at `scratch/baseline.txt:1565`, `:1567` and `:1568`; the file holds no `✖` line.
- [x] T013 Check that the fix adds no file, no record key and no log event (`FIX`). Verify: `git show --stat 78f9d39501` lists the four code and document files plus the records of this child, `git show --diff-filter=A --name-only 78f9d39501 | rg -v '017-missing-transcript-notice/'` prints nothing with exit 1, and `git show 78f9d39501 -- .skilled/hooks/session-relaunch/claude/stop-arm.mjs | rg -c "^\+.*logEvent\('"` prints 1, the `stop-arm-error` call of the guarded write. Observed 2026-11-14 against commit `78f9d39501` (Commit-Id 0014033): the stat lists 16 files, the two READMEs, `stop-arm.mjs` and the test file among them, the new-file filter outside the child printed nothing with exit 1, and the log-event count printed 1, the reused `stop-arm-error` path, so the commit adds no log event.
- [x] T014 Validate the phase folder (`PHASE`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/017-missing-transcript-notice --strict` prints `RESULT: PASSED`. Observed 2026-11-14: after `repair-derived.cjs --apply` reported `inspected=1 repaired=1 failed=0`, validate printed Errors 0, Warnings 0, `RESULT: PASSED` and exit 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Every task is resolved: T001 to T014 are complete, and T013 ran against the fix commit `78f9d39501` (Commit-Id 0014033).
- [x] No `[B]` blocked tasks remaining: no task is blocked.
- [x] Manual verification passed: `scratch/red.txt` shows the changed test failing (tests 1, pass 0, fail 1, exit 1) and `scratch/green.txt` shows it passing (tests 1, pass 1, fail 0, exit 0).
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **The stamp this explains**: `../005-parked-record-escape/`
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

- [x] CHK-001 [P0] Requirements documented in spec.md: `rg -c '^\| REQ-' spec.md` prints 6. Observed 6, exit 0.
- [x] CHK-002 [P0] Technical approach defined in plan.md: `rg -c '^## 3. ARCHITECTURE' plan.md` prints 1. Observed 1, exit 0.
- [x] CHK-003 [P1] The baseline count is saved before the first edit (T001). `scratch/baseline.txt` was written by the orchestrator before the test edit, and T001 records its 1553 count.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `node --check` exits 0 on the adapter and the test file (T006, T004). Both observed exit 0.
- [x] CHK-011 [P0] The hook exits 0 on every path, including a write that throws. Observed 2026-11-14: an injected `write` that throws resolved `armPendingRecord` to `null` without rejecting, left `deferredAt` a string, logged one `stop-arm-error stage=notice` line and wrote one `missing-transcript-path` line, so `main` reaches `done()` and exits 0. The notice's `try`/`catch` at `.skilled/hooks/session-relaunch/claude/stop-arm.mjs:143` to `:152` is the only new throw site.
- [x] CHK-012 [P1] The write reuses `dependencies.write` and adds no helper function. Observed: the write is `dependencies.write || ((text) => process.stdout.write(text))` at `.skilled/hooks/session-relaunch/claude/stop-arm.mjs:144`, the same seam the background-task branch uses, and no function is added.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] AC-001 and AC-002 pass with their commands. `scratch/red.txt:2` prints `✖` before the edit and `scratch/green.txt:2` prints `✔` after it; the green test also asserts the unchanged record fields plus `deferredAt` and exactly one filtered `missing-transcript-path` log line (`scratch/green.txt:3`, `:5`, `:6`, `:11`).
- [x] CHK-021 [P0] The changed test failed before the edit (`scratch/red.txt`). `scratch/red.txt:3` prints `ℹ tests 1`, `:5` `ℹ pass 0`, `:6` `ℹ fail 1`, the `AssertionError` at `:16` reads `stdout is empty: the missing-transcript Stop printed no notice`, and `:28` prints `exit=1`.
- [x] CHK-022 [P1] The background-task notice test still passes (T011). `scratch/claude-conformance.txt:69` prints `✔ stop-arm defers pending state when background tasks exist and logs the reason`, and the run reports `ℹ fail 0` at `:120`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] The finding class is `instance-only`: the missing-transcript branch is the one Stop path the operator asked to explain.
- [x] CHK-FIX-002 [P0] Same-class producer inventory: `rg -n 'markParked\(loopId, env\)' .skilled/hooks/session-relaunch/claude/stop-arm.mjs` lists four stamp calls, and the plan names what each prints after the change. Observed four calls at `:140` (missing transcript, now with the notice), `:168` (background tasks, its own notice, unchanged), `:198` (target pid, log only) and `:217` (arm error, log only).
- [x] CHK-FIX-003 [P0] Consumer inventory: Claude reads the Stop stdout, and no repository code parses it. Observed: the only repository readers of the value are test assertions on `result.stdout` (`tests/claude-adapters.test.cjs:958` to `:965` and `:700` to `:707`), and nothing in `.skilled` or `.opencode` parses the Stop hook's stdout.
- [x] CHK-FIX-004 [P0] The line holds fixed text and no payload field. Observed: the `systemMessage` at `.skilled/hooks/session-relaunch/claude/stop-arm.mjs:146` to `:148` is three fixed string literals, and no `${...}` appears in them.
- [x] CHK-FIX-005 [P1] Matrix axes listed in plan.md: Stop path crossed with stdout. Observed in `plan.md` §FIX ADDENDUM: missing transcript, background tasks, no target pid, arm error and armed, crossed with a notice or empty.
- [x] CHK-FIX-006 [P1] The tests run with `AI_SESSION_CHILD` and `OPENCODE_DB` unset. Observed: every command line saved under `scratch/` begins `env -u AI_SESSION_CHILD -u OPENCODE_DB`.
- [x] CHK-FIX-007 [P1] Evidence is pinned to the fix commit `78f9d39501` (Commit-Id 0014033), named in `goal.md` section 4. Observed 2026-11-14: T013 checks that commit, and `goal.md` section 4 names it with its file list and the hook registration and runtime mirror checks.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets: the change reads no credential. Observed: the branch reads only `payload.transcript_path`, the record it already held and the env it already used; no new file or variable is read.
- [x] CHK-031 [P0] No payload text reaches the printed line. Observed: the `systemMessage` is fixed text with no interpolation, so no payload field can reach it.
- [x] CHK-032 [P1] N/A: no auth surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` all name the notice and the kept withdrawal. Observed: `spec.md` §3 In Scope and Problem, `plan.md` §1 Overview and §3 Data Flow, and this file's T001 to T014 all state the printed line and the unchanged withdrawal.
- [x] CHK-041 [P1] The changed comment names no packet, phase or task number (T007). Observed: the added comment lines carry no id; a scan for `T[0-9]{3}`, `REQ-`, `AC-`, `CHK-`, `phase [0-9]`, `017`, `039`, `ADR-` and `finding [0-9]` found none.
- [x] CHK-042 [P2] Both READMEs name the notice (T008, T009). Observed: `rg -c 'no transcript path'` printed 1 for `.skilled/hooks/session-relaunch/README.md` and 1 for `.skilled/hooks/session-relaunch/claude/README.md`, exit 0.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Test runs live under `scratch/` only. Observed: `baseline.txt`, `withdraw-tests.txt`, `red.txt`, `green.txt`, `claude-conformance.txt` and `final-suite.txt` all sit in `scratch/`.
- [x] CHK-051 [P1] No temporary file is left outside `scratch/`. Observed: the injected-throw check built its sandbox under the OS temp directory and removed it in the same run, and `git status --porcelain` lists only the four modified files plus the untracked `scratch/` logs.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-14. Every row above was checked from a recorded run, a searched source or the fix commit `78f9d39501` (Commit-Id 0014033). No row is deferred.
<!-- /ANCHOR:summary -->

---
