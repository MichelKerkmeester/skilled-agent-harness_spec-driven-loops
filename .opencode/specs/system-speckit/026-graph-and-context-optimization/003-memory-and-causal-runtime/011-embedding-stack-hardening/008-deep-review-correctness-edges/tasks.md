---
title: "Tasks: Deep-review correctness edges"
description: "Task tracker for re-validating and landing the isolated deep-review correctness findings."
trigger_phrases:
  - "deep review correctness edges tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/011-embedding-stack-hardening/008-deep-review-correctness-edges"
    last_updated_at: "2026-05-29T23:05:00Z"
    last_updated_by: "claude-opus"
    recent_action: "3 fixes landed + tested"
    next_safe_action: "Commit"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003183"
      session_id: "031-008-tasks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Deep-review correctness edges

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

- [x] T001 Re-validate all 7 deep-review correctness findings against HEAD (lines shifted post-sweep)
- [x] T002 Classify: land (DR-014/013/001-015), disposition (DR-002-P1-002 no-change, DR-017 already-fixed), route (others → 009)

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 DR-014 — `isStillExpired` in-tx re-check + testables export (memory-retention-sweep.ts) + unit test
- [x] T004 DR-013 — re-create adapter on cache-hit dim mismatch (execution-router.ts) + regression test
- [x] T005 DR-001/015 — prefer explicit EMBEDDINGS_PROVIDER in the cascade (auto-select.ts) + regression test

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Build both workspaces (exit 0)
- [x] T007 Run the 3 vitest suites: retention 10/10, execution-router 14/14, auto-selection 9/9
- [x] T008 Strict-validate packet; commit with explicit pathspecs

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] 3 fixes landed + tested; 2 findings dispositioned; cluster routed to 009

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Cluster (C3)**: ../009-single-writer-durability-cluster

<!-- /ANCHOR:cross-refs -->
