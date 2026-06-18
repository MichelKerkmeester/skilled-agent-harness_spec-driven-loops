---
title: "Tasks: Phase 9: codegraph-bm25-symbol-resolver [template:level_1/tasks.md]"
description: "Task completion record for the optional default-off BM25 code-graph symbol resolver."
trigger_phrases:
  - "tasks"
  - "code graph symbol resolver"
  - "BM25 fuzzy symbol lookup"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph/009-codegraph-bm25-symbol-resolver"
    last_updated_at: "2026-06-10T21:38:20Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Completed BM25 symbol resolver implementation and verification"
    next_safe_action: "Keep BM25 resolver default-off"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/mcp_server/lib/symbol-bm25-resolver.ts"
      - ".opencode/skills/system-code-graph/mcp_server/handlers/query.ts"
      - ".opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts"
      - ".opencode/skills/system-code-graph/mcp_server/tests/symbol-bm25-resolver.vitest.ts"
      - ".opencode/skills/system-code-graph/mcp_server/tests/code-graph-query-handler.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/009-codegraph-bm25-symbol-resolver"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Exact matches remain primary and byte-identical."
      - "BM25 suggestions are opt-in and fallback-only."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 9: codegraph-bm25-symbol-resolver

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

- [x] T001 Read phase scaffold and confirm exact-match guardrail
- [x] T002 Reuse packed BM25F pattern without new dependencies
- [x] T003 [P] Confirm allowed code/test/doc write paths
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Implement `symbol-bm25-resolver.ts` packed BM25F index over symbol fields
- [x] T005 Add `querySymbolIndexRows()` read-only accessor in `code-graph-db.ts`
- [x] T006 Wire query fallback only on unresolved exact subject with `SPECKIT_CODE_GRAPH_BM25_SYMBOL_RESOLVER`
- [x] T007 Keep unresolved-subject behavior byte-identical when the flag is off or no candidates exist
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Add resolver tests for packed postings, field weights, default-off flag, and near-miss candidates
- [x] T009 Add query tests proving exact-match byte identity and fallback-only candidate suggestions
- [x] T010 Run typecheck, build, targeted tests, existing query suites, comment hygiene, alignment drift, and strict spec validation
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Verification passed with recorded command evidence in `implementation-summary.md`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
