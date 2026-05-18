---
title: "Spec: 016/011/001-reranker-integration — Reranker Integration"
description: "Opt-in GTE cross-encoder reranker integration for CocoIndex hybrid retrieval."
trigger_phrases:
  - "016/011/001"
  - "reranker integration research"
  - "reranker integration reranker"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/007-reranker-integration"
    last_updated_at: "2026-05-18T00:35:00Z"
    last_updated_by: "main_agent"
    recent_action: "Implemented opt-in GTE cross-encoder reranker after hybrid RRF fusion."
    next_safe_action: "Run the 18-pair quality and p95 latency gate before default-on promotion."
    blockers: []
    key_files:
      - "research/research.md"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/reranker.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000011001"
      session_id: "016-011-001-reranker-integration"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Whether fixture and latency gates justify default-on promotion"
    answered_questions:
      - "K=20 selected for first production integration"
      - "Alibaba-NLP/gte-multilingual-reranker-base selected as the Apache-2.0 first-pick model"
      - "Reranker ships opt-in behind COCOINDEX_RERANK"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Spec: 016/011/001-reranker-integration — Reranker Integration

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | Implemented (created 2026-05-18) |
| Level | 1 |
| Owner | Main agent |
| Parent | `../spec.md` (016/011 umbrella) |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

**Implementation question**: Which cross-encoder reranker should run after CocoIndex hybrid RRF fusion, and how should it preserve score auditability while staying safe by default?

This packet is part of §3 structural improvements identified in the 018/003 follow-up discussion. Research converged on `Alibaba-NLP/gte-multilingual-reranker-base`, K=20, opt-in rollout, score replacement, and default-on only after fixture and latency gates.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In scope
- Cross-encoder model selection
- Integration point: after hybrid RRF fusion plus heuristic boosts, before final result slicing
- Latency budget (target: rerank adds <500ms to total p95)
- Sentence-transformers vs Ollama backend tradeoffs
- Top-K size to rerank

### Out of scope
- Custom reranker training (use pre-trained only)
- LLM-as-reranker (separate scope)
- Default-on promotion before fixture and latency gates pass
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| # | Requirement |
|---|---|
| R1 | Deep-research run completes and converges on a concrete reranker |
| R2 | `research/research.md` synthesis records the model, K, rollout, and integration decisions |
| R3 | Implementation preserves RRF/heuristic score auditability while replacing final score with reranker score |
| R4 | Reranker defaults off behind `COCOINDEX_RERANK=true` |
| R5 | Unit tests cover import safety, fallback, score replacement, and query integration |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Deep-research convergence recorded in `research/research.md`
- Opt-in implementation integrated in CocoIndex query path
- Existing CocoIndex pytest suite passes
- Strict-validate passes
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

Risks:
- Cross-encoder model loading can be slow or unavailable; lazy loading and graceful unchanged-order fallback reduce blast radius.
- Default-on rollout could regress latency; fixture and p95 gates remain required before promotion.

Dependencies:
- 018/003 fixture (`002-baseline-fixture/evidence/code-retrieval-fixture.json`) — quality measurement substrate
- `sentence-transformers` local optional dependency for actual model loading
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Default-on promotion depends on the 18-pair fixture showing at least +2 top-3 hits and p95 added latency under 500ms.
<!-- /ANCHOR:questions -->
