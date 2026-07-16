---
title: "Summary: 016 Query Expansion Identifier Bridging"
description: "Implementation summary for deterministic CocoIndex query expansion, env config, hybrid dense fanout, FTS5 expanded clauses, tests, docs, ADR, and bench evidence."
trigger_phrases:
  - "016 query expansion summary"
  - "identifier bridging summary"
  - "COCOINDEX_QUERY_EXPANSION"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/016-query-expansion-identifier-bridging"
    last_updated_at: "2026-05-19T16:20:00Z"
    last_updated_by: "codex"
    recent_action: "Bench gate failed"
    next_safe_action: "Decide whether to tune 017 fusion/rerank next or revise 016 defaults before commit"
    blockers:
      - "Bench gate failed: bge-path-class 13/18 -> 12/18; jina-v3 14/18 -> 12/18"
    key_files:
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query_expansion.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/tests/test_query_expansion.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000004016"
      session_id: "016-004-016-summary"
      parent_session_id: "016-004-016"
    completion_pct: 85
---
# Summary: 016 Query Expansion Identifier Bridging

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| Spec Folder | `016-query-expansion-identifier-bridging` |
| Status | Implemented but bench gate failed |
| Level | 2 |
| SpawnAgent | Not used |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Implemented deterministic query expansion for CocoIndex hybrid search. The new module splits compound identifiers, generates common identifier spellings, applies bounded code-domain synonyms, and returns an `ExpandedQuery` payload consumed by dense and FTS5 retrieval.

Dense retrieval now fans out expanded variants by default, OR-merges vector candidates by `(file_path, chunk_id)`, and keeps the best distance for fusion. FTS5 receives an explicit quoted `OR` clause with original atomic words plus expanded terms, so identifier bridging does not sacrifice ordinary token recall.

After bench inspection, expansion was made conservative for long prose queries: if a query has more than four content words, it stays on the pre-016 path. Short identifier-like phrases such as `memory save`, `rerank adapter`, and `filesystem walker` still expand.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query_expansion.py` | Created | Pure expansion helpers, default synonyms, and `ExpandedQuery` dataclass |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py` | Modified | Add query expansion env contract and synonym parser |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py` | Modified | Expand once per query, dense fanout, vector merge, JSONL trace |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/fts_index.py` | Modified | Accept optional prebuilt FTS5 `MATCH` clause |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_query_expansion.py` | Created | Pure function tests for splitter, variants, synonyms, FTS clause, no-op paths |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_config.py` | Modified | Query expansion env parsing tests |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_fts_index.py` | Modified | Expanded FTS clause and hybrid fanout integration tests |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/README.md` | Modified | Query expansion behavior and env var docs |
| `004-spec-memory-embedder-bake-off/decision-record.md` | Modified | Append ADR-019 |
| `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` | Created | Level 2 packet docs |

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implementation stayed local to the requested CocoIndex query path plus the FTS5 helper needed to preserve expanded `MATCH` syntax. No SpawnAgent and no git commit were used. The daemon bench required `COCOINDEX_CODE_DIR=/private/tmp/c16` because the default home daemon directory is outside the writable sandbox and the packet-local scratch path exceeded the macOS AF_UNIX socket length.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Keep expansion deterministic and LLM-free | Avoids a runtime model dependency and preserves repeatable bench deltas |
| Put defaults in `query_expansion.py` | Keeps the pure module and config parser using the same dictionary |
| Include original atomic words in FTS5 clause | Prevents phrase expansion from weakening ordinary token recall |
| Merge dense fanout by `(file_path, chunk_id)` | Matches the spec contract and keeps best-of-variant vector distance |
| Log expansion to the rerank JSONL path | Reuses existing bench trace plumbing without changing result schema |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Status | Evidence |
|-------|--------|----------|
| Sequential-thinking MCP | Attempted, tool canceled | Five required calls returned `user cancelled MCP tool call` |
| Targeted pytest | Pass | `50 passed` for query expansion, config, and FTS integration tests |
| Ruff changed Python files | Pass | `All checks passed!` |
| Full MCP server pytest | Pass | `138 passed` from `.opencode/skills/mcp-coco-index/mcp_server` |
| Phase 2 corrected bench | Fail | baseline-bge held 12/18; bge-path-class 13/18 -> 12/18; jina-v3 14/18 -> 12/18 |
| Strict validation | Pass | `RESULT: PASSED` |

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| NFR ID | Target | Actual | Status |
|--------|--------|--------|--------|
| NFR-P01 | Per-query embed count <= max variants | Config default caps at 6 | Pass |
| NFR-P02 | p95 within 25% of post-015 baseline | p95 improved in retained bench | Pass |
| NFR-P03 | Expansion logic cheap pure string ops | No I/O or logging in module | Pass |
| NFR-R01 | `COCOINDEX_QUERY_EXPANSION=false` rollback | No-op payload and raw FTS path | Pass |
| NFR-R02 | Malformed synonyms fallback | Tested warning + default fallback | Pass |
| NFR-C01 | Embedder-agnostic | Query string transform before encoder | Pass |
| NFR-C02 | Reranker-agnostic | Reranker sees normal candidates | Pass |
| NFR-C03 | FTS5 syntax compliant | SQLite FTS5 clause test passes | Pass |

<!-- /ANCHOR:nfr-verify -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. Sequential-thinking MCP did not execute successfully; all five required calls returned cancellation. The attempts are recorded instead of claimed as successful.
2. Dense fanout currently awaits the existing single-query embedder interface sequentially. That preserves compatibility; batching can be a later optimization if latency needs it.
3. Bench evidence is finalized but not passing the hit-rate gate. This packet should not be committed as complete without either follow-up tuning or an explicit decision to carry the regression into 017.

<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Only listed code files | Added `fts_index.py` optional `match_clause` parameter | Required to pass expanded FTS5 syntax without double-normalizing away `OR` and quotes |
| Use existing `_parse_json_dict_env` | Added type-specific string-list dict parser | Existing helper is float-specific for path-class factors and should not be weakened |
| Expand all queries | Long prose queries now no-op | Bench showed sentence-sized identifier variants add recall noise and do not satisfy the production gate |

<!-- /ANCHOR:deviations -->
