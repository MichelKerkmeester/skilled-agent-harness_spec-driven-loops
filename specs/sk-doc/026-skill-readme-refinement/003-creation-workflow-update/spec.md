---
title: "Feature Specification: Phase 003 — creation workflow README template wiring"
description: "Wire the refined standalone README template and the new parent-skill README template into the create-skill workflow with an explicit choice rule and post-authoring validation steps."
trigger_phrases:
  - "creation workflow readme templates"
  - "skill readme emission step"
  - "parent hub readme choice"
  - "readme authoring validation"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/003-creation-workflow-update"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffold phase 003 documentation"
    next_safe_action: "Execute the creation workflow update"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/003-creation-workflow-update"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Phase 003 — creation workflow README template wiring

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-08-04 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` (sk-doc track, packet 026) |
| **Parent Packet** | `sk-doc/026-skill-readme-refinement` |
| **Predecessor** | `002-parent-skill-readme-template` |
| **Successor** | `004-standalone-readme-revisit` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The create-skill workflow at `.opencode/skills/sk-doc/sk-create-skill/references/skill/creation-workflow.md` predates the README refinement program. It points at only one README template, the standalone `skill-readme-template.md`, in a single exemption note about the README frontmatter block. It says nothing about the refined standalone template, nothing about the new parent-skill README template and nothing about which template applies when. Authors who create a parent hub have no README guidance at all, and no step tells authors how to validate a freshly authored README before packaging.

### Purpose
Update the creation workflow so that every skill creation path emits the correct README: the refined standalone template for standalone skills, the new parent-skill README template for parent hubs, with an explicit choice rule and validation steps after README authoring.

**End goal:** an author running the create-skill workflow is told which README template to emit for the skill type being created and how to validate the result, with no ambiguity between standalone and parent-hub paths.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Update `references/skill/creation-workflow.md` to emit the refined standalone README template on the standalone skill path.
- Update the same workflow to emit the new parent-skill README template on the parent hub path.
- Add the choice rule that decides which template applies when, stated as an explicit decision point in the workflow.
- Add post-authoring validation steps after README authoring (validator, HVR grep, link check, version field check).
- Scan referenced workflow docs and update them only where they describe README authoring.
- This phase's own docs under `003-creation-workflow-update/`.

### Out of Scope
- Any change to the template assets themselves. `skill-readme-template.md` is owned by phase 001 and `parent-skill-readme-template.md` by phase 002.
- Any skill README content in the repo. Fleet READMEs are owned by phases 004 and 005.
- Any change to `SKILL.md` authoring rules, frontmatter contracts, packaging steps, or manifest generation outside the README emission step.
- Vault, plugin, or runtime files.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/sk-create-skill/references/skill/creation-workflow.md` | Modify | Add README emission steps for both paths, the choice rule and post-authoring validation |
| `.opencode/skills/sk-doc/sk-create-skill/references/skill/examples-and-maintenance.md` | Conditional Modify | Scanned 2026-08-04, no README authoring content today. Update only if the workflow changes add README steps there |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/003-creation-workflow-update/{spec,plan,tasks,checklist}.md` | Create | This phase's documentation (scaffolded) |
| `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md` | Read Only | Refined in phase 001 and referenced by the workflow, never edited here |
| `.opencode/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-readme-template.md` | Read Only | Created in phase 002 and referenced by the workflow, never edited here |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Standalone path emits the refined standalone README template | The workflow step for standalone skills names `assets/skill/skill-readme-template.md` as the README source and references its section model |
| REQ-002 | Parent hub path emits the parent-skill README template | The workflow step for parent hubs names `assets/parent-skill/parent-skill-readme-template.md` as the README source and covers the hub-level sections it requires |
| REQ-003 | Choice rule is explicit and unambiguous | The workflow states when each template applies (standalone skill, parent hub and child mode with its own README) with no path left unspecified |
| REQ-004 | Validation steps follow README authoring | The workflow lists post-authoring checks in order: README validator, HVR grep, link resolution and version field presence, placed before packaging |
| REQ-005 | Workflow prose stays within style rules | Grep finds zero em dashes, semicolons and Oxford commas in the changed workflow prose and zero decimal headings in the updated file |
| REQ-006 | No template asset content changes in this phase | `git diff` for this phase touches no file under `assets/skill/` or `assets/parent-skill/` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Referenced workflow docs stay coherent | `examples-and-maintenance.md` is scanned and either updated for README steps or left untouched with the scan result recorded |
| REQ-008 | Internal workflow links resolve | Every relative link in the updated workflow file resolves to an existing target, including links to both README templates |
| REQ-009 | Phase documentation validates | `validate.sh` on this phase folder reports zero errors with `completion_pct` left at 0 per the packet hard rule |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: An author creating a standalone skill is told exactly which README template to use and how to validate the result.
- **SC-002**: An author creating a parent hub is told exactly which README template to use and how to validate the result.
- **SC-003**: A reader of the workflow can state the choice rule for any skill type in one sentence, without reading template assets.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Refined standalone template from phase 001 | Workflow points at a template that changed shape | Phase 003 starts only after 001 and 002 land, with both templates re-read before editing |
| Dependency | New parent-skill template from phase 002 | Workflow references a file that may not exist yet | Gate ordering 001-003 holds and the asset path is verified before writing the step |
| Risk | Choice rule written vaguely | Authors pick the wrong template | State the rule as an explicit decision point with the three cases |
| Risk | Validation steps drift from real tools | Workflow asks for checks that fail or do not exist | Use only the checks proven in the mcp-obsidian pilot (validator, HVR grep, link guard) |
| Risk | Scope bleed into template assets | Phase 001 and 002 outputs get edited here | REQ-006 gates the diff and template files are read only |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does the parent hub path emit READMEs for child modes during creation, or do child mode READMEs wait for the phase 005 fleet revisit? Conservative default recorded in this scaffold: the workflow covers standalone and parent hub READMEs only with child mode READMEs fleet-revisited in phase 005.
<!-- /ANCHOR:questions -->
