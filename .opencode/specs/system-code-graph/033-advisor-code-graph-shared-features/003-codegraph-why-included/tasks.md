---
title: "Tasks: Phase 8: codegraph-why-included"
description: "Completed implementation tasks for includeTrace-gated why_included breadcrumbs in code graph query/context output."
trigger_phrases:
  - "tasks"
  - "codegraph why_included"
  - "blast radius trace"
  - "code_graph_context includeTrace"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/033-advisor-code-graph-shared-features/003-codegraph-why-included"
    last_updated_at: "2026-06-10T23:30:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Completed phase 008 implementation tasks and verification"
    next_safe_action: "No phase 008 task remains open"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/mcp_server/lib/graph/bfs-traversal.ts"
      - ".opencode/skills/system-code-graph/mcp_server/handlers/query.ts"
      - ".opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts"
      - ".opencode/skills/system-code-graph/mcp_server/tests/bfs-traversal.vitest.ts"
      - ".opencode/skills/system-code-graph/mcp_server/tests/code-graph-query-handler.vitest.ts"
      - ".opencode/skills/system-code-graph/mcp_server/tests/code-graph-context-handler.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/008-codegraph-why-included"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Trace payloads stay default-off and appear only when includeTrace is true."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 8: codegraph-why-included

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

- [x] T001 Read phase scaffold (`spec.md`, `plan.md`, `tasks.md`)
- [x] T002 Inspect allowed code surfaces (`query.ts`, `code-graph-context.ts`, `lib/graph/bfs-traversal.ts`)
- [x] T003 [P] Inspect existing BFS, query, and context vitest coverage
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Extend/reuse BFS path and truncated-frontier data (`lib/graph/bfs-traversal.ts`)
- [x] T005 Add `includeTrace`-gated `why_included` to `blast_radius` (`handlers/query.ts`)
- [x] T006 Add `includeTrace`-gated `graphContext[].why_included` (`lib/code-graph-context.ts`)
- [x] T007 Keep default payloads compact by omitting trace fields unless `includeTrace` is true
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Add/verify BFS path breadcrumb test (`tests/bfs-traversal.vitest.ts`)
- [x] T009 Add/verify blast-radius trace-on/default-off test (`tests/code-graph-query-handler.vitest.ts`)
- [x] T010 Add/verify context trace-on/default-off test (`tests/code-graph-context-handler.vitest.ts`)
- [x] T011 Run `npm run typecheck`
- [x] T012 Run `npm run build`
- [x] T013 Run targeted vitest suites for BFS/query/context
- [x] T014 Update phase docs and continuity metadata
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Verification passed for typecheck, build, and targeted vitest suites
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Implementation Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
