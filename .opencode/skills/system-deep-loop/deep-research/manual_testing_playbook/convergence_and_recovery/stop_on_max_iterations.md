---
title: "DR-011 -- Stop on max iterations"
description: "Verify that max iterations is a hard stop checked before softer convergence signals."
version: 1.14.0.15
---

# DR-011 -- Stop on max iterations

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-011`.

---

## 1. OVERVIEW

This scenario validates stop on max iterations for `DR-011`. The objective is to verify that max iterations is a hard stop checked before softer convergence signals.

### WHY THIS MATTERS

The hard cap is the deterministic backstop that prevents runaway sessions even when the other signals remain inconclusive.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify that max iterations is a hard stop checked before softer convergence signals.
- Real user request: If I set a maximum number of iterations, I want to know the loop will stop there no matter what.
- Prompt: `Validate the max-iterations cap stops deep research before softer convergence logic.`
- Expected execution process: Inspect convergence pseudocode first, then the YAML decision algorithm, then the README parameter table and examples.
- Desired user-visible outcome: The user is told that `--max-iterations` is a hard cap that overrides further looping.
- Expected signals: Max iterations is checked first, the stop reason is named explicitly, and the parameter is exposed consistently in the docs.
- Pass/fail posture: PASS if max iterations is consistently treated as a first-priority hard stop; FAIL if it is demoted below softer signals or described inconsistently.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
Validate the max-iterations cap stops deep research before softer convergence logic.
### Commands
1. `bash: rg -n 'max iterations|Hard stop|max_iterations_reached' .opencode/skills/system-deep-loop/deep-research/references/convergence/convergence.md .opencode/skills/system-deep-loop/deep-research/references/protocol/loop_protocol.md`
2. `bash: rg -n 'iteration_count >= max_iterations|max_iterations_reached' .opencode/commands/deep/assets/deep_research_auto.yaml .opencode/commands/deep/assets/deep_research_confirm.yaml`
3. `bash: rg -n -- '--max-iterations|Maximum loop iterations' .opencode/skills/system-deep-loop/deep-research/README.md .opencode/skills/system-deep-loop/deep-research/references/guides/quick_reference.md`
### Expected
Max iterations is checked first, the stop reason is named explicitly, and the parameter is exposed consistently in the docs.
### Evidence
Capture the convergence pseudocode, the YAML decision branch, and the user-facing parameter description.
### Pass/Fail
PASS if max iterations is consistently treated as a first-priority hard stop; FAIL if it is demoted below softer signals or described inconsistently.
### Failure Triage
Resolve any ambiguity by privileging the convergence pseudocode and YAML algorithm order.
---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page, integrated review protocol, and scenario summary |
| `feature_catalog/` | No dedicated feature catalog exists yet for `deep-research`; use the live docs below as the implementation contract |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/skills/system-deep-loop/deep-research/references/convergence/convergence.md` | Hard-stop ordering; use `ANCHOR:shouldcontinue-algorithm` |
| `.opencode/skills/system-deep-loop/deep-research/references/protocol/loop_protocol.md` | Loop decision order; use `ANCHOR:phase-iteration-loop` |
| `.opencode/commands/deep/assets/deep_research_auto.yaml` | Decision algorithm; inspect `step_check_convergence` |
| `.opencode/commands/deep/assets/deep_research_confirm.yaml` | Decision algorithm; inspect `step_check_convergence` |
| `.opencode/skills/system-deep-loop/deep-research/README.md` | Parameter table and examples; use `ANCHOR:configuration` and `ANCHOR:usage-examples` |
| `.opencode/skills/system-deep-loop/deep-research/references/guides/quick_reference.md` | Parameter defaults; use `ANCHOR:commands` |

---

## 5. SOURCE METADATA

- Group: CONVERGENCE AND RECOVERY
- Playbook ID: DR-011
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `convergence-and-recovery/stop-on-max-iterations.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skills/system-deep-loop/deep-research/` as of 2026-03-19.
