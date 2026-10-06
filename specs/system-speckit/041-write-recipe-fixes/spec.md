---
title: "Feature Specification: Write recipe fixes: backfill flag, commit step, workspace bullet, post-checks and verification gate"
description: "The spec folder write recipe matches the commit hook, sk-git and a shared tree."
trigger_phrases:
  - "write recipe fixes"
  - "spec folder write recipe"
  - "write recipe commit step"
  - "write recipe verification gate"
  - "graph metadata backfill command"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/041-write-recipe-fixes"
    last_updated_at: "2026-10-06T19:00:00Z"
    last_updated_by: "claude"
    recent_action: "Group the 5 packets under one phase parent"
    next_safe_action: "Plan or resume a child phase folder"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Write recipe fixes: backfill flag, commit step, workspace bullet, post-checks and verification gate

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-29 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | None, track root `specs/system-speckit/` |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Every child validates strict at its slot, every live reference points at the child path and the timeline names each packet's first and last commit |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The spec folder write recipe is the checklist an author follows to write and commit a spec folder. Five of its lines disagreed with the tools they describe. Step 5 passed a folder to a backfill flag that expects a specs directory, so the script exited 1. Step 7 asked for a Co-Authored-By trailer that the commit-msg hook refuses. The workspace bullet fixed main and cited a memory note instead of the sk-git workspace rule. The post-check rows and the last line of Step 7 assumed a clean tree that a shared tree never has.

### Purpose
Correct each recipe line so that following it literally produces a passing commit: the right backfill argument, a commit step that matches the hook, a workspace bullet that defers to sk-git, and post-checks and a verification gate that look at the staged set instead of the whole tree.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The backfill command line in the write recipe
- The commit and push step
- The workspace bullet
- The status and push post-check rows and the Step 7 verification gate

### Out of Scope
- The commit hook itself
- sk-git workflow content
- Any template or validator change

### Files to Change
Each child keeps its own plan and file list. This table is the audit trail of the phases.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `001-fix-write-recipe-backfill-flag/` | Existing packet | 001 | Pass the packet folder to the graph metadata backfill |
| `002-fix-write-recipe-commit-step/` | Existing packet | 002 | Align the commit step with the commit hook |
| `003-fix-write-recipe-workspace-bullet/` | Existing packet | 003 | Point the workspace bullet at sk-git |
| `004-fix-write-recipe-post-checks/` | Existing packet | 004 | Reword the status and push post-check rows |
| `005-fix-write-recipe-verification-gate/` | Existing packet | 005 | Check the staged set in the Step 7 gate |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-fix-write-recipe-backfill-flag/` | Pass the packet folder to the graph metadata backfill | Complete |
| 2 | `002-fix-write-recipe-commit-step/` | Align the commit step with the commit hook | Complete |
| 3 | `003-fix-write-recipe-workspace-bullet/` | Point the workspace bullet at sk-git | Complete |
| 4 | `004-fix-write-recipe-post-checks/` | Reword the status and push post-check rows | Complete |
| 5 | `005-fix-write-recipe-verification-gate/` | Check the staged set in the Step 7 gate | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| `001-fix-write-recipe-backfill-flag` | `002-fix-write-recipe-commit-step` | Independent: no ordering dependency | `validate.sh --strict` passes on each child |
| `002-fix-write-recipe-commit-step` | `003-fix-write-recipe-workspace-bullet` | Independent: no ordering dependency | `validate.sh --strict` passes on each child |
| `003-fix-write-recipe-workspace-bullet` | `004-fix-write-recipe-post-checks` | Independent: no ordering dependency | `validate.sh --strict` passes on each child |
| `004-fix-write-recipe-post-checks` | `005-fix-write-recipe-verification-gate` | Independent: no ordering dependency | `validate.sh --strict` passes on each child |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

None.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Timeline**: See `timeline.md` for the order the phases shipped in and the number map
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
