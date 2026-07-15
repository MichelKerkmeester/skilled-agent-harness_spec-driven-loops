---
title: "Implementation Plan: shared mode interfaces (009 phase 001)"
description: "Implementation Plan for phase 001 of the 009 shared-mode-contracts-and-fixtures parent: freeze the typed lifecycle contract and conformance boundary for all eight phase-010 modes."
trigger_phrases:
  - "shared mode interfaces implementation plan"
  - "deep-loop mode contract plan"
  - "phase 009 typed interface plan"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/012-shared-mode-contracts-and-fixtures/001-shared-mode-interfaces"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/012-shared-mode-contracts-and-fixtures/001-shared-mode-interfaces"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Mapped the shared mode interface work into setup, contract, and verification phases"
    next_safe_action: "Resolve the version matrix and conformance fixtures against the parent handoff"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Shared Mode Interfaces

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop runtime contract and phase-010 mode workstreams |
| **Change class** | Planning contract, typed interface, and fixture design |
| **Execution** | Freeze before phase 010; no authority change or legacy-writer removal |

### Overview
The work freezes one `ModeContract` for the eight phase-010 workstreams. The contract separates mode-provided declarations from substrate-consumed ports, binds mode events to the phase-003 authorized envelope, binds evidence and control outputs to phase 004, and exposes the phase-008 convergence and health signals through typed hooks. It also defines version compatibility, resume outcomes, sealed artifacts, certificates, and write-set ownership so that later mode migrations share one lifecycle rather than creating eight bespoke adapters. Detailed implementation is accepted only after the source matrix, mixed-version fixtures, and manifest-derived conformance matrix are complete.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The parent `012-shared-mode-contracts-and-fixtures` outcome and phase adjacency are recorded.
- [ ] The phase-003 ledger/envelope contract, phase-004 service map, phase-008 convergence map, parent spec, and manifest are reconciled into one source matrix.
- [ ] The eight phase-010 workstream names and the deep-improvement common ordering are frozen from `manifest/phase-tree.json`.
- [ ] The contract boundary distinguishes provided mode behavior from consumed substrate ports and does not duplicate successor cross-mode closures.
- [ ] Interface versioning and mixed-version fixture requirements are agreed before any mode migration plan consumes the contract.

### Definition of Done
- [ ] A typed mode contract covers event schemas, reducers, sealed artifacts, certificates, convergence hooks, resume adapters, and write sets.
- [ ] Every phase-010 workstream has a conformance row and a declared implementation dependency on the same contract version.
- [ ] Mixed-version, invalid-transition, partial-resume, and write-conflict fixtures have deterministic expected outcomes.
- [ ] The handoff to phase 010 is frozen and phase 011 remains the sole authority-cutover owner.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- Define a `ModeContract` composed of a `ModeDescriptor`, `ModeEventSchema`, `ModeReducerSet`, `ModeArtifactPolicy`, `ModeCertificatePolicy`, `ModeConvergenceHooks`, `ModeResumeAdapter`, and `ModeWriteSet`.
- Define mode-provided operations with explicit inputs and outputs: `describe()`, `eventTypes()`, `reduce(event, state)`, `sealArtifacts(state, context)`, `issueCertificate(evidence)`, `convergenceHooks()`, `classifyResume(snapshot)`, `upcastResume(snapshot)`, and `restoreResume(snapshot, services)`.
- Define mode-consumed ports around the existing substrate rather than new mode-specific services: authorized ledger append/replay and fingerprints from phase 003; receipts/effect recovery, artifact sealing, adjudication, budgets, gauges, locks, and continuity from phase 004; fan-out/fan-in envelopes from phase 006; and coverage, cycle, stopping-clock, allocation, health, and degeneration signals from phase 008.
- Require every emitted event to carry a stable type, interface/schema version, transition intent, reducer owner, replay inputs, continuity identity, and evidence references. The contract must route writes through authorization and retain legacy projections during the dark period.
- Require every sealed artifact and certificate to declare its content digests, source events, validity scope, producer version, invalidation rule, and whether it is shadow-parity evidence or a later cutover input.
- Model resume as an explicit adapter result: `upcast`, `pin-legacy`, `fork`, `migrate`, or `block`, with the result bound to the snapshot version, replay fingerprint, lease/fencing state, pending effects, receipts, artifacts, and continuity identity.
- Make interface versioning independent from event schema versioning. Additive changes may be read by older consumers only when the compatibility fixture proves safe defaults; semantic and breaking changes require a versioned adapter or a fail-closed refusal.
- Derive the mode matrix and write-set declarations from `mode_workstreams_phase_010`; do not encode a second list that can drift from the manifest.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Read the parent purpose, sequencing invariants, phase handoff criteria, and the phase-tree mode list.
- Extract the stable interface obligations from `006-transition-authorized-ledger-core/spec.md`, `007-shared-evidence-and-control-services/spec.md`, and `011-convergence-termination-and-health/spec.md` into a requirement-to-port matrix.
- Record the boundary with `002-cross-mode-closures`: this phase names dependencies and write sets; the successor hoists shared implementations and resolves common closures.

### Phase 2: Implementation
- Define the mode-provided type surface and lifecycle method semantics.
- Define consumed service-port contracts, event/reducer ownership, sealed-artifact and certificate metadata, convergence hook inputs/outputs, and resume adapter outcomes.
- Define the interface version policy, schema compatibility matrix, adapter obligations, and fail-closed rules.
- Define manifest-derived conformance rows for all eight workstreams, including deep-improvement-common before its three variants.
- Define mixed-version, invalid transition, missing artifact, budget exhaustion, lease loss, convergence degeneration, partial resume, and write-set conflict fixtures.

### Phase 3: Verification
- Verify each requirement in `spec.md` against a named contract section and fixture.
- Verify every mode row declares the full surface without an unreviewed exception.
- Verify phase-003, phase-004, and phase-008 ports are referenced rather than reimplemented or weakened.
- Verify the interface version matrix yields deterministic adapter or refusal outcomes and preserves additive-dark authority.
- Verify the phase-010 handoff is complete and the successor can implement cross-mode closures without changing the frozen lifecycle.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Contract inventory review lists every provided type/method and consumed port with owner and evidence shape |
| REQ-002 | Event fixture attempts direct, unauthorized, stale-version, and authorized writes; only the authorized envelope path succeeds |
| REQ-003 | Reducer fixture replays the same event stream twice, rejects duplicate ownership, and compares immutable outputs |
| REQ-004 | Artifact/certificate fixtures verify digest binding, source-event references, validity scope, and shadow-versus-cutover classification |
| REQ-005 | Convergence fixtures supply coverage, cycle, clock, allocation, health, and degeneration signals through the typed hook boundary |
| REQ-006 | Resume matrix exercises upcast, pin-legacy, fork, migrate, block, fingerprint mismatch, lease loss, and pending-effect recovery |
| REQ-007 | Reader/writer matrix covers additive, deprecated, semantic, and breaking interface versions with adapter or fail-closed results |
| REQ-008 | Manifest-derived conformance runner covers all eight mode workstreams and checks common/variant ordering |
| REQ-009 | Shadow fixture confirms legacy remains authoritative and rejects a mode contract that declares an early authority flip |
| REQ-010 | Fixture inventory is executable, deterministic, and reports expected outcome, interface version, mode, write set, and evidence references |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The contract depends on the planned boundaries in `006-transition-authorized-ledger-core/spec.md`, `007-shared-evidence-and-control-services/spec.md`, and `011-convergence-termination-and-health/spec.md`, plus the sequencing and handoff rules in `../spec.md` and `../manifest/phase-tree.json`. It also consumes the durable fan-out/fan-in and compatibility assumptions recorded in phases 005-007. Phase 010 cannot begin its eight mode migrations until this contract and its conformance fixtures are frozen. The successor `002-cross-mode-closures` may depend on this interface but must not silently alter it.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

This phase changes the planned contract and fixture boundary only; it does not move runtime authority or remove legacy writers. If the interface is rejected, discard the unpublished contract revision and retain the prior phase-009 parent plan. If a frozen contract has already been consumed by a mode workstream, increment the interface version, retain the old adapter and fixtures, and block incompatible readers rather than mutating the existing contract in place. Any runtime implementation remains reversible through the phase-005 compatibility bridge and the phase-011 per-mode rollback window.
<!-- /ANCHOR:rollback -->
