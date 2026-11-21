---
title: "DR-023 -- Composite Convergence Passes but Guard Fails → Blocked Stop"
description: "Verify the full block path: composite score >0.60 → STOP → guards check → guard fails → blocked decision with its blocked_stop row → loop continues."
version: 1.14.4.0
---

# DR-023 -- Composite Convergence Passes but Guard Fails → Blocked Stop

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-023`.

---

## 1. OVERVIEW

This scenario validates the full convergence-to-guard override path for `DR-023`. The objective is to verify that when composite convergence scores above 0.60 and votes STOP, the quality guards are still evaluated, and if any guard fails, the STOP is blocked, the blocked_stop row is written and the loop continues.

### WHY THIS MATTERS

This is the integration test for the entire quality guard system. Composite convergence and quality guards are separate subsystems that interact at a critical decision point. If the override path is broken, the loop will stop prematurely on mathematically converged but qualitatively deficient research. This scenario validates that the safety net works end-to-end.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify the full block path: composite score >0.60 triggers STOP, quality guards check fires, guard fails, decision is blocked, the blocked_stop row is written and the loop continues.
- Real user request: Can the loop stop even though the math says it should, if the quality checks fail?
- Prompt: `Validate convergence STOP is overridden when quality guards fail, then the loop resumes.`
- Expected execution process: Inspect the Decision Order list in convergence.md first, then the convergence.cjs guard evaluation and the step_check_convergence binding of its stop decision (rule 6 of the script order), then loop-protocol.md Step 2c for the orchestrator-level flow, then the deep-research.yaml lines that block the candidate and log the failed guard.
- Desired user-visible outcome: The user gets a clear explanation that convergence math alone does not stop the loop — quality guards have veto power.
- Expected signals: a weighted stop score above 0.60 nominates STOP, the failed guard turns it into a blocked decision with stopReason `blockedStop`, reasonDetail `qualityGuardFailed` and the failed guards in blockedBy, the script records the `blocked_stop` row, the workflow logs `Quality guard failed: <guards>. Continuing.` and `step_emit_blocked_stop` continues the loop, and once the same blocker set has blocked `stuckThreshold` runs in a row the decision is STOP with reasonDetail `blockedStreakReached`.
- Pass/fail posture: PASS if the full block path (composite STOP → guard check → guard fail → blocked decision with its blocked_stop row → loop continues) is documented consistently across convergence.md Decision Order step 8, convergence.cjs evaluateResearchQualityGuards and loop-protocol.md Step 2c; FAIL if any part of the chain is missing or contradicts the others.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
Validate convergence STOP is overridden when quality guards fail, then the loop resumes.

### Commands

1. `bash: rg -n -A 12 '^### Decision Order' .skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md`
2. `bash: rg -n -A 8 '^## 4\. LEGAL STOP GATES' .skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md`
3. `bash: rg -n -A 50 '^function evaluateResearchQualityGuards' .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs`
4. `bash: rg -n -A 10 '^#### Step 2c: Quality Guard Check' .skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md`
5. `bash: rg -n 'qualityGuardFailed|Quality guard failed' .skilled/commands/deep/assets/deep-research.yaml`

### Expected

a weighted stop score above 0.60 nominates STOP, the failed guard turns it into a blocked decision with stopReason `blockedStop`, reasonDetail `qualityGuardFailed` and the failed guards in blockedBy, the script records the `blocked_stop` row, the workflow logs `Quality guard failed: <guards>. Continuing.` and `step_emit_blocked_stop` continues the loop, and once the same blocker set has blocked `stuckThreshold` runs in a row the decision is STOP with reasonDetail `blockedStreakReached`.

### Evidence

Capture the Decision Order list showing steps 8 and 10, the Quality Gate row, the evaluateResearchQualityGuards guard evaluation and its return, the loop_protocol Step 2c flow, and the qualityGuardFailed rule and log lines.

### Pass/Fail

PASS if the full block path (composite STOP → guard check → guard fail → blocked decision with its blocked_stop row → loop continues) is documented consistently across convergence.md Decision Order step 8, convergence.cjs evaluateResearchQualityGuards and loop-protocol.md Step 2c; FAIL if any part of the chain is missing or contradicts the others.

### Failure Triage

Trace the path from convergence.md Decision Order (canonical order) through convergence.cjs evaluateResearchQualityGuards and the deep-research.yaml stop_decision binding to loop-protocol.md (orchestrator instructions). A failed guard that still yields CONTINUE with no blocked_stop row, or a different guard evaluation order, is a critical failure.

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
| `.skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md` | Canonical convergence math and quality gate definitions; use Decision Order (step 8) and §4 LEGAL STOP GATES (Quality Gate row) |
| `.skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md` | Loop orchestration; use Step 2c: Quality Guard Check for the block flow |
| `.skilled/skills/system-deep-loop/deep-research/references/state/state-jsonl.md` | JSONL record schema; a failed guard writes the same `blocked_stop` row a graph block writes |
| `.skilled/commands/deep/assets/deep-research.yaml` | Workflow algorithm; inspect `step_check_convergence` step 6 for the quality-guard rule and its `stop_decision` binding |

---

## 5. SOURCE METADATA

- Group: CONVERGENCE AND RECOVERY
- Playbook ID: DR-023
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `convergence-and-recovery/convergence-passes-guard-fails-override.md`
- Feature catalog status: `feature-catalog/` exists under `.skilled/skills/system-deep-loop/deep-research/`; this scenario does not currently cite a specific catalog entry.
