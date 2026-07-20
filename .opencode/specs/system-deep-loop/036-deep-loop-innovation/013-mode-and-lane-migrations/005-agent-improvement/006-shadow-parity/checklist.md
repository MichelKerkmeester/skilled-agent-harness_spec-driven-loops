---
title: "Checklist: Agent Improvement - Shadow Parity"
description: "Checklist for the Agent Improvement shadow-parity phase: prove event-for-event and projection parity between the typed ledger path and legacy agent-loop emitter across proposal, scoring, causal, transfer, resume, canary, and promotion-preparation lifecycles before any authority cutover."
trigger_phrases:
  - "Agent Improvement shadow parity checklist"
  - "agent-improvement parity gate"
  - "agent proposal ledger checklist"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/006-shadow-parity"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/006-shadow-parity"
    last_updated_at: "2026-07-15T21:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined the blocking Agent Improvement shadow-parity checklist"
    next_safe_action: "Run the agent fixture matrix and attach receipts to each parity result"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Agent Improvement - Shadow Parity

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking shadow-parity verifier contract for Agent Improvement phase 009. Every item is a check the paired
verifier runs before parity evidence can be handed to `007-rollback-and-mode-gate`; each report pins BASE, mode and common-service
versions, AgentIR and evaluator digests, fixture IDs, both stream digests, projection fingerprints, commands, exit codes, coverage
counts, mismatch counts, and zero-authority-write evidence. `MISMATCH`, `INCONCLUSIVE`, `TELEMETRY_GAP`, `INSUFFICIENT_EVIDENCE`,
or zero eligible boundaries is a failed gate, not an implicit pass.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The phase-012 shared mode-contract digest, phase-014 shadow-framework interface, parent compatibility bridge, and mode 004 common-service contract are pinned in the candidate report
- [ ] CHK-002 [P0] The legacy Agent Improvement boundaries are inventoried for AgentIR/package compilation, proposal, mutation, lineage, scoring, raw trials, family stability, frontier, resume, and promotion preparation
- [ ] CHK-003 [P1] BASE, candidate and baseline digests, inheritance graph, evaluator capsule and epoch, fixture rings, executor/environment descriptors, input state, budget lease, fixture IDs, and output paths are frozen before dual execution
- [ ] CHK-004 [P1] The canonical event tuple, protected AgentIR and projection fields, diff taxonomy, common-service references, receipt schema, and volatility allowlist are reviewed before any difference is classified as tolerated
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-005 [P0] Changes are scoped to the Agent Improvement shadow contract; no adjacent mode implementation, common-service rewrite, authority flip, legacy-writer removal, or sibling concern is included
- [ ] CHK-006 [P0] Both paths receive one immutable run context and one evaluator capsule/epoch; divergence in run, lineage, AgentIR, baseline, fixture, executor, environment, budget, or input digest blocks the report
- [ ] CHK-007 [P0] Event pairing is one-to-one by stable logical identity and sequence; missing, extra, reordered, ambiguous, unauthorized, unsupported, and duplicated events fail closed
- [ ] CHK-008 [P1] The mode consumes the mode 004 evaluator, canary, promotion, health, receipt, and mismatch contracts; namespaced Agent Improvement fields cannot weaken common checks
- [ ] CHK-009 [P1] Unknown event fields, changed evaluator epochs, missing family samples, and non-allowlisted volatility fail closed rather than being dropped from comparison
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-010 [P0] Accepted fixtures have 100 percent event-boundary coverage with zero missing, extra, reordered, unauthorized, unknown-version, duplicate, or unexplained protected-field events
- [ ] CHK-011 [P0] AgentIR and inheritance projections match after every event boundary for structure, clause IDs, authority conflicts, changed locus, lineage, and compile or change-contract status
- [ ] CHK-012 [P0] Proposal and mutation fixtures preserve parent lineage, failure-cluster inputs, single-locus intent, candidate identity, and deterministic frontier membership
- [ ] CHK-013 [P0] Raw trial evidence retains candidate, baseline, evaluator capsule and epoch, fixture, executor, seed, judge family, raw scale, rationale digest, normalization version, cost, and latency across score-policy replay
- [ ] CHK-014 [P0] Family and dimension fixtures compare act, refuse, clarify, authority-conflict, tool/state failure, clean capability, security, and untouched-family outcomes without aggregate compensation hiding a regression
- [ ] CHK-015 [P0] Missing family or dimension samples produce explicit `INSUFFICIENT_EVIDENCE`; absent observations never appear as perfect stability or promotion success
- [ ] CHK-016 [P0] Known-locus defect, causal replay, ablation, and change-contract fixtures match failure class, implicated component, collateral utility, behavioral-semver impact, and repair disposition
- [ ] CHK-017 [P0] Semantic-equivalence and metamorphic fixtures preserve the required worst-variant or lower-tail result; identical replay alone cannot establish parity
- [ ] CHK-018 [P0] Executor-transfer fixtures use a separately provisioned verifier and preserve task artifacts, verifier semantics, transfer evidence, and invalidation when a model, tool schema, or adapter changes
- [ ] CHK-019 [P0] Evaluator epoch, canary, promotion, health, receipt, rollback-target, and integrity fixtures satisfy mode 004 common-service parity without allowing control-plane events to replace missing Agent Improvement behavior events
- [ ] CHK-020 [P0] Crash, resume, duplicate delivery, and fresh-continuation fixtures produce identical match identities, projection fingerprints, invalidation decisions, lease continuity, mismatch classes, and verdicts
- [ ] CHK-021 [P0] The accepted corpus has zero unexplained protected projection differences, zero blocking evidence gaps, and zero authority writes from the typed shadow path
- [ ] CHK-022 [P0] `MISMATCH`, `INCONCLUSIVE`, `TELEMETRY_GAP`, `INSUFFICIENT_EVIDENCE`, stale evaluator, unsupported AgentIR, or empty eligible corpus cannot produce `PASS`
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-023 [P1] The protected-field manifest covers AgentIR, inheritance, proposal lineage, changed loci, raw trials, family vectors, evaluator epochs, frontier, ablation, transfer, canary, promotion, rollback, resume, and terminal fields
- [ ] CHK-024 [P1] The lifecycle event map accounts for every initialization, proposal, mutation, causal, scoring, frontier, resume, transfer, canary, and promotion-preparation boundary
- [ ] CHK-025 [P1] The parity report identifies the mode 004 common-service result and every Agent Improvement fixture result, with no variant-local fork of shared parity semantics
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-026 [P0] Shadow execution cannot mutate AgentIR sources, evaluator assets, hidden fixtures, candidate or baseline state, production promotion state, or legacy-writer authority
- [ ] CHK-027 [P0] Candidate-blind evaluation, order-swapped judging, canary secrecy, evaluator-integrity checks, query limits, and capability separation retain only digest-bound evidence in shared projections
- [ ] CHK-028 [P1] Shadow reservations and duplicate external effects are bounded by typed budget and receipt rules without bypassing the shared transition-authorization gateway
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-029 [P1] The parity report schema, mismatch taxonomy, protected-field manifest, common-service reuse boundary, normalization manifest, and cutover-blocking criteria are reflected in the phase docs and successor handoff
- [ ] CHK-030 [P2] Research traceability cites the 036/002 findings on typed AgentIR, causal slicing, frozen evaluator epochs, raw trials, discipline families, transfer, and staged promotion
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-031 [P1] Shadow evidence is append-only and bounded; event-match, projection, mismatch, common-service, and final-verdict records retain source cursors and content digests
- [ ] CHK-032 [P1] Any later implementation remains path-scoped and additive-dark; no authority-cutover, common-service reimplementation, or legacy-writer retirement change lands in this phase
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete only when every P0 verifier check passes for the Agent Improvement corpus, every eligible boundary has event
and projection evidence, common evaluator/canary/promotion services remain non-authoritative and shared, raw proposal and trial
evidence remains addressable, and the final report is `PASS` with zero unexplained protected differences, zero blocking data gaps,
and zero authority writes. This evidence may be consumed by the successor mode gate; it cannot authorize authority cutover by itself.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the verifier confirms the P0 parity contract, the report pins source and target path versions plus AgentIR,
evaluator, corpus, and manifest hashes, replay and duplicate-delivery results are deterministic, common-service reuse is proven,
and the authority-write assertion is green for the complete verification run.
<!-- /ANCHOR:sign-off -->
