---
title: "Tasks: Phase 7: killer-test-margin"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "killer test margin tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 7: killer-test-margin

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

**Task variables**: `RL` is `.skilled/hooks/session-relaunch`. `PHASE` is this phase folder. `FIX` is commit `8a113b68ae`.

**Test environment**: run the suites as `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test <file>`, because a dispatched child marker and an inherited database path both change how the hooks and plugins tests behave.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the killer polls every 100 ms (`RL/lib/killer.cjs`). Verify: `rg -n 'POLL_INTERVAL_MS = ' .skilled/hooks/session-relaunch/lib/killer.cjs` prints line 22 with the value 100.
  - **Evidence:** it printed `22:const POLL_INTERVAL_MS = 100;` on 2026-11-14. Lines 169 and 199 wait `Math.min(POLL_INTERVAL_MS, remaining)` between checks.
- [x] T002 Confirm the test's margin before the change (`RL/tests/killer.test.cjs`). Verify: `git show FIX^:.skilled/hooks/session-relaunch/tests/killer.test.cjs | rg -n 'idleMs: 400|timeoutMs: 450'` prints both values on adjacent lines.
  - **Evidence:** the diff of `8a113b68ae` shows `idleMs: 400` as context and `timeoutMs: 450` as the removed line. The deadline sat 50 ms past the idle window.
- [x] T003 Write the load script (`PHASE/scratch/killer-load.sh`). Verify: `bash -n PHASE/scratch/killer-load.sh` exits 0 and the script prints `parallel runs: <N>, failed runs: <M>`.
  - **Evidence:** the script starts the one test N times in the background with `--test-name-pattern` and counts the copies that exit nonzero. Its output line appears in `scratch/red.txt:2` and `scratch/green.txt:2`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Reproduce the failure at 450 ms (`PHASE/scratch/red.txt`). Verify: `bash scratch/killer-load.sh 160 <output dir>` prints a nonzero `failed runs`, saved to `PHASE/scratch/red.txt`.
  - **Evidence:** `scratch/red.txt:2` reads `parallel runs: 160, failed runs: 14`. The sample failure at `scratch/red.txt:18` is `ENOENT` on `target-signal`. This is the child's red run, because the change is to a test and the load at 450 ms is what fails first.
- [x] T005 Widen the deadline to 1000 ms and add the comment (`RL/tests/killer.test.cjs`). Verify: `rg -n 'timeoutMs: 1000' .skilled/hooks/session-relaunch/tests/killer.test.cjs` prints line 790, and lines 788 and 789 hold the comment on the 100 ms poll.
  - **Evidence:** both lines printed on 2026-11-14 from the worktree at its current head. The change is `8a113b68ae`: 3 insertions and 1 deletion.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Run the load twice at 1000 ms (`PHASE/scratch/green.txt`). Verify: `bash scratch/killer-load.sh 160 <output dir>` prints `failed runs: 0` in each of two rounds, saved to `PHASE/scratch/green.txt`.
  - **Evidence:** `scratch/green.txt:2` and `scratch/green.txt:3` both read `parallel runs: 160, failed runs: 0`.
- [x] T007 Run the whole killer test file alone (`RL/tests/killer.test.cjs`). Verify: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/killer.test.cjs` exits 0 with `tests 64` and `fail 0`.
  - **Evidence:** `scratch/green.txt:15` to `scratch/green.txt:22` show tests 64, pass 64, fail 0 and a duration of 40372 ms.
- [x] T008 Run the relaunch and OpenCode plugin suites (`RL/tests`). Verify: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with 1543 of 1543.
  - **Evidence:** the commit message of `8a113b68ae` records 1543 of 1543, unchanged. This author did not rerun it, because the worktree now holds later commits that change the count, and no output of that run is saved in `scratch/`.
- [x] T009 Check the change adds no module and touches no product code (`FIX`). Verify: `git show --stat 8a113b68ae` lists one file, `killer.test.cjs`, and `git show 8a113b68ae | rg -c '^new file'` prints nothing.
  - **Evidence:** the stat read `1 file changed, 3 insertions(+), 1 deletion(-)`. The new-file count printed nothing with exit 1.
- [x] T010 Check the changed test parses (`RL/tests/killer.test.cjs`). Verify: `node --check .skilled/hooks/session-relaunch/tests/killer.test.cjs` exits 0.
  - **Evidence:** it exited 0 on 2026-11-14.
- [x] T011 Validate the phase folder (`PHASE`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/007-killer-test-margin --strict` prints `RESULT: PASSED`.
  - **Evidence:** recorded in `goal.md` section 4.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: `scratch/red.txt` shows 14 of 160 failed at 450 ms and `scratch/green.txt` shows 0 of 160 in two rounds at 1000 ms
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **The research that asked for this**: `../research/research.md` section 6 and section 9 rank 14
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

A blocked task is marked `[B]` with its reason in `goal.md`. A `[B]` on T003 blocks the red run and so every later task.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md: `rg -c '^\| REQ-' spec.md` prints 4
- [x] CHK-002 [P0] Technical approach defined in plan.md, with the rejected alternatives in `implementation-summary.md`
- [x] CHK-003 [P1] The poll interval and the old margin are confirmed from the source and the parent commit (T001 and T002)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `node --check` exits 0 on the changed test (T010)
- [x] CHK-011 [P0] No product file changed, by T009
- [x] CHK-012 [P1] The comment names the 100 ms poll as the reason and carries no task or packet id, by `sed -n 788,789p .skilled/hooks/session-relaunch/tests/killer.test.cjs`
- [x] CHK-013 [P1] The test's assertions are unchanged, so the test checks what it checked before
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] AC-001 and AC-002 pass with their commands
- [x] CHK-021 [P0] The load at 450 ms failed 14 of 160 before the edit (`scratch/red.txt:2`)
- [x] CHK-022 [P1] The load at 1000 ms failed 0 of 160 in two rounds (`scratch/green.txt:2` and `scratch/green.txt:3`)
- [x] CHK-023 [P1] The whole killer file passes 64 of 64 (`scratch/green.txt:15` to `scratch/green.txt:18`)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] The finding class is `test-isolation`: one test's margin was thinner than the killer's poll interval allows under load.
- [x] CHK-FIX-002 [P0] Same-class producer inventory: `rg -n 'timeoutMs: ' .skilled/hooks/session-relaunch/tests/killer.test.cjs` lists five values at lines 691, 790, 973, 1026 and 1336. Only line 790 was named as failing and only it changed.
- [x] CHK-FIX-003 [P0] Consumer inventory: none. The value is a literal in one test.
- [x] CHK-FIX-004 [P0] N/A: no security, path, parser or redaction fix.
- [x] CHK-FIX-005 [P1] Matrix axes listed in plan.md: the deadline against the parallel load.
- [x] CHK-FIX-006 [P1] The runs use `env -u AI_SESSION_CHILD -u OPENCODE_DB`, by `scratch/killer-load.sh`.
- [x] CHK-FIX-007 [P1] Evidence is pinned to fix commit `8a113b68ae`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets: the change is a number and a comment in a test
- [x] CHK-031 [P0] N/A: no input reaches a runtime path
- [x] CHK-032 [P1] N/A: no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` all name the 450 ms to 1000 ms change and the 100 ms poll
- [x] CHK-041 [P1] The test carries a comment on why the deadline is 1000 ms
- [x] CHK-042 [P2] N/A: no README names this value
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Test runs and the load script live under `scratch/` only
- [x] CHK-051 [P1] No temporary file was left outside `scratch/`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-14
<!-- /ANCHOR:summary -->

---
