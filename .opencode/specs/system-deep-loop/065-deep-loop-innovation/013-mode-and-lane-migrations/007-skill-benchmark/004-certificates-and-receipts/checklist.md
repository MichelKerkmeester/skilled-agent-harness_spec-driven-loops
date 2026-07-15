---
title: "Checklist: Skill Benchmark certificates and receipts"
description: "Blocking verification checklist for the Skill Benchmark certificate, receipt, replay-fingerprint, paired-scenario, scoring, validity, and offline-verifier contract over deep-improvement-common services."
trigger_phrases:
  - "Skill Benchmark certificates and receipts checklist"
  - "skill effect certificate verification"
  - "skill benchmark offline replay gate"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/007-skill-benchmark/004-certificates-and-receipts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/007-skill-benchmark/004-certificates-and-receipts"
    last_updated_at: "2026-07-15T21:30:00Z"
    last_updated_by: "opencode"
    recent_action: "Scoped Skill Benchmark attestations to scenario and scoring evidence"
    next_safe_action: "Freeze mode fields against shared certificate, receipt, and verifier contracts"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Skill Benchmark Certificates and Receipts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for the Skill Benchmark certificates and receipts phase. The verifier
must pin the candidate and BASE, mode-004 shared-service contract digests, `003-sealed-artifacts` primitive fingerprint,
typed-ledger and reducer versions, evaluator/canary epochs, mode fingerprint inputs, fixture counts, commands, exit codes,
certificate and receipt outcomes, and unexpected tracked mutation. Missing, unknown, stale, or redacted evidence must remain
incomplete or unsupported; it must never silently become a passing skill effect.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Skill Benchmark siblings `001-typed-ledger-schema`, `002-reducers-and-projections`, `003-sealed-artifacts`, and common mode-004 certificate/receipt services are pinned by version and digest
- [ ] CHK-002 [P0] The shared-service ownership matrix records one owner for certificate, receipt, fingerprint, evaluator, canary, budget, sealing, effect-recovery, promotion, and offline-verifier behavior
- [ ] CHK-003 [P1] The phase-009 contract-freeze and executable write-set conflict graph handoff are recorded before the 010 fan-out
- [ ] CHK-004 [P1] Skill Benchmark scenario, treatment, exposure, trajectory, gold, scoring, compatibility, risk, and validity inputs are mapped to certificate or receipt evidence
- [ ] CHK-005 [P2] Candidate SHA, BASE SHA, mode schema/reducer versions, evaluator/canary digests, and mode fingerprint inputs are recorded in the verifier report
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-006 [P0] The mode uses the shared `CERTIFICATE` and `RECEIPT` schemas and adds only registered Skill Benchmark scenario/scoring fields; no local receipt chain or verifier exists
- [ ] CHK-007 [P0] Certificate and receipt evidence is content-addressed, immutable, linked to predecessor evidence, and explicit about completed, vetoed, uncertain, recovered, incomplete, unsupported, and expired states
- [ ] CHK-008 [P1] Scope is limited to Skill Benchmark attestations, fingerprint inputs, verification adapters, fixtures, and handoffs; no authority cutover or adjacent mode cleanup is included
- [ ] CHK-009 [P1] Raw observations, normalized scores, policy outcomes, certificate claims, and verifier findings remain separately addressable
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-010 [P0] Complete, partial, contradictory, tampered, superseded, and stale runs emit or reject the mode certificate according to required evidence, validity, and explicit verdict rules
- [ ] CHK-011 [P0] Assignment, scenario, discovery, loading, invocation, canary, scoring, issuance, withholding, expiry, and recovery transitions emit idempotent receipts with predecessor links and effect identity
- [ ] CHK-012 [P0] Replaying identical semantic inputs reproduces the same fingerprint across processes; each treatment, bundle, gold, evaluator, policy, reducer, capability, dependency, budget, retry, or predecessor mutation mismatches
- [ ] CHK-013 [P0] Wall-clock, local-path, process-id, storage-offset, and other excluded values do not change the fingerprint when semantic inputs remain fixed
- [ ] CHK-014 [P0] The offline verifier recomputes sealed-reference hashes, canonical serialization, raw evidence manifests, receipt continuity, paired coverage, score derivations, gold gates, validity, and hard vetoes without live agent or network access
- [ ] CHK-015 [P0] No-skill, auto-route, forced-activation, placebo/distractor, component-ablation, and compatibility-boundary fixtures preserve task/executor blocking, seed, propensity, replicate, outcome, and cost evidence
- [ ] CHK-016 [P0] Availability, discovery, loading, invocation, resource-canary exposure, trajectory, constraint coverage, final-state, and outcome evidence remain distinct and referenced by the certificate
- [ ] CHK-017 [P0] Empty, pending, structural-only, negative, and invalid gold states cannot produce a positive numerator; missing required gold yields an explicit block or insufficiency
- [ ] CHK-018 [P0] Raw per-item observations, deterministic checks, dynamic reference results, score axes, evaluator identity, normalization, constraint coverage, cost, latency, tokens, and workload metadata remain recoverable
- [ ] CHK-019 [P0] Dependency, registry, executor, tool, permission, environment, workload, composition, security, stale-canary, and negative-transfer failures withhold or expire the certificate and cannot be rescued by a soft score
- [ ] CHK-020 [P0] `PASS`, `FAIL`, `VETOED`, `INCOMPLETE`, `UNSUPPORTED_VERSION`, and `UNKNOWN` remain distinct in verifier and certificate results; an uncertain external effect cannot be marked successful from process exit
- [ ] CHK-021 [P1] Shared-service fixtures produce semantic parity for common, agent-improvement, model-benchmark, and Skill Benchmark adapters without field, fingerprint, receipt, or veto drift
- [ ] CHK-022 [P1] Dark certificate and receipt emission changes no authority and rollback leaves legacy projections, raw observations, sealed artifacts, and archival readers usable
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-023 [P1] The mode evidence manifest enumerates every certificate input, receipt transition, fingerprint class, validity trigger, hard veto, and offline verifier result required by the phase specification
- [ ] CHK-024 [P1] `005-resume-adapter` receives explicit reuse, re-execute, reconcile, compensate, quarantine, unsupported-version, and block cases for mode certificates and receipts
- [ ] CHK-025 [P1] The independent Skill Benchmark mode gate receives stable certificate fields, receipt-chain evidence, validity status, raw evidence references, and verifier receipt provenance
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-026 [P0] Candidate or skill content cannot disclose hidden canaries, exact evaluator internals, protected gold, judge identity, terminal evidence, or promotion thresholds before the shared visibility boundary permits disclosure
- [ ] CHK-027 [P0] Skill integrity, causal efficacy, deployment validity, compatibility, and security evidence remain separate; a seal, signature, or bundle digest alone cannot issue an efficacy certificate
- [ ] CHK-028 [P1] Tool permissions, environment dependencies, composition paths, and security probes are digest-bound evidence and cannot authorize their own transition
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-029 [P1] The phase docs reflect the shared-versus-mode ownership matrix, certificate and receipt evidence boundary, fingerprint inputs, offline verifier sequence, validity domain, phase-009 handoff, and successor resume boundary
- [ ] CHK-030 [P2] Open questions are assigned to the sealed-artifact, common-service, reducer, resume, mode-gate, or 009/010 owning phase before implementation begins
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-031 [P1] Any later implementation lands in dependency-closed, path-scoped commits and mutates no files outside the target phase scope
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 verifier check passes, the report pins shared and mode contract digests, paired scenario
and scoring evidence remains auditable, gold and validity gates fail closed, fingerprints and receipt chains replay
deterministically, common-service parity holds, the dark path changes no authority, and the successor resume and independent
mode-gate contracts are accepted.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the verifier confirms the Skill Benchmark certificate, receipt, fingerprint, offline-replay, paired-evidence,
gold-integrity, compatibility, validity, and shared-service contract and the exact-scope diff check shows no unexpected tracked
mutation outside the target phase.
<!-- /ANCHOR:sign-off -->
