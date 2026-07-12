---
title: "Causal tombstone sweep and metadata-edge promoter"
description: "Causal-edge deletes now tombstone before hard deletion, and scan indexing promotes validated packet metadata into generated causal edges while preserving manual edges."
trigger_phrases:
  - "causal tombstone sweep and metadata-edge promoter"
  - "causal_edge_tombstones"
  - "frontmatter promoter"
  - "metadata edge promoter"
version: 3.6.0.1
---

# Causal tombstone sweep and metadata-edge promoter

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Causal graph maintenance now preserves deletion lineage and derives auditable generated edges from authored packet metadata.

The tombstone sweep captures active edges before delete. The metadata-edge promoter maps validated parent, child, and parent-chain metadata to generated causal edges during scan indexing while leaving manual edges untouched.

---

## 2. HOW IT WORKS

`lib/causal/sweep.ts` snapshots active edges, writes tombstones with restore metadata and lifecycle generation, hard-deletes by active edge id, and clears graph caches. Delete paths call this helper for single memory deletes, bulk deletes, stale index cleanup, manual unlink, health orphan repair, checkpoint cleanup, vector-index cleanup, and correction undo cleanup.

`lib/causal/frontmatter-promoter.ts` reads `graph-metadata.json` and `description.json`, normalizes packet ids, resolves packet memory rows, and emits generated edges with `created_by='auto'`, `extraction_method='frontmatter'`, and `confidence=1.0`. Stale generated edges for removed metadata are tombstoned before removal; manual edges are preserved.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `mcp_server/lib/causal/sweep.ts` | Shared | Central tombstone-then-delete helper |
| `mcp_server/lib/causal/frontmatter-promoter.ts` | Shared | Metadata-to-causal-edge promoter |
| `mcp_server/lib/storage/causal-edges.ts` | Shared | Storage delete helpers and generated-edge provenance support |
| `mcp_server/lib/search/vector-index-schema.ts` | Shared | Causal tombstone table and generated-edge provenance columns |
| `mcp_server/handlers/memory-index.ts` | Handler | Runs metadata promotion after metadata indexing |
| `mcp_server/handlers/causal-graph.ts` | Handler | Manual unlink tombstone reason and restore context |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/causal-edge-tombstones.vitest.ts` | Automated test | Tombstone coverage for delete, bulk delete, unlink, and health repair |
| `mcp_server/tests/frontmatter-promoter.vitest.ts` | Automated test | Mapping, idempotency, warning, manual preservation, and tombstone coverage |
| `mcp_server/tests/vector-index-schema-compatibility.vitest.ts` | Automated test | Schema compatibility footprint |
| `mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts` | Automated test | Schema migration coverage |

---

## 4. SOURCE METADATA

- Group: Analysis
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `analysis/causal_tombstone_sweep_and_metadata_edge_promoter.md`

Related references:
- [causal-edge-deletion-memorycausalunlink.md](causal_edge_deletion_memorycausalunlink.md) - Manual causal edge deletion
- [causal-graph-statistics-memorycausalstats.md](causal_graph_statistics_memorycausalstats.md) - Causal graph health metrics
