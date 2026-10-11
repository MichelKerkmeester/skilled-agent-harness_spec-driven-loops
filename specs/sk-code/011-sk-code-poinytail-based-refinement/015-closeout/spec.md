---
title: "Feature Specification: Epic closeout"
description: "Phase parent that closes every item the sk-code refinement epic left open: each one ends fixed with proof, or closed with a written reason where a fix would be overengineering."
trigger_phrases:
  - "epic closeout"
  - "sk-code refinement closeout"
  - "leave nothing open"
  - "open items ledger"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/015-closeout"
    last_updated_at: "2026-10-11T05:00:00Z"
    last_updated_by: "closeout-orchestrator"
    recent_action: "Planned nine phases grouped by file ownership"
    next_safe_action: "Build the phases in order and commit one per phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "co-015-phase-parent"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Epic closeout

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-10-11 |
| **Branch** | `worktrees/098-post-092-integration` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | sk-code/011-sk-code-poinytail-based-refinement |
| **Predecessor** | 014-skill-authoring-ux-research |
| **Successor** | None |
| **Handoff Criteria** | Every child goal's criteria pass and recursive strict validation passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The epic's phases 012 to 014 and the feature-catalog track each closed with items marked deferred, handed off or left to the master orchestrator. Those items sit in Known Limitations sections, research deferrals and stale goal criteria, so nobody can tell from the tree which of them still matter.

### Purpose
End every open item in one of two states: fixed, with a check that ran, or closed, with a written reason that a fix would break the repository's overengineering rule.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The twelve items the master orchestrator listed, and every open item in the Known Limitations of the 012, 013, 014 and 066 trees.
- Every completed goal criterion in the 011 and 066 trees, rerun against today's tree.

### Out of Scope
- Pushing or merging the branch.
- The main checkout and the track worktrees 093 to 096.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.skilled/skills/sk-code/SKILL.md` and its version carriers | Modify | 001-sk-code-hub-voice | Human-voice rewrite of the 36 HVR hard blockers |
| Goal files in the 011 and 066 trees | Modify | 002-goal-criteria-refresh | Criteria updated to current names, counts and versions |
| sk-git `changelog/v1.8.4.0.md` | Modify | 003-sk-git-playbook-changelog | Changelog line for the playbook change |
| `.skilled/hooks/vitest.config.ts`, `dispatch/lib/dispatch-audit.mjs` and its test | Modify | 004-dispatch-guard-and-vitest | Vitest exit 0 and escaped-quote payloads |
| spec-kit `hook-stdin-deadline.test.mjs` and hooks README | Modify | 005-stdin-late-write-coverage | Late-write case for every short-deadline entry |
| `.skilled/bin/compiled-route-sync.cjs` and its test | Modify | 006-compiled-route-content-check | `--check` compares authored files with served copies |
| deep-loop runtime `reduce-state.cjs` and its test | Modify | 007-review-reducer-missing-config | Lenient reduction of a review folder with no config |
| Advisor scorer data, OpenCode advisor plugin | Modify | 008-advisor-residuals-and-surface-hint | Battery misses and surface-hint callers |
| Ledger docs and the small fixes it names | Modify | 009-open-items-ledger | Every remaining open item fixed or closed |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-sk-code-hub-voice/ | Rewrite the 36 HVR hard blockers in the sk-code hub SKILL.md | Complete |
| 2 | 002-goal-criteria-refresh/ | Rerun every completed goal criterion in the 011 and 066 trees and update the stale ones | Complete |
| 3 | 003-sk-git-playbook-changelog/ | Record the sk-git playbook change in its changelog | Complete |
| 4 | 004-dispatch-guard-and-vitest/ | Keep the node:test file out of the hooks vitest run and read escaped quotes in a `-c` payload | Complete |
| 5 | 005-stdin-late-write-coverage/ | Drive every short-deadline hook entry with a late write and record the residual risk | Pending |
| 6 | 006-compiled-route-content-check/ | Make `compiled-route-sync.cjs --check` fail on a served copy that differs from its authored file | Pending |
| 7 | 007-review-reducer-missing-config/ | Reduce the 43 review folders that have no config file | Pending |
| 8 | 008-advisor-residuals-and-surface-hint/ | Investigate the battery misses and wire the surface hint where a caller can know it | Pending |
| 9 | 009-open-items-ledger/ | Fix or close every other open item, with the reason recorded | Pending |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-sk-code-hub-voice | 002-goal-criteria-refresh | 001 committed with its goal criteria passing | `validate.sh --strict` on 001 |
| 002-goal-criteria-refresh | 003-sk-git-playbook-changelog | 002 committed with its goal criteria passing | `validate.sh --strict` on 002 |
| 003-sk-git-playbook-changelog | 004-dispatch-guard-and-vitest | 003 committed with its goal criteria passing | `validate.sh --strict` on 003 |
| 004-dispatch-guard-and-vitest | 005-stdin-late-write-coverage | 004 committed with its goal criteria passing | `validate.sh --strict` on 004 |
| 005-stdin-late-write-coverage | 006-compiled-route-content-check | 005 committed with its goal criteria passing | `validate.sh --strict` on 005 |
| 006-compiled-route-content-check | 007-review-reducer-missing-config | 006 committed with its goal criteria passing | `validate.sh --strict` on 006 |
| 007-review-reducer-missing-config | 008-advisor-residuals-and-surface-hint | 007 committed with its goal criteria passing | `validate.sh --strict` on 007 |
| 008-advisor-residuals-and-surface-hint | 009-open-items-ledger | 008 committed with its goal criteria passing | `validate.sh --strict` on 008 |
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
