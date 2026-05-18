---
title: "Spec: 016/011/001-reranker-integration — Reranker Integration (research)"
description: "Research phase for §3 structural retrieval improvements. Deep-research informs implementation plan."
trigger_phrases:
  - "016/011/001"
  - "reranker integration research"
  - "reranker integration reranker"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/011-cocoindex-retrieval-improvements/001-reranker-integration"
    last_updated_at: "2026-05-18T00:35:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded research-phase packet"
    next_safe_action: "Run deep-research iters (cli-devin SWE-1.6)"
    blockers: []
    key_files: ["spec.md", "research/research.md (pending after iters)"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000011001"
      session_id: "016-011-001-reranker-integration"
      parent_session_id: null
    completion_pct: 5
    open_questions:
      - "Optimal K for rerank (lift vs latency curve)"
      - "Best reranker for code (vs general-text reranker)"
      - "Whether to expose rerank as opt-in vs default-on"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Spec: 016/011/001-reranker-integration — Reranker Integration

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | Research phase (created 2026-05-18) |
| Level | 1 |
| Owner | Main agent |
| Parent | `../spec.md` (016/011 umbrella) |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

**Research question**: Which cross-encoder reranker maximizes top-3 hit-rate lift on the 18-pair fixture with acceptable latency, and where in the CocoIndex pipeline should it integrate?

This packet is part of §3 structural improvements identified in the 018/003 follow-up discussion (38.9% baseline hit rate, embedder swap unlikely to be the dominant lever). Research first, then plan, then implement.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In scope
- Cross-encoder model selection (jina-reranker-v2, mxbai-rerank-large-v2, bge-reranker-v2-m3, gte-multilingual-reranker)
- Integration point: after embedder top-K retrieval, before result return
- Latency budget (target: rerank adds <500ms to total p95)
- Sentence-transformers vs Ollama backend tradeoffs
- Top-K size to rerank (K=10? K=20? K=50?)

### Out of scope
- Custom reranker training (use pre-trained only)
- LLM-as-reranker (separate scope)
- Implementation — that comes after research convergence
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| # | Requirement |
|---|---|
| R1 | Deep-research run completes (3-4 iters from the cross-cutting 10-iter umbrella allocation) |
| R2 | `research/research.md` synthesis cites concrete evidence (URLs, file:line, benchmarks) |
| R3 | Recommended approach with estimated hit-rate lift on 18-pair fixture |
| R4 | RAM/latency cost estimate for the recommendation |
| R5 | Post-research: scaffold plan.md + tasks.md if recommendation goes into implementation |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Deep-research convergence (no new findings in last 1-2 iters)
- `research/research.md` complete with synthesis + cited evidence
- Clear go/no-go signal for implementation
- Strict-validate PASSED
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

Risks:
- Research scope creep — bounded by 3-4 iters per packet
- Recommendations may require architecture change in CocoIndex — flag in research

Dependencies:
- 006/004 extended bake-off (runs in parallel) — informs whether embedder is dominant lever
- 018/003 fixture (`002-baseline-fixture/evidence/code-retrieval-fixture.json`) — quality measurement substrate
- cli-devin SWE-1.6 + `agent-config-deep-research-iter.json` recipe
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Optimal K for rerank (lift vs latency curve)
- Best reranker for code (vs general-text reranker)
- Whether to expose rerank as opt-in vs default-on
<!-- /ANCHOR:questions -->
