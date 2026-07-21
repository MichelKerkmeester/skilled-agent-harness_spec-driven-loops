---
title: "Checklist: Agent Improvement - Sealed Reference Artifacts"
description: "Blocking verification checklist for Agent Improvement sealed AgentIR, proposal, trial, trajectory, behavior-family, canary, and promotion references layered on the deep-improvement-common sealing contract."
trigger_phrases:
  - "agent improvement sealed artifacts checklist"
  - "agent improvement tamper evident verification"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/003-sealed-artifacts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/003-sealed-artifacts"
    last_updated_at: "2026-07-15T20:50:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined checks for AgentIR lineage, sealed trials, canaries, and common-service reuse"
    next_safe_action: "Run the agent seal verifier after shared contracts are frozen"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Agent Improvement - Sealed Reference Artifacts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for the Agent Improvement sealed-artifacts phase. Every item is a future
implementation check; the phase remains Planned and unchecked until runtime evidence exists. Each report pins the candidate
SHA, predecessor reducer fingerprint, shared sealing-primitive and adapter fingerprints, AgentIR/change-contract fixture
digest, commands, exit codes, artifact counts, exposure epochs, and read or promotion outcomes. Any alternate seal, mutable
overwrite, accepted tampered read, hidden-evidence leak, missing dependency, executor mismatch, or common-service fork fails
the gate.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] `002-reducers-and-projections` artifact-reference, evaluator-epoch, canary-status, promotion-status, and projection-fingerprint inputs are frozen
- [ ] CHK-002 [P0] The shared phase-007 sealing primitive and deep-improvement-common adapter record canonicalization, digest, dependency, seal-on-write, publication, verification, lifecycle, and failure semantics
- [ ] CHK-003 [P1] The AgentIR, change-contract, improver, causal, candidate, trajectory, behavior-family, executor, four-ring, canary, and successor-binding field matrix is complete
- [ ] CHK-004 [P1] Ownership boundaries exclude common evaluator/canary/promotion implementation, reducer and ledger logic, shadow/rollback/mode gates, and successor certificate/receipt materialization
- [ ] CHK-005 [P1] Valid, mutated, partial-write, missing-dependency, stale-epoch, hidden-leak, executor-mismatch, insufficient-evidence, and mixed-version fixtures are pinned
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-006 [P0] Every agent artifact kind uses the shared phase-007-backed sealing adapter; no second digest, signature, chain, manifest, storage, or verification scheme exists
- [ ] CHK-007 [P0] Digest coverage includes canonical AgentIR or artifact bytes, kind, schema version, and ordered dependency closure for inheritance, capabilities, evaluator, executor, fixtures, and lineage
- [ ] CHK-008 [P0] Sealed bytes are immutable, writes are atomic, incomplete artifacts are unreadable, and every covered AgentIR, clause, operator, evaluator, executor, fixture, seed, or dependency change creates a new identity
- [ ] CHK-009 [P1] Scope is limited to agent-specific sealed references, common-service bindings, fixtures, visibility, and verification; no authority cutover or adjacent cleanup is included
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-010 [P0] Equivalent AgentIR, change-contract, improver, and dependency inputs produce identical content-addressed references and every covered mutation produces a new identity
- [ ] CHK-011 [P0] Interrupted, retried, duplicate, concurrent, and truncated writes never publish partial content or overwrite an existing sealed reference
- [ ] CHK-012 [P0] Tampered AgentIR, inheritance, patch, proposal, trajectory, manifest, dependency, lifecycle, hidden commitment, epoch, visibility, and executor fields fail closed with typed read results
- [ ] CHK-013 [P0] Base AgentIR fixtures bind component IDs, inheritance, authority/capability policy, tools, routing, memory, inference, executor, and parent lineage
- [ ] CHK-014 [P0] Change-contract fixtures bind typed patch operations, changed and inherited clauses, intended and preserved behavior, static assertions, trace policies, scenarios, and behavioral-semver impact
- [ ] CHK-015 [P0] Improver-lane fixtures bind model/build, optimizer version, train/dev/sealed corpora, mutation policy, visibility, query budget, and frozen candidate lineage
- [ ] CHK-016 [P0] Causal proposal fixtures preserve failure clusters, first-divergent traces, known-defect loci, interventions, bounded diagnostic evidence, parent lineage, and candidate package bytes
- [ ] CHK-017 [P0] Trial and trajectory fixtures retain evaluator epoch, task and behavior family, semantic variants, seed, executor/environment, raw normalized traces, side effects, predicates, and integrity observations
- [ ] CHK-018 [P0] Coverage fixtures exercise clause, authority-conflict, transition, side-effect, negative-capability, perturbation, untouched-family, semantic-variant, executor, and rotating-canary obligations
- [ ] CHK-019 [P0] Four-ring exposure fixtures distinguish visible optimizer cases, sealed semantic variants, untouched-family sentinels, and rotating canaries and record exposure/retirement epochs
- [ ] CHK-020 [P0] Missing, stale, leaked, quarantined, unsupported, superseded, executor-mismatched, and insufficient-evidence references cannot reach evaluator acceptance or promotion eligibility
- [ ] CHK-021 [P0] Candidate-facing reads exclude hidden fixtures, exact evaluator internals, exact terminal scores, terminal evidence, and mutable service state
- [ ] CHK-022 [P1] Re-reduction, evaluator-epoch, normalization, and canary-retirement fixtures preserve raw sealed artifacts while creating new derived references without mutation or silent reinterpretation
- [ ] CHK-023 [P1] Common evaluator, canary, scoring, redaction, promotion-input, and veto fixtures pass through the agent binding with identical shared semantics
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-024 [P1] The agent artifact-to-service manifest enumerates every AgentIR, change, improver, causal, candidate, trajectory, behavior-family, executor, four-ring, canary, and successor reference
- [ ] CHK-025 [P1] The successor integration binds verified agent digests and rollback references without moving certificate, receipt, or effect-recovery materialization into this phase
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-026 [P0] Proposal and candidate adapters cannot write sealed evaluator assets, hidden fixtures, canary content, promotion thresholds, prior evidence, or projection state
- [ ] CHK-027 [P0] Semantic canary leakage, evaluator-integrity failure, stale evidence, dependency mismatch, and executor mismatch produce non-overridable sealed veto or quarantine references
- [ ] CHK-028 [P1] Query visibility, exact-score withholding, hidden-suite isolation, improver freeze, and typed budget policy are enforced at service boundaries rather than stated only in prose
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-029 [P1] AgentIR and change-contract fields, sealing ownership, causal proposal evidence, trajectory references, behavior-family coverage, four-ring lifecycle, read failures, and successor expectations are reflected in the phase docs
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-030 [P1] Implementation and fixture changes land in dependency-closed, path-scoped commits after the reducer and shared sealing contracts are pinned
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 verifier check passes, the report pins the reducer and shared-sealing fingerprints, every
agent input and output class is content-addressed and immutable, causal and behavior-family evidence remains reproducible,
tampered or incomplete reads fail closed, common services show no semantic fork, and the successor receives a complete verified
reference bundle.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the verifier confirms the P0 contract, the strict spec validator passes, and the exact-scope diff check shows
no unexpected tracked mutation outside the implementation surface assigned to this phase.
<!-- /ANCHOR:sign-off -->
