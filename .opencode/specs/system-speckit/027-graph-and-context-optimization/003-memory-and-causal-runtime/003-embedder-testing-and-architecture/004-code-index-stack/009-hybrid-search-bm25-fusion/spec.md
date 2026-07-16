---
title: "Spec: 016/011/003-hybrid-search-bm25-fusion — Hybrid Search (BM25 + Semantic Fusion)"
description: "Implemented default-on SQLite FTS5 + RRF fusion for CocoIndex retrieval."
trigger_phrases:
  - "016/011/003"
  - "hybrid search (bm25 + semantic fusion) research"
  - "hybrid search (bm25 + semantic fusion) hybrid"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/009-hybrid-search-bm25-fusion"
    last_updated_at: "2026-05-18T00:35:00Z"
    last_updated_by: "main_agent"
    recent_action: "Implemented default-on SQLite FTS5 + RRF hybrid search"
    next_safe_action: "Run fixture and latency validation before default-on promotion"
    blockers: ["fixture benchmark pending", "latency benchmark pending"]
    key_files: ["spec.md", "research/research.md", "cocoindex_code/query.py", "cocoindex_code/fts_index.py", "cocoindex_code/fusion.py"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000011003"
      session_id: "016-011-003-hybrid-search-bm25-fusion"
      parent_session_id: null
    completion_pct: 80
    open_questions:
      - "Is sqlite-fts5 sufficient for our corpus scale (127K chunks)"
      - "Best fusion algorithm for code retrieval specifically"
      - "Whether to expose hybrid as default-on or default-on"
    answered_questions:
      - "SQLite FTS5 selected as embedded lexical engine"
      - "RRF selected as fusion algorithm"
      - "Hybrid remains default-on until fixture validation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Spec: 016/011/003-hybrid-search-bm25-fusion — Hybrid Search (BM25 + Semantic Fusion)

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | Implemented; fixture benchmark pending |
| Level | 1 |
| Owner | cli-codex |
| Parent | `../spec.md` (016/011 umbrella) |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

**Research question**: Does adding BM25 lexical search + fusion (RRF or weighted-linear) to CocoIndex's semantic retrieval improve hit-rate on the 18-pair fixture? What weights/normalization?

This packet is part of §3 structural improvements identified in the 018/003 follow-up discussion (38.9% baseline hit rate, embedder swap unlikely to be the dominant lever). Research converged on SQLite FTS5 + weighted RRF; implementation is now default-on behind `COCOINDEX_HYBRID=true`.
Dispatch A correction: source config now has `COCOINDEX_HYBRID=true` by default (`config/config.py`), so any older opt-in/default-off language in this packet is superseded.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In scope
- BM25 implementation options (sqlite-fts5, tantivy, manticore, in-memory)
- Fusion algorithms: Reciprocal Rank Fusion (RRF) vs linear weighted
- Normalization (min-max, z-score, none)
- Mirror mk-spec-memory's stage2-fusion.ts pattern (already proven there)
- BM25 vs semantic weighting (typical 0.3/0.7 vs 0.5/0.5)
- CocoIndex implementation: FTS5 table, indexing sync, RRF fusion, config flags, result transparency, and tests

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
| R6 | Preserve vector-only behavior unless `COCOINDEX_HYBRID=true` |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Deep-research convergence (no new findings in last 1-2 iters)
- `research/research.md` complete with synthesis + cited evidence
- Clear go/no-go signal for implementation
- Strict-validate PASSED
- `mcp-coco-index` test suite PASSED
- Fixture benchmark remains pending before default-on promotion
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

- Answered: SQLite FTS5 is sufficient for default-on implementation and avoids new dependencies.
- Answered: weighted Reciprocal Rank Fusion is the selected fusion algorithm.
- Answered: hybrid is exposed as env default-on and remains default-off until fixture validation.
<!-- /ANCHOR:questions -->
