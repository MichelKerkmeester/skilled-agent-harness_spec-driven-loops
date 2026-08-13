---
title: "Implementation Plan: Stream-Fold Gauges"
description: "Implementation plan for versioned deterministic gauge reducers, the standard progress/novelty/cost/health set, verified incremental checkpoints, and full-replay parity over the ledger."
trigger_phrases:
  - "stream-fold gauges implementation plan"
  - "deterministic gauge reducer plan"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/005-stream-fold-gauges"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/005-stream-fold-gauges"
    last_updated_at: "2026-07-21T00:38:15Z"
    last_updated_by: "codex"
    recent_action: "Completed the registry, folds, checkpoint replay, and dark evidence"
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
# Implementation Plan: Stream-Fold Gauges

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop runtime observability, coverage signals, fan-out gauges, and ledger projections |
| **Change class** | Additive-dark deterministic projection service |
| **Execution** | Versioned registry and pure reducers first; incremental cache second; dark adapters and parity gate last |

### Overview
Replace ad-hoc mutable gauge state with a registry of pure, versioned folds over the phase-006 verified ledger stream.
Implement the standard progress, novelty, cost, and health-input families; bind every output to a ledger cutoff and
definition digest; allow incremental continuation only from a verified prefix checkpoint; and continuously prove that
incremental output is byte-identical to full replay. Integrate in shadow mode beside
`.opencode/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs`, `runtime/scripts/convergence.cjs`,
`runtime/lib/coverage-graph/coverage-graph-signals.ts`, and `runtime/lib/deep-loop/observability-events.cjs` without
changing legacy control decisions.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The phase-006 envelope and typed-ledger reader expose verified sequence, canonical event bytes, ledger identity, record hash, and typed schema/version information [Evidence: `implementation-summary.md` verified-stream contract proof]
- [x] The standard gauge manifest maps progress, novelty, cost, and health outputs to owned typed event contracts without inventing sibling-domain transitions [Evidence: `implementation-summary.md` standard-family proof]
- [x] Gauge versioning, configuration digests, exact numeric units, unknown-event policy, and canonical serialization are frozen before reducer implementation [Evidence: `gauge-registry.ts` and `standard-gauges.ts`]
- [x] Shipped fan-out, convergence, coverage-signal, metrics-snapshot, and observability-event behaviors have pinned dark-comparison fixtures [Evidence: `stream-fold-gauges.vitest.ts` legacy fixture matrix]
- [x] The additive-dark boundary is explicit: gauge mismatches produce evidence and never change legacy authority in this phase [Evidence: `implementation-summary.md` authority posture]

### Definition of Done
- [x] Every registered gauge rebuilds from the verified ledger and publishes complete replay provenance [Evidence: `gauge-replay.ts` and focused Vitest]
- [x] Full and incremental recomputation are byte-identical across prefix/suffix, restart, batch, and supported-platform fixtures [Evidence: focused Vitest 37/37]
- [x] Invalid checkpoints and unsupported or corrupt event streams fail closed or rebuild from genesis without returning stale trusted values [Evidence: focused checkpoint/refusal matrix]
- [x] The standard gauge set covers the four required families with typed units, missing-value semantics, and downstream ownership [Evidence: registry digest and manifest proof in `implementation-summary.md`]
- [x] Dark adapters observe shipped runtime surfaces without changing their outputs, schemas, failure behavior, or authority [Evidence: scoped git diff and dark fixture matrix]
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Gauge registry**: immutable `GaugeDefinition` entries keyed by `(gauge_id, gauge_version)` with accepted event types/versions, reducer/configuration digest, accumulator/output schemas, initial state, transition, finalizer, canonicalizer, and unsupported-input policy.
- **Verified stream adapter**: consumes only phase-006 reader output in authoritative sequence order. It exposes ledger identity, record sequence/hash, canonical event bytes, authorization linkage, and the inclusive replay cutoff; it never reads producer files directly.
- **Pure reducer kernel**: applies one event at a time to immutable logical accumulator state. Reducers receive no clock, RNG, filesystem, network, mutable singleton, prior published value, or unordered host collection.
- **Standard gauge bundle**: progress reducers count explicit lifecycle/evidence transitions; novelty reducers preserve novel/reused/contradicted/superseded dispositions; cost reducers use typed integer or fixed-point units and scope; health reducers expose event-backed lag/failure/retry/stall/integrity inputs without embedding policy thresholds.
- **Canonical result envelope**: binds the output to ledger ID, cutoff sequence/hash, gauge ID/version, reducer/configuration digest, accumulator hash, output hash, computation mode, and optional checkpoint provenance.
- **Incremental checkpoint cache**: stores canonical accumulator bytes plus the exact verified prefix identity. On load it verifies ledger ID, last sequence/hash, gauge version, digests, schema, and accumulator hash. Any mismatch discards the cache and replays from genesis.
- **Acyclic publication rule**: gauge snapshot or telemetry events are excluded from the reducer that created them. Cross-gauge dependencies require an explicit versioned acyclic graph and are folded from source events, not mutable last values.
- **Dark comparison adapters**: translate shipped fan-out pool gauges, convergence signals/snapshots, and observability payloads into comparison fixtures. They report parity/delta evidence while legacy remains authoritative.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Pin the phase-006 ledger interfaces and source-event fixtures; inventory current fan-out, convergence, coverage, and observability gauge semantics against the frozen baseline.
- Freeze the gauge manifest, definition schema, exact-unit policy, canonical serialization, replay cutoff semantics, and additive-dark comparison contract.

### Phase 2: Implementation
- Implement the registry, verified stream adapter, canonical reducer kernel, typed errors, and provenance-bearing result envelope.
- Implement the standard progress, novelty, cost, and health-input gauge definitions using only owned typed events and declared extension points.
- Implement full replay from genesis or a pinned cutoff, then the verified incremental checkpoint path with automatic invalidation and rebuild.
- Add dark adapters for `fanout-pool.cjs`, `convergence.cjs`, `coverage-graph-signals.ts`, metrics snapshots, and `observability-events.cjs`; prevent recursive gauge self-consumption.

### Phase 3: Verification
- Prove byte-identical results across repeated full replays, valid checkpoint continuation, arbitrary prefix/suffix splits, restarts, batch boundaries, and supported platforms.
- Inject stale versions, bad hashes, ledger forks/gaps, invalid units, unknown event schemas, corrupt checkpoints, unordered payloads, and forbidden ambient dependencies; require typed refusal or full rebuild.
- Compare the standard fold outputs with pinned shipped-runtime fixtures in dark mode and record differences without changing legacy decisions.
- Run unit, property, integration, replay, typecheck/build, and packet strict-validation gates; bind evidence to the candidate commit and ledger fixture digests.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Registry schema tests reject missing identity/version/input/fold/finalizer/digest/numeric/output fields and duplicate incompatible definitions |
| REQ-002 | Repeated genesis-to-cutoff replay emits byte-identical accumulator and result fixtures across process restarts and supported platforms |
| REQ-003 | Manifest completeness test requires at least one owned gauge in each required family and validates event/unit/consumer mappings |
| REQ-004 | Progress fixtures rebuild from lifecycle/evidence events after deleting every mutable worker or snapshot cache |
| REQ-005 | Novelty fixtures preserve novel, reused, contradicted, superseded, and unknown buckets across sequence-defined windows |
| REQ-006 | Boundary tests cover large integer/fixed-point values, mixed units/scopes, rounding, overflow, and currency minor units |
| REQ-007 | Health fixtures reproduce lag/failure/retry/orphan/stall/integrity inputs while threshold changes leave reducer output unchanged |
| REQ-008 | Property tests split the same stream at arbitrary prefixes and batch sizes; checkpoint-plus-suffix equals full replay byte for byte |
| REQ-009 | Mutated ledger ID/head hash/sequence/version/digest/accumulator bytes invalidate checkpoints and trigger recorded full replay |
| REQ-010 | Static/runtime guards fail reducers that request clock, RNG, locale, filesystem, network, process globals, or unordered serialization |
| REQ-011 | Unknown versions, invalid payloads, gaps, bad upcasts, and non-canonical numbers return typed errors before a trusted result is published |
| REQ-012 | Self-publication and cyclic dependency fixtures are rejected; repeated snapshot emission cannot change its originating gauge |
| REQ-013 | Dark integration tests prove legacy outputs and decisions are unchanged while parity/delta evidence is emitted separately |
| REQ-014 | Result-envelope tests independently replay by provenance fields and verify accumulator/output hashes at the named ledger cutoff |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Runtime implementation depends on the phase-006 versioned envelope, typed verified reader, sequence/hash integrity, and
replay-fingerprint contracts, even though this planning leaf has `depends_on: []` in the phase manifest. Budget inputs
compose with sibling `004-hierarchical-typed-budgets`; lock/fencing mechanics remain owned by successor
`006-locks-and-fencing`; later novelty, continuity, convergence, and mode phases supply domain events and consume the
derived gauges. Phase 008 owns shadow-parity orchestration and rollback, so this phase emits comparison evidence but
does not adjudicate or authorize a cutover.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The implementation is additive and dark. Disable the fold publisher and comparison adapters, discard all derived
checkpoints/results, and keep the immutable ledger plus shipped legacy gauge paths unchanged. Because checkpoints and
published gauge values are reconstructable caches, rollback requires no ledger rewrite or data migration. Re-enabling
the feature begins with definition/digest validation and a full replay before incremental checkpoints are trusted.
<!-- /ANCHOR:rollback -->
