---
title: "DRV-030 -- Stop on max iterations"
description: "Verify review stops at maxIterations (default 7) even if dimensions remain uncovered."
---

# DRV-030 -- Stop on max iterations

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DRV-030`.

---

## 1. OVERVIEW

This scenario validates stop on max iterations for `DRV-030`. The objective is to verify that the review loop stops at `maxIterations` (default 7) even if review dimensions remain uncovered.

### WHY THIS MATTERS

The hard iteration cap is the ultimate safety net preventing runaway review loops. Without it, a review that keeps discovering new findings in a large codebase could run indefinitely, consuming context and operator time.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify review stops at maxIterations (default 7) even if dimensions remain uncovered.
- Real user request: If the review keeps finding new issues, does it ever stop on its own?
- Prompt: `Validate the deep-review hard iteration cap and report whether synthesis still runs after maxIterations stops the loop.`
- Expected execution process: Inspect the convergence reference for hard stop rules, then the YAML workflow step that enforces the cap, then the quick reference and SKILL.md for user-facing documentation.
- Desired user-facing outcome: The user is told that the review loop always terminates at maxIterations and still produces a review report even if not all dimensions were covered.
- Expected signals: `maxIterations=7` default, unconditional exit at that count, synthesis phase runs after hard stop, review-report.md is still produced.
- Pass/fail posture: PASS if the hard cap is enforced unconditionally and synthesis still runs. FAIL if the loop can exceed maxIterations or skips synthesis after a hard stop.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
Validate the deep-review hard iteration cap and report whether synthesis still runs after maxIterations stops the loop.
### Commands
1. `bash: rg -n 'maxIterations|hard.stop|HARD_STOP|max_iterations|iteration.*cap' .opencode/skills/deep-loop-workflows/deep-review/references/convergence/convergence.md`
2. `bash: rg -n 'maxIterations|max_iterations|hard.stop|step_check_convergence|iteration_count' .opencode/commands/deep/assets/deep_review_auto.yaml .opencode/commands/deep/assets/deep_review_confirm.yaml`
3. `bash: rg -n 'maxIterations|max-iterations|default.*7|hard stop' .opencode/skills/deep-loop-workflows/deep-review/references/protocol/quick_reference.md .opencode/skills/deep-loop-workflows/deep-review/SKILL.md .opencode/skills/deep-loop-workflows/deep-review/README.md`
### Expected
`maxIterations=7` default, unconditional exit at that count, synthesis phase runs after hard stop, review-report.md is still produced.
### Evidence
Capture the hard-stop condition from convergence.md, the YAML enforcement step, and the user-facing documentation of the default.
### Pass/Fail
PASS if the hard cap is enforced unconditionally and synthesis still runs. FAIL if the loop can exceed maxIterations or skips synthesis after a hard stop.
### Failure Triage
Privilege the convergence reference for exact algorithm and use YAML workflow steps as the enforcement authority.
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
| `.opencode/skills/deep-loop-workflows/deep-review/references/convergence/convergence.md` | Canonical convergence math including hard stop rules |
| `.opencode/commands/deep/assets/deep_review_auto.yaml` | Workflow algorithm, inspect `step_check_convergence` for hard stop enforcement |
| `.opencode/commands/deep/assets/deep_review_confirm.yaml` | Workflow algorithm, inspect `step_check_convergence` for hard stop enforcement |
| `.opencode/skills/deep-loop-workflows/deep-review/references/protocol/quick_reference.md` | User-facing parameter defaults, use `ANCHOR:commands` and `ANCHOR:convergence` |
| `.opencode/skills/deep-loop-workflows/deep-review/SKILL.md` | Skill rules and convergence documentation, use `ANCHOR:rules` |
| `.opencode/skills/deep-loop-workflows/deep-review/README.md` | Feature summary and configuration defaults |

---

## 5. SOURCE METADATA

- Group: CONVERGENCE AND RECOVERY
- Playbook ID: DRV-030
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--convergence-and-recovery/stop-on-max-iterations.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skills/deep-loop-workflows/deep-review/` as of 2026-03-28.
