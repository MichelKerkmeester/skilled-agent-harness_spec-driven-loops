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

- [ ] T001 Take the suite baseline before any edit (`RL/tests`). Verify: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0, and its `tests`, `pass` and `fail` lines and the exit status are saved in `PHASE/scratch/baseline.txt`.
- [ ] T002 Confirm the two silent branches and the one printed notice (`RL/claude/stop-arm.mjs`). Verify: the first command of `spec.md` Measured Behavior prints lines 53, 140, 146, 168, 197, 198, 216 and 217, exit 0.
- [ ] T003 Confirm the two existing parked-Stop tests pass and print nothing today (`RL/tests/claude-adapters.test.cjs`). Verify: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test --test-name-pattern='no process below the loop|arming throws' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits 0 with `fail 0`, saved to `PHASE/scratch/current.txt`.
- [ ] T004 Confirm the two notices that already print still pass (`RL/tests/claude-adapters.test.cjs`). Verify: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test --test-name-pattern='missing-transcript-path and marks|background tasks exist' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits 0 with `fail 0`, saved to `PHASE/scratch/existing-notices.txt`.

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Extend `stop-arm marks the pending record deferred when no process below the loop can be found` to parse `result.stdout` as one JSON line, assert a `systemMessage` matching `/could not arm/`, `/next prompt withdraws/` and `/later Stop/`, assert no `decision` key, and keep the stamp and log assertions (`RL/tests/claude-adapters.test.cjs`). Verify: `node --check .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits 0.
- [ ] T006 Extend `stop-arm marks the pending record deferred when arming throws` to pass `write: (text) => lines.push(text)` in the dependencies, assert one collected line with the same three matches and no `decision` key, and keep the stamp and log assertions (`RL/tests/claude-adapters.test.cjs`). Verify: `node --check .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits 0.
- [ ] T007 Run both changed tests before the source edit (`PHASE/scratch/red.txt`). Verify: the command of T003 exits 1 with `fail 2`, because stdout is empty and no line reaches the injected write.
- [ ] T008 Add the target-pid notice after `markParked` (`RL/claude/stop-arm.mjs`). The fixed text names the missing session process, the withdrawal on the next prompt and the later Stop. The write is guarded by a `try` whose `catch` logs `stop-arm-error` with `stage: 'notice'`. Verify: `rg -c 'could not arm the hop because this Stop found no session process' .skilled/hooks/session-relaunch/claude/stop-arm.mjs` prints 1 and `node --check .skilled/hooks/session-relaunch/claude/stop-arm.mjs` exits 0.
- [ ] T009 Add the arm-failure notice after `markParked` on the arm-throw branch with the same guard and the same three claims (`RL/claude/stop-arm.mjs`). Verify: `rg -c 'could not arm the hop because arming the record failed' .skilled/hooks/session-relaunch/claude/stop-arm.mjs` prints 1 and `node --check .skilled/hooks/session-relaunch/claude/stop-arm.mjs` exits 0.
- [ ] T010 Widen the `dependencies.write` JSDoc from the deferral notice to an operator notice, and say in the branch comments why each line prints at the Stop (`RL/claude/stop-arm.mjs`). Verify: `git diff -- .skilled/hooks/session-relaunch/claude/stop-arm.mjs` shows both, and no added comment names a packet, phase, task or finding number.
- [ ] T011 Name the notices in the `stop-arm.mjs` row (`RL/claude/README.md`). Verify: `rg -c 'no target pid' .skilled/hooks/session-relaunch/claude/README.md` and `rg -c 'arm that throws' .skilled/hooks/session-relaunch/claude/README.md` each print 1 or more.
- [ ] T012 Name the notices in the Stop paragraph (`RL/README.md`). Verify: `rg -c 'no target pid' .skilled/hooks/session-relaunch/README.md` and `rg -c 'arm that throws' .skilled/hooks/session-relaunch/README.md` each print 1 or more.

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 Run both changed tests (`RL/tests/claude-adapters.test.cjs`). Verify: the command of T003 exits 0 with `fail 0`, saved to `PHASE/scratch/green.txt`.
- [ ] T014 Run the Claude adapter and conformance suites (`RL/tests`). Verify: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs .skilled/hooks/session-relaunch/tests/adapter-conformance.test.cjs` exits 0 with `fail 0`, saved to `PHASE/scratch/claude-conformance.txt`.
- [ ] T015 Run the relaunch and OpenCode plugin suites (`RL/tests` and `.opencode/plugins/tests`). Verify: the command of T001 exits 0 with `fail 0` and the `tests` count in `PHASE/scratch/baseline.txt`, saved to `PHASE/scratch/final-suite.txt`.
- [ ] T016 Check that the fix adds no file, no record key and no log event (`FIX`). Verify: `git show --diff-filter=A --name-only FIX | rg -v '022-stop-park-notices/'` prints nothing with exit 1, and `git show FIX -- .skilled/hooks/session-relaunch | rg -c "^\+.*logEvent\('"` prints 2, the reused `stop-arm-error` catch of each notice.
- [ ] T017 Validate the phase folder (`PHASE`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/022-stop-park-notices --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] Every task is resolved: T001 to T017 are complete, and T016 ran against the fix commit.
- [ ] No `[B]` blocked tasks remaining: no task is blocked.
- [ ] Manual verification passed: `scratch/red.txt` shows both changed tests failing and `scratch/green.txt` shows both passing.
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

- [ ] CHK-001 [P0] Requirements documented in spec.md: `rg -c '^\| REQ-' spec.md` prints 6.
- [ ] CHK-002 [P0] Technical approach defined in plan.md: `rg -c '^## 3. ARCHITECTURE' plan.md` prints 1.
- [ ] CHK-003 [P1] The baseline count is saved before the first edit (T001).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `node --check` exits 0 on the adapter and the test file (T005, T006, T008, T009).
- [ ] CHK-011 [P0] The hook exits 0 on every path, including a notice write that throws. The catch logs `stop-arm-error stage=notice`.
- [ ] CHK-012 [P1] Each notice reuses `dependencies.write` and adds no helper function.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] AC-001 and AC-002 pass with their commands. `scratch/red.txt` shows both failing before the edit and `scratch/green.txt` shows both passing after.
- [ ] CHK-021 [P0] Both changed tests failed before the source edit (`scratch/red.txt`).
- [ ] CHK-022 [P1] The missing-transcript and background-task notice tests still pass in `scratch/existing-notices.txt`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [ ] CHK-FIX-001 [P0] The finding class is `class-of-bug`: every Stop branch that parks a record is checked for a notice.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory: `rg -n 'markParked\(loopId, env\)' .skilled/hooks/session-relaunch/claude/stop-arm.mjs` lists the stamp calls, and the plan names what each prints after the change.
- [ ] CHK-FIX-003 [P0] Consumer inventory: Claude reads the Stop stdout, and no repository code parses it.
- [ ] CHK-FIX-004 [P0] Both lines hold fixed text and no payload field.
- [ ] CHK-FIX-005 [P1] Matrix axes listed in plan.md: Stop path crossed with stdout. All rows are named.
- [ ] CHK-FIX-006 [P1] The tests run with `AI_SESSION_CHILD` and `OPENCODE_DB` unset. Every saved command line begins `env -u AI_SESSION_CHILD -u OPENCODE_DB`.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to the fix commit, named in `goal.md` section 4.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secrets: the change reads no credential.
- [ ] CHK-031 [P0] No payload text reaches either line.
- [ ] CHK-032 [P1] N/A: no auth surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` all name both notices and the kept withdrawal.
- [ ] CHK-041 [P1] Both added comments name no packet, phase or task number (T010).
- [ ] CHK-042 [P2] Both READMEs name the notices (T011, T012).
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
