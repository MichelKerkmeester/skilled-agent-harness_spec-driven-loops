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

## Overview

Query encoding and document indexing MUST use the same embedder. If indexing writes Jina vectors but search encodes queries with a different model, the system can look healthy while returning low-quality or incompatible vectors.

The runtime has two embedder paths:

| Path | Location | Used for |
|------|----------|----------|
| Shared factory | `shared/embeddings/factory.ts` and `shared/embeddings/providers/*` | Search-time and save-time calls through `generateEmbedding()`, `generateDocumentEmbedding()`, and `generateQueryEmbedding()` |
| Registry adapters | `mcp_server/lib/embedders/registry.ts` and `mcp_server/lib/embedders/adapters/*` | Embedder manifests, readiness checks, and re-index jobs launched by `embedder_set` |

Both paths must agree on the active model and vector dimension.

## Bootstrap Auto-Selection

On daemon bootstrap, `context-server.ts` opens the vector database and calls `ensureActiveEmbedder()`. If `vec_metadata` already has a valid active pointer, startup reuses it. If the pointer is empty, `autoSelectActiveEmbedder()` probes this precedence chain and persists the first available choice:

| Tier | Probe | Persisted active embedder |
|------|-------|---------------------------|
| 1 | `VOYAGE_API_KEY` set and `https://api.voyageai.com/v1/embeddings` accepts `voyage-code-3` | `{ name: "voyage-code-3", dim: 1024, provider: "voyage" }` |
| 2 | `OPENAI_API_KEY` set and OpenAI embeddings endpoint is reachable | `{ name: "text-embedding-3-small", dim: 1536, provider: "openai" }` |
| 3 | Ollama `/api/tags` reachable and an ADR-012 priority model is pulled | first pulled of `jina-embeddings-v3`, `nomic-embed-text-v1.5`, `bge-m3`, `mxbai-embed-large-v1` |
| 4 | `sentence-transformers` importable in the spec-memory Python runtime | `{ name: "BAAI/bge-base-en-v1.5", dim: 768, provider: "hf-local" }` |

If all probes fail, startup fails with an error listing every tier and the reason it was rejected. There is no silent local model fallback.

The selected pointer is persisted in:

| Key | Meaning |
|-----|---------|
| `active_embedder_name` | canonical active model or manifest name |
| `active_embedder_dim` | native vector dimension |
| `active_embedder_provider` | `voyage`, `openai`, `ollama`, or `hf-local` |

A filesystem lock beside the active database serializes concurrent daemon starts, so two bootstraps do not both write the pointer.

## Dim-Tagged Tables

Dim-tagged vector tables keep incompatible vectors separated:

| Table | Dimension | Typical models |
|-------|-----------|----------------|
| `vec_384` | 384 | `bge-small-en-v1.5` |
| `vec_768` | 768 | `nomic-embed-text-v1.5`, `BAAI/bge-base-en-v1.5` |
| `vec_1024` | 1024 | `jina-embeddings-v3`, `mxbai-embed-large-v1`, `bge-m3`, `bge-large-en-v1.5`, `snowflake-arctic-embed-l-v2.0`, `voyage-code-3` |
| `vec_1536` | 1536 | `text-embedding-3-small` |

Search queries must be encoded to the same dimension as the active vector source. A 768-dim query against `vec_1024` is invalid.

## Supported Manifests

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

## Swap Runbook

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

## RSS Expectations

| Provider | Expected memory shape |
|----------|-----------------------|
| Ollama | Model memory lives mostly in the Ollama process |
| hf-local | spec-memory loads local Python or Transformers.js model state in-process |
| Voyage/OpenAI | spec-memory keeps only client/request state; model memory is remote |

For active `jina-embeddings-v3`, the expected operator result after daemon restart is that `context-server.js` uses Ollama for query encoding and does not load an extra in-process embedding model.

## Memory Diagnostics

`memory_health` accepts `includeFullReport:true` for byte-aware runtime diagnostics. The extended report includes RSS, V8 heap totals, external memory, ArrayBuffer memory, V8 malloc counters, cache byte estimates for tool cache, trigger matcher regex retention, and the in-process embedding LRU.

### Sidecar Execution

Embedding execution is routed through `mcp_server/lib/embedders/execution-router.ts`. The router keeps SQLite reads/writes, cache lookup/store, and vector table mutations in the MCP process, but can move heavy local model runtimes into a child Node sidecar that speaks JSONL over stdio.

`SPECKIT_EMBEDDER_EXECUTION` controls routing:

| Value | Voyage/OpenAI | Ollama | hf-local | Future sentence-transformers / llama-cpp |
|-------|---------------|--------|----------|------------------------------------------|
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

## References

- Packet 016/002/001: adapter interface
- Packet 016/002/002: Ollama backend and multi-dim schema
- Packet 016/002/003: MCP tools and re-index
- Packet 016/002/004: bake-off and Jina v3 selection
- Packet 016/002/006: shared factory encode-path wiring
- Packet 016/002/007: bootstrap auto-selection and native provider purge
- Related resilience doc: [embedding_resilience.md](./embedding_resilience.md)
