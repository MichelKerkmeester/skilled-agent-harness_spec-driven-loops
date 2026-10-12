---
title: "Feature Specification: Doc version and playbook paths"
description: "Phase parent for three build phases: every skill doc carries its own version again, raised automatically, every unresolved backticked playbook path is corrected or explained, and root playbook files are checked too."
trigger_phrases:
  - "doc version and playbook paths phase parent spec"
  - "doc version and playbook paths"
  - "per doc versions and playbook path repair"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths"
    last_updated_at: "2026-10-12T12:00:00Z"
    last_updated_by: "integrator"
    recent_action: "Integrated both children and raised the repaired docs"
    next_safe_action: "Operator review of the integration branch, then merge to main"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-022-parent"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Doc version and playbook paths

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-10-12 |
| **Branch** | `worktrees/117-docver-scaffold` (scaffold); each child builds in its own worktree branched from the scaffold commit |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | sk-code/011-sk-code-poinytail-based-refinement |
| **Predecessor** | 021-open-ends-remediation |
| **Successor** | None |
| **Handoff Criteria** | Every child goal's criteria pass and recursive strict validation passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase `021-open-ends-remediation/003-doc-and-catalog-truth` kept `version` on `SKILL.md` only and removed the line from 2,845 child docs in commit 31888d05bb. On 2026-10-12 the operator decided the opposite: every doc carries its own version, as that doc's own edition. Separately, the playbook validator that phase built prints 258 `BACKTICK_PATH_UNRESOLVED` warnings from 113 distinct paths across 28 playbook packages at the scaffold commit, and none of them has been corrected.

### Purpose
Restore a per-doc version that is raised automatically whenever a doc's content changes, and correct or explain every unresolved backticked playbook path, across two phases that two builders can run in parallel.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- 001: the per-doc version contract, its engine, a pre-commit auto-bump, a pull-request check, the template seeds and the restore of the removed lines, 8 ledger rows.
- 002: every `BACKTICK_PATH_UNRESOLVED` warning the playbook validator prints, one ledger row per playbook package plus a validator row, 29 ledger rows.
- 003: the validator checks root playbook files too, the 70 root warnings that finds, and six stale references 002 left as found, 20 ledger rows.

### Out of Scope
- Making the backticked path warnings blocking. They stay report-only, as decision D2 of `021-open-ends-remediation/003-doc-and-catalog-truth/goal.md` says.
- Hand-editing doc versions in 002. The integrator runs 001's bump over 002's changed docs after both merge.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs`, `frontmatter-versioning.md`, `.skilled/scripts/git-hooks/pre-commit`, a workflow under `.github/workflows/`, sk-doc templates, child docs under `.skilled/skills/` | Modify | 001 | Per-doc version contract, auto-bump and restore |
| Playbook scenario files under `.skilled/skills/*/manual-testing-playbook/` and, only if needed, `validate-playbook-package.cjs` | Modify | 002 | Backticked path repair |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-per-doc-versions/ | Every skill doc carries its own 4-part version, raised by the pre-commit hook and checked on pull requests; the removed lines restored | Complete |
| 2 | 002-playbook-path-repair/ | Every unresolved backticked playbook path corrected, removed or rewritten, or listed with its reason | Complete |
| 3 | 003-playbook-root-and-stale-refs/ | The validator checks root playbook files too, their unresolved paths corrected or explained, and six stale references fixed | In Progress |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-per-doc-versions | 002-playbook-path-repair | None for the build; the two children are independent and build in parallel. After both merge, the integrator runs 001's bump over the docs 002 changed | Each child's goal criteria |
| 002-playbook-path-repair | 003-playbook-root-and-stale-refs | 002 merged on main; 003 builds from origin/main in its own worktree | 003 `goal.md` criteria |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None blocking. Each child's questions are in its own spec.md.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Predecessor**: See `../021-open-ends-remediation/003-doc-and-catalog-truth/` for the change this packet reverses in part
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
