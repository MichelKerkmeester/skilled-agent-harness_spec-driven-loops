---
title: "Implementation Summary [template:level_1/implementation-summary.md]"
description: "Status: DONE. sk-design-interface's feature_catalog now catalogues the Mobbin/Refero design-references capability + its hybrid initiative/ask routing, and a new ID-010 manual-testing scenario exercises the routing gate. No Open Design naming reintroduced."
trigger_phrases:
  - "sk-design-interface catalog realignment done"
  - "design-references feature added"
  - "id-010 routing scenario"
  - "impl summary core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "design/001-sk-design-interface/012-catalog-playbook-realignment"
    last_updated_at: "2026-06-17T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Catalogued design-references capability + added ID-010 routing scenario"
    next_safe_action: "Phase complete"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design-interface/feature_catalog/03--design-grounding/design-references-grounding.md"
      - ".opencode/skills/sk-design-interface/manual_testing_playbook/08--design-references-routing/initiative-ask-fallback-routing.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-148-012-catalog-playbook-realignment"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 012-catalog-playbook-realignment |
| **Status** | DONE - design-references feature + ID-010 routing scenario added |
| **Created** | 2026-06-17 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

> **Status: DONE.** The Mobbin/Refero design-references capability (phase 009) and its hybrid initiative/ask routing (phase 011) existed in SKILL.md + design_references_mcp.md but were never catalogued or tested. Both are now represented.

### Catalogued the design-references capability
A new `feature_catalog/03--design-grounding/design-references-grounding.md` mirrors the design-system-grounding structure and covers the Mobbin/Refero capability plus the hybrid initiative/ask routing and the Mobbin-vs-Refero source pick, anchored to `design_references_mcp.md`, `mobbin_tools.md`, `refero_tools.md`. The root `feature_catalog.md` now shows two grounding features (§4 narrative + inventory + count), and the critique-against feature lists `design_references_mcp.md` as a critique-step implementation surface.

### Tested the routing
A new `manual_testing_playbook/08--design-references-routing/initiative-ask-fallback-routing.md` (ID-010) validates: the initiative trigger (convention-heavy category + connected subscription → pull ONE, name the default, cite the URL); the ask fallback (borderline/unknown → ask first); the clean non-blocking fall-back; the Mobbin(app/iOS)-vs-Refero(web/styles) pick; and the negative control (never a chooser, read live, never copied, grounding stays upstream). The playbook index was reconciled: 9→10 scenarios, 7→8 categories, the wave/coverage/cross-reference tables, and the review checklist.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `feature_catalog/03--design-grounding/design-references-grounding.md` | Created | The Mobbin/Refero design-references feature + hybrid routing |
| `feature_catalog/feature_catalog.md` | Modified | Inventory, §4 narrative, count (grounding now 2 features) |
| `feature_catalog/01--design-process/critique-against-defaults.md` | Modified | Added design_references_mcp.md to the critique-step surfaces |
| `manual_testing_playbook/08--design-references-routing/initiative-ask-fallback-routing.md` | Created | ID-010 initiative/ask routing scenario |
| `manual_testing_playbook/manual_testing_playbook.md` | Modified | Index, counts (9→10), categories (7→8), waves, cross-reference |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The audit found the catalog and playbook under-represented the skill: a whole capability (real-world references) and its newest decision logic (the initiative/ask gate) were absent. The fix added one feature entry and one scenario that mirror the existing house format, and reconciled every index count and cross-reference. The authoring was delegated to a scoped writer constrained to `feature_catalog/` and `manual_testing_playbook/`, gated on the sk-doc validators and a grep proving no Open Design naming was reintroduced (the decouple from phase 010 stays intact).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Add a second grounding feature, not fold into design-system-grounding | Real-world references (Mobbin/Refero) and a design system you own are distinct capabilities with different rules (reuse-ground vs critique-against only) |
| Make the scenario test the DECISION, not just the mechanics | The phase-011 value is the initiative/ask gate; a scenario that only calls the tools would miss the new behavior |
| Cross-reference from critique-against | ALWAYS rule 7 puts the reference decision at the critique step, so the critique feature should name the surface |
| Doc-only, no version bump | Behavior was set in phases 009/011; this phase only catches the docs up |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| design-references capability catalogued with hybrid routing | PASS (new feature file + §4 inventory shows 2 grounding features) |
| ID-010 scenario covers initiative/ask/fall-back + source pick + negative control | PASS (scenario present, mirrors house format) |
| Playbook index reconciled (9→10 scenarios, 7→8 categories, waves, cross-ref) | PASS |
| No Open Design naming reintroduced | PASS (`rg -i 'mcp-open-design\|open design\|claude_design_parity'` over both dirs → 0) |
| sk-doc validators on both indexes + new files | PASS (0 issues) |
| `validate.sh <this phase> --strict` | PASS (exit 0) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Doc-only realignment.** No SKILL.md/references change and no version bump; this phase only makes the catalog/playbook a faithful mirror of phases 009/011.
2. **The routing scenario is operator-run.** ID-010 is a manual scenario; like the other playbook entries it is executed by an operator in a real session, not an automated test.
<!-- /ANCHOR:limitations -->
