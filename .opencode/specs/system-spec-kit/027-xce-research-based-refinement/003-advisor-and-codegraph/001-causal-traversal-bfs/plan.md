---
title: "Implementation Plan: Causal Traversal BFS Read Path [template:level_1/plan.md]"
description: "Build one shared BFS traversal helper (hop-capped weighted walk + directed unbounded reachability), prove output equivalence against the two recursive CTEs on a live-DB fixture, then cut both call sites over with empty-table fast paths."
trigger_phrases:
  - "012-causal-traversal-bfs plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/003-advisor-and-codegraph/001-causal-traversal-bfs"
    last_updated_at: "2026-06-10T20:30:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Plan executed; BFS helper replaces recursive traversal consumers"
    next_safe_action: "No phase follow-up required; out-of-scope alignment drift remains reported only"
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
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Causal Traversal BFS Read Path

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (mcp_server), better-sqlite3 |
| **Framework** | Spec Kit Memory MCP daemon |
| **Storage** | SQLite (context-index + vector shards) |
| **Testing** | vitest + eval harness fixtures |

### Overview
Build one shared BFS traversal helper (hop-capped weighted walk + directed unbounded reachability), prove output equivalence against the two recursive CTEs on a live-DB fixture, then cut both call sites over with empty-table fast paths.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Surgical refinement of existing mcp_server modules; additive and flag-gated until verification gates pass.

### Key Components
- **Traversal helper (lib/graph)**: Both BFS modes; pure functions over an edge reader
- **Equivalence harness**: CTE-vs-BFS snapshot comparison on fixtures

### Data Flow
causal-boost/memo call sites -> traversal helper -> two indexed flat queries per hop -> merged results identical to CTE output.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not a bug-fix packet; surfaces and verification live in the spec Files-to-Change table and the phase checklist below. No security/path/schema-boundary findings in scope.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| See spec.md Files to Change | Read/write paths named there | Modify/Create per spec | Tests + benchmarks listed in Phase 3 |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Fixture corpus captured from live DB shapes
- [x] Equivalence harness runs current CTEs

### Phase 2: Core
- [x] Traversal helper with both modes
- [x] getNeighborBoosts cut over after equivalence suite passed
- [x] memo.ts cutover + zero-row guards

### Phase 3: Verification
- [x] Equivalence suite green
- [x] Latency benchmark recorded
- [x] Flag removed
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | New/changed modules | vitest |
| Integration | End-to-end path on fixtures | vitest + fixture DBs |
| Benchmark | Latency/RAM gates named in spec | recorded in implementation-summary |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 003 (causal write lifecycle) | Internal | Pending | Coordinate merge order; read-path only here |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Verification gate failure or behavior drift.
- **Procedure**: Engine flag restores the CTE paths; helper is additive until the final task.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
