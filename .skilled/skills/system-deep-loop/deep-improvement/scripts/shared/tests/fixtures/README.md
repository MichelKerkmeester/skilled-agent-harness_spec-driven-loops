---
title: "Test Fixtures: Deterministic State Inputs"
description: "Static state files that drive the deep-improvement vitest suites without running a live loop."
trigger_phrases:
  - "test fixtures"
  - "low-sample-benchmark fixture"
---

# Test Fixtures: Deterministic State Inputs

---

## 1. OVERVIEW

`fixtures/` holds static input files that the lane-local vitest suites read instead of running a live improvement or benchmark loop. These are cross-lane fixtures (consumed by `agent-improvement/` and `shared/` suites), so they live under `shared/tests/fixtures/`. Each fixture pins a known ledger and config shape so a test can assert exact reducer, scorer, and gate output.

Current state:

- Fixtures are read-only inputs. Tests load them and assert against expected output.
- Each subfolder represents one scenario consumed by named suites.
- Files match the on-disk shapes produced by `scripts/shared/reduce-state.cjs`, `scripts/agent-improvement/*.cjs`, and `scripts/model-benchmark/run-benchmark.cjs`.

---

## 2. DIRECTORY TREE

```text
fixtures/
`-- low-sample-benchmark/   # Insufficient-data and insufficient-sample scenario
    +-- improvement-config.json
    +-- agent-improvement-state.jsonl
    +-- improvement-journal.jsonl
    +-- benchmark-results.json
    +-- candidate-lineage.json
    +-- mutation-coverage.json
    +-- trade-off-trajectory.json
    `-- README.md
```

---

## 3. KEY FILES

| Path | Responsibility |
|---|---|
| `low-sample-benchmark/` | One short session with too few data points and replays. Exercises the insufficient-data path of `trade-off-detector.cjs`, the insufficient-sample path of `benchmark-stability.cjs`, and the registry surfacing in `reduce-state.cjs`. |

The `low-sample-benchmark/README.md` documents each fixture file and the exact verdict shape each suite asserts.

---

## 4. RELATED

- [`shared/tests/README.md`](../README.md)
- [`scripts/README.md`](../../../README.md)
- [`low-sample-benchmark/README.md`](./low-sample-benchmark/README.md)
