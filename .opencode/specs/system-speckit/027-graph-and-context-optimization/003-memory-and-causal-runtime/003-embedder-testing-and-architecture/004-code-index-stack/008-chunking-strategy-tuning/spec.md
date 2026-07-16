---
title: "Spec: 016/011/002-chunking-strategy-tuning — Chunking Strategy Tuning (research)"
description: "Research phase for §3 structural retrieval improvements. Deep-research informs implementation plan."
trigger_phrases:
  - "016/011/002"
  - "chunking strategy tuning research"
  - "chunking strategy tuning chunking"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/008-chunking-strategy-tuning"
    last_updated_at: "2026-05-18T00:35:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded research-phase packet"
    next_safe_action: "Run deep-research iters (cli-devin SWE-1.6)"
    blockers: []
    key_files: ["spec.md", "research/research.md (pending after iters)"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000011002"
      session_id: "016-011-002-chunking-strategy-tuning"
      parent_session_id: null
    completion_pct: 5
    open_questions:
      - "Is current default chunking optimal, or is there headroom"
      - "Tree-sitter integration cost vs lift"
      - "Whether chunk_overlap matters for code (vs prose)"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Spec: 016/011/002-chunking-strategy-tuning — Chunking Strategy Tuning

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

**Research question**: What chunking strategy (size, overlap, semantic vs syntactic, code-aware splitters) maximizes hit-rate on the 18-pair fixture for our mixed TS/MD/Python corpus?

This packet is part of §3 structural improvements identified in the 018/003 follow-up discussion (38.9% baseline hit rate, embedder swap unlikely to be the dominant lever). Research first, then plan, then implement.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In scope
- Current CocoIndex chunker behavior (read settings.py + cocoindex_code chunker logic)
- Chunk size sweep: 200/500/1000/2000 tokens
- Overlap: 0% vs 10% vs 25%
- Semantic chunking (tree-sitter-aware) vs naive line-window
- Per-language chunk strategies (TS function-level vs MD section-level)
- Impact on 127,346-chunk corpus size + reindex time

### Out of scope
- Re-architecting CocoIndex's chunker (would be a separate packet)
- Hybrid chunking (multi-resolution) — defer to follow-on if needed
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

- Is current default chunking optimal, or is there headroom
- Tree-sitter integration cost vs lift
- Whether chunk_overlap matters for code (vs prose)
<!-- /ANCHOR:questions -->
