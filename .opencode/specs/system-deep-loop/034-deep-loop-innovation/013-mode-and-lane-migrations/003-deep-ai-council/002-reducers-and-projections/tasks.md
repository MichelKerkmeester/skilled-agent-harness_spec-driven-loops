---
title: "Tasks: Deep AI Council - Reducers & Projections"
description: "Tasks for the Deep AI Council reducers and projections phase: map typed deliberation events to deterministic convergence, independence, stance, artifact, status, and plural-outcome projections."
trigger_phrases:
  - "Deep AI Council reducers and projections tasks"
  - "deep-ai-council projection reducer tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council/002-reducers-and-projections"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council/002-reducers-and-projections"
    last_updated_at: "2026-07-15T22:15:00Z"
    last_updated_by: "opencode"
    recent_action: "Separated council reducer tasks from schema and artifact sealing work"
    next_safe_action: "Complete the council event-to-projection matrix"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Deep AI Council - Reducers & Projections

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

- [ ] T001 Confirm the typed event schema, shared mode/fan-in/adjudication contracts, 013 write-set graph, council findings registries, and legacy Deep AI Council fixtures are available as read-only inputs
- [ ] T002 Confirm the phase boundary excludes event-schema authoring, seat execution, adjudication services, sealed-artifact creation, authority cutover, and the six sibling concerns
- [ ] T003 [P] Record source-of-truth fields, derived outcome fields, calibration metadata, compatibility metadata, projection-health fields, and stable identity inputs
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Define the typed event-to-projection matrix with valid transitions, idempotent duplicate policy, late-event policy, sequence checks, and fail-closed errors
- [ ] T005 Define the pure immutable fold state, canonical serialization, projection-version contract, and deterministic projection fingerprint
- [ ] T006 Define the deliberation/convergence reducer for council-worthiness, target and round identity, isolated evidence, critique exposure, protocol routing, coverage, obligations, vetoes, and terminal decisions
- [ ] T007 Define the independence and stance reducer for raw seat metadata, calibration support, error vectors, effective seats, residual correlation, influence, stance flips, minority survival, and evidence-conditioned causes
- [ ] T008 Define the artifact-index reducer for proposals, beliefs, ballots, bias probes, counterfactual forks, adjudication outputs, minority reports, receipts, digests, availability, and supersession lineage
- [ ] T009 Define the per-mode status reducer for lifecycle, contract versions, replay position, council admission, projection health, blocking reasons, shadow parity, mode-gate state, and terminal status
- [ ] T010 Define the plural outcome projection for factual posterior, blinded plan posterior, evidence-focused debate, and preserved plural/value disagreement while retaining raw votes, ties, vetoes, minority evidence, unresolved values, control arms, and reopen conditions
- [ ] T011 Define replay failure behavior for unknown versions, sequence gaps, invalid fingerprints, impossible transitions, duplicate terminals, missing artifacts, unsupported calibration, counterfactual instability, and projection drift
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Verify repeated replay of one ordered typed event sequence produces identical deliberation state, independence and stance state, artifact index, per-mode status, plural outcome, canonical serialization, fingerprints, and terminal status
- [ ] T013 Verify empty, isolated-only, critique-complete, duplicate, late-evidence, supersession, and mixed-round sequences preserve deterministic state and append-only evidence
- [ ] T014 Verify council-worthiness, required seat/evidence coverage, hard vetoes, unresolved dissent, calibration support, counterfactual obligations, and control-arm requirements block convergence when the shared contract requires them
- [ ] T015 Verify independence and stance projections retain stable seat identity, raw observations, calibration fingerprint, residual-correlation inputs, effective seats, flip causes, and minority lineage
- [ ] T016 Verify artifact references retain stable logical identity, producer linkage, target/round identity, content digest, availability, and supersession lineage without constructing or sealing an artifact
- [ ] T017 Verify per-mode status accepts only valid typed transitions and reports blocked/error states for invalid transitions, unsupported admission, duplicate terminals, and projection mismatch
- [ ] T018 Verify plural outcomes preserve factual, comparative, debate, and value-disagreement semantics and cannot replace unresolved values or minority evidence with nominal quorum
- [ ] T019 Verify shadow parity against frozen legacy Deep AI Council fixtures and record field-level discrepancies without changing authority
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Phase gate green (validate/replay/shadow-parity as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
