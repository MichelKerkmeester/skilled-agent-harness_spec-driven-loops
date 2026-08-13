---
title: "Tasks: Phase Consolidation Migration"
description: "Tasks for executing and verifying the 44-child consolidation into eight multi-phase group parents."
---
# Tasks: Phase Consolidation Migration

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

- [ ] T001 Preserve the eight-group topology selected by the 057 research packet
- [ ] T002 Recheck all 44 source-child-to-parent assignments in `move-map.tsv`
- [ ] T003 Reconfirm basename preservation and no-content-merge constraints before any follow-up move
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Keep the eight thematic group-parent structures consistent with the retained mapping
- [ ] T005 Recheck that each mapped child remains beneath its assigned group parent
- [ ] T006 Recheck that each moved child retains its basename and nested descendants
- [ ] T007 Preserve `move-map.tsv` and `move-map.md` as the migration record
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Confirm all 44 mapping rows still resolve to the selected group parents
- [ ] T009 Confirm no mapped child basename changed during structural grouping
- [ ] T010 Confirm broader repository-wide reference, metadata, runtime, and memory reconciliation in the governing consolidation work
- [ ] T011 Confirm the final migration commit and any later archival decision in the governing consolidation work
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] The recorded structural migration remains consistent with the live grouped tree
- [ ] All 44 children remain represented in the retained move map
- [ ] The eight-group destination topology remains recorded
- [ ] Broader governing consolidation verification is complete
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Machine-readable mapping**: See `move-map.tsv`
- **Reader-facing mapping**: See `move-map.md`
- **Research source**: See `../057-phase-consolidation-research/research/research.md`
<!-- /ANCHOR:cross-refs -->
