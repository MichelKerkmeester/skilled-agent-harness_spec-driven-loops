---
title: "01. Semantic KNN query"
description: "Embeds the query and runs nearest-neighbor search against the vector table."
---

# 01. Semantic KNN query

Embeds the query and runs nearest-neighbor search against the vector table. Semantic search converts the user query into an embedding and compares it against indexed chunk embeddings.

> **Pipeline note**: this is the Stage 1 bi-encoder lane. `sbert/nomic-ai/CodeRankEmbed` (768d, MIT) embeds the query and chunks independently, then vec0 compares those vectors with cosine similarity. Cross-encoder reranking is a later Stage 2 pass over the top-K results, not part of KNN retrieval.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Semantic search converts the user query into a bi-encoder embedding and compares it against indexed chunk embeddings.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

Without path filters, the query path uses SQLite vec0 KNN over Stage 1 embeddings. With no language filter or one language, it can use a direct KNN query; with multiple languages, it merges KNN rows across partitions.
<!-- /ANCHOR:current-reality -->

---

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:89` | Query | Runs vec0 KNN queries. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:253` | Query | Embeds the search query and selects the query strategy. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:292` | Query | Merges rows for multi-language KNN searches. |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.opencode/skills/mcp-coco-index/tests/test_daemon.py:195` | Integration | Covers search after indexing. |
| `.opencode/skills/mcp-coco-index/tests/test_e2e_daemon.py:95` | End-to-end | Covers client indexing then search. |

<!-- /ANCHOR:source-files -->

---

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Search and ranking
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `05--search-and-ranking/01-semantic-knn-query.md`

<!-- /ANCHOR:source-metadata -->
