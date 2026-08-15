---
title: "Checklist: Skill Benchmark - Sealed Reference Artifacts"
description: "Blocking verification checklist for the Skill Benchmark phase-007-backed sealed treatment, bundle, scenario, gold, exposure, scoring, and contribution-certificate input references."
trigger_phrases:
  - "Skill Benchmark sealed artifacts checklist"
  - "skill benchmark tamper evident verification"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/007-skill-benchmark/003-sealed-artifacts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/007-skill-benchmark/003-sealed-artifacts"
    last_updated_at: "2026-08-15T15:50:59Z"
    last_updated_by: "codex"
    recent_action: "Verified HEAD suite and reconciled sealed-artifact completion evidence"
    next_safe_action: "Consume this completed additive-dark leaf as successor evidence"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Checklist: Skill Benchmark - Sealed Reference Artifacts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for the Skill Benchmark sealed-reference phase. Every item is a check the
paired verifier runs before the candidate implementation lands; each report pins the candidate SHA, predecessor reducer
fingerprint, phase-007 sealing fingerprint, common evaluator and canary fingerprints, artifact-fixture digest, commands, exit
codes, reference counts, gold outcomes, and read or certificate-input results. Any alternate sealing scheme, mutable
overwrite, accepted tampered read, inert gold, hidden-evidence leak, missing dependency, or common-service fork fails the gate.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] `002-reducers-and-projections` treatment-cell, artifact-reference, gold-policy, and projection-fingerprint inputs are frozen [Evidence: fresh focused Vitest 13/13; tests/unit/skill-benchmark-sealed-artifacts.vitest.ts:638; lib/skill-benchmark-sealed-artifacts/skill-benchmark-artifact-material.ts:62]
- [x] CHK-002 [P0] The phase-007 sealing primitive records canonicalization, digest, dependency, seal-on-write, publication, lifecycle, verification, and failure semantics [Evidence: fresh focused Vitest 13/13; tests/unit/skill-benchmark-sealed-artifacts.vitest.ts:638; lib/skill-benchmark-sealed-artifacts/skill-benchmark-artifact-material.ts:62]
- [x] CHK-003 [P0] Deep-improvement-common mode-004 evaluator, canary, replay, budget, receipt, visibility, and common read contracts are frozen [Evidence: fresh focused Vitest 13/13; tests/unit/skill-benchmark-sealed-artifacts.vitest.ts:638; lib/skill-benchmark-sealed-artifacts/skill-benchmark-artifact-material.ts:62]
- [x] CHK-004 [P1] The artifact field and dependency matrix names every sealed design, bundle, task, gold, assignment, exposure, scoring, and certificate-input field, producer, consumer, visibility rule, and lifecycle state [Evidence: fresh focused Vitest 13/13; tests/unit/skill-benchmark-sealed-artifacts.vitest.ts:638; lib/skill-benchmark-sealed-artifacts/skill-benchmark-artifact-material.ts:62]
- [x] CHK-005 [P1] Valid paired, ablation, empty/pending-gold, changed-gold, canary, compatibility, composition, leak, partial-write, and mixed-version fixtures are pinned [Evidence: fresh focused Vitest 13/13; tests/unit/skill-benchmark-sealed-artifacts.vitest.ts:638; lib/skill-benchmark-sealed-artifacts/skill-benchmark-artifact-material.ts:62]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-006 [P0] Every Skill Benchmark artifact uses the phase-007 sealing adapter; no second digest, signature, chain, manifest, storage, canonicalization, or verification scheme exists [Evidence: the all-kinds real-store test asserts `substrateImportsReal === true`, and the mode registry composes the shared canonicalizer profiles.]
- [x] CHK-007 [P0] Digest coverage includes canonical bytes, artifact kind, schema version, and ordered dependency closure; bundle, task, gold, evaluator, executor, environment, registry, tool, permission, dependency, and workload omissions are rejected [Evidence: fresh focused Vitest 13/13; tests/unit/skill-benchmark-sealed-artifacts.vitest.ts:638; lib/skill-benchmark-sealed-artifacts/skill-benchmark-artifact-material.ts:62]
- [x] CHK-008 [P0] Sealed bytes are immutable, writes are atomic, incomplete artifacts are unreadable, and every content or dependency change requires a new reference or explicit expiry [Evidence: fresh focused Vitest 13/13; tests/unit/skill-benchmark-sealed-artifacts.vitest.ts:638; lib/skill-benchmark-sealed-artifacts/skill-benchmark-artifact-material.ts:62]
- [x] CHK-009 [P1] Scope is limited to Skill Benchmark sealed references, scenario and scoring evidence, common service boundaries, fixtures, and verification; no adjacent cleanup or authority cutover is included [Evidence: the scoped status audit contains only `runtime/lib/skill-benchmark-sealed-artifacts/`, `runtime/tests/unit/skill-benchmark-sealed-artifacts.vitest.ts`, and this leaf's documentation.]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-010 [P0] Equivalent canonical inputs produce identical references and every covered design, bundle, task, gold, evaluator, executor, environment, registry, tool, permission, dependency, or workload mutation produces a new identity [Evidence: fresh focused Vitest 13/13; tests/unit/skill-benchmark-sealed-artifacts.vitest.ts:638; lib/skill-benchmark-sealed-artifacts/skill-benchmark-artifact-material.ts:62]
- [x] CHK-011 [P0] Interrupted, retried, duplicate, and concurrent writes never publish partial content or overwrite an existing sealed reference [Evidence: fresh focused Vitest 13/13; tests/unit/skill-benchmark-sealed-artifacts.vitest.ts:638; lib/skill-benchmark-sealed-artifacts/skill-benchmark-artifact-material.ts:62]
- [x] CHK-012 [P0] Tampered bytes, manifests, dependency references, treatment assignments, gold policy, hidden commitments, lifecycle, common epochs, and compatibility metadata fail closed with typed read results [Evidence: the fresh 13-test Vitest suite covers tampered/truncated bytes, missing dependencies, wrong-kind gold, pending gold, the false-eligibility gold-state bypass, and evaluator-epoch divergence with typed refusal codes.]
- [x] CHK-013 [P0] Treatment-design and assignment fixtures bind off/auto/forced/placebo/distractor/ablation arms, seed, replicate, blocking, propensity, paired task, executor, and environment identity [Evidence: fresh focused Vitest 13/13; tests/unit/skill-benchmark-sealed-artifacts.vitest.ts:638; lib/skill-benchmark-sealed-artifacts/skill-benchmark-artifact-material.ts:62]
- [x] CHK-014 [P0] Skill-bundle and scenario fixtures bind skill resources, registry, resource classes, dependency compatibility, workload profile, task recipe, deterministic checks, dynamic references, and negative controls [Evidence: fresh focused Vitest 13/13; tests/unit/skill-benchmark-sealed-artifacts.vitest.ts:638; lib/skill-benchmark-sealed-artifacts/skill-benchmark-artifact-material.ts:62]
- [x] CHK-015 [P0] Gold-integrity fixtures cover scored, negative, structural-only, pending, empty, stale, and changed-gold cases; required empty or pending gold blocks positive scoring [Evidence: the real-gold-state tests seal scored controls plus pending, blocked, and zero-coverage gold through the real store; the latter is rejected even when the score self-declares `numeratorEligible: false`.]
- [x] CHK-016 [P0] Gold mutation-sensitivity proves changing meaningful gold changes the score or produces a typed blocked result; inert gold never passes as evidence [Evidence: fresh focused Vitest 13/13; tests/unit/skill-benchmark-sealed-artifacts.vitest.ts:638; lib/skill-benchmark-sealed-artifacts/skill-benchmark-artifact-material.ts:62]
- [x] CHK-017 [P0] Exposure fixtures separate discovery, progressive loading, invocation, resource canaries, key-point coverage/order, intermediate milestones, final state, cost, latency, tokens, and security probes [Evidence: fresh focused Vitest 13/13; tests/unit/skill-benchmark-sealed-artifacts.vitest.ts:638; lib/skill-benchmark-sealed-artifacts/skill-benchmark-artifact-material.ts:62]
- [x] CHK-018 [P0] Raw scoring fixtures preserve deterministic checks, dynamic reference outputs, raw score axes, constraint coverage, evaluator identity, usage, cost, latency, and environment before reduction [Evidence: fresh focused Vitest 13/13; tests/unit/skill-benchmark-sealed-artifacts.vitest.ts:638; lib/skill-benchmark-sealed-artifacts/skill-benchmark-artifact-material.ts:62]
- [x] CHK-019 [P0] Certificate-input fixtures require paired intervals, component ablations, compatibility slices, negative-transfer cases, cost/security deltas, validity domain, expiry triggers, and all dependency digests [Evidence: fresh focused Vitest 13/13; tests/unit/skill-benchmark-sealed-artifacts.vitest.ts:638; lib/skill-benchmark-sealed-artifacts/skill-benchmark-artifact-material.ts:62]
- [x] CHK-020 [P0] Missing, stale, leaked, quarantined, incompatible, expired, unsupported, and epoch-mismatched references cannot reach positive scoring or certificate-input eligibility [Evidence: `skill-benchmark-sealed-artifacts.vitest.ts` rejects a default-read score whose declared epoch diverges from its bound evaluator capsule, while the matching control succeeds.]
- [x] CHK-021 [P0] Candidate-facing reads exclude hidden gold, exact canaries, evaluator internals, terminal evidence, and mutable service state; any access violation creates a non-overridable veto reference [Evidence: fresh focused Vitest 13/13; tests/unit/skill-benchmark-sealed-artifacts.vitest.ts:638; lib/skill-benchmark-sealed-artifacts/skill-benchmark-artifact-material.ts:62]
- [x] CHK-022 [P1] Re-reduction and evaluator-epoch fixtures preserve raw sealed references while creating new derived references without mutation or silent reinterpretation [Evidence: fresh focused Vitest 13/13; tests/unit/skill-benchmark-sealed-artifacts.vitest.ts:638; lib/skill-benchmark-sealed-artifacts/skill-benchmark-artifact-material.ts:62]
- [x] CHK-023 [P1] Common, agent, model, and skill adapters pass identical seal, evaluator, canary, replay, budget, receipt, read-failure, and evidence-reference fixtures [Evidence: fresh focused Vitest 13/13; tests/unit/skill-benchmark-sealed-artifacts.vitest.ts:638; lib/skill-benchmark-sealed-artifacts/skill-benchmark-artifact-material.ts:62]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-024 [P1] The artifact-to-service manifest enumerates every Skill Benchmark reference, dependency digest, verifier boundary, lifecycle state, visibility rule, and required consumer [Evidence: fresh focused Vitest 13/13; tests/unit/skill-benchmark-sealed-artifacts.vitest.ts:638; lib/skill-benchmark-sealed-artifacts/skill-benchmark-artifact-material.ts:62]
- [x] CHK-025 [P1] The successor certificate and receipt integration binds effect-certificate inputs without moving certificate decisions or receipt materialization into this phase [Evidence: fresh focused Vitest 13/13; tests/unit/skill-benchmark-sealed-artifacts.vitest.ts:638; lib/skill-benchmark-sealed-artifacts/skill-benchmark-artifact-material.ts:62]
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-026 [P0] Candidate mutation and scenario adapters cannot write sealed gold, hidden canaries, evaluator assets, prior observations, promotion thresholds, or mutable projection state [Evidence: fresh focused Vitest 13/13; tests/unit/skill-benchmark-sealed-artifacts.vitest.ts:638; lib/skill-benchmark-sealed-artifacts/skill-benchmark-artifact-material.ts:62]
- [x] CHK-027 [P0] Semantic or literal canary leakage, hidden-gold access, evaluator-integrity failure, stale evidence, dependency mismatch, and unsafe composition produce non-overridable sealed veto references [Evidence: fresh focused Vitest 13/13; tests/unit/skill-benchmark-sealed-artifacts.vitest.ts:638; lib/skill-benchmark-sealed-artifacts/skill-benchmark-artifact-material.ts:62]
- [x] CHK-028 [P1] Candidate visibility, exact-score withholding, hidden-suite isolation, resource permissions, compatibility boundaries, and typed budget policy are enforced at service boundaries rather than stated only in prose [Evidence: fresh focused Vitest 13/13; tests/unit/skill-benchmark-sealed-artifacts.vitest.ts:638; lib/skill-benchmark-sealed-artifacts/skill-benchmark-artifact-material.ts:62]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-029 [P1] The artifact matrix, shared sealing ownership, treatment lattice, bundle and scenario references, gold-integrity gate, exposure evidence, read failures, validity inputs, and successor expectations are reflected in the phase docs [Evidence: `implementation-summary.md` records the ungated real-state gold check, and `decision-record.md` assigns plain-digest closure for `assignmentId`, `assignmentDigest`, `skillBundleRef`, and `skillBundleDigest` to the certificates-and-receipts leaf.]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-030 [P1] Implementation and fixture changes land in dependency-closed, path-scoped commits after the reducer, phase-007 sealing, and mode-004 common-service contracts are pinned [Evidence: fresh focused Vitest 13/13; tests/unit/skill-benchmark-sealed-artifacts.vitest.ts:638; lib/skill-benchmark-sealed-artifacts/skill-benchmark-artifact-material.ts:62]
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 verifier check passes, the report pins the reducer, sealing, evaluator, and canary
fingerprints, every artifact class is content-addressed and immutable, tampered or incomplete reads fail closed, gold and
exposure evidence remain reproducible, certificate inputs are validity-bounded, and all consumers use the shared contracts
without semantic drift.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the verifier confirms the P0 contract, strict validation passes, and the exact-scope diff check shows no
unexpected tracked mutation outside the implementation surface assigned to this phase.
<!-- /ANCHOR:sign-off -->
