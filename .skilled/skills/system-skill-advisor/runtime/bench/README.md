---
title: "Skill Advisor Benchmarks: Latency And Calibration"
description: "Benchmark suites and baselines for advisor latency, scorer calibration, watcher behavior and hook signal quality."
trigger_phrases:
  - "skill advisor benchmarks"
  - "scorer calibration bench"
  - "advisor latency bench"
---

# Skill Advisor Benchmarks: Latency And Calibration

---

## 1. OVERVIEW

`skill_advisor/bench/` contains benchmark suites and baseline data for advisor latency, scorer calibration, watcher behavior, hook brief signal quality, plus a recorded code-graph query latency baseline. These files are measurement assets, not production runtime modules.

Current state:

- Tracks latency and calibration benchmarks for the advisor scorer.
- Keeps a recorded code-graph query latency baseline; its benchmark suite is no longer in this folder.
- Stores baseline JSON used for regression comparison.

---

## 2. DIRECTORY TREE

```text
bench/
+-- code-graph-query-latency.baseline.json  # Recorded code graph query latency baseline
+-- hook-brief-signal-noise.bench.ts        # Hook brief signal benchmark
+-- latency-bench.ts                        # Advisor latency benchmark
+-- scorer-bench.ts                         # Scorer benchmark
+-- scorer-calibration-baseline.json        # Scorer calibration baseline
+-- scorer-calibration.bench.ts             # Scorer calibration benchmark
+-- watcher-benchmark.ts                    # Watcher benchmark
`-- README.md
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `latency-bench.ts` | Measures advisor latency paths. |
| `scorer-bench.ts` | Measures scorer performance. |
| `scorer-calibration.bench.ts` | Measures scorer calibration against baseline expectations. |
| `hook-brief-signal-noise.bench.ts` | Measures hook brief signal-to-noise behavior. |
| `watcher-benchmark.ts` | Measures watcher behavior. |

---

## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Benchmarks may import advisor and scorer modules needed for measurement. |
| Exports | Benchmark files export no production behavior. |
| Ownership | Keep performance and calibration measurement here. Put correctness tests in `../tests/`. |

Main flow:

```text
benchmark scenario
  -> advisor or scorer path
  -> timing or calibration metric
  -> baseline comparison or report
```

---

## 5. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `latency-bench.ts` | Benchmark | Advisor latency measurement. |
| `scorer-calibration.bench.ts` | Benchmark | Scorer calibration measurement. |
| `watcher-benchmark.ts` | Benchmark | Watcher measurement. |

---

## 6. VALIDATION

Run from the repository root.

```bash
python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/system-skill-advisor/runtime/bench/README.md
```

Expected result: exit code `0`.

---

## 7. RELATED

- [`../README.md`](../README.md)
- [`../tests/README.md`](../tests/README.md)
- [`../lib/scorer/README.md`](../lib/scorer/README.md)
