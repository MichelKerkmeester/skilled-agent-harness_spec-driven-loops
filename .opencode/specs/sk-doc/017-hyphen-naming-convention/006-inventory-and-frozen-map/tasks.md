---
title: "Tasks: inventory and frozen rename map (017 phase 006)"
description: "Tasks for phase 006 of the 017 kebab-case filesystem-naming program: inventory and frozen rename map."
trigger_phrases:
  - "inventory and frozen rename map tasks"
  - "hyphen naming phase 006 tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/006-inventory-and-frozen-map"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/006-inventory-and-frozen-map"
    last_updated_at: "2026-07-13T13:10:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Tasks authored from the 16-phase decomposition"
    next_safe_action: "Execute this phase on the pinned worktree when picked up"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Inventory and frozen rename map

<!-- SPECKIT_LEVEL: 2 -->
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

- [ ] T001 Confirm predecessor phases landed and the pinned worktree is clean (per this phase's spec adjacency)
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 A full repo inventory (recomputed independently of 000) with every exemption applied
- [ ] T003 A bijective source->target rename map: every source exists, every target is unique and absent
- [ ] T004 A complete classification: every candidate is exactly one of rename/exempt/frozen/generated/tool-mandated; no "unknown"
- [ ] T005 Partition into dependency-closed batches (reference-graph SCCs), hashed together with BASE
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 Verify: The inventory counts only in-scope names with every exemption applied — Vendored/.py/package-dir/generated/tool-mandated names are excluded
- [ ] T007 Verify: The rename map is bijective — Every source exists; every target is unique and currently absent
- [ ] T008 Verify: Every candidate has exactly one classification with no "unknown" bucket — The classification report has 0 un-classified candidates
- [ ] T009 Verify: Batches are dependency-closed (reference-graph SCCs) — No batch references a rename in another un-landed batch
- [ ] T010 Verify: The map is hashed together with BASE for reproducibility — A stored digest binds the map to the exact BASE SHA
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
