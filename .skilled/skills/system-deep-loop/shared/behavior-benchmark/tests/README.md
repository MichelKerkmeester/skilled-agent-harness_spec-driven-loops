---
title: "Behavior Benchmark Tests: hermetic runner test suite"
description: "Hermetic tests that pin the behavior-bench-run.cjs scoring functions and CLI against synthetic and frozen fixtures."
---

# Behavior Benchmark Tests

---

## 1. OVERVIEW

Hermetic test suite for `../behavior-bench-run.cjs`. Pins the pure scoring and classification functions against synthetic inputs and pins the live runner CLI against a fake executor leg injected through `BEHAVIOR_BENCH_SPAWN_JSON`, so the suite needs no live model session.

---

## 2. CONTENTS

```text
tests/
+-- behavior-bench-run.test.cjs              # Runner exports, LEG_TABLE and CLI
+-- behavior-bench-run-git-timeout.test.cjs  # Bounded git status and isolation guards
+-- fixtures/                                # Fake executor leg and synthetic scenario
`-- README.md
```

| File | Purpose |
|------|---------|
| `behavior-bench-run.test.cjs` | Asserts the runner's exported functions and `LEG_TABLE`, and builds spawn args per leg against a fake executor. |
| `behavior-bench-run-git-timeout.test.cjs` | Stubs `execFileSync` before the runner loads, then asserts that git status disables fsmonitor and runs under a timeout, that a failed git status returns null instead of an empty list, that isolation is reported unavailable when git never answered and that paths outside the fixture and output folders still count as isolation violations. |
| `fixtures/` | Synthetic scenario contract and fake executor leg data the suite consumes. See `fixtures/README.md`. |

---

## 3. VALIDATION

```bash
node .skilled/skills/system-deep-loop/shared/behavior-benchmark/tests/behavior-bench-run.test.cjs
node .skilled/skills/system-deep-loop/shared/behavior-benchmark/tests/behavior-bench-run-git-timeout.test.cjs
```

Expected: the first prints `behavior-bench-run.test.cjs: all assertions passed`. The second is a `node:test` file and reports `pass 4` and `fail 0`.

---

## 4. RELATED

- [`../README.md`](../README.md)
- [`fixtures/README.md`](fixtures/README.md)
