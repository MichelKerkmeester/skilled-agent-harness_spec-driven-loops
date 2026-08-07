---
title: "Feature Specification: Phase 034 sk-prompt-models README revisit"
description: "Rewrite the sk-prompt-models skill README against the refined README template from phase 001 and the mcp-obsidian exemplar, then bump the version field, add a changelog entry and validate."
trigger_phrases:
  - "sk prompt models readme"
  - "prompt models readme rewrite"
  - "model selection readme"
  - "small model dispatch readme"
  - "sk-prompt-models phase"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/034-sk-prompt-models"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 034 docs (spec, plan, tasks, checklist) inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute phase 034 work: rewrite the sk-prompt-models README on the refined template"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/sk-prompt-models/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/034-sk-prompt-models"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Phase 034 sk-prompt-models README revisit

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
| **Predecessor** | `033-sk-prompt-improve` |
| **Successor** | `035-deep-ai-council` |
| **Handoff Criteria** | The sk-prompt-models README reads purpose-first on the refined template with a one-line pitch and a problem-first OVERVIEW, passes the HVR grep, carries a bumped version field with a changelog entry and validates with zero issues. This phase folder validates with zero errors |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sk-prompt-models README still carries the older tabular reference-card style. It opens with an AT A GLANCE matrix and a numbered quick-start list. It predates the pilot standard that the mcp-obsidian README set for mode (child) skill READMEs. The skill is the per-model prompt-craft hub for small-model dispatch, so the README should lead with the problem it solves, not with a feature matrix. Readers land on the README to learn how to pick a model profile before dispatch. The current shape buries that story behind tables and steps.

### Purpose
Rewrite `.opencode/skills/sk-prompt/sk-prompt-models/README.md` against the refined README template from phase 001 (`.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`) and the mcp-obsidian exemplar. The rewrite keeps the facts (model profile inventory, navigation chain, quick start) and changes the shape to a narrative purpose-first document, then bumps the version field and records a changelog entry.

**End goal:** a README that matches the fleet standard, validates with zero issues and carries a versioned changelog entry exactly like its sibling phases in this parent.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read the current README and record the baseline (version field, validator output, link state).
- Rewrite the README purpose-first on the refined template with a one-line pitch and a problem-first OVERVIEW.
- Bump the version field in the README frontmatter.
- Add a changelog entry at `changelog/<version>.md`.
- Validate the README with the sk-doc readme validator, the HVR grep and a link guard.
- Write this phase's own documentation set (spec, plan, tasks, checklist).

### Out of Scope
- Edits to `SKILL.md` or any reference, asset or benchmark file inside `sk-prompt-models` (owned by sk-prompt itself, not this phase).
- Rewrites of other skills' READMEs (owned by the sibling phases of `005-mode-child-readme-revisit`).
- Edits to the refined template or any template asset (owned by phase 001).
- Edits to vault files, plugin data or runtime data.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-prompt/sk-prompt-models/README.md` | Rewrite | Purpose-first narrative on the refined template, one-line pitch, problem-first OVERVIEW, bumped version field |
| `.opencode/skills/sk-prompt/sk-prompt-models/changelog/<version>.md` | Add | Changelog entry recording the README rewrite |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/034-sk-prompt-models/spec.md` | Create | Phase specification (this file) |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/034-sk-prompt-models/plan.md` | Create | Phase implementation plan |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/034-sk-prompt-models/tasks.md` | Create | Phase task list |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/034-sk-prompt-models/checklist.md` | Create | Phase verification checklist |

Read-only references: the refined template, the mcp-obsidian exemplar README (`.opencode/skills/mcp-tooling/mcp-obsidian/README.md`) and the HVR rules (`.opencode/skills/sk-doc/shared/references/hvr-rules.md`) are evidence for the rewrite, never writable in this phase.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Template readiness gate | The refined template and the mcp-obsidian exemplar README are read and their section model is recorded before any rewrite begins |
| REQ-002 | Baseline inventory | The current README is inventoried and the baseline is recorded (version field, validator output, link state, latest changelog entry) |
| REQ-003 | Purpose-first rewrite | The rewritten README opens with a one-line pitch and a problem-first OVERVIEW and follows the refined template section model |
| REQ-004 | Human Voice Rules | A grep of the rewritten README body returns zero em dashes, zero semicolons and zero Oxford commas |
| REQ-005 | Version bump and changelog entry | The README version field is bumped and a changelog entry exists at `changelog/<version>.md` |
| REQ-006 | Validator clean | `validate_document.py --type readme` reports zero issues on the rewritten README |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Facts preserved | A section-by-section diff confirms the model inventory, the navigation chain and the quick-start content survive the rewrite |
| REQ-008 | Out-of-scope guard | No SKILL.md, reference, asset, template, sibling README or vault file is modified |
| REQ-009 | Phase closeout | `validate.sh` on this phase folder reports zero errors and the phase metadata is regenerated |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The README reads purpose-first with a one-line pitch and a problem-first OVERVIEW on the refined template.
- **SC-002**: The README passes the validator with zero issues and the HVR grep returns zero hits.
- **SC-003**: The version field is bumped and the changelog entry exists at `changelog/<version>.md`.
- **SC-004**: Facts from the old README survive in the rewrite and the out-of-scope guard holds.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Refined README template (phase 001) | Rewrite may diverge from the fleet standard | Read the template and the exemplar before drafting (REQ-001) |
| Dependency | mcp-obsidian exemplar README | Pilot patterns may be missed | Use the exemplar as the shape reference for the rewrite |
| Dependency | Phases 001 and 004 completion | Standard may still be moving | Gate the rewrite on the template and the standalone fleet |
| Risk | Facts lost in the rewrite | Readers lose the model inventory, navigation chain and quick start | Section-by-section diff (REQ-007) |
| Risk | HVR violations in a long document | Voice check fails | Scripted grep gate (REQ-004) |
| Risk | Changelog drift | Release without an entry | Version bump and entry recorded (REQ-005) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
