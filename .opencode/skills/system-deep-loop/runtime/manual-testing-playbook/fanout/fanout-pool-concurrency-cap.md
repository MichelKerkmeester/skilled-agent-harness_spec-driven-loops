---
title: "DLR-024 -- Fan-out worker pool concurrency cap"
description: "Validate runCappedPool respects the concurrency cap, isolates per-item failures from the pool, returns ordered results, emits ledger events, and reports all_failed when every item fails."
version: 1.4.0.4
---

# DLR-024 -- Fan-out worker pool concurrency cap

This document captures the validation contract, execution flow, and metadata for `DLR-024`.

---

## 1. OVERVIEW

Validates the concurrency-capped pool primitive in `fanout-pool.cjs`.

### Why This Matters

Reusable primitive used by `fanout-run.cjs`. If the cap is not enforced, all CLI lineages
spawn simultaneously and exhaust system resources. If a single failure sinks the pool, one
weak executor cancels all other lineages.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm `runCappedPool` enforces the cap, isolates failures, preserves result order, and emits JSONL ledger events.
- Layer partition: pool primitive.
- Real user request: `Validate the fan-out worker pool and confirm the 10 unit tests pass and match the documented concurrency and isolation contracts.`
- Expected signals: Gated-worker test confirms max N in flight at any moment; failure-isolation test confirms pool continues after one rejection; `all_failed` flag is true only when every item fails; results array preserves index order.
- Pass/fail: PASS only if all 10 tests pass with EXIT 0 and source inspection confirms the concurrency pump logic; FAIL otherwise.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is repository root.
- `scripts/fanout-pool.cjs` present.

### Steps

1. Inspect `scripts/fanout-pool.cjs` — confirm `runCappedPool` pump loop clamps concurrency to ≥1 and pre-sizes results array.
2. `bash: cd .opencode/skills/system-spec-kit/mcp-server && npx vitest run ../../runtime//tests/unit/fanout-pool.vitest.ts`
3. Confirm 10 tests pass.
4. Note: gated-worker test verifies `maxActive()` ≤ concurrency; failure-isolation test verifies pool continues when one item throws.

### Expected Outcome

10/10 pass. Pool cap respected, one rejection does not sink pool, ordered results preserved, `all_failed` correct, `onEvent` callback receives started/completed/failed events.

### Failure Modes

- Concurrency cap exceeded: `maxActive()` > configured cap.
- One rejection propagates to pool promise: entire pool rejects instead of settling individually.
- Results out of order: index not preserved across async completions.

---

## 4. SOURCE ANCHORS

### Implementation

| File | Role |
|---|---|
| `scripts/fanout-pool.cjs` | `runCappedPool`, `settleItem`, `buildPoolSummary`, `appendStatusLedger`, `writeOrchestrationSummary` |

### Validation

| File | Role |
|---|---|
| `tests/unit/fanout-pool.vitest.ts` | 10 unit tests |

---

## 5. SOURCE_METADATA

- Group: Fan-Out
- Playbook ID: DLR-024
- Feature catalog entry: `feature-catalog/fanout/fanout-pool.md`
- Scenario file path: `manual-testing-playbook/fanout/fanout-pool-concurrency-cap.md`
- Expected verdict mode: GREEN when 10/10 pass and source anchors agree
- Wall-time estimate: 5-10 min
