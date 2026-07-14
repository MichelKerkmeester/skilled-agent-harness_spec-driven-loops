# Iteration 8: Reporting (synthesis, leaderboard, confidence, regression)

- **Executor**: cli-codex gpt-5.5, reasoning=high, service_tier=fast, sandbox=read-only
- **Dispatch exit code**: 0
- **Tokens used**: 89,585

---

## Codex findings (verbatim)

Read-only pass. No files changed.

**1. Current 126/004 Report**
The current 126/004 human report has two layers:

`eval/synthesis.md` contains metadata/scoring, final ranking, per-fixture detail, winner, key findings, scoring diagnostics, caveats, reproducibility, and integration recommendation. Evidence: scoring criteria are stated at [synthesis.md:6](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/101-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/synthesis.md:6), final ranking at [synthesis.md:10](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/101-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/synthesis.md:10), per-fixture detail at [synthesis.md:22](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/101-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/synthesis.md:22), winner at [synthesis.md:32](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/101-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/synthesis.md:32), caveats at [synthesis.md:55](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/101-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/synthesis.md:55), reproducibility at [synthesis.md:63](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/101-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/synthesis.md:63).

`eval/synthesis-high-reasoning.md` adds the 2x2 model × reasoning view, dispatch outcomes, per-cell rankings, headline analysis, artifacts, and reproducibility. Evidence: dispatch outcomes [synthesis-high-reasoning.md:13](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/101-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/synthesis-high-reasoning.md:13), 2x2 winners [synthesis-high-reasoning.md:24](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/101-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/synthesis-high-reasoning.md:24), per-cell rankings [synthesis-high-reasoning.md:38](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/101-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/synthesis-high-reasoning.md:38), caveats [synthesis-high-reasoning.md:111](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/101-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/synthesis-high-reasoning.md:111).

Ranking criteria: human synthesis uses `0.70 pass + 0.20 format + 0.10 length_efficiency`; see [synthesis.md:12](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/101-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/synthesis.md:12) and [synthesis-high-reasoning.md:9](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/101-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/synthesis-high-reasoning.md:9). The harness console leaderboard is cruder: group by framework, then rank by mean pass and words. The key quote is `sort((a, b) => b.mp - a.mp || a.mw - b.mw)` at [run-mimo-bench.cjs:266](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/101-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/run-mimo-bench.cjs:266).

Saturation caveat: the report does surface it, but mostly in prose. It says correctness saturates and ranking is format/length-driven at [synthesis-high-reasoning.md:86](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/101-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/synthesis-high-reasoning.md:86), and explicitly says close composite gaps are single-sample noise at [synthesis-high-reasoning.md:113](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/101-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/synthesis-high-reasoning.md:113). The mis-read risk is that machine output does not encode that verdict.

Machine result: `results-mimo-high.json` top-level fields are `generated_at`, `model`, `variant`, timeout, repeat, succeeded/failed/combos, and `results`; see [results-mimo-high.json:1](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/101-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/results-mimo-high.json:1). Per-cell rows include tag/framework/fixture/repeat/dispatch status, extraction, pass rate, assertion counts, format, output chars/words, ms, per-test results, and raw path; see [results-mimo-high.json:11](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/101-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/results-mimo-high.json:11). The harness writes the same fields at [run-mimo-bench.cjs:193](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/101-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/run-mimo-bench.cjs:193). Current machine output has latency `ms`, chars, and words, but no token or cost fields in the emitted success row [run-mimo-bench.cjs:203](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/101-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/run-mimo-bench.cjs:203).

**2. Lane B + 120/003**
Lane B `run-benchmark.cjs` emits a stable `report.json` with `status`, `scoringMethod`, `grader`, `profileId`, `family`, `target`, `label`, `provenance`, aggregate score, totals, recommendation, thresholds, rows/fixtures, and failure modes; see [run-benchmark.cjs:462](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:462). Provenance currently stores profile path/version plus fixture dir/files [run-benchmark.cjs:456](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:456). It also writes immutable history snapshots under `report-history` and appends state-log rows pointing at the snapshot [run-benchmark.cjs:507](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:507).

`120/003` synthesis ranks variants by best score, avg score, and sample count [synthesize.cjs:22](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/098-cli-opencode-minimax-optimization/003-minimax-prompt-framework-benchmark/eval-loop/scripts/synthesize.cjs:22), computes interaction diagnostics [synthesize.cjs:42](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/098-cli-opencode-minimax-optimization/003-minimax-prompt-framework-benchmark/eval-loop/scripts/synthesize.cjs:42), fixture coverage [synthesize.cjs:65](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/098-cli-opencode-minimax-optimization/003-minimax-prompt-framework-benchmark/eval-loop/scripts/synthesize.cjs:65), and dispatch/cache counts [synthesize.cjs:76](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/098-cli-opencode-minimax-optimization/003-minimax-prompt-framework-benchmark/eval-loop/scripts/synthesize.cjs:76). The generated report has final ranking, winner, key findings, interaction diagnostics, caveats, and integration recommendation; see [eval-loop/synthesis.md:9](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/098-cli-opencode-minimax-optimization/003-minimax-prompt-framework-benchmark/eval-loop/synthesis.md:9).

**3. Reusable Report Model**
Machine layer:

- `results.json`: append-only raw rows. Required fields: `run_id`, `cell_id`, `model`, `executor`, `variant`, `framework`, `fixture`, `sample`, `seed`, `dispatch_ok`, `exit`, `raw`, `duration_ms`, `tokens`, `cost`, `scores.{dimension}`, `composite`, `pass`, `gate_failures`, `retry`.
- `aggregate.json`: derived rows by configured group. Fields: `group`, `n`, `metrics.{dimension}.{mean,median,p50,p90,ci}`, `composite`, `saturation`, `top_pair_delta`, `trustworthiness:{verdict,reason,confidence}`, `winner`, `ties`.

Human layer:

- `synthesis.md`: reproducible summary generated from `aggregate.json`, with leaderboard tables, per-dimension breakdown, confidence/trust verdict, saturation report, regression-over-time block, and reproducibility block.
- The trust verdict must be above the winner table, because current prose already knows RCAF/COSTAR is noise [synthesis-high-reasoning.md:33](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/101-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/synthesis-high-reasoning.md:33), but the machine layer does not.

**4. Multi-Axis Ranking**
Use config to express both group and rank axes. This extends the existing iter7 shape, where `reporting.groupBy` and `leaderboard.metric` already exist [iteration-007.md:128](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/102-reusable-model-benchmark-framework/research/iterations/iteration-007.md:128).

```json
{
  "reporting": {
    "groupBy": ["model", "executor", "variant", "framework"],
    "leaderboards": [
      { "id": "framework", "groupBy": ["framework"], "rankBy": [{ "metric": "composite.mean", "direction": "desc" }] },
      { "id": "model", "groupBy": ["model"], "rankBy": [{ "metric": "scores.D1.mean", "direction": "desc" }] },
      { "id": "efficiency", "groupBy": ["model", "framework"], "rankBy": [{ "metric": "tokens.median", "direction": "asc" }] }
    ]
  }
}
```

Dimensions should remain first-class, matching iter7’s D1-D5 scoring vector [iteration-007.md:112](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/102-reusable-model-benchmark-framework/research/iterations/iteration-007.md:112). Same raw data, different leaderboard projections.

**5. Confidence**
Direct fix: every report headline should say `WINNER`, `TIE`, or `INCONCLUSIVE`, with reason. Iter4 already defines the gate: declare `WINNER` only when sample count, margin, and paired CI clear thresholds; otherwise report `TIE` or `INCONCLUSIVE` [iteration-004.md:30](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/102-reusable-model-benchmark-framework/research/iterations/iteration-004.md:30). For 126/004, that would prevent the nominal RCAF high-reasoning rank from being read as a clean COSTAR loss.

**6. Regression Over Time**
Reuse Lane B’s pattern: stable latest `report.json`, immutable `report-history/report-<label>-<timestamp>.json`, and a JSONL state log that records `reportSnapshot`, totals, rows, recommendation, and provenance [run-benchmark.cjs:500](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:500). Add `run_id`, `timestamp`, `git_sha`, `profile_hash`, `fixture_hashes`, `model_versions`, `executor_versions`, and `schema_version`. That gives both skill-change regression and model-drift tracking.

**7. Reproducibility Metadata**
Minimum reproducibility block: profile snapshot/hash, model ids, provider/executor ids, executor versions, CLI command, variant/reasoning, seed, sample N, fixture hashes, scorer versions, grader mode/model, timeout/retry policy, git sha, raw prompt/output paths, timestamp. Current 126/004 captures model/variant/timeout/repeat in results [results-mimo-high.json:1](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/101-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/results-mimo-high.json:1), raw prompt/output path in raw run files via harness [run-mimo-bench.cjs:141](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/101-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/run-mimo-bench.cjs:141), and Lane B captures profile/fixture provenance [run-benchmark.cjs:456](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:456). UNKNOWN from the read files: exact model version introspection and token/cost accounting are not currently emitted.

**Proposals**
1. Add a reusable `results.json` raw-row schema and `aggregate.json` derived schema; keep legacy `report.json` intact for backward compatibility.
2. Promote `reporting.groupBy` into `leaderboards[]` with per-leaderboard `groupBy`, `rankBy`, tie policy, and visible dimension/composite selection.
3. Put `trustworthiness.verdict` at the top of both machine and human reports, before any winner table.
4. Add saturation detection per fixture and per dimension, so saturated correctness becomes a gate and cannot drive winner language.
5. Reuse Lane B `report-history` snapshots and state-log provenance, but add `git_sha`, `profile_hash`, fixture hashes, model/executor versions, seed, and schema version.
6. Add nullable `tokens` and `cost` fields now, even before providers expose them, so efficiency ranking does not require schema churn later.

```json
[
  {
    "priority": "P0",
    "target": "reporting.trustworthiness",
    "change": "Emit WINNER/TIE/INCONCLUSIVE with reason and confidence before any leaderboard winner text.",
    "confidence": 0.93
  },
  {
    "priority": "P0",
    "target": "aggregate.json",
    "change": "Generate persisted aggregate rows with group, n, mean, median, CI, saturation, top-pair delta, and trustworthiness verdict.",
    "confidence": 0.89
  },
  {
    "priority": "P1",
    "target": "reporting.leaderboards",
    "change": "Extend reporting.groupBy into multiple leaderboards with explicit groupBy and rankBy arrays for model-vs-model, framework-vs-framework, and per-dimension ranking.",
    "confidence": 0.86
  },
  {
    "priority": "P1",
    "target": "report-history",
    "change": "Reuse Lane B stable report plus immutable report-history snapshot pattern, adding git_sha, profile_hash, fixture_hashes, model_versions, executor_versions, seed, and schema_version.",
    "confidence": 0.88
  },
  {
    "priority": "P1",
    "target": "synthesis.md",
    "change": "Generate human synthesis from aggregate.json with per-dimension breakdown, saturation table, trust verdict, leaderboard tables, regression block, and reproducibility block.",
    "confidence": 0.84
  },
  {
    "priority": "P2",
    "target": "results.json",
    "change": "Add nullable tokens and cost fields to raw rows; current evidence shows ms/output words exist but token and cost fields are UNKNOWN/not emitted.",
    "confidence": 0.78
  }
]
```
