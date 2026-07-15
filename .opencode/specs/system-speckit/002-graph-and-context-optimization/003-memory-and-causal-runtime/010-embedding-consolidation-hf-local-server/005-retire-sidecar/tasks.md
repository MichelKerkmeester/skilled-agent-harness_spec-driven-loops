---
title: "Tasks: Retire the embedding sidecar execution path"
description: "Implementation task tracker for Delete the hf-local sidecar apparatus and collapse the execution router so hf-local flows through the direct factory-backed adapter like other providers, with one-release env deprecation shims."
trigger_phrases:
  - "retire sidecar tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/010-embedding-consolidation-hf-local-server/005-retire-sidecar"
    last_updated_at: "2026-05-29T12:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "All tasks complete; sidecar deleted; router collapsed; tsc green; 87 tests pass"
    next_safe_action: "Phase 006: skill-advisor shared wiring + env docs"
    blockers: []
    key_files:
      - "mcp_server/lib/embedders/execution-router.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000495"
      session_id: "029-005-tasks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Retire the embedding sidecar execution path

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

- [x] T001 Confirm predecessor handoff criteria from 004-launcher-supervision
- [x] T002 Inventory affected files and symbols before implementation
- [x] T003 [P] Identify focused tests to add or migrate
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Remove sidecar policy constants, maps, snapshots, shutdown/recycle helpers, and adapter branch [REQ-001]
- [x] T005 Route hf-local through the direct factory-backed adapter path [REQ-002]
- [x] T006 Delete obsolete sidecar client/worker/testables files [REQ-003]
- [x] T007 Keep SPECKIT_EMBEDDER_EXECUTION accepted-but-ignored with one-time logging [REQ-004]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T08 Migrate or remove sidecar tests around /api/health behavior [REQ-005]
- [x] T09 Run grep and focused execution-router/embedding tests [REQ-006]
- [x] T099 Run strict spec validation for this phase folder
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 tasks complete
- [x] No `[B]` blocked tasks remaining
- [x] Focused phase tests/static checks are green and predecessor/successor handoff is documented
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent packet**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->

