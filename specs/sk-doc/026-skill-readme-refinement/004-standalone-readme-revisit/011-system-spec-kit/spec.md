---
title: "Feature Specification: Phase 011 system-spec-kit README revisit"
description: "Rewrite the system-spec-kit skill README at .opencode/skills/system-spec-kit/README.md purpose-first against the refined template from phase 001 and the mcp-obsidian exemplar, with HVR enforcement, a version bump and a changelog entry."
trigger_phrases:
  - "system spec kit readme"
  - "spec kit readme revisit"
  - "spec folder readme rewrite"
  - "spec kit readme validation"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/011-system-spec-kit"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 011 docs (spec, plan, tasks, checklist) inside 004-standalone-readme-revisit"
    next_safe_action: "Execute phase 011 work: rewrite the system-spec-kit README per tasks.md"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/011-system-spec-kit"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Phase 011 system-spec-kit README revisit

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
| **Predecessor** | `010-system-skill-advisor` |
| **Successor** | `005-mode-child-readme-revisit` |
| **Handoff Criteria** | The system-spec-kit README is rewritten purpose-first on the refined template with a one-line pitch and a problem-first OVERVIEW. The HVR grep is clean. The version field is bumped with a matching changelog entry. The readme validator reports zero issues. This phase folder validates with zero errors |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`.opencode/skills/system-spec-kit/README.md` still carries the older tabular reference-card style and predates the pilot standard that the mcp-obsidian README set and the refined template from phase 001. The skill is the spec folder documentation system: spec docs, validation scripts, memory save and graph metadata. Its README should state the outcome the skill delivers before any table or list, and it does not.

### Purpose
Rewrite `.opencode/skills/system-spec-kit/README.md` purpose-first against the refined standalone README template from phase 001, with the mcp-obsidian README as the reference shape. The rewrite keeps every shipped fact, bumps the version field, adds a changelog entry and passes the sk-doc readme validator plus the Human Voice Rules grep.

**End goal:** the system-spec-kit README reads as one standard with the mcp-obsidian exemplar, carries a bumped version with a changelog entry and closes this phase with zero validation errors.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read the current README at `.opencode/skills/system-spec-kit/README.md` and record the baseline: version field value, `validate_document.py` output and link state.
- Rewrite the README purpose-first against the refined template from phase 001, using the mcp-obsidian exemplar as the reference shape.
- Bump the `version:` field in the README frontmatter and add a matching entry under `.opencode/skills/system-spec-kit/changelog/`.
- Validate the rewrite with `validate_document.py --type readme`, the HVR grep and the link guard.
- Write this phase's own documentation set (spec, plan, tasks, checklist).

### Out of Scope
- Edits to `SKILL.md` or any other file inside `.opencode/skills/system-spec-kit/` beyond the README and the changelog entry.
- README rewrites for other standalone skills (owned by the sibling child phases of 004).
- Edits to the refined standalone template (owned by phase 001) and the creation workflow (owned by phase 003).
- Edits to the mcp-obsidian exemplar, vault files, memory DB files or MCP server sources.
- Mode child README rewrites (owned by phase 005).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/README.md` | Modify | Purpose-first rewrite per the refined template: one-line pitch, problem-first OVERVIEW, capability sections, bumped `version:` field |
| `.opencode/skills/system-spec-kit/changelog/v<version>.md` | Add | Changelog entry for the rewrite, version matching the bumped `version:` field |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/011-system-spec-kit/spec.md` | Create | Phase specification (this file) |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/011-system-spec-kit/plan.md` | Create | Phase implementation plan |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/011-system-spec-kit/tasks.md` | Create | Phase task list |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/011-system-spec-kit/checklist.md` | Create | Phase verification checklist |

Read-only references: the refined template at `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md` and the exemplar at `.opencode/skills/mcp-tooling/mcp-obsidian/README.md` are evidence for the rewrite, never writable in this phase.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Template readiness gate | The refined standalone README template from phase 001 is committed before the rewrite starts. `ls -l` shows `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md` with a non-empty body |
| REQ-002 | Inventory and baseline | The current README is read and the baseline recorded: the `version:` field value, the `validate_document.py` output and the link state |
| REQ-003 | Purpose-first rewrite | The README is rewritten against the refined template with a one-line pitch and a problem-first OVERVIEW that states the reader's situation before any feature list |
| REQ-004 | Human Voice Rules clean | A grep of the README body returns zero em dashes, zero semicolons and zero Oxford commas |
| REQ-005 | Version bump and changelog entry | The `version:` field is bumped in the README frontmatter and a matching entry exists under `.opencode/skills/system-spec-kit/changelog/` |
| REQ-006 | Validator zero issues | `validate_document.py --type readme` reports zero issues on the rewritten README |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Facts preserved | A section-by-section diff of the old README against the new one maps every old claim to a new home and no shipped behavior claim is lost |
| REQ-008 | Out-of-scope guard | `git diff --name-only` lists only the README, the changelog entry and this phase folder |
| REQ-009 | Phase closeout | `validate.sh` on this phase folder returns zero errors and the phase metadata is regenerated |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The README reads purpose-first with a one-line pitch and a problem-first OVERVIEW.
- **SC-002**: Every shipped fact from the old README survives the rewrite.
- **SC-003**: The readme validator, the HVR grep and the link guard all pass on the rewrite.
- **SC-004**: The version field is bumped and a matching changelog entry exists.
- **SC-005**: This phase folder validates with zero errors.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Refined standalone template (phase 001) | Rewrite against a moving shape | REQ-001 gates the start on the committed template |
| Dependency | mcp-obsidian exemplar | Style drift between the pilot and this rewrite | Read the exemplar before drafting and mirror its section order |
| Risk | HVR violations accumulate in a long rewrite | Voice check fails at closeout | Scripted grep per pass and an HVR gate before completion |
| Risk | Facts lost in the narrative rewrite | Shipped claims disappear | REQ-007 section-by-section diff before the rewrite lands |
| Risk | Changelog version mismatch | Entry and version field diverge | One version value threaded through both files |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
