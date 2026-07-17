---
title: "Implementation Plan: Skill Benchmark reducers and projections"
description: "Implementation Plan for the Skill Benchmark reducers and projections child: fold typed scenario and scoring events into deterministic projections while consuming deep-improvement-common services."
trigger_phrases:
  - "skill benchmark reducers implementation plan"
  - "skill-benchmark projection plan"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/007-skill-benchmark/002-reducers-and-projections"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/007-skill-benchmark/002-reducers-and-projections"
    last_updated_at: "2026-07-15T21:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Read the leaf mold, parent sequencing, and skill-benchmark research inputs"
    next_safe_action: "Define pure skill-event folds and projection invariants from the typed ledger schema"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Skill Benchmark reducers and projections

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop / skill-benchmark mode migration |
| **Change class** | Planning contract for pure reducers and read-model projections |
| **Execution** | Ordered after `001-typed-ledger-schema`; isolated mode lane under the 013 parent |

### Overview
This phase defines the reducer boundary for the skill-benchmark variant. The implementation will consume the typed event schema from `001-typed-ledger-schema`, apply a pure ordered fold, and expose three canonical projections: iteration/convergence state, an artifact index, and per-mode status. Skill-specific scenario and scoring semantics cover paired treatment arms, discovery and invocation stages, trajectory constraints, gold integrity, outcome lift, compatibility, and negative transfer. Deep-improvement-common owns dispatch, evaluator plumbing, budgets, receipts, continuity, and other shared controls; this lane must call those services rather than clone them. The phase ends with replay fixtures and downstream-compatible projection contracts, not sealed certificate issuance.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The predecessor event schema, version policy, canonical ordering, and identity rules are available as a frozen input
- [ ] Phase 012 shared mode interfaces and the deep-improvement-common ownership boundary are explicit
- [ ] Reducer state shapes and projection consumers are named before implementation begins
- [ ] Skill scenario, scoring, gold-integrity, and compatibility inputs are mapped to typed events
- [ ] Pure-fold, idempotency, unsupported-version, and prefix-replay behavior is specified
- [ ] The successor certificate-input contract is identified without moving sealing logic into this phase

### Definition of Done
- [ ] The same event sequence produces byte-equivalent canonical projections and a stable replay fingerprint
- [ ] Iteration/convergence, artifact-index, and per-mode-status projections preserve raw evidence and explicit blockers
- [ ] Skill-specific logic is layered on deep-improvement-common with no duplicated shared service
- [ ] Projection fixtures cover paired arms, missing/pending gold, partial failure, late events, duplicates, and incompatible dependencies
- [ ] Downstream sealed-artifact and independent mode-gate consumers have a reviewed projection contract
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- The reducer accepts only the versioned typed event stream and immutable reducer configuration; it does not read files, call executors, inspect current skill directories, use time, or generate randomness.
- A canonical event fold maintains normalized state keyed by run, scenario cell, treatment arm, task, executor, skill bundle, and evidence identity. Duplicate identity handling and unsupported event versions are explicit state transitions.
- The iteration/convergence projection separates event collection, exposure and invocation, trajectory/constraint coverage, outcome scoring, gold completeness, and certificate readiness. It records blockers rather than converting incomplete evidence into success.
- The artifact index maps immutable content-addressed evidence and derived records to their bundle, task/environment, executor, registry, tool, permission, dependency, gold, score, and future certificate consumers.
- The per-mode status projection derives lifecycle, scenario-arm, scoring, compatibility, withheld, expired, and projection-diagnostic states from the fold. It is a read model, not an authority switch.
- Paired lift, selection tax, content effect, executor interaction, negative transfer, and component-ablation reductions are skill-benchmark logic. Dispatch, budgets, receipts, continuity, locks, and evaluator invocation remain deep-improvement-common services.
- Projection snapshots are canonicalized and fingerprinted with event-schema, reducer, scoring-policy, and relevant content digests so resume and shadow replay can compare equivalent prefixes.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm `001-typed-ledger-schema`, phase 015 shared contracts, and deep-improvement-common interfaces are available; record the exact inputs used by the implementation lane.
- Inventory skill-benchmark event types, scenario identities, treatment arms, evaluator observations, gold states, and downstream artifact references without changing their owning contracts.
- Establish the reducer ownership matrix: shared service calls versus skill-specific fold and projection logic.

### Phase 2: Implementation
- Define the immutable reducer state, canonical event ordering, idempotency keys, unknown-version behavior, and projection fingerprint inputs.
- Implement the skill-specific fold for scenario treatment, exposure/invocation, trajectory and constraint coverage, raw evaluator observations, gold-integrity decisions, score normalization, paired contrasts, compatibility, and negative-transfer signals.
- Materialize deterministic iteration/convergence, artifact-index, and per-mode-status projections from the fold; preserve explicit pending, blocked, withheld, expired, and incompatible states.
- Add projection snapshot and prefix-replay contracts for resume and shadow parity, using deep-improvement-common services through their frozen interfaces.

### Phase 3: Verification
- Replay fixed event sequences repeatedly and compare canonical bytes, projection hashes, and status transitions.
- Verify duplicate, reordered, late, unsupported, missing-gold, partial-failure, and dependency-mismatch fixtures fail or converge according to the declared policy.
- Verify raw observations remain available and score changes are attributable to versioned policy inputs rather than event loss.
- Verify successor `003-sealed-artifacts` can consume the projection contract without importing reducer internals or shared-service duplicates.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Run the same typed event fixtures repeatedly and compare canonical projection bytes and reducer fingerprints; run with external services unavailable |
| REQ-002 | Exercise complete, partial, pending-gold, structural-only, blocked, and terminal scenario cells; assert readiness never derives from empty required evidence |
| REQ-003 | Assert every raw observation and derived record has a stable typed identity and digest-linked artifact-index entry, including missing and superseded references |
| REQ-004 | Replay lifecycle, scoring, compatibility, withheld, expired, and projection-error events from a clean state and from prefixes; compare status outputs |
| REQ-005 | Use ownership tests and dependency inspection to prove shared dispatch, evaluator, budget, receipt, lock, and continuity services are called rather than reimplemented |
| REQ-006 | Mutate normalization or aggregation policy while keeping raw events fixed; assert raw evidence is unchanged and derived records identify the policy version |
| REQ-007 | Feed duplicates, non-canonical order, late events, and unsupported versions; assert idempotency, explicit rejection, or typed blocked status as specified |
| REQ-008 | Rebuild projections from snapshot prefixes and full ledgers; validate successor-facing certificate inputs and independent mode-gate fields |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

This child depends on the typed event and replay contract from `001-typed-ledger-schema`, the shared mode interfaces and
fixtures from phase 015, and the deep-improvement-common services from mode 004. It consumes the shared ledger, transition,
receipt, budget, continuity, compatibility, fan-in, novelty, and convergence contracts established in phases 006-011. It
must hand a stable projection contract to successor `003-sealed-artifacts` and the parent 007 mode gate without moving
authority or duplicating common services.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The reducer and projection implementation will be isolated behind the mode's dark/shadow boundary. A failed parity or
replay gate rolls the lane back to the prior projection reader and leaves the typed ledger and raw events append-only. Any
projection snapshot produced by the candidate is disposable and can be regenerated from the ledger prefix; no legacy writer,
sealed artifact, or authority decision is removed in this child. If implementation commits are later applied, reverting
those path-scoped commits restores the previous mode-specific read model while preserving shared-service history.
<!-- /ANCHOR:rollback -->
