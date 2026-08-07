---
title: "Feature Specification: Phase 007 mcp-aside-devtools mode skill README rewrite"
description: "Rewrite the mcp-aside-devtools mode skill README against the refined README template from phase 001 and the mcp-obsidian exemplar: purpose-first narrative, HVR clean, version bump, changelog entry, validated with zero issues."
trigger_phrases:
  - "mcp aside devtools readme"
  - "aside devtools readme rewrite"
  - "mode readme revisit aside devtools"
  - "mcp tooling readme rewrite"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/007-mcp-aside-devtools"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 007 docs (spec, plan, tasks, checklist) inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute phase 007 work: rewrite the mcp-aside-devtools skill README per tasks.md"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/mcp-aside-devtools/README.md"
      - ".opencode/skills/mcp-tooling/mcp-aside-devtools/changelog/v1.1.0.0.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/007-mcp-aside-devtools"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Phase 007 mcp-aside-devtools mode skill README rewrite

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
| **Predecessor** | `006-cli-pi` |
| **Successor** | `008-mcp-chrome-devtools` |
| **Handoff Criteria** | The mcp-aside-devtools skill README is purpose-first on the refined template with a one-line pitch and a problem-first OVERVIEW, passes the HVR grep with zero violations, carries a bumped version field and a changelog entry, passes `validate_document.py --type readme` with zero issues and this phase folder validates with zero errors |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The skill README at `.opencode/skills/mcp-tooling/mcp-aside-devtools/README.md` still carries the older tabular reference-card style and predates the pilot standard. The mcp-obsidian README pilot proved the standard for mode skill READMEs: narrative, purpose-first documents in the Human Voice Rules, validated by the sk-doc README validator. The aside-devtools README predates those learnings and does not yet follow the refined template from phase 001.

### Purpose
Rewrite the README purpose-first against the refined template from phase 001 with the mcp-obsidian README as the exemplar. The rewrite delivers a one-line pitch and a problem-first OVERVIEW, preserves every fact from the current document, bumps the version field, adds a changelog entry and passes both the validator and the HVR grep with zero issues and zero violations.

**End goal:** a README that matches the refined template and the mcp-obsidian exemplar so the mcp-tooling hub carries one consistent mode README set.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read the current skill README and record its baseline: version field, validator output and link state.
- Rewrite the README purpose-first per the refined template with a one-line pitch and a problem-first OVERVIEW.
- Bump the version field and add a changelog entry for the rewrite.
- Validate the README and this phase folder.

### Out of Scope
- SKILL.md content for mcp-aside-devtools.
- READMEs of other skills, including the mcp-obsidian exemplar.
- Templates and skill assets in sk-create-skill.
- Vault files and any runtime data.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/README.md` | Rewrite | Purpose-first rewrite per the refined template with a one-line pitch, a problem-first OVERVIEW and a bumped version field |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/changelog/v1.1.0.0.md` | Add | Changelog entry recording the README rewrite |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/007-mcp-aside-devtools/spec.md` | Create | Phase specification (this file) |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/007-mcp-aside-devtools/plan.md` | Create | Phase implementation plan |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/007-mcp-aside-devtools/tasks.md` | Create | Phase task list |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/007-mcp-aside-devtools/checklist.md` | Create | Phase verification checklist |

Read-only references: the refined template (`.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`) and the mcp-obsidian exemplar README (`.opencode/skills/mcp-tooling/mcp-obsidian/README.md`) are evidence for the rewrite, never writable in this phase.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Template readiness gate | The refined template from phase 001 is read and its section model and required-section rule are recorded before the rewrite starts |
| REQ-002 | Inventory baseline | The current README is read and its baseline is recorded: version field, validator output and link state |
| REQ-003 | Purpose-first rewrite | The README opens with a one-line pitch and a problem-first OVERVIEW that states the reader's situation before any feature list |
| REQ-004 | HVR clean | A grep of the README body returns zero em dashes, zero semicolons and zero Oxford commas |
| REQ-005 | Version bump and changelog entry | The frontmatter version field is bumped and a changelog entry exists at `changelog/v1.1.0.0.md` |
| REQ-006 | Validator zero issues | `validate_document.py --type readme` reports zero issues on the README |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Facts preserved | A section-by-section diff against the current README shows every factual claim survives the rewrite |
| REQ-008 | Out-of-scope guard | The change set touches only the README and the changelog entry, with `git diff` confirming no SKILL.md, template or vault file changed |
| REQ-009 | Phase closeout | `validate.sh` on this phase folder reports zero errors and the phase metadata is regenerated |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The README reads purpose-first with a one-line pitch and a problem-first OVERVIEW on the refined template.
- **SC-002**: The README passes `validate_document.py --type readme` with zero issues and the HVR grep with zero violations.
- **SC-003**: The version field is bumped and `changelog/v1.1.0.0.md` records the change.
- **SC-004**: Every fact from the current README survives the rewrite, verified by section diff.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Refined README template (phase 001) | Rewrite against a moving standard | Read the template and record its section model before drafting |
| Dependency | mcp-obsidian exemplar | Exemplar shape drifts from the template | Use the exemplar as the worked model and gate on the template |
| Risk | Fact loss in the rewrite | Reader-facing details vanish | Section-by-section diff gate REQ-007 |
| Risk | HVR violations accumulate | Voice check fails | Scripted grep gates in verification |
| Risk | Changelog discipline drifts | Release without an entry | REQ-005 gates the entry presence |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
