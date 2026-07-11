---
title: "Fan-out worker pool"
description: "Concurrency-capped fan-out pool primitive: runCappedPool with injected worker, never-throws per-item settlement, ordered results, and JSONL status ledger."
trigger_phrases:
  - "fan-out worker pool"
  - "fanout-pool.cjs"
  - "run capped pool"
  - "concurrency-capped fanout"
  - "orchestration status ledger"
version: 1.4.0.3
---

# Fan-out worker pool

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Pure pool primitive — the worker function is injected by the caller so this module is
agnostic to what work it is running. `runCappedPool` keeps at most `concurrency` promises
in flight at any time, settles every item individually with timing metadata, emits ledger
events via an optional `onEvent` callback, and returns ordered results regardless of
completion order. `settleItem` wraps each worker call in a try/catch so one rejection
never sinks the pool. `appendStatusLedger` and `writeOrchestrationSummary` generalize the
packet-122 orchestration-status.log/orchestration-summary.json pattern into reusable helpers.

### Why This Matters

Reusable concurrency primitive. Any future parallel workload in the deep-loop stack can use
this pool without reimplementing the concurrency cap, settlement contract, or ledger shape.

---

## 2. HOW IT WORKS

Fully shipped in `fanout-pool.cjs`. Pure CJS (no TSX bootstrap), no CLI entry point, exports
only. Concurrency is clamped to ≥1. The results array is pre-sized to preserve index order.
`all_failed` is true only when every item fails — callers check this before writing a
partial summary.

An optional lag-ceiling stall detector watches for a hung worker rather than queue
backpressure. The lag metric is time-since-last-completion-while-work-is-pending, tracked
through `lastProgressAtMs` and reset on every settlement, so a healthy fan-out wider than its
concurrency keeps the clock reset and the gauge stays silent. When `lagCeilingMs > 0` and the
oldest-pending lag reaches the ceiling, the pool emits a single `lag_ceiling_exceeded` event
carrying `metric: 'time_since_last_completion'`. The committed `lagCeilingMs` default is 0
(disabled), so the gauge is opt-in. The recommended production value is 120000ms.

---

## 3. SOURCE FILES

### Implementation

| File | Role |
|---|---|
| `scripts/fanout-pool.cjs` | `runCappedPool`, `settleItem`, `buildPoolSummary`, `appendStatusLedger`, `writeOrchestrationSummary` |

### Validation

| File | Role |
|---|---|
| `tests/unit/fanout-pool.vitest.ts` | 10 tests: concurrency cap respected under gated workers, single-failure isolation, all-fail summary flag, ordered results, `onEvent` ledger emission, empty pool |

---

## 4. SOURCE METADATA

- Group: Fan-Out
- Feature ID: F024
- Catalog source: `feature_catalog/fanout/fanout-pool.md`
- Primary source files: `scripts/fanout-pool.cjs`
Related references:
- [fanout-config-schema.md](fanout-config-schema.md) — Fan-out config schema
- [fanout-run.md](fanout-run.md) — Fan-out CLI lineage driver
