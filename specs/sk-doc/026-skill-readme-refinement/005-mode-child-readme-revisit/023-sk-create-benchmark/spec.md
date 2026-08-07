---
title: "Feature Specification: Phase 023 sk-create-benchmark README revisit"
description: "Rewrite the sk-create-benchmark skill README against the refined template from phase 001 and the mcp-obsidian exemplar: purpose-first structure with a one-line pitch and problem-first OVERVIEW, version bump, changelog entry, HVR and validator gates."
trigger_phrases:
  - "create-benchmark readme"
  - "benchmark skill readme revisit"
  - "sk-create-benchmark readme"
  - "benchmark readme rewrite"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/023-sk-create-benchmark"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 023 docs (spec, plan, tasks, checklist) inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute phase 023 work: rewrite sk-create-benchmark README.md per the refined template"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-benchmark/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/023-sk-create-benchmark"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Phase 023 sk-create-benchmark README revisit

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
| **Predecessor** | `022-sk-create-agent` |
| **Successor** | `024-sk-create-changelog` |
| **Handoff Criteria** | The sk-create-benchmark README is rewritten purpose-first on the refined template with a one-line pitch and a problem-first OVERVIEW, the version field is bumped with a changelog entry, the README validates with zero issues, the HVR grep is clean and this phase folder validates with zero errors |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The skill README at `.opencode/skills/sk-doc/sk-create-benchmark/README.md` predates the pilot standard. It still carries the older tabular reference-card style in its middle sections: AT A GLANCE, the six-family table, the troubleshooting table, the FAQ table and the related-documents table. The refined template from phase 001 and the mcp-obsidian exemplar define the target shape: a narrative, purpose-first document that opens with a one-line pitch and a problem-first OVERVIEW. The README also carries a stale version story, the frontmatter version field reads 1.0.0.0 while the changelog folder already reaches v1.4.0.0, so the rewrite must resync the field with the changelog.

### Purpose
Rewrite `.opencode/skills/sk-doc/sk-create-benchmark/README.md` purpose-first per the refined template and the mcp-obsidian exemplar, bump the version field, add the changelog entry, then validate the result with the sk-doc README validator and the HVR grep.

**End goal:** a narrative, purpose-first README that opens with a one-line pitch and a problem-first OVERVIEW, keeps every fact the current README carries, passes the validator and the HVR grep, then reports a version that matches the changelog.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read the current README and record the baseline: version field, validator output, link state.
- Rewrite `.opencode/skills/sk-doc/sk-create-benchmark/README.md` purpose-first per the refined template from phase 001 and the mcp-obsidian exemplar.
- Bump the frontmatter version field and add the changelog entry.
- Validate the rewritten README and this phase's documentation set.
- Write this phase's own docs (spec, plan, tasks, checklist).

### Out of Scope
- SKILL.md content and the family router behavior.
- Other skills' READMEs, owned by their own child phases under 005-mode-child-readme-revisit.
- The benchmark templates under `assets/` and the guides under `references/`.
- Vault files and any benchmark output artifacts under `mcp-server/benchmarks/`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/sk-create-benchmark/README.md` | Rewrite | Purpose-first rewrite per the refined template: pitch blockquote, problem-first OVERVIEW, narrative capability sections, VERIFICATION and RELATED DOCUMENTS |
| `.opencode/skills/sk-doc/sk-create-benchmark/changelog/v1.5.0.0.md` | Add | Changelog entry for the README rewrite and version bump |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/023-sk-create-benchmark/spec.md` | Create | Phase specification (this file) |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/023-sk-create-benchmark/plan.md` | Create | Phase implementation plan |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/023-sk-create-benchmark/tasks.md` | Create | Phase task list |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/023-sk-create-benchmark/checklist.md` | Create | Phase verification checklist |

Read-only references: the refined template `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md` and the mcp-obsidian exemplar `.opencode/skills/mcp-tooling/mcp-obsidian/README.md` are evidence for the rewrite, never writable in this phase.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Template readiness gate | The refined README template from phase 001 and the mcp-obsidian exemplar are read before the rewrite starts and their section models recorded |
| REQ-002 | Baseline inventory | The current README is read and the version field, validator output and link state recorded before any edit |
| REQ-003 | Purpose-first rewrite | The rewritten README opens with a one-line pitch and a problem-first OVERVIEW that states the reader's situation before any feature list |
| REQ-004 | HVR grep clean | A grep of the rewritten README returns zero em dashes, zero semicolons and zero Oxford commas |
| REQ-005 | Version bump plus changelog entry | The frontmatter version field reads 1.5.0.0 and `changelog/v1.5.0.0.md` exists with an entry describing the rewrite |
| REQ-006 | Validator zero issues | `validate_document.py --type readme` reports zero issues on the rewritten README |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Facts preserved | A section-by-section diff shows every fact from the old README carried into the rewrite or consciously dropped with a note |
| REQ-008 | Out-of-scope guard | `git diff` shows changes only in the README, the changelog entry and this phase's docs |
| REQ-009 | Phase closeout | `validate.sh` on this phase folder returns zero errors and the phase metadata is regenerated |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The README opens purpose-first with a one-line pitch and a problem-first OVERVIEW on the refined template.
- **SC-002**: The README passes `validate_document.py --type readme` with zero issues and the HVR grep is clean.
- **SC-003**: The version field and the changelog agree at 1.5.0.0 with an entry present.
- **SC-004**: No SKILL.md, template, vault file or sibling skill README is modified.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Refined standalone README template (phase 001) | Rewrite may drift from the standard | Follow the template section model and the exemplar structure |
| Dependency | mcp-obsidian exemplar | The exemplar shape may not map to a benchmark skill | Read the exemplar and adapt only the earning sections |
| Risk | HVR violations in a long rewrite | Voice grep fails | Scripted `rg -n` gates before closeout |
| Risk | Changelog drift | Version field and changelog disagree again | REQ-005 ties the field and the entry together |
| Risk | Validator availability | Validation gate unavailable | Run the validator and record output in the checklist |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
