---
title: "Spec: 016/011/003-hybrid-search-bm25-fusion — Hybrid Search (BM25 + Semantic Fusion) (research)"
description: "Research phase for §3 structural retrieval improvements. Deep-research informs implementation plan."
trigger_phrases:
  - "016/011/003"
  - "hybrid search (bm25 + semantic fusion) research"
  - "hybrid search (bm25 + semantic fusion) hybrid"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/011-section3-structural-improvements/003-hybrid-search-bm25-fusion"
    last_updated_at: "2026-05-18T00:35:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded research-phase packet"
    next_safe_action: "Run deep-research iters (cli-devin SWE-1.6)"
    blockers: []
    key_files: ["spec.md", "research/research.md (pending after iters)"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000011003"
      session_id: "016-011-003-hybrid-search-bm25-fusion"
      parent_session_id: null
    completion_pct: 5
    open_questions:
      - "Is sqlite-fts5 sufficient for our corpus scale (127K chunks)"
      - "Best fusion algorithm for code retrieval specifically"
      - "Whether to expose hybrid as opt-in or default-on"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Spec: 016/011/003-hybrid-search-bm25-fusion — Hybrid Search (BM25 + Semantic Fusion)

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

**Research question**: Does adding BM25 lexical search + fusion (RRF or weighted-linear) to CocoIndex's semantic retrieval improve hit-rate on the 18-pair fixture? What weights/normalization?

This packet is part of §3 structural improvements identified in the 018/003 follow-up discussion (38.9% baseline hit rate, embedder swap unlikely to be the dominant lever). Research first, then plan, then implement.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In scope
- BM25 implementation options (sqlite-fts5, tantivy, manticore, in-memory)
- Fusion algorithms: Reciprocal Rank Fusion (RRF) vs linear weighted
- Normalization (min-max, z-score, none)
- Mirror mk-spec-memory's stage2-fusion.ts pattern (already proven there)
- BM25 vs semantic weighting (typical 0.3/0.7 vs 0.5/0.5)

### Out of scope
- Removing semantic search entirely (BM25-only) — counter-productive
- Other lexical engines (Elasticsearch etc) — too heavy for embedded use
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

- Is sqlite-fts5 sufficient for our corpus scale (127K chunks)
- Best fusion algorithm for code retrieval specifically
- Whether to expose hybrid as opt-in or default-on
<!-- /ANCHOR:questions -->
