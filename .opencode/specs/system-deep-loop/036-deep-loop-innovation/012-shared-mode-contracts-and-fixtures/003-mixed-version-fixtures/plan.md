---
title: "Implementation Plan: Mixed-Version Fixtures"
description: "Implementation plan for the sealed old/new event and state fixture corpus, deterministic replay outcomes, and shadow-parity coverage across a version boundary."
trigger_phrases:
  - "mixed-version fixtures implementation plan"
  - "deep-loop version drift fixture plan"
  - "interrupted migration replay plan"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/012-shared-mode-contracts-and-fixtures/003-mixed-version-fixtures"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-shared-mode-contracts-and-fixtures/003-mixed-version-fixtures"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Mapped scenario corpus, sealing boundary, and replay outcome matrix"
    next_safe_action: "Freeze fixture schema and sealed replay inputs for implementation"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Mixed-Version Fixtures

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop phase-012 shared mode contracts and fixtures |
| **Change class** | Sealed fixture corpus, compatibility matrix, and deterministic replay planning |
| **Execution** | Freeze before phase 013; no authority change, state rewrite, or legacy-writer removal |
| **Primary inputs** | Phase-007 sealed artifacts, phase-008 upcasters and shadow parity, phase-012 interface, phase-tree manifest |

### Overview
Define one manifest-derived fixture envelope for all eight phase-013 workstreams. The corpus keeps pure-old and
pure-new controls beside mid-upgrade and interrupted-migration cases, composes independently versioned events and state,
seals every replay-affecting input through phase 007, and records expected upcaster, reducer, resume, replay, and parity
outcomes. The fixture runner is a consumer of phase-008 contracts, not a second upcaster or parity implementation.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The parent `012-shared-mode-contracts-and-fixtures` outcome, phase adjacency, and phase-tree outcome are recorded.
- [ ] The phase-008 upcaster/dual-read contract and shadow-parity contract are reconciled into fixture inputs, expected
  outcomes, and fail-closed classifications.
- [ ] The phase-007 sealed-reference-artifact contract is available for canonical bytes, verified reads, retention roots,
  and ordered digest references.
- [ ] The four scenario families and independent event/state version matrix are frozen before fixture generation.
- [ ] The eight phase-013 workstream rows and deep-improvement-common ordering are derived from `manifest/phase-tree.json`.
- [ ] The fixture envelope distinguishes authored expected outcomes from implementation-produced observations.

### Definition of Done
- [ ] Pure-old, pure-new, mid-upgrade, and interrupted-migration fixtures exist for every required workstream or carry a
  named contract-backed reason for a shared row.
- [ ] Every case has an immutable sealed capsule, exact causal boundary, version/hop metadata, and expected outcome.
- [ ] Reducer, replay, resume, projection, and shadow-parity checks consume the same capsule without live inputs.
- [ ] Negative cases fail closed for unsupported versions, seal drift, causal mismatch, missing observations, and
  nondeterministic reruns.
- [ ] The phase handoff gives phase 013 the fixture namespace and phase 008 the parity-ready case identities without
  moving authority.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Fixture envelope**: Define `MixedVersionCase` with case identity, mode/workstream, scenario family, interface and
  fixture-schema versions, event/state version map, causal boundary, expected outcome, and bound contract identities.
- **Versioned input composer**: Build event rows and state snapshots from explicit stored versions. Permit old records to
  precede a current boundary write and permit only contract-approved event/state pairs. Never infer a version from shape
  or derive expected state by calling the reducer under test.
- **Seal compiler**: Canonicalize and seal prompt sets, initial state, event rows, state snapshots, configuration,
  evaluator material, prior outputs, version policy, and restart metadata through phase 007. Publish one ordered digest
  set and refuse aliases, mutable paths, or partially published capsules.
- **Compatibility adapter**: Invoke the phase-008 registry and dual-read interfaces for each stored record, retaining
  stored version, effective version, source identity, and ordered adjacent hops. Expose typed failure without partial
  effective state when a mapping is unsupported or lossy.
- **Reducer and resume oracle**: Compare implementation output with authored expected event acceptance, state transitions,
  terminal result, pending effects, receipt set, continuity identity, and resume classification. The oracle is fixture data
  and contract evidence, not a second production reducer.
- **Replay and parity coordinator**: Run legacy and dark paths from isolated clones of one verified capsule, verify phase-
  003 replay components, compare declared projections, and route input inequality, divergence, or nondeterminism as
  blocking evidence. Phase-008 remains responsible for the harness and certificate semantics.
- **Manifest-derived matrix**: Expand the case rows from `mode_workstreams_phase_010`; preserve
  `004-deep-improvement-common` before its three variants and keep the fixture namespace stable across reruns.

The verification order is fixed: manifest closure -> fixture-schema validation -> seal and digest verification -> causal
boundary validation -> upcaster/read classification -> reducer expectation -> resume/restart expectation -> replay
fingerprint verification -> legacy projection and shadow parity -> deterministic rerun -> certificate eligibility. An
earlier failure blocks trusted downstream comparison while retaining bounded diagnostic evidence.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Extract the phase-012 interface version, phase-008 upcaster and parity contracts, and phase-007 seal obligations into
  one fixture requirement matrix.
- Derive the eight phase-013 workstream rows from `manifest/phase-tree.json` and record common/variant ordering.
- Freeze the `MixedVersionCase`, event/state record, sealed capsule, expected outcome, and negative-result schemas.
- Define the old/new version inventory, supported adjacent hop graph, causal boundary fields, and four scenario-family
  constructors without selecting unsupported version pairs.
- Define the fixture namespace, source contract identities, digest binding, expected outcome vocabulary, and evidence
  retention fields.

### Phase 2: Implementation
- Create pure-old and pure-new control cases with authored expected reducer, replay, and projection outcomes.
- Create mid-upgrade cases with old records before the boundary, a current-version boundary write, new records after it,
  and explicit old/new state combinations.
- Create interrupted-migration cases with a sealed stop point, pending effects, receipt and lease state, continuity
  identity, and restart classification.
- Seal every case capsule through phase-007 and verify the ordered digest set before the case is runnable.
- Invoke phase-008 upcasters and dual-read adapters for supported records, recording exact hop traces and typed failures.
- Execute reducer and resume expectations against isolated case roots and capture immutable observation evidence.
- Run the same verified capsule through phase-008 shadow parity, comparing replay components and legacy projections without
  changing authority.
- Add negative fixtures for future versions, missing edges, lossy transforms, malformed state, seal mismatch, causal
  mismatch, missing observation, duplicate effect, and nondeterministic rerun.

### Phase 3: Verification
- Verify all required scenario families and workstream rows are present, stable, and closed against the manifest.
- Verify repeated sealed reads and reruns produce identical input digests, hop traces, reducer outputs, replay components,
  projections, classifications, and evidence identities.
- Verify old-event/new-state and new-event/old-state combinations are accepted only where the contract declares them
  comparable; all other combinations fail closed.
- Verify interrupted restarts do not duplicate accepted effects and preserve the declared resume classification.
- Verify any seal, causal, version, reducer, projection, observation, or rerun failure blocks parity and certificate
  eligibility without rebaselining.
- Run strict spec validation and bind the fixture manifest, case count, contract identities, and candidate identity to the
  phase gate report.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Schema and duplicate-identity tests reject missing case identity, mismatched bytes, and conflicting fixture versions |
| REQ-002 | Pure-old controls traverse the declared legacy/current compatibility path and match the pinned old expectation |
| REQ-003 | Pure-new controls bypass unnecessary upcasts and match the current reducer and replay expectation |
| REQ-004 | Mid-upgrade cases verify exact boundary, adjacent hops, mixed state, and authored effective-state output |
| REQ-005 | Interrupted cases stop at a sealed boundary, resume with pending-effect evidence, and return the declared classification |
| REQ-006 | Independent event/state matrix tests accept only registered comparable pairs and reject unsupported combinations |
| REQ-007 | Gap, cycle, future, ambiguous, lossy, malformed, and identity-mutating fixtures fail through phase-008 typed errors |
| REQ-008 | Seal tests reject mutable aliases, altered bytes, missing descriptors, wrong order, and unverified replay inputs |
| REQ-009 | Repeated sealed execution compares effective events, state, projections, fingerprints, and evidence identity byte-for-byte |
| REQ-010 | Legacy and dark paths run from independent clones of one capsule and preserve legacy authority and shadow-only sinks |
| REQ-011 | Authored expected outcome tests cover event acceptance, state, terminal result, receipts, pending effects, and artifacts |
| REQ-012 | Manifest-derived conformance runs all eight workstreams and preserves deep-improvement-common ordering |
| REQ-013 | One negative fixture per failure class blocks parity/certificate evidence and preserves bounded immutable diagnostics |
| REQ-014 | Fixture/schema changes create new identities and leave prior seals, expectations, and evidence immutable |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The fixture contract consumes the phase-007 sealed-reference-artifact descriptor and verified-read rules from
`../../007-shared-evidence-and-control-services/002-sealed-reference-artifacts/spec.md`. It consumes the phase-008
upcaster and dual-read rules from `../../008-compatibility-shadow-and-rollback-bridge/001-upcasters-and-dual-read-adapters/
spec.md` and the sealed-input comparison and certificate preconditions from
`../../008-compatibility-shadow-and-rollback-bridge/003-shadow-parity-harness/spec.md`. It also consumes the shared mode
interface and manifest sequencing rules from `../001-shared-mode-interfaces/spec.md`, `../../manifest/phase-tree.json`,
and the parent `../spec.md`.

The child declares `depends_on: []` as an independent planning contract. That declaration does not remove the execution
need for the phase-007 and phase-008 contracts: the fixture gate cannot accept an implementation that bypasses their
seal, upcast, comparison, or additive-dark invariants. Phase 013 consumes the frozen corpus; phase 014 alone controls
authority cutover.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

This phase publishes test and fixture identities only; it does not change production readers, writers, authority flags,
or historical state. Before phase 014, rollback disables the fixture runner integration, supersedes any fixture-manifest
or parity evidence issued by the reverted identity, and retains sealed artifacts and diagnostic evidence under their
replay or rollback holds. Legacy execution remains unchanged.

A changed fixture schema, expected outcome, upcaster registry, seal descriptor, comparator, or contract identity makes
prior case evidence stale. The safe recovery is a new versioned fixture identity and a complete affected-case rerun, not
mutation of an existing seal or an expected-output waiver. If a fixture run reaches a live target or emits an external
effect, rollback is failed and the phase remains blocked until isolation and root-cause evidence are repaired.
<!-- /ANCHOR:rollback -->
