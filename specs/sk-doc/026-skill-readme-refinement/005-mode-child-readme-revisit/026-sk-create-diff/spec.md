---
title: "Feature Specification: Phase 026-sk-create-diff skill README rewrite"
description: "Rewrite the sk-create-diff mode skill README at .opencode/skills/sk-doc/sk-create-diff/README.md purpose-first on the refined README template from phase 001 with the mcp-obsidian README as the exemplar, then bump the version field, add a changelog entry and validate."
trigger_phrases:
  - "sk-create-diff readme"
  - "create diff readme rewrite"
  - "mode skill readme revisit"
  - "diff skill readme validation"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/026-sk-create-diff"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase docs"
    next_safe_action: "Execute README rewrite per tasks.md"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-diff/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/026-sk-create-diff"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Phase 026-sk-create-diff skill README rewrite

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
| **Predecessor** | `025-sk-create-command` |
| **Successor** | `027-sk-create-feature-catalog` |
| **Handoff Criteria** | The sk-create-diff README is purpose-first on the refined template with a one-line pitch and a problem-first OVERVIEW, HVR clean, version field bumped to 1.1.2.0 with a changelog entry, validator zero issues and this phase folder validates with zero errors |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sk-create-diff README at `.opencode/skills/sk-doc/sk-create-diff/README.md` still reads in the older tabular reference-card register and predates the pilot standard set by the mcp-obsidian README and by the refined template from phase 001. Its version field also lags its own changelog: the field records `1.0.0.0` while the changelog folder heads at `v1.1.1.0`. A mode skill README must pitch the skill in one line, open with the problem it solves, follow the Human Voice Rules and validate with zero issues. None of that holds for this README today.

### Purpose
Rewrite `.opencode/skills/sk-doc/sk-create-diff/README.md` against the refined README template (`.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`) using the mcp-obsidian README (`.opencode/skills/mcp-tooling/mcp-obsidian/README.md`) as the exemplar. The rewrite keeps every real fact of the skill: the snapshot and compare lifecycle, the compare-pair aggregate path, the exit codes, the safety boundary with `sk-git` and the verification commands. It adds a one-line pitch, a problem-first OVERVIEW and HVR clean prose, bumps the version field to `1.1.2.0` and records a changelog entry for the rewrite.

**End goal:** a purpose-first sk-create-diff README that validates with zero issues, passes the HVR greps and carries a correct version field with a matching changelog entry.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read the current README `.opencode/skills/sk-doc/sk-create-diff/README.md` and record the baseline: version field value, validator output and link state.
- Rewrite the README purpose-first per the refined template `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md` with the mcp-obsidian README `.opencode/skills/mcp-tooling/mcp-obsidian/README.md` as the exemplar.
- Bump the version field from `1.0.0.0` to `1.1.2.0` and add a changelog entry at `changelog/v1.1.2.0.md`.
- Validate the rewrite: README validator, HVR greps, link guard and scope diff.
- Write this phase's own documentation set (spec, plan, tasks, checklist).

### Out of Scope
- Edits to `SKILL.md` in the sk-create-diff skill.
- Rewrites of any other skill README (each mode child phase owns its own README).
- Edits to the refined template or any template file under the skill assets.
- Edits to vault files, fixtures, references or scripts inside the sk-create-diff skill.
- Fleet-wide validation and changelog entries (owned by phase 006).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/sk-create-diff/README.md` | Rewrite | Purpose-first rewrite on the refined template: one-line pitch, problem-first OVERVIEW, HVR clean prose, version field bumped to `1.1.2.0` |
| `.opencode/skills/sk-doc/sk-create-diff/changelog/v1.1.2.0.md` | Add | Changelog entry for the README rewrite |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/026-sk-create-diff/spec.md` | Create | Phase specification (this file) |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/026-sk-create-diff/plan.md` | Create | Phase implementation plan |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/026-sk-create-diff/tasks.md` | Create | Phase task list |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/026-sk-create-diff/checklist.md` | Create | Phase verification checklist |

Read-only references: the refined template, the mcp-obsidian exemplar README, the current README and its `changelog/` folder are evidence for the rewrite, never writable in this phase.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Template readiness gate | `ls` shows the refined template `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md` and the exemplar `.opencode/skills/mcp-tooling/mcp-obsidian/README.md` before the rewrite starts |
| REQ-002 | Inventory and baseline | The current README is read and the baseline recorded in this phase: version field value `1.0.0.0`, validator output and link state |
| REQ-003 | Purpose-first rewrite | The rewritten README opens with a one-line pitch blockquote after the H1 and an OVERVIEW that states the problem before any feature list, per the refined template |
| REQ-004 | HVR clean | The README body passes the HVR greps: zero em dashes, zero semicolons and zero Oxford commas |
| REQ-005 | Version bump and changelog entry | The frontmatter version field reads `1.1.2.0` and `changelog/v1.1.2.0.md` exists with a release title |
| REQ-006 | Validator zero issues | `validate_document.py --type readme` reports zero issues on the rewritten README |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Facts preserved | A section-by-section diff of the old versus new README shows every command, exit code, boundary and file pointer intact |
| REQ-008 | Out-of-scope guard | `SKILL.md`, sibling skill READMEs, template files and vault files untouched. The scope diff touches only the README and the changelog entry |
| REQ-009 | Phase closeout | `validate.sh` reports zero errors on this phase folder and the phase metadata is regenerated |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The README opens with a one-line pitch and a problem-first OVERVIEW per the refined template.
- **SC-002**: The README validates with zero issues and passes the HVR greps.
- **SC-003**: The version field reads `1.1.2.0` and `changelog/v1.1.2.0.md` exists.
- **SC-004**: Every fact in the old README survives the rewrite, confirmed by the section-by-section diff.
- **SC-005**: No file outside the README, the changelog entry and this phase folder changed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Refined README template (phase 001) | Rewrite drifts from the standard | Read the template before authoring and follow its section model |
| Dependency | mcp-obsidian exemplar README (phase 013) | Rewrite diverges from the pilot | Read the exemplar before drafting |
| Dependency | Parent sequencing (phases 001 and 004) | Rewrite runs against a moving standard | REQ-001 readiness gate holds the rewrite until the template exists |
| Risk | HVR violations in a large rewrite | Voice check fails | Scripted grep gates in verification |
| Risk | Facts lost in the restructure | Commands or boundaries disappear | REQ-007 section-by-section diff gate |
| Risk | Version field and changelog drift | Field lags the changelog head again | Baseline records the current lag and REQ-005 fixes it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
