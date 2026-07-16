---
title: "Implementation Plan: Deep Alignment - Rollback & Mode Gate"
description: "Implementation Plan for the Deep Alignment rollback switch and independent mode gate: bind shared review-loop contracts, define fail-closed authority control and bounded rollback, verify per-lane parity and sealed conformance evidence, and emit a non-authoritative migration certificate."
trigger_phrases:
  - "Deep Alignment rollback and mode gate implementation plan"
  - "deep-alignment authority control plan"
  - "deep-alignment migration certificate plan"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/008-deep-alignment/007-rollback-and-mode-gate"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/008-deep-alignment/007-rollback-and-mode-gate"
    last_updated_at: "2026-07-15T21:45:00Z"
    last_updated_by: "opencode"
    recent_action: "Mapped Deep Alignment lane-gate inputs and rollback boundaries"
    next_safe_action: "Define control records, lane fixtures, and certificate fields"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Deep Alignment - Rollback & Mode Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop / Deep Alignment mode |
| **Change class** | Planning-only safety contract; per-lane mode gate and rollback evidence design |
| **Execution** | Isolated candidate run pinned to BASE; legacy remains authoritative |

### Overview
The phase defines the last Deep Alignment sibling boundary before the mode handoff. It consumes the typed schema, reducer,
sealed-artifact, certificate, resume, and shadow-parity contracts, then assembles their evidence into one independent gate. The gate
observes the complete `INIT -> SCOPE -> DISCOVER -> ITERATE -> CONVERGE -> REPORT` path for each resolved authority x artifact class x
scope lane, including applicability, live re-probe, known-deviation adjudication, unresolved states, report generation, resume, and
continuity. It emits `MIGRATED_SHADOW_READY` only when every required lane is covered, parity is green, authority and verifier
provenance are pinned, all required references verify, and the certificate and receipt chain close.

The authority control is separate from the gate. A missing, stale, mixed, or invalid authority capsule or cutover arm stays on
legacy authority. A later authorized ledger transition opens a rollback window with a sealed healthy ledger frontier and matching
legacy checkpoint; any declared authority, applicability, parity, replay, receipt, effect, fence, or health failure returns to legacy
or blocks. The phase-012 shared review-loop contract and Deep Review mode 002 fence are consumed as pinned inputs rather than
reimplemented. No authority cutover or remediation occurs in this phase.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The parent 065 invariant, phase tree, phase-012 shared review-loop contract, write-set conflict graph, and phase-014 handoff contract are pinned by digest
- [ ] The six Deep Alignment sibling contracts expose their event, projection, seal, certificate, resume, and parity evidence boundaries
- [ ] The legacy Deep Alignment state machine is inventoried for lane resolution, discovery, applicability, verification, known deviations, convergence, report, resume, continuity, and remediation exclusion
- [ ] The authority-control record, fail-closed resolver, rollback trigger matrix, and dual-bound window are reviewed
- [ ] The mode-gate evidence matrix distinguishes required, optional, blocked, unresolved, not-applicable, and indeterminate evidence without implicit waivers
- [ ] Lane fixtures freeze BASE, authority capsule, verifier digest, lane config, target digests, event tails, and expected authority posture
- [ ] The phase-014 handoff consumer and certificate expiry expectation are named without moving authority in this phase

### Definition of Done
- [ ] Invalid, stale, mixed, or unauthorized authority control always resolves to legacy authority with a typed refusal
- [ ] The rollback switch and window record an externally authorized inverse transition, healthy anchor, bounds, triggers, and restoration receipt
- [ ] Every required lane lifecycle fixture has parity, applicability, sealed-reference, receipt, certificate, resume, and gate evidence
- [ ] The mode gate is independently `PASS`, `BLOCKED`, or `INDETERMINATE`; another mode or aggregate dashboard cannot substitute
- [ ] `MIGRATED_SHADOW_READY` is emitted only with zero unexplained semantic parity differences and verified authority, verifier, and receipt evidence
- [ ] The handoff contains no authority flip, legacy-writer retirement, automatic remediation, or shared review-loop fork
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Pinned contract bundle**: capture BASE, phase-012 shared review-loop and write-set digests, mode contract revision, event and
  reducer versions, phase-014 handoff revision, and all six sibling output references before gate evaluation.
- **Authority capsule boundary**: snapshot the named authority, source anchors, compiled rule IR, applicability profiles, authority
  epoch, signature or content digest, verifier digest, capability checks, rule-test result, and coverage result. A readable live path
  is not an authorized or replay-safe authority.
- **Authority-control resolver**: evaluate requested posture, `cutoverEnabled`, mode-gate certificate, authority epoch, authority and
  verifier digests, lane config, contract digests, health witness, and window state. Missing, stale, malformed, or unauthorized inputs
  resolve to `legacy_authoritative`.
- **Rollback switch**: model rollback as one externally authorized `ledger -> legacy` transition. Bind mode, resolved lanes,
  authority epoch, reason, observed ledger tail, last healthy ledger frontier, matching legacy checkpoint, and restoration receipt; do
  not use a self-clearing process flag.
- **Bounded window**: start only after a later cutover acceptance event; enforce both an expiry deadline and a logical-operation or
  attempt budget. Expiry returns to legacy or blocks and requires a newly authorized window for any retry.
- **Trigger evaluator**: classify authority drift, applicability drift, event or projection drift, seal or receipt failure, replay
  mismatch, unknown effect, stale fence, contract drift, integrity violation, health quarantine, and canonical-write leakage as
  rollback or block decisions with immutable reasons.
- **Deep Alignment gate**: evaluate every resolved lane and the overall worst-verdict rollup from typed evidence. The result is not
  inferred from a report, aggregate score, discovered-artifact count, Deep Review result, or numeric convergence score.
- **Verify-first evidence path**: preserve immutable target observations, detector candidates, live re-probe receipts, known-deviation
  assertions, applicability outcomes, counterevidence, and unresolved states. A known deviation becomes an observable adjudication
  overlay, never deletion of the raw finding.
- **Parity input**: consume the event-for-event and projection comparator from `006-shadow-parity`; require zero unexplained
  differences across lane resolution, discovery, verification, finding disposition, convergence, report, resume, and continuity,
  with typed reasons for each allowed transport difference.
- **Evidence closure**: consume verified shared seals for authority and rule material, lane targets, observations, findings,
  counterevidence, known deviations, convergence, report, and resume; consume the run certificate and receipt root from
  `004-certificates-and-receipts`.
- **Handoff artifact**: emit a mode-gate certificate with `PASS` plus `MIGRATED_SHADOW_READY`, all evidence digests, rollback-drill
  result, per-lane verdicts, coverage, unresolved states, and phase-014 handoff reference. The certificate is readiness evidence, not
  a cutover certificate.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Pin the parent, manifest, phase-012 shared review-loop contract, write-set fence, phase-014 handoff, phase-006 authorization
  boundary, and BASE inputs.
- Read the six Deep Alignment sibling contracts and build the evidence ownership matrix; reject duplicate local definitions.
- Inventory the existing Deep Alignment state machine, lane resolver, authority adapters, known-deviation handling, blocked and
  unresolved paths, report reducer, resume path, and legacy authority selector.
- Freeze authority-control vocabulary, rollback-window bounds, trigger classes, lane gate states, certificate fields, and fixture IDs.

### Phase 2: Implementation
- Define the authority capsule and control record, fail-closed resolution algorithm, external cutover arm, authority epoch binding,
  verifier binding, and legacy fallback.
- Define the rollback switch transition, healthy frontier, legacy checkpoint, dual bounds, trigger evaluator, expiry policy, and
  restoration receipt.
- Define the independent Deep Alignment gate matrix for lane resolution, applicability, discovery coverage, verify-first findings,
  known-deviation overlays, unresolved outcomes, convergence, report, resume, continuity, and the `MIGRATED_SHADOW_READY` output.
- Connect the gate to shared phase-012 scope, coverage, lineage, convergence, report, resume, and write-set contracts and record
  their digests; preserve Deep Review mode 002 parity of shared fields.
- Connect shadow-parity receipts, authority and rule seal manifests, verifier reads, run certificates, receipt closure, replay
  fingerprints, resume outcomes, lane health, and rollback-drill results into one certificate-bound evidence bundle.
- Build fixtures for clean lanes, missing or stale authority, invalid applicability, known deviations, unresolved evidence, parity
  drift, malformed toggle, authority epoch change, each crash boundary, unknown effect, expired window, and safe legacy restoration.

### Phase 3: Verification
- Run the complete Deep Alignment lane fixture matrix from one pinned BASE and verify lifecycle coverage from lane scope through
  report, continuity, and phase-014 handoff.
- Verify event count, order, lane identity, authority epoch, causal links, payload and projection fingerprints, applicability edges,
  finding lineage, known-deviation overlays, and declared volatility with no unexplained differences.
- Verify every authority, rule, target, observation, finding, counterevidence, report, resume reference, receipt, event range,
  replay fingerprint, certificate, and rollback anchor independently.
- Inject malformed, missing, stale, unauthorized, mixed, drifted, corrupted, and expired control evidence; require legacy fallback or
  block before any ledger authority or report publication.
- Execute rollback at each declared boundary and verify no duplicate finding, effect, report, authority transition, or known-deviation
  overlay is introduced.
- Confirm the gate emits `PASS` only as `MIGRATED_SHADOW_READY`, retains legacy authority, leaves remediation disabled, and hands
  evidence to phase 014.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Supply absent, malformed, stale, expired, unauthorized, mixed-epoch, and digest-mismatched authority controls; verify typed refusal and `legacy_authoritative` resolution |
| REQ-002 | Execute the externally authorized rollback transition with a valid epoch and healthy frontier; reject self-clear, stale epoch, missing-reason, and lane-local authorization variants |
| REQ-003 | Exercise deadline and logical-operation bounds; verify the earlier bound expires the window and renewal requires a new authorized record |
| REQ-004 | Inject authority drift, applicability drift, parity mismatch, replay mismatch, seal or receipt failure, unknown effect, fence loss, contract drift, health alarm, and canonical-write leakage; verify rollback or block classification |
| REQ-005 | Replay a failed tail, known-deviation overlay, and restoration receipt; verify no truncation, mutation, raw-observation loss, or evidence identity drift |
| REQ-006 | Run lane resolution, discovery, applicability, artifact checks, live re-probe, known-deviation, unresolved, convergence, report, resume, continuity, and remediation-boundary fixtures through the gate matrix |
| REQ-007 | Compare legacy and ledger streams plus projections using the phase-009 comparator; require zero unexplained semantic differences and recorded volatility reasons per lane |
| REQ-008 | Tamper, truncate, substitute, and descriptor-drift authority, rule, target, observation, finding, evidence, report, and resume artifacts; require verified-read failure before gate consumption |
| REQ-009 | Exercise detector candidates without live re-probes, stale re-probes, known deviations, unresolved applicability, and counterevidence conflicts; require candidate or indeterminate status instead of asserted conformance |
| REQ-010 | Verify certificate-pinned event range, authority epoch, verifier digest, lane coverage, receipt-set root, replay fingerprint, seal manifest, and independent verifier outcome without live execution |
| REQ-011 | Compare Deep Alignment inherited shared fields and transitions with Deep Review mode 002; reject a local scope, convergence, lineage, report, resume, or write-set fork |
| REQ-012 | Run Deep Alignment with missing Deep Review evidence and generic dashboard success; verify the independent result remains blocked and the handoff emits only `MIGRATED_SHADOW_READY` |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The plan consumes the 065 program's additive-dark migration rule, the phase-012 shared review-loop contract and write-set conflict
graph, the phase-006 ledger and authorization spine, the phase-014 shadow and handoff contracts, and the Deep Alignment sibling
contracts for typed events, reducers, sealed artifacts, certificates, resume, and shadow parity. It also consumes the existing
Deep Alignment state machine, authority adapters, known-deviation contracts, the two findings registries, the Deep Review mode 002
shared-loop boundary, and the spec-kit validator. The predecessor `006-shadow-parity` and all earlier sibling names are navigation
and contract inputs; this planning document does not infer an undeclared runtime dependency from adjacency. The later staged
authority-cutover work consumes this phase's mode-gate certificate and rollback contract.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The planned safety posture is reversible by construction: leave legacy lane discovery, authority resolution, readers, projections,
and reports authoritative; disable or discard non-authoritative gate and rollback fixtures; and retain their failure evidence for
diagnosis. Any candidate implementation lands in path-scoped commits. Reverting those commits restores the prior control contract
without a data migration. A parity, authority, applicability, or gate failure must never be repaired by widening the volatility
allowlist, accepting an unverified authority or seal, extending the rollback window, forcing a ledger toggle, or converting
`UNRESOLVED` into pass. If a candidate writes outside isolated output or changes canonical authority, stop, preserve the evidence,
and apply a targeted revert of the unintended change.
<!-- /ANCHOR:rollback -->
