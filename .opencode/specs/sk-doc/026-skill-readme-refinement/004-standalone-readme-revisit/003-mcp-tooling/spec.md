---
title: "Feature Specification: Phase 3 mcp-tooling README rewrite"
description: "Rewrite .opencode/skills/mcp-tooling/README.md against the refined standalone README template from phase 001 with the mcp-obsidian README as the exemplar shape, purpose-first with HVR enforcement, a version bump and a changelog entry."
trigger_phrases:
  - "mcp tooling readme"
  - "hub readme rewrite"
  - "readme revisit mcp tooling"
  - "mcp tooling version bump"
  - "mcp tooling changelog entry"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/003-mcp-tooling"
    last_updated_at: "2026-08-04T12:52:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 3 docs (spec, plan, tasks, checklist) inside 004-standalone-readme-revisit"
    next_safe_action: "Execute phase 3 work: rewrite the mcp-tooling README against the refined template"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/README.md"
      - ".opencode/skills/mcp-tooling/changelog/<version>.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/003-mcp-tooling"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Phase 3 mcp-tooling README rewrite

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
| **Predecessor** | `002-mcp-code-mode` |
| **Successor** | `004-sk-code` |
| **Handoff Criteria** | The mcp-tooling README is purpose-first on the refined template with a one-line pitch and a problem-first OVERVIEW. It passes the readme validator with zero issues, carries a bumped version field with a matching changelog entry and passes the HVR grep. This phase folder validates with zero errors |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`.opencode/skills/mcp-tooling/README.md` still carries the older tabular reference-card style: an AT A GLANCE table, a QUICK START block and a short VERIFICATION section describe the hub as a route map before any outcome. The document predates the mcp-obsidian pilot standard, where the README opens with why the skill exists and what it delivers before any structure is listed. The frontmatter version field reads `1.0.0.0` while the changelog folder already reaches `v1.4.2.0`, so the version story is stale as well. The hub routes seven registered modes (chrome devtools, click-up, aside devtools, figma, refero, mobbin and obsidian) through `mode-registry.json` and `hub-router.json`. The README must present that routing surface in the refined purpose-first shape.

### Purpose
Rewrite `.opencode/skills/mcp-tooling/README.md` against the refined standalone README template from phase 001, using the mcp-obsidian README (`.opencode/skills/mcp-tooling/mcp-obsidian/README.md`) as the exemplar shape. The rewrite opens with a one-line pitch and a problem-first OVERVIEW, preserves every factual claim of the current document through a section-by-section diff, bumps the frontmatter version field, adds a changelog entry and validates clean.

**End goal:** the mcp-tooling hub README reads as one standard with the mcp-obsidian exemplar, with no fact lost and no out-of-scope file touched.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read the current README `.opencode/skills/mcp-tooling/README.md` and record the baseline: version field, validator output and link state.
- Rewrite the README purpose-first per the refined standalone template with a one-line pitch and a problem-first OVERVIEW.
- Bump the frontmatter version field and add the matching changelog entry under `.opencode/skills/mcp-tooling/changelog/`.
- Validate the rewrite with the sk-doc readme validator and the link guard. Run the HVR grep on the document body.
- Write this phase's own documentation set (spec, plan, tasks, checklist).

### Out of Scope
- Edits to the mcp-tooling `SKILL.md` or any mode packet files (`SKILL.md`, `INSTALL-GUIDE.md`, `assets/`, `examples/`).
- Edits to the mcp-obsidian pilot README or any other skill or mode README in the fleet.
- Edits to the refined README template, the creation workflow or any template asset.
- Edits to vault files, `mode-registry.json`, `hub-router.json`, `leaf-manifest.json` or any JSON asset in the hub.
- Fleet-wide validation and changelog entries (owned by phase 006).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-tooling/README.md` | Rewrite | Purpose-first rewrite on the refined template: one-line pitch, problem-first OVERVIEW, preserved facts, bumped version field |
| `.opencode/skills/mcp-tooling/changelog/<version>.md` | Add | Changelog entry for the rewrite release, next version after `v1.4.2.0` |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/003-mcp-tooling/spec.md` | Create | Phase specification (this file) |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/003-mcp-tooling/plan.md` | Create | Phase implementation plan |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/003-mcp-tooling/tasks.md` | Create | Phase task list |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/003-mcp-tooling/checklist.md` | Create | Phase verification checklist |

Read-only references: the refined standalone template (`.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`), the mcp-obsidian exemplar README (`.opencode/skills/mcp-tooling/mcp-obsidian/README.md`) and the current hub README are evidence for the rewrite, never writable beyond the files listed above.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Refined template readiness gate | `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md` is committed and readable before the rewrite starts |
| REQ-002 | Current README inventory | `.opencode/skills/mcp-tooling/README.md` is read first and the baseline is recorded: version field, validator output and link state |
| REQ-003 | Purpose-first rewrite | The rewritten README opens with a one-line pitch and a problem-first OVERVIEW per the refined template, with the mcp-obsidian exemplar as the reference shape |
| REQ-004 | HVR clean body | A grep of the README body returns zero em dashes, zero semicolons and zero Oxford commas |
| REQ-005 | Version bump and changelog entry | The frontmatter version field is bumped and a matching entry exists under `.opencode/skills/mcp-tooling/changelog/` |
| REQ-006 | Validator zero issues | `validate_document.py --type readme` reports zero issues on the rewritten README |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Facts preserved | A section-by-section diff against the current README confirms every factual claim survived the rewrite |
| REQ-008 | Out-of-scope guard | No `SKILL.md`, template, other README, vault file, registry or manifest is modified by this phase |
| REQ-009 | Phase closeout | `validate.sh` on this phase folder returns zero errors and phase metadata is regenerated on closeout |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The rewritten README opens with a one-line pitch and a problem-first OVERVIEW on the refined template shape.
- **SC-002**: The rewritten README passes `validate_document.py --type readme` with zero issues.
- **SC-003**: The README body passes the HVR grep with zero em dashes, zero semicolons and zero Oxford commas.
- **SC-004**: The frontmatter version field is bumped and a matching changelog entry exists.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Refined standalone README template (phase 001) | Rewrite targets a moving shape | REQ-001 gates the rewrite on the committed template |
| Dependency | mcp-obsidian exemplar README | Exemplar shape may drift from the template | Read both the template and the exemplar before drafting |
| Risk | Facts lost during the narrative rewrite | Shipped behavior claims disappear | Section-by-section diff per REQ-007 before the rewrite lands |
| Risk | HVR violations accumulate in a long rewrite | Voice check fails at closeout | Scripted HVR grep per REQ-004 after the rewrite |
| Risk | Version story stays stale | Frontmatter and changelog disagree again | REQ-005 bumps the version field and adds the entry in one change |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
