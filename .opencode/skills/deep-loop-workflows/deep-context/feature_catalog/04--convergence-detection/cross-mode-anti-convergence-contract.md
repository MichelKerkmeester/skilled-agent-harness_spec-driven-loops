---
title: "Cross-Mode Anti-Convergence Contract"
description: "Documents the deep-context antiConvergence floor and fail-closed stop policy inherited from the cross-mode deep-loop contract."
trigger_phrases:
  - "cross-mode anti-convergence"
  - "context antiConvergence"
  - "fail-closed stop policy"
  - "minimum context iterations"
  - "convergence mode default"
version: 1.2.0.1
---

# Cross-Mode Anti-Convergence Contract

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Documents the `deep-context` side of the cross-mode `antiConvergence` contract: a two-iteration floor, default convergence mode, and fail-closed stop policy.

This contract sits beside the context loop's existing saturation and coverage-graph gates. It prevents a context run from treating a single sweep as enough evidence and gives operators one stable place to confirm the shared stop-policy field.

## 2. HOW IT WORKS

The shipped `assets/deep_context_config.json` declares:

```json
"antiConvergence": {
  "minIterations": 2,
  "convergenceMode": "default",
  "stopPolicy": "fail-closed"
}
```

The context loop still uses its normal convergence path: low-progress saturation must be reached and `convergence.cjs --loop-type context` must return `STOP_ALLOWED`. The anti-convergence block is the shared cross-mode floor and policy layer around that path.

Unlike review and research, `deep-context` does not currently ship a mode-local `runtime_capabilities.json` shim. Its documented contract is therefore anchored in the context config and the shared deep-loop runtime/optimizer files.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `assets/deep_context_config.json` | Config | Declares `antiConvergence.minIterations: 2`, `convergenceMode: "default"`, and `stopPolicy: "fail-closed"`. |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/runtime-capabilities.cjs` | Shared runtime | Defines the shared fail-closed runtime capability validation used by modes with capability matrices. |
| `.opencode/skills/system-spec-kit/scripts/optimizer/optimizer-manifest.json` | Optimizer | Defines the shared invariant group that locks convergence mode and rejects `minIterations > maxIterations`. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/04--convergence-detection/cross-mode-anti-convergence-contract.md` | Manual scenario | Verifies the context config and shared runtime/optimizer anchors. |

---

## 4. SOURCE METADATA

- Group: Convergence Detection
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `04--convergence-detection/cross-mode-anti-convergence-contract.md`
- Primary sources: `assets/deep_context_config.json`, `.opencode/skills/deep-loop-runtime/lib/deep-loop/runtime-capabilities.cjs`, `.opencode/skills/system-spec-kit/scripts/optimizer/optimizer-manifest.json`

Related references:
- [context-coverage-signals.md](context-coverage-signals.md) - Context coverage signals
- [relevance-gate.md](relevance-gate.md) - Relevance gate
