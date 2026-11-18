---
title: "DR-020 -- Quality Guard — Source Diversity"
description: "Verify that convergence STOP is blocked when an answered question cites <2 independent sources."
version: 1.14.4.0
---

# DR-020 -- Quality Guard — Source Diversity

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-020`.

---

## 1. OVERVIEW

This scenario validates the source diversity quality guard for `DR-020`. The objective is to verify that convergence STOP is blocked when an answered question cites fewer than two independent sources.

### WHY THIS MATTERS

A convergence decision based on thinly sourced answers creates a false sense of completeness. The source diversity guard ensures that no question is considered answered unless at least two independent sources support it, preventing shallow research from being accepted as done.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify that convergence STOP is blocked when an answered question cites <2 independent sources.
- Real user request: How does the loop prevent shallow answers that rely on a single source?
- Prompt: `Validate source-diversity guards override STOP when answered questions lack independent sources.`
- Expected execution process: Inspect the Quality Gate row in §4 LEGAL STOP GATES of the convergence reference first, then the convergence.cjs guard evaluation, then the loop protocol Step 2c, then the deep-research.yaml line that logs a failed guard.
- Desired user-visible outcome: The user gets an accurate explanation of how single-source answers are caught and why the loop continues past them.
- Expected signals: the STOP candidate becomes `CONTINUE` with reasonDetail `qualityGuardFailed` and `sourceDiversity` in blockedBy, and no event is written, violated question targeted in next iteration focus.
- Pass/fail posture: PASS if the source_diversity guard rule (>= 2 independent sources), its STOP override and its workflow log line are consistent across convergence.md, loop-protocol.md and deep-research.yaml; FAIL if any of those elements drift or contradict.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
Validate source-diversity guards override STOP when answered questions lack independent sources.
### Commands
1. `bash: rg -n -A 8 '^## 4\. LEGAL STOP GATES' .skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md`
2. `bash: rg -n -A 20 '^function evaluateResearchQualityGuards' .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs`
3. `bash: rg -n -A 10 '^#### Step 2c: Quality Guard Check' .skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md`
4. `bash: rg -n 'qualityGuardFailed|Quality guard failed' .skilled/commands/deep/assets/deep-research.yaml`
5. `bash: rg -n '6\. a failed quality guard turns the candidate into CONTINUE' .skilled/commands/deep/assets/deep-research.yaml`
### Expected
the STOP candidate becomes `CONTINUE` with reasonDetail `qualityGuardFailed` and `sourceDiversity` in blockedBy, and no event is written, violated question targeted in next iteration focus.
### Evidence
Capture the Quality Gate row, the sourceDiversity count filter (a question with fewer than two sources is a violation), the Step 2c rule, and the workflow log line. The graph `sourceDiversity` signal counts distinct source kinds and skips `unclassified`, so two sources of one kind still block a STOP. A failed guard writes no event.
### Pass/Fail
PASS if the source_diversity guard rule (>= 2 independent sources), its STOP override and its workflow log line are consistent across convergence.md, loop-protocol.md and deep-research.yaml; FAIL if any of those elements drift or contradict.
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
- Playbook ID: DR-020
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `convergence-and-recovery/quality-guard-source-diversity.md`
- Feature catalog status: `feature-catalog/` exists under `.skilled/skills/system-deep-loop/deep-research/`; this scenario does not currently cite a specific catalog entry.
