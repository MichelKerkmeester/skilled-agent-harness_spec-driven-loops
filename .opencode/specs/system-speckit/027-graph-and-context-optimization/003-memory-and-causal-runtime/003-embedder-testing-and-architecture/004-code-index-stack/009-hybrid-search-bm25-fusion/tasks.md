---
title: "Tasks: 016/011/003-hybrid-search-bm25-fusion"
description: "Tasks for hybrid search (bm25 + semantic fusion) (research + implementation)"
trigger_phrases:
  - "016/011/003 tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/009-hybrid-search-bm25-fusion"
    last_updated_at: "2026-05-18T00:35:00Z"
    last_updated_by: "main_agent"
    recent_action: "Implemented opt-in FTS5 + RRF hybrid search"
    next_safe_action: "Run fixture and latency validation"
    blockers: ["fixture benchmark pending", "latency benchmark pending"]
    key_files: ["spec.md", "plan.md", "implementation-summary.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000011003"
      session_id: "016-011-003-hybrid-search-bm25-fusion-tasks"
      parent_session_id: "016-011-003-hybrid-search-bm25-fusion"
    completion_pct: 80
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Tasks: 016/011/003-hybrid-search-bm25-fusion Hybrid Search (BM25 + Semantic Fusion)

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Run deep-research iters (cli-devin SWE-1.6) — output goes to research/research.md
- [x] T002 Review research synthesis; decide go/no-go
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Refine spec/plan from research findings
- [x] T004 Implement recommended approach
- [x] T005 Add tests for FTS creation/population/query, RRF fusion, config, and query dispatch
- [x] T006 Test suite clean: `.venv/bin/python -m pytest tests/ -v` passed 60/60
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 18-pair fixture benchmark; document hit-rate lift
- [ ] T008 Latency benchmark; document p95 delta
- [ ] T009 Strict-validate this packet
- [ ] T010 Commit (strict-scope)
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

Implementation is complete and unit-validated. Fixture hit-rate and latency benchmarks remain before default-on promotion.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md`
- Plan: `plan.md`
- Parent umbrella: `../spec.md` (016/011)
- Fixture: `../../004-code-index-stack/002-baseline-fixture/evidence/code-retrieval-fixture.json`
<!-- /ANCHOR:cross-refs -->
