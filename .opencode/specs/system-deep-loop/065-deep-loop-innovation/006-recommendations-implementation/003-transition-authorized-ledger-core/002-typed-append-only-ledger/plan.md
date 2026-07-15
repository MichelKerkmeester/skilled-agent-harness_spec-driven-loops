---
title: "Implementation Plan: Typed Append-Only Ledger"
description: "Implementation plan for the dark typed ledger writer, verified reader, deterministic reducers, integrity chain, and legacy coexistence adapters."
trigger_phrases:
  - "typed append-only ledger implementation plan"
  - "deep-loop ledger writer reader plan"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/003-transition-authorized-ledger-core/002-typed-append-only-ledger"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/003-transition-authorized-ledger-core/002-typed-append-only-ledger"
    last_updated_at: "2026-07-15T13:43:04Z"
    last_updated_by: "codex"
    recent_action: "Planned ledger framing, append ordering, verified reads, and dark adapters"
    next_safe_action: "Implement the ledger modules and execute corruption and coexistence fixtures"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Typed Append-Only Ledger

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop shared runtime (phase 003 child 002) |
| **Change class** | Additive-dark persistence core; no authority cutover |
| **Execution** | Path-scoped runtime modules and tests on the phase program's pinned BASE |

### Overview
Implement a ledger-specific writer/reader over the sibling event-envelope contract. The writer serializes one
canonical record at a time under an exclusive lock, compares the expected verified head, assigns the next contiguous
sequence, binds authorization and previous-head hashes, fsyncs the append, and returns a durable receipt. The reader
starts from genesis, verifies every frame and envelope before yielding a discriminated event, and feeds pure reducers
whose outputs are disposable projections. Existing JSONL and checkpoint writers remain unchanged and authoritative;
dark adapters mirror successful legacy-domain events into the new ledger for later shadow evidence.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The sibling `001-versioned-event-envelope` contract supplies canonical bytes, stable `event_id`, schema version, event type, stream/subject identity, and authorization binding fields.
- [ ] The phase-003 parent identifies the authorization-proof interface that the ledger must validate before append.
- [ ] The state census pins every legacy JSONL/state/checkpoint writer and reducer that will receive a dark adapter.
- [ ] The ledger storage root, file permissions, lock scope, ledger identity, segment naming, and error taxonomy are fixed before implementation.
- [ ] Legacy authority and dark failure-isolation behavior are encoded as tests before any integration hook is added.

### Definition of Done
- [ ] Locked append, idempotency, ordering, hash-chain integrity, typed read, and deterministic reduction tests pass.
- [ ] Crash/torn-tail, tamper, gap, fork, reorder, duplicate-conflict, unknown-version, and invalid-authorization tests fail closed.
- [ ] Every inventoried legacy emission boundary produces dark ledger evidence without changing its existing output or status.
- [ ] A full ledger replay reaches one verified head and byte-identical projections across repeated runs.
- [ ] The ledger remains non-authoritative and no legacy writer, reader, repair path, or checkpoint is removed or rewritten.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Record model**: persist canonical envelope bytes inside a ledger frame containing `ledger_id`, contiguous `sequence`, `previous_hash`, `event_hash`, authorization reference/hash, frame version, and committed-at metadata. Sequence, not time, is the order authority.
- **Idempotency index**: derive `event_id -> {sequence,event_hash}` from verified history or a rebuildable cache. Exact canonical repeats return the stored receipt; a hash mismatch for the same ID is a typed conflict.
- **Single-writer critical section**: acquire a ledger-scoped exclusive lock, verify the current head and caller's expected head, re-check idempotency, allocate `head.sequence + 1`, append one complete frame, fsync file and directory, then issue the receipt. No receipt exists for an un-fsynced append.
- **Immutable recovery**: committed segments are never truncated or rewritten. A torn tail makes that segment unreadable beyond the last verified frame; recovery preserves the bytes and opens a new monotonically named segment whose genesis frame links to the last verified head plus a typed recovery reason.
- **Integrity**: calculate `event_hash` from canonical frame inputs including ledger identity, sequence, previous hash, canonical envelope bytes, and authorization binding. Verification from genesis proves both per-event integrity and the complete ordered head. Head/index sidecars are cache-only and rebuildable.
- **Typed reader**: frame decoder -> sequence/hash verifier -> envelope decoder from `001-versioned-event-envelope` -> authorization-link verifier -> typed event iterator. Unknown frame/envelope versions, event types, or authorization formats are errors; the reader never skips an invalid committed row.
- **Reducer boundary**: reducers are pure `(state, typedEvent) -> state` functions registered by event type and reducer version. Reduction consumes only verified iteration order, retains raw event evidence, and emits a projection fingerprint for sibling `003-replay-fingerprints` without promoting the projection to authority.
- **Dark legacy adapters**: add narrow hooks after successful existing emissions in `atomic-state.ts`, `jsonl-repair.ts` consumers, `round-state-jsonl.cjs`, `fanout-pool.cjs`, `fanout-run.cjs`, and observability/state reducers. Hooks normalize to the sibling envelope, request authorization, and attempt a dark append. Failures emit explicit telemetry and invalidate cutover evidence, but the legacy return value and persisted artifact remain authoritative.
- **Boundary discipline**: do not call legacy `repairJsonlTail`, JSONL merge-by-rewrite, or replace-style checkpoint writers on ledger files. Do not read ledger projections back into runtime control flow in this phase.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Freeze the source inventory from the program `spec.md`, `manifest/phase-tree.json`, spine ADR, sibling envelope folder, and shipped runtime state/checkpoint surfaces.
- Define the TypeScript frame, receipt, typed error, reader, writer, reducer, and dark-adapter interfaces; pin canonicalization and hash test vectors.
- Add fixtures for genesis, multi-event streams, duplicate replay, conflicting IDs, concurrent append, crash tails, tampering, and legacy/dark divergence.

### Phase 2: Implementation
- Build the ledger-scoped lock, verified-head loader, immutable segment allocator, canonical frame encoder, durable append path, and rebuildable idempotency cache.
- Build the full-chain verifier, typed envelope decoder, async reader, reducer registry, deterministic fold, and derived projection/head cache.
- Add the authorization-proof precondition so missing or mismatched proof fails before sequence allocation.
- Add additive-dark hooks to the reviewed legacy state/checkpoint boundaries without changing existing JSONL shapes, repair behavior, reducer outputs, or checkpoint authority.
- Emit typed dark-path health events for append success, exact-repeat idempotency, conflict, corruption, authorization denial, and adapter failure.

### Phase 3: Verification
- Prove exact-once logical identity under retries and contiguous sequence under genuinely concurrent writers.
- Prove mutation, deletion, insertion, reordering, fork, malformed framing, unknown type/version, and torn-tail detection.
- Prove recovery creates a linked immutable segment and never truncates or rewrites committed bytes.
- Prove repeated full replay and reduction are byte-identical for the same ledger, envelope decoder, and reducer version.
- Prove legacy outputs, return codes, JSONL/checkpoint schemas, and operational authority are unchanged when the dark ledger succeeds, denies, conflicts, or fails.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Byte snapshots before/after append plus API-surface tests prove existing frames cannot be updated, deleted, truncated, repaired, or overwritten |
| REQ-002 | Retry and conflicting-payload fixtures prove exact repeats reuse one receipt while same-ID/different-bytes returns a typed conflict |
| REQ-003 | Multi-process writers released from a barrier produce one contiguous sequence with no duplicate or forked head |
| REQ-004 | Golden hash vectors and mutation/delete/insert/reorder tests prove per-frame and whole-log verification |
| REQ-005 | Corrupt frame, gap, fork, torn tail, unknown version/type, and bad authorization fixtures fail before yielding an event |
| REQ-006 | Full replay repeated across clean processes produces byte-identical projection bytes and the same verified head |
| REQ-007 | Existing runtime unit/integration suites plus dark-failure injection show legacy JSONL/checkpoint outputs and exit behavior are unchanged |
| REQ-008 | Missing, malformed, expired, unknown, and event-mismatched authorization proofs fail before lock allocation reaches durable append |
| REQ-009 | Kill-during-append fixtures preserve old bytes, with recovery opening a linked segment rather than calling truncation or rewrite helpers |
| REQ-010 | A manifest-driven adapter test names every shipped state/checkpoint writer and reducer, with zero unreviewed emission boundaries |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`depends_on: []` applies to this planning contract. Runtime integration composes at the phase-003 parent with predecessor
folder `001-versioned-event-envelope`, successor `003-replay-fingerprints`, and the authorization-gateway sibling; none
is treated as a hidden planning dependency. Evidence sources are the program `spec.md`, `manifest/phase-tree.json`, the
phase-001 spine ADR, and shipped runtime files under `.opencode/skills/system-deep-loop/runtime/`, especially
`atomic-state.ts`, `jsonl-repair.ts`, `round-state-jsonl.cjs`, `fanout-run.cjs`, `fanout-pool.cjs`,
`observability-events.cjs`, `reduce-state.cjs`, `reduce-alignment-state.cjs`, and `verify-iteration.cjs`.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Rollback disables the additive dark adapters and reverts the new ledger modules; the legacy JSONL/state/checkpoint
path has remained authoritative, so no operational state migration or reverse projection is required. Ledger files
created during the dark run are retained as quarantined evidence or removed only by an explicit operator action; no
rollback step edits their committed history. If dark instrumentation changes a legacy result, the phase fails and the
adapter hook is reverted before any later shadow or cutover work can consume its evidence.
<!-- /ANCHOR:rollback -->
