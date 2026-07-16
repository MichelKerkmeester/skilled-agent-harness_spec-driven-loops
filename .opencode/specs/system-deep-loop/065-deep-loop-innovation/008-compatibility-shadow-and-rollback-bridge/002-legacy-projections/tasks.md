---
title: "Tasks: Legacy Projections"
description: "Tasks for census-driven folds from the dark ledger into byte-identical legacy JSONL and JSON artifacts."
trigger_phrases:
  - "legacy projections tasks"
  - "dark ledger projection tasks"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/002-legacy-projections"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/002-legacy-projections"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Defined implementation and verification tasks for legacy projection parity"
    next_safe_action: "Materialize the projection registry from the phase-003 census"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Legacy Projections

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

- [ ] T001 Freeze the phase-003 census and BASE fixtures; close every JSONL/JSON writer-reader row before implementation
- [ ] T002 Define the versioned projection-registry, watermark, shadow-root, fixture, and typed-failure schemas
- [ ] T003 Record serializer and refresh semantics for each manifest row, including `atomic-state.ts` JSONL/snapshot differences
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Implement pure full-rebuild folds from verified phase-006 ledger heads for every projection-manifest row
- [ ] T005 Reuse or extract exact legacy serializers for JSONL rows, snapshots, dashboards, registries, and resume inputs
- [ ] T006 Implement incremental folds with expected-head checks and byte equivalence to full rebuild
- [ ] T007 Implement immediate fsynced JSONL projection with exact ordering, separator, newline, fingerprint, and no-op behavior
- [ ] T008 Implement staged fsynced atomic snapshot projection with coalescing only where the census authorizes it
- [ ] T009 Persist monotonic projection watermarks only after output durability; recover safely across restart and torn shadow output
- [ ] T010 Reject live targets, path traversal, symlink escape, corrupt ledger input, unknown versions, and reducer mismatch before publication
- [ ] T011 Emit successor-ready parity bundles bound to BASE, exact ledger head, projection version, expected bytes, and projected bytes
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Verify: Census coverage is closed — every legacy surface and unchanged reader has exactly one projection disposition
- [ ] T013 Verify: Full rebuild is deterministic — repeated clean folds at the same verified head produce identical artifact digests
- [ ] T014 Verify: Incremental projection equals full replay — every selected head produces byte-identical JSONL/JSON output
- [ ] T015 Verify: JSONL timing and bytes match — immediate append, row order, diff suppression, separators, and terminal newline agree with BASE
- [ ] T016 Verify: Snapshot timing and bytes match — insertion order, indentation, integrity, newline, atomic replacement, and final flush agree with BASE
- [ ] T017 Verify: Restart and crash handling is idempotent — no duplicate row, stale rewrite, premature watermark, or live-path mutation occurs
- [ ] T018 Verify: Invalid ledger input fails closed — gap, fork, hash/type/version/auth mismatch, and corrupt tail publish nothing
- [ ] T019 Verify: Existing readers remain unchanged — dashboards, resume flows, registries, and other census-linked tools match BASE results
- [ ] T020 Verify: The parity handoff is reproducible — successor fixtures reconstruct every digest pair from the pinned ledger head
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
- **Schema census**: See `../../003-baseline-taxonomy-and-state-census/spec.md`
- **Dark ledger**: See `../../006-transition-authorized-ledger-core/002-typed-append-only-ledger/spec.md`
- **Program manifest**: See `../../manifest/phase-tree.json`
- **Legacy atomic writes**: See `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/atomic-state.ts`
<!-- /ANCHOR:cross-refs -->
