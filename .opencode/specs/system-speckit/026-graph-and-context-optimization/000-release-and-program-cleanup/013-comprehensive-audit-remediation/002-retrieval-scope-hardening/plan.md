---
title: "Implementation Plan: Phase 2: retrieval-scope-hardening [template:level_1/plan.md]"
description: "Apply minimal fail-closed scope, FK, and session-trust checks to four retrieval/causal handlers in the Spec Kit Memory MCP server, preserving unscoped single-user behavior."
trigger_phrases:
  - "retrieval scope plan"
  - "causal graph hardening"
  - "session trust gate"
  - "fail closed scope"
  - "fk existence check"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/013-comprehensive-audit-remediation/002-retrieval-scope-hardening"
    last_updated_at: "2026-06-04T20:45:41Z"
    last_updated_by: "implementation-engineer"
    recent_action: "Authored plan for B1-B5"
    next_safe_action: "Defer mcp_server tsc and vitest to central verification"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/002-retrieval-scope-hardening"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: retrieval-scope-hardening

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node, MCP server) |
| **Framework** | Spec Kit Memory MCP handlers |
| **Storage** | SQLite (better-sqlite3), `memory_index` + `causal_edges` |
| **Testing** | Vitest |

### Overview
Each finding gets a surgical, fail-closed check. The governance helper `createScopeFilterPredicate`/`filterRowsByScope` (which excludes sessionId from row access) drives the scope filters. Session trust reuses the existing `resolveTrustedSession`. The no-session anchor mixes the normalized scope into the existing process-id hash only when scope is supplied.
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
- [x] Tests authored (run deferred to central)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Handler-boundary guard. Authorization and existence checks live in the production handler, not in shared storage primitives.

### Key Components
- **scope-governance**: `filterRowsByScope` / `createScopeFilterPredicate` enforce `{tenantId, userId, agentId}`; sessionId is intentionally not a boundary.
- **session-manager**: `resolveTrustedSession` validates caller sessionId and mints fresh ids for no-session callers.

### Data Flow
Caller args -> handler reads `memory_index` rows with scope columns -> predicate denies out-of-scope rows / rejects missing endpoints / rejects forged sessions -> downstream traversal/write/dedup uses only authorized state.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| memory-search.ts community fallback | producer of fallback rows | update: select scope cols + filterRowsByScope | community-search.vitest.ts |
| memory-search.ts sessionId | consumer of caller session | update: resolveTrustedSession gate | gate-d-regression-session-dedup.vitest.ts |
| causal-graph.ts drift-why / causal-link | producer/policy on bare ids | update: scope post-filter + FK check | handler-causal-graph.vitest.ts |
| memory-context.ts no-session anchor | policy for continuity id | update: scope-mixed hash when scoped | session-lifecycle.vitest.ts |
| lib/storage/causal-edges.ts insertEdge | shared storage primitive | unchanged (FK deferral preserved) | causal-edges-unit.vitest.ts unaffected |
| tool-input-schemas (cluster D) | schema boundary | not a consumer here; cluster D adds scope fields | cross-cluster note |

Required inventories:
- Same-class producers: scope filter callers in `stage1-candidate-gen.ts` use the identical `{tenantId,userId,agentId}` contract.
- Consumers of changed symbols: `rg -n 'filterRowsByScope|createScopeFilterPredicate|resolveTrustedSession' handlers`.
- Matrix axes: scoped vs unscoped; matching vs mismatching; existing vs missing endpoint; tracked vs forged sessionId.
- Algorithm invariant: sessionId is never a row-access boundary; deny on mismatch returns the same empty/error shape as legitimate empty results.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read backlog findings B1-B5 and target files
- [x] Confirm governance helper and session-manager contracts
- [x] Confirm sessionId is excluded from the scope boundary

### Phase 2: Core Implementation
- [x] B1 community fallback scope filter (memory-search.ts)
- [x] B4 session-trust gate (memory-search.ts)
- [x] B2 + B3 scope post-filter + FK existence check (causal-graph.ts)
- [x] B5 scope-derived no-session anchor (memory-context.ts)

### Phase 3: Verification
- [x] Author/extend the four vitest files
- [x] Read-back compile-safety review (mcp_server tsc/vitest deferred to central)
- [x] validate.sh strict passes
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | scope filter, FK existence, session trust, anchor derivation | Vitest |
| Integration | causal-graph handler with real in-memory DB | Vitest + better-sqlite3 |
| Manual | read-back review of each diff | n/a |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Cluster D schema fields | Internal | Yellow | B2 unreachable by real MCP traffic until added |
| scope-governance helpers | Internal | Green | Required for B1/B2 |
| session-manager resolveTrustedSession | Internal | Green | Required for B4 |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any fix regresses unscoped single-user retrieval or breaks synthetic-id causal tests.
- **Procedure**: Revert the specific handler edit; the helpers and schemas are untouched, so reverts are isolated per finding.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
