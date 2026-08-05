---
title: "Implementation Plan - Phase 008 - README template descriptive-voice revision"
description: "Execution plan for the descriptive-voice revision of the standalone and parent-hub README templates: raise prose ceilings, require a problem narrative, add a capability prose lead-in, promote the connection diagram, add a value beat, permit a narrative hook and clarify HVR sentence length."
trigger_phrases:
  - "phase 008 plan"
  - "readme template revision plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/008-readme-descriptive-voice-revision"
    last_updated_at: "2026-08-05T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Phase 008 implementation plan"
    next_safe_action: "Execute the template revision per T001..T012"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-008-readme-descriptive-voice-revision"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan - Phase 008 - README template descriptive-voice revision

<!-- ANCHOR:summary -->
## 1. SUMMARY

Revise the two `sk-create-skill` README templates so their default output is descriptive narrative in the repo root README voice rather than a concise reference card. Six defaults in the standalone template steer authors to the floor, and the parent-hub template repeats the pattern. The revision raises the prose ceilings, requires a problem narrative, adds a capability prose lead-in, promotes the connection diagram, adds a value beat, permits a narrative hook and clarifies that the Human Voice Rules govern clarity rather than sentence length. Two template files change plus one changelog entry and one phase-links row. Rollback is a git revert.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check | Tool |
|------|-------|------|
| Problem narrative | Skill template asks for a 3 to 6 sentence narrative with a worked example | read + grep |
| Capability prose lead-in | Capability pattern requires prose before the table plus an analogy license | read + grep |
| Diagram promoted | HOW IT WORKS carries an expected-for-multi-step ASCII diagram stub | read + grep |
| Value beat | Optional Why It Matters subsection present in both templates | grep + read |
| Narrative hook | Writing rule permits a hook after the pitch, AT A GLANCE stays first | read + grep |
| HVR clarity note | Writing rule states clarity not length, banned forms unchanged | read + grep |
| Parent mirror | Parent template carries the narrative story, hub diagram, modes lead-in and value beat | read + grep |
| Versions | Skill template 1.10.0.0, parent template 1.1.0.0, changelog v1.2.0.0 | grep |
| HVR clean bodies | Zero em dashes, semicolons, Oxford commas in prose | rg |
| Validator compatibility | Throwaway sample from the revised scaffold validates with zero issues | validate_document.py |
| Scope discipline | Only the two templates, the changelog, the 007 row and this phase's docs changed | git status |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Artifact | Change |
|----------|--------|
| `skill-readme-template.md` | S1 through S6 plus two validation-checklist rows, version 1.9.0.0 to 1.10.0.0. Section model and section order unchanged |
| `parent-skill-readme-template.md` | S7 mirror of S1 through S5, version 1.0.0.0 to 1.1.0.0 |
| `changelog/v1.2.0.0.md` | Changelog entry for both bumps in NEW / CHANGED / NOT CHANGED shape |
| `007 spec.md` | Successor row None to 008 for the phase-links chain |
| `spec.md` | Phase spec with REQ-001..REQ-008 |
| `plan.md` | This plan |
| `tasks.md` | Sequenced tasks T001..T012 |
| `checklist.md` | Verification checklist CHK-001..CHK-034 |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Phase | Work |
|-------|------|
| Setup | Read both templates, the root README and `hvr-rules.md`, confirm the six brevity limiters, map S1 through S7 to REQ-001..REQ-007 and the exact edit sites |
| Implementation | Apply S1 through S6 to the skill template, S7 to the parent template, bump versions, add the changelog entry, update the 007 successor row |
| Verification | HVR grep both template bodies, throwaway sample validation, metadata regeneration, phase validation, scope check |

Sequenced in tasks.md (T001-T012).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Documentation test only. Both template bodies pass an HVR grep outside code fences. A throwaway sample README built from the revised scaffold validates with `validate_document.py --type readme` in a scratch location outside the repo and is not committed. Phase validation runs `validate.sh --strict` with zero errors on 008 and the parent packet. No vault, plugin or UI test applies.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Risk | Mitigation |
|------------|------|------------|
| The two templates are uncommitted 026 state | The revision stacks on fragile working-tree state | Edit additively with unique strings, commit after validation |
| `hvr-rules.md` banned forms | New guidance prose inherits a banned form | Write guidance HVR clean, keep vivid examples inside code fences, grep the bodies |
| `validate_document.py` | The revised scaffold cannot validate | Throwaway sample validation before completion |
| The AT A GLANCE first-section contract | A narrative hook breaks the validator or the shipped fleet shape | Keep AT A GLANCE the first numbered section, permit the hook only above it |
| 007 is a closed phase | Editing its successor row touches shipped work | Single phase-links metadata row, verified by validate.sh |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

`git revert` the revision commit to restore both templates, the changelog and the 007 successor row exactly. The phase docs revert with the same commit. Before a commit exists, `git restore -- <changed paths>` returns the templates to their prior working-tree state. No runtime file participates.
<!-- /ANCHOR:rollback -->
