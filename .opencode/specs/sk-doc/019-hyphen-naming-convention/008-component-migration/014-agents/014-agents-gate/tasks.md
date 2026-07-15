---
title: "Tasks: agents surface rollup gate (017 phase 014)"
description: "Tasks for phase 014 of the 017 agents component migration: aggregate sibling evidence and close the agents naming gate."
trigger_phrases:
  - "agents surface rollup gate tasks"
  - "agents naming gate tasks"
  - "017 phase 014 agents tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/014-agents"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/014-agents/014-agents-gate"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored agents gate docs"
    next_safe_action: "Execute agents rollup gate"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Tasks: Agents Surface Rollup Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| [ ] | Pending |
| [x] | Completed |
| [P] | Parallelizable |
| [B] | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm the 13 sibling checklists, parent phase map, policy, and pinned BASE
- [ ] T002 Confirm the three runtime roots and the expected 39 definition paths
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Build the sibling evidence matrix for 001 through 013
- [ ] T004 Reconcile the runtime inventory against the 39-path expected definition set
- [ ] T005 Union all sibling candidate sets and record the required empty result or a blocker
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 Verify: every sibling has path-level P0 evidence
- [ ] T007 Verify: the aggregate candidate set is exactly ∅
- [ ] T008 Verify: the whole agents directory scan is kebab-clean within scope
- [ ] T009 Verify: no runtime file or unassigned migration task was introduced
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with path-level evidence
- [ ] Phase gate green (validate/build/test as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See spec.md
- **Plan**: See plan.md
<!-- /ANCHOR:cross-refs -->
