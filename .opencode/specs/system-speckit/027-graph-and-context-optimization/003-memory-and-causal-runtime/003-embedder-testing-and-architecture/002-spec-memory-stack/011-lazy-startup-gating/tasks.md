---
title: "Tasks: Lazy Startup Gating"
description: "Task checklist for Rec 3 context-server lazy memory runtime initialization."
trigger_phrases:
  - "lazy startup gating tasks"
  - "memory runtime guard tasks"
  - "runtime_initialized task checklist"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/011-lazy-startup-gating"
    last_updated_at: "2026-05-19T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Recorded verification progress"
    next_safe_action: "Resolve handler-family verification blocker"
    blockers:
      - "`npx vitest --run handlers` has no matching files; singular `handler` filter fails in pre-existing handler-memory-save tests"
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/tests/memory-runtime-guard.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0160020112222222222222222222222222222222222222222222222222222222"
      session_id: "phase-016-002-011"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Tasks: Lazy Startup Gating

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

- [x] T001 Read deep-research-005 iteration 010 Finding 3.
- [x] T002 Read `context-server.ts`, `vector-index-store.ts`, `memory-crud-health.ts`, `tool-schemas.ts`, and representative handlers.
- [x] T003 [P] Read prior packet docs and local spec-folder requirements.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add `memory-runtime-guard.ts` with idempotent single-flight initialization.
- [x] T005 Add non-initializing `tryGetDb()` export.
- [x] T006 Register context-server init tasks behind the guard.
- [x] T007 Move DB open, integrity checks, consumer init, BM25 warmup, reindex resume, retry manager, watcher setup, and startup scan behind the registered init callback.
- [x] T008 Guard memory-owning handler dispatch and direct handler entry points.
- [x] T009 Keep `memory_health` and session priming lightweight before initialization.
- [x] T010 Add focused guard, health, and representative memory tool tests.
- [x] T011 Update embedder architecture diagnostics docs.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Run strict spec validation.
- [x] T013 Run MCP server typecheck.
- [x] T014 Run `npx vitest --run memory-runtime-guard`.
- [B] T015 Run `npx vitest --run handlers`.
- [x] T016 Run `npx vitest --run context-server`.
- [x] T017 Run MCP server build.
- [x] T018 Run integration probe for pre-init health, first memory call init, and post-init health.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`.
- [ ] No `[B]` blocked tasks remaining.
- [x] Verification evidence recorded in `implementation-summary.md`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research Source**: `../005-context-server-memory-reduction-research/research/iterations/iteration-010.md`
<!-- /ANCHOR:cross-refs -->
