---
title: "Feature Specification: Phase 016 sk-code-quality README revisit (rewrite)"
description: "Rewrite the sk-code-quality mode skill README purpose-first against the refined README template from phase 001 and the mcp-obsidian exemplar, bump the version field, add the changelog entry and validate the result."
trigger_phrases:
  - "sk code quality readme"
  - "quality mode readme rewrite"
  - "code quality readme revisit"
  - "quality gate readme"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/016-sk-code-quality"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 016 docs (spec, plan, tasks, checklist) inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute README rewrite per tasks.md"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/sk-code-quality/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/016-sk-code-quality"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Phase 016 sk-code-quality README revisit (rewrite)

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
| **Predecessor** | `015-sk-code-opencode` |
| **Successor** | `017-sk-code-review` |
| **Handoff Criteria** | The sk-code-quality README is rewritten purpose-first on the refined template with a one-line pitch and a problem-first OVERVIEW. The rewrite passes the validator with zero issues, carries a bumped version field with a matching changelog entry and passes the HVR grep and the link guard. This phase folder validates with zero errors |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sk-code-quality README still carries the older tabular reference-card style and predates the pilot standard. The skill is the mode skill for code quality gates and verification: it sits between implementation and verification in the sk-code hub, loads the right quality checklist, runs comment hygiene per modified file and applies P0/P1/P2 author checks before the surface verification workflow collects final evidence. The README presents that capability as a card stack of tables instead of a purpose-first narrative. It was written before phase 001 refined the shared template with Human Voice Rules enforcement, versioning conventions and a stricter validation checklist. Its conformance to the refined standard is therefore not assumed.

### Purpose
Rewrite `.opencode/skills/sk-code/sk-code-quality/README.md` purpose-first against the refined template from phase 001 and the mcp-obsidian exemplar. The rewrite opens with a one-line pitch and a problem-first OVERVIEW, keeps every fact the current README carries, bumps the version field, adds the changelog entry and validates with zero issues.

**End goal:** a purpose-first README for the quality mode that holds parent packet success criterion SC-001 and SC-002 true and that the fleet-wide validation in phase 006 can pass.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read the current README and record the baseline: the version field, the validator output and the link state.
- Rewrite the README purpose-first per the refined template with a one-line pitch and a problem-first OVERVIEW.
- Bump the version field in the README frontmatter and add the matching changelog entry.
- Validate the README and this phase folder.

### Out of Scope
- SKILL.md content and any other file inside the sk-code-quality skill folder.
- Other skills' READMEs (owned by their sibling phases in 005-mode-child-readme-revisit).
- The refined template and the standalone fleet (owned by phases 001 and 004).
- Vault files, plugin data and any runtime configuration.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-code/sk-code-quality/README.md` | Rewrite | Purpose-first narrative on the refined template with a one-line pitch and a problem-first OVERVIEW |
| `.opencode/skills/sk-code/sk-code-quality/changelog/<version>.md` | Add | Per-release changelog entry matching the bumped version field |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/016-sk-code-quality/spec.md` | Create | Phase specification (this file) |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/016-sk-code-quality/plan.md` | Create | Phase implementation plan |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/016-sk-code-quality/tasks.md` | Create | Phase task list |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/016-sk-code-quality/checklist.md` | Create | Phase verification checklist |

Read-only references: the refined template, the mcp-obsidian exemplar README, the sk-code-quality `SKILL.md`, the changelog folder and the parent spec are evidence for the rewrite, never writable in this phase.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Template readiness gate | The refined template exists at `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`, is read before the rewrite and its section model and required-section rule are recorded |
| REQ-002 | Baseline inventory | The current README is read and the baseline is recorded: the version field value, the `validate_document.py --type readme` output and the link state |
| REQ-003 | Purpose-first rewrite | The README is rewritten per the refined template with a one-line pitch and a problem-first OVERVIEW, using the mcp-obsidian exemplar as the narrative shape |
| REQ-004 | Human Voice Rules clean | The HVR grep returns zero em dashes, zero semicolons and zero Oxford commas in the README body |
| REQ-005 | Version bump and changelog entry | The README frontmatter version field is bumped and a matching entry exists at `changelog/<version>.md` |
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

- **SC-001**: The README is rewritten purpose-first on the refined template with a one-line pitch and a problem-first OVERVIEW.
- **SC-002**: The rewrite passes the validator with zero issues, carries a bumped version field and has a matching changelog entry.
- **SC-003**: The HVR grep is clean and every linked path resolves.
- **SC-004**: No SKILL.md, template, other skill README or vault file changed and this phase folder validates with zero errors.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Refined template from phase 001 | Rewrite measured against a moving standard | Read the template first and record its section model (REQ-001) |
| Dependency | mcp-obsidian exemplar README | Rewrite drifts from the exemplar narrative shape | Compare the draft section by section against the exemplar before closeout |
| Dependency | Phases 001 and 004 complete | Standard and fleet not settled | Parent spec gates child phases on both |
| Risk | Facts lost in the rewrite | Section-by-section diff fails | Gate REQ-007 on the diff against the prior README |
| Risk | Version field drifts from the changelog head | Version and changelog gates disagree | Record the baseline version and the changelog head and pick the bump target on evidence |
| Risk | Link rot inside the README | Link guard fails | Run the link guard and fix or record each dead link |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does the README version field need to match the latest changelog entry? The field reads 1.0.0.1 while the changelog head is v1.0.0.0. The verification evidence decides.
<!-- /ANCHOR:questions -->
