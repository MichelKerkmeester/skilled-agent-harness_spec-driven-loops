---
title: "Checklist: Deep Improvement Common Services - Sealed Reference Artifacts"
description: "Blocking verification checklist for the phase-003-backed sealed evaluator, candidate, trial, canary, and promotion reference artifacts in the deep-improvement common-services migration."
trigger_phrases:
  - "deep improvement sealed artifacts checklist"
  - "deep improvement tamper evident verification"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/003-sealed-artifacts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/003-sealed-artifacts"
    last_updated_at: "2026-07-15T20:45:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined checks for seal reuse, dependency closure, tamper reads, canaries, and promotion inputs"
    next_safe_action: "Run the seal verifier after the phase-003 primitive and reducer contracts are frozen"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Deep Improvement Common Services - Sealed Reference Artifacts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for the sealed reference-artifacts phase. Every item is a check the paired
verify agent runs before the candidate implementation lands; each report pins the candidate SHA, phase-003 sealing primitive
fingerprint, predecessor reducer fingerprint, artifact-fixture digest, commands, exit codes, artifact counts, and read or
promotion outcomes. Any alternate sealing scheme, mutable overwrite, accepted tampered read, hidden-evidence leak, missing
dependency, or downstream contract fork fails the gate.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] `002-reducers-and-projections` artifact-reference, evaluator-epoch, canary-status, promotion-status, and projection-fingerprint inputs are frozen
- [ ] CHK-002 [P0] The phase-003 sealing primitive contract records canonicalization, digest, dependency, seal-on-write, publication, verification, and failure semantics
- [ ] CHK-003 [P1] Artifact field and dependency matrix names every sealed input/output, producer, consumer, visibility rule, and lifecycle state
- [ ] CHK-004 [P1] Ownership boundaries exclude `004-certificates-and-receipts`, the three downstream variants, typed-ledger schema, and reducer implementation
- [ ] CHK-005 [P1] Valid, mutated, partial-write, missing-dependency, stale-epoch, stale-canary, leak, and mixed-version fixtures are pinned
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-006 [P0] Every artifact kind uses the phase-003 sealing adapter; no second digest, signature, chain, manifest, storage, or verification scheme exists
- [ ] CHK-007 [P0] Digest coverage includes canonical bytes, artifact kind, schema version, and ordered dependency closure; omitted dependencies are rejected
- [ ] CHK-008 [P0] Sealed bytes are immutable, writes are atomic, incomplete artifacts are not readable, and a new identity is required for every content or dependency change
- [ ] CHK-009 [P1] Scope is limited to common sealed references, service boundaries, fixtures, and verification; no adjacent phase cleanup or authority cutover is included
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-010 [P0] Equivalent canonical inputs produce identical artifact references and every covered content, schema, producer, fixture, calibration, or dependency mutation produces a new identity
- [ ] CHK-011 [P0] Interrupted, retried, duplicate, and concurrent writes never publish partial content or overwrite an existing sealed artifact
- [ ] CHK-012 [P0] Tampered bytes, manifests, dependency references, lifecycle fields, hidden commitments, and evaluator epochs fail closed with typed read results
- [ ] CHK-013 [P0] Evaluator capsule fixtures bind profile, rubric, fixtures, hidden commitments, calibration, normalization, environment, capabilities, visibility, budget, and one epoch digest
- [ ] CHK-014 [P0] Candidate and baseline fixtures retain lineage, incumbent, mutation operator, profile, model/prompt/tool settings, seed, fixture selection, and prerequisite digests
- [ ] CHK-015 [P0] Raw trial fixtures retain per-case outputs, raw score vectors, trace/rationale references, usage, cost, latency, environment, integrity observations, and normalization version
- [ ] CHK-016 [P0] Canary fixtures cover sealed/active/burned/retired lifecycle, freshness, supersession, hidden isolation, literal/semantic leakage, adversarial cases, and metamorphic references
- [ ] CHK-017 [P0] Promotion input fixtures require target repair, baseline preservation, critical dimensions, evaluator integrity, canary results, uncertainty, cost, vetoes, and rollback target
- [ ] CHK-018 [P0] Missing, stale, leaked, quarantined, unsupported, superseded, and epoch-mismatched artifacts cannot reach evaluator acceptance or ship eligibility
- [ ] CHK-019 [P0] Candidate-facing reads exclude hidden fixtures, exact evaluator internals, exact scores, terminal evidence, and mutable service state
- [ ] CHK-020 [P1] Re-reduction and evaluator-epoch fixtures preserve raw sealed artifacts while creating new derived references without mutation or silent reinterpretation
- [ ] CHK-021 [P1] Common, agent, model, and skill adapters pass identical seal, evaluator, canary, read-failure, promotion-input, and veto fixtures
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-022 [P1] The artifact-to-service manifest enumerates every common sealed artifact, dependency digest, read verifier, lifecycle state, and required consumer
- [ ] CHK-023 [P1] The successor certificate/receipt integration binds sealed references without moving certificate or receipt materialization into this phase
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-024 [P0] Candidate mutation and evaluator adapters cannot write sealed evaluator assets, hidden fixtures, canary content, promotion thresholds, prior evidence, or projection state
- [ ] CHK-025 [P0] Semantic canary leakage, evaluator-integrity failure, stale evidence, and dependency mismatch produce non-overridable sealed veto references
- [ ] CHK-026 [P1] Query visibility, exact-score withholding, hidden-suite isolation, and typed budget policy are enforced at service boundaries rather than stated only in prose
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-027 [P1] Artifact field matrix, seal ownership, evaluator capsule, canary lifecycle, promotion input, read failures, and downstream consumer expectations are reflected in the phase docs
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-028 [P1] Implementation and fixture changes land in dependency-closed, path-scoped commits after the predecessor reducer and phase-003 sealing contracts are pinned
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 verifier check passes, the report pins the sealing and predecessor fingerprints, every
artifact class is content-addressed and immutable, tampered or incomplete reads fail closed, canary and promotion evidence
remain reproducible, and all three downstream variants consume one common contract without semantic drift.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the verifier confirms the P0 contract, the strict spec validator passes, and the exact-scope diff check
shows no unexpected tracked mutation outside the implementation surface assigned to this phase.
<!-- /ANCHOR:sign-off -->
