---
title: "Tasks: 027/003 Incremental Index Foundation"
description: "Task list for additive memoization, dependency DAG, and durable chunk fingerprint support."
trigger_phrases:
  - "027 phase 003 tasks"
  - "memoization dependency dag tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/003-xce-research-based-refinement/002-memory-store-and-search/002-memory-index-causal-lifecycle/001-incremental-index-foundation"
    last_updated_at: "2026-06-10T00:00:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Completed foundation schema, memo, planner, and chunk APIs"
    next_safe_action: "Start causal-edge tombstones after review"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-04-027-phase-003-research-planning"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 027/003 Incremental Index Foundation

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

- [x] T001 Read current `memory-index.ts`, `incremental-index.ts`, `vector-index-schema.ts`, `memory-parser.ts`, and `chunking-orchestrator.ts`.
- [x] T002 Confirm absent primitives: `memoization_records`, `dependency_edges`, `memo.ts`, `canonical-fingerprint.ts`, chunk fingerprints, chunk kinds, and chunk line spans.
- [x] T003 Identify existing content-hash and embedding-cache helpers that can be reused without changing behavior.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add additive schema for memoization records and dependency edges.
- [x] T005 Add additive chunk metadata columns to indexed rows.
- [x] T006 Create `mcp_server/lib/storage/canonical-fingerprint.ts`.
- [x] T007 Create `mcp_server/lib/storage/memo.ts` with memo CRUD, dependency insertion, traversal, and cycle rejection.
- [x] T008 Extend parser/chunking output with stable chunk ids, fingerprints, kinds, and source line spans.
- [x] T009 Extend `incremental-index.ts` with memo/dependency planning APIs.
- [x] T010 Preserve `memory-index.ts` behavior per foundation scope.
- [x] T011 Add planner counters for memo hits, chunk hits, and dependency-invalidated rows.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Test unchanged memoized inputs produce memo hits without embedding writes.
- [x] T013 Test line additions outside a chunk do not change that chunk fingerprint.
- [x] T014 Test changed inputs invalidate only dependent rows.
- [x] T015 Test code-hash changes force recomputation.
- [x] T016 Test additive schema migration on an existing DB fixture.
- [x] T017 Run focused TypeScript tests.
- [x] T018 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/002-memory-index-causal-lifecycle/001-incremental-index-foundation --strict`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Memo/DAG primitives exist and are covered by tests.
- [x] Scan behavior remains safe when memo state is absent or invalid.
- [x] Stable chunk fingerprints survive unrelated line edits.
- [x] Phase 006 can consume chunk ids and fingerprints as stable diff keys.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Research Evidence**: `../research/research.md` iterations 045 and 060
<!-- /ANCHOR:cross-refs -->
