---
title: "Plan: 016/011/001-reranker-integration Reranker Integration"
description: "Phases and verification for opt-in GTE reranker integration."
trigger_phrases:
  - "016/011/001 plan"
  - "reranker integration plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-cocoindex-stack/007-reranker-integration"
    last_updated_at: "2026-05-18T00:35:00Z"
    last_updated_by: "main_agent"
    recent_action: "Implemented opt-in GTE reranker integration in CocoIndex query path."
    next_safe_action: "Run fixture quality and latency gates before default-on promotion."
    blockers: []
    key_files:
      - "research/research.md"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/reranker.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/tests/test_reranker.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000011001"
      session_id: "016-011-001-reranker-integration-plan"
      parent_session_id: "016-011-001-reranker-integration"
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Plan: 016/011/001-reranker-integration Reranker Integration

<!-- ANCHOR:summary -->
## 1. SUMMARY

Research converged on an opt-in `Alibaba-NLP/gte-multilingual-reranker-base` cross-encoder reranker. The implementation places it after hybrid RRF fusion plus heuristic boosts and before final result slicing.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Criteria |
|---|---|
| Research convergence | 4 iters complete, recommendation clear |
| Implementation | opt-in integration with audit fields and graceful fallback |
| Unit regression | CocoIndex MCP server pytest suite passes |
| Promotion gate | total p95 increase ≤ 500ms and at least +2 top-3 fixture hits before default-on |
| Strict-validate | PASSED |
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

`query_codebase()` now builds unsliced deduped candidates after hybrid RRF fusion. When `COCOINDEX_RERANK=true`, it reranks the first `COCOINDEX_RERANK_TOP_K` candidates with a lazy `sentence-transformers` CrossEncoder adapter, replaces final `score` with the cross-encoder score, and preserves `pre_rerank_score`, `reranker_score`, `rrf_score`, and `fts5_score` for auditability.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Research and setup
- T001 Read prior research findings
- T002 Confirm scope from research recommendations

### Phase 2: Implementation
- T003 Add reranker adapter, config, and audit fields
- T004 Integrate after hybrid RRF fusion
- T005 Add focused tests

### Phase 3: Verification
- T006 Run CocoIndex MCP server pytest suite
- T007 Document fixture and latency gate for default-on promotion
- T008 Strict-validate + commit
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Regression: existing CocoIndex test suite passes
- Unit tests: import safety, empty input, model-load fallback, score replacement, rerank-off compatibility, rerank-on ordering
- Promotion gate: 18-pair fixture plus representative p95 latency sweep before enabling by default
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Deep-research convergence in this packet's `research/research.md`
- Optional `sentence-transformers` local model stack for actual reranker execution
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

| Trigger | Action |
|---|---|
| Hit rate regresses | Keep opt-in disabled by default; investigate; re-research |
| Latency budget exceeded | Keep opt-in disabled by default |
| CocoIndex test suite breaks | Revert; isolate breakage; iterate |
<!-- /ANCHOR:rollback -->
