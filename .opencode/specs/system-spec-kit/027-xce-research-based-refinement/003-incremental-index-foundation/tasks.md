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
    packet_pointer: "specs/system-spec-kit/027-xce-research-based-refinement/003-incremental-index-foundation"
    last_updated_at: "2026-06-04T00:00:00Z"
    last_updated_by: "gpt-5-5"
    recent_action: "Replaced scaffold defaults with implementation tasks from continuation research."
    next_safe_action: "Execute T001-T006 before changing handler scan behavior."
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-04-027-phase-003-research-planning"
      parent_session_id: null
    completion_pct: 0
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

- [ ] T001 Read current `memory-index.ts`, `incremental-index.ts`, `vector-index-schema.ts`, `memory-parser.ts`, and `chunking-orchestrator.ts`.
- [ ] T002 Confirm absent primitives: `memoization_records`, `dependency_edges`, `memo.ts`, `canonical-fingerprint.ts`, chunk fingerprints, chunk kinds, and chunk line spans.
- [ ] T003 Identify existing content-hash and embedding-cache helpers that can be reused without changing behavior.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add additive schema for memoization records and dependency edges.
- [ ] T005 Add additive chunk metadata columns to indexed rows.
- [ ] T006 Create `mcp_server/lib/storage/canonical-fingerprint.ts`.
- [ ] T007 Create `mcp_server/lib/storage/memo.ts` with memo CRUD, dependency insertion, traversal, and cycle rejection.
- [ ] T008 Extend parser/chunking output with stable chunk ids, fingerprints, kinds, and source line spans.
- [ ] T009 Extend `incremental-index.ts` with memo/dependency planning APIs.
- [ ] T010 Update `memory-index.ts` to consult memo/DAG planning before parse/embed while preserving whole-file fallback.
- [ ] T011 Add scan summary counters for memo hits, chunk hits, and dependency-invalidated rows.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Test no-op scans produce memo hits and zero new embedding writes.
- [ ] T013 Test line additions outside a chunk do not change that chunk fingerprint.
- [ ] T014 Test one changed chunk invalidates only its dependent rows.
- [ ] T015 Test code-hash changes force recomputation.
- [ ] T016 Test additive schema migration on an existing DB fixture.
- [ ] T017 Run focused TypeScript tests.
- [ ] T018 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/system-spec-kit/027-xce-research-based-refinement/003-incremental-index-foundation --strict`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] Memo/DAG primitives exist and are covered by tests.
- [ ] Scan behavior remains safe when memo state is absent or invalid.
- [ ] Stable chunk fingerprints survive unrelated line edits.
- [ ] Phase 006 can consume chunk ids and fingerprints as stable diff keys.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Research Evidence**: `../research/research.md` iterations 045 and 060
<!-- /ANCHOR:cross-refs -->
