---
title: "Feature Specification: Phase 002 mcp-code-mode README rewrite"
description: "Rewrite the mcp-code-mode skill README at .opencode/skills/mcp-code-mode/README.md against the refined README template from phase 001 with the mcp-obsidian exemplar as the reference shape."
trigger_phrases:
  - "mcp code mode readme"
  - "code mode readme rewrite"
  - "call tool chain readme"
  - "standalone readme revisit"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/002-mcp-code-mode"
    last_updated_at: "2026-08-04T12:51:55Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 002 docs (spec, plan, tasks, checklist) inside 004-standalone-readme-revisit"
    next_safe_action: "Execute README rewrite per tasks.md"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-code-mode/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/002-mcp-code-mode"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Phase 002 mcp-code-mode README rewrite

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
| **Predecessor** | `001-cli-external-orchestration` |
| **Successor** | `003-mcp-tooling` |
| **Handoff Criteria** | The mcp-code-mode README is purpose-first on the refined template with a one-line pitch and a problem-first OVERVIEW, passes `validate_document.py --type readme` with zero issues, carries a bumped version field and a changelog entry and passes the HVR grep. This phase folder validates with zero errors |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The mcp-code-mode skill README still carries the older tabular reference-card style with an AT A GLANCE table as its spine. It also predates the pilot standard set by the mcp-obsidian README and the refined template from phase 001. A reader learns what the skill is called and how to invoke it before they learn what outcome the skill delivers and when they should reach for it. The fleet goal is one narrative purpose-first standard across every standalone skill root. mcp-code-mode matters most to that standard because it is the execution engine the other mcp-* skills build on.

### Purpose
Rewrite `.opencode/skills/mcp-code-mode/README.md` so it opens with a one-line pitch, states the reader's situation in a problem-first OVERVIEW and then guides usage on the refined template from phase 001 with the mcp-obsidian README as the reference shape. The rewrite preserves every load-bearing fact in the current README, enforces the Human Voice Rules, bumps the version field and records a changelog entry.

**End goal:** a purpose-first mcp-code-mode README that reads as part of one fleet standard and passes the sk-doc README validator with zero issues.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read the current README at `.opencode/skills/mcp-code-mode/README.md` and record a baseline of the version field, the validator output and the link state.
- Rewrite the README purpose-first on the refined template from phase 001 with the mcp-obsidian README as the reference shape.
- Bump the version field in the README frontmatter and add a matching changelog entry under `.opencode/skills/mcp-code-mode/changelog/`.
- Write this phase's own documentation set (spec, plan, tasks, checklist).

### Out of Scope
- Edits to `SKILL.md` content, the mcp-server code, the scripts or the references in the mcp-code-mode package.
- Rewrites of any other skill README in the fleet (owned by sibling phases under 004-standalone-readme-revisit).
- Edits to the refined template (owned by phase 001) or to the creation workflow (owned by phase 003).
- Edits to the mcp-obsidian exemplar README.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-code-mode/README.md` | Rewrite | Purpose-first README on the refined template: one-line pitch, problem-first OVERVIEW, guided usage, version bump |
| `.opencode/skills/mcp-code-mode/changelog/<version>.md` | Add | Changelog entry for the bumped version following the package changelog convention |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/002-mcp-code-mode/spec.md` | Create | Phase specification (this file) |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/002-mcp-code-mode/plan.md` | Create | Phase implementation plan |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/002-mcp-code-mode/tasks.md` | Create | Phase task list |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/002-mcp-code-mode/checklist.md` | Create | Phase verification checklist |

Read-only references: the refined template at `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`, the mcp-obsidian exemplar at `.opencode/skills/mcp-tooling/mcp-obsidian/README.md` and the current README at `.opencode/skills/mcp-code-mode/README.md` are evidence for the rewrite, never writable outside the files above.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Template readiness gate passes before any rewrite | The refined template from phase 001 is committed and a baseline of the current README (version field, validator output, link state) is recorded in tasks.md |
| REQ-002 | Current README inventory completes | `read` of `.opencode/skills/mcp-code-mode/README.md` plus the changelog folder yields the version field value, the validator result, the link list and the changelog entry convention |
| REQ-003 | README rewritten purpose-first on the refined template | The README opens with a one-line pitch and a problem-first OVERVIEW that states the reader's situation before any feature list |
| REQ-004 | Human Voice Rules enforced | An HVR grep of the README returns zero em dashes, zero semicolons and zero Oxford commas |
| REQ-005 | Version field bumped with a changelog entry | The frontmatter version field increments and `.opencode/skills/mcp-code-mode/changelog/<version>.md` documents the rewrite |
| REQ-006 | README validator reports zero issues | `validate_document.py --type readme` on the rewritten README exits clean |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Facts preserved across the rewrite | A section-by-section diff of the old README against the new one keeps every load-bearing claim, with only voice and layout changing |
| REQ-008 | Out-of-scope guard holds | `git status` and `git diff --stat` show changes limited to the README, the changelog entry and this phase folder |
| REQ-009 | Phase closeout completes | `validate.sh` on this phase folder reports zero errors and phase metadata is regenerated at closeout |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The README reads purpose-first on the refined template with a one-line pitch and a problem-first OVERVIEW.
- **SC-002**: Every load-bearing fact in the pre-rewrite README survives in the new text.
- **SC-003**: The version field is bumped and a changelog entry documents the rewrite.
- **SC-004**: The README passes `validate_document.py --type readme` with zero issues and the HVR grep returns zero hits.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Refined README template (phase 001) | Rewrite lands against a moving template | REQ-001 gates the start on the committed template |
| Dependency | mcp-obsidian exemplar README | Style drift from the reference shape | Read the exemplar before drafting and mirror its section flow |
| Dependency | `validate_document.py` readme validator | Validation gate unavailable at closeout | Run the validator on the baseline and on the rewrite, record both outputs |
| Risk | HVR violations accumulate in a large rewrite | Voice check fails at closeout | Scripted `rg -n` HVR grep in the verification phase |
| Risk | Facts lost during the narrative rewrite | Shipped behavior claims disappear | REQ-007 keeps the section-by-section diff mandatory |
| Risk | Version and changelog drift | Frontmatter and changelog disagree | REQ-005 ties the bump to the changelog entry in one change set |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
