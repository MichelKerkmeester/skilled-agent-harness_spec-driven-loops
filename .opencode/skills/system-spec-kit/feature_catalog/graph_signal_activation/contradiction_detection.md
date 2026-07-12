---
title: "Contradiction detection"
description: "detectContradictions() auto-invalidates old edges when superseding or conflicting edges are created, maintaining graph consistency by ensuring only the most current causal relationships remain active, gated by the SPECKIT_TEMPORAL_EDGES flag."
trigger_phrases:
  - "contradiction detection"
  - "detectContradictions auto-invalidate"
  - "conflicting superseding edge detection"
  - "graph consistency causal relationships"
  - "automatic edge invalidation on conflict"
version: 3.6.0.5
---

# Contradiction detection

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

`detectContradictions()` auto-invalidates old edges when superseding or conflicting edges are created, maintaining graph consistency by ensuring only the most current causal relationships remain active. This prevents contradictory information from coexisting in the active graph, which would otherwise cause conflicting signals during causal boost and graph traversal.

---

## 2. HOW IT WORKS

Enabled by default (graduated). Set `SPECKIT_TEMPORAL_EDGES=false` to disable (shares flag with temporal edge validity).

When a new causal edge is created, `detectContradictions()` checks for existing edges between the same source and target nodes that carry a conflicting or superseding relation type. If a contradiction is found, the older edge is automatically invalidated via `invalidateEdge()`, setting its `invalid_at` timestamp. This runs as part of the edge creation flow, so the graph is always consistent after mutation.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/graph/contradiction-detection.ts` | Lib | `detectContradictions()` — conflict detection and automatic edge invalidation |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/contradiction-detection.vitest.ts` | Automated test | Contradiction detection, auto-invalidation, and edge conflict scenarios |

---

## 4. SOURCE METADATA
- Group: Graph Signal Activation
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `graph_signal_activation/contradiction_detection.md`

- Kill switch: SPECKIT_TEMPORAL_EDGES=false
Related references:
- [temporal-edges.md](temporal_edges.md) — Temporal edge validity
- [ontology-hooks.md](ontology_hooks.md) — Ontology-Guided Extraction Hooks
