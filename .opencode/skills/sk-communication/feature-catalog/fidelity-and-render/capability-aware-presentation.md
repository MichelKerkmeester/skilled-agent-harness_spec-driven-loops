---
title: "Capability-aware presentation"
description: "Chooses atomic replacement, append, sidecar, or original-only presentation from validated output and the caller-owned display boundary."
trigger_phrases:
  - "Capability-aware presentation"
  - "atomic projection render"
  - "decideRender"
  - "sidecar projection presentation"
version: 1.0.0.0
---

# Capability-aware presentation (decideRender)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Chooses atomic replacement, append, sidecar, or original-only presentation from validated output and the caller-owned display boundary.

This boundary controls only what the operator sees. It exposes no canonical writer and preserves the original whenever the source changed, the generation is incomplete, validation failed, or the client cannot commit its selected display operation.

---

## 2. HOW IT WORKS

`decideRender` verifies the current source digest, terminal completion, part completeness, fidelity profile, projection byte length, and projection digest. It then walks the caller's preferred modes, defaulting to atomic replacement, append after original, and sidecar, and selects the first mode supported by the declared display capabilities.

`applyDisplayPresentation` permits full 1:1 projection only when the client owns the complete message and an atomic render decision. Append mode leaves both original and projection visible. `applySidecarPresentation` accepts only an adapter-selected sidecar degradation and also leaves the original visible. A failed commit, mismatched outcome, unsupported mode, or missing ownership produces original-only presentation.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/sk-communication/cli-communication-projection/src/render/decision.ts` | Handler | Chooses a digest-checked capability-supported render mode. |
| `.opencode/skills/sk-communication/cli-communication-projection/src/clients/display.ts` | Handler | Applies atomic replacement or append on a client-owned display. |
| `.opencode/skills/sk-communication/cli-communication-projection/src/clients/sidecar.ts` | Handler | Applies sidecar projection without suppressing the original. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/sk-communication/cli-communication-projection/test/fidelity/render.test.ts` | Unit | Covers render prerequisites, mode selection, and exact-original fallback. |
| `.opencode/skills/sk-communication/cli-communication-projection/test/clients/display.test.ts` | Unit | Verifies ownership, atomic commit, append, and failure behavior. |
| `.opencode/skills/sk-communication/cli-communication-projection/test/clients/sidecar.test.ts` | Unit | Verifies sidecar-only degradation and original visibility. |

---

## 4. SOURCE METADATA

- Group: Fidelity And Render
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `fidelity-and-render/capability-aware-presentation.md`

Related references:
- [protected-span-fidelity-validation.md](protected-span-fidelity-validation.md) — Validation result required before presentation
