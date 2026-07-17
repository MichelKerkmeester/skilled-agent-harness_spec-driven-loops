---
title: "Implementation Plan: Transactional Projections & Gauges"
description: "Implementation plan for atomic ledger-derived projection bundles, resumable idempotent apply, consistent snapshots, and isolated deterministic generation rebuilds."
trigger_phrases:
  - "transactional projections implementation plan"
  - "atomic projection bundle plan"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/010-novelty-claims-continuity-and-projections/005-transactional-projections-and-gauges"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/010-novelty-claims-continuity-and-projections/005-transactional-projections-and-gauges"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Planned atomic apply, snapshot reads, resume, and generation rebuild"
    next_safe_action: "Implement the registry and transaction coordinator against the ledger API"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Transactional Projections & Gauges

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop runtime projections and observability |
| **Change class** | Derived-state transaction, replay, and publication architecture |
| **Execution** | Additive-dark implementation over the verified phase-006 ledger |

### Overview
Implement a versioned projection-bundle registry and a fenced coordinator that consumes verified ledger records in
sequence order. For each event, compute all affected phase-010 views and phase-007 gauges, validate their canonical
next states, then commit the view writes, apply receipt, and next watermark in one storage transaction. Resume begins
only from that committed watermark. Rebuild replays into a new invisible generation, verifies canonical hashes and
prefix provenance, and publishes the completed generation with one atomic pointer swap. Existing observability JSONL
and legacy views remain authoritative during this phase.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The phase-006 typed reader exposes verified ledger identity, sequence, record hash, canonical event bytes, and typed decode.
- [ ] Phase-010 siblings define the semantic-community, contradiction/supersession, claim-continuity, and next-focus events this bundle projects.
- [ ] The phase-007 gauge registry exposes versioned pure reducers, exact arithmetic, canonical serialization, and checkpoint provenance.
- [ ] The selected canonical store proves atomic multi-table transactions, snapshot reads, uniqueness constraints, and fenced expected-watermark updates.
- [ ] Legacy observability and derived-view authority boundaries are inventoried, including `runtime/lib/deep-loop/observability-events.cjs`.

### Definition of Done
- [ ] Every accepted event commits all affected projections, gauges, receipt, and watermark together or commits none.
- [ ] Duplicate, conflict, crash, restart, stale-worker, and partial-write fixtures fail closed without drift.
- [ ] Full rebuild and watermark resume produce byte-identical canonical hashes at the same ledger cutoff.
- [ ] Readers see one committed generation and cutoff; rebuild publication is one atomic pointer change.
- [ ] Additive-dark comparison is recorded without changing legacy decisions, schemas, or error behavior.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Projection registry**: stable bundle and view IDs, semantic versions, accepted event schemas, dependency DAG, reducers/finalizers, storage schema, reducer/configuration digests, and typed unknown-input behavior.
- **Generation namespace**: all canonical rows carry a generation ID; one active-generation record identifies the only generation visible to standard readers.
- **Verified input cursor**: the coordinator accepts records only from the phase-006 verified reader and binds progress to ledger ID, sequence, record hash, bundle version, and digests.
- **Deterministic prepare step**: reducers compute canonical mutations from the prior committed state and one event without wall time, randomness, locale, process globals, network reads, or mutable exports.
- **Atomic apply transaction**: begin; fence and compare expected watermark; validate the idempotency tuple; write all affected views and phase-007 gauge accumulators; insert the apply receipt; advance the watermark; commit. Any failure rolls back the unit.
- **Idempotency receipt**: the unique tuple `(ledger, generation, bundle version, sequence, event hash)` returns the original result for exact replay and rejects identity/content conflicts.
- **Consistent read boundary**: readers resolve the active generation once and read every requested projection under one snapshot carrying the same inclusive ledger sequence/hash.
- **Publication manifest**: external dashboards and sinks receive only committed snapshot IDs and canonical hashes after commit; retryable delivery is not projection authority.
- **Rebuild pipeline**: allocate an inactive generation, replay a verified prefix from genesis, validate row invariants and canonical hashes, compare expected outputs, then atomically swap the active-generation pointer.
- **Rollback surface**: retain the prior verified generation for a bounded window; rollback is a fenced pointer restoration, while ledger replay remains the recovery source of truth.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Pin the implementation baseline and confirm the ledger reader, phase-007 gauge registry, phase-010 event contracts, legacy observability surfaces, and canonical storage capabilities.
- Freeze a projection manifest mapping every dashboard, registry, claim table, index, and gauge to its source event types, owning reducer, consistency bundle, and downstream consumer.

### Phase 2: Implementation
- Implement the registry, dependency validation, generation namespace, canonical schema, watermark, apply receipt, and publication manifest.
- Implement the fenced single-writer coordinator and deterministic prepare step over verified ledger records.
- Implement the atomic apply transaction with expected-watermark comparison and exact duplicate/conflict behavior.
- Compose the existing phase-007 gauge reducers into the same transaction as related phase-010 projections.
- Implement consistent snapshot reads and reject mixed generation, bundle version, or cutoff requests.
- Implement restart verification, invalid-watermark handling, and resume at the next sequence.
- Implement isolated generation rebuild, canonical validation, atomic publication, bounded prior-generation retention, and pointer rollback.
- Add additive-dark adapters and comparisons at the shipped observability/view boundaries without moving authority.

### Phase 3: Verification
- Inject failure before and after every transaction step; prove the visible state is the complete old or complete new unit.
- Exercise exact duplicates, conflicting duplicates, concurrent workers, expired fences, crash-before-commit, crash-after-commit, and restart.
- Compare genesis replay, every valid prefix/suffix resume, different restart boundaries, and supported platforms by canonical bytes and hashes.
- Hold readers open across rebuild and pointer swap; prove no reader observes an incomplete generation or mixed cutoff.
- Corrupt watermarks, receipts, rows, event versions, sequence/hash linkage, and dependency metadata; require typed refusal and no trusted advance.
- Compare dark outputs with existing observability and phase-007 gauge surfaces; record mismatches as evidence only.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Registry fixture rejects duplicate IDs, dependency cycles, missing schemas, and digest/version ambiguity |
| REQ-002, REQ-006 | Transaction fault matrix interrupts every mutation step and observes either the full prior or full next projection bundle |
| REQ-003 | Snapshot-concurrency tests query all related views during live apply and assert one generation and cutoff |
| REQ-004 | Exact redelivery returns one receipt; changed bytes or version under the same identity produce a typed conflict and zero writes |
| REQ-005 | Restart fixtures validate the committed watermark and resume at sequence +1; stale or corrupt provenance routes to rebuild |
| REQ-007 | Competing workers and stale fences cannot both commit the same or adjacent expected watermark |
| REQ-008, REQ-009 | Rebuild from genesis under restart and batch-boundary permutations yields byte-identical hashes and one atomic publication swap |
| REQ-010 | Phase-007 gauge golden fixtures remain byte-identical when applied inside the projection transaction |
| REQ-011 | Receipt, snapshot, watermark, and generation records round-trip complete ledger and definition provenance |
| REQ-012 | Unknown schema, gap, hash mismatch, invalid value, cycle, fence, and constraint fixtures fail before trusted advance |
| REQ-013 | External delivery failure and retry never alter canonical rows, receipt count, generation, or watermark |
| REQ-014 | Dark comparison verifies legacy output and failure semantics remain authoritative and unchanged |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

This child declares `depends_on: []` in the planning tree. Implementation nevertheless composes contracts rather than
redefining them: the verified ordered reader and immutable records from
`../../006-transition-authorized-ledger-core/002-typed-append-only-ledger/spec.md`; deterministic gauge definitions
from `../../007-shared-evidence-and-control-services/005-stream-fold-gauges/spec.md`; phase-010 sibling events; and the
program ordering in `../../manifest/phase-tree.json`. The shipped
`runtime/lib/deep-loop/observability-events.cjs` is a dark-comparison and adapter surface, not replay authority.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The implementation lands additive and dark. Disable the new coordinator and readers to restore unchanged legacy
authority; no legacy event, state, or observability file is rewritten. Within the projection store, stop writers,
verify the retained prior generation and fence token, atomically restore its active pointer, and preserve the rejected
generation plus receipts for diagnosis. If both generations are untrusted, discard derived state and rebuild from the
verified ledger. Never repair a projection by editing the ledger or copying partial rows between generations.
<!-- /ANCHOR:rollback -->
