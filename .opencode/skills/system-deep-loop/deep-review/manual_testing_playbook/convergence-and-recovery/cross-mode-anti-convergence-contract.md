---
title: "DRV-068 -- Cross-mode anti-convergence contract"
description: "Verify that deep-review participates in the cross-mode antiConvergence contract with a minimum iteration floor, fail-closed runtime stop policy, and optimizer invariant locks."
version: 1.11.0.1
---

# DRV-068 -- Cross-mode anti-convergence contract

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DRV-068`.

---

## 1. OVERVIEW

This scenario validates the `deep-review` slice of the cross-mode anti-convergence contract. The objective is to confirm that review mode declares a minimum iteration floor, exposes a fail-closed runtime stop policy, resolves capabilities through the shared runtime helper, and protects the contract from optimizer drift.

### WHY THIS MATTERS

Review loops can produce convincing but incomplete early STOP decisions when only one pass has run. The anti-convergence floor makes that early stop illegal unless the configured minimum has been satisfied, while the runtime and optimizer guards keep capability loading and tuning from weakening the stop policy.

---

## 2. SCENARIO CONTRACT

Operators should run this as a deterministic documentation-and-config check against the shipped files.

- Objective: Verify `deep-review` has `antiConvergence.minIterations: 2`, `convergenceMode: "default"`, `stopPolicy: "fail-closed"`, a runtime capability matrix with fail-closed stop policy, and optimizer invariant locks for convergence mode plus `minIterations <= maxIterations`.
- Real user request: Check whether deep-review can stop after one iteration or tune around its anti-convergence floor.
- Prompt: `Validate the deep-review anti-convergence floor, fail-closed stop policy, runtime capability resolver, and optimizer invariant guard.`
- Expected execution process: Inspect the review config and runtime capability matrix, then inspect the shared runtime resolver and optimizer manifest.
- Desired user-facing outcome: The user understands that review mode declares a 2-iteration floor, fails closed when runtime stop policy is missing or wrong, and rejects optimizer candidates where the floor exceeds `maxIterations`.
- Expected signals: `antiConvergence.minIterations` equals `2`; `stopPolicy` equals `fail-closed`; `runtime-capabilities.cjs` rejects missing or non-fail-closed stop policy; optimizer manifest locks convergence mode and carries `minIterations<=maxIterations`.
- Pass/fail posture: PASS if all four anchors agree. FAIL if any anchor is missing, permissive, or contradictory.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language.
2. Follow the command sequence in order.
3. Capture grep outputs for every expected signal.
4. Return a concise verdict with any drift called out explicitly.

### Prompt

Validate the deep-review anti-convergence floor, fail-closed stop policy, runtime capability resolver, and optimizer invariant guard.

### Commands

1. `bash: rg -n '"antiConvergence"|"minIterations": 2|"convergenceMode": "default"|"stopPolicy": "fail-closed"' .opencode/skills/system-deep-loop/deep-review/assets/deep_review_config.json`
2. `bash: rg -n '"stopPolicy": "fail-closed"' .opencode/skills/system-deep-loop/deep-review/assets/runtime_capabilities.json`
3. `bash: rg -n 'missing stopPolicy|stopPolicy must be "fail-closed"|validateStopPolicy' .opencode/skills/system-deep-loop/runtime/lib/deep-loop/runtime-capabilities.cjs`
4. `bash: rg -n 'antiConvergence.convergenceMode|convergenceMode|minIterations<=maxIterations|minIterations|maxIterations' .opencode/skills/system-spec-kit/scripts/optimizer/optimizer-manifest.json`

### Expected

The config declares the review floor and fail-closed policy, the runtime matrix repeats fail-closed policy, the shared resolver rejects missing or invalid stop policy, and the optimizer manifest locks convergence mode while requiring `minIterations <= maxIterations`.

### Evidence

Capture the matching lines from the four command outputs.

### Pass/Fail

PASS if all commands return the expected anchors with no contradictory values. FAIL if `minIterations`, `stopPolicy`, resolver validation, or optimizer invariant metadata is absent or permissive.

### Failure Triage

Privilege the live config and runtime helper over older references. If the optimizer manifest path changes, use `rg --files .opencode/skills | rg 'optimizer-manifest\.json$'` and rerun the invariant check against the discovered path.

---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page, integrated review protocol, and scenario summary |
| `../../feature_catalog/severity-system/cross-mode-anti-convergence-contract.md` | Feature-catalog source describing the shipped contract |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/skills/system-deep-loop/deep-review/assets/deep_review_config.json` | Review anti-convergence config and optimizer-managed locked fields |
| `.opencode/skills/system-deep-loop/deep-review/assets/runtime_capabilities.json` | Review runtime capability matrix with fail-closed stop policy |
| `.opencode/skills/system-deep-loop/deep-review/scripts/runtime-capabilities.cjs` | Review shim around the shared runtime capability resolver |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/runtime-capabilities.cjs` | Shared fail-closed stop-policy validation |
| `.opencode/skills/system-spec-kit/scripts/optimizer/optimizer-manifest.json` | Optimizer invariant group and locked convergence-mode fields |

---

## 5. SOURCE METADATA

- Group: CONVERGENCE AND RECOVERY
- Playbook ID: DRV-068
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `convergence-and-recovery/cross-mode-anti-convergence-contract.md`
- Feature catalog: `../../feature_catalog/severity-system/cross-mode-anti-convergence-contract.md`
