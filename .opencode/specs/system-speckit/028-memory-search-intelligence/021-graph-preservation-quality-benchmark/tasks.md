---
title: "Tasks: Graph Preservation Quality Benchmark"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "graph preservation quality benchmark"
  - "content rich short query graph preservation benchmark"
  - "retrieval class routing benchmark"
  - "F15 counter memory health wiring"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/021-graph-preservation-quality-benchmark"
    last_updated_at: "2026-07-09T20:40:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored tasks.md scaffold, status PLANNED"
    next_safe_action: "Hold for implementation, no code has landed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-028-021-graph-preservation-quality-benchmark"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Graph Preservation Quality Benchmark

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm run-retrieval-flag-eval.mjs runs cleanly end to end on the current tree, baseline smoke run (.opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-retrieval-flag-eval.mjs)
- [ ] T002 Decide fixture location: in-place ground-truth.json extension vs. a scoped sibling JSON file (.opencode/skills/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json)
- [ ] T003 Decide the reindex mechanism: documented manual pre-flight command vs. a scripted step inside the driver
- [ ] T004 [P] Re-confirm the F15 counter and memory_health routing block against the live tree in case a concurrent session has touched either file (.opencode/skills/system-spec-kit/mcp_server/lib/search/query-router.ts, .opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Fixture Authoring (.opencode/skills/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json or a scoped sibling file)

- [ ] T005 [B] Author the content-rich-short slice: candidate queries verified against the real isContentRichShortQuery() classifier (.opencode/skills/system-spec-kit/mcp_server/lib/search/query-classifier.ts)
- [ ] T006 [B] Author the SingleHop slice: candidate queries verified against the real classifyRetrievalClass() classifier (.opencode/skills/system-spec-kit/mcp_server/lib/search/retrieval-class-classifier.ts)
- [ ] T007 [B] Author the control slice: candidate queries verified to trip neither predicate
- [ ] T008 Grade relevance (0-3) for every fixture query against real corpus rows, reaching 50+ total queries across the three slices
- [ ] T009 [P] Fixture-shape test: asserts >=50 queries, every query has >=1 relevance row, every query's labeled slice matches its live-classifier-verified predicate (new vitest sibling to ground-truth-data tests)

### Benchmark Driver (.opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-retrieval-flag-eval.mjs or a new sibling driver)

- [ ] T010 [B] Wire SPECKIT_RETRIEVAL_CLASS_ROUTING and SPECKIT_CONTENT_RICH_SHORT_QUERY_GRAPH_PRESERVATION into the per-flag before/after mechanism, reusing prepareEvalDatabase/buildPerFlagSearchOptions/computeMeanMetrics
- [ ] T011 Reindex the source database per the Phase 1 decision, immediately before the benchmark run
- [ ] T012 Run the driver: each flag toggled in isolation against the reindexed snapshot, scored against the new fixture, sliced by content-rich-short/SingleHop/control
- [ ] T013 Record findings in benchmark-results.md: per-flag, per-slice Recall@K/nDCG/MRR deltas plus the reindex before/after confirmation (.opencode/specs/system-speckit/028-memory-search-intelligence/021-graph-preservation-quality-benchmark/benchmark-results.md)

### F15 Counter Wiring (.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts -- independent of the two groups above, may run in parallel)

- [ ] T014 [P] Import getContentRichShortQueryGraphPreservationCount() into memory-crud-health.ts
- [ ] T015 [P] Add the try/catch-guarded counter read inside handleMemoryHealth(), following the existing routingTelemetry/graphChannelMetrics shape (memory-crud-health.ts:1417-1457 pattern)
- [ ] T016 [P] Add the new field to the routing object literal, additive only (memory-crud-health.ts:1517-1538 region)
- [ ] T017 [P] Test: counter appears in memory_health's JSON response, increments correctly, resets to 0 via the existing test-only reset hook (new test or extension of .opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-health-edge.vitest.ts)
- [ ] T018 [P] Test: before/after diff of memory_health's response and of routeQuery()'s output confirms the wiring is additive-only
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T019 bash validate.sh --strict run on this packet, evidence captured
- [ ] T020 Confirm zero change to either flag's default value or routing-decision logic (diff check against search-flags.ts, query-router.ts, retrieval-class-classifier.ts)
- [ ] T021 Confirm existing handler-memory-health-edge.vitest.ts and query-router.vitest.ts suites pass unchanged
- [ ] T022 Update documentation (spec/plan/tasks/checklist/implementation-summary/decision-record)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decision Records**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
