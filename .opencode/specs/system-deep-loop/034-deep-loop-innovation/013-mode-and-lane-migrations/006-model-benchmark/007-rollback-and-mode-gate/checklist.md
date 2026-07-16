---
title: "Checklist: Model Benchmark - Rollback & Mode Gate"
description: "Blocking verification checklist for the Model Benchmark fail-closed rollback switch, bounded rollback window, independent scoring-matrix shadow-parity gate, shared-service ownership, and phase-014 readiness certificate."
trigger_phrases:
  - "model benchmark rollback and mode gate checklist"
  - "model benchmark migration gate verification"
  - "model benchmark rollback rehearsal"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/007-rollback-and-mode-gate"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/007-rollback-and-mode-gate"
    last_updated_at: "2026-07-15T23:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined Model Benchmark rollback switch and independent gate boundary"
    next_safe_action: "Freeze matrix gate predicates and rollback window evidence"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Model Benchmark - Rollback & Mode Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for the Model Benchmark mode gate. Items remain unchecked while the
phase is Planned. Every report pins BASE, candidate SHA, shared transition and mode-contract digests, write-set graph
digest, event and reducer versions, evaluator and canary epochs, matrix and fixture IDs, stream and artifact digests,
window ID, verifier identity, commands, exit codes, and every disposition. A green process exit without the required
evidence is not a passing gate. `INCONCLUSIVE`, `TELEMETRY_GAP`, `UNKNOWN`, `INSUFFICIENT_EVIDENCE`, stale evidence,
underpowered coverage, or an empty eligible matrix is blocking.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] BASE, candidate scope, shared transition/versioning/rollback digest, phase 012 contract digest, write-set graph digest, and phase-014 handoff version are recorded
- [ ] CHK-002 [P0] Model Benchmark siblings `001` through `006` are inventory-bound with event, reducer, seal, certificate, receipt, replay, resume, and shadow-parity references
- [ ] CHK-003 [P0] The shared-service ownership matrix identifies evaluator, canary, calibration, promotion, certificate, receipt, fingerprint, veto, budget, and rollback owners
- [ ] CHK-004 [P1] The legacy anchor, typed frontier, matrix frontier, evaluator epoch, canary epoch, and required fixture manifest are recorded for every gate boundary
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-005 [P0] The switch is default-deny and invalid or absent state resolves to `legacy_authoritative` with typed refusal evidence
- [ ] CHK-006 [P0] The Model Benchmark adapter cannot bypass external authorization or accept a certificate for another mode, contract, frontier, matrix, evaluator epoch, or canary epoch
- [ ] CHK-007 [P0] The rollback window records stable identity, legacy anchor, typed and matrix frontiers, trigger policy, fencing token, successful-run count, expiry, unresolved obligations, and close or rollback receipt
- [ ] CHK-008 [P1] Window closure requires both 14 calendar days and five successful authoritative executions and extends for low traffic or unresolved parity, validity, replay, receipt, budget, health, or effect obligations
- [ ] CHK-009 [P0] Gate and rollback operations do not rewrite legacy rows, delete typed events, mutate sealed artifacts, disclose hidden cases, dispatch models, or retire legacy writers
- [ ] CHK-010 [P1] Shared evaluator, canary, calibration, and promotion semantics have one source; the Model Benchmark adapter cannot fork hard vetoes, evidence states, receipt vocabulary, or rollback behavior
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-011 [P0] Absent, malformed, stale, unauthorized, mixed-version, gateway-failed, and wrong-mode requests fail closed before append, projection, effect, or authority change
- [ ] CHK-012 [P0] The Model Benchmark adapter cannot self-authorize rollback, unquarantine, verifier replacement, or legacy restoration
- [ ] CHK-013 [P0] The `006-shadow-parity` report is green for run declaration, matrix admission, model and execution-path dispatch, trial outcomes, raw observations, scoring, calibration, contamination, workload, abort, restore, resume, failure, and duplicate-delivery boundaries
- [ ] CHK-014 [P0] Event and projection parity has zero missing, extra, reordered, unauthorized, unsupported, or unexplained protected differences at every eligible matrix boundary
- [ ] CHK-015 [P0] Raw per-cell and per-item observations, model/build identity, execution path, task family, anchor or diagnostic status, seed, score vector, calibration, usage, cost, latency, and validity remain addressable after reduction changes
- [ ] CHK-016 [P0] Required recipe, anchor, diagnostic, model-cell, raw-trial, workload, calibration, contamination, and scoring artifacts have valid seals, dependency closures, current epochs, content digests, and tamper-evident reads
- [ ] CHK-017 [P0] Common sealed anchors remain paired across compared cells and adaptive diagnostics record information inputs, family quotas, selection policy, exposure caps, and confirmatory status
- [ ] CHK-018 [P0] Model and execution-path factors are independently represented where the claim is model-specific; a complete stack comparison is not mislabeled as a model comparison
- [ ] CHK-019 [P0] Candidate-specific judge calibration, rubric-axis validity, oracle uncertainty, protocol perturbations, contamination lineage, and hidden-visibility states remain separate from model quality scores
- [ ] CHK-020 [P0] Quality floors, pairwise or preference estimates, task-family uncertainty, cost, latency, abstention, switching overhead, and Pareto or conditional selection states remain separate and no ratio is the sole selection basis
- [ ] CHK-021 [P0] Certificate and receipt chains verify offline with stable replay fingerprints, predecessor links, effect identities, budgets, policy versions, matrix coverage, and explicit uncertainty
- [ ] CHK-022 [P0] Complete replay, checkpoint replay, matrix-order permutation, resume, changed-manifest, crash-before-receipt, duplicate delivery, and unknown-effect fixtures remain deterministic or fail closed
- [ ] CHK-023 [P0] Missing observations, stale watermarks, unsupported versions, evaluator or canary epoch mismatch, calibration gaps, contaminated cases, telemetry gaps, underpowered comparisons, and nondeterminism produce `blocked`, `incomplete`, or `rollback_required`
- [ ] CHK-024 [P0] Rollback rehearsal freezes admission, fences typed writers, classifies model-cell and scoring work, recovers or quarantines effects, restores legacy at a new epoch, preserves events and artifacts, and emits a rollback certificate
- [ ] CHK-025 [P0] The rollback window remains open until both 14 calendar days and five successful authoritative executions are satisfied and extends on low traffic or unresolved obligations
- [ ] CHK-026 [P0] Model Benchmark consumes the same evaluator, canary, calibration, promotion, certificate, receipt, fingerprint, veto, budget, and rollback fixtures through namespaced adapters
- [ ] CHK-027 [P0] Repeated evaluation of the same sealed matrix frontier emits the same gate disposition and certificate body digest; a changed semantic input invalidates the result
- [ ] CHK-028 [P0] Phase-014 receives a readiness certificate only; any certificate claiming authority moved, the rollback window closed, a model was globally selected, or legacy writers retired is rejected
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-029 [P1] The gate matrix covers every Model Benchmark run, matrix, anchor, adaptive-tail, validity, workload, replay, resume, failure, rollback, and shared-service-reuse obligation without an unowned evidence row
- [ ] CHK-030 [P1] Every failure or uncertainty case has an explicit `blocked`, `incomplete`, `not_ready`, `rollback_required`, or window-extension disposition and an evidence owner
- [ ] CHK-031 [P0] The mode certificate binds Model Benchmark, exact BASE and candidate SHA, contract and write-set digests, event and matrix frontiers, evaluator and canary epochs, sealed manifest, receipt chain, rollback anchor, verifier, and dispositions
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-032 [P0] Candidate-facing views cannot disclose hidden case content, evaluator internals, judge identity, calibration labels, or terminal evidence before the declared visibility boundary
- [ ] CHK-033 [P0] Rollback preserves append-only ledger history and sealed artifacts and never truncates evidence to make parity, replay, or certificate verification pass
- [ ] CHK-034 [P0] Fencing and monotonic epochs reject stale Model Benchmark writers and duplicate authority requests after rollback or restoration
- [ ] CHK-035 [P1] Certificate and receipt verification rejects mixed-version, expired, malformed, unsigned, or digest-mismatched references without widening capability scope
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-036 [P1] The phase docs distinguish the rollback switch, rollback certificate, independent Model Benchmark gate, mode-migration certificate, phase-014 readiness handoff, and later authority-cutover certificate
- [ ] CHK-037 [P1] The shared-service reuse boundary names Deep Improvement Common Services and records that Model Benchmark consumes its evaluator, canary, calibration, promotion, receipt, certificate, veto, budget, and recovery source
- [ ] CHK-038 [P2] Research traceability cites the 065/002 findings on model/path confounding, adaptive anchors, candidate-specific calibration, contamination lineage, operational workload, cost, and false-green ranking claims
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-039 [P0] Authored changes remain limited to this target phase folder and use the prescribed four-document Level 2 structure
- [ ] CHK-040 [P1] No `description.json` or `graph-metadata.json` is hand-written; deterministic tooling owns generated metadata
- [ ] CHK-041 [P1] Any later implementation remains path-scoped, additive-dark, dependency-closed, and ordered after the phase 012 contract freeze without adjacent sibling cleanup
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase passes only when every P0 verifier item is green, the independent gate has no unexplained evidence gap, shadow
parity is complete for the Model Benchmark lifecycle and shared-service adapters, seals and receipt chains verify, the matrix
fingerprint and replay are deterministic, the rollback window contract is intact, rollback rehearsal restores the legacy
anchor without data loss, and the exact-SHA certificate hands phase-014 readiness without an authority claim. A passing result
does not authorize cutover, model deployment, or legacy-writer retirement.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms fail-closed switch behavior, bounded rollback evidence, matrix shadow parity, sealed
artifact integrity, deterministic replay, validity and workload coverage, certificate validity, shared-service reuse, and no
unexpected tracked mutation outside this phase folder.
<!-- /ANCHOR:sign-off -->
