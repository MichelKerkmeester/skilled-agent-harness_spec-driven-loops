---
title: "Feature Specification: Update Attribution Metadata"
description: "Update NOTICE, CHANGELOG, and package metadata for Apache-2.0 upstream plus spec-kit modifications."
trigger_phrases:
  - "027 phase 005"
  - "cocoindex attribution"
  - "005-attribution"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/028-code-graph-and-cocoindex/005-cocoindex-complete-fork/005-attribution"
    last_updated_at: "2026-05-12T07:20:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Scaffolded child packet for Update Attribution Metadata"
    next_safe_action: "Implement scoped tasks for 005-attribution"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-12-027-001-005-attribution"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Parent decomposition and dependency order are pre-approved by orchestrator."
---
# Feature Specification: Update Attribution Metadata

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
| **Phase** | 5 of 6 |
| **Predecessor** | ../004-docs/spec.md |
| **Successor** | ../006-integration-smoke/spec.md |
| **Estimated Scope** | ~50 LOC |
| **Depends On** | `001-import-upstream` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

Update NOTICE, CHANGELOG, and package metadata for Apache-2.0 upstream plus spec-kit modifications.

This child is bounded to its topical file surface. It should not take work from sibling children except to consume validated outputs listed in its dependencies.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The complete fork needs this child scope isolated so the implementation can be reviewed and validated independently.

### Purpose
Deliver attribution work with clear handoff evidence for the phase parent and downstream children.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Update NOTICE, CHANGELOG, and package metadata for Apache-2.0 upstream plus spec-kit modifications.
- Update this child packet with validation evidence when implementation lands.
- Preserve the parent baseline decision: v0.2.33 snapshot at `external/cocoindex-code-main/`, no upstream refresh in this packet.

### Out of Scope
- Work owned by sibling child folders.
- Changes outside the files listed in this child scope.
- Vendoring the transitive `cocoindex` engine dependency.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-coco-index/NOTICE` | Modify | Apache-2.0 attribution and local modifications |
| `.opencode/skills/mcp-coco-index/CHANGELOG.md` | Modify | Fork ownership narrative and v0.2.33 baseline |
| `.opencode/skills/mcp-coco-index/mcp_server/package metadata` | Modify | Version and fork identifiers in package metadata |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | NOTICE cites upstream Apache-2.0 baseline | NOTICE names cocoindex-code v0.2.33 and local modifications |
| REQ-002 | CHANGELOG explains fork ownership | CHANGELOG records complete-fork import and spec-kit overlay |
| REQ-003 | Package metadata exposes fork identity | Version or metadata includes spec-kit fork identifier |
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
| Attribution omits local modifications | Medium | Mirror patch list from prior NOTICE and CHANGELOG |
| Package version conflicts with upstream release | Low | Use explicit spec-kit fork suffix |

### Dependencies
- `001-import-upstream`
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
