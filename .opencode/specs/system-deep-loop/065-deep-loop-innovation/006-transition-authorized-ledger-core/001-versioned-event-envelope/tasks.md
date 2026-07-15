---
title: "Tasks: Versioned Event Envelope (003 phase 001)"
description: "Ordered tasks for the canonical envelope schema, event-definition registry, write validation, read-time upcasting, shipped-producer fixtures, and fail-closed verification."
trigger_phrases:
  - "versioned event envelope tasks"
  - "deep-loop upcaster implementation tasks"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/006-transition-authorized-ledger-core/001-versioned-event-envelope"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/006-transition-authorized-ledger-core/001-versioned-event-envelope"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Decomposed envelope, registry, upcast, and verification work into ordered tasks"
    next_safe_action: "Execute setup tasks against the pinned runtime baseline and transition policy"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Versioned Event Envelope

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

- [ ] T001 Pin the implementation worktree to the phase-000 BASE and record the phase-001 transition-policy digest
- [ ] T002 Inventory representative observability, council, iteration/audit, fan-out status, and generic JSONL writer records without modifying authoritative runtime files
- [ ] T003 Freeze contract tests for outer fields, event namespace, version semantics, canonical bytes, typed errors, registry invariants, and sibling API ownership
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add the closed canonical envelope type/schema with explicit outer and per-event versions plus immutable identity, stream, time, producer, epoch, correlation, causation, idempotency, and payload fields
- [ ] T005 Add strict stored-envelope and current-envelope validators with stable field-scoped error codes
- [ ] T006 Add the deterministic event-definition registry with per-version required-field contracts and current-version ownership
- [ ] T007 Add registry startup validation for duplicates, aliases, unsupported versions, non-adjacent edges, missing links, cycles, and incomplete definitions
- [ ] T008 Add the current-only write-preflight and canonical serialization result for the authorization and typed-ledger append boundary
- [ ] T009 Add the read entry point that preserves stored bytes, resolves exact type/version, validates historical payloads, and returns stored/effective forms
- [ ] T010 Add pure adjacent upcaster execution, per-hop validation, immutable-field guards, deterministic chain identity, and ordered provenance traces
- [ ] T011 [P] Add dark representative fixtures for observability, council round state, audit/iteration, and fan-out status producer shapes under one `payload` boundary
- [ ] T012 [P] Document the exported envelope, registry, write-preflight, read-result, and error contracts consumed by later phase-003 siblings
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 Verify all required outer fields, scalar/nullability rules, UTC timestamps, positive versions/sequences/epochs, closed-key posture, and object payload constraints
- [ ] T014 Verify exact namespaced discriminator lookup, per-type required-field enumeration, current-only writes, and canonical byte stability
- [ ] T015 Verify supported multi-hop historical reads reach the current shape deterministically while stored bytes and immutable fields remain unchanged
- [ ] T016 Verify unknown envelope/type versions, future event versions, gaps, cycles, duplicate definitions, invalid hops, identity mutation, lossy transforms, and ambiguous defaults fail closed
- [ ] T017 Verify test doubles for the authorization and typed-ledger siblings consume canonical results without producer-payload reparsing or direct upcaster access
- [ ] T018 Verify representative shipped producer fixtures use one outer envelope and no authoritative runtime writer or reader changed
- [ ] T019 Run typecheck, targeted unit/integration tests, deterministic repeat fixtures, strict packet validation, and tracked-mutation checks on the exact candidate SHA
- [ ] T020 Run the blocking SOL verifier and retain its candidate-bound commands, exit codes, fixture counts, and failure-path evidence
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Phase gate green (validate/typecheck/test/SOL as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
