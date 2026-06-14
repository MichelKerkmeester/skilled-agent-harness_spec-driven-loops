---
title: "Implementation Plan: Phase 7: codegraph-bfs-consolidation [template:level_1/plan.md]"
description: "Completed plan for consolidating code-graph transitive symbol traversal and blast-radius traversal onto one local BFS helper without response drift."
trigger_phrases:
  - "implementation"
  - "plan"
  - "name"
  - "template"
  - "plan core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph/007-codegraph-bfs-consolidation"
    last_updated_at: "2026-06-10T21:12:38Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Implemented shared BFS helper and call-site cutovers"
    next_safe_action: "Keep future traversal changes covered by helper and query-handler tests"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/mcp_server/lib/graph/bfs-traversal.ts"
      - ".opencode/skills/system-code-graph/mcp_server/handlers/query.ts"
      - ".opencode/skills/system-code-graph/mcp_server/tests/bfs-traversal.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/007-codegraph-bfs-consolidation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 7: codegraph-bfs-consolidation

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
| **Language/Stack** | TypeScript (Node) |
| **Framework** | mk_code_index MCP daemon |
| **Storage** | code-graph SQLite (AST index) |
| **Testing** | vitest |

### Overview
Code-graph now uses one local BFS helper for transitive symbol traversal and blast-radius traversal. The plan intentionally avoided scan/status/database changes and preserved existing query response shapes, warnings, depth truncation, and limit fallback semantics.
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
- [x] Tests passing: typecheck, build, helper tests, and query-handler traversal tests
- [x] Docs updated: spec, plan, tasks, implementation summary, metadata
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Local library helper extraction with behavior-preserving call-site cutover.

### Key Components
- **`lib/graph/bfs-traversal.ts`**: Owns shared BFS queueing, visit timing, result caps, dangling collection, and depth-truncation signals.
- **`handlers/query.ts`**: Maps code-graph symbol and file dependency semantics into the helper and keeps existing response payloads unchanged.
- **`tests/bfs-traversal.vitest.ts`**: Pins helper-level behavior for cap handling, dangling reporting, boundary truncation, and traversal through non-result nodes.

### Data Flow
Relationship and blast-radius queries resolve subjects as before. The handler builds traversal neighbors from existing graph DB query functions, calls the local BFS helper, then maps helper output back into the same `nodes`, `warnings`, `depthTruncated`, and `failureFallback` payloads already covered by the query-handler tests.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `lib/graph/bfs-traversal.ts` | New code-graph-local traversal helper | Created | `bfs-traversal.vitest.ts` passes 3 helper tests |
| `handlers/query.ts` transitive traversal | Produces relationship transitive nodes and dangling warnings | Cut over to helper | `code-graph-query-handler.vitest.ts` transitive tests unchanged |
| `handlers/query.ts` blast radius | Produces affected files, depth groups, depth truncation, and limit fallback | Cut over to helper | `code-graph-query-handler.vitest.ts` blast-radius tests unchanged |

Required inventories:
- Same-class producers checked in `handlers/query.ts`: transitive symbol traversal and blast-radius traversal were the only app-level BFS loops in scope.
- Consumers checked through direct imports: `traverseGraphBfs` is local to code-graph and imported by `handlers/query.ts` plus helper tests only.
- Matrix axes covered: visit timing, depth boundary inspection, result cap, dangling neighbor, and non-result traversal node.
- Algorithm invariant: helper may centralize traversal mechanics, but handler output shape and ordering remain owned by existing query mapping code.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read phase scaffold and existing query-handler traversal tests
- [x] Confirmed no dependency or package changes were needed
- [x] Confirmed code-graph-local helper path under `mcp_server/lib/graph/`

### Phase 2: Core Implementation
- [x] Added shared `traverseGraphBfs` helper
- [x] Repointed transitive symbol traversal to the helper
- [x] Repointed blast-radius traversal to the helper
- [x] Added helper tests for cap, dangling, truncation, and non-result traversal semantics

### Phase 3: Verification
- [x] `npm run typecheck`
- [x] `npm run build`
- [x] `npx vitest run mcp_server/tests/bfs-traversal.vitest.ts mcp_server/tests/code-graph-query-handler.vitest.ts`
- [x] Comment hygiene and alignment drift checks
- [x] Documentation updated
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Shared BFS helper | Vitest |
| Handler regression | Query handler transitive and blast-radius behavior | Vitest |
| Static | TypeScript compile and OpenCode hygiene | `tsc`, build, comment hygiene, alignment drift |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing code-graph DB APIs | Internal | Green | Helper consumes existing query functions only; no database schema or live DB changes |
| Vitest query-handler coverage | Internal | Green | Existing behavior-preservation tests stayed unchanged and passed |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any output drift in `code-graph-query-handler.vitest.ts`, TypeScript build failure, or helper test failure.
- **Procedure**: Revert the helper import and restore the two local BFS loops in `handlers/query.ts`; remove `lib/graph/bfs-traversal.ts` and its helper test.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
