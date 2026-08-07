---
title: "Code Index Stack Phase 016: Query Expansion and Identifier Bridging"
description: "Deterministic query expansion shipped for CocoIndex hybrid search. The new module splits compound identifiers, generates common identifier spellings, applies bounded code-domain synonyms and returns an ExpandedQuery payload consumed by dense and FTS5 retrieval. Expansion defaults to off after bench showed regression. Available as opt-in research artifact."
trigger_phrases:
  - "016 query expansion identifier bridging"
  - "CocoIndex identifier bridging"
  - "COCOINDEX_QUERY_EXPANSION"
  - "camelCase snake_case query expansion"
  - "query expansion FTS5 dense fanout"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-19

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/016-query-expansion-identifier-bridging` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack`

### Summary

Hybrid search in the CocoIndex stack lost recall on natural-language queries against identifier-heavy corpora. Probes like "filesystem walker", "memory save" and "rerank adapter" failed to match `findFiles`, `memory_save` and `RerankerAdapter` because neither dense embeddings nor FTS5 bridged the naming-convention gap at retrieval time.

A deterministic query expansion module was built and integrated. The module splits compound identifiers across camelCase, PascalCase, snake_case, kebab-case and SCREAMING_SNAKE conventions, generates common identifier-style variants, applies a bounded code-domain synonym dictionary (~20 high-leverage pairs) and returns an `ExpandedQuery` payload. Dense retrieval fans out expanded variants, OR-merges vector candidates by `(file_path, chunk_id)` and keeps the best-of-variant distance. FTS5 receives an explicit quoted OR clause so identifier bridging does not sacrifice ordinary token recall. Long prose queries with more than four content words bypass expansion to avoid recall noise.

Bench results showed deterministic expansion regressed all three tested lanes versus the post-015 baseline, with test and doc files displacing implementation files in top-K. The feature shipped complete with `COCOINDEX_QUERY_EXPANSION=false` as the default, making it available as an opt-in research artifact pending follow-on tuning in packet 017.

### Added

- `query_expansion.py` with `ExpandedQuery` dataclass, `split_compound_identifier()`, `generate_identifier_variants()`, `apply_synonyms()` and `expand_query()` pure functions
- FTS5 clause builder inside `query_expansion.py` producing correctly quoted SQLite OR syntax
- `tests/test_query_expansion.py` covering splitter, variant generation, synonym expansion, FTS clause output, no-op paths and long-query bypass
- `COCOINDEX_QUERY_EXPANSION`, `COCOINDEX_QUERY_EXPANSION_MAX_VARIANTS`, `COCOINDEX_QUERY_EXPANSION_SYNONYMS` and `COCOINDEX_QUERY_EXPANSION_DENSE_FANOUT` env vars in `config.py`
- ADR-019 appended to `004-spec-memory-embedder-bake-off/decision-record.md` covering the NL-to-identifier gap, env-var contract, rollback path and synonym selection rationale
- Bench evidence files in `evidence/` for post-016 comparison and 015-vs-016 delta

### Changed

- `query.py` integration: `expand_query()` called once per user query before dense and FTS5 dispatch, with dense fanout, vector merge and JSONL trace
- `fts_index.py` updated to accept an optional prebuilt FTS5 `MATCH` clause
- `config.py` extended with query expansion env contract and string-list dict parser
- `cocoindex_code/README.md` updated with a Query Expansion section documenting env vars and behavior
- `tests/test_config.py` extended with query expansion env parsing tests
- `tests/test_fts_index.py` extended with expanded FTS clause and hybrid fanout integration tests

### Fixed

- None. Additive feature with no prior defect being corrected.

### Verification

| Check | Status | Evidence |
|-------|--------|----------|
| Targeted pytest | Pass | 50 passed across query expansion, config and FTS integration tests |
| Ruff on changed Python files | Pass | All checks passed |
| Full MCP server pytest | Pass | 138 passed from `mcp_server` |
| Phase 2 corrected bench | Fail | baseline-bge held 12/18. bge-path-class 13/18 to 12/18. jina-v3 14/18 to 12/18 |
| Strict packet validation | Pass | RESULT: PASSED |
| Sequential-thinking MCP | Attempted, canceled | Five required calls returned `user cancelled MCP tool call` |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query_expansion.py` (NEW) | Created | Pure expansion helpers, default synonyms and `ExpandedQuery` dataclass |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py` | Modified | Query expansion env contract and string-list dict synonym parser |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py` | Modified | Expand once per query, dense fanout, vector merge, JSONL trace |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/fts_index.py` | Modified | Accept optional prebuilt FTS5 `MATCH` clause |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_query_expansion.py` (NEW) | Created | Pure function tests for splitter, variants, synonyms, FTS clause, no-op paths |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_config.py` | Modified | Query expansion env parsing tests |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_fts_index.py` | Modified | Expanded FTS clause and hybrid fanout integration tests |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/README.md` | Modified | Query expansion behavior and env var documentation |
| `004-spec-memory-embedder-bake-off/decision-record.md` | Modified | ADR-019 appended |

### Follow-Ups

- Revisit expansion defaults after packet 017 RRF recalibration produces a stable fusion baseline to evaluate against.
- Investigate whether per-variant dense embedding can be batched to reduce latency when `DENSE_FANOUT=true` and variant count approaches the `MAX_VARIANTS` cap.
- Confirm bench gate passes at the required hit-rate floor before promoting `COCOINDEX_QUERY_EXPANSION` to default-on.
