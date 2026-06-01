---
title: "deep-improvement Scripts: Lane Runtime"
description: "CLI scripts for the two deep-improvement lanes plus their shared router, helpers, and tests."
trigger_phrases:
  - "deep-improvement scripts"
  - "agent-improvement lane scripts"
  - "model-benchmark lane scripts"
---

# deep-improvement Scripts: Lane Runtime

---

## 1. OVERVIEW

`scripts/` holds the CLI scripts for the deep-improvement skill. The scripts split into two lanes plus a shared layer. Lane A (`agent-improvement/`) improves an agent file. Lane B (`model-benchmark/`) benchmarks a model or prompt framework. `shared/` serves both lanes, and `lib/` provides CommonJS helpers consumed by the lane scripts.

Current state:

- `shared/loop-host.cjs` is the router. It switches between lanes and resolves bare script names to lane directories at spawn time.
- Lane scripts require helpers from `lib/` with relative `../lib/` paths.
- `model-benchmark/run-benchmark.cjs` defaults to `--scorer pattern` and accepts `--scorer 5dim` for the opt-in five-dimension scorer under `model-benchmark/scorer/`.

---

## 2. PACKAGE TOPOLOGY

```text
scripts/
+-- shared/               # Router and cross-lane scripts
|   +-- loop-host.cjs          # Entry point and lane path resolver
|   `-- ...                    # Journal, reducer, fixtures, promotion
+-- agent-improvement/    # Lane A scripts
+-- model-benchmark/      # Lane B scripts
|   `-- scorer/                # Opt-in five-dimension scorer subtree
+-- lib/                  # Shared CommonJS helpers
`-- */tests/              # Lane-local Vitest suites; shared/tests/ also holds fixtures + the suite index
```

Allowed dependency direction:

```text
shared/loop-host.cjs → agent-improvement/ | model-benchmark/   (resolved at spawn)
agent-improvement/ → lib/
model-benchmark/ → lib/
shared/ → lib/
```

---

## 3. DIRECTORY TREE

```text
scripts/
+-- shared/
|   +-- loop-host.cjs                      # Mode-switching entry point and lane path resolver
|   +-- improvement-journal.cjs            # Append-only audit journal
|   +-- materialize-benchmark-fixtures.cjs # Fixture materializer
|   +-- mutation-coverage.cjs              # Mutation coverage and dimension trajectories
|   +-- promote-candidate.cjs              # Guarded canonical promotion
|   +-- reduce-state.cjs                    # Dashboard and registry reducer
|   `-- tests/                             # Shared/lib suites + cross-lane fixtures + suite index
+-- agent-improvement/
|   +-- score-candidate.cjs                # Dynamic-mode five-dimension candidate scorer
|   +-- benchmark-stability.cjs            # Score variance and weight advisory
|   +-- candidate-lineage.cjs              # Candidate derivation tracking
|   +-- check-mirror-drift.cjs             # Derived-surface drift report
|   +-- generate-profile.cjs               # Dynamic target profile generator
|   +-- rollback-candidate.cjs             # Canonical rollback helper
|   +-- scan-integration.cjs               # Integration surface scanner
|   +-- trade-off-detector.cjs             # Cross-dimension regression detector
|   `-- tests/                             # Lane A Vitest suites
+-- model-benchmark/
|   +-- run-benchmark.cjs                  # Fixture and integration scorer
|   +-- dispatch-model.cjs                 # Model-agnostic CLI dispatcher
|   +-- scorer/                            # Opt-in five-dimension scorer subtree
|   `-- tests/                             # Lane B Vitest suites
+-- lib/                                   # Shared CommonJS helpers
`-- vitest.config.mjs                      # Vitest include config
```

---

## 4. KEY FILES

| File | Responsibility |
|---|---|
| `shared/loop-host.cjs` | Mode-switching entry point. `planInvocation` stays byte-identical across lanes and `resolveScriptPath` maps bare names to lane directories at spawn time. |
| `shared/reduce-state.cjs` | Dashboard and experiment registry reducer for both lanes. |
| `shared/promote-candidate.cjs` | Guarded canonical mutation that promotes a winning candidate. |
| `agent-improvement/score-candidate.cjs` | Dynamic-mode five-dimension candidate scorer for Lane A. |
| `agent-improvement/trade-off-detector.cjs` | Cross-dimension regression detection with an insufficient-data guard. |
| `model-benchmark/run-benchmark.cjs` | Fixture and integration scorer. `--scorer pattern` is the default and `--scorer 5dim` selects the `scorer/` subtree. |
| `model-benchmark/dispatch-model.cjs` | Model-agnostic CLI dispatcher for Lane B. |
| `model-benchmark/scorer/` | Five-dimension scorer with `score-model-variant.cjs`, `deterministic/`, `grader/`, and `lib/cache.cjs`. The runtime `cache/` is git-ignored. |
| `lib/` | Shared CommonJS helpers: `typed-errors.cjs`, `promotion-gates.cjs`, `mirror-sync-verify.cjs`. |

---

## 5. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Entry | `shared/loop-host.cjs` is the single router. Lanes are not invoked directly by the loop. |
| Imports | Lane and shared scripts import helpers from `lib/` only. `lib/` is not a cross-skill import surface. |
| Lane separation | Lane A scripts stay in `agent-improvement/`, Lane B scripts stay in `model-benchmark/`, and cross-lane scripts stay in `shared/`. |
| Test co-location | Each lane's Vitest suites live in its own `tests/` subdir (`<lane>/tests/`). Cross-lane fixtures and the suite index live under `shared/tests/`. |

Main flow:

```text
╭──────────────────────────────────────────╮
│ loop dispatch                            │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ shared/loop-host.cjs (planInvocation)    │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ resolveScriptPath maps bare name to lane │
└──────────────────────────────────────────┘
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
┌───────────────┐   ┌───────────────────┐
│ agent-        │   │ model-benchmark/  │
│ improvement/  │   │ run-benchmark.cjs │
└───────┬───────┘   └─────────┬─────────┘
        │                     │
        └──────────┬──────────┘
                   ▼
        ┌───────────────────┐
        │ lib/ helpers      │
        └───────────────────┘
```

---

## 6. VALIDATION

Run from the `scripts/` directory.

```bash
npx vitest run
```

Expected result: every suite under `*/tests/**/*.vitest.ts` passes (suites live lane-locally under each lane's `tests/`).

List the source files from the repository root.

```bash
rg --files .opencode/skills/deep-improvement/scripts -g '!node_modules'
```

---

## 7. RELATED

- [`deep-improvement/SKILL.md`](../SKILL.md)
- [`lib/README.md`](./lib/README.md)
- [`shared/tests/README.md`](./shared/tests/README.md)
- [`sk-code/SKILL.md`](../../sk-code/SKILL.md)
