---
title: "Implementation Plan: Phase 12: catalog-playbook-realignment [template:level_1/plan.md]"
description: "Plan to rewrite mcp-open-design's grounding feature to MANDATORY framing and add a hard-gate manual-testing scenario."
trigger_phrases:
  - "mcp-open-design catalog realignment plan"
  - "mandatory gate scenario plan"
  - "phase 012 plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "design/002-mcp-open-design/012-catalog-playbook-realignment"
    last_updated_at: "2026-06-17T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Scaffolded the realignment phase; content delegated to a scoped writer"
    next_safe_action: "Validate the catalog/playbook and the phase"
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
| **Storage** | `.opencode/skills/mcp-open-design/{feature_catalog,manual_testing_playbook}/` |
| **Testing** | sk-doc `validate_document.py`; `validate.sh --strict`; grep for stale wording |

### Overview
Close the catalog/playbook gap from phase 011. The grounding feature is reworded from "optional and on-demand" to a hard precondition, and a gate-enforcement scenario is added so the most important new invariant (no design output without sk-design-interface; transport exempt) is tested.
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
- [x] Docs updated (feature + scenario + index)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Doc-to-runtime reconciliation: the feature wording and the test matrix are brought into agreement with the SKILL.md hard gate.

### Key Components
- **Grounding feature rewrite**: optional -> MANDATORY framing (description, overview, guardrails)
- **Gate-enforcement scenario**: negative (blocked without sk-design-interface) + positive (proceeds with it) + exemption (transport allowed)
- **Index reconciliation**: counts, cross-references, waves

### Data Flow
A reader of the grounding feature now sees the hard precondition; the playbook now has a scenario that proves a design RUN without sk-design-interface is refused while wiring/inventory is exempt.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Feature
- [x] Rewrite `03--grounding/design-system-grounding.md` to MANDATORY framing (keep the split-doc references)

### Phase 2: Playbook
- [x] Add a gate-enforcement scenario (negative + positive + exemption controls)
- [x] Update the playbook index, cross-reference, waves, counts

### Phase 3: Verify
- [x] sk-doc validators 0 issues; no stale optional/claude_design_parity wording; strict-validate; reconcile parent map
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structure | Catalog + playbook indexes valid | sk-doc `validate_document.py` |
| Wording | No "optional and on-demand" / "applied whenever" / claude_design_parity | `rg -i` over the touched dirs |
| Phase | Folder validates | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 011 mandatory coupling | Internal | Green | The reality the docs mirror |
| Phase 143/010 split doc | Internal | Green | The transport doc the feature references |
| sk-doc validators | Tooling | Green | Confirm structure |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A reworded feature or new scenario breaks the sk-doc structure or misstates the gate.
- **Procedure**: Revert the catalog/playbook edits from git; documentation-only, fully reversible.
<!-- /ANCHOR:rollback -->
