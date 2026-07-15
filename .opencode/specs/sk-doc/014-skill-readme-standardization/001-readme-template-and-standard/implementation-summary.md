---
title: "Implementation Summary: README template and standard"
description: "The sk-doc skill-README template now writes in the narrative changelog voice, and the sk-git README is the golden example that proves it passes sk-doc validation and HVR."
trigger_phrases:
  - "readme template implementation"
  - "narrative readme standard shipped"
  - "sk-git golden example"
importance_tier: "high"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-skill-readme-standardization/001-readme-template-and-standard"
    last_updated_at: "2026-06-07T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped narrative template + sk-git golden example"
    next_safe_action: "Begin batch A skill README rewrites (phases 002-005)"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/assets/skill/skill_readme_template.md"
      - ".opencode/skills/sk-git/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "readme-std-135-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Template + golden example shipped, both pass validation and HVR"
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
| **Spec Folder** | 001-readme-template-and-standard |
| **Completed** | 2026-06-07 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The sk-doc skill-README template now writes in the same narrative voice the repo root README and the changelogs use, and the sk-git README is the worked example that proves the standard holds.

### Narrative template

The template leads with the reader. A skill README now opens with a one-line pitch in a blockquote, then an AT A GLANCE table, then a problem-first OVERVIEW that states what goes wrong without the skill before listing what it does. Prose carries the explanation and tables appear only for genuine lookups. The section model, the writing rules, the fillable scaffold and the validation checklist were all rewritten to match.

The one constraint that shaped the design: `validate_document.py` parses only numbered H2 headers when it checks for the required OVERVIEW section, so the narrative voice lives inside numbered ALL-CAPS sections rather than the mixed-case headers the root README uses. The template documents that constraint in its writing rules so later authors do not fight the validator.

### sk-git golden example

The sk-git README was rewritten from its real `SKILL.md` and references into the new voice, at about half the length of the old version. It is the reference later phases copy from. A stale fact was corrected on the way: the old README counted six references when the skill ships seven, so `large_reorg_playbook.md` is now listed.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-doc/assets/skill/skill_readme_template.md` | Modified | Narrative skeleton, writing rules, fillable scaffold, validation checklist |
| `.opencode/skills/sk-git/README.md` | Modified | Golden-example README in the new voice |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The work started by reading the actual contract: the sk-doc readme rules in `template_rules.json` and the Human Voice Rules. That read surfaced the numbered-header constraint before any prose was written, so the design satisfied the validator by construction. The golden example was then validated with `validate_document.py --type readme` (zero issues) and scanned for HVR violations.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep numbered ALL-CAPS H2 headers | The validator only finds the required OVERVIEW section among numbered headers, so un-numbered narrative headers would fail validation |
| Put the voice in prose and structure, not header casing | This is what makes a README read like the changelogs while still passing the validator |
| Use sk-git as the golden example | It is a mid-size orchestrator that exercises most sections, so it is a fair reference for the other skills |
| Hand-author the example rather than run the model recipe | Phase 001 sets the standard, so a human-authored exemplar locks intent before the dual-model batches run |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate_document.py --type readme` on sk-git README | PASS, 0 issues |
| `validate_document.py` on the template file | PASS (2 non-blocking numbering warnings from the scaffold inside the fenced block) |
| HVR scan (em dash, semicolon, Oxford-comma lists, hard-blocker words) | PASS, clean on both files |
| `validate.sh --strict` on phase 001 | PASS, 0 errors 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The template file shows two non-blocking numbering warnings.** The validator reads the numbered headers inside the fenced scaffold block as real H2s, so it reports non-sequential numbering. This is cosmetic and the same behavior affected the previous template.
2. **The golden example is hand-authored, not produced by the dual-model recipe.** Phases 002 onward use deep-context plus DeepSeek and MiMo. The sk-git README sets the bar those phases aim for.
<!-- /ANCHOR:limitations -->
