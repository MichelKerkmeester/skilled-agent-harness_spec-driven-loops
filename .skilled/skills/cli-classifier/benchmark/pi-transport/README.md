# Pi transport

The comparison of Pi's own classifier runtime against the jev CLI, with a replay of recorded calls and its tests.

## 1. OVERVIEW

`score-pi-transport.mjs` compares two ways to run one classifier judgment: Pi's own classifier runtime and the `jev` CLI. It reads the CLI calls recorded for the advisor's choice question, rebuilds each question from the row's cluster and the CLI's own option texts, then asks one call per built question on both sides.

The default run is a zero-call census. It prints what is installed on the machine, makes no classifier call, writes no file and exits 0. Both live arms stay dormant behind their own switch and need the operator's approval before they run.

The script holds and reads no credential. Pi resolves its own credential from its store. The script reads only the exit code of `jev auth status`, never that command's text.

---

## 2. DIRECTORY TREE

```text
pi-transport/
+-- score-pi-transport.mjs    # Comparison CLI
+-- replay-helpers.mjs       # Rotations, option texts and the CLI call seam
+-- tests/
|   `-- score-pi-transport.test.mjs
`-- README.md
```

---

## 3. KEY FILES

| File | Role |
|---|---|
| `score-pi-transport.mjs` | Compares Pi's classifier runtime against the `jev` CLI over the recorded choice calls, at what latency and cost. The default run makes no model call and writes no file. |
| `replay-helpers.mjs` | Holds the option rotations, the option texts, the probability readers, the `jev` auth gate and the bounded CLI spawn and call log the comparison replays the recorded calls with. It makes no call on import. |
| `tests/score-pi-transport.test.mjs` | Runs with `node --test`. The cases inject the classifier runtime as a fake object, with a stub `jev` first on `PATH` where a backend would run, so no test reaches a real backend and no test opens a socket. |

---

## 4. ENTRYPOINTS

```bash
node score-pi-transport.mjs
node score-pi-transport.mjs --pi --out <dir>
node score-pi-transport.mjs --cli --out <dir>
node score-pi-transport.mjs --pi --cli --out <dir>

# Exit codes
# 0 = census printed, or an arm printed its columns and verdict, or an arm stopped after its partial_rows line
# 1 = the baseline file is missing, empty or unparseable, refused with one stop: line
# 2 = bad invocation, refused before any stdout line
```

`--pi` arms the Pi side and `--cli` arms the paired CLI rerun. Each arm requires `--out <dir>` and appends one line per call to `calls.jsonl` under that directory, plus one `model_check` line when the Pi gate passes. An armed run that reaches a verdict also writes `report.json`. `--out` is legal only with an arm, so it exits 2 on its own. An arm without `--out` writes one stderr line and exits 2 before any stdout line. Both switches on one run send each built question to both sides from the one plan. The paired run uses `JEV_PROVIDER` for both sides, defaulting to `official`, and refuses providers without a Pi mapping.

The default run prints the census block in this order:

1. `pi: path=<dir|none> version=<version|none>`
2. one `pi classifier <provider>: known=<n> available=<n>` line per provider, sorted by provider
3. `pi classifier total: known=<n> available=<n>`
4. `jev: path=<path|none> version=<version|none> provider=official`
5. `jev identity: provider=official auth=<ok|absent|failed>`
6. `llama.cpp: server=<path|none> cli=<path|none>`
7. `baseline: path=<repo-relative> rows=<K> choice=<n> rows_with_3_full_maps=<n>`
8. `replay: rows=<K> calls=<3K> key_source=recorded`

On this machine the census printed `pi classifier total: known=12 available=7`, with all seven available classifiers on `openrouter`. It also printed `llama.cpp: server=none cli=none` and `replay: rows=111 calls=333 key_source=recorded`.

---

## 5. ARM GATE

An armed run passes its gate before any classifier call, so a machine that cannot complete the run keeps its census and spends nothing.

The Pi arm resolves the package that `pi` on `PATH` belongs to, then requires the classifier selected by the Jev provider map: `official` uses Pi `typesafe/jev-latest`, and `openrouter` uses Pi `openrouter/typesafe/jev-1.13`. `vercel` and `custom` have no Pi pair. The transport sends those providers to the CLI, and a paired benchmark refuses them. A failed read prints one skip line: `pi arm skipped: package` or `pi arm skipped: model`. The run then exits 0 with no call and no file. A passed gate names its mapped provider and model, such as `pi gate: model=typesafe/jev-latest available=yes typesafe_models=<n>`.

The CLI arm uses the shared jev gate: `jev --version` must report `0.6.2`, then `jev auth status --provider official` must exit 0. A failure prints `jev arm skipped: version` or `jev arm skipped: no credential`. The run then exits 0 with no file.

A run with the Pi arm prints its `column pi:` line, its `column cli:` line, one `metrics:` line and one verdict line, in that order. A `--cli`-only run prints its single `column cli:` line and stops there. A stopped arm prints `pi: partial_rows=<n>` or `cli: partial_rows=<n>` instead and no verdict.

The verdict line is `verdict pi-transport: <outcome> K=<K> M=<M> coverage=<pct> agreement=<pct> median_abs_dp=<v> p95_ms=<pi>/<cli> cost_per_100=<v>`. Its `<outcome>` field carries one of three values: `adopt`, `keep-cli`, `stop (<reason>)`. The keep rule runs three ordered checks over the run's own metrics:

1. coverage at or above 90.0 percent, otherwise `stop (coverage)`
2. agreement at or above 95.0 percent, otherwise `keep-cli (agreement)`
3. Pi's p95 latency at or below 1.5 times the CLI's, otherwise `keep-cli (latency)`

Only when all three bounds hold does the run adopt. Cost never decides the outcome. It prints `none` when Pi reports no usage.

No live arm has run yet, so no `calls.jsonl`, no `report.json` and no verdict line exists for this script.

---

## 6. VALIDATION

Run from the repository root.

```bash
node --test .skilled/skills/cli-classifier/benchmark/pi-transport/tests/score-pi-transport.test.mjs
```

The tests use fixture executables in the OS temp directory and an injected classifier runtime. No test reaches a real backend and no test opens a socket.

---

## 7. RELATED

- [`../README.md`](../README.md): the cli-classifier benchmark folder.
- [`../../feature-catalog/measurements/pi-transport-comparison.md`](../../feature-catalog/measurements/pi-transport-comparison.md): the feature catalog measurement.
- [`../../manual-testing-playbook/measurements/pi-transport-comparison.md`](../../manual-testing-playbook/measurements/pi-transport-comparison.md): the manual testing playbook measurement.
