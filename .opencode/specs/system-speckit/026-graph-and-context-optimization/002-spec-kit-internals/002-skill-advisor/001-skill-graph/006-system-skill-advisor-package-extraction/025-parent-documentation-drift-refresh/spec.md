---
title: "Feature Specification: Parent doc drift refresh"
description: "Refreshes the parent handover and graph metadata so the extraction parent reflects children 001-025 instead of the old seven-child framing."
trigger_phrases:
  - "018 parent doc drift follow-on"
  - "parent handover refresh"
  - "advisor extraction parent metadata"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-package-extraction/025-parent-documentation-drift-refresh"
    last_updated_at: "2026-05-15T11:00:00Z"
    last_updated_by: "codex"
    recent_action: "Parent doc drift refresh implemented"
    next_safe_action: "Commit scoped changes"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    completion_pct: 100
---
# Feature Specification: Parent doc drift refresh

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-15 |
| **Branch** | `main` |
| **Spec Folder** | `025-parent-documentation-drift-refresh` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The parent handover still opened with the original seven-child framing even though graph metadata already listed children 001-021. That contradicted the current extraction state and could send future agents back to obsolete Tier 1-4 instructions.

### Purpose
Make the parent handover and graph metadata describe the 25-child state after all 018-named follow-ons are closed.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rewrite handover sections 1-3 for the current child state.
- Update parent graph metadata children and last-active child.
- Document the closed disposition of all original 018 follow-ons.

### Out of Scope
- Editing child packets 001-021.
- Renaming packet folders.
- Changing source code outside the doc refresh.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/.../006-system-skill-advisor-package-extraction/handover.md` | Modify | Replace obsolete seven-child framing with 25-child state. |
| `.opencode/specs/.../006-system-skill-advisor-package-extraction/graph-metadata.json` | Modify | Add children 022-025 and point last active child at 025. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Handover sections 1-3 describe the current child state. | Sections 1-3 name 001-025 and closed follow-ons. |
| REQ-002 | Parent graph metadata lists all child ids. | `children_ids` includes 001-025 and last active child is 025. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-900 | Preserve public advisor identities. | No tool-id, server-id, or skill-id rename is introduced. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No old seven-child opening remains.
- **SC-002**: Graph metadata includes children 001-025.
- **SC-003**: Parent continuity remains 100 percent.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Generated metadata may drift from authored handover. | Memory search can misroute. | Update both handover and graph metadata together. |
| Risk | Accidentally editing shipped child docs. | Scope violation. | Touch only parent docs and new 025 packet docs. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

- **NFR-01**: Handover should route future agents to child summaries, not stale prompt skeletons.
- **NFR-02**: Metadata should make resume pick the latest child.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- **EC-01**: Future topology consolidation is documented as separate work.
- **EC-02**: 018-named follow-ons are closed unless new evidence reopens them.
- **EC-03**: Parent completion and child status do not conflict.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Small, scoped surfaces with targeted tests. |
| Risk | 14/25 | Runtime bridge and metadata paths require focused validation. |
| Research | 8/20 | Audit driven from packet 018 and current source. |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

None. Gate 3 was pre-answered as Option B for new follow-on packets.
<!-- /ANCHOR:questions -->
