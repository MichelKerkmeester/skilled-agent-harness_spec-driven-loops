# Convergence Report — ds-a (fanout lineage)

## Stop Information
- Stop reason: **maxIterationsReached** (config.stopPolicy = max-iterations)
- Total iterations completed: 5
- Questions answered: 4 / 4 (KQ1, KQ2, KQ3, KQ4)

## newInfoRatio Trend
| Run | newInfoRatio | Status |
|-----|--------------|--------|
| 1 | 1.00 | complete |
| 2 | 0.75 | complete |
| 3 | 0.90 | complete |
| 4 | 0.85 | complete |
| 5 | 0.55 | complete |

- Rolling average (last 3): 0.77
- Average (all): 0.81
- Trend: descending (1.00 → 0.55)

## Interpretation
Per the fan-out contract, convergence below threshold before maxIterations was treated as **telemetry only**; instead of early synthesis, the loop broadened angles (cluster → migration → timeline → verdict). The 4 key questions were answered by iteration 4; iteration 5 consolidated the feasibility verdict. The descending ratio confirms diminishing novelty in the final pass.

## Quality Gates
- Source diversity: PASS (git log, graph-metadata JSON, validate.sh source, vitest fixture, spec.md maps, on-disk census, descriptions.json index, runtime code).
- Focus alignment: PASS (each iteration mapped to a key question).
- No single weak source: PASS (every load-bearing claim cross-checked against at least two independent surfaces, e.g., hash recompute vs declared, git-first-add vs graph created_at).

## Artifacts
- `deep-research-config.json`
- `deep-research-state.jsonl` (6 records: 1 config + 5 iterations + synthesis event)
- `deep-research-strategy.md`
- `deep-research-dashboard.md`
- `findings-registry.json`
- `research.md` (canonical synthesis)
- `timeline.md` (reference design)
- `resource-map.md`
- `iterations/iteration-001..005.md`
