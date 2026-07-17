---
title: "Checklist: Deep Improvement Common Services - Rollback & Mode Gate"
description: "Blocking verification checklist for the shared Deep Improvement Common Services fail-closed rollback switch, bounded rollback window, independent shadow-parity mode gate, common evaluator/canary/promotion ownership, and phase-014 readiness certificate."
trigger_phrases:
  - "deep improvement common rollback and mode gate checklist"
  - "shared evaluator migration gate verification"
  - "deep improvement rollback rehearsal"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/007-rollback-and-mode-gate"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/007-rollback-and-mode-gate"
    last_updated_at: "2026-07-15T21:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined rollback switch and common-service gate evidence boundary"
    next_safe_action: "Freeze gate predicates and rollback window evidence against shared contracts"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Deep Improvement Common Services - Rollback & Mode Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for the Deep Improvement Common Services mode gate. Items remain
unchecked while the phase is Planned. Every report pins BASE, candidate SHA, shared transition and mode-contract digests,
write-set graph digest, event and reducer versions, evaluator and canary epochs, fixture IDs, stream and artifact digests,
window ID, verifier identity, commands, exit codes, and every disposition. A green process exit without the required evidence
is not a passing gate. `INCONCLUSIVE`, `TELEMETRY_GAP`, `UNKNOWN`, `INSUFFICIENT_EVIDENCE`, stale evidence, or an empty
eligible corpus is blocking.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] BASE, candidate scope, shared transition/versioning/rollback digest, phase-015 contract digest, write-set graph digest, and phase-014 handoff version are recorded
- [ ] CHK-002 [P0] Sibling outputs `001` through `006` are inventory-bound with event, reducer, seal, certificate, receipt, replay, resume, and parity references
- [ ] CHK-003 [P0] The common-service ownership matrix identifies evaluator, canary, promotion, certificate, receipt, fingerprint, and rollback owners for all three downstream variants
- [ ] CHK-004 [P1] The legacy anchor, typed frontier, evaluator epoch, canary epoch, and required fixture manifest are recorded for every gate boundary
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-005 [P0] The switch is default-deny and invalid or absent state resolves to `legacy_authoritative` with typed refusal evidence
- [ ] CHK-006 [P0] Shared services cannot bypass external authorization or accept a certificate for another mode, contract, frontier, evaluator epoch, or canary epoch
- [ ] CHK-007 [P0] The rollback window records stable identity, legacy anchor, typed frontier, trigger policy, fencing token, successful-run count, expiry, and close or rollback receipt
- [ ] CHK-008 [P1] Window closure requires both 14 calendar days and five successful authoritative executions and extends for low traffic or unresolved obligations
- [ ] CHK-009 [P0] Gate and rollback operations do not rewrite legacy rows, delete typed events, mutate sealed artifacts, disclose hidden canaries, or retire legacy writers
- [ ] CHK-010 [P1] Common evaluator, canary, and promotion semantics have one source; variant adapters cannot fork hard vetoes, evidence states, receipt vocabulary, or rollback behavior
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-011 [P0] Absent, malformed, stale, unauthorized, mixed-version, gateway-failed, and wrong-mode requests fail closed before append, projection, effect, or authority change
- [ ] CHK-012 [P0] The common services cannot self-authorize rollback, unquarantine, verifier replacement, or legacy restoration
- [ ] CHK-013 [P0] The `006-shadow-parity` report is green for candidate lineage, raw evaluation, score normalization, canary, promotion, abort, restore, resume, failure, and duplicate-delivery boundaries
- [ ] CHK-014 [P0] Event and projection parity has zero missing, extra, reordered, unauthorized, unsupported, or unexplained protected differences at every eligible boundary
- [ ] CHK-015 [P0] Raw per-item evaluator observations, fixture identity, evaluator capsule, seed, score scale, rationale digest, normalization version, cost, and latency remain addressable after reduction changes
- [ ] CHK-016 [P0] Required evaluator, candidate, baseline, raw-trial, canary, and promotion artifacts have valid seals, dependency closures, current epochs, content digests, and tamper-evident reads
- [ ] CHK-017 [P0] Canary fixtures cover sealed, active, burned, retired, freshness, semantic leak, drift, invariant-failure, adversarial, metamorphic, and veto outcomes without exposing hidden contents
- [ ] CHK-018 [P0] Promotion fixtures cover shadow, canary, authorized, denied, paused, aborted, restored, completed, vetoed, `UNKNOWN`, and `INSUFFICIENT_EVIDENCE` outcomes
- [ ] CHK-019 [P0] Target reward and evaluator-integrity oversight remain separate; score inflation, hidden-fixture leakage, cache tampering, and action-trace drift produce independent blocking evidence
- [ ] CHK-020 [P0] Certificate and receipt chains verify offline with stable replay fingerprints, predecessor links, effect identities, budgets, policy versions, and explicit uncertainty
- [ ] CHK-021 [P0] Complete replay, checkpoint replay, resume, changed-manifest, crash-before-receipt, duplicate delivery, and unknown-effect fixtures remain deterministic or fail closed
- [ ] CHK-022 [P0] Missing observations, stale watermarks, unsupported versions, evaluator or canary epoch mismatch, telemetry gaps, and nondeterminism produce `blocked`, `incomplete`, or `rollback_required`
- [ ] CHK-023 [P0] Rollback rehearsal freezes admission, fences typed writers, classifies in-flight work, recovers or quarantines effects, restores legacy at a new epoch, preserves events and artifacts, and emits a rollback certificate
- [ ] CHK-024 [P0] The rollback window remains open until both 14 calendar days and five successful authoritative executions are satisfied and extends on low traffic or unresolved obligations
- [ ] CHK-025 [P0] All three downstream variants consume the same evaluator, canary, promotion, certificate, receipt, fingerprint, veto, and rollback fixtures through namespaced adapters
- [ ] CHK-026 [P0] Repeated evaluation of the same sealed frontier emits the same gate disposition and certificate body digest; a changed semantic input invalidates the result
- [ ] CHK-027 [P0] Phase-014 receives a readiness certificate only; any certificate claiming authority moved, the rollback window closed, or legacy writers retired is rejected
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-028 [P1] The gate matrix covers every shared evaluator, canary, promotion, replay, resume, failure, rollback, and variant-reuse obligation without an unowned evidence row
- [ ] CHK-029 [P1] Every failure or uncertainty case has an explicit `blocked`, `incomplete`, `not_ready`, `rollback_required`, or window-extension disposition and an evidence owner
- [ ] CHK-030 [P0] The mode certificate binds Deep Improvement Common Services, exact BASE and candidate SHA, contract and write-set digests, event frontier, evaluator and canary epochs, sealed manifest, receipt chain, rollback anchor, verifier, and dispositions
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-031 [P0] Candidate-facing views cannot disclose hidden canary content, evaluator internals, judge identity, or terminal evidence before the declared information boundary
- [ ] CHK-032 [P0] Rollback preserves append-only ledger history and sealed artifacts and never truncates evidence to make parity, replay, or certificate verification pass
- [ ] CHK-033 [P0] Fencing and monotonic epochs reject stale typed writers and duplicate authority requests after rollback or restoration
- [ ] CHK-034 [P1] Certificate and receipt verification rejects mixed-version, expired, malformed, unsigned, or digest-mismatched references without widening capability scope
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-035 [P1] The phase docs distinguish the rollback switch, rollback certificate, independent mode gate, mode-migration certificate, phase-014 readiness handoff, and later authority-cutover certificate
- [ ] CHK-036 [P1] The shared-service reuse matrix names `005-agent-improvement`, `006-model-benchmark`, and `007-skill-benchmark` and records that they consume this common source
- [ ] CHK-037 [P2] Research traceability cites the 065/002 findings on raw observations, evaluator capsules, canary rotation and leakage, independent oversight, score gaming, and reversible promotion
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-038 [P0] Authored changes remain limited to this target phase folder and use the prescribed four-document Level 2 structure
- [ ] CHK-039 [P1] No `description.json` or `graph-metadata.json` is hand-written; deterministic tooling owns generated metadata
- [ ] CHK-040 [P1] Any later implementation remains path-scoped, additive-dark, and dependency-closed with no adjacent sibling cleanup
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase passes only when every P0 verifier item is green, the independent gate has no unexplained evidence gap, shadow
parity is complete for the common lifecycle and all three adapters, seals and receipt chains verify, the rollback window
contract is intact, rollback rehearsal restores the legacy anchor without data loss, and the exact-SHA certificate hands
phase-014 readiness without an authority claim. A passing result does not authorize cutover or legacy-writer retirement.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms fail-closed switch behavior, bounded rollback evidence, common-service ownership,
shadow parity, sealed artifact integrity, deterministic replay, certificate validity, variant reuse, and no unexpected tracked
mutation outside this phase folder.
<!-- /ANCHOR:sign-off -->
