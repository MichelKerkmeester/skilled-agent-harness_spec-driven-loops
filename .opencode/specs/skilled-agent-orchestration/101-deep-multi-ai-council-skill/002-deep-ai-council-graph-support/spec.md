---
title: "Feature Specification: 101/002 Deep AI Council Graph Support"
description: "Plan future council-specific graph support after the deep-ai-council skill boundary ships. This phase evaluates and designs graph storage, query, convergence, and validation."
trigger_phrases:
  - "101/002"
  - "deep-ai-council graph support"
  - "council graph"
  - "council convergence graph"
  - "ai council graph storage"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/101-deep-multi-ai-council-skill/002-deep-ai-council-graph-support"
    last_updated_at: "2026-05-10T06:45:00Z"
    last_updated_by: "openai-gpt-5.5-opencode"
    recent_action: "Scaffolded future graph phase"
    next_safe_action: "Begin Phase 002 only after Phase 001 validates the skill boundary"
    blockers:
      - "Depends on Phase 001 skill boundary shipping first"
    key_files:
      - .opencode/skills/deep-ai-council/
      - .opencode/skills/system-spec-kit/mcp_server/lib/coverage-graph/
      - .opencode/skills/system-spec-kit/mcp_server/database/
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
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: 101/002 Deep AI Council Graph Support

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-05-10 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 2 of 2 |
| **Predecessor** | `001-deep-ai-council-skill-creation` |
| **Successor** | None |
| **Handoff Criteria** | Phase 001 validates skill ownership before Phase 002 creates or changes graph storage |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Deep AI Council skill extraction specification.

**Scope Boundary**: Plan and later implement graph support for council deliberation after the dedicated skill exists. This phase must not block the initial skill extraction.

**Dependencies**:
- Phase 001 creates the `deep-ai-council` skill and runtime routing.
- Existing deep-loop coverage graph supports only research/review semantics and cannot be reused as-is for council state.
- Council artifact schema and convergence semantics need stable names before graph storage is designed.

**Deliverables**:
- Council graph option decision and data model.
- Storage and query plan for council sessions, seats, claims, evidence, disagreements, and convergence snapshots.
- Verification plan for graph recovery, migration, readiness, and prompt-safe outputs.

**Changelog**:
- When this phase closes, refresh the matching file in `../changelog/` if a packet-local changelog is required.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Council deliberation will eventually need durable structural context beyond append-only artifacts, but the existing deep-loop coverage graph is specialized for research and review coverage. Reusing it directly would couple council semantics to unrelated loop types and force premature schema changes during the initial skill extraction.

### Purpose
Define future graph support as a separate phase that can choose a council-specific graph model, storage strategy, query surface, and convergence signals after the `deep-ai-council` skill boundary is stable.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Evaluate dedicated council graph/database support as the preferred future direction.
- Define council node kinds such as session, seat, claim, evidence, disagreement, decision, and recommendation.
- Define edge relations such as supports, contradicts, derives_from, agrees_with, resolves, and escalates.
- Define convergence signals for agreement, dissent density, evidence depth, and unresolved critical disagreements.
- Plan MCP/query surfaces only after storage semantics are explicit.
- Plan verification, migration, recovery, and readiness behavior.

### Out of Scope
- Phase 001 skill package creation and agent rename.
- Reusing the deep-loop graph without schema and tooling changes.
- Graph support hidden behind existing research/review loop_type values.
- Web UI or visualization work unless a later phase explicitly adds it.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-ai-council/` | Modify | Add graph-specific references and workflow guidance after Phase 001 exists |
| `.opencode/skills/system-spec-kit/mcp_server/database/` | Create/Modify | Add council-specific storage only if selected during this phase |
| `.opencode/skills/system-spec-kit/mcp_server/lib/` | Create/Modify | Add graph query and convergence logic if implementation is approved |
| `.opencode/skills/system-spec-kit/mcp_server/tests/` | Create/Modify | Add graph schema, query, recovery, and convergence tests |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Phase 002 starts after Phase 001 skill boundary validates | Phase 001 validation evidence exists before graph implementation starts |
| REQ-002 | Graph option is explicit | Decision compares deep-loop reuse, dedicated council graph, and deferral with a selected path |
| REQ-003 | Council semantics are independent from research/review | Design does not overload existing `research` or `review` loop types |
| REQ-004 | Storage model has recovery and readiness rules | Plan covers stale/corrupt/missing database behavior and prompt-safe blocked responses |
| REQ-005 | Convergence signals are council-specific | Signals reflect agreement, dissent, evidence, unresolved questions, and decision confidence |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Query surface is scoped and typed | Query modes return bounded, prompt-safe council context |
| REQ-007 | Migration risk is documented | Any database or schema addition includes migration and rollback notes |
| REQ-008 | Tests protect semantics | Tests cover node/edge validation, convergence, readiness blocking, and recovery paths |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Phase 002 contains an explicit graph decision rather than hidden scope inside Phase 001.
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
| Risk | Building graph support too early | Adds schema and MCP maintenance before skill usage proves the need | Keep Phase 001 graph-free and gate Phase 002 on validated skill boundary |
| Risk | Convergence metrics become opaque | Council output becomes harder to audit | Store evidence chains and prompt-safe trace metadata |
| Dependency | Phase 001 skill package | Required | Do not start implementation until skill boundary and artifact schema are stable |
| Dependency | MCP server storage patterns | Required if implemented | Reuse proven SQLite/readiness/recovery patterns, not deep-loop semantics |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should Phase 002 first deliver a design-only decision record before any database implementation?
- Which council artifacts should become graph nodes versus remain file-only evidence?
- What minimum convergence signals are required before graph support is worth shipping?
<!-- /ANCHOR:questions -->
