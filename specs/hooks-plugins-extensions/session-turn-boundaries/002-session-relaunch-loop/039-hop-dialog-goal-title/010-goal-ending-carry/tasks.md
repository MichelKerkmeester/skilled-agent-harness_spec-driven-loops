---
title: "Tasks: Phase 10: goal-ending-carry"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "goal ending carry tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 10: goal-ending-carry

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

**Task variables**: `RL` is `.skilled/hooks/session-relaunch`. `PHASE` is this phase folder. `FIX` is commit `aee4ae8080`. Line numbers of the sources and tests are the lines of `FIX`, because later commits move them.

**Test environment**: run the suites as `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test <files>`, because a dispatched child marker and an inherited history database change how the relaunch hooks and their tests behave.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm that nothing read or wrote `goal_ended` before the fix (`RL/lib/relaunch-core.cjs`). Verify: `git show aee4ae8080^:.skilled/hooks/session-relaunch/lib/relaunch-core.cjs | rg -c 'goal_ended'` prints nothing with exit 1, and the same for `bin/session-relaunch.cjs` and `README.md`.
  - **Evidence:** all three printed nothing with exit 1 on 2026-11-14.
- [x] T002 Confirm that a cleared goal and a goal with no log entry reached the same empty result before the fix (`RL/lib/relaunch-core.cjs`). Verify: `git show aee4ae8080^:.skilled/hooks/session-relaunch/lib/relaunch-core.cjs | rg -n 'if \(!latest.active\) return none|if \(!whole\) return none'` prints lines 654 and 660.
  - **Evidence:** line 660 read `if (!latest.active) return none;`, so an ended goal returned the same value as a session that never had one. The pre-change absence of `ended` shows in `scratch/red.txt:22` and `scratch/red.txt:44`, quoted in `spec.md` Measured Behavior.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add the resolver test and the receiver test (`RL/tests/relaunch-core.test.cjs`). Verify: `PHASE/scratch/red.txt` prints `✖ resolveGoalPacketResult says when the Claude goal has ended` and `✖ a goal the sender ended stays ended for a receiver that sets none`.
  - **Evidence:** `scratch/red.txt:2` and `scratch/red.txt:3`. The tests sit at lines 2863 and 2890 of `FIX`.
- [x] T004 Add the recorder test (`RL/tests/relaunch-core.test.cjs`). Verify: `PHASE/scratch/red.txt` prints `✖ recordGoalPacket writes and removes the mark of an ended goal`.
  - **Evidence:** `scratch/red.txt:4`, with `false !== true` at `scratch/red.txt:68`. The test sits at line 3102 of `FIX`.
- [x] T005 Add the two-hop `prepare` test (`RL/tests/session-relaunch-cli.test.cjs`). Verify: `PHASE/scratch/red.txt` prints `tests 4`, `pass 0` and `fail 4`.
  - **Evidence:** `scratch/red.txt:5` shows the `prepare` test failing with `ended: undefined` where `'true'` was expected (`scratch/red.txt:93` and `scratch/red.txt:94`), and `scratch/red.txt:6` to `scratch/red.txt:9` show the totals. The test sits at line 2773 of `FIX`.
- [x] T006 Return `ended` from every path of the resolver and take `handoffPath` (`RL/lib/relaunch-core.cjs`). Verify: `PHASE/scratch/green.txt` prints `✔ resolveGoalPacketResult says when the Claude goal has ended`.
  - **Evidence:** `scratch/green.txt:2`. `claudeGoalPacketResult` returns `{ ...none, ended: true }` at lines 673 and 680 of `FIX`, and `resolveGoalPacketResult` declares `none` with `ended: false` at line 910.
- [x] T007 Add the lookup of the claimed note and call it when the log has no goal entry (`RL/lib/relaunch-core.cjs`). Verify: `PHASE/scratch/green.txt` prints `✔ a goal the sender ended stays ended for a receiver that sets none`.
  - **Evidence:** `scratch/green.txt:3`. `claimedNoteEndedGoal` sits at line 632 of `FIX` and its call at line 673, before the `if (!whole) return none;` at line 674, so a log read only in part still reports the ending.
- [x] T008 Write and remove `goal_ended` in `recordGoalPacket` (`RL/lib/relaunch-core.cjs`). Verify: `PHASE/scratch/green.txt` prints `✔ recordGoalPacket writes and removes the mark of an ended goal`.
  - **Evidence:** `scratch/green.txt:4`. Lines 978 to 980 of `FIX` compute `markEnded = ended && goalPacket === ''` and write `'true'` or `null`.
- [x] T009 Pass `handoffPath` and `ended` from the CLI (`RL/bin/session-relaunch.cjs`). Verify: `PHASE/scratch/green.txt` prints `✔ prepare marks an ended Claude goal in the note and keeps it ended one hop later`.
  - **Evidence:** `scratch/green.txt:5`. The helper passes `handoffPath` at line 400 and `ended` at lines 405 and 407 of `FIX`. `prepare` and `keep` both reach it through `validatedNote`, which calls it at line 485 and is called at lines 545 and 636.
- [x] T010 Add `ended: false` to the three assertions that compare the whole result (`RL/tests/relaunch-core.test.cjs` and `.opencode/plugins/tests/opencode-goal-lifecycle.test.cjs`). Verify: `git show aee4ae8080 --format= -- .opencode/plugins/tests/opencode-goal-lifecycle.test.cjs | rg -c "^\+.*ended: false"` prints 1, and the same command on `relaunch-core.test.cjs` shows `+    ended: false,` inside the hunks headed by the tests named `the resolver result carries the packet and the reason together` and `an active goal with no text names the empty goal, not a missing packet`.
  - **Evidence:** the OpenCode diff changes `{ packet: packetPath, reason: '' }` to `{ packet: packetPath, reason: '', ended: false }`, and the two hunks in `relaunch-core.test.cjs` each add one `ended: false,` line to an existing `deepStrictEqual` object.
- [x] T011 Describe the field and the lookup (`RL/README.md`). Verify: `rg -n 'goal_ended' .skilled/hooks/session-relaunch/README.md` prints lines 177 and 182 of `FIX`.
  - **Evidence:** both lines are in the Goal Packet section, one in the opening paragraph and one in the Claude row of the table.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Run the four new tests (`RL/tests`). Verify: `PHASE/scratch/green.txt` prints `tests 4`, `pass 4` and `fail 0`.
  - **Evidence:** `scratch/green.txt:6` to `scratch/green.txt:9`.
- [x] T013 Run the relaunch and OpenCode plugin suites (`RL/tests`). Verify: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with 1547 of 1547.
  - **Evidence:** the fix commit message records 1547 of 1547, from 1543 before. This author reran the same command on 2026-11-14 on the working tree, which also holds the next commit's test: exit 0, tests 1548, pass 1548, fail 0. The 1547 figure was not rerun on the tree of `aee4ae8080` alone.
- [x] T014 Check that the fix adds no module and leaves the wrapper alone (`FIX`). Verify: `git show --stat aee4ae8080` lists six files with none under `.skilled/bin`, and `git show aee4ae8080 | rg -c '^new file'` prints nothing with exit 1.
  - **Evidence:** the stat listed the OpenCode lifecycle test, the README, `session-relaunch.cjs`, `relaunch-core.cjs` and the two relaunch test files. The new-file count printed nothing with exit 1 on 2026-11-14.
- [x] T015 Check the two changed sources parse (`RL/lib` and `RL/bin`). Verify: `node --check` on `lib/relaunch-core.cjs` and `bin/session-relaunch.cjs` exits 0 for each.
  - **Evidence:** both exited 0 on 2026-11-14, run on the working tree, which also holds the later commit that changes `relaunch-core.cjs`.
- [x] T016 Validate the phase folder (`PHASE`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/010-goal-ending-carry --strict` prints `RESULT: PASSED`.
  - **Evidence:** recorded in `goal.md` section 4.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: `scratch/red.txt` shows all four new tests failing and `scratch/green.txt` shows all four passing
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **The fallback this amends**: `../002-packet-goal-fallback/`
- **The change that bounds the fallback next**: `../011-goal-fallback-bound/`
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

- [x] CHK-001 [P0] Requirements documented in spec.md: `rg -c '^\| REQ-' spec.md` prints 8
- [x] CHK-002 [P0] Technical approach defined in plan.md, with the rejected wrapper environment variable in `implementation-summary.md`
- [x] CHK-003 [P1] The pre-change gap is confirmed from the parent commit (T001 and T002)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `node --check` exits 0 on the two changed sources (T015)
- [x] CHK-011 [P0] The resolver test asserts `ended` for a met, failed, cleared, active and absent goal, so no path of the result lacks the key
- [x] CHK-012 [P1] A note that cannot be read or parsed is skipped, by inspection of the `try` and `catch` in `claimedNoteEndedGoal` at lines 636 to 642 of `FIX`
- [x] CHK-013 [P1] The lookup reuses `parseHandoff`, `readHandoffText` and `safeDirectory`, the helpers the note readers already use
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] AC-001 to AC-004 pass with their commands
- [x] CHK-021 [P0] All four new tests failed before the edit (`scratch/red.txt`)
- [x] CHK-022 [P1] A goal set in a later session is carried and takes the mark away, and a note another session claimed says nothing (the receiver test and the recorder test)
- [x] CHK-023 [P1] A log read only in part still reports the ending (the receiver test, 17 entries of 1 MiB)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] The finding class is `cross-consumer`: the resolver's result changed shape for the CLI, the recorder, two test files and the README.
- [x] CHK-FIX-002 [P0] Same-class producer inventory: `rg -n 'goal_ended'` over the changed sources of `FIX` prints lines 639, 956, 979 and 980 of `relaunch-core.cjs` and none in the CLI.
- [x] CHK-FIX-003 [P0] Consumer inventory: `rg -l 'resolveGoalPacketResult|recordGoalPacket'` over `.skilled` and `.opencode` lists four files, two sources and two tests, and the two tests were updated (T010).
- [x] CHK-FIX-004 [P0] N/A: no security, path, parser or redaction fix. The lookup reads names from the outgoing note's own folder and follows no path from a note's content.
- [x] CHK-FIX-005 [P1] Matrix axes listed in plan.md: the newest goal entry, the claimed note and the log read whole or in part.
- [x] CHK-FIX-006 [P1] The suites run with `AI_SESSION_CHILD` and `OPENCODE_DB` unset.
- [x] CHK-FIX-007 [P1] Evidence is pinned to fix commit `aee4ae8080`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets: the lookup reads note frontmatter and no credential
- [x] CHK-031 [P0] The mark holds the word `true` and no path or goal text, so a receiver opens nothing the mark names
- [x] CHK-032 [P1] N/A: no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` all name `goal_ended`, `claimedNoteEndedGoal` and the amendment of sibling 002
- [x] CHK-041 [P1] The goal-recording helper in the CLI carries a comment on why an ended goal is marked in the note (`bin/session-relaunch.cjs` lines 388 and 389 of `FIX`)
- [x] CHK-042 [P2] The session-relaunch README names the field and the lookup (T011)
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
