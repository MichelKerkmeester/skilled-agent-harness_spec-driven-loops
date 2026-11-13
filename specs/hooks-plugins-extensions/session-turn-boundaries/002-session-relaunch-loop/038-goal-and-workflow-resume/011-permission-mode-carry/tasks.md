---
title: "Tasks: Phase 11: permission-mode-carry"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "permission mode carry tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 11: permission-mode-carry

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

`T` is `.skilled/hooks/session-relaunch/tests`. `P` is this phase folder, `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/011-permission-mode-carry`. Every `node --test` run is prefixed with `env -u AI_SESSION_CHILD`. Every live `claude -p` run starts in a fresh directory under `$P/scratch/live/` with `env -u SKILLED_LOOP_ID -u SKILLED_LOOP_HOPS`, so the relaunch hooks of this repository stay out of it, and takes a Stop hook from `--settings $P/scratch/live/stop-capture.json` whose command is `cat > "$CAPTURE"`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm the default-mode spelling live: run `claude -p "Reply OK"` with no mode flag and `CAPTURE=$P/scratch/live/default.json`, then `claude -p --permission-mode default "Reply OK"`, and write both results to `$P/scratch/live-checks.md` (`$P/scratch/live-checks.md`). Verify: `rg -n '^default-mode payload: |^default flag exit: ' $P/scratch/live-checks.md` prints two lines, the first quoting the `permission_mode` value from `default.json` and the second the exit status and first stderr line of the `default` run.
- [ ] T002 Confirm the bypass rule live: run `claude -p --permission-mode bypassPermissions "Reply OK"` with no other permission flag and `CAPTURE=$P/scratch/live/bypass.json`, then `claude -p --dangerously-skip-permissions --permission-mode acceptEdits "Reply OK"` with `CAPTURE=$P/scratch/live/mixed.json`, and write both results (`$P/scratch/live-checks.md`). Verify: `rg -n '^bypass alone: |^dangerously plus acceptEdits: ' $P/scratch/live-checks.md` prints two lines, each with the exit status and the captured `permission_mode`.
- [ ] T003 Record the operator's answer to the plan-mode question of `spec.md` section 10, A, B, C or D (`$P/goal.md`). Verify: `rg -n '^\| Plan-mode answer \| Done \|' $P/goal.md` prints one line naming the chosen option.
- [ ] T004 [P] Record the baseline of the five test files (`$P/scratch/baseline.txt`). Verify: `rg -c 'fail 0' $P/scratch/baseline.txt` prints 5, and the counts read 155, 158, 67, 54 and 45.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Add `stop-arm stamps the payload permission mode on the armed record` and `stop-arm arms without a permission mode when the payload has none` (`$T/claude-adapters.test.cjs`). Verify: `node --test --test-name-pattern 'permission mode' $T/claude-adapters.test.cjs` prints `fail 1`, the stamp test, and the output is saved in `$P/scratch/red.txt`.
- [ ] T006 Pass `settings: { permissionMode: payload.permission_mode }` to `arm` at `:152` when the value is a non-empty string (`.skilled/hooks/session-relaunch/claude/stop-arm.mjs`). Verify: the T005 command prints `fail 0`.
- [ ] T007 Add `arm keeps a live permission mode and a later arm without one keeps it` (`$T/relaunch-core.test.cjs`). Verify: `node --test --test-name-pattern 'live permission mode' $T/relaunch-core.test.cjs` prints `fail 1`, appended to `$P/scratch/red.txt`.
- [ ] T008 Add `permissionMode` to the live-settings keys at `:1011` and to the `settings` JSDoc at `:978-980` (`.skilled/hooks/session-relaunch/lib/relaunch-core.cjs`). Verify: the T007 command prints `fail 0`, and the T005 command still prints `fail 0`.
- [ ] T009 Add `consume reports the permission mode the record holds` (`$T/session-relaunch-cli.test.cjs`). Verify: `node --test --test-name-pattern 'permission mode the record holds' $T/session-relaunch-cli.test.cjs` prints `fail 1`, appended to `$P/scratch/red.txt`.
- [ ] T010 Add `permissionMode` to the consume keys at `:793` and its comment at `:791-792` (`.skilled/hooks/session-relaunch/bin/session-relaunch.cjs`). Verify: the T009 command prints `fail 0`, and `node --test --test-name-pattern 'model and effort the record holds' $T/session-relaunch-cli.test.cjs` prints `fail 0`.
- [ ] T011 Let the runtime stub write `permissionMode` from `RECORD_PERMISSION_MODE`, beside `RECORD_MODEL` at `:190-192` (`$T/skilled-loop-wrapper-harness.cjs`). Verify: `rg -n 'RECORD_PERMISSION_MODE' $T/skilled-loop-wrapper-harness.cjs` prints one line, and `node --test $T/skilled-loop-wrapper-model-effort.test.cjs` still prints `fail 0`.
- [ ] T012 Add the six wrapper tests: `the sender live permission mode replaces the launch mode for that hop`, `a live permission mode the CLI would reject falls back to the launch mode`, `a live plan mode keeps the launch mode` (as answered in T003), `a live bypass mode with no unlocking launch flag keeps the launch mode` (as T002 found), `a hop with no live permission mode replays the launch mode before the seed` and `manual command carries the live permission mode` (`$T/skilled-loop-wrapper-model-effort.test.cjs`). Verify: `node --test --test-name-pattern 'permission mode|plan mode|bypass mode' $T/skilled-loop-wrapper-model-effort.test.cjs` prints a `fail` count of at least 4, appended to `$P/scratch/red.txt`.
- [ ] T013 Move `--permission-mode plan` ahead of the seed in the expected arguments of `Claude first launch arguments are replayed with --permission-mode and --add-dir` at `:53-57`, keeping its name and its two flags (`$T/skilled-loop-wrapper-launch-arguments.test.cjs`). Verify: `node --test --test-name-pattern 'Claude first launch arguments' $T/skilled-loop-wrapper-launch-arguments.test.cjs` prints `fail 1` before T014.
- [ ] T014 Capture a launch `--permission-mode` into exported `SKILLED_LOOP_PERMISSION_MODE` in the scan at `:790-831`, add `claude:--permission-mode` to the record-backed list at `:593`, add a `permission_mode_is_valid` check for the accepted set, append `--permission-mode` after the effort in the Claude branch at `:609-619`, read `permissionMode` in the hop block at `:1252-1272` with the plan and bypass rules, and read and apply it in `read_consumed_live_settings` and `apply_consumed_live_settings` at `:256-308` (`.skilled/bin/skilled-loop`). Verify: `bash -n .skilled/bin/skilled-loop` exits 0, and the T012 and T013 commands each print `fail 0`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T015 Run the five test files in full (`$P/scratch/green.txt`). Verify: `env -u AI_SESSION_CHILD node --test $T/claude-adapters.test.cjs $T/relaunch-core.test.cjs $T/session-relaunch-cli.test.cjs $T/skilled-loop-wrapper-model-effort.test.cjs $T/skilled-loop-wrapper-launch-arguments.test.cjs` exits 0 with `fail 0` and a test count of 479 plus the tests added in T005, T007, T009 and T012.
- [ ] T016 Confirm Codex is untouched (`.skilled/hooks/session-relaunch/codex/stop-arm.mjs`). Verify: `rg -n "permissionMode" .skilled/hooks/session-relaunch/codex` prints nothing and exits 1.
- [ ] T017 Confirm the new key reaches only the planned files (`.skilled`). Verify: `rg -l "permissionMode|PERMISSION_MODE" .skilled/hooks/session-relaunch .skilled/bin` lists only files from the Files to Change table in `spec.md`.
- [ ] T018 Validate the phase folder (`$P`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh $P --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed: `$P/scratch/live-checks.md` holds the four live result lines of T001 and T002
- [ ] `$P/scratch/red.txt` and `$P/scratch/green.txt` hold the failing and passing runs of each new test
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Research**: `../research/research.md` section 5 (Permission mode) and section 9 rank 5
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

A task blocked by a missing live fact or a missing operator answer is marked `[B]` with the reason in `goal.md` section 4, and the phase does not close while it stays `[B]`.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md: `rg -c '^\| REQ-0' $P/spec.md` prints 10
- [ ] CHK-002 [P0] Technical approach defined in plan.md: `rg -n '^## 3. ARCHITECTURE' $P/plan.md` prints one line
- [ ] CHK-003 [P1] Dependencies identified and available: `claude --version` prints `2.1.323 (Claude Code)` and phases 012 and 014 have no source change in `git status --short .skilled`
- [ ] CHK-004 [P0] The two live facts are recorded before any source edit: T001 and T002 verify lines print
- [ ] CHK-005 [P0] The operator's plan-mode answer is recorded: T003 verify line prints
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `bash -n .skilled/bin/skilled-loop` exits 0 and `node --check .skilled/hooks/session-relaunch/bin/session-relaunch.cjs` exits 0
- [ ] CHK-011 [P0] No new warning on a plain hop: the existing `the sender live model and effort replace the launch values for that hop` test still passes with no stderr assertion changed
- [ ] CHK-012 [P1] Error handling implemented: an unknown live mode prints the REQ-006 warning and the hop still runs
- [ ] CHK-013 [P1] Code follows project patterns: the mode is read with `consumed_field` and checked by a `*_is_valid` function, like model and effort
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met: `rg -c '\| Unmet \|' $P/acceptance-criteria.md` prints 0
- [ ] CHK-021 [P0] Manual testing complete: T001 and T002 lines are in `$P/scratch/live-checks.md`
- [ ] CHK-022 [P1] Edge cases tested: the unknown-mode, no-live-mode, plan and bypass tests pass
- [ ] CHK-023 [P1] Error scenarios validated: the unknown-mode test asserts the warning text
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: research rank 5 is `cross-consumer`, one value crossing the adapter, core, CLI and wrapper.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed: `rg -n "arm\(\{" .skilled/hooks/session-relaunch .opencode/plugins/session-relaunch.js --glob '!tests/**'` lists four callers, and only the Claude one changes.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed: T017 lists only the planned files.
- [ ] CHK-FIX-004 [P0] Adversarial cases: the unknown-mode test feeds a value outside the accepted set, and the bypass test feeds a mode with no unlocking launch flag.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed: `plan.md` FIX ADDENDUM names three axes and six covered rows.
- [ ] CHK-FIX-006 [P1] Hostile env variant: the wrapper tests run with `SKILLED_LOOP_PERMISSION_MODE` set in the parent env and assert the live value wins.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to the build commit named in `goal.md` section 4.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets: the change reads no credential
- [ ] CHK-031 [P0] Input validation implemented: the wrapper passes only a mode from the accepted set
- [ ] CHK-032 [P1] No permission escalation: the wrapper adds no `--dangerously-skip-permissions` or `--allow-dangerously-skip-permissions`, checked by `rg -n 'launch_arguments\+=\(--(allow-)?dangerously' .skilled/bin/skilled-loop` printing nothing
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan and tasks name the same ten files to change
- [ ] CHK-041 [P1] Code comments say why the plan and bypass rules exist, with no phase or task id in them
- [ ] CHK-042 [P2] README updated: not in this phase, phase 017 owns it
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Live-check output and red and green runs live under `$P/scratch/` only
- [ ] CHK-051 [P1] `$P/scratch/live/` holds no Claude session folder after T002: `ls $P/scratch/live` lists only the settings file and the captured payloads
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 0/14 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-13
<!-- /ANCHOR:summary -->

---
