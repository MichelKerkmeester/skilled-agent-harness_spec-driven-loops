---
title: "DR-021 -- Quality Guard — Focus Alignment"
description: "Verify that convergence STOP is blocked when an iteration answers a question its key question list does not hold."
version: 1.14.4.0
---

# DR-021 -- Quality Guard — Focus Alignment

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-021`.

---

## 1. OVERVIEW

This scenario validates the focus alignment quality guard for `DR-021`. The objective is to verify that convergence STOP is blocked when an iteration answers a question that its key question list does not hold. The guard reads the latest iteration record that names both lists, so one off-focus iteration cannot hold the run at CONTINUE once a later record is back on focus.

### WHY THIS MATTERS

A research loop can drift from its original purpose by answering tangential questions that were never part of the brief. The focus alignment guard ensures that marking questions as answered only counts when they correspond to the key questions the same iteration record names, preventing the loop from declaring success on work that was never requested.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify that convergence STOP is blocked when an iteration answers a question its key question list does not hold.
- Real user request: What stops the loop from answering the wrong questions and calling it done?
- Prompt: `Validate focus-alignment guards override STOP when answered questions drift from the iteration's key question list.`
- Expected execution process: Inspect the Quality Gate row in §4 LEGAL STOP GATES of the convergence reference first, then the convergence.cjs focus alignment evaluation, then the loop protocol Step 2c, then the deep-research.yaml line that logs a failed guard.
- Desired user-visible outcome: The user gets an accurate explanation of how the loop detects and blocks convergence on answers outside the iteration's key question list.
- Expected signals: the STOP candidate becomes a blocked decision with reasonDetail `qualityGuardFailed` and `focusAlignment` in blockedBy, the `blocked_stop` row is written and the loop continues, misaligned question flagged in violation detail.
- Pass/fail posture: PASS if the focus_alignment guard rule (every answered question matches an entry in the same record's key question list, with a leading question-id prefix ignored), its STOP override and its workflow log line are consistent across convergence.md, loop-protocol.md and deep-research.yaml; FAIL if any of those elements drift or contradict.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
Validate focus-alignment guards override STOP when answered questions drift from the iteration's key question list.
### Commands
1. `bash: rg -n -A 8 '^## 4\. LEGAL STOP GATES' .skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md`
2. `bash: rg -n -A 12 '^### Decision Order' .skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md`
3. `bash: rg -n -B 21 -A 4 'const focusAlignment' .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs`
4. `bash: rg -n -A 10 '^#### Step 2c: Quality Guard Check' .skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md`
5. `bash: rg -n 'qualityGuardFailed|Quality guard failed' .skilled/commands/deep/assets/deep-research.yaml`
### Expected
the STOP candidate becomes a blocked decision with reasonDetail `qualityGuardFailed` and `focusAlignment` in blockedBy, the `blocked_stop` row is written and the loop continues, misaligned question flagged in violation detail.
### Evidence
Capture the Quality Gate row, the latest-record comparison and question-id normalization in convergence.cjs evaluateResearchQualityGuards, the Step 2c rule, and the workflow log line. A failed guard writes the same `blocked_stop` row a graph block writes.
### Pass/Fail
PASS if the focus_alignment guard rule (every answered question matches an entry in the same record's key question list, with a leading question-id prefix ignored), its STOP override and its workflow log line are consistent across convergence.md, loop-protocol.md and deep-research.yaml; FAIL if any of those elements drift or contradict.
### Failure Triage
Privilege convergence.md §4 LEGAL STOP GATES for the canonical gate row; use convergence.cjs evaluateResearchQualityGuards for the guard verdict and loop-protocol.md Step 2c plus deep-research.yaml step_check_convergence as secondary confirmation of the override flow.
---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page, integrated review protocol, and scenario summary |
| `feature-catalog/` | No dedicated feature catalog exists yet for `deep-research`; use the live docs below as the implementation contract |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md` | Canonical quality gate definitions; use §4 LEGAL STOP GATES (Quality Gate row) and Decision Order step 8 |
| `.skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md` | Loop orchestration; use Step 2c: Quality Guard Check |
| `.skilled/commands/deep/assets/deep-research.yaml` | Workflow algorithm; inspect `step_check_convergence` guard rule and `stop_decision` binding |

---

## 5. SOURCE METADATA

- Group: CONVERGENCE AND RECOVERY
- Playbook ID: DR-021
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `convergence-and-recovery/quality-guard-focus-alignment.md`
- Feature catalog status: `feature-catalog/` exists under `.skilled/skills/system-deep-loop/deep-research/`; this scenario does not currently cite a specific catalog entry.
