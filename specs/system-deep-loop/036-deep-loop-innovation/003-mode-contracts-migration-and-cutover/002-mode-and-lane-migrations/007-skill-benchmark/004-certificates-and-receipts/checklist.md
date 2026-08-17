---
title: "Checklist: Skill Benchmark certificates and receipts"
description: "Blocking verification checklist for the Skill Benchmark certificate, receipt, replay-fingerprint, paired-scenario, scoring, validity, and offline-verifier contract over deep-improvement-common services."
trigger_phrases:
  - "Skill Benchmark certificates and receipts checklist"
  - "skill effect certificate verification"
  - "skill benchmark offline replay gate"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/007-skill-benchmark/004-certificates-and-receipts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/003-mode-contracts-migration-and-cutover/002-mode-and-lane-migrations/007-skill-benchmark/004-certificates-and-receipts"
    last_updated_at: "2026-08-17T04:04:40Z"
    last_updated_by: "codex"
    recent_action: "Verified HEAD certificate suite and reconciled completion metadata"
    next_safe_action: "Consume this completed additive-dark leaf in resume verification"
    blockers: []
    key_files: []
    completion_pct: 100
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

- [x] CHK-001 [P0] Skill Benchmark siblings `001-typed-ledger-schema`, `002-reducers-and-projections`, `003-sealed-artifacts`, and common mode-004 certificate/receipt services are pinned by version and digest [Evidence: `spec.md` and `plan.md`]
- [x] CHK-002 [P0] The shared-service ownership matrix records one owner for certificate, receipt, fingerprint, evaluator, canary, budget, sealing, effect-recovery, promotion, and offline-verifier behavior [Evidence: `spec.md` and `implementation-summary.md`]
- [x] CHK-003 [P1] The phase-012 contract-freeze and executable write-set conflict graph handoff are recorded before the 010 fan-out [Evidence: `spec.md` and `plan.md`]
- [x] CHK-004 [P1] Skill Benchmark scenario, treatment, exposure, trajectory, gold, scoring, compatibility, risk, and validity inputs are mapped to certificate or receipt evidence [Evidence: `spec.md` and `plan.md`]
- [x] CHK-005 [P2] Candidate SHA, BASE SHA, mode schema/reducer versions, evaluator/canary digests, and mode fingerprint inputs are recorded in the verifier report
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-006 [P0] The mode uses the shared `CERTIFICATE` and `RECEIPT` schemas and adds only registered Skill Benchmark scenario/scoring fields; no local receipt chain or verifier exists [Evidence: `skill-benchmark-certificates.ts` and focused Vitest 20/20]
- [x] CHK-007 [P0] Certificate and receipt evidence is content-addressed, immutable, linked to predecessor evidence, and explicit about completed, vetoed, uncertain, recovered, incomplete, unsupported, and expired states [Evidence: `skill-benchmark-certificates.ts` and focused Vitest 20/20]
- [x] CHK-008 [P1] Scope is limited to Skill Benchmark attestations, fingerprint inputs, verification adapters, fixtures, and handoffs; no authority cutover or adjacent mode cleanup is included [Evidence: `implementation-summary.md` and exact-scope review]
- [x] CHK-009 [P1] Raw observations, normalized scores, policy outcomes, certificate claims, and verifier findings remain separately addressable [Evidence: `skill-benchmark-certificate-types.ts` and focused Vitest 20/20]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-010 [P0] Complete, partial, contradictory, tampered, superseded, and stale runs emit or reject the mode certificate according to required evidence, validity, and explicit verdict rules [Evidence: focused Vitest passed 20/20]
- [x] CHK-011 [P0] Assignment, scenario, discovery, loading, invocation, canary, scoring, issuance, withholding, expiry, and recovery transitions emit idempotent receipts with predecessor links and effect identity [Evidence: focused Vitest passed 20/20]
- [x] CHK-012 [P0] Replaying identical semantic inputs reproduces the same fingerprint across processes; each treatment, bundle, gold, evaluator, policy, reducer, capability, dependency, budget, retry, or predecessor mutation mismatches [Evidence: focused Vitest passed 20/20]
- [x] CHK-013 [P0] Wall-clock, local-path, process-id, storage-offset, and other excluded values do not change the fingerprint when semantic inputs remain fixed [Evidence: focused Vitest passed 20/20]
- [x] CHK-014 [P0] The offline verifier recomputes sealed-reference hashes, canonical serialization, raw evidence manifests, receipt continuity, paired coverage, score derivations, gold gates, validity, and hard vetoes without live agent or network access [Evidence: focused Vitest passed 20/20]
- [x] CHK-015 [P0] No-skill, auto-route, forced-activation, placebo/distractor, component-ablation, and compatibility-boundary fixtures preserve task/executor blocking, seed, propensity, replicate, outcome, and cost evidence [Evidence: focused Vitest passed 20/20]
- [x] CHK-016 [P0] Availability, discovery, loading, invocation, resource-canary exposure, trajectory, constraint coverage, final-state, and outcome evidence remain distinct and referenced by the certificate [Evidence: focused Vitest passed 20/20]
- [x] CHK-017 [P0] Empty, pending, structural-only, negative, and invalid gold states cannot produce a positive numerator; missing required gold yields an explicit block or insufficiency [Evidence: focused Vitest passed 20/20]
- [x] CHK-018 [P0] Raw per-item observations, deterministic checks, dynamic reference results, score axes, evaluator identity, normalization, constraint coverage, cost, latency, tokens, and workload metadata remain recoverable [Evidence: focused Vitest passed 20/20]
- [x] CHK-019 [P0] Dependency, registry, executor, tool, permission, environment, workload, composition, security, stale-canary, and negative-transfer failures withhold or expire the certificate and cannot be rescued by a soft score [Evidence: focused Vitest passed 20/20]
- [x] CHK-020 [P0] `PASS`, `FAIL`, `VETOED`, `INCOMPLETE`, `UNSUPPORTED_VERSION`, and `UNKNOWN` remain distinct in verifier and certificate results; an uncertain external effect cannot be marked successful from process exit [Evidence: focused Vitest passed 20/20]
- [x] CHK-021 [P1] Shared-service fixtures produce semantic parity for common, agent-improvement, model-benchmark, and Skill Benchmark adapters without field, fingerprint, receipt, or veto drift [Evidence: focused Vitest passed 20/20]
- [x] CHK-022 [P1] Dark certificate and receipt emission changes no authority and rollback leaves legacy projections, raw observations, sealed artifacts, and archival readers usable [Evidence: `skill-benchmark-certificates.ts` and `implementation-summary.md`]
- [x] CHK-032 [P0] The closure map binds exposure/causal-score `assignmentId` and `assignmentDigest` pairs to `RUN_ASSIGNMENT`, run-assignment `skillBundleRef` and `skillBundleDigest` to `SKILL_BUNDLE_SNAPSHOT`, and the recomputed ordered closure across certificates, receipts, replay fingerprints, and event-ledger evidence [Evidence: six closure negatives passed in focused Vitest 20/20]
- [x] CHK-033 [P0] Real-store fixtures reject missing, fabricated, wrong-kind, mutated, stale, reordered, visibility-denied, or authority-dead named evidence; missing offline bytes are typed `unverifiable`, and selector syntax passes only after real target-context resolution [Evidence: scoped real-store negatives passed in focused Vitest 20/20; accepted visibility, authority, and selector cases remain golden-inherited]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-023 [P1] The mode evidence manifest enumerates every certificate input, receipt transition, fingerprint class, validity trigger, hard veto, and offline verifier result required by the phase specification [Evidence: `skill-benchmark-certificate-types.ts` and `implementation-summary.md`]
- [x] CHK-024 [P1] `005-resume-adapter` receives explicit reuse, re-execute, reconcile, compensate, quarantine, unsupported-version, and block cases for mode certificates and receipts
- [x] CHK-025 [P1] The independent Skill Benchmark mode gate receives stable certificate fields, receipt-chain evidence, validity status, raw evidence references, and verifier receipt provenance [Evidence: `skill-benchmark-certificate-types.ts` and `implementation-summary.md`]
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-026 [P0] Candidate or skill content cannot disclose hidden canaries, exact evaluator internals, protected gold, judge identity, terminal evidence, or promotion thresholds before the shared visibility boundary permits disclosure [Evidence: accepted boundary recorded in `spec.md` and `implementation-summary.md`]
- [x] CHK-027 [P0] Skill integrity, causal efficacy, deployment validity, compatibility, and security evidence remain separate; a seal, signature, or bundle digest alone cannot issue an efficacy certificate [Evidence: focused Vitest passed 20/20]
- [x] CHK-028 [P1] Tool permissions, environment dependencies, composition paths, and security probes are digest-bound evidence and cannot authorize their own transition [Evidence: `skill-benchmark-certificates.ts` and focused Vitest 20/20]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-029 [P1] The phase docs reflect the shared-versus-mode ownership matrix, certificate and receipt evidence boundary, fingerprint inputs, offline verifier sequence, validity domain, phase-012 handoff, and successor resume boundary [Evidence: `spec.md`, `plan.md`, and `implementation-summary.md`]
- [x] CHK-030 [P2] Open questions are assigned to the sealed-artifact, common-service, reducer, resume, mode-gate, or 009/010 owning phase before implementation begins
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-031 [P1] Any later implementation lands in dependency-closed, path-scoped commits and mutates no files outside the target phase scope [Evidence: exact-scope diff review completed]
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
