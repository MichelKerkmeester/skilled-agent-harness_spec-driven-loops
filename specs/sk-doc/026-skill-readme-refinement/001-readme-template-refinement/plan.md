---
title: "Implementation Plan - Phase 001 - shared standalone skill README template refinement"
description: "Refine the shared standalone skill README template with the mcp-obsidian pilot learnings: purpose-first identity, capability sections, HVR enforcement, versioning conventions and a stricter validation checklist."
trigger_phrases:
  - "phase 001 plan"
  - "readme template refinement plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/001-readme-template-refinement"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Phase 001 implementation plan"
    next_safe_action: "Execute the template refinement per the task list"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-001-readme-template-refinement"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan - Phase 001 - shared standalone skill README template refinement

<!-- ANCHOR:summary -->
## 1. SUMMARY

Refine `sk-create-skill/assets/skill/skill-readme-template.md` with the mcp-obsidian pilot learnings: purpose-first identity framing, a capability section pattern modeled on the Plugin Knowledge Layer, embedded HVR enforcement with grep commands, versioning conventions and the stricter validation checklist. One template file changes. Everything else in the repo stays untouched. Rollback is a git revert.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check | Tool |
|------|-------|------|
| Purpose-first identity | Identity guidance opens with outcome before tooling | read + grep |
| Capability pattern | Capability section model present with example prose | grep + read |
| HVR enforcement | Banned forms listed verbatim with grep commands | grep + read |
| Versioning | README version field and changelog entry convention present | grep + read |
| Checklist strictness | All seven named checklist items present with pass criteria | read + grep |
| Structure stability | Numbered ALL-CAPS H2, AT A GLANCE first, OVERVIEW only required section | grep + read |
| Directive coverage | Handover §2 cross-check table has no gaps | read |
| HVR clean template body | Zero em dashes, semicolons, Oxford commas, banned words | rg |
| Validator compatibility | Throwaway sample README validates with zero issues | validate_document.py |
| Scope discipline | Only the template plus phase docs changed | git status |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Artifact | Change |
|----------|--------|
| `skill-readme-template.md` | Refined guidance blocks: purpose-first identity, capability section pattern, HVR enforcement, versioning conventions, stricter validation checklist. Section model and section order unchanged |
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
| Setup | Read sources, inventory current template against handover §2, capture gap list |
| Implementation | Rewrite identity guidance, add capability pattern, embed HVR block, add versioning, replace validation checklist, verify structure |
| Verification | HVR grep on template body, throwaway sample validation, acceptance per REQ, phase validation, scope check |

Sequenced in tasks.md (T001-T012).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Documentation test only. The template body passes an HVR grep. A throwaway sample README built from the refined template validates with `validate_document.py --type readme` in a temp directory outside the repo and is deleted after the run. Phase validation runs `validate.sh` with zero errors. No vault or UI test applies.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Risk | Mitigation |
|------------|------|------------|
| Handover §2 and §4 directives | Refinement drifts from the pilot standard | REQ-007 cross-check table plus a pre-writing handover read |
| `hvr-rules.md` | Banned word list goes stale | Link the rules file instead of copying the full list |
| `validate_document.py` | Refined guidance cannot validate | Throwaway sample validation in temp before the template lands |
| Phases 002-005 | Fleet built on a moving contract | Structure stability via REQ-006, with phase ordering enforced by the parent spec |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

`git revert` the template refinement commit to restore `skill-readme-template.md` exactly. The phase docs revert with the same commit. No other file participates.
<!-- /ANCHOR:rollback -->
