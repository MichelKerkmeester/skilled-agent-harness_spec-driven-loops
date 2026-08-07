---
title: "Feature Specification: Phase 038 deep-research mode skill README revisit"
description: "Rewrite the deep-research mode skill README at system-deep-loop/deep-research/README.md against the refined README template from phase 001 and the mcp-obsidian exemplar, with a version bump, a changelog entry and full validation."
trigger_phrases:
  - "deep research readme"
  - "deep-research readme revisit"
  - "deep research readme rewrite"
  - "system-deep-loop readme"
  - "mode readme revisit deep research"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/038-deep-research"
    last_updated_at: "2026-08-04T18:47:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 038 docs (spec, plan, tasks, checklist) inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute phase 038 work: rewrite the deep-research README purpose-first per the refined template"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-research/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/038-deep-research"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Phase 038 deep-research mode skill README revisit

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
| **Predecessor** | `037-deep-improvement` |
| **Successor** | `039-deep-review` |
| **Handoff Criteria** | The deep-research README is purpose-first on the refined template with a one-line pitch and a problem-first OVERVIEW, every fact is preserved, the HVR grep is clean, the version is bumped with a changelog entry, the validator reports zero issues and this phase folder validates with zero errors |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The deep-research mode skill README at `.opencode/skills/system-deep-loop/deep-research/README.md` predates the mcp-obsidian pilot standard. It opens with a reference-card AT A GLANCE table and keeps tabular FAQ, TROUBLESHOOTING and RELATED DOCUMENTS blocks that the pilot standard replaces with narrative purpose-first prose. It does not follow the refined README template from phase 001 (`.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`), so the fleet standard is not applied to one of the busiest deep-loop skills.

### Purpose
Rewrite the deep-research README against the refined template and the mcp-obsidian exemplar (`.opencode/skills/mcp-tooling/mcp-obsidian/README.md`). The rewrite leads with a one-line pitch and a problem-first OVERVIEW, carries every fact from the current document into the new shape, bumps the version field and adds a changelog entry, then passes the sk-doc README validator and the HVR grep.

**End goal:** a deep-research README that matches the pilot standard, validates with zero issues and keeps every operator fact intact.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read the current README and record a baseline: version field value, validator output and link state.
- Rewrite the README purpose-first per the refined template with a one-line pitch and a problem-first OVERVIEW.
- Bump the version field in the README frontmatter and add a changelog entry.
- Validate the rewritten README and this phase folder.

### Out of Scope
- SKILL.md content and the smart router.
- Other skills' READMEs, including the sibling deep-loop READMEs.
- The refined template and the mcp-obsidian exemplar (read-only evidence).
- Vault files, feature-catalog content, manual-testing-playbook content and behavior-benchmark content.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/deep-research/README.md` | Rewrite | Purpose-first README per the refined template with a one-line pitch and a problem-first OVERVIEW |
| `.opencode/skills/system-deep-loop/deep-research/changelog/v1.15.0.0.md` | Add | Changelog entry for the README revision |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/038-deep-research/spec.md` | Create | Phase specification (this file) |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/038-deep-research/plan.md` | Create | Phase implementation plan |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/038-deep-research/tasks.md` | Create | Phase task list |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/038-deep-research/checklist.md` | Create | Phase verification checklist |

Read-only references: the refined template and the mcp-obsidian README are evidence for the rewrite, never writable in this phase.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Template readiness gate | The refined template exists at `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md` and the mcp-obsidian exemplar is read before the rewrite starts |
| REQ-002 | Baseline inventory | The current README is read and its version field, validator output and link state are recorded before any rewrite |
| REQ-003 | Purpose-first rewrite | The README leads with a one-line pitch and a problem-first OVERVIEW per the refined template |
| REQ-004 | Human Voice Rules | The HVR grep returns zero em dashes, zero semicolons and zero Oxford commas in the rewritten README |
| REQ-005 | Version and changelog | The version field is bumped and a changelog entry exists at `changelog/v1.15.0.0.md` |
| REQ-006 | Validation | `validate_document.py --type readme` reports zero issues on the rewritten README |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Facts preserved | A section-by-section diff shows every fact from the current README present in the rewrite |
| REQ-008 | Out-of-scope guard | No SKILL.md content, template, sibling README or vault file is modified |
| REQ-009 | Phase closeout | `validate.sh` reports zero errors on this phase folder and the phase metadata is regenerated |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The README is purpose-first on the refined template with a one-line pitch and a problem-first OVERVIEW.
- **SC-002**: Every fact from the current README survives the rewrite.
- **SC-003**: The README validates with zero issues, passes the HVR grep, resolves all links and carries a bumped version with a changelog entry.
- **SC-004**: This phase folder validates with zero errors and the closeout metadata is regenerated.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Refined README template (phase 001) | Rewrite may diverge from the family standard | Read the template and the exemplar before drafting |
| Dependency | mcp-obsidian exemplar | Rewrite may miss pilot lessons | Mirror the exemplar pitch and OVERVIEW pattern |
| Risk | Fact loss in the rewrite | Operators lose recovery and state guidance | REQ-007 gates a section-by-section diff |
| Risk | HVR violations in a large rewrite | Voice gate fails late | REQ-004 gates the HVR grep before completion |
| Risk | Link breakage after the reshape | Navigation breaks for operators | The link guard runs over the rewritten README |
| Risk | Changelog drift | Release without an entry | REQ-005 gates the entry presence |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
