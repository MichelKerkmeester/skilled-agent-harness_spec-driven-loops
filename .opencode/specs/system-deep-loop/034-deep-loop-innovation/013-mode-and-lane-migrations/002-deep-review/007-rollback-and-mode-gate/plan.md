---
title: "Implementation Plan: Deep Review - Rollback & Mode Gate"
description: "Implementation Plan for the Deep Review rollback switch and independent mode gate: bind shared contracts, define fail-closed authority control and a bounded rollback window, verify lifecycle shadow parity and sealed evidence, and emit a non-authoritative migration certificate."
trigger_phrases:
  - "Deep Review rollback and mode gate implementation plan"
  - "deep-review authority control plan"
  - "deep-review migration certificate plan"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review/007-rollback-and-mode-gate"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review/007-rollback-and-mode-gate"
    last_updated_at: "2026-07-15T20:30:00Z"
    last_updated_by: "opencode"
    recent_action: "Mapped Deep Review gate inputs and rollback boundaries"
    next_safe_action: "Define control records, gate fixtures, and certificate fields"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Deep Review - Rollback & Mode Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop / Deep Review mode |
| **Change class** | Planning-only safety contract; mode gate and rollback evidence design |
| **Execution** | Isolated candidate run pinned to BASE; legacy remains authoritative |

### Overview
The phase defines the last Deep Review sibling boundary before the mode handoff. It consumes the typed event, reducer,
sealed-artifact, certificate, resume, and shadow-parity contracts, then assembles their evidence into one independent mode
gate. The gate observes the full `scope -> per-dimension passes -> candidate findings -> adjudicated P0/P1/P2 -> convergence
or blocked stop -> review-report -> continuity` path. It emits `MIGRATED_SHADOW_READY` only when the parity receipt is green,
all required references verify, and the run certificate and receipt chain close.

The authority control is separate from the gate. A missing or invalid cutover arm stays on legacy authority. A later authorized
ledger transition opens a rollback window with a sealed healthy ledger frontier and matching legacy checkpoint; any declared
integrity, parity, replay, receipt, effect, fence, or health failure returns to legacy or blocks. The phase-012 shared review-loop
contract and deep-alignment fence are consumed as pinned inputs rather than reimplemented.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The parent 065 invariant, phase tree, phase-012 shared review-loop contract, and write-set conflict graph are pinned by digest
- [ ] The six Deep Review sibling contracts expose their event, projection, seal, certificate, resume, and parity evidence boundaries
- [ ] The legacy lifecycle is inventoried for scope, every dimension, candidate and adjudication, convergence, report, resume, and handoff
- [ ] The authority-control record, fail-closed resolver, rollback trigger matrix, and dual-bound window are reviewed
- [ ] The mode-gate evidence matrix distinguishes required, optional, blocked, and indeterminate evidence without implicit waivers
- [ ] Gate fixtures freeze BASE, contract versions, target references, input digests, event tails, and expected authority posture
- [ ] The phase-014 handoff consumer and certificate expiry expectation are named without moving authority in this phase

### Definition of Done
- [ ] Invalid or stale authority control always resolves to legacy authority with a typed refusal
- [ ] The rollback switch and window record an externally authorized inverse transition, healthy anchor, bounds, triggers, and restoration receipt
- [ ] Every required Deep Review lifecycle fixture has parity, sealed-reference, receipt, certificate, resume, and gate evidence
- [ ] The mode gate is independently `PASS`, `BLOCKED`, or `INDETERMINATE`; another mode or aggregate dashboard cannot substitute
- [ ] `MIGRATED_SHADOW_READY` is emitted only with zero unexplained semantic parity differences and verified certificates
- [ ] The handoff contains no authority flip, legacy-writer retirement, or shared review-loop fork
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Pinned contract bundle**: capture BASE, phase-012 shared review-loop and write-set digests, mode contract revision, event and
  reducer versions, and the six sibling output references before gate evaluation.
- **Authority-control resolver**: evaluate requested posture, `cutoverEnabled`, mode-gate certificate, authority epoch, contract
  digests, health witness, and window state. Missing, stale, malformed, or unauthorized inputs resolve to `legacy_authoritative`.
- **Rollback switch**: model rollback as one externally authorized `ledger -> legacy` transition. Bind mode, authority epoch,
  reason, observed ledger tail, last healthy ledger frontier, matching legacy checkpoint, and restoration receipt; do not use a
  self-clearing process flag.
- **Bounded window**: start only after a later cutover acceptance event; enforce both an expiry deadline and a logical-operation
  or attempt budget. Expiry returns to legacy or blocks and requires a newly authorized window for any retry.
- **Trigger evaluator**: classify unexplained event or projection drift, seal or receipt failure, replay mismatch, unknown effect,
  stale fence, target or contract drift, integrity violation, health quarantine, and unexpected canonical writes as rollback or block
  decisions with immutable reasons.
- **Deep Review gate**: evaluate the complete mode lifecycle with a mode-local checklist and evidence matrix. The result is not
  inferred from deep-alignment, a generic mode count, final report text, or a numeric convergence score.
- **Parity input**: consume the event-for-event and projection comparator from `006-shadow-parity`; require zero unexplained
  differences and a typed disposition for every tolerated transport field.
- **Evidence closure**: consume verified shared seals for targets, pass observations, candidate/adjudication inputs, convergence,
  synthesis, report, and resume; consume the run certificate and transition receipt root from `004-certificates-and-receipts`.
- **Handoff artifact**: emit a mode-gate certificate with `PASS` plus `MIGRATED_SHADOW_READY`, all evidence digests, rollback drill
  result, and phase-014 handoff reference. The certificate is readiness evidence, not a cutover certificate.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Pin the parent, manifest, phase-012 shared mode contracts, write-set fence, phase-006 authorization boundary, and BASE inputs.
- Read the six Deep Review sibling contracts and build the evidence ownership matrix; reject duplicate local definitions.
- Inventory the existing Deep Review workflow, reducer, blocked-stop path, report synthesis, resume path, and legacy authority selector.
- Freeze control vocabulary, rollback-window bounds, trigger classes, gate result states, certificate fields, and fixture identifiers.

### Phase 2: Implementation
- Define the authority-control record, fail-closed resolution algorithm, external cutover arm, authority epoch binding, and legacy fallback.
- Define the rollback switch transition, healthy anchor, legacy checkpoint, dual bounds, trigger evaluator, expiry policy, and restoration receipt.
- Define the independent Deep Review gate matrix for every lifecycle boundary, required P0 evidence, blocked and indeterminate states,
  tolerated-difference handling, and the `MIGRATED_SHADOW_READY` output.
- Connect the gate to shared phase-012 scope, dimension, lineage, convergence, report, and write-set contracts and record their digests.
- Connect shadow-parity receipts, seal manifests and verified reads, run certificates, receipt closure, replay fingerprints, resume
  outcomes, and rollback-drill results into one certificate-bound evidence bundle.
- Build fixtures for a clean gate, each missing or stale input, each rollback trigger, each crash boundary, expired window, malformed
  toggle, unknown effect, and safe restoration to the legacy checkpoint.

### Phase 3: Verification
- Run the complete Deep Review fixture matrix from one pinned BASE and verify lifecycle coverage from scope through report and handoff.
- Verify parity event count, order, logical identity, causal links, payload and projection fingerprints, with no unexplained differences.
- Verify every referenced artifact, receipt, event range, replay fingerprint, certificate, and rollback anchor independently.
- Inject malformed, missing, stale, unauthorized, drifted, corrupted, and expired control evidence; require legacy fallback or block.
- Execute rollback at each declared boundary and verify no duplicate report, finding, effect, or authority transition is introduced.
- Confirm the gate emits `PASS` only as `MIGRATED_SHADOW_READY`, retains legacy authority, and hands evidence to phase 014.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Supply absent, malformed, stale, unauthorized, and digest-mismatched authority controls; verify typed refusal and `legacy_authoritative` resolution |
| REQ-002 | Execute the externally authorized rollback transition with a valid epoch and healthy anchor; reject self-clear, stale epoch, and missing-reason variants |
| REQ-003 | Exercise deadline and logical-operation bounds; verify the earlier bound expires the window and renewal requires a new authorized record |
| REQ-004 | Inject parity drift, replay mismatch, seal or receipt failure, unknown effect, fence loss, contract drift, health alarm, and canonical-write leakage; verify rollback or block classification |
| REQ-005 | Replay a failed tail and restoration receipt; verify no truncation, mutation, or evidence loss and deterministic failure identity |
| REQ-006 | Run scope, every dimension, candidate, evidence, adjudication, convergence, blocked-stop, synthesis, report, resume, and handoff fixtures through the gate matrix |
| REQ-007 | Compare legacy and ledger streams plus projections using the phase-009 comparator; require zero unexplained semantic differences and recorded volatility reasons |
| REQ-008 | Tamper, truncate, substitute, and descriptor-drift every lifecycle artifact class; require verified-read failure before gate consumption |
| REQ-009 | Verify the certificate-pinned event range, receipt-set root, replay fingerprint, seal manifest, and independent verifier outcome without live execution |
| REQ-010 | Compare the Deep Review gate's inherited shared fields and transitions with deep-alignment; reject a local scope, convergence, lineage, report, or fence fork |
| REQ-011 | Run Deep Review with missing deep-alignment evidence and generic dashboard success; verify the independent result remains blocked |
| REQ-012 | Inspect the handoff output and assert no authority transition, window close, legacy-writer removal, or phase-outside write is emitted |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The phase consumes the parent program's additive-dark migration rule, the phase-012 shared mode interfaces and write-set conflict
graph, the phase-006 ledger and authorization spine, and the Deep Review sibling contracts for typed events, reducers, sealed
artifacts, certificates, resume, and shadow parity. It also consumes the existing Deep Review workflow and blocked-stop fixtures,
the mode research registries, and the spec-kit validator. The predecessor `006-shadow-parity` and all earlier sibling names are
navigation and contract inputs; this planning document does not infer a runtime dependency from adjacency. The later staged
authority-cutover work consumes this phase's mode-gate certificate and rollback contract.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The planned safety posture is reversible by construction: leave the legacy emitter, readers, projections, and report path
authoritative; disable or discard non-authoritative gate and rollback fixtures; and retain their failure evidence for diagnosis.
Any candidate implementation lands in path-scoped commits. Reverting those commits restores the prior control contract without a
data migration. A parity or gate failure must never be repaired by widening the volatility allowlist, accepting an unverified seal,
extending the rollback window, or forcing the ledger toggle. If a candidate writes outside isolated output or changes canonical
authority, stop, preserve the evidence, and apply a targeted revert of the unintended change.
<!-- /ANCHOR:rollback -->
