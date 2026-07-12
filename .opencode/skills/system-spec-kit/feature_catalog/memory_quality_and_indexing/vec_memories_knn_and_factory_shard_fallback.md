---
title: "vec_memories KNN dual-write, factory shard fallback, and vector read-path resilience"
description: "Reindex writes embeddings to both vec_<dim> and vec_memories, the factory resolves active embedder shards, and the vector read path probes, quarantines, repairs, and reports degraded shard health."
trigger_phrases:
  - "vec_memories KNN dual-write and factory shard fallback"
  - "vec_memories dual-write"
  - "writeVectorsToKnn"
  - "factory shard fallback"
  - "vector shard quarantine"
  - "recallDegradation degradedVector"
  - "KNN query shape benchmark"
  - "KNN table empty semantic retrieval"
version: 3.6.0.6
---

# vec_memories KNN dual-write, factory shard fallback, and vector read-path resilience

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

`memory_search` semantic retrieval was returning Z-scores near 1.2 because the runtime KNN table was empty. The reindex job wrote rebuilt embeddings only to the canonical `vec_<dim>` regular table while the search pipeline queries the sqlite-vec `vec_memories` virtual table. The factory then compounded the problem by looking for the dim-tagged table inside `context-index.sqlite` after vector payloads had moved into per-embedder shards under `database/vectors/`. The cascade fell through to a stale 1024-dim ollama default instead of the actually-active nomic at 768-dim.

This feature pairs the original dual-write/factory fixes with the shipped read-path resilience layer. Reindex dual-writes both tables in the same transaction. The factory accepts either the main DB or the shard subdirectory when validating the dim-tagged table. Existing shards are now probed before attach, corrupt shards are quarantined beside the original file, repair reindex uses the existing staging-and-atomic-rename path, and health payloads expose `recallDegradation.degradedVector` counters for operator triage.

---

## 2. HOW IT WORKS

`writeVectorsToShard` in `lib/embedders/reindex.ts` opens the shard at `<db_dir>/vectors/context-vectors__<provider>__<model>__<dim>.sqlite`, sets WAL, loads sqlite-vec on the connection, creates the `vec_<dim>` blob table and the `vec_memories` vec0 virtual table, then runs `writeVectors` and `writeVectorsToKnn` inside the same transaction.

`writeVectorsToKnn` is a new helper that performs `DELETE WHERE rowid = ?` then `INSERT INTO vec_memories(rowid, embedding) VALUES (?, ?)` per row because the vec0 virtual table rejects `INSERT OR REPLACE`. The shard write degrades gracefully: if `sqliteVec.load(shard)` throws, the helper falls back to writing only the canonical blob table so the system stays in a partial-write state rather than failing the whole reindex.

`readActiveOllamaEmbedderFromDb` in `shared/embeddings/factory.ts` now consults two locations for the dim-tagged table. It checks `tableExistsInSqlite(sqlitePath, "vec_<dim>")` first for the legacy layout. When the main DB does not have the table, it derives the per-embedder shard path `path.join(path.dirname(sqlitePath), "vectors", "context-vectors__ollama__<name>__<dim>.sqlite")` and checks the shard. If either source has the table populated, the function returns the embedder profile. If both lack it, the function emits the cascade warning and returns null so the provider chain can continue.

Daemon startup logs no longer report `[factory] Active embedder ... points to vec_<dim>, but that table is missing in <main_db>` once the patched dist is loaded. The factory positive signal is `[factory] Using provider: ollama (vec_metadata active_embedder_name=nomic-embed-text-v1.5 (768-dim))`.

### Operator-visible vector resilience

| Behavior | Operator signal | Source |
|---|---|---|
| Shard probe before attach | Existing shard files must pass `quick_check(1)` and required table checks before attach proceeds | `mcp_server/lib/search/vector-index-store.ts` |
| Quarantine and repair | Probe or attach failure renames the shard and sidecars to `.quarantined-*`, attaches a fresh shard, and schedules repair reindex | `mcp_server/lib/search/vector-index-store.ts`, `mcp_server/lib/embedders/reindex.ts` |
| Degraded-vector health | `recallDegradation.degradedVector` reports state, detections, quarantines, rebuild starts/completions/failures, last shard, and active job ID | `mcp_server/lib/observability/retrieval-observability.ts`, `mcp_server/handlers/memory-crud-health.ts`, `mcp_server/handlers/embedder-status.ts` |
| Dimension-source precedence | Stored shard metadata and active embedder profile/config sources win; schema-name regex parsing is only a warning-grade fallback | `mcp_server/lib/search/vector-index-store.ts`, `mcp_server/tests/vector-dimension-source.vitest.ts` |
| KNN query-shape threshold | Scalar JOIN stays selected unless sqlite-vec `MATCH` beats it by more than 20 percent in benchmark coverage | `mcp_server/lib/search/vector-index-queries.ts`, `mcp_server/tests/vector-knn-query-shape-benchmark.vitest.ts` |

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/embedders/reindex.ts` | Reindex orchestrator | `writeVectorsToShard` dual-writes vec_<dim> + vec_memories. `writeVectorsToKnn` is the new vec0 insert helper with DELETE-then-INSERT pattern. Graceful degradation when sqlite-vec extension fails to load |
| `shared/embeddings/factory.ts` | Provider factory | `readActiveOllamaEmbedderFromDb` falls back to the per-embedder shard at `<db_dir>/vectors/context-vectors__ollama__<name>__<dim>.sqlite` when the main DB lacks the dim-tagged table |
| `mcp_server/lib/search/vector-index-store.ts` | Vector index store | Runtime KNN reads through the attached `active_vec` schema alias. `ensure_vector_shard_schema` lazily creates both tables on first attach |
| `mcp_server/lib/search/vector-index-queries.ts` | Query helpers | Scalar JOIN vs sqlite-vec `MATCH` benchmark helper and adoption-threshold decision |
| `mcp_server/lib/observability/retrieval-observability.ts` | Observability | `recallDegradation.degradedVector` health snapshot and repair counters |
| `mcp_server/handlers/memory-crud-health.ts` | Handler | Surfaces vector degradation in memory health responses |
| `mcp_server/handlers/embedder-status.ts` | Handler | Surfaces vector degradation alongside active embedder status |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/scripts/repair-graph-metadata.mjs` | Automated test | Operator-facing repair tool that also exercises the dual-write contract on its lineage path |
| `mcp_server/tests/vector-shard-read-path-resilience.vitest.ts` | Automated test | Fault-injection test for corrupt shard detection, quarantine, repair scheduling, and healthy final state |
| `mcp_server/tests/vector-dimension-source.vitest.ts` | Automated test | Dimension-source precedence and regex fallback coverage |
| `mcp_server/tests/vector-knn-query-shape-benchmark.vitest.ts` | Automated test | KNN scalar JOIN vs `MATCH` benchmark and threshold coverage |
| Manual row-count check | Manual validation | `vec_memories` row count vs `vec_<dim>` row count must match per active shard after any reindex |
| Manual startup-log check | Manual validation | Daemon startup log free of factory cascade warning when the active embedder has a populated shard |

---

## 4. SOURCE METADATA
- Group: Memory Quality And Indexing
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `memory_quality_and_indexing/vec_memories_knn_and_factory_shard_fallback.md`
Related references:
- [memory-causal-trust-display.md](memory_causal_trust_display.md) — Memory causal trust display
- [constitutional-sufficiency-gate-exemption.md](constitutional_sufficiency_gate_exemption.md) — Constitutional sufficiency-gate exemption
