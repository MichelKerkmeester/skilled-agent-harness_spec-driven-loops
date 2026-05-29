---
title: "vec_memories KNN dual-write and factory shard fallback"
description: "Reindex now writes embeddings to both the canonical vec_<dim> blob table and the vec0 vec_memories virtual table. The factory follows ADR-012 and resolves the active ollama embedder through the per-embedder shard when the main DB lacks the dim-tagged table."
---

# vec_memories KNN dual-write and factory shard fallback

## 1. OVERVIEW

`memory_search` semantic retrieval was returning Z-scores near 1.2 because the runtime KNN table was empty. The reindex job wrote rebuilt embeddings only to the canonical `vec_<dim>` regular table while the search pipeline queries the sqlite-vec `vec_memories` virtual table. The factory then compounded the problem by looking for the dim-tagged table inside `context-index.sqlite` while ADR-012 had moved it into the per-embedder shard under `database/vectors/`. The cascade fell through to a stale 1024-dim ollama default instead of the actually-active nomic at 768-dim. (The canonical local default is `nomic-ai/nomic-embed-text-v1.5`; see 029/001.)

This feature pairs two surgical patches that restore semantic confidence end-to-end. Reindex dual-writes both tables in the same transaction. The factory accepts either the main DB or the shard subdirectory when validating the dim-tagged table.

---

## 2. CURRENT REALITY

`writeVectorsToShard` in `lib/embedders/reindex.ts` opens the shard at `<db_dir>/vectors/context-vectors__<provider>__<model>__<dim>.sqlite`, sets WAL, loads sqlite-vec on the connection, creates the `vec_<dim>` blob table and the `vec_memories` vec0 virtual table, then runs `writeVectors` and `writeVectorsToKnn` inside the same transaction.

`writeVectorsToKnn` is a new helper that performs `DELETE WHERE rowid = ?` then `INSERT INTO vec_memories(rowid, embedding) VALUES (?, ?)` per row because the vec0 virtual table rejects `INSERT OR REPLACE`. The shard write degrades gracefully: if `sqliteVec.load(shard)` throws, the helper falls back to writing only the canonical blob table so the system stays in a partial-write state rather than failing the whole reindex.

`readActiveOllamaEmbedderFromDb` in `shared/embeddings/factory.ts` now consults two locations for the dim-tagged table. It checks `tableExistsInSqlite(sqlitePath, "vec_<dim>")` first for the legacy layout. When the main DB does not have the table, it derives the per-embedder shard path `path.join(path.dirname(sqlitePath), "vectors", "context-vectors__ollama__<name>__<dim>.sqlite")` and checks the shard. If either source has the table populated, the function returns the embedder profile. If both lack it, the function emits the cascade warning and returns null so the provider chain can continue.

Daemon startup logs no longer report `[factory] Active embedder ... points to vec_<dim>, but that table is missing in <main_db>` once the patched dist is loaded. The factory positive signal is `[factory] Using provider: ollama (vec_metadata active_embedder_name=nomic-embed-text-v1.5 (768-dim))`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/embedders/reindex.ts` | Reindex orchestrator | `writeVectorsToShard` dual-writes vec_<dim> + vec_memories. `writeVectorsToKnn` is the new vec0 insert helper with DELETE-then-INSERT pattern. Graceful degradation when sqlite-vec extension fails to load |
| `shared/embeddings/factory.ts` | Provider factory | `readActiveOllamaEmbedderFromDb` falls back to the per-embedder shard at `<db_dir>/vectors/context-vectors__ollama__<name>__<dim>.sqlite` when the main DB lacks the dim-tagged table |
| `mcp_server/lib/search/vector-index-store.ts` | Vector index store | Runtime KNN reads through the attached `active_vec` schema alias. `ensure_vector_shard_schema` lazily creates both tables on first attach |

### Validation And Tests

| File | Focus |
|------|-------|
| `mcp_server/scripts/repair-graph-metadata.mjs` | Operator-facing repair tool that also exercises the dual-write contract on its lineage path |
| Manual: `vec_memories` row count vs `vec_<dim>` row count must match per active shard after any reindex |
| Manual: daemon startup log free of factory cascade warning when the active embedder has a populated shard |

---

## 4. SOURCE METADATA
- Group: Memory Quality And Indexing
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `13--memory-quality-and-indexing/29-vec-memories-knn-and-factory-shard-fallback.md`
- Shipping packets: `016/002/016-reindex-populates-vec-memories-knn-table`, `016/002/017-factory-shard-fallback-for-hf-voyage-openai`
