---
title: "Feature Specification: shared mode interfaces (009 phase 001)"
description: "Freeze the typed contract that every phase-010 mode implements against the shared ledger, evidence services, fan-out/fan-in substrate, convergence services, and resume path before any per-mode migration begins."
trigger_phrases:
  - "shared mode interfaces"
  - "deep-loop mode contract"
  - "phase 009 mode interface"
  - "typed mode migration contract"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/012-shared-mode-contracts-and-fixtures"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/012-shared-mode-contracts-and-fixtures/001-shared-mode-interfaces"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined the planned typed contract for all eight mode workstreams"
    next_safe_action: "Freeze the interface matrix against the substrate and convergence specs"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Shared Mode Interfaces

> Phase adjacency under the 009 parent (grouping order, not a runtime dependency): predecessor: none (first sibling); successor: `002-cross-mode-closures`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/065-deep-loop-innovation/012-shared-mode-contracts-and-fixtures/001-shared-mode-interfaces |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop |
| **Origin** | Phase 001 of the 009 shared-mode-contracts-and-fixtures parent |
| **Parent outcome** | Freeze shared mode interfaces before the eight phase-010 migrations |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The recommendations program has one shared runtime spine, but the eight phase-010 workstreams still need a single typed boundary for using it. Without that boundary, deep-research, deep-review, deep-ai-council, deep-improvement-common, agent-improvement, model-benchmark, skill-benchmark, and deep-alignment can each invent different event shapes, reducer ownership, artifact semantics, certificate inputs, convergence callbacks, and resume behavior. That would turn the fan-out into eight bespoke rewrites and make shared write conflicts difficult to detect before execution.

Phase 003 defines the versioned event envelope, append-only ledger, replay fingerprints, and fail-closed transition-authorization gateway. Phase 004 makes that ledger usable through receipts/effect recovery, sealed reference artifacts, blinded adjudication, typed budgets, stream-fold gauges, locks/fencing, and continuity identities. Phase 008 adds path-covering termination, cycle detection, stopping clocks, value-of-computation allocation, and generic health signals. This phase freezes how a mode declares and consumes those contracts, while preserving the parent invariant that the substrate remains additive-dark and non-authoritative until phase 011 (`../spec.md`, `../manifest/phase-tree.json`).

The purpose is a versioned, conformance-testable mode interface that makes every phase-010 migration a uniform variation on the same lifecycle. The contract must describe the mode's event schema, reducers, sealed artifacts, certificates, convergence hooks, resume adapter, service dependencies, and write ownership without implementing any mode or moving authority from the legacy path.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A canonical typed `ModeContract` and `ModeDescriptor` surface for all eight entries in `manifest/phase-tree.json` `mode_workstreams_phase_010`.
- Provided mode capabilities: event-type declarations, state/reducer definitions, sealed-artifact declarations, certificate builders, convergence and health hooks, resume classification/upcast/restore adapters, and declared write-set ownership.
- Consumed substrate ports: authorized ledger append/replay, replay fingerprints, receipts and effect recovery, sealed artifacts, blinded adjudication, typed budgets, stream-fold gauges, locks/fencing, continuity identities, fan-out/fan-in envelopes, and convergence signals.
- Interface versioning, compatibility rules, mixed-version fixtures, and a conformance matrix that distinguishes additive fields, required-field changes, semantic changes, and incompatible transitions.
- A uniform mode lifecycle contract that keeps legacy projections and shadow parity available and leaves authority cutover to phase 011.
- Handoff criteria for the successor `002-cross-mode-closures` and the phase-010 mode workstreams.

### Out of Scope
- Implementing the shared ledger or any phase-003 or phase-004 service.
- Implementing convergence algorithms owned by phase 008 or choosing their production thresholds.
- Hoisting deep-improvement common services or the shared review/alignment loop; those cross-mode closures are the successor phase `002-cross-mode-closures`.
- Migrating any of the eight modes, removing legacy writers, or changing authority; those belong to phases 010-012.
- Creating or hand-writing generated `description.json` or `graph-metadata.json` metadata for this folder.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The shared interface names every mode-provided capability and mode-consumed service port | The contract defines typed descriptors and method semantics for event schemas, reducers, artifacts, certificates, convergence hooks, resume, and write sets; it also names every required substrate port |
| REQ-002 | Mode events use the phase-003 envelope and authorization boundary | Each mode event declaration includes a stable type, schema version, required fields, transition intent, reducer ownership, replay identity inputs, and an authorized append path; no direct unguarded write is permitted |
| REQ-003 | Reducer ownership is explicit and deterministic | Every persisted mode state field has one owning reducer, an input-event set, replay behavior, and an immutable output rule; competing reducers and hidden mutable side effects are rejected by conformance checks |
| REQ-004 | Sealed artifacts and certificates are typed evidence products | Each mode declares artifact identity, input digests, seal policy, certificate kind, evidence references, validity scope, and invalidation conditions; certificates cannot claim authority cutover |
| REQ-005 | Convergence and health integration is uniform | Each mode exposes typed hooks for coverage, novelty/cycle, stopping clocks, value-of-computation, and health/degeneration signals from phase 008 without embedding mode-specific stop policy in the shared substrate |
| REQ-006 | Resume is a first-class mode adapter | Each mode declares state classification, supported upcasters, legacy pin/fork/migrate/block outcomes, replay-fingerprint checks, and restoration of continuity identities, leases, receipts, artifacts, and pending effects |
| REQ-007 | The interface version is independently compatible and observable | A version policy defines additive, deprecated, semantic, and breaking changes; mixed-version fixtures prove the reader/writer matrix and identify the required adapter or fail-closed result |
| REQ-008 | All eight phase-010 workstreams conform to one contract | A manifest-derived matrix covers `001-deep-research`, `002-deep-review`, `003-deep-ai-council`, `004-deep-improvement-common`, `005-agent-improvement`, `006-model-benchmark`, `007-skill-benchmark`, and `008-deep-alignment` with no bespoke lifecycle exception |
| REQ-009 | The contract preserves additive-dark migration discipline | Conformance accepts shadow writes and legacy projections, records parity evidence, and rejects any mode contract that makes the ledger authoritative before the phase-011 cutover certificate |
| REQ-010 | The interface is executable as a fixture-backed conformance gate | Valid, missing, stale, incompatible, unauthorized, partial-resume, and write-set-conflict fixtures are defined with deterministic expected outcomes and evidence fields |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A single versioned `ModeContract` surface covers all eight entries in the phase-010 workstream list.
- **SC-002**: Every mode-provided type and method, every consumed substrate port, and every write-set declaration has one documented owner and compatibility rule.
- **SC-003**: Event schema, reducer, sealed artifact, certificate, convergence, and resume fixtures produce deterministic pass, reject, or migrate outcomes under mixed interface versions.
- **SC-004**: The contract consumes the phase-003 ledger, phase-004 evidence/control services, and phase-008 convergence/health signals without duplicating their authority or policy.
- **SC-005**: Phase 010 receives a frozen contract and conformance matrix; phase 011 remains the only authority-cutover owner.
- **SC-006**: The successor `002-cross-mode-closures` can add shared implementations without changing the mode lifecycle shape.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Interface overreach** — freezing implementation details from phases 003, 004, or 008 could couple the modes to unfinished service internals. Mitigation: define stable ports, invariants, and evidence shapes; keep service algorithms and thresholds behind their owning phases.
- **Hidden mode exceptions** — a mode may appear to conform while bypassing the ledger, reducer, or resume adapter. Mitigation: require manifest-derived conformance fixtures, explicit write sets, and fail-closed checks for missing ports.
- **Version drift during phase 010** — independent mode workstreams may evolve the contract after it is frozen. Mitigation: require an interface version bump, compatibility fixture update, and parent handoff review before any contract change.
- **Cross-mode coupling remains implicit** — shared deep-improvement and review/alignment behavior may be encoded in individual contracts. Mitigation: reserve implementation hoisting for `002-cross-mode-closures` and require the contract to expose dependencies and write sets without duplicating them.
- **Resume ambiguity** — legacy and ledger state can disagree during the additive-dark period. Mitigation: require explicit upcast/pin/fork/migrate/block outcomes, replay fingerprint checks, and receipt/effect recovery references.
- **Dependencies**: `006-transition-authorized-ledger-core/spec.md`, `007-shared-evidence-and-control-services/spec.md`, `011-convergence-termination-and-health/spec.md`, `manifest/phase-tree.json`, and the parent `../spec.md` are the source contracts; phase 010 consumes this phase's frozen interface.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which concrete type-system representation and package boundary will carry `ModeContract` without making the phase-003 envelope or phase-004 service implementations depend on mode packages?
- Which interface versioning policy distinguishes a reducer-semantic change from a wire-schema change, and which changes require an upcaster versus a hard compatibility refusal?
- Which certificate evidence is mandatory for a shadow-parity mode gate, and which evidence is reserved for phase-011 authority cutover?
- Which convergence hook outputs are observations only, and which may request a stop or allocation decision through the phase-008 gateway?
- Which resume classifications can be safely automated for each of the eight modes, and which must remain explicit `block` outcomes until phase 005 state-classification evidence exists?

These decisions are resolved while authoring the frozen interface and its fixtures. They do not authorize implementation or authority movement in this Planned phase.
<!-- /ANCHOR:questions -->
