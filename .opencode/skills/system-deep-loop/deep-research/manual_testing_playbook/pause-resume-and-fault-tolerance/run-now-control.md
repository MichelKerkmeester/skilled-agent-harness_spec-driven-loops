---
title: "DR-061 -- Run-now control"
description: "Verify that the `.deep-research-run-now` sentinel triggers one immediate iteration with pause precedence and audit events."
version: 1.14.0.21
---

# DR-061 -- Run-now control

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-061`.

---

## 1. OVERVIEW

This scenario validates run-now control for `DR-061`. The objective is to verify that the forced-run sentinel triggers one immediate iteration, is consumed safely, and respects pause precedence.

### WHY THIS MATTERS

Operators need a low-friction way to request one out-of-cadence iteration without restarting the loop or corrupting cadence state.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify that the `.deep-research-run-now` sentinel triggers one immediate iteration with pause precedence and audit events.
- Real user request: I want to force one deep-research iteration now without restarting the loop.
- Prompt: `Validate the run-now sentinel lifecycle against auto YAML and its unit tests.`
- Expected execution process: Inspect sentinel path declaration, run-now check, pause rejection path, restore detection, and YAML-control tests.
- Desired user-visible outcome: The user learns when to create the sentinel, what events appear, and why pause wins.
- Expected signals: `run_now_requested`, `run_now_accepted`, `run_now_rejected`, and `run_now_restored` events are documented or tested; accepted runs consume the sentinel before dispatch.
- Pass/fail posture: PASS if the sentinel is consume-once and pause precedence leaves it in place; FAIL if forced-run intent is modeled as cadence state or consumed while paused.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
Validate the run-now sentinel lifecycle against auto YAML and its unit tests.
### Commands
1. `bash: rg -n 'run_now_sentinel|step_run_now_check|run_now_requested|run_now_accepted|run_now_rejected|run_now_restored' .opencode/commands/deep/assets/deep_research_auto.yaml`
2. `bash: sed -n '90,185p' .opencode/skills/system-deep-loop/runtime/tests/unit/run-now-yaml-control.vitest.ts`
### Expected
The sentinel is detected at the loop boundary, accepted runs consume it before dispatch, pause emits `run_now_rejected` while preserving the file, and recreated sentinels are restored for the next boundary.
### Evidence
Capture the sentinel path, event names, pause branch, consume branch, restore branch, and unit-test assertions.
### Pass/Fail
PASS if run-now events and sentinel lifecycle are consistent across YAML and tests; FAIL if the sentinel can be consumed while paused or reused accidentally.
### Failure Triage
Privilege `deep_research_auto.yaml` for live workflow behavior and `run-now-yaml-control.vitest.ts` for executable expectations.

---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page, integrated review protocol, and scenario summary |
| `../../feature_catalog/loop-lifecycle/run-now-control.md` | Matching feature catalog entry |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/commands/deep/assets/deep_research_auto.yaml` | Run-now sentinel path, consume-once branch, pause rejection, and restore detection |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/run-now-yaml-control.vitest.ts` | Unit coverage for accepted, rejected, and restored sentinel behavior |

---

## 5. SOURCE METADATA

- Group: PAUSE, RESUME, AND FAULT TOLERANCE
- Playbook ID: DR-061
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `pause-resume-and-fault-tolerance/run-now-control.md`
- Feature catalog: `feature_catalog/loop-lifecycle/run-now-control.md`
