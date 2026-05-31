---
title: "Feature Specification: Import Upstream Snapshot"
description: "Bootstrap import of the downloaded upstream cocoindex-code v0.2.33 snapshot into the local mcp-coco-index fork root with an import manifest."
trigger_phrases:
  - "027 phase 001"
  - "cocoindex import-upstream"
  - "001-import-upstream"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/028-code-graph-and-cocoindex/005-cocoindex-complete-fork/001-import-upstream"
    last_updated_at: "2026-05-12T07:20:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Scaffolded child packet for Import Upstream Snapshot"
    next_safe_action: "Implement scoped tasks for 001-import-upstream"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-12-027-001-001-import-upstream"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Parent decomposition and dependency order are pre-approved by orchestrator."
---
# Feature Specification: Import Upstream Snapshot

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

## EXECUTIVE SUMMARY

This child establishes the fixed upstream baseline for the complete fork. It owns the mechanical import boundary and manifest so later children can adapt scripts, tests, docs, attribution, and smoke validation without re-deciding what upstream source they are targeting.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | draft |
| **Created** | 2026-05-12 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `system-spec-kit/028-code-graph-and-cocoindex/005-cocoindex-complete-fork` |
| **Phase** | 1 of 6 |
| **Predecessor** | None |
| **Successor** | ../002-scripts/spec.md |
| **Estimated Scope** | ~300 LOC, mostly mechanical copy and manifest work |
| **Depends On** | None |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

Bootstrap import of the downloaded upstream cocoindex-code v0.2.33 snapshot into the local mcp-coco-index fork root with an import manifest.

This child is bounded to its topical file surface. It should not take work from sibling children except to consume validated outputs listed in its dependencies.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The complete fork needs this child scope isolated so the implementation can be reviewed and validated independently.

### Purpose
Deliver import-upstream work with clear handoff evidence for the phase parent and downstream children.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Bootstrap import of the downloaded upstream cocoindex-code v0.2.33 snapshot into the local mcp-coco-index fork root with an import manifest.
- Update this child packet with validation evidence when implementation lands.
- Preserve the parent baseline decision: v0.2.33 snapshot at `external/cocoindex-code-main/`, no upstream refresh in this packet.

### Out of Scope
- Work owned by sibling child folders.
- Changes outside the files listed in this child scope.
- Vendoring the transitive `cocoindex` engine dependency.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `external/cocoindex-code-main/**` | Read | Source snapshot for upstream v0.2.33 |
| `.opencode/skills/mcp-coco-index/mcp_server/**` | Replace/Create | Complete local fork root for upstream source, package metadata, runtime helpers, and selected assets |
| `.opencode/skills/mcp-coco-index/mcp_server/IMPORT_MANIFEST.md` | Create | Imported, excluded, and deferred file ledger |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Import the selected upstream v0.2.33 repository surface | Manifest maps each imported path back to external/cocoindex-code-main |
| REQ-002 | Keep the pt-04 baseline decision intact | No upstream refresh occurs in this packet |
| REQ-003 | Record source layout choice | ADR explains src layout versus flat package handling |
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
| Patch overlay conflicts with v0.2.33 query/indexer shape | High | Port patch by patch and leave tests to 003-tests-port |
| Import includes assets that do not belong in skill runtime | Medium | Classify every non-source asset in IMPORT_MANIFEST.md |

### Dependencies
- None
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

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Imported tree drops a required spec-kit patch target | H | M | Keep manifest and patch overlay tasks separate |
| R-002 | Source layout decision breaks scripts | H | M | Record layout decision before script child starts |

---

## 11. USER STORIES

### US-001: Establish Complete Fork Baseline

As a SpecKit maintainer, I want the upstream v0.2.33 wrapper surface locally available so later retrieval work can change local code directly.

Acceptance criteria:
1. The imported files are traceable to `external/cocoindex-code-main/`.
2. Exclusions and deferred assets are listed with rationale.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

None for scaffold. Implementation questions belong in this child after code work begins.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- Parent: `../spec.md`
- Plan: `plan.md`
- Tasks: `tasks.md`
- Checklist: `checklist.md`
- Decisions: `decision-record.md`
