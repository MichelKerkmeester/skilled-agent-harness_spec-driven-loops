---
title: "Tasks: Deep Research - Sealed Reference Artifacts"
description: "Tasks for binding Deep Research lifecycle inputs, evidence, outputs, resume deltas, and memory-save handoff to the shared sealed-artifact contract."
trigger_phrases:
  - "deep research sealed artifacts tasks"
  - "deep-research verified read tasks"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/003-sealed-artifacts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/003-sealed-artifacts"
    last_updated_at: "2026-07-15T19:20:00Z"
    last_updated_by: "opencode"
    recent_action: "Sequenced Deep Research artifact registration and lifecycle verification"
    next_safe_action: "Build the lifecycle artifact matrix from the pinned baseline"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Deep Research - Sealed Reference Artifacts

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

- [ ] T001 Confirm the phase-012 mode contract and write-set conflict graph, and verify predecessor `002-reducers-and-projections` owns the reducer/projection boundary
- [ ] T002 Inventory Deep Research init, gather, analyze, convergence, synthesis, resume, and memory-save state and output shapes against the pinned baseline
- [ ] T003 Freeze the mode artifact-kind matrix, shared descriptor fields, canonicalization profiles, media types, digest-reference roles, and deterministic reference ordering
- [ ] T004 Define typed seal/read failures, source-refresh dispositions, append-only supersession, handoff refusal, and the additive-dark rollback switch
- [ ] T005 Confirm the mode consumes the phase-007 sealing primitives and does not introduce a mode-local digest, blob store, or verification path
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 Register Deep Research objective, plan/frontier, search recipe, capability, configuration, and replay-input artifact kinds through the shared sealer
- [ ] T007 Add init seal-on-write and bind one verified initial reference set before any gather branch dispatch
- [ ] T008 Add source-capture sealing for response bytes, retrieval metadata, extraction profiles, and normalized passages, with verified reads before analysis
- [ ] T009 Add immutable analysis observation sealing for atomic claims, evidence spans, cross-validation, contradictions, unresolved findings, and abstentions
- [ ] T010 Add a convergence witness over one verified frontier snapshot and bind its references without redefining the shared convergence policy
- [ ] T011 Seal the synthesis claim/evidence materialized view, report bytes, unresolved obligations, reducer identity, and ordered input digest set
- [ ] T012 Add resume refresh comparison over result IDs and content digests, appending new source and dependent-claim references without mutating prior artifacts
- [ ] T013 Add the verified memory-save handoff package and refuse trusted handoff evidence when any referenced artifact fails verification
- [ ] T014 Bind mode artifact references into typed events, reducers, projections, replay fingerprints, compatibility adapters, shadow parity, and rollback handling
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T015 Verify every mode artifact kind uses shared canonicalization, seal-on-write, algorithm-qualified digest references, and the shared verified reader
- [ ] T016 Verify init and gather fixtures reject mutable-only, missing, changed, truncated, substituted, wrong-kind, wrong-size, corrupted, and unsupported inputs
- [ ] T017 Verify analysis fixtures preserve raw claims, evidence spans, provenance, contradictions, unresolved states, and append-only judgment supersession
- [ ] T018 Verify convergence rejects mixed watermarks and synthesis reproduces identical bytes from identical verified inputs and reducer versions
- [ ] T019 Verify resume reruns frozen recipes, detects changed result IDs/content digests, processes affected dependencies, and preserves historical seals
- [ ] T020 Verify memory-save releases no trusted handoff content after a failed seal or read and never silently rebaselines the run
- [ ] T021 Verify replay and shadow parity require the same ordered verified reference set before comparing effective events or projections
- [ ] T022 Verify seal/read failure blocks dark evidence and leaves legacy output, state, schema, memory behavior, and authority unchanged
- [ ] T023 Verify the independent Deep Research mode gate and rollback switch with certificate and authority decisions deferred to later phases
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
