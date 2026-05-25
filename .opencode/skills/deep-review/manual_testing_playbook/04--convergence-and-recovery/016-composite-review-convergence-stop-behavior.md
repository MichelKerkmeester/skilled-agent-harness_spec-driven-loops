---
title: "DRV-031 -- Composite review convergence stop behavior"
description: "Verify the three-signal composite convergence model with severity-weighted newFindingsRatio, weights 0.30/0.25/0.45, and threshold 0.60."
---

# DRV-031 -- Composite review convergence stop behavior

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DRV-031`.

---

## 1. OVERVIEW

This scenario validates composite review convergence stop behavior for `DRV-031`. The objective is to verify the three-signal composite convergence model using rolling average (0.30), MAD noise floor (0.25), and dimension coverage (0.45) with a weighted stop-score threshold of 0.60.

### WHY THIS MATTERS

Composite convergence is the nuanced stop condition that decides whether diminishing returns in the review loop are genuine rather than just a transient pause between finding clusters. The severity-weighted newFindingsRatio is review-specific, ensuring that a single P0 finding prevents premature stop even when raw finding counts plateau.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify 3-signal composite convergence (rolling avg 0.30, MAD 0.25, dimension coverage 0.45) with threshold 0.60.
- Real user request: Explain how the review loop decides it has found enough issues and can stop before hitting the hard cap.
- Prompt: `Validate deep-review composite convergence scoring, including rolling average, MAD noise floor, dimension coverage, and stop threshold.`
- Expected execution process: Inspect the convergence reference first, then the review YAML algorithm, then the quick reference and SKILL.md for user-facing summaries.
- Desired user-facing outcome: The user gets an accurate explanation of the weighted convergence model, the severity weighting unique to review mode, and when convergence applies.
- Expected signals: Three named signals with weights 0.30/0.25/0.45, severity-weighted newFindingsRatio, rollingStopThreshold of 0.08, a composite stop threshold above 0.60, and dimension coverage requiring all 4 review dimensions.
- Pass/fail posture: PASS if the signals, weights, severity weighting, and threshold align across convergence reference, YAML, and user-facing docs. FAIL if any of those elements drift materially.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
Validate deep-review composite convergence scoring, including rolling average, MAD noise floor, dimension coverage, and stop threshold.
### Commands
1. `bash: rg -n 'COMPOSITE CONVERGENCE|rolling average|MAD noise|dimension coverage|0.60|severity.weighted|newFindingsRatio|0\.30|0\.25|0\.45' .opencode/skills/deep-review/references/convergence/convergence.md`
2. `bash: rg -n 'COMPOSITE|rolling_average|MAD|dimension_coverage|convergence|stop_score|severity.*weight|newFindingsRatio' .opencode/commands/deep/assets/deep_start-review-loop_auto.yaml .opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml`
3. `bash: rg -n 'Convergence|Rolling Average|MAD|Dimension Coverage|0\.30|0\.25|0\.45|severity.weighted|newFindingsRatio' .opencode/skills/deep-review/references/protocol/quick_reference.md .opencode/skills/deep-review/SKILL.md .opencode/skills/deep-review/README.md`
### Expected
Three named signals with weights 0.30/0.25/0.45, severity-weighted newFindingsRatio, rollingStopThreshold of 0.08, a composite stop threshold above 0.60, and dimension coverage requiring all 4 review dimensions.
### Evidence
Capture the full signal table, YAML algorithm excerpt, severity weighting formula, and the user-facing explanation.
### Pass/Fail
PASS if the signals, weights, severity weighting, and threshold align across convergence reference, YAML, and user-facing docs. FAIL if any of those elements drift materially.
### Failure Triage
Privilege the convergence reference for exact math and use quick reference and SKILL.md only as secondary confirmation.
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
| `.opencode/skills/deep-review/references/convergence/convergence.md` | Canonical convergence math, use `ANCHOR:shouldcontinue-algorithm` and `ANCHOR:signal-definitions` |
| `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml` | Workflow algorithm, inspect `step_check_convergence` |
| `.opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml` | Workflow algorithm, inspect `step_check_convergence` |
| `.opencode/skills/deep-review/references/protocol/quick_reference.md` | Convergence signal summary, use `ANCHOR:convergence` |
| `.opencode/skills/deep-review/SKILL.md` | Convergence and rules documentation, use `ANCHOR:rules` and `ANCHOR:how-it-works` |
| `.opencode/skills/deep-review/README.md` | Feature summary for review convergence |

---

## 5. SOURCE METADATA

- Group: CONVERGENCE AND RECOVERY
- Playbook ID: DRV-031
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--convergence-and-recovery/016-composite-review-convergence-stop-behavior.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skills/deep-review/` as of 2026-03-28.
