---
title: "Behavior Benchmark: shared executor-behavior contract and runner"
description: "Normative scenario contract and reference runner for scoring live executor behavior at the deep-loop command surface."
---

# Behavior Benchmark

---

## 1. OVERVIEW

Shared behavior-benchmark contract consumed by every deep-loop mode (`deep-research`, `deep-review`). `framework.md` is the single source of truth for the scenario schema, scoring rubric and classification taxonomy. `behavior-bench-run.cjs` is the reference runner that executes one scenario against one executor leg and emits a scored result JSON. Per-mode scenario packages live under each `deep-*` skill's own `behavior-benchmark/` folder and link back to `framework.md` rather than redefining the contract.

---

## 2. CONTENTS

```text
behavior-benchmark/
+-- behavior-bench-run.cjs   # Reference runner and CLI
+-- framework.md             # Normative scenario contract and rubric
+-- tests/                   # Hermetic runner tests
|   `-- fixtures/            # Fake executor leg and synthetic scenario
`-- README.md
```

| File | Purpose |
|------|---------|
| `behavior-bench-run.cjs` | Reference runner. Spawns an executor leg for one scenario, watches the live process against a no-progress watchdog, extracts checkpoints and delegation evidence from the transcript and scores the run against the five-dimension rubric. |
| `framework.md` | Normative scenario contract: v1/v2 schema, D1-D5 scoring rubric, classification taxonomy, entry-surface and clarity codes, budget policy. |
| `tests/` | Hermetic test suite for the runner. See `tests/README.md`. |

---

## 3. CONSUMERS

Each mode's scenario package, [`../../deep-research/behavior-benchmark/behavior-benchmark.md`](../../deep-research/behavior-benchmark/behavior-benchmark.md) and [`../../deep-review/behavior-benchmark/behavior-benchmark.md`](../../deep-review/behavior-benchmark/behavior-benchmark.md), links `framework.md` and invokes `behavior-bench-run.cjs` with the stable CLI contract:

```text
node behavior-bench-run.cjs --scenario <file> --leg <name> --out-dir <dir>
  [--samples <count>] [--baseline <file>] [--repo-root <dir>]
  [--timeout-ms <ms>] [--watchdog-ms <ms>]
```

Exit codes: `0` when a result JSON is written, even for a failed or killed run. `2` for bad flags, an unparseable scenario, a `/regex/` marker that does not compile or an unknown leg. `3` when the runner itself fails. `75` when the provider rejects the run on quota or rate limit, so the cell never ran and can be retried after the reset.

---

## 4. TESTS

```bash
node .skilled/skills/system-deep-loop/shared/behavior-benchmark/tests/behavior-bench-run.test.cjs
node .skilled/skills/system-deep-loop/shared/behavior-benchmark/tests/behavior-bench-run-git-timeout.test.cjs
node .skilled/skills/system-deep-loop/shared/behavior-benchmark/tests/behavior-bench-run-markers.test.cjs
```

All three run hermetically. No live model session is required. Expected: the first prints `behavior-bench-run.test.cjs: all assertions passed`, and the second and third each report `pass 4` and `fail 0`. See [`tests/README.md`](tests/README.md).
