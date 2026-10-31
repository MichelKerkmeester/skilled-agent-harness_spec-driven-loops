---
title: "Implementation Summary"
description: "Every SKILL.md now ends with a MACHINE ROUTER section. The mcp-tooling hub was the last one without it, and the routing-shape check now fails any skill that lacks the section."
trigger_phrases:
  - "mcp tooling routing canon implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/013-mcp-tooling-routing-canon"
    last_updated_at: "2026-10-29T06:49:04Z"
    last_updated_by: "claude-opus"
    recent_action: "Moved the mcp-tooling hub to the canon and added RS-005"
    next_safe_action: "None; the phase is closed"
    blockers: []
    key_files:
      - ".skilled/skills/mcp-tooling/SKILL.md"
      - ".skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py"
      - ".skilled/commands/doctor/scripts/parent-skill-check.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "0268-mcp-tooling-routing-canon"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 013-mcp-tooling-routing-canon |
| **Completed** | 2026-10-29 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

All 54 skills and modes now share one routing setup: short SMART ROUTING prose, then a final MACHINE ROUTER section. The `mcp-tooling` hub was the one holdout, and the check that should have caught it let it pass.

### Phase 13: mcp-tooling-routing-canon

The hub's SMART ROUTING is now eight lines of prose that point at `ROUTER.md` and at the final section. The compiled-routing directive, the two-axis model, the routing rule, the outcomes and the surface-router note moved into `## 6. MACHINE ROUTER`. The hub routes exactly as before.

The check measured SMART ROUTING length and where router code blocks sat, so a skill with short prose and no code block passed while keeping its routing detail inline. RS-005 closes that gap: `package_skill.py --strict` and check 12b of `parent-skill-check.cjs` now fail a SKILL.md with no MACHINE ROUTER section.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/mcp-tooling/SKILL.md` | Modified | Canon shape |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py` | Modified | RS-005 |
| `.skilled/commands/doctor/scripts/parent-skill-check.cjs` | Modified | RS-005 in check 12b |
| `.skilled/skills/sk-doc/scripts/tests/test_routing_shape.py` | Modified | RS-005 case, RS-002 fixtures keep the appendix |
| `.skilled/skills/sk-doc/scripts/tests/test_create_skill_contract.py` | Modified | Clean fixture ends with the section |
| `.skilled/skills/sk-doc/scripts/tests/test_package_skill_regressions.py` | Modified | Clean fixture ends with the section |
| `.skilled/commands/doctor/scripts/tests/parent-skill-check-routing-shape.test.cjs` | Modified | RS-005 case, fixture hub ends with the section |
| `sk-create-skill` `validation-and-packaging.md`, `creation-workflow.md`, `skill-md-template.md` | Modified | Five codes |
| `.skilled/commands/create/assets/create-skill-auto.yaml`, `create-skill-confirm.yaml` | Modified | Five codes |
| mcp-tooling, sk-create-skill and sk-doc version carriers and changelogs | Modified/Created | 1.9.2.0, 1.7.6.0, 2.3.30.0 |
| `.hermes/skills/mcp-tooling/SKILL.md`, the mcp-tooling route manifest and its twin | Modified | Regenerated |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A scan of the 54 SKILL.md files found the hub without the section, and the strict check passed it (`scratch/before.txt`). After the edits, the old hub file run through the new check returned RS-005 and the new file returned nothing (`scratch/after.txt`). Both suites passed, then the Hermes copies and the route manifest were regenerated and the 38-gate set ran in worktree 268 before landing on `main`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Require the section in every SKILL.md, not only hubs | 53 of 54 files already had it, so the rule adds no debt and matches what the canon docs already describe |
| RS-005 applies only where a SMART ROUTING section exists | The first landing failed Spec-Kit Check: other doctor suites build bare hub fixtures with no routing prose, and they are not skills in the canon's sense. RS-001 is scoped the same way, and the required-section check already rejects a SKILL.md with no SMART ROUTING |
| RS-002 fixtures keep the appendix | They test a block in the wrong place, and dropping the appendix would now add RS-005 to a case meant to isolate RS-002 |
| Keep the separate-router-file question out of scope | It changes the canon for every skill and the tooling that reads it, so it needs its own decision |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| SKILL.md files without the section | 0 of 54 (was 1) |
| Old hub file under the new check | RS-005 reported |
| sk-doc Python suite | 270 passed |
| JS routing-shape suite and debt ratchet | pass 1 fail 0; pass 4 fail 0 |
| 38-gate set | every gate exit 0 |
| Changelog validation | 0 issues on all three entries |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **MACHINE ROUTER still loads with every SKILL.md.** The sections are 22% of all SKILL.md words, and three files sit within 25 words of the 5,000-word cap. Moving them into a separate file is a canon change left for the operator to decide.
<!-- /ANCHOR:limitations -->

---
