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
    last_updated_at: "2026-07-10T04:43:21Z"
    last_updated_by: "openai/gpt-5.6-terra"
    recent_action: "Completed every implementation and verification task"
    next_safe_action: "No task remains in this packet"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-028-020-query-time-filter-benchmark"
      parent_session_id: null
    completion_pct: 100
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

- [x] T001 Re-confirmed Layer 1 citations against the live handler and capability flag.
- [x] T002 Re-confirmed the 25ms F8 fast-fail bound and best-effort write path.
- [x] T003 [P] Read the read-only backup benchmark precedent end to end.
- [x] T004 [P] Read the throwaway-DB durability stress precedent end to end.
- [x] T005 Added an eight-query representative benchmark set.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Added the read-only-source latency harness.
- [x] T007 Captured raw output in `results/query-time-filter-latency.json`.
- [x] T008 Added and passed the 64-wide public-search durability soak.
- [x] T009 Added and passed the continuous public-handler transient-miss test.
- [x] T010 Chose a process-lifetime in-memory aggregate to avoid hot-path database contention.
- [x] T011 Added the aggregate getter and additive response field in `memory-search.ts`.
- [x] T012 Verified aggregate increments over a multi-query public-handler sequence.
- [x] T013 Documented both telemetry surfaces in `ENV_REFERENCE.md`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Passed the new stress suite with a throwaway DB.
- [x] T015 Passed the e2e test through public handlers.
- [x] T016 Passed aggregate-counter assertions in the e2e test.
- [x] T017 Recorded real benchmark numbers and reproduce command in `implementation-summary.md`.
- [x] T018 Closed sibling CHK-064 with this phase's evidence.
- [x] T019 Reviewed the production diff: only aggregate recording and response exposure changed.
- [x] T020 Updated implementation evidence, tasks, checklist, and sibling status note.
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
<!-- /ANCHOR:cross-refs -->
