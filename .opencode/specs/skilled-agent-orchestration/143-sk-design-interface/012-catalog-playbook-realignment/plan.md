---
title: "Implementation Plan: Phase 12: catalog-playbook-realignment [template:level_1/plan.md]"
description: "Plan to add the Mobbin/Refero design-references feature and a hybrid-routing manual-testing scenario to sk-design-interface's catalog and playbook."
trigger_phrases:
  - "sk-design-interface catalog realignment plan"
  - "design references feature plan"
  - "phase 012 plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/143-sk-design-interface/012-catalog-playbook-realignment"
    last_updated_at: "2026-06-17T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Scaffolded the realignment phase; content delegated to a scoped writer"
    next_safe_action: "Validate the catalog/playbook and the phase"
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
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 12: catalog-playbook-realignment

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill docs (feature_catalog, manual_testing_playbook) |
| **Framework** | sk-doc structure + validators |
| **Storage** | `.opencode/skills/sk-design-interface/{feature_catalog,manual_testing_playbook}/` |
| **Testing** | sk-doc `validate_document.py`; `validate.sh --strict`; grep for Open Design regressions |

### Overview
Catch the catalog and playbook up to the phase-011 reality. The Mobbin/Refero design-references capability and its hybrid initiative/ask routing exist in SKILL.md + design_references_mcp.md but were never catalogued or tested. Add a feature entry and a scenario, mirroring the existing house format, and reconcile the indexes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (validators green)
- [x] Docs updated (feature + scenario + indexes)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Inventory + test-matrix catch-up: the docs become a faithful mirror of the skill's real surface.

### Key Components
- **design-references-grounding feature**: Mobbin/Refero capability + hybrid routing, sibling to design-system-grounding under §4
- **critique-against cross-ref**: design_references_mcp.md added to the critique step's implementation surfaces
- **routing scenario**: a manual-testing scenario for initiative/ask/fall-back + source pick + guardrails
- **index reconciliation**: counts, cross-references, waves

### Data Flow
An auditor reading the catalog now sees the design-references capability; the playbook now has a scenario that exercises the initiative/ask decision and the Mobbin-vs-Refero pick against the design_references_mcp.md gate.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Feature catalog
- [x] Add `design-references-grounding.md` under `03--design-grounding/`
- [x] Update the index inventory, §4 narrative, and counts
- [x] Add design_references_mcp.md to the critique-against feature's implementation surfaces

### Phase 2: Playbook
- [x] Add a scenario for the initiative/ask routing + source pick + guardrails
- [x] Update the playbook index, cross-reference, waves, counts

### Phase 3: Verify
- [x] sk-doc validators 0 issues; no Open Design regression; strict-validate; reconcile parent map
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structure | Catalog + playbook indexes valid | sk-doc `validate_document.py` |
| Regression | No Open Design naming reintroduced | `rg -i` over the touched dirs |
| Phase | Folder validates | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 011 routing | Internal | Green | The reality the docs mirror |
| sk-doc validators | Tooling | Green | Confirm structure |
| design_references_mcp.md §3 | Internal | Green | Source of the routing wording |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A new doc breaks the sk-doc structure or misrepresents the routing.
- **Procedure**: Revert the catalog/playbook additions from git; documentation-only, fully reversible.
<!-- /ANCHOR:rollback -->
