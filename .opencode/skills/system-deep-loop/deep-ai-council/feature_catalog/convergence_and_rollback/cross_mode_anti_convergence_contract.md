---
title: "Cross-mode anti-convergence contract"
description: "Verify the council min-round floor, fail-closed stop policy, runtime capability validation, and optimizer invariant anchors."
trigger_phrases:
  - "cross-mode anti-convergence"
  - "council antiConvergence"
  - "minRounds"
  - "fail-closed stop policy"
  - "council convergence floor"
version: 2.3.0.1
---

# Cross-mode anti-convergence contract

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Verify the council slice of the cross-mode anti-convergence contract.

Council mode uses rounds rather than iterations, so the shipped config declares `antiConvergence.minRounds: 2` with `convergenceMode: "default"` and `stopPolicy: "fail-closed"`. This prevents a one-round council from being documented as enough evidence for convergence.

Operators use this feature when the real request is: Check whether the council can converge before its minimum round floor or fall back to permissive stop behavior.

---

## 2. HOW IT WORKS

The council config declares the round floor in `assets/deep_ai_council_config.json`. The runtime capability matrix declares `stopPolicy: "fail-closed"` and an invariant block with `minRounds` and `maxRounds` names so council keeps the same anti-convergence semantics while using round-based field names.

The shared runtime capability resolver rejects missing or non-fail-closed stop policy. The optimizer manifest carries the shared iteration-oriented invariant group; council documents the round-based equivalent in its runtime capability matrix.

The user-visible contract is concrete: council convergence still requires the two-of-three rule and critique clearance, but it also carries a minimum round floor and fail-closed stop policy.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `assets/deep_ai_council_config.json` | Config | Declares `antiConvergence.minRounds: 2`, `convergenceMode: "default"`, and `stopPolicy: "fail-closed"`. |
| `assets/runtime_capabilities.json` | Runtime matrix | Declares fail-closed stop policy and council round invariants. |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/runtime-capabilities.cjs` | Shared runtime | Rejects missing or non-fail-closed stop policy. |
| `.opencode/skills/system-spec-kit/scripts/optimizer/optimizer-manifest.json` | Optimizer | Provides the shared anti-convergence invariant group for iteration-based modes. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/convergence_and_rollback/cross_mode_anti_convergence_contract.md` | Manual scenario | Verifies council config, runtime matrix, runtime resolver, and optimizer anchors. |

---

## 4. SOURCE METADATA
- Group: Convergence And Rollback
- Feature ID: DAC-033
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `feature_catalog/convergence_and_rollback/cross_mode_anti_convergence_contract.md`
- Playbook scenario: `manual_testing_playbook/convergence_and_rollback/cross_mode_anti_convergence_contract.md`
Related references:
- [two-of-three-agree-triggers-convergence.md](../convergence_and_rollback/two_of_three_agree_triggers_convergence.md) - Two-of-three agree triggers convergence
- [max-rounds-without-convergence-emits-non-converged.md](../convergence_and_rollback/max_rounds_without_convergence_emits_non_converged.md) - Max rounds without convergence emits non-converged
