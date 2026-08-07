---
title: "Feature Specification: Phase 003 cli-cursor README rewrite"
description: "Rewrite the cli-cursor skill README at cli-external-orchestration/cli-cursor/README.md purpose-first on the refined README template from phase 001, using the mcp-obsidian README as the exemplar, with a version bump, a changelog entry and validation."
trigger_phrases:
  - "cli cursor readme rewrite"
  - "cli-cursor readme"
  - "cursor mode readme"
  - "mode child readme phase 003"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/003-cli-cursor"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase docs"
    next_safe_action: "Execute README rewrite per tasks.md"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/cli-cursor/README.md"
      - ".opencode/skills/cli-external-orchestration/cli-cursor/changelog/<version>.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/003-cli-cursor"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Phase 003 cli-cursor README rewrite

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
| **Predecessor** | `002-cli-codex` |
| **Successor** | `004-cli-devin` |
| **Handoff Criteria** | The rewritten cli-cursor README is purpose-first on the refined template with a one-line pitch and a problem-first OVERVIEW, passes the validator with zero issues and the HVR grep, carries a bumped version field with a matching changelog entry and this phase folder validates with zero errors |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The cli-cursor skill README at `.opencode/skills/cli-external-orchestration/cli-cursor/README.md` still carries the older tabular reference-card style. It predates the pilot standard that the mcp-obsidian README established and that phase 001 captured in the refined README template. A reader arriving at the README gets a card grid of aspects before any statement of the problem the mode solves, which buries the dispatch model: sandboxed coding through Cursor's `cursor-agent` CLI, Composer-model dispatch and read-only plan or ask exploration.

### Purpose
Rewrite `.opencode/skills/cli-external-orchestration/cli-cursor/README.md` as a narrative, purpose-first document on the refined README template from phase 001, using `.opencode/skills/mcp-tooling/mcp-obsidian/README.md` as the exemplar. The rewrite opens with a one-line pitch and a problem-first OVERVIEW, keeps every factual detail from the old README, bumps the version field and records the rewrite in the changelog.

**End goal:** a cli-cursor README that matches the pilot standard, validates with zero issues and hands a clean bill to phase 006 for the fleet-wide closeout.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read the current README at `.opencode/skills/cli-external-orchestration/cli-cursor/README.md` and record the baseline: the version field, the `validate_document.py` output and the link state.
- Rewrite the README purpose-first on the refined README template from phase 001, with the mcp-obsidian README as the structural exemplar.
- Bump the version field in the README frontmatter and add the matching changelog entry.
- Validate the rewrite with the sk-doc readme validator, the HVR grep and the link guard.
- Write this phase's own documentation set (spec, plan, tasks, checklist).

### Out of Scope
- Changes to SKILL.md content for cli-cursor (no skill behavior changes here).
- Rewrites of other skills' READMEs (owned by the sibling child phases of 005-mode-child-readme-revisit).
- Edits to the refined README template (owned by phase 001).
- Edits to any template, registry, manifest or vault file.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/cli-external-orchestration/cli-cursor/README.md` | Rewrite | Purpose-first README on the refined template with a one-line pitch, a problem-first OVERVIEW and a bumped version field |
| `.opencode/skills/cli-external-orchestration/cli-cursor/changelog/<version>.md` | Add | Changelog entry for the README rewrite, named for the bumped version |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/003-cli-cursor/spec.md` | Create | Phase specification (this file) |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/003-cli-cursor/plan.md` | Create | Phase implementation plan |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/003-cli-cursor/tasks.md` | Create | Phase task list |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/003-cli-cursor/checklist.md` | Create | Phase verification checklist |

Read-only references: the refined template (`.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`) and the mcp-obsidian exemplar (`.opencode/skills/mcp-tooling/mcp-obsidian/README.md`) are evidence for the rewrite, never writable in this phase.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Refined template readiness gate | The phase 001 template at `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md` is read and its section model and required-section rule are recorded in tasks.md before any rewrite |
| REQ-002 | Baseline inventory of the current README | Setup records the version field, the `validate_document.py` output and the link state of `.opencode/skills/cli-external-orchestration/cli-cursor/README.md` |
| REQ-003 | Purpose-first rewrite on the refined template | The rewritten README opens with a one-line pitch blockquote and a problem-first OVERVIEW section before any feature list |
| REQ-004 | Human Voice Rules hold in the rewrite | A grep of the README body returns zero em dashes, zero semicolons and zero Oxford commas |
| REQ-005 | Version bump plus changelog entry | The README frontmatter version is bumped and `changelog/<version>.md` records the rewrite entry under that version |
| REQ-006 | Readme validator clean | `validate_document.py --type readme` reports zero issues on the rewritten README |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Facts preserved | A section-by-section diff of the old and new README shows no factual loss across paths, flags, pointers and dispatch details |
| REQ-008 | Out-of-scope guard | `git status` shows only the README, the changelog entry and this phase folder changed, with no SKILL.md or template touched |
| REQ-009 | Phase closeout | `validate.sh` on this phase folder reports zero errors and the phase metadata is regenerated |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The cli-cursor README opens with a one-line pitch and a problem-first OVERVIEW on the refined template.
- **SC-002**: The README passes `validate_document.py --type readme` with zero issues, the HVR grep and the link guard.
- **SC-003**: The version field is bumped and a changelog entry records the rewrite.
- **SC-004**: No SKILL.md, template or sibling skill file is modified.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Refined README template (phase 001) | Rewrite may drift from the standard | REQ-001 gates the template read before drafting |
| Dependency | mcp-obsidian exemplar README | Exemplar patterns may not fit a CLI mode README | Read the exemplar in setup and reuse only the shared pitch and OVERVIEW pattern |
| Risk | Fact loss in the rewrite | Users lose paths, flags or pointers | REQ-007 forces a section-by-section diff |
| Risk | HVR violations in the prose | Voice gate fails on delivery | REQ-004 scripts the grep gate |
| Risk | Changelog version mismatch | Release trail breaks | REQ-005 ties the entry name to the frontmatter version |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
