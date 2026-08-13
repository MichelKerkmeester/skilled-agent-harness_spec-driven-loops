---
title: "Tasks: Deep AI Council - Reducers & Projections"
description: "Tasks for the Deep AI Council reducers and projections phase: map typed deliberation events to deterministic convergence, independence, stance, artifact, status, and plural-outcome projections."
trigger_phrases:
  - "Deep AI Council reducers and projections tasks"
  - "deep-ai-council projection reducer tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council/002-reducers-and-projections"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council/002-reducers-and-projections"
    last_updated_at: "2026-07-23T13:07:00Z"
    last_updated_by: "codex"
    recent_action: "Completed council reducer and projection implementation"
    next_safe_action: "Consume the closed projection contract downstream"
    blockers: []
    key_files: []
    completion_pct: 100
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

- [x] T001 Confirm the typed event schema, shared mode/fan-in/adjudication contracts, 013 write-set graph, council findings registries, and legacy Deep AI Council fixtures are available as read-only inputs [Evidence: landed schema and `ModeContract` imports]
- [x] T002 Confirm the phase boundary excludes event-schema authoring, seat execution, adjudication services, sealed-artifact creation, authority cutover, and the six sibling concerns [Evidence: Vitest 14/14; scoped imports and additive-dark git status]
- [x] T003 [P] Record source-of-truth fields, derived outcome fields, calibration metadata, compatibility metadata, projection-health fields, and stable identity inputs [Evidence: Vitest 14/14; closed projection types and implementation summary]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Define the typed event-to-projection matrix with valid transitions, idempotent duplicate policy, late-event policy, sequence checks, and fail-closed errors [Evidence: `DEEP_AI_COUNCIL_EVENT_ROUTING` and strict replay tests]
- [x] T005 Define the pure immutable fold state, canonical serialization, projection-version contract, and deterministic projection fingerprint [Evidence: Vitest 14/14; fold, immutable clone, and integrity digest]
- [x] T006 Define the deliberation/convergence reducer for council-worthiness, target and round identity, isolated evidence, critique exposure, protocol routing, coverage, obligations, vetoes, and terminal decisions [Evidence: Vitest 14/14; council-seat, critique, and convergence projections]
- [x] T007 Define the independence and stance reducer for raw seat metadata, calibration support, error vectors, effective seats, residual correlation, influence, stance flips, minority survival, and evidence-conditioned causes [Evidence: Vitest 14/14; retained independence snapshots, raw scores, and stance lineage]
- [x] T008 Define the artifact-index reducer for proposals, beliefs, ballots, bias probes, counterfactual forks, adjudication outputs, minority reports, receipts, digests, availability, and supersession lineage [Evidence: Vitest 14/14; referential artifact index and separate evidence families]
- [x] T009 Define the per-mode status reducer for lifecycle, contract versions, replay position, council admission, projection health, blocking reasons, shadow parity, mode-gate state, and terminal status [Evidence: Vitest 14/14; typed status provenance and cursor state]
- [x] T010 Define the plural outcome projection for factual posterior, blinded plan posterior, evidence-focused debate, and preserved plural/value disagreement while retaining raw votes, ties, vetoes, minority evidence, unresolved values, control arms, and reopen conditions [Evidence: Vitest 14/14; plural presentation retains raw event identities and veto/minority lineages]
- [x] T011 Define replay failure behavior for unknown versions, sequence gaps, invalid fingerprints, impossible transitions, duplicate terminals, missing artifacts, unsupported calibration, counterfactual instability, and projection drift [Evidence: registry validation, rebuild reasons, cross-field guards, and strict closed event union]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Verify repeated replay of one ordered typed event sequence produces identical deliberation state, independence and stance state, artifact index, per-mode status, plural outcome, canonical serialization, fingerprints, and terminal status [Evidence: Vitest 14/14; targeted determinism fixture]
- [x] T013 Verify empty, isolated-only, critique-complete, duplicate, late-evidence, supersession, and mixed-round sequences preserve deterministic state and append-only evidence [Evidence: Vitest 14/14; empty state, exact duplicate, strict late-order rejection, and append-only fold semantics]
- [x] T014 Verify council-worthiness, required seat/evidence coverage, hard vetoes, unresolved dissent, calibration support, counterfactual obligations, and control-arm requirements block convergence when the shared contract requires them [Evidence: Vitest 14/14; eligibility derivation and hard-veto falsifier]
- [x] T015 Verify independence and stance projections retain stable seat identity, raw observations, calibration fingerprint, residual-correlation inputs, effective seats, flip causes, and minority lineage [Evidence: Vitest 14/14; closed seat, independence, stance, and presentation records]
- [x] T016 Verify artifact references retain stable logical identity, producer linkage, target/round identity, content digest, availability, and supersession lineage without constructing or sealing an artifact [Evidence: `DeepAiCouncilArtifactRecord` and referential guards]
- [x] T017 Verify per-mode status accepts only valid typed transitions and reports blocked/error states for invalid transitions, unsupported admission, duplicate terminals, and projection mismatch [Evidence: Vitest 14/14; impossible-transition and contradictory-checkpoint tests]
- [x] T018 Verify plural outcomes preserve factual, comparative, debate, and value-disagreement semantics and cannot replace unresolved values or minority evidence with nominal quorum [Evidence: Vitest 14/14; separate raw signal arrays and hard-veto test]
- [x] T019 Verify shadow parity against frozen legacy Deep AI Council fixtures and record field-level discrepancies without changing authority [Evidence: Vitest 14/14; complete canonical legacy fixture comparison]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete [Evidence: T001-T019 checked above]
- [x] All requirements in spec.md met with evidence [Evidence: implementation summary and targeted reducer suite]
- [x] Phase gate green (validate/replay/shadow-parity as applicable) [Evidence: targeted Vitest, runtime TypeScript, and strict validation]
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
