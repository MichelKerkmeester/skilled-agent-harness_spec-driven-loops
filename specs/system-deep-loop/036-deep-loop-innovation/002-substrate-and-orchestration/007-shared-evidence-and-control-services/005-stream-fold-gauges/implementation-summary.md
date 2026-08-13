---
title: "Implementation Summary: Stream-Fold Gauges"
description: "Execution evidence for deterministic ledger-derived gauges, disposable checkpoint replay, replay-fingerprint binding, and additive-dark comparison and publication."
trigger_phrases:
  - "stream-fold gauges implementation summary"
  - "stream-fold gauge verification evidence"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/005-stream-fold-gauges"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/005-stream-fold-gauges"
    last_updated_at: "2026-07-21T00:38:15Z"
    last_updated_by: "codex"
    recent_action: "Completed deterministic stream-fold gauges and all verification gates"
    next_safe_action: "Keep the service dark until an owning cutover phase integrates it"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/stream-fold-gauges/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/stream-fold-gauges.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Stream-Fold Gauges

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-stream-fold-gauges |
| **Implementation Date** | 2026-07-21 |
| **Level** | 2 |
| **Status** | Complete |
| **Candidate Base Commit** | `d1a3f0323c3635f24c3560feaeda839522ececf0` with this leaf uncommitted |
| **Runtime Surface** | OpenCode Node/TypeScript |
| **Authority Posture** | Additive-dark; legacy remains canonical until phase 014 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The runtime can now rebuild progress, novelty, cost, and health-input gauges from an exact verified ledger prefix. Every result carries the definition, configuration, cutoff, accumulator, output, checkpoint, and replay-fingerprint identity needed to reproduce it. The implementation is additive: it exports a new service and typed evidence contracts without importing the service from, or changing, any existing writer or control path.

### Modules

| Module | Contract |
|--------|----------|
| `stream-fold-gauge-types.ts` | Public registry, replay, checkpoint, result, dark-comparison, and evidence types |
| `stream-fold-gauge-errors.ts` | Typed fail-closed codes and structured refusal errors |
| `gauge-registry.ts` | Immutable versioned registry, digest derivation, dependency validation, and deterministic reducer/finalizer checks |
| `standard-gauges.ts` | Progress, novelty, exact cost, and policy-free health-input folds |
| `gauge-replay.ts` | Verified-prefix replay, checkpoint validation/rebuild, canonical output, and replay-fingerprint binding |
| `gauge-evidence.ts` | Typed result/comparison events, bounded dark comparisons, and gateway-only durable publication |
| `index.ts` | Public entrypoint for the complete gauge service |
| `stream-fold-gauges.vitest.ts` | Focused registry, fold, replay, checkpoint, fingerprint, dark, and publication contract suite |

### Contract Proofs

| Contract | Evidence |
|----------|----------|
| Deterministic registry | Four immutable manifest entries; digest `fc75b4e36e55c70398d104d75f5bf96e0331085b19672e52454a201d10f4bd2f`; reducer/configuration/definition digests; duplicate, missing dependency, cycle, self-input, and ambient-capability refusals |
| Verified stream only | Replay validates ledger identity, contiguous sequence, previous and current record hashes, event hash, receipt identity, and event-registry digest before reduction |
| Standard families | Progress uses lifecycle/obligation state, novelty preserves five dispositions in a ledger-sequence window, cost uses exact canonical integer strings by scope/unit, and health exposes observations without policy thresholds |
| Full and incremental parity | All four gauges are compared at every split `0..12`; checkpoint plus suffix matches genesis replay for canonical accumulator and output bytes |
| Disposable checkpoints | Schema, ledger, sequence, prefix hash, event/gauge registry, version, reducer, configuration, accumulator hash, and canonical accumulator corruption cases rebuild from genesis with rejection provenance |
| Replay identity | Real `AppendOnlyLedger` replay is independently bound through the shipped replay-fingerprint registries and compared with the gauge accumulator |
| Additive-dark evidence | Five legacy surfaces preserve the exact caller result reference; comparison events carry hashes and bounded paths, not compared values; publication requires one exact `TransitionAuthorizationGateway` allow |

### Runtime Inventory

| Existing surface | Gauge ownership or disposition | Authority after this leaf |
|------------------|-------------------------------|---------------------------|
| `runtime/scripts/fanout-pool.cjs` | Health-input observation and pinned `buildPoolGauges` dark fixture | Unchanged and canonical |
| `runtime/scripts/convergence.cjs` | Dark comparison now; threshold and stop ownership remains phase 011 | Unchanged and canonical |
| `runtime/lib/coverage-graph/coverage-graph-signals.ts` | Progress/novelty inputs and pinned signal fixture; interpretation remains phase 011 | Unchanged and canonical |
| Coverage metrics snapshots | Pinned dark fixture only; snapshots never become replay input or checkpoint authority | Unchanged and canonical |
| `runtime/lib/deep-loop/observability-events.cjs` | Pinned envelope fixture and separate typed gauge evidence events | Unchanged and canonical |
| Typed budget usage events | Exact cost fold; budget admission/exhaustion remains sibling 004 | Sibling policy unchanged |

### Run-2 Recommendation Dispositions

The phase-004 recommendation ledger contains eleven run-b rows whose original target includes `runtime/gauges-observability`. Their existing dispositions remain authoritative:

| Rows | Disposition and owner |
|------|-----------------------|
| `DLR-B-030`, `DLR-B-034`, `DLR-B-036` | This phase-007 leaf owns the deterministic fold, catalog, checkpoint validation, and full-replay parity foundation; domain-specific metrics remain extensions over typed events |
| `DLR-B-035` | Phase 006 owns the versioned envelope and ledger substrate consumed here |
| `DLR-B-018`, `DLR-B-059` | Phase 011 owns cycle/health interpretation, alarms, convergence, and recovery policy |
| `DLR-B-022`, `DLR-B-052`, `DLR-B-055` | Phase 013 owns council independence, calibration, and stance-derived mode gauges |
| `DLR-B-046` | Merged into `DLR-B-028`; the evaluation ladder remains outside this shared fold service |
| `DLR-B-058` | Deferred by the frozen ledger because the adaptive broker precedes calibrated fixed controls |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The service was added under one new runtime library directory plus one focused test file. It consumes the shipped event-envelope, authorized-ledger, and replay-fingerprint public boundaries and does not redefine them. Durable gauge evidence is prepared as typed canonical events and can be appended only after the shipped transition gateway returns an exact single-use allow proof.

### Feature Catalog and Manual Verification

| Operation | Public entrypoint | Manual proof |
|-----------|-------------------|--------------|
| Full replay | `replayGauge` or `replayGaugeFromLedger` without a checkpoint | Confirm `computationMode` is `full`, replay the same cutoff twice, and compare `resultBytes` |
| Incremental replay | Supply the prior `checkpoint` | Confirm `computationMode` is `incremental`, `eventsProcessed` equals suffix length, and bytes equal full replay |
| Checkpoint invalidation | Mutate any bound identity/digest/hash/schema field | Confirm `computationMode` is `full-rebuild` with `checkpointProvenance.status = rejected` |
| Dark comparison | `compareGaugeDark` | Confirm `legacyResult` is the same reference and evidence contains only hashes, parity, and bounded differing paths |
| Durable evidence | `prepareGaugeResultEvidence` or `prepareGaugeComparisonEvidence`, then `recordGaugeEvidence` | Confirm denial appends nothing and an allow appends exactly one verified ledger frame |
| Rollback | Remove any optional caller integration and discard derived checkpoints/results | No ledger rewrite or legacy restoration is required because no existing authority path changed |

The focused command is:

```bash
.opencode/skills/system-spec-kit/mcp-server/node_modules/.bin/vitest run \
  --config .opencode/skills/system-deep-loop/runtime/vitest.config.ts \
  tests/unit/stream-fold-gauges.vitest.ts --reporter=verbose
```
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Trust only `VerifiedLedgerEvent` prefixes and the shipped ledger reader | Gauge code must not create a second event-validation or ledger-authority boundary |
| Keep checkpoints as canonical disposable values | A cache mismatch can rebuild safely; a cache never becomes source-of-truth state |
| Represent cost totals as canonical decimal strings backed by `BigInt` | Exact arithmetic must survive values beyond host safe integers without floating-point regrouping |
| Use ledger sequence for novelty windows | Sequence is immutable replay order; wall time and locale are not authority |
| Exclude gauge result/comparison event types from all originating folds | Publishing an observation must not recursively change the observed value |
| Return bounded dark evidence while preserving the legacy result reference | The new path can measure parity without moving authority or leaking complete compared payloads |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Focused Vitest | PASS, 1 file and 37 tests, exit 0 |
| Focused fixture | SHA-256 `0913f2f004ebc7980402337b12700ab2b32eda54141a876450ae3b6361331e7b` |
| Standard ledger cutoff | Ledger `stream-fold-gauge-fixture`, sequence `12`, record hash `6f8f1092575320a0aafe6bc713a3023b7d1ededfef4cb9d43bc97395a451786f` |
| Platform matrix | PASS on `darwin arm64`, Node `v22.23.1`; hostile `tr_TR.UTF-8` child process also produced identical bytes |
| Leaf strict TypeScript | PASS, exit 0 using `--strict` against `lib/stream-fold-gauges/index.ts` |
| Full runtime TypeScript | PASS, project `tsc --noEmit` exit 0 after concurrent sibling work settled |
| `sk-code` quality | PASS, comment hygiene for every new TypeScript file and alignment drift with 0 findings |
| Substrate and existing writers | PASS, scoped `git diff --name-only` is empty for event-envelope, authorized-ledger, replay-fingerprint, fanout, convergence, coverage graph, and observability-event paths |
| Additive-dark scope | PASS for this leaf: scoped status contains only the new stream-fold runtime directory, focused test, and this leaf's docs; unrelated concurrent sibling changes are not attributed to this leaf |
| Strict packet validation | PASS, `validate.sh --strict` exit 0 with Errors 0 and Warnings 0 |

The repository-wide Vitest suite is not this leaf's completion gate. The operator identified roughly 100 baseline failures from the missing `better-sqlite3` dependency and kebab-case fixture filename mismatches. A pre-implementation substrate sample reproduced the replay-fingerprint child-process filename mismatch; this leaf did not modify or attempt to repair that baseline.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No authority cutover.** The new service remains dark and additive. Phase 014 owns any future move from legacy decisions to gauge-derived authority.
2. **No policy verdicts.** Health, novelty, progress, and cost outputs are observations. Convergence, degeneration, promotion, and recovery thresholds remain with their owning later phases.
3. **No durable checkpoint store.** The module validates and emits checkpoint values but deliberately does not choose storage or cadence. Callers may discard every checkpoint and rebuild from the ledger.
4. **No domain invention.** Later novelty, council, benchmark, and continuity gauges require typed events from their owning phases before they can be registered as extensions.
<!-- /ANCHOR:limitations -->
