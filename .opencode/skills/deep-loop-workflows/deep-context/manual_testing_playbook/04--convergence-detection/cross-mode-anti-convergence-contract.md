---
title: "CONV-005 -- Cross-Mode Anti-Convergence Contract"
description: "Verify that deep-context declares the shared antiConvergence floor and fail-closed stop policy, and that the shared runtime and optimizer anchors preserve that contract."
version: 1.2.0.1
---

# CONV-005 -- Cross-Mode Anti-Convergence Contract

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CONV-005`.

---

## 1. OVERVIEW

This scenario validates the `deep-context` anti-convergence floor. It focuses on `assets/deep_context_config.json` declaring `minIterations: 2`, `convergenceMode: "default"`, and `stopPolicy: "fail-closed"`, plus the shared runtime and optimizer anchors that enforce fail-closed stop policy and reject invalid floor/max-iteration pairings.

### Why This Matters

`deep-context` is valuable only after multiple seats and at least enough iterations have explored the frontier. A one-iteration stop can produce a thin reuse map that looks complete. The shared anti-convergence contract prevents that early-stop shape from becoming the default behavior.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CONV-005` and confirm the expected signals without contradictory evidence.

- Objective: Verify `deep-context` declares `antiConvergence.minIterations: 2`, `convergenceMode: "default"`, `stopPolicy: "fail-closed"`, and that shared runtime/optimizer anchors preserve the fail-closed and floor/max-iteration contract.
- Real user request: `Check whether deep-context has the shared anti-convergence floor and cannot treat one context sweep as enough evidence.`
- Prompt: `As a manual-testing orchestrator, validate the deep-context anti-convergence contract against deep_context_config.json, the shared runtime capability resolver, and the optimizer manifest. Return a concise verdict.`
- Expected execution process: Grep the context config for the anti-convergence block, grep the shared runtime resolver for fail-closed stop-policy validation, and grep the optimizer manifest for locked convergence mode and `minIterations<=maxIterations`.
- Expected signals: `antiConvergence.minIterations` equals 2; `stopPolicy` equals `fail-closed`; shared runtime helper rejects missing/non-fail-closed policy; optimizer manifest locks convergence mode and names the paired floor/max constraint.
- Desired user-visible outcome: The context loop cannot be documented as a one-sweep stop path; it carries a two-iteration floor and a fail-closed stop-policy contract.
- Pass/fail: PASS if all checks return expected anchors; FAIL if the config lacks the block or shared guard anchors drift.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Stay local; inspect config and shared runtime/optimizer files.
3. Execute the deterministic steps exactly as written.
4. Compare observed output against the desired outcome.
5. Return a concise final answer.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CONV-005 | Cross-Mode Anti-Convergence Contract | Verify context antiConvergence floor and shared fail-closed/optimizer guards | `Check whether deep-context has the shared anti-convergence floor and cannot treat one context sweep as enough evidence.` | 1. `rg '"antiConvergence"|"minIterations": 2|"convergenceMode": "default"|"stopPolicy": "fail-closed"' .opencode/skills/deep-loop-workflows/deep-context/assets/deep_context_config.json` -> 2. `rg 'missing stopPolicy|stopPolicy must be "fail-closed"|validateStopPolicy' .opencode/skills/deep-loop-runtime/lib/deep-loop/runtime-capabilities.cjs` -> 3. `rg 'antiConvergence.convergenceMode|convergenceMode|minIterations<=maxIterations|minIterations|maxIterations' .opencode/skills/system-spec-kit/scripts/optimizer/optimizer-manifest.json` | Step 1: context config declares the antiConvergence block; Step 2: shared resolver validates fail-closed policy; Step 3: optimizer locks convergence mode and carries the min/max invariant | Grep outputs from all three commands | PASS if all expected anchors are present with no contradictory values; FAIL if any anchor is missing or permissive | 1. If the optimizer manifest path moved, discover it with `rg --files .opencode/skills \| rg 'optimizer-manifest\.json$'`. 2. If a mode-local context runtime matrix is introduced later, add it to this scenario. |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../feature_catalog/04--convergence-detection/cross-mode-anti-convergence-contract.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/deep-loop-workflows/deep-context/assets/deep_context_config.json` | Context anti-convergence floor and stop-policy config |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/runtime-capabilities.cjs` | Shared fail-closed stop-policy validation |
| `.opencode/skills/system-spec-kit/scripts/optimizer/optimizer-manifest.json` | Shared invariant group and convergence-mode lock |

---

## 5. SOURCE METADATA

- Group: Convergence Detection
- Playbook ID: CONV-005
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--convergence-detection/cross-mode-anti-convergence-contract.md`
