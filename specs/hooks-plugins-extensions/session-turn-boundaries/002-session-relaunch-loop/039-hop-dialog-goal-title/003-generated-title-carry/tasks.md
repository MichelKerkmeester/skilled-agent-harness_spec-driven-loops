---
title: "Tasks: Phase 3: generated-title-carry"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "generated title carry tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 3: generated-title-carry

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

**Task variables**: `RL` is `.skilled/hooks/session-relaunch`. `PHASE` is this phase folder. `FIX` is commit `7d6077678e`.

**Test environment**: run the suites as `env -u AI_SESSION_CHILD node --test <file>`, because a dispatched child marker changes how the relaunch hooks behave.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm that `prepare` ignored the generated title before the fix (`RL/bin/session-relaunch.cjs`). Verify: `git show 7d6077678e^:.skilled/hooks/session-relaunch/bin/session-relaunch.cjs | rg -n "name: settings.name"` prints line 590 with no `generatedName`, and `git show 7d6077678e^:.skilled/hooks/session-relaunch/lib/context-usage.cjs | rg -c "ai-title|aiTitle"` prints nothing.
  - **Evidence:** line 590 read `name: settings.name || process.env.SKILLED_LOOP_NAME || null,` and the count printed nothing with exit 1. The output is quoted in `spec.md` Measured Behavior.
- [x] T002 Confirm the wrapper already numbers a record name as `<stem> (2)` (`.skilled/bin/skilled-loop`). Verify: `rg -n 'name_stem\(\) \{|append_name_arguments\(\) \{' .skilled/bin/skilled-loop` prints lines 286 and 417, and `rg -n "'X \(2\)'" RL/tests/skilled-loop-wrapper-launch-arguments.test.cjs` prints line 31.
  - **Evidence:** `append_name_arguments` adds `--name "$SKILLED_LOOP_NAME ($((10#${SKILLED_LOOP_HOPS:-0} + 1)))"` on a hop. Phase 012 of packet 038 tested it, and the wrapper test file asserts `X (2)`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add the reader test for the generated title (`RL/tests/context-usage.test.cjs`). Verify: the red run saved in `PHASE/scratch/red.txt` prints `✖ readClaudeSettings returns the last generated title beside the name`.
  - **Evidence:** `scratch/red.txt:1` shows the failure, and lines 22 and 34 show the missing `generatedName: 'second generated'`.
- [x] T004 Add the fallback test and the ranking test for `prepare` (`RL/tests/session-relaunch-cli.test.cjs`). Verify: `PHASE/scratch/red.txt` prints `tests 3`, `pass 1` and `fail 2`.
  - **Evidence:** `scratch/red.txt:2` shows the fallback test failing with `null` where `'hop state handoff'` was expected. `scratch/red.txt:3` shows the ranking test passing before the edit, because it guards the ranking that already held.
- [x] T005 Return the last non-empty `aiTitle` as `generatedName`, present only when the log holds one (`RL/lib/context-usage.cjs`). Verify: `PHASE/scratch/green.txt` prints `✔ readClaudeSettings returns the last generated title beside the name`.
  - **Evidence:** `scratch/green.txt:28` shows the test passing.
- [x] T006 Pass `generatedName` on from `resolveSessionSettings` (`RL/lib/relaunch-core.cjs`). Verify: `rg -n 'generatedName' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` prints lines 767 and 786.
  - **Evidence:** both lines printed on 2026-11-13.
- [x] T007 Record the generated title as `name` when no custom title and no `SKILLED_LOOP_NAME` exist (`RL/bin/session-relaunch.cjs`). Verify: `rg -n 'generatedName' .skilled/hooks/session-relaunch/bin/session-relaunch.cjs` prints line 592, and `PHASE/scratch/green.txt` prints both prepare tests with a check mark.
  - **Evidence:** line 592 reads `name: settings.name || process.env.SKILLED_LOOP_NAME || settings.generatedName || null,`. `scratch/green.txt:345` and `scratch/green.txt:346` show both tests passing.
- [x] T008 Name the generated title fallback in the name paragraph (`RL/README.md`). Verify: `rg -n 'ai-title' .skilled/hooks/session-relaunch/README.md` prints one line.
  - **Evidence:** it printed line 49 on 2026-11-13.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run the three changed test files (`RL/tests`). Verify: `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/context-usage.test.cjs .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0 with `tests 359`, `pass 359` and `fail 0`.
  - **Evidence:** `scratch/green.txt:362` to `scratch/green.txt:365`. A rerun by this packet's author on 2026-11-13 printed the same with exit 0.
- [x] T010 Run the relaunch and OpenCode plugin suites (`RL/tests`). Verify: `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with 1536 of 1536.
  - **Evidence:** the orchestrator ran it in the worktree at the final state: exit 0, 1536 of 1536. This author reran it on 2026-11-13 with the same result, saved to `scratch/suite.txt`.
- [x] T011 Run the goal suites (`.skilled/hooks/goal`). Verify: `env -u AI_SESSION_CHILD node --test .skilled/hooks/goal/**/*.test.cjs .skilled/hooks/goal/**/*.test.mjs` exits 0 with 200 of 200.
  - **Evidence:** the orchestrator ran it at the final state: exit 0, 200 of 200.
- [x] T012 Run the Pi adapter suite (`RL/pi/session-relaunch.test.ts`). Verify: `npx vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/session-relaunch/pi/session-relaunch.test.ts` prints 62 passed.
  - **Evidence:** the orchestrator ran it at the final state: 62 of 62.
- [x] T013 Check that the fix adds no module and leaves the wrapper alone (`FIX`). Verify: `git show --stat 7d6077678e` lists six files with none under `.skilled/bin`, and `git show 7d6077678e | rg -c '^new file'` prints nothing.
  - **Evidence:** the stat listed the README, `session-relaunch.cjs`, `context-usage.cjs`, `relaunch-core.cjs` and the two test files. The new-file count printed nothing with exit 1.
- [x] T014 Check the three changed sources parse (`RL/lib` and `RL/bin`). Verify: `node --check` on `lib/context-usage.cjs`, `lib/relaunch-core.cjs` and `bin/session-relaunch.cjs` exits 0 for each.
  - **Evidence:** all three exited 0 on 2026-11-13.
- [x] T015 Validate the phase folder (`PHASE`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/003-generated-title-carry --strict` prints `RESULT: PASSED`.
  - **Evidence:** recorded in `goal.md` section 4.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: `scratch/red.txt` shows two of the three new tests failing and `scratch/green.txt` shows 359 of 359
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **The name carry this extends**: `../../038-goal-and-workflow-resume/012-session-name-carry/`
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
- [x] CHK-002 [P0] Technical approach defined in plan.md, with the rejected alternatives in `implementation-summary.md`
- [x] CHK-003 [P1] The pre-change gap is confirmed from the parent commit (T001)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `node --check` exits 0 on the three changed sources (T014)
- [x] CHK-011 [P0] The reader test asserts the exact result shape for three logs, so an earlier result without a generated title keeps its keys
- [x] CHK-012 [P1] A log read that throws still returns null, by inspection of the `try` in `readClaudeSettings` that now wraps the new search too
- [x] CHK-013 [P1] The new search reuses `latestTailEntry` and `settingText`, the helpers the custom-title search uses
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] AC-001 and AC-002 pass with their commands
- [x] CHK-021 [P0] Two of the three new tests failed before the edit (`scratch/red.txt`)
- [x] CHK-022 [P1] A launch name and a custom title each outrank the generated title
- [x] CHK-023 [P1] A blank generated title is skipped and a title-only log returns an object
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] The finding class is `instance-only`: `prepare` is the one writer of the record's `name`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory: `rg -n 'generatedName' .skilled/hooks/session-relaunch/bin/session-relaunch.cjs` prints one line, 592.
- [x] CHK-FIX-003 [P0] Consumer inventory: the record's `name` field, `consume` and the wrapper are unchanged, by T013.
- [x] CHK-FIX-004 [P0] N/A: no security, path, parser or redaction fix. The wrapper's existing name check still guards the launch line.
- [x] CHK-FIX-005 [P1] Matrix axes listed in plan.md: custom title, `SKILLED_LOOP_NAME` and generated title.
- [x] CHK-FIX-006 [P1] The suites run with `AI_SESSION_CHILD` unset.
- [x] CHK-FIX-007 [P1] Evidence is pinned to fix commit `7d6077678e`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets: the reader reads no credential
- [x] CHK-031 [P0] The generated title reaches the launch line only through the record's `name`, which the wrapper checks for a leading `-` and control characters
- [x] CHK-032 [P1] N/A: no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` all name `generatedName` and the rank custom title, `SKILLED_LOOP_NAME`, generated title
- [x] CHK-041 [P1] The `name:` line carries a comment on why the generated title ranks last
- [x] CHK-042 [P2] The session-relaunch README names the fallback (T008)
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
