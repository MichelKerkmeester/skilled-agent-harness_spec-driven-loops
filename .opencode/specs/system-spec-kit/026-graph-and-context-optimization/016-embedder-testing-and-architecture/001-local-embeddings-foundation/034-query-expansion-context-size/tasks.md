---
title: "Tasks: 034 Query Expansion Context Size"
description: "Task list for bounding embedding expansion combinedQuery length."
trigger_phrases:
  - "034 query expansion tasks"
  - "combinedQuery cap tasks"
importance_tier: "important"
contextType: "spec"
status: "complete"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/001-local-embeddings-foundation/034-query-expansion-context-size"
    last_updated_at: "2026-05-14T15:40:13Z"
    last_updated_by: "main-agent"
    recent_action: "Completed source patch, tests, and strict validation for 034"
    next_safe_action: "No 034 action needed"
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 034 Query Expansion Context Size

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

- [x] T001 Scaffold Level-2 034 packet.
- [x] T002 Read current `embedding-expansion.ts` construction path.
- [x] T003 [P] Inspect nearby packet metadata shape.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add `COMBINED_QUERY_CHAR_BUDGET` to `embedding-expansion.ts`.
- [x] T005 Add `buildBoundedCombinedQuery()` helper.
- [x] T006 Replace unbounded `combinedQuery` construction.
- [x] T007 Add targeted `embedding-expansion-bound.vitest.ts`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run `npm run build`.
- [x] T009 Run targeted 034 vitest.
- [x] T010 Run stage1 candidate generation regression.
- [x] T011 Run strict 034 packet validation.
- [x] T012 Fill implementation summary with evidence.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Verification commands recorded in `implementation-summary.md`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Checklist**: See `checklist.md`.
<!-- /ANCHOR:cross-refs -->
