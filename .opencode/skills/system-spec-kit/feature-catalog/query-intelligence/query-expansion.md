---
title: "Query expansion"
description: "Covers the embedding-based query expansion path and distinguishes it from the separate rule-based deep-mode query-variant expansion path."
trigger_phrases:
  - "query expansion"
  - "embedding-based query expansion"
  - "broaden retrieval with related terms"
  - "SPECKIT_EMBEDDING_EXPANSION"
  - "deep-mode synonym variants"
version: 3.6.0.18
---

# Query expansion

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

This entry covers the embedding-based query expansion path, which broadens retrieval for complex queries by mining related terms from the vector index and appending them to the original query. It is separate from the rule-based `query-expander.ts` path used to build deep-mode synonym variants.

Sometimes the words you use in a question do not match the words stored in the system, even though they mean the same thing. This embedding-driven path automatically adds related terms to your search so you find relevant results even when the exact wording differs. Separately, deep-mode query expansion can generate rule-based synonym variants without mining the vector index.

---

## 2. HOW IT WORKS

Embedding-based query expansion broadens retrieval for complex queries by mining similar spec-doc records from the vector index and extracting related terms to append to the original query, producing an enriched combined query string. Stop-words are filtered out and tokens shorter than 3 characters are discarded.

When R15 classifies a query as "simple", the embedding-based expansion path is suppressed because expanding a trigger-phrase lookup would add noise. If embedding expansion produces no additional terms, the original query proceeds unchanged. Separately, `query-expander.ts` provides rule-based synonym variants for deep-mode retrieval; that is a distinct path and should not be conflated with vector-mined expansion. In the 4-stage pipeline, Stage 1 runs the baseline and expanded-query searches in parallel with deduplication (baseline-first). Runs behind the `SPECKIT_EMBEDDING_EXPANSION` flag (default ON).

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp-server/lib/search/embedding-expansion.ts` | Lib | Embedding-based query expansion: mines vector index for related terms, appends to query |
| `mcp-server/lib/search/query-expander.ts` | Lib | Rule-based deep-mode synonym variant expansion (distinct from embedding path) |
| `mcp-server/lib/search/pipeline/stage1-candidate-gen.ts` | Lib | Stage-1 orchestration: parallel baseline+expansion with dedup |
| `mcp-server/lib/search/query-classifier.ts` | Lib | Complexity classification; simple queries suppress embedding expansion |
| `mcp-server/lib/search/search-flags.ts` | Lib | `isEmbeddingExpansionEnabled()` flag accessor (`SPECKIT_EMBEDDING_EXPANSION`) |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp-server/tests/embedding-expansion.vitest.ts` | Automated test | Embedding expansion tests |
| `mcp-server/tests/query-expander.vitest.ts` | Automated test | Rule-based query expansion tests |
| `mcp-server/tests/stage1-expansion.vitest.ts` | Automated test | Stage-1 expansion call and dedup |
| `mcp-server/tests/search-flags.vitest.ts` | Automated test | Feature flag behavior |

---

## 4. SOURCE METADATA
- Group: Query Intelligence
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `query-intelligence/query-expansion.md`
Related references:
- [dynamic-token-budget-allocation.md](../../feature-catalog/query-intelligence/dynamic-token-budget-allocation.md) — Dynamic token budget allocation
- [llm-query-reformulation.md](../../feature-catalog/query-intelligence/llm-query-reformulation.md) — LLM query reformulation
