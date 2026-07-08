---
title: "model-benchmark: Lane B benchmark scripts"
description: "Lane B scripts that dispatch a model under test and score its fixture outputs by pattern or 5-dimension scoring."
trigger_phrases:
  - "model benchmark scripts"
  - "dispatch-model"
  - "run-benchmark"
---

# model-benchmark: Lane B benchmark scripts

---

## 1. OVERVIEW

`model-benchmark/` owns the Lane B (model-benchmark) executables: dispatch a model or prompt framework against benchmark fixtures, then score the materialized outputs. It pairs a CLI dispatcher with a fixture scorer and delegates 5-dimension scoring to the `scorer/` subtree.

Current state:

- `dispatch-model.cjs` routes a prompt to one of three executors and returns the model output as a JSON envelope plus raw stdout and stderr.
- `run-benchmark.cjs` reads a benchmark profile, scores each fixture output, and writes `report.json` plus a label-stamped history snapshot.
- Two scoring methods exist: `pattern` (default heading/pattern matcher) and `5dim` (opt-in, routed through `scorer/`).
- `loop-host.cjs` in `../shared/` is the router. It resolves the bare names `run-benchmark.cjs` and `dispatch-model.cjs` to this folder at spawn time.

---

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                        model-benchmark/                           │
╰──────────────────────────────────────────────────────────────────╯

┌──────────────────┐      ┌─────────────────────┐      ┌──────────────────┐
│ loop-host.cjs    │ ───▶ │ dispatch-model.cjs  │ ───▶ │ executor CLI     │
│ (../shared)      │      │ executor router     │      │ opencode/claude/ │
│ router           │      │ read-only default   │      │ opencode             │
└────────┬─────────┘      └─────────────────────┘      └──────────────────┘
         │
         ▼
┌──────────────────┐      ┌─────────────────────┐
│ run-benchmark.cjs│ ───▶ │ scorer/             │  (only on --scorer=5dim)
│ pattern | 5dim   │      │ score-model-variant │
└────────┬─────────┘      └─────────────────────┘
         │
         ▼
┌──────────────────┐
│ report.json      │
│ report-history/  │
│ state-log jsonl  │
└──────────────────┘

Dependency direction: loop-host ───▶ dispatch-model / run-benchmark ───▶ scorer/
```

---

## 3. DIRECTORY TREE

```text
model-benchmark/
+-- dispatch-model.cjs    # Executor router: prompt-file in, model output JSON out
+-- run-benchmark.cjs     # Fixture/integration scorer, pattern (default) or 5dim
+-- sweep-benchmark.cjs   # Config-driven matrix sweep runner for models/frameworks/variants
+-- lib/                  # Sweep/profile helpers and reporting/scoring utilities
`-- scorer/               # Ported 5-dimension scorer engine (lazy-required by 5dim)
```

---

## 4. KEY FILES

| File | Responsibility |
|---|---|
| `dispatch-model.cjs` | Routes a prompt file to `cli-opencode` or `cli-claude-code`. Read-only by default. Handles rate-limit backoff and writes a run-scoped pause sentinel. |
| `run-benchmark.cjs` | Loads a profile, scores fixture outputs, writes `report.json` plus an immutable history snapshot, and appends a `benchmark_run` row to the state log. Sanitizes `fixture.id` and bounds authored regex patterns. |
| `scorer/` | The 5-dimension scoring engine. `run-benchmark.cjs` lazy-requires `scorer/score-model-variant.cjs` only on `--scorer=5dim`, so the default path never loads the subtree. |

---

## 5. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | `run-benchmark.cjs` lazy-requires `./scorer/score-model-variant.cjs` only on the `5dim` path. `dispatch-model.cjs` reads config from `assets/agent_improvement/improvement_config.json` under `modelBenchmarkConfig`. |
| Exports | `dispatch-model.cjs` exports `dispatch`, `dispatchReal`, `dispatchMock`, `buildSpawnSpec`, `KNOWN_EXECUTORS`, and pause-sentinel helpers. `run-benchmark.cjs` runs as a CLI and its `main()` is not exported. |
| Ownership | Lane B dispatch and fixture scoring live here. The 5-dimension engine lives in `scorer/`. Mode routing and lane-path resolution live in `../shared/loop-host.cjs`. |
| Write policy | Dispatch is read-only by default. Write-capable executor runs require `DEEP_AGENT_DISPATCH_WRITE=1`. |

Main flow:

```text
╭──────────────────────────────────────────╮
│ prompt file + profile                    │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ dispatch-model.cjs builds spawn spec     │
│ per executor and runs read-only          │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ model output materialized per fixture id │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ run-benchmark.cjs scores outputs         │
│ pattern matcher or scorer/ (5dim)        │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ report.json + history snapshot + jsonl   │
╰──────────────────────────────────────────╯
```

---

## 6. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `dispatch({ prompt_file, executor, model, ... })` | Function | Dispatches a prompt to an executor and returns `{ ok, exit_code, stdout, stderr, attempts, paused? }`. |
| `node dispatch-model.cjs [--executor=...] [--model=...] [--mock] <prompt-file>` | CLI | Runs the dispatcher and prints a JSON envelope plus raw stdout and stderr. |
| `node run-benchmark.cjs --profile <path-or-id> --outputs-dir <path> [--scorer pattern\|5dim] [--grader noop\|mock\|llm]` | CLI | Scores fixture outputs and writes the benchmark report. |

---

## 7. VALIDATION

Run from the repository root.

```bash
node .opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs --mock /dev/null
npx vitest run .opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/run-benchmark-hardening.vitest.ts
npx vitest run .opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/optin-scorer.vitest.ts
```

Expected result: the dispatcher prints a mock JSON envelope and the vitest suites pass.

---

## 8. RELATED

- [`scripts README`](../README.md)
- [`scorer README`](./scorer/README.md)
- [`deep-improvement SKILL.md`](../../SKILL.md)
