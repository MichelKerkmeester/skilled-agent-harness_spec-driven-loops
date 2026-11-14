---
title: "Tasks: Phase 1: deterministic-stop-decision"
description: "Ordered tasks to move the deep-research and deep-review stop decision into convergence.cjs, test it first and make the four workflow files branch on its JSON."
trigger_phrases:
  - "deterministic stop decision tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 1: deterministic-stop-decision

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

Run every command from the repository root. `RT` is `.skilled/skills/system-deep-loop/runtime`. `A` is `.skilled/commands/deep/assets`. `VT` is `node_modules/.bin/vitest run --no-coverage`, run as `(cd $RT && $VT <file>)`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Record the runtime suite baseline in the goal log (`goal.md`). Verify: `(cd $RT && node_modules/.bin/vitest run --no-coverage)` prints a `Tests` summary line, and its passed and failed counts appear in the `goal.md` Progress table.
- [ ] T002 Rerun the Measured Behavior command and compare it with the spec block (`spec.md`). Verify: the command prints the same 27 lines as the spec block, or each difference is logged in `goal.md`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Write failing unit tests for the signals, threshold mapping, guards, gates, graph rule, cap order and enum contract (`$RT/tests/unit/stop-decision.vitest.ts`). Verify: `(cd $RT && $VT tests/unit/stop-decision.vitest.ts)` reports at least one failed test because `buildStopDecision` is not exported yet.
- [ ] T004 Write a failing contract test that the four `step_check_convergence` steps hold no `MAD(`, `mean(last`, `0.08`, `0.05`, `checkQualityGuards` or `graph_decision is absent` and name `stop_decision` (`$RT/tests/unit/stop-decision-yaml-contract.vitest.ts`). Verify: `(cd $RT && $VT tests/unit/stop-decision-yaml-contract.vitest.ts)` reports 4 or more failed tests on today's tree.
- [ ] T005 Add failing CLI cases for `--stop-decision` output, a byte-identical second run and a forced graph error (`$RT/tests/integration/convergence-script.vitest.ts`). Verify: `(cd $RT && $VT tests/integration/convergence-script.vitest.ts -t "stop-decision")` reports the new cases failed with exit 3 for an unknown flag.
- [ ] T006 Add the `--stop-decision` input flags to `CONVERGENCE_FLAGS` and read the config, state log and registry they name (`$RT/scripts/convergence.cjs`). Verify: `(cd $RT && $VT tests/unit/stop-decision.vitest.ts -t "inputs")` reports 0 failed.
- [ ] T007 Implement `computeStopSignals` and `mapReviewThresholds` with `0.8 x` and `0.5 x convergenceThreshold` for review (`$RT/scripts/convergence.cjs`). Verify: `(cd $RT && $VT tests/unit/stop-decision.vitest.ts -t "signals|thresholds")` reports 0 failed, including the 0.10 to 0.08 and 0.05 case and the 0.20 to 0.16 and 0.10 case.
- [ ] T008 Implement `evaluateResearchQualityGuards` with `sourceDiversity`, `focusAlignment` and a non-blocking `singleWeakSource` reported as `notEvaluated` (`$RT/scripts/convergence.cjs`). Verify: `(cd $RT && $VT tests/unit/stop-decision.vitest.ts -t "quality guards")` reports 0 failed.
- [ ] T009 Implement `evaluateReviewLegalStopGates` with the max-iteration cap evaluated before the claim-adjudication veto (`$RT/scripts/convergence.cjs`). Verify: `(cd $RT && $VT tests/unit/stop-decision.vitest.ts -t "legal-stop gates|cap")` reports 0 failed, and the cap case returns `maxIterationsReached` with `claimAdjudicationGate` in the failed gates.
- [ ] T010 Implement `combineGraphDecision` and `buildStopDecision`, catch graph errors as a missing decision and keep the empty-graph path running the vote (`$RT/scripts/convergence.cjs`). Verify: `(cd $RT && $VT tests/unit/stop-decision.vitest.ts tests/integration/convergence-script.vitest.ts)` reports 0 failed.
- [ ] T011 Pass the stop-decision flags in `step_graph_convergence` and replace the `step_check_convergence` vote with a branch on `stop_decision` (`$A/deep-research-auto.yaml`). Verify: `(cd $RT && $VT tests/unit/stop-decision-yaml-contract.vitest.ts -t "deep-research-auto")` reports 0 failed.
- [ ] T012 Apply the same change to the research confirm workflow (`$A/deep-research-confirm.yaml`). Verify: `(cd $RT && $VT tests/unit/stop-decision-yaml-contract.vitest.ts -t "deep-research-confirm")` reports 0 failed.
- [ ] T013 Apply the same change and set the stuck counter to `0.5 x convergenceThreshold` (`$A/deep-review-auto.yaml`). Verify: `(cd $RT && $VT tests/unit/stop-decision-yaml-contract.vitest.ts -t "deep-review-auto")` reports 0 failed and `rg -n '0\.05\b' $A/deep-review-auto.yaml` prints nothing.
- [ ] T014 Apply the same change and set the stuck counter to `0.5 x convergenceThreshold` (`$A/deep-review-confirm.yaml`). Verify: `(cd $RT && $VT tests/unit/stop-decision-yaml-contract.vitest.ts -t "deep-review-confirm")` reports 0 failed and `rg -n '0\.05\b' $A/deep-review-confirm.yaml` prints nothing.
- [ ] T015 Point the parity assertions at the new `step_check_convergence` body (`$RT/tests/unit/stop-policy-yaml-parity.vitest.ts`). Verify: `(cd $RT && $VT tests/unit/stop-policy-yaml-parity.vitest.ts)` reports 0 failed.
- [ ] T016 List the eight frozen enum values in the convergence report line (`.skilled/skills/system-deep-loop/deep-research/SKILL.md`). Verify: `rg -n 'Stop reason \(' .skilled/skills/system-deep-loop/deep-research/SKILL.md` prints one line naming `converged`, `maxIterationsReached`, `blockedStop`, `stuckRecovery`, `error`, `manualStop`, `userPaused` and `maxDurationReached` and no other reason.
- [ ] T022 Add `maxDurationReached` as the last expected `STOP_REASONS` value (`$RT/tests/unit/lifecycle-taxonomy.vitest.ts`). Verify: `(cd $RT && $VT tests/unit/lifecycle-taxonomy.vitest.ts)` reports 1 or more failed before T023.
- [ ] T023 Append `maxDurationReached` to `STOP_REASONS` after `userPaused` and to the `LoopStopReasonValue` typedef (`$RT/lib/deep-loop/lifecycle-taxonomy.cjs`). Verify: `node -e "console.log(Object.values(require('./$RT/lib/deep-loop/lifecycle-taxonomy.cjs').STOP_REASONS).join(','))"` prints `converged,maxIterationsReached,blockedStop,manualStop,error,stuckRecovery,userPaused,maxDurationReached` and the T022 test reports 0 failed.
- [ ] T024 Add `maxDurationReached` to `stop_reasons_enum`, the synthesis `reason` enum and `excluded_reasons` (`$A/deep-research-auto.yaml`). Verify: `rg -c maxDurationReached $A/deep-research-auto.yaml` prints 3.
- [ ] T025 Add `maxDurationReached` to `stop_reasons_enum`, the synthesis `reason` enum and `excluded_reasons` (`$A/deep-research-confirm.yaml`). Verify: `rg -c maxDurationReached $A/deep-research-confirm.yaml` prints 3.
- [ ] T026 Add `maxDurationReached` to the `step_normalize_pause_events` enum, the synthesis `reason` enum and `excluded_reasons` (`$A/deep-review-auto.yaml`). Verify: `rg -c maxDurationReached $A/deep-review-auto.yaml` prints 3.
- [ ] T027 Add `maxDurationReached` to the `step_normalize_pause_events` enum, the synthesis `reason` enum and `excluded_reasons` (`$A/deep-review-confirm.yaml`). Verify: `rg -c maxDurationReached $A/deep-review-confirm.yaml` prints 3 and `(cd $RT && $VT tests/unit/lifecycle-taxonomy-yaml-parity.vitest.ts)` reports 0 failed.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T017 Run the four phase test files (`$RT/tests/unit/stop-decision.vitest.ts`). Verify: `(cd $RT && $VT tests/unit/stop-decision.vitest.ts tests/unit/stop-decision-yaml-contract.vitest.ts tests/integration/convergence-script.vitest.ts tests/unit/stop-policy-yaml-parity.vitest.ts)` reports 0 failed.
- [ ] T018 Run the full runtime suite against the T001 baseline (`$RT/package.json`). Verify: `(cd $RT && node_modules/.bin/vitest run --no-coverage)` reports 0 failed and a passed count equal to the baseline plus the new tests.
- [ ] T019 Rerun the Measured Behavior command (`spec.md`). Verify: it prints no line for `stop if avg <= 0.08`, `latest ratio <= 0.05`, `newFindingsRatio <= 0.05`, `guardResult = checkQualityGuards`, `graph_decision is absent` or `Skip hard stops (1)`.
- [ ] T020 Confirm one `convergence.cjs` call per workflow file (`$A/deep-research-auto.yaml`). Verify: `rg -c 'runtime/scripts/convergence\.cjs' $A/deep-research-*.yaml $A/deep-review-*.yaml` prints `1` for each of the four files.
- [ ] T021 Confirm the divergent pivots read the detail field (`$A/deep-review-auto.yaml`). Verify: `rg -c 'stop_decision\.reasonDetail' $A/deep-research-*.yaml $A/deep-review-*.yaml` prints a count of 1 or more for each of the four files.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] The full runtime suite run in T018 reports 0 failed and every row in `acceptance-criteria.md` is `Met`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Goal and log**: See `goal.md`
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

A blocked task is marked `[B]` with its blocker logged in `goal.md`, and the phase does not close while one remains.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] `rg -c '^\| REQ-0' spec.md` in this folder prints 13.
- [ ] CHK-002 [P0] `rg -n '^## 4' plan.md` in this folder prints one line.
- [ ] CHK-003 [P1] The T001 baseline counts appear in the `goal.md` Progress table.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `node --check .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` exits 0.
- [ ] CHK-011 [P0] `(cd $RT && npm run typecheck)` exits 0.
- [ ] CHK-012 [P1] A graph error under `--stop-decision` exits 0 with `graphDecision` `null`, shown by the T005 case.
- [ ] CHK-013 [P1] `rg -n 'specs/|REQ-0|F0[0-9]|F1[0-9]|F2[0-9]' $RT/scripts/convergence.cjs` prints no new line, so no comment carries an ephemeral label.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] T017 reports 0 failed.
- [ ] CHK-021 [P0] T018 reports 0 failed against the baseline.
- [ ] CHK-022 [P1] The unit test covers all four graph-decision values for research and review at and below the cap.
- [ ] CHK-023 [P1] The integration test runs `--stop-decision` twice and compares the two `stop_decision` strings byte for byte.
- [ ] CHK-024 [P0] `(cd $RT && $VT tests/unit/lifecycle-taxonomy.vitest.ts tests/unit/lifecycle-taxonomy-yaml-parity.vitest.ts)` reports 0 failed with `maxDurationReached` in the enum.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [ ] CHK-FIX-001 [P0] Classes: F01 `algorithmic`, F02 `instance-only`, F05 `class-of-bug`, F08 `cross-consumer`, F11 `cross-consumer`, F22 `instance-only`.
- [ ] CHK-FIX-002 [P0] `rg -n '0\.08|0\.05\b|Skip hard stops' $A/deep-review-*.yaml` and `rg -n 'checkQualityGuards|graph_decision is absent' $A/deep-research-*.yaml` both print nothing.
- [ ] CHK-FIX-003 [P0] `rg -n 'composite_converged|all_questions_answered|all_dimensions_clean|minIterationsNotReached' $A/deep-research-*.yaml $A/deep-review-*.yaml` prints only lines that read or compare `reasonDetail`.
- [ ] CHK-FIX-004 [P0] N/A. The change touches no security, path, parser or redaction code. `--stop-decision` paths go through the existing `validateNamespaceValue` checks.
- [ ] CHK-FIX-005 [P1] The matrix axes in `plan.md` Affected Surfaces are covered by named unit cases.
- [ ] CHK-FIX-006 [P1] N/A. The new functions read no environment variable or process-wide state.
- [ ] CHK-FIX-007 [P1] The `implementation-summary.md` evidence names the fix commit SHA.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] `rg -n -i 'token|secret|password' $RT/scripts/convergence.cjs` prints no new line.
- [ ] CHK-031 [P0] A missing config or state path exits 3 with `{"status":"error"}`, shown by a T005 case.
- [ ] CHK-032 [P1] N/A. The script has no authentication surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `rg -c 'REQ-0' spec.md acceptance-criteria.md` in this folder prints 13 or more for each file.
- [ ] CHK-041 [P1] The `convergence.cjs` header comment names the `stop_decision` fields and the `reasonDetail` values.
- [ ] CHK-042 [P2] T016 shows `deep-research/SKILL.md` line 271 names the frozen enum.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Test fixtures live under `$RT/tests/fixtures/` and temporary files under this folder's `scratch/`.
- [ ] CHK-051 [P1] `ls scratch/` in this folder lists nothing created by this phase before close.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 0/13 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-14
<!-- /ANCHOR:summary -->

---
