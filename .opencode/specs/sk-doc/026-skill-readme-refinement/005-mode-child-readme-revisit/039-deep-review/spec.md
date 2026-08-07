---
title: "Feature Specification: Phase 039 deep-review mode README rewrite"
description: "Rewrite the deep-review mode skill README at system-deep-loop/deep-review/README.md against the refined README template from phase 001, using mcp-obsidian as the exemplar, with a version bump and a changelog entry."
trigger_phrases:
  - "deep review readme"
  - "mode readme rewrite"
  - "deep-review readme"
  - "readme revisit deep review"
  - "hvr readme check"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/039-deep-review"
    last_updated_at: "2026-08-04T18:54:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 039 docs (spec, plan, tasks, checklist) inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute phase 039 work: rewrite the deep-review README per tasks.md"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-review/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/039-deep-review"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Phase 039 deep-review mode README rewrite

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-08-04 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` (005-mode-child-readme-revisit) |
| **Parent Packet** | `sk-doc/026-skill-readme-refinement` |
| **Predecessor** | `038-deep-research` |
| **Successor** | `006-validation-and-closeout` |
| **Handoff Criteria** | The deep-review README is rewritten purpose-first on the refined template, HVR clean, carries a bumped version and a changelog entry, validates with zero issues and this phase folder validates with zero errors |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The deep-review README at `.opencode/skills/system-deep-loop/deep-review/README.md` still carries the older tabular reference-card style and predates the pilot standard. The mcp-obsidian README pilot proved the standard for mode skill READMEs: narrative, purpose-first documents in the Human Voice Rules, validated by the sk-doc README validator. The current deep-review README predates the refined template from phase 001 and reads as a reference card instead of a purpose-first skill document.

### Purpose
Rewrite `.opencode/skills/system-deep-loop/deep-review/README.md` against the refined README template from phase 001 (`.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`) and the mcp-obsidian exemplar, then bump the version field and add a changelog entry under the skill's `changelog/` folder.

**End goal:** a purpose-first deep-review README that opens with a one-line pitch and a problem-first OVERVIEW, passes the readme validator with zero issues, passes the HVR grep and stays factually aligned with the current document.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read the current README and record the baseline: version field, validator output and link state.
- Rewrite the README purpose-first per the refined template: one-line pitch and problem-first OVERVIEW.
- Bump the version field from `1.11.0.35` and add a changelog entry.
- Validate the rewritten README and this phase folder.

### Out of Scope
- `SKILL.md` content of the deep-review skill.
- READMEs of sibling skills (owned by sibling phases).
- Template and asset files under the skill folder.
- Vault files.
- Edits to the mcp-obsidian exemplar README.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/deep-review/README.md` | Rewrite | Purpose-first rewrite per the refined template with a one-line pitch and a problem-first OVERVIEW |
| `.opencode/skills/system-deep-loop/deep-review/changelog/v1.11.0.36.md` | Add | Changelog entry for the version bump |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/039-deep-review/spec.md` | Create | Phase specification (this file) |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/039-deep-review/plan.md` | Create | Phase implementation plan |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/039-deep-review/tasks.md` | Create | Phase task list |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/039-deep-review/checklist.md` | Create | Phase verification checklist |

Read-only references: the refined template at `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md` and the mcp-obsidian exemplar at `.opencode/skills/mcp-tooling/mcp-obsidian/README.md` are evidence for the rewrite, never writable in this phase.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Template readiness gate | The refined template exists at `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md` and the mcp-obsidian exemplar README is readable before the rewrite starts |
| REQ-002 | Baseline inventory | The current README is read and its version field, validator output and link state are recorded before any rewrite |
| REQ-003 | Purpose-first rewrite | The README opens with a one-line pitch and a problem-first OVERVIEW per the refined template section model |
| REQ-004 | Human Voice Rules | A grep of the README returns zero em dashes, zero semicolons and zero Oxford commas |
| REQ-005 | Version and changelog | The frontmatter version field is bumped and a matching changelog entry exists under `changelog/` |
| REQ-006 | Validator clean | `validate_document.py --type readme` reports zero issues on the rewritten README |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Facts preserved | A section-by-section diff against the baseline confirms every factual claim survives the rewrite |
| REQ-008 | Out-of-scope guard | No `SKILL.md`, sibling skill README, template, asset or vault file is modified |
| REQ-009 | Phase closeout | `validate.sh` on this phase folder reports zero errors and phase metadata is regenerated |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The README is purpose-first with a one-line pitch and a problem-first OVERVIEW.
- **SC-002**: The readme validator reports zero issues and the HVR grep is clean.
- **SC-003**: The version field is bumped and a changelog entry is present.
- **SC-004**: Facts from the baseline survive per the section-by-section diff.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Refined README template (phase 001) | Rewrite follows a moving or missing standard | REQ-001 gates on the template path before drafting |
| Dependency | mcp-obsidian exemplar README | Exemplar style drifts from the template | Read both before drafting |
| Risk | Rewrite drops factual content | Skill behavior misdocumented | Section-by-section diff against the baseline (REQ-007) |
| Risk | HVR violations accumulate in a large rewrite | Voice gate fails | Scripted grep gates in the verification phase |
| Risk | Changelog discipline drifts | Release without an entry | REQ-005 gates entry presence |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
