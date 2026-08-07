---
title: "Tasks: Code Graph RPC Classifier Surface"
description: "Task ledger for adding code_graph_classify_query_intent and removing the spec-kit local classifier shim."
trigger_phrases:
  - "021 tasks"
  - "codegraph rpc surface tasks"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/004-skill-graph/006-system-skill-advisor-package-extraction/021-codegraph-rpc-surface"
    last_updated_at: "2026-05-15T09:20:31Z"
    last_updated_by: "codex"
    recent_action: "Verified classifier RPC surface"
    next_safe_action: "Commit scoped files"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/mcp_server/handlers/classify-query-intent.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/code-graph-boundary.ts"
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Code Graph RPC Classifier Surface

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] T001 Confirm packet 020 sibling location.
- [x] T002 Scaffold Level 2 packet 021.
- [x] T003 [P] Read code-graph classifier, schema, dispatcher, handler, and tests.
- [x] T004 [P] Read spec-kit boundary and `memory-context.ts` call site.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Add `code_graph_classify_query_intent` schema.
- [x] T006 Create `handlers/classify-query-intent.ts`.
- [x] T007 Register handler export and dispatcher case.
- [x] T008 Replace spec-kit local classifier shim with RPC wrapper.
- [x] T009 Await classifier in `memory-context.ts`.
- [x] T010 Add code-graph MCP dispatch test.
- [x] T011 Update spec-kit runtime-routing test for async RPC classification.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Run focused code-graph classifier tests.
- [x] T013 Run focused spec-kit runtime-routing test.
- [x] T014 Run both TypeScript typechecks.
- [x] T015 Run broader code-graph, advisor, and spec-kit Vitest commands.
- [x] T016 Verify live MCP connection and tool listing.
- [x] T017 Strict-validate packet 021 and parent.
- [x] T018 Prepare scoped changes for commit and push.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Binding output fields ready for final response.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
