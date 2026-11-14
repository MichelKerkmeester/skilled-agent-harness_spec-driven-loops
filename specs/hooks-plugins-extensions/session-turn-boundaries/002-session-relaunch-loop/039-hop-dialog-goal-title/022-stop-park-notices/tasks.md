---
title: "Tasks: Phase 22: stop-park-notices"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "stop park notices tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 22: stop-park-notices

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

- [x] T001 Take the suite baseline before any edit (`RL/tests`). Verify: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0, and its `tests`, `pass` and `fail` lines and the exit status are saved in `PHASE/scratch/baseline.txt`. Observed: the orchestrator took it on this tree after child 021 was committed (`8415fb23ef`): `scratch/baseline.txt` prints `ℹ tests 1555`, `ℹ pass 1555`, `ℹ fail 0` and `exit=0`. Not rerun, per the dispatch.
- [x] T002 Confirm the two silent branches and the one printed notice (`RL/claude/stop-arm.mjs`). Verify: the first command of `spec.md` Measured Behavior prints lines 53, 140, 146, 168, 197, 198, 216 and 217, exit 0. Observed after the source edit: the command prints `53`, `140`, `146`, `168`, `197`, `198`, `205`, `228`, `229` and `235`, exit 0. The one printed notice before the edit was at 146, and the two new notices now sit at 205 and 235 beside the arm stamp at 229.
- [x] T003 Confirm the two existing parked-Stop tests pass and print nothing today (`RL/tests/claude-adapters.test.cjs`). Verify: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test --test-name-pattern='no process below the loop|arming throws' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits 0 with `fail 0`, saved to `PHASE/scratch/current.txt`. Observed: `scratch/current.txt` records `ℹ tests 2`, `ℹ pass 2`, `ℹ fail 0`, `exit=0`. It was taken after the test edit, so it proves the current tests pass, not the old silence. The old silence is covered by the orchestrator baseline, where all 1555 tests passed before any edit, and by `scratch/red.txt`, where the extended tests fail against the unedited source.
- [x] T004 Confirm the two notices that already print still pass (`RL/tests/claude-adapters.test.cjs`). Verify: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test --test-name-pattern='missing-transcript-path and marks|background tasks exist' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits 0 with `fail 0`, saved to `PHASE/scratch/existing-notices.txt`. Observed: `scratch/existing-notices.txt` records `ℹ tests 2`, `ℹ pass 2`, `ℹ fail 0`, `exit=0`.

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Extend `stop-arm marks the pending record deferred when no process below the loop can be found` to parse `result.stdout` as one JSON line, assert a `systemMessage` matching `/could not arm/`, `/next prompt withdraws/` and `/later Stop/`, assert no `decision` key, and keep the stamp and log assertions (`RL/tests/claude-adapters.test.cjs`). Verify: `node --check .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits 0. Observed: exited 0. The assertions sit at `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs:1369` to `:1376` and the record and log assertions follow unchanged.
- [x] T006 Extend `stop-arm marks the pending record deferred when arming throws` to pass `write: (text) => lines.push(text)` in the dependencies, assert one collected line with the same three matches and no `decision` key, and keep the stamp and log assertions (`RL/tests/claude-adapters.test.cjs`). Verify: `node --check .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits 0. Observed: exited 0. The seam is at `:1410` and the assertions at `:1418` to `:1425`.
- [x] T007 Run both changed tests before the source edit (`PHASE/scratch/red.txt`). Verify: the command of T003 exits 1 with `fail 2`, because stdout is empty and no line reaches the injected write. Observed: `scratch/red.txt` records `ℹ tests 2`, `ℹ pass 0`, `ℹ fail 2`, `exit=1`. The target-pid failure reads `expected '' to not equal ''` and the arm failure reads `0 !== 1` on the collected lines.
- [x] T008 Add the target-pid notice after `markParked` (`RL/claude/stop-arm.mjs`). The fixed text names the missing session process, the withdrawal on the next prompt and the later Stop. The write is guarded by a `try` whose `catch` logs `stop-arm-error` with `stage: 'notice'`. Verify: `rg -c 'could not arm the hop because this Stop found no session process' .skilled/hooks/session-relaunch/claude/stop-arm.mjs` prints 1 and `node --check .skilled/hooks/session-relaunch/claude/stop-arm.mjs` exits 0. Observed: printed 1 and `node --check` exited 0. The guarded write sits at `.skilled/hooks/session-relaunch/claude/stop-arm.mjs:199` to `:211`, after `markParked` at `:198`.
- [x] T009 Add the arm-failure notice after `markParked` on the arm-throw branch with the same guard and the same three claims (`RL/claude/stop-arm.mjs`). Verify: `rg -c 'could not arm the hop because arming the record failed' .skilled/hooks/session-relaunch/claude/stop-arm.mjs` prints 1 and `node --check .skilled/hooks/session-relaunch/claude/stop-arm.mjs` exits 0. Observed: printed 1 and `node --check` exited 0. The guarded write sits at `:230` to `:241`, after `markParked` at `:229`.
- [x] T010 Widen the `dependencies.write` JSDoc from the deferral notice to an operator notice, and say in the branch comments why each line prints at the Stop (`RL/claude/stop-arm.mjs`). Verify: `git diff -- .skilled/hooks/session-relaunch/claude/stop-arm.mjs` shows both, and no added comment names a packet, phase, task or finding number. Observed: the JSDoc now says `Writes an operator notice`, and each branch carries a three-line comment saying the cause is known at the Stop while the next prompt only withdraws the record. A scan of the added lines for `T[0-9]{3}`, `REQ-`, `AC-`, `CHK-`, `phase [0-9]`, `022`, `039` and `ADR-` found none.
- [x] T011 Name the notices in the `stop-arm.mjs` row (`RL/claude/README.md`). Verify: `rg -c 'no target pid' .skilled/hooks/session-relaunch/claude/README.md` and `rg -c 'arm that throws' .skilled/hooks/session-relaunch/claude/README.md` each print 1 or more. Observed: each printed 1, exit 0. The row names the no-transcript, no-target-pid and arm-throw notices and the three claims each makes.
- [x] T012 Name the notices in the Stop paragraph (`RL/README.md`). Verify: `rg -c 'no target pid' .skilled/hooks/session-relaunch/README.md` and `rg -c 'arm that throws' .skilled/hooks/session-relaunch/README.md` each print 1 or more. Observed: each printed 1, exit 0. The Stop paragraph keeps the `stop-arm-error stage=target-pid` and `stage=arm` log lines and the `deferredAt` stamps and adds the notice each branch prints.

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Run both changed tests (`RL/tests/claude-adapters.test.cjs`). Verify: the command of T003 exits 0 with `fail 0`, saved to `PHASE/scratch/green.txt`. Observed: `scratch/green.txt` records `ℹ tests 2`, `ℹ pass 2`, `ℹ fail 0`, `exit=0` and two `✔` lines.
- [x] T014 Run the Claude adapter and conformance suites (`RL/tests`). Verify: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs .skilled/hooks/session-relaunch/tests/adapter-conformance.test.cjs` exits 0 with `fail 0`, saved to `PHASE/scratch/claude-conformance.txt`. Observed: `scratch/claude-conformance.txt` records `ℹ tests 115`, `ℹ pass 115`, `ℹ fail 0`, `exit=0`.
- [x] T015 Run the relaunch and OpenCode plugin suites (`RL/tests` and `.opencode/plugins/tests`). Verify: the command of T001 exits 0 with `fail 0` and the `tests` count in `PHASE/scratch/baseline.txt`, saved to `PHASE/scratch/final-suite.txt`. Observed: `scratch/final-suite.txt` records `ℹ tests 1555`, `ℹ pass 1555`, `ℹ fail 0`, `exit=0`, equal to the 1555 baseline and with no `✖` line.
- [x] T016 Check that the fix adds no file, no record key and no log event (`FIX`). Verify: `git show --diff-filter=A --name-only FIX | rg -v '022-stop-park-notices/'` prints nothing with exit 1, and `git show FIX -- .skilled/hooks/session-relaunch | rg -c "^\+.*logEvent\('"` prints 2, the reused `stop-arm-error` catch of each notice. Observed from the working tree, because the orchestrator owns the commit: `git status --porcelain` lists four modified files under `.skilled/hooks/session-relaunch`, this child's modified records, and its untracked `scratch/` logs and `implementation-summary.md`, with nothing added outside this child. `git diff --stat` names four modified files, and `git diff -U0 -- .skilled/hooks/session-relaunch` piped to `rg -c "^\+.*logEvent\('"` printed 2. The two `git show FIX` commands run once the fix commit exists.
- [x] T017 Validate the phase folder (`PHASE`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/022-stop-park-notices --strict` prints `RESULT: PASSED`. Observed 2026-11-14: after `repair-derived.cjs --apply` reported `inspected=1 repaired=1 failed=0`, validate printed Errors 0, Warnings 0, `RESULT: PASSED` and exit 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Every task is resolved: T001 to T017 are complete. T016 ran against the working tree because the orchestrator owns the fix commit, and its two `git show FIX` commands run after that commit.
- [x] No `[B]` blocked tasks remaining: no task is blocked.
- [x] Manual verification passed: `scratch/red.txt` shows both changed tests failing (tests 2, pass 0, fail 2, exit 1) and `scratch/green.txt` shows both passing (tests 2, pass 2, fail 0, exit 0).
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **The notice this phase copies**: `../017-missing-transcript-notice/`
- **The stamp this phase keeps**: `../005-parked-record-escape/`
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

A blocked task is marked `[B]` with its reason in `goal.md`. A `[B]` on T001 blocks every implementation task, because the count in T015 is read against the baseline.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md: `rg -c '^\| REQ-' spec.md` prints 6. Observed 6, exit 0.
- [x] CHK-002 [P0] Technical approach defined in plan.md: `rg -c '^## 3. ARCHITECTURE' plan.md` prints 1. Observed 1, exit 0.
- [x] CHK-003 [P1] The baseline count is saved before the first edit (T001). `scratch/baseline.txt` was written by the orchestrator before the test edit, and T001 records its 1555 count.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `node --check` exits 0 on the adapter and the test file (T005, T006, T008, T009). Both observed exit 0.
- [x] CHK-011 [P0] The hook exits 0 on every path, including a notice write that throws. The catch logs `stop-arm-error stage=notice`. Observed 2026-11-14 (`scratch/write-throw.txt`): an injected `write` that throws resolved `armPendingRecord` to `null` without rejecting, `deferredAt` was a parseable string, the record kept every other field, one `stop-arm-error stage=notice` line and one `stage=target-pid` line were logged, and the run exited 0.
- [x] CHK-012 [P1] Each notice reuses `dependencies.write` and adds no helper function. Observed: both branches write through `dependencies.write || ((text) => process.stdout.write(text))` at `.skilled/hooks/session-relaunch/claude/stop-arm.mjs:203` and `:233`, and no function is added.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] AC-001 and AC-002 pass with their commands. `scratch/red.txt` shows both failing before the edit (tests 2, pass 0, fail 2, exit 1) and `scratch/green.txt` shows both passing (tests 2, pass 2, fail 0, exit 0).
- [x] CHK-021 [P0] Both changed tests failed before the source edit (`scratch/red.txt`). The two `✖` lines name `no process below the loop` and `arming throws`, and the assertion failures are the empty stdout and the zero collected lines.
- [x] CHK-022 [P1] The missing-transcript and background-task notice tests still pass in `scratch/existing-notices.txt`. Observed: tests 2, pass 2, fail 0, exit 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] The finding class is `class-of-bug`: every Stop branch that parks a record is checked for a notice. Observed: the four stamp calls are the missing-transcript, background-task, target-pid and arm-throw branches, and all four print a notice after the edit.
- [x] CHK-FIX-002 [P0] Same-class producer inventory: `rg -n 'markParked\(loopId, env\)' .skilled/hooks/session-relaunch/claude/stop-arm.mjs` lists the stamp calls, and the plan names what each prints after the change. Observed five matching lines: the helper definition at `:53` and four branch calls at `:140`, `:168`, `:198` and `:229`; all four branch calls now print a notice.
- [x] CHK-FIX-003 [P0] Consumer inventory: Claude reads the Stop stdout, and no repository code parses it. Observed: the only repository readers are test assertions on `result.stdout` at `tests/claude-adapters.test.cjs:700`, `:958` and `:1369`, and on the injected write at `:1418`, and nothing in `.skilled` or `.opencode` parses the Stop hook's stdout.
- [x] CHK-FIX-004 [P0] Both lines hold fixed text and no payload field. Observed: the two `systemMessage` values at `.skilled/hooks/session-relaunch/claude/stop-arm.mjs:205` and `:235` are fixed string literals with no `${...}`.
- [x] CHK-FIX-005 [P1] Matrix axes listed in plan.md: Stop path crossed with stdout. Observed in `plan.md` §FIX ADDENDUM: target pid, arm throw, missing transcript, background tasks and armed, crossed with one notice or empty.
- [x] CHK-FIX-006 [P1] The tests run with `AI_SESSION_CHILD` and `OPENCODE_DB` unset. Every saved command line in `scratch/` begins `env -u AI_SESSION_CHILD -u OPENCODE_DB`.
- [x] CHK-FIX-007 [P1] Evidence is pinned to the fix commit, named in `goal.md` section 4. Observed: the fix commit is not created yet because the orchestrator commits, so `goal.md` section 4 names the working tree and the baseline commit `8415fb23ef` and leaves the fix commit row for the orchestrator.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets: the change reads no credential. Observed: both branches read only the record they already held and the env they already used, and no new file or variable is read.
- [x] CHK-031 [P0] No payload text reaches either line. Observed: both `systemMessage` values are fixed text with no interpolation, so no payload field can reach them.
- [x] CHK-032 [P1] N/A: no auth surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` all name both notices and the kept withdrawal. Observed: `spec.md` §3 In Scope and §2 Problem, `plan.md` §1 Overview and §3 Data Flow, and this file's T001 to T017 all state the two printed lines and the unchanged withdrawal.
- [x] CHK-041 [P1] Both added comments name no packet, phase or task number (T010). Observed: a scan of the added lines for `T[0-9]{3}`, `REQ-`, `AC-`, `CHK-`, `phase [0-9]`, `022`, `039` and `ADR-` found none.
- [x] CHK-042 [P2] Both READMEs name the notices (T011, T012). Observed: `rg -c 'no target pid'` and `rg -c 'arm that throws'` each printed 1 for `.skilled/hooks/session-relaunch/README.md` and 1 for `.skilled/hooks/session-relaunch/claude/README.md`, exit 0.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Test runs live under `scratch/` only. Observed: `baseline.txt`, `current.txt`, `existing-notices.txt`, `red.txt`, `green.txt`, `claude-conformance.txt`, `final-suite.txt`, `write-throw.txt` and `write-throw.mjs` all sit in `scratch/`.
- [x] CHK-051 [P1] No temporary file is left outside `scratch/`. Observed: the write-throw check built its sandbox under the OS temp directory and removed it in the same run, and `git status --porcelain` lists four modified files under `.skilled/hooks/session-relaunch`, this child's modified records, and its untracked `scratch/` files and `implementation-summary.md`, with nothing outside this child.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-14. Every row above was checked from a recorded run or a searched source in the working tree. The only commit-scoped rows are T016 and CHK-FIX-007, which note that the orchestrator creates the fix commit and reruns the two `git show FIX` commands against it.
<!-- /ANCHOR:summary -->

---
