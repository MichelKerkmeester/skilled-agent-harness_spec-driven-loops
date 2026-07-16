---
title: "Implementation Plan: Model Benchmark - Rollback & Mode Gate"
description: "Planning workflow for the Model Benchmark fail-closed rollback switch, bounded rollback window, independent matrix migration gate, shared-service reuse, and phase-014 readiness certificate."
trigger_phrases:
  - "model benchmark rollback and mode gate implementation plan"
  - "model benchmark authority switch plan"
  - "model benchmark migration certificate plan"
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
# Implementation Plan: Model Benchmark - Rollback & Mode Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop / Model Benchmark mode migration |
| **Change class** | Migration safety contract and independent matrix mode-gate design |
| **Execution** | Additive-dark typed path; legacy authority retained until the later cutover contract |

### Overview

This phase defines one Model Benchmark rollback switch and one independent gate for multi-model runs and their scoring
matrices. The switch is a default-deny adapter over shared authority primitives: it freezes typed-authoritative admission,
fences stale writers, and restores the legacy anchor at a new epoch only after external authorization. The gate assembles
`006-shadow-parity` with sealed matrix artifacts, certificates, receipts, replay and resume evidence, validity and workload
checks, and rollback rehearsal. It emits a mode-bound readiness certificate for the phase-014 handoff. No task changes live
authority, deletes evidence, re-runs model providers, re-implements shared evaluator/canary/promotion services, or allows a
benchmark result to bypass the shared transition gateway.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] The shared transition/versioning/rollback policy is pinned, including deny-by-default authorization, monotonic epochs,
  one-writer ownership, and the 14-day/five-successful-authoritative-execution minimum.
- [ ] Model Benchmark siblings `001` through `006` expose their event, reducer, seal, certificate, receipt, replay, resume,
  and shadow-parity evidence boundaries.
- [ ] The phase 012 shared mode contracts and executable write-set conflict graph are available for the phase-013 fan-out and
  phase-014 handoff.
- [ ] The switch states, request fields, trigger classes, fencing behavior, and external authorization boundary are reviewed.
- [ ] The gate matrix names every Model Benchmark run, matrix, validity, workload, replay, resume, failure, and rollback
  fixture.
- [ ] Model Benchmark reuses one Deep Improvement Common Services evaluator, canary, calibration, promotion, certificate,
  receipt, veto, budget, and recovery contract through adapters.
- [ ] The phase-014 handoff distinguishes migration readiness from authority cutover and legacy-writer retirement.

### Definition of Done

- [ ] The switch rejects absent, stale, malformed, unauthorized, mixed-version, and wrong-mode inputs without semantic change.
- [ ] The rollback window is bounded, observable, extension-safe, and restorable to the pinned legacy anchor.
- [ ] The independent gate is green only with matrix shadow parity, sealed evidence, complete receipts and certificates,
  deterministic replay, resume coverage, validity evidence, and rollback rehearsal.
- [ ] The mode certificate is exact-SHA and scoring-matrix bound, independently verifiable, and explicit about unresolved
  obligations.
- [ ] The phase-014 handoff receives readiness evidence without an authority transition, model deployment claim, or
  legacy-writer retirement.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Mode owner**: keep Model Benchmark run declaration, matrix identity, trial and scoring evidence, calibration validity,
  contamination lineage, workload treatment, and model-specific gate predicates in the Model Benchmark adapter. Do not copy
  shared evaluator, canary, calibration, promotion, receipt, certificate, veto, budget, or recovery behavior.
- **Switch boundary**: maintain one Model Benchmark policy adapter over the shared authority record. Its safe default is
  `legacy_authoritative`; invalid state becomes legacy authority plus typed refusal.
- **State progression**: `legacy_authoritative -> shadowing -> cutover_ready -> new_authoritative_reversible`. Failure paths
  move through `rollback_pending` to `legacy_restored`; `window_closed` is terminal until a new authorized gate and window.
  This phase defines admissibility, while the later cutover contract performs the authority transition.
- **Fail-closed admission**: every authority-sensitive request requires mode, policy version, authority epoch, gate
  certificate digest, matrix frontier digest, request digest, evidence digest, actor capability, and current transition
  authorization. Missing or stale data denies before append, projection, effect, or authority change.
- **Window record**: bind window ID, mode ID, legacy anchor, typed and matrix frontiers, cutover evidence reference, opening
  and expiry policy, trigger classes, fencing token, successful-run count, unresolved obligations, and close or rollback
  receipt.
- **Independent gate**: verify immutable shadow parity, sealed recipe and matrix references, certificate and receipt chains,
  replay and resume fingerprints, paired-anchor and coverage rules, validity and workload evidence, and rollback rehearsal
  outside the live Model Benchmark process.
- **Rollback path**: freeze new typed-authoritative admission, fence writers, classify active model cells and scoring effects
  through the resume adapter, resolve known effects by stable identity, restore the legacy anchor at a new epoch, preserve both
  histories, and issue a rollback certificate.
- **Certificate handoff**: emit `gate_passed`, `gate_blocked`, `gate_incomplete`, or `rollback_required` with exact digests.
  Only `gate_passed` can be consumed as phase-014 readiness, and none of these results flips authority.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- Pin BASE, the shared transition/versioning/rollback policy, phase 012 shared contracts and write-set graph, and the phase-014
  handoff schema.
- Inventory Model Benchmark siblings `001` through `006`: event and reducer versions, matrix projections, sealed artifact
  kinds, certificate and receipt classes, replay inputs, resume decisions, parity predicates, mismatch classes, and retained
  rollback anchors.
- Inventory the Model Benchmark run and scoring boundaries and classify mode-owned fields, shared-service adapters, persisted
  evidence, legacy projections, and authority-sensitive effects.
- Freeze the gate input manifest, switch vocabulary, refusal taxonomy, minimum window, successful-run definition, and
  zero-authority-write assertion.

### Phase 2: Contract Definition

- Define the mode-scoped switch state machine, request schema, external authorization decision, stale-epoch rejection, fencing
  token, and typed refusal receipt.
- Define rollback triggers for parity regression, seal or certificate invalidity, replay drift, receipt gaps, unknown effects,
  calibration or evaluator-integrity failure, contamination or canary leak, workload and budget breach, health degeneration,
  unsafe resume, stale requests, and split-brain attempts.
- Define the window record, opening and expiry evidence, 14-day/five-success rule, low-traffic and unresolved-obligation
  extensions, closure receipt, and explicit re-arming rules.
- Define the non-destructive restoration sequence and its evidence order: freeze, fence, classify, recover or quarantine,
  restore, increment epoch, preserve, and certify.
- Define the Model Benchmark matrix reuse boundary and prevent local copies of evaluator, canary, calibration, promotion,
  receipt, certificate, fingerprint, veto, budget, or recovery semantics.

### Phase 3: Gate Integration

- Define mode-gate predicates over shadow parity, sealed recipe and matrix artifacts, certificates, receipts, replay, resume,
  lifecycle, validity, workload, rollback, and shared-service adapter evidence.
- Compare raw model-cell observations before normalized scores and preserve model-versus-path identity, anchor coverage,
  adaptive diagnostics, task-family uncertainty, calibration, contamination, cost, latency, abstention, veto, abort, restore,
  and insufficient-evidence dispositions.
- Define the exact-SHA-bound Model Benchmark migration certificate, verifier receipt, failed-predicate list, matrix frontier,
  rollback anchor, window state, unresolved obligations, and phase-014 acceptance handoff.
- Define deterministic repeated evaluation over the same sealed matrix frontier and reject certificates with another mode,
  contract, evaluator epoch, canary epoch, reducer, matrix, or write-set digest.

### Phase 4: Verification

- Exercise switch requests with absent, malformed, stale, unauthorized, gateway-failed, mixed-version, and wrong-mode inputs;
  assert legacy authority and no semantic append or side effect.
- Run rollback drills at matrix admission, model-cell dispatch, unknown external outcome, score-before-receipt, crash,
  contaminated case, stale writer, and restore boundaries; prove fencing, new-epoch restoration, evidence retention, and
  rollback certification.
- Run the full Model Benchmark gate matrix and require green event and projection parity, valid seals, complete receipt and
  certificate chains, deterministic replay, resume safety, anchor and family coverage, validity evidence, and zero unexplained
  semantic differences.
- Run shared fixtures through the Model Benchmark adapter and reject any variant-local evaluator, canary, calibration,
  promotion, receipt, certificate, veto, or rollback fork.
- Repeat the gate on the same sealed matrix frontier, then mutate each semantic input class to prove certificate invalidation
  and phase-014 handoff rejection.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Feed absent, malformed, stale, mixed-version, wrong-mode, and gateway-failed switch requests; assert legacy authority, typed refusal, no semantic append, and no side effect |
| REQ-002 | Attempt self-authorized rollback, unquarantine, verifier replacement, and legacy restoration from the Model Benchmark adapter; require external decision evidence |
| REQ-003 | Open, extend, close, and re-arm windows; prove closure waits for both 14 calendar days and five successful authoritative executions and extends on low traffic or unresolved obligations |
| REQ-004 | Inject failures before and after model, scoring, and measurement effects; verify freeze, writer fencing, resume classification, stable effect recovery, new-epoch restoration, retained evidence, and rollback certificate |
| REQ-005 | Replay healthy, rejected, incomplete, contaminated, calibration-invalid, workload-invalid, abort, restore, duplicate, crash, and unknown-effect fixtures; require parity at every protected boundary |
| REQ-006 | Tamper, truncate, expire, leak, or cross-link recipe, anchor, diagnostic, model-cell, raw-observation, workload, scoring, calibration, and contamination artifacts; require typed seal or dependency refusal |
| REQ-007 | Recompute the certificate from the pinned SHA, BASE, contracts, epochs, matrix, artifacts, receipts, frontier, and verifier; mutate each semantic input and require a digest mismatch |
| REQ-008 | Remove evidence, introduce underpowered comparisons, unknown effects, stale watermarks, unsupported versions, telemetry gaps, contamination, and nondeterminism; require non-green dispositions |
| REQ-009 | Recompute the certificate with changed mode, matrix, model build, evaluator epoch, reducer, or write-set digest and require rejection |
| REQ-010 | Run common fixtures through the Model Benchmark adapter and compare shared fields, outcomes, hard vetoes, receipts, and rollback semantics against the Deep Improvement Common Services source |
| REQ-011 | Run the verifier with no live authority capability; assert that green evidence emits only readiness and cannot dispatch, promote, mutate a baseline, or retire a writer |
| REQ-012 | Evaluate the same sealed matrix frontier twice for identical output, then substitute another contract or pre-freeze write-set state and require rejection |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The plan consumes the parent program's additive-dark migration model and shared transition/versioning/rollback policy. It
uses Model Benchmark contracts in `001-typed-ledger-schema`, `002-reducers-and-projections`, `003-sealed-artifacts`,
`004-certificates-and-receipts`, `005-resume-adapter`, and `006-shadow-parity`. Deep Improvement Common Services mode 004
supplies the evaluator, canary, calibration, promotion, receipt, certificate, veto, budget, and recovery source of truth.
Phase 012 supplies the shared mode contracts and executable write-set conflict graph before the phase 013 fan-out. The
phase-014 handoff consumes this mode's readiness certificate; the later staged cutover contract owns authority movement. The
research basis is the Model Benchmark portion of `findings-registry-modes.json` and the runtime authorization, replay,
effects, budgets, and rollback findings in `findings-registry.json`.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

This phase changes planning documents only. Before runtime adoption, reverting the four path-scoped authored files and
re-ratifying the parent gate removes the proposed switch and Model Benchmark gate contract without touching the legacy
emitter, typed ledger, scoring artifacts, model fixtures, or shared services. Generated metadata remains owned by
deterministic tooling.

During later implementation, a failed or inconclusive gate leaves `legacy_authoritative` selected and disables the proposed
Model Benchmark authority policy. A post-cutover incident uses the declared window: freeze typed-authoritative admission,
fence the writer, append an authorized rollback request and restoration receipt, classify model-cell and scoring effects,
reconcile unknown outcomes through shared recovery, select the pinned legacy anchor, increment the authority epoch, and retain
typed events and sealed artifacts. If the window is closed, automatic restoration refuses and escalates; a new attempt
requires a fresh gate, window identity, certificate, and cutover receipt.
<!-- /ANCHOR:rollback -->
