---
title: "Tasks: Phase 15: wrapper-start-checksum"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "wrapper start checksum tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 15: wrapper-start-checksum

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
- [ ] T002 Confirm the guard tests the hop value only (`.skilled/bin/skilled-loop`). Verify: `rg -n 'started_wrapper_checksum' .skilled/bin/skilled-loop` prints line 1208 and line 1472, and line 1472 holds `-n "$hop_wrapper_checksum"` and no `-n "$started_wrapper_checksum"`.
- [ ] T003 Confirm one line calls `cksum` (`.skilled/bin/skilled-loop`). Verify: `rg -c '\bcksum\b' .skilled/bin/skilled-loop` prints 1.

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add the test `a hop prints and logs nothing when the wrapper file could not be read at loop start`. It resolves the real `cksum` with `command -v cksum`, writes a stub into `sandbox.binDir` that exits 1 with no output on its first call and runs the real `cksum` on later calls, and asserts two runtime invocations, no `changed on disk` line and no `wrapper-changed` log line (`RL/tests/skilled-loop-wrapper-launch-arguments.test.cjs`). Verify: `node --check .skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs` exits 0.
- [ ] T005 Run the red test before the source edit (`PHASE/scratch/red.txt`). Verify: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test --test-name-pattern='wrapper file' .skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs` exits 1 with `tests 5`, `pass 4` and `fail 1`, and the failing line names the new test with the false note in its message. A red run that passes stops the build, because the stub then did not reach the start read.
- [ ] T006 Require the start checksum in the comparison (`.skilled/bin/skilled-loop`). Verify: `rg -n -o 'if \[\[ -n "\$started_wrapper_checksum" && -n "\$hop_wrapper_checksum"' .skilled/bin/skilled-loop` prints one line.
- [ ] T007 Rewrite the comment above the comparison so it names both reads (`.skilled/bin/skilled-loop`). Verify: `git diff -- .skilled/bin/skilled-loop` shows the changed comment lines and the changed condition only, and no added line names a packet, phase, task or finding number.
- [ ] T008 Check the README sentence on an empty checksum against the fixed block (`RL/README.md`). Verify: `rg -n -o 'A checksum that comes back empty[^.]*' .skilled/hooks/session-relaunch/README.md` prints line 112 and the sentence reads true for an empty read at loop start and at the hop. Edit it only if it does not, and record the result in `goal.md`.

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Run the five tests the name pattern selects (`RL/tests/skilled-loop-wrapper-launch-arguments.test.cjs`). Verify: the command of T005 exits 0 with `tests 5`, `pass 5` and `fail 0`, saved to `PHASE/scratch/green.txt`.
- [ ] T010 Run the relaunch and OpenCode plugin suites (`RL/tests` and `.opencode/plugins/tests`). Verify: the command of T001 exits 0 with `fail 0` and a `tests` count one above the one in `PHASE/scratch/baseline.txt`, saved to `PHASE/scratch/final-suite.txt`.
- [ ] T011 Check the wrapper parses (`.skilled/bin/skilled-loop`). Verify: `bash -n .skilled/bin/skilled-loop` exits 0.
- [ ] T012 Check that the fix adds no file and no record key (`FIX`). Verify: `git show --stat FIX` lists the wrapper and the test file, plus the README only when T008 changed it, and `git show FIX | rg -c '^new file'` prints nothing with exit 1.
- [ ] T013 Validate the phase folder (`PHASE`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/015-wrapper-start-checksum --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed: `scratch/red.txt` shows the new test failing and `scratch/green.txt` shows 5 of 5
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **The notice and the log line this guards**: `../004-wrapper-change-notice/` and `../012-wrapper-notice-log/`
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

A blocked task is marked `[B]` with its reason in `goal.md`. A `[B]` on T001 blocks every implementation task, because the count in T010 is read against the baseline.
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

- [ ] CHK-010 [P0] `bash -n` exits 0 on the wrapper and `node --check` exits 0 on the test file (T011, T004).
- [ ] CHK-011 [P0] The hop goes ahead in every row: each wrapper-file test asserts two runtime invocations.
- [ ] CHK-012 [P1] The change adds no helper function, no variable and no harness option.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] AC-001 and AC-002 pass with their commands.
- [ ] CHK-021 [P0] The new test failed before the edit (`scratch/red.txt`).
- [ ] CHK-022 [P1] The changed-file tests still print the note once and log one `wrapper-changed` line (`scratch/green.txt`).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [ ] CHK-FIX-001 [P0] The finding class is `instance-only`: line 1472 is the one place the wrapper compares its checksum.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory: `rg -n 'wrapper_checksum' .skilled/bin/skilled-loop` prints the definition, the start read and the hop read, and only the hop read compares.
- [ ] CHK-FIX-003 [P0] Consumer inventory: `rg -n 'started_wrapper_checksum' .skilled .opencode` lists the wrapper only.
- [ ] CHK-FIX-004 [P0] N/A: no security, path, parser or redaction fix. The invariant is that a change is reported only when both checksums were read and differ.
- [ ] CHK-FIX-005 [P1] Matrix axes listed in plan.md: start read crossed with hop read, with the row each test covers.
- [ ] CHK-FIX-006 [P1] The tests run with `AI_SESSION_CHILD` and `OPENCODE_DB` unset.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to the fix commit, named in `goal.md` section 4.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secrets: the change reads no credential.
- [ ] CHK-031 [P0] The `cksum` stub is written only inside the test sandbox and removed with it.
- [ ] CHK-032 [P1] N/A: no auth surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` all name the empty start read and the stub.
- [ ] CHK-041 [P1] The changed comment says why an empty read on either side is not a change, with no packet, phase or task number in it (T007).
- [ ] CHK-042 [P2] The README sentence at line 112 is checked against the fixed code (T008).
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
