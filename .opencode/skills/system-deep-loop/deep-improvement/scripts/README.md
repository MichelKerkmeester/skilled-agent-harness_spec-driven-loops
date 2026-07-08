---
title: "deep-improvement Scripts: Lane Runtime"
description: "CLI scripts for the four deep-improvement lanes plus their shared router, helpers, and tests."
trigger_phrases:
  - "deep-improvement scripts"
  - "agent-improvement lane scripts"
  - "model-benchmark lane scripts"
  - "skill-benchmark lane scripts"
  - "non-dev-ai-system lane scripts"
---

# deep-improvement Scripts: Lane Runtime

---

## 1. OVERVIEW

`scripts/` holds the CLI scripts for the deep-improvement skill. The scripts split into four lanes plus a shared layer: `agent-improvement/`, `model-benchmark/`, `skill-benchmark/`, and `non-dev-ai-system/`. `shared/` serves the lane hosts, and `lib/` provides CommonJS helpers consumed by the lane scripts.

Current state:

- `shared/loop-host.cjs` is the router. It switches between lanes and resolves bare script names to lane directories at spawn time.
- Some lane and shared scripts require helpers from `lib/` with relative paths.
- `model-benchmark/run-benchmark.cjs` defaults to `--scorer pattern` and accepts `--scorer 5dim` for the opt-in five-dimension scorer under `model-benchmark/scorer/`.
- `skill-benchmark/` and `non-dev-ai-system/` provide the skill diagnostic lane and external packaging adapter lane.

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
+-- skill-benchmark/      # Lane C scripts
+-- non-dev-ai-system/    # Lane D adapter scripts
+-- lib/                  # Shared CommonJS helpers
`-- */tests/              # Lane-local Vitest suites; shared/tests/ also holds fixtures + the suite index
```

Allowed dependency direction:

```text
shared/loop-host.cjs → agent-improvement/ | model-benchmark/ | skill-benchmark/ | non-dev-ai-system/   (resolved at spawn)
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
+-- skill-benchmark/                       # Lane C diagnostic benchmark scripts
+-- non-dev-ai-system/                     # Lane D external packaging adapter scripts
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
| `skill-benchmark/` | Lane C diagnostic benchmark scripts for skill routing, discovery, efficiency, and usefulness. |
| `non-dev-ai-system/` | Lane D adapter scripts for externally owned non-dev AI-system refinement loops. |
| `lib/` | Shared CommonJS helpers: `typed-errors.cjs`, `promotion-gates.cjs`, `mirror-sync-verify.cjs`. |

---

## 5. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Entry | `shared/loop-host.cjs` is the single router. Lanes are not invoked directly by the loop. |
| Imports | Lane and shared scripts import helpers from `lib/` only. `lib/` is not a cross-skill import surface. |
| Lane separation | Lane scripts stay in `agent-improvement/`, `model-benchmark/`, `skill-benchmark/`, or `non-dev-ai-system/`; cross-lane scripts stay in `shared/`. |
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
│ lane script   │   │ lane script       │
│ directory     │   │ entrypoint        │
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
rg --files .opencode/skills/deep-loop-workflows/deep-improvement/scripts -g '!node_modules'
```

---

## 7. RELATED

- [`deep-improvement/SKILL.md`](../SKILL.md)
- [`lib/README.md`](./lib/README.md)
- [`shared/tests/README.md`](./shared/tests/README.md)
- [`sk-code/SKILL.md`](../../../sk-code/SKILL.md)
