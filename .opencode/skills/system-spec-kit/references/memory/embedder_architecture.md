---
title: Embedder Architecture
description: Dual encode/index embedder architecture for shared factory providers, registry adapters, active vec_metadata pointers, and dim-tagged vector tables.
trigger_phrases:
  - "embedder architecture"
  - "ollama encode path"
  - "active_embedder_name"
  - "vec dim tables"
  - "embedder_set runbook"
---

# Embedder Architecture

The post-016 embedder architecture for spec-memory: dual encode/index code paths kept symmetric via a shared active pointer.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Core Principle

Query encoding and document indexing MUST use the same embedder. Asymmetry between the two paths produces silent dimension mismatches and fallbacks that look healthy but return the wrong vectors.

### Purpose

Documents why there are two embedder code paths (shared factory for search/save + registry adapters for swap/re-index), how they are kept symmetric via the `vec_metadata` active pointer, and how operators swap embedders safely without regressing query quality.

### When to Use

- Operators swapping the active embedder (mxbai → jina → nomic etc.) via the `embedder_set` MCP tool
- Engineers adding a new embedder backend (Ollama / Voyage / OpenAI / hf-local / llama-cpp)
- Debugging "index uses model X but search uses model Y" symptoms (the exact bug 016/002/006 closes)
- Understanding RSS attribution of `context-server.js` per embedder choice

### Prerequisites

- Familiarity with the predecessor packets:
  - 016/002/001 — adapter interface
  - 016/002/002 — Ollama backend + multi-dim schema
  - 016/002/003 — MCP tools + re-index orchestrator
  - 016/002/004 — bake-off + ADR-012 Jina v3 selection
  - 016/002/006 — shared factory encode-path wiring
- Working Ollama install (`ollama list` reachable) for any non-llama-cpp manifest
- Spec-memory MCP daemon running; `vec_metadata` populated

### Key Sources

- `shared/embeddings/factory.ts` — shared provider factory
- `shared/embeddings/providers/ollama.ts` — OllamaProvider (added in 006)
- `mcp_server/lib/embedders/registry.ts` — registry + adapter factory
- `mcp_server/lib/embedders/adapters/ollama.ts` — re-index OllamaAdapter
- `mcp_server/lib/embedders/schema.ts` — vec_metadata helpers
- `mcp_server/lib/embedders/reindex.ts` — background re-index orchestrator
- ADR-012: `<arc>/016/002/004-spec-memory-embedder-bake-off/decision-record.md`

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:dual-paths -->
## 2. DUAL CODE PATHS

There are two embedder paths:

| Path | Location | Used for |
|------|----------|----------|
| Shared factory | `shared/embeddings/factory.ts` and `shared/embeddings/providers/*` | Search-time and save-time calls through `generateEmbedding()`, `generateDocumentEmbedding()`, and `generateQueryEmbedding()` |
| Registry adapters | `mcp_server/lib/embedders/registry.ts` and `mcp_server/lib/embedders/adapters/*` | Embedder manifests, readiness checks, and re-index jobs launched by `embedder_set` |

The factory path is the stable API used by the MCP retrieval pipeline. The registry path is the swap/re-index orchestration surface introduced by 016/002. Both paths must encode with the same model whenever an active embedder is selected.

016/002/006 closes the half-migration where re-index used `OllamaAdapter` but search-time factory calls still selected llama-cpp.

<!-- /ANCHOR:dual-paths -->

<!-- ANCHOR:pointer -->
## 3. ACTIVE POINTER

The active embedder is stored in `vec_metadata`:

| Key | Example | Meaning |
|-----|---------|---------|
| `active_embedder_name` | `jina-embeddings-v3` | Canonical manifest name |
| `active_embedder_dim` | `1024` | Native vector dimension for the active table |

Auto provider resolution in `shared/embeddings/factory.ts` consults this pointer. If the active name resolves to an Ollama manifest and the matching dim-tagged table exists with rows, the shared factory selects `ollama`.

If the table is missing, empty, or has a dimension that contradicts the manifest, the factory logs a warning and continues to the EmbeddingGemma-capable fallback chain instead of crashing.

<!-- /ANCHOR:pointer -->

<!-- ANCHOR:dim-tables -->
## 4. DIM-TAGGED TABLES

The legacy baseline table is `vec_memories` at 768 dimensions. New embedders use dim-tagged tables:

| Table | Dimension | Typical models |
|-------|-----------|----------------|
| `vec_384` | 384 | `bge-small-en-v1.5` |
| `vec_768` | 768 | `nomic-embed-text-v1.5` |
| `vec_1024` | 1024 | `jina-embeddings-v3`, `mxbai-embed-large-v1`, `bge-m3`, `bge-large-en-v1.5`, `snowflake-arctic-embed-l-v2.0` |

Search queries must be encoded to the same dimension as the active vector source. A 768-dim query against `vec_1024` is invalid and either errors or forces fallback to an older table.

<!-- /ANCHOR:dim-tables -->

<!-- ANCHOR:manifests -->
## 5. SUPPORTED MANIFESTS

| Manifest | Backend | Provider-facing model | Dim | Notes |
|----------|---------|------------------------|-----|-------|
| `embeddinggemma-300m` | llama-cpp | `unsloth/embeddinggemma-300m-GGUF` | 768 | Legacy/local baseline |
| `nomic-embed-text-v1.5` | Ollama | `nomic-embed-text:v1.5` | 768 | Requires query/document prefixes |
| `mxbai-embed-large-v1` | Ollama | `mxbai-embed-large:latest` | 1024 | AnglE/paraphrase-oriented candidate |
| `bge-small-en-v1.5` | Ollama | `bge-small-en-v1.5:latest` | 384 | Compact candidate |
| `bge-large-en-v1.5` | Ollama | `bge-large-en-v1.5:latest` | 1024 | Large BAAI candidate |
| `jina-embeddings-v3` | Ollama | `hf.co/gaianet/jina-embeddings-v3-GGUF:Q4_K_M` | 1024 | Current production target |
| `bge-m3` | Ollama | `bge-m3:latest` | 1024 | Multilingual hybrid model |
| `snowflake-arctic-embed-l-v2.0` | Ollama | `snowflake-arctic-embed2:latest` | 1024 | Snowflake multilingual candidate |
| `voyage-4` | Voyage API | `voyage-4` | 1024 | Cloud compatibility provider |
| `text-embedding-3-small` | OpenAI API | `text-embedding-3-small` | 1536 | Cloud compatibility provider |
| `onnx-community/embeddinggemma-300m-ONNX` | hf-local | same | 768 | Final local fallback |

The registry and shared provider manifest lists must stay symmetric for Ollama rows until the manifest table is promoted into a package-safe shared module.

<!-- /ANCHOR:manifests -->

<!-- ANCHOR:symmetry -->
## 6. QUERY-INDEX SYMMETRY

The invariant is simple: the model that indexes documents must also encode search queries.

| Operation | Correct active Jina v3 behavior |
|-----------|----------------------------------|
| Re-index | `embedder_set({ name: "jina-embeddings-v3" })` uses registry `getAdapter(name).embed()` and writes 1024-dim rows to `vec_1024` |
| Query | `generateQueryEmbedding(query)` resolves shared `OllamaProvider` and returns a 1024-dim vector |
| Vector search | `activeVectorSource()` reads `vec_1024` when the active pointer names a non-baseline embedder |

016/002/006 exists because the index path had moved to Ollama while the query path still selected llama-cpp.

<!-- /ANCHOR:symmetry -->

<!-- ANCHOR:swap-runbook -->
## 7. SWAP RUNBOOK

1. Pull the Ollama model:

```bash
ollama pull hf.co/gaianet/jina-embeddings-v3-GGUF:Q4_K_M
```

2. Start or confirm Ollama is listening:

```bash
curl http://127.0.0.1:11434/api/tags
```

3. Use MCP `embedder_set`:

```json
{ "name": "jina-embeddings-v3" }
```

4. Poll `embedder_status` until the job completes.

5. Confirm `vec_metadata.active_embedder_name` and `active_embedder_dim` point at the completed model.

6. Restart the spec-memory daemon after code changes so it loads the new shared dist.

The re-index job writes the target dim table and flips the active pointer only after completion. Existing tables remain on disk for rollback.

<!-- /ANCHOR:swap-runbook -->

<!-- ANCHOR:rss -->
## 8. RSS EXPECTATIONS

| Backend | Expected memory shape |
|---------|-----------------------|
| Ollama | Model memory lives mostly in the Ollama process; spec-memory should not import or load `node-llama-cpp` for active Ollama manifests |
| llama-cpp | spec-memory imports `node-llama-cpp` and loads the GGUF model in-process |
| hf-local | spec-memory loads Transformers.js/ONNX state in-process |
| Voyage/OpenAI | spec-memory keeps only client/request state; model memory is remote |

For active `jina-embeddings-v3`, the expected operator result after daemon restart is that `context-server.js` no longer loads the EmbeddingGemma GGUF via node-llama-cpp, reducing RSS by the previous in-process model cost.

<!-- /ANCHOR:rss -->

<!-- ANCHOR:cross-links -->
## 9. References and Related Resources

- Packet 016/002/001: adapter interface
- Packet 016/002/002: Ollama backend and multi-dim schema
- Packet 016/002/003: MCP tools and re-index
- Packet 016/002/004: bake-off and Jina v3 selection
- Packet 016/002/006: shared factory encode-path wiring
- Related resilience doc: [embedding_resilience.md](./embedding_resilience.md)

<!-- /ANCHOR:cross-links -->
