---
title: "DRV-011 -- Cross-reference verification detects misalignment"
description: "Verify that cross-reference checks (spec_code, checklist_evidence, skill_agent protocols) detect misalignment between documentation and implementation."
version: 1.11.0.14
---

# DRV-011 -- Cross-reference verification detects misalignment

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DRV-011`.

---

## 1. OVERVIEW

This scenario validates cross-reference verification detects misalignment for `DRV-011`. The objective is to verify that cross-reference checks (spec_code, checklist_evidence, skill_agent protocols) detect misalignment between documentation and implementation.

### WHY THIS MATTERS

Cross-reference integrity is the core differentiator between a deep review and a simple code review. If the traceability protocols do not detect misalignment, the review misses the most valuable class of findings: drift between what the spec says and what the code does.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify that cross-reference checks (spec_code, checklist_evidence, skill_agent protocols) detect misalignment between documentation and implementation.
- Real user request: Does the deep review actually check whether the spec matches the code, or does it just review code quality?
- Prompt: `Validate deep-review traceability cross-reference checks and confirm the configured protocols dispatch correctly.`
- Expected execution process: Inspect the YAML config creation step for crossReference protocols, then the dispatch prompt for traceability constraints, then the strategy template for cross-reference tracking, then the quick reference for quality guards.
- Desired user-facing outcome: The user is told that the review checks spec-vs-code alignment, checklist evidence completeness, and skill-agent protocol consistency as part of the traceability dimension.
- Expected signals: The config includes crossReference with core and overlay protocols. The dispatch prompt includes traceability constraints. The strategy template tracks cross-reference results. The quality guards require cross-reference checks before convergence.
- Pass/fail posture: PASS if core and overlay cross-reference protocols are configured and the traceability dimension dispatches them. FAIL if cross-reference checks are undocumented or not enforced.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
Validate deep-review traceability cross-reference checks and confirm the configured protocols dispatch correctly.
### Commands
1. `bash: rg -n 'crossReference|cross_reference|spec_code|checklist_evidence|skill_agent|agent_cross_runtime|feature_catalog_code|playbook_capability' .opencode/commands/deep/assets/deep_review_auto.yaml`
2. `bash: rg -n 'traceability|cross.reference|TRACEABILITY PROTOCOLS' .opencode/commands/deep/assets/deep_review_auto.yaml`
3. `bash: rg -n 'cross.reference|traceability|spec_code|checklist_evidence' .opencode/skills/deep-loop-workflows/deep-review/references/protocol/quick_reference.md .opencode/skills/deep-loop-workflows/deep-review/assets/review_mode_contract.yaml`
### Expected
The config includes crossReference with core and overlay protocols. The dispatch prompt includes traceability constraints. The quality guards require cross-reference checks before convergence.
### Evidence
Capture the crossReference config block, the traceability protocol list from the dispatch prompt, and the quality guard requirements.
### Pass/Fail
PASS if core and overlay cross-reference protocols are configured and the traceability dimension dispatches them. FAIL if cross-reference checks are undocumented or not enforced.
### Failure Triage
Check the review_mode_contract.yaml for the full cross-reference protocol definitions and verify the YAML step_order_dimensions derives the traceability protocol plan.
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
| `.opencode/commands/deep/assets/deep_review_auto.yaml` | Config creation and dispatch, inspect `step_create_config` crossReference block and dispatch traceability constraints |
| `.opencode/skills/deep-loop-workflows/deep-review/assets/review_mode_contract.yaml` | Cross-reference protocol definitions, inspect `cross_reference_protocols` |
| `.opencode/skills/deep-loop-workflows/deep-review/references/protocol/quick_reference.md` | Quality guards, use `ANCHOR:quality-guards` and `ANCHOR:review-dimensions` |
| `.opencode/skills/deep-loop-workflows/deep-review/SKILL.md` | Traceability dimension documentation |

---

## 5. SOURCE METADATA

- Group: ITERATION EXECUTION AND STATE DISCIPLINE
- Playbook ID: DRV-011
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--iteration-execution-and-state-discipline/cross-reference-verification-detects-misalignment.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skills/deep-loop-workflows/deep-review/` as of 2026-03-28.
