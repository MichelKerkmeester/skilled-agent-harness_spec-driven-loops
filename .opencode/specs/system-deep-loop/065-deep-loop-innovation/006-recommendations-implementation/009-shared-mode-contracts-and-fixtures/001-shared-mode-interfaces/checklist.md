---
title: "Checklist: shared mode interfaces (009 phase 001)"
description: "Checklist for phase 001 of the 009 shared-mode-contracts-and-fixtures parent: verify the frozen typed mode interface, version matrix, and conformance fixtures before phase 010."
trigger_phrases:
  - "shared mode interfaces checklist"
  - "deep-loop mode contract verification"
  - "phase 009 interface conformance"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/009-shared-mode-contracts-and-fixtures/001-shared-mode-interfaces"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/009-shared-mode-contracts-and-fixtures/001-shared-mode-interfaces"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined the planned P0 conformance checks for the shared mode contract"
    next_safe_action: "Run the manifest-derived interface and mixed-version fixture matrix"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Shared Mode Interfaces

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for phase 001. The verifier derives the mode rows from `manifest/phase-tree.json`, binds each check to the frozen interface version, records fixture names and exit outcomes, and fails on missing ports, unowned writes, nondeterministic replay, unsupported version transitions, or any evidence that grants authority before phase 011.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The parent outcome, phase adjacency, and `mode_workstreams_phase_010` list are pinned to the reviewed phase-tree manifest
- [ ] CHK-002 [P0] Phase-003 ledger/envelope, phase-004 evidence/control services, and phase-008 convergence/health contracts are reconciled in the source-to-port matrix
- [ ] CHK-003 [P1] The boundary with `002-cross-mode-closures` is explicit; this phase freezes interfaces and write sets without hoisting shared implementations
- [ ] CHK-004 [P2] The interface version baseline and fixture namespace are recorded before mode-specific work begins
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-005 [P0] Every mode-provided type and method has one owner, typed inputs/outputs, version semantics, and an evidence reference
- [ ] CHK-006 [P0] Every consumed substrate port names its owning phase and does not duplicate or weaken phase-003, phase-004, or phase-008 policy
- [ ] CHK-007 [P1] Every persisted field has one reducer owner and every write set is explicit; hidden mutable side effects are rejected
- [ ] CHK-008 [P2] Interface changes are classified as additive, deprecated, semantic, or breaking with the matching adapter or refusal rule
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-009 [P0] Event fixtures prove stable type/version/transition metadata and fail closed for direct, unauthorized, stale, or missing authorization writes
- [ ] CHK-010 [P0] Reducer fixtures prove deterministic replay, immutable outputs, duplicate-event behavior, and single ownership
- [ ] CHK-011 [P0] Sealed-artifact and certificate fixtures prove digest binding, source-event references, validity scope, producer version, and invalidation handling
- [ ] CHK-012 [P0] Convergence fixtures cover path coverage, cycle signals, stopping clocks, value-of-computation, health, and degeneration through typed hooks
- [ ] CHK-013 [P0] Resume fixtures cover upcast, pin-legacy, fork, migrate, block, replay-fingerprint mismatch, lease/fencing loss, pending effects, receipts, and continuity identities
- [ ] CHK-014 [P0] Mixed-version fixtures cover additive, deprecated, semantic, and breaking interface changes with deterministic adapter or fail-closed outcomes
- [ ] CHK-015 [P0] The manifest-derived matrix covers all eight rows: `001-deep-research`, `002-deep-review`, `003-deep-ai-council`, `004-deep-improvement-common`, `005-agent-improvement`, `006-model-benchmark`, `007-skill-benchmark`, and `008-deep-alignment`
- [ ] CHK-016 [P0] Deep-improvement-common is ordered before `005-agent-improvement`, `006-model-benchmark`, and `007-skill-benchmark` in the conformance and handoff outputs
- [ ] CHK-017 [P0] Write-set conflict fixtures identify conflicting mode/service ownership and reject parallel execution without an explicit serialization or lease rule
- [ ] CHK-018 [P0] Shadow-parity fixtures prove the interface supports legacy projections and rejects authority before the phase-011 cutover certificate
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-019 [P1] The typed contract covers event schema, reducers, sealed artifacts, certificates, convergence hooks, resume adapters, versioning, and write sets without an unreviewed mode exception
- [ ] CHK-020 [P1] The phase-010 handoff names the frozen interface version, fixture set, dependency assumptions, and required evidence for each mode
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-021 [P1] The contract cannot bypass transition authorization, artifact sealing, budget limits, locks/fencing, receipt recovery, or continuity identity checks
- [ ] CHK-022 [P2] Incompatible readers, unknown event types, invalid certificates, and unclassified resume states fail closed without guessed defaults
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-023 [P1] `spec.md`, `plan.md`, `tasks.md`, and this checklist cross-reference the parent, manifest, phase-003, phase-004, and phase-008 source contracts
- [ ] CHK-024 [P2] The successor `002-cross-mode-closures` and phase-010 mode workstreams have a clear handoff from the frozen interface
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-025 [P1] Authored changes are limited to the four phase-001 documents; generated metadata is produced later by deterministic tooling
- [ ] CHK-026 [P2] Fixture and conformance artifacts are scoped to the phase contract and do not mutate research inputs or adjacent phase folders
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 interface and fixture check passes, all eight phase-010 rows conform to one frozen versioned contract, mixed-version and resume outcomes are deterministic, write-set conflicts are explicit, and the phase handoff preserves additive-dark authority until phase 011.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the verifier records the contract version, manifest-derived mode matrix, source-to-port matrix, fixture outcomes, and confirms that no phase-010 interface declaration moves authority from the legacy path.
<!-- /ANCHOR:sign-off -->
