---
title: "Tasks: inventory, partitioning, and worktree (019 phase 005)"
description: "Tasks for phase 005 of the 019 kebab-case filesystem-naming program: inventory, partitioning, and worktree."
trigger_phrases:
  - "inventory, partitioning, and worktree tasks"
  - "hyphen naming phase 005 tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/005-inventory-and-partitioning"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/005-inventory-and-partitioning"
    last_updated_at: "2026-07-13T11:44:19Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Tasks scaffolded from the 019 decomposition"
    next_safe_action: "Plan or execute this phase on the worktree when picked up"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Inventory, partitioning, and worktree

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm predecessor phases landed and the execution worktree is clean (per this phase's spec adjacency)
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 A full repo inventory of in-scope snake_case FS names with every exemption applied
- [ ] T003 The authoritative rename map + collision/exemption report
- [ ] T004 Partition into migration batches by surface/skill family for phases 006-010
- [ ] T005 Establish the dedicated worktree for execution (sk-git)
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 Verify: The inventory counts only in-scope names (all exemptions applied) — Vendored/`.py`/generated/tool-mandated names are excluded from the count
- [ ] T007 Verify: The rename map is collision-free or collisions are enumerated for resolution — The collision report lists 0 unresolved collisions before execution
- [ ] T008 Verify: Migration batches are defined by surface/skill family — Each of phases 006-010 has an assigned, disjoint batch set
- [ ] T009 Verify: A dedicated worktree is established for execution — A numbered `wt/*` worktree exists and is clean
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Phase gate green (validate/build/test as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
