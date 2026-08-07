---
title: "Feature Specification: Phase 004-sk-code standalone README rewrite"
description: "Rewrite the sk-code skill README purpose-first against the refined README template from phase 001 and the mcp-obsidian exemplar, with a version bump, a changelog entry and HVR-clean validation."
trigger_phrases:
  - "sk-code readme rewrite"
  - "sk-code readme revisit"
  - "sk-code readme"
  - "standalone readme sk-code"
  - "sk-code changelog entry"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/004-sk-code"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded 004-sk-code docs (spec, plan, tasks, checklist) inside 004-standalone-readme-revisit"
    next_safe_action: "Execute rewrite: inventory, rewrite purpose-first, bump version, add changelog entry, validate"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/README.md"
      - ".opencode/skills/sk-code/changelog/v4.2.0.0.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/004-sk-code"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Phase 004-sk-code standalone README rewrite

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 (phase child) |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-08-04 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` (004-standalone-readme-revisit) |
| **Parent Packet** | `sk-doc/026-skill-readme-refinement` |
| **Predecessor** | `003-creation-workflow-update` |
| **Successor** | `005-mode-child-readme-revisit` |
| **Handoff Criteria** | The sk-code README is rewritten purpose-first on the refined template, HVR clean, version bumped with a changelog entry, validated with zero issues and this phase folder validates with zero errors |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
sk-code is the hub skill for code work with modes for quality, review, webflow and opencode routing. Its README at `.opencode/skills/sk-code/README.md` still carries the older tabular reference-card style and predates the pilot standard set by the mcp-obsidian README and the refined template from phase 001. The README describes the hub accurately but reads as a reference card, not as a purpose-first narrative. A human reader gets a feature grid before any plain statement of the problem the skill solves.

### Purpose
Rewrite `.opencode/skills/sk-code/README.md` against the refined standalone template from phase 001 and the mcp-obsidian exemplar. The rewrite leads with a one-line pitch and a problem-first OVERVIEW, keeps every mode, surface and routing fact from the current README, bumps the version field, adds a changelog entry and validates clean.

**End goal:** the sk-code README reads on the same standard as the mcp-obsidian exemplar and this phase closes with zero validation errors.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read the current sk-code README and record the baseline (version field value, validator output, link state).
- Rewrite the README purpose-first per the refined template and the mcp-obsidian exemplar.
- Bump the version field in the README frontmatter.
- Add a changelog entry for the bumped version.
- Validate the rewritten README and this phase folder.

### Out of Scope
- Edits to `SKILL.md` content.
- Rewrites of other skills' READMEs (owned by sibling child phases).
- Edits to the refined template or any shared asset.
- Edits to vault files, plugin data or runtime data.
- Edits to `mode-registry.json`, `hub-router.json`, `leaf-manifest.json` or any other JSON asset in the sk-code root.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-code/README.md` | Rewrite | Purpose-first rewrite on the refined template section model with the version field bumped |
| `.opencode/skills/sk-code/changelog/v4.2.0.0.md` | Add | Changelog entry for the bumped version noting the purpose-first rewrite |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/004-sk-code/spec.md` | Create | Phase specification (this file) |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/004-sk-code/plan.md` | Create | Phase implementation plan |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/004-sk-code/tasks.md` | Create | Phase task list |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/004-sk-code/checklist.md` | Create | Phase verification checklist |

Read-only references: the refined template at `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`, the mcp-obsidian exemplar at `.opencode/skills/mcp-obsidian/README.md` and the current sk-code README plus its changelog folder are evidence for the rewrite, never writable in this phase except for the two rows marked Rewrite and Add above.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Template readiness gate passes before the rewrite starts | The refined template exists at `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md` and its section model is recorded |
| REQ-002 | Current README inventory recorded as baseline | The version field value, the validator output and the link state of `.opencode/skills/sk-code/README.md` are recorded before any rewrite |
| REQ-003 | Purpose-first rewrite with a one-line pitch and a problem-first OVERVIEW | The README opens with a blockquote pitch and an OVERVIEW section that states the reader's situation before any feature list |
| REQ-004 | Human Voice Rules enforced on the rewritten body | A grep of the README body returns zero em dashes, zero semicolons and zero Oxford commas |
| REQ-005 | Version bump plus changelog entry | The README frontmatter version field is bumped and `changelog/<version>.md` exists with the rewrite noted |
| REQ-006 | Validator reports zero issues on the rewritten README | `validate_document.py --type readme` exits clean on `.opencode/skills/sk-code/README.md` with zero issues |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Facts preserved through the rewrite | A section-by-section diff against the pre-rewrite README shows no mode, surface, routing or related-document fact lost |
| REQ-008 | Out-of-scope guard holds | `git status` shows only the README, the changelog entry and this phase folder changed |
| REQ-009 | Phase closeout is clean | `validate.sh` on this phase folder reports zero errors and the phase metadata is regenerated |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The README reads purpose-first with a one-line pitch and a problem-first OVERVIEW.
- **SC-002**: The HVR grep returns zero hits and the validator reports zero issues on the rewritten body.
- **SC-003**: The version field is bumped and the changelog entry exists.
- **SC-004**: Every mode, surface, routing and related-document fact from the old README survives the rewrite.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Refined standalone README template (phase 001) | Rewrite may target a template that is not yet committed | Gate the rewrite on the template file existing (REQ-001) |
| Dependency | mcp-obsidian exemplar | Shape drift between the exemplar and the refined template | Read both before drafting |
| Dependency | sk-doc readme validator and spec validator | Validation gates unavailable | Run both and record output in the checklist |
| Risk | Facts lost in the narrative rewrite | Shipped mode and surface claims disappear | Section-by-section diff before the rewrite lands |
| Risk | HVR violations in a long body | Voice check fails at closeout | Scripted grep per banned pattern during verification |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
