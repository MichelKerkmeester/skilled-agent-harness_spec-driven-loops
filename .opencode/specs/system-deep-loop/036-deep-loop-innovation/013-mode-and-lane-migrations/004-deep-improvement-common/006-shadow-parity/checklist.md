---
title: "Checklist: Deep Improvement Common Services - Shadow Parity"
description: "Checklist for the shadow-parity child of the Deep Improvement Common Services migration: verify event-for-event legacy and typed parity, boundary projection equality, phase-014 health shadow safety, and cutover-blocking evidence."
trigger_phrases:
  - "deep improvement shadow parity checklist"
  - "common service parity gate"
  - "typed ledger shadow acceptance"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/006-shadow-parity"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/006-shadow-parity"
    last_updated_at: "2026-07-28T06:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Verified every blocking parity check"
    next_safe_action: "Consume the contract in downstream lane migrations"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Checklist: Deep Improvement Common Services - Shadow Parity

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for the Deep Improvement Common Services shadow-parity phase. Every
item is a check the paired verifier runs before a parity report is accepted; each report pins the candidate SHA, BASE SHA,
legacy-path version, typed-path version, event/projection corpus digest, normalization-manifest hash, commands, exit codes,
boundary counts, mismatch counts, and zero-authority-write evidence. `MISMATCH`, `INCONCLUSIVE`, `TELEMETRY_GAP`, or zero
eligible boundaries is a failed gate, not an implicit pass.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] The sibling event, reducer, sealed-artifact, certificate, and resume contracts are identified with pinned versions and explicit ownership boundaries [EVIDENCE: `harness-adapter.ts` imports and version-bound receipt fields]
- [x] CHK-002 [P0] The phase-014 health and degeneration shadow framework is available with coherent cursor, watermark, policy, adapter, recovery, and action-request semantics [EVIDENCE: `telemetry-gap` fault and non-authoritative mode-gate contract]
- [x] CHK-003 [P1] The paired corpus includes healthy, failure, replay, resume, duplicate-delivery, evaluator-epoch, canary, promotion, and rollback-target fixtures [EVIDENCE: 12/12 scenario closure and 20/20 fault matrix]
- [x] CHK-004 [P1] The candidate report records BASE SHA, path versions, corpus digest, protected-field manifest hash, and normalization-manifest hash [EVIDENCE: `DeepImprovementCommonParityReceipt` and certificate bindings]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-005 [P0] Both paths receive one immutable run context; divergence in run, candidate, lineage, evaluator, fixture, baseline, budget, policy, or input digest blocks the report [EVIDENCE: `validateFrozenInputAgainstCapsule`]
- [x] CHK-006 [P0] Event pairing is one-to-one by stable logical identity and sequence rather than raw `eventId`, so independent streams still pair; missing, extra, reordered, ambiguous, unauthorized, and unsupported events fail closed [EVIDENCE: independent raw-ID and fault-class tests]
- [x] CHK-007 [P0] The closed volatility allowlist is exactly `occurred_at`, `recorded_at`, and `correlation_id`; each field is checked for presence, type, and non-interference, while protected semantic fields remain comparable [EVIDENCE: closed allowlist test]
- [x] CHK-008 [P1] The shared harness is reusable by `005-agent-improvement`, `006-model-benchmark`, and `007-skill-benchmark`; variant data is namespaced and cannot weaken common checks [EVIDENCE: `DEEP_IMPROVEMENT_COMMON_SHARED_PARITY_CONTRACT`]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-009 [P0] Accepted fixtures have 100 percent event-boundary coverage with zero missing, extra, reordered, unauthorized, unknown-version, or unexplained protected-field events [EVIDENCE: focused `Vitest` green real-substrate case]
- [x] CHK-010 [P0] Projection snapshots match after every event boundary for lineage, evaluator epoch, raw-trial index, score normalization, uncertainty, canary state, promotion state, vetoes, receipts, budgets, rollback target, and terminal disposition [EVIDENCE: `replayState` per-prefix fingerprints]
- [x] CHK-011 [P0] A final-score match cannot pass an intermediate projection divergence; the boundary report records all compared snapshots and fingerprints [EVIDENCE: focused `Vitest` projection fault]
- [x] CHK-012 [P0] Raw observations retain candidate, evaluator, fixture, seed, judge family, raw scale, rationale digest, normalization version, cost, and latency across score-policy replay [EVIDENCE: `DeepImprovementRawTrialOutputMaterial` and raw-observation projection]
- [x] CHK-013 [P0] Evaluator epoch changes, missing evidence, insufficient evidence, policy changes, and incomparable values produce explicit inconclusive or telemetry-gap outcomes [EVIDENCE: shared scenario closure and `telemetry-gap` fault]
- [x] CHK-014 [P0] Canary fixtures cover sealed, active, burned, retired, leak, drift, invariant-failure, veto, and freshness states without exposing hidden canary contents [EVIDENCE: `DeepImprovementCommonParityCanary` and canary fault]
- [x] CHK-015 [P0] Promotion fixtures cover shadow, canary, authorized, denied, paused, aborted, baseline-restored, completed, and rollback-target states; shadow cannot authorize a transition [EVIDENCE: `DeepImprovementCommonParityPromotion` and authority-false receipt]
- [x] CHK-016 [P0] Evaluator-integrity oversight is separate from task success; reward, test, cache, evidence, and hidden-fixture tampering produces a distinct blocking outcome [EVIDENCE: focused `Vitest` evaluator-integrity fault]
- [x] CHK-017 [P0] Phase-014 healthy, degeneration, recovery, stale, missing, and unsupported observations preserve one coherent evidence boundary; data gaps never count as healthy [EVIDENCE: focused `Vitest` stale, missing, unsupported, and telemetry-gap faults]
- [x] CHK-018 [P0] Phase-014 pause, re-seed, quarantine, repair, and stop requests remain observations and do not stop, dispatch, cancel, spend budget, mutate a baseline, or change authority [EVIDENCE: `executorObservations` and immutable authority fields]
- [x] CHK-019 [P0] Complete replay, checkpoint replay, resume, and duplicate delivery produce identical match identities, projection fingerprints, mismatch classes, and verdicts [EVIDENCE: `deterministicRuns: 2` and duplicate fault]
- [x] CHK-020 [P1] Every mismatch carries source and target event references, raw digests, policy/version identities, cursors, projection fields, a deterministic mismatch class, and any tolerated diff's owner, reason, and non-interference proof [EVIDENCE: `DeepImprovementCommonParityDiffRecord`]
- [x] CHK-021 [P0] The accepted corpus has zero unexplained semantic differences; any unaccountable tolerance blocks parity, and the typed shadow path performs zero authority writes [EVIDENCE: focused `Vitest` zero-diff run and laundering rejection]
- [x] CHK-022 [P0] `MISMATCH`, `INCONCLUSIVE`, `TELEMETRY_GAP`, stale watermark, unsupported adapter, or empty eligible corpus cannot produce `PASS` [EVIDENCE: mode-gate blocking reason closure]
- [x] CHK-032 [P0] Every named cross-artifact reference resolves to the declared kind with applicable epoch, lifecycle, freshness, real-state, visibility, role-redaction, and authority-liveness checks; existence or shape alone cannot pass [EVIDENCE: `verifyDeepImprovementCommonCertificateOffline` binding]
- [x] CHK-033 [P0] Fault injections traverse the real execution, authorization, ledger, reducer, projection, receipt, and mode-gate evidence pipeline and assert the exact typed failure class; stub-only or zero-event tests cannot pass [EVIDENCE: 20/20 table-driven fault cases]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-023 [P1] The protected-field manifest covers every shared evaluator, canary, promotion, receipt, budget, rollback, health, and terminal field named by the phase contract [EVIDENCE: `DeepImprovementCommonParityProjection`]
- [x] CHK-024 [P1] The parity report identifies all three downstream variants and records their common fixture result plus any namespaced extension result [EVIDENCE: `DEEP_IMPROVEMENT_COMMON_SHARED_PARITY_CONTRACT`]
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-025 [P0] Shadow execution cannot mutate evaluator assets, hidden fixtures, candidate state, stable baseline, production promotion state, or legacy-writer authority [EVIDENCE: `protectedRoots` and immutable authority fields]
- [x] CHK-026 [P1] Candidate-blind judging, order-swapped comparisons, canary secrecy, and evaluator-integrity controls retain only digest-bound evidence in shared projections [EVIDENCE: `ArtifactReferenceSet` and artifact digests]
- [x] CHK-027 [P2] Shadow reservations and duplicate external effects are bounded by typed budget and receipt rules without bypassing the shared authorization gateway [EVIDENCE: frozen budget lease and real gateway authorization]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-028 [P1] The parity report schema, mismatch taxonomy, normalization manifest, and cutover-blocking criteria are reflected in the phase docs and successor handoff [EVIDENCE: `spec.md` acceptance contract and `implementation-summary.md`]
- [x] CHK-029 [P2] Research traceability cites the 036/002 findings on raw observations, evaluator capsules, canary freshness, independent oversight, and shadow/canary promotion [EVIDENCE: plan dependencies]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-030 [P1] Shadow evidence is append-only and bounded; event-match, projection, mismatch, and final-verdict records retain source cursors and content digests [EVIDENCE: `AppendOnlyLedger` and digest-bound receipt]
- [x] CHK-031 [P1] Any later implementation remains path-scoped and additive-dark; no authority-cutover or legacy-writer retirement change lands in this phase [EVIDENCE: `authorityMutation: false` and scoped status]
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete only when every P0 verifier check passes for the shared corpus and all three downstream variant fixture
sets, every eligible boundary has event and projection evidence, raw evaluator and canary evidence remains addressable, phase-014
health remains non-authoritative, and the final report is `PASS` with zero unexplained protected differences, zero blocking data
gaps, and zero authority writes. The manifest-bound receipt is evidence for the authenticated later mode gate, which re-verifies
its binding instead of self-trusting computed status; it is not a cutover certificate.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 parity contract, the report pins the source and target path versions plus
corpus and manifest hashes, replay and duplicate-delivery results are deterministic, and the authority-write assertion is
green for the complete verification run.
<!-- /ANCHOR:sign-off -->
