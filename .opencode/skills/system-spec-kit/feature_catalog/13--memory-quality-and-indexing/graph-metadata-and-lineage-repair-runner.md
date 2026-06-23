---
title: "Graph-metadata and lineage repair runner"
description: "Direct-run Node script that normalizes graph-metadata.json to v1, maps legacy importance_tier values to the accepted enum, compacts V8-rejected archived metadata, and realigns stale memory_lineage logical keys with current memory_index identities."
trigger_phrases:
  - "graph-metadata and lineage repair runner"
  - "repair-graph-metadata.mjs"
  - "graph-metadata.json v1 normalization"
  - "E_LINEAGE stale logical key repair"
  - "importance_tier enum repair"
version: 3.6.0.3
---

# Graph-metadata and lineage repair runner

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

`memory_index_scan` accumulated 503 non-sufficiency failures over time from three structural sources: stale `memory_lineage.logical_key` rows that no longer match `memory_index` identities after folder renames (`E_LINEAGE`), graph-metadata.json files still on the v0 schema or carrying invalid `importance_tier` values (`CHECK constraint failed: importance_tier`), and archived graph-metadata that fails V-rule V8 because manual relationship arrays still point at foreign packets.

The repair runner is the canonical maintenance tool for these three classes. It is direct-run (operator-invoked, not auto-scheduled), idempotent on second pass, and writes `/tmp/repair-graph-metadata-*` backups before any real mutation.

---

## 2. HOW IT WORKS

The runner lives at `mcp_server/scripts/repair-graph-metadata.mjs`. It supports four flags: `--dry-run`, `--scan-log <path>`, `--root <dir>`, and `--no-lineage`.

The graph-metadata path walks `<root>/**/graph-metadata.json` files. For each file:
- If `schema_version` is missing or v0, upgrades to v1 with required `manual` and `derived` sections.
- If `derived.importance_tier === "high"`, rewrites to `important` (the canonical replacement in the accepted enum: `constitutional, critical, important, normal, temporary, deprecated`).
- If the scan log shows `V-rule hard block: V8` for this file, compacts the v8 contamination signal by clearing `manual.depends_on`, `manual.related_to`, and noisy `derived` foreign references. The compaction only fires on scan-rejected files so legitimate cross-references on healthy active packets stay intact.

The lineage path reads `E_LINEAGE` predecessor ids from the scan log, copies `context-index.sqlite` plus its WAL/SHM sidecars to the backup dir, then for each stale predecessor row updates `memory_lineage.logical_key` to the rebuilt logical identity (derived from the current `memory_index.spec_folder`, `canonical_file_path`, and `anchor_id`) and refreshes `active_memory_projection` accordingly.

Final memory_index_scan after the runner shipped: 503 failures dropped to 0 across `INSUFFICIENT_CONTEXT_ABORT`, `E_LINEAGE`, invalid graph schema, invalid importance_tier, and V8 buckets.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/scripts/repair-graph-metadata.mjs` | Maintenance script | Direct-run runner with dry-run, scan-log-driven repairs, /tmp backups, structured JSON reports, and idempotency on re-run |
| `mcp_server/lib/graph/graph-metadata-schema.ts` | Schema source | Defines the v1 graph-metadata shape the runner upgrades to |
| `shared/embeddings/factory.ts` | Provider factory | Source of the `importance_tier` accepted enum that the runner uses for normalization |
| `mcp_server/handlers/memory-index.ts` | Scan handler | Source of the scan log structure that the runner reads for V8 and E_LINEAGE rejection classes |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| Manual: re-run the runner with `--dry-run` after a real pass; expected `graphMetadata.changed: 0` and `lineage.changed: 0` (idempotency) |
| Manual: post-runner `memory_index_scan` reports `failed: 0` for the targeted classes; only residual `description.json` malformations remain (out of scope for this runner) |
| Manual: backup dir at `/tmp/repair-graph-metadata-<timestamp>` contains a copy of every mutated file plus the SQLite database snapshot |

---

## 4. SOURCE METADATA
- Group: Memory Quality And Indexing
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `13--memory-quality-and-indexing/graph-metadata-and-lineage-repair-runner.md`
- Shipping packet: `016/002/019-lineage-and-metadata-repair-runner`
Related references:
- [constitutional-sufficiency-gate-exemption.md](constitutional-sufficiency-gate-exemption.md) — Constitutional sufficiency-gate exemption
