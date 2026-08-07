---
title: "Feature Specification: Phase 004 cli-devin mode README rewrite"
description: "Rewrite the cli-devin mode skill README at cli-external-orchestration/cli-devin/README.md against the refined README template from phase 001 and the mcp-obsidian exemplar."
trigger_phrases:
  - "cli devin readme"
  - "devin mode readme rewrite"
  - "cli-external-orchestration devin"
  - "devin readme revisit"
  - "mode readme rewrite cli-devin"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/004-cli-devin"
    last_updated_at: "2026-08-04T13:46:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 004 docs (spec, plan, tasks, checklist) inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute phase 004 work: rewrite the cli-devin README per tasks.md"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/cli-devin/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/004-cli-devin"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Phase 004 cli-devin mode README rewrite

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
| **Parent Packet** | `sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit` |
| **Predecessor** | `004-standalone-readme-revisit` |
| **Successor** | `005-cli-opencode` |
| **Handoff Criteria** | The cli-devin README is purpose-first on the refined template with a one-line pitch and a problem-first OVERVIEW, HVR clean, versioned with a changelog entry and validated with zero issues. This phase folder validates with zero errors |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The cli-devin mode README at `.opencode/skills/cli-external-orchestration/cli-devin/README.md` still carries the older tabular reference-card style with an aspect table and feature-list sections. It predates the mcp-obsidian pilot standard. The skill is the mode skill for orchestrating the Devin CLI as an executor: dispatching a task to Cognition's `devin` CLI for multi-model coding, subagent delegation, cloud handoff and cross-model validation. The README does not open with the outcome the skill delivers. Its version field (1.0.0.0) has also drifted from the changelog, which already records v1.1.0.0.

### Purpose
Rewrite the README purpose-first against the refined template from phase 001 (`.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`) and the mcp-obsidian exemplar (`.opencode/skills/mcp-tooling/mcp-obsidian/README.md`): one-line pitch, problem-first OVERVIEW, capability sections, HVR-clean prose, version bump and a changelog entry.

**End goal:** the cli-devin mode README reads as one standard with the exemplar. The next sibling phases can mirror the same rewrite shape.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rewrite `.opencode/skills/cli-external-orchestration/cli-devin/README.md` purpose-first against the refined template and the mcp-obsidian exemplar.
- Bump the README version field and add a changelog entry under the skill changelog folder.
- Record the baseline (version field, `validate_document.py --type readme` output, link state) before the rewrite.
- Write this phase's own documentation set (spec, plan, tasks, checklist).

### Out of Scope
- Edits to `SKILL.md`, `references/`, `assets/` or `manual-testing-playbook/` content of the cli-devin skill.
- Rewrites of any other skill README in the fleet (owned by the sibling child phases of 005).
- Edits to the refined README template (owned by phase 001) or the creation workflow (owned by phase 003).
- Fleet-wide validation and changelog entries (owned by phase 006).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/cli-external-orchestration/cli-devin/README.md` | Rewrite | Purpose-first README on the refined template: one-line pitch, problem-first OVERVIEW, capability sections, HVR-clean prose, version field bumped |
| `.opencode/skills/cli-external-orchestration/cli-devin/changelog/<version>.md` | Add | Changelog entry for the README rewrite release |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/004-cli-devin/spec.md` | Create | Phase specification (this file) |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/004-cli-devin/plan.md` | Create | Phase implementation plan |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/004-cli-devin/tasks.md` | Create | Phase task list |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/004-cli-devin/checklist.md` | Create | Phase verification checklist |

Read-only references: the refined template, the mcp-obsidian exemplar README and the cli-devin skill folder are evidence for the rewrite, never writable in this phase.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Template readiness gate passed | The refined template (`.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`) and the mcp-obsidian exemplar README are read and their required sections recorded before the rewrite starts |
| REQ-002 | Baseline inventory recorded | The current README is read and its version field, `validate_document.py --type readme` output and link state are recorded before the rewrite |
| REQ-003 | Purpose-first rewrite landed | The README opens with a one-line pitch and a problem-first OVERVIEW and follows the refined template section model |
| REQ-004 | HVR grep clean | A grep of the README body returns zero em dashes, zero semicolons and zero Oxford commas |
| REQ-005 | Version bump and changelog entry present | The README version field is bumped per the changelog convention and a matching entry exists at `changelog/<version>.md` |
| REQ-006 | Validator zero issues | `validate_document.py --type readme` reports zero issues on the rewritten README |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Facts preserved | A section-by-section diff of the old and new README confirms every factual claim that still applies is retained |
| REQ-008 | Out-of-scope guard | No `SKILL.md`, template file, other skill README or vault file is modified by this phase |
| REQ-009 | Phase closeout clean | `validate.sh` on this phase folder reports zero errors and the phase metadata is regenerated |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The cli-devin README is purpose-first on the refined template with a one-line pitch and a problem-first OVERVIEW.
- **SC-002**: The rewritten README passes `validate_document.py --type readme` with zero issues, carries a bumped version field and has a changelog entry.
- **SC-003**: The HVR grep returns zero banned forms in the README body.
- **SC-004**: This phase folder validates with zero errors and no out-of-scope file changed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Refined README template (phase 001) | Rewrite may keep the older tabular style | REQ-001 gates the start on reading the template |
| Dependency | mcp-obsidian exemplar | Rewrite may miss the pilot shape | REQ-001 records the exemplar sections |
| Dependency | `validate_document.py` readme validator | Validation gate unavailable | Run the validator and record output in the checklist |
| Risk | Facts lost during the narrative rewrite | Shipped behavior claims disappear | REQ-007 section-by-section diff before the rewrite lands |
| Risk | Version drift between the README field and the changelog | Release history inconsistent | REQ-005 bump plus changelog entry, decision recorded in tasks |
| Risk | HVR violations accumulate in a large rewrite | Voice check fails at closeout | REQ-004 scripted grep gates |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which version does the README field bump to, given that the current field (1.0.0.0) already lags the changelog (v1.1.0.0)?
<!-- /ANCHOR:questions -->
