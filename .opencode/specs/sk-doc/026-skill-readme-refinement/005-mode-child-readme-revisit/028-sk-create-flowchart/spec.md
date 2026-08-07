---
title: "Feature Specification: Phase 028 sk-create-flowchart README rewrite"
description: "Rewrite the sk-create-flowchart skill README at sk-doc/sk-create-flowchart/README.md against the refined template from phase 001 and the mcp-obsidian exemplar, with a version bump and a matching changelog entry."
trigger_phrases:
  - "flowchart readme rewrite"
  - "sk-create-flowchart readme"
  - "flowchart readme validation"
  - "mode readme flowchart"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/028-sk-create-flowchart"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 028 docs (spec, plan, tasks, checklist) inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute phase 028 work: rewrite the sk-create-flowchart README per tasks.md"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-flowchart/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/028-sk-create-flowchart"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Phase 028 sk-create-flowchart README rewrite

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 (phase child) |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-08-04 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` (005-mode-child-readme-revisit) |
| **Parent Packet** | `sk-doc/026-skill-readme-refinement` |
| **Predecessor** | `027-sk-create-feature-catalog` |
| **Successor** | `029-sk-create-manual-testing-playbook` |
| **Handoff Criteria** | The README at `.opencode/skills/sk-doc/sk-create-flowchart/README.md` is purpose-first on the refined template with a one-line pitch and a problem-first OVERVIEW, passes the HVR grep and the readme validator with zero issues, carries a bumped version field with a matching changelog entry and this phase folder validates with zero errors |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The skill README at `.opencode/skills/sk-doc/sk-create-flowchart/README.md` still carries the older tabular reference-card style and predates the pilot standard set by the mcp-obsidian README and the refined template from phase 001. A pitch blockquote and an OVERVIEW section exist, but the body stays reference-card shaped: AT A GLANCE, TROUBLESHOOTING, FAQ and VERIFICATION all remain tables. The frontmatter version field reads `1.0.0.0` while the skill changelog already carries `v1.0.1.0`, so the README lags the skill's own release record.

### Purpose
Rewrite `.opencode/skills/sk-doc/sk-create-flowchart/README.md` purpose-first against the refined template from phase 001, using the mcp-obsidian README as the exemplar. The rewrite states the outcome before the tooling, keeps every verified fact from the old README, bumps the version field, adds a changelog entry and passes the readme validator with zero issues.

**End goal:** a narrative purpose-first README for sk-create-flowchart that matches the fleet standard and carries a version and a changelog entry that agree with each other.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read the current README at `.opencode/skills/sk-doc/sk-create-flowchart/README.md` and record the baseline: frontmatter version field, validator output and link state.
- Rewrite the README purpose-first per the refined template from phase 001 with a one-line pitch and a problem-first OVERVIEW, modeled on the mcp-obsidian exemplar.
- Bump the README frontmatter version field.
- Add the changelog entry under `.opencode/skills/sk-doc/sk-create-flowchart/changelog/`.
- Validate the rewritten README with the readme validator and the HVR grep.
- Write this phase's own documentation set (spec, plan, tasks, checklist).

### Out of Scope
- SKILL.md content for sk-create-flowchart.
- Other skills' READMEs (each mode skill has its own child phase under 005-mode-child-readme-revisit).
- The refined template and the sk-doc template assets (owned by phase 001).
- Flowchart pattern assets, references and scripts in the skill folder.
- Vault files, plugins and runtime data.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/sk-create-flowchart/README.md` | Rewrite | Purpose-first README per the refined template: one-line pitch, problem-first OVERVIEW, narrative capability sections, version bump |
| `.opencode/skills/sk-doc/sk-create-flowchart/changelog/<version>.md` | Add | Changelog entry matching the bumped version field |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/028-sk-create-flowchart/spec.md` | Create | Phase specification (this file) |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/028-sk-create-flowchart/plan.md` | Create | Phase implementation plan |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/028-sk-create-flowchart/tasks.md` | Create | Phase task list |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/028-sk-create-flowchart/checklist.md` | Create | Phase verification checklist |

Read-only references: the refined template at `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md` and the exemplar README at `.opencode/skills/mcp-tooling/mcp-obsidian/README.md` are evidence for the rewrite, never writable in this phase.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Template readiness gate passes before authoring | The refined template from phase 001 and the mcp-obsidian exemplar README are read and their section maps recorded before the rewrite starts |
| REQ-002 | Current README inventoried with a recorded baseline | The setup tasks record the frontmatter version field, the `validate_document.py` output and the link state of the current README |
| REQ-003 | README rewritten purpose-first per the refined template | The rewritten README opens with a one-line pitch and a problem-first OVERVIEW. Narrative sections replace the tabular reference-card sections |
| REQ-004 | HVR grep returns zero violations | A grep of the rewritten README body returns zero em dashes, zero semicolons and zero Oxford commas |
| REQ-005 | Version field bumped with a matching changelog entry | The frontmatter version field changes from the recorded baseline and a changelog entry file exists under `changelog/` whose version matches the new field |
| REQ-006 | Readme validator reports zero issues | `validate_document.py --type readme` exits zero on the rewritten README |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Facts preserved across the rewrite | A section-by-section diff against the old README confirms the validator contract, the six pattern assets, the related-skill pointers and the reference links all survive |
| REQ-008 | Out-of-scope guard holds | `git status` and the scope diff show no SKILL.md, template, other skill README, asset, reference or vault file modified |
| REQ-009 | Phase closeout is clean | `validate.sh` on this phase folder returns zero errors and the phase metadata is regenerated |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The rewritten README opens with a one-line pitch and a problem-first OVERVIEW per the refined template.
- **SC-002**: The rewritten README passes the readme validator with zero issues and the HVR grep with zero violations.
- **SC-003**: The version field is bumped and the matching changelog entry exists.
- **SC-004**: Every fact from the old README survives and no out-of-scope file changed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Refined README template (phase 001) | Rewrite may drift from the fleet standard | Read the template section map before authoring and follow it exactly |
| Dependency | mcp-obsidian exemplar README | Style mismatch with the pilot standard | Read the exemplar before drafting and mirror its narrative shape |
| Risk | Fact loss in a full rewrite | Validator contract or pattern pointers drop out | REQ-007 gates a section-by-section diff against the old README |
| Risk | HVR violations accumulate in a large rewrite | Voice check fails | REQ-004 gates scripted greps for em dashes, semicolons and Oxford commas |
| Risk | Version and changelog drift | README version disagrees with the skill release record | REQ-005 gates the version bump and the changelog entry together |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
