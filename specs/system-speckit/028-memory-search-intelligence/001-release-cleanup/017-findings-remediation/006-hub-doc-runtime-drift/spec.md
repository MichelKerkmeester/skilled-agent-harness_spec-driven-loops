---
title: "Feature Specification: Hub Documentation and Runtime Drift Reconciliation"
description: "Skill hub documentation contradicts the registries and files it describes: mode counts that disagree with the registry, routing claimed where no routing infrastructure exists, layout diagrams omitting live contract files, and canonical comm"
trigger_phrases:
  - "hub doc runtime drift"
  - "017 phase 006"
  - "findings remediation 006"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/001-release-cleanup/017-findings-remediation/006-hub-doc-runtime-drift"
    last_updated_at: "2026-07-27T08:20:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Authored the phase spec from the audit findings"
    next_safe_action: "Wait for phase 001 dispositions before acting"
    blockers: ["Gated on phase 001 triage dispositions"]
    key_files:
      - "spec.md"
      - "../../016-dead-code-and-architecture-audit/findings-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-028-017-006"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Remediation acts only on findings dispositioned CONFIRMED by phase 001."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Hub Documentation and Runtime Drift Reconciliation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 006 of 009 |
| **Findings in scope** | 15 |
| **Blast radius** | Medium |
| **Predecessor** | ../005-misplacement-and-layout/spec.md |
| **Successor** | ../007-deep-loop-and-cli-contract-drift/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 006** of the findings remediation program. Source findings: `../../016-dead-code-and-architecture-audit/findings-report.md`.

**Scope Boundary**: This phase acts only on findings that phase 001 dispositioned CONFIRMED.

**Deliverables**:
- Per-finding record of what was done and why.
- `implementation-summary.md` with counts and any deferrals.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Skill hub documentation contradicts the registries and files it describes: mode counts that disagree with the registry, routing claimed where no routing infrastructure exists, layout diagrams omitting live contract files, and canonical command and agent indexes missing live entries.

### Purpose

Make each hub's documentation agree with its own registry and on-disk reality, deciding per contradiction which side is the intended truth.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Hub SKILL.md and README claims contradicting mode-registry.json
- Routing language describing infrastructure that does not exist
- Layout diagrams omitting live contract files
- Canonical command and agent indexes omitting live entries or naming them wrongly
- Packet contracts contradicted by the files shipped inside them

### Out of Scope

- Tooling contract drift in the deep-loop and CLI surfaces, owned by phase 007
- Runtime mirror divergence, owned by phase 008

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `(hub SKILL.md files)` | Modify | Correct counts, routing claims and layout diagrams |
| `(canonical indexes)` | Modify | Add omitted live entries; fix naming mismatches |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Each contradiction is resolved by deciding which side is the intended truth | Decision recorded per finding with rationale |
| REQ-002 | Mode counts in prose match the authoritative registry exactly | Count in prose equals registry entry count for every hub |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Canonical indexes list every live command and agent | Index entries reconcile against a directory listing |
| REQ-004 | Layout diagrams include every live contract file they describe | Diagram reconciles against on-disk contents |
| REQ-005 | A packet whose contract forbids a capability does not ship files exercising it | Either the files move or the contract is amended deliberately |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No hub prose contradicts its own registry.
- **SC-002**: Canonical command and agent indexes reconcile against the filesystem.
- **SC-003**: Every resolution records which side was chosen and why.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Correcting prose to match a registry that is itself wrong | Medium | Check the runtime behavior before assuming the registry is authoritative |
| Risk | Amending a contract to legitimize a violation rather than fixing it | Medium | Contract amendments need an explicit operator decision, not a silent edit |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which findings in this phase does the operator approve for execution?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Audit findings**: `../../016-dead-code-and-architecture-audit/findings-report.md`
- **Phase parent**: `../spec.md`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
