---
title: "Feature Specification: Phase 012 mcp-mobbin README revisit"
description: "Rewrite the mcp-mobbin mode skill README at .opencode/skills/mcp-tooling/mcp-mobbin/README.md against the refined README template from phase 001 with the mcp-obsidian exemplar as the model, including a version bump and a changelog entry."
trigger_phrases:
  - "mcp mobbin readme"
  - "mobbin readme rewrite"
  - "mobbin readme revisit"
  - "mcp-mobbin readme"
  - "mode readme mcp-mobbin"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/012-mcp-mobbin"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 012 docs (spec, plan, tasks, checklist) inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute phase 012 work: rewrite the mcp-mobbin README per tasks.md"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/mcp-mobbin/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/012-mcp-mobbin"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Phase 012 mcp-mobbin README revisit

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
| **Predecessor** | `011-mcp-magnific` |
| **Successor** | `013-mcp-obsidian` |
| **Handoff Criteria** | The mcp-mobbin README is purpose-first on the refined template with a one-line pitch and a problem-first OVERVIEW. It is HVR clean, version bumped with a changelog entry and validated with zero issues. This phase folder validates with zero errors |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The skill README at `.opencode/skills/mcp-tooling/mcp-mobbin/README.md` still carries the older tabular reference-card style and predates the pilot standard. The mcp-obsidian README rewrite proved the target shape for mode skill READMEs: narrative, purpose-first, written in the Human Voice Rules and validated by the sk-doc readme validator. The mcp-mobbin README has not been revisited against that standard, and its version discipline lags the refined template: the frontmatter version field reads `1.0.0.0` and the changelog folder holds a single entry at `changelog/v1.0.0.0.md`.

### Purpose
Rewrite `.opencode/skills/mcp-tooling/mcp-mobbin/README.md` on the refined README template from phase 001, using the mcp-obsidian README as the exemplar. The rewrite is purpose-first: a one-line pitch, a problem-first OVERVIEW and HVR-clean prose. The version field is bumped from the recorded baseline and a matching changelog entry is added, then the rewrite is validated with zero issues.

**End goal:** a mcp-mobbin README that matches the pilot standard and that phase 006 can validate fleet-wide.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rewrite the README body at `.opencode/skills/mcp-tooling/mcp-mobbin/README.md` per the refined template, or record a verify-only verdict if the body already conforms.
- Preserve every factual claim from the current README: wiring state, three-tool surface, auth model and judgment boundary.
- Bump the README frontmatter version field from the recorded baseline and add the matching changelog entry under `.opencode/skills/mcp-tooling/mcp-mobbin/changelog/`.
- Validate the rewrite (readme validator, HVR grep, link guard) and this phase folder (validate.sh).
- Write this phase's own documentation set (spec, plan, tasks, checklist).

### Out of Scope
- SKILL.md content for the mcp-mobbin skill.
- Other skills' READMEs across the fleet (owned by their own child phases).
- Edits to the refined template or any sk-doc asset (owned by phase 001).
- Vault files and runtime data.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-tooling/mcp-mobbin/README.md` | Rewrite | Purpose-first body per the refined template: one-line pitch, problem-first OVERVIEW, HVR-clean prose, bumped version field |
| `.opencode/skills/mcp-tooling/mcp-mobbin/changelog/<version>.md` | Add | Changelog entry for the bumped README version per the per-skill changelog convention |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/012-mcp-mobbin/spec.md` | Create | Phase specification (this file) |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/012-mcp-mobbin/plan.md` | Create | Phase implementation plan |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/012-mcp-mobbin/tasks.md` | Create | Phase task list |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/012-mcp-mobbin/checklist.md` | Create | Phase verification checklist |

Read-only references: the refined template at `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md` and the exemplar at `.opencode/skills/mcp-tooling/mcp-obsidian/README.md` are evidence for the rewrite, never writable in this phase.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Template readiness gate | The refined README template exists at `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md` and the mcp-obsidian exemplar at `.opencode/skills/mcp-tooling/mcp-obsidian/README.md` is read before any rewrite starts |
| REQ-002 | Baseline inventory | The current mcp-mobbin README is read and the baseline is recorded: version field value (observed `1.0.0.0`), validator output and link state |
| REQ-003 | Purpose-first rewrite | The README body is rewritten per the refined template with a one-line pitch and a problem-first OVERVIEW that states the reader's situation before any feature list |
| REQ-004 | HVR clean rewrite | A grep of the README body returns zero em dashes, zero semicolons and zero Oxford commas |
| REQ-005 | Version bump and changelog entry | The README frontmatter version field is bumped from the recorded baseline and `changelog/` gains an entry for the new version per the per-skill convention |
| REQ-006 | Validator zero issues and link guard clean | `validate_document.py --type readme` reports zero issues on the rewritten README and every relative link in the README resolves |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Facts preserved | A section-by-section diff of the rewritten README against the current one shows no lost facts across the wiring state, the three-tool surface, the auth model and the judgment boundary |
| REQ-008 | Out-of-scope guard | `git diff` for this phase touches only the README, the changelog entry and this phase's docs. No SKILL.md, other skill README, template or vault file is modified |
| REQ-009 | Phase closeout | `validate.sh` on this phase folder returns zero errors and the phase metadata (description.json and graph-metadata.json) is regenerated for this folder |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The README opens purpose-first with a one-line pitch and a problem-first OVERVIEW.
- **SC-002**: The README passes `validate_document.py --type readme` with zero issues and the HVR grep.
- **SC-003**: The README version field is bumped and a changelog entry exists.
- **SC-004**: Every factual claim in the current README survives the rewrite, verified by a section-by-section diff.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Refined README template (phase 001) | Rewrite may drift from the standard | REQ-001 gates on the template and the exemplar before drafting |
| Dependency | mcp-obsidian exemplar | Style mismatch with the pilot standard | Read the exemplar and mirror its section model |
| Dependency | Current README fact surface | Facts lost in the rewrite | REQ-007 section-by-section diff |
| Risk | HVR violations accumulate in the rewrite | Voice gate fails | REQ-004 scripted grep gate |
| Risk | Relative links break in the rewrite | Related document pointers fail | Link guard check in the verification phase |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
