---
title: "shared: Cross-Lane Scripts"
description: "Mode router, promotion, fixtures, state reducer, journal, and coverage scripts serving both deep-improvement lanes."
trigger_phrases:
  - "shared deep-improvement scripts"
  - "loop-host router"
  - "cross-lane scripts"
---

# shared: Cross-Lane Scripts

---

## 1. OVERVIEW

`shared/` holds the scripts used by BOTH lanes of the deep-improvement skill: Lane A (agent-improvement) and Lane B (model-benchmark). `loop-host.cjs` is the mode router that dispatches into either lane, and the remaining scripts are lane-agnostic helpers for promotion, fixtures, state reduction, journaling, and coverage tracking.

Current state:

- `loop-host.cjs` is the single entry point. It reads `--mode` (`agent-improvement` default or `model-benchmark`) and spawns the lane scripts.
- `planInvocation()` returns BARE script names so its plan output stays byte-identical across modes. `resolveScriptPath()` maps each bare name to its real lane directory at spawn time.
- `promote-candidate.cjs` and `reduce-state.cjs` are mode-aware: they read a `mode` field on records and attribute missing or unknown modes to `agent-improvement`.
- `improvement-journal.cjs` and `mutation-coverage.cjs` provide journal and coverage primitives shared by both lanes.

---

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                       shared (cross-lane)                          │
╰──────────────────────────────────────────────────────────────────╯

                    ┌──────────────────────┐
                    │ loop-host.cjs        │
                    │ (mode router)        │
                    └──────────┬───────────┘
              resolveScriptPath │ by bare name
          ┌───────────────────┼───────────────────┐
          ▼                    ▼                   ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ Lane A names     │  │ shared names      │  │ Lane B names      │
│ ../agent-        │  │ ./ (this folder)  │  │ ../model-         │
│ improvement/     │  │ materialize, etc. │  │ benchmark/        │
└──────────────────┘  └──────────────────┘  └──────────────────┘

Spawn map (resolveScriptPath):
  Lane A names    ───▶ ../agent-improvement/<name>
  Lane B names    ───▶ ../model-benchmark/<name>
  shared names    ───▶ ./<name>
```

---

## 3. DIRECTORY TREE

```text
shared/
+-- loop-host.cjs                       # Mode router + resolveScriptPath spawn map
+-- promote-candidate.cjs               # Mode-aware guarded canonical promotion
+-- materialize-benchmark-fixtures.cjs  # Renders benchmark fixtures into outputs dir
+-- reduce-state.cjs                    # Registry + dashboard reducer with lane mode-mix
+-- improvement-journal.cjs             # Append-only audit journal primitives
+-- mutation-coverage.cjs               # Mutation signature + trajectory coverage graph
`-- README.md
```

---

## 4. KEY FILES

| File | Responsibility |
|---|---|
| `loop-host.cjs` | Mode router and the only spawn host. `resolveMode()` defaults to `agent-improvement` and warns on unknown modes. `planInvocation()` builds ordered steps with BARE script names. `resolveScriptPath()` maps each bare name to its lane directory. Exports `parseArgs`, `resolveMode`, `planInvocation`, `resolveScriptPath`, `VALID_MODES`. |
| `promote-candidate.cjs` | Guarded promotion of a candidate to the canonical manifest target. Evaluates weighted-score, benchmark-aggregate, per-dimension, and mirror-sync gates, and refuses promotion while the runtime config is proposal-only. Requires `--approve`. Imports `../lib/promotion-gates.cjs` and `../lib/mirror-sync-verify.cjs`. |
| `materialize-benchmark-fixtures.cjs` | Renders fixtures referenced by a profile into a benchmark outputs directory so scoring sees real inputs. CLI: `--profile <path> --outputs-dir <path>`. Run before `run-benchmark.cjs` in the Lane B plan. |
| `reduce-state.cjs` | Reduces the runtime ledger into an experiment registry and dashboard. Buckets records by `mode` (`agent-improvement` vs `model-benchmark`), reports lane mode-mix per profile and globally, evaluates stop status, and renders journal, lineage, coverage, and mirror-sync sections. CLI: `node reduce-state.cjs <improvement-runtime-root>`. |
| `improvement-journal.cjs` | Append-only audit journal. Exports `emitEvent`, `readJournal`, `validateEvent`, `getSessionResult`, plus `STOP_REASONS` and `SESSION_OUTCOMES` taxonomies. CLI: `--emit <eventType> --journal <path> [--details <json>]` or `--read <path>`. |
| `mutation-coverage.cjs` | Library tracking explored mutation signatures and per-dimension trajectories for convergence eligibility. Exports `createCoverageGraph`, `recordMutation`, `recordTrajectory`, `checkConvergenceEligibility`, and related. No CLI entrypoint. |

---

## 5. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | `promote-candidate.cjs` imports `../lib/promotion-gates.cjs` and `../lib/mirror-sync-verify.cjs`. `loop-host.cjs` resolves lane scripts by path and spawns them with `spawnSync`. |
| Exports | `loop-host.cjs`, `improvement-journal.cjs`, and `mutation-coverage.cjs` expose named module exports. `loop-host.cjs`, `promote-candidate.cjs`, `materialize-benchmark-fixtures.cjs`, `reduce-state.cjs`, and `improvement-journal.cjs` run as CLI entrypoints. |
| Ownership | These scripts serve both lanes. Lane A scripts live in `../agent-improvement/`, Lane B scripts in `../model-benchmark/`. The spawn map keeps bare names in the plan and resolves the lane directory at spawn time. |

Main flow:

```text
╭──────────────────────────────────────────╮
│ caller: node loop-host.cjs --mode=<mode>  │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ resolveMode + planInvocation              │
│ (bare script names, ordered steps)        │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ resolveScriptPath maps name -> lane dir   │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ spawnSync each step (Lane A or Lane B)    │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ exit code (first failing step aborts)     │
╰──────────────────────────────────────────╯
```

---

## 6. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `loop-host.cjs` | CLI | Mode router. `[--mode=agent-improvement] --candidate=<path>` or `--mode=model-benchmark --profile=<path-or-id> --outputs-dir=<path>`. |
| `promote-candidate.cjs` | CLI | Guarded promotion with `--approve` and gate-evidence arguments. |
| `materialize-benchmark-fixtures.cjs` | CLI | `--profile <path> --outputs-dir <path>`. |
| `reduce-state.cjs` | CLI | `node reduce-state.cjs <improvement-runtime-root>`. |
| `improvement-journal.cjs` | CLI + Module | `--emit ... --journal ...` or `--read ...`, plus journal exports. |
| `resolveScriptPath` | Function | Maps a bare script name to its lane directory. |
| `planInvocation` | Function | Builds the ordered, lane-agnostic step plan for a mode. |

---

## 7. VALIDATION

Run from the repository root.

```bash
node .opencode/skills/deep-loop-workflows/improvement/scripts/shared/loop-host.cjs --candidate=.opencode/agents/code.md
```

Expected result: agent-improvement scoring runs and prints a `scored` JSON result.

```bash
npx vitest run --config .opencode/skills/deep-loop-workflows/improvement/scripts/vitest.config.mjs
```

Expected result: the lane and router vitest suites pass, including the loop-host backward-compatibility identity checks.

---

## 8. RELATED

- [`scripts/README.md`](../README.md)
- [`lib/README.md`](../lib/README.md)
- [`agent-improvement/README.md`](../agent-improvement/README.md)
- [`model-benchmark/README.md`](../model-benchmark/README.md)
