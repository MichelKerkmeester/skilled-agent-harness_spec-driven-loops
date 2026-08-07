---
title: "Feature Specification: Phase 007 sk-git standalone README revisit"
description: "Rewrite the sk-git skill README at .opencode/skills/sk-git/README.md against the refined README template from phase 001 and the mcp-obsidian exemplar: purpose-first rewrite, HVR cleanup, version bump with a matching changelog entry and validation."
trigger_phrases:
  - "sk-git readme revisit"
  - "sk-git readme rewrite"
  - "git skill readme"
  - "worktree readme update"
  - "sk-git changelog entry"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/007-sk-git"
    last_updated_at: "2026-08-04T13:26:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 7 docs (spec, plan, tasks, checklist) inside 004-standalone-readme-revisit"
    next_safe_action: "Execute phase 7 work: rewrite the sk-git README per the refined template"
    blockers: []
    key_files:
      - ".opencode/skills/sk-git/README.md"
      - ".opencode/skills/sk-git/changelog/v1.4.0.0.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/007-sk-git"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Phase 007 sk-git standalone README revisit

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 (phase child) |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-08-04 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` (sk-doc/026-skill-readme-refinement) |
| **Parent Packet** | `sk-doc/026-skill-readme-refinement` |
| **Predecessor** | `006-sk-doc` |
| **Successor** | `008-sk-prompt` |
| **Handoff Criteria** | The sk-git README reads purpose-first on the refined template with a one-line pitch and a problem-first OVERVIEW, passes the HVR grep and the readme validator with zero issues, carries a bumped version field with a matching changelog entry and this phase folder validates with zero errors |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The mcp-obsidian pilot set the standard for standalone skill READMEs: narrative, purpose-first documents written in the Human Voice Rules and validated by the sk-doc readme validator. The sk-git README at `.opencode/skills/sk-git/README.md` was partially modernized by the 025/004 drift sweep, but it still diverges from the refined template in verified ways. The FEATURES table carries an em dash at line 102, so the body fails the HVR grep. The frontmatter version field reads `1.4.0.0` while the changelog folder tops out at `v1.3.2.0.md`, so the version has no matching changelog entry. Three sections (FEATURES, STRUCTURE, REQUIREMENTS) sit outside the refined template's default section model. The closing section is named RELATED RESOURCES instead of RELATED DOCUMENTS. No validator run or link-guard pass has been recorded for the swept state, even though the validator currently reports zero issues.

### Purpose
Rewrite `.opencode/skills/sk-git/README.md` so it reads as the front door of the git workspace safety skill: a one-line pitch, an AT A GLANCE table, a problem-first OVERVIEW, quick start, how it works, integration and navigation, troubleshooting, FAQ, verification and related documents, all in the Human Voice Rules. Bump the version field and add the matching changelog entry, then validate the README and this phase folder.

**End goal:** the sk-git README reads as one standard with the mcp-obsidian exemplar. The phase closes with the README validator, the HVR grep, a link guard and `validate.sh` all clean.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rewrite `.opencode/skills/sk-git/README.md` purpose-first against the refined template from phase 001 (`.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`) and the mcp-obsidian exemplar (`.opencode/skills/mcp-tooling/mcp-obsidian/README.md`).
- Fix every HVR violation in the README body: zero em dashes, zero semicolons and zero Oxford commas.
- Bump the version field in the README frontmatter and add the matching entry to `.opencode/skills/sk-git/changelog/`.
- Validate the rewritten README with the sk-doc readme validator, the HVR grep, a link guard and `git diff --check`.
- Write this phase's own documentation set (spec, plan, tasks, checklist).

### Out of Scope
- Content changes to `.opencode/skills/sk-git/SKILL.md` (the runtime instruction surface).
- README rewrites for any other standalone skill root (owned by sibling phase folders).
- Edits to the refined template, the mcp-obsidian exemplar or any sk-doc asset.
- Edits to vault files, plugins or runtime data.
- Fleet-wide validation and release-note work (owned by the parent packet closeout).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-git/README.md` | Rewrite | Purpose-first README on the refined template: pitch, AT A GLANCE, problem-first OVERVIEW, quick start, how it works, navigation, troubleshooting, FAQ, verification, related documents |
| `.opencode/skills/sk-git/changelog/<version>.md` | Add | Changelog entry matching the bumped version field |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/007-sk-git/spec.md` | Create | Phase specification (this file) |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/007-sk-git/plan.md` | Create | Phase implementation plan |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/007-sk-git/tasks.md` | Create | Phase task list |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/007-sk-git/checklist.md` | Create | Phase verification checklist |

Read-only references: the refined template, the mcp-obsidian exemplar README and the current sk-git README are evidence for the rewrite, never writable beyond the README row above.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Template readiness gate | The refined template from phase 001 is committed at `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md` before the rewrite starts |
| REQ-002 | Baseline inventory | The current README is read first and its baseline is recorded: version field value, `validate_document.py` output and link state |
| REQ-003 | Purpose-first rewrite | The README opens with a one-line blockquote pitch and a problem-first OVERVIEW, follows the refined template section model with numbered ALL-CAPS H2 sections and `---` dividers |
| REQ-004 | HVR clean | A grep over the README body returns zero em dashes, zero semicolons and zero Oxford commas |
| REQ-005 | Version bump plus changelog entry | The version field is bumped in the README frontmatter and a matching entry exists at `.opencode/skills/sk-git/changelog/<version>.md` |
| REQ-006 | Validator zero issues | `validate_document.py .opencode/skills/sk-git/README.md --type readme` reports zero issues |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Facts preserved | A section-by-section diff against the prior README shows every shipped claim, command and pointer retained, with the em dash at line 102 removed |
| REQ-008 | Out-of-scope guard | No SKILL.md, no sibling README, no template, no vault file and no plugin file is modified by this phase |
| REQ-009 | Phase closeout | `validate.sh` on this phase folder reports zero errors and the phase metadata is regenerated |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The sk-git README reads purpose-first on the refined template with a one-line pitch and a problem-first OVERVIEW.
- **SC-002**: The rewritten README passes the readme validator with zero issues and the HVR grep with zero em dashes, zero semicolons and zero Oxford commas.
- **SC-003**: The version field is bumped and a matching changelog entry exists in `.opencode/skills/sk-git/changelog/`.
- **SC-004**: The phase touches only the README, the changelog entry and this phase folder. `validate.sh` reports zero errors on the folder.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Refined standalone README template (phase 001) | Rewrite targets a moving standard | REQ-001 gates the rewrite start on the committed template |
| Dependency | mcp-obsidian exemplar README | Voice and section drift | Read the exemplar before drafting and keep its section order |
| Risk | HVR violations hide in a large rewrite | Voice check fails at closeout | REQ-004 scripts the grep and the checklist records the output |
| Risk | Facts lost during the narrative rewrite | Shipped behavior claims disappear | REQ-007 requires a section-by-section diff before landing |
| Risk | Version and changelog drift | Field and entry mismatch | REQ-005 ties the entry to the bumped field value |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
