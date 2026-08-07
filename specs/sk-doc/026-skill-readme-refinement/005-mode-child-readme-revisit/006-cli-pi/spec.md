---
title: "Feature Specification: Phase 6 cli-pi mode skill README revisit"
description: "Rewrite the cli-pi skill README at cli-external-orchestration/cli-pi/ against the refined README template from phase 001 with the mcp-obsidian exemplar: purpose-first identity, one-line pitch, problem-first overview, version bump and changelog entry."
trigger_phrases:
  - "cli pi readme"
  - "pi skill readme revisit"
  - "mode child readme rewrite"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/006-cli-pi"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 6 docs (spec, plan, tasks, checklist) inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute README rewrite per tasks.md"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/cli-pi/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/006-cli-pi"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Phase 6 cli-pi mode skill README revisit

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
| **Predecessor** | `005-cli-opencode` |
| **Successor** | `006-validation-and-closeout` |
| **Handoff Criteria** | The cli-pi README is purpose-first on the refined template with a one-line pitch and a problem-first OVERVIEW, HVR clean, versioned with a changelog entry, validated with zero issues and this phase folder validates with zero errors |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The cli-pi README at `.opencode/skills/cli-external-orchestration/cli-pi/README.md` still carries the older tabular reference-card style and predates the pilot standard set by the mcp-obsidian README. It opens with an AT A GLANCE table before any narrative, so a reader meets the feature list before the reason the skill exists. Its frontmatter version field reads 1.2.0.0 while the skill changelog folder already carries v1.3.0.0, so the version record has drifted and the README is not aligned with the release log.

### Purpose
Rewrite `.opencode/skills/cli-external-orchestration/cli-pi/README.md` against the refined README template from phase 001, using the mcp-obsidian README as the exemplar shape. The rewrite opens with a one-line pitch and a problem-first OVERVIEW, keeps every verifiable fact from the current README, obeys the Human Voice Rules, bumps the version field and adds a changelog entry.

**End goal:** a cli-pi README that matches the pilot standard, validates with zero issues and closes the version gap with the skill changelog.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read the current cli-pi README and record the baseline: version field, validator output and link state.
- Rewrite the README purpose-first per the refined template from phase 001 with the mcp-obsidian exemplar as the shape reference.
- Bump the README version field and add a changelog entry in the skill changelog folder.
- Validate the rewritten README and this phase's own documentation set.
- Write this phase's documentation set (spec, plan, tasks, checklist).

### Out of Scope
- Edits to the cli-pi SKILL.md content.
- Rewrites of any other skill README (each mode skill has its own child phase under this parent).
- Edits to the refined README template (owned by phase 001) or any other template asset.
- Edits to vault files, plugin data, benchmarks or runtime configuration.
- Fleet-wide validation and changelog closeout (owned by phase 006).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/cli-external-orchestration/cli-pi/README.md` | Rewrite | Purpose-first README per the refined template: one-line pitch, problem-first OVERVIEW, retained fact set, bumped version field |
| `.opencode/skills/cli-external-orchestration/cli-pi/changelog/<version>.md` | Add | Changelog entry for the bumped README version |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/006-cli-pi/spec.md` | Create | Phase specification (this file) |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/006-cli-pi/plan.md` | Create | Phase implementation plan |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/006-cli-pi/tasks.md` | Create | Phase task list |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/006-cli-pi/checklist.md` | Create | Phase verification checklist |

Read-only references: the refined template `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md` and the exemplar `.opencode/skills/mcp-tooling/mcp-obsidian/README.md` are evidence for the rewrite, never writable in this phase.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Template readiness gate | The refined README template from phase 001 and the mcp-obsidian exemplar README exist and are readable, with their section model recorded before authoring |
| REQ-002 | Baseline inventory | The current cli-pi README is read and its version field, validator output and link state are recorded in the checklist |
| REQ-003 | Purpose-first rewrite | The README opens with a one-line pitch and a problem-first OVERVIEW, with a WHY THIS SKILL EXISTS block before any feature list |
| REQ-004 | HVR grep clean | The README body carries zero em dashes, zero semicolons and zero Oxford commas, confirmed by rg greps |
| REQ-005 | Version bump plus changelog entry | The README version field is bumped from the changelog head and `changelog/<version>.md` exists with the entry |
| REQ-006 | Validator zero issues | `validate_document.py --type readme` reports zero issues on the rewritten README |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Facts preserved | A section-by-section diff against the pre-rewrite README shows no lost capability, path, pinned-contract or reference fact |
| REQ-008 | Out-of-scope guard | No SKILL.md, template, other skill README or vault file is modified, shown by a scoped git status |
| REQ-009 | Phase closeout | This phase folder validates with zero errors and the phase metadata is regenerated |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The cli-pi README is purpose-first on the refined template with a one-line pitch and a problem-first OVERVIEW.
- **SC-002**: The README passes `validate_document.py --type readme` with zero issues and carries a version field and a changelog entry.
- **SC-003**: Every verifiable fact from the pre-rewrite README survives the rewrite.
- **SC-004**: This phase folder validates with zero errors and no out-of-scope file changed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Refined README template (phase 001) | Rewrite may miss template directives | Read the template and record its section model before authoring |
| Dependency | mcp-obsidian exemplar README | Style may drift from the pilot standard | Mirror the exemplar pitch and OVERVIEW shape |
| Dependency | sk-doc readme validator | Validation gate unavailable | Run the validator and record the output in the checklist |
| Risk | Fact loss in a large rewrite | Pinned-contract details disappear | Section-by-section diff against the pre-rewrite README (REQ-007) |
| Risk | HVR violations accumulate | Voice check fails | Scripted rg greps for em dashes, semicolons and Oxford commas (REQ-004) |
| Risk | Version drift continues | README version and changelog head diverge | Bump from the changelog head and log the entry (REQ-005) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
