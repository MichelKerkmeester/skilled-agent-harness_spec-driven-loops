---
title: "Tasks: Typed Append-Only Ledger"
description: "Tasks for implementing and verifying the immutable typed ledger writer, reader, reducers, integrity chain, and dark legacy adapters."
trigger_phrases:
  - "typed append-only ledger tasks"
  - "deep-loop dark ledger tasks"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/002-typed-append-only-ledger"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/002-typed-append-only-ledger"
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

- [x] T001 Freeze the legacy state/checkpoint writer, reader, reducer, and repair inventory from the pinned runtime BASE [evidence: The relevant source module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] T002 Confirm the sibling envelope and authorization interfaces expose canonical bytes, stable identity, type/version, stream identity, and proof binding [evidence: The relevant source module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] T003 Define ledger frame, append receipt, expected-head, typed error, reader, reducer, segment, and dark-adapter interfaces [evidence: The relevant source module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] T004 Create canonical hash vectors and fixtures for genesis, ordered streams, duplicates, conflicts, forks, corruption, torn tails, and dark failures [evidence: The relevant source module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Implement the ledger-scoped exclusive lock and expected-head compare-and-append critical section [evidence: The relevant source module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] T006 Implement canonical frame encoding with ledger ID, contiguous sequence, previous hash, event hash, authorization binding, and frame version [evidence: The relevant source module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] T007 Implement conflict-detecting idempotency and a rebuildable `event_id` receipt index [evidence: The relevant source module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] T008 Implement fsynced append and issue receipts only after durable file and directory synchronization [evidence: The relevant source module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] T009 Implement immutable torn-tail recovery that quarantines damaged bytes, restores the last verified head, and resumes without rewriting earlier frames [evidence: The relevant source module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] T010 Implement full-chain verification and a typed reader that rejects invalid frames before yielding decoded envelopes [evidence: The relevant source module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] T011 Implement pure versioned reducers and rebuildable projection/head caches over verified event order [evidence: The relevant source module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] T012 [P] Add the reusable dark adapter and frozen census for deep-loop JSONL iteration/state and reducer boundaries without modifying those writers [evidence: The relevant source module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] T013 [P] Extend the frozen census to council round state, fan-out status, observability, and wait-checkpoint boundaries without modifying those writers [evidence: The relevant source module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] T014 Add dark-path telemetry without feeding ledger state back into legacy runtime decisions [evidence: The relevant source module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Verify immutable contiguous append under retries and concurrent multi-process writers [evidence: The relevant source module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] T016 Verify exact-repeat idempotency and fail-closed same-ID/different-content conflicts [evidence: The relevant source module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] T017 Verify hash-chain detection for mutation, deletion, insertion, reordering, duplicated frames, gaps, and forked heads [evidence: The relevant source module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] T018 Verify unknown frame/envelope versions, unknown event types, and invalid authorization proofs fail before event delivery or sequence allocation [evidence: The relevant source module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] T019 Verify kill-during-append and torn-tail recovery never truncates, repairs, merges, or overwrites committed ledger bytes [evidence: The relevant source module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] T020 Verify repeated typed read/reduce produces byte-identical projections and the same verified head across clean processes [evidence: The relevant source module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] T021 Verify the complete legacy-boundary census and prove the reusable adapter preserves the exact legacy result under dark allow, deny, and ledger failure [evidence: The relevant source module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] T022 Verify no ledger projection, cache, timestamp, or sidecar is used as operational authority before phase 014 [evidence: The relevant source module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] T023 Run the accepted focused co-landing suite, TypeScript typecheck, and strict packet validation [evidence: The relevant source module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete. [evidence: T001-T023 are checked above against the accepted focused gate.]
- [x] All requirements in spec.md met with evidence. [evidence: the implementation summary maps the accepted invariants to focused tests and source modules.]
- [x] Phase gate green (validate/typecheck/focused test). [evidence: final commands and exits are recorded in `implementation-summary.md`.]
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
