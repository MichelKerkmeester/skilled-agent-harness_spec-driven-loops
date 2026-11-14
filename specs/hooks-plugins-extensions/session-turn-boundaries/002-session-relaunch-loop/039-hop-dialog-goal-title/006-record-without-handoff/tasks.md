---
title: "Tasks: Phase 6: record-without-handoff"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "record without handoff tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 6: record-without-handoff

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

**Task variables**: `RL` is `.skilled/hooks/session-relaunch`. `PHASE` is this phase folder. `FIX` is commit `f4cf59b93f`.

**Test environment**: run the suites as `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test <file>`, because a dispatched child marker and an inherited database path change how the relaunch hooks and plugin tests behave.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm that `readRelaunchFile` returned any parsed record before the fix (`RL/lib/relaunch-core.cjs`). Verify: `git show f4cf59b93f^:.skilled/hooks/session-relaunch/lib/relaunch-core.cjs | rg -n "return JSON.parse"` prints line 1259.
  - **Evidence:** line 1259 read `return JSON.parse(contents);` with no check on the parsed value. The guard line that prints the note, `RL/claude/subagent-guard.mjs:91`, reads `${record.handoff}`.
- [x] T002 Confirm `shouldRelaunch` already declines an empty `handoff` (`RL/lib/relaunch-core.cjs`). Verify: `git show f4cf59b93f:.skilled/hooks/session-relaunch/lib/relaunch-core.cjs | rg -n "nonEmptyString\(record.handoff\)"` prints line 1334.
  - **Evidence:** line 1334 returns `{ relaunch: false, reason: 'incomplete-record' }` for an empty `handoff` or `cwd`. This is why the read rejects only a non-string.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add the read test for a record with no `handoff` and the keep test for an empty one (`RL/tests/relaunch-core.test.cjs`). Verify: the red run saved in `PHASE/scratch/red.txt` prints `✖ readRelaunchFile treats a record with no handoff as absent and logs the loop id` and `✔ readRelaunchFile keeps a record whose handoff is an empty string`.
  - **Evidence:** `scratch/red.txt:3` shows the read test failing with `null` expected and the record returned. `scratch/red.txt:4` shows the keep test passing before the edit, because it guards a read that already held.
- [x] T004 Add the guard test (`RL/tests/subagent-guard.test.cjs`). Verify: `PHASE/scratch/red.txt` prints `✖ subagent-guard lets a question dialog through over a pending record that names no note`.
  - **Evidence:** `scratch/red.txt:6` shows the failure and its message names the note at `undefined`.
- [x] T005 Add the Stop test (`RL/tests/claude-adapters.test.cjs`). Verify: `PHASE/scratch/red.txt` prints `✖ stop-arm arms nothing for a pending record that names no note` and `ℹ pass 2` and `ℹ fail 3`.
  - **Evidence:** `scratch/red.txt:2` shows the failure with the record moved to `armed`. `scratch/red.txt:9` and `scratch/red.txt:10` show 2 pass and 3 fail.
- [x] T006 Return null and log `corrupt-relaunch-file` for a parsed record whose `handoff` is not a string (`RL/lib/relaunch-core.cjs`). Verify: `git show f4cf59b93f:.skilled/hooks/session-relaunch/lib/relaunch-core.cjs | rg -n "typeof record.handoff"` prints line 1268, and `PHASE/scratch/green.txt` prints a check mark for all five tests.
  - **Evidence:** line 1268 reads `if (record !== null && typeof record === 'object' && typeof record.handoff === 'string') {`. `scratch/green.txt:2` to `scratch/green.txt:6` show five check marks.
- [x] T007 Give every fixture that hand-wrote a record a `handoff` (`RL/tests` and `.opencode/plugins/tests`). Verify: `git show f4cf59b93f -- .skilled/hooks/session-relaunch/tests .opencode/plugins/tests | rg -c "^\+.*handoff"` prints 12 lines, and the whole suites in T010 pass. The 12 include the new tests and their local record shapes, so seven of them are the fixtures given a `handoff`.
  - **Evidence:** the commit adds `handoff` to the `createPendingRecord` default in `claude-adapters.test.cjs`, four fixtures in `relaunch-core.test.cjs`, one in `session-relaunch-cli.test.cjs` and one in `opencode-goal-lifecycle.test.cjs`.
- [x] T008 State both cases in the README beside the corrupt-file rule (`RL/README.md`). Verify: `rg -n 'holds no .handoff. string' .skilled/hooks/session-relaunch/README.md` prints one line.
  - **Evidence:** it printed line 241 on 2026-11-14. The paragraph also says an empty `handoff` is still read and `should-relaunch` declines it as `incomplete-record`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run the five-test pattern (`RL/tests`). Verify: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test --test-name-pattern='no handoff|names no note|handoff is an empty string' .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs .skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits 0 with `tests 5`, `pass 5` and `fail 0`.
  - **Evidence:** `scratch/green.txt:7`, `scratch/green.txt:9` and `scratch/green.txt:10`. A rerun by this author on 2026-11-14 printed the same counts.
- [x] T010 Run the relaunch and OpenCode plugin suites (`RL/tests`). Verify: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with `fail 0`.
  - **Evidence:** the fix commit message records 1543 of 1543, from 1539 before. On 2026-11-14 the same suite with nothing else running exited 0 with `tests 1548`, `pass 1548` and `fail 0` on the merged tree `be56fabc7b`, and 1550 of 1550 after children 012 and 013. The earlier 3 failures came from several agents running the suite at the same time. The count is higher than 1543 because later commits on this branch added tests.
- [x] T011 Run the Pi adapter suite (`RL/pi/session-relaunch.test.ts`). Verify: `npx vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/session-relaunch/pi/session-relaunch.test.ts` exits 0 with 62 passed.
  - **Evidence:** this author ran it at the current tree on 2026-11-14: `Tests  62 passed (62)`, exit 0. The Pi adapter reads records through `readRelaunchFile` too.
- [x] T012 Check that the fix adds no module (`FIX`). Verify: `git show --stat f4cf59b93f` lists seven files, and `git show f4cf59b93f | grep -c '^new file'` prints 0.
  - **Evidence:** the stat listed the opencode goal lifecycle test, the README, `relaunch-core.cjs` and four hook test files. The new-file count printed 0.
- [x] T013 Check the changed source parses (`RL/lib`). Verify: `node --check .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` exits 0.
  - **Evidence:** it exited 0 on 2026-11-14.
- [x] T014 Validate the phase folder (`PHASE`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/006-record-without-handoff --strict` prints `RESULT: PASSED`.
  - **Evidence:** recorded in `goal.md` section 4.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: `scratch/red.txt` shows three of the five tests failing and `scratch/green.txt` shows 5 of 5
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **The research that named the gap**: `../research/research.md`, section 4 and section 9 rank 5
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

- [x] CHK-001 [P0] Requirements documented in spec.md: `rg -c '^\| REQ-' spec.md` prints 6
- [x] CHK-002 [P0] Technical approach defined in plan.md, with the judgment on the empty string in `implementation-summary.md`
- [x] CHK-003 [P1] The pre-change gap is confirmed from the parent commit and the red run (T001 and T003 to T005)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `node --check` exits 0 on the changed source (T013)
- [x] CHK-011 [P0] The read test asserts null and exactly one `corrupt-relaunch-file` log line for the loop id, and the keep test asserts the empty-string record comes back unchanged
- [x] CHK-012 [P1] A log write that throws still returns null, by inspection of the `try` and `catch` around `appendLog` in the new branch and the existing test `readRelaunchFile still returns null when the corruption log write fails`
- [x] CHK-013 [P1] The new check shares the invalid-JSON branch, so both corrupt cases log the same line
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] AC-001 to AC-003 pass with their commands
- [x] CHK-021 [P0] Three of the five tests failed before the edit (`scratch/red.txt`)
- [x] CHK-022 [P1] The guard lets the dialog through and Stop leaves the record unchanged and spawns no killer (`claude-adapters.test.cjs` asserts the record equals `withoutNote` and the spawn list is empty)
- [x] CHK-023 [P1] An empty-string `handoff` is still read and still declined by `shouldRelaunch`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] The finding class is `shared-reader`: every record reader goes through `readRelaunchFile`, so one check serves all of them.
- [x] CHK-FIX-002 [P0] Same-class producer inventory: the commit message states no writer produces a record without a `handoff`. Not audited writer by writer here.
- [x] CHK-FIX-003 [P0] Consumer inventory: `git grep readRelaunchFile f4cf59b93f` lists the Claude, Codex, OpenCode, Pi, killer, nudge and CLI readers, none edited.
- [x] CHK-FIX-004 [P0] N/A: no security, path or redaction fix. The read still checks the state directory first.
- [x] CHK-FIX-005 [P1] Matrix axes listed in plan.md: `handoff` as a non-empty string, an empty string and absent, across the reader, the guard and Stop.
- [x] CHK-FIX-006 [P1] The suites run with `AI_SESSION_CHILD` and `OPENCODE_DB` unset.
- [x] CHK-FIX-007 [P1] Evidence is pinned to fix commit `f4cf59b93f`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets: the check reads one field of a record the hooks already read
- [x] CHK-031 [P0] The change adds no path from the record to a command line
- [x] CHK-032 [P1] N/A: no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` all name the string check on `handoff` and the kept empty-string case
- [x] CHK-041 [P1] The new branch in `readRelaunchFile` carries a comment on why a record with no `handoff` is read as absent
- [x] CHK-042 [P2] The session-relaunch README states both cases (T008)
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
