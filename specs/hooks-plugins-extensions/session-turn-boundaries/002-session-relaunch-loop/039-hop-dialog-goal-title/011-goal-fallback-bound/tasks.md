---
title: "Tasks: Phase 11: goal-fallback-bound"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "goal fallback bound tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 11: goal-fallback-bound

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

**Task variables**: `RL` is `.skilled/hooks/session-relaunch`. `PHASE` is this phase folder. `FIX` is commit `eba587cae7`.

**Test environment**: run the suites as `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test <file>`, because a dispatched child marker and an inherited OpenCode database path both change how the relaunch tests behave.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the fallback took the whole lineage before the fix (`RL/lib/relaunch-core.cjs`). Verify: `git show eba587cae7^:.skilled/hooks/session-relaunch/lib/relaunch-core.cjs | rg -n 'firstUsablePacket\(lineage'` prints line 677.
  - **Evidence:** line 677 read `packet: firstUsablePacket(lineage, roots, (candidate) => packetGoalIsSettable(candidate, roots)),`. The output is quoted in `spec.md` Measured Behavior.
- [x] T002 Confirm `packetLineage` walks every parent up to `specs` and the active-goal branch builds its own list (`RL/lib/relaunch-core.cjs`). Verify: `rg -n 'packetLineage|lineage, \.\.\.named' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` prints lines 509, 649 and 692.
  - **Evidence:** the three lines printed on 2026-11-14. `packetLineage` loops while `validSpecFolder(current)` and pushes `path.posix.dirname(current)` each time, and line 692 reads `const candidates = [...lineage, ...named].slice(0, GOAL_LOG_MAX_CANDIDATES);`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add the test with the only open goal two levels above the note's folder (`RL/tests/relaunch-core.test.cjs`). Verify: the red run saved in `PHASE/scratch/red.txt` prints `✖ resolveGoalPacket looks no further up than the parent of the note folder`, `ℹ pass 1` and `ℹ fail 1`.
  - **Evidence:** `scratch/red.txt:3` shows the failure, `scratch/red.txt:6` and `:7` show the counts, and `scratch/red.txt:17` shows `the only open goal is two levels up` with `specs/hooks/023-session-relaunch-loop` where an empty string was expected. The test starts at `RL/tests/relaunch-core.test.cjs:2828`.
- [x] T004 Bound the fallback to the note's folder and its parent (`RL/lib/relaunch-core.cjs`). Verify: `rg -n 'lineage.slice\(0, 2\)' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` prints line 678, and `PHASE/scratch/green.txt` prints `✔ resolveGoalPacket looks no further up than the parent of the note folder`.
  - **Evidence:** line 678 reads `const nearby = lineage.slice(0, 2);` and line 681 passes `nearby` to `firstUsablePacket`. `scratch/green.txt:3` shows the test passing.
- [x] T005 Comment why the parent stays and why nothing further up counts (`RL/lib/relaunch-core.cjs`). Verify: `sed -n 675,677p .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` prints the three comment lines.
  - **Evidence:** the comment names the reason, that nothing ties a packet goal to the session beyond where the note sits and that a leaf phase binds through its parent. It names no packet number.
- [x] T006 State the bound in the Claude row of the goal table (`RL/README.md`). Verify: `rg -n 'no packet further up' .skilled/hooks/session-relaunch/README.md` prints one line.
  - **Evidence:** it printed line 182 on 2026-11-14, and the row now reads "the spec folder first and then its parent and no packet further up".
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Run the two tests the name pattern selects (`RL/tests/relaunch-core.test.cjs`). Verify: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test --test-name-pattern='looks no further up|nearest unfinished packet goal' .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0 with `tests 2`, `pass 2` and `fail 0`.
  - **Evidence:** `scratch/green.txt:2` to `scratch/green.txt:7`. This author did not rerun the pair, so the evidence is the saved file.
- [x] T008 Run the relaunch and OpenCode plugin suites (`RL/tests` and `.opencode/plugins/tests`). Verify: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with 1548 of 1548.
  - **Evidence:** the commit message of `eba587cae7` records 1548 of 1548 from 1547 before, and the parent goal log records the same count after the last child. The run is the orchestrator's and its output is not saved in this packet. On 2026-11-14 the same suite with nothing else running passed 1548 of 1548, exit 0, on the merged tree `be56fabc7b`, and 1550 of 1550, exit 0, after children 012 and 013. The earlier 3 failures came from several agents running the suite at the same time, and none of them touched `relaunch-core.test.cjs`.
- [x] T009 Check that the fix adds no file and no record key (`FIX`). Verify: `git show --stat eba587cae7` lists three files, and `git show eba587cae7 | rg -c '^new file'` prints nothing.
  - **Evidence:** the stat listed the README, `relaunch-core.cjs` and `relaunch-core.test.cjs`, 30 insertions and 2 deletions. The new-file count printed nothing with exit 1.
- [x] T010 Check the changed source parses (`RL/lib/relaunch-core.cjs`). Verify: `node --check .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` exits 0.
  - **Evidence:** exit 0 on 2026-11-14.
- [x] T011 Validate the phase folder (`PHASE`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/011-goal-fallback-bound --strict` prints `RESULT: PASSED`.
  - **Evidence:** recorded in `goal.md` section 4.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: `scratch/red.txt` shows one of the two selected tests failing and `scratch/green.txt` shows 2 of 2
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **The fallback this bounds**: `../002-packet-goal-fallback/`
- **The ended-goal carry beside it**: `../010-goal-ending-carry/`
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

A blocked task is marked `[B]` with its reason in `goal.md`. A `[B]` on T001 blocks every implementation task.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md: `rg -c '^\| REQ-' spec.md` prints 5
- [x] CHK-002 [P0] Technical approach defined in plan.md, with the rejected alternatives in `implementation-summary.md`
- [x] CHK-003 [P1] The pre-change call is confirmed from the parent commit (T001)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `node --check` exits 0 on the changed source (T010)
- [x] CHK-011 [P0] The test asserts three rows: an empty string for a leaf folder when the only open goal is two levels up, the parent's goal for the folder whose parent holds it, and the parent's goal for the leaf folder once that parent holds an open goal, per the diff of `eba587cae7`
- [x] CHK-012 [P1] A log that is unreadable or read in part still returns no packet, by inspection of the `whole` check at `relaunch-core.cjs:674`, which sits ahead of the changed line
- [x] CHK-013 [P1] The change reuses `packetLineage`, `firstUsablePacket` and `packetGoalIsSettable` and adds no helper
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] AC-001 and AC-002 pass with their commands
- [x] CHK-021 [P0] The new test failed before the edit (`scratch/red.txt:3`)
- [x] CHK-022 [P1] The existing fallback test still passes (`scratch/green.txt:2`)
- [x] CHK-023 [P1] The active-goal branch still builds `[...lineage, ...named]` (`relaunch-core.cjs:692`)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] The finding class is `instance-only`: the no-goal-entry branch is the one producer of a fallback packet.
- [x] CHK-FIX-002 [P0] Same-class producer inventory: `rg -n 'packetLineage|lineage' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` prints the definition at 509 to 516, the fallback at 678 and the active-goal list at 692, and only 678 is the fallback.
- [x] CHK-FIX-003 [P0] Consumer inventory: no symbol changed, and the one call site takes a shorter array, by T009.
- [x] CHK-FIX-004 [P0] N/A: no security, path, parser or redaction fix. The path and link checks of `firstUsablePacket` are untouched.
- [x] CHK-FIX-005 [P1] Matrix axis listed in plan.md: where the only open goal sits, in the folder, in its parent or two levels up.
- [x] CHK-FIX-006 [P1] The test runs with `AI_SESSION_CHILD` and `OPENCODE_DB` unset.
- [x] CHK-FIX-007 [P1] Evidence is pinned to fix commit `eba587cae7`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets: the change reads no credential
- [x] CHK-031 [P0] The packet value still passes `packetGoalIsSettable` before it is returned, so the written field is validated as before
- [x] CHK-032 [P1] N/A: no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` all name `lineage.slice(0, 2)` and the note's folder and its parent
- [x] CHK-041 [P1] The changed line carries a comment on why the parent stays and nothing further up counts (T005)
- [x] CHK-042 [P2] The session-relaunch README states the bound (T006)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Test runs live under `scratch/` only
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
