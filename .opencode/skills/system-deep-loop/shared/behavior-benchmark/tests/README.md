---
title: "Behavior Benchmark Tests: hermetic runner test suite"
description: "Hermetic tests that pin the behavior-bench-run.cjs scoring functions and CLI against synthetic and frozen fixtures."
---

# Behavior Benchmark Tests

---

## 1. OVERVIEW

Hermetic test suite for `../behavior-bench-run.cjs`. Pins the pure scoring and classification functions against synthetic inputs and pins the live runner CLI against a fake executor leg injected through `BEHAVIOR_BENCH_SPAWN_JSON`, so the suite needs no live model session. It also regression-pins the eleven frozen v1 `DAB-001..011` scenarios against a golden result map to catch scoring drift.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `behavior-bench-run.test.cjs` | Asserts the runner's exported functions and `LEG_TABLE`, builds spawn args per leg, then replays the frozen DAB-001..011 scenarios against `fixtures/dab-v1-golden.json` to pin scoring output. |
| `fixtures/` | Synthetic scenario contract, fake executor leg and golden result data the suite consumes. See `fixtures/README.md`. |

## 3. VALIDATION

```bash
node .opencode/skills/system-deep-loop/shared/behavior-benchmark/tests/behavior-bench-run.test.cjs
```

Expected: `behavior-bench-run.test.cjs: all assertions passed`.

## 4. RELATED

- [`../README.md`](../README.md)
- [`fixtures/README.md`](fixtures/README.md)
