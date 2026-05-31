---
title: "Feature Specification: Integration Smoke Test"
description: "Wire the fork into opencode configuration and run final install, CLI, MCP, and recursive validation smoke checks."
trigger_phrases:
  - "027 phase 006"
  - "cocoindex integration-smoke"
  - "006-integration-smoke"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/028-code-graph-and-cocoindex/005-cocoindex-complete-fork/006-integration-smoke"
    last_updated_at: "2026-05-12T07:20:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Scaffolded child packet for Integration Smoke Test"
    next_safe_action: "Implement scoped tasks for 006-integration-smoke"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-12-027-001-006-integration-smoke"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Parent decomposition and dependency order are pre-approved by orchestrator."
---
# Feature Specification: Integration Smoke Test

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | draft |
| **Created** | 2026-05-12 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `system-spec-kit/028-code-graph-and-cocoindex/005-cocoindex-complete-fork` |
| **Phase** | 6 of 6 |
| **Predecessor** | ../005-attribution/spec.md |
| **Successor** | None |
| **Estimated Scope** | ~100 LOC |
| **Depends On** | `001-import-upstream`, `002-scripts`, `003-tests-port`, `004-docs`, `005-attribution` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

Wire the fork into opencode configuration and run final install, CLI, MCP, and recursive validation smoke checks.

This child is bounded to its topical file surface. It should not take work from sibling children except to consume validated outputs listed in its dependencies.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The complete fork needs this child scope isolated so the implementation can be reviewed and validated independently.

### Purpose
Deliver integration-smoke work with clear handoff evidence for the phase parent and downstream children.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Wire the fork into opencode configuration and run final install, CLI, MCP, and recursive validation smoke checks.
- Update this child packet with validation evidence when implementation lands.
- Preserve the parent baseline decision: v0.2.33 snapshot at `external/cocoindex-code-main/`, no upstream refresh in this packet.

### Out of Scope
- Work owned by sibling child folders.
- Changes outside the files listed in this child scope.
- Vendoring the transitive `cocoindex` engine dependency.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `opencode.json` | Modify | Final MCP wiring if required by the fork path |
| `.opencode/skills/mcp-coco-index/**` | Verify | Integrated fork, scripts, tests, docs, and attribution |
| `.opencode/specs/system-spec-kit/028-code-graph-and-cocoindex/005-cocoindex-complete-fork/**` | Update | Final evidence and validation status |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Configuration points at the local complete fork | opencode.json or existing wiring resolves local mcp_server command |
| REQ-002 | Smoke checks pass from a clean local path | install, ccc help/version, and MCP help/search smoke are recorded |
| REQ-003 | All child packets validate | Parent recursive and child strict validations exit 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All files in this child scope are updated or explicitly marked unchanged with evidence.
- **SC-002**: This child passes strict spec validation.
- **SC-003**: Handoff evidence is sufficient for dependent children.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Impact | Mitigation |
|------|--------|------------|
| Integration exposes hidden path assumption from earlier children | High | Stop and route fix to owning child scope |
| Smoke test mutates user indexes | Medium | Use isolated COCOINDEX_CODE_DIR and runtime paths |

### Dependencies
- `001-import-upstream`
- `002-scripts`
- `003-tests-port`
- `004-docs`
- `005-attribution`
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- **NFR-001**: Keep the implementation scoped to the child file boundary.
- **NFR-002**: Prefer deterministic local checks over network-dependent verification.
- **NFR-003**: Record any skipped verification with rationale.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- Required dependency child has not validated yet: stop and resume the dependency first.
- A touched path belongs to another child: stop and route the change to that child.
- A check needs network or Docker: document it as optional/manual unless the implementation explicitly enables it.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Scope | Medium | Child has a bounded but non-trivial file surface |
| Risk | Medium | Incorrect handoff can block downstream phases |
| Coordination | High | Depends on the phase-parent topology |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 11. OPEN QUESTIONS

None for scaffold. Implementation questions belong in this child after code work begins.
<!-- /ANCHOR:questions -->
