---
title: "model-benchmark: Lane B benchmark data"
description: "Lane B benchmark data: task fixtures the model under test answers and the profiles that drive a run."
trigger_phrases:
  - "benchmark fixtures"
  - "benchmark profiles"
  - "model benchmark data"
  - "framework bakeoff profile"
version: 1.17.0.4
---

# model-benchmark: Lane B benchmark data

---

## 1. OVERVIEW

`assets/model_benchmark/` holds the Lane B (model-benchmark) data, not code. It has two subdirs: `benchmark-fixtures/` holds the task contracts the model under test answers, and `benchmark-profiles/` holds the profiles that select fixtures, executors, frameworks, and scoring for a run. The Lane B scripts read this data; nothing here executes.

Current state:

- `benchmark-fixtures/` holds two fixture shapes: pattern-scoring evidence contracts (`fixture_*.json`) and 5-dimension code tasks (`t3_*.json`).
- Evidence-contract fixtures declare `requiredHeadings`, `requiredPatterns`, and `forbiddenPatterns` for the default pattern scorer.
- Code-task fixtures (`t3_*`) declare a function signature, a `task` prompt, plus visible `tests` and `hidden_tests` for the opt-in `5dim` scorer.
- `benchmark-profiles/` holds three profiles: `default` (pattern scoring of the deep-improvement agent), `framework-bakeoff` (one model across five prompt frameworks), and `model-vs-model` (three model cells on one framework).
- Profiles reference fixtures by `id` and point `fixtureDir` at `benchmark-fixtures/`.

---

## 2. DIRECTORY TREE

```text
model-benchmark/
+-- benchmark-fixtures/                # Task contracts the model under test answers
|   +-- fixture_baseline.json          # Pattern-scoring evidence contract (baseline)
|   +-- fixture_improved.json          # Pattern-scoring contract with improvement + legal-stop evidence
|   +-- fixture_edge.json              # Pattern-scoring edge contract (blocked-stop, failed gates visible)
|   +-- t3_bugfix_in_context.json      # 5dim code task: lowerBound binary search (id t3-lower-bound)
|   `-- t3_strict_acceptance.json      # 5dim code task: compareVersions SemVer ordering (id t3-compare-versions)
`-- benchmark-profiles/                # Profiles that drive a run
    +-- default.json                   # Pattern scoring of the deep-improvement agent
    +-- framework_bakeoff.json         # One model across five prompt frameworks, 5dim
    `-- model_vs_model.json            # Three model cells on one framework, 5dim
```

---

## 3. KEY FILES

### benchmark-fixtures/

| File | Responsibility |
|---|---|
| `fixture_baseline.json` | Pattern-scoring evidence contract (`id: fixture-baseline`). Declares `requiredHeadings`, `requiredPatterns` (`candidateId`, `baselineScore`, `thresholdDelta`, `recommendation`), and `forbiddenPatterns` (`TBD`, `TODO`, `placeholder`). |
| `fixture_improved.json` | Pattern-scoring contract (`id: fixture-improved`) that adds improvement evidence and legal-stop gate references (`details.gateResults`, `improvementGate`, `benchmark-pass`). |
| `fixture_edge.json` | Pattern-scoring edge contract (`id: fixture-edge`) proving failed gates stay visible: `blockedStop`, `failedGates`, `evidenceGate`, `sessionOutcome`. |
| `t3_bugfix_in_context.json` | 5dim code task (`id: t3-lower-bound`, tier `T3`). Implements `lowerBound(arr, target)` via binary search; carries `tests` and `hidden_tests` plus `visibleSpec` and `scope`. |
| `t3_strict_acceptance.json` | 5dim code task (`id: t3-compare-versions`, tier `T3`). Implements `compareVersions(a, b)` with SemVer precedence; carries `tests` and `hidden_tests` plus `visibleSpec` and `scope`. |

### benchmark-profiles/

| File | Responsibility |
|---|---|
| `default.json` | Pattern-scoring profile (`profileId: default`) targeting `.opencode/agents/deep-improvement.md`. Selects `fixture-baseline`, `fixture-improved`, `fixture-edge`; sets `thresholdDelta` and `benchmark` gate thresholds. |
| `framework_bakeoff.json` | `mode: framework-bakeoff` profile running one `cli-opencode` model across `frameworks` `[rcaf, race, cidi, tidd-ec, costar]` on the `t3_*` fixtures with the weighted `5dim` scorer. |
| `model_vs_model.json` | `mode: model-vs-model` profile running three model cells across `cli-opencode` and `cli-claude-code` on one framework (`rcaf`) over the `t3_*` fixtures, grouped by model with leaderboard and history. |

---

## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Ownership | This directory is data only. Lane B logic lives in the scripts; fixtures and profiles carry no executable code. |
| Imports | Consumed by the Lane B scripts: `run-benchmark.cjs` reads profiles and fixtures; the `5dim` scorer reads `t3-*` fixtures. Profiles reference fixtures by `id` via `fixtureDir` + `fixtures`. |
| Write policy | Read-only inputs. Run outputs go to each profile's `outputsDir` (`{spec_folder}/improvement/benchmark-outputs`), never back into this directory. |
| Schema | Evidence-contract fixtures carry `requiredHeadings` / `requiredPatterns` / `forbiddenPatterns`. Code-task fixtures carry `signature` / `task` / `tests` / `hidden_tests`. Profiles carry `fixtures`, `scoring`, and `benchmark` gate thresholds. |

Main flow:

```text
╭──────────────────────────────────────────╮
│ benchmark-profiles/<profile>.json        │
╰──────────────────────────────────────────╯
                  │  selects fixtures by id
                  ▼
┌──────────────────────────────────────────┐
│ benchmark-fixtures/<fixture>.json        │
│ evidence contract  |  t3-* code task     │
└──────────────────────────────────────────┘
                  │  read by Lane B scripts
                  ▼
┌──────────────────────────────────────────┐
│ run-benchmark.cjs                        │
│ pattern scorer  |  5dim scorer           │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ report + history in profile outputsDir   │
╰──────────────────────────────────────────╯
```

---

## 5. VALIDATION

Run from the repository root.

```bash
node -e 'for (const f of process.argv.slice(1)) JSON.parse(require("fs").readFileSync(f,"utf8"))' \
  .opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/*.json \
  .opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/*.json && echo OK
```

Expected result: every fixture and profile parses as valid JSON and the command prints `OK`.

---

## 6. RELATED

- [`benchmark-profiles README`](./benchmark-profiles/README.md)
- [`model-benchmark scripts README`](../../scripts/model-benchmark/README.md)
- [`deep-improvement SKILL.md`](../../SKILL.md)
- Authoring these inputs: [`sk-doc/create-benchmark`](../../../../sk-doc/create-benchmark/SKILL.md) §11 — the code-task and pattern/reviewer fixture templates, the run-profile template, and [`model_benchmark_fixture_guide.md`](../../../../sk-doc/create-benchmark/references/model_benchmark/model_benchmark_fixture_guide.md). That packet owns the fixture/profile *authoring* templates; this lane keeps `run-benchmark.cjs`, the scorers, and the evaluator/reviewer-verdict contract.
