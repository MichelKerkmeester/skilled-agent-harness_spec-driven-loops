---
title: "Implementation Plan: Agent Improvement - Rollback & Mode Gate"
description: "Planning workflow for the Agent Improvement fail-closed rollback switch, bounded rollback window, independent mode gate, deep-improvement-common service reuse, and phase-014 readiness certificate."
trigger_phrases:
  - "agent improvement rollback and mode gate implementation plan"
  - "agent loop authority switch plan"
  - "agent improvement migration certificate plan"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/007-rollback-and-mode-gate"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/007-rollback-and-mode-gate"
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
# Implementation Plan: Agent Improvement - Rollback & Mode Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop / Agent Improvement mode migration |
| **Change class** | Mode-specific migration safety contract and independent gate design |
| **Execution** | Additive-dark typed path; legacy authority retained until the later cutover contract |

### Overview
This phase defines one Agent Improvement rollback switch and one independent gate for the agent-loop proposal-generation
and scoring variant. The switch is a default-deny adapter over the shared authority record: invalid state selects the legacy
path, and an authorized rollback freezes typed admission, fences stale writers, classifies in-flight work, and restores the
legacy anchor at a new epoch without deleting evidence. The gate composes `006-shadow-parity`, AgentIR and trajectory seals,
common evaluator/canary/promotion receipts, replay and resume evidence, behavior-family coverage, transfer evidence, and a
rollback rehearsal. It emits an exact-SHA readiness certificate for phase 014. It does not execute cutover, alter common
service semantics, close the rollback window, or retire a legacy writer.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The shared transition/versioning/rollback policy is pinned, including deny-by-default authorization, monotonic epochs, one-writer ownership, and the 14-day/five-successful-authoritative-execution minimum.
- [ ] Agent Improvement siblings `001-typed-ledger-schema` through `006-shadow-parity` expose event, projection, seal, certificate, receipt, replay, resume, and parity evidence boundaries.
- [ ] Phase 012 shared mode interfaces and the executable write-set conflict graph are available; phase 012 remains the contract-freeze boundary for the per-mode fan-out.
- [ ] The switch states, request fields, trigger classes, fencing behavior, and external authorization boundary are reviewed for Agent Improvement-specific proposal, evaluation, canary, and promotion work.
- [ ] The gate matrix names every AgentIR, lineage, behavior-family, evaluator, canary, promotion, replay, resume, transfer, failure, and rollback fixture.
- [ ] Agent Improvement consumes one mode-004 evaluator, canary, promotion, receipt, certificate, fingerprint, veto, and rollback contract through a namespaced adapter.
- [ ] The phase-014 handoff distinguishes migration readiness from phase-014 authority cutover and legacy-writer retirement.

### Definition of Done
- [ ] The switch rejects absent, stale, malformed, unauthorized, mixed-version, and wrong-mode inputs without semantic change.
- [ ] The rollback window is bounded, observable, extension-safe, and restorable to the pinned legacy anchor.
- [ ] The independent gate is green only with Agent Improvement shadow parity, sealed evidence, complete receipts and certificates, deterministic replay, resume coverage, behavior-family and transfer evidence, common-service reuse, and rollback rehearsal.
- [ ] The mode certificate is exact-SHA bound, independently verifiable, and explicit about unresolved obligations.
- [ ] Phase 014 receives readiness evidence without an authority transition, rollback-window closure, or legacy-writer retirement claim.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Common-service owner**: keep evaluator capsule construction, raw observation capture, normalization, canary freshness and leak checks, hard veto ordering, guarded promotion, receipts, certificates, and recovery in `004-deep-improvement-common`. Agent Improvement supplies namespaced AgentIR, candidate-lineage, causal-analysis, coverage, and transfer adapters only.
- **Switch boundary**: maintain one Agent Improvement policy adapter over the shared authority record. Its safe default is `legacy_authoritative`; invalid or stale state becomes legacy authority plus typed refusal evidence.
- **State progression**: `legacy_authoritative -> shadowing -> cutover_ready -> new_authoritative_reversible`. Failure paths move through `rollback_pending` to `legacy_restored`; `window_closed` is terminal until a new authorized gate and window. This phase defines admissibility, while phase 017 performs authority movement.
- **Fail-closed admission**: every authority-sensitive request requires mode, policy version, authority epoch, gate certificate digest, Agent Improvement frontier digest, request digest, evidence digest, actor capability, and current transition authorization. Missing or stale data denies before append, projection, effect, or authority change.
- **Window record**: bind window ID, mode ID, legacy anchor, typed AgentIR frontier, candidate and evaluator evidence references, opening and expiry policy, trigger classes, fencing token, valid successful-run count, unresolved obligations, and close or rollback receipt. Inherit the shared 14-day/five-success minimum rather than creating a variant rule.
- **Independent gate**: verify immutable parity, AgentIR and trajectory seals, common-service references, certificate and receipt chains, replay and resume fingerprints, family/transfer coverage, lifecycle fixtures, and rollback rehearsal outside the live Agent Improvement process.
- **Rollback path**: freeze typed-authoritative proposal/evaluation/promotion admission, fence writers, classify in-flight work through the resume adapter, resolve known effects by stable identity, restore the legacy anchor at a new epoch, preserve both histories, and issue a rollback certificate.
- **Certificate handoff**: emit `gate_passed`, `gate_blocked`, `gate_incomplete`, or `rollback_required` with exact digests. Only `gate_passed` can be consumed as phase-014 readiness; none of these results flips authority or authorizes phase-017 cutover.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Pin BASE, the shared transition/versioning/rollback policy, phase-012 contract freeze, phase-015 mode interfaces and write-set graph, and the phase-014 handoff schema.
- Inventory Agent Improvement siblings `001` through `006`: event and reducer versions, sealed artifact kinds, certificate and receipt classes, replay inputs, resume decisions, parity predicates, mismatch classes, and retained rollback anchors.
- Inventory Agent Improvement proposal, scoring, evaluator, canary, promotion, and legacy projection boundaries; classify common ownership, variant adapters, persisted evidence, and authority-sensitive effects.
- Freeze the agent gate input manifest, switch vocabulary, refusal taxonomy, inherited window minimum, successful-run definition, agent-specific extension triggers, and zero-authority-write assertion.

### Phase 2: Contract Definition
- Define the mode-scoped switch state machine, request schema, external authorization decision, stale-epoch rejection, fencing token, and typed refusal receipt.
- Define Agent Improvement rollback triggers for shadow-parity regression, AgentIR or lineage seal invalidity, evaluator/canary epoch mismatch, critical behavior regression, transfer failure, receipt gaps, unknown effects, evaluator-integrity failure, unsafe resume, stale requests, budget or health alarms, and split-brain attempts.
- Define the window record, opening and expiry evidence, inherited 14-day/five-success rule, low-traffic and unresolved-obligation extensions, close receipt, and explicit re-arming behavior.
- Define the non-destructive restoration sequence and its evidence order: freeze, fence, classify, recover or quarantine, restore, increment epoch, preserve, and certify.
- Define the common-service reuse matrix and reject Agent Improvement-local copies of evaluator, canary, promotion, receipt, certificate, fingerprint, veto, or recovery semantics.

### Phase 3: Gate Integration
- Define mode-gate predicates over `006-shadow-parity`, AgentIR and candidate lineage seals, common evaluator/canary/promotion evidence, certificates, receipts, replay, resume, behavior-family coverage, transfer, rollback, and zero authority writes.
- Compare raw per-case observations before normalized scores and preserve target reward, evaluator integrity, critical invariants, act/refuse/clarify outcomes, profile scope, transfer uncertainty, `UNKNOWN`, `INCONCLUSIVE`, `INSUFFICIENT_EVIDENCE`, veto, abort, restore, and promotion dispositions.
- Define the exact-SHA mode-migration certificate, verifier receipt, failed-predicate list, unresolved obligations, Agent Improvement rollback anchor, window state, and phase-014 acceptance handoff.
- Define deterministic repeated evaluation over the same sealed frontier and reject certificates with another mode, contract, write-set graph, evaluator epoch, canary epoch, reducer, or AgentIR frontier digest.

### Phase 4: Verification
- Exercise switch requests with absent, malformed, stale, unauthorized, gateway-failed, mixed-version, wrong-mode, and cross-frontier inputs; assert legacy authority and no semantic append or side effect.
- Run rollback drills at proposal, evaluation, canary, promotion, crash-before-receipt, unknown-effect, stale-writer, and unsafe-resume boundaries; prove fencing, new-epoch restoration, evidence retention, and rollback certification.
- Run the full Agent Improvement gate matrix and require green event/projection parity, valid AgentIR and trajectory seals, complete common-service receipts and certificates, deterministic replay, resume safety, behavior-family and transfer evidence, and zero unexplained semantic differences.
- Run shared fixtures through Agent Improvement, model-benchmark, and skill-benchmark adapters and reject any variant-local common-service or gate fork.
- Repeat the gate on the same sealed frontier, then mutate each semantic input class to prove certificate invalidation and phase-014 handoff rejection.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Feed absent, malformed, stale, mixed-version, wrong-mode, cross-frontier, and gateway-failed switch requests; assert `legacy_authoritative`, typed refusal, no semantic append, and no side effect |
| REQ-002 | Attempt self-authorized rollback, unquarantine, verifier replacement, and legacy restoration from Agent Improvement; require an external authorization decision |
| REQ-003 | Open, extend, close, and re-arm windows; prove closure waits for both 14 calendar days and five successful authoritative executions and extends on low traffic or unresolved obligations |
| REQ-004 | Inject failures before and after proposal, evaluator, canary, promotion, and effect boundaries; verify freeze, writer fencing, resume classification, stable effect recovery, new-epoch restoration, retained evidence, and rollback certificate |
| REQ-005 | Replay healthy, rejected, inconclusive, evaluator-integrity, canary-leak, transfer-failure, pause, abort, restore, duplicate, crash, and changed-manifest fixtures; require parity at every protected boundary |
| REQ-006 | Tamper, truncate, expire, cross-link, or omit AgentIR, change-contract, improver, raw trajectory, evaluator, canary, and promotion references; require typed seal or dependency refusal |
| REQ-007 | Run common fixtures through Agent Improvement, model-benchmark, and skill-benchmark adapters; compare shared fields, outcomes, hard vetoes, receipts, certificates, fingerprints, and rollback semantics |
| REQ-008 | Require clause, authority-conflict, act/refuse/clarify, side-effect, perturbation, untouched-family, and executor coverage; prove critical invariants cannot be compensated by an aggregate score |
| REQ-009 | Remove observations, introduce unknown effects, stale watermarks, unsupported versions, telemetry gaps, evaluator/canary mismatch, leak evidence, and nondeterminism; require non-green dispositions |
| REQ-010 | Recompute the certificate from pinned SHA, BASE, contracts, write-set graph, AgentIR frontier, epochs, fixtures, artifacts, receipts, and verifier; mutate each semantic input and require digest mismatch |
| REQ-011 | Run the verifier without live authority capability; assert green evidence emits only readiness and rejects another mode, frontier, epoch, contract, or any claim of cutover |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The plan consumes the parent program's additive-dark migration model and shared transition/versioning/rollback policy. It
uses Agent Improvement siblings `001-typed-ledger-schema`, `002-reducers-and-projections`, `003-sealed-artifacts`,
`004-certificates-and-receipts`, `005-resume-adapter`, and `006-shadow-parity`. Mode `004-deep-improvement-common` supplies
the shared evaluator, canary, promotion, certificate, receipt, fingerprint, veto, sealing, and recovery contracts. Phase
009 freezes the shared event contracts; phase 015 supplies the executable mode interfaces and write-set conflict graph; the
phase-014 consumer receives readiness; phase 017 owns authority movement. The research basis is the Agent Improvement
section of `findings-registry-modes.json` and the evaluator, receipt, authorization, degeneration, and rollback findings in
`findings-registry.json`.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

This phase changes planning documents only. Before runtime adoption, reverting the four path-scoped authored files and
re-ratifying the parent gate removes the proposed Agent Improvement switch and mode-gate contract without touching the
legacy emitter, typed ledger, common evaluator/canary/promotion services, AgentIR artifacts, or downstream variants.
Generated metadata remains owned by deterministic tooling.

During later implementation, a failed or inconclusive gate leaves `legacy_authoritative` selected and disables the proposed
Agent Improvement authority policy. A post-cutover incident uses the inherited window: freeze typed-authoritative proposal
and evaluation admission, fence the writer, append an authorized rollback request and restoration receipt, classify or
recover unknown effects through the shared policy, select the pinned legacy anchor, increment the authority epoch, and retain
typed events and sealed artifacts. If the window is closed, automatic restoration refuses and escalates; a new attempt
requires a fresh gate, window identity, certificate, and cutover receipt.
<!-- /ANCHOR:rollback -->
