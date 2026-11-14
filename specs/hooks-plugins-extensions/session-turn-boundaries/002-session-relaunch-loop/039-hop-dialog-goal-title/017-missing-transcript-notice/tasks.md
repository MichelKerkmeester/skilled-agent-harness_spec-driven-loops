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

- [ ] T001 Take the suite baseline before any edit (`RL/tests`). Verify: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0, and its `tests`, `pass` and `fail` lines and the exit status are saved in `PHASE/scratch/baseline.txt`.
- [ ] T002 Confirm the branch logs and stamps and prints nothing (`RL/claude/stop-arm.mjs`). Verify: the first and fourth commands of `spec.md` Measured Behavior print lines 137, 138 and 162 and line 958.
- [ ] T003 Confirm a prompt withdraws a stamped record and the operator sees nothing of it, by running the existing tests that cover it (`RL/tests/claude-adapters.test.cjs`). Verify: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test --test-name-pattern='missing-transcript-path and marks|withdraw' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits 0, saved to `PHASE/scratch/withdraw-tests.txt`.

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Change the test `stop-arm logs missing-transcript-path and marks the pending record deferred` to expect one stdout line that parses as JSON with a `systemMessage` matching `/no transcript path/` and `/next prompt withdraws/` and no `decision` key, and exactly one `missing-transcript-path` line in the log (`RL/tests/claude-adapters.test.cjs`). Verify: `node --check .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits 0.
- [ ] T005 Run the red test before the source edit (`PHASE/scratch/red.txt`). Verify: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test --test-name-pattern='missing-transcript-path and marks' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits 1 with `fail 1`, and the failure names the empty stdout.
- [ ] T006 Write the notice after the stamp in the missing-transcript branch, inside a `try` that logs `stop-arm-error` with `stage: 'notice'` (`RL/claude/stop-arm.mjs`). Verify: `rg -c 'could not arm the hop because this Stop carried no transcript path' .skilled/hooks/session-relaunch/claude/stop-arm.mjs` prints 1 and `node --check .skilled/hooks/session-relaunch/claude/stop-arm.mjs` exits 0.
- [ ] T007 Extend the comment above the branch to say it prints the notice (`RL/claude/stop-arm.mjs`). Verify: `git diff -- .skilled/hooks/session-relaunch/claude/stop-arm.mjs` shows the comment, and no added line names a packet, phase, task or finding number.
- [ ] T008 Name the notice in the sentence on a missing `transcript_path` (`RL/README.md`). Verify: `rg -c 'no transcript path' .skilled/hooks/session-relaunch/README.md` prints 1 or more.
- [ ] T009 Name the notice in the `stop-arm.mjs` row (`RL/claude/README.md`). Verify: `rg -c 'no transcript path' .skilled/hooks/session-relaunch/claude/README.md` prints 1 or more.

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Run the changed test (`RL/tests/claude-adapters.test.cjs`). Verify: the command of T005 exits 0 with `pass 1` and `fail 0`, saved to `PHASE/scratch/green.txt`.
- [ ] T011 Run the Claude adapter and conformance suites (`RL/tests`). Verify: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs .skilled/hooks/session-relaunch/tests/adapter-conformance.test.cjs` exits 0 with `fail 0`.
- [ ] T012 Run the relaunch and OpenCode plugin suites (`RL/tests` and `.opencode/plugins/tests`). Verify: the command of T001 exits 0 with `fail 0` and the `tests` count in `PHASE/scratch/baseline.txt`, saved to `PHASE/scratch/final-suite.txt`.
- [ ] T013 Check that the fix adds no file, no record key and no log event (`FIX`). Verify: `git show --stat FIX` lists four files, `git show FIX | rg -c '^new file'` prints nothing with exit 1, and `git show FIX -- .skilled/hooks/session-relaunch/claude/stop-arm.mjs | rg -c "^\+.*logEvent\('"` prints 1, the `stop-arm-error` call of the guarded write.
- [ ] T014 Validate the phase folder (`PHASE`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/017-missing-transcript-notice --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed: `scratch/red.txt` shows the changed test failing and `scratch/green.txt` shows it passing
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

- [ ] CHK-001 [P0] Requirements documented in spec.md: `rg -c '^\| REQ-' spec.md` prints 6.
- [ ] CHK-002 [P0] Technical approach defined in plan.md: `rg -c '^## 3. ARCHITECTURE' plan.md` prints 1.
- [ ] CHK-003 [P1] The baseline count is saved before the first edit (T001).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `node --check` exits 0 on the adapter and the test file (T006, T004).
- [ ] CHK-011 [P0] The hook exits 0 on every path, including a write that throws.
- [ ] CHK-012 [P1] The write reuses `dependencies.write` and adds no helper function.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] AC-001 and AC-002 pass with their commands.
- [ ] CHK-021 [P0] The changed test failed before the edit (`scratch/red.txt`).
- [ ] CHK-022 [P1] The background-task notice test still passes (T011).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [ ] CHK-FIX-001 [P0] The finding class is `instance-only`: the missing-transcript branch is the one Stop path the operator asked to explain.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory: `rg -n 'markParked\(loopId, env\)' .skilled/hooks/session-relaunch/claude/stop-arm.mjs` lists four stamp calls, and the plan names what each prints after the change.
- [ ] CHK-FIX-003 [P0] Consumer inventory: Claude reads the Stop stdout, and no repository code parses it.
- [ ] CHK-FIX-004 [P0] The line holds fixed text and no payload field.
- [ ] CHK-FIX-005 [P1] Matrix axes listed in plan.md: Stop path crossed with stdout.
- [ ] CHK-FIX-006 [P1] The tests run with `AI_SESSION_CHILD` and `OPENCODE_DB` unset.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to the fix commit, named in `goal.md` section 4.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secrets: the change reads no credential.
- [ ] CHK-031 [P0] No payload text reaches the printed line.
- [ ] CHK-032 [P1] N/A: no auth surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` all name the notice and the kept withdrawal.
- [ ] CHK-041 [P1] The changed comment names no packet, phase or task number (T007).
- [ ] CHK-042 [P2] Both READMEs name the notice (T008, T009).
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
