---
title: "Feature Specification: Phase 2: retrieval-scope-hardening [template:level_1/spec.md]"
description: "Retrieval and causal-graph surfaces leaked rows across governance boundaries and trusted forged session ids. This phase fail-closes the community fallback, causal-graph traversal/link, search session trust, and no-session continuity anchoring."
trigger_phrases:
  - "retrieval scope"
  - "governance boundary"
  - "causal graph scope"
  - "session trust"
  - "community fallback"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/000-release-and-program-cleanup/013-comprehensive-audit-remediation/002-retrieval-scope-hardening"
    last_updated_at: "2026-06-04T20:45:41Z"
    last_updated_by: "implementation-engineer"
    recent_action: "Implemented B1-B5 retrieval-scope hardening fixes"
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
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: retrieval-scope-hardening

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-04 |
| **Branch** | `scaffold/002-retrieval-scope-hardening` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 7 |
| **Predecessor** | 001-deep-loop-fanout-reliability |
| **Successor** | 003-memory-write-correctness |
| **Handoff Criteria** | All five findings fail-closed; tests authored; verification deferred to central |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the comprehensive audit remediation specification.

**Scope Boundary**: Retrieval and causal-graph handlers in the Spec Kit Memory MCP server. The governance boundary enforced here is `{tenantId, userId, agentId}` only; `sessionId` is a dedup/continuity key, never a row-access boundary. Tool input schemas (cluster D) and `lib/storage/causal-edges.ts insertEdge` are out of scope.

**Dependencies**:
- Cluster D must add optional `tenantId`/`userId`/`agentId` to the `memory_drift_why` and `memory_causal_link` input schemas so B2 is reachable by real MCP traffic. The handler code here is correct regardless of that schema work.

**Deliverables**:
- B1: community-search fallback respects governed scope.
- B2: causal-graph drift-why and causal-link post-filter on scope (fail-closed).
- B3: causal-link rejects edges whose endpoints are absent from `memory_index`.
- B4: `memory_search` validates caller `sessionId` through `resolveTrustedSession`.
- B5: no-session callers with distinct scopes get distinct continuity anchors.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Four retrieval/causal surfaces bypassed governed retrieval scope or trusted forged identity. The community-search fallback fetched member rows with no tenant/user/agent filter; the causal-graph drift-why and causal-link handlers traversed and wrote edges on bare ids without scope checks; `memory_search` consumed a caller-supplied `sessionId` without validating it through `resolveTrustedSession`; and no-session callers collapsed onto a single process-wide session bucket. Causal-link also created orphan edges because FK existence was never checked at the handler boundary.

### Purpose
Apply minimal, fail-closed scope/FK/session checks so retrieval and causal surfaces honor the `{tenantId, userId, agentId}` boundary and reject forged sessions, without changing single-user (unscoped) behavior.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Community-search fallback scope filter in `memory-search.ts` (B1).
- Causal-graph scope post-filter + FK existence check in `causal-graph.ts` (B2, B3).
- `memory_search` session-trust gate in `memory-search.ts` (B4).
- No-session continuity anchor derivation in `memory-context.ts` (B5).

### Out of Scope
- Tool input schemas (`tool-schemas.ts` / `tool-input-schemas.ts`) - owned by cluster D.
- `lib/storage/causal-edges.ts insertEdge` and its FK-deferral comment - 20+ synthetic-id tests depend on it; FK validation lives in the handler instead.
- Any new auth/multi-tenant infrastructure - threat model is local single-user; only minimal fail-closed changes apply.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts | Modify | B1 community-scope filter + B4 session-trust gate |
| .opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts | Modify | B2 scope post-filter + B3 FK existence check |
| .opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts | Modify | B5 scope-derived no-session anchor |
| .opencode/skills/system-spec-kit/mcp_server/tests/community-search.vitest.ts | Modify | B1 scope-filter cases |
| .opencode/skills/system-spec-kit/mcp_server/tests/handler-causal-graph.vitest.ts | Modify | B2/B3 scope + FK cases |
| .opencode/skills/system-spec-kit/mcp_server/tests/gate-d-regression-session-dedup.vitest.ts | Modify | B4 session-trust cases |
| .opencode/skills/system-spec-kit/mcp_server/tests/session-lifecycle.vitest.ts | Modify | B5 anchor-isolation cases |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No scope regression for single-user unscoped callers | All five fixes are no-ops when no governance scope/sessionId is supplied |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | B1: community fallback filters member rows by scope | SELECT also returns tenant/user/agent; rows filtered by `filterRowsByScope` when scope present |
| REQ-003 | B2: causal-graph denies out-of-scope traversal/link | drift-why returns empty on source mismatch; causal-link rejects on endpoint mismatch |
| REQ-004 | B3: causal-link rejects non-existent endpoints | Missing source/target in `memory_index` returns an error; no edge created |
| REQ-005 | B4: memory_search validates sessionId trust | Forged sessionId returns E_SESSION_SCOPE; omitted sessionId unchanged |
| REQ-006 | B5: distinct scopes get distinct no-session anchors | Two distinct scopes derive different anchors; identical/no scope stays stable |
| REQ-007 | Tests authored for each finding | Cases added to the four named vitest files |
| REQ-008 | Cross-cluster note delivered to cluster D | Schema fields requirement recorded for `memory_drift_why`/`memory_causal_link` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Each B1-B5 fix is fail-closed under scope and a no-op when unscoped.
- **SC-002**: New vitest cases assert deny-on-mismatch and unchanged-when-unscoped behavior; validate.sh passes with zero errors.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Cluster D schema fields | B2 dead for real MCP traffic until added | Handler code correct now; note handed to cluster D |
| Risk | Over-aggressive B5 change regresses single-user resume continuity | Med | Scope-locked to the explicitly-scoped multi-caller case; env override + bare process id preserved |
| Risk | FK check placed in shared insertEdge | High | Placed at handler boundary only; 20+ synthetic-id tests untouched |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. All five findings were verified against the working tree before implementation.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
