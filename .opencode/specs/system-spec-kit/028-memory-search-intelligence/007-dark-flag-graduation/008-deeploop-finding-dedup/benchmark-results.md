---
title: "Benchmark Results: Deep-Loop Finding Dedup"
description: "Benchmarks SPECKIT_FANOUT_NEAR_DUP_DEDUP plus the lag-ceiling and progress-heartbeat gauges against a labeled multi-worker fan-out finding set on the production merge and pool path. The dedup collapses every labeled near-duplicate restatement with pooled precision 1.0 and distinct-finding recall 1.0 across research and review, removes 7 noise records of 17, keeps the strongest severity on review collapse, and is byte-identical when off. The lag-ceiling fires exactly one warning when on and zero when off, the heartbeat fires 43 steady records over a 2s run at 0.05s cadence when on and zero when off. Verdict GRADUATE for all three."
trigger_phrases:
  - "deep loop finding dedup benchmark results"
  - "fanout near dup dedup verdict"
  - "SPECKIT_FANOUT_NEAR_DUP_DEDUP graduate"
  - "lag ceiling progress heartbeat verdict"
importance_tier: "important"
contextType: "general"
---
# Benchmark Results: Deep-Loop Finding Dedup

## Question
The deep-loop fan-out merge ships three default-off capabilities with no measured verdict. Does the near-duplicate collapse `SPECKIT_FANOUT_NEAR_DUP_DEDUP` cut finding noise without losing distinct findings, and do the lag-ceiling and progress-heartbeat gauges add operational value worth their cadence?

## Method
- **Production path, not a copy.** The dedup harness imports `mergeResearchRegistries` and `mergeReviewRegistries` from the production `.opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs`, the exact functions the fan-out CLI re-execs, and drives them off vs on. The gauge harness imports `runCappedPool` from `fanout-pool.cjs` and spawns the real `fanout-run.cjs` CLI for the heartbeat.
- **Labeled fan-out set.** Three research lineages (galadriel, codex, claude) carry 9 keyFindings and three review lineages carry 8 openFindings, all matching the real registry field shape (research id/title/summary, review findingId/severity/status/title plus a body). A ground-truth map labels each finding pair near-duplicate when different workers restate one point under different ids and titles but matching body text, and distinct otherwise.
- **Dedup metrics.** Dedup precision is the share of the on-path collapsed groups that are a true near-duplicate cluster, not a distinct finding merged by mistake. Distinct-finding recall is the share of labeled distinct clusters that survive as their own record on the on-path. Noise reduction is the off-minus-on record count.
- **Gauge assessment.** The lag-ceiling runs a 5-lineage pool, concurrency 1, a 40ms worker, a 60ms ceiling, and counts the one-shot `lag_ceiling_exceeded` warning. The heartbeat runs the CLI with a sleeping stub executor and a 0.05s cadence over a 2s run and counts the `progress` records. Each gauge is re-run at its default off to confirm zero events or records.
- **Numbers source.** `results/dedup-metrics.json` and `results/gauge-metrics.json`, reproducible from the committed harnesses, reading no corpus or database.

## Results: dedup cuts noise with no distinct-finding loss

| Metric | research | review | pooled |
|--------|----------|--------|--------|
| source findings | 9 | 8 | 17 |
| ground-truth distinct clusters | 5 | 5 | 10 |
| merged records off | 9 | 8 | 17 |
| merged records on | 5 | 5 | 10 |
| noise records removed | 4 | 3 | **7** |
| collapsed groups | 3 | 2 | 5 |
| false-positive collapses | 0 | 0 | **0** |
| dedup precision | 1.00 | 1.00 | **1.00** |
| distinct-finding recall | 1.00 | 1.00 | **1.00** |
| off byte-identical | yes | yes | **yes** |
| strongest severity kept on collapse | n/a | yes | **yes** |

The on-path collapses every labeled near-duplicate restatement and nothing else. On the research path the three workers that restated the cache-TTL point under three ids and three titles collapse to one record carrying all three lineage labels, the two-worker retry-backoff and tombstone-scan restatements each collapse to one, and the two genuinely distinct singletons (pool-exhaust, migration-txn) survive untouched. On the review path the three-worker cyclic-traversal restatement and the two-worker SQL-injection restatement collapse, the three distinct singletons (magic-number, counter-race, dead-code) survive, and the cyclic-traversal collapse keeps the P0 severity one worker assigned even though two others rated it P1.

### Per-cluster (research)
| cluster | relation | source ids | merged on | merged off |
|---------|----------|-----------|-----------|------------|
| cache-ttl | NEAR_DUP | R-w1-01, R-w2-01, R-w3-01 | 1 | 3 |
| retry-backoff | NEAR_DUP | R-w1-02, R-w2-02 | 1 | 2 |
| tombstone-scan | NEAR_DUP | R-w1-03, R-w3-03 | 1 | 2 |
| pool-exhaust | DISTINCT | R-w2-04 | 1 | 1 |
| migration-txn | DISTINCT | R-w3-05 | 1 | 1 |

### Per-cluster (review)
| cluster | relation | source ids | strongest severity | merged on | merged off |
|---------|----------|-----------|--------------------|-----------|------------|
| cyclic-traversal | NEAR_DUP | V-w1-01, V-w2-01, V-w3-01 | P0 | 1 | 3 |
| sql-injection | NEAR_DUP | V-w1-03, V-w2-03 | P0 | 1 | 2 |
| magic-number | DISTINCT | V-w1-02 | n/a | 1 | 1 |
| counter-race | DISTINCT | V-w2-04 | n/a | 1 | 1 |
| dead-code | DISTINCT | V-w3-05 | n/a | 1 | 1 |

### Byte-identity when off
The default merge with no flag is byte-identical to the explicit off merge, and the env-driven on merge is byte-identical to the option-driven on merge. With the flag off the surface variants survive as separate records (research 9, review 8), exactly the production default, so no consumer sees the collapse until the flag is flipped.

## Results: both gauges fire usefully when on and are silent when off

| Gauge | default | when on | when off |
|-------|---------|---------|----------|
| lag-ceiling | `lagCeilingMs` 0 | 1 `lag_ceiling_exceeded` warning, oldest_pending_lag_ms 62 vs ceiling 60, severity warning, carries lag gauges | 0 warnings |
| progress-heartbeat | `progressHeartbeatSeconds` 0 | 43 `progress` records over a 2s run at 0.05s cadence (expected ~40), each carries duration_ms and the live lag/pending/failed gauges | 0 records |

The lag-ceiling is a one-shot warning, it fires exactly once when the oldest pending lineage crosses the ceiling and never floods. The heartbeat fires a steady cadence, 43 records over 2 seconds at a 50ms cadence is one record per tick within timer jitter, a useful progress signal that is not a flood. Both gauges are byte-silent at their default of zero.

## Verdict: GRADUATE for all three

- **`SPECKIT_FANOUT_NEAR_DUP_DEDUP`: GRADUATE.** The dedup cuts finding noise with no distinct-finding loss. Pooled dedup precision 1.0 and distinct-finding recall 1.0 across research and review, 7 of 17 records removed as restatement noise, the strongest severity kept on review collapse, and byte-identical when off. It is a strict improvement on the inflated distinct-finding count that feeds the convergence diversity signal, and it changes nothing when off.
- **Lag-ceiling gauge: GRADUATE.** A one-shot warning that fires exactly when the oldest pending lineage crosses the configured ceiling, carries the lag gauges an operator needs, and is byte-silent at the default zero. It adds an operational signal at a cadence of at most one warning per pool run, so it cannot flood.
- **Progress-heartbeat gauge: GRADUATE.** A steady per-lineage progress signal at the configured cadence that carries the live gauges and the elapsed duration, byte-silent at the default zero. The 43-over-2s count proves a steady non-flooding cadence at a 50ms tick, and a production default would run far slower.

The graduation gate is a separate evidence-gated decision driven after the suite verdicts land. This phase recommends graduation and does not flip a default.

## Remaining follow-up (separate from these flags)
The progress-heartbeat earns a graduate verdict on cadence and silence, but the operator-facing default cadence in seconds is a tuning question the benchmark does not settle. A production flip should pick a cadence matched to the typical lineage runtime so the signal is informative without being chatty, which is a configuration choice rather than a defect of the gauge.

## Reproduce
`node scripts/dedup-benchmark.mjs` rebuilds `results/dedup-metrics.json` and `node scripts/gauge-benchmark.mjs` rebuilds `results/gauge-metrics.json`, both exit 0, reading no corpus or database.
