---
title: "Feature Specification: Phase 017 sk-code-review mode README rewrite"
description: "Rewrite the sk-code-review mode skill README against the refined README template from phase 001 with the mcp-obsidian exemplar as reference: purpose-first pitch, problem-first OVERVIEW, HVR clean prose, version bump and changelog entry."
trigger_phrases:
  - "sk-code review readme"
  - "code review mode readme rewrite"
  - "017 phase readme"
  - "sk-code-review readme revisit"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/017-sk-code-review"
    last_updated_at: "2026-08-04T14:52:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 017 docs (spec, plan, tasks, checklist) inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute phase 017 work: rewrite the sk-code-review README per the refined template"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/sk-code-review/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/017-sk-code-review"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Phase 017 sk-code-review mode README rewrite

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
| **Predecessor** | `016-sk-code-quality` |
| **Successor** | `018-sk-code-webflow` |
| **Handoff Criteria** | The sk-code-review README is rewritten purpose-first on the refined template with a one-line pitch and a problem-first OVERVIEW. The HVR grep is clean, the version field is bumped with a changelog entry and the validator reports zero issues. This phase folder validates with zero errors |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sk-code-review README at `.opencode/skills/sk-code/sk-code-review/README.md` still carries the older tabular reference-card style. It opens with an AT A GLANCE feature table before any problem narrative and predates the pilot standard. The mcp-obsidian README pilot proved the standard for mode skill READMEs: narrative, purpose-first documents in the Human Voice Rules, validated by the sk-doc README validator. The sk-code-review README, a mode skill of the sk-code family, needs the same pass.

### Purpose
Rewrite the README purpose-first per the refined template from phase 001 with the mcp-obsidian exemplar as the reference shape. The rewrite adds a one-line pitch and a problem-first OVERVIEW, keeps only the sections that earn their place, obeys the Human Voice Rules, bumps the README version field and adds a changelog entry.

**End goal:** a purpose-first sk-code-review README that passes the validator with zero issues and preserves every fact from the old README, closing the phase with validated phase docs.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read the current README and record the baseline (version field, validator output and link state).
- Rewrite the README purpose-first per the refined template with a one-line pitch and a problem-first OVERVIEW.
- Bump the README version field and add a changelog entry in the skill changelog folder.
- Validate the README (validator, HVR grep and link guard) and record evidence in checklist.md.
- Write this phase's own documentation set (spec, plan, tasks and checklist).

### Out of Scope
- Edits to the SKILL.md content of sk-code-review.
- Rewrites of any other skill README (owned by the sibling phases 015, 016, 018 and the rest of the fleet).
- Edits to the refined template (owned by phase 001) and the mcp-obsidian exemplar (owned by phase 013).
- Edits to vault files, plugins or any runtime data.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-code/sk-code-review/README.md` | Rewrite | Purpose-first rewrite per the refined template with a version bump |
| `.opencode/skills/sk-code/sk-code-review/changelog/<version>.md` | Add | Changelog entry recording the README rewrite |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/017-sk-code-review/spec.md` | Create | Phase specification (this file) |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/017-sk-code-review/plan.md` | Create | Phase implementation plan |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/017-sk-code-review/tasks.md` | Create | Phase task list |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/017-sk-code-review/checklist.md` | Create | Phase verification checklist |

Read-only references: the refined template at `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md` and the mcp-obsidian exemplar at `.opencode/skills/mcp-tooling/mcp-obsidian/README.md` are evidence for the rewrite, never writable in this phase.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Refined template readiness gate | The phase 001 template exists at `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md` and the OVERVIEW-only required section rule is recorded before any rewrite |
| REQ-002 | Baseline inventory of the current README | The current README is read and its version field, `validate_document.py` output and link state are recorded in checklist.md |
| REQ-003 | Purpose-first rewrite | The README opens with a one-line pitch and a problem-first OVERVIEW that states the reader's situation before any feature list |
| REQ-004 | Human Voice Rules compliance | An HVR grep of the README body returns zero em dashes, zero semicolons and zero Oxford commas |
| REQ-005 | Version bump and changelog entry | The README frontmatter version field is bumped and a matching changelog entry exists in `.opencode/skills/sk-code/sk-code-review/changelog/` |
| REQ-006 | Validator zero issues | `validate_document.py --type readme` reports zero issues on the README |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Facts preserved | A section-by-section diff against the old README shows no factual content lost (commands, paths, trigger phrases and invocation notes) |
| REQ-008 | Out-of-scope guard | The scope diff touches only the README, the changelog entry and this phase folder |
| REQ-009 | Phase closeout | `validate.sh` on this phase folder returns zero errors and the phase metadata (implementation-summary.md, description.json and graph-metadata.json) is regenerated |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The README opens with a one-line pitch and a problem-first OVERVIEW per the refined template.
- **SC-002**: The README passes `validate_document.py --type readme` with zero issues and the HVR grep is clean.
- **SC-003**: The README carries a bumped version field and a matching changelog entry.
- **SC-004**: No fact from the old README is lost in the rewrite.
- **SC-005**: This phase folder validates with zero errors.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Refined README template (phase 001) | Rewrite may use an outdated standard | REQ-001 gates the readiness check before authoring |
| Dependency | mcp-obsidian exemplar | Shape may not fit a smaller mode | Record the exemplar structure in setup and keep only earning sections |
| Risk | HVR violations in long prose | Voice check fails | Scripted grep gates in verification |
| Risk | Fact loss in the rewrite | Commands or trigger phrases drop out | Section-by-section diff per REQ-007 |
| Risk | Changelog discipline drift | Release without an entry | REQ-005 gates the entry presence |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
