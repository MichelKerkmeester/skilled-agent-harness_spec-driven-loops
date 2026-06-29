---
title: Design Dispatch Boundary
description: Shared sk-design boundary contract for DESIGN_BOUNDARY_PROOF v1 envelopes carried by child-agent and small-model dispatches.
trigger_phrases:
  - "design dispatch boundary"
  - "design boundary proof"
  - "DESIGN_BOUNDARY_PROOF"
  - "requires design boundary proof"
importance_tier: important
contextType: implementation
version: 1.0.0.0
---

# Design Dispatch Boundary

This file is the canonical home for `DESIGN_BOUNDARY_PROOF v1`. The envelope proves that design dispatch carried the loaded-context manifest, the proof-of-application demand, and the routed-mode declaration across a child-agent or small-model boundary.

It proves boundary carry and binding. It does not prove the resulting design is good.

---

## 1. Copy-Set Decision

Current copy set: canonical-only.

No real duplicate consumer currently carries this asset. Until one exists, the checker guards this canonical file's contract markers and verifies that `../design-interface/SKILL.md` points child-agent and small-model dispatches back here. Do not create a duplicate only to satisfy parity. When a real duplicate consumer is added, declare it in the checker input and keep the duplicate content identical to this file.

---

## 2. Envelope Schema

`DESIGN_BOUNDARY_PROOF v1` is a structured object in the dispatch payload.

| Field | Type | Required | Meaning |
|---|---:|---:|---|
| `version` | integer | yes | Contract version. MUST be `1`. |
| `routedMode` | object | yes | Binding to the `ROUTED:` declaration and the observed routing signal. |
| `routedMode.routeDeclaration` | string | yes | MUST be `ROUTED`. |
| `routedMode.expectedWorkflowMode` | string | yes | The route-gold `expected.workflowMode` the dispatch was supposed to select. |
| `routedMode.observedWorkflowMode` | string | yes | The workflow mode observed at the boundary. MUST equal `expectedWorkflowMode`. |
| `routedMode.observedIntents` | string array | yes | The observed intent list. MUST include `observedWorkflowMode`. |
| `payloadDigests` | object | yes | Content-bound digests for the design carry. |
| `payloadDigests.contextManifestDigest` | string | yes | Digest of the context manifest carried into the child. |
| `payloadDigests.designDispatchManifestDigest` | string | yes | Digest of the `DESIGN_DISPATCH_MANIFEST v1` carried into the child. |
| `payloadDigests.proofOfApplicationCardDigest` | string | yes | Digest of the proof-of-application demand carried into the child. |
| `designProofTokenRef` | object | yes | Reference to the authorizing `DESIGN_PROOF_TOKEN v1`; this never re-mints the token. |
| `designProofTokenRef.nonce` | string | yes | Nonce from the authorizing token. |
| `designProofTokenRef.runId` | string | yes | Run boundary from the authorizing token. |
| `assetDigest` | string | yes | Digest of this canonical asset, using the shared `sha256:<64 lowercase hex>` format. |

All digest fields use `sha256:<64 lowercase hex>`.

---

## 3. JSON Shape

```json
{
  "version": 1,
  "routedMode": {
    "routeDeclaration": "ROUTED",
    "expectedWorkflowMode": "interface",
    "observedWorkflowMode": "interface",
    "observedIntents": ["interface"]
  },
  "payloadDigests": {
    "contextManifestDigest": "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    "designDispatchManifestDigest": "sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    "proofOfApplicationCardDigest": "sha256:cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc"
  },
  "designProofTokenRef": {
    "nonce": "token-nonce",
    "runId": "token-run"
  },
  "assetDigest": "sha256:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd"
}
```

---

## 4. Boundary Rules

A dispatch boundary MUST reject when any of these are true:

- The envelope is absent.
- `version` is not `1`.
- `routedMode` is absent or does not bind to `ROUTED`.
- `routedMode.expectedWorkflowMode`, `routedMode.observedWorkflowMode`, or `routedMode.observedIntents` is missing.
- `routedMode.observedWorkflowMode` differs from the route-gold `expected.workflowMode`.
- `routedMode.observedIntents` does not include the observed workflow mode.
- Any required digest is missing or malformed.
- `designProofTokenRef.nonce` or `designProofTokenRef.runId` is missing.
- `assetDigest` is missing, malformed, or does not match the canonical asset digest when the checker can read this file.

Unknown additive fields may be ignored only after every required v1 field passes.

---

## 5. Residual

The enforceable floor is mechanical: the dispatch carried the context manifest, design dispatch manifest, proof-card demand, authorizing token reference, loaded/payload digests, asset digest, and routed-mode binding. The remaining design-quality claim is still advisory and must be judged by the active design mode and any downstream audit evidence.

Accepting this envelope means the boundary evidence survived delegation. It does not mean the child produced a distinctive, accessible, or polished design; that claim still needs the active mode's proof-of-application and any downstream audit evidence.
