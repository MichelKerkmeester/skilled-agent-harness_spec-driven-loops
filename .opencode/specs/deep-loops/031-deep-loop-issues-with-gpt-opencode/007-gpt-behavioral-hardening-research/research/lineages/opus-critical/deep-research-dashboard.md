# Deep Research Dashboard — opus-critical lineage

> Auto-generated from deep-research-state.jsonl. Do not edit manually.

## Iteration Table
| run | focus | newInfoRatio | findings | status |
|-----|-------|--------------|----------|--------|
| 1 | opus-critical-lens-and-phase-005-rederivation | 0.80 | 3 | insight |
| 2 | ai-council-validator-OVERTURN | 0.92 | 2 | insight |
| 3 | ai-council-naming-false-negative | 0.85 | 3 | insight |
| 4 | kq4-ndp-confirm-and-attribution | 0.60 | 3 | insight |
| 5 | kq4-minimal-fix | 0.55 | 3 | insight |
| 6 | kq5-plugin-fail-closed-resolved | 0.70 | 3 | insight |
| 7 | mode-d-confirm-and-redundancy | 0.45 | 3 | insight |
| 8 | kq9-fix5-coverage-argument | 0.40 | 3 | insight |
| 9 | self-adversarial-check | 0.30 | 0 | insight |
| 10 | final-consolidation | 0.15 | 8 | complete |

## Question Status
10/10 answered (KQ-OPUS-1 through KQ-OPUS-10 all resolved)

## Convergence
Stop reason: `maxIterationsReached` (stop policy = max-iterations; 10 of 10 completed). Convergence signals were treated as telemetry only throughout, per charter §9.4. No stuck recovery, no blocked stops, no salvaged iterations.

## Headline
This lineage OVERTURNS `sonnet-critical` §5's "ai-council route-proof is a guaranteed FAIL / benchmark leg uninterpretable" by reading the record emitter (`orchestrate-topic.cjs:310-313`) the prior critical round assumed: `record.mode='council'` equals the validator expectation, so the validator PASSES. The real defect is a naming false-negative (route-proof green on a `target_agent` that names no real agent).
