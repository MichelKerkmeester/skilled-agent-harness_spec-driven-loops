---
title: Embedding Resilience
description: Provider fallback, bootstrap probes, graceful degradation, and offline mode for reliable semantic search
---

# Embedding Resilience

Spec-memory prefers a working semantic provider over a perfect one. Bootstrap auto-selection chooses the active embedder once, persists it in `vec_metadata`, and later search/save calls use that pointer to avoid model drift.

## Bootstrap Probe Sequence

When `vec_metadata` has no active pointer, daemon startup probes providers in this order:

1. Voyage API: `VOYAGE_API_KEY` plus a successful `voyage-code-3` embeddings request.
2. OpenAI API: `OPENAI_API_KEY` plus a successful `text-embedding-3-small` embeddings request.
3. Ollama: reachable `/api/tags`, choosing the first pulled model in ADR-012 order: `jina-embeddings-v3`, `nomic-embed-text-v1.5`, `bge-m3`, `mxbai-embed-large-v1`.
4. hf-local: `sentence-transformers` importable, selecting `BAAI/bge-base-en-v1.5`.

The selected provider is persisted as:

```text
active_embedder_name
active_embedder_dim
active_embedder_provider
```

If no tier is available, startup fails with a tier-by-tier diagnostic. This is intentional: a missing embedder should be visible before the daemon serves stale or mismatched vectors.

## Runtime Fallback

Provider creation still has bounded runtime fallback for transient failures:

| Failed provider | Next candidates |
|-----------------|-----------------|
| Voyage | OpenAI, Ollama, hf-local |
| OpenAI | Ollama, hf-local |
| Ollama | hf-local |
| hf-local | none |

Runtime fallback is best-effort and may change dimensions. When that happens, logs must warn that existing vector tables may need reindexing.

## Degraded Search

If embeddings cannot be generated, retrieval degrades to cached rows and keyword search. Governance boundaries still apply in every degradation mode: fallback providers, cached embeddings, and keyword-only recovery must preserve caller scope.

| Level | Condition | Search support |
|-------|-----------|----------------|
| Full | Active provider healthy | Vector similarity + keyword + FTS5 |
| Reduced | Runtime fallback provider active | Vector similarity with fallback model + keyword |
| Keyword only | All embedding providers failed | FTS5 full-text search + trigger matching |
| Offline | Cache available, network unavailable | Cached embeddings + keyword |

Search responses should include a degradation warning when semantic search is unavailable.

## Retry Policy

Transient cloud failures retry with bounded exponential backoff before falling through:

| Condition | Action |
|-----------|--------|
| HTTP 429 | Retry with backoff, then fallback |
| HTTP 5xx | Retry with backoff, then fallback |
| Network timeout | Fallback |
| Invalid API key | Skip provider |
| Local provider unavailable | Fallback or fail with a clear startup error |

Permanent authorization failures should not be retried.

## Cache Shape

Profile-keyed caches keep provider/model/dimension separate:

```text
provider      TEXT (voyage/openai/ollama/hf-local)
model         TEXT
dimensions    INTEGER
embedding     BLOB
content_hash  TEXT
```

Never reuse a cache row across provider or dimension boundaries.

## Operator Checks

- `embedder_status` should report the active provider and any running reindex job.
- `vec_metadata.active_embedder_name` should match the provider used for query encoding.
- `vec_<dim>` should contain rows before the active pointer is trusted for vector search.
- `OLLAMA_BASE_URL` should point at the same Ollama daemon used to pull the selected model.

Related architecture reference: [embedder_architecture.md](./embedder_architecture.md).
