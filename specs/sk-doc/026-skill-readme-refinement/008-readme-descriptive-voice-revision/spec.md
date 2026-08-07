---
title: "Feature Specification: Phase 008 - README template descriptive-voice revision"
description: "Revise the standalone and parent-hub skill README templates so authors produce descriptive, narrative documents in the repo root README voice instead of concise reference cards: raise prose ceilings, require a problem narrative, add a prose capability lead-in, promote the architecture diagram, add a value beat, permit a narrative hook and clarify that HVR governs clarity not sentence length."
trigger_phrases:
  - "readme template descriptive voice"
  - "skill readme template richer"
  - "phase 008 template revision"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/008-readme-descriptive-voice-revision"
    last_updated_at: "2026-08-05T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffold Phase 008 phase documentation"
    next_safe_action: "Execute the template revision per REQ-001..REQ-008"
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
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Phase 008 - README template descriptive-voice revision

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-08-05 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` (026-skill-readme-refinement) |
| **Parent Packet** | `sk-doc/026-skill-readme-refinement` |
| **Predecessor** | `007-fix-post-closeout-gates-for-readme-fleet` |
| **Successor** | None |
| **Handoff Criteria** | Both templates carry every REQ-001..REQ-007 change, the version bumps and changelog land, the phase docs validate with zero errors and `git status` shows only the two templates, the new changelog entry, the 007 successor row and this phase's docs changed |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phases 001 and 002 refined the standalone and parent-hub README templates and phases 004 and 005 rewrote the fleet against them. The finished READMEs read correct but thin. They land as concise reference cards, not as the descriptive narrative the repo root `README.md` delivers. The cause is the templates themselves. Six defaults steer authors toward the floor: OVERVIEW blocks capped at "two to four sentences", an AT A GLANCE table as the reader's first contact, capability sections that are table-only, an architecture diagram marked optional with "only if", no slot for a value or why-it-matters beat and an HVR reading that treats short sentences as the goal. An author who fills every placeholder to its minimum ships a document that scans fast and says little.

### Purpose
Revise both templates so the default output is descriptive and narrative in the root README voice while the Human Voice Rules stay intact. Raise the prose ceilings, require a problem narrative with a worked example, add a prose lead-in to the capability section, promote the architecture diagram from optional to expected for multi-step skills, add an optional value beat, permit a short narrative hook after the pitch and clarify that "one idea per sentence" governs clarity rather than sentence length.

**End goal:** two revised templates whose defaults produce a document a person reads top to bottom and understands, at skill scale, that still passes the sk-doc README validator and the Human Voice Rules.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Revise `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md` (S1 through S6).
- Revise `.opencode/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-readme-template.md` (S7, mirror S1 through S5).
- Bump the skill template version 1.9.0.0 to 1.10.0.0 and the parent template version 1.0.0.0 to 1.1.0.0.
- Add a `sk-create-skill/changelog/v1.2.0.0.md` entry covering both template bumps.
- Update the 007 phase spec Successor row to point to this phase.
- Author this phase's five documentation files.

### Out of Scope
- Rewriting any fleet README. Re-running the fleet against the revised templates is a separate downstream 004 and 005 re-pass, not this phase.
- The mcp-obsidian README, any `SKILL.md`, `skill-md-template.md`, the reference-file template or any other asset.
- Weakening the HVR hard blockers. The em dash, semicolon, Oxford comma and banned-word rules stay exactly as they are.
- Chasing the root README length. The target is its voice and density at skill scale, near 150 to 350 lines.
- Vault, plugin, or runtime files.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md` | Modify | Revise per S1 through S6, version 1.9.0.0 to 1.10.0.0 |
| `.opencode/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-readme-template.md` | Modify | Revise per S7, version 1.0.0.0 to 1.1.0.0 |
| `.opencode/skills/sk-doc/sk-create-skill/changelog/v1.2.0.0.md` | Create | Changelog entry for the two template bumps |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/007-fix-post-closeout-gates-for-readme-fleet/spec.md` | Modify | Update Successor row None to 008 (phase-links chain) |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/008-readme-descriptive-voice-revision/spec.md` | Create | Phase spec (this file) |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/008-readme-descriptive-voice-revision/plan.md` | Create | Phase implementation plan |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/008-readme-descriptive-voice-revision/tasks.md` | Create | Phase task list |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/008-readme-descriptive-voice-revision/checklist.md` | Create | Phase verification checklist |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/008-readme-descriptive-voice-revision/implementation-summary.md` | Create | Phase implementation summary |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Prose ceilings raised and a problem narrative required | The skill template Why This Skill Exists guidance and scaffold ask for a 3 to 6 sentence problem narrative that puts the reader in a concrete failing situation before naming the solution, with a worked example inside a code fence. The "two to four sentences" cap is removed from the problem block |
| REQ-002 | Capability section gains a prose lead-in | The capability section pattern requires 1 to 2 narrative sentences before the table and permits one clarifying analogy. The scaffold capability block carries a prose lead-in placeholder |
| REQ-003 | Architecture diagram promoted for multi-step skills | The HOW IT WORKS guidance and scaffold instruct authors to include a small ASCII connection diagram for any skill with a multi-step flow. The prior "only if" framing is softened to expected-for-multi-step. A diagram stub sits in the scaffold |
| REQ-007 | Parent template mirrors S1 through S5 | The parent-hub template raises its OVERVIEW ceiling, requires a narrative Why This Hub Exists story, adds a hub connection diagram, adds a prose lead-in before the modes table and adds an optional value beat |
| REQ-008 | Versioning, changelog and scope hold | The skill template moves 1.9.0.0 to 1.10.0.0, the parent template moves 1.0.0.0 to 1.1.0.0, `changelog/v1.2.0.0.md` documents both, and `git status` shows only the in-scope files changed. Both templates stay validator-clean and the scaffolds they produce stay HVR-clean |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Optional value beat added | Both templates document an optional Why It Matters outcome-bullet beat inside OVERVIEW, benefit-first, and the section model lists it as optional |
| REQ-005 | Narrative hook permitted after the pitch | The writing rules permit a 2 to 3 sentence narrative hook after the blockquote pitch and before AT A GLANCE. AT A GLANCE stays the first numbered section so the validator contract holds |
| REQ-006 | HVR clarified on sentence length | A writing rule states that one idea per sentence governs clarity, not length, and that a descriptive multi-clause sentence is allowed when it reads naturally aloud. The banned forms stay unchanged |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: An author following the revised skill template produces a descriptive narrative README that still passes `validate_document.py --type readme` with zero issues.
- **SC-002**: Every S1 through S7 change is present in the templates and traceable to a REQ.
- **SC-003**: The new guidance prose in both templates is HVR clean, and every vivid example is confined to a code fence so the example voice does not trip the banned-form checks.
- **SC-004**: The version bumps, the changelog entry and the 007 successor update land, and the phase docs validate with zero errors.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | New descriptive guidance collides with HVR | Authors inherit banned forms from the template body | Keep guidance prose HVR clean, put every vivid example inside a code fence, grep the template body |
| Risk | Reordering for a narrative hook breaks the AT A GLANCE first-section contract | The validator or the 50 shipped READMEs lose their expected shape | Keep AT A GLANCE the first numbered section, permit the hook only between the blockquote and the table |
| Risk | Descriptive default over-inflates small skills | A small utility skill ships padded prose | Frame the narrative and diagram as expected for multi-step skills only, keep OVERVIEW the only required section |
| Dependency | The templates are uncommitted working-tree state from the 026 program | This revision stacks on fragile state | Edit additively, never clobber, commit after validation to make the work durable |
| Dependency | 007 is a closed phase | Editing its successor row touches shipped work | The edit is a single phase-links metadata row, verified by validate.sh |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The operator directed implementing all seven suggestions, including the moderate HVR clarification (clarity not length) rather than relaxing any banned form.
<!-- /ANCHOR:questions -->
