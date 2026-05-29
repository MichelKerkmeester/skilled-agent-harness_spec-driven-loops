---
title: "Tasks: Perf instrumentation + batching (measure-first)"
description: "Implementation task tracker for instrumenting the embed path first, then real /api/embed batching, a ready-once latch, and cache-into-reindex — every win measure-gated."
trigger_phrases:
  - "perf instrumentation batching tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/031-embedding-stack-hardening/004-perf-instrumentation-batching"
    last_updated_at: "2026-05-29T14:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored Level-1 task tracker for perf instrumentation + batching (measure-first)"
    next_safe_action: "Implement phase 004"
    blockers: []
    key_files:
      - "mcp_server/lib/embedders/reindex.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003143"
      session_id: "031-004-tasks"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Perf instrumentation + batching (measure-first)

<!-- SPECKIT_LEVEL: 1 -->

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
- [ ] T001 Confirm predecessor handoff criteria from 003-observability-model-switch
- [ ] T002 Land instrumentation FIRST: per-request ms + p50/p95 + queue depth (.opencode/bin/hf-model-server.cjs) [REQ-001]
- [ ] T003 [P] Capture a baseline p50/p95 + cache hit-rate before any optimization
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [ ] T004 Add real `/api/embed` batching; pass the whole array; one batched extractor call (shared/embeddings/providers/hf-local.ts, .opencode/bin/hf-model-server.cjs, mcp_server/lib/embedders/execution-router.ts) [REQ-002]
- [ ] T005 Sweep `EMBEDDER_REINDEX_BATCH_SIZE` empirically; account for heterogeneous lengths [REQ-006]
- [ ] T006 Add the ready-once latch with lazy re-validate on error / after a TTL (shared/embeddings/providers/hf-local.ts) [REQ-003, REQ-007]
- [ ] T007 Wire cache-into-reindex, gated on measured hit-rate (mcp_server/lib/embedders/reindex.ts, mcp_server/lib/cache/embedding-cache.ts) [REQ-004]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [ ] T008 Capture before/after p50/p95 + cache hit-rate for every change [REQ-005]
- [ ] T009 Document the batch-size sweep result and the measured throughput delta
- [ ] T099 Run strict spec validation for this phase folder
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
- [ ] All P0 tasks complete
- [ ] No `[B]` blocked tasks remaining
- [ ] Every perf win has measured before/after evidence; successor handoff (005) documented
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent packet**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
