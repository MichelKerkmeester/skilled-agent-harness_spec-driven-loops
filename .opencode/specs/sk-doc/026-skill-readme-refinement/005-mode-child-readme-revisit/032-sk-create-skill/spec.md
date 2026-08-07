---
title: "Feature Specification: Phase 032 sk-create-skill README revisit"
description: "Rewrite the sk-create-skill README at .opencode/skills/sk-doc/sk-create-skill/README.md against the refined README template from phase 001 and the mcp-obsidian exemplar, with a version bump and a changelog entry."
trigger_phrases:
  - "create skill readme revisit"
  - "sk-create-skill readme rewrite"
  - "create skill readme rewrite"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/032-sk-create-skill"
    last_updated_at: "2026-08-04T14:45:32Z"
    last_updated_by: "spec-author"
    recent_action: "Phase 032 complete; README rewritten, gates green"
    next_safe_action: "Execute phase 032 work: rewrite the sk-create-skill README per tasks.md"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-skill/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/032-sk-create-skill"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Phase 032 sk-create-skill README revisit

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 (phase child) |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-04 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` (005-mode-child-readme-revisit) |
| **Parent Packet** | `sk-doc/026-skill-readme-refinement` |
| **Predecessor** | `031-sk-create-readme` |
| **Successor** | `033-sk-prompt-improve` |
| **Handoff Criteria** | The sk-create-skill README is purpose-first on the refined template with a one-line pitch and a problem-first OVERVIEW, the version field is bumped with a changelog entry added, the validator reports zero issues and this phase folder validates with zero errors |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sk-create-skill README still carries the older tabular reference-card style, opens with an AT A GLANCE table and predates the pilot standard proven by the mcp-obsidian README. The frontmatter version field reads `1.1.0.1` while the changelog folder holds only `v1.0.0.0.md`, so the README claims a version with no matching entry. This skill is the biggest of the create family with two workflow modes, a parent-hub path and multiple scripts, so the reference-card style scales poorly for anyone who needs to learn the skill from the README.

### Purpose
Rewrite `.opencode/skills/sk-doc/sk-create-skill/README.md` against the refined README template from phase 001 and the mcp-obsidian exemplar. The rewrite is purpose-first with a one-line pitch and a problem-first OVERVIEW, preserves every capability and command fact the old README carries, bumps the version field and adds the matching changelog entry.

**End goal:** a narrative, purpose-first README that matches the refined template family and passes the sk-doc README validator and the Human Voice Rules grep. Version and changelog stay in sync.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read the current README at `.opencode/skills/sk-doc/sk-create-skill/README.md` and record the baseline: version field value, validator output and link state.
- Rewrite the README purpose-first per the refined template with a one-line pitch and a problem-first OVERVIEW.
- Bump the frontmatter `version` field from `1.1.0.1` to `1.1.1.0`.
- Add the changelog entry `changelog/v1.1.1.0.md`.
- Validate the rewrite with the sk-doc README validator and the HVR grep.
- Write this phase's own documentation set (spec, plan, tasks, checklist).

### Out of Scope
- Edits to `SKILL.md` content or frontmatter of the sk-create-skill package.
- Rewrites of any other skill README in the fleet (owned by sibling phases).
- Edits to the refined README template, the mcp-obsidian exemplar or any other asset in `assets/`.
- Edits to scripts, references or vault files.
- Changes to changelog entries other than the new `v1.1.1.0.md` entry.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/sk-create-skill/README.md` | Rewrite | Purpose-first README on the refined template: one-line pitch, problem-first OVERVIEW, capability sections, integration and navigation, version bump to `1.1.1.0` |
| `.opencode/skills/sk-doc/sk-create-skill/changelog/v1.1.1.0.md` | Add | Changelog entry summarizing the README rewrite |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/032-sk-create-skill/spec.md` | Create | Phase specification (this file) |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/032-sk-create-skill/plan.md` | Create | Phase implementation plan |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/032-sk-create-skill/tasks.md` | Create | Phase task list |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/032-sk-create-skill/checklist.md` | Create | Phase verification checklist |

Read-only references: the refined template `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`, the exemplar `.opencode/skills/mcp-tooling/mcp-obsidian/README.md`, the HVR rules `.opencode/skills/sk-doc/shared/references/hvr-rules.md` and the validator `.opencode/skills/sk-doc/shared/scripts/validate_document.py` are evidence for the rewrite, never writable in this phase.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Template readiness gate passes before any rewrite | `ls` shows `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md` and `.opencode/skills/mcp-tooling/mcp-obsidian/README.md` with non-empty content |
| REQ-002 | Baseline inventory recorded for the current README | The version field value `1.1.0.1`, the validator output and the link state are recorded as evidence in tasks.md |
| REQ-003 | README rewritten purpose-first per the refined template | The README opens with a one-line pitch and a problem-first OVERVIEW section that states the reader's situation before any feature list |
| REQ-004 | README prose obeys the Human Voice Rules | A grep of the README body returns zero em dashes, zero semicolons and zero Oxford comma patterns |
| REQ-005 | Version field bumped with a matching changelog entry | The frontmatter `version` field reads `1.1.1.0` and `changelog/v1.1.1.0.md` exists with a summary of the rewrite |
| REQ-006 | README validator reports zero issues | `validate_document.py --type readme` on the README exits clean with no issues |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Capability and command facts survive the rewrite | A section-by-section diff of the old README against the new one shows no capability, command or navigation fact dropped |
| REQ-008 | Out-of-scope guard holds | `git diff --name-only` lists only the README, the changelog entry and this phase folder |
| REQ-009 | Phase closeout completes | `validate.sh` on this phase folder exits with zero errors and the phase metadata is regenerated |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The README opens with a one-line pitch and a problem-first OVERVIEW.
- **SC-002**: The README passes `validate_document.py --type readme` with zero issues and the HVR grep returns zero em dashes, zero semicolons and zero Oxford comma patterns.
- **SC-003**: The version field is bumped to `1.1.1.0` and `changelog/v1.1.1.0.md` exists.
- **SC-004**: Every capability, command and navigation fact from the old README is preserved.
- **SC-005**: No file outside the README, the changelog entry and this phase folder is modified.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Refined README template (phase 001) | Rewrite may target a moving standard | REQ-001 gates the rewrite on the template file being present |
| Dependency | mcp-obsidian exemplar | Layout may not match the target style | Read the exemplar before drafting and mirror its section model |
| Dependency | HVR rules | Voice check failures in a large rewrite | Scripted grep gates in the verification phase |
| Risk | Big README loses facts in the rewrite | Capability or command gaps after completion | REQ-007 section-by-section diff against the baseline |
| Risk | Version and changelog drift | README claims a version with no entry | REQ-005 binds the bump to the new changelog entry |
| Risk | Changelog naming convention differs | Entry lands at the wrong path | Verify the `changelog/` convention before writing the entry |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
