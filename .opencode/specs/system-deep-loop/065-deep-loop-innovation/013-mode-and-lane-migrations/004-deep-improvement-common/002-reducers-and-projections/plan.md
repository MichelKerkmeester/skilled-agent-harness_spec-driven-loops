---
title: "Implementation Plan: Deep Improvement Common Services - Reducers & Projections"
description: "Implementation Plan for the reducers and projections phase of the deep-improvement common-services migration. The plan freezes a pure fold over the typed event ledger and one shared evaluator, canary, promotion, artifact-index, and per-mode status contract for the three downstream variants."
trigger_phrases:
  - "deep improvement reducers implementation plan"
  - "deep improvement projections plan"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/002-reducers-and-projections"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/002-reducers-and-projections"
    last_updated_at: "2026-07-15T20:30:00Z"
    last_updated_by: "opencode"
    recent_action: "Mapped fold boundaries across iteration, artifact, status, evaluator, canary, promotion"
    next_safe_action: "Resolve event ordering and checkpoint semantics with the predecessor schema"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Deep Improvement Common Services - Reducers & Projections

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop / deep-improvement common services |
| **Change class** | Shared state contract, pure reducers, projections, and replay fixtures |
| **Execution** | Isolated implementation after `001-typed-ledger-schema`; downstream consumers wait for the shared contract freeze |

### Overview

This phase turns the typed event sequence into deterministic live state for the evaluator-first loop. The implementation must separate event production from projection replay: evaluator, canary, promotion, and rollback services emit authorized events and receipts; reducers consume canonical events and return state without side effects. The resulting projection families provide iteration/convergence state, a searchable candidate and artifact index, evaluator/canary/promotion status, and one per-mode status contract for the common service plus its three variants.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] `001-typed-ledger-schema` publishes the event envelope, version policy, identity fields, and canonical ordering inputs
- [ ] Projection ownership is separated from `003-sealed-artifacts` and the three downstream variant migrations
- [ ] The common field matrix names every shared projection field, event source, stability rule, and consumer
- [ ] Pure-fold constraints prohibit I/O, time, randomness, network access, mutable evaluator reads, and hidden writes
- [ ] Evaluator epoch, raw trial, canary, promotion, rollback, and veto semantics are explicit before implementation begins
- [ ] Replay, checkpoint, mixed-version, malformed-event, and epoch-mismatch fixtures are identified

### Definition of Done

- [ ] Complete and checkpointed replay produce byte-identical projections and fingerprints
- [ ] Shared evaluator, canary, promotion, and per-mode status contracts are consumed by all three downstream variants without semantic forks
- [ ] Raw evidence, lineage, and receipt references remain available after reductions or evaluator epoch changes
- [ ] Strict validation and the phase verifier pass without tracked changes outside the phase implementation scope
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Canonical fold boundary**: accept only the typed, authorized, canonical event form from `001-typed-ledger-schema`; apply `reduce(state, event)` as a pure function and derive a canonical serialized state plus projection fingerprint.
- **Event semantics**: define stable event identity, sequence/frontier, event-time fields supplied by the event, schema-version checks, duplicate handling, rejected-event behavior, and a named upcaster boundary. The reducer must not invent IDs, reorder ambiguous events, or repair malformed evidence silently.
- **Iteration/convergence projection**: maintain evaluator epoch, iteration identity, candidate work, budget observations, progress counters, unresolved evidence, convergence signals, stop disposition, and resume frontier. It records decisions and evidence references rather than recomputing them.
- **Candidate/artifact index**: index candidate lineage, mutation operator, profile scope, incumbent relationship, evaluator and fixture digests, raw trial references, reduction versions, cost/latency observations, canary references, and promotion receipts. Artifact payloads remain immutable and are referenced by digest.
- **Common service projections**: expose evaluator capsule/epoch status, trial-score stage status, canary lifecycle, promotion stage, hard vetoes, pause/inconclusive reasons, rollback target, and receipt validity. Evaluator execution and promotion effects remain outside the fold.
- **Per-mode status**: publish a shared status shape for common, agent, model, and skill workstreams. It supports profile-scoped specialists and incumbent fallback without allowing each variant to redefine stage transitions or veto meaning.
- **Information boundary**: candidate generators receive only the explicitly permitted projection view and redacted verdict bands. Hidden fixtures, exact evaluator internals, raw rationales, and terminal evidence remain behind the evaluator service boundary.
- **Checkpoint and rebuild**: checkpoint each projection family at an event frontier with reducer/schema fingerprints. Rebuild from the ledger and resume from a checkpoint must converge to the same bytes, index entries, and status values.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- Confirm the predecessor event schema and its compatibility policy; record the exact input event families and fields consumed by each projection.
- Build the shared projection field matrix, event-to-reducer map, ownership boundary, and consumer contract for `005-agent-improvement`, `006-model-benchmark`, and `007-skill-benchmark`.
- Pin representative event histories for evaluator initialization, candidate generation, scoring, canary analysis, promotion, pause, rollback, and resume.

### Phase 2: Implementation

- Implement the pure fold shell with canonical event dispatch, identity/deduplication, version rejection, deterministic serialization, and projection fingerprints.
- Implement iteration/convergence reduction for evaluator epochs, candidate progress, budget observations, unresolved evidence, stop dispositions, and resumable frontiers.
- Implement the candidate/artifact index with append-only raw trial references, lineage, operator and profile identity, evaluator/fixture digests, reduction versions, and receipt links.
- Implement shared evaluator status and epoch matching, including capsule identity, calibration state, hidden-anchor commitment, query budget state, and cross-epoch comparison refusal.
- Implement canary and promotion status reduction for offline acceptance, shadow, canary, ship eligibility, shipped, paused, aborted, rolled back, and inconclusive states with non-overridable vetoes.
- Implement the common per-mode status projection and its profile-scoped incumbent/fallback semantics without adding variant-specific mutation logic.
- Add checkpoint/rebuild contracts, state-hash comparison, mixed-version fixtures, and explicit projection migration or upcast handling.

### Phase 3: Verification

- Replay the same event bytes through fresh and checkpointed reducers and compare canonical projection bytes, fingerprints, index contents, and per-mode status.
- Exercise duplicate, missing, malformed, out-of-order, unsupported-version, stale-capsule, missing-receipt, and stale-canary cases; each must reject or enter an explicit safe state.
- Verify raw evidence survives normalization-policy changes and that aggregate score cannot clear critical dimension, evaluator-integrity, canary, or rollback vetoes.
- Verify the three downstream variants consume the common event and projection contract with identical stage semantics and no private replacement of common fields.
- Run strict spec validation and the phase-specific quality gate on the exact implementation candidate.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Property tests run identical canonical event sequences through fresh reducers and assert byte-identical state plus fingerprint with no side-effect calls |
| REQ-002 | Table-driven event semantics cover duplicate IDs, malformed payloads, ambiguous ordering, unsupported versions, and named upcaster paths; unsafe inputs fail closed |
| REQ-003 | Golden histories cover evaluator epoch creation, candidate generation, scoring, convergence, stop, resume, budget observations, and unresolved evidence |
| REQ-004 | Rebuild fixtures inspect raw trial, lineage, operator, profile, digest, cost, latency, and receipt references after reduction-policy changes |
| REQ-005 | Epoch fixtures reject mismatched evaluator capsules, changing fixture commitments, and cross-epoch baseline/candidate comparisons |
| REQ-006 | State-machine tests cover shadow/canary/ship/pause/abort/rollback/inconclusive transitions, hard vetoes, and stable rollback targets |
| REQ-007 | Contract tests run the same common projection fixtures through common, agent, model, and skill variant adapters and compare shared fields |
| REQ-008 | Checkpoint and full-history replay produce equal projection hashes and index/status snapshots across batch boundaries |
| REQ-009 | Reducer tests use effect guards or dependency injection assertions to prove no filesystem, network, clock, randomness, evaluator, or promotion side effect is reachable |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The primary dependency is `001-typed-ledger-schema`, which supplies the canonical event envelope and replay inputs. The successor `003-sealed-artifacts` owns the immutable artifact format consumed by reference. The phase also depends on the parent program's shared mode-contract and write-set freeze before downstream migration integration, the existing deep-improvement shared promotion gate and scoring fixtures, and the spec-kit validator. The three benchmark variants are consumers, not prerequisites for defining the common contract.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Implementation is additive at the projection boundary. If a reducer or projection fails parity, stop consuming the new projection, preserve the append-only event ledger and raw evidence, and restore the prior reader or checkpointed projection snapshot. Rebuild from the last known-good event frontier after correcting the reducer version; do not mutate or delete ledger events to repair a projection. A `git revert` of the path-scoped phase commits restores the prior projection readers and service adapters, while retained event fixtures make the new projection reproducible after retry.
<!-- /ANCHOR:rollback -->
