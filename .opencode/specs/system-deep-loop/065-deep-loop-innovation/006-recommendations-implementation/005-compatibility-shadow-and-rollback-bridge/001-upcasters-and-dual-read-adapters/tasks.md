---
title: "Tasks: Upcasters & Dual-Read/Single-Write Adapters"
description: "Tasks for implementing deterministic upcaster chains and reversible legacy-authoritative shadow adapters over the dark ledger."
trigger_phrases:
  - "upcaster and dual-read adapter tasks"
  - "deep-loop compatibility shadow tasks"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/005-compatibility-shadow-and-rollback-bridge/001-upcasters-and-dual-read-adapters"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/005-compatibility-shadow-and-rollback-bridge/001-upcasters-and-dual-read-adapters"
    last_updated_at: "2026-07-15T14:17:04Z"
    last_updated_by: "codex"
    recent_action: "Defined setup, implementation, and verification tasks for the bridge"
    next_safe_action: "Start with the frozen legacy family and call-site inventory"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Upcasters & Dual-Read/Single-Write Adapters

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

- [ ] T001 Pin the phase-000 state census and exact phase-001/phase-003 contract revisions used by this implementation
- [ ] T002 Inventory each legacy event, snapshot, checkpoint, and JSONL family with its reader, writer, version discriminator, stored examples, and direct-path behavior
- [ ] T003 Map every in-scope call site of `writeStateAtomic`, `writeStateIfChangedAtomic`, `appendJsonlIfChangedAtomic`, and deferred writers to an explicit legacy codec boundary
- [ ] T004 Freeze the registry schema, typed compatibility errors, comparison token, reconciliation outcome vocabulary, and independent adapter gates
- [ ] T005 Capture baseline fixtures for legacy values, failures, retry counts, stored bytes, and idempotency behavior before inserting adapters
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 Implement the immutable record-family/type registry with current versions, historical validators, adjacent edges, and deterministic startup ordering
- [ ] T007 Implement startup rejection for duplicate types, multiple current versions, gaps, forks, cycles, non-adjacent edges, and invalid version numbers
- [ ] T008 Implement the pure per-hop executor with input/intermediate/current validation, immutable source evidence, stored/effective versions, registry identity, and ordered trace
- [ ] T009 Implement explicit legacy state codecs for fixture-backed versioned families; reject ambiguous or unversioned shapes without a governed discriminator
- [ ] T010 Implement the dual-read sampler that binds mode/run/stream, authority epoch, legacy position, verified dark head, and correlation identity into one comparison token
- [ ] T011 Implement deterministic reconciliation for parity, divergence, lag, missing, invalid, failed, dark-only success, and non-comparable observations
- [ ] T012 Implement bounded reconciliation evidence that excludes sensitive payloads and cannot advance domain state or authorize a side effect
- [ ] T013 Implement the single-authoritative-write wrapper with exactly one legacy invocation and zero-or-one current-version idempotent dark mirror after accepted mutation
- [ ] T014 Enforce the phase-003 validation and authorization boundary for dark writes and verified typed-reader boundary for dark reads
- [ ] T015 Prohibit dark fallback, read-repair, reverse projection, duplicate legacy retries, partial effective models, and any authority-selection switch
- [ ] T016 Add independent gates for upcasting, dual reads, and dark mirroring that restore the unchanged direct-legacy path without data conversion
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T017 Verify: Supported current, one-hop, and multi-hop fixtures reach byte-stable current models with complete traces and unchanged source hashes
- [ ] T018 Verify: Unknown family, future version, ambiguous shape, missing edge, cycle, fork, invalid hop, lossy conversion, and identity mutation all fail closed
- [ ] T019 Verify: Equal causal observations produce parity; skewed positions produce lag/non-comparable outcomes before semantic comparison
- [ ] T020 Verify: Every reconciliation matrix row returns the legacy value or legacy failure as the operational result and records the correct typed evidence
- [ ] T021 Verify: Success, retry, duplicate, failure, and crash fixtures invoke legacy at most once per command attempt and append at most one idempotent dark mirror
- [ ] T022 Verify: Dark read, validation, authorization, and append faults remain observable, block parity evidence, and do not change legacy values, errors, or retries
- [ ] T023 Verify: Mutation guards detect no read-repair, source rewrite, dark-to-legacy projection, committed-ledger edit, or authority epoch flip
- [ ] T024 Verify: Disabling adapter gates matches the pinned direct-legacy values, errors, retry counts, stored bytes, and call graph with no dark access
- [ ] T025 Verify: Successor legacy-projection and shadow-parity contracts can consume adapter results without redefining upcasting, reconciliation, or write authority
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
