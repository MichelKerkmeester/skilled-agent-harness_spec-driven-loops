---
title: "Feature Specification: Phase 24 sk-create-changelog README rewrite"
description: "Rewrite the mode skill README at .opencode/skills/sk-doc/sk-create-changelog/README.md purpose-first against the refined template from phase 001, with mcp-obsidian as the exemplar, plus a version bump, a changelog entry and validation."
trigger_phrases:
  - "sk create changelog readme rewrite"
  - "mode readme revisit"
  - "phase 24 readme rewrite"
  - "changelog readme rewrite"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/024-sk-create-changelog"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 24 docs (spec, plan, tasks, checklist) inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute phase 24 work: rewrite the sk-create-changelog README against the refined template"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-changelog/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/024-sk-create-changelog"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Phase 24 sk-create-changelog README rewrite

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
| **Predecessor** | `023-sk-create-benchmark` |
| **Successor** | `025-sk-create-command` |
| **Handoff Criteria** | The sk-create-changelog README is purpose-first on the refined template, HVR clean, versioned with a matching changelog entry, validated with zero issues and this phase folder validates with zero errors |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sk-create-changelog README at `.opencode/skills/sk-doc/sk-create-changelog/README.md` still carries the older tabular reference-card style. Its body is a nine-section card deck with an AT A GLANCE table, a HOW IT WORKS section, a TROUBLESHOOTING table and an FAQ. It predates the mcp-obsidian pilot, which set the standard for mode skill READMEs: narrative, purpose-first documents in the Human Voice Rules, validated by the sk-doc README validator. The frontmatter version field (1.0.0.0) also lags the changelog top (v1.0.1.1), so the rewrite is the moment to re-align the release record.

### Purpose
Rewrite the sk-create-changelog README against the refined README template from phase 001, using the mcp-obsidian README as the pilot exemplar. The rewrite opens with a one-line pitch and a problem-first OVERVIEW, keeps every factual surface of the current document (source resolution, global versus nested detection, four-part version rules, format selection, validation, troubleshooting), bumps the version field and adds a changelog entry, then validates the result.

**End goal:** a purpose-first narrative README that passes `validate_document.py --type readme` with zero issues, passes the HVR grep and reads as the stable reference for anyone invoking `/create:changelog`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read the current README and record the baseline: version field, validator output, link state.
- Rewrite the README purpose-first per the refined template with a one-line pitch and a problem-first OVERVIEW.
- Bump the version field in the README frontmatter and add a changelog entry under the skill changelog folder.
- Validate the rewrite (README validator, HVR grep, link guard) and this phase's own docs.

### Out of Scope
- SKILL.md content and any runtime instruction change.
- Other skills' READMEs (each has its own child phase under 005-mode-child-readme-revisit).
- The refined template and its assets (owned by phase 001).
- Vault, plugin or runtime data.
- Fleet-wide validation and closeout (owned by phase 006).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/sk-create-changelog/README.md` | Rewrite | Purpose-first narrative README per the refined template, with a one-line pitch, a problem-first OVERVIEW and a bumped version field |
| `.opencode/skills/sk-doc/sk-create-changelog/changelog/v<version>.md` | Add | Changelog entry for the README rewrite release, named per the skill changelog convention |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/024-sk-create-changelog/spec.md` | Create | Phase specification (this file) |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/024-sk-create-changelog/plan.md` | Create | Phase implementation plan |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/024-sk-create-changelog/tasks.md` | Create | Phase task list |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/024-sk-create-changelog/checklist.md` | Create | Phase verification checklist |

Read-only references: the refined template (`.opencode/skills/sk-doc/sk-create-readme/assets/readme-template.md`), the pilot exemplar (`.opencode/skills/mcp-tooling/mcp-obsidian/README.md`) and the current README are evidence for the rewrite, never writable outside the rewrite contract.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Template readiness gate | The refined README template exists at `.opencode/skills/sk-doc/sk-create-readme/assets/readme-template.md` and is read before any rewrite starts. The gate blocks the rewrite until the template read is recorded |
| REQ-002 | Baseline inventory | The current README is inventoried before the rewrite. The baseline record holds the version field value, the validator output and the link state of `.opencode/skills/sk-doc/sk-create-changelog/README.md` |
| REQ-003 | Purpose-first rewrite | The README is rewritten against the refined template. It opens with a one-line pitch and a problem-first OVERVIEW before any feature list or table |
| REQ-004 | Human Voice Rules | A grep of the rewritten README returns zero em dashes, zero semicolons and zero Oxford commas |
| REQ-005 | Version bump plus changelog entry | The frontmatter version field is bumped and a matching `changelog/v<version>.md` entry is added. `rg -n '^version:'` on the README shows the new value and `ls` on the changelog folder shows the new entry |
| REQ-006 | Validator zero issues | `validate_document.py --type readme` reports zero issues on the rewritten README |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Facts preserved | A section-by-section diff against the old README shows no factual content lost. The source resolution, global versus nested detection, four-part version rules, format selection, validation and troubleshooting all survive |
| REQ-008 | Out-of-scope guard | No SKILL.md content, template asset, other skill README, vault file or runtime data is modified |
| REQ-009 | Phase closeout | `validate.sh` on this phase folder returns zero errors and the phase metadata is regenerated |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The sk-create-changelog README is a purpose-first narrative document with a one-line pitch and a problem-first OVERVIEW.
- **SC-002**: The README passes `validate_document.py --type readme` with zero issues and passes the HVR grep.
- **SC-003**: The README version field matches a new changelog entry under the skill changelog folder.
- **SC-004**: Every factual surface of the old README survives the rewrite.
- **SC-005**: No file outside the README, the changelog entry and this phase folder is modified.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Refined README template (phase 001) | Rewrite may not match the pilot standard | REQ-001 gates the rewrite on the template read |
| Dependency | mcp-obsidian exemplar | Narrative shape drifts from the pilot | Review the exemplar in setup and mirror its structure |
| Risk | Factual loss in a large rewrite | Changelog facts disappear | REQ-007 gates a section-by-section diff |
| Risk | HVR violations accumulate | Voice check fails | REQ-004 gates a scripted grep |
| Risk | Version and changelog drift | Release record breaks | REQ-005 couples the version bump to the changelog entry |
| Dependency | Phase 006 closeout | Metadata regenerated late | REQ-009 records the closeout gate in this phase |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
