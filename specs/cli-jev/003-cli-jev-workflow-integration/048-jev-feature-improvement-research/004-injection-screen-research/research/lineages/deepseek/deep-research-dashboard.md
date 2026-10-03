# Deep Research Dashboard - Jev Fetched-Text Injection Screen (deepseek lineage)

| Field | Value |
|---|---|
| Lineage | deepseek (`cli-pi`, `deepseek-v4.1-flash`, reasoning max) |
| Session | fanout-deepseek-1790979783605-zk1bnl |
| Stop policy | max-iterations (5) |
| Status | complete |
| Started | 2026-10-02T22:44:59Z |
| Completed | 2026-10-02T23:12:00Z |
| Iterations complete | 5 of 5 |
| Average newInfoRatio | 0.834 |
| Stop reason | maxIterationsReached |

## Iterations

| # | Focus | Status | newInfoRatio | Key outcome |
|---|---|---|---|---|
| 1 | What drove the measured result | complete | 0.92 | 25-row margin, 27/30 planted wins, 9 error rows, Brier split |
| 2 | Accuracy and cost levers | complete | 0.85 | Threshold 0.6 gives A=84; early exit cuts 33% of calls; review band is 4 rows |
| 3 | Measurement trustworthiness | complete | 0.82 | Label provenance documented; corpus untracked; three record gaps |
| 4 | Other `.skilled` uses | complete | 0.80 | Fetch unscreened; Bash/MCP seams exist; candidate surfaces ranked |
| 5 | Default-on integration | complete | 0.78 | Capability fork; tiers 33+7 / 31+5 / 26+0; p50 324 ms; staged plan |

## Key questions

| # | Question | Answered |
|---|---|---|
| Q1 | What drove the measured result? | yes |
| Q2 | Raise accuracy or lower cost? | yes |
| Q3 | Make the measurement more trustworthy? | yes |
| Q4 | Where else would the judgment pay off? | yes |
| Q5 | Default-on integration needs, cost, risk? | yes |

## Outputs

- `research.md` (17-section synthesis plus Divergence Map and Convergence Report)
- `findings-registry.json` (24 key findings, 5 resolved questions, 6 ruled-out directions)
- `iterations/iteration-001.md` to `iteration-005.md`
- `deltas/iter-001.jsonl` to `iter-005.jsonl`
