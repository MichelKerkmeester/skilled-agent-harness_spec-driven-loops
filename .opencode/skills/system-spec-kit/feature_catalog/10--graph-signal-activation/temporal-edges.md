---
title: "Temporal edge validity"
description: "valid_at/invalid_at columns on causal_edges enable time-bounded graph traversal, with invalidateEdge() marking outdated edges and getValidEdges() filtering to currently valid ones, gated by the SPECKIT_TEMPORAL_EDGES flag."
trigger_phrases:
  - "temporal edge validity"
  - "SPECKIT_TEMPORAL_EDGES"
  - "valid_at invalid_at causal_edges"
  - "invalidateEdge time-bounded traversal"
  - "getValidEdges currently valid"
version: 3.6.0.5
---

# Temporal edge validity

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

`valid_at`/`invalid_at` columns on `causal_edges` enable time-bounded graph traversal, with `invalidateEdge()` marking outdated edges and `getValidEdges()` filtering to currently valid ones. This ensures that graph walks and causal boosts only consider edges that are temporally current, preventing stale or superseded relationships from influencing search ranking.

---

## 2. HOW IT WORKS

Enabled by default (graduated). Set `SPECKIT_TEMPORAL_EDGES=false` to disable.

The `causal_edges` table includes `valid_at` (timestamp when the edge became valid) and `invalid_at` (timestamp when the edge was invalidated, null if still valid). The `invalidateEdge()` function sets the `invalid_at` timestamp on a specified edge, marking it as no longer current. The `getValidEdges()` function filters edges to return only those where `invalid_at` is null, ensuring graph traversal operates on the current state of knowledge.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/graph/temporal-edges.ts` | Lib | `invalidateEdge()`, `getValidEdges()`, temporal column management |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/temporal-edges.vitest.ts` | Automated test | Temporal edge validity, invalidation, and filtering |

---

## 4. SOURCE METADATA
- Group: Graph Signal Activation
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `10--graph-signal-activation/temporal-edges.md`

- Kill switch: SPECKIT_TEMPORAL_EDGES=false
Related references:
- [typed-traversal.md](typed-traversal.md) — Typed traversal
- [contradiction-detection.md](contradiction-detection.md) — Contradiction detection
