---
title: "Spec: 016/011 Section-3 Structural Retrieval Improvements (phase parent)"
description: "Umbrella for §3 of post-018/003 follow-up — structural improvements that affect ALL embedders (reranker, chunking, hybrid search). Research-first packet; implementation phases populated after deep-research convergence."
trigger_phrases:
  - "016/011 structural improvements"
  - "retrieval improvements umbrella"
  - "section 3 structural changes"
  - "reranker chunking hybrid"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/011-cocoindex-retrieval-improvements"
    last_updated_at: "2026-05-18T00:30:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded phase-parent umbrella for §3 improvements"
    next_safe_action: "Dispatch 10-iter cli-devin SWE-1.6 deep-research across 3 child phases"
    blockers: []
    key_files: ["spec.md", "001-reranker-integration/spec.md", "002-chunking-strategy-tuning/spec.md", "003-hybrid-search-bm25-fusion/spec.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000011000"
      session_id: "016-011-cocoindex-retrieval-improvements"
      parent_session_id: null
    completion_pct: 5
    open_questions:
      - "Which reranker (cross-encoder) gives best lift on this repo?"
      - "What's the optimal chunking strategy for our code mix (TS-heavy + MD + Python)?"
      - "Does hybrid BM25+semantic outperform either alone on our 18-pair fixture?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Spec: 016/011 Section-3 Structural Retrieval Improvements (phase parent)

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | Research phase (created 2026-05-18 from post-018/003 follow-up) |
| Level | 1 (phase parent — heavy docs live in children) |
| Owner | Main agent |
| Mode | Phase parent — `is_phase_parent()` rule applies; only spec.md + description.json + graph-metadata.json required here |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

018/003 benchmark concluded with **38.9% hit rate** (jina-code = gemma both = 7/18 on the 18-pair fixture). Embedder choice may not be the dominant lever — structural changes to the retrieval pipeline likely give larger lifts:
- Reranker (cross-encoder on top of embedder) — typical +10-20 pp
- Chunking strategy (function-level vs line-level vs file-level)
- Hybrid search (semantic + BM25)
- Possibly the fixture itself (analyzed separately, not in this umbrella)

This packet is the RESEARCH umbrella. Each child runs as a deep-research target; implementation phases get populated after convergence.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope (3 research phases):
- `001-reranker-integration/` — which cross-encoder, where to integrate, latency budget, expected lift
- `002-chunking-strategy-tuning/` — chunk size, semantic vs syntactic chunking, code-aware splitters
- `003-hybrid-search-bm25-fusion/` — BM25 weighting, RRF vs linear fusion, normalization

Out of scope:
- Embedder model selection (covered by 006/004 extended-bake-off — runs in parallel)
- Fixture review / inspection of the 11 misses (separate analysis task)
- mk-spec-memory retrieval changes (CocoIndex-focused; mk-spec-memory already has hybrid+rerank)
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| # | Requirement |
|---|---|
| R1 | Each child phase completes a 10/3-iter cli-devin SWE-1.6 deep-research |
| R2 | Each child phase produces a `research/research.md` with synthesis + cited evidence |
| R3 | Each child phase converges to a recommended approach + estimated lift on the 18-pair fixture |
| R4 | After research convergence, each child phase scaffolds plan.md + tasks.md for implementation |
| R5 | The umbrella ships as Phase Parent (lean trio + child-status table) |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- 3 deep-research runs complete with PASS verdicts
- Each child has a research-informed implementation plan
- Strict-validate PASSED for parent + each child
- Combined research informs an integrated retrieval-quality roadmap
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

Risks:
- **Research divergence**: 10 iters may not converge if scope is too broad. Mitigated by per-phase narrow scoping.
- **CocoIndex coupling**: Some changes may require CocoIndex daemon refactor — flag in research, scope to follow-on packets if needed.
- **Mac RAM constraints**: Cross-encoder rerankers add ~500MB-2GB depending on model. Tier in research.

Dependencies:
- 006/004 (extended bake-off) — runs in parallel; informs whether embedder-swap is enough vs structural changes needed
- 018/003 fixture — same 18-pair fixture used as quality measurement substrate
- cli-devin SWE-1.6 + `agent-config-deep-research-iter.json` recipe
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should research be done across all 3 phases in parallel (4-3-3 iter split) or sequentially (10 iters per phase = 30 total)?
- Should the post-research plan-phase be unified across all 3 children, or kept per-phase?
- Is there a 4th structural change worth scoping (query expansion, HyDE)?
<!-- /ANCHOR:questions -->
