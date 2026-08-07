---
title: "Feature Specification: Phase 008 sk-prompt README revisit"
description: "Rewrite the sk-prompt skill README at .opencode/skills/sk-prompt/README.md against the refined standalone README template from phase 001 and the mcp-obsidian exemplar, purpose-first with HVR enforcement, a version bump and a changelog entry."
trigger_phrases:
  - "sk prompt readme revisit"
  - "sk-prompt readme rewrite"
  - "prompt readme rewrite"
  - "phase 008 spec"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/008-sk-prompt"
    last_updated_at: "2026-08-04T13:24:03Z"
    last_updated_by: "008-sk-prompt"
    recent_action: "Executed README rewrite, version bump and changelog entry"
    next_safe_action: "Execute the README rewrite per REQ-001..REQ-009"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/008-sk-prompt"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Phase 008 sk-prompt README revisit

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 (phase child) |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-08-04 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` (004-standalone-readme-revisit) |
| **Parent Packet** | `sk-doc/026-skill-readme-refinement` |
| **Predecessor** | `007-sk-git` |
| **Successor** | `009-system-deep-loop` |
| **Handoff Criteria** | The sk-prompt README is rewritten purpose-first on the refined template, passes `validate_document.py --type readme` with zero issues, is HVR clean, carries version 1.1.0.0 with a changelog entry and this phase folder validates with zero errors |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The mcp-obsidian pilot set the standard for standalone skill READMEs: narrative, purpose-first documents that state the outcome before the tooling, obey the Human Voice Rules and pass the sk-doc README validator. The sk-prompt README at `.opencode/skills/sk-prompt/README.md` still carries the older tabular reference-card style and predates that pilot standard. It keeps a flat two-bullet OVERVIEW instead of a problem-first narrative, carries no capability section and no versioning conventions, links no changelog entry and ships frontmatter version 1.0.0.0 with no release note beyond the scaffold entry.

### Purpose
Rewrite the sk-prompt README against the refined standalone README template from phase 001 and the mcp-obsidian exemplar shape. The rewritten README pitches the hub in one line, explains why the skill exists before it lists the two packets, keeps every shipped fact about prompt-improve and prompt-models, bumps the version field to 1.1.0.0 and adds a changelog entry at `changelog/v1.1.0.0.md`.

**End goal:** a purpose-first narrative README that reads as one standard with the mcp-obsidian exemplar and passes the validator, the HVR grep and the link guard.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rewrite `.opencode/skills/sk-prompt/README.md` purpose-first per the refined template: one-line pitch, AT A GLANCE, problem-first OVERVIEW, numbered ALL-CAPS H2 sections, QUICK START with expected outputs, RELATED SKILLS and VERIFICATION.
- Bump the README version field from 1.0.0.0 to 1.1.0.0.
- Add the changelog entry `.opencode/skills/sk-prompt/changelog/v1.1.0.0.md` and link it from the README.
- Validate the rewritten README with the readme validator, the HVR grep and the link guard.
- Write this phase's own documentation set (spec, plan, tasks, checklist).

### Out of Scope
- Edits to `SKILL.md` content for sk-prompt or either packet.
- Edits to the refined template or any other template asset (owned by phase 001).
- Rewrites of any other skill README (owned by sibling phases in 004 and 005).
- Edits to vault, plugin or runtime files.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-prompt/README.md` | Rewrite | Purpose-first rewrite per the refined template: pitch, AT A GLANCE, problem-first OVERVIEW, QUICK START, RELATED SKILLS, VERIFICATION |
| `.opencode/skills/sk-prompt/changelog/v1.1.0.0.md` | Add | Changelog entry for the README rewrite release |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/008-sk-prompt/spec.md` | Create | Phase specification (this file) |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/008-sk-prompt/plan.md` | Create | Phase implementation plan |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/008-sk-prompt/tasks.md` | Create | Phase task list |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/008-sk-prompt/checklist.md` | Create | Phase verification checklist |

Read-only references: the refined template at `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`, the mcp-obsidian exemplar at `.opencode/skills/mcp-tooling/mcp-obsidian/README.md`, the HVR rules at `.opencode/skills/sk-doc/shared/references/hvr-rules.md` and the current README baseline are evidence for the rewrite, never writable in this phase.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Template readiness gate | The refined template at `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md` is committed and the mcp-obsidian exemplar at `.opencode/skills/mcp-tooling/mcp-obsidian/README.md` is readable. Both files exist before the rewrite starts |
| REQ-002 | Inventory baseline recorded | The current README at `.opencode/skills/sk-prompt/README.md` is read and its baseline is recorded: version field, section inventory, link state and validator output before any edit |
| REQ-003 | Purpose-first rewrite | The README opens with a one-line pitch and a problem-first OVERVIEW that states the outcome before the tooling. The two packets are described only after the WHY section |
| REQ-004 | HVR clean | A grep over the rewritten README returns zero em dashes, zero semicolons and zero Oxford commas |
| REQ-005 | Version bump and changelog entry | The README frontmatter version field is bumped from 1.0.0.0 to 1.1.0.0 and the entry `changelog/v1.1.0.0.md` exists and is linked from the README |
| REQ-006 | Validator zero issues | `validate_document.py --type readme` reports zero issues on the rewritten README |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Facts preserved | A section-by-section diff between the old and the new README confirms every shipped fact survives: two packets, seven frameworks, per-model profiles, mode-registry routing and the single advisor identity |
| REQ-008 | Out-of-scope guard | `git status` shows only `.opencode/skills/sk-prompt/README.md`, `.opencode/skills/sk-prompt/changelog/v1.1.0.0.md` and this phase's four documentation files |
| REQ-009 | Phase closeout | `validate.sh` on this phase folder returns zero errors and the phase metadata is regenerated |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The sk-prompt README opens with a one-line pitch and a problem-first OVERVIEW modeled on the mcp-obsidian exemplar.
- **SC-002**: The README passes `validate_document.py --type readme` with zero issues.
- **SC-003**: The HVR grep returns zero banned forms in the README body.
- **SC-004**: The version field reads 1.1.0.0 and `changelog/v1.1.0.0.md` documents the release.
- **SC-005**: No SKILL.md, template, sibling README, vault or runtime file changed and this phase folder validates with zero errors.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Refined template from phase 001 | Rewrite targets a moving contract | REQ-001 gates the start on the committed template |
| Dependency | mcp-obsidian exemplar shape | Rewrite diverges from the pilot standard | Re-read the exemplar before drafting the OVERVIEW |
| Risk | Facts lost in the narrative rewrite | Shipped behavior claims disappear | REQ-007 section-by-section diff gates the close |
| Risk | HVR violations accumulate in a long rewrite | Voice check fails at closeout | Scripted grep per banned form in verification |
| Risk | Links to packets or modes break | README navigation fails | Link guard in verification, stable relative pointers |
| Risk | Version and changelog drift | Release trail gets a gap | REQ-005 couples the bump and the entry |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
