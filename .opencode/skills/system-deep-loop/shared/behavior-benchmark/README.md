---
title: "Behavior Benchmark: shared executor-behavior contract and runner"
description: "Normative scenario contract and reference runner for scoring live executor behavior at the deep-loop command surface."
---

# Behavior Benchmark

---

## 1. OVERVIEW

Shared behavior-benchmark contract consumed by every deep-loop mode (`deep-ai-council`, `deep-alignment`, `deep-improvement`, `deep-research`, `deep-review`). `framework.md` is the single source of truth for the scenario schema, scoring rubric and classification taxonomy. `behavior-bench-run.cjs` is the reference runner that executes one scenario against one executor leg and emits a scored result JSON. Per-mode scenario packages live under each `deep-*` skill's own `behavior-benchmark/` folder and link back to `framework.md` rather than redefining the contract.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `behavior-bench-run.cjs` | Reference runner. Spawns an executor leg for one scenario, watches the live process against a no-progress watchdog, extracts checkpoints and delegation evidence from the transcript and scores the run against the five-dimension rubric. |
| `framework.md` | Normative scenario contract: v1/v2 schema, D1-D5 scoring rubric, classification taxonomy, entry-surface and clarity codes, budget policy. |
| `tests/` | Hermetic test suite for the runner. See `tests/README.md`. |

## 3. CONSUMERS

Each `deep-*` mode's `behavior-benchmark/behavior-benchmark.md` links `framework.md` and invokes `behavior-bench-run.cjs` with the stable CLI contract:

```text
node behavior-bench-run.cjs --scenario <file> --leg <name> --out-dir <dir>
  [--samples <count>] [--baseline <file>] [--repo-root <dir>]
  [--timeout-ms <ms>] [--watchdog-ms <ms>]
```

## 4. TESTS

```bash
node .opencode/skills/system-deep-loop/shared/behavior-benchmark/tests/behavior-bench-run.test.cjs
```

Runs hermetically against a fake executor leg. No live model session required. See `tests/README.md`.
