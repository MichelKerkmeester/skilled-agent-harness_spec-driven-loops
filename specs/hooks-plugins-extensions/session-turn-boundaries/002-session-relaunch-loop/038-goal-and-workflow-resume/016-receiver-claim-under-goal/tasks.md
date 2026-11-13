---
title: "Tasks: Phase 16: receiver-claim-under-goal"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "receiver claim under goal tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 16: receiver-claim-under-goal

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

**Task variables**: `PH` is `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/016-receiver-claim-under-goal`. `H028` is `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/028-goal-rebind-live-proof-and-docs/scratch/harness`. `H` is `$PH/scratch/harness`. `SR` is `.skilled/hooks/session-relaunch`. `TESTS` is `.skilled/hooks/session-relaunch/tests`.

**Test environment**: run the suites with `AI_SESSION_CHILD` unset, as `env -u AI_SESSION_CHILD node --test <file>`. Run each live hop from the repository root as the playbook GR-1 block does, with `GOAL_MODE` set for the goal, and each in a fresh sandbox.

**Branch rule**: T008 is the decision gate. T009 runs only on the close branch. T010 to T018 and T020 run only on the build branch.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Copy the 028 harness into the phase (`$H`). Verify: `diff -r "$H028" "$H"` prints nothing and exits 0.
- [ ] T002 Add an `open` goal mode to the copy, read from a third argument that `build-sandbox.sh` passes from `GOAL_MODE` (`$H/make-goal.cjs`, `$H/build-sandbox.sh`). Verify: `node "$H/make-goal.cjs" "$PH/scratch/g-open" 3990 open` then `grep -c -E 'PONG|do nothing else' "$PH/scratch/g-open/goal.md"` prints 0.
- [ ] T003 Confirm the default mode still writes the 028 goal (`$H/make-goal.cjs`). Verify: `node "$H/make-goal.cjs" "$PH/scratch/g-new" 3990 && node "$H028/make-goal.cjs" "$PH/scratch/g-old" 3990 && cmp "$PH/scratch/g-new/goal.md" "$PH/scratch/g-old/goal.md"` exits 0.
- [ ] T004 Record the Claude Code version for the run set (`goal.md`). Verify: `claude --version` prints the version the `goal.md` log row names.
- [ ] T005 Record which `SessionStart` adapter drifts in a fresh sandbox, the confounder in the start context (`goal.md`). Verify: `rg -n 'compact-pointer.mjs|SessionStart' "<sandbox>/.claude/settings.json"` lists the adapters, and `ls` on each named adapter path under the sandbox names the missing one in the `goal.md` log.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 Run ten live goal hops under the `open` goal, one fresh sandbox each, keeping each run's evidence (`$PH/scratch/live-open/<n>/`). Verify: `ls "$PH/scratch/live-open" | wc -l` prints 10.
- [ ] T007 Confirm every run delivered the start claim (`$PH/scratch/live-open/*/relaunch.log`). Verify: `rg -l goal-start-claim "$PH"/scratch/live-open/*/relaunch.log | wc -l` prints 10, and a run that prints no line is rerun, not counted.
- [ ] T008 Count the claims and write the decision gate row (`goal.md`). Verify: `rg -l 'Z  claimed ' "$PH"/scratch/live-open/*/history.txt | wc -l` prints the count the gate row names, and the row names close at 10 and build below 10.
- [ ] T009 Close branch only: write `decision-record.md` with ADR-001 that waives AC-004 to AC-010 on the measured count (`decision-record.md`, `acceptance-criteria.md`). Verify: `rg -c 'ADR-001' "$PH/acceptance-criteria.md"` prints 7.
- [ ] T010 Build branch: add the claim-line test, which must fail first (`TESTS/goal-handover.test.cjs`). Verify: `node --test --test-name-pattern 'appends the claim line after the slice' .skilled/hooks/session-relaunch/tests/goal-handover.test.cjs` exits 1 with the missing line in the failure.
- [ ] T011 Build branch: add the limit fallback test, which must fail first (`TESTS/goal-handover.test.cjs`). Verify: `node --test --test-name-pattern 'drops the claim line, not the goal' .skilled/hooks/session-relaunch/tests/goal-handover.test.cjs` exits 1.
- [ ] T012 Build branch: give `renderGoalSlice` a `claimLine` that joins after a blank line when the whole text fits 4,000 characters and is dropped otherwise (`SR/lib/goal-handover.cjs`). Verify: `node --test .skilled/hooks/session-relaunch/tests/goal-handover.test.cjs` exits 0 with `fail 0`.
- [ ] T013 Build branch: change the goal-hop wrapper test to expect the claim line after the slice, which must fail first (`TESTS/skilled-loop-wrapper-claim-goal.test.cjs`). Verify: `env -u AI_SESSION_CHILD node --test --test-name-pattern 'starts on the goal command and carries the claim' .skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-claim-goal.test.cjs` exits 1 on the argument assertion.
- [ ] T014 Build branch: pass the seed through `render_goal_slice` on the hop path and the manual-claim path (`.skilled/bin/skilled-loop`). Verify: `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-claim-goal.test.cjs` exits 0 with `fail 0`.
- [ ] T015 Build branch: add the packet search test for a condition that ends with the claim line, which may pass at once (`TESTS/relaunch-core.test.cjs`). Verify: `node --test --test-name-pattern 'ends with the claim line still resolves its packet' .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0 with `fail 0`.
- [ ] T016 Build branch: rewrite the one README sentence on line 183 so it names the claim line after the slice and the limit that drops it (`SR/README.md`). Verify: `rg -n 'claim line' .skilled/hooks/session-relaunch/README.md` prints 1 line, and `git diff --numstat -- .skilled/hooks/session-relaunch/README.md` prints `1 1`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T017 Build branch: run the four test files (`TESTS`). Verify: `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/goal-handover.test.cjs .skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-claim-goal.test.cjs .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits 0 with `fail 0`.
- [ ] T018 Build branch: run the named guard tests by title (`TESTS`). Verify: `env -u AI_SESSION_CHILD node --test --test-name-pattern 'renders exactly the chat slice|sends a slice of exactly 4000|keeps the claim seed as its start prompt|delivers the claim at the start of a goal-command receiver|goal headline outside' .skilled/hooks/session-relaunch/tests/goal-handover.test.cjs .skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-claim-goal.test.cjs .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0 with `fail 0`.
- [ ] T019 Run every relaunch suite (`SR/tests`). Verify: `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/*.test.cjs` exits 0 with `fail 0`.
- [ ] T020 Build branch: run ten live hops under each goal with a 3,500-character slice (`$PH/scratch/live-after/pong/<n>/`, `$PH/scratch/live-after/open/<n>/`). Verify: `rg -l '^status: done' "$PH"/scratch/live-after/*/*/note-final.md | wc -l` prints 20.
- [ ] T021 Confirm the phase touched only its named files (`.skilled`). Verify: `git diff --name-only -- .skilled` prints nothing on the close branch, and only `goal-handover.cjs`, `skilled-loop`, `README.md` and the three test files on the build branch.
- [ ] T022 Run strict validation on the phase (`$PH`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/016-receiver-claim-under-goal --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks of the branch taken marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] The decision gate row in `goal.md` names the claim count and the branch
- [ ] Every row of `acceptance-criteria.md` is `Met`, or `Waived` by ADR-001 on the close branch
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decision record**: `decision-record.md`, written by T009 on the close branch only
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

A build-branch item on the close branch is marked with the ADR that waives it, never ticked.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md. Verify: `rg -c '^\| REQ-' spec.md` prints 10.
- [ ] CHK-002 [P0] Technical approach defined in plan.md. Verify: `rg -n '^## 4. IMPLEMENTATION PHASES' plan.md` prints 1 line.
- [ ] CHK-003 [P1] The operator gave the greenlight. Verify: the `goal.md` log names the date and the words of the greenlight.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The changed sources parse. Verify: `node --check .skilled/hooks/session-relaunch/lib/goal-handover.cjs && bash -n .skilled/bin/skilled-loop` exits 0.
- [ ] CHK-011 [P0] No console output is added to the changed sources. Verify: `git diff -U0 -- .skilled/hooks/session-relaunch/lib .skilled/bin` prints no added `console.` line.
- [ ] CHK-012 [P1] No spec path, phase number or task id lands in a code comment. Verify: `git diff -U0 -- .skilled` prints no added line matching `specs/`, `T0` or `phase 16`.
- [ ] CHK-013 [P1] The join keeps the durable WHY in its comment. Verify: `rg -n 'headline' .skilled/hooks/session-relaunch/lib/goal-handover.cjs` prints at least 1 line.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] Every acceptance row is `Met`, or `Waived` by ADR-001. Verify: `rg -c '\| Unmet \|' acceptance-criteria.md` prints 0.
- [ ] CHK-021 [P0] The decision gate rests on ten counted runs. Verify: `rg -l goal-start-claim scratch/live-open/*/relaunch.log | wc -l` prints 10.
- [ ] CHK-022 [P0] On the build branch, twenty live runs end done. Verify: `rg -l '^status: done' scratch/live-after/*/*/note-final.md | wc -l` prints 20.
- [ ] CHK-023 [P1] Each must-fail test holds a red run. Verify: `rg -c '^not ok' scratch/red.txt` prints 3.
- [ ] CHK-024 [P1] The relaunch suites pass. Verify: `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/*.test.cjs` exits 0 with `fail 0`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [ ] CHK-FIX-001 [P0] The finding carries its class in `plan.md`. Verify: `rg -n 'matrix/evidence|instance-only' plan.md` prints the class line.
- [ ] CHK-FIX-002 [P0] The same-class producer inventory ran. Verify: `rg -n '"/goal ' .skilled/bin/skilled-loop` prints 2 lines.
- [ ] CHK-FIX-003 [P0] The consumer inventory ran. Verify: `rg -n 'renderGoalSlice|render_goal_slice' .skilled .opencode` lists the helper, the wrapper and the tests only.
- [ ] CHK-FIX-004 [P0] The limit case is tested at 3,990 characters. Verify: `rg -n '3990' .skilled/hooks/session-relaunch/tests/goal-handover.test.cjs` prints at least 1 line.
- [ ] CHK-FIX-005 [P1] The matrix axes are listed before completion. Verify: `rg -n 'Matrix axes' plan.md` prints 1 line.
- [ ] CHK-FIX-006 [P1] The live runs drop the host session's loop variables. Verify: `rg -n 'SKILLED_LOOP_|CLAUDE' scratch/harness/run-hop.sh` lists the unset lines.
- [ ] CHK-FIX-007 [P1] The evidence is pinned to a commit. Verify: `git rev-parse HEAD` prints the commit the `goal.md` log names at close.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secret is added. Verify: `git diff -U0` prints no added line matching `api_key`, `password` or `secret`.
- [ ] CHK-031 [P0] The claim line passes the control-character check. Verify: `node --test --test-name-pattern 'refuses output that is not a usable slice' .skilled/hooks/session-relaunch/tests/goal-handover.test.cjs` exits 0.
- [ ] CHK-032 [P1] The run extracts hold no operator instruction file. Verify: `ls scratch/live-open/*/` lists no raw `.jsonl` transcript.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan, tasks, criteria and goal name the same change. Verify: `rg -l 'claim line' spec.md plan.md tasks.md acceptance-criteria.md goal.md` lists 5 files.
- [ ] CHK-041 [P1] README line 183 names the claim line. Verify: `rg -n 'claim line' .skilled/hooks/session-relaunch/README.md` prints 1 line.
- [ ] CHK-042 [P2] The playbook follow-up is handed to phase 017. Verify: the `goal.md` log names the GR-1 change phase 017 must make.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] The harness copy and the run evidence live in this phase's `scratch/`. Verify: `ls scratch` lists `harness` and `live-open`.
- [ ] CHK-051 [P1] The goal fixtures from T002 and T003 are removed. Verify: `ls scratch` lists no `g-open`, `g-new` or `g-old`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 0/13 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-13
<!-- /ANCHOR:summary -->

---
