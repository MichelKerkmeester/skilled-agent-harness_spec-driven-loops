---
title: "Feature Specification: Parent and nested goal fixture"
description: "A three-child packet that checks source-derived goals and complete phase binding."
trigger_phrases:
  - "fixture goal binding"
  - "phase map and child goals"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/060-create-goal-mode/004-parent-and-nested-goal-authoring/scratch/001-parent-and-nested-goals-fixture"
    last_updated_at: "2026-09-25T20:36:28Z"
    last_updated_by: "fixture-author"
    recent_action: "Initialize phase-parent continuity block"
    next_safe_action: "Plan or resume a child phase folder"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fixture-parent-session"
      parent_session_id: null
    completion_pct: 0
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

# Feature Specification: Parent and nested goal fixture

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-25 |
| **Branch** | `fixture` |
| **Parent Spec** | `../../spec.md` |
| **Parent Packet** | sk-doc/060-create-goal-mode/004-parent-and-nested-goal-authoring |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Three child goals are bound and recursive strict validation passes without missing targets |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A parent goal can look complete while a direct phase-child directory has no matching binding row. The fixture checks the map, child folders and goal targets together.

### Purpose
Prove that a phase parent can bind three child goals derived from each child's own specification and acceptance criteria.

> This phase-parent specification records the fixture's purpose and child map. Each child folder holds its own sources and goal.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Compare the phase map with the three direct child folders.
- Author each child goal from its own specification and acceptance criteria.
- Bind every child goal in the parent goal.

### Out of Scope
- Changes to system-spec-kit templates or validators. The fixture uses those owners without modifying them.
- Changes to goals outside this fixture.

### Files to Change
The child files hold the fixture sources, plans, task checklists, acceptance criteria and goals.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| Child `spec.md` and `acceptance-criteria.md` | Create | All phases | Supply phase-local goal sources |
| Child `goal.md` | Create | All phases | Record each phase goal |
| Parent `goal.md` | Create | Binding check | Bind all three child goals |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-source-audit/ | Record the source map and compare it with child folders | Complete |
| 2 | 002-goal-authoring/ | Author a phase-local goal from this child's sources | Complete |
| 3 | 003-binding-check/ | Check that the parent binds every child goal | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Resume a fixture phase from its child folder.
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-source-audit | 002-goal-authoring | The map and direct child directory names match | Read the map and list direct child folders |
| 002-goal-authoring | 003-binding-check | Each child goal uses its own source documents | Compare each goal with its child specification and criteria |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
