---
title: "Feature Specification: Phase 12: catalog-playbook-realignment [template:level_1/spec.md]"
description: "Realign sk-design-interface's feature_catalog and manual_testing_playbook to the post-011 reality: the Mobbin/Refero design-references capability and its hybrid initiative/ask routing were not catalogued or tested. Add a design-references-grounding feature, cross-reference it from the critique-against feature, and add a manual-testing scenario for the initiative/ask routing."
trigger_phrases:
  - "sk-design-interface catalog playbook realignment"
  - "mobbin refero feature catalog"
  - "design references routing scenario"
  - "phase 012 spec"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/143-sk-design-interface/012-catalog-playbook-realignment"
    last_updated_at: "2026-06-17T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Audited catalog/playbook vs reality; found Mobbin/Refero coverage gaps"
    next_safe_action: "Add the design-references feature + routing scenario; validate"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design-interface/feature_catalog/feature_catalog.md"
      - ".opencode/skills/sk-design-interface/manual_testing_playbook/manual_testing_playbook.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-148-012-catalog-playbook-realignment"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 12: catalog-playbook-realignment

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-06-17 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Parent Spec** | ../spec.md |
| **Phase** | 12 |
| **Predecessor** | 011-mobbin-refero-smart-routing |
| **Successor** | None |
| **Handoff Criteria** | The feature_catalog catalogues the Mobbin/Refero design-references capability + its hybrid routing; a manual-testing scenario exercises the initiative/ask gate; sk-doc validators 0 issues; `validate.sh --strict` exits 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 12** of the sk-design-interface specification — a doc-realignment phase in the same spirit as phase 008.

**Scope Boundary**: Edit only `feature_catalog/` and `manual_testing_playbook/` in `sk-design-interface`. No change to SKILL.md/README/references (those already carry the phase-011 routing reality). No new behavior.

**Dependencies**: Phase 011 (the Mobbin/Refero hybrid routing) and phase 009 (the original integration) are the reality the docs must catch up to.

**Deliverables**: a `design-references-grounding` feature_catalog entry, a cross-reference from the critique-against feature, a manual-testing scenario for the initiative/ask routing, and reconciled indexes/counts.

**Changelog**: doc-only realignment; no skill version bump required.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 009 added the Mobbin/Refero design-reference capability and phase 011 gave it a hybrid initiative/ask routing gate, but the feature_catalog never catalogued the design-references capability and the manual_testing_playbook never tested it. The catalog/playbook therefore under-represent what the skill does: an auditor reading them would not know the skill can consult real-world references or that it decides to do so by initiative or by asking.

### Purpose
Bring the catalog and playbook up to the skill's real surface so they are a faithful inventory and test matrix of the current behavior.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A `feature_catalog/03--design-grounding/design-references-grounding.md` feature covering Mobbin/Refero + the hybrid routing, plus index/count updates.
- Add `design_references_mcp.md` to the implementation surfaces of the critique-against feature.
- A manual_testing_playbook scenario for the initiative/ask/fall-back routing + Mobbin-vs-Refero pick, plus index/cross-ref/count updates.

### Out of Scope
- SKILL.md / README / references (already aligned in phase 011).
- The Mobbin/Refero tool catalogs (`mobbin_tools.md`, `refero_tools.md`) — unchanged.
- Any behavior change.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `feature_catalog/03--design-grounding/design-references-grounding.md` | Create | The Mobbin/Refero design-references feature + hybrid routing |
| `feature_catalog/feature_catalog.md` | Modify | Inventory + §4 narrative + counts |
| `feature_catalog/01--design-process/critique-against-defaults.md` | Modify | Add design_references_mcp.md to implementation surfaces |
| `manual_testing_playbook/**` (new scenario) + `manual_testing_playbook.md` | Create/Modify | Scenario for the initiative/ask routing; index/cross-ref/counts |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Catalogue the capability | A design-references feature exists covering Mobbin/Refero and the hybrid initiative/ask routing |
| REQ-002 | Test the routing | A manual-testing scenario validates initiative/ask/fall-back + the Mobbin-vs-Refero source pick + the no-chooser/read-live guardrails |
| REQ-003 | Indexes reconciled | feature_catalog + playbook indexes, counts, and cross-references include the new entries; all links resolve |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | No regression in decouple | No `mcp-open-design`/"Open Design"/`claude_design_parity` naming reintroduced |
| REQ-005 | Validators + strict | sk-doc validators 0 issues on both indexes; `validate.sh --strict` exits 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The feature_catalog lists the design-references capability with its hybrid routing.
- **SC-002**: A playbook scenario exercises the initiative/ask gate and the source pick.
- **SC-003**: sk-doc validators report 0 issues; no Open Design naming reintroduced.
- **SC-004**: `validate.sh --strict` exits 0 on this phase folder.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Reintroducing Open Design naming | Undoes the decouple | grep the touched dirs for Open Design naming after editing |
| Risk | Index/count drift | Catalog says N features but N+1 exist | Reconcile counts + cross-reference tables; run the sk-doc validators |
| Dependency | Phase 011 reality | The routing the docs must match | Mirror design_references_mcp.md §3 exactly |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
