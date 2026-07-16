---
title: "Checklist: Deep Improvement Common Services - Shadow Parity"
description: "Checklist for the shadow-parity child of the Deep Improvement Common Services migration: verify event-for-event legacy and typed parity, boundary projection equality, phase-014 health shadow safety, and cutover-blocking evidence."
trigger_phrases:
  - "deep improvement shadow parity checklist"
  - "common service parity gate"
  - "typed ledger shadow acceptance"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/006-shadow-parity"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/006-shadow-parity"
    last_updated_at: "2026-07-15T20:30:00Z"
    last_updated_by: "opencode"
    recent_action: "Added cutover-blocking event and projection parity checks"
    next_safe_action: "Verify every protected field has a deterministic parity fixture"
    blockers: []
    key_files: []
    completion_pct: 0
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

- [ ] CHK-001 [P0] The sibling event, reducer, sealed-artifact, certificate, and resume contracts are identified with pinned versions and explicit ownership boundaries
- [ ] CHK-002 [P0] The phase-014 health and degeneration shadow framework is available with coherent cursor, watermark, policy, adapter, recovery, and action-request semantics
- [ ] CHK-003 [P1] The paired corpus includes healthy, failure, replay, resume, duplicate-delivery, evaluator-epoch, canary, promotion, and rollback-target fixtures
- [ ] CHK-004 [P1] The candidate report records BASE SHA, path versions, corpus digest, protected-field manifest hash, and normalization-manifest hash
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-005 [P0] Both paths receive one immutable run context; divergence in run, candidate, lineage, evaluator, fixture, baseline, budget, policy, or input digest blocks the report
- [ ] CHK-006 [P0] Event pairing is one-to-one by stable logical identity and sequence; missing, extra, reordered, ambiguous, unauthorized, and unsupported events fail closed
- [ ] CHK-007 [P0] Protected semantic fields are compared without over-normalization; every tolerated representation difference is named in the versioned normalization manifest
- [ ] CHK-008 [P1] The shared harness is reusable by `005-agent-improvement`, `006-model-benchmark`, and `007-skill-benchmark`; variant data is namespaced and cannot weaken common checks
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-009 [P0] Accepted fixtures have 100 percent event-boundary coverage with zero missing, extra, reordered, unauthorized, unknown-version, or unexplained protected-field events
- [ ] CHK-010 [P0] Projection snapshots match after every event boundary for lineage, evaluator epoch, raw-trial index, score normalization, uncertainty, canary state, promotion state, vetoes, receipts, budgets, rollback target, and terminal disposition
- [ ] CHK-011 [P0] A final-score match cannot pass an intermediate projection divergence; the boundary report records all compared snapshots and fingerprints
- [ ] CHK-012 [P0] Raw observations retain candidate, evaluator, fixture, seed, judge family, raw scale, rationale digest, normalization version, cost, and latency across score-policy replay
- [ ] CHK-013 [P0] Evaluator epoch changes, missing evidence, insufficient evidence, policy changes, and incomparable values produce explicit inconclusive or telemetry-gap outcomes
- [ ] CHK-014 [P0] Canary fixtures cover sealed, active, burned, retired, leak, drift, invariant-failure, veto, and freshness states without exposing hidden canary contents
- [ ] CHK-015 [P0] Promotion fixtures cover shadow, canary, authorized, denied, paused, aborted, baseline-restored, completed, and rollback-target states; shadow cannot authorize a transition
- [ ] CHK-016 [P0] Evaluator-integrity oversight is separate from task success; reward, test, cache, evidence, and hidden-fixture tampering produces a distinct blocking outcome
- [ ] CHK-017 [P0] Phase-014 healthy, degeneration, recovery, stale, missing, and unsupported observations preserve one coherent evidence boundary; data gaps never count as healthy
- [ ] CHK-018 [P0] Phase-014 pause, re-seed, quarantine, repair, and stop requests remain observations and do not stop, dispatch, cancel, spend budget, mutate a baseline, or change authority
- [ ] CHK-019 [P0] Complete replay, checkpoint replay, resume, and duplicate delivery produce identical match identities, projection fingerprints, mismatch classes, and verdicts
- [ ] CHK-020 [P1] Every mismatch carries source and target event references, raw digests, policy/version identities, cursors, projection fields, and a deterministic mismatch class
- [ ] CHK-021 [P0] The accepted corpus has zero unexplained protected projection differences and zero authority writes from the typed shadow path
- [ ] CHK-022 [P0] `MISMATCH`, `INCONCLUSIVE`, `TELEMETRY_GAP`, stale watermark, unsupported adapter, or empty eligible corpus cannot produce `PASS`
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-023 [P1] The protected-field manifest covers every shared evaluator, canary, promotion, receipt, budget, rollback, health, and terminal field named by the phase contract
- [ ] CHK-024 [P1] The parity report identifies all three downstream variants and records their common fixture result plus any namespaced extension result
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-025 [P0] Shadow execution cannot mutate evaluator assets, hidden fixtures, candidate state, stable baseline, production promotion state, or legacy-writer authority
- [ ] CHK-026 [P1] Candidate-blind judging, order-swapped comparisons, canary secrecy, and evaluator-integrity controls retain only digest-bound evidence in shared projections
- [ ] CHK-027 [P2] Shadow reservations and duplicate external effects are bounded by typed budget and receipt rules without bypassing the shared authorization gateway
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-028 [P1] The parity report schema, mismatch taxonomy, normalization manifest, and cutover-blocking criteria are reflected in the phase docs and successor handoff
- [ ] CHK-029 [P2] Research traceability cites the 065/002 findings on raw observations, evaluator capsules, canary freshness, independent oversight, and shadow/canary promotion
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-030 [P1] Shadow evidence is append-only and bounded; event-match, projection, mismatch, and final-verdict records retain source cursors and content digests
- [ ] CHK-031 [P1] Any later implementation remains path-scoped and additive-dark; no authority-cutover or legacy-writer retirement change lands in this phase
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete only when every P0 verifier check passes for the shared corpus and all three downstream variant fixture
sets, every eligible boundary has event and projection evidence, raw evaluator and canary evidence remains addressable, phase-014
health remains non-authoritative, and the final report is `PASS` with zero unexplained protected differences, zero blocking data
gaps, and zero authority writes. A passing report is evidence for the later mode gate; it is not a cutover certificate.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 parity contract, the report pins the source and target path versions plus
corpus and manifest hashes, replay and duplicate-delivery results are deterministic, and the authority-write assertion is
green for the complete verification run.
<!-- /ANCHOR:sign-off -->
