---
title: "DRV-020 -- Dimension coverage convergence signal"
description: "Verify the dimension coverage signal (weight 0.45) requires all 4 dimensions plus minStabilizationPasses >= 1 before contributing to convergence."
version: 1.11.0.14
---

# DRV-020 -- Dimension coverage convergence signal

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DRV-020`.

---

## 1. OVERVIEW

This scenario validates the dimension coverage convergence signal for `DRV-020`. The objective is to verify that the dimension coverage signal (weight 0.45, the highest-weighted signal) requires all 4 review dimensions to be covered and at least one stabilization pass before it contributes to the composite stop score.

### WHY THIS MATTERS

Dimension coverage is the heaviest-weighted convergence signal at 0.45. If it fires prematurely -- before all dimensions are examined or before findings have stabilized -- the review could stop with an incomplete picture. The `minStabilizationPasses` requirement ensures that coverage is not just claimed but verified through at least one follow-up iteration.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify dimension coverage signal (weight 0.45) requires all 4 dimensions + minStabilizationPasses >= 1.
- Real user request: How does the review know it has looked at everything? What prevents it from stopping after only checking correctness?
- Prompt: `Validate the deep-review dimension coverage convergence signal and its stabilization requirement.`
- Expected execution process: Inspect the convergence reference for the dimension coverage signal definition, then the review YAML for enforcement, then the quick reference and strategy template for user-facing documentation.
- Desired user-facing outcome: The user is told that the review must examine all four dimensions and verify stability before it can consider stopping, and that this check carries the most weight in the convergence decision.
- Expected signals: Weight 0.45, all 4 dimensions required, `minStabilizationPasses=1`, signal contributes 0 until conditions are met, strategy.md "Covered" list tracks dimension coverage.
- Pass/fail posture: PASS if the dimension coverage signal requires all 4 dimensions and stabilization before contributing. FAIL if the signal can fire with incomplete dimension coverage or without stabilization.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
Validate the deep-review dimension coverage convergence signal and its stabilization requirement.
### Commands
1. `bash: rg -n 'dimension.coverage|Dimension Coverage|0\.45|minStabilization|stabilization|all.*dimension|4.*dimension' .opencode/skills/deep-loop-workflows/deep-review/references/convergence/convergence.md`
2. `bash: rg -n 'dimension_coverage|0\.45|minStabilization|stabilization|all_dimensions|dimension.*covered' .opencode/commands/deep/assets/deep_review_auto.yaml .opencode/commands/deep/assets/deep_review_confirm.yaml`
3. `bash: rg -n 'Dimension Coverage|0\.45|minStabilization|stabilization|Covered|D1|D2|D3|D4|Correctness|Security|Traceability|Maintainability' .opencode/skills/deep-loop-workflows/deep-review/references/protocol/quick_reference.md .opencode/skills/deep-loop-workflows/deep-review/SKILL.md .opencode/skills/deep-loop-workflows/deep-review/assets/deep_review_strategy.md`
### Expected
Weight 0.45, all 4 dimensions required, `minStabilizationPasses=1`, signal contributes 0 until conditions are met, strategy.md "Covered" list tracks dimension coverage.
### Evidence
Capture the signal definition from convergence.md, the YAML enforcement, the 4-dimension list, and the strategy template tracking coverage.
### Pass/Fail
PASS if the dimension coverage signal requires all 4 dimensions and stabilization before contributing. FAIL if the signal can fire with incomplete dimension coverage or without stabilization.
### Failure Triage
Privilege the convergence reference for the signal formula and use the strategy template and YAML for enforcement confirmation.
---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page, integrated review protocol, and scenario summary |
| `feature_catalog/` | No dedicated feature catalog exists yet for `deep-review`, use the live docs below as the implementation contract |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/skills/deep-loop-workflows/deep-review/references/convergence/convergence.md` | Canonical convergence math, dimension coverage signal definition and minStabilizationPasses |
| `.opencode/commands/deep/assets/deep_review_auto.yaml` | Workflow algorithm, inspect dimension coverage check in `step_check_convergence` |
| `.opencode/commands/deep/assets/deep_review_confirm.yaml` | Workflow algorithm, inspect dimension coverage check in `step_check_convergence` |
| `.opencode/skills/deep-loop-workflows/deep-review/references/protocol/quick_reference.md` | Convergence signal table, use `ANCHOR:convergence` and `ANCHOR:review-dimensions` |
| `.opencode/skills/deep-loop-workflows/deep-review/SKILL.md` | Review dimensions and convergence rules, use `ANCHOR:how-it-works` and `ANCHOR:rules` |
| `.opencode/skills/deep-loop-workflows/deep-review/assets/deep_review_strategy.md` | Strategy template showing dimension tracking in "Covered" list |

---

## 5. SOURCE METADATA

- Group: CONVERGENCE AND RECOVERY
- Playbook ID: DRV-020
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--convergence-and-recovery/dimension-coverage-convergence-signal.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skills/deep-loop-workflows/deep-review/` as of 2026-03-28.
