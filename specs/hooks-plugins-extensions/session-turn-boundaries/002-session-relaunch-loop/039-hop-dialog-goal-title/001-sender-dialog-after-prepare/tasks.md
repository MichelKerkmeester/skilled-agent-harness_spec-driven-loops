---
title: "Tasks: Phase 1: sender-dialog-after-prepare"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "sender dialog after prepare tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 1: sender-dialog-after-prepare

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

**Task variables**: `GUARD` is `.skilled/hooks/session-relaunch/claude/subagent-guard.mjs`. `TESTS` is `.skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs`. `REGISTRY` is `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json`. `PHASE` is this phase folder.

**Test environment**: run the suites as `env -u AI_SESSION_CHILD node --test <file>`, because a dispatched child marker changes how the relaunch hooks behave.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm from the saved runs that a question dialog followed `prepare` and that nothing armed (`PHASE/scratch/failed-runs/`). Verify: in `PHASE`, `rg -o 'ts=\S+ tool_use AskUserQuestion' scratch/failed-runs/*/extract-*.txt` prints four lines, `rg -o '\S+ prepare loopId=\d+ status=pending' scratch/failed-runs/*/relaunch-log.txt` prints four earlier lines and `rg -c 'killer-signal| relaunch ' scratch/failed-runs/*/relaunch-log.txt` prints nothing.
  - **Evidence:** the dialog came 5.1 s to 42.6 s after `prepare` in all four runs, and no log holds `killer-signal` or `relaunch`. The quoted output is in `spec.md` Measured Behavior.
- [x] T002 Record the suite baseline before the new tests (`.skilled/hooks/session-relaunch/tests`). Verify: `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with `fail 0`.
  - **Evidence:** the orchestrator reported a baseline of 1524 of 1524 before the six new tests. This packet holds no saved output of that run.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add the denial test and five pass-through tests for a question dialog (`TESTS`). Verify: `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs` prints `tests 20`, `pass 19` and `fail 1`, saved to `PHASE/scratch/red.txt`.
  - **Evidence:** `scratch/red.txt` shows `✖ subagent-guard denies a question dialog while the session hand-over is pending` with `expected a PreToolUse denial envelope`, and `pass 19`, `fail 1`.
- [x] T004 Deny `AskUserQuestion` while this session's record is pending, reusing `readRelaunchFile` and `armableRecord` (`GUARD`). Verify: the T003 command prints `pass 20` and `fail 0`, saved to `PHASE/scratch/green.txt`.
  - **Evidence:** `scratch/green.txt` shows `tests 20`, `pass 20`, `fail 0`. A rerun on 2026-11-13 printed the same.
- [x] T005 Add the PreToolUse binding with matcher `AskUserQuestion`, group 7, slot 0, for the guard (`REGISTRY`). Verify: `rg -c 'session-relaunch/claude/subagent-guard' .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json` prints 2.
  - **Evidence:** the command printed 2 on 2026-11-13.
- [x] T006 Render the registry into the Claude settings with `sync-hook-registrations.cjs` (`.claude/settings.json`). Verify: `rg -c 'session-relaunch/claude/subagent-guard' .claude/settings.json` prints 2, and `sync-hook-registrations.cjs --check` prints `PASS`.
  - **Evidence:** the count printed 2, and the check printed `PASS: 4 registration files match the 35-hook registry; 22 Pi extensions resolve.`
- [x] T007 Name the new matcher and the denial in the adapter table (`.skilled/hooks/session-relaunch/claude/README.md`). Verify: `rg -c 'AskUserQuestion' .skilled/hooks/session-relaunch/claude/README.md` prints 2.
  - **Evidence:** the overview line and the `subagent-guard.mjs` row both name `AskUserQuestion`.
- [x] T008 Name the question dialog in the file tree (`.skilled/hooks/session-relaunch/README.md`). Verify: `rg -n 'question dialog over a pending record' .skilled/hooks/session-relaunch/README.md` prints one line.
  - **Evidence:** the `subagent-guard.mjs` line of the tree names it.
- [x] T009 Name the new matcher in the concern table (`.skilled/hooks/README.md`). Verify: `rg -n 'Bash and AskUserQuestion' .skilled/hooks/README.md` prints one line.
  - **Evidence:** the `session-relaunch` row names both matchers.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run the relaunch and OpenCode plugin suites (`.skilled/hooks/session-relaunch/tests`). Verify: `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with `tests 1530`, `pass 1530` and `fail 0`.
  - **Evidence:** rerun on 2026-11-13 in the worktree: exit 0, tests 1530, pass 1530, fail 0, saved to `scratch/suite.txt`. That is the baseline of 1524 plus the six new tests.
- [x] T011 Check the runtime mirrors (`.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/`). Verify: `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check` prints `PASS`.
  - **Evidence:** it printed `PASS: 256 mirrors across 10 trees are in sync.` with exit 0.
- [x] T012 Check the guard's syntax (`GUARD`). Verify: `node --check .skilled/hooks/session-relaunch/claude/subagent-guard.mjs` exits 0.
  - **Evidence:** exit 0 on 2026-11-13.
- [x] T013 Check that no module was added and the core is unchanged (`.skilled/hooks/session-relaunch/lib`). Verify: `git status --short .skilled | rg '^\?\?'` prints nothing and `git diff --name-only -- .skilled/hooks/session-relaunch/lib` prints nothing.
  - **Evidence:** both printed nothing.
- [x] T014 Validate the phase folder (`PHASE`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/001-sender-dialog-after-prepare --strict` prints `RESULT: PASSED`.
  - **Evidence:** printed `Errors: 0  Warnings: 0` and `RESULT: PASSED` on 2026-11-13, recorded in `goal.md` section 4.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: `scratch/red.txt` shows the denial test failing and `scratch/green.txt` shows 20 of 20
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Evidence of the failed runs**: `scratch/failed-runs/`, saved by `../../038-goal-and-workflow-resume/016-receiver-claim-under-goal/`
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
- [x] CHK-002 [P0] Technical approach defined in plan.md, with the rejected alternatives in `implementation-summary.md`
- [x] CHK-003 [P1] The opening check is confirmed from the four saved runs (T001)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `node --check .skilled/hooks/session-relaunch/claude/subagent-guard.mjs` exits 0
- [x] CHK-011 [P0] The hook exits 0 on every path, asserted by the denial and the five pass-through tests
- [x] CHK-012 [P1] A record read that throws is caught and lets the dialog through, by inspection of the `try` in `pendingHandOver`
- [x] CHK-013 [P1] The new code reuses `readRelaunchFile`, `armableRecord` and the existing `emit` and `done` helpers
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] AC-002 and AC-003 pass with their commands
- [x] CHK-021 [P0] AC-001 holds its saved evidence
- [x] CHK-022 [P1] No record, another session's record and an armed record each let the dialog through
- [x] CHK-023 [P1] No `SKILLED_LOOP_ID` and a disabled concern each let the dialog through
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] The finding class is `instance-only`: only Stop arms a Claude record.
- [x] CHK-FIX-002 [P0] Same-class producer inventory: `rg -n 'arm\(' .skilled/hooks/session-relaunch/claude` prints one line, in `stop-arm.mjs`.
- [x] CHK-FIX-003 [P0] Consumer inventory: the registry and `.claude/settings.json` each name the guard twice, and the PostToolUse `ask-capture-posttooluse.mjs` never sees a denied call.
- [x] CHK-FIX-004 [P0] N/A: no security, path, parser or redaction fix.
- [x] CHK-FIX-005 [P1] Matrix axes listed in plan.md: record, `SKILLED_LOOP_ID` and concern, six rows tested.
- [x] CHK-FIX-006 [P1] The suite runs with `AI_SESSION_CHILD` unset.
- [x] CHK-FIX-007 [P1] Evidence is pinned to fix commit `9d0c5368d1` on branch `worktrees/366-hop-after-question-dialog`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets: the guard reads no credential
- [x] CHK-031 [P0] The denial carries the note path and loop id from the record, never tool input text
- [x] CHK-032 [P1] N/A: no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` all name `AskUserQuestion` and the `cancel --loop-id` command
- [x] CHK-041 [P1] The new helper carries a comment on why only a pending record is held
- [x] CHK-042 [P2] The three READMEs name the new matcher (T007 to T009)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Test runs and the failed-run evidence live under `scratch/` only
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
