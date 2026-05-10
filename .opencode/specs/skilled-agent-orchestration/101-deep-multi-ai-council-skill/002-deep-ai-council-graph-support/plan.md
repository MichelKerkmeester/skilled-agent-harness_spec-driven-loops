---
title: "Implementation Plan: 101/002 Deep AI Council Graph Support"
description: "Plan council-specific graph support after the deep-ai-council skill boundary ships, with dedicated semantics, storage, query, convergence, readiness, and recovery validation."
trigger_phrases:
  - "101/002 plan"
  - "deep-ai-council graph plan"
  - "council graph support plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/101-deep-multi-ai-council-skill/002-deep-ai-council-graph-support"
    last_updated_at: "2026-05-10T06:45:00Z"
    last_updated_by: "openai-gpt-5.5-opencode"
    recent_action: "Authored future graph support plan"
    next_safe_action: "Wait for Phase 001 validation before graph implementation"
    blockers:
      - "Depends on Phase 001 skill boundary shipping first"
    key_files:
      - .opencode/skills/deep-ai-council/
      - .opencode/skills/system-spec-kit/mcp_server/database/
      - .opencode/skills/system-spec-kit/mcp_server/lib/
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "101-002-graph-support"
      parent_session_id: null
    completion_pct: 5
    open_questions:
      - "Should Phase 002 deliver design only first or include implementation after Phase 001 lands?"
    answered_questions:
      - "Do not reuse deep-loop graph as-is for council support."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: 101/002 Deep AI Council Graph Support

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, SQLite, Markdown, JSON |
| **Framework** | Spec Kit MCP server and future deep-ai-council skill references |
| **Storage** | Future council-specific graph database or deferred graph storage |
| **Testing** | Schema tests, query tests, convergence tests, readiness/recovery tests, spec validation |

### Overview
This phase plans graph support for `deep-ai-council` after the initial skill extraction is complete. The preferred future direction is a dedicated council graph or a documented deferral, not direct reuse of the existing deep-loop research/review graph.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 001 has validated the dedicated skill boundary and artifact contract.
- [ ] Existing deep-loop graph schema and readiness behavior have been reviewed.
- [ ] Council artifact schema and convergence needs are concrete enough to model.

### Definition of Done
- [ ] Graph option decision is recorded with rationale.
- [ ] Node kinds, edge relations, and convergence signals are defined.
- [ ] Storage, query, readiness, recovery, and migration plan is testable.
- [ ] Implementation, if approved, has targeted tests and rollback path.
- [ ] `validate.sh --strict` passes for this phase folder.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Dedicated council graph design with explicit deferral gates and no overloading of research/review coverage graph semantics.

### Key Components
- **Council graph store**: Future SQLite-backed graph for council sessions, seats, claims, evidence, disagreements, decisions, and recommendations.
- **Reducer**: Converts council artifact events into nodes and edges.
- **Query API**: Returns bounded graph context for synthesis, unresolved disagreements, evidence chains, and convergence state.
- **Convergence evaluator**: Computes council-specific stop/readiness signals.
- **Recovery layer**: Handles stale, missing, or corrupt graph state without returning false-safe empty answers.

### Data Flow
Council artifacts emit structured events, a reducer upserts council nodes and edges, query tools retrieve prompt-safe graph neighborhoods, and convergence logic summarizes agreement, dissent, evidence depth, and unresolved blockers.

### Affected Surfaces

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Deep-loop graph | Research/review coverage graph | Review only; do not reuse as-is | Schema inspection and decision record |
| MCP database layer | Stores graph data | Add council-specific storage only if selected | Migration and schema tests |
| Council skill references | Workflow owner | Add graph guidance after decision | sk-doc validation and skill tests |
| MCP tools | User-facing graph query surface | Add only if bounded and prompt-safe | Tool handler tests |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase is not a bug fix, but graph implementation would affect shared persistence and MCP response contracts.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| SQLite schemas | Persistent state | Add or defer council graph schema | Migration tests and rollback notes |
| MCP query handlers | Public tool responses | Add bounded council graph queries only if needed | Handler tests and prompt-safe output review |
| Convergence logic | Stop/readiness decisions | Add council-specific metrics | Unit tests for signal thresholds |
| Deep-loop graph | Existing coverage model | Keep separate unless an explicit adapter is designed | Tests prove no research/review regression |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm Phase 001 validation evidence exists.
- [ ] Review existing deep-loop graph schema, handlers, readiness behavior, and tests.
- [ ] Inventory council artifact events and fields created by `deep-ai-council`.

### Phase 2: Core Implementation
- [ ] Decide between dedicated council graph, adapted graph support, or continued deferral.
- [ ] Define node kinds, edge relations, and convergence signals.
- [ ] Design storage, reducer, query, readiness, and recovery contracts.
- [ ] Implement the selected graph support only if the design gate passes.

### Phase 3: Verification
- [ ] Test graph schema and migrations.
- [ ] Test reducer idempotency and invalid edge rejection.
- [ ] Test query bounds and prompt-safe responses.
- [ ] Test convergence threshold behavior.
- [ ] Run `validate.sh --strict` on this phase folder.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Schema | Tables, indexes, constraints, migrations | Vitest or MCP server test runner |
| Reducer | Event-to-graph upsert behavior | Unit tests with repeated events |
| Query | Prompt-safe graph retrieval | Handler tests with bounded fixtures |
| Convergence | Signal thresholds and blockers | Unit tests |
| Recovery | Missing/stale/corrupt graph state | Recovery tests and dry-run checks |
| Spec validation | Phase docs and metadata | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 skill boundary | Internal | Blocked until complete | Graph support cannot model stable artifacts before skill extraction lands |
| Existing deep-loop graph implementation | Internal reference | Available | Provides storage/recovery patterns but not reusable semantics |
| Council artifact schema | Internal | Pending Phase 001 | Node and edge design depends on actual artifact fields |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Council graph support couples to research/review semantics, returns unsafe partial context, or fails migration/recovery tests.
- **Procedure**: Disable or remove council graph tooling, keep file-based council artifacts as the source of truth, and retain Phase 002 as design documentation until a safer graph model is ready.
<!-- /ANCHOR:rollback -->
