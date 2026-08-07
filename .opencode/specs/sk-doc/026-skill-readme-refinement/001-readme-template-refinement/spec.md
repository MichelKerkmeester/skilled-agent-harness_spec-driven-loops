---
title: "Feature Specification: Phase 001 - shared standalone skill README template refinement"
description: "Refine the shared standalone skill README template with the mcp-obsidian pilot learnings: purpose-first identity, capability sections, HVR enforcement, versioning conventions and a stricter validation checklist."
trigger_phrases:
  - "readme template refinement"
  - "skill readme template update"
  - "phase 001 template"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/001-readme-template-refinement"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffold Phase 001 phase documentation"
    next_safe_action: "Execute the template refinement per REQ-001..REQ-008"
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
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Phase 001 - shared standalone skill README template refinement

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-08-04 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` (026-skill-readme-refinement) |
| **Parent Packet** | `sk-doc/026-skill-readme-refinement` |
| **Predecessor** | None |
| **Successor** | `002-parent-skill-readme-template` |
| **Handoff Criteria** | The refined template carries every handover §2 directive, the phase docs validate with zero errors and `git status` shows only the template plus this phase's docs changed |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The shared standalone README template at `sk-create-skill/assets/skill/skill-readme-template.md` predates the mcp-obsidian pilot. It still steers authors toward the older tabular reference-card style. It has no guidance for purpose-first identity, no capability section pattern, no built-in HVR enforcement, no versioning conventions and a validation checklist that misses the pilot's gates.

### Purpose
Refine the template so any author emitting a standalone skill README ships purpose-first narrative docs that state the outcome before the tooling, carry a capability section for headline strengths, obey the Human Voice Rules, version and log releases and pass the sk-doc README validator.

**End goal:** one refined template whose every directive traces to handover §2, ready to serve as the standalone README contract for phases 002 and 003 and to gate the fleet revisits in 004 and 005.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Refine `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md` only.
- Add purpose-first identity guidance (outcome before tooling).
- Add a capability section pattern modeled on the pilot's Plugin Knowledge Layer.
- Add HVR enforcement guidance with the banned forms and scripted grep commands.
- Add versioning conventions for the README version field and per-skill changelog entries.
- Replace the validation checklist with the stricter pilot set.
- Author this phase's four documentation files.

### Out of Scope
- The parent-skill README template (phase 002).
- The creation workflow update (phase 003).
- Any fleet README rewrite (phases 004 and 005).
- The mcp-obsidian README, any SKILL.md, `skill-md-template.md`, or any other template asset.
- Vault, plugin, or runtime files.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md` | Modify | Refine per pilot learnings: purpose-first identity, capability sections, HVR enforcement, versioning, stricter validation checklist |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/001-readme-template-refinement/spec.md` | Create | Phase spec (this file) |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/001-readme-template-refinement/plan.md` | Create | Phase implementation plan |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/001-readme-template-refinement/tasks.md` | Create | Phase task list |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/001-readme-template-refinement/checklist.md` | Create | Phase verification checklist |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Template identity guidance is purpose-first | The identity guidance block opens with the delivered outcome before any tool name. The tooling is described only after the outcome statement |
| REQ-002 | Template documents a capability section pattern | The template contains a dedicated capability section model with example prose, modeled on the pilot's Plugin Knowledge Layer |
| REQ-003 | Template embeds HVR enforcement | The template lists the banned forms verbatim (em dashes, semicolons, Oxford commas, banned words, forced three-item groups) plus the scripted grep commands and links `hvr-rules.md` |
| REQ-004 | Template documents versioning conventions | The template specifies a README version field and requires a per-skill changelog entry for every release, with an entry format pointer |
| REQ-005 | Template validation checklist is the stricter pilot set | The checklist names pitch, AT A GLANCE, numbered ALL-CAPS H2, OVERVIEW required, command output expectations, link verification and `validate_document.py --type readme`, each with a pass criterion |
| REQ-006 | Template structure stays section-model compatible | Numbered ALL-CAPS H2 with `---` dividers remain, AT A GLANCE stays first with four one-line rows, QUICK START keeps expected outputs, OVERVIEW remains the only required section |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Every handover §2 directive has a template home | A directive-to-template cross-check table maps each of the eight handover §2 directives to a template location with no gaps |
| REQ-008 | No out-of-scope assets change | `git status` shows only the template file plus this phase's four documentation files |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: An author following the refined template produces a purpose-first narrative README that passes `validate_document.py --type readme` with zero issues.
- **SC-002**: Every directive in handover §2 is traceable to a template location.
- **SC-003**: The template body itself is HVR clean (zero em dashes, semicolons, Oxford commas or banned words).
- **SC-004**: The phase docs validate with zero errors and the phase folder ships spec, plan, tasks and checklist.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Handover §2 directives are the source of truth | Refinement drifts from the pilot standard | REQ-007 cross-check table gates completion |
| Dependency | Phases 002 and 003 consume this template | Fleet is built on a moving contract | Structure stability via REQ-006 and phase ordering 001 gates 002-005 |
| Risk | Template prose itself violates HVR | Authors inherit banned forms | HVR grep gate on the template body in verification |
| Risk | Stricter checklist over-constrains small modes | Small skills cannot earn sections | Checklist keeps OVERVIEW as the only required section |
| Risk | Validator rejects refined guidance | Authors cannot validate output | Throwaway sample README validated in a temp location during execution |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
