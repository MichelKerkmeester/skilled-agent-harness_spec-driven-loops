---
title: "Tasks: maintenance-grace covers background embedding"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "maintenance grace background embedding tasks"
  - "027 002/020 tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/002-memory-store-and-search/019-maintenance-grace-background-embedding"
    last_updated_at: "2026-06-17T16:05:00Z"
    last_updated_by: "implementation-engineer"
    recent_action: "Broke down tasks for the reference-counted marker plus embedding-queue wiring"
    next_safe_action: "Confirm a full reindex plus its post-scan embedding burst survives at deploy time"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "tasks-027-002-020-maintenance-grace-embedding"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: maintenance-grace covers background embedding

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`T### [P?] Description (file path)` — `[P]` marks tasks that can run in parallel. All tasks below are sequential because they touch overlapping modules.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- T001 Confirm the gap from 019: the scan defers embeddings (`asyncEmbedding`), so the real vector writes run in the post-scan background-embedding queue that drains `embedding_status='pending'` rows, and that queue is busy-but-unprotected (`lib/providers/retry-manager.ts` `runBackgroundJob`, `handlers/memory-index.ts` scan IIFE).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- T002 Add the shared, reference-counted marker module: `beginMaintenance(label)` returns `{ refresh(), end() }`, writes `<DATABASE_DIR>/.maintenance-active.json` with a 180s TTL and a 20s self-refresh, keeps the file present while >=1 holder is active, removes it at 0, and makes `end()` idempotent (`lib/storage/maintenance-marker.ts`).
- T003 Refactor the scan IIFE to call the shared module, replacing its inline marker writer and ending the holder in its existing terminal path (`handlers/memory-index.ts`).
- T004 Wire the background-embedding queue: call `beginMaintenance('embedding-queue')` in `runBackgroundJob` only after the empty-queue guard, and `end()` in the existing `finally`, so an idle tick never marks and the daemon holds the marker through the post-scan embedding burst (`lib/providers/retry-manager.ts`).
- T005 Add the unit test for the reference-counted lifecycle: present while held, present while two holders overlap, removed at 0, idempotent end (`tests/maintenance-marker.vitest.ts`).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- T006 Daemon `npm run build` exits 0.
- T007 The marker unit test plus the existing scan-job and launcher-guard suites pass; the pre-existing `retry-manager.vitest.ts` T49 cross-file isolation flake is noted, not introduced.
- T008 Deploy the dist and confirm a full force reindex plus its post-scan embedding burst runs with the daemon surviving (the deploy-time check).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

The marker writer is a shared, reference-counted module; the scan and the post-scan background-embedding queue both hold it through their overlap; the embedding queue marks only after its empty-queue guard so an idle tick never marks; the build is clean; and the marker unit plus existing scan-job and launcher-guard suites pass. Full live reindex-plus-embedding survival is the deploy-time confirmation.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `./spec.md`
- Plan: `./plan.md`
- Summary: `./implementation-summary.md`
- Predecessor: `../019-maintenance-grace-daemon-survives-reelection/`
<!-- /ANCHOR:cross-refs -->
