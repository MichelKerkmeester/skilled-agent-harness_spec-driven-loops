---
title: "Tasks: Typed Append-Only Ledger"
description: "Tasks for implementing and verifying the immutable typed ledger writer, reader, reducers, integrity chain, and dark legacy adapters."
trigger_phrases:
  - "typed append-only ledger tasks"
  - "deep-loop dark ledger tasks"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/003-transition-authorized-ledger-core/002-typed-append-only-ledger"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/003-transition-authorized-ledger-core/002-typed-append-only-ledger"
    last_updated_at: "2026-07-15T13:43:04Z"
    last_updated_by: "codex"
    recent_action: "Broke the ledger core into ordered implementation and verification tasks"
    next_safe_action: "Start with frame interfaces, canonical hash vectors, and failure fixtures"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Typed Append-Only Ledger

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Freeze the legacy state/checkpoint writer, reader, reducer, and repair inventory from the pinned runtime BASE
- [ ] T002 Confirm the sibling envelope and authorization interfaces expose canonical bytes, stable identity, type/version, stream identity, and proof binding
- [ ] T003 Define ledger frame, append receipt, expected-head, typed error, reader, reducer, segment, and dark-adapter interfaces
- [ ] T004 Create canonical hash vectors and fixtures for genesis, ordered streams, duplicates, conflicts, forks, corruption, torn tails, and dark failures
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Implement the ledger-scoped exclusive lock and expected-head compare-and-append critical section
- [ ] T006 Implement canonical frame encoding with ledger ID, contiguous sequence, previous hash, event hash, authorization binding, and frame version
- [ ] T007 Implement conflict-detecting idempotency and a rebuildable `event_id` receipt index
- [ ] T008 Implement fsynced append and issue receipts only after durable file and directory synchronization
- [ ] T009 Implement immutable segment rollover/recovery that preserves torn bytes and links the next segment to the last verified head
- [ ] T010 Implement full-chain verification and a typed reader that rejects invalid frames before yielding decoded envelopes
- [ ] T011 Implement pure versioned reducers and rebuildable projection/head caches over verified event order
- [ ] T012 [P] Add dark adapters for deep-loop JSONL iteration/state emissions and their current reducers
- [ ] T013 [P] Add dark adapters for council round state, fan-out status, observability, and wait-checkpoint emission boundaries
- [ ] T014 Add dark-path telemetry without feeding ledger state back into legacy runtime decisions
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T015 Verify immutable contiguous append under retries and concurrent multi-process writers
- [ ] T016 Verify exact-repeat idempotency and fail-closed same-ID/different-content conflicts
- [ ] T017 Verify hash-chain detection for mutation, deletion, insertion, reordering, duplicated frames, gaps, and forked heads
- [ ] T018 Verify unknown frame/envelope versions, unknown event types, and invalid authorization proofs fail before event delivery or sequence allocation
- [ ] T019 Verify kill-during-append and torn-tail recovery never truncates, repairs, merges, or overwrites committed ledger bytes
- [ ] T020 Verify repeated typed read/reduce produces byte-identical projections and the same verified head across clean processes
- [ ] T021 Verify every inventoried legacy writer retains its schema, output, return code, repair semantics, and authority under dark success and failure injection
- [ ] T022 Verify no ledger projection, cache, timestamp, or sidecar is used as operational authority before phase 011
- [ ] T023 Run the runtime build, typecheck, targeted unit/integration suites, adapter manifest check, and strict spec validation
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Phase gate green (validate/build/test as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
