---
title: "Checklist: Mixed-Version Fixtures"
description: "Blocking verifier checklist for sealed mixed-version event and state fixtures, deterministic replay, resume classification, and shadow-parity readiness."
trigger_phrases:
  - "mixed-version fixtures checklist"
  - "deep-loop version drift verification"
  - "sealed replay fixture gate"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/009-shared-mode-contracts-and-fixtures/003-mixed-version-fixtures"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/009-shared-mode-contracts-and-fixtures/003-mixed-version-fixtures"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined the blocking mixed-version fixture verification contract"
    next_safe_action: "Execute sealed mixed-version cases through reducer and parity gates"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Mixed-Version Fixtures

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for the mixed-version fixture corpus. The verifier derives required
workstream rows from `manifest/phase-tree.json`, binds each case to the fixture, interface, phase-004 seal, and phase-005
compatibility identities, and records scenario counts, digest references, version/hop traces, reducer outcomes, resume
classifications, replay components, projection results, parity divergences, and rerun stability. A missing scenario,
unsealed input, unsupported version, guessed upcaster, incomplete observation, duplicate effect, nondeterministic rerun,
or authority mutation fails the gate. No mixed-version evidence means no parity or cutover claim.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The parent outcome, adjacency, and phase-009 sequencing rules are pinned to `../../manifest/phase-tree.json`
- [ ] CHK-002 [P0] Phase-004 sealed-reference-artifact rules and phase-005 upcaster/dual-read and shadow-parity rules are reconciled into the fixture matrix
- [ ] CHK-003 [P0] The four required scenarios are named: `pure-old`, `pure-new`, `mid-upgrade`, and `interrupted-migration`
- [ ] CHK-004 [P0] Event and state version inventories, supported adjacent hops, causal-boundary fields, and comparable pairs are explicit
- [ ] CHK-005 [P1] The fixture envelope, expected-outcome schema, failure vocabulary, and stable namespace reject unknown required versions
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-006 [P0] Every case records mode/workstream, scenario, fixture/interface version, event/state versions, boundary, source identities, and expected outcome
- [ ] CHK-007 [P0] Expected reducer and resume outcomes are authored contract evidence and are not generated from the implementation under test
- [ ] CHK-008 [P0] Event and state versions are validated independently; unsupported pairs, guessed defaults, and implicit version inference fail closed
- [ ] CHK-009 [P1] Upcaster observations retain stored/effective versions, exact adjacent hop traces, immutable source references, and typed errors
- [ ] CHK-010 [P1] Fixture changes create new identities and never mutate existing sealed bytes, expected outputs, parity evidence, or certificates
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-011 [P0] Pure-old controls read old event/state forms, preserve source evidence, and reproduce the pinned legacy expectation
- [ ] CHK-012 [P0] Pure-new controls read current event/state forms without unnecessary upcasts and reproduce current expected outputs
- [ ] CHK-013 [P0] Mid-upgrade fixtures contain old records before a current boundary write, new records after it, and explicit mixed state expectations
- [ ] CHK-014 [P0] Interrupted-migration fixtures seal the stop point, pending effects, receipts, lease/fencing state, continuity identity, and restart outcome
- [ ] CHK-015 [P0] All eight manifest rows are covered: `001-deep-research`, `002-deep-review`, `003-deep-ai-council`, `004-deep-improvement-common`, `005-agent-improvement`, `006-model-benchmark`, `007-skill-benchmark`, and `008-deep-alignment`
- [ ] CHK-016 [P0] Deep-improvement-common is ordered before `005-agent-improvement`, `006-model-benchmark`, and `007-skill-benchmark` in fixture and handoff outputs
- [ ] CHK-017 [P0] Every replay-affecting input is a phase-004 verified digest reference; altered bytes, missing descriptors, aliases, mutable paths, and wrong order block execution
- [ ] CHK-018 [P0] Supported cases apply only exact phase-005 adjacent upcaster chains and reject gaps, cycles, future versions, ambiguous shapes, lossy output, and identity mutation
- [ ] CHK-019 [P0] Reducer fixtures verify accepted/rejected events, state transitions, terminal result, pending effects, receipts, and artifacts against authored expectations
- [ ] CHK-020 [P0] Resume fixtures produce deterministic `upcast`, `pin-legacy`, `fork`, `migrate`, or `block` outcomes from sealed restart inputs
- [ ] CHK-021 [P0] Legacy and dark runs consume one identical sealed capsule in isolated roots and preserve legacy authority and shadow-only effects
- [ ] CHK-022 [P0] Replay components, reducer state, legacy projections, parity classification, and evidence identity reproduce across deterministic reruns
- [ ] CHK-023 [P0] Input inequality, causal mismatch, missing observation, reducer divergence, projection mismatch, and nondeterminism block parity and certificate eligibility
- [ ] CHK-024 [P1] Interrupted restarts do not duplicate accepted effects and preserve the receipt, lease/fencing, and continuity evidence set
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-025 [P0] Every required scenario/workstream row is present or has an explicit contract-backed shared-row reason; no row is silently omitted
- [ ] CHK-026 [P1] Every repaired fixture reruns the complete affected case closure under current seal, contract, upcaster, reducer, projection, and comparator identities
- [ ] CHK-027 [P1] No fixture failure is waived, auto-rebaselined, normalized, or closed without current green rerun evidence
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-028 [P0] Sealed bytes are verified before release and unledgered environment values, credentials, host state, caches, and mutable aliases cannot enter a trusted case
- [ ] CHK-029 [P0] Shadow roots and effect sinks cannot resolve to authoritative files, live services, external network effects, or the other path's mutable output
- [ ] CHK-030 [P1] Version and divergence diagnostics are bounded and redact protected payloads and secrets while retaining reproduction digests and contract identities
- [ ] CHK-031 [P1] Fixture, parity, and certificate APIs cannot write authority controls, disable legacy writers, or redirect authoritative readers
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-032 [P1] `spec.md`, `plan.md`, `tasks.md`, and this checklist cross-reference the parent, manifest, phase-004 sealed artifacts, phase-005 upcasters, and phase-005 shadow parity
- [ ] CHK-033 [P1] The fixture matrix records scenario family, event/state versions, causal boundary, seal identities, expected outcomes, and downstream parity use
- [ ] CHK-034 [P2] Operator diagnostics name the case, first failing version/hop or boundary, expected/actual classification, owner, and rerun command without suggesting a waiver
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-035 [P0] Authored changes are limited to the four phase documents; `description.json` and `graph-metadata.json` remain deterministic-tool outputs
- [ ] CHK-036 [P1] Fixture capsules, sealed inputs, replay evidence, parity outputs, and generated caches resolve to declared isolated roots and never mutate adjacent research or phase folders
- [ ] CHK-037 [P1] Immutable seals, expected outcomes, upcaster traces, divergence records, certificates, and audit receipts remain retained under replay and rollback policy
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase passes only when the manifest-derived corpus covers every required workstream and all four scenario families,
every case starts from verified phase-004 sealed inputs, phase-005 compatibility behavior is exercised without guessed
transforms, reducers and resumes match authored expectations, shadow parity uses one isolated capsule, and deterministic
reruns remain stable. Unsupported versions, seal drift, causal mismatch, incomplete observations, duplicate effects,
open divergences, or authority mutation keep the phase Planned and block downstream evidence.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the blocking verifier binds the exact manifest, fixture, seal, upcaster, reducer, projection, and
comparator identities, records the four scenario and eight workstream closures, verifies deterministic mixed-version
replay and interrupted restart behavior, and confirms no tracked, live-state, external-effect, or authority mutation.
Until then the phase remains Planned and every checklist item stays unchecked.
<!-- /ANCHOR:sign-off -->
