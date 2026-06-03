---
title: "Vectors: Per-Embedder Vector Shard Storage"
description: "Runtime storage directory for per-embedder vector shards attached by the active metadata DB."
trigger_phrases:
  - "vector shards"
  - "per-embedder vectors"
  - "context-vectors sqlite"
---

# Vectors: Per-Embedder Vector Shard Storage

---

## 1. OVERVIEW

`vectors/` holds per-embedder vector shards split out from the metadata DB under the canonical vector shard split rule. Each shard is an independent SQLite file scoped to one embedder profile (provider, model, dimension and optional quantisation).

Current state:

- The active metadata DB `context-index.sqlite` in the parent `database/` folder attaches exactly one shard from this directory at runtime under the SQL alias `active_vec`.
- The active production shard is `context-vectors__ollama__nomic-embed-text-v1.5__768.sqlite` (Ollama nomic-embed-text v1.5, 768 dimensions).
- A quantised hf-local shard may also be created for `nomic-ai/nomic-embed-text-v1.5` at 768 dimensions with q8 quantisation.
- Legacy and experimental shards get deleted once they fall out of the active rotation. This folder is not an archive.
- The `.gitkeep` file keeps the directory tracked. The `.sqlite`, `.sqlite-shm` and `.sqlite-wal` files are runtime artifacts and stay ignored by git under the same rule the parent `database/README.md` documents.

---

## 2. ARCHITECTURE

```text
┌──────────────────────────────────────────────────────────────────┐
│                       MCP server runtime                         │
└────────────────────────────────┬─────────────────────────────────┘
                                 │
                                 ▼
                ┌──────────────────────────────┐
                │ database/context-index.sqlite│
                │  (metadata, FTS, checkpoints)│
                └──────────────┬───────────────┘
                               │ ATTACH AS active_vec
                               ▼
        ┌──────────────────────────────────────────────┐
        │                vectors/                      │
        │  one shard attached per active embedder      │
        └──────────────────────┬───────────────────────┘
                               │
       ┌───────────────────────┼───────────────────────┐
       ▼                       ▼                       ▼
context-vectors__       context-vectors__           [other shards
ollama__nomic-          hf-local__nomic-ai_          created lazily
embed-text-v1.5__       nomic-embed-text-v1.5__      on embedder
768.sqlite              768__q8.sqlite               selection]

Attach is one shard at a time. Schema creation is lazy on first attach
when a new embedder profile is selected.
```

---

## 3. DIRECTORY TREE

```text
vectors/
+-- README.md
+-- .gitkeep
+-- context-vectors__ollama__nomic-embed-text-v1.5__768.sqlite        # Active production shard
+-- context-vectors__ollama__nomic-embed-text-v1.5__768.sqlite-shm    # Runtime sidecar
+-- context-vectors__ollama__nomic-embed-text-v1.5__768.sqlite-wal    # Runtime sidecar
+-- context-vectors__hf-local__nomic-ai_nomic-embed-text-v1.5__768__q8.sqlite  # Optional hf-local shard
+-- context-vectors__hf-local__nomic-ai_nomic-embed-text-v1.5__768__q8.sqlite-shm
`-- context-vectors__hf-local__nomic-ai_nomic-embed-text-v1.5__768__q8.sqlite-wal
```

---

## 4. SHARD FILENAME CONVENTION

Shard files follow this fixed pattern:

```text
context-vectors__<provider>__<model>__<dim>[__<quant>].sqlite
```

| Token | Required | Example | Purpose |
|---|---|---|---|
| `provider` | Yes | `ollama`, `hf-local` | Backend that produced the embeddings |
| `model` | Yes | `nomic-embed-text-v1.5`, `nomic-ai_nomic-embed-text-v1.5` | Embedder model identifier, with `/` replaced by `_` |
| `dim` | Yes | `768`, `1024` | Embedding dimension, drives the `vec_<dim>` virtual table name |
| `quant` | Optional | `q8` | Quantisation tag when the shard stores quantised vectors |

Examples that exist today:

- `context-vectors__ollama__nomic-embed-text-v1.5__768.sqlite` (~15 MB, active production shard)
- `context-vectors__hf-local__nomic-ai_nomic-embed-text-v1.5__768__q8.sqlite` (quantised hf-local shard)

The double-underscore separator is load-bearing. Single underscores inside a token survive because the parser splits on `__`.

---

## 5. SHARD SCHEMA

Every shard contains three logical sections, created lazily on first attach:

| Table | Type | Purpose |
|---|---|---|
| `vec_metadata` | Key/value | Stores `provider`, `model`, `dim` and `embedding_dim` for the shard. Used by attach-time integrity checks. |
| `embedding_cache` | Plain table | Caches recent embeddings keyed by content hash and embedder profile. |
| `vec_<dim>` | Virtual table (`sqlite-vec`) | Vector index sized to the embedder dimension. `vec_768` for 768-dim profiles, `vec_1024` for 1024-dim profiles, and so on. |

The virtual-table name is derived from the profile's `dim` by `vector_table_name_for_profile` in `dist/lib/search/vector-index-store.js`. Queries read through the `active_vec` schema alias, so handler code refers to `active_vec.vec_768` rather than the physical shard filename.

---

## 6. BOUNDARIES AND FLOW

This folder owns storage location only. Schema creation, attach and detach, lazy table initialisation, and index population live in MCP server code outside this directory.

| Boundary | Rule |
|---|---|
| Writes | Only the mk-spec-memory daemon writes to shards, through `dist/lib/search/vector-index-store.js` and `mcp_server/scripts/reindex-embeddings.ts`. |
| Reads | Reads go through `active_vec` after attach. Handlers never open shard files directly. |
| Manual edits | Do not hand-edit shards. Dim mismatches between `vec_metadata` and the `vec_<dim>` table corrupt the index. |
| Commits | Do not commit `.sqlite`, `.sqlite-shm` or `.sqlite-wal` files. The parent `database/README.md` covers the gitignore rule for this directory. |
| Rotation | Legacy and test shards get deleted, not archived, once the active embedder profile changes. |

Main flow:

```text
┌──────────────────────────────────────────┐
│ embedder profile resolved at startup     │
└────────────────────┬─────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────┐
│ shard filename derived from profile      │
│ (provider, model, dim, optional quant)   │
└────────────────────┬─────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────┐
│ ATTACH shard AS active_vec               │
│ (lazy create vec_metadata,               │
│  embedding_cache and vec_<dim>)          │
└────────────────────┬─────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────┐
│ search and reindex run through           │
│ active_vec.vec_<dim>                     │
└──────────────────────────────────────────┘
```

---

## 7. VALIDATION

Run from the repository root:

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py \
  --type readme \
  .opencode/skills/system-spec-kit/mcp_server/database/vectors/README.md
```

Use MCP memory tools to inspect live shard state. Use the SQLite CLI on a copy if you need to inspect schema. Never open the active shard with a writer process while the daemon is running.

---

## 8. RELATED

- [`../README.md`](../README.md) - Parent database directory contract.
- [`../../dist/lib/search/vector-index-store.js`](../../dist/lib/search/vector-index-store.js) - Canonical write path, `ACTIVE_VECTOR_SCHEMA` constant, attach and lazy schema creation.
- [`../../scripts/reindex-embeddings.ts`](../../scripts/reindex-embeddings.ts) - Reindex entrypoint that populates `vec_<dim>` from the metadata DB.
- [`../../../../../specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/`](../../../../../specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/) - Embedder testing and architecture umbrella spec packet (ADR-012 canonical vector shard split).
