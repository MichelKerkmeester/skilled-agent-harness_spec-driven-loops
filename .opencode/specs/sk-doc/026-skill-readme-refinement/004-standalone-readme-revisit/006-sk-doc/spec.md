---
title: "Feature Specification: Phase 006 sk-doc standalone README rewrite"
description: "Rewrite the sk-doc skill README at .opencode/skills/sk-doc/README.md against the refined README template from phase 001 and the mcp-obsidian exemplar, purpose-first with HVR enforcement, a version bump and a changelog entry."
trigger_phrases:
  - "sk doc readme rewrite"
  - "standalone readme phase 6"
  - "sk-doc README revisit"
  - "readme version bump changelog"
  - "hvr readme cleanup"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/006-sk-doc"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 006 docs (spec, plan, tasks, checklist) inside 004-standalone-readme-revisit"
    next_safe_action: "Execute phase 006 work: rewrite the sk-doc README purpose-first per the refined template"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/006-sk-doc"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Phase 006 sk-doc standalone README rewrite

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
| **Parent Phase** | `004-standalone-readme-revisit` |
| **Predecessor** | `003-creation-workflow-update` |
| **Successor** | `005-mode-child-readme-revisit` |
| **Handoff Criteria** | The sk-doc README reads purpose-first per the refined template with a one-line pitch and a problem-first OVERVIEW. It passes the README validator with zero issues, the HVR grep and the link guard. The version field is bumped and a changelog entry exists. This phase folder validates with zero errors |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sk-doc README still carries the older tabular reference-card style and predates the pilot standard set by mcp-obsidian. It opens with a dense capability description and an AT A GLANCE reference table, so a reader must work to find the outcome the skill delivers. The refined README template from phase 001 now defines the standard shape: a one-line pitch, a problem-first OVERVIEW and purpose-first sections. The skill that owns documentation quality should be the flagship example of that standard, not the exception to it.

### Purpose
Rewrite `.opencode/skills/sk-doc/README.md` against the refined README template from phase 001 with the mcp-obsidian README as the reference shape. The rewrite is purpose-first with a one-line pitch and a problem-first OVERVIEW. It obeys the Human Voice Rules and it lands with a bumped version field and a changelog entry. sk-doc is the hub skill for documentation quality with create-* modes (skill, command, agent, changelog, readme and more) that scaffold, validate and package components, so its own README must demonstrate the standard it enforces.

**End goal:** the sk-doc README reads as the fleet reference for the purpose-first standard while every factual claim from the old README survives.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read the current README at `.opencode/skills/sk-doc/README.md` and record the baseline: the version field value, the pre-rewrite validator output and the link state.
- Rewrite the README purpose-first per the refined README template from phase 001, using the mcp-obsidian README as the reference shape.
- Bump the version field and add a changelog entry in the changelog folder.
- Validate the rewrite with the README validator, the HVR grep and a link guard.
- Write this phase's own documentation set (spec, plan, tasks, checklist).

### Out of Scope
- Edits to SKILL.md content (`.opencode/skills/sk-doc/SKILL.md`).
- Rewrites of other skills' READMEs (owned by the sibling child phases under phase 004).
- Edits to the README templates (owned by phase 001).
- Edits to vault files, mode registries, leaf manifests or JSON assets in the skill root.
- Fleet-wide validation and changelog closeout (owned by packet phase `006-validation-and-closeout`).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/README.md` | Rewrite | Purpose-first skill README per the refined template: one-line pitch, problem-first OVERVIEW, HVR clean prose, bumped version field |
| `.opencode/skills/sk-doc/changelog/<version>.md` | Add | Changelog entry for the bumped version per the per-release changelog conventions |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/006-sk-doc/spec.md` | Create | Phase specification (this file) |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/006-sk-doc/plan.md` | Create | Phase implementation plan |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/006-sk-doc/tasks.md` | Create | Phase task list |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/006-sk-doc/checklist.md` | Create | Phase verification checklist |

Read-only references: the refined template at `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md` and the mcp-obsidian exemplar at `.opencode/skills/mcp-tooling/mcp-obsidian/README.md` are evidence for the rewrite, never writable in this phase.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Template readiness gate | The refined README template from phase 001 and the mcp-obsidian exemplar exist and are read before the rewrite starts. `ls` shows `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md` and `.opencode/skills/mcp-tooling/mcp-obsidian/README.md`. The section model from both documents is recorded in the task list |
| REQ-002 | Baseline inventory | The current README is read and the baseline is recorded: the version field value, the pre-rewrite validator output and the link state. The baseline entry names the version field value from `.opencode/skills/sk-doc/README.md` |
| REQ-003 | Purpose-first rewrite | The README is rewritten per the refined template with a one-line pitch and a problem-first OVERVIEW. The README opens with the pitch blockquote and the OVERVIEW section states the reader situation before any feature list |
| REQ-004 | Human Voice Rules | The rewritten README passes the HVR check. `rg -n` returns zero em dashes and zero semicolons. A review confirms zero Oxford commas in the README body |
| REQ-005 | Version bump and changelog entry | The version field is bumped and a changelog entry is added. The frontmatter version field differs from the baseline value and `.opencode/skills/sk-doc/changelog/<version>.md` exists with an entry for the rewrite |
| REQ-006 | Validator zero issues | The rewritten README passes the README validator. `validate_document.py --type readme` reports zero issues on `.opencode/skills/sk-doc/README.md` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Facts preserved | The rewrite keeps every factual claim from the old README. A section-by-section diff of the old README against the new one shows each command, path and mode name survives |
| REQ-008 | Out-of-scope guard | No file outside the README and the changelog entry is modified. `git diff --stat` shows only the README, the changelog entry and this phase folder |
| REQ-009 | Phase closeout | The phase closes cleanly. `validate.sh` on this phase folder returns zero errors and the phase metadata files are regenerated |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The sk-doc README reads purpose-first per the refined template with a one-line pitch and a problem-first OVERVIEW.
- **SC-002**: The rewritten README passes the README validator with zero issues, carries a bumped version field and has a changelog entry.
- **SC-003**: The rewrite is HVR clean with zero em dashes, zero semicolons and zero Oxford commas. Every link in the README resolves.
- **SC-004**: The sk-doc README serves as the flagship reference for the sibling phase rewrites under phase 004.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Refined README template (phase 001) | Rewrite may use a stale section model | Gate the start of the rewrite on the template commit being present |
| Dependency | mcp-obsidian pilot README | Exemplar shape may not translate to a hub skill surface | Read the exemplar and map its sections to the sk-doc surface before drafting |
| Dependency | README validator | Validation gate unavailable or versioned | Run the validator and record the output in the checklist |
| Risk | HVR violations accumulate in a large rewrite | Voice check fails at closeout | Scripted HVR grep per section with a zero-tolerance gate before commit |
| Risk | Facts lost during the narrative rewrite | Shipped behavior claims disappear | Section-by-section diff of the old README against the new one |
| Risk | Version and changelog drift | README version and changelog disagree | REQ-005 gates both changes in one task |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
