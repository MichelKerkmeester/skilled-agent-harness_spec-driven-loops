---
title: "Tasks: Byte-Bounded Embedding Cache"
description: "Task checklist for Rec 4 profile-aware byte-bounded embedding cache implementation."
trigger_phrases:
  - "byte-bounded embedding cache tasks"
  - "profile cache task checklist"
  - "query embedding cache tasks"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/009-byte-bounded-embedding-cache"
    last_updated_at: "2026-05-18T21:40:00Z"
    last_updated_by: "codex"
    recent_action: "Completed implementation tasks"
    next_safe_action: "Commit scoped files"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/tests/embedding-cache-byte-bounded.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0160020092222222222222222222222222222222222222222222222222222222"
      session_id: "phase-016-002-009"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Byte-Bounded Embedding Cache

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

- [x] T001 Read deep-research-005 iteration 010 Finding 4.
- [x] T002 Read cache, save pipeline, query embedding wrapper, and health handler source.
- [x] T003 [P] Read prior 008 packet and spec-folder authoring pattern.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add profile/input-kind schema migration in `embedding-cache.ts`.
- [x] T005 Replace count-only eviction with byte budgets and LRU deletion.
- [x] T006 Add scoped cache lookup/store options with legacy compatibility.
- [x] T007 Wire document save path with `input_kind='document'`.
- [x] T008 Wire query embedding cache with `input_kind='query'`.
- [x] T009 Extend full memory health cache byte reporting.
- [x] T010 Add byte-bounded cache Vitest coverage.
- [x] T011 Update embedder architecture and ENV docs.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Run strict spec validation.
- [x] T013 Run MCP server typecheck.
- [x] T014 Run `npx vitest --run embedding-cache-byte-bounded`.
- [x] T015 Run `npx vitest --run embedding-cache`.
- [x] T016 Run MCP server build.
- [x] T017 Run integration probe for fresh DB byte eviction and `shrink_memory`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Verification evidence recorded in `implementation-summary.md`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research Source**: `../005-context-server-memory-reduction-research/research/iterations/iteration-010.md`
<!-- /ANCHOR:cross-refs -->
