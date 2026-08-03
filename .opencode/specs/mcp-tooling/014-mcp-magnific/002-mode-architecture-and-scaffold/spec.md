---
title: "Feature Specification: Phase 2 — Magnific mode architecture and scaffold"
description: "Freeze the mcp-magnific packet classification, Code Mode topology, creative-judgment pairing, credit confirmation policy, and package layout, then scaffold the nested mode."
trigger_phrases:
  - "magnific mode architecture"
  - "mcp-magnific scaffold"
  - "magnific transport classification"
  - "mcp-magnific phase 2"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/014-mcp-magnific/002-mode-architecture-and-scaffold"
    last_updated_at: "2026-08-02T15:35:00Z"
    last_updated_by: "spec-author"
    recent_action: "Define architecture decision gate"
    next_safe_action: "Execute 003-mcp-runtime-integration"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "decision-record.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "014-mcp-magnific-002"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Live tool schemas and per-tool credit costs await an authenticated session (Phase 3)."
    answered_questions:
      - "Verified behavior supports packetKind transport (backendKind code-mode-remote-mcp)."
      - "mcp-remote bridge accepted; direct streamable-HTTP registration deferred as documented-but-unverified."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2 — Magnific mode architecture and scaffold

<!-- SPECKIT_LEVEL: 2 -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2; architecture decisions recorded in `decision-record.md` |
| **Priority** | P0 |
| **Status** | Complete (2026-08-02) |
| **Created** | 2026-08-02 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 2 of 7 |
| **Predecessor** | `001-official-mcp-research` |
| **Successor** | `003-mcp-runtime-integration` |
| **Handoff Criteria** | Classification, permissions, pairing, spend gates, runtime topology, and package layout are frozen; the nested package skeleton exists. |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:phase-context -->
## Phase Context

This phase converts verified research into a durable architecture contract. The leading design is a `packetKind: transport` mode with `mutatesWorkspace: false`, Code Mode as its only execution surface, and `sk-design` loaded before creative judgment.

**Scope Boundary**: Decide and scaffold only. Runtime registration is Phase 3; executable documentation is Phase 4.

**Dependencies**:
- Phase 1 research synthesis and discovery fixture.
- `sk-create-skill` nested-packet doctrine.
- Existing `mcp-refero`, `mcp-mobbin`, and `mcp-figma` transport patterns.

**Deliverables**:
- Accepted architecture decision in this phase's documentation.
- Empty but valid `.opencode/skills/mcp-tooling/mcp-magnific/` skeleton.
- Frozen file inventory and tool-permission contract.
<!-- /ANCHOR:phase-context -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Without a frozen architecture, Magnific could be misclassified as a workflow, granted local write tools it does not need, allowed to spend credits without confirmation, or treated as the source of creative taste rather than an execution transport.

### Purpose
Choose the narrowest mode contract that supports verified Magnific operations while preserving hub consistency, spend safety, and cross-hub judgment ownership.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Decide `packetKind`, `backendKind`, allowed tools, forbidden tools, and `mutatesWorkspace`.
- Decide direct remote versus `mcp-remote` runtime topology.
- Define no-cost, paid, destructive, account-changing, and ambiguous operation gates.
- Define mandatory `sk-design` pairing for design-affecting requests.
- Scaffold the nested package with no packet-local advisor metadata.

### Out of Scope
- Editing shared hub registration.
- Authenticating to Magnific.
- Authoring claims beyond verified Phase 1 evidence.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `decision-record.md` | Create if Level 3 upgrade is applied | Architecture choice and alternatives |
| `.opencode/skills/mcp-tooling/mcp-magnific/**` | Create | Nested mode skeleton |
| `implementation-summary.md` | Modify | Decision and scaffold evidence |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Freeze mode classification | Decision names packet kind, backend kind, mutation posture, and rationale |
| REQ-002 | Freeze minimal tool permissions | Given a transport-only mode, Write/Edit/Task remain forbidden unless research proves a local-workspace need |
| REQ-003 | Freeze spend and destructive gates | Every operation class has a confirmation rule and rollback or limitation statement |
| REQ-004 | Freeze creative-judgment ownership | Design-affecting execution requires `sk-design` before transport use |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Scaffold the package | Folder contains template-backed SKILL, README, changelog, references/assets/examples placeholders as justified, but no mode-local graph metadata |
| REQ-006 | Define rollback | Removing the package and later registry entry restores the prior hub without touching other modes |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Phases 3–6 share one unambiguous architecture contract.
- **SC-002**: The package shape follows nested-mode rules and contains no second advisor identity.
- **SC-003**: Paid generation cannot be mistaken for a read-only discovery operation.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 1 evidence | Architecture could encode false assumptions | Block rather than guess |
| Risk | Transport can mutate external workspace | `mutatesWorkspace:false` may be misunderstood | Document external effects and credit gates explicitly |
| Risk | Over-broad tool surface | Local files or dispatch become reachable | Start with Read/Bash/Grep/Glob/Code Mode only |
| Risk | Cross-hub ownership ambiguity | Transport makes taste decisions | Make `sk-design` a precondition for creative direction |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does the transport-axis contract need an explicit external-credit mutation field or is prose gating sufficient?
- Should asset download/export be part of this mode or a separately confirmed local-write step?
<!-- /ANCHOR:questions -->
