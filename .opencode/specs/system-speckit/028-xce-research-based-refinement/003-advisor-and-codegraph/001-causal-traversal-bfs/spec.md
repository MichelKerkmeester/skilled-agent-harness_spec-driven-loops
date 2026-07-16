---
title: "Feature Specification: Causal Traversal BFS Read Path"
description: "Replace the two recursive-CTE graph traversals with a shared app-level BFS helper: the current CTE join condition defeats index use, and the memo path queries empty tables on every insert."
trigger_phrases:
  - "causal traversal bfs"
  - "recursive cte replacement"
  - "neighbor boost traversal"
  - "memo cycle check"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/003-advisor-and-codegraph/001-causal-traversal-bfs"
    last_updated_at: "2026-06-10T20:30:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Shared BFS traversal helper shipped and verified"
    next_safe_action: "Monitor out-of-scope alignment drift in canonical-fingerprint.ts separately"
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
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Causal Traversal BFS Read Path

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-10 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-spec-kit/027-xce-research-based-refinement |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The only two WITH RECURSIVE consumers in the memory backend are read paths with measurable inefficiencies. getNeighborBoosts (lib/search/causal-boost.ts:431) recurses with ON ce.source_id = cw.node_id OR ce.target_id = cw.node_id, which prevents single-index use on every hop; the live graph measured 10,240 causal edges with max degree 22, so an indexed two-query-per-hop BFS is estimated at 0.5-2ms - at or below the CTE. collectDependents (lib/storage/memo.ts:192) runs an unbounded recursive CTE and wouldCreateCycle fires per insert, yet dependency_edges and memoization_records both held zero rows when measured (2026-06-10). Source evidence: z_future/sqlite-to-turso research.md gap 6 and 004 - gap-alternatives.md section 4.

### Purpose
One shared, snapshot-equivalence-tested BFS traversal helper serves both call sites, removing the recursive-SQL dependency while making the hot read path faster and the dormant memo path effectively free.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Shared traversal helper (hop-capped weighted walk + directed unbounded reachability modes)
- getNeighborBoosts cutover with snapshot-equivalence tests against current CTE output (MIN hop, MAX walk_score, seed exclusion semantics preserved)
- collectDependents + wouldCreateCycle cutover with zero-row fast-path guards
- Live-DB fixture corpus for equivalence and latency comparison

### Out of Scope
- Causal WRITE lifecycle (tombstones, promoter, reconciliation) - owned by phase 003
- Closure/transitive-closure tables - rejected with evidence (undirected 97% generic-edge closure approaches all-pairs; trigger-maintained DELETE is the hard case)
- Persistent adjacency cache - deferred behind a >100k-edge or profiler trigger (pattern exists in community-detection.ts buildAdjacencyList)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/lib/search/causal-boost.ts` | Modify | getNeighborBoosts uses the BFS helper |
| `mcp_server/lib/storage/memo.ts` | Modify | collectDependents/wouldCreateCycle use the helper + empty-table guards |
| `mcp_server/lib/graph/` (new traversal helper) | Create | Shared BFS module with both traversal modes |
| `mcp_server/tests/` | Create | Snapshot-equivalence + latency tests |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | BFS output is equivalence-tested against the current CTE output on a live-DB fixture (per-node MIN hop, MAX walk_score, seeds excluded, relation weighting) | Equivalence suite green; any divergence is a test failure, not a tolerance |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | memo.ts paths use the shared helper with a zero-row fast path (no per-insert query when dependency_edges is empty) | Guard verified by test; per-insert overhead measured |
| REQ-003 | Traversal latency at the live corpus is at or below the current CTE | Benchmark recorded in implementation-summary with the fixture sizes |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: BFS replaces both recursive CTEs with zero retrieval-behavior change (equivalence suite green).
- **SC-002**: Hot-path traversal p95 at or below current CTE on the live-size fixture.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Walk-score semantics drift (per-walk max vs per-pair) | Med | Snapshot-equivalence suite is the gate; CTE stays behind a flag until green |
| Dependency | Phase 003 touches causal write paths | Low | This phase is read-path only; coordinate merge order with 003 children |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the adjacency-cache upgrade trigger (>100k edges) be wired as a health-counter alert now or left to profiling?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
