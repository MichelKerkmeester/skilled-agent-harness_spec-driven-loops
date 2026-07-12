---
title: "DR-055 -- Anti-convergence floor"
description: "Verify that convergence STOP is blocked until the configured minimum iteration floor clears."
version: 1.14.0.21
---

# DR-055 -- Anti-convergence floor

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-055`.

---

## 1. OVERVIEW

This scenario validates the anti-convergence floor for `DR-055`. The objective is to verify that convergence STOP is blocked until the configured `minIterations` floor clears, while hard caps, pause, and explicit halts still work.

### WHY THIS MATTERS

Without a minimum iteration floor, a research loop can stop after one shallow convergence candidate and never explore enough angles to justify the answer.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify that convergence STOP is blocked until the configured minimum iteration floor clears.
- Real user request: Make sure deep-research cannot stop after one shallow pass just because convergence math says STOP.
- Prompt: `Validate the deep-research minIterations floor and convergenceMode behavior against config, YAML, and tests.`
- Expected execution process: Inspect the config defaults, the auto YAML read-state and convergence guard steps, then the convergence-floor unit test.
- Desired user-visible outcome: The user is told that early convergence is blocked until the floor clears, but max-iteration and pause controls still apply.
- Expected signals: `minIterations` defaults to 3, `convergenceMode` defaults to `default`, early STOP uses `minIterationsNotReached`, and `min_iterations_guard_pass` is emitted when the floor clears.
- Pass/fail posture: PASS if config, YAML, and tests agree on the floor and fail-open behavior for older configs; FAIL if convergence can stop before the floor without an explicit hard stop.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
Validate the deep-research minIterations floor and convergenceMode behavior against config, YAML, and tests.
### Commands
1. `bash: rg -n 'minIterations|convergenceMode|antiConvergence' .opencode/skills/system-deep-loop/deep-research/assets/deep_research_config.json`
2. `bash: rg -n 'min_iterations|minIterationsNotReached|min_iterations_guard_pass|convergenceMode' .opencode/commands/deep/assets/deep_research_auto.yaml`
3. `bash: sed -n '1,130p' .opencode/skills/system-deep-loop/runtime/tests/unit/deep-research-convergence-floor.vitest.ts`
### Expected
`minIterations` defaults to 3, early convergence STOP is overridden until the floor clears, `convergenceMode` is accepted, and older configs without the field keep prior behavior with a warning.
### Evidence
Capture the config default, YAML guard branch, emitted event name, and unit-test expectations.
### Pass/Fail
PASS if the source files agree on the minimum-iteration floor and event semantics; FAIL if any source allows a convergence STOP before the floor without a hard cap or explicit halt.
### Failure Triage
Privilege the auto YAML for live workflow behavior and the config asset for shipped defaults.

---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page, integrated review protocol, and scenario summary |
| `../../feature_catalog/convergence/anti_convergence_floor.md` | Matching feature catalog entry |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/skills/system-deep-loop/deep-research/assets/deep_research_config.json` | Anti-convergence defaults and locked config fields |
| `.opencode/commands/deep/assets/deep_research_auto.yaml` | Live convergence guard, warning, and event emission path |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/deep-research-convergence-floor.vitest.ts` | Unit coverage for config and YAML guard behavior |

---

## 5. SOURCE METADATA

- Group: CONVERGENCE AND RECOVERY
- Playbook ID: DR-055
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `convergence-and-recovery/anti-convergence-floor.md`
- Feature catalog: `feature_catalog/convergence/anti_convergence_floor.md`
