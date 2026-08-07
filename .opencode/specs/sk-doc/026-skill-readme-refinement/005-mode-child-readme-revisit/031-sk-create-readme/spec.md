---
title: "Feature Specification: Phase 031 sk-create-readme README rewrite"
description: "Rewrite the sk-create-readme skill README at sk-create-readme/README.md against the refined template from phase 001 and the mcp-obsidian exemplar, with a version bump and a changelog entry."
trigger_phrases:
  - "phase 031 readme rewrite"
  - "sk create readme readme"
  - "create readme skill readme revisit"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/031-sk-create-readme"
    last_updated_at: "2026-08-04T14:55:00Z"
    last_updated_by: "spec-author"
    recent_action: "Phase 031 executed: README rewritten"
    next_safe_action: "Execute phase 031 work: rewrite the sk-create-readme README per tasks.md"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-readme/README.md"
      - ".opencode/skills/sk-doc/sk-create-readme/changelog/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/031-sk-create-readme"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Phase 031 sk-create-readme README rewrite

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 (phase child) |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-08-04 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` (sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit) |
| **Parent Packet** | `sk-doc/026-skill-readme-refinement` |
| **Predecessor** | `030-sk-create-quality-control` |
| **Successor** | `032-sk-create-skill` |
| **Handoff Criteria** | The sk-create-readme README is rewritten purpose-first on the refined template with a version bump and a changelog entry, validates with zero issues, passes the HVR grep and this phase folder validates with zero errors |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The skill README at `.opencode/skills/sk-doc/sk-create-readme/README.md` still carries the older tabular reference-card style with an AT A GLANCE table, a tabular TROUBLESHOOTING section and a tabular FAQ. It predates the pilot standard that the mcp-obsidian README established. It does not open with a one-line pitch. Its OVERVIEW does not state the reader's situation first. It lacks the versioning and changelog discipline that the refined template from phase 001 now mandates for every skill README.

### Purpose
Rewrite the sk-create-readme README against the refined template at `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md` and the mcp-obsidian exemplar at `.opencode/skills/mcp-tooling/mcp-obsidian/README.md`. The rewrite produces a purpose-first document with a one-line pitch and a problem-first OVERVIEW, then bumps the version field and adds a changelog entry.

**End goal:** a current-state README for the create-readme skill that matches the fleet standard, validates with zero issues and closes this phase with clean docs.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read the current README and record the baseline: the version field value, the `validate_document.py` output and the link state.
- Rewrite the README purpose-first per the refined template with a one-line pitch and a problem-first OVERVIEW.
- Bump the version field in the README frontmatter.
- Add a changelog entry under the skill changelog folder.
- Validate the rewrite with the readme validator, the HVR grep and a link guard.
- Write this phase's own documentation set (spec, plan, tasks, checklist).

### Out of Scope
- Edits to the skill `SKILL.md` content.
- Rewrites of other skills' READMEs (owned by sibling phases under `005-mode-child-readme-revisit`).
- Edits to the refined template and the skill assets templates (owned by phase 001).
- Edits to the mcp-obsidian exemplar and all vault files.
- Fleet-wide validation and closeout (owned by phase 006).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/sk-create-readme/README.md` | Rewrite | Purpose-first rewrite per the refined template with a one-line pitch, a problem-first OVERVIEW and a version bump |
| `.opencode/skills/sk-doc/sk-create-readme/changelog/<version>.md` | Add | Changelog entry for the bumped version |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/031-sk-create-readme/spec.md` | Create | Phase specification (this file) |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/031-sk-create-readme/plan.md` | Create | Phase implementation plan |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/031-sk-create-readme/tasks.md` | Create | Phase task list |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/031-sk-create-readme/checklist.md` | Create | Phase verification checklist |

Read-only references: the refined template (`skill-readme-template.md`), the mcp-obsidian exemplar README and the shared readme validator are evidence for the rewrite, never writable in this phase.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Template readiness gate | The refined template exists at `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md` and the rewrite follows it |
| REQ-002 | Baseline inventory | The current README is read first and its version field value, validator output and link state are recorded before any edit |
| REQ-003 | Purpose-first rewrite | The README opens with a one-line pitch and a problem-first OVERVIEW that states the reader's situation before any feature list |
| REQ-004 | Human Voice Rules | An HVR grep of the README returns zero em dashes, zero semicolons and zero Oxford commas |
| REQ-005 | Version and changelog | The version field is bumped from `1.0.0.0` and a matching entry exists under the skill changelog folder |
| REQ-006 | Validator zero issues | `validate_document.py` with `--type readme` reports zero issues on the rewritten README |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Facts preserved | A section-by-section diff against the old README confirms every confirmed command, path and script survives the rewrite |
| REQ-008 | Out-of-scope guard | `git status` shows only the README, the changelog entry and this phase's docs changed |
| REQ-009 | Phase closeout | `validate.sh` on this phase folder returns zero errors and the phase metadata is regenerated |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The README leads with a one-line pitch and a problem-first OVERVIEW per the refined template.
- **SC-002**: The README passes `validate_document.py --type readme` with zero issues.
- **SC-003**: The README carries a bumped version field and a matching changelog entry.
- **SC-004**: The HVR grep returns zero em dashes, zero semicolons and zero Oxford commas.
- **SC-005**: This phase folder validates with zero errors and no out-of-scope file changed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Refined template (phase 001) | The rewrite may target a moving standard | The readiness gate in REQ-001 waits for the template to be final |
| Dependency | mcp-obsidian exemplar | Style drift between exemplar and skill README | Use the exemplar for structure only, keep the skill facts local |
| Dependency | Shared readme validator | The validation gate is unavailable | Run the validator and record the output in the checklist |
| Risk | HVR violations in a full rewrite | The voice check fails | Scripted grep gate in the verification tasks |
| Risk | Facts dropped during the rewrite | Commands and paths go stale | Section-by-section diff in REQ-007 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
