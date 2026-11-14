---
title: "Tasks: Phase 2: persisted-loop-state-and-failure-policy"
description: "Ordered tasks to derive the loop counters from the state log, exclude failed iterations from the stop vote, keep one failure rule and leave the reducer as the only dashboard writer."
trigger_phrases:
  - "persisted loop state and failure policy tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 2: persisted-loop-state-and-failure-policy

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

Run every command from the repository root after setting two shell variables. `W` is `.skilled/commands/deep/assets`. `RT` is `.skilled/skills/system-deep-loop/runtime`.

The failing-first tests target functions, not YAML prose. The four-failure stop tests call the vote function phase 001 places in `$RT/scripts/convergence.cjs`, so they can only be written once phase 001 has landed.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Record the baseline runtime suite result in the Progress table (`goal.md`). Verify: `npm --prefix $RT test; echo "exit=$?"` output and exit status appear in `goal.md` section 4.
- [ ] T002 Confirm the stop-decision owner phase 001 recorded (`specs/system-deep-loop/loop-architecture/004-workflow-logic-hardening/001-deterministic-stop-decision/implementation-summary.md`). Verify: `rg -n 'convergence.cjs' specs/system-deep-loop/loop-architecture/004-workflow-logic-hardening/001-deterministic-stop-decision/implementation-summary.md` prints at least one line, or the other owner it names is written into `goal.md` section 4.
- [ ] T003 Add a test that `deriveLoopCounters` returns equal counters for a full fixture log and for a prefix replayed with the remaining records (`$RT/tests/unit/loop-counters-derivation.vitest.ts`). Verify: `npm --prefix $RT test -- tests/unit/loop-counters-derivation.vitest.ts` fails with `deriveLoopCounters is not a function`.
- [ ] T004 Add a test that `error` and `timeout` rows leave `stuckCount` unchanged and that three trailing failed runs give `consecutiveFailureCount` 3 (`$RT/tests/unit/loop-counters-derivation.vitest.ts`). Verify: the same command fails on these cases.
- [ ] T005 Add a test that a research fixture log with four failed iterations does not return a converged stop (`$RT/tests/unit/loop-counters-derivation.vitest.ts`). Verify: the same command fails because the current vote returns a stop.
- [ ] T006 Add a test that a review fixture log with four failed iterations leaves the rolling average and the MAD noise floor unchanged (`$RT/tests/unit/loop-counters-derivation.vitest.ts`). Verify: the same command fails on this case.
- [ ] T007 Add a test that a failure row appended last in the log is counted by the next derivation (`$RT/tests/unit/loop-counters-derivation.vitest.ts`). Verify: the same command fails on this case.
- [ ] T008 Add a test that `stuckCount` resets to 0 at the latest `stuckRecovery` event in a research log and at the latest `deep_review.recovery_started` event in a review log (`$RT/tests/unit/loop-counters-derivation.vitest.ts`). Verify: `npm --prefix $RT test -- tests/unit/loop-counters-derivation.vitest.ts -t recovery` fails before the fix.
- [ ] T009 Add a CLI test that `convergence.cjs --state-log` prints `loop_counters_json` when no coverage-graph database exists (`$RT/tests/unit/loop-counters-derivation.vitest.ts`). Verify: `npm --prefix $RT test -- tests/unit/loop-counters-derivation.vitest.ts -t 'no graph'` fails before the fix.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T010 Add and export `deriveLoopCounters(records, options)` (`$RT/scripts/convergence.cjs`). Verify: `node -e "console.log(typeof require('./$RT/scripts/convergence.cjs').deriveLoopCounters)"` prints `function` and the T003, T004, T007 and T008 cases pass.
- [ ] T011 Add the `--state-log` flag and print `loop_counters_json` before the graph database opens (`$RT/scripts/convergence.cjs`). Verify: the T009 case passes and `rg -n "'stateLog'" $RT/scripts/convergence.cjs` prints one line.
- [ ] T012 Drop `error` and `timeout` records from the ratio inputs of the vote function (`$RT/scripts/convergence.cjs`). Verify: the T005 and T006 cases pass.
- [ ] T013 Bind `stuck_count` and `consecutive_failure_count` from `step_graph_convergence` with a halt on stop reason `error` when `loop_counters_json` is missing, replacing the in-memory sets (`$W/deep-research-auto.yaml`). Verify: `rg -n -e 'stuck_count: 0' -e 'stuck_count \+ 1' $W/deep-research-auto.yaml` prints nothing and `rg -c 'loop_counters_json is missing' $W/deep-research-auto.yaml` prints 1.
- [ ] T014 Bind the same counters with the same halt, replacing the sets in `gate_init_approval.on_A` and `step_update_tracking` (`$W/deep-research-confirm.yaml`). Verify: the T013 commands on this file print nothing and 1.
- [ ] T015 Bind the same counters with the same halt, replacing the sets (`$W/deep-review-auto.yaml`). Verify: the T013 commands on this file print nothing and 1.
- [ ] T016 Bind the same counters with the same halt, replacing the sets (`$W/deep-review-confirm.yaml`). Verify: the T013 commands on this file print nothing and 1.
- [ ] T017 Read `p0_count`, `p1_count` and `p2_count` from `findingsBySeverity` and delete "Accumulate from severity_counts" (`$W/deep-review-auto.yaml`). Verify: `rg -c 'Accumulate from severity_counts' $W/deep-review-auto.yaml` prints nothing and `rg -c 'findingsBySeverity' $W/deep-review-auto.yaml` prints 1 or more.
- [ ] T018 Read the severity counters from `findingsBySeverity` and delete the accumulate lines (`$W/deep-review-confirm.yaml`). Verify: the same two `rg` commands on this file print nothing and 1 or more.
- [ ] T019 Change the vote filter to exclude `thought`, `error` and `timeout` iterations (`$W/deep-research-auto.yaml`). Verify: `rg -c 'whose status is thought, error or timeout' $W/deep-research-auto.yaml` prints 1.
- [ ] T020 Change the vote filter the same way (`$W/deep-research-confirm.yaml`). Verify: the same `rg` command on this file prints 1.
- [ ] T021 Add a filter that excludes `error` and `timeout` iterations from the review vote (`$W/deep-review-auto.yaml`). Verify: `rg -c 'whose status is error or timeout' $W/deep-review-auto.yaml` prints 1.
- [ ] T022 Add the same filter to the review vote (`$W/deep-review-confirm.yaml`). Verify: `rg -c 'whose status is error or timeout' $W/deep-review-confirm.yaml` prints 1.
- [ ] T023 Apply the single failure rule to `step_check_convergence` and `error_recovery` and delete the `escalation` line (`$W/deep-research-auto.yaml`). Verify: `rg -c 'After 3 consecutive failed iterations' $W/deep-research-auto.yaml` prints 1 and `rg -c -e 'trigger stuck_recovery event' -e 'After 3 consecutive errors' -e 'Retry / Skip / Cancel' $W/deep-research-auto.yaml` prints nothing.
- [ ] T024 Apply the single failure rule with the Retry / Skip / Cancel gate before synthesis and delete the `escalation` line and the old `consecutive_failures` wording (`$W/deep-research-confirm.yaml`). Verify: `rg -c 'After 3 consecutive failed iterations' $W/deep-research-confirm.yaml` prints 1, `rg -c 'Retry / Skip / Cancel' $W/deep-research-confirm.yaml` prints 1 or more and `rg -c -e 'trigger stuck_recovery event' -e 'After 3 consecutive errors' $W/deep-research-confirm.yaml` prints nothing.
- [ ] T025 Apply the single failure rule and delete the `escalation` line (`$W/deep-review-auto.yaml`). Verify: the T023 commands on this file print 1 and nothing.
- [ ] T026 Apply the single failure rule with the Retry / Skip / Cancel gate before synthesis and delete the old `consecutive_failures` wording (`$W/deep-review-confirm.yaml`). Verify: the T024 commands on this file print 1, 1 or more and nothing.
- [ ] T027 Delete `step_generate_dashboard` (`$W/deep-research-auto.yaml`). Verify: `rg -c 'step_generate_dashboard' $W/deep-research-auto.yaml` prints nothing.
- [ ] T028 Delete `step_generate_dashboard` (`$W/deep-research-confirm.yaml`). Verify: the same `rg` command on this file prints nothing.
- [ ] T029 Delete `step_generate_dashboard` (`$W/deep-review-auto.yaml`). Verify: the same `rg` command on this file prints nothing.
- [ ] T030 Delete `step_generate_dashboard` and point `on_A` and `on_B` of the post-iteration gate at `step_update_tracking` (`$W/deep-review-confirm.yaml`). Verify: `rg -c 'step_generate_dashboard' $W/deep-review-confirm.yaml` prints nothing.
- [ ] T031 Print the dashboard stuck count from `deriveLoopCounters` (`.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs`). Verify: the REQ-012 case in `loop-counters-derivation.vitest.ts` passes.
- [ ] T032 Update the literal that asserts `stuck_count >= config.stuckThreshold` (`$RT/tests/unit/deep-research-convergence-floor.vitest.ts`). Verify: `npm --prefix $RT test -- tests/unit/deep-research-convergence-floor.vitest.ts` exits 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T033 Regenerate the research contract (`$W/compiled/deep-research.contract.markdown`). Verify: `node $RT/scripts/compile-command-contracts.cjs --command deep/research --write` exits 0 and `node $RT/scripts/check-contract-drift.cjs --command deep/research` exits 0.
- [ ] T034 Regenerate the review contract (`$W/compiled/deep-review.contract.markdown`). Verify: the same two commands with `deep/review` exit 0.
- [ ] T035 Run the new test file (`$RT/tests/unit/loop-counters-derivation.vitest.ts`). Verify: `npm --prefix $RT test -- tests/unit/loop-counters-derivation.vitest.ts` exits 0 with no failed test.
- [ ] T036 Run the whole runtime suite and record the delta against T001 (`goal.md`). Verify: `npm --prefix $RT test; echo "exit=$?"` prints `exit=0` and the pass count is not lower than the baseline.
- [ ] T037 Run the combined workflow text check (`$W/deep-research-auto.yaml`). Verify: `rg -c -e 'step_generate_dashboard' -e 'Accumulate from severity_counts' -e 'trigger stuck_recovery event' -e 'After 3 consecutive errors' $W/deep-re*.yaml` prints nothing, `rg -c 'Retry / Skip / Cancel' $W/deep-re*-auto.yaml` prints nothing and `rg -c 'Retry / Skip / Cancel' $W/deep-re*-confirm.yaml` prints a count for each of the two confirm files.
- [ ] T038 Validate this packet (`spec.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-deep-loop/loop-architecture/004-workflow-logic-hardening/002-persisted-loop-state-and-failure-policy --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] `npm --prefix .skilled/skills/system-deep-loop/runtime test -- tests/unit/loop-counters-derivation.vitest.ts` exits 0 and the four-failure fixture returns no converged stop
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance**: See `acceptance-criteria.md`
- **Goal and decisions**: See `goal.md`
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

A `[B]` task blocks close. It names its blocker in `goal.md` section 4 and stays `[B]` until the blocker clears.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Phase 001 has landed. `rg -n 'convergence.cjs' specs/system-deep-loop/loop-architecture/004-workflow-logic-hardening/001-deterministic-stop-decision/implementation-summary.md` prints at least one line.
- [ ] CHK-002 [P0] The baseline suite result is in `goal.md`. `rg -n 'Baseline suite' goal.md` prints one line.
- [ ] CHK-003 [P1] The Retry, Skip and Cancel open question has an answer. `rg -n 'Answer:' goal.md` prints one line.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `node --check .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` exits 0.
- [ ] CHK-011 [P0] `node --check .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs` exits 0.
- [ ] CHK-012 [P1] All four workflow files parse. `python3 -c "import sys, yaml; [yaml.safe_load(open(p)) for p in sys.argv[1:]]" .skilled/commands/deep/assets/deep-re*.yaml` exits 0.
- [ ] CHK-013 [P1] No new comment names a spec path or a finding id. `git diff -U0 -- .skilled | rg -n -e 'F0[0-9]' -e 'specs/'` prints nothing.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] The resume case passes. `npm --prefix .skilled/skills/system-deep-loop/runtime test -- tests/unit/loop-counters-derivation.vitest.ts -t resume` exits 0.
- [ ] CHK-021 [P0] The four-failure research case passes. The same command with `-t 'four failed'` exits 0.
- [ ] CHK-022 [P0] The whole runtime suite passes. `npm --prefix .skilled/skills/system-deep-loop/runtime test` exits 0.
- [ ] CHK-023 [P1] The empty-log case returns zero counters. The same file with `-t empty` exits 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [ ] CHK-FIX-001 [P0] Each finding has a class. F03 is `class-of-bug`, F04 is `algorithmic`, F07 is `cross-consumer` and F12 is `instance-only`. `rg -n 'class-of-bug' tasks.md` prints this line.
- [ ] CHK-FIX-002 [P0] The same-class producer inventory is done. `rg -n 'stuck_count' .skilled/commands/deep/assets/deep-re*.yaml` prints only the bind and read lines.
- [ ] CHK-FIX-003 [P0] The consumer inventory is done. `rg -ln -e 'step_generate_dashboard' -e 'consecutive_failures' .skilled/skills/system-deep-loop/runtime .skilled/commands/deep/assets` lists no file outside the four workflow files and the compiled contracts.
- [ ] CHK-FIX-004 [P0] N/A. The change touches no security, path, parser or redaction surface beyond the `--state-log` flag, which reuses `validateNamespaceValue`.
- [ ] CHK-FIX-005 [P1] The matrix is listed. `plan.md` names 4 workflow rows and 5 status rows. `rg -n '5 status rows' plan.md` prints one line.
- [ ] CHK-FIX-006 [P1] N/A. The counters read no process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA. `rg -n 'Fix SHA' goal.md` prints one line.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] The scripts read no credential. `git diff -- .skilled/skills/system-deep-loop | rg -n -i -e 'token' -e 'secret' -e 'password'` prints nothing.
- [ ] CHK-031 [P0] `--state-log` rejects a `..` segment and an absolute path outside the repository root. The CLI case in `loop-counters-derivation.vitest.ts` with such a path exits non-zero.
- [ ] CHK-032 [P1] N/A. The change adds no authentication surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md` and `tasks.md` both name `deriveLoopCounters`. `rg -c 'deriveLoopCounters' spec.md tasks.md` prints a count for each file.
- [ ] CHK-041 [P1] The new function has a header comment that states the durable reason. `rg -n -B3 'function deriveLoopCounters' .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` shows a comment.
- [ ] CHK-042 [P2] The doc changes for phase 005 are listed. `rg -n 'phase 005' goal.md` prints at least one line.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temporary fixture copies live under `scratch/`. `git status --short -- . | rg -v -e 'scratch/' -e '\.md$' -e '\.json$'` prints nothing.
- [ ] CHK-051 [P1] `scratch/` holds no task output at close. `ls scratch` lists no file this phase created.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 0/13 |
| P1 Items | 12 | 0/12 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-14
<!-- /ANCHOR:summary -->

---
