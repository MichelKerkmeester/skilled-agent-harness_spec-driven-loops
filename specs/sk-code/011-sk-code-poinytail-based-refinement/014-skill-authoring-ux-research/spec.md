---
title: "Feature Specification: Skill authoring UX research and remediation"
description: "Phase parent that researches why the 092 skill-authoring errors happen inside sk-create-skill and system-skill-advisor, then remediates every finding with small changes that stop the errors where the author works."
trigger_phrases:
  - "skill authoring ux research"
  - "skill authoring remediation"
  - "sk-create-skill authoring errors"
  - "skill advisor routing ux"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/014-skill-authoring-ux-research"
    last_updated_at: "2026-10-10T20:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Made the research packet a phase parent and planned the remediation phases"
    next_safe_action: "Build phase 002, then each later phase in order"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "t3-014-phase-parent"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Skill authoring UX research and remediation

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-10-10 |
| **Branch** | `worktrees/095-skill-authoring-ux-research` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | sk-code/011-sk-code-poinytail-based-refinement |
| **Predecessor** | 011-round-four-remediation |
| **Successor** | None |
| **Handoff Criteria** | Every child goal's criteria pass and recursive strict validation passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sk-code refinement epic kept hitting the same skill-authoring errors: generated artifacts drifting from their sources, a hub version carried in six files with a changelog number that collided at merge, advisor routes pulled off course by named files and generic words, a surface hint the advisor never passes, and doctor checks that fire only after a change lands. Phase 001 traced each error to a root cause inside sk-create-skill, system-skill-advisor and the hooks and workflows around them.

### Purpose
Fix every finding from phase 001 with the smallest change that stops the error where the author already works, so maintainers and external skill authors can no longer make the 092 class of errors by accident.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The research in phase 001 and its seven ranked recommendations.
- The live defects phase 001 found: the failing router intent-signal check, the stale compiled skill graph and the failing advisor battery.
- The 011 parent goal, which this packet pushed over its 4,000-character budget.

### Out of Scope
- Document content owned by the parallel feature-catalog track: feature catalog docs, leftover template comments and package-validator findings on existing docs and changelogs. Needed edits there are handed off, not made.
- Pushing or merging the branch.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `../goal.md` | Modify | 002-parent-goal-budget | Cut the 011 parent goal under its budget |
| `003-unread-version-fields/` docs only | Modify | 003-unread-version-fields | Reader search and the recorded decision to drop the removal |
| `.skilled/scripts/git-hooks/pre-commit` and its test | Modify | 004-commit-hook-checks | Run the leaf, doctor and intent-signal checks for a staged hub |
| `.skilled/commands/create/assets/create-changelog-*.yaml` | Modify | 005-changelog-single-bump | One command numbers against upstream and moves every version copy |
| sk-create-skill `SKILL.md`, a maintenance reference, two scripts, its changelog | Modify | 006-create-skill-guidance | Correct the routing-field sentence and sharpen generator messages |
| Advisor `explicit.ts`, `executor-delegation.ts` and tests | Modify | 007-advisor-name-mention-scoring | Stop a named file or path from pulling the route |
| Advisor schema, recommend handler, test, `SKILL.md`, changelog | Modify | 008-advisor-surface-hint | Pass the surface hint to the compiled-route front door |
| cli-classifier graph metadata, compiled skill graph, freshness panel, routing CI job | Modify | 009-advisor-vocabulary-freshness | Clear the two live drifts and make the panel able to fail |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-authoring-ux-research/ | Ten-iteration research into the 092 authoring errors, verified and ranked | Complete |
| 2 | 002-parent-goal-budget/ | Cut the 011 parent goal under its 4,000-character budget without dropping a criterion | Complete |
| 3 | 003-unread-version-fields/ | Run the full reader search for the hub JSON version copies and record why removing them is dropped | Complete |
| 4 | 004-commit-hook-checks/ | Run the leaf-manifest, doctor and intent-signal checks for a staged skill at commit, and say when gates are skipped | Complete |
| 5 | 005-changelog-single-bump/ | Make the changelog workflow the one bump command: number against upstream and move every version copy | Complete |
| 6 | 006-create-skill-guidance/ | Correct the routing-field sentence, name every version carrier, and sharpen two generator messages | Complete |
| 7 | 007-advisor-name-mention-scoring/ | Stop a named file, path or generic word from pulling the advisor route | Complete |
| 8 | 008-advisor-surface-hint/ | Let advisor_recommend pass a surface hint to the compiled-route front door | Complete |
| 9 | 009-advisor-vocabulary-freshness/ | Clear the failing intent-signal carry and the stale compiled graph, and let the freshness panel fail in CI | Planned |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-authoring-ux-research | 002-parent-goal-budget | Research committed with ranked phases | `validate.sh --strict` on 001 |
| 002-parent-goal-budget | 003-unread-version-fields | 002-parent-goal-budget committed with its goal criteria passing | `validate.sh --strict` on 002-parent-goal-budget |
| 003-unread-version-fields | 004-commit-hook-checks | 003-unread-version-fields committed with its goal criteria passing | `validate.sh --strict` on 003-unread-version-fields |
| 004-commit-hook-checks | 005-changelog-single-bump | 004-commit-hook-checks committed with its goal criteria passing | `validate.sh --strict` on 004-commit-hook-checks |
| 005-changelog-single-bump | 006-create-skill-guidance | 005-changelog-single-bump committed with its goal criteria passing | `validate.sh --strict` on 005-changelog-single-bump |
| 006-create-skill-guidance | 007-advisor-name-mention-scoring | 006-create-skill-guidance committed with its goal criteria passing | `validate.sh --strict` on 006-create-skill-guidance |
| 007-advisor-name-mention-scoring | 008-advisor-surface-hint | 007-advisor-name-mention-scoring committed with its goal criteria passing | `validate.sh --strict` on 007-advisor-name-mention-scoring |
| 008-advisor-surface-hint | 009-advisor-vocabulary-freshness | 008-advisor-surface-hint committed with its goal criteria passing | `validate.sh --strict` on 008-advisor-surface-hint |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None. Questions a phase raises are recorded in that phase.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
