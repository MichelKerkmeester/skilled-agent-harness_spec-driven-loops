---
title: "Tasks: Phase 14: review-wording-fixes"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "review wording fixes tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 14: review-wording-fixes

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

**Task variables**: `RL` is `.skilled/hooks/session-relaunch`. `PHASE` is this phase folder. `P039` is `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title`. This phase lands in two commits. `FIX` is the first, made in T019: the wording fixes of T006 to T010 and this phase's packet documents. `FIX2` is the second, made after `main` is merged: the `handoff.md` sentence of T012 and the trigger index when T017 rebuilds it.

**Test environment**: run the suites as `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test <file>`, because a dispatched child marker and an inherited OpenCode database path both change how the relaunch tests behave.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Take the suite baseline before any edit (`RL/tests`). Verify: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0, and its `tests` and `pass` lines are saved in `PHASE/scratch/baseline.txt`. Result: `scratch/baseline.txt` records the 2026-11-14 run at `c69f278cfc`, tests 1550, pass 1550, fail 0, exit 0. The suite was not rerun for this task.
- [x] T002 Confirm the three wrong phrases and where they stand (`RL`). Verify: `rg -n "no packet in the note's lineage|an empty one for a record|stays pending for the next Stop" .skilled/hooks/session-relaunch` prints five lines: `README.md:309`, `lib/relaunch-core.cjs:1299`, `claude/stop-arm.mjs:133` and `tests/claude-adapters.test.cjs:708` and `:959`. Line 708 is the note on the background-task path. It is right and no task changes it. Result: the search printed five lines, `README.md:309`, `lib/relaunch-core.cjs:1299`, `claude/stop-arm.mjs:133`, `tests/claude-adapters.test.cjs:708` and `:959`, exit 0.
- [x] T003 Confirm the code beside the README sentence and the core comment (`RL/lib/relaunch-core.cjs`). Verify: `rg -n 'lineage\.slice\(0, 2\)|\bhandoff: ' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` prints lines 678 and 1028 and no other line. Result: the search printed lines 678 and 1028 only, exit 0.
- [x] T004 Run the five tests behind the corrected Stop comment (`RL/tests/claude-adapters.test.cjs`). Verify: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test --test-name-pattern='marks the pending record deferred|withdraws a deferred handoff when the operator sends a prompt|keeps a deferred handoff when a background task reports back' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits 0 with `tests 5`, `pass 5` and `fail 0`, saved in `PHASE/scratch/withdraw-tests.txt`. Result: `scratch/withdraw-tests.txt` prints tests 5, pass 5, fail 0, exit 0. The run happened before any comment changed.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 [P] Correct the troubleshooting sentence to name the note's spec folder and its parent (`RL/README.md`). Verify: `rg -c "no packet in the note's lineage" .skilled/hooks/session-relaunch/README.md` prints nothing with exit 1, and `rg -c "neither the note's spec folder nor its parent" .skilled/hooks/session-relaunch/README.md` prints 1. Result: the old phrase prints nothing with exit 1 and the new phrase prints 1.
- [x] T007 [P] Correct the comment above the `handoff` check to name `preparePending` as the one writer of the note path (`RL/lib/relaunch-core.cjs`). Verify: `rg -c 'an empty one for a record' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` prints nothing with exit 1, and `sed -n '1296,1303p' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` shows `preparePending` in the comment. Result: `an empty one for a record` prints nothing with exit 1, and lines 1299 to 1301 name `preparePending`.
- [x] T008 [P] Correct the comment on the missing transcript path: the record is marked so a prompt withdraws it, and a Stop with no typed prompt tries again (`RL/claude/stop-arm.mjs`). Verify: `rg -c 'stays pending for the next Stop' .skilled/hooks/session-relaunch/claude/stop-arm.mjs` prints nothing with exit 1. Result: the search prints nothing with exit 1.
- [x] T009 [P] Correct the test note on the missing transcript path at line 959 the same way, and leave the note on the background-task path at line 708 as it is (`RL/tests/claude-adapters.test.cjs`). Verify: `rg -n 'stays pending for the next Stop' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` prints one line, which starts with `708:`. Result: the search prints one line, `tests/claude-adapters.test.cjs:708`, and the stale note at `:959` is gone.
- [x] T010 [P] Add the limitation that the ended-goal mark is matched on the session id that claimed the note (`P039/010-goal-ending-carry/implementation-summary.md`). Verify: `rg -c 'matched on the session id' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/010-goal-ending-carry/implementation-summary.md` prints 1. Result: the search prints 1 on the new row 7.
- [ ] T019 Commit the wording fixes of T006 to T010 and this phase's packet documents, `scratch/` included, as the first commit of this phase, `FIX` (`.git`). Precondition: the documents of children 004 to 013 are committed first, in one document commit, and `git ls-files --error-unmatch specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/010-goal-ending-carry/implementation-summary.md` exits 0 before T010, so `FIX` changes that summary and does not add it as a new file. Verify: `git show --stat --format= FIX` lists `.skilled/hooks/session-relaunch/README.md`, the three code files, the summary of phase 10 and files under `PHASE` and no other path, and `git status --porcelain -- .skilled/hooks/session-relaunch PHASE` prints nothing. Task ids are stable, so this task carries the next free id and runs here, after T010 and before T012.
- [x] T011 Merge `main` into this branch (`.git`). Done by merge `be56fabc7b`. Verify: `git merge-base --is-ancestor main HEAD` exits 0.
- [x] T012 Add one sentence after the `goal_packet` lines: `prepare` and `keep` also own `goal_ended`, write it when a Claude goal was met, failed or cleared, and remove a value written by hand (`.skilled/commands/speckit/handoff.md`). Verify: `rg -c 'goal_ended' .skilled/commands/speckit/handoff.md` prints 1, and `rg -c 'Purpose \(<file>\)' .skilled/commands/speckit/handoff.md` prints 1, which shows the lines `main` added are still there. The sentence lands in the second commit, `FIX2`. Result: `goal_ended` prints 1 and `Purpose \(<file>\)` prints 1.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Search the relaunch tree for the three wrong phrases (`RL`). Verify: `rg -n "no packet in the note's lineage|an empty one for a record|stays pending for the next Stop" .skilled/hooks/session-relaunch` prints one line, which starts with `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs:708:`. That is the note on the background-task path, which stays. The stale note at `:959` is gone. Result: the search prints one line, `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs:708:`.
- [ ] T014 Check that this phase landed in two commits and that the three code files changed in the first only, in comment lines only (`FIX` and `FIX2`). Verify: `git show FIX -- .skilled/hooks/session-relaunch/lib/relaunch-core.cjs .skilled/hooks/session-relaunch/claude/stop-arm.mjs .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs | rg '^[+-]' | rg -v '^(\+\+\+|---) ' | rg -v '^[+-]\s*//'` prints nothing with exit 1, and once `FIX2` exists `git show --stat --format= FIX2 -- .skilled/hooks/session-relaunch` prints nothing, because the second commit holds `handoff.md` and the trigger index only.
- [x] T015 Check the three code files parse (`RL`). Verify: `node --check .skilled/hooks/session-relaunch/lib/relaunch-core.cjs`, `node --check .skilled/hooks/session-relaunch/claude/stop-arm.mjs` and `node --check .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` each exit 0. Result: each of the three exits 0.
- [x] T016 Run the relaunch and OpenCode plugin suites (`RL/tests` and `.opencode/plugins/tests`). Verify: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with `fail 0`. The `tests` count is 1550, the one baseline count, taken on the merged tree and saved in `PHASE/scratch/baseline.txt`. Result: `scratch/suite.txt` prints tests 1550, pass 1550, fail 0, exit 0, the baseline count.
- [x] T017 Check the trigger index and the runtime mirrors on the merged tree (`.skilled/skills/system-spec-kit/runtime/cli`). Verify: `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --check` exits 0, rebuilt without `--check` first when it exits 1, and `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check` prints `PASS`. A rebuilt `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` lands in the second commit, `FIX2`. Result: the check exited 1 with 66 stale documents, and after the rebuild it exits 0 with 0 stale and 0 obsolete. The mirror check prints PASS with 256 mirrors across 10 trees. The rebuild also rewrote three tracked fixtures under `retrieval/fixtures/`, which were restored to their committed content so only `runtime/data/trigger-index.json` is changed.
- [x] T018 Validate the phase folder (`PHASE`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/014-review-wording-fixes --strict` prints `RESULT: PASSED`. Result: after `repair-derived.cjs --apply` the run printed `Summary: Errors: 0  Warnings: 0` and `RESULT: PASSED` with exit 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]` (waits on the orchestrator's T019 and T014)
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: each changed comment was read and names no packet, phase or task number
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **The bound the README must state**: `../011-goal-fallback-bound/`
- **The stamp the Stop comment must state**: `../005-parked-record-escape/`
- **The record read the core comment explains**: `../006-record-without-handoff/`
- **The note field the command document must name**: `../010-goal-ending-carry/`
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

A blocked task is marked `[B]` with its reason in `goal.md`. A failing test in T004 blocks T008 and T009 only.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md: `rg -c '^\| REQ-' spec.md` prints 7. Result: prints 7.
- [x] CHK-002 [P0] Technical approach defined in plan.md: `rg -c '^## 3. ARCHITECTURE' plan.md` prints 1. Result: prints 1.
- [x] CHK-003 [P1] Each wrong text is confirmed in place before it changes (T002, T003). Result: T002 printed five lines in four files and T003 printed lines 678 and 1028.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `node --check` exits 0 on the three code files (T015). Result: each of the three files exits 0.
- [x] CHK-011 [P0] Every changed line in the three code files is a comment line (T014). Result: the working-tree diff changes comment lines only in the three files. `git show FIX` waits on the orchestrator.
- [x] CHK-012 [P1] The check at `relaunch-core.cjs:1302` is unchanged: `rg -n "typeof record.handoff === 'string'" .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` prints the same single line as before. Result: line 1302 is unchanged.
- [x] CHK-013 [P1] No changed comment holds a packet, phase, task or finding number. Result: the three comments name no such number.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] AC-001, AC-002 and AC-003 pass with their commands. Result: the three rows are Met with their commands.
- [x] CHK-021 [P0] The five tests behind the Stop comment passed before the comment changed (`scratch/withdraw-tests.txt`). Result: the file shows tests 5, pass 5, fail 0, exit 0.
- [x] CHK-022 [P1] The suite count after the edit equals the one baseline count, 1550 (T016). Result: `scratch/suite.txt` prints 1550, the baseline count.
- [x] CHK-023 [P1] The comment on the background-task path at `stop-arm.mjs:141` and the test note on that path at `claude-adapters.test.cjs:708` are unchanged, because the fifth test shows that Stop does retry. Result: the diff touches neither the comment at `:141` to `:143` nor the note at `:708`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] The finding class is `cross-consumer`: one behavior stated wrongly in a README, in comments and in a command document. Result: the three phrases stated one behavior across a README, three comments and a command document.
- [x] CHK-FIX-002 [P0] Same-class producer inventory: the search in T002 lists every copy of the three phrases, and T013 shows one left, the note at `claude-adapters.test.cjs:708`, which is right. Result: T002 found five copies in four files and T013 leaves one, at `:708`.
- [x] CHK-FIX-003 [P0] Consumer inventory: `README.md:134` and `README.md:182` already state the behavior and are unchanged. Result: `README.md` lines 134 and 182 sit outside the diff.
- [x] CHK-FIX-004 [P0] N/A: no security, path, parser or redaction fix. Result: N/A.
- [x] CHK-FIX-005 [P1] Matrix axes listed in plan.md: the six texts, each with a search for the old and the new phrase. Result: plan.md lists the six texts and their searches.
- [x] CHK-FIX-006 [P1] The tests run with `AI_SESSION_CHILD` and `OPENCODE_DB` unset. Result: every run used `env -u AI_SESSION_CHILD -u OPENCODE_DB`.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to the two commits of this phase, `FIX` and `FIX2`, both named in `goal.md` section 4. Waits on FIX and FIX2.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets: the change reads no credential. Result: no credential is read.
- [x] CHK-031 [P0] N/A: no line that runs changes, so no input path changes. Result: N/A.
- [x] CHK-032 [P1] N/A: no auth surface. Result: N/A.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` name the same six texts and the same three wrong phrases. Result: the three documents name the same six texts and three phrases.
- [x] CHK-041 [P1] Each corrected comment says why the code does what it does, and names a function only where the function is the point (T007). Result: each comment gives the reason and names `preparePending` only where it is the point.
- [x] CHK-042 [P2] The handoff command document names `goal_ended` (T012). Result: `goal_ended` prints 1.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Test runs live under `scratch/` only. Result: `baseline.txt`, `withdraw-tests.txt` and `suite.txt` all live under `scratch/`.
- [x] CHK-051 [P1] No temporary file is left outside `scratch/`. Result: no temporary file was left outside `scratch/`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 12/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-14. CHK-FIX-007 waits on the orchestrator's two commits.
<!-- /ANCHOR:summary -->

---
