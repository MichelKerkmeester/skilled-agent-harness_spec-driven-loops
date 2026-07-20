---
title: "Implementation Plan: Contradiction & Supersession Events"
description: "Implementation plan for typed contradiction and supersession events, deterministic effective-status derivation, and append-only audit replay."
trigger_phrases:
  - "contradiction supersession implementation plan"
  - "claim relationship reducer plan"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/010-novelty-claims-continuity-and-projections/002-contradiction-and-supersession-events"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/010-novelty-claims-continuity-and-projections/002-contradiction-and-supersession-events"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Planned event construction, status reduction, and replay verification"
    next_safe_action: "Bind the event registry to semantic-community and evidence inputs"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Contradiction & Supersession Events

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop shared claim intelligence |
| **Change class** | Typed event schemas, authorization invariants, reducer, and replay/audit contracts |
| **Execution** | Additive-dark on the phase-006 ledger; legacy behavior remains authoritative |

### Overview
Implement two relationship events over the versioned append-only ledger: symmetric `CONTRADICTION` and directional
`SUPERSESSION`. Candidate detection consumes semantic-community assignments plus evidence, but only the authorization
gateway may admit an event. A pure reducer folds assertions and withdrawals into active relations, derives effective
claim status, and emits audit-ready projections reproducible under the phase-006 fingerprint. The work preserves all
history and exposes typed inputs to sibling claim continuity and transactional projections.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The phase-006 envelope type registry, append API, authorization proof, verified reader, and replay-fingerprint interfaces are available or pinned as executable contracts.
- [ ] The `001-semantic-communities` output contract identifies claims, community IDs, assignment provenance, and versioned snapshots without making relation decisions authoritative.
- [ ] Claim and evidence references have stable IDs, exact locators, provenance/independence metadata, and resolvable evidence snapshots.
- [ ] The two event payloads and assertion/withdrawal rules are registered with explicit versions and canonical serialization.
- [ ] Invalid self-relations, missing references, non-canonical pairs, cycles, competing successors, and ambiguous withdrawals have typed rejection outcomes.
- [ ] The effective-status precedence and downstream projection shape are accepted by `003-claim-continuity` and `005-transactional-projections-and-gauges`.

### Definition of Done
- [ ] Both event types append idempotently through authorization and preserve evidence/history.
- [ ] Deterministic replay reproduces active relations, claim statuses, audit traces, and canonical contradiction counts.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Detection input adapter**: reads versioned semantic-community assignments from sibling 001, claim evidence edges, exact evidence locators, provenance/independence clusters, and the evidence snapshot digest. It emits candidates only.
- **Relationship validator**: canonicalizes contradiction pairs; validates claim/evidence existence and scope; rejects self-relations, supersession cycles, competing active successors, and ambiguous withdrawals; requires a typed incompatibility or strength rationale.
- **Event constructors**: build `deep-loop.claim.contradiction-recorded` and `deep-loop.claim.supersession-recorded` payloads under the phase-006 envelope, including detector version, snapshot reference, action, and withdrawal linkage.
- **Authorization and append boundary**: sends canonical bytes through the fail-closed transition gateway, then the locked append-only writer. Sequence and receipt are issued only after authorization and durable append.
- **Relationship reducer**: consumes the verified ledger in sequence order, folds `assert`/`withdraw`, resolves acyclic supersession chains, applies status precedence, and returns typed active/historical relation sets.
- **Audit/replay surface**: explains status using event IDs, ledger sequences, evidence locators, authorization references, relation actions, reducer version, and the covering replay fingerprint. Rebuildable indexes remain caches.
- **Downstream projection adapter**: publishes typed relation/state output to claim continuity and transactional gauges; no consumer recomputes meaning from raw prose or scalar contradiction counts.

Source contracts are the program parent `../../spec.md`, `../../manifest/phase-tree.json`, sibling
`../001-semantic-communities/spec.md`, phase-006
`../../006-transition-authorized-ledger-core/002-typed-append-only-ledger/spec.md` and
`../../006-transition-authorized-ledger-core/003-replay-fingerprints/spec.md`, plus run-2
`../../002-deep-loop-effectiveness-and-fanout/research/research-modes.md`.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Pin the phase-006 registry/ledger/gateway/fingerprint interfaces and the phase-010 sibling claim/community interfaces.
- Freeze canonical event names, positive schema versions, required evidence references, relation actions, status enum, and typed error codes.
- Build a fixture matrix from run-2 additions, corrections, retractions, duplicate sources, unresolved contradictions, and supersession-link recommendations.

### Phase 2: Implementation
- Implement candidate-input normalization over semantic-community assignments and evidence snapshots without status mutation.
- Implement contradiction pair canonicalization, supersession direction, relationship validation, cycle/multiplicity guards, and withdrawal validation.
- Register and construct the two versioned event payloads; route every append through transition authorization and the immutable ledger writer.
- Implement the pure relationship reducer, supersession-chain resolution, effective-status precedence, canonical active-pair counts, and typed downstream projection.
- Implement audit queries and replay descriptors that bind every derived status to immutable events, evidence, authorization, reducer version, and fingerprint.

### Phase 3: Verification
- Exercise valid assertion/withdrawal flows, exact retry idempotency, conflicting event IDs, and mixed contradiction/supersession histories.
- Prove self-relations, missing references, non-canonical pairs, cycles, competing successors, ambiguous withdrawals, corruption, and unknown versions fail closed.
- Replay the same verified range across supported processes and compare canonical reducer/projection bytes and audit traces.
- Verify the dark path records relationships without changing legacy outputs or authority and that downstream consumers use typed projections only.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Schema and round-trip fixtures prove canonical A↔B contradiction identity, evidence completeness, assertion, and withdrawal |
| REQ-002 | Schema and round-trip fixtures prove directional A→B supersession, replacement rationale, evidence completeness, assertion, and withdrawal |
| REQ-003 | Append/replay fixtures show withdrawal changes the active set while both original and withdrawal records remain byte-identical in history |
| REQ-004 | Candidate-only tests prove detector output cannot change status before authorization and successful durable append |
| REQ-005 | Negative matrix expects typed non-zero rejection before sequence allocation for every invalid relationship class |
| REQ-006 | Repeated and cross-process replay produces byte-identical active relations, terminal successors, statuses, and canonical projection bytes |
| REQ-007 | Mixed-history truth table proves superseded precedence while retaining contradiction edges and evidence in audit output |
| REQ-008 | Audit fixture traces each status to event, evidence, authorization, sequence, detector/reducer version, and fingerprint |
| REQ-009 | Exact retries return the original receipt; changed content under the same event ID rejects without a second relation |
| REQ-010 | Contract tests prove sibling consumers receive typed relation IDs/state and derive counts only from active canonical pairs |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

This planning leaf has no hard child dependency (`depends_on: []`). At the phase-010 composition gate it consumes the
prospective semantic-community contract from sibling 001, the phase-006 versioned envelope/typed ledger/authorization/
fingerprint APIs, stable evidence references from shared services, and stable claim identities consumed by sibling
003. The program manifest places phase 010 after the compatibility and fan-in parents and before convergence; this
work must not move authority or absorb downstream convergence policy.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Implementation lands additively behind the dark-ledger path. Before phase 014, disabling the relationship writer and
its projections restores the prior authoritative behavior without migrating or rewriting legacy state. Code and
registry changes are reverted by path-scoped commit reversal. Already appended relationship events are never deleted;
an erroneous active relation is counteracted by an authorized withdrawal event, and historical readers retain the
registered event/reducer versions for replay. No rollback may rebaseline a fingerprint or edit committed ledger bytes.
<!-- /ANCHOR:rollback -->
