---
title: "Tasks: Query-Time Existence Filter Benchmark & Hardening [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "query-time existence filter benchmark"
  - "REQ-008 latency benchmark"
  - "query-time filter concurrency soak test"
  - "transient-miss suspect queue end-to-end test"
  - "existence filter exclusion telemetry"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/020-query-time-filter-benchmark"
    last_updated_at: "2026-07-09T22:40:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored tasks.md alongside spec.md/plan.md, status PLANNED"
    next_safe_action: "Await operator approval, then begin T001"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-028-020-query-time-filter-benchmark"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Query-Time Existence Filter Benchmark & Hardening

<!-- SPECKIT_LEVEL: 2 -->
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

- [ ] T001 Re-confirm the Layer 1 file:line references cited in spec.md/plan.md against the live tree (.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts, .opencode/skills/system-spec-kit/mcp_server/lib/config/capability-flags.ts)
- [ ] T002 Re-confirm the F8 fast-fail bound cited from 014 is still present (.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:224,421-437)
- [ ] T003 [P] Read the 004-dark-flag-graduation benchmark harness pattern end to end (.opencode/specs/system-speckit/028-memory-search-intelligence/004-dark-flag-graduation/002-retrieval-class-weights/scripts/retrieval-class-routing-benchmark.mjs)
- [ ] T004 [P] Read the stress_test/durability isolation pattern end to end (.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/index-scan-coalescing-stress.vitest.ts)
- [ ] T005 Identify or adapt a representative query set for the REQ-001 benchmark from an existing sibling benchmark's fixtures
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 Build the REQ-001 latency benchmark harness against a read-only corpus/vector-shard backup, flag toggled via env (.opencode/specs/system-speckit/028-memory-search-intelligence/020-query-time-filter-benchmark/scripts/query-time-filter-latency-benchmark.mjs)
- [ ] T007 Run the REQ-001 harness and capture p50/p95/mean latency for flag-on vs. flag-off, write raw output (.opencode/specs/system-speckit/028-memory-search-intelligence/020-query-time-filter-benchmark/results/)
- [ ] T008 Build the REQ-002 concurrency stress test: wide concurrent burst against a throwaway in-memory DB, assert no hang and no suspect-queue corruption (.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/query-time-existence-filter-concurrency-stress.vitest.ts)
- [ ] T009 Build the REQ-003 end-to-end test: exclude-while-missing, restore, re-query included, scan clears suspect -- all through the public memory_search/memory_index_scan handlers in one continuous test (.opencode/skills/system-spec-kit/mcp_server/tests/memory-search-transient-miss-e2e.vitest.ts)
- [ ] T010 Decide REQ-004's counter mechanism (persisted config-table row vs. process-lifetime in-memory counter) and record the decision
- [ ] T011 Implement the REQ-004 aggregate exclusion counter and its read-accessible getter alongside the existing per-query extraData.queryTimeExistenceFilter field (.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts, .opencode/skills/system-spec-kit/mcp_server/lib/storage/memory-drift-healing.ts)
- [ ] T012 Add the REQ-004 aggregate-counter correctness test (counter total equals summed per-query checked/excluded across a multi-query sequence)
- [ ] T013 Document the existing per-query field and the new aggregate counter in ENV_REFERENCE.md (.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T014 Run the REQ-002 stress test under npm run stress:durability and confirm pass
- [ ] T015 Run the REQ-003 e2e test under the normal vitest run and confirm pass
- [ ] T016 Run the REQ-004 aggregate-counter test and confirm pass
- [ ] T017 Write REQ-001's captured numbers, the reproduce command, and REQ-004's Option A/B decision into implementation-summary.md
- [ ] T018 Close 011/checklist.md CHK-064 with a pointer to this phase's benchmark evidence (REQ-005) (.opencode/specs/system-speckit/028-memory-search-intelligence/011-automatic-drift-self-healing/checklist.md)
- [ ] T019 Code-review the diff to confirm no Layer 1/2/3 filtering/hook/sweep logic changed beyond the REQ-004 counter (REQ-006)
- [ ] T020 Update documentation (spec/plan/tasks/checklist/implementation-summary)
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
<!-- /ANCHOR:cross-refs -->
