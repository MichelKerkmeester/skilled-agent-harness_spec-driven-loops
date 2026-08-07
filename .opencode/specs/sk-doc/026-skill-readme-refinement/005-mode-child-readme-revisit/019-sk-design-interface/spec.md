---
title: "Feature Specification: Phase 019 sk-design-interface README revisit"
description: "Rewrite the sk-design-interface mode skill README against the refined template from phase 001: purpose-first narrative with a one-line pitch and a problem-first OVERVIEW, HVR clean, version bump plus changelog entry, validated with zero issues, using the mcp-obsidian README as the exemplar."
trigger_phrases:
  - "sk design interface readme"
  - "interface design readme rewrite"
  - "mode child readme revisit sk design"
  - "interface skill readme"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/019-sk-design-interface"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 019 docs (spec, plan, tasks, checklist) inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute phase 019 work: rewrite the sk-design-interface README per the refined template"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/sk-design-interface/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/019-sk-design-interface"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Phase 019 sk-design-interface README revisit

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
| **Predecessor** | `018-sk-code-webflow` |
| **Successor** | `020-sk-design-mcp-open-design` |
| **Handoff Criteria** | The sk-design-interface README is purpose-first on the refined template with a one-line pitch and a problem-first OVERVIEW, HVR clean, versioned with a changelog entry and validated with zero issues. This phase folder validates with zero errors |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The skill README at `.opencode/skills/sk-design/sk-design-interface/README.md` still carries the older tabular reference-card style and predates the pilot standard. The mcp-obsidian README pilot proved the standard for mode skill READMEs: narrative, purpose-first documents in the Human Voice Rules, validated by the sk-doc README validator. This skill is the mode packet for interface design judgment. Its README does not yet follow the refined template from phase 001.

### Purpose
Rewrite the README purpose-first against the refined template with a one-line pitch and a problem-first OVERVIEW, preserve every original fact, bump the version field, add a changelog entry and validate the result with zero issues. The mcp-obsidian README serves as the narrative exemplar.

**End goal:** a README that presents interface design judgment as an outcome-first capability, obeys the Human Voice Rules, carries a bumped version with a matching changelog entry and passes the sk-doc README validator.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read the current README and record the baseline: version field value, `validate_document.py --type readme` output and link state.
- Rewrite the README purpose-first per the refined template with a one-line pitch and a problem-first OVERVIEW.
- Bump the version field and add a changelog entry under the skill changelog folder.
- Validate the rewrite with the README validator, the HVR grep and the link guard, then run `validate.sh` on this phase folder.
- Write this phase's own documentation set (spec, plan, tasks, checklist).

### Out of Scope
- SKILL.md content of sk-design-interface.
- READMEs of other skills, owned by their own child phases in 005 and by phases 004 and 006.
- The refined template (owned by phase 001) and any other template asset.
- Vault files, plugin data and runtime data.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/sk-design-interface/README.md` | Rewrite | Purpose-first narrative per the refined template: one-line pitch, problem-first OVERVIEW, capability sections, version bump |
| `.opencode/skills/sk-design/sk-design-interface/changelog/<version>.md` | Add | Changelog entry matching the bumped README version |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/019-sk-design-interface/spec.md` | Create | Phase specification (this file) |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/019-sk-design-interface/plan.md` | Create | Phase implementation plan |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/019-sk-design-interface/tasks.md` | Create | Phase task list |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/019-sk-design-interface/checklist.md` | Create | Phase verification checklist |

Read-only references: the refined template at `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md` and the mcp-obsidian exemplar at `.opencode/skills/mcp-tooling/mcp-obsidian/README.md` are evidence for the rewrite, never writable in this phase.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Template readiness gate | The refined template at `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md` exists and its section model and required-section rule are recorded before any rewrite |
| REQ-002 | Baseline inventory | The current README is read and the baseline is recorded: version field value, `validate_document.py --type readme` output and link state |
| REQ-003 | Purpose-first rewrite | The README opens with a one-line pitch and a problem-first OVERVIEW that states the reader's situation before any feature list, per the refined template |
| REQ-004 | Human Voice Rules | An HVR grep of the README returns zero em dashes, zero semicolons and zero Oxford commas |
| REQ-005 | Version bump plus changelog entry | The README version field is bumped from the recorded baseline and a matching entry exists at `changelog/<version>.md` in the skill folder |
| REQ-006 | Validator zero issues | `validate_document.py --type readme` reports zero issues on the rewritten README |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Facts preserved | A section-by-section diff against the previous README shows every original fact retained with only the shape changed |
| REQ-008 | Out-of-scope guard | `git diff` shows only the README, its changelog entry and this phase's docs changed |
| REQ-009 | Phase closeout | `validate.sh` on this phase folder reports zero errors and the phase metadata is regenerated |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The README is purpose-first on the refined template with a one-line pitch and a problem-first OVERVIEW.
- **SC-002**: The README passes `validate_document.py --type readme` with zero issues and the HVR grep with zero hits.
- **SC-003**: The README carries a bumped version field and a matching changelog entry.
- **SC-004**: No SKILL.md, template, vault file or other skill README changed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Refined template (phase 001) | Rewrite against a moving standard | Template readiness gate in REQ-001 |
| Dependency | mcp-obsidian exemplar | Narrative pattern may not translate to a design skill | Record the exemplar pattern and map it to design capability sections |
| Risk | HVR violations in a large rewrite | Voice check fails | Scripted HVR grep gate in REQ-004 |
| Risk | Fact loss during the rewrite | Regressions in documented behavior | Section-by-section diff review in REQ-007 |
| Risk | Changelog discipline drift | Release without an entry | Entry mandated in REQ-005 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
