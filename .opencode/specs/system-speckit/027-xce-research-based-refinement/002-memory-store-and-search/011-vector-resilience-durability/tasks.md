---
title: "Tasks: Vector Resilience Durability"
description: "Task list for durable vector-shard repair intent, boot resume, stale degraded-state cleanup, tests, and packet verification."
trigger_phrases:
  - "vector repair sentinel tasks"
  - "restart durability tests"
  - "clear degraded vector state"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/002-memory-store-and-search/011-vector-resilience-durability"
    last_updated_at: "2026-06-11T08:50:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Completed vector durability implementation"
    next_safe_action: "Monitor vector repair regressions"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/vector-shard-read-path-resilience.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "vector-resilience-durability-2026-06-11"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Vector Resilience Durability

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

- [x] T001 Read vector shard quarantine and repair scheduling code (`lib/search/vector-index-store.ts`).
- [x] T002 Read reindex completion code (`lib/embedders/reindex.ts`).
- [x] T003 [P] Read existing vector-shard resilience test harness (`tests/vector-shard-read-path-resilience.vitest.ts`).
- [x] T004 [P] Read packet scaffold and correct continuity pointer (`spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Add per-shard repair-pending sentinel path, write, read, and clear helpers (`lib/search/vector-index-store.ts`).
- [x] T006 Write repair sentinel before quarantine rename (`lib/search/vector-index-store.ts`).
- [x] T007 Resume pending repair from sentinel during shard attach (`lib/search/vector-index-store.ts`).
- [x] T008 Clear repair sentinel in rebuild completion path (`lib/embedders/reindex.ts`).
- [x] T009 Clear stale degraded-vector state after normal reindex rebuilds the same shard (`lib/embedders/reindex.ts`, `lib/observability/retrieval-observability.ts`).
- [x] T010 Sandbox vector-shard resilience tests from host daemon sockets (`tests/vector-shard-read-path-resilience.vitest.ts`).
- [x] T011 Add restart-durability regression test (`tests/vector-shard-read-path-resilience.vitest.ts`).
- [x] T012 Add clear-degraded regression test (`tests/vector-shard-read-path-resilience.vitest.ts`).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Run preliminary TypeScript check (`npx tsc --noEmit`).
- [x] T014 Run targeted vector-shard resilience tests after implementation (`npx vitest run tests/vector-shard-read-path-resilience.vitest.ts`).
- [x] T015 Run final TypeScript check for completion evidence.
- [x] T016 Run final targeted Vitest command for completion evidence.
- [x] T017 Run strict spec validation.
- [x] T018 Run comment-hygiene grep.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Final verification evidence recorded in `implementation-summary.md`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Implementation Summary**: See `implementation-summary.md`.
<!-- /ANCHOR:cross-refs -->
