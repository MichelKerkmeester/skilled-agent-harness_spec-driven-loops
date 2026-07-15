---
title: "Tasks: success-rows-missing-active-vector coverage hygiene"
description: "Task breakdown for the detection + repair-by-re-embed hygiene pass on success rows missing an active vector surface."
trigger_phrases:
  - "success vector coverage tasks"
  - "missing vector hygiene tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/007-success-vector-coverage-hygiene"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored Level 1 task breakdown for success-vector coverage hygiene"
    next_safe_action: "Implement detection + guarded repair (reset to retry), then run vitest"
    blockers: []
    key_files:
      - "mcp_server/lib/embedders/embedding-reconcile.ts"
      - "mcp_server/tests/embedding-reconcile.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-authoring-007"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: success-rows-missing-active-vector coverage hygiene

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

- [ ] T001 Confirm active-shard verification helper from packet 006 is reusable (`mcp_server/lib/embedders/embedding-reconcile.ts`)
- [ ] T002 Confirm detection predicate against `active_vec.vec_memories_rowids` + `vec_<dim>`
- [ ] T003 Decide wiring: sibling export vs. folded reconcile result
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Implement detection helper guarded by `activeShardVerified` (`mcp_server/lib/embedders/embedding-reconcile.ts`)
- [ ] T005 Implement guarded repair: reset detected rows to `retry` (`retry_count=0`, `failure_reason=NULL`), dry-run default (`mcp_server/lib/embedders/embedding-reconcile.ts`)
- [ ] T006 Add fail-closed guard for unverified shard (`mcp_server/lib/embedders/embedding-reconcile.ts`)
- [ ] T007 Wire the chosen detection/repair surface into the reconcile lib (`mcp_server/lib/embedders/embedding-reconcile.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Test detection counts a seeded missing-vector success row (`mcp_server/tests/embedding-reconcile.vitest.ts`)
- [ ] T009 Test apply resets the detected row to `retry` (`mcp_server/tests/embedding-reconcile.vitest.ts`)
- [ ] T010 Test rows WITH full coverage are untouched (`mcp_server/tests/embedding-reconcile.vitest.ts`)
- [ ] T011 Test idempotency — second run finds 0 (`mcp_server/tests/embedding-reconcile.vitest.ts`)
- [ ] T012 Run `npm run build` + vitest green; update documentation
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed (dry-run detects ~23 rows on current DB)
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
