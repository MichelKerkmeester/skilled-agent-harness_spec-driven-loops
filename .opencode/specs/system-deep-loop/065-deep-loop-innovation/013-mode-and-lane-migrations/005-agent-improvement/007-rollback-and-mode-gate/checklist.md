---
title: "Checklist: Agent Improvement - Rollback & Mode Gate"
description: "Blocking verification checklist for the Agent Improvement fail-closed rollback switch, bounded rollback window, independent shadow-parity mode gate, common evaluator/canary/promotion ownership, and phase-014 readiness certificate."
trigger_phrases:
  - "agent improvement rollback and mode gate checklist"
  - "agent loop migration gate verification"
  - "agent improvement rollback rehearsal"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/007-rollback-and-mode-gate"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/007-rollback-and-mode-gate"
    last_updated_at: "2026-07-15T21:20:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined Agent Improvement rollback switch and independent gate boundary"
    next_safe_action: "Freeze agent gate predicates and rollback-window evidence against shared contracts"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Agent Improvement - Rollback & Mode Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for the Agent Improvement mode gate. Items remain unchecked while the
phase is Planned. Every report pins BASE, candidate SHA, shared transition and mode-contract digests, the phase-012 and
phase-012 write-set evidence, event and reducer versions, AgentIR frontier, evaluator and canary epochs, fixture IDs,
stream and artifact digests, window ID, verifier identity, commands, exit codes, and every disposition. A green process exit
without the required evidence is not a passing gate. `INCONCLUSIVE`, `TELEMETRY_GAP`, `UNKNOWN`,
`INSUFFICIENT_EVIDENCE`, stale evidence, or an empty eligible corpus is blocking.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] BASE, candidate scope, shared transition/versioning/rollback digest, phase-012 contract digest, phase-015 contract and write-set graph digests, and phase-014 handoff version are recorded
- [ ] CHK-002 [P0] Agent Improvement sibling outputs `001` through `006` are inventory-bound with event, reducer, seal, certificate, receipt, replay, resume, and parity references
- [ ] CHK-003 [P0] The common-service ownership matrix identifies evaluator, canary, promotion, certificate, receipt, fingerprint, veto, and rollback owners for Agent Improvement and the other two variants
- [ ] CHK-004 [P1] The AgentIR frontier, legacy anchor, evaluator epoch, canary epoch, required behavior-family manifest, and required transfer fixtures are recorded for every gate boundary
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-005 [P0] The switch is default-deny and invalid or absent state resolves to `legacy_authoritative` with typed refusal evidence
- [ ] CHK-006 [P0] Agent Improvement cannot bypass external authorization or accept a certificate for another mode, contract, frontier, evaluator epoch, or canary epoch
- [ ] CHK-007 [P0] The rollback window records stable identity, legacy anchor, AgentIR frontier, trigger policy, fencing token, valid-run count, expiry, and close or rollback receipt
- [ ] CHK-008 [P1] Window closure requires both 14 calendar days and five successful authoritative executions and extends for low traffic or unresolved obligations
- [ ] CHK-009 [P0] Gate and rollback operations do not rewrite legacy rows, delete typed events, mutate sealed artifacts, disclose hidden canaries, dispatch a candidate, or retire legacy writers
- [ ] CHK-010 [P1] Common evaluator, canary, and promotion semantics have one source; Agent Improvement adapters cannot fork hard vetoes, evidence states, receipt vocabulary, certificate fields, or rollback behavior
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-011 [P0] Absent, malformed, stale, unauthorized, mixed-version, gateway-failed, wrong-mode, and cross-frontier requests fail closed before append, projection, effect, or authority change
- [ ] CHK-012 [P0] Agent Improvement cannot self-authorize rollback, unquarantine, verifier replacement, or legacy restoration
- [ ] CHK-013 [P0] The `006-shadow-parity` report is green for AgentIR, candidate lineage, raw evaluation, score normalization, canary, promotion, abort, restore, resume, failure, duplicate-delivery, and unknown-effect boundaries
- [ ] CHK-014 [P0] Event and projection parity has zero missing, extra, reordered, unauthorized, unsupported, or unexplained protected differences at every eligible boundary
- [ ] CHK-015 [P0] Raw per-case observations, clause and behavior-family identity, executor and environment, evaluator capsule, seed, score scale, rationale digest, normalization version, cost, latency, and transfer references remain addressable after reduction changes
- [ ] CHK-016 [P0] Required AgentIR, change-contract, improver, failure, candidate, raw-trajectory, evaluator, canary, and promotion artifacts have valid seals, dependency closures, current epochs, content digests, and tamper-evident reads
- [ ] CHK-017 [P0] Agent behavior fixtures cover clauses, authority conflicts, act/refuse/clarify, side effects, perturbations, untouched families, semantic variants, executor portability, profile scope, critical invariants, and transfer without exposing hidden contents
- [ ] CHK-018 [P0] Canary and promotion fixtures cover shadow, candidate-blind, authorized, denied, paused, aborted, restored, completed, vetoed, evaluator-integrity, `UNKNOWN`, and `INSUFFICIENT_EVIDENCE` outcomes
- [ ] CHK-019 [P0] Target reward and evaluator-integrity oversight remain separate; score inflation, hidden-fixture leakage, cache tampering, action-trace drift, authority regression, and transfer failure produce independent blocking evidence
- [ ] CHK-020 [P0] Certificate and receipt chains verify offline with stable replay fingerprints, predecessor links, effect identities, budgets, policy versions, AgentIR frontier, and explicit uncertainty
- [ ] CHK-021 [P0] Complete replay, checkpoint replay, resume, changed-manifest, crash-before-receipt, duplicate delivery, unknown-effect, and cross-executor fixtures remain deterministic or fail closed
- [ ] CHK-022 [P0] Missing observations, stale watermarks, unsupported versions, evaluator or canary epoch mismatch, telemetry gaps, transfer gaps, and nondeterminism produce `blocked`, `incomplete`, or `rollback_required`
- [ ] CHK-023 [P0] Rollback rehearsal freezes admission, fences typed writers, classifies in-flight proposal/evaluation/canary/promotion work, recovers or quarantines effects, restores legacy at a new epoch, preserves events and artifacts, and emits a rollback certificate
- [ ] CHK-024 [P0] The rollback window remains open until both 14 calendar days and five successful authoritative executions are satisfied and extends on low traffic or unresolved obligations
- [ ] CHK-025 [P0] Agent Improvement, model-benchmark, and skill-benchmark consume the same evaluator, canary, promotion, certificate, receipt, fingerprint, veto, and rollback fixtures through namespaced adapters
- [ ] CHK-026 [P0] Repeated evaluation of the same sealed Agent Improvement frontier emits the same gate disposition and certificate body digest; a changed semantic input invalidates the result
- [ ] CHK-027 [P0] Phase-014 receives a readiness certificate only; any certificate claiming authority moved, the rollback window closed, candidate dispatched, or legacy writers retired is rejected
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-028 [P1] The gate matrix covers every AgentIR, lineage, behavior-family, evaluator, canary, promotion, replay, resume, transfer, failure, rollback, and variant-reuse obligation without an unowned evidence row
- [ ] CHK-029 [P1] Every failure or uncertainty case has an explicit `blocked`, `incomplete`, `not_ready`, `rollback_required`, or window-extension disposition and an evidence owner
- [ ] CHK-030 [P0] The mode certificate binds Agent Improvement, exact BASE and candidate SHA, event/reducer and contract digests, write-set graph, AgentIR frontier, evaluator and canary epochs, sealed manifest, receipt chain, rollback anchor, verifier, and dispositions
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-031 [P0] Candidate-facing views cannot disclose hidden canary content, evaluator internals, judge identity, terminal evidence, or unrestricted score feedback before the declared information boundary
- [ ] CHK-032 [P0] Rollback preserves append-only ledger history and sealed AgentIR and trial artifacts and never truncates evidence to make parity, replay, or certificate verification pass
- [ ] CHK-033 [P0] Fencing and monotonic epochs reject stale Agent Improvement writers and duplicate authority requests after rollback or restoration
- [ ] CHK-034 [P1] Certificate and receipt verification rejects mixed-version, expired, malformed, unsigned, or digest-mismatched references without widening capability scope
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-035 [P1] The phase docs distinguish the rollback switch, rollback certificate, independent Agent Improvement mode gate, mode-migration certificate, phase-014 readiness handoff, and later phase-014 authority-cutover certificate
- [ ] CHK-036 [P1] The common-service reuse matrix names `005-agent-improvement`, `006-model-benchmark`, and `007-skill-benchmark` and records that they consume the mode-004 source
- [ ] CHK-037 [P2] Research traceability cites the 065/002 findings on AgentIR, first-divergent traces, Pareto lineage, frozen evaluator capsules, raw observations, behavior-family coverage, evaluator leakage, transfer, and reversible promotion
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-038 [P0] Authored changes remain limited to this target phase folder and use the prescribed four-document Level 2 structure
- [ ] CHK-039 [P1] No `description.json` or `graph-metadata.json` is hand-written; deterministic tooling owns generated metadata
- [ ] CHK-040 [P1] Any later implementation remains path-scoped, additive-dark, dependency-closed, and ordered after the shared contract/write-set freeze with no adjacent sibling cleanup
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase passes only when every P0 verifier item is green, the independent Agent Improvement gate has no unexplained
evidence gap, shadow parity covers the agent-loop lifecycle and common adapters, AgentIR and trial seals and receipt chains
verify, the rollback-window contract is intact, rollback rehearsal restores the legacy anchor without data loss, and the
exact-SHA certificate hands phase-014 readiness without an authority claim. A passing result does not authorize cutover or
legacy-writer retirement.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms fail-closed switch behavior, bounded rollback evidence, Agent Improvement
shadow parity, common-service ownership, sealed artifact integrity, deterministic replay, behavior-family and transfer
coverage, certificate validity, and no unexpected tracked mutation outside this phase folder.
<!-- /ANCHOR:sign-off -->
