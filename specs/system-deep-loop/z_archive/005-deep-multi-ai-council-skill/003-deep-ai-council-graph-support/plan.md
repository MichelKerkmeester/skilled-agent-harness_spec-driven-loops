---
title: "Implementation Plan: 101/003 Deep AI Council Graph Support"
description: "Implement council-specific graph support after the deep-ai-council skill boundary shipped, with dedicated derived semantics, storage, query, convergence, readiness, and recovery validation."
trigger_phrases:
  - "101/003 plan"
  - "deep-ai-council graph plan"
  - "council graph support plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/005-deep-multi-ai-council-skill/003-deep-ai-council-graph-support"
    last_updated_at: "2026-05-11T05:20:00Z"
    last_updated_by: "openai-gpt-5.5-opencode"
    recent_action: "Fixed deep-review findings and updated verification plan evidence"
    next_safe_action: "Run final verification and report outcome"
    blockers: []
    key_files:
      - .opencode/skills/deep-ai-council/
      - .opencode/skills/system-spec-kit/mcp_server/lib/council-graph/
      - .opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "101-003-graph-support"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Do not reuse deep-loop graph as-is for council support."
      - "The council graph is a dedicated derived projection from packet artifacts."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: 101/003 Deep AI Council Graph Support

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, SQLite, Markdown, JSON |
| **Framework** | Spec Kit MCP server and future deep-ai-council skill references |
| **Storage** | Dedicated council graph SQLite database as a derived projection from `ai-council/**` artifacts |
| **Testing** | Schema tests, query tests, convergence tests, readiness/recovery tests, spec validation |

### Overview
This phase implements graph support for `deep-ai-council` after the initial skill extraction and reference expansion completed. The selected direction is a dedicated council graph, not direct reuse of the existing deep-loop research/review graph.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 001 validated the dedicated skill boundary and artifact contract.
- [x] Phase 002 expanded council references and preserved graph work as this packet.
- [x] Existing deep-loop graph schema and readiness behavior have been reviewed.
- [x] Council artifact schema and convergence needs are concrete enough to model.

### Definition of Done
- [x] Graph option decision is recorded with rationale.
- [x] Node kinds, edge relations, and convergence signals are defined.
- [x] Storage, query, readiness, recovery, and migration plan is testable.
- [x] Implementation has targeted tests and rollback path.
- [x] `validate.sh --strict` passes for this phase folder.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Dedicated council graph implementation with no overloading of research/review coverage graph semantics. Council graph rows are derived index rows; packet-local `ai-council-state.jsonl` and artifacts remain authoritative.

### Key Components
- **Council graph store**: SQLite-backed graph for council sessions, rounds, seats, claims, evidence, disagreements, decisions, and recommendations.
- **Reducer/upsert API**: Converts council artifact events into nodes and edges without rewriting historical state rows.
- **Query API**: Returns bounded graph context for synthesis, unresolved disagreements, evidence chains, and convergence state.
- **Convergence evaluator**: Computes council-specific stop/readiness signals.
- **Recovery layer**: Handles stale, missing, or corrupt graph state without returning false-safe empty answers.

### Data Flow
Council artifacts remain source-of-truth. A reducer or caller upserts derived council nodes and edges, query tools retrieve prompt-safe graph neighborhoods, and convergence logic summarizes agreement, dissent, evidence depth, confidence, and unresolved blockers.

### Affected Surfaces

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Deep-loop graph | Research/review coverage graph | Review only; do not reuse as-is | Schema inspection and decision record |
| MCP database layer | Stores graph data | Add dedicated council graph database | Migration and schema tests |
| Council skill references | Workflow owner | Add derived graph guidance and transition out of old out-of-scope wording | sk-doc validation and skill tests |
| MCP tools | User-facing graph query surface | Add bounded council graph tools | Tool handler tests |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase is not a bug fix, but graph implementation would affect shared persistence and MCP response contracts.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| SQLite schemas | Derived graph index | Add dedicated council graph schema | Migration tests and rollback notes |
| MCP query handlers | Public tool responses | Add bounded council graph queries | Handler tests and prompt-safe output review |
| Convergence logic | Stop/readiness decisions | Add council-specific metrics | Unit tests for signal thresholds |
| Deep-loop graph | Existing coverage model | Keep separate; reuse patterns only | Tests prove no research/review regression |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm Phase 001 and 002 validation evidence exists.
- [x] Review existing deep-loop graph schema, handlers, readiness behavior, and tests.
- [x] Inventory council artifact events and fields created by `deep-ai-council`.

### Phase 2: Core Implementation
- [x] Decide between dedicated council graph, adapted graph support, or continued deferral.
- [x] Define node kinds, edge relations, and convergence signals.
- [x] Design storage, reducer, query, readiness, and recovery contracts.
- [x] Implement the selected graph support.

### Phase 3: Verification
- [x] Test graph schema and migrations.
- [x] Test reducer idempotency and invalid edge rejection.
- [x] Test query bounds and prompt-safe responses.
- [x] Test convergence threshold behavior.
- [x] Run `validate.sh --strict` on this phase folder.
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
| Deep review remediation | Empty upsert, CONTINUE branch, hostile metadata, recovery payload | Council graph Vitest fixtures |
| Spec validation | Phase docs and metadata | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 skill boundary | Internal | Complete | Graph support can rely on stable skill package and artifacts |
| Existing deep-loop graph implementation | Internal reference | Available | Provides storage/recovery patterns but not reusable semantics |
| Council artifact schema | Internal | Available | Node and edge design derives from current artifact/state references |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Council graph support couples to research/review semantics, returns unsafe partial context, or fails migration/recovery tests.
- **Procedure**: Disable or remove council graph tooling, keep file-based council artifacts as the source of truth, and retain Phase 003 decision documentation until a safer graph model is ready. Because graph rows are derived, they can be deleted and replayed from `ai-council/**` artifacts.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 001 and Phase 002 completion evidence | Core implementation |
| Core Implementation | Setup, ADR-001 accepted | Verification |
| Verification | Core implementation, docs updated | Completion claim |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | Complete |
| Core Implementation | High | Complete |
| Verification | Medium | Complete |
| **Total** | | **Single packet implementation pass** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Graph rows documented as derived data.
- [x] Tool surface isolated under `council_graph_*`.
- [x] Artifact authority preserved in `ai-council/**` guidance.

### Rollback Procedure
1. Remove `council_graph_*` tool registrations and handlers.
2. Delete `council-graph.sqlite` or namespace-scoped rows for the affected `specFolder` and `sessionId` if derived rows should be discarded.
3. Continue using packet-local `ai-council/**` artifacts as the source of truth.
4. Re-run targeted MCP tests and strict spec validation.

### Data Reversal
- **Has data migrations?** Yes, a dedicated derived SQLite schema.
- **Reversal procedure**: Delete derived council graph rows/database and replay from council artifacts when re-enabled.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
Phase 001 skill boundary -> Phase 002 references -> Phase 003 council graph
                                    |                         |
                                    v                         v
                            ai-council artifacts      council_graph_* tools
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Council artifacts | Phase 001 skill boundary | Source-of-truth state | Derived graph replay |
| Council graph store | Artifact contract and ADR-001 | SQLite projection | Query/status/convergence handlers |
| MCP handlers | Store/query helpers and schemas | `council_graph_*` responses | Council graph use by callers |
| Skill references | Tool behavior and rollback contract | Usage guidance | Safe adoption |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Decide dedicated graph path** - Complete - CRITICAL
2. **Implement store, handlers, schemas, and tests** - Complete - CRITICAL
3. **Run targeted verification and strict spec validation** - Complete - CRITICAL

**Total Critical Path**: Phase 003 implementation pass.

**Parallel Opportunities**:
- Documentation evidence and final diff review can follow successful strict validation.
- Future replay automation can be added independently because the current graph is derived.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Decision accepted | ADR-001 selects dedicated derived graph | Complete |
| M2 | Implementation complete | Store, handlers, schemas, references, and tests added | Complete |
| M3 | Validation complete | Targeted tests and strict spec validation pass | Complete |
<!-- /ANCHOR:milestones -->
