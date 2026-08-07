---
title: "Feature Specification: Phase 1 cli-external-orchestration README rewrite"
description: "Rewrite the skill README at .opencode/skills/cli-external-orchestration/README.md against the refined standalone README template with the mcp-obsidian exemplar as the reference shape, purpose-first with HVR enforcement, a version bump and a changelog entry."
trigger_phrases:
  - "cli external orchestration readme"
  - "cli-external-orchestration readme rewrite"
  - "hub readme revisit"
  - "external cli dispatch readme"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/001-cli-external-orchestration"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 1 docs (spec, plan, tasks, checklist) inside 004-standalone-readme-revisit"
    next_safe_action: "Execute phase 1 work: rewrite the cli-external-orchestration README against the refined template"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/README.md"
      - ".opencode/skills/cli-external-orchestration/changelog/v1.3.0.0.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/001-cli-external-orchestration"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Phase 1 cli-external-orchestration README rewrite

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
| **Predecessor** | `003-creation-workflow-update` |
| **Successor** | `002-mcp-code-mode` |
| **Handoff Criteria** | The cli-external-orchestration README is purpose-first on the refined template with a one-line pitch and a problem-first OVERVIEW, HVR clean, versioned at 1.3.0.0 with a changelog entry, validated with zero issues and this phase folder validates with zero errors |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The cli-external-orchestration README still carries the older tabular reference-card style: a dense AT A GLANCE table, a feature-heavy pitch blockquote and numbered sections that read as an inventory of dispatch surfaces. It predates the pilot standard set by the mcp-obsidian README and the refined standalone template from phase 001. A reader must reverse-engineer what the hub is for before the README says it. The hub dispatches external CLI tools (codex, opencode, pi, claude-code, cursor and devin) as executors under deep-loop workflows. The README should open with that outcome, not with a routing table.

### Purpose
Rewrite `.opencode/skills/cli-external-orchestration/README.md` against the refined template at `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md` with the mcp-obsidian README as the reference shape. The rewrite is purpose-first: a one-line pitch blockquote, a problem-first OVERVIEW and the six mode pointers preserved as facts. The version field moves from 1.2.0.0 to 1.3.0.0 and a changelog entry lands at `changelog/v1.3.0.0.md`.

**End goal:** the cli-external-orchestration README reads as a purpose-first document on the pilot standard, HVR clean and validator clean, with no dispatch fact lost.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read the current README in full and record the baseline: version field, validator output and link state.
- Rewrite `.opencode/skills/cli-external-orchestration/README.md` purpose-first per the refined standalone template.
- Bump the frontmatter `version` field from 1.2.0.0 to 1.3.0.0.
- Add `changelog/v1.3.0.0.md` with a titled entry for the rewrite.
- Validate the rewrite: `validate_document.py --type readme`, the HVR grep, the link guard, `git diff --check` and `validate.sh` on this phase folder.
- Write this phase's own documentation set (spec, plan, tasks, checklist).

### Out of Scope
- Edits to `SKILL.md` content of cli-external-orchestration or any nested mode packet.
- Rewrites of other skills' READMEs (owned by sibling phases 002-011).
- Edits to templates under `.opencode/skills/sk-doc/sk-create-skill/assets/` (owned by phase 001).
- Edits to `mode-registry.json`, `hub-router.json`, `leaf-manifest.json` or `graph-metadata.json`.
- Edits to vault, benchmark, feature-catalog or manual-testing-playbook files.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/cli-external-orchestration/README.md` | Rewrite | Purpose-first README per the refined template with one-line pitch, problem-first OVERVIEW, six mode pointers and routing facts preserved |
| `.opencode/skills/cli-external-orchestration/changelog/v1.3.0.0.md` | Add | Changelog entry covering the README rewrite |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/001-cli-external-orchestration/spec.md` | Create | Phase specification (this file) |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/001-cli-external-orchestration/plan.md` | Create | Phase implementation plan |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/001-cli-external-orchestration/tasks.md` | Create | Phase task list |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/001-cli-external-orchestration/checklist.md` | Create | Phase verification checklist |

Read-only references: the current README, the refined template and the mcp-obsidian README are evidence for the rewrite, never writable beyond the README path listed above.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Template readiness gate passes before the rewrite starts | `ls` shows `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md` with a non-empty template body |
| REQ-002 | Current README inventoried with a recorded baseline | The baseline captures the version field (`version: 1.2.0.0`), the `validate_document.py` output on the current file and the relative link state, recorded as T001 evidence in tasks.md |
| REQ-003 | README rewritten purpose-first per the refined template | The README opens with a one-line pitch blockquote and the OVERVIEW states the reader's problem before any feature list |
| REQ-004 | HVR grep clean on the rewritten README | `rg -n` returns zero em dashes, zero semicolons and zero Oxford commas in the README body |
| REQ-005 | Version bump and changelog entry land together | `grep '^version:'` on the README shows `1.3.0.0` and `ls` shows `changelog/v1.3.0.0.md` with a titled entry |
| REQ-006 | Validator reports zero issues on the rewritten README | `validate_document.py --type readme` exits clean with a zero issue count on `.opencode/skills/cli-external-orchestration/README.md` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Facts preserved through a section-by-section diff | A diff of the old README against the new README shows all six mode pointers (cli-opencode, cli-claude-code, cli-codex, cli-cursor, cli-devin and cli-pi) and the routing facts (mode-registry.json and hub-router.json usage, tieBreak order, defaultMode) survive |
| REQ-008 | Out-of-scope guard holds | `git diff --stat` lists only the README, the changelog entry and this phase's docs. No SKILL.md, template, registry, manifest or vault file appears |
| REQ-009 | Phase closeout validates | `validate.sh` on this phase folder returns zero errors and the phase metadata is regenerated |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The rewritten README opens with a one-line pitch and a problem-first OVERVIEW, readable without consulting the old reference-card tables.
- **SC-002**: All six mode pointers and the routing facts survive the rewrite with no dispatch fact lost.
- **SC-003**: The rewritten README passes `validate_document.py --type readme` with zero issues, the HVR grep and the link guard.
- **SC-004**: The version field reads 1.3.0.0, `changelog/v1.3.0.0.md` exists and this phase folder validates with zero errors.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Refined standalone README template (phase 001) | Rewrite may diverge from the template | Read the template before drafting and mirror its section model |
| Dependency | mcp-obsidian README exemplar | Reference shape may drift from the pilot standard | Read the exemplar before drafting and keep its pitch and OVERVIEW pattern |
| Risk | Facts lost during the narrative rewrite | Dispatch behavior claims disappear | Section-by-section diff of old vs new README before the rewrite lands |
| Risk | HVR violations accumulate in a large rewrite | Voice check fails at verification | Scripted `rg -n` grep for em dashes, semicolons and Oxford commas |
| Risk | Version and changelog mismatch | Frontmatter gate fails at closeout | REQ-005 gates both with explicit greps and an `ls` check |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
