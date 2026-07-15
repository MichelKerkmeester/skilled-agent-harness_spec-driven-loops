---
title: "Tasks: Stream-Fold Gauges"
description: "Tasks for the stream-fold gauge registry, standard gauge families, deterministic replay, verified incremental checkpoints, and additive-dark runtime comparisons."
trigger_phrases:
  - "stream-fold gauges tasks"
  - "deterministic gauge reducer tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/007-shared-evidence-and-control-services/005-stream-fold-gauges"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/007-shared-evidence-and-control-services/005-stream-fold-gauges"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Sequenced reducer, checkpoint, parity, and provenance tasks"
    next_safe_action: "Pin ledger fixtures and freeze the standard gauge manifest"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Stream-Fold Gauges

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

- [ ] T001 Pin the phase-003 verified-ledger interface, canonical event fixtures, ledger identity/head semantics, and replay cutoffs used by every gauge test
- [ ] T002 Inventory shipped gauge behavior in `fanout-pool.cjs`, `convergence.cjs`, `coverage-graph-signals.ts`, coverage snapshots, and `observability-events.cjs`; record protected behavior versus known drift
- [ ] T003 Freeze the standard gauge manifest for progress, novelty, cost, and health inputs, including source events, typed units, missing-value semantics, and downstream owners
- [ ] T004 Freeze the gauge definition schema, version/digest rules, exact arithmetic policy, canonical serialization, unsupported-input behavior, and acyclic publication graph
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Implement the immutable gauge registry keyed by gauge ID/version with validated event contracts, initial state, transition, finalizer, digests, and output schema
- [ ] T006 Implement the verified stream adapter and pure sequential reducer kernel with typed errors and no clock, RNG, locale, filesystem, network, or mutable-global access
- [ ] T007 [P] Implement progress gauges from explicit lifecycle, evidence, coverage, obligation, and terminal-state events
- [ ] T008 [P] Implement novelty gauges that preserve novel, reused/duplicate, contradicted, superseded, and unknown dispositions over sequence-defined windows
- [ ] T009 [P] Implement cost gauges using typed integer or fixed-point token, currency, duration-budget, iteration, and tool-use units scoped to hierarchical budget events
- [ ] T010 [P] Implement health-input gauges for lag, pending, failed, retried, orphaned, stalled, and integrity-refusal events without embedding downstream policy thresholds
- [ ] T011 Implement the canonical result envelope with ledger cutoff, gauge/version and configuration digests, accumulator/output hashes, computation mode, and checkpoint provenance
- [ ] T012 Implement full genesis/cutoff replay before adding incremental continuation from prefix-bound, hash-verified, disposable checkpoints
- [ ] T013 Reject stale/corrupt checkpoints, unknown event schemas, sequence gaps/forks, invalid units, non-canonical values, recursive self-inputs, and cyclic gauge dependencies
- [ ] T014 Add additive-dark comparison adapters for shipped fan-out, convergence, coverage-signal/snapshot, and observability surfaces without changing legacy outputs or decisions
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T015 Verify repeated full replay is byte-identical for the same ledger prefix, gauge definition, configuration digest, and cutoff across restarts and supported platforms
- [ ] T016 Verify arbitrary prefix/suffix and batch splits produce byte-identical checkpoint-plus-suffix and genesis-to-head results for every standard gauge
- [ ] T017 Verify checkpoint mutation, definition/version drift, ledger-head mismatch, and accumulator corruption trigger a recorded full rebuild rather than stale output
- [ ] T018 Verify integer/fixed-point boundaries, mixed-unit rejection, deterministic ordering, missing-value rules, and event-time cutoff semantics
- [ ] T019 Verify unsupported schemas, malformed events, failed upcasts, integrity errors, self-publication, and dependency cycles fail before a trusted gauge result is emitted
- [ ] T020 Verify dark comparisons emit pinned parity/delta evidence while existing fan-out, convergence, and observability schemas and decisions remain unchanged
- [ ] T021 Run unit, property, integration, replay, build/typecheck, and strict packet validation gates; bind results to the candidate commit and fixture digests
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
