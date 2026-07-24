---
title: "Checklist: Deep Improvement Common Services - Sealed Reference Artifacts"
description: "Blocking verification checklist for the phase-007-backed sealed evaluator, candidate, trial, canary, and promotion reference artifacts in the deep-improvement common-services migration."
trigger_phrases:
  - "deep improvement sealed artifacts checklist"
  - "deep improvement tamper evident verification"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/003-sealed-artifacts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/003-sealed-artifacts"
    last_updated_at: "2026-07-24T03:09:03Z"
    last_updated_by: "opencode"
    recent_action: "Reconciled read mitigation with the frozen-store seal boundary"
    next_safe_action: "Verify successor certificate and receipt cross-artifact closure"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Checklist: Deep Improvement Common Services - Sealed Reference Artifacts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for the sealed reference-artifacts phase. Every item is a check the paired
verify agent runs before the candidate implementation lands; each report pins the candidate SHA, phase-007 sealing primitive
fingerprint, predecessor reducer fingerprint, artifact-fixture digest, commands, exit codes, artifact counts, and read or
promotion outcomes. Any alternate sealing scheme, mutable overwrite, accepted tampered read, hidden-evidence leak, missing
dependency, or downstream contract fork fails the gate.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] `002-reducers-and-projections` artifact-reference, evaluator-epoch, canary-status, promotion-status, and projection-fingerprint inputs are frozen [File: runtime/lib/deep-improvement-common-sealed-artifacts/deep-improvement-common-sealed-artifact-types.ts:1]
- [x] CHK-002 [P0] The phase-007 sealing primitive contract records canonicalization, digest, dependency, seal-on-write, publication, verification, and failure semantics [File: runtime/lib/sealed-reference-artifacts/sealed-artifact-store.ts:1]
- [x] CHK-003 [P1] Artifact field and dependency matrix names every sealed input/output, producer, consumer, visibility rule, and lifecycle state [File: runtime/lib/deep-improvement-common-sealed-artifacts/deep-improvement-common-artifact-material.ts:1]
- [x] CHK-004 [P1] Ownership boundaries exclude `004-certificates-and-receipts`, the three downstream variants, typed-ledger schema, and reducer implementation [File: implementation-summary.md:1]
- [x] CHK-005 [P1] Valid, mutated, partial-write, missing-dependency, stale-epoch, stale-canary, leak, and mixed-version fixtures are pinned [Test: deep-improvement-common-sealed-artifacts.vitest.ts - 12/12 passing]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-006 [P0] Every artifact kind uses the phase-007 sealing adapter; no second digest, signature, chain, manifest, storage, or verification scheme exists [File: runtime/lib/deep-improvement-common-sealed-artifacts/deep-improvement-common-sealed-artifacts.ts:1]
- [x] CHK-007 [P0] Digest coverage includes canonical bytes, artifact kind, schema version, and ordered dependency closure; omitted dependencies are rejected [Test: Vitest 76/76; deterministic identity and missing-dependency cases passing]
- [x] CHK-008 [P0] Sealed bytes are immutable, writes are atomic, incomplete artifacts are not readable, and a new identity is required for every content or dependency change [Test: Vitest 76/76; interrupted publication and deterministic identity cases passing]
- [x] CHK-009 [P1] Scope is limited to common sealed references, service boundaries, fixtures, and verification; no adjacent phase cleanup or authority cutover is included [Test: `git status --short -- <locked-paths>` scoped output]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-010 [P0] Equivalent canonical inputs produce identical artifact references and every covered content, schema, producer, fixture, calibration, or dependency mutation produces a new identity [Test: Vitest 76/76; deterministic identity case passing]
- [x] CHK-011 [P0] Interrupted, retried, duplicate, and concurrent writes never publish partial content or overwrite an existing sealed artifact [Test: Vitest 76/76; interrupted publication case passing; shared store atomic-write suite remains authoritative]
- [x] CHK-012 [P0] Tampered bytes, manifests, dependency references, lifecycle fields, hidden commitments, and evaluator epochs fail closed with typed read results; the frozen store's seal-time reference-borrowing boundary is mitigated by the leaf's read-time kind check [Test: Vitest 76/76; tamper, dependency, wrong-kind, and evaluator-epoch cases passing; boundary recorded in decision-record.md ADR-002]
- [x] CHK-013 [P0] Evaluator capsule fixtures bind profile, rubric, fixtures, hidden commitments, calibration, normalization, environment, capabilities, visibility, budget, and one epoch digest [File: runtime/tests/unit/deep-improvement-common-sealed-artifacts.vitest.ts:1]
- [x] CHK-014 [P0] Candidate and baseline fixtures retain lineage, incumbent, mutation operator, profile, model/prompt/tool settings, seed, fixture selection, and prerequisite digests [File: runtime/tests/unit/deep-improvement-common-sealed-artifacts.vitest.ts:1]
- [x] CHK-015 [P0] Raw trial fixtures retain per-case outputs, raw score vectors, trace/rationale references, usage, cost, latency, environment, integrity observations, and normalization version [File: runtime/tests/unit/deep-improvement-common-sealed-artifacts.vitest.ts:1]
- [x] CHK-016 [P0] Canary fixtures cover sealed/active/burned/retired lifecycle, freshness, supersession, hidden isolation, literal/semantic leakage, adversarial cases, and metamorphic references [File: runtime/lib/deep-improvement-common-sealed-artifacts/deep-improvement-common-artifact-material.ts:1]
- [x] CHK-017 [P0] Promotion input fixtures require target repair, baseline preservation, critical dimensions, evaluator integrity, canary results, uncertainty, cost, vetoes, and rollback target [Test: Vitest 76/76; promotion admissibility case passing]
- [x] CHK-018 [P0] Missing, stale, leaked, quarantined, unsupported, superseded, and epoch-mismatched artifacts cannot reach evaluator acceptance or ship eligibility [Test: Vitest 76/76; typed refusal suite includes mixed evaluator epoch]
- [x] CHK-019 [P0] Candidate-facing reads exclude hidden fixtures, exact evaluator internals, exact scores, terminal evidence, and mutable service state [Test: Vitest 76/76; redacted candidate-view case passing]
- [x] CHK-020 [P1] Re-reduction and evaluator-epoch fixtures preserve raw sealed artifacts while creating new derived references without mutation or silent reinterpretation [Test: Vitest 76/76; deterministic re-sealing and epoch-mismatch cases passing]
- [x] CHK-021 [P1] Common, agent, model, and skill adapters pass identical seal, evaluator, canary, read-failure, promotion-input, and veto fixtures [Test: Vitest 76/76; whole-runtime `tsc` exit code 0]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-022 [P1] The artifact-to-service manifest enumerates every common sealed artifact, dependency digest, read verifier, lifecycle state, and required consumer [File: runtime/lib/deep-improvement-common-sealed-artifacts/deep-improvement-common-sealed-artifact-types.ts:1]
- [x] CHK-023 [P1] The successor certificate/receipt integration binds sealed references without moving certificate or receipt materialization into this phase [File: implementation-summary.md:1 - Successor Contract]
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-024 [P0] Candidate mutation and evaluator adapters cannot write sealed evaluator assets, hidden fixtures, canary content, promotion thresholds, prior evidence, or projection state [Test: Vitest 76/76; candidate-access refusal and redacted-view cases passing]
- [x] CHK-025 [P0] Semantic canary leakage, evaluator-integrity failure, stale evidence, and dependency mismatch produce non-overridable sealed veto references [File: runtime/lib/deep-improvement-common-sealed-artifacts/deep-improvement-common-sealed-artifacts.ts:1]
- [x] CHK-026 [P1] Query visibility, exact-score withholding, hidden-suite isolation, and typed budget policy are enforced at service boundaries rather than stated only in prose [Test: Vitest 76/76; candidate-view exposes commitments and bounded budgets only]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-027 [P1] Artifact field matrix, seal ownership, evaluator capsule, canary lifecycle, promotion input, read failures, and downstream consumer expectations are reflected in the phase docs [File: implementation-summary.md:1; decision-record.md:1]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-028 [P1] Implementation and fixture changes land in dependency-closed, path-scoped commits after the predecessor reducer and phase-007 sealing contracts are pinned [Test: `git status --short -- <locked-paths>`; whole-runtime `tsc` exit code 0]
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 verifier check passes, the report pins the sealing and predecessor fingerprints, every
artifact class is content-addressed and immutable, tampered or incomplete reads fail closed, canary and promotion evidence
remain reproducible, all three downstream variants consume one common contract without semantic drift, and the frozen-store
seal-time reference-borrowing boundary plus the successor-owned cross-artifact closure obligation are explicit.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:frozen-boundary -->
## Frozen Substrate Boundary

- [x] CHK-029 [P1] The frozen phase-007 store's seal-time acceptance of a borrowed cross-artifact digest pair under a mismatched kind label is documented as an accepted substrate boundary; leaf-003 rejects mismatched declared references on read before releasing bytes, while leaf-004 owns full cross-artifact digest closure [File: `decision-record.md` ADR-002; `implementation-summary.md` Known Limitations and Successor Contract]
<!-- /ANCHOR:frozen-boundary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the verifier confirms the P0 contract, the strict spec validator passes, and the exact-scope diff check
shows no unexpected tracked mutation outside the implementation surface assigned to this phase.
<!-- /ANCHOR:sign-off -->
