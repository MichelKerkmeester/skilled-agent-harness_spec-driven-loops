---
title: "Tasks: Phase 2: packet-goal-fallback"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "packet goal fallback tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 2: packet-goal-fallback

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

**Task variables**: `CORE` is `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs`. `TESTS` is `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs`. `CLI_TESTS` is `.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs`. `PHASE` is this phase folder.

**Test environment**: run the suites as `env -u AI_SESSION_CHILD node --test <file>`, because a dispatched child marker changes how the relaunch hooks behave.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm that a Claude log with no goal entry carried no packet before the change (`CORE` at the parent of `c461b79a71`). Verify: `git show 'c461b79a71^:.skilled/hooks/session-relaunch/lib/relaunch-core.cjs' | rg -n 'if \(latest === null \|\| !latest.active\) return none'` prints one line.
  - **Evidence:** it printed `623:  if (latest === null || !latest.active) return none;` on 2026-11-13.
- [x] T002 Check the plan against a read-only review (`CORE`). Verify: each of the three review findings is answered in `implementation-summary.md` Key Decisions or Known Limitations.
  - **Evidence:** Fable 5.2 at medium effort through the `claude2` account, read-only, reported three findings. The orchestrator checked each in the code. Finding 2 is closed by the `whole` flag. Findings 1 and 3 are narrowed by skipping finished goal docs. No review file is saved in this packet.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add the fallback test and the ended or unreadable test (`TESTS`). Verify: `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` with the source unchanged prints `pass 11` and `fail 1` for the resolver tests, saved to `PHASE/scratch/red.txt`.
  - **Evidence:** `scratch/red.txt` shows `tests 12`, `pass 11` and `fail 1`. The failing test is `resolveGoalPacket gives a Claude sender with no goal entry the nearest unfinished packet goal` with `the parent holds the only goal.md`.
- [x] T004 Return the `whole` flag next to the newest goal entry (`CORE`). Verify: `rg -n 'return \{ latest, whole: tail.whole \}' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` prints one line.
  - **Evidence:** it printed line 591 on 2026-11-13.
- [x] T005 Add `OPEN_CRITERION_PATTERN` and `packetGoalIsSettable` (`CORE`). Verify: `rg -n 'OPEN_CRITERION_PATTERN|function packetGoalIsSettable' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` prints the constant, the function and its use.
  - **Evidence:** lines 62, 603 and 609 on 2026-11-13.
- [x] T006 Carry the nearest settable packet when a log read whole holds no goal entry (`CORE`). Verify: the T003 command prints `pass 159` and `fail 0`, saved to `PHASE/scratch/green.txt`.
  - **Evidence:** `scratch/green.txt` shows `tests 159`, `pass 159`, `fail 0`. A rerun on 2026-11-13 printed the same with exit 0.
- [x] T007 Add the `prepare` test for a Claude sender with no goal (`CLI_TESTS`). Verify: `env -u AI_SESSION_CHILD node --test --test-name-pattern 'prepare gives a Claude sender with no goal' .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` exits 0 with `pass 1`.
  - **Evidence:** rerun on 2026-11-13: `tests 1`, `pass 1`, `fail 0`, exit 0. No run of this test before the source edit is saved.
- [x] T008 State the fallback in the Claude row and the troubleshooting list (`.skilled/hooks/session-relaunch/README.md`). Verify: `rg -n 'A leaf phase goal has no slice budget and gives way to its parent|never had a goal set also leaves it out' .skilled/hooks/session-relaunch/README.md` prints two lines.
  - **Evidence:** lines 180 and 307 on 2026-11-13.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Check that the whole-log guard is load-bearing (`CORE`). Verify: with `if (!whole) return none;` removed, `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` fails on `a log read only in part`.
  - **Evidence:** reported by the orchestrator. This author did not rerun the mutation. The line is back at `relaunch-core.cjs:654`.
- [x] T010 Run the relaunch and OpenCode plugin suites (`.skilled/hooks/session-relaunch/tests`). Verify: `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with `fail 0`.
  - **Evidence:** run by the orchestrator in worktree 366 at the final state: exit 0, 1536 of 1536.
- [x] T011 Run the goal hook suites (`.skilled/hooks/goal`). Verify: `env -u AI_SESSION_CHILD node --test .skilled/hooks/goal/**/*.test.cjs .skilled/hooks/goal/**/*.test.mjs` exits 0 with `fail 0`.
  - **Evidence:** run by the orchestrator: exit 0, 200 of 200.
- [x] T012 Run the Pi adapter suite (`.skilled/hooks/session-relaunch/pi/session-relaunch.test.ts`). Verify: `npx vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/session-relaunch/pi/session-relaunch.test.ts` prints 62 passed.
  - **Evidence:** run by the orchestrator: 62 of 62.
- [x] T013 Check the core's syntax (`CORE`). Verify: `node --check .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` exits 0.
  - **Evidence:** exit 0 on 2026-11-13.
- [x] T014 Check that no module was added and the record is not touched (`c461b79a71`). Verify: `git show --summary --format= c461b79a71 | rg 'create mode'` prints nothing, and `git show c461b79a71 -- .skilled/hooks/session-relaunch/lib/relaunch-core.cjs | rg '^[+-]' | rg -i 'record|relaunchFile'` prints nothing.
  - **Evidence:** both printed nothing with exit 1 on 2026-11-13. `git show --name-only --format= c461b79a71` lists four files, all modified.
- [x] T015 Validate the phase folder (`PHASE`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/002-packet-goal-fallback --strict` prints `RESULT: PASSED`.
  - **Evidence:** printed `Errors: 0  Warnings: 0` and `RESULT: PASSED` on 2026-11-13, recorded in `goal.md` section 4.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: `scratch/red.txt` shows the fallback test failing and `scratch/green.txt` shows 159 of 159
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Code commit**: `c461b79a71` on branch `worktrees/366-hop-after-question-dialog`
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
- [x] CHK-002 [P0] Technical approach defined in plan.md, with the rejected alternative in `implementation-summary.md`
- [x] CHK-003 [P1] The gap is confirmed in the code before the change (T001)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `node --check .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` exits 0
- [x] CHK-011 [P0] The resolver never throws into `prepare`: `resolveGoalPacketResult` wraps every branch in a `try` (`relaunch-core.cjs:887`), and the log read has its own `try` (`relaunch-core.cjs:644`), by inspection
- [x] CHK-012 [P1] A `goal.md` that throws is skipped for that root, by inspection of the `catch` in `packetGoalIsSettable`
- [x] CHK-013 [P1] The new code reuses `packetLineage`, `firstUsablePacket`, `goalPacketProblem` and `readPacketGoal`
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] AC-001 to AC-003 pass with their commands
- [x] CHK-021 [P0] AC-004 holds in the fallback test assertions
- [x] CHK-022 [P1] A finished goal, a goal with no criteria, an open box only in the log and an over-budget slice each carry nothing
- [x] CHK-023 [P1] A met, failed or cleared goal, a log read in part and a missing log each carry nothing
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] The finding class is `instance-only`: only `claudeGoalPacketResult` reads a Claude session log for a goal.
- [x] CHK-FIX-002 [P0] Same-class producer inventory: `rg -n 'latestGoalLogEntry\(' .skilled/hooks/session-relaunch --glob '*.cjs'` prints the definition and one caller.
- [x] CHK-FIX-003 [P0] Consumer inventory: `latestGoalLogEntry` has one caller, and `skilled-loop` reads the note field as before.
- [x] CHK-FIX-004 [P0] The carried packet passes `goalPacketProblem`, the same containment check as every goal packet. No new path parser is added.
- [x] CHK-FIX-005 [P1] Matrix axes listed in plan.md: goal entry, log read and lineage goal state.
- [x] CHK-FIX-006 [P1] The suites run with `AI_SESSION_CHILD` unset.
- [x] CHK-FIX-007 [P1] Evidence is pinned to commit `c461b79a71`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets: the resolver reads no credential
- [x] CHK-031 [P0] The note carries a packet path and never goal text
- [x] CHK-032 [P1] N/A: no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` all name `packetGoalIsSettable` and the `whole` flag
- [x] CHK-041 [P1] `packetGoalIsSettable` and the `latest === null` branch carry a comment on why
- [x] CHK-042 [P2] The session-relaunch README states the fallback (T008)
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

**Verification Date**: 2026-11-13
<!-- /ANCHOR:summary -->

---
