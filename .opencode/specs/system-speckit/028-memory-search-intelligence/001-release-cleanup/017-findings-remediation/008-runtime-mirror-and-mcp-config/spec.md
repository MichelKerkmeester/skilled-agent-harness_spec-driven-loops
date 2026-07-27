---
title: "Feature Specification: Runtime Mirror and MCP Configuration Consolidation"
description: "Runtime mirror directories have diverged from their canonical sources, one mirror is a stale physical copy rather than a link, and MCP server configuration exists in three places that disagree about which servers are registered."
trigger_phrases:
  - "runtime mirror and mcp config"
  - "017 phase 008"
  - "findings remediation 008"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/001-release-cleanup/017-findings-remediation/008-runtime-mirror-and-mcp-config"
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
      session_id: "2026-07-27-028-017-008"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Remediation acts only on findings dispositioned CONFIRMED by phase 001."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Runtime Mirror and MCP Configuration Consolidation

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
| **Phase** | 008 of 009 |
| **Findings in scope** | 6 |
| **Blast radius** | High |
| **Predecessor** | ../007-deep-loop-and-cli-contract-drift/spec.md |
| **Successor** | ../009-overengineering-simplification/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 008** of the findings remediation program. Source findings: `../../016-dead-code-and-architecture-audit/findings-report.md`.

**Scope Boundary**: This phase acts only on findings that phase 001 dispositioned CONFIRMED.

**Deliverables**:
- Per-finding record of what was done and why.
- `implementation-summary.md` with counts and any deferrals.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Runtime mirror directories have diverged from their canonical sources, one mirror is a stale physical copy rather than a link, and MCP server configuration exists in three places that disagree about which servers are registered.

### Purpose

Establish one canonical source per mirrored surface and make every consumer resolve through it, so a change in one place cannot silently leave another behind.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The mirror directory that is a physical copy rather than a link to its canonical source
- Agent definitions packaged into three runtime trees with indexes that disagree
- MCP configuration duplicated across the primary config and per-runtime configs
- A runtime config missing servers the others register

### Out of Scope

- Changing which MCP servers are registered; this phase reconciles, it does not add or remove servers

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `(runtime mirror dirs)` | Modify | Establish canonical source and consumer resolution |
| `(MCP config files)` | Modify | Reconcile to one source of truth |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Each mirrored surface has exactly one declared canonical source | Canonical source recorded per surface |
| REQ-002 | Every runtime resolves the same MCP server set | Server lists reconcile across all config files |
| REQ-003 | No consumer breaks when a mirror becomes a link | Every runtime is exercised after the change |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Drift detection exists for each consolidated surface | A seeded drift is caught before merge |
| REQ-005 | The consolidation is reversible | Rollback procedure recorded before execution |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: One canonical source per mirrored surface, declared and documented.
- **SC-002**: All MCP config files agree on the registered server set.
- **SC-003**: Each runtime starts and resolves its tools after the change.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Replacing a physical mirror with a link breaks a runtime that cannot follow it | High | Test each runtime individually before and after; keep the rollback path ready |
| Risk | Consolidating MCP config silently drops a server one runtime needs | High | Diff the effective server set per runtime, not just the file contents |
| Risk | Changes here affect every session on the machine | High | Stage per surface; do not batch all mirrors in one change |
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
