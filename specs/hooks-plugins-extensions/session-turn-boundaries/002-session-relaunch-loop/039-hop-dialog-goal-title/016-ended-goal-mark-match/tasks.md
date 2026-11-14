---
title: "Tasks: Phase 16: ended-goal-mark-match"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "ended goal mark match tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 16: ended-goal-mark-match

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

**Task variables**: `RL` is `.skilled/hooks/session-relaunch`. `PHASE` is this phase folder. `FIX` is the commit that lands this phase. `PATTERN` is `ended-goal mark counts only|session log cannot be read`.

**Test environment**: run the suites as `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test <file>`, because a dispatched child marker and an inherited OpenCode database path both change how the relaunch tests behave.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Take the suite baseline before any edit (`RL/tests`). Verify: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0, and its `tests`, `pass` and `fail` lines and the exit status are saved in `PHASE/scratch/baseline.txt`. Observed: the orchestrator took the baseline on this tree after child 015 was committed (`f99d3c442d`): `ℹ tests 1551` at `scratch/baseline.txt:1563`, `ℹ pass 1551` at `:1565`, `ℹ fail 0` at `:1566`, exit 0. Not rerun, per the dispatch.
- [x] T002 Confirm the status-blind match and the two early returns (`RL/lib/relaunch-core.cjs`). Verify: the first command of `spec.md` Measured Behavior prints lines 639, 658 and 673, and `sed -n '661,665p' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` shows the failed-read return. Observed before the edit: the search printed `639:frontmatter.claimed_by === sessionId && frontmatter.goal_ended === 'true'`, `658:if (logPath === null) return none` and `673:if (claimedNoteEndedGoal(handoffPath, sessionId)) return`, exit 0. The second command printed lines 661 to 665 with the `catch { return none; }` at 663 to 665.
- [x] T003 Confirm the goal is resolved before the claimed notes are superseded (`RL/bin/session-relaunch.cjs`). Verify: the second command of `spec.md` Measured Behavior prints line 485 before lines 603 and 637. Observed: printed `485:  recordGoalPacket({ handoffPath`, then `603:  supersedeClaimedNotes(handoffPath` and `637:  supersedeClaimedNotes(handoffPath`, exit 0.

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add the test `the ended-goal mark counts only from the note this session claimed last`. It writes two notes with `writeHandoff` under two writer ids, both claimed by `GOAL_SESSION_ID`: an older one with `status: done`, an older `claimed_at` and `goal_ended: true`, and a newer one with `status: claimed` and no mark. With a whole log and no goal entry it expects `{ packet: GOAL_PARENT, reason: '', ended: false }`. It then removes the newer note and expects `ended: true` (`RL/tests/relaunch-core.test.cjs`). Verify: `node --check .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0. Observed: exited 0, and the test begins at `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:2958`. The writer ids `ses_olderw01` and `ses_newerw01` differ in their first eight characters, and each note's `claimed_at` and the older note's `goal_ended` are added by rewriting its frontmatter.
- [x] T005 Add the test `a goal the sender ended stays ended when the session log cannot be read`. With a marked claimed note it expects `ended: true` for a missing config folder and for a log path that is a directory, and with the mark removed it expects `{ packet: '', reason: '', ended: false }` (`RL/tests/relaunch-core.test.cjs`). Verify: `node --check .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0. Observed: exited 0, and the test begins at `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:2993`.
- [x] T006 Run the red tests before the source edit (`PHASE/scratch/red.txt`). Verify: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test --test-name-pattern='ended-goal mark counts only|session log cannot be read' .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 1 with `tests 2`, `pass 0` and `fail 2`. Observed: `scratch/red.txt:3` and `:4` print `✖` for both new tests, `ℹ tests 2` at `:5`, `ℹ pass 0` at `:7`, `ℹ fail 2` at `:8` and `exit=1` at `:68`.
- [x] T007 Keep only the note this session claimed last in `claimedNoteEndedGoal`, ordered by `claimed_at` with a missing value counted as oldest (`RL/lib/relaunch-core.cjs`). Verify: `rg -n 'claimed_at' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` prints a line inside `claimedNoteEndedGoal`. Observed: printed `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:644` inside the helper, which now spans `:635` to `:656`. A missing `claimed_at` reads as an empty string, which sorts below every ISO stamp.
- [x] T008 Ask the helper on the missing-log return and the failed-read return of `claudeGoalPacketResult` (`RL/lib/relaunch-core.cjs`). Verify: `rg -c 'claimedNoteEndedGoal\(handoffPath, sessionId\)' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` prints 4, or 3 when one guard serves both returns. Today it prints 2: the definition and one call. Observed: printed 4, exit 0. The calls sit at `:668` for the missing log, `:676` for the failed read and `:686` for a log with no goal entry, beside the definition at `:635`.
- [x] T009 Comment why the claimed-last note decides and why an unreadable log keeps the mark (`RL/lib/relaunch-core.cjs`). Verify: `git diff -- .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` shows the comment, and no added line names a packet, phase, task or finding number. Observed: the diff adds four comment lines above the helper and two above the missing-log return, and no added line carries a packet, phase, task or finding number.
- [x] T010 Correct the Claude row of the goal table (`RL/README.md`). Verify: `rg -c 'claimed last' .skilled/hooks/session-relaunch/README.md` prints 1 or more, and `rg -c 'With no readable log the goal cannot be proven, so no field is written' .skilled/hooks/session-relaunch/README.md` prints nothing with exit 1. Observed: `rg -c 'claimed last'` printed 1 with exit 0, both on `.skilled/hooks/session-relaunch/README.md:182`; the old sentence search printed nothing with exit 1. The row now names the note claimed last for the mark and says a mark that note carries still stands without a readable log.

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Run the two new tests and the two existing ended-goal tests (`RL/tests/relaunch-core.test.cjs`). Verify: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test --test-name-pattern='ended-goal mark counts only|session log cannot be read|stays ended for a receiver that sets none|answers empty when no Claude log' .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0 with `tests 4`, `pass 4` and `fail 0`, saved to `PHASE/scratch/green.txt`. Observed: `scratch/green.txt:3` to `:6` print `✔` for all four, `ℹ tests 4` at `:7`, `ℹ pass 4` at `:9`, `ℹ fail 0` at `:10` and `exit=0` at `:15`.
- [x] T012 Run the relaunch and OpenCode plugin suites (`RL/tests` and `.opencode/plugins/tests`). Verify: the command of T001 exits 0 with `fail 0` and a `tests` count two above the one in `PHASE/scratch/baseline.txt`, saved to `PHASE/scratch/final-suite.txt`. Observed: `scratch/final-suite.txt:1567` prints `ℹ tests 1553`, `:1569` `ℹ pass 1553`, `:1570` `ℹ fail 0` and `:1575` `exit=0`, two above the 1551 baseline.
- [x] T013 Check the core parses (`RL/lib/relaunch-core.cjs`). Verify: `node --check .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` exits 0. Observed: exited 0.
- [ ] T014 Check that the fix adds no file, no note field and no record key (`FIX`). Verify: `git show --stat FIX` lists the core, the test file and the README, `git show FIX | rg -c '^new file'` prints nothing with exit 1, and `git show FIX -- .skilled/hooks/session-relaunch/lib | rg -c '^\+.*goal_[a-z_]+:'` prints nothing with exit 1. Deferred: the orchestrator runs this against the fix commit after committing, per the dispatch. Working-tree evidence: `git diff --stat` lists the core, the test file and the README only, all modifications, and adds no file.
- [x] T015 Validate the phase folder (`PHASE`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/016-ended-goal-mark-match --strict` prints `RESULT: PASSED`. Observed 2026-11-14: after `repair-derived.cjs --apply`, Errors 0, Warnings 0, `RESULT: PASSED`, exit 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Every task is resolved: T001 to T013 and T015 are complete, and T014 is deferred to the orchestrator, which runs it against the fix commit after committing.
- [x] No `[B]` blocked tasks remaining: no task is blocked.
- [x] Manual verification passed: `scratch/red.txt` shows both new tests failing (tests 2, pass 0, fail 2, exit 1) and `scratch/green.txt` shows 4 of 4 (tests 4, pass 4, fail 0, exit 0).
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **The mark this narrows**: `../010-goal-ending-carry/`
- **The limit this leaves open**: `../014-review-wording-fixes/`
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

- [x] CHK-001 [P0] Requirements documented in spec.md: `rg -c '^\| REQ-' spec.md` prints 6. Observed 6.
- [x] CHK-002 [P0] Technical approach defined in plan.md: `rg -c '^## 3. ARCHITECTURE' plan.md` prints 1. Observed 1.
- [x] CHK-003 [P1] The baseline count is saved before the first edit (T001). `scratch/baseline.txt` was written by the orchestrator before the test edit, and T001 records its 1551 count.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `node --check` exits 0 on the core and on the test file (T013, T004). Both observed exit 0.
- [x] CHK-011 [P0] A note that cannot be read or parsed still says nothing about a goal. The helper keeps its `try`/`catch` around the read and the parse, and a skipped note can never become the claimed-last one.
- [x] CHK-012 [P1] The change adds no exported symbol and no helper beside `claimedNoteEndedGoal`. The helper stays internal, the export list is untouched, and the only new locals are `lastClaimed` and `claimedAt` inside it.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] AC-001 and AC-002 pass with their commands. `scratch/red.txt:3` and `:4` print `✖` for both new tests before the edit, and `scratch/green.txt:4` and `:5` print `✔` for both after it.
- [x] CHK-021 [P0] Both new tests failed before the edit (`scratch/red.txt`). `scratch/red.txt:5` prints `ℹ tests 2`, `:7` `ℹ pass 0`, `:8` `ℹ fail 2` and `:68` `exit=1`.
- [x] CHK-022 [P1] The two existing ended-goal tests pass unchanged (`scratch/green.txt`). `scratch/green.txt:3` and `:6` print `✔` for them, and the test-file diff removes no content line.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] The finding class is `instance-only`: `claimedNoteEndedGoal` is the one reader of `goal_ended`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory: `rg -n 'goal_ended' .skilled/hooks/session-relaunch/lib .skilled/hooks/session-relaunch/bin` lists one reader and one writer, and only the reader changes. Observed: the reader at `relaunch-core.cjs:652`, the writer's documentation at `:973` and its update at `:996` to `:997`; the writer is untouched.
- [x] CHK-FIX-003 [P0] Consumer inventory: `rg -n 'claimedNoteEndedGoal' .skilled .opencode --glob '*.cjs' --glob '*.mjs'` lists the definition and its calls in the core only. Observed at `relaunch-core.cjs:635`, `:668`, `:676` and `:686`.
- [x] CHK-FIX-004 [P0] The invariant holds: the mark comes from at most one note, and an unreadable log never turns a mark into no mark. The helper keeps one candidate and both early returns ask it before they answer none.
- [x] CHK-FIX-005 [P1] Matrix axes listed in plan.md: log state crossed with claimed notes, with the row each test covers. The first test pins the older marked and newer unmarked pair with a whole log, and the second pins the missing and unreadable log rows with a marked and an unmarked note.
- [x] CHK-FIX-006 [P1] The tests run with `AI_SESSION_CHILD` and `OPENCODE_DB` unset. Every recorded run in `scratch/red.txt`, `scratch/green.txt` and `scratch/final-suite.txt` starts with `env -u AI_SESSION_CHILD -u OPENCODE_DB`.
- [x] CHK-FIX-007 [P1] Evidence is pinned to the fix commit, named in `goal.md` section 4. The goal log names the tree state this work started from; the fix commit is the orchestrator's to land, and T014 pins the commit-scoped evidence to it.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets: the change reads no credential. The helper reads handoff notes only.
- [x] CHK-031 [P0] The scan stays in the folder of the note being handed over. `path.dirname(handoffPath)` and `safeDirectory` bound it as before.
- [x] CHK-032 [P1] N/A: no auth surface. No auth code is touched.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` all name the claimed-last rule and the unreadable log. Each document states both, and this one records the runs.
- [x] CHK-041 [P1] The changed comment names no packet, phase or task number (T009). The added lines explain the claimed-last choice and the unreadable log only.
- [x] CHK-042 [P2] The README Claude row states both rules (T010). `rg -c 'claimed last'` printed 1 at `.skilled/hooks/session-relaunch/README.md:182`, and the old unreadable-log sentence is gone.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Test runs live under `scratch/` only. `scratch/baseline.txt`, `scratch/red.txt`, `scratch/green.txt` and `scratch/final-suite.txt` hold every run.
- [x] CHK-051 [P1] No temporary file is left outside `scratch/`. The changed files are the core, the test file and the README; no scratch file sits outside the packet.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-14. Every row above was checked from a recorded run or a searched source. T014 is the one deferral: it needs the fix commit, which the orchestrator lands after the build.
<!-- /ANCHOR:summary -->

---
