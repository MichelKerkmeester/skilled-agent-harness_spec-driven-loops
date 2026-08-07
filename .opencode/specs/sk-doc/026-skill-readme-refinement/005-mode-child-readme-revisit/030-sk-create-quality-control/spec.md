---
title: "Feature Specification: Phase 030 sk-create-quality-control README revisit"
description: "Rewrite the sk-create-quality-control mode skill README purpose-first against the refined README template from phase 001, using the mcp-obsidian exemplar, with a version bump and a changelog entry."
trigger_phrases:
  - "sk create quality control readme"
  - "quality control readme revisit"
  - "doc quality readme"
  - "sk-create-quality-control readme"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/030-sk-create-quality-control"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 030 docs (spec, plan, tasks, checklist) inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute phase 030 work: rewrite the sk-create-quality-control README per the refined template"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-quality-control/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/030-sk-create-quality-control"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Phase 030 sk-create-quality-control README revisit

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
| **Predecessor** | `029-sk-create-manual-testing-playbook` |
| **Successor** | `031-sk-create-readme` |
| **Handoff Criteria** | The sk-create-quality-control README is rewritten purpose-first on the refined template, HVR clean, versioned with a changelog entry, validated with zero issues and this phase folder validates with zero errors |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The mcp-obsidian README pilot proved the standard for mode skill READMEs: narrative, purpose-first documents in the Human Voice Rules, validated by the sk-doc README validator. The sk-create-quality-control README still carries the older tabular reference-card style and predates the pilot standard. It is the mode skill that audits, scores and optimizes existing markdown documents, so a reader needs the purpose-first shape to grasp why a quality gate matters before the check list appears. The refined template from phase 001 adds Human Voice Rules enforcement, versioning conventions and a stricter validation checklist that the current README has never been measured against.

### Purpose
Rewrite `.opencode/skills/sk-doc/sk-create-quality-control/README.md` purpose-first against the refined README template from phase 001, using the mcp-obsidian README as the exemplar. The rewrite keeps every fact the current README carries, adds a one-line pitch and a problem-first OVERVIEW, bumps the version field and adds the matching changelog entry, then validates the result.

**End goal:** a purpose-first README for the quality-control mode skill that reads clean under the Human Voice Rules, carries a bumped version field with a changelog entry and reports zero validator issues.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read the current README and record the baseline: the version field, the validator output and the link state.
- Rewrite the README purpose-first per the refined template from phase 001 and the mcp-obsidian exemplar, with a one-line pitch and a problem-first OVERVIEW.
- Bump the version field in the README frontmatter.
- Add the changelog entry at `changelog/<version>.md`.
- Validate the README and this phase folder.

### Out of Scope
- SKILL.md content and any other file inside the sk-create-quality-control skill folder.
- Other skills' READMEs (owned by their sibling phases in 005-mode-child-readme-revisit).
- The refined template and the standalone fleet (owned by phases 001 and 004).
- Vault files, plugin data and any runtime configuration.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/sk-create-quality-control/README.md` | Rewrite | Purpose-first narrative on the refined template with a one-line pitch and a problem-first OVERVIEW |
| `.opencode/skills/sk-doc/sk-create-quality-control/changelog/<version>.md` | Add | Per-release changelog entry matching the bumped version field |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/030-sk-create-quality-control/spec.md` | Create | Phase specification (this file) |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/030-sk-create-quality-control/plan.md` | Create | Phase implementation plan |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/030-sk-create-quality-control/tasks.md` | Create | Phase task list |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/030-sk-create-quality-control/checklist.md` | Create | Phase verification checklist |

Read-only references: the refined template, the mcp-obsidian README exemplar, the skill `SKILL.md`, the changelog folder and the parent spec are evidence for the rewrite, never writable in this phase.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Template readiness gate | The refined template exists at `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`, is read before the rewrite and its section model and required-section rule are recorded |
| REQ-002 | Baseline inventory | The current README is read and the baseline is recorded: the version field value, the `validate_document.py --type readme` output and the link state |
| REQ-003 | Purpose-first rewrite | The README is rewritten per the refined template with a one-line pitch and a problem-first OVERVIEW, using the mcp-obsidian README as the exemplar |
| REQ-004 | Human Voice Rules clean | The HVR grep returns zero em dashes, zero semicolons and zero Oxford commas in the README body |
| REQ-005 | Version and changelog | The README frontmatter version field is bumped and a matching entry exists at `changelog/<version>.md` |
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

- **SC-001**: The README reads purpose-first with a one-line pitch and a problem-first OVERVIEW on the refined template section model.
- **SC-002**: The HVR grep returns zero em dashes, zero semicolons and zero Oxford commas in the README body.
- **SC-003**: The version field is bumped and the matching changelog entry exists.
- **SC-004**: The validator reports zero issues, the link guard is clean and this phase folder validates with zero errors.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Refined template from phase 001 | Rewrite measured against a moving standard | Gate the rewrite on the phase 001 output and read the template first (REQ-001) |
| Dependency | Phases 001 and 004 complete | Standard and fleet not settled | Parent spec gates child phases on both |
| Dependency | mcp-obsidian exemplar README | Exemplar shape drifts from the refined template | Read the exemplar README before drafting (REQ-003) |
| Risk | Facts lost in the rewrite | README content regresses | Section-by-section diff against the prior README (REQ-007) |
| Risk | Version field drifts from the changelog head | Version and changelog gates disagree | Record the baseline version and the changelog head and pick the bump target on evidence |
| Risk | Link rot inside the README | Link guard fails | Run the link guard and fix or record each dead link |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which version value becomes the bump target? The README version field reads 1.0.0.0 while the changelog head is v1.0.1.1 and the SKILL.md field reads 1.0.1.1. The baseline evidence and the changelog convention decide.
- The README head already carries a pitch blockquote and an OVERVIEW section. The conformance scan in the implementation phase decides whether the rewrite covers the whole body or only the sections that still carry the older tabular reference-card style.
<!-- /ANCHOR:questions -->
