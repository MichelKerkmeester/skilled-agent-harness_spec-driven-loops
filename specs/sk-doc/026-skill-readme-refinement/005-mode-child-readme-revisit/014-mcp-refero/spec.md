---
title: "Feature Specification: Phase 014 mcp-refero README rewrite"
description: "Rewrite the mcp-refero mode skill README at .opencode/skills/mcp-tooling/mcp-refero/README.md on the refined standalone README template with a purpose-first structure, HVR enforcement, a version bump and a changelog entry."
trigger_phrases:
  - "refero readme rewrite"
  - "mcp refero readme"
  - "refero readme revisit"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/014-mcp-refero"
    last_updated_at: "2026-08-04T14:09:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 014 docs (spec, plan, tasks and checklist) inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute phase 014 work: rewrite the mcp-refero README on the refined template"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/mcp-refero/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/014-mcp-refero"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Phase 014 mcp-refero README rewrite

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
| **Predecessor** | `013-mcp-obsidian` |
| **Successor** | `015-sk-code-opencode` |
| **Handoff Criteria** | The mcp-refero README is purpose-first on the refined template with a one-line pitch and a problem-first OVERVIEW, HVR clean, versioned at 1.1.0.0 with a changelog entry, zero validator issues and zero phase validation errors |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The mcp-refero skill README at `.opencode/skills/mcp-tooling/mcp-refero/README.md` still carries the older tabular reference-card style and predates the pilot standard set by the refined template (phase 001) and the mcp-obsidian exemplar. It is also factually stale: its VERIFICATION section documents a SKILL.md version of 1.1.0.0 while the packet actually carries 1.0.0.0. Its frontmatter version field has never moved off 1.0.0.0. The document leads with reference tables where the pilot standard wants a pitch and a problem-first OVERVIEW.

### Purpose
Rewrite the README purpose-first on the refined template so any agent opening the packet meets the outcome before the tooling: the one-line pitch, the problem-first OVERVIEW, the HVR-clean prose, the aligned version field and the changelog entry.

**End goal:** a README that matches the pilot standard, passes the validator with zero issues and carries version 1.1.0.0 with a changelog entry.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read the current README and record the baseline: version field, validator output and link state.
- Rewrite the README purpose-first on the refined template with a one-line pitch and a problem-first OVERVIEW.
- Bump the README version field to 1.1.0.0.
- Add the changelog entry at `changelog/v1.1.0.0.md`.
- Validate the README with the sk-doc validator, the HVR grep and the link guard.
- Write this phase's own documentation set (spec, plan, tasks and checklist).

### Out of Scope
- Edits to the mcp-refero SKILL.md or any packet reference, asset, script or example file.
- Edits to the refined template (owned by phase 001) or any other skill README in the fleet.
- Edits to the mcp-obsidian exemplar README (verify-only, owned by phase 013).
- Vault, plugin, registry, manifest or runtime data of any kind.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-tooling/mcp-refero/README.md` | Rewrite | Purpose-first README on the refined template: pitch blockquote, problem-first OVERVIEW, HVR-clean prose, version 1.1.0.0 |
| `.opencode/skills/mcp-tooling/mcp-refero/changelog/v1.1.0.0.md` | Add | Changelog entry for the README rewrite |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/014-mcp-refero/spec.md` | Create | Phase specification (this file) |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/014-mcp-refero/plan.md` | Create | Phase implementation plan |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/014-mcp-refero/tasks.md` | Create | Phase task list |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/014-mcp-refero/checklist.md` | Create | Phase verification checklist |

Read-only references: the refined template, the mcp-obsidian exemplar README and the mcp-refero SKILL.md are evidence for the rewrite, never writable in this phase.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Template readiness gate | The refined template exists at `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md` before authoring starts. `ls` shows the file |
| REQ-002 | Inventory baseline | The current README is read and its version field, validator output and link state are recorded before rewriting |
| REQ-003 | Purpose-first rewrite | The README is rewritten on the refined template with a one-line pitch and a problem-first OVERVIEW before any reference material |
| REQ-004 | HVR clean | A grep of the rewritten README returns zero em dashes, zero semicolons and zero Oxford commas |
| REQ-005 | Version bump plus changelog entry | The README version field reads 1.1.0.0 and `changelog/v1.1.0.0.md` exists with the rewrite entry |
| REQ-006 | Validator zero issues | `validate_document.py --type readme` reports zero issues on the rewritten README |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Facts preserved | A section-by-section diff of the old and the new README confirms every factual claim survives (eight-tool surface, doubled-prefix callable, plan gating, auth posture) |
| REQ-008 | Out-of-scope guard | No SKILL.md, template, sibling README or vault file is modified. `git status` shows only the README, the changelog entry and the phase docs |
| REQ-009 | Phase closeout | `validate.sh` reports zero errors on this phase folder and the phase metadata is regenerated |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The README opens with a one-line pitch and a problem-first OVERVIEW on the refined template.
- **SC-002**: The README passes the validator with zero issues and carries version 1.1.0.0 with a changelog entry.
- **SC-003**: The HVR grep returns zero em dashes, zero semicolons and zero Oxford commas in the README.
- **SC-004**: No out-of-scope file changed and the phase folder validates with zero errors.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Refined standalone README template (phase 001) | Rewrite may drift from the pilot standard | Follow the template section model and the required-section rule |
| Dependency | mcp-obsidian exemplar README (phase 013) | Rewrite may miss the pilot structure | Read the exemplar before drafting |
| Risk | Factual drift during the rewrite | The eight-tool contract and the doubled-prefix rule could be lost | REQ-007 gates the section-by-section diff |
| Risk | HVR violations accumulate in the rewrite | Voice check fails | REQ-004 gates the scripted grep |
| Risk | Changelog discipline drifts | Release without an entry | REQ-005 requires the entry |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
