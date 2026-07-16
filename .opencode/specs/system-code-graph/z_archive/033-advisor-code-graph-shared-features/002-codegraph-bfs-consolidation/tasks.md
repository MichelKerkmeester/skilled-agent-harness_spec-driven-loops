---
title: "Tasks: Phase 7: codegraph-bfs-consolidation"
description: "Completed task list for the code-graph BFS helper extraction and query-handler call-site cutover."
trigger_phrases:
  - "tasks"
  - "name"
  - "template"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/033-advisor-code-graph-shared-features/002-codegraph-bfs-consolidation"
    last_updated_at: "2026-06-10T21:12:38Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Marked BFS consolidation tasks complete with verification evidence"
    next_safe_action: "Use helper tests and query-handler tests for future traversal regressions"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/mcp_server/lib/graph/bfs-traversal.ts"
      - ".opencode/skills/system-code-graph/mcp_server/handlers/query.ts"
      - ".opencode/skills/system-code-graph/mcp_server/tests/bfs-traversal.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/007-codegraph-bfs-consolidation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 7: codegraph-bfs-consolidation

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

- [x] T001 Read approved phase scaffold (`spec.md`, `plan.md`, `tasks.md`)
- [x] T002 Inspect existing transitive traversal and blast-radius BFS paths (`handlers/query.ts`)
- [x] T003 [P] Inspect existing query-handler tests for traversal and blast-radius expectations
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add shared code-graph-local BFS helper (`mcp_server/lib/graph/bfs-traversal.ts`)
- [x] T005 Repoint transitive symbol traversal to the shared helper (`handlers/query.ts`)
- [x] T006 Repoint blast-radius traversal to the shared helper (`handlers/query.ts`)
- [x] T007 Add helper tests for cap, dangling, truncation, and non-result traversal behavior (`mcp_server/tests/bfs-traversal.vitest.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run TypeScript typecheck: `npm run typecheck`
- [x] T009 Run build: `npm run build`
- [x] T010 Run helper and query-handler tests: `npx vitest run mcp_server/tests/bfs-traversal.vitest.ts mcp_server/tests/code-graph-query-handler.vitest.ts`
- [x] T011 Run comment hygiene and alignment drift checks
- [x] T012 Update phase documentation and metadata
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Verification passed with typecheck, build, targeted Vitest suites, comment hygiene, alignment drift, and strict spec validation
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
