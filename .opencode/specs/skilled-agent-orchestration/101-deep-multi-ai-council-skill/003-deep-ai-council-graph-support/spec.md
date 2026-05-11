---
title: "Feature Specification: 101/003 Deep AI Council Graph Support"
description: "Implement dedicated council-specific graph support after the deep-ai-council skill boundary shipped, with derived storage, query, convergence, readiness, and validation."
trigger_phrases:
  - "101/003"
  - "deep-ai-council graph support"
  - "council graph"
  - "council convergence graph"
  - "ai council graph storage"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support"
    last_updated_at: "2026-05-11T05:20:00Z"
    last_updated_by: "openai-gpt-5.5-opencode"
    recent_action: "Fixed deep-review findings for council graph support"
    next_safe_action: "Run final verification and report outcome"
    blockers: []
    key_files:
      - .opencode/skills/deep-ai-council/
      - .opencode/skills/system-spec-kit/mcp_server/lib/council-graph/
      - .opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/
      - .opencode/skills/system-spec-kit/mcp_server/tests/council-graph.vitest.ts
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "101-003-graph-support"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Do not reuse deep-loop graph as-is for council support."
      - "Implement a dedicated council graph as a derived projection from ai-council artifacts."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: 101/003 Deep AI Council Graph Support

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

Phase 003 implements dedicated derived graph support for Deep AI Council deliberation. The graph adds bounded MCP query and convergence context without making graph rows authoritative over packet-local council artifacts.

**Key Decisions**: dedicated `council_graph_*` tool surface, derived SQLite projection, prompt-safe bounded query outputs.

**Critical Dependencies**: Phase 001 skill boundary and Phase 002 reference expansion are complete; `ai-council/**` artifacts remain source-of-truth.

<!-- ANCHOR:phase-context -->
### Phase Context

This is **Phase 3** of the Deep AI Council skill extraction specification.

**Scope Boundary**: Implement dedicated graph support for council deliberation after the dedicated skill exists. This phase must not mutate historical `ai-council-state.jsonl` rows or overload deep-loop research/review graph tools.

**Dependencies**:
- Phase 001 created the `deep-ai-council` skill and runtime routing.
- Phase 002 expanded council references and preserved graph support as this dedicated packet.
- Existing deep-loop coverage graph supports only research/review semantics and cannot be reused as-is for council state.
- Council graph storage is a derived projection from packet-local `ai-council-state.jsonl` and artifacts, not a replacement source of truth.

**Deliverables**:
- Dedicated council graph option decision and data model.
- Storage and query implementation for council sessions, rounds, seats, claims, evidence, disagreements, decisions, recommendations, and convergence snapshots.
- Verification for graph recovery, migration, readiness, prompt-safe outputs, and no deep-loop regression.

**Changelog**:
- When this phase closes, refresh the matching file in `../changelog/` if a packet-local changelog is required.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-10 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 3 of 3 |
| **Predecessor** | `002-deep-ai-council-reference-expansion` |
| **Successor** | None |
| **Handoff Criteria** | Phase 001 and 002 validation evidence exists, then Phase 003 implements dedicated derived graph support without overloading deep-loop graph semantics |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Council deliberation needs durable structural context beyond append-only artifacts, but the existing deep-loop coverage graph is specialized for research and review coverage. Reusing it directly would couple council semantics to unrelated loop types and force schema changes into a research/review tool surface.

### Purpose
Implement council-specific graph storage, query, and convergence signals as a derived projection after the `deep-ai-council` skill boundary is stable.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Implement dedicated council graph/database support as the selected direction.
- Define council node kinds such as session, seat, claim, evidence, disagreement, decision, and recommendation.
- Define edge relations such as supports, contradicts, derives_from, agrees_with, resolves, and escalates.
- Define convergence signals for agreement, dissent density, evidence depth, and unresolved critical disagreements.
- Add MCP/query surfaces only for bounded, prompt-safe council context.
- Implement verification, migration, recovery, and readiness behavior.

### Out of Scope
- Phase 001 skill package creation and agent rename.
- Reusing the deep-loop graph without schema and tooling changes.
- Graph support hidden behind existing research/review loop_type values.
- Treating council graph rows as authoritative over packet-local `ai-council/**` artifacts.
- Web UI or visualization work unless a later phase explicitly adds it.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-ai-council/` | Modify | Add graph-specific references and workflow guidance, replacing graph-out-of-scope wording with derived-graph boundaries |
| `.opencode/skills/system-spec-kit/mcp_server/lib/council-graph/` | Create | Add dedicated council graph storage, query helpers, and convergence utilities |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/` | Create | Add bounded MCP handlers for upsert, query, status, and convergence |
| `.opencode/skills/system-spec-kit/mcp_server/tools/index.ts` | Modify | Register dedicated council graph dispatchers separately from deep-loop graph tools |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | Modify | Expose typed council graph tool descriptors |
| `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` | Modify | Add strict input validation for council graph tools |
| `.opencode/skills/system-spec-kit/mcp_server/tests/` | Create/Modify | Add graph schema, query, recovery, convergence, and registration tests |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Phase 003 starts after Phase 001 and 002 validate | Phase 001 and 002 summaries show completed skill boundary and reference expansion evidence before graph implementation starts |
| REQ-002 | Graph option is explicit | Decision compares deep-loop reuse, dedicated council graph, and deferral with a selected path |
| REQ-003 | Council semantics are independent from research/review | Design does not overload existing `research` or `review` loop types |
| REQ-004 | Storage model has recovery and readiness rules | Plan covers stale/corrupt/missing database behavior and prompt-safe blocked responses |
| REQ-005 | Convergence signals are council-specific | Signals reflect agreement, dissent, evidence, unresolved questions, and decision confidence |
| REQ-006 | Graph is a derived projection | `ai-council-state.jsonl` and packet artifacts remain source of truth; graph rows can be rebuilt or discarded |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Query surface is scoped and typed | Query modes return bounded, prompt-safe council context |
| REQ-008 | Migration risk is documented | Any database or schema addition includes migration and rollback notes |
| REQ-009 | Tests protect semantics | Tests cover node/edge validation, convergence, readiness blocking, and recovery paths |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Phase 003 contains an explicit graph decision rather than hidden scope inside Phase 001.
- **SC-002**: The selected design keeps council graph semantics separate from existing deep-loop research/review semantics.
- **SC-003**: Proposed query outputs are bounded, prompt-safe, and useful to a council synthesis workflow.
- **SC-004**: Verification covers schema integrity, convergence math, readiness blocking, recovery, and migration rollback.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Reusing deep-loop graph directly | Council semantics get coupled to research/review coverage logic | Prefer a dedicated council graph or defer implementation |
| Risk | Copying deep-loop drop-on-migration behavior | Council audit context could be lost if graph is treated as durable state | Make the graph derived and replayable from `ai-council/**` artifacts |
| Risk | Convergence metrics become opaque | Council output becomes harder to audit | Store evidence chains and prompt-safe trace metadata |
| Dependency | Phase 001 and 002 completion | Satisfied | Use their implementation summaries as prerequisite evidence |
| Dependency | MCP server storage patterns | Required if implemented | Reuse proven SQLite/readiness/recovery patterns, not deep-loop semantics |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Council graph queries must remain bounded by explicit `limit` and traversal-depth controls.
- **NFR-P02**: Status and convergence calls should avoid full artifact dumps and return compact summaries.

### Security
- **NFR-S01**: Tool input schemas must validate graph scope, node identifiers, relation kinds, query modes, and limits before handler execution.
- **NFR-S02**: Query outputs must be prompt-safe and must not expose unrelated packet artifacts; metadata returned by query helpers is limited to allowlisted scalar fields and bounded string lengths.

### Reliability
- **NFR-R01**: Missing or derived graph state must not return false-safe empty answers when readiness is unknown.
- **NFR-R02**: Derived graph rows can be deleted and rebuilt from `ai-council/**` artifacts.

---

## 8. EDGE CASES

### Data Boundaries
- Empty upsert input returns a bounded no-op result rather than writing invalid rows.
- Self-loop edges are rejected by the upsert path.
- Query limits cap prompt output for high-degree council sessions.
- Hostile or oversized metadata is redacted or truncated before prompt-safe query output.

### Error Scenarios
- Invalid node kinds, relation kinds, or query modes are rejected by strict schemas or handler validation.
- Missing derived graph state is handled through status/readiness responses while preserving artifact authority.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | MCP handlers, SQLite schema, tool schemas, tests, and skill references |
| Risk | 18/25 | Shared MCP tool surface and derived graph persistence |
| Research | 14/20 | Needed deep-loop graph comparison and council artifact boundary review |
| Multi-Agent | 8/15 | Supports council workflow but implementation is one workstream |
| Coordination | 11/15 | Depends on Phase 001/002 and parent packet metadata |
| **Total** | **71/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Council graph rows treated as durable source-of-truth | High | Medium | Document derived-only contract and keep artifacts authoritative |
| R-002 | Query responses include too much artifact text | Medium | Medium | Bound outputs and return allowlisted compact graph metadata |
| R-003 | Deep-loop graph semantics drift through accidental reuse | High | Low | Use dedicated `council_graph_*` handlers, schemas, and tests |

---

## 11. USER STORIES

### US-001: Query Council Deliberation Structure (Priority: P0)

**As a** council synthesis caller, **I want** bounded graph queries for disagreements, evidence, decisions, and blockers, **so that** final synthesis can cite structural context without replaying every artifact.

**Acceptance Criteria**:
1. Given a council session graph, When a bounded query runs, Then it returns prompt-safe context for the selected mode and limit.

---

### US-002: Assess Council Convergence (Priority: P1)

**As a** council orchestrator, **I want** council-specific convergence signals, **so that** I can distinguish stop-allowed, continue, and blocked states with explicit blockers.

**Acceptance Criteria**:
1. Given critical unresolved disagreements, When convergence is assessed, Then the response blocks stop and reports the blocker.

---

## 12. OPEN QUESTIONS

- None. The user requested applying the plan fixes and then implementing the dedicated derived council graph.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
