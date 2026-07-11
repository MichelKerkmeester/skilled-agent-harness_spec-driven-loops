---
title: "Query decomposition"
description: "Query decomposition splits multi-faceted questions into up to 3 sub-queries using rule-based heuristics, enabling facet-aware retrieval in deep mode without LLM calls, gated by the SPECKIT_QUERY_DECOMPOSITION flag."
trigger_phrases:
  - "query decomposition"
  - "SPECKIT_QUERY_DECOMPOSITION"
  - "split multi-faceted query"
  - "facet-aware sub-query retrieval"
  - "conjunction-based query splitting"
version: 3.6.0.8
---

# Query decomposition

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Query decomposition splits multi-faceted questions into up to 3 sub-queries using rule-based heuristics, enabling facet-aware retrieval in deep mode without LLM calls, gated by the `SPECKIT_QUERY_DECOMPOSITION` flag.

When you ask a complex question that covers multiple topics at once (for example "What is the spec-doc record save workflow and how does query expansion work?"), the system may fail to find good results because it tries to match everything at once. This feature detects coordinating conjunctions ("and", "or", "also") and multiple wh-question words to split such queries into focused sub-queries. Each sub-query retrieves independently, and results are merged by facet coverage. This only activates in deep mode, where the extra retrieval cost is acceptable.

---

## 2. HOW IT WORKS

Enabled by default (graduated). Set `SPECKIT_QUERY_DECOMPOSITION=false` to disable.

The `isQueryDecompositionEnabled()` function in `search-flags.ts` checks the flag. The `query-decomposer.ts` module performs bounded facet detection:
- Splits on coordinating conjunctions (`and`, `or`, `also`, `plus`, `as well as`, `along with`).
- Detects multiple wh-question words (`what`, `where`, `when`, `why`, `how`, `who`, `which`).
- Caps at `MAX_FACETS = 3` sub-queries to bound latency.
- No LLM calls — purely rule-based heuristics.
- Graceful fallback: if the Stage 1 decomposition branch errors, execution falls through to the standard deep expansion path rather than returning only the original query; if no expansion variants are produced, the original query remains as the fallback.
- Only active in deep mode (checked by caller in stage1-candidate-gen).

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/query-decomposer.ts` | Lib | Bounded facet detection, conjunction splitting, sub-query generation |
| `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` | Lib | Stage-1 orchestration, deep-mode gate for decomposition |
| `mcp_server/lib/search/search-flags.ts` | Lib | `isQueryDecompositionEnabled()` flag accessor |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/query-decomposer.vitest.ts` | Automated test | Decomposition logic and edge cases |
| `mcp_server/tests/query-decomposition.vitest.ts` | Automated test | Integration-level decomposition tests |

---

## 4. SOURCE METADATA
- Group: Query Intelligence
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `query-intelligence/query-decomposition.md`
Related references:
- [index-time-query-surrogates.md](index-time-query-surrogates.md) — Index-time query surrogates
- [graph-concept-routing.md](graph-concept-routing.md) — Graph concept routing
