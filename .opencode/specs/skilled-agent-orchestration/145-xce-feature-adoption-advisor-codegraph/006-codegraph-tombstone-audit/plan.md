---
title: "Implementation Plan: Phase 6: codegraph-tombstone-audit"
description: "Bounded default-off tombstone audit lineage for code-graph stale node and edge cleanup."
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
    packet_pointer: "skilled-agent-orchestration/145-xce-feature-adoption-advisor-codegraph/006-codegraph-tombstone-audit"
    last_updated_at: "2026-06-10T23:00:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Implemented default-off tombstone audit and verification"
    next_safe_action: "No implementation action remains"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts"
      - ".opencode/skills/system-code-graph/mcp_server/handlers/scan.ts"
      - ".opencode/skills/system-code-graph/mcp_server/handlers/status.ts"
      - ".opencode/skills/system-code-graph/mcp_server/tests/code-graph-tombstones.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/006-codegraph-tombstone-audit"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 6: codegraph-tombstone-audit

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
Implemented a feature-flagged tombstone audit table for code-graph stale cleanup. The table is created only when `SPECKIT_CODE_GRAPH_TOMBSTONES=true`, is bounded by `SPECKIT_CODE_GRAPH_TOMBSTONE_LIMIT`, and is summarized through scan/status without changing live graph queries.
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
- [x] Tests passing: typecheck, build, tombstone/db/scan/status vitest suites
- [x] Docs updated: spec, plan, tasks, implementation summary
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Feature-flagged audit side table with bounded retention.

### Key Components
- **`code_graph_tombstones` table**: Stores retained file/node/edge deletion rows only when tombstones are enabled.
- **Delete-site audit helpers**: Capture reasons at node replacement, edge replacement, dangling-edge pruning, file removal, and orphan cleanup.
- **Scan/status summaries**: Surface retained tombstone counts and recent reasons without making status mutate the DB.

### Data Flow
When enabled, delete paths insert minimal tombstone rows before hard-deleting live graph rows. The retention prune keeps only the newest configured rows, and `getStats()` exposes the retained summary for scan and status responses.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `lib/code-graph-db.ts` | Owns SQLite schema, hard-delete paths, and stats | Added flag-gated tombstone schema, reason capture, retention prune, and stats summary | `code-graph-tombstones.vitest.ts`, `code-graph-db.vitest.ts`, typecheck |
| `handlers/scan.ts` | Removes missing tracked files during incremental/full scans | Passes explicit cleanup reasons and returns tombstone summary | `code-graph-scan.vitest.ts` |
| `handlers/status.ts` | Reports graph health and counts | Adds read-only tombstone summary from stats | `code-graph-status-readiness-snapshot.vitest.ts` |

Required inventories completed:
- Delete producers: `replaceNodes`, `replaceEdges`, `pruneDanglingEdges`, `removeFile`, `cleanupOrphans`.
- Consumers: `handleCodeGraphScan`, `handleCodeGraphStatus`, and existing live query functions.
- Invariant: tombstones live outside `code_nodes` and `code_edges`, so live queries cannot include tombstoned rows.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Reused existing code-graph package and temp DB test patterns
- [x] No package/dependency changes required
- [x] Verification commands identified from `package.json`

### Phase 2: Core Implementation
- [x] Added default-off tombstone audit helpers and bounded retention
- [x] Captured deletion reasons at scoped cleanup paths
- [x] Surfaced tombstone summary through scan/status

### Phase 3: Verification
- [x] New tombstone tests cover default-off, enabled lineage, retention pruning, and query isolation
- [x] Existing DB/scan/status suites pass
- [x] Phase docs updated and ready for strict validation
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Tombstone retention, lineage, default-off behavior, live-query isolation | vitest |
| Integration | Scan cleanup reason propagation and status read-only summary | vitest |
| Build | TypeScript compile and package build | `npm run typecheck`, `npm run build` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing code-graph SQLite package | Internal | Green | Required for audit table and temp DB tests |
| Operator env flag `SPECKIT_CODE_GRAPH_TOMBSTONES` | Runtime config | Green | Keeps tombstones disabled by default |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Tombstone summaries cause status regressions, live query changes, or unacceptable DB growth in opt-in environments.
- **Procedure**: Leave `SPECKIT_CODE_GRAPH_TOMBSTONES` unset to preserve current hard-delete behavior; revert the scoped code changes if the opt-in path is rejected.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
