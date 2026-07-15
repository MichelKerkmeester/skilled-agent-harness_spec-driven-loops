---
title: "Tasks: Canonical Vector Shard Split"
description: "Task checklist for canonical metadata DB plus per-profile vector shard split."
trigger_phrases:
  - "canonical vector shard split tasks"
  - "active_vec attach tasks"
  - "vector shard verification checklist"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/012-canonical-vector-shard-split"
    last_updated_at: "2026-05-19T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Recorded task progress"
    next_safe_action: "Stage source-only path list from commit handoff"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/tests/canonical-vector-shard.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0160020122222222222222222222222222222222222222222222222222222222"
      session_id: "phase-016-002-012"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Canonical Vector Shard Split

<!-- SPECKIT_LEVEL: 1 -->
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

- [x] T001 Read deep-research-005 iteration 010 Finding 6.
- [x] T002 Read profile, vector store, vector query/mutation, embedding cache, context-server, and health files.
- [x] T003 [P] Read predecessor constraints from packets 007-011.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add canonical and vector shard path helpers in `profile.ts`.
- [x] T005 Add active shard attach/detach/source helpers in `vector-index-store.ts`.
- [x] T006 Add legacy single-DB migration helper with rollback backup staging.
- [x] T007 Qualify vector query and mutation paths through `active_vec`.
- [x] T008 Move embedding cache schema and reads/writes into the shard with standalone-test fallback.
- [x] T009 Attach the active shard during guarded runtime initialization and after active embedder selection.
- [x] T010 Add full health `db_split` telemetry.
- [x] T011 Preserve checkpoint compatibility through shard-aware vector aliasing.
- [x] T012 Document the canonical/shard storage layout.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Add `canonical-vector-shard.vitest.ts`.
- [x] T014 Run typecheck during implementation.
- [x] T015 Run canonical-vector-shard and embedding-cache targeted suites during implementation.
- [x] T016 Run strict spec validation.
- [x] T017 Run all requested targeted regression suites and build.
- [x] T018 Record verification evidence and commit handoff path list.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Strict spec validation reports `RESULT: PASSED`.
- [x] Typecheck, build, and requested Vitest gates pass or have documented pre-existing failure counts.
- [x] Commit handoff lists source-only `git add` paths and excludes `dist/`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Rec 6 source: deep-research-005 iteration 010 Finding 6.
- Predecessor: 011 lazy startup gating.
- Related: 009 byte-bounded embedding cache and 008 byte-aware health telemetry.
<!-- /ANCHOR:cross-refs -->
