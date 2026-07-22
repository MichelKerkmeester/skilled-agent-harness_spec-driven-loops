---
title: "004-mimo-prompt-framework/eval: MiMo-V2.5-Pro prompt-framework bake-off harness"
description: "Self-contained harness that dispatches five prompt frameworks against two coding fixtures via OpenCode CLI and scores the results deterministically."
---

# 004-mimo-prompt-framework/eval

---

## 1. OVERVIEW

`eval/` is a self-contained bake-off harness for MiMo-V2.5-Pro (and, in later runs, MiniMax M3) prompt frameworks. For each framework x fixture combination it dispatches a coding task through the OpenCode CLI, extracts the returned JavaScript function, runs a hidden assertion suite in isolated child processes and scores `assertion_pass_rate`, `format_adherence` and output length. It is a leaner port of the framework-variant-plus-scorer pattern used by the MiniMax bake-off in `003-minimax-prompt-framework/`.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `run-mimo-bench.cjs` | Bake-off entrypoint that dispatches every framework x fixture combo to the target model (`--model`, `--frameworks`, `--fixtures`, `--timeout`, `--repeat` flags). Extracts and tests the response and writes scores plus raw output under `runs/` |
| `fixtures.cjs` | Two coding fixtures (`chunk`, `parseRange`), each with a task statement and a hidden `{ name, args, expect }` test suite the harness deep-equals against the extracted function |
| `frameworks.cjs` | Five prompt-framework scaffolds under test (RCAF, RACE, CIDI, TIDD-EC, COSTAR) sharing the same output contract and constraint line, so framework is the sole independent variable |
| `extract.cjs` | Parses a model response into a single JS function, handling both fenced and bare output and both `function name(...)` and arrow-function forms. Also detects whether the response was pure code with no surrounding prose |
| `runtests.cjs` | Runs an extracted function against its fixture's hidden tests, one isolated child process per test case, so a hang or throw in one case cannot mask the others |
| `runner-child.cjs` | Single-test child process. Defines the model's function via the `Function` constructor and deep-equals one test case, printing a JSON result |

## 3. RUN ARTIFACTS

- `results.json`, `results-mimo-*.json` and `results-minimax-*.json` hold per-combo dispatch results from individual bake-off runs, written by `run-mimo-bench.cjs`
- `runs/` and `runs-archive/` hold raw per-combo dispatch output and archived prior runs, organized by model and reasoning-effort cell (`mimo-default`, `mimo-high`, `minimax-high` and more)
- `synthesis.md`, `synthesis-high-reasoning.md` and `synthesis-m3-vs-mimo.md` hold ranked findings for the default bake-off, a reasoning-effort sweep across MiMo and MiniMax and an M3-vs-MiMo rerun

## 4. VALIDATION

```bash
node run-mimo-bench.cjs --model opencode/mimo-v2.5-free --frameworks rcaf --fixtures chunk
```

Real dispatches only, no fabricated scores. Failures record the exit code and stderr. Use the full default invocation (`node run-mimo-bench.cjs`) to run all 5 frameworks against both fixtures on the pro model.

## 5. RELATED

- [`SKILL.md`](../../../SKILL.md)
