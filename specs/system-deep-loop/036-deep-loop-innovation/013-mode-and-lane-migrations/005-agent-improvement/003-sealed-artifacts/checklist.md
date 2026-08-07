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
    last_updated_at: "2026-07-23T21:06:42Z"
    last_updated_by: "codex"
    recent_action: "Verified kind integrity for every named artifact reference"
    next_safe_action: "Consume the verified bindings in the certificate and receipt successor"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Checklist: Agent Improvement - Sealed Reference Artifacts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for the Agent Improvement sealed-artifacts phase. The implementation evidence
is the scoped module, the real-store unit suite, the unchanged shared adapter and sealer, the TypeScript gate, and strict packet
validation. Any alternate seal, mutable overwrite, accepted tampered or wrong-kind read, hidden-evidence leak, missing
dependency, executor mismatch, or common-service fork fails the gate.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] `002-reducers-and-projections` artifact-reference, evaluator-epoch, canary-status, promotion-status, and projection-fingerprint inputs are frozen [evidence: implementation-summary.md records the scoped delivery; focused real-store Vitest passed 45/45 and runtime tsc grep-own was 0]
- [x] CHK-002 [P0] The shared phase-007 sealing primitive and deep-improvement-common adapter record canonicalization, digest, dependency, seal-on-write, publication, verification, lifecycle, and failure semantics [evidence: implementation-summary.md records the scoped delivery; focused real-store Vitest passed 45/45 and runtime tsc grep-own was 0]
- [x] CHK-003 [P1] The AgentIR, change-contract, improver, causal, candidate, trajectory, behavior-family, executor, four-ring, canary, and successor-binding field matrix is complete [evidence: implementation-summary.md records the scoped delivery; focused real-store Vitest passed 45/45 and runtime tsc grep-own was 0]
- [x] CHK-004 [P1] Ownership boundaries exclude common evaluator/canary/promotion implementation, reducer and ledger logic, shadow/rollback/mode gates, and successor certificate/receipt materialization [evidence: implementation-summary.md records the scoped delivery; focused real-store Vitest passed 45/45 and runtime tsc grep-own was 0]
- [x] CHK-005 [P1] Valid, mutated, partial-write, missing-dependency, stale-epoch, hidden-view, executor-mismatch, and wrong-kind fixtures are pinned [evidence: implementation-summary.md records the scoped delivery; focused real-store Vitest passed 45/45 and runtime tsc grep-own was 0]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-006 [P0] Every agent artifact kind uses the shared phase-007-backed sealing adapter; no second digest, signature, chain, manifest, storage, or verification scheme exists [evidence: implementation-summary.md records the scoped delivery; focused real-store Vitest passed 45/45 and runtime tsc grep-own was 0]
- [x] CHK-007 [P0] Digest coverage includes canonical AgentIR or artifact bytes, kind, schema version, and ordered dependency closure for inheritance, capabilities, evaluator, executor, fixtures, and lineage [evidence: implementation-summary.md records the scoped delivery; focused real-store Vitest passed 45/45 and runtime tsc grep-own was 0]
- [x] CHK-008 [P0] Sealed bytes are immutable, writes are atomic, incomplete artifacts are unreadable, and covered material or dependency changes create a new identity [evidence: implementation-summary.md records the scoped delivery; focused real-store Vitest passed 45/45 and runtime tsc grep-own was 0]
- [x] CHK-009 [P1] Scope is limited to agent-specific sealed references, common-service bindings, fixtures, visibility, and verification; no authority cutover or adjacent cleanup is included [evidence: implementation-summary.md records the scoped delivery; focused real-store Vitest passed 45/45 and runtime tsc grep-own was 0]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-010 [P0] Equivalent canonical inputs produce identical content-addressed references and a covered material mutation produces a new identity [evidence: implementation-summary.md records the scoped delivery; focused real-store Vitest passed 45/45 and runtime tsc grep-own was 0]
- [x] CHK-011 [P0] Interrupted and truncated writes remain unreadable, while duplicate equivalent seals preserve the existing immutable reference [evidence: implementation-summary.md records the scoped delivery; focused real-store Vitest passed 45/45 and runtime tsc grep-own was 0]
- [x] CHK-012 [P0] Tampered, unsealed, truncated, missing-dependency, policy-mismatched, binding-wrong-kind, and named-reference-wrong-kind inputs fail closed with typed results [evidence: implementation-summary.md records the scoped delivery; focused real-store Vitest passed 45/45 and runtime tsc grep-own was 0]
- [x] CHK-013 [P0] Base AgentIR fixtures bind component IDs, inheritance, authority/capability policy, tools, routing, memory, inference, executor, and parent lineage [evidence: implementation-summary.md records the scoped delivery; focused real-store Vitest passed 45/45 and runtime tsc grep-own was 0]
- [x] CHK-014 [P0] Change-contract fixtures bind typed patch operations, changed and inherited clauses, intended and preserved behavior, static assertions, trace policies, scenarios, and behavioral-semver impact [evidence: implementation-summary.md records the scoped delivery; focused real-store Vitest passed 45/45 and runtime tsc grep-own was 0]
- [x] CHK-015 [P0] Improver-lane fixtures bind model/build, optimizer version, train/dev/sealed corpora, mutation policy, visibility, query budget, and frozen candidate lineage [evidence: implementation-summary.md records the scoped delivery; focused real-store Vitest passed 45/45 and runtime tsc grep-own was 0]
- [x] CHK-016 [P0] Causal proposal fixtures preserve failure clusters, first-divergent traces, known-defect loci, interventions, bounded diagnostic evidence, parent lineage, and candidate package bytes [evidence: implementation-summary.md records the scoped delivery; focused real-store Vitest passed 45/45 and runtime tsc grep-own was 0]
- [x] CHK-017 [P0] Trial and trajectory fixtures retain evaluator epoch, task and behavior family, semantic variants, seed, executor/environment, raw normalized traces, side effects, predicates, and integrity observations [evidence: implementation-summary.md records the scoped delivery; focused real-store Vitest passed 45/45 and runtime tsc grep-own was 0]
- [x] CHK-018 [P0] Coverage fixtures exercise clause, authority-conflict, transition, side-effect, negative-capability, perturbation, untouched-family, semantic-variant, executor, and rotating-canary obligations [evidence: implementation-summary.md records the scoped delivery; focused real-store Vitest passed 45/45 and runtime tsc grep-own was 0]
- [x] CHK-019 [P0] Four-ring exposure fixtures distinguish visible optimizer cases, sealed semantic variants, untouched-family sentinels, and rotating canaries and record exposure/retirement epochs [evidence: implementation-summary.md records the scoped delivery; focused real-store Vitest passed 45/45 and runtime tsc grep-own was 0]
- [x] CHK-020 [P0] Missing dependencies, stale epochs, executor mismatches, and wrong-kind named references cannot return usable artifact bytes [evidence: implementation-summary.md records the scoped delivery; focused real-store Vitest passed 45/45 and runtime tsc grep-own was 0]
- [x] CHK-021 [P0] Candidate-facing reads exclude hidden fixtures, exact evaluator internals, exact terminal scores, terminal evidence, and mutable service state [evidence: implementation-summary.md records the scoped delivery; focused real-store Vitest passed 45/45 and runtime tsc grep-own was 0]
- [x] CHK-022 [P1] Canonical replay and policy mismatch checks preserve raw sealed artifacts without mutation or silent reinterpretation [evidence: implementation-summary.md records the scoped delivery; focused real-store Vitest passed 45/45 and runtime tsc grep-own was 0]
- [x] CHK-023 [P1] Common evaluator, candidate-view, canary, raw-trial, and promotion reads remain delegated through the unchanged shared adapter [evidence: implementation-summary.md records the scoped delivery; focused real-store Vitest passed 45/45 and runtime tsc grep-own was 0]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-024 [P1] The agent artifact-to-service manifest enumerates every AgentIR, change, improver, causal, candidate, trajectory, behavior-family, executor, four-ring, canary, and successor reference [evidence: implementation-summary.md records the scoped delivery; focused real-store Vitest passed 45/45 and runtime tsc grep-own was 0]
- [x] CHK-025 [P1] The successor integration binds verified agent digests and rollback references without moving certificate, receipt, or effect-recovery materialization into this phase [evidence: implementation-summary.md records the scoped delivery; focused real-store Vitest passed 45/45 and runtime tsc grep-own was 0]
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-026 [P0] Proposal and candidate adapters cannot write sealed evaluator assets, hidden fixtures, canary content, promotion thresholds, prior evidence, or projection state [evidence: implementation-summary.md records the scoped delivery; focused real-store Vitest passed 45/45 and runtime tsc grep-own was 0]
- [x] CHK-027 [P0] Dependency, artifact-kind, evaluator-epoch, and executor mismatches produce typed refusal without bytes [evidence: implementation-summary.md records the scoped delivery; focused real-store Vitest passed 45/45 and runtime tsc grep-own was 0]
- [x] CHK-028 [P1] Query visibility, exact-score withholding, hidden-suite isolation, improver freeze, and typed budget policy are enforced at service boundaries rather than stated only in prose [evidence: implementation-summary.md records the scoped delivery; focused real-store Vitest passed 45/45 and runtime tsc grep-own was 0]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-029 [P1] AgentIR and change-contract fields, sealing ownership, causal proposal evidence, trajectory references, behavior-family coverage, four-ring lifecycle, read failures, and successor expectations are reflected in the phase docs [evidence: implementation-summary.md records the scoped delivery; focused real-store Vitest passed 45/45 and runtime tsc grep-own was 0]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-030 [P1] Implementation and fixture changes remain dependency-closed and path-scoped after the reducer and shared sealing contracts are pinned [evidence: implementation-summary.md records the scoped delivery; focused real-store Vitest passed 45/45 and runtime tsc grep-own was 0]
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:evidence -->
## Verification Evidence

| Checks | Evidence |
|---|---|
| CHK-001–005 | The leaf specification and plan define the frozen boundaries; the implementation imports the landed ledger types, shared adapter, and shared immutable store without editing them |
| CHK-006–009 | `agent-improvement-artifact-material.ts` and `agent-improvement-sealed-artifacts.ts` contain the only agent-specific canonicalization/read adapter; scoped Git status is the blast-radius check |
| CHK-010–023 | `agent-improvement-sealed-artifacts.vitest.ts`: 45/45 against the real store, including 37 wrong-kind rejection plus correct-kind seal/read controls |
| CHK-024–029 | `implementation-summary.md` records the complete field-to-kind map, common-service boundary, successor API, visibility boundary, and typed refusal evidence |
| CHK-030 | Final scoped status is limited to this module, its unit test, and this leaf's documentation |
<!-- /ANCHOR:evidence -->

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
