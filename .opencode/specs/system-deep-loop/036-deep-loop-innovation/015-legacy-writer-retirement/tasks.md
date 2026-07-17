---
title: "Tasks: Legacy Writer Retirement"
description: "Tasks for phase 015 of the 006 recommendations-implementation program: gated legacy live-emitter deletion with archival readers retained."
trigger_phrases:
  - "legacy writer retirement tasks"
  - "deep-loop legacy emitter deletion tasks"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/015-legacy-writer-retirement"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/015-legacy-writer-retirement"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Decomposed setup, ordered deletion, archival retention, and verification tasks"
    next_safe_action: "Build the census-backed delete and retain manifest"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Legacy Writer Retirement

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

- [ ] T001 Pin the phase-003 BASE and clean isolated worktree before inspecting the deletion candidate
- [ ] T002 Reconcile the phase-003 reader/writer, schema, state, backend, dynamic-path, and archival-read census with the exact candidate
- [ ] T003 Collect each phase-014 mode cutover certificate, final authority epoch, clean rollback-window closure, and retained rollback asset
- [ ] T004 Freeze the delete/retain manifest with one row for every censused legacy producer, consumer, schema, projection, and fixture
- [ ] T005 Ratify the zero-use telemetry schema, positive controls, coverage report, observation window, archival-read classification, and unknown-path blocker
- [ ] T006 Record the pre-delete restoration anchor and review the candidate scope and runtime comment-hygiene rule
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T007 Instrument or enable bounded telemetry at every legacy live writer and live canonical-reader boundary without recording secrets or unrestricted payloads
- [ ] T008 Run positive controls, execute the declared observation window, and archive zero-live-use evidence for all eight workstreams
- [ ] T009 Retire `001-deep-research` live writers before its replaced helpers; recheck the mode row after the scoped deletion
- [ ] T010 Retire `002-deep-review` live writers before its replaced helpers; recheck the mode row after the scoped deletion
- [ ] T011 Retire `003-deep-ai-council` live writers before its replaced helpers; recheck the mode row after the scoped deletion
- [ ] T012 Retire `004-deep-improvement-common` live writers before its replaced helpers; recheck shared-backend boundaries
- [ ] T013 Retire `005-agent-improvement` live writers before its replaced helpers; keep its mode evidence independent
- [ ] T014 Retire `006-model-benchmark` live writers before its replaced helpers; keep its mode evidence independent
- [ ] T015 Retire `007-skill-benchmark` live writers before its replaced helpers; keep its mode evidence independent
- [ ] T016 Retire `008-deep-alignment` live writers before its replaced helpers; complete the mode-order deletion log
- [ ] T017 Remove shared legacy emitters and replaced logic only after T009-T016 pass; preserve archival readers, decoders, upcasters, schemas, projections, and fixtures
- [ ] T018 Review changed runtime comments and delete any ephemeral spec, task, phase, packet, or finding identifiers
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T019 Verify the static inventory, telemetry coverage, positive controls, observation window, zero live-use result, and zero unknown paths
- [ ] T020 Verify every phase-014 certificate and clean window closure remains bound to the exact candidate and final mode epoch
- [ ] T021 Verify the deletion log enforces mode order, writers-before-helpers, and shared-last retirement
- [ ] T022 Verify historical completed packets for every retained legacy schema family, including recorded restart/resume and repair cases
- [ ] T023 Inject live-use, stale-window, missing-coverage, unknown-path, candidate-drift, and archival-read failures; verify each blocks deletion or fails closed
- [ ] T024 Verify rollback evidence, rollback anchors, telemetry reports, and the pre-delete restoration record remain retained after deletion
- [ ] T025 Compare the candidate diff with the delete/retain manifest and run scoped runtime checks plus strict spec validation
- [ ] T026 Package the phase-016 handoff with candidate SHA, evidence hashes, deletion diff, retention manifest, archival-read results, and verification commands
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
