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

- [x] T001 Record the runtime suite baseline in the goal log (`goal.md`). Verify: `(cd $RT && node_modules/.bin/vitest run --no-coverage)` prints a `Tests` summary line, and its passed and failed counts appear in the `goal.md` Progress table.
- [x] T002 Rerun the Measured Behavior command and compare it with the spec block (`spec.md`). Verify: the command prints the same 27 lines as the spec block, or each difference is logged in `goal.md`. Evidence: `git grep` of the same patterns at the baseline commit `4fa6dc4778` printed the same 24 workflow lines, 0 runtime matches and the two script and SKILL.md lines as the spec block.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Write failing unit tests for the signals, threshold mapping, guards, gates, graph rule, cap order and enum contract (`$RT/tests/unit/stop-decision.vitest.ts`). Verify: `(cd $RT && $VT tests/unit/stop-decision.vitest.ts)` reports at least one failed test because `buildStopDecision` is not exported yet.
- [x] T004 Write a failing contract test that the four `step_check_convergence` steps hold no `MAD(`, `mean(last`, `0.08`, `0.05`, `checkQualityGuards` or `graph_decision is absent` and name `stop_decision` (`$RT/tests/unit/stop-decision-yaml-contract.vitest.ts`). Verify: `(cd $RT && $VT tests/unit/stop-decision-yaml-contract.vitest.ts)` reports 4 or more failed tests on today's tree.
- [x] T005 Add failing CLI cases for `--stop-decision` output, a byte-identical second run and a forced graph error (`$RT/tests/integration/convergence-script.vitest.ts`). Verify: `(cd $RT && $VT tests/integration/convergence-script.vitest.ts -t "stop-decision")` reports the new cases failed with exit 3 for an unknown flag.
- [x] T006 Add the `--stop-decision` input flags to `CONVERGENCE_FLAGS` and read the config, state log and registry they name (`$RT/scripts/convergence.cjs`). Verify: `(cd $RT && $VT tests/unit/stop-decision.vitest.ts -t "inputs")` reports 0 failed.
- [x] T007 Implement `computeStopSignals` and `mapReviewThresholds` with `0.8 x` and `0.5 x convergenceThreshold` for review (`$RT/scripts/convergence.cjs`). Verify: `(cd $RT && $VT tests/unit/stop-decision.vitest.ts -t "signals|thresholds")` reports 0 failed, including the 0.10 to 0.08 and 0.05 case and the 0.20 to 0.16 and 0.10 case.
- [x] T008 Implement `evaluateResearchQualityGuards` with `sourceDiversity`, `focusAlignment` and a non-blocking `singleWeakSource` reported as `notEvaluated` (`$RT/scripts/convergence.cjs`). Verify: `(cd $RT && $VT tests/unit/stop-decision.vitest.ts -t "quality guards")` reports 0 failed.
- [x] T009 Implement `evaluateReviewLegalStopGates` with the max-iteration cap evaluated before the claim-adjudication veto (`$RT/scripts/convergence.cjs`). Verify: `(cd $RT && $VT tests/unit/stop-decision.vitest.ts -t "legal-stop gates|cap")` reports 0 failed, and the cap case returns `maxIterationsReached` with `claimAdjudicationGate` in the failed gates.
- [x] T010 Implement `combineGraphDecision` and `buildStopDecision`, catch graph errors as a missing decision and keep the empty-graph path running the vote (`$RT/scripts/convergence.cjs`). Verify: `(cd $RT && $VT tests/unit/stop-decision.vitest.ts tests/integration/convergence-script.vitest.ts)` reports 0 failed.
- [x] T011 Pass the stop-decision flags in `step_graph_convergence` and replace the `step_check_convergence` vote with a branch on `stop_decision` (`$A/deep-research-auto.yaml`). Verify: `(cd $RT && $VT tests/unit/stop-decision-yaml-contract.vitest.ts -t "deep-research-auto")` reports 0 failed. Evidence: `stop-decision-yaml-contract.vitest.ts` reports 22 passed, 0 failed for all four files.
- [x] T012 Apply the same change to the research confirm workflow (`$A/deep-research-confirm.yaml`). Verify: `(cd $RT && $VT tests/unit/stop-decision-yaml-contract.vitest.ts -t "deep-research-confirm")` reports 0 failed. Evidence: Same run: 22 passed, 0 failed.
- [x] T013 Apply the same change and set the stuck counter to `0.5 x convergenceThreshold` (`$A/deep-review-auto.yaml`). Verify: `(cd $RT && $VT tests/unit/stop-decision-yaml-contract.vitest.ts -t "deep-review-auto")` reports 0 failed and `rg -n '0\.05\b' $A/deep-review-auto.yaml` prints nothing. Evidence: Same run: 22 passed, and `rg -n '0\.05\b'` on the file prints nothing.
- [x] T014 Apply the same change and set the stuck counter to `0.5 x convergenceThreshold` (`$A/deep-review-confirm.yaml`). Verify: `(cd $RT && $VT tests/unit/stop-decision-yaml-contract.vitest.ts -t "deep-review-confirm")` reports 0 failed and `rg -n '0\.05\b' $A/deep-review-confirm.yaml` prints nothing. Evidence: Same run: 22 passed, and `rg -n '0\.05\b'` on the file prints nothing.
- [x] T015 Point the parity assertions at the new `step_check_convergence` body (`$RT/tests/unit/stop-policy-yaml-parity.vitest.ts`). Verify: `(cd $RT && $VT tests/unit/stop-policy-yaml-parity.vitest.ts)` reports 0 failed. Evidence: No edit was needed: `stop-policy-yaml-parity.vitest.ts` passes unchanged against the new step body.
- [x] T016 List the eight frozen enum values in the convergence report line (`.skilled/skills/system-deep-loop/deep-research/SKILL.md`). Verify: `rg -n 'Stop reason \(' .skilled/skills/system-deep-loop/deep-research/SKILL.md` prints one line naming `converged`, `maxIterationsReached`, `blockedStop`, `stuckRecovery`, `error`, `manualStop`, `userPaused` and `maxDurationReached` and no other reason. Evidence: Line 271 reads `Stop reason (converged, maxIterationsReached, blockedStop, stuckRecovery, error, manualStop, userPaused, maxDurationReached)`.
- [x] T022 Add `maxDurationReached` as the last expected `STOP_REASONS` value (`$RT/tests/unit/lifecycle-taxonomy.vitest.ts`). Verify: `(cd $RT && $VT tests/unit/lifecycle-taxonomy.vitest.ts)` reports 1 or more failed before T023.
- [x] T023 Append `maxDurationReached` to `STOP_REASONS` after `userPaused` and to the `LoopStopReasonValue` typedef (`$RT/lib/deep-loop/lifecycle-taxonomy.cjs`). Verify: `node -e "console.log(Object.values(require('./$RT/lib/deep-loop/lifecycle-taxonomy.cjs').STOP_REASONS).join(','))"` prints `converged,maxIterationsReached,blockedStop,manualStop,error,stuckRecovery,userPaused,maxDurationReached` and the T022 test reports 0 failed.
- [x] T024 Add `maxDurationReached` to `stop_reasons_enum`, the synthesis `reason` enum and `excluded_reasons` (`$A/deep-research-auto.yaml`). Verify: `rg -c maxDurationReached $A/deep-research-auto.yaml` prints 3.
- [x] T025 Add `maxDurationReached` to `stop_reasons_enum`, the synthesis `reason` enum and `excluded_reasons` (`$A/deep-research-confirm.yaml`). Verify: `rg -c maxDurationReached $A/deep-research-confirm.yaml` prints 3.
- [x] T026 Add `maxDurationReached` to the `step_normalize_pause_events` enum, the synthesis `reason` enum and `excluded_reasons` (`$A/deep-review-auto.yaml`). Verify: `rg -c maxDurationReached $A/deep-review-auto.yaml` prints 3.
- [x] T027 Add `maxDurationReached` to the `step_normalize_pause_events` enum, the synthesis `reason` enum and `excluded_reasons` (`$A/deep-review-confirm.yaml`). Verify: `rg -c maxDurationReached $A/deep-review-confirm.yaml` prints 3 and `(cd $RT && $VT tests/unit/lifecycle-taxonomy-yaml-parity.vitest.ts)` reports 0 failed.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T017 Run the four phase test files (`$RT/tests/unit/stop-decision.vitest.ts`). Verify: `(cd $RT && $VT tests/unit/stop-decision.vitest.ts tests/unit/stop-decision-yaml-contract.vitest.ts tests/integration/convergence-script.vitest.ts tests/unit/stop-policy-yaml-parity.vitest.ts)` reports 0 failed. Evidence: The four files ran inside an eight-file run after commit `95c295ac77`: 170 passed, 0 failed.
- [x] T018 Run the full runtime suite against the T001 baseline (`$RT/package.json`). Verify: `(cd $RT && node_modules/.bin/vitest run --no-coverage)` reports 0 failed and a passed count equal to the baseline plus the new tests. Evidence: Full runtime suite on the final tree: 175 test files, 2986 passed, 8 skipped, 0 failed (baseline 2891 passed, plus 95 new tests).
- [x] T019 Rerun the Measured Behavior command (`spec.md`). Verify: it prints no line for `stop if avg <= 0.08`, `latest ratio <= 0.05`, `newFindingsRatio <= 0.05`, `guardResult = checkQualityGuards`, `graph_decision is absent` or `Skip hard stops (1)`. Evidence: The command prints only the `convergence_threshold`, `max_repeats` and `stop_reasons_enum` lines. The runtime `checkQualityGuards` count is now 1, the contract test that names the banned literal.
- [x] T020 Confirm one `convergence.cjs` call per workflow file (`$A/deep-research-auto.yaml`). Verify: `rg -c 'runtime/scripts/convergence\.cjs' $A/deep-research-*.yaml $A/deep-review-*.yaml` prints `1` for each of the four files. Evidence: `rg -c` prints 1 for each of the four files.
- [x] T021 Confirm the divergent pivots read the detail field (`$A/deep-review-auto.yaml`). Verify: `rg -c 'stop_decision\.reasonDetail' $A/deep-research-*.yaml $A/deep-review-*.yaml` prints a count of 1 or more for each of the four files. Evidence: `rg -c` prints 6 for each review file and 7 for each research file.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] The full runtime suite run in T018 reports 0 failed and every row in `acceptance-criteria.md` is `Met`.
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

- [x] CHK-001 [P0] `rg -c '^\| REQ-0' spec.md` in this folder prints 13. Evidence: Printed 13.
- [x] CHK-002 [P0] `rg -n '^## 4' plan.md` in this folder prints one line. Evidence: Printed `103:## 4. IMPLEMENTATION PHASES`.
- [x] CHK-003 [P1] The T001 baseline counts appear in the `goal.md` Progress table. Evidence: The T001 row holds 173 files, 2891 passed, 8 skipped, 0 failed.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `node --check .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` exits 0. Evidence: Exit 0.
- [x] CHK-011 [P0] `(cd $RT && npm run typecheck)` exits 0. Evidence: Exit 0.
- [x] CHK-012 [P1] A graph error under `--stop-decision` exits 0 with `graphDecision` `null`, shown by the T005 case. Evidence: Case `treats a graph failure as a missing graph decision` passes.
- [x] CHK-013 [P1] `rg -n 'specs/|REQ-0|F0[0-9]|F1[0-9]|F2[0-9]' $RT/scripts/convergence.cjs` prints no new line, so no comment carries an ephemeral label. Evidence: No added line in `git diff 4fa6dc4778 HEAD` matches.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] T017 reports 0 failed. Evidence: 170 passed, 0 failed in the eight-file run that holds the four files.
- [x] CHK-021 [P0] T018 reports 0 failed against the baseline. Evidence: Full runtime suite on the final tree: 175 test files, 2986 passed, 8 skipped, 0 failed (baseline 2891 passed, plus 95 new tests).
- [x] CHK-022 [P1] The unit test covers all four graph-decision values for research and review at and below the cap. Evidence: `-t graph` on `stop-decision.vitest.ts` reports 21 passed, and `-t cap` reports 6 passed.
- [x] CHK-023 [P1] The integration test runs `--stop-decision` twice and compares the two `stop_decision` strings byte for byte. Evidence: Case `is byte-identical across two runs` passes.
- [x] CHK-024 [P0] `(cd $RT && $VT tests/unit/lifecycle-taxonomy.vitest.ts tests/unit/lifecycle-taxonomy-yaml-parity.vitest.ts)` reports 0 failed with `maxDurationReached` in the enum. Evidence: Both files pass inside the eight-file run.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Classes: F01 `algorithmic`, F02 `instance-only`, F05 `class-of-bug`, F08 `cross-consumer`, F11 `cross-consumer`, F22 `instance-only`. Evidence: Classes as listed.
- [x] CHK-FIX-002 [P0] `rg -n '0\.08|0\.05\b|Skip hard stops' $A/deep-review-*.yaml` and `rg -n 'checkQualityGuards|graph_decision is absent' $A/deep-research-*.yaml` both print nothing. Evidence: Both commands print nothing (rg exit 1).
- [x] CHK-FIX-003 [P0] `rg -n 'composite_converged|all_questions_answered|all_dimensions_clean|minIterationsNotReached' $A/deep-research-*.yaml $A/deep-review-*.yaml` prints only lines that read or compare `reasonDetail`. Evidence: Every match is a `reasonDetail` comparison, a pivot `eligible_reasons` or `excluded_reasons` list, or the step's own description of the script's `reasonDetail` values. No line computes one.
- [x] CHK-FIX-004 [P0] N/A. The change touches no security, path, parser or redaction code. `--stop-decision` paths go through the existing `validateNamespaceValue` checks. Evidence: N/A as stated.
- [x] CHK-FIX-005 [P1] The matrix axes in `plan.md` Affected Surfaces are covered by named unit cases. Evidence: The unit file's `graph`, `cap`, `order`, `thresholds`, `quality guards` and `legal-stop gates` groups name the cases, 61 passed.
- [x] CHK-FIX-006 [P1] N/A. The new functions read no environment variable or process-wide state. Evidence: N/A as stated.
- [x] CHK-FIX-007 [P1] The `implementation-summary.md` evidence names the fix commit SHA. Evidence: `implementation-summary.md` names `d71b104883`, `d9a4cec88a`, `66a0247df0` and `95c295ac77`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] `rg -n -i 'token|secret|password' $RT/scripts/convergence.cjs` prints no new line. Evidence: No added line in `git diff 4fa6dc4778 HEAD` matches.
- [x] CHK-031 [P0] A missing config or state path exits 3 with `{"status":"error"}`, shown by a T005 case. Evidence: Case `exits 3 when the config file or the state log is missing` passes.
- [x] CHK-032 [P1] N/A. The script has no authentication surface. Evidence: N/A as stated.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `rg -c 'REQ-0' spec.md acceptance-criteria.md` in this folder prints 13 or more for each file. Evidence: Printed 16 for `spec.md` and 13 for `acceptance-criteria.md`.
- [x] CHK-041 [P1] The `convergence.cjs` header comment names the `stop_decision` fields and the `reasonDetail` values. Evidence: Header lines 9 to 11 name the nine fields and the `reasonDetail` values.
- [x] CHK-042 [P2] T016 shows `deep-research/SKILL.md` line 271 names the frozen enum. Evidence: Line 271 names the eight frozen values.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Test fixtures live under `$RT/tests/fixtures/` and temporary files under this folder's `scratch/`. Evidence: The new tests write to a temporary directory they remove, and add no fixture file.
- [x] CHK-051 [P1] `ls scratch/` in this folder lists nothing created by this phase before close. Evidence: `ls scratch/` prints nothing. The dispatch briefs moved to the parent folder's `scratch/dispatch-briefs/`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 13/13 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-14
<!-- /ANCHOR:summary -->

---
