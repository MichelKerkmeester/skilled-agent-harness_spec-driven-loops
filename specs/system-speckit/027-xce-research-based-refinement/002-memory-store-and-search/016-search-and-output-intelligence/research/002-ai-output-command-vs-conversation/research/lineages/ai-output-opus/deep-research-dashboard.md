# Deep Research Dashboard — ai-output-opus

| Field | Value |
| --- | --- |
| Lineage | ai-output-opus |
| Executor | cli-claude-code · model=opus |
| Session | fanout-ai-output-opus-1781674914960-6gfnu8 |
| Status | converged (synthesis complete) |
| Iterations | 5 / 5 |
| Stop reason | all_questions_answered + max_iterations |
| Questions answered | 5 / 5 |
| Avg newInfoRatio | 0.60 |
| newInfoRatio trend | 0.90 → 0.70 → 0.62 → 0.50 → 0.28 (monotonic decline) |

## Quality gates
- Source diversity: PASS (verified live evidence + command contracts + cli mechanics + 3 model profiles)
- Focus alignment: PASS (one KQ per iteration)
- No single weak source: PASS (every load-bearing claim cites ≥2 sources or is marked inferred)

## Key question coverage
| KQ | Topic | Iteration | Status |
| --- | --- | --- | --- |
| KQ1 | Command-argument robustness root cause | 1 | answered (F1) |
| KQ2 | --command vs direct vs natural | 2 | answered (F2) |
| KQ3 | Structural arg-presence / startup hazard | 3 | answered (F3) |
| KQ4 | Mandated output fields | 4 | answered (F4) |
| KQ5 | Per-model framework fit | 5 | answered (F5) |

## Confirmed vs inferred
- Confirmed (evidence-cited): F1, F2, F4
- Inferred design (would-confirm noted): F3 (live A/B of patched contract), F5 (control-flow benchmark)
