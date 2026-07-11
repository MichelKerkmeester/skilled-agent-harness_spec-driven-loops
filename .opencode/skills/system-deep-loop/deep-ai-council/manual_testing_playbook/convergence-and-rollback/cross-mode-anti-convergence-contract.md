---
title: "DAC-033 -- Cross-mode anti-convergence contract"
description: "This scenario validates the council min-round anti-convergence floor, fail-closed runtime stop policy, and shared optimizer/runtime guard anchors for DAC-033."
version: 2.3.0.1
---

# DAC-033 -- Cross-mode anti-convergence contract

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DAC-033`.

---

## 1. OVERVIEW

This scenario validates the council anti-convergence contract.

### Why This Matters

A council can appear to agree after one round before the critique and disagreement surface has had enough room to work. The round floor and fail-closed stop policy make that early convergence path explicit and auditable.

---

## 2. SCENARIO CONTRACT

- Objective: Verify `deep-ai-council` declares `antiConvergence.minRounds: 2`, `convergenceMode: "default"`, `stopPolicy: "fail-closed"`, a fail-closed runtime capability matrix, and shared runtime/optimizer guard anchors.
- Real user request: Check whether the council can converge before its minimum round floor.
- Prompt: `Check whether deep-ai-council has a minimum round floor and fail-closed stop policy before convergence is trusted.`
- Expected execution process: Inspect `assets/deep_ai_council_config.json`, `assets/runtime_capabilities.json`, the shared runtime capability resolver, and the optimizer manifest.
- Expected signals: Council config has `minRounds: 2`; runtime capabilities have `stopPolicy: "fail-closed"` and round invariant names; shared resolver rejects missing/non-fail-closed policy; optimizer manifest contains the shared anti-convergence invariant group.
- Desired user-visible outcome: The user gets a clear verdict that council mode carries a minimum round floor and cannot silently load permissive stop policy.
- Pass/fail: PASS if every guard is explicit; FAIL if the council floor or fail-closed policy is absent.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Read the council config first.
2. Check the runtime capability matrix for fail-closed policy and round invariant names.
3. Check the shared resolver and optimizer manifest.
4. Return a short verdict.

### Prompt

`Check whether deep-ai-council has a minimum round floor and fail-closed stop policy before convergence is trusted.`

### Commands

1. `bash: rg -n '"antiConvergence"|"minRounds": 2|"convergenceMode": "default"|"stopPolicy": "fail-closed"' .opencode/skills/system-deep-loop/deep-ai-council/assets/deep_ai_council_config.json`
2. `bash: rg -n '"stopPolicy": "fail-closed"|minRounds|maxRounds|invariants' .opencode/skills/system-deep-loop/deep-ai-council/assets/runtime_capabilities.json`
3. `bash: rg -n 'missing stopPolicy|stopPolicy must be "fail-closed"|validateStopPolicy' .opencode/skills/system-deep-loop/runtime/lib/deep-loop/runtime-capabilities.cjs`
4. `bash: rg -n 'antiConvergence.convergenceMode|convergenceMode|minIterations<=maxIterations|minIterations|maxIterations' .opencode/skills/system-spec-kit/scripts/optimizer/optimizer-manifest.json`

### Expected

The council config declares the round floor and fail-closed policy, the runtime matrix repeats fail-closed policy and round invariant names, the shared resolver rejects permissive policy, and the optimizer manifest carries the shared invariant group.

### Evidence

Capture the cited config, matrix, resolver, and optimizer lines.

### Pass / Fail

- **Pass**: Council min-round floor and fail-closed stop policy are explicit, with shared guard anchors present.
- **Fail**: No deterministic council floor exists, or runtime policy can load permissively.

### Failure Triage

Check the config first, then the runtime capability matrix. Treat the optimizer manifest as shared iteration-mode evidence unless a council-specific optimizer manifest is added later.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DAC-033 | Cross-mode anti-convergence contract | Verify council min-round floor and fail-closed guards | `Check whether deep-ai-council has a minimum round floor and fail-closed stop policy before convergence is trusted.` | `bash: rg -n '"antiConvergence"|"minRounds": 2|"convergenceMode": "default"|"stopPolicy": "fail-closed"' .opencode/skills/system-deep-loop/deep-ai-council/assets/deep_ai_council_config.json -> bash: rg -n '"stopPolicy": "fail-closed"|minRounds|maxRounds|invariants' .opencode/skills/system-deep-loop/deep-ai-council/assets/runtime_capabilities.json -> bash: rg -n 'missing stopPolicy|stopPolicy must be "fail-closed"|validateStopPolicy' .opencode/skills/system-deep-loop/runtime/lib/deep-loop/runtime-capabilities.cjs -> bash: rg -n 'antiConvergence.convergenceMode|convergenceMode|minIterations<=maxIterations|minIterations|maxIterations' .opencode/skills/system-spec-kit/scripts/optimizer/optimizer-manifest.json` | Council config, runtime matrix, resolver, and optimizer anchors present | Grep output lines | PASS if explicit | Inspect config, then runtime matrix |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../feature_catalog/convergence-and-rollback/cross-mode-anti-convergence-contract.md` | Feature catalog entry for DAC-033 |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/system-deep-loop/deep-ai-council/assets/deep_ai_council_config.json` | Council anti-convergence config |
| `.opencode/skills/system-deep-loop/deep-ai-council/assets/runtime_capabilities.json` | Council runtime capability policy and invariant names |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/runtime-capabilities.cjs` | Shared fail-closed stop-policy validation |
| `.opencode/skills/system-spec-kit/scripts/optimizer/optimizer-manifest.json` | Shared anti-convergence optimizer invariant group |

---

## 5. SOURCE METADATA

- Group: CONVERGENCE AND ROLLBACK
- Playbook ID: DAC-033
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `convergence-and-rollback/cross-mode-anti-convergence-contract.md`
