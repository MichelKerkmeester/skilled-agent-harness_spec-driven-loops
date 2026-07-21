---
title: "Tasks: Stream-Fold Gauges"
description: "Tasks for the stream-fold gauge registry, standard gauge families, deterministic replay, verified incremental checkpoints, and additive-dark runtime comparisons."
trigger_phrases:
  - "stream-fold gauges tasks"
  - "deterministic gauge reducer tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/005-stream-fold-gauges"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/005-stream-fold-gauges"
    last_updated_at: "2026-07-21T00:38:15Z"
    last_updated_by: "codex"
    recent_action: "Completed implementation, runtime verification, and packet validation"
    next_safe_action: "Keep the service dark until an owning cutover phase integrates it"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/stream-fold-gauges/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/stream-fold-gauges.vitest.ts"
      - "implementation-summary.md"
    completion_pct: 100
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

- [x] T001 Pin the phase-006 verified-ledger interface, canonical event fixtures, ledger identity/head semantics, and replay cutoffs used by every gauge test [Evidence: `implementation-summary.md` verification table]
- [x] T002 Inventory shipped gauge behavior in `fanout-pool.cjs`, `convergence.cjs`, `coverage-graph-signals.ts`, coverage snapshots, and `observability-events.cjs`; record protected behavior versus known drift [Evidence: `implementation-summary.md` runtime inventory]
- [x] T003 Freeze the standard gauge manifest for progress, novelty, cost, and health inputs, including source events, typed units, missing-value semantics, and downstream owners [Evidence: `standard-gauges.ts` and registry manifest test]
- [x] T004 Freeze the gauge definition schema, version/digest rules, exact arithmetic policy, canonical serialization, unsupported-input behavior, and acyclic publication graph [Evidence: `gauge-registry.ts` and registry refusal tests]

Evidence: `implementation-summary.md` contract proofs, runtime inventory, and pinned registry/ledger fixture identities.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Implement the immutable gauge registry keyed by gauge ID/version with validated event contracts, initial state, transition, finalizer, digests, and output schema [Evidence: `gauge-registry.ts`]
- [x] T006 Implement the verified stream adapter and pure sequential reducer kernel with typed errors and no clock, RNG, locale, filesystem, network, or mutable-global access [Evidence: `gauge-replay.ts` and ambient-capability test]
- [x] T007 [P] Implement progress gauges from explicit lifecycle, evidence, coverage, obligation, and terminal-state events [Evidence: `standard-gauges.ts` progress definition]
- [x] T008 [P] Implement novelty gauges that preserve novel, reused/duplicate, contradicted, superseded, and unknown dispositions over sequence-defined windows [Evidence: `standard-gauges.ts` novelty definition]
- [x] T009 [P] Implement cost gauges using typed integer or fixed-point token, currency, duration-budget, iteration, and tool-use units scoped to hierarchical budget events [Evidence: `standard-gauges.ts` cost definition]
- [x] T010 [P] Implement health-input gauges for lag, pending, failed, retried, orphaned, stalled, and integrity-refusal events without embedding downstream policy thresholds [Evidence: `standard-gauges.ts` health definition]
- [x] T011 Implement the canonical result envelope with ledger cutoff, gauge/version and configuration digests, accumulator/output hashes, computation mode, and checkpoint provenance [Evidence: `gauge-replay.ts` result envelope]
- [x] T012 Implement full genesis/cutoff replay before adding incremental continuation from prefix-bound, hash-verified, disposable checkpoints [Evidence: `gauge-replay.ts` replay paths]
- [x] T013 Reject stale/corrupt checkpoints, unknown event schemas, sequence gaps/forks, invalid units, non-canonical values, recursive self-inputs, and cyclic gauge dependencies [Evidence: focused refusal and rebuild matrix]
- [x] T014 Add additive-dark comparison adapters for shipped fan-out, convergence, coverage-signal/snapshot, and observability surfaces without changing legacy outputs or decisions [Evidence: `gauge-evidence.ts` and dark fixture matrix]

Evidence: new `runtime/lib/stream-fold-gauges/` modules and the 37-test focused contract suite.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Verify repeated full replay is byte-identical for the same ledger prefix, gauge definition, configuration digest, and cutoff across restarts and supported platforms [Evidence: focused Vitest 37/37 including restart]
- [x] T016 Verify arbitrary prefix/suffix and batch splits produce byte-identical checkpoint-plus-suffix and genesis-to-head results for every standard gauge [Evidence: all gauges at splits `0..12`]
- [x] T017 Verify checkpoint mutation, definition/version drift, ledger-head mismatch, and accumulator corruption trigger a recorded full rebuild rather than stale output [Evidence: checkpoint drift matrix]
- [x] T018 Verify integer/fixed-point boundaries, mixed-unit rejection, deterministic ordering, missing-value rules, and event-time cutoff semantics [Evidence: `stream-fold-gauges.vitest.ts` fold boundaries]
- [x] T019 Verify unsupported schemas, malformed events, failed upcasts, integrity errors, self-publication, and dependency cycles fail before a trusted gauge result is emitted [Evidence: `stream-fold-gauges.vitest.ts` refusal tests]
- [x] T020 Verify dark comparisons emit pinned parity/delta evidence while existing fan-out, convergence, and observability schemas and decisions remain unchanged [Evidence: `stream-fold-gauges.vitest.ts` five-surface matrix]
- [x] T021 Run unit, property, integration, replay, build/typecheck, and strict packet validation gates; bind results to the candidate commit and fixture digests [Evidence: focused Vitest 37/37, `tsc` exit 0, `validate.sh --strict` exit 0]

Evidence: focused Vitest 37/37 and leaf strict TypeScript exit 0; final strict packet validation remains pending.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete [Evidence: T001-T021 checked above]
- [x] All requirements in spec.md met with evidence [Evidence: `implementation-summary.md` contract proofs]
- [x] Phase gate green (validate/build/test as applicable) [Evidence: focused Vitest 37/37, `tsc` exit 0, `validate.sh --strict` exit 0]
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
