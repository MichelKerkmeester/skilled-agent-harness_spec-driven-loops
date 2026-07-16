---
title: "Tasks: Hybrid Search Scope Then Limit"
description: "Completed task list for the in-memory BM25 scope-then-limit fix, regression tests, and Level 1 documentation."
trigger_phrases:
  - "bm25 scope then limit tasks"
  - "hybrid search regression tasks"
  - "deprecated tier bm25 tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/002-memory-store-and-search/012-hybrid-search-scope-then-limit"
    last_updated_at: "2026-06-11T09:55:00Z"
    last_updated_by: "opencode"
    recent_action: "Completed implementation, tests, and documentation tasks for BM25 scope-then-limit behavior."
    next_safe_action: "Use implementation-summary.md for final verification results."
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts"
    session_dedup:
      fingerprint: "sha256:c169227c9642f1b6e9fe0bf744410f4b71ca69f33f75a3d7a3e1199f5567263f"
      session_id: "2026-06-11-hybrid-search-scope-then-limit"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "All work items completed with in-memory fixtures only."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Hybrid Search Scope Then Limit

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

- [x] T001 Read `hybrid-search.ts` and confirm the BM25 limit-before-filter defect.
- [x] T002 Read `sqlite-fts.ts` and confirm the FTS5 SQL lane filters before limit.
- [x] T003 [P] Read `hybrid-search.vitest.ts` and identify the existing BM25 test section for regression coverage.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Update `bm25Search` to use `index.getStats().documentCount` as the bounded candidate limit when metadata filters can drop results.
- [x] T005 Preserve the existing metadata lookup and fail-closed scoped behavior.
- [x] T006 Add scoped BM25 regression coverage where higher-ranked out-of-scope hits would previously consume the limit.
- [x] T007 Add deprecated-tier BM25 regression coverage where higher-ranked deprecated hits would previously consume the limit.
- [x] T008 Add unscoped no-filter regression coverage to preserve prior order and count.
- [x] T009 Fill `spec.md`, `plan.md`, `tasks.md`, and `implementation-summary.md` with completed phase content.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run `npx vitest run tests/hybrid-search.vitest.ts` from the MCP server directory.
- [x] T011 Run `npx tsc --noEmit` from the MCP server directory.
- [x] T012 Run strict spec validation for this phase folder.
- [x] T013 Run changed-code comment-hygiene grep and confirm no banned ephemeral comment labels were added.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Automated verification passed.
- [x] No live `mcp_server/database/**` shard or host daemon was touched.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Implementation Summary**: See `implementation-summary.md`.
<!-- /ANCHOR:cross-refs -->
