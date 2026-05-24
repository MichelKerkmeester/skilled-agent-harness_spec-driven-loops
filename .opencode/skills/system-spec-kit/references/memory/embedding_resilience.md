---
title: Embedding Resilience
description: Provider fallback, bootstrap probes, graceful degradation, and offline mode for reliable semantic search
---

# Embedding Resilience

Spec-memory prefers a working semantic provider over a perfect one. Bootstrap auto-selection chooses the active embedder once, persists it in `vec_metadata`, and later search/save calls use that pointer to avoid model drift.

---

## 1. OVERVIEW

### Purpose

Define provider fallback, bootstrap probes, degraded search behavior, retry policy, cache boundaries, and operator checks for resilient semantic search.

### When to Use

Load this reference when startup cannot select an embedder, semantic search degrades, cloud providers fail, or cache rows may cross provider/model/dimension boundaries.

### Core Principle

Prefer a visible degraded mode over silent vector drift. Missing or mismatched embedders must fail clearly before they corrupt retrieval quality.

---

## 2. BOOTSTRAP PROBE SEQUENCE

When `vec_metadata` has no active pointer, daemon startup probes providers in this **local-first** order (ADR-014, 2026-05-19):

1. Ollama: reachable `/api/tags`, choosing the first pulled model in ADR-013 order: `nomic-embed-text-v1.5`, `jina-embeddings-v3`, `bge-m3`, `mxbai-embed-large-v1`.
2. hf-local: `sentence-transformers` importable, selecting `nomic-ai/nomic-embed-text-v1.5` (same family as the Ollama default, ADR-014).
3. OpenAI API: `OPENAI_API_KEY` plus a successful `text-embedding-3-small` embeddings request.
4. Voyage API: `VOYAGE_API_KEY` plus a successful `voyage-code-3` embeddings request.

The selected provider is persisted as:

```text
active_embedder_name
active_embedder_dim
active_embedder_provider
```

If no tier is available, startup fails with a tier-by-tier diagnostic. This is intentional: a missing embedder should be visible before the daemon serves stale or mismatched vectors.

## 3. RUNTIME FALLBACK

Provider creation still has bounded runtime fallback for transient failures:

| Failed provider | Next candidates (in ADR-014 cascade order) |
|-----------------|-----------------|
| Ollama | hf-local, OpenAI, Voyage |
| hf-local | OpenAI, Voyage |
| OpenAI | Voyage |
| Voyage | none |

Runtime fallback is best-effort and may change dimensions. When that happens, logs must warn that existing vector tables may need reindexing.

## 4. DEGRADED SEARCH

If embeddings cannot be generated, retrieval degrades to cached rows and keyword search. Governance boundaries still apply in every degradation mode: fallback providers, cached embeddings, and keyword-only recovery must preserve caller scope.

| Level | Condition | Search support |
|-------|-----------|----------------|
| Full | Active provider healthy | Vector similarity + keyword + FTS5 |
| Reduced | Runtime fallback provider active | Vector similarity with fallback model + keyword |
| Keyword only | All embedding providers failed | FTS5 full-text search + trigger matching |
| Offline | Cache available, network unavailable | Cached embeddings + keyword |

Search responses should include a degradation warning when semantic search is unavailable.

## 5. RETRY POLICY

Transient cloud failures retry with bounded exponential backoff before falling through:

| Condition | Action |
|-----------|--------|
| HTTP 429 | Retry with backoff, then fallback |
| HTTP 5xx | Retry with backoff, then fallback |
| Network timeout | Fallback |
| Invalid API key | Skip provider |
| Local provider unavailable | Fallback or fail with a clear startup error |

Permanent authorization failures should not be retried.

## 6. CACHE SHAPE

Profile-keyed caches keep provider/model/dimension separate:

```text
provider      TEXT (voyage/openai/ollama/hf-local)
model         TEXT
dimensions    INTEGER
embedding     BLOB
content_hash  TEXT
```

Never reuse a cache row across provider or dimension boundaries.

## 7. OPERATOR CHECKS

- `embedder_status` should report the active provider and any running reindex job.
- `vec_metadata.active_embedder_name` should match the provider used for query encoding.
- `vec_<dim>` should contain rows before the active pointer is trusted for vector search.
- `OLLAMA_BASE_URL` should point at the same Ollama daemon used to pull the selected model.

Related architecture reference: [embedder_architecture.md](./embedder_architecture.md).
