---
title: "Feature Specification: Stream-Fold Gauges"
description: "Plan versioned observability gauges as deterministic folds over the transition-authorized ledger, with reproducible progress, novelty, cost, and health values; disposable incremental checkpoints; and byte-identical full-replay verification."
trigger_phrases:
  - "stream-fold gauges"
  - "deterministic ledger gauge reducers"
  - "replayable deep-loop observability"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/004-shared-evidence-and-control-services"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/004-shared-evidence-and-control-services/005-stream-fold-gauges"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the deterministic stream-fold gauge planning contract"
    next_safe_action: "Implement versioned gauge reducers and prove replay parity"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Stream-Fold Gauges

> Phase adjacency under `004-shared-evidence-and-control-services` (navigation order, not a hard runtime dependency): predecessor `004-hierarchical-typed-budgets`; successor `006-locks-and-fencing`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/004-shared-evidence-and-control-services/005-stream-fold-gauges |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop |
| **Origin** | Fifth child of the phase-004 shared evidence and control services parent |
| **Depends on** | None (`[]`); implementation consumes the phase-003 ledger contract at the parent gate |
| **Authority posture** | Additive-dark; gauge projections do not become runtime authority before staged cutover |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The shipped runtime exposes useful but independently computed observability state. `runtime/scripts/fanout-pool.cjs`
builds mutable point-in-time `lag`, `pending`, `failed`, and optional `oldest_pending_lag_ms` objects from in-process pool
state. `runtime/scripts/convergence.cjs` reads the coverage graph, recomputes signal maps and momentum, and optionally
persists a metrics snapshot. `runtime/lib/coverage-graph/coverage-graph-signals.ts` repeats graph-wide aggregation for
research, review, and context signals, while `runtime/lib/deep-loop/observability-events.cjs` appends producer-native
payloads under a common envelope without defining how a gauge is rebuilt. These are valid shipped behaviors, but the
gauge value is not yet a named, versioned function of one replayable event prefix.

That gap matters because process-local counters and replaceable snapshots can drift from the events they summarize.
A restart, missed update, changed traversal order, locale-dependent number conversion, or reducer edit can yield a
different dashboard value without any corresponding ledger fact. Incremental caches can then conceal the divergence,
and a health or convergence consumer cannot prove which event prefix, reducer version, configuration, or numeric rules
produced the value.

This phase plans gauges as pure deterministic folds over the verified, ordered stream defined by
`003-transition-authorized-ledger-core/002-typed-append-only-ledger/spec.md`. Each gauge has an immutable identity,
versioned definition, accepted event types, initial accumulator, ordered fold transition, final projection, canonical
serialization, and explicit unknown-event policy. The same ledger prefix, gauge version, configuration digest, and
cutoff must produce byte-identical output whether replayed from genesis or resumed from a verified checkpoint.

The standard set covers progress, novelty, cost, and health inputs while retaining mode-specific extension points.
This follows the program outcome and phase placement in `../../spec.md` and `../../manifest/phase-tree.json`, and it
grounds cross-mode metric needs in the run-2 synthesis and registry at
`../../../005-deep-loop-effectiveness-and-fanout/research/research-modes.md` and
`../../../005-deep-loop-effectiveness-and-fanout/research/findings-registry-modes.json`. Gauge values remain derived,
non-authoritative projections during the additive-dark period; later convergence and mode phases may consume them only
through their own authority and cutover contracts.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A gauge-definition registry with stable gauge ID, semantic version, accepted ledger event types and schema versions, reducer/configuration digest, initial state, fold transition, finalizer, and canonical output schema.
- A pure ordered fold contract over verified ledger records; sequence is authoritative, and timestamps are data rather than ordering or replay authority.
- A standard progress family covering completed/open work, evidence or obligation coverage, and terminal-state counts from explicit lifecycle events.
- A standard novelty family covering accepted novel evidence or claims, duplicate/reuse dispositions, contradictions, supersessions, and windowed deltas from ledger facts.
- A standard cost family covering integer or fixed-point token, currency, elapsed-budget, iteration, and tool-use debits/credits, composed with the hierarchical typed-budget events from sibling 004.
- A standard health-input family covering queue lag, pending/failed/retried/orphaned/stalled work, corruption or unknown-event refusals, and other event-backed inputs later health policies may interpret.
- Full replay from ledger genesis or an explicit sequence/hash cutoff, plus incremental continuation from a verified checkpoint bound to the same ledger prefix and gauge definition.
- Checkpoint validation, invalidation, and rebuild rules; checkpoints are disposable acceleration artifacts and never gauge or ledger authority.
- Determinism rules for canonical event decoding, exact numeric representation, map/set ordering, missing values, event-time cutoffs, upcasting, error handling, and canonical output bytes.
- Replay-parity, prefix, restart, corruption, unknown-version, and property-based fixtures proving incremental and full recomputation agree.
- Additive-dark adapters that compare new fold outputs with shipped gauges without changing existing runtime decisions or legacy observability schemas.

### Out of Scope
- Defining or implementing the phase-003 envelope, ledger writer, authorization proof, sequence allocator, integrity chain, or replay fingerprint.
- Owning hierarchical budget authorization or exhaustion policy; this phase folds budget events emitted under sibling `004-hierarchical-typed-budgets`.
- Defining novelty semantics, continuity identities, or claim supersession policy owned by later phase 007; this phase defines how their typed events are reduced once available.
- Choosing convergence thresholds, stop policy, degeneration policy, or promotion decisions owned by phases 008 and 010.
- Upcasters, dual-read compatibility, shadow-parity orchestration, rollback drills, authority cutover, or legacy-writer retirement owned by phases 005, 011, and 012.
- Treating gauge snapshots, dashboards, wall-clock reads, process memory, or mutable database rows as source events or canonical state.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every gauge is a registered versioned fold | The registry records gauge ID/version, input event contract, initial state, transition, finalizer, configuration digest, numeric policy, unknown-event policy, and canonical output schema |
| REQ-002 | Gauge values are reproducible from the ledger | Replaying the same verified ledger prefix with the same definition and configuration produces byte-identical accumulator and final output bytes across repeated runs and supported platforms |
| REQ-003 | The standard gauge set covers progress, novelty, cost, and health inputs | A manifest maps every standard gauge to typed source events, output fields, units, missing-value semantics, and its owning downstream consumer |
| REQ-004 | Progress derives only from lifecycle and evidence events | Completion, open-work, coverage, and obligation counts can be rebuilt without reading mutable worker state, directory counts, or a prior gauge snapshot |
| REQ-005 | Novelty preserves dispositions rather than collapsing to one counter | Novel, duplicate/reused, contradictory, superseded, and unknown states remain distinguishable, and any window is defined by ledger sequence or an immutable event-time field |
| REQ-006 | Cost arithmetic is exact and typed | Token, currency, duration-budget, iteration, and tool-use values use integer minor units or declared fixed-point arithmetic; unit or scope mismatches fail closed |
| REQ-007 | Health inputs remain observations, not policy verdicts | Lag, pending, failure, retry, orphan, stall, and integrity-refusal values are reproducible inputs; this phase does not encode later stop, promotion, or degeneration thresholds |
| REQ-008 | Incremental recomputation is equivalent to full replay | For every tested prefix and suffix, checkpoint-plus-suffix output equals genesis-to-head output byte for byte, including restart and batch-boundary permutations |
| REQ-009 | Checkpoints are prefix-bound and disposable | A checkpoint records ledger identity, last sequence and record hash, gauge version, reducer/configuration digest, and canonical accumulator hash; any mismatch invalidates it and triggers full replay |
| REQ-010 | Replay has no ambient nondeterminism | Reducers do not read current time, randomness, locale, filesystem order, network state, process globals, or mutable external stores; maps and sets serialize in a declared order |
| REQ-011 | Schema evolution and unsupported inputs fail explicitly | Supported historical events enter through versioned upcasters before folding; unknown versions, invalid payloads, sequence gaps, or non-canonical values return typed errors and never yield a trusted gauge |
| REQ-012 | Gauge observation cannot recursively change its source | Snapshot/telemetry events are excluded from their own reducers unless a separately versioned acyclic dependency is declared; no gauge reads its last published value as input |
| REQ-013 | Additive-dark integration preserves shipped authority | Fold outputs can be emitted and compared with existing fan-out, convergence, and observability values, but a mismatch is evidence for phase 005 and cannot alter legacy decisions in this phase |
| REQ-014 | Every published value carries replay provenance | A gauge result names ledger ID, inclusive cutoff sequence/hash, gauge ID/version, configuration digest, accumulator/output hashes, computation mode, and checkpoint provenance when used |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The standard progress, novelty, cost, and health-input gauge manifest is complete and every field traces to one or more typed ledger events.
- **SC-002**: Full replay produces byte-identical outputs for identical ledger prefixes across repeated process runs and supported platforms.
- **SC-003**: Incremental continuation from every valid tested checkpoint matches full genesis replay at the same ledger head; stale or corrupt checkpoints rebuild instead of drifting.
- **SC-004**: Unknown schemas, invalid units, sequence/integrity failures, and nondeterministic reducer inputs fail closed with typed evidence and no trusted gauge result.
- **SC-005**: Published gauge values carry sufficient provenance to reproduce and independently verify the exact output from the log.
- **SC-006**: Dark comparisons cover the shipped fan-out, convergence-snapshot, coverage-signal, and observability-event surfaces without changing their authority or behavior.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The phase has `depends_on: []` as an independent planning contract, but implementation consumes the versioned envelope,
verified sequence, canonical bytes, integrity linkage, and typed reader from phase 003. The largest risk is disguising a
mutable snapshot as event-sourced state: a checkpoint, SQLite metrics row, or emitted observability payload is useful
for acceleration and inspection but cannot become the fold's source of truth. Every recovery path therefore validates
the checkpoint against the ledger prefix and falls back to full replay.

Numeric and temporal semantics are a second risk. Floating-point accumulation, host locale, unordered object keys,
and `Date.now()`-style freshness make replay depend on environment or grouping. Standard reducers must use declared
integer/fixed-point units, canonical ordering, immutable cutoffs, and sequential fold semantics. Performance work may
batch decoding or cache verified prefixes, but it cannot regroup non-associative arithmetic or bypass event validation.

The phase also depends on event ownership outside its folder. Budget, novelty, continuity, fan-in, and mode-specific
events are defined by their owning siblings or later phases. This contract may reserve extension points and test
fixtures, but it must not invent those domain transitions. Until phase 005 proves shadow parity and phase 011 moves
authority, any difference from the shipped gauges is recorded as evidence rather than silently reconciled or used to
change runtime control flow.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking for planning. Implementation may choose module names, checkpoint cadence, and storage layout after the
phase-003 ledger API is materialized. Those choices must preserve pure versioned reducers, exact arithmetic, canonical
serialization, prefix-bound checkpoints, explicit unsupported-input errors, byte-identical full/incremental replay,
and additive-dark non-authority. A choice that requires reading mutable prior gauge state or ambient wall time is
outside the authorized solution space.
<!-- /ANCHOR:questions -->
