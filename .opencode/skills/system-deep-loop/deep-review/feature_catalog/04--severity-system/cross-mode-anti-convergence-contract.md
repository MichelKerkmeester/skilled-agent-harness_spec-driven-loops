---
title: "Cross-Mode Anti-Convergence Contract"
description: "Documents the shipped antiConvergence floor, fail-closed stop policy, runtime capability validation, and optimizer invariant locks as consumed by deep-review."
trigger_phrases:
  - "cross-mode anti-convergence"
  - "antiConvergence"
  - "fail-closed stop policy"
  - "runtime capability stopPolicy"
  - "optimizer invariant group"
version: 1.11.0.6
---

# Cross-Mode Anti-Convergence Contract

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Documents the cross-mode `antiConvergence` contract as it applies to `deep-review`: a minimum iteration floor, a locked convergence mode, a fail-closed stop policy, runtime capability validation, and optimizer invariants that prevent invalid floor/max-iteration combinations.

For review mode, the shipped config sets `antiConvergence.minIterations` to `2`, `convergenceMode` to `default`, and `stopPolicy` to `fail-closed`. This makes a one-pass STOP illegal at the config layer and keeps optimizer changes from tuning past the floor contract.

## 2. HOW IT WORKS

The review config declares the floor in `assets/deep_review_config.json`. Its optimizer-managed block marks `antiConvergence.convergenceMode` and `antiConvergence.stopPolicy` as locked fields while keeping the review loop's ordinary tunables (`convergenceThreshold`, `stuckThreshold`, `maxIterations`) separate.

The runtime capability matrix declares `stopPolicy: "fail-closed"`. The shared runtime capability resolver rejects any matrix where `stopPolicy` is absent or not `fail-closed`, so callers cannot silently fall back to permissive stop behavior.

The optimizer manifest carries an invariant group for the same contract: `antiConvergence.convergenceMode` and `convergenceMode` stay locked, and `antiConvergence.minIterations` is tunable only when the paired `minIterations <= maxIterations` constraint holds.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `assets/deep_review_config.json` | Config | Declares `antiConvergence.minIterations: 2`, `convergenceMode: "default"`, `stopPolicy: "fail-closed"`, and locked optimizer-managed fields. |
| `assets/runtime_capabilities.json` | Runtime matrix | Declares the fail-closed stop policy consumed by the runtime capability resolver. |
| `scripts/runtime-capabilities.cjs` | Mode shim | Binds `deep-review` to the shared runtime capability resolver and local matrix path. |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/runtime-capabilities.cjs` | Shared runtime | Validates that every loaded matrix includes `stopPolicy: "fail-closed"`. |
| `.opencode/skills/system-spec-kit/scripts/optimizer/optimizer-manifest.json` | Optimizer | Defines the invariant group that locks convergence mode and rejects `minIterations > maxIterations`. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/04--convergence-and-recovery/cross-mode-anti-convergence-contract.md` | Manual scenario | Verifies the review-facing config, runtime matrix, resolver, and optimizer invariant anchors. |

---

## 4. SOURCE METADATA

- Group: Severity system
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `04--severity-system/cross-mode-anti-convergence-contract.md`
- Primary sources: `assets/deep_review_config.json`, `assets/runtime_capabilities.json`, `.opencode/skills/deep-loop-runtime/lib/deep-loop/runtime-capabilities.cjs`, `.opencode/skills/system-spec-kit/scripts/optimizer/optimizer-manifest.json`

Related references:
- [quality-gates.md](quality-gates.md) - Quality gates
- [convergence-signals.md](convergence-signals.md) - Semantic convergence signals
