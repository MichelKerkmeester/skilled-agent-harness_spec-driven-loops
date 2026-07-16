---
title: "Implementation Plan: Deep Improvement Common Services - Shadow Parity"
description: "Implementation Plan for the shadow-parity child of the Deep Improvement Common Services migration: pair the legacy emitter with the typed ledger path, compare event-aligned projections, and produce a blocking parity report for later mode gates."
trigger_phrases:
  - "deep improvement shadow parity implementation plan"
  - "common service projection parity plan"
  - "typed ledger legacy emitter comparison"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/006-shadow-parity"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/006-shadow-parity"
    last_updated_at: "2026-07-15T20:30:00Z"
    last_updated_by: "opencode"
    recent_action: "Bounded parity around shared evaluator, canary, and promotion services"
    next_safe_action: "Freeze paired-event identities and protected projection fields"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Deep Improvement Common Services - Shadow Parity

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop / Deep Improvement Common Services |
| **Change class** | Shadow verification harness and parity contract |
| **Execution** | Planning-only child; legacy remains authoritative and no cutover occurs here |

### Overview
The phase defines one shared shadow harness for the evaluator-first loop: run candidate generation, evaluation, scoring,
canary analysis, and guarded-promotion observations through the legacy emitter and the typed ledger path from the same frozen
context. Match events one-for-one, compare projections after every boundary, retain raw evidence, and classify every divergence
with a blocking receipt. The phase-014 health and degeneration framework supplies coherent shadow observations and data-gap
semantics. The resulting parity report is the single cutover prerequisite consumed by the common mode gate and the three
downstream variants; it is not itself an authority certificate.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The typed event, reducer, sealed-artifact, certificate, and resume boundaries from siblings `001` through `005` are available for alignment
- [ ] The phase-014 health and degeneration shadow inputs, cursors, policy digests, and non-authoritative action semantics are available
- [ ] The legacy emitter and typed ledger path can receive the same run context without changing legacy authority
- [ ] Event pairing keys, protected fields, permitted normalization rules, and mismatch classes are frozen
- [ ] Projection checkpoints expose evaluator, candidate, score, canary, promotion, receipt, budget, rollback, and terminal state
- [ ] The three downstream variants agree to consume the common harness and use namespaced extensions only
- [ ] The fixture corpus covers replay, resume, duplicate delivery, evaluator epochs, canary failures, and promotion vetoes

### Definition of Done
- [ ] A reviewed event-for-event shadow comparison contract is specified
- [ ] Projection parity is checked at every event boundary rather than only at run completion
- [ ] Raw evaluator and canary evidence survives normalization and reduction-policy changes
- [ ] Phase-014 health observations remain shadow-only and fail closed on telemetry gaps
- [ ] The parity report has explicit PASS, MISMATCH, INCONCLUSIVE, and TELEMETRY_GAP outcomes
- [ ] A green report is a hard prerequisite for later cutover but cannot authorize cutover itself
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Paired shadow runner**: capture one immutable run context containing run, lineage, candidate, profile, evaluator epoch,
  fixture, baseline, budget, policy, and input digests; invoke the legacy emitter and typed path with separate output sinks.
- **Event mapper**: map each legacy emission to a typed event identity and preserve original serialized bytes, source hash,
  source cursor, target schema/version, adapter version, and normalization path. Ambiguous mappings fail closed.
- **Event comparator**: match by stable logical event identity and sequence boundary, then compare event family, causal links,
  payload meaning, policy references, authorization intent, receipt references, and terminal disposition. Missing, extra, or
  reordered events are blocking unless an explicit compatibility rule names the conversion.
- **Projection comparator**: fold the typed events and adapt the legacy state at every matched boundary. Compare protected fields,
  projection fingerprint, raw evidence indexes, canary lifecycle, promotion state, vetoes, rollback target, and receipts.
- **Common service probes**: evaluator probes compare raw observations before normalization; canary probes compare sealed epoch,
  leak/drift/invariant findings, order-swapped judging, and veto outcomes; promotion probes compare shadow/canary/ship state,
  external authorization, pause/abort/restore, and stable-baseline references.
- **Health shadow adapter**: consume phase-014 observations at the same ledger cursor and projection watermark. Record health,
  degeneration, `telemetry_gap`, `not_evaluable`, recovery, and action-request parity without invoking the requested action.
- **Evidence and verdict store**: append pair receipts, event-match records, projection snapshots, mismatch records, raw
  references, policy digests, and a final parity report. The store is diagnostic and cannot update production authority.
- **Cutover handoff**: expose a machine-readable green report for `007-rollback-and-mode-gate` and the downstream variants;
  expose no method that flips authority or retires a legacy writer.

### Protected parity dimensions

| Dimension | Required comparison | Allowed treatment |
|-----------|---------------------|-------------------|
| Identity and order | Run, lineage, candidate, logical event, causal parent, sequence, cursor | No tolerance for missing, extra, or reordered semantic events |
| Evaluator evidence | Raw observation, fixture, epoch/capsule, judge family, seed, scale, rationale digest | Preserve raw values; normalize only declared serialization |
| Score state | Normalization version, uncertainty, insufficient evidence, reduction policy | Policy changes create a new epoch or an explicit inconclusive result |
| Canary state | Sealed suite, freshness, leakage, drift, invariant, veto, outcome | Hidden contents remain referenced by digest and receipt |
| Promotion state | Proposal, authorization, eligibility, pause, abort, restore, completion, rollback target | Shadow output cannot authorize a transition |
| Projection state | Lineage, indexes, status, vetoes, receipts, budgets, terminal facts, fingerprint | Compare after every event boundary |
| Health state | Cursor, watermark, adapter/policy digest, signal, recovery, missing-data verdict | `telemetry_gap` and `not_evaluable` block PASS |
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm the shared event, reducer, sealed-artifact, certificate, and resume contracts and record their version and ownership boundaries.
- Import the phase-014 health shadow contract and define the common observation cursor, projection watermark, policy digest, and adapter digest.
- Inventory legacy emitter boundaries and typed-path boundaries for candidate generation, raw evaluation, normalization, canary, promotion, rollback, and terminal events.
- Freeze the parity corpus shape, protected-field manifest, normalization manifest, mismatch taxonomy, report states, and zero-authority-write assertion.

### Phase 2: Implementation
- Define the paired shadow-run record and immutable context digest used by both paths.
- Define the legacy-to-typed event adapter, one-to-one matcher, event comparison result, and fail-closed ambiguity behavior.
- Define projection snapshots and boundary comparison for candidate lineage, evaluator epoch, raw trials, score state, canary state, promotion state, receipts, budget, rollback, and terminal status.
- Define evaluator, canary, and promotion probes that preserve raw evidence and compare guarded outcomes without mutating protected assets or production state.
- Define phase-014 health observation ingestion, data-gap handling, recovery comparison, and non-authoritative action-request records.
- Define mismatch evidence receipts, parity verdicts, replay fingerprints, idempotency keys, retention limits, and the cutover-consumer report.
- Define common fixture interfaces for `005-agent-improvement`, `006-model-benchmark`, and `007-skill-benchmark` with namespaced variant data.

### Phase 3: Verification
- Run paired healthy and failure fixtures and confirm one match record per eligible event boundary.
- Verify zero missing, extra, reordered, unauthorized, unknown-version, and unexplained protected-field events on the accepted corpus.
- Compare projection hashes after each boundary and prove final-only equality cannot pass a divergent intermediate state.
- Replay captured pairs, duplicate boundary deliveries, and resume from checkpoints; compare match IDs, projection fingerprints, mismatch classes, and verdicts.
- Exercise evaluator epoch changes, score-policy changes, canary leakage/drift, evaluator-integrity failures, promotion vetoes, inconclusive evidence, and rollback-target preservation.
- Exercise phase-014 healthy, degeneration, recovery, stale, missing, and unsupported-input observations; confirm no action authority changes.
- Run the common fixtures against all three downstream variants and reject any variant-local fork of shared parity semantics.
- Produce a cutover-blocking report and verify that no green result invokes authority, dispatch, cancellation, baseline mutation, or legacy-writer retirement.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Paired-context fixtures prove both paths receive identical run, lineage, evaluator, fixture, baseline, budget, policy, and input digests |
| REQ-002 | Event corpus comparison proves one-to-one boundary matching and blocks missing, extra, reordered, unauthorized, ambiguous, and unsupported events |
| REQ-003 | Boundary snapshots compare protected projection fields and fingerprints after each event; an intermediate divergence fails even when terminal state later converges |
| REQ-004 | Raw-trial fixtures retain candidate, evaluator, fixture, seed, judge, scale, rationale digest, normalization, cost, and latency across score-policy replay |
| REQ-005 | Canary/promotion fixtures cover sealed epochs, leak, drift, invariant failure, veto, pause, abort, restore, authorization denial, and shadow non-authority |
| REQ-006 | Negative fixtures produce typed mismatch, `INCONCLUSIVE`, or `TELEMETRY_GAP` verdicts for stale, missing, malformed, unauthorized, or incomparable input |
| REQ-007 | Phase-014 fixtures prove coherent cursors, recovery hysteresis, and action-request observation without stop, dispatch, cancel, budget, or authority mutation |
| REQ-008 | Replay, resume, duplicate-delivery, and all three variant fixtures produce stable match IDs, projection fingerprints, mismatch classifications, and verdicts |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The direct inputs are the phase-014 health and degeneration shadow framework and the shared Deep Improvement Common
Services siblings `001-typed-ledger-schema`, `002-reducers-and-projections`, `003-sealed-artifacts`, `004-certificates-and-receipts`,
and `005-resume-adapter`. The parent program supplies the additive-dark migration invariant, phase-015 supplies the shared mode
interface and write-set conflict boundary, and `007-rollback-and-mode-gate` consumes the passing report without inheriting
authority from this child.

The research evidence is in `findings-registry.json` and `findings-registry-modes.json`: preserve raw evaluator observations,
version the evaluator dependency closure, use candidate-blind and order-swapped judging, rotate and seal canary epochs,
separate task reward from evaluator-integrity oversight, classify promotion failures, and treat promotion as a shadow/canary
deployment experiment with a stable rollback target. The shipped legacy evaluator, canary, and promotion services are the
behavioral reference during shadowing; no research recommendation authorizes a production cutover in this phase.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

This child changes planning artifacts only and performs no runtime write or data migration. If the contract fails review,
revert the four phase documents and reopen the parity boundary without touching the legacy emitter, typed ledger, evaluator
assets, hidden fixtures, or downstream variants.

During later implementation, disable the shadow consumer at its explicit feature boundary while retaining immutable pair and
mismatch receipts for diagnosis. The legacy emitter remains authoritative throughout. A failed or inconclusive parity report
must be treated as a block; it cannot be converted into a pass by dropping events, widening normalization, or bypassing the
authorization gateway. Production rollback and authority restoration belong to `007-rollback-and-mode-gate` and the later
staged cutover phase.
<!-- /ANCHOR:rollback -->
