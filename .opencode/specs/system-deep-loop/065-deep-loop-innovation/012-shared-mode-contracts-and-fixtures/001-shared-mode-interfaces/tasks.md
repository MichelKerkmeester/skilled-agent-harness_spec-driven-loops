---
title: "Tasks: shared mode interfaces"
description: "Tasks for phase 004 of the 009 shared-mode-contracts-and-fixtures parent: author, freeze, and verify the common typed contract for every phase-013 mode."
trigger_phrases:
  - "shared mode interfaces tasks"
  - "deep-loop mode contract tasks"
  - "phase 012 interface fixture tasks"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/012-shared-mode-contracts-and-fixtures/001-shared-mode-interfaces"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/012-shared-mode-contracts-and-fixtures/001-shared-mode-interfaces"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Enumerated setup, contract, fixture, and handoff tasks for shared mode interfaces"
    next_safe_action: "Build the source-to-port matrix before freezing interface types"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Shared Mode Interfaces

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

- [ ] T001 Read the parent spec, phase-tree manifest, and phase-006, phase-007, and phase-011 source contracts; record the stable obligations and sequencing constraints
- [ ] T002 [P] Derive the eight phase-013 workstream rows and common/variant ordering directly from `mode_workstreams_phase_010`
- [ ] T003 [P] Map each substrate service port to its owning phase, mode-facing inputs/outputs, evidence shape, and fail-closed behavior
- [ ] T004 Define the boundary between this interface phase and `002-cross-mode-closures`, including shared implementation ownership and write-set declarations
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Define `ModeContract` and `ModeDescriptor` types with interface version, mode identity, lifecycle capabilities, dependencies, and declared write set
- [ ] T006 Define mode event schemas, transition intents, reducer ownership, replay inputs, continuity identity, and authorized append requirements
- [ ] T007 Define the reducer contract for deterministic replay, immutable outputs, duplicate-event handling, and state-version compatibility
- [ ] T008 Define sealed-artifact and certificate declarations with input digests, source events, validity scope, producer version, and invalidation rules
- [ ] T009 Define typed convergence and health hooks for coverage, cycle, stopping clocks, value-of-computation, health, and degeneration signals
- [ ] T010 Define the resume adapter contract for `upcast`, `pin-legacy`, `fork`, `migrate`, and `block`, including fingerprints, leases, receipts, artifacts, and pending effects
- [ ] T011 Define interface-version compatibility rules, adapter obligations, deprecation handling, and fail-closed behavior for incompatible readers and writers
- [ ] T012 [P] Define the manifest-derived conformance matrix for all eight modes, with no lifecycle exception outside the frozen contract
- [ ] T013 [P] Define mixed-version, unauthorized-transition, reducer-conflict, artifact-integrity, budget, lease, convergence, partial-resume, and write-set-conflict fixtures
- [ ] T014 Publish the frozen interface and fixture handoff inputs for phase 013 without changing runtime authority
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T015 Verify: The shared interface names every mode-provided capability and consumed substrate port — the typed inventory has one owner and method contract for each
- [ ] T016 Verify: Mode events use the phase-006 authorization boundary — unauthorized and direct-write fixtures fail closed
- [ ] T017 Verify: Reducer ownership is explicit and deterministic — replay and duplicate-ownership fixtures produce deterministic outcomes
- [ ] T018 Verify: Sealed artifacts and certificates are typed evidence — digest, source-event, scope, and invalidation fixtures pass or reject predictably
- [ ] T019 Verify: Convergence and health integration is uniform — phase-011 signals enter through typed hooks without mode-specific stop policy leakage
- [ ] T020 Verify: Resume is a first-class adapter — every mode has explicit classification and fingerprint/lease/effect recovery outcomes
- [ ] T021 Verify: Interface versioning is independently compatible — mixed-version fixtures produce adapter, supported read, or fail-closed results
- [ ] T022 Verify: All eight phase-013 workstreams conform — the manifest-derived matrix has no unreviewed exception and preserves common/variant order
- [ ] T023 Verify: Additive-dark discipline is preserved — no contract or fixture permits authority before phase 014
- [ ] T024 Verify: Fixture-backed conformance is executable and deterministic — expected outcomes and evidence fields are complete
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
- **Parent outcome**: See `../spec.md` and `../manifest/phase-tree.json`
- **Substrate contracts**: See `../../006-transition-authorized-ledger-core/spec.md`, `../../007-shared-evidence-and-control-services/spec.md`, and `../../011-convergence-termination-and-health/spec.md`
<!-- /ANCHOR:cross-refs -->
