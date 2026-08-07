---
title: "Feature Specification: Phase 033 sk-prompt-improve README revisit"
description: "Rewrite the mode skill README at sk-prompt/sk-prompt-improve/ against the refined README template from phase 001, mirror the mcp-obsidian exemplar, bump the version, add a changelog entry and validate."
trigger_phrases:
  - "sk-prompt-improve readme"
  - "prompt improve readme revisit"
  - "mode readme rewrite"
  - "prompt-improve readme validation"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/033-sk-prompt-improve"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 033 docs (spec, plan, tasks, checklist) inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute phase 033 work: rewrite the sk-prompt-improve README per tasks.md"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/sk-prompt-improve/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/033-sk-prompt-improve"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Phase 033 sk-prompt-improve README revisit

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 (phase child) |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-04 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` (005-mode-child-readme-revisit) |
| **Parent Packet** | `sk-doc/026-skill-readme-refinement` |
| **Predecessor** | `032-sk-create-skill` |
| **Successor** | `006-validation-and-closeout` |
| **Handoff Criteria** | The sk-prompt-improve README is purpose-first on the refined template with a one-line pitch and a problem-first OVERVIEW, HVR clean, version bumped with a changelog entry, validated with zero issues, and this phase folder validates with zero errors |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The README at `.opencode/skills/sk-prompt/sk-prompt-improve/README.md` still carries the older tabular reference-card style: AT A GLANCE, QUICK START and HOW IT WORKS tables come before any narrative about why the skill exists. It predates the pilot standard that the mcp-obsidian README proved and the refined template from phase 001 codified. A reader meets a wall of tables before the why, the frontmatter version field (2.3.0.21) has no matching changelog entry, and the VERIFICATION section points the validator at the legacy `prompt:improve` folder name that no longer exists. The real folder is `sk-prompt-improve`.

### Purpose
Rewrite the README purpose-first against the refined template from phase 001, mirroring the mcp-obsidian exemplar. Preserve every fact the current README carries, bump the version field, add the changelog entry, correct the validator path and validate the result. The SKILL.md stays untouched, the template stays untouched and the mcp-obsidian exemplar stays untouched.

**End goal:** a purpose-first README that passes the sk-doc README validator with zero issues, passes the HVR grep and carries a versioned changelog entry.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read the current README at `.opencode/skills/sk-prompt/sk-prompt-improve/README.md` and record the baseline: version field, validator output and link state.
- Rewrite the README purpose-first per the refined template from phase 001, mirroring the mcp-obsidian exemplar, with a one-line pitch and a problem-first OVERVIEW.
- Preserve every fact via a section-by-section diff against the old README.
- Bump the version field in the README frontmatter, correct the validator path and add the changelog entry.
- Validate the README with the sk-doc README validator, the HVR grep and the link guard, then run validate.sh on this phase folder.
- Write this phase's own documentation set (spec, plan, tasks and checklist).

### Out of Scope
- Edits to SKILL.md content for sk-prompt-improve or any other packet.
- README rewrites of other skills or hubs (owned by the sibling phases in 005-mode-child-readme-revisit).
- Edits to the refined README template (owned by phase 001).
- Edits to the mcp-obsidian exemplar README (verify-only by parent contract).
- Vault files, assets, references, benchmark folders and manual-testing-playbook content inside `sk-prompt/sk-prompt-improve/`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-prompt/sk-prompt-improve/README.md` | Rewrite | Purpose-first README per the refined template: one-line pitch, problem-first OVERVIEW, preserved facts, bumped version field, corrected validator path |
| `.opencode/skills/sk-prompt/sk-prompt-improve/changelog/<version>.md` | Add | Changelog entry for the rewritten README per the packet changelog convention |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/033-sk-prompt-improve/spec.md` | Create | Phase specification (this file) |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/033-sk-prompt-improve/plan.md` | Create | Phase implementation plan |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/033-sk-prompt-improve/tasks.md` | Create | Phase task list |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/033-sk-prompt-improve/checklist.md` | Create | Phase verification checklist |

Read-only references: the refined template (`.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`) and the mcp-obsidian exemplar (`.opencode/skills/mcp-tooling/mcp-obsidian/README.md`) are evidence for the rewrite, never writable in this phase.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Template readiness gate passes before the rewrite starts | `ls` shows the refined template at `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md` with a non-empty body |
| REQ-002 | The current README is inventoried before rewriting | The baseline records the version field (2.3.0.21), the validator output and the link state of `.opencode/skills/sk-prompt/sk-prompt-improve/README.md` |
| REQ-003 | The README is rewritten purpose-first per the refined template | The README opens with a one-line pitch blockquote and a problem-first OVERVIEW that states the reader's situation before any table |
| REQ-004 | The rewritten README obeys the Human Voice Rules | A grep of the README body returns zero em dashes, zero semicolons and zero Oxford commas |
| REQ-005 | The version field bumps and a changelog entry is added | The README frontmatter carries the new version and `changelog/<version>.md` exists with an entry per the packet convention |
| REQ-006 | The README validates as a readme document | `validate_document.py --type readme` reports zero issues on the README |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Every fact in the old README is preserved | A section-by-section diff against the old README shows every fact carried over |
| REQ-008 | No file outside the scoped set changes | `git status` shows only the README, the changelog entry and this phase folder |
| REQ-009 | The phase closes out cleanly | `validate.sh` on this phase folder reports zero errors and `generate-context.js` regenerates the folder metadata |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The README opens purpose-first with a one-line pitch and a problem-first OVERVIEW on the refined template.
- **SC-002**: Every fact from the old README survives the rewrite, verified by section-by-section diff.
- **SC-003**: The version field is bumped and the changelog entry is in place.
- **SC-004**: The README passes the sk-doc README validator with zero issues and the HVR grep is clean.
- **SC-005**: Phase closeout runs with zero validate.sh errors and regenerated metadata.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Refined README template (phase 001) | The rewrite may follow an outdated shape | Gate the start on the template file existing and read |
| Dependency | mcp-obsidian exemplar README | Style drift from the pilot standard | Read the exemplar before drafting |
| Dependency | sk-doc README validator | The validation gate may be unavailable | Run the validator and record output in the checklist |
| Risk | Facts lost in the rewrite | Silent content regression | Section-by-section diff against the old README |
| Risk | HVR violations in a large rewrite | The voice gate fails | Scripted `rg -n` gates in verification |
| Risk | Stale validator path survives | The VERIFICATION command keeps pointing at the legacy `prompt:improve` folder | Correct the path to `sk-prompt-improve` in the rewrite |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
