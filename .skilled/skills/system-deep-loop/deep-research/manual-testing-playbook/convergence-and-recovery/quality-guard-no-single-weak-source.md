---
title: "DR-022 -- Quality Guard — No Single-Weak-Source"
description: "Verify that a question backed by a single source cannot close the loop and that the reserved singleWeakSource guard reports notEvaluated."
version: 1.14.4.0
---

# DR-022 -- Quality Guard — No Single-Weak-Source

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-022`.

---

## 1. OVERVIEW

This scenario validates the no-single-weak-source quality guard entry for `DR-022`. The objective is to verify that an answered question backed by one source fails the source diversity guard, so the loop continues, and that the guard bundle reports the reserved `singleWeakSource` entry as `notEvaluated` rather than reading a per-source strength label.

### WHY THIS MATTERS

A tentative source is unverified and low-confidence by definition. Allowing the loop to stop when a question's only evidence is tentative means the final synthesis could contain unreliable claims presented as established findings. A single tentative source is the single-source case, which the source diversity count refuses; the bundle keeps a reserved `singleWeakSource` entry for a strength-based rule that the code does not evaluate.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify that an answer backed by one source fails source diversity and cannot close the loop, and that singleWeakSource reports notEvaluated.
- Real user request: What happens if the loop marks a question answered with only one source?
- Prompt: `Validate that a single-source answer fails the source diversity guard and keeps the loop running.`
- Expected execution process: Inspect the Quality Gate row and Decision Order step 8 in the convergence reference first, then evaluateResearchQualityGuards and the test that pins its singleWeakSource status, then the loop protocol Step 2c, then the deep-research.yaml line that logs a failed guard.
- Desired user-visible outcome: The user gets an accurate explanation of how single-source answers are caught and why the loop continues to seek stronger evidence.
- Expected signals: the STOP candidate becomes a blocked decision with reasonDetail `qualityGuardFailed` and `sourceDiversity` in blockedBy, the `blocked_stop` row is written, the single-source question is targeted for stronger sourcing in the next iteration, and `singleWeakSource` reports `notEvaluated`.
- Pass/fail posture: PASS if a one-source answer fails sourceDiversity in convergence.cjs, singleWeakSource reports notEvaluated in the guard bundle and in its pinned test, and loop-protocol.md Step 2c plus deep-research.yaml turn a failed guard into a blocked decision with its `blocked_stop` row; FAIL if any source claims a per-source strength evaluation the code does not perform.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
Validate that a single-source answer fails the source diversity guard and keeps the loop running.
### Commands
1. `bash: rg -n -A 8 '^## 4\. LEGAL STOP GATES' .skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md`
2. `bash: rg -n -A 50 '^function evaluateResearchQualityGuards' .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs`
3. `bash: rg -n -A 8 'always leaves single weak source not evaluated' .skilled/skills/system-deep-loop/runtime/tests/unit/stop-decision.vitest.ts`
4. `bash: rg -n -A 10 '^#### Step 2c: Quality Guard Check' .skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md`
5. `bash: rg -n 'qualityGuardFailed|Quality guard failed' .skilled/commands/deep/assets/deep-research.yaml`
### Expected
the STOP candidate becomes a blocked decision with reasonDetail `qualityGuardFailed` and `sourceDiversity` in blockedBy, the `blocked_stop` row is written, the single-source question is targeted for stronger sourcing in the next iteration, and singleWeakSource reports notEvaluated.
### Evidence
Capture the Quality Gate row, the sourceDiversity count filter, the singleWeakSource notEvaluated assignment, the test that pins that status, the Step 2c rule, and the workflow log line. A failed guard writes the same `blocked_stop` row a graph block writes.
### Pass/Fail
PASS if a one-source answer fails sourceDiversity in convergence.cjs, singleWeakSource reports notEvaluated in the guard bundle and in its pinned test, and loop-protocol.md Step 2c plus deep-research.yaml turn a failed guard into a blocked decision with its `blocked_stop` row; FAIL if any source claims a per-source strength evaluation the code does not perform.
### Failure Triage
Privilege convergence.md §4 LEGAL STOP GATES for the gate row and convergence.cjs evaluateResearchQualityGuards for the guard verdict; use the pinned test, loop-protocol.md Step 2c and deep-research.yaml step_check_convergence as secondary confirmation.
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
| `.skilled/skills/system-deep-loop/runtime/tests/unit/stop-decision.vitest.ts` | Regression anchor; pins singleWeakSource as notEvaluated |
| `.skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md` | Loop orchestration; use Step 2c: Quality Guard Check |
| `.skilled/commands/deep/assets/deep-research.yaml` | Workflow algorithm; inspect `step_check_convergence` guard rule and `stop_decision` binding |

---

## 5. SOURCE METADATA

- Group: CONVERGENCE AND RECOVERY
- Playbook ID: DR-022
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `convergence-and-recovery/quality-guard-no-single-weak-source.md`
- Feature catalog status: `feature-catalog/` exists under `.skilled/skills/system-deep-loop/deep-research/`; this scenario does not currently cite a specific catalog entry.
