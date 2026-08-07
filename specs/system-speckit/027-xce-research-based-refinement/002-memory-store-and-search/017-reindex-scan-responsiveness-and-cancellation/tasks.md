---
title: "Tasks: reindex-scan responsiveness and cancellation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "reindex scan responsiveness tasks"
  - "027 002/018 tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/002-memory-store-and-search/017-reindex-scan-responsiveness-and-cancellation"
    last_updated_at: "2026-06-17T14:05:00Z"
    last_updated_by: "implementation-engineer"
    recent_action: "Broke down tasks for the reindex-scan responsiveness fix"
    next_safe_action: "Address launcher lease-heartbeat re-election follow-on"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "tasks-027-002-018-reindex-responsiveness"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: reindex-scan responsiveness and cancellation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`T### [P?] Description (file path)` — `[P]` marks tasks that can run in parallel. All tasks below are sequential because they touch overlapping modules.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- T001 Read the scan executor, the batch primitive, and the job store to confirm the starvation is the synchronous tail loops, not the batch loop (`handlers/memory-index.ts`, `utils/batch-processor.ts`, `lib/ops/job-store.ts`).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- T002 Add `shouldAbort` to `RetryOptions` and break the batch loop on it (`utils/batch-processor.ts`).
- T003 Add the in-process cancel `Set`, `isCancelRequestedFast`, and terminal cleanup (`lib/ops/job-store.ts`).
- T004 Import the fast checker, wire `shouldAbort` into the scan `processBatches` call, add yields plus cancel checks to the metadata-edge and causal-chain loops, route the background `isCancelled` hook through the fast checker, and drop the unused import (`handlers/memory-index.ts`).
- T005 Add `isCancelRequestedFast` to the job-store mock (`tests/handler-memory-index-scan-jobs.vitest.ts`).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- T006 `npm run build` exits 0.
- T007 The batch-processor, job-store, job-queue, job-queue-state-edge, and index-scan-jobs suites pass (68 tests).
- T008 Deploy the dist and confirm a heavy scan keeps the daemon responsive rather than wedging for an hour.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

The touched-surface suites are green, the build is clean, and the deployed daemon no longer silently wedges on a heavy scan. The launcher lease-heartbeat re-election that recycles the daemon mid-scan is recorded as a follow-on, not closed here.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `./spec.md`
- Plan: `./plan.md`
- Summary: `./implementation-summary.md`
- Predecessor: `../017-search-and-output-intelligence-implementation/`
<!-- /ANCHOR:cross-refs -->
