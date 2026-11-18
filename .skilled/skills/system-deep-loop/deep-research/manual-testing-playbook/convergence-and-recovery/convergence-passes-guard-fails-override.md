---
title: "DR-023 -- Composite Convergence Passes but Guard Fails → CONTINUE"
description: "Verify the full override path: composite score >0.60 → STOP → guards check → guard fails → override to CONTINUE."
version: 1.14.2.0
---

# DR-023 -- Composite Convergence Passes but Guard Fails → CONTINUE

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-023`.

---

## 1. OVERVIEW

This scenario validates the full convergence-to-guard override path for `DR-023`. The objective is to verify that when composite convergence scores above 0.60 and votes STOP, the quality guards are still evaluated, and if any guard fails, the STOP is overridden to CONTINUE.

### WHY THIS MATTERS

This is the integration test for the entire quality guard system. Composite convergence and quality guards are separate subsystems that interact at a critical decision point. If the override path is broken, the loop will stop prematurely on mathematically converged but qualitatively deficient research. This scenario validates that the safety net works end-to-end.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify the full override path: composite score >0.60 triggers STOP, quality guards check fires, guard fails, decision overridden to CONTINUE.
- Real user request: Can the loop stop even though the math says it should, if the quality checks fail?
- Prompt: `Validate convergence STOP is overridden when quality guards fail, then the loop resumes.`
- Expected execution process: Inspect the Decision Priority list in convergence.md first, then the convergence.cjs guard evaluation and the step_check_convergence binding of its stop decision (step 6 of the script order), then loop-protocol.md Step 2c for the orchestrator-level flow, then the deep-research.yaml line that logs the failed guard, which proves the override happened.
- Desired user-visible outcome: The user gets a clear explanation that convergence math alone does not stop the loop — quality guards have veto power.
- Expected signals: a weighted stop score above 0.60 nominates STOP, the failed guard turns it into `CONTINUE` with reasonDetail `qualityGuardFailed` and the failed guards in blockedBy, the workflow logs `Quality guard failed: <guards>. Continuing.` and writes no event, and the loop resumes.
- Pass/fail posture: PASS if the full override path (composite STOP → guard check → guard fail → override to CONTINUE) is documented consistently across convergence.md Decision Priority step 8, convergence.cjs evaluateResearchQualityGuards and loop-protocol.md Step 2c; FAIL if any part of the chain is missing or contradicts the others.

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

1. `bash: sed -n '165,175p' .skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md`
2. `bash: sed -n '104,139p' .skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md`
3. `bash: sed -n '218,247p' .skilled/commands/deep/assets/deep-research.yaml`
4. `bash: sed -n '97,107p' .skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md`
5. `bash: rg -n 'qualityGuardFailed' .skilled/commands/deep/assets/deep-research.yaml`

### Expected

a weighted stop score above 0.60 nominates STOP, the failed guard turns it into `CONTINUE` with reasonDetail `qualityGuardFailed` and the failed guards in blockedBy, the workflow logs `Quality guard failed: <guards>. Continuing.` and writes no event, and the loop resumes.

### Evidence

Capture the Decision Priority list showing step 8, the evaluateResearchQualityGuards guard evaluation, the deep-research.yaml step 6 rule text and its stop_decision binding, the loop_protocol Step 2c flow, and the qualityGuardFailed log line.

### Pass/Fail

PASS if the full override path (composite STOP → guard check → guard fail → override to CONTINUE) is documented consistently across convergence.md Decision Priority step 8, convergence.cjs evaluateResearchQualityGuards and loop-protocol.md Step 2c; FAIL if any part of the chain is missing or contradicts the others.

### Failure Triage

Trace the path from convergence.md Decision Priority (canonical order) through convergence.cjs evaluateResearchQualityGuards and the deep-research.yaml stop_decision binding to loop-protocol.md (orchestrator instructions). Discrepancies in the override direction or guard evaluation order are critical failures.

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
| `.skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md` | Canonical convergence math and quality guard definitions; use Decision Priority (step 8) and §2.4 Quality Guard Protocol |
| `.skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md` | Loop orchestration; use Step 2c: Quality Guard Check for the override flow |
| `.skilled/skills/system-deep-loop/deep-research/references/state/state-format.md` | JSONL record schema; a failed guard writes no event, so the override shows in the stop decision |
| `.skilled/commands/deep/assets/deep-research.yaml` | Workflow algorithm; inspect `step_check_convergence` step 6 for the quality-guard rule and its `stop_decision` binding |

---

## 5. SOURCE METADATA

- Group: CONVERGENCE AND RECOVERY
- Playbook ID: DR-023
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `convergence-and-recovery/convergence-passes-guard-fails-override.md`
- Feature catalog status: `feature-catalog/` exists under `.skilled/skills/system-deep-loop/deep-research/`; this scenario does not currently cite a specific catalog entry.
