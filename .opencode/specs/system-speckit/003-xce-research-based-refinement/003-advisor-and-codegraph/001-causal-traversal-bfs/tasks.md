---
title: "Tasks: Causal Traversal BFS Read Path"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "012-causal-traversal-bfs tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/003-xce-research-based-refinement/003-advisor-and-codegraph/001-causal-traversal-bfs"
    last_updated_at: "2026-06-10T20:30:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "All traversal replacement tasks completed and verified"
    next_safe_action: "No in-scope implementation work remains"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-012-causal-traversal-bfs"
      parent_session_id: null
    completion_pct: 100
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

- [x] T001 Capture live-DB fixture (edges at measured scale, degree distribution). Evidence: new vitest fixture uses 10,240 causal edges, max degree 20, seeds 5, hops 2.
- [x] T002 Equivalence harness: record current CTE outputs as snapshots. Evidence: `causal-traversal-bfs-equivalence.vitest.ts` compares current CTE output to BFS output exactly.
- [x] T003 [P] Traversal helper: hop-capped weighted walk mode. Evidence: `collectCausalWeightedNeighbors` in `lib/graph/bfs-traversal.ts`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] Traversal helper: directed unbounded reachability mode. Evidence: `collectDependencyReachability` in `lib/graph/bfs-traversal.ts`.
- [x] T005 getNeighborBoosts cutover behind engine flag. Evidence: equivalence suite passed, then `getNeighborBoosts` now calls the shared helper with CTE removed from source.
- [x] T006 memo.ts collectDependents + wouldCreateCycle cutover with zero-row fast path. Evidence: new test spies `prepare` after store construction and confirms zero SELECTs for first insert into an empty edge table.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Equivalence suite green across fixtures. Evidence: `npx vitest run tests/causal-traversal-bfs-equivalence.vitest.ts --reporter verbose` passed 4/4 tests.
- [x] T008 Latency benchmark vs CTE recorded. Evidence: fixture_edges=10240, max_degree=20, seeds=5, hops=2, CTE=1.429ms, BFS=1.117ms.
- [x] T009 Remove flag; delete CTE paths. Evidence: source grep for `WITH RECURSIVE` in `mcp_server/lib` returned no matches.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
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
