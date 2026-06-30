---
title: "Feature Specification: Phase 12: catalog-playbook-realignment [template:level_1/spec.md]"
description: "Realign mcp-open-design's feature_catalog and manual_testing_playbook to the post-011 reality: the sk-design-interface coupling became MANDATORY (a hard precondition) but the grounding feature still called it 'optional and on-demand' and no playbook scenario tested the hard gate. Rewrite the grounding feature to mandatory framing and add a gate-enforcement scenario."
trigger_phrases:
  - "mcp-open-design catalog playbook realignment"
  - "mandatory sk-design-interface gate scenario"
  - "grounding feature mandatory framing"
  - "phase 012 spec"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "design/002-mcp-open-design/012-catalog-playbook-realignment"
    last_updated_at: "2026-06-17T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Audited catalog/playbook vs reality; grounding feature still said optional, no gate scenario"
    next_safe_action: "Rewrite grounding feature mandatory + add gate scenario; validate"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-open-design/feature_catalog/03--grounding/design-system-grounding.md"
      - ".opencode/skills/mcp-open-design/manual_testing_playbook/manual_testing_playbook.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-150-012-catalog-playbook-realignment"
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
| **Predecessor** | 011-mandatory-interface-design-coupling |
| **Successor** | None |
| **Handoff Criteria** | The grounding feature states the coupling as MANDATORY; a manual-testing scenario verifies the hard gate (design work blocked without sk-design-interface, transport exempt); sk-doc validators 0 issues; `validate.sh --strict` exits 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 12** of the mcp-open-design specification — a doc-realignment phase closing the catalog/playbook gap left open by phase 011.

**Scope Boundary**: Edit only `feature_catalog/` and `manual_testing_playbook/` in `mcp-open-design`. No change to SKILL.md/README (they already carry the mandatory-coupling reality). No behavior change.

**Dependencies**: Phase 011 (the mandatory sk-design-interface coupling) and phase 143/010 (the split `design_parity_transport.md`) are the reality the docs must match.

**Deliverables**: the grounding feature rewritten to MANDATORY framing, a gate-enforcement manual-testing scenario, and reconciled indexes/counts.

**Changelog**: doc-only realignment; no skill version bump required.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 011 made the `sk-design-interface` coupling a hard precondition for all design work (banner, hard gate, NEVER #6, success-criteria gate). But the grounding feature catalog entry still described the coupling as "optional and on-demand", directly contradicting the runtime rule, and no manual-testing scenario verified the gate — so the docs both mis-state the coupling and leave the most important new invariant untested.

### Purpose
Make the grounding feature state the coupling as MANDATORY, and add a scenario that proves a design RUN/READ without `sk-design-interface` is blocked while pure transport is exempt.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rewrite `feature_catalog/03--grounding/design-system-grounding.md` from "optional and on-demand" to MANDATORY / hard-precondition framing.
- A manual_testing_playbook scenario verifying the mandatory gate (negative + positive + exemption controls), plus index/cross-ref/count updates.

### Out of Scope
- SKILL.md / README / INSTALL_GUIDE (already aligned in phase 011).
- The `od` CLI contract, tool surface, gating taxonomy.
- Any behavior change.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `feature_catalog/03--grounding/design-system-grounding.md` | Modify | Optional -> MANDATORY framing; keep the design_parity_transport.md/real_ui_loop.md refs |
| `manual_testing_playbook/**` (new scenario) + `manual_testing_playbook.md` | Create/Modify | Gate-enforcement scenario; index/cross-ref/counts |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Mandatory framing | The grounding feature states the coupling as a hard precondition; no "optional and on-demand" / "applied whenever" wording remains |
| REQ-002 | Gate scenario | A scenario verifies: design RUN/READ without sk-design-interface is blocked (negative); proceeds with it (positive); pure transport is exempt |
| REQ-003 | Indexes reconciled | playbook index, counts, cross-references include the new scenario; all links resolve |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | No dead links | No `claude_design_parity.md` references; refs resolve to design_parity_transport.md / real_ui_loop.md |
| REQ-005 | Validators + strict | sk-doc validators 0 issues; `validate.sh --strict` exits 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The grounding feature reads MANDATORY (hard precondition), matching SKILL.md.
- **SC-002**: A playbook scenario verifies the hard gate with a negative control.
- **SC-003**: No dead `claude_design_parity.md` references; sk-doc validators 0 issues.
- **SC-004**: `validate.sh --strict` exits 0 on this phase folder.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Feature still reads optional | Docs contradict the runtime gate | Rewrite all conditional wording (description, overview, guardrails) to mandatory |
| Risk | Scenario tests a soft gate | The hard-block invariant stays untested | Require a negative control (blocked without sk-design-interface) and an exemption control (transport allowed) |
| Dependency | Phase 011 + 143/010 | The reality the docs match | Mirror the SKILL.md banner/RULES and the split transport doc |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
