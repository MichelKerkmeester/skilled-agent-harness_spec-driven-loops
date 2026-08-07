---
title: "Feature Specification: Phase 029 sk-create-manual-testing-playbook README revisit"
description: "Rewrite the create-manual-testing-playbook skill README against the refined README template from phase 001 and the mcp-obsidian exemplar, with a version bump, a changelog entry and full validation."
trigger_phrases:
  - "manual testing playbook readme"
  - "sk-create-manual-testing-playbook readme"
  - "playbook skill readme revisit"
  - "mode readme revisit"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/029-sk-create-manual-testing-playbook"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 029 docs (spec, plan, tasks, checklist) inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute phase 029 work: rewrite the skill README per tasks.md"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-manual-testing-playbook/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/029-sk-create-manual-testing-playbook"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Phase 029 sk-create-manual-testing-playbook README revisit

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
| **Predecessor** | `028-sk-create-flowchart` |
| **Successor** | `030-sk-create-quality-control` |
| **Handoff Criteria** | The skill README is purpose-first on the refined template with a one-line pitch and a problem-first OVERVIEW, HVR clean, version bumped with a matching changelog entry, validator zero issues and this phase folder validates with zero errors |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The current README at `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/README.md` predates the pilot standard that the mcp-obsidian README set and that phase 001 codified in the refined template. No recorded run of the sk-doc README validator, the HVR grep or the link guard exists against it, so its conformance is unproven and must be established from scratch. Its frontmatter version field reads 1.0.0.0 while the packet changelog already tops at v1.0.1.1, so the document and the release record disagree. A reader cannot trust that the README reflects the pilot standard the way the rest of the fleet is being brought to it.

### Purpose
Rewrite the README on the refined template standard with the mcp-obsidian README as the shape exemplar: a one-line pitch blockquote, an AT A GLANCE table first, a problem-first OVERVIEW, prose-led sections that earn their place, Human Voice Rules throughout, a version bump, a matching changelog entry and zero-issue validation.

**End goal:** a README that a human reads once and knows what the skill delivers, where to start and how to verify it, with the README version field and the packet changelog in agreement.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rewrite `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/README.md` against the refined template and the mcp-obsidian exemplar.
- Preserve every fact from the current README that still holds, verified by a section-by-section diff.
- Bump the README version field above 1.0.0.0 and add a per-release entry with a matching version in the packet changelog folder.
- Write this phase's own documentation set (spec, plan, tasks, checklist).

### Out of Scope
- Edits to `SKILL.md`, templates, references, scripts, corpus files or any asset in the packet.
- Rewrites of any other skill README in the fleet (owned by the sibling phases of 005).
- Edits to the refined template (owned by phase 001) or the creation workflow (owned by phase 003).
- Fleet-wide validation and closeout (owned by phase 006).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/README.md` | Rewrite | Purpose-first README on the refined template: one-line pitch, AT A GLANCE first, problem-first OVERVIEW, prose-led sections, version field bumped |
| `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/changelog/<next-version>.md` | Add | Per-release entry for the README rewrite with the version matching the README field |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/029-sk-create-manual-testing-playbook/spec.md` | Create | Phase specification (this file) |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/029-sk-create-manual-testing-playbook/plan.md` | Create | Phase implementation plan |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/029-sk-create-manual-testing-playbook/tasks.md` | Create | Phase task list |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/029-sk-create-manual-testing-playbook/checklist.md` | Create | Phase verification checklist |

Read-only references: the refined template (`.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`), the mcp-obsidian exemplar README (`.opencode/skills/mcp-tooling/mcp-obsidian/README.md`) and the existing entries in the packet changelog folder are evidence, never writable in this phase.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Template readiness gate passes | `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md` exists, phase 001 is closed and the rewrite starts only after the gate confirms both |
| REQ-002 | Current README is inventoried | The baseline records the version field, the validator output and the link state of the current README before any edit |
| REQ-003 | README rewritten purpose-first | The rewritten README opens with a one-line pitch blockquote and a problem-first OVERVIEW, follows the refined template section model and matches the mcp-obsidian exemplar in prose density and section discipline |
| REQ-004 | HVR grep is clean | A grep of the README body returns zero em dashes, zero semicolons and zero Oxford commas |
| REQ-005 | Version bump plus changelog entry | The README version field is bumped above 1.0.0.0 and a per-release entry with the same version exists in the packet changelog folder |
| REQ-006 | Validator reports zero issues | `validate_document.py --type readme` on the rewritten README returns zero blocking and zero non-blocking issues |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Facts preserved | A section-by-section diff against the pre-rewrite README shows every fact that still holds (paths, commands, validator invocations, related documents) retained |
| REQ-008 | Out-of-scope guard | No SKILL.md, template, reference, script or vault file is modified, confirmed via `git status` |
| REQ-009 | Phase closeout | `validate.sh --strict` on this phase folder returns zero errors and the phase metadata is regenerated |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A reader understands the skill outcome, the start path and the verification commands within one screen.
- **SC-002**: The README passes the README validator, the HVR grep and the link guard with zero issues.
- **SC-003**: The README version field agrees with the new changelog entry and both sit above the pre-rewrite state.
- **SC-004**: The phase changes no file outside the README, the changelog entry and this phase folder.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Refined README template (phase 001) | Rewrite runs against a moving standard | REQ-001 readiness gate blocks the start until phase 001 closes |
| Dependency | mcp-obsidian exemplar | Rewrite drifts from the pilot pattern | Section-by-section comparison against the exemplar in verification |
| Risk | HVR violations in a large rewrite | Voice check fails | Scripted grep gate for em dashes, semicolons and Oxford commas |
| Risk | Fact loss during the rewrite | Commands and paths drop out | REQ-007 section-by-section diff against the pre-rewrite README |
| Risk | Version and changelog drift | README version diverges from the release record | REQ-005 ties the entry version to the README field |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- What is the exact next version number for the rewrite: patch `v1.0.1.2` or minor `v1.0.2.0` above the current changelog top of `v1.0.1.1`?
<!-- /ANCHOR:questions -->
