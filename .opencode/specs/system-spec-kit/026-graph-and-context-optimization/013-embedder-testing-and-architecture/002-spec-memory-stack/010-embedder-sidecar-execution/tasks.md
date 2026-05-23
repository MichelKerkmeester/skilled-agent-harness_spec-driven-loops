---
title: "Tasks: Embedder Sidecar Execution"
description: "Task checklist for Rec 5 local embedder sidecar execution."
trigger_phrases:
  - "embedder sidecar execution tasks"
  - "sidecar lifecycle task checklist"
  - "hf-local sidecar task list"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/010-embedder-sidecar-execution"
    last_updated_at: "2026-05-19T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Completed implementation tasks"
    next_safe_action: "Commit scoped files"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/tests/embedder-sidecar.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0160020102222222222222222222222222222222222222222222222222222222"
      session_id: "phase-016-002-010"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Embedder Sidecar Execution

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

- [x] T001 Read deep-research-005 iteration 010 Finding 5.
- [x] T002 Read `hf-local`, registry, backend types, query call site, reindex call site, and health handler.
- [x] T003 [P] Read prior 008/009 packet pattern and spec-folder authoring recipe.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add `sidecar-client.ts` with lazy fork, JSONL ids, ping timeout, idle eviction, stderr prefixing, and shutdown.
- [x] T005 Add `sidecar-worker.ts` with lazy provider creation and structured error responses.
- [x] T006 Add `execution-router.ts` with `auto|direct|sidecar` policy and per-provider/model sidecar cache.
- [x] T007 Wire query embedding through the execution router.
- [x] T008 Wire reindex jobs through the execution router.
- [x] T009 Extend full `memory_health` reports with `sidecar_workers`.
- [x] T010 Add sidecar lifecycle and router policy Vitest coverage.
- [x] T011 Update embedder architecture and ENV docs.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Run strict spec validation.
- [x] T013 Run MCP server typecheck.
- [x] T014 Run `npx vitest --run embedder-sidecar`.
- [x] T015 Run `npx vitest --run embedder`.
- [x] T016 Run MCP server build.
- [x] T017 Run integration probe for five requests, worker reuse, idle eviction, and respawn.
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
