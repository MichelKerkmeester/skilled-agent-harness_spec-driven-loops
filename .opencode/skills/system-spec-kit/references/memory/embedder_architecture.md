---
title: Embedder Architecture
description: Dual encode/index embedder architecture for bootstrap auto-selection, shared factory providers, registry adapters, active vec_metadata pointers, and dim-tagged vector tables.
trigger_phrases:
  - "embedder architecture"
  - "bootstrap auto-selection"
  - "active_embedder_name"
  - "vec dim tables"
  - "embedder_set runbook"
---

# Embedder Architecture

Spec-memory keeps query encoding and document indexing symmetric by persisting the active embedder in `vec_metadata` and resolving providers from that pointer.

---

## 1. OVERVIEW

### Purpose

Define how spec-memory selects, stores, swaps, and diagnoses active embedders across shared factory providers, registry adapters, vector shards, and cache boundaries.

### When to Use

Load this reference when debugging query/index embedding drift, changing active embedders, validating vector dimensions, or diagnosing spec-memory RSS and sidecar behavior.

### Core Principle

Query encoding and document indexing must use the same provider, model, and vector dimension.

### Architecture Summary

Query encoding and document indexing MUST use the same embedder. If indexing writes Jina vectors but search encodes queries with a different model, the system can look healthy while returning low-quality or incompatible vectors.

The runtime has two embedder paths:

| Path | Location | Used for |
|------|----------|----------|
| Shared factory | `shared/embeddings/factory.ts` and `shared/embeddings/providers/*` | Search-time and save-time calls through `generateEmbedding()`, `generateDocumentEmbedding()`, and `generateQueryEmbedding()` |
| Registry adapters | `mcp_server/lib/embedders/registry.ts` and `mcp_server/lib/embedders/adapters/*` | Embedder manifests, readiness checks, and re-index jobs launched by `embedder_set` |

Both paths must agree on the active model and vector dimension.

## 2. BOOTSTRAP AUTO-SELECTION

On first memory-runtime use, `context-server.ts` opens the vector database and calls `ensureActiveEmbedder()`. If `vec_metadata` already has a valid active pointer, startup reuses it. If the pointer is empty, `autoSelectActiveEmbedder()` probes this **local-first** precedence chain (ADR-014, 2026-05-19) and persists the first available choice:

| Tier | Probe | Persisted active embedder |
|------|-------|---------------------------|
| 1 | Ollama `/api/tags` reachable and an ADR-013 priority model is pulled | first pulled of `nomic-embed-text-v1.5`, `jina-embeddings-v3`, `bge-m3`, `mxbai-embed-large-v1` |
| 2 | hf-local model server answers `/api/health` (launcher-supervised pure-Node `@huggingface/transformers`; ready or loading both count) | `{ name: "nomic-ai/nomic-embed-text-v1.5", dim: 768, provider: "hf-local" }` |
| 3 | `OPENAI_API_KEY` set and OpenAI embeddings endpoint is reachable | `{ name: "text-embedding-3-small", dim: 1536, provider: "openai" }` |
| 4 | `VOYAGE_API_KEY` set and `https://api.voyageai.com/v1/embeddings` accepts `voyage-code-3` | `{ name: "voyage-code-3", dim: 1024, provider: "voyage" }` |

If all probes fail, startup fails with an error listing every tier and the reason it was rejected. There is no silent local model fallback.

> ADR-014 supersedes the cascade clause of ADR-013 (which had defined the cloud-first ordering `voyage > openai > ollama > hf-local`). ADR-013's within-Ollama priority order (nomic first) still stands and is reflected in tier 1 above.

The selected pointer is persisted in:

| Key | Meaning |
|-----|---------|
| `active_embedder_name` | canonical active model or manifest name |
| `active_embedder_dim` | native vector dimension |
| `active_embedder_provider` | `voyage`, `openai`, `ollama`, or `hf-local` |

A filesystem lock beside the active database serializes concurrent daemon starts, so two bootstraps do not both write the pointer.

## 3. DIM-TAGGED TABLES

Dim-tagged vector tables keep incompatible vectors separated:

| Table | Dimension | Typical models |
|-------|-----------|----------------|
| `vec_384` | 384 | `bge-small-en-v1.5` |
| `vec_768` | 768 | `nomic-embed-text-v1.5`, `nomic-ai/nomic-embed-text-v1.5`, `BAAI/bge-base-en-v1.5` (legacy hf-local default) |
| `vec_1024` | 1024 | `jina-embeddings-v3`, `mxbai-embed-large-v1`, `bge-m3`, `bge-large-en-v1.5`, `snowflake-arctic-embed-l-v2.0`, `voyage-code-3` |
| `vec_1536` | 1536 | `text-embedding-3-small` |

Search queries must be encoded to the same dimension as the active vector source. A 768-dim query against `vec_1024` is invalid.

## 4. STORAGE LAYOUT

The memory store is split into one stable canonical metadata database plus one attached vector shard for the active embedding profile:

| File | Contents |
|------|----------|
| `mcp_server/database/context-index.sqlite` | `memory_index`, `memory_lineage`, `memory_fts*`, projections, governance tables, checkpoints, session state, and canonical `vec_metadata` active embedder pointers |
| `mcp_server/database/vectors/context-vectors__<provider>__<model>__<dim>.sqlite` | `vec_memories*`, dim-tagged `vec_<dim>` payload tables, profile-specific `embedding_cache`, and shard-local `vec_metadata` for provider/model/dim self-description |

At runtime the canonical connection attaches the active shard as `active_vec`. Vector queries and writes use `active_vec.vec_memories` or `active_vec.vec_<dim>`, while cache reads and writes use `active_vec.embedding_cache`. The canonical `vec_metadata.active_embedder_*` keys remain the source of truth for the active profile; the shard mirror is an integrity check that prevents attaching a mismatched provider/model/dimension store.

Legacy profile databases named `context-index__<slug>.sqlite` migrate during guarded memory-runtime initialization when the active profile still has a single-file store and the canonical/shard pair is missing. Migration copies canonical tables into `context-index.sqlite`, copies vector/cache payloads into `vectors/context-vectors__<slug>.sqlite`, enables WAL on both files, and moves the original legacy file to `mcp_server/database/migrations/legacy_<slug>_<timestamp>.sqlite.bak` for rollback. Operators should delete that backup only after validating the split in production.

No environment variable controls this layout. `MEMORY_DB_PATH` still points at the canonical DB when explicitly set; the active shard path is derived from the canonical directory and the active embedding profile.

## 5. SUPPORTED MANIFESTS

The MCP registry currently exposes these Ollama-backed re-index manifests:

| Manifest | Ollama model | Dim | Notes |
|----------|--------------|-----|-------|
| `nomic-embed-text-v1.5` | `nomic-embed-text:v1.5` | 768 | Requires query/document prefixes |
| `mxbai-embed-large-v1` | `mxbai-embed-large:latest` | 1024 | AnglE/paraphrase-oriented candidate |
| `bge-small-en-v1.5` | `bge-small-en-v1.5:latest` | 384 | Compact candidate |
| `bge-large-en-v1.5` | `bge-large-en-v1.5:latest` | 1024 | Large BAAI candidate |
| `jina-embeddings-v3` | `hf.co/gaianet/jina-embeddings-v3-GGUF:Q4_K_M` | 1024 | ADR-012 production local target |
| `bge-m3` | `bge-m3:latest` | 1024 | Multilingual hybrid model |
| `snowflake-arctic-embed-l-v2.0` | `snowflake-arctic-embed2:latest` | 1024 | Snowflake multilingual candidate |

Cloud and hf-local providers are selected during bootstrap, not by `embedder_set`.

## 6. SWAP RUNBOOK

1. Pull the Ollama model:

```bash
ollama pull hf.co/gaianet/jina-embeddings-v3-GGUF:Q4_K_M
```

2. Confirm Ollama is listening:

```bash
curl http://127.0.0.1:11434/api/tags
```

3. Use MCP `embedder_set`:

```json
{ "name": "jina-embeddings-v3" }
```

4. Poll `embedder_status` until the job completes.
5. Confirm `vec_metadata.active_embedder_name`, `active_embedder_dim`, and `active_embedder_provider`.
6. Restart the daemon after code changes so it loads the rebuilt shared dist.

The re-index job writes the target dim table and flips the active pointer only after completion. Existing tables remain on disk for rollback.

## 7. RSS EXPECTATIONS

| Provider | Expected memory shape |
|----------|-----------------------|
| Ollama | Model memory lives mostly in the Ollama process |
| hf-local | model state lives in a separate launcher-supervised Node model-server process (`@huggingface/transformers`), not in-process; spec-memory holds only the HTTP client |
| Voyage/OpenAI | spec-memory keeps only client/request state; model memory is remote |

For active `jina-embeddings-v3`, the expected operator result after daemon restart is that `context-server.js` uses Ollama for query encoding and does not load an extra in-process embedding model.

## 8. MEMORY DIAGNOSTICS

`memory_health` accepts `includeFullReport:true` for byte-aware runtime diagnostics. The extended report includes RSS, V8 heap totals, external memory, ArrayBuffer memory, V8 malloc counters, cache byte estimates for tool cache, trigger matcher regex retention, and the in-process embedding LRU.

### Multi-client launcher bridge

The launcher concurrency model remains strict-single-writer: one primary daemon owns the SQLite handle and lease. When a secondary MCP launcher sees a live lease, it now looks for the daemon IPC socket at `<dbDir>/daemon-ipc.sock` and, when present, bridges its stdio stream to that socket instead of exiting. The daemon accepts the socket connection as another JSON-RPC channel and runs it through the same handler pipeline as the primary stdio transport.

Bridge mode is only used for normal MCP launcher flow after a live lease is detected. If the socket is missing or refused, the launcher falls back to the diagnostic `LEASE_HELD_BY:<pid>` line so MCP hosts get the established failure signal instead of opening a second SQLite writer.

Operators can disable bridge mode with `SPECKIT_LAUNCHER_BRIDGE_DISABLED=1`, which restores legacy exit-on-lease-held behavior. `SPECKIT_MAX_SECONDARY_CLIENTS` caps concurrent bridge clients (default 8). `SPECKIT_IPC_SOCKET_DIR` relocates the bridge socket directory and is **required on macOS** for all three launcher services: the default `<service-db>/daemon-ipc.sock` path is longer than the platform's 104-char `sun_path` limit, so `listen()` fails with `EINVAL` and the MCP handshake never completes. The committed runtime configs pin each service to `/tmp/mk-spec-memory`, `/tmp/mk-skill-advisor`, and `/tmp/mk-code-index`. Full `memory_health({ includeFullReport: true })` output includes `ipc_bridge.socket_path`, `secondary_clients_count`, and cumulative secondary message counters.

### Lazy Startup Gating

The MCP server now starts with a thin bootstrap: tool schemas, validation, runtime detection, signal handlers, and stdio binding are registered immediately, while the memory runtime initializes on first memory-owning tool call. `ensureMemoryRuntimeInitialized(reason)` guards DB open, integrity and dimension checks, storage/search consumer init, BM25 warmup, reindex resume, retry manager startup, and the background scan.

`memory_health` is intentionally lightweight before the guard fires. It uses `tryGetDb()` and reports `runtime_initialized: false` without opening SQLite or spawning embedder sidecars. After the first guarded memory call, the same field reports `true`, and full reports include DB-backed cache and consistency data again.

The trade-off is first-call latency: the first `memory_search`, `memory_context`, `memory_save`, embedder, checkpoint, ingest, eval, causal, or session-learning call pays the runtime initialization cost. Idle startup stays smaller because SQLite, BM25, retry jobs, startup scans, and local model sidecars remain cold until memory is actually used.

### Stage 3 Reranking (removed)

Stage 3 cross-encoder reranking was REMOVED in the 014 deprecation: the local rerank path in `mcp_server/lib/search/cross-encoder.ts` was removed in phase 003 and the local rerank sidecar skill was deleted in phase 004 (cloud rerankers were already removed in 022/013). Memory search now returns fused vector/BM25/FTS/graph/degree results with no rerank stage. The retired A/B benchmark (`mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/`) had already kept reranking out of the default config (negligible hit-rate gain, large p95 latency regression) and is retained only as a historical record.

### Lexical Search Engine

`SPECKIT_BM25_ENGINE` controls the lexical BM25 provider without changing the public `bm25Search()` API. The default `auto` mode uses SQLite FTS5 when the canonical database has `memory_fts`, so startup skips the resident JavaScript BM25 warmup and the BM25 lane is populated from FTS5 results tagged as `bm25` for compatibility with keyword fusion.

Use `SPECKIT_BM25_ENGINE=legacy-inmemory` to restore the old warm JavaScript singleton for tokenizer, stemmer, or rollback investigations. `SPECKIT_BM25_ENGINE=sqlite` forces FTS5 only and fails clearly when `memory_fts` is missing. `packed-inmemory` is reserved for a future packed term-id implementation and currently warns before falling back to legacy in-memory behavior.

The lexical normalizer lives in `mcp_server/lib/search/lexical-normalizer.ts` and is shared by both BM25 paths. It remains the source of truth for query synonyms, lightweight stemming, FTS-safe query expansion, and BM25 query tokens, so switching the rank provider does not silently drop synonym recall.

### Sidecar Execution

Embedding execution is routed through `mcp_server/lib/embedders/execution-router.ts`. The router keeps SQLite reads/writes, cache lookup/store, and vector table mutations in the MCP process, but can move heavy local model runtimes into a child Node sidecar that speaks JSONL over stdio.

`SPECKIT_EMBEDDER_EXECUTION` controls routing:

| Value | Voyage/OpenAI | Ollama | hf-local | Future sentence-transformers |
|-------|---------------|--------|----------|------------------------------|
| `auto` | direct | direct | sidecar | sidecar |
| `direct` | direct | direct | direct | direct |
| `sidecar` | sidecar | sidecar | sidecar | sidecar |

Sidecars are lazy: the worker is not forked until the first embedding request for a `(provider, model)` tuple. `SPECKIT_EMBEDDER_SIDECAR_IDLE_MS` evicts an idle worker after 300000 ms by default, so the MCP daemon's RSS stays small and local model memory can leave the machine-wide resident set after idle. `SPECKIT_EMBEDDER_SIDECAR_PING_TIMEOUT_MS` bounds the health ping before each request; a timed-out worker is respawned before embedding.

Full `memory_health` reports expose `sidecar_workers`, keyed by provider/model, with the worker pid, model, last request timestamp, idle age, and request count. An empty object means no sidecar is currently spawned.

### Profile-Aware Caching

Persistent document and query embeddings are cached by `content_hash`, active `profile_key`, `input_kind`, `model_id`, and `dimensions`. The profile key is derived from `vec_metadata.active_embedder_provider`, `active_embedder_name`, and `active_embedder_dim`, so switching between Jina, Voyage, OpenAI, or hf-local profiles no longer reuses an incompatible cache row.

The cache is byte-bounded rather than count-bounded. `SPECKIT_EMBED_CACHE_MAX_BYTES` caps all embedding cache rows, `SPECKIT_EMBED_CACHE_PROFILE_MAX_BYTES` caps each profile, `SPECKIT_QUERY_EMBED_CACHE_MAX_BYTES` caps query rows separately, and `SPECKIT_EMBED_CACHE_MAX_ENTRIES_PER_PROFILE` remains as a secondary safety limit. LRU eviction uses `last_used_at`, then calls SQLite `PRAGMA shrink_memory` when rows are deleted.

Full `memory_health` reports expose `cache_byte_estimates.embedding_cache_by_profile`, with document/query breakdowns per profile. Use that field to verify profile switches do not stack unbounded historical cache rows.

Heap snapshots remain opt-in because they can contain indexed text, prompts, file paths, and secret-shaped values. Set `SPECKIT_HEAP_SNAPSHOT_DIR=/path/to/private/dir` before launching the context server, then call the heap profiler snapshot path during an investigation; the server creates the directory with mode `0700` and each `.heapsnapshot` with mode `0600`.

`SPECKIT_CONTEXT_SERVER_MAX_OLD_SPACE_MB` can pass `--max-old-space-size=<mb>` to the spawned `context-server.js` child for profiling or leak-canary sessions. Leave it unset for normal operation until packed BM25 and byte-bounded cache packets have reduced retained heap enough to pick a safe cap.

## 9. REFERENCES

- Packet 016/002/001: adapter interface
- Packet 016/002/002: Ollama backend and multi-dim schema
- Packet 016/002/003: MCP tools and re-index
- Packet 016/002/004: bake-off and Jina v3 selection
- Packet 016/002/006: shared factory encode-path wiring
- Packet 016/002/007: bootstrap auto-selection and native provider purge
- Related resilience doc: [embedding_resilience.md](./embedding_resilience.md)
