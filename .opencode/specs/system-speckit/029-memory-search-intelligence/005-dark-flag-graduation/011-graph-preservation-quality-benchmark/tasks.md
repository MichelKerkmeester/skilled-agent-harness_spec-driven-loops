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
    packet_pointer: "system-speckit/029-memory-search-intelligence/005-dark-flag-graduation/011-graph-preservation-quality-benchmark"
    last_updated_at: "2026-07-10T14:30:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "All 22 tasks across 3 phases completed and verified with evidence."
    next_safe_action: "None -- packet complete."
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-028-021-graph-preservation-quality-benchmark"
      parent_session_id: null
    completion_pct: 100
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

- [x] T001 Confirmed clean baseline smoke run in `run-retrieval-flag-eval.mjs:1-50`
- [x] T002 Decided: scoped sibling file, documented in `plan.md`'s answered_questions
- [x] T003 Decided: scripted preflight, documented in `plan.md`'s answered_questions
- [x] T004 [P] Re-confirmed via direct read of `query-router.ts:376-378` and `memory-crud-health.ts:1417`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Fixture Authoring (.opencode/skills/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json or a scoped sibling file)

- [x] T005 [B] Authored 26 content-rich-short queries, verified against `query-classifier.ts:174`'s `isContentRichShortQuery()`
- [x] T006 [B] Authored 18 SingleHop queries, verified against `retrieval-class-classifier.ts:101`'s `classifyRetrievalClass()`
- [x] T007 [B] Authored 16 control queries, verified via `retrieval-class-classifier.ts:101` to trip neither predicate
- [x] T008 Graded 131 relevance rows across 60 total queries (26/18/16 per slice), see `graph-preservation-ground-truth.json`
- [x] T009 [P] Fixture-shape test in `graph-preservation-ground-truth.vitest.ts`, all assertions pass

### Benchmark Driver (.opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-retrieval-flag-eval.mjs or a new sibling driver)

- [x] T010 [B] Wire SPECKIT_RETRIEVAL_CLASS_ROUTING and SPECKIT_CONTENT_RICH_SHORT_QUERY_GRAPH_PRESERVATION into the per-flag before/after mechanism, reusing prepareEvalDatabase/buildPerFlagSearchOptions/computeMeanMetrics
- [x] T011 Quiescence preflight confirmed via `assertSourceQuiescent()` immediately before the benchmark run
- [x] T012 Driver run completed with exit code 0, both flags toggled in isolation against the live snapshot
- [x] T013 Findings recorded in `benchmark-results.md`, per-flag per-slice deltas in sections 4-5

### F15 Counter Wiring (.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts -- independent of the two groups above, may run in parallel)

- [x] T014 [P] Imported `getContentRichShortQueryGraphPreservationCount` into `memory-crud-health.ts`
- [x] T015 [P] Add the try/catch-guarded counter read inside handleMemoryHealth(), following the existing routingTelemetry/graphChannelMetrics shape (memory-crud-health.ts:1417-1457 pattern)
- [x] T016 [P] Add the new field to the routing object literal, additive only (memory-crud-health.ts:1517-1538 region)
- [x] T017 [P] Test: counter appears in memory_health's JSON response, increments correctly, resets to 0 via the existing test-only reset hook (new test or extension of .opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-health-edge.vitest.ts)
- [x] T018 [P] Additive-only diff confirmed by the `021-REQ007` test in `handler-memory-crud.vitest.ts`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T019 bash validate.sh --strict run on this packet, evidence captured
- [x] T020 Confirmed via `git diff` on `search-flags.ts`/`query-router.ts`/`retrieval-class-classifier.ts`: zero changes
- [x] T021 Confirmed `handler-memory-health-edge.vitest.ts` and `query-router.vitest.ts` pass unchanged
- [x] T022 Updated `spec.md`/`plan.md`/`tasks.md`/`checklist.md`/`implementation-summary.md`/`decision-record.md`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decision Records**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
