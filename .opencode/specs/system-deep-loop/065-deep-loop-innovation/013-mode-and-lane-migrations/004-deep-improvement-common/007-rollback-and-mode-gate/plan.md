---
title: "Implementation Plan: Deep Improvement Common Services - Rollback & Mode Gate"
description: "Planning workflow for the shared Deep Improvement Common Services fail-closed rollback switch, bounded rollback window, independent migration gate, common evaluator/canary/promotion ownership, and phase-011 readiness certificate."
trigger_phrases:
  - "deep improvement common rollback and mode gate implementation plan"
  - "shared evaluator promotion authority switch plan"
  - "deep improvement migration certificate plan"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/007-rollback-and-mode-gate"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/007-rollback-and-mode-gate"
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
# Implementation Plan: Deep Improvement Common Services - Rollback & Mode Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop / Deep Improvement Common Services mode migration |
| **Change class** | Migration safety contract and independent mode-gate design |
| **Execution** | Additive-dark typed path; legacy authority retained until the later cutover contract |

### Overview

This phase defines one rollback switch and one independent gate for the evaluator-first common backbone. The switch is a
default-deny policy adapter over shared authority primitives: it freezes admission, fences stale writers, and restores the
legacy anchor at a new epoch only after external authorization. The gate assembles the `006-shadow-parity` report with sealed
artifacts, certificates, receipts, replay and resume evidence, rollback rehearsal, and shared-service reuse results. It emits
a mode-bound readiness certificate for the phase-011 handoff. No task changes live authority, deletes evidence, retires a
legacy writer, or allows a variant to redefine evaluator, canary, or promotion semantics.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] The shared transition/versioning/rollback policy is pinned, including deny-by-default authorization, monotonic epochs,
  one-writer ownership, and the 14-day/five-successful-authoritative-execution minimum.
- [ ] Siblings `001-typed-ledger-schema` through `006-shadow-parity` expose their event, projection, seal, certificate,
  receipt, replay, resume, and parity evidence boundaries.
- [ ] The phase-012 shared mode interfaces and executable write-set conflict graph are available for the downstream handoff.
- [ ] The switch states, request fields, trigger classes, fencing behavior, and external authorization boundary are reviewed.
- [ ] The gate matrix names every common evaluator, canary, promotion, replay, resume, failure, and rollback fixture.
- [ ] The three downstream variants agree to consume one shared evaluator, canary, promotion, certificate, receipt, and
  fingerprint contract through adapters.
- [ ] The phase-011 handoff distinguishes migration readiness from authority cutover and legacy-writer retirement.

### Definition of Done

- [ ] The switch rejects absent, stale, malformed, unauthorized, mixed-version, and wrong-mode inputs without semantic change.
- [ ] The rollback window is bounded, observable, extension-safe, and restorable to the pinned legacy anchor.
- [ ] The independent gate is green only with shadow parity, sealed evidence, complete receipts and certificates,
  deterministic replay, resume coverage, variant reuse, and rollback rehearsal.
- [ ] The mode certificate is exact-SHA bound, independently verifiable, and explicit about unresolved obligations.
- [ ] The phase-011 handoff receives readiness evidence without an authority transition or a global cutover claim.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Common-service owner**: keep evaluator epoch construction, raw observation capture, normalization boundary, canary
  freshness and leakage checks, guarded promotion, hard-veto ordering, and rollback evidence in one shared service contract.
  `005-agent-improvement`, `006-model-benchmark`, and `007-skill-benchmark` supply namespaced adapters only.
- **Switch boundary**: maintain one Deep Improvement Common Services policy adapter over the shared authority record. Its safe
  default is `legacy_authoritative`; invalid state becomes legacy authority plus a typed refusal.
- **State progression**: `legacy_authoritative -> shadowing -> cutover_ready -> new_authoritative_reversible`. Failure paths
  move through `rollback_pending` to `legacy_restored`; `window_closed` is terminal until a new authorized gate and window.
  This phase defines admissibility, while the later cutover contract performs the authority transition.
- **Fail-closed admission**: every authority-sensitive request requires mode, policy version, authority epoch, gate
  certificate digest, request digest, evidence digest, actor capability, and current transition authorization. Missing or
  stale data denies before append, projection, effect, or authority change.
- **Window record**: bind window ID, mode ID, legacy anchor, typed frontier, cutover evidence reference, opening and expiry
  policy, trigger classes, fencing token, successful-run count, unresolved obligations, and close or rollback receipt.
- **Independent gate**: verify immutable parity, sealed references, certificate and receipt chains, replay and resume
  fingerprints, lifecycle fixtures, common-service reuse, and rollback rehearsal outside the live mode process.
- **Rollback path**: freeze new typed-authoritative admission, fence writers, classify in-flight operations through the resume
  adapter, resolve known effects by stable identity, restore the legacy anchor at a new epoch, preserve both histories, and
  issue a rollback certificate.
- **Certificate handoff**: emit `gate_passed`, `gate_blocked`, `gate_incomplete`, or `rollback_required` with exact digests.
  Only `gate_passed` can be consumed as phase-011 readiness, and none of these results flips authority.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- Pin BASE and the shared transition/versioning/rollback policy, phase-012 contract and write-set graph, and phase-011
  handoff schema.
- Inventory siblings `001` through `006`: event and reducer versions, sealed artifact kinds, certificate and receipt classes,
  replay inputs, resume decisions, parity predicates, mismatch classes, and retained rollback anchors.
- Inventory the common evaluator, canary, and promotion service boundaries and mark shared logic, variant adapters, persisted
  evidence, legacy projections, and authority-sensitive effects.
- Freeze the gate input manifest, switch vocabulary, refusal taxonomy, minimum window, successful-run definition, and
  zero-authority-write assertion.

### Phase 2: Contract Definition

- Define the mode-scoped switch state machine, request schema, external authorization decision, stale-epoch rejection,
  fencing token, and typed refusal receipt.
- Define rollback triggers for parity regression, seal or certificate invalidity, replay drift, receipt gaps, unknown effects,
  evaluator-integrity failure, canary leak or drift, budget breach, health degeneration, unsafe resume, stale requests, and
  split-brain attempts.
- Define the window record, opening and expiry evidence, 14-day/five-success minimum, low-traffic and unresolved-obligation
  extensions, closure receipt, and explicit re-arming rules.
- Define the non-destructive restoration sequence and its evidence order: freeze, fence, classify, recover or quarantine,
  restore, increment epoch, preserve, and certify.
- Define the common-service reuse matrix and prevent downstream variants from copying evaluator, canary, promotion, receipt,
  certificate, fingerprint, or hard-veto semantics.

### Phase 3: Gate Integration

- Define the mode-gate predicates over shadow parity, sealed artifacts, certificates, receipts, replay, resume, lifecycle,
  rollback, and variant adapter evidence.
- Compare raw evaluator observations before normalized scores and preserve target reward, evaluator integrity, canary health,
  uncertainty, `UNKNOWN`, `INCONCLUSIVE`, `INSUFFICIENT_EVIDENCE`, veto, abort, restore, and promotion dispositions.
- Define the exact-SHA-bound mode-migration certificate, verifier receipt, failed-predicate list, rollback anchor, window state,
  unresolved obligations, and phase-011 acceptance handoff.
- Define deterministic repeated evaluation over the same sealed frontier and reject certificates with another mode, contract,
  evaluator epoch, canary epoch, reducer, or write-set digest.

### Phase 4: Verification

- Exercise switch requests with absent, malformed, stale, unauthorized, gateway-failed, mixed-version, and wrong-mode inputs;
  assert legacy authority and no semantic append or side effect.
- Run rollback drills at evaluator, canary, promotion, crash-before-receipt, unknown-effect, and stale-writer boundaries;
  prove fencing, new-epoch restoration, evidence retention, and rollback certification.
- Run the full common-service gate matrix and require green event/projection parity, valid seals, complete receipt and
  certificate chains, deterministic replay, resume safety, and zero unexplained semantic differences.
- Run common fixtures through all three downstream adapters and reject any variant-local service or gate fork.
- Repeat the gate on the same sealed frontier, then mutate each semantic input class to prove certificate invalidation and
  phase-011 handoff rejection.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Feed absent, malformed, stale, mixed-version, wrong-mode, and gateway-failed switch requests; assert legacy authority, typed refusal, no semantic append, and no side effect |
| REQ-002 | Attempt self-authorized rollback, unquarantine, verifier replacement, and legacy restoration from the shared services; require external decision evidence |
| REQ-003 | Open, extend, close, and re-arm windows; prove closure waits for both 14 calendar days and five successful authoritative executions and extends on low traffic or unresolved obligations |
| REQ-004 | Inject failures before and after effects; verify freeze, writer fencing, resume classification, stable effect recovery, new-epoch restoration, retained evidence, and rollback certificate |
| REQ-005 | Replay healthy, rejected, inconclusive, leak, drift, pause, abort, restore, duplicate, and crash fixtures; require event and projection parity at every protected boundary |
| REQ-006 | Tamper, truncate, expire, or cross-link evaluator, candidate, raw trial, canary, and promotion artifacts; require typed seal or dependency refusal |
| REQ-007 | Remove evidence, introduce unknown effects, stale watermarks, unsupported versions, telemetry gaps, and nondeterminism; require non-green dispositions |
| REQ-008 | Recompute the certificate from the pinned SHA, BASE, contracts, epochs, fixtures, artifacts, receipts, frontier, and verifier; mutate each semantic input and require a digest mismatch |
| REQ-009 | Run identical common fixtures through `005-agent-improvement`, `006-model-benchmark`, and `007-skill-benchmark`; compare shared fields, outcomes, hard vetoes, and rollback semantics |
| REQ-010 | Run the verifier with no live authority capability; assert that green evidence emits only readiness and cannot dispatch, promote, mutate a baseline, or retire a writer |
| REQ-011 | Evaluate the same sealed frontier twice for identical output, then substitute another mode or contract digest and require rejection |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The plan consumes the parent program's additive-dark migration model and shared transition/versioning/rollback policy. It
uses the Deep Improvement Common Services contracts in `001-typed-ledger-schema`, `002-reducers-and-projections`,
`003-sealed-artifacts`, `004-certificates-and-receipts`, `005-resume-adapter`, and `006-shadow-parity`. Phase 012 supplies
the shared mode interfaces and executable write-set conflict graph. The phase-011 handoff consumes this phase's readiness
certificate; the later staged cutover contract owns authority movement. The three downstream variants consume the common
evaluator, canary, and promotion services as adapters after the shared contracts are frozen. The research basis is the
deep-improvement portion of `findings-registry-modes.json` and the runtime authorization, replay, effects, budgets, and
rollback findings in `findings-registry.json`.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

This phase changes planning documents only. Before runtime adoption, reverting the four path-scoped authored files and
re-ratifying the parent gate removes the proposed switch and mode-gate contract without touching the legacy emitter, typed
ledger, evaluator assets, canary fixtures, or downstream variants. Generated metadata remains owned by deterministic tooling.

During later implementation, a failed or inconclusive gate leaves `legacy_authoritative` selected and disables the proposed
common-service authority policy. A post-cutover incident uses the declared window: freeze typed-authoritative admission,
fence the writer, append an authorized rollback request and restoration receipt, reconcile unknown effects through the shared
recovery policy, select the pinned legacy anchor, increment the authority epoch, and retain typed events and sealed artifacts.
If the window is closed, automatic restoration refuses and escalates; a new attempt requires a fresh gate, window identity,
certificate, and cutover receipt.
<!-- /ANCHOR:rollback -->
