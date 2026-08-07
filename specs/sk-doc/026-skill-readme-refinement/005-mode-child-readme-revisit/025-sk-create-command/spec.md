---
title: "Feature Specification: Phase 025 sk-create-command README revisit"
description: "Rewrite the sk-create-command skill README purpose-first against the refined template from phase 001, with a version bump and a changelog entry."
trigger_phrases:
  - "sk create command readme revisit"
  - "command readme rewrite"
  - "create command readme"
  - "sk-doc command mode readme"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/025-sk-create-command"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 025 docs (spec, plan, tasks, checklist) inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute phase 025 work: rewrite the sk-create-command README against the refined template"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-command/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/025-sk-create-command"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Phase 025 sk-create-command README revisit

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
| **Predecessor** | `024-sk-create-changelog` |
| **Successor** | `026-sk-create-diff` |
| **Handoff Criteria** | The README is rewritten purpose-first per the refined template with a one-line pitch and a problem-first OVERVIEW, the HVR grep is clean, the version field and changelog entry are present, the validator reports zero issues and this phase folder validates with zero errors |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sk-create-command skill README still carries the older tabular reference-card style and predates the pilot standard set by the mcp-obsidian README. The pilot proved the purpose-first shape for mode skills: a one-line pitch, an at-a-glance table near the top, a problem-first OVERVIEW and a Human Voice Rules clean body. The create-command README shows the same drift on concrete evidence. Its frontmatter version field reads 1.0.0.0 while the changelog head is v1.0.1.1. The frontmatter description still carries an Oxford comma. Phase 001 refined the shared README template after the pilot, so this README gets a full rewrite rather than a verify-only pass.

### Purpose
Rewrite `.opencode/skills/sk-doc/sk-create-command/README.md` against the refined template from phase 001, with the mcp-obsidian README as the exemplar. The rewrite leads with the reader: a one-line pitch and a problem-first OVERVIEW, with the section count matched to the skill's real needs. The phase bumps the version field, adds the matching changelog entry and validates the result.

**End goal:** a validated, purpose-first README for the create-command skill that keeps the version field and the changelog in step, so the parent packet can close phase 025 as done.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read the current README and record the baseline: the version field, the validator output and the link state.
- Rewrite the README purpose-first per the refined template with a one-line pitch and a problem-first OVERVIEW.
- Bump the version field in the README frontmatter.
- Add the changelog entry at `changelog/<version>.md`.
- Validate the README and this phase folder.

### Out of Scope
- SKILL.md content and any other file inside the sk-create-command skill folder.
- Other skills' READMEs (owned by their sibling phases in 005-mode-child-readme-revisit).
- The refined template and the standalone fleet (owned by phases 001 and 004).
- Vault files, plugin data and any runtime configuration.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/sk-create-command/README.md` | Rewrite | Purpose-first narrative on the refined template with a one-line pitch and a problem-first OVERVIEW |
| `.opencode/skills/sk-doc/sk-create-command/changelog/<version>.md` | Add | Per-release changelog entry matching the bumped version field |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/025-sk-create-command/spec.md` | Create | Phase specification (this file) |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/025-sk-create-command/plan.md` | Create | Phase implementation plan |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/025-sk-create-command/tasks.md` | Create | Phase task list |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/025-sk-create-command/checklist.md` | Create | Phase verification checklist |

Read-only references: the refined template, the mcp-obsidian exemplar README, the create-command `SKILL.md`, the changelog folder and the parent spec are evidence for the rewrite, never writable in this phase.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Template readiness gate | The refined template exists at `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`, is read before the rewrite and its section model and required-section rule are recorded |
| REQ-002 | Baseline inventory | The current README is read and the baseline is recorded: the version field value, the `validate_document.py --type readme` output and the link state |
| REQ-003 | Purpose-first rewrite | The README is rewritten purpose-first per the refined template with a one-line pitch and a problem-first OVERVIEW, following the numbered ALL-CAPS H2 section model with `---` dividers |
| REQ-004 | Human Voice Rules clean | The HVR grep returns zero em dashes, zero semicolons and zero Oxford commas in the README body |
| REQ-005 | Version and changelog | The version field is bumped in the README frontmatter and a matching entry exists at `changelog/<version>.md` |
| REQ-006 | Validator zero issues | `python3 .opencode/skills/sk-doc/scripts/validate_document.py <readme> --type readme` reports zero issues on the README and every linked path resolves |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Facts preserved | A section-by-section diff against the prior README shows every fact preserved |
| REQ-008 | Out-of-scope guard | No SKILL.md, other skill README, template or vault file is modified |
| REQ-009 | Phase closeout | `validate.sh` on this phase folder reports zero errors and the phase metadata is regenerated |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The rewritten README opens with a one-line pitch and a problem-first OVERVIEW per the refined template.
- **SC-002**: The README passes the validator with zero issues, carries a bumped version field and has a changelog entry.
- **SC-003**: The HVR grep and the link guard are clean and the scope diff shows only the README, its changelog entry and this phase's docs.
- **SC-004**: This phase folder validates with zero errors so the parent packet can close phase 025 as done.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Refined template from phase 001 | Rewrite measured against a moving standard | Gate the rewrite on the phase 001 output and read the template first (REQ-001) |
| Dependency | mcp-obsidian exemplar README | Rewrite drifts from the pilot shape | Compare the draft against the exemplar section by section |
| Dependency | sk-create-command changelog folder | Version field and changelog head disagree | Record the baseline version and the changelog head and pick the bump target on evidence |
| Risk | HVR violations accumulate in the rewrite | Voice check fails | Scripted grep gates in verification (REQ-004) |
| Risk | Link rot inside the README | Link guard fails | Run the link guard and fix or record each dead link |
| Risk | Facts drop during the rewrite | Section-by-section diff fails | Keep the prior README and diff per section (REQ-007) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does the README version field continue its own sequence or align with the changelog head? The field reads 1.0.0.0 while the changelog head is v1.0.1.1. The baseline inventory decides the bump target.
<!-- /ANCHOR:questions -->
