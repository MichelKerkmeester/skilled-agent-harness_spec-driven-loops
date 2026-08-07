---
title: "Feature Specification: Phase 015 sk-code-opencode README revisit"
description: "Rewrite the sk-code-opencode mode README at .opencode/skills/sk-code/sk-code-opencode/README.md against the refined README template from phase 001 and the mcp-obsidian exemplar, with a version bump and a changelog entry."
trigger_phrases:
  - "sk-code-opencode readme"
  - "opencode surface readme"
  - "system code evidence readme"
  - "mode child readme revisit"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/015-sk-code-opencode"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 015 docs (spec, plan, tasks, checklist) inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute README rewrite per tasks.md"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/sk-code-opencode/README.md"
      - ".opencode/skills/sk-code/sk-code-opencode/changelog/v1.0.0.5.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/015-sk-code-opencode"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Phase 015 sk-code-opencode README revisit

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-08-04 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` (sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit) |
| **Parent Packet** | `sk-doc/026-skill-readme-refinement` |
| **Predecessor** | `014-mcp-refero` |
| **Successor** | `016-sk-code-quality` |
| **Handoff Criteria** | The sk-code-opencode README is purpose-first on the refined template with a one-line pitch and a problem-first OVERVIEW, HVR clean, version bumped with a changelog entry, validated with zero issues and the phase folder validated with zero errors |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sk-code-opencode mode README at `.opencode/skills/sk-code/sk-code-opencode/README.md` still carries the older tabular reference-card style. It opens with an AT A GLANCE table and a layout list. It predates the pilot standard that the mcp-obsidian README and the refined template from phase 001 set for mode skill READMEs. The document reads as a spec sheet, not as a narrative. It does not tell a reader why the surface exists or when the hub bundles it. It does not say what problem it solves, so the reader has to reverse-engineer the purpose from a facts table.

sk-code-opencode is the OPENCODE surface mode of the sk-code hub. It carries read-only system-code evidence for the `.opencode/` tree plus the shared implement, debug and verify workflow doctrine. The hub bundles it alongside a workflow mode when it detects a system-code surface. It is never routed as a primary. The README must state that plainly and purpose-first. Today it does not.

### Purpose
Rewrite `.opencode/skills/sk-code/sk-code-opencode/README.md` purpose-first against the refined README template from phase 001, using the mcp-obsidian README as the structural exemplar. The rewrite keeps a one-line pitch and a problem-first OVERVIEW, keeps every fact the current README carries, bumps the version field from `1.0.0.4` to `1.0.0.5` and adds a changelog entry at `changelog/v1.0.0.5.md`.

**End goal:** a purpose-first README for the sk-code-opencode mode that reads as a narrative, validates with zero issues, passes the HVR grep and releases with a version bump and a changelog entry.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read the current README at `.opencode/skills/sk-code/sk-code-opencode/README.md` and record the baseline: version field value, validator output and link state.
- Rewrite the README purpose-first per the refined README template from phase 001 and the mcp-obsidian exemplar.
- Bump the version field from `1.0.0.4` to `1.0.0.5` in the README frontmatter.
- Add the changelog entry at `.opencode/skills/sk-code/sk-code-opencode/changelog/v1.0.0.5.md`.
- Validate the rewritten README and this phase's documentation set.
- Write this phase's own documentation set (spec, plan, tasks and checklist).

### Out of Scope
- Edits to the sk-code-opencode SKILL.md content.
- Rewrites of sibling mode READMEs in the sk-code hub (sk-code-quality, sk-code-review, sk-code-webflow).
- Edits to the refined README template (owned by phase 001) or the mcp-obsidian README (verify-only, owned by phase 013).
- Edits to template or asset files in any hub.
- Vault, plugin or runtime files.
- Fleet-wide validation and closeout (owned by phase 006).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-code/sk-code-opencode/README.md` | Rewrite | Purpose-first rewrite: one-line pitch, problem-first OVERVIEW, earned sections per the refined template, version bump to `1.0.0.5` |
| `.opencode/skills/sk-code/sk-code-opencode/changelog/v1.0.0.5.md` | Add | Release note for the README rewrite |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/015-sk-code-opencode/spec.md` | Create | Phase specification (this file) |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/015-sk-code-opencode/plan.md` | Create | Phase implementation plan |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/015-sk-code-opencode/tasks.md` | Create | Phase task list |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/015-sk-code-opencode/checklist.md` | Create | Phase verification checklist |

Read-only references: the refined README template (`.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`), the mcp-obsidian exemplar (`.opencode/skills/mcp-tooling/mcp-obsidian/README.md`) and the sk-code-opencode SKILL.md are evidence for the rewrite, never writable in this phase.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Template readiness gate | The refined README template from phase 001 and the mcp-obsidian exemplar are read and their section model recorded before any rewrite edit |
| REQ-002 | Current README inventory | The current README is read and the baseline is recorded: version field value, `validate_document.py` output and link state |
| REQ-003 | Purpose-first rewrite | The rewritten README opens with a one-line blockquote pitch and a problem-first OVERVIEW with a Why This Skill Exists section that states the reader's situation before any feature list. The remaining sections are earned per the refined template |
| REQ-004 | Human Voice Rules | A grep of the rewritten README body returns zero em dashes, zero semicolons and zero Oxford comma patterns |
| REQ-005 | Version bump and changelog entry | The README frontmatter version field is bumped from `1.0.0.4` to `1.0.0.5` and `changelog/v1.0.0.5.md` exists with a release note for the rewrite |
| REQ-006 | Validator zero issues | `validate_document.py --type readme` reports zero issues on the rewritten README |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Facts preserved | A section-by-section diff against the current README shows every fact either kept or explicitly superseded in the rewrite |
| REQ-008 | Out-of-scope guard | `git status` shows only the README, the changelog entry and this phase's docs, with no SKILL.md, sibling README, template or vault file modified |
| REQ-009 | Phase closeout | `validate.sh` on this phase folder reports zero errors and phase metadata is regenerated per the packet closeout rules |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The sk-code-opencode README opens with a one-line pitch and a problem-first OVERVIEW and reads as a narrative, not a reference card.
- **SC-002**: The rewritten README passes `validate_document.py --type readme` with zero issues, carries the bumped version field `1.0.0.5` and has the changelog entry.
- **SC-003**: Every fact from the old README survives in the rewrite, confirmed by a section-by-section diff.
- **SC-004**: The HVR grep returns zero em dashes, zero semicolons and zero Oxford comma patterns in the rewritten README body.
- **SC-005**: No SKILL.md, sibling README, template or vault file is touched.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Refined README template (phase 001) | Rewrite may diverge from the fleet standard | Follow the template section model and the mcp-obsidian exemplar flow |
| Dependency | mcp-obsidian exemplar (phase 013) | Verify-only phase may drift from the final standard | Read the exemplar at execution time and treat it as the shape reference |
| Dependency | Version and changelog conventions | Bump mismatch breaks the release audit | Record the current version `1.0.0.4` and follow the `changelog/v<version>.md` naming |
| Risk | HVR violations accumulate in a large rewrite | Voice check fails | Scripted grep gates in the verification phase |
| Risk | Fact loss during restructure | Users lose documented guidance | Section-by-section diff against the old README |
| Risk | Scope drift into SKILL.md or sibling docs | Out-of-scope files change | Scope guard in verification with a `git status` review |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
