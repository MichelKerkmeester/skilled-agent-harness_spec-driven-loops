---
title: "Feature Specification: Phase 021 sk-design-md-generator README revisit (rewrite)"
description: "Rewrite the sk-design-md-generator mode skill README purpose-first per the refined README template from phase 001 and the mcp-obsidian exemplar, with a version bump, a changelog entry and validation."
trigger_phrases:
  - "sk design md generator readme"
  - "md generator readme rewrite"
  - "design markdown readme revisit"
  - "sk design md generator"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/021-sk-design-md-generator"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 021 docs (spec, plan, tasks, checklist) inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute phase 021 work: rewrite the sk-design-md-generator README per the refined template"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/sk-design-md-generator/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/021-sk-design-md-generator"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Phase 021 sk-design-md-generator README revisit (rewrite)

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
| **Predecessor** | `020-sk-design-mcp-open-design` |
| **Successor** | `022-sk-create-agent` |
| **Handoff Criteria** | The skill README is rewritten purpose-first on the refined template, the HVR grep is clean, the version field is bumped with a matching changelog entry, the validator reports zero issues and this phase folder validates with zero errors |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sk-design-md-generator mode skill generates markdown from design artifacts. Its README is the mode's front door. The README at `.opencode/skills/sk-design/sk-design-md-generator/README.md` still carries the older tabular reference-card style and predates the pilot standard. Phase 001 refined the shared README template after the mcp-obsidian pilot, adding Human Voice Rules enforcement, versioning conventions and a stricter validation checklist. This README was never checked against that refined standard, so its conformance is unverified and the phase rewrites it purpose-first per the refined template and the mcp-obsidian exemplar.

### Purpose
Rewrite `.opencode/skills/sk-design/sk-design-md-generator/README.md` purpose-first per the refined template from phase 001 and the mcp-obsidian exemplar. The rewrite adds a one-line pitch and a problem-first OVERVIEW, preserves every fact, bumps the version field, adds the changelog entry and validates with the readme validator, the HVR grep and the link guard.

**End goal:** a purpose-first mode skill README that models the pilot standard, validates with zero issues, carries a bumped version field and has a matching changelog entry, with every fact from the prior README preserved.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read the current README and record the baseline: the version field, the validator output and the link state.
- Rewrite the README purpose-first per the refined template and the mcp-obsidian exemplar with a one-line pitch and a problem-first OVERVIEW.
- Bump the version field and add the changelog entry at `changelog/<version>.md`.
- Validate the README and this phase folder.

### Out of Scope
- SKILL.md content and any other file inside the sk-design-md-generator skill folder.
- Other skills' READMEs (owned by their sibling phases in 005-mode-child-readme-revisit).
- The refined template and the standalone fleet (owned by phases 001 and 004).
- Vault files, plugin data and any runtime configuration.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/sk-design-md-generator/README.md` | Rewrite | Purpose-first narrative on the refined template with a one-line pitch and a problem-first OVERVIEW |
| `.opencode/skills/sk-design/sk-design-md-generator/changelog/<version>.md` | Add | Per-release changelog entry matching the bumped version field |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/021-sk-design-md-generator/spec.md` | Create | Phase specification (this file) |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/021-sk-design-md-generator/plan.md` | Create | Phase implementation plan |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/021-sk-design-md-generator/tasks.md` | Create | Phase task list |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/021-sk-design-md-generator/checklist.md` | Create | Phase verification checklist |

Read-only references: the refined template, the mcp-obsidian exemplar README, the skill SKILL.md and the changelog folder are evidence for the rewrite, never writable in this phase.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Template readiness gate | The refined template exists at `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`, is read before the rewrite and its section model and required-section rule are recorded |
| REQ-002 | Baseline inventory | The current README is read and the baseline is recorded: the version field value, the `validate_document.py --type readme` output and the link state |
| REQ-003 | Purpose-first rewrite | The README is rewritten purpose-first per the refined template and the mcp-obsidian exemplar with a one-line pitch and a problem-first OVERVIEW |
| REQ-004 | Human Voice Rules clean | The HVR grep returns zero em dashes, zero semicolons and zero Oxford commas in the README body |
| REQ-005 | Version bump and changelog | The README frontmatter carries a bumped version field and a matching entry exists at `changelog/<version>.md` |
| REQ-006 | Validator zero issues | `python3 .opencode/skills/sk-doc/scripts/validate_document.py <readme> --type readme` reports zero issues on the README and every linked path resolves |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Facts preserved | A section-by-section diff against the prior README shows every fact preserved |
| REQ-008 | Out-of-scope guard | No SKILL.md, other skill README, template or vault file is modified |
| REQ-009 | Phase closeout | `validate.sh` on this phase folder reports zero errors and the phase metadata is regenerated |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The README reads purpose-first with a one-line pitch and a problem-first OVERVIEW per the refined template.
- **SC-002**: Every fact from the prior README survives the rewrite.
- **SC-003**: The README passes the validator with zero issues, carries a bumped version field and has a changelog entry.
- **SC-004**: The HVR grep and the link guard come back clean.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Refined template from phase 001 | Rewrite measured against a moving standard | Read the template first and gate on phase 001 output (REQ-001) |
| Dependency | mcp-obsidian exemplar | Rewrite drifts from the pilot pattern | Read the exemplar README before drafting (REQ-003) |
| Risk | The rewrite loses a fact | Facts gate fails | Section-by-section diff against the prior README (REQ-007) |
| Risk | HVR violations accumulate in the rewrite | Voice check fails | Scripted HVR grep gate (REQ-004) |
| Risk | Version field drifts from the changelog head | Version and changelog gates disagree | Record the baseline version and the changelog head and pick the bump target on evidence |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
