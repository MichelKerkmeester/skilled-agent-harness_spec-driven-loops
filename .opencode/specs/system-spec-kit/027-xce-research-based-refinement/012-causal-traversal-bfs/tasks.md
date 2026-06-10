---
title: "Tasks: Causal Traversal BFS Read Path [template:level_1/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "012-causal-traversal-bfs tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/012-causal-traversal-bfs"
    last_updated_at: "2026-06-10T19:30:00Z"
    last_updated_by: "claude-fable-5"
    recent_action: "Task list scaffolded from revalidation findings"
    next_safe_action: "Start T001 when this phase is picked up"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-012-causal-traversal-bfs"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Causal Traversal BFS Read Path

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

- [ ] T001 Capture live-DB fixture (edges at measured scale, degree distribution)
- [ ] T002 Equivalence harness: record current CTE outputs as snapshots
- [ ] T003 [P] Traversal helper: hop-capped weighted walk mode
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 [P] Traversal helper: directed unbounded reachability mode
- [ ] T005 getNeighborBoosts cutover behind engine flag
- [ ] T006 memo.ts collectDependents + wouldCreateCycle cutover with zero-row fast path
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Equivalence suite green across fixtures
- [ ] T008 Latency benchmark vs CTE recorded
- [ ] T009 Remove flag; delete CTE paths
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
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
